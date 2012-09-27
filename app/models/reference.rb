class Reference < ActiveRecord::Base
  belongs_to :library
  belongs_to :folder
  belongs_to :document, :include => :current_version
  has_one :acl, :as => :securable, :dependent => :destroy, :autosave => true
  before_create :on_before_create

  REFERENCE_TERSE = {
      'references.id' => 'references.id',
      'references.reference_type' => 'references.reference_type',
      'references.folder_id' => 'references.folder_id',
      'documents.id' => 'documents.id AS \'document_id\'',
      'documents.state' => 'documents.state',
      'documents.checked_out_by' => 'documents.checked_out_by',
      'document_types.id' => 'document_types.id AS \'document_type_id\''
  }

  REFERENCE_VERBOSE = {
    'references.id' => 'references.id',
    'references.folder_id' => 'references.folder_id',
    'references.library_id' => 'references.library_id',
    'documents.id' => 'documents.id AS \'document_id\'',
    'documents.state' => 'documents.state',
    'documents.name' => 'documents.name',
    'documents.checked_out_by' => 'documents.checked_out_by',
    'documents.description' => 'documents.description',
    'documents.created_at' => 'documents.created_at',
    'documents.created_by' => 'documents.created_by',
    'documents.updated_at' => 'documents.updated_at',
    'documents.updated_by' => 'documents.updated_by',
    'document_types.id' => 'document_types.id AS \'document_type_id\'',
    'document_types.name' => 'document_types.name AS \'document_type_name\'',
    'versions.binary_content_type' => 'versions.binary_content_type',
    'versions.binary_file_name' => 'versions.binary_file_name',
    'versions.binary_file_size' => 'versions.binary_file_size',
    'versions.major_version_number' => 'versions.major_version_number',
    'versions.minor_version_number' => 'versions.minor_version_number',
  }

  DOCUMENTS_TERSE = {
      'documents.id' => 'documents.id AS \'document_id\'',
      'documents.state' => 'documents.state',
      'documents.checked_out_by' => 'documents.checked_out_by'
  }

  DOCUMENTS_VERBOSE = {

    'documents.id' => 'documents.id AS \'document_id\'',
    'documents.state' => 'documents.state',
    'documents.name' => 'documents.name',
    'documents.checked_out_by' => 'documents.checked_out_by',
    'documents.description' => 'documents.description',
    'documents.created_at' => 'documents.created_at',
    'documents.created_by' => 'documents.created_by',
    'documents.updated_at' => 'documents.updated_at',
    'documents.updated_by' => 'documents.updated_by'

  }

  REFERENCE_ALL = REFERENCE_VERBOSE.clone
  DOCUMENTS_ALL = DOCUMENTS_VERBOSE.clone
  Bfree::ColumnMaximum.StringMax.times do |n|
    column_name = "prp_str%03d" % (n + 1)
    REFERENCE_ALL["documents.#{column_name}"] = column_name
    DOCUMENTS_ALL["documents.#{column_name}"] = column_name
  end
  Bfree::ColumnMaximum.BooleanMax.times do |n|
    column_name = "prp_bln%03d" % (n + 1)
    REFERENCE_ALL["documents.#{column_name}"] = column_name
    DOCUMENTS_ALL["documents.#{column_name}"] = column_name
  end
  Bfree::ColumnMaximum.IntegerMax.times do |n|
    column_name = "prp_int%03d" % (n + 1)
    REFERENCE_ALL["documents.#{column_name}"] = column_name
    DOCUMENTS_ALL["documents.#{column_name}"] = column_name
  end
  Bfree::ColumnMaximum.FloatMax.times do |n|
    column_name = "prp_flt%03d" % (n + 1)
    REFERENCE_ALL["documents.#{column_name}"] = column_name
    DOCUMENTS_ALL["documents.#{column_name}"] = column_name
  end
  Bfree::ColumnMaximum.DateTimeMax.times do |n|
    column_name = "prp_dtt%03d" % (n + 1)
    REFERENCE_ALL["documents.#{column_name}"] = column_name
    DOCUMENTS_ALL["documents.#{column_name}"] = column_name
  end
  Bfree::ColumnMaximum.TextMax.times do |n|
    column_name = "prp_txt%03d" % (n + 1)
    REFERENCE_ALL["documents.#{column_name}"] = column_name
    DOCUMENTS_ALL["documents.#{column_name}"] = column_name
  end


  ALIASES = {
    'document_types.name' => 'document_types.name AS \'document_type_name\''
  }

  JOIN_STMT = [
    'INNER JOIN documents ON documents.id = references.document_id',
    'INNER JOIN versions ON versions.document_id = documents.id AND is_current_version = true',
    'INNER JOIN document_types ON document_types.id = documents.document_type_id'
  ]

  JOIN_STMT_SIMPLE = [
    'INNER JOIN versions ON versions.document_id = documents.id AND is_current_version = true',
    'INNER JOIN document_types ON document_types.id = documents.document_type_id'
  ]

  scope :advanced, lambda{ |library, query|
    where(Search.evaluate(library, query))
  }

  scope :complete, lambda{
    columns = REFERENCE_ALL.clone
    select(columns.values.join(','))
    .joins(JOIN_STMT.join(' '))
  }

  #returns a light version of the record that is a "reference" to the
  #document and contains only columns specified in the view
  #limit row count to the "range" if provided
  scope :browse, lambda{ |view, sort, range, simple|

    columns = REFERENCE_TERSE.clone

    unless view.nil?
      view.cell_definitions.each do |cell|
        column = "#{cell.table_name}.#{cell.column_name}"
        if column == 'versions.version_number'
          columns['versions.major_version_number'] = 'versions.major_version_number'
          columns['versions.minor_version_number'] = 'versions.minor_version_number'
        else
          unless columns.include?(column)
            columns[column] = ALIASES.include?(column) ? ALIASES[column] : column
          end
        end

      end
    end

    arel = select(columns.values.join(','))
    if(simple)
      arel = arel.joins(JOIN_STMT_SIMPLE.join(' '))
    else
      arel = arel.joins(JOIN_STMT.join(' '))
    end
    arel = arel.order(sort) unless sort.nil?
    arel = arel.limit(range['row_count']) unless (range.nil? || range['row_count'] < 1)
    arel = arel.offset(range['offset']) unless range.nil?

    return arel

  }

  scope :content, lambda {
    where(:reference_type => VersaFile::ReferenceTypes.Content)
  }

  #returns all (soft) deleted documents in the system
  scope :deleted, lambda {
    where("documents.state & #{Bfree::DocumentStates.Deleted} > 0")
  }
  scope :not_deleted, lambda {
    where("(documents.state & #{Bfree::DocumentStates.Deleted} = 0)")
  }

  scope :full, lambda{
    columns = REFERENCE_VERBOSE.clone
    select(columns.values.join(','))
    .joins(JOIN_STMT.join(' '))
  }

  #returns (non-deleted) documents in a specific folder OR
  #in root folder if 'folder' param is null
  scope :in_folder, lambda { |folder|
    where("folder_id = #{folder.nil? ? 0 : folder.id}")
    #where("folder_id = #{folder_id} AND (state & #{Bfree::DocumentStates.Deleted} = 0)")
  }

  #Returns full text search results
  scope :simple, lambda{ |view, text|
    joins("INNER JOIN (#{Document.simple(view, text).to_sql}) as documents ON documents.id = references.document_id")
    #where(sanitize_sql_array(["MATCH (documents.body, documents.metadata, documents.custom_metadata) AGAINST ('%s' IN BOOLEAN MODE)", text.gsub("'", "''")]))
  }

  #returns only documents that the user has at least "view" privileges
  #- adds the active permissions to the results
  scope :viewable, lambda { |user, group|
    select('viewable.active_permissions')
    .joins("INNER JOIN ( #{Acl.viewable('Reference', user, group).to_sql} ) AS viewable ON viewable.id = references.id")
  }

  def create_share(shared_folder, user)

    #1) Create a duplicate of self
    share = self.dup
    share[:reference_type] = VersaFile::ReferenceTypes.Share

    #2) Setup ACL
    share.acl = self.acl.deep_clone
    logger.debug('cloned.')

    #3) Move to shared folder
    share.file_in_folder(shared_folder, user)

    return share
  end

  def is_dropbox
    self.document.versions.each do |version|
      if(version.dropbox_uid!=nil)
        return true
      end
    end
    return false
  end

  def is_synchronized
    return self.document.current_version.dropbox_uid!=nil
  end

  def file_in_folder(folder, user)

    raise "Folder not defined" if folder.nil?

    self.update_attributes(
        :folder_id => folder.id
    )

    self.document.update_attribute(:updated_by, user.name)

    if self.acl.inherits
      self.acl.inherit_from_parent(self)
      self.acl.save
    end

  end


  def get_active_role(user, group)
    return self.acl.get_role(user, group)
  end

  def get_securable_parent()
    self.folder.nil? ?
          self.library :
          self.folder
  end

  def soft_delete(user)

    #destroy all shared references
    shared_refs = self.document.references.where(:reference_type => VersaFile::ReferenceTypes.Share)
    shared_refs.destroy_all

    self.document.soft_delete(user)
    self.update_attribute(:reference_type, VersaFile::ReferenceTypes.Trash)
  end

  def soft_restore(to_folder, user)

    #marke the document as undeleted.
    self.document.soft_restore(user)
    self.update_attributes(:reference_type => VersaFile::ReferenceTypes.Content)

    if !to_folder.nil?
      #restore to folder if defined
      self.file_in_folder(to_folder, user)
    elsif self.folder.nil?
      #restore to root if folder doesn't exist
      root_folder = self.library.folders.root_folders.first
      self.file_in_folder(root_folder, user)
    end

  end

  def package(root_folder)

    document_dir = File.join(root_folder, self.document.name)
    document_dir = Pathname.new(document_dir).cleanpath()
    FileUtils.mkdir_p document_dir

     exportable = {
        :name => self.document.name,
        :document_type => self.document.document_type.name,
        :created_at => self.document.created_at,
        :created_by => self.document.created_by,
        :updated_at => self.document.updated_at,
        :updated_by => self.document.updated_by,
        :properties => [],
        :acl => self.acl.package()
    }

    self.document.document_type.property_mappings.each do |property_mapping|
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
    self.document.versions.each do |version|
      count += 1
      version.package(version_dir)
    end

    return count
  end

  #Creates the default ACL for the reference:
  # - Inherits "Library" ACL if in root folder
  # - Inherits "Folder" ACL if in folder
  def create_acl

    self.acl = (self.folder.nil?) ?
                  self.library.acl.deep_clone :
                  self.folder.acl.deep_clone
    self.acl.inherits = true

  end

  def move_to_dropbox(uid, path)
    self.document.add_flag(Bfree::DocumentStates.Synchronizing)
    self.document.save

    self.document.versions.each do |version|
      if(version.id==document.current_version.id)
        version.dropbox_uid=uid
        version.dropbox_path=path+'/'+version.binary_file_name
      else
        version.dropbox_uid=nil
        version.dropbox_path=nil
      end
      version.save
    end

    self.delay.move_to_dropbox_delay(uid, path)
  end

  def move_to_dropbox_delay(uid, path)
    version=self.document.current_version

    local_filepath = version.path
    orig_filename = version.binary_file_name

    dbsession=library.db_sessions.find_by_dropbox_uid(uid).getSession()
    dbclient=DropboxClient.new(dbsession, configatron.versafile.dropbox.access_type)
    metadata=dbclient.put_file("#{path}/#{orig_filename}", File.open(local_filepath, "rb"))

    document.current_version.dropbox_uid=uid
    document.current_version.dropbox_path=metadata['path']
    document.current_version.save
    self.document.remove_flag(Bfree::DocumentStates.Synchronizing)
    self.document.save
  end

private

  def on_before_create
    create_acl if self.acl.nil?
  end


end
