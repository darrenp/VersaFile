class Document < ActiveRecord::Base
  belongs_to :zone
  belongs_to :library
  belongs_to  :document_type
  has_many :references, :dependent => :destroy
  has_many :folders, :through => :references
  has_many  :versions, :dependent => :destroy, :autosave => true
  has_one   :current_version,
            :class_name => 'Version',
            :conditions => {:is_current_version => true}
  has_one :acl, :as => :securable, :dependent => :destroy

  before_create :create_acl
  before_save :on_before_save

  JOIN_STMT = 'INNER JOIN versions ON versions.document_id = documents.id AND versions.is_current_version=1 INNER JOIN document_types on documents.document_type_id=document_types.id'

  REFERENCE_COLUMNS = {
    'documents.id' => 'documents.id AS \'$ref\'',
    'documents.state' => 'documents.state',
    'documents.checked_out_by' => 'documents.checked_out_by',
    'documents.name' => 'documents.name',
    'documents.created_at' => 'documents.created_at',
    'documents.created_by' => 'documents.created_by',
    'documents.updated_at' => 'documents.updated_at',
    'documents.updated_by' => 'documents.updated_by',
    'documents.folder_id' => 'documents.folder_id',
    'document_types.id' => 'document_types.id AS\'document_type_id\'',
    'document_types.name' => 'document_types.name AS \'document_type_name\'',
    'versions.binary_content_type' => 'versions.binary_content_type'
  }

  DOCUMENT_COLUMNS = [
    'documents.*',
    'document_types.id AS\'document_type_id\'',
    'document_types.name AS \'document_type_name\'',
    'versions.binary_content_type',
    'versions.binary_file_name',
    'versions.binary_file_size',
    'versions.major_version_number',
    'versions.minor_version_number'
  ]


  #return all documents not (soft) deleted
  scope :active, lambda {
     where("state & #{Bfree::DocumentStates.Deleted} = 0")
  }

  #returns a light version of the record that is a "reference" to the
  #document and contains only columns specified in the view
  #limit row count to the "range" if provided
  scope :browse, lambda{ |view, sort, range|

    columns = REFERENCE_COLUMNS.clone

    unless view.nil?
      view.cell_definitions.each do |cell|
        column = "#{cell.table_name}.#{cell.column_name}"
        if column == 'versions.version_number'
          columns['versions.major_version_number'] = 'versions.major_version_number'
          columns['versions.minor_version_number'] = 'versions.minor_version_number'
        else
          unless columns.include?(column)
            columns[column] = column
          end
        end

      end
    end

    unless range['row_count'] < 0
      select(columns.values.join(','))
      .joins(JOIN_STMT)
      .order(sort)
      .limit(range['row_count'])
      .offset(range['offset'])
    else
       select(columns.values.join(','))
      .joins(JOIN_STMT)
      .order(sort)
    end

  }

  #returns all (soft) deleted documents in the system
  scope :deleted, lambda {
    where("state & #{Bfree::DocumentStates.Deleted} > 0")
  }

  scope :not_deleted, lambda {
      where("state & #{Bfree::DocumentStates.Deleted} = 0")
  }

  scope :full, lambda{
    select(DOCUMENT_COLUMNS.join(','))
    .joins(JOIN_STMT)
  }

  #returns (non-deleted) documents in a specific folder OR
  #in root folder if 'folder' param is null
  scope :in_folder, lambda { |folder|
    folder_id = folder.nil? ? 0 : folder.id
    where("folder_id = #{folder_id} AND (state & #{Bfree::DocumentStates.Deleted} = 0)")
  }

  scope :by_document_type, lambda { |document_type|
    select(:name)
  }

  #returns only documents that the user has at least "view" privileges
  #- adds the active permissions to the results
  scope :viewable, lambda { |user, group|
    select('viewable.active_permissions')
    .joins("INNER JOIN ( #{Acl.viewable('Document', user, group).to_sql} ) AS viewable ON viewable.id = documents.id")
  }

  scope :simple, lambda{ |text|
    where("MATCH (body, metadata, custom_metadata) AGAINST ('#{text}' IN BOOLEAN MODE)")
  }

  scope :advanced, lambda{ |library, query|
    where(Search.evaluate(library, query))
  }

  scope :allowed, lambda { |user, group|
      select('documents.*, viewable.active_permissions')
    .joins("INNER JOIN ( #{Acl.viewable('Document', user, group).to_sql} ) AS viewable ON viewable.id = documents.id")
  }

  def cancel_checkout(user)

     raise "Document is not checked out" unless self.state == Bfree::DocumentStates.CheckedOut
     raise "User '#{self.checked_out_by}' has the document checked out" unless self.checked_out_by == user.name

     self.update_attributes(
        :state => Bfree::DocumentStates.CheckedIn,
        :checked_out_by => nil
     )

  end

  def checkin(user, attributes, file)

    raise "Document is not checked out" unless ((self.state & Bfree::DocumentStates.CheckedOut) == Bfree::DocumentStates.CheckedOut)
    raise "User '#{self.checked_out_by}' has the document checked out" unless self.checked_out_by == user.name

    self.update_attributes(
      :name => attributes[:name],
      :description => attributes[:description],
      :state => Bfree::DocumentStates.CheckedIn,
      :checked_out_by => nil,
      :updated_by => user.name
    )

    self.update_metadata(attributes)

    #Create new version
    version = Version.supersede(self.library, self.current_version, file, false)
    version.binary_content_type = attributes[:binary_content_type] if version.binary_content_type.blank?
    self.versions.push(version)

    unless version.save
      raise version.errors
    end

  end

  def checkout(user)

    raise "Document has already been checked out to user '#{self.checked_out_by}'" if self.state == Bfree::DocumentStates.CheckedOut

     self.update_attributes(
        :state => Bfree::DocumentStates.CheckedOut,
        :checked_out_by => user.name
     )

  end

  def inherit_acl()

    self.acl = (self.folder.nil?) ?
                  self.library.acl.deep_clone :
                  self.folder.acl.deep_clone
    self.acl.inherits = true

    return self.acl
  end

  def deleted?
    return (self.state & Bfree::DocumentStates.Deleted == Bfree::DocumentStates.Deleted)
  end

  def soft_delete(user)

    self.update_attributes(
      :state => self.state | Bfree::DocumentStates.Deleted,
      :updated_by => user.name
    )

  end

  def soft_restore(user)

    self.update_attributes(
        :state => self.state & ~Bfree::DocumentStates.Deleted,
        :updated_by => user.name
    )

  end

  def extract_content()

    my_body = %x{java -jar tika-app-1.0.jar -t #{self.current_version.binary.path} }
    my_metadata = %x{java -jar tika-app-1.0.jar -m #{self.current_version.binary.path} }
    #my_custom_metadata = self.generate_custom_metadata()

    self.update_attributes(
        :body => my_body,
        :metadata => my_metadata
        #:custom_metadata => my_custom_metadata
    )
    self.state = self.state | Bfree::DocumentStates.Indexed
    self.save

  end

  def update_properties(user, attributes)
    self.update_attributes(
      :name => attributes[:name],
      :description => attributes[:description],
      :updated_by => user.name,
      :document_type_id=>attributes[:document_type_id]
    )

    self.update_metadata(attributes)
  end

  def update_metadata(properties)

    #for each of the properties...
    properties.each do |property|
      prp_name = property[0]
      prp_value = property[1]

      #does the document have this attribute?
      if self.has_attribute?(prp_name)

          #Does the property definition exist...if it doesn't or it is a system property, ignore
          prp_def = self.library.property_definitions.find(:first, :conditions => ["table_name = ? AND column_name =?", 'documents', prp_name])
          next if prp_def.nil? || prp_def.is_system?

          #set property value only if the value has changed
          curr_value = self.read_attribute(prp_name)
          self[prp_name] = prp_value unless curr_value == prp_value

      end

    end

    #Populate custom_metadata field...used for "simple" search
    self.custom_metadata = self.generate_custom_metadata()

  end

  def dojo_url
    return "/zones/#{self.library.zone.subdomain}/libraries/#{self.library.id}/documents/#{self.id}"
  end

  def generate_custom_metadata

    text = []

    text << self.name
    text << self.description unless self.description.blank?

    #Create custom property columns
    #Strings
    Bfree::ColumnMaximum.StringMax.times do |n|
      column_name = "prp_str%03d" % (n + 1)
      value = self[column_name]
      text << value unless value.blank?
    end

    #Text
    Bfree::ColumnMaximum.TextMax.times do |n|
      column_name = "prp_txt%03d" % (n + 1)
      value = self[column_name]
      text << value unless value.blank?
    end

    return text.join(' ')
  end

  def package(root_folder)

    document_dir = File.join(root_folder, self.name)
    document_dir = Pathname.new(document_dir).cleanpath()
    FileUtils.mkdir_p document_dir

     exportable = {
        :name => self.name,
        :document_type => self.document_type.name,
        :created_at => self.created_at,
        :created_by => self.created_by,
        :updated_at => self.updated_at,
        :updated_by => self.updated_by,
        :properties => [],
        :acl => self.acl.package()
    }

    document_type.property_mappings.each do |property_mapping|
      property_definition = property_mapping.property_definition
      next if property_definition.is_system

      if property_definition.table_name == 'documents'
        exportable[:properties] << {
            :name => property_definition.name,
            :value => self[property_definition.column_name]
        }
      end
    end


    _json = ActiveSupport::JSON.encode(exportable)

    json_file = File.join(document_dir, "_document.json")
    File.open(json_file, 'w'){ |json_file| json_file.write _json }

    count = 0
    version_dir = File.join(document_dir, 'versions')
    self.versions.each do |version|
      count += 1
      version.package(version_dir)
    end

    return count
  end

  def self.unpackage(library, folder, root_dir)

    import_json = ActiveSupport::JSON.decode(IO.read(File.join(root_dir, '_document.json')))
    document_type = library.document_types.find_by_name(import_json['document_type'])

    document = library.zone.documents.new(
      :library => library,
      :document_type => document_type,
      :folder_id => (folder.nil?) ? 0 : folder.id,
      :name => import_json['name']
    )

    merge(document, import_json)

    count = 0
    versions_dir = File.join(root_dir, 'versions')
    Dir.foreach(versions_dir) do |entry|
      next if ['.', '..', '.svn', '.git'].include?(entry)
      Version.unpackage(document, File.join(versions_dir, entry))
      count += 1
    end

    return count
  end

  def create_acl

=begin
    self.acl = (self.folder.nil?) ?
                  self.library.acl.deep_clone :
                  self.folder.acl.deep_clone
    self.acl.inherits = true
=end
  end

protected
  def on_before_save
    self.custom_metadata = self.generate_custom_metadata()
  end

private



  def self.merge(document, data)

    begin

      document.created_by = data['created_by'] unless data['created_by'].nil?
      document.created_at = data['created_at'] unless data['created_at'].nil?
      document.updated_by = data['updated_by'] unless data['updated_by'].nil?
      document.updated_at = data['updated_at'] unless data['updated_at'].nil?

      unless data['properties'].nil?
        data['properties'].each do |property|
          property_definition = document.library.property_definitions.find_by_name(property['name'])
          document[property_definition.column_name] = property['value']
        end
      end

      Document.record_timestamps = false
      unless document.save

      end

      document.create_acl() if document.acl.nil?
      Acl.unpackage(document.acl, data['acl']) unless data['acl'].nil?

    ensure
      Document.record_timestamps = true
    end

  end

end
