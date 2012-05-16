class Library < ActiveRecord::Base
  belongs_to :zone
  has_many :property_columns
  has_many :property_definitions
  has_many :document_types
  has_one :acl, :as => :securable
  has_one :configuration, :as => :configurable
  has_many :folders
  has_many :shares
  has_many :references
  has_many :documents
  has_many :versions
  has_many :choice_lists
  has_many :view_definitions
  has_many :cell_definitions
  has_many :preferences
  has_many :view_mappings

  after_create :create_defaults

  scope :viewable, lambda { |user, group|

    select('libraries.*, viewable.active_permissions')
    .joins("INNER JOIN ( #{Acl.viewable('Library', user, group).to_sql} ) AS viewable ON viewable.id = libraries.id")
  }

  def self.create_default(zone)
    libraries = []

    library = zone.libraries.new(
        :name => zone.name,
        :description => 'TODO: create default description'
    )
    library.configuration = zone.configurations.new
    library.configuration.configuration_settings << ConfigurationSetting.new(
        :name => 'no_folder_mode',
        :value => false
    )
    library.save
    libraries << library

    return libraries
  end

  def root_folder
    return self.folders.where(:folder_type == VersaFile::FolderTypes.Root).first
  end

  def as_json(options={})
    json_obj = super.as_json(options)
    json_obj[:active_permissions] = self.acl.get_role(options[:user], options[:group]).permissions
    return json_obj
  end

  def metrics

    choicelist_count = self.choice_lists.count
    propdef_count = self.property_definitions.count
    doctype_count = self.document_types.count
    viewdef_count = self.view_definitions.where(:is_template => true).count

    folder_count = self.folders.count - 2   #remove two for search/recycle bin folders
    document_count = self.documents.count
    version_count = self.versions.count
    content_size = self.versions.sum(:binary_file_size)


    document_types = []
    self.document_types.each do |document_type|
      document_types.push({
          name: document_type.name,
          document_count: document_type.documents.count
      })
    end

    return {  choicelist_count: choicelist_count,
              propertydefinition_count: propdef_count,
              documenttype_count: doctype_count,
              viewdefinition_count: viewdef_count,
              folder_count: folder_count,
              document_count: document_count,
              version_count: version_count,
              content_size: content_size,
              document_types: document_types  }
  end

  def package(root_folder)

    results = {
        :choice_lists => 0,
        :property_definitions => 0,
        :document_types => 0,
        :view_definitions => 0,
        :folders => 0,
        :documents => 0,
        :versions => 0
    }

    exportable = {
        :name => self.name,
        :description => self.description,
        :created_at => self.created_at,
        :created_by => self.created_by,
        :updated_at => self.updated_at,
        :updated_by => self.updated_by,
        :acl => self.acl.package()
    }
    _json = ActiveSupport::JSON.encode(exportable)

    json_file = File.join(root_folder, "_library.json")
    File.open(json_file, 'w'){ |json_file| json_file.write _json }

    choicelist_dir = File.join(root_folder, 'choice_lists')
    FileUtils.mkdir_p choicelist_dir
    self.choice_lists.each do |choice_list|
      choice_list.package(choicelist_dir)
      results[:choice_lists] += 1
    end

    propdef_dir = File.join(root_folder,'property_definitions')
    FileUtils.mkdir_p propdef_dir
    self.property_definitions.each do |property_definition|
      next if property_definition.is_system
      property_definition.package(propdef_dir)
      results[:property_definitions] += 1
    end

    doctypes_dir = File.join(root_folder, 'document_types')
    FileUtils.mkdir_p doctypes_dir
    self.document_types.each do |document_types|
      document_types.package(doctypes_dir)
      results[:document_types] += 1
    end

    viewdefs_dir = File.join(root_folder, 'view_definitions')
    FileUtils.mkdir_p viewdefs_dir
    self.view_definitions.each do |view_definition|
      view_definition.package(viewdefs_dir)
      results[:view_definitions] += 1
    end

    folder_dir = File.join(root_folder, 'folders')
    FileUtils.mkdir_p folder_dir

    count = 0
    root_folders = self.folders.root_folders
    root_folders.each do |folder|
      next if folder.is_trash || folder.is_search
      results[:folders] += 1
      folder_results = folder.package(folder_dir)
      results[:folders] += folder_results[:folders]
      results[:documents] += folder_results[:documents]
      results[:versions] += folder_results[:versions]
    end

    documents_dir = File.join(root_folder, 'documents')
    FileUtils.mkdir_p documents_dir
    root_documents = self.documents.in_folder(nil)
    root_documents.each do |document|
      results[:documents] += 1
      results[:versions] += document.package(documents_dir)
    end

    return results
  end

  def self.unpackage(zone, root_dir)

    results = {
        :choice_lists => 0,
        :property_definitions => 0,
        :document_types => 0,
        :view_definitions => 0,
        :folders => 0,
        :documents => 0,
        :versions => 0
    }

    import_json = File.join(root_dir, '_library.json')
    if File.exists?(import_json)
      import_json = ActiveSupport::JSON.decode(IO.read(import_json))
      library = zone.libraries.find_by_name(import_json['name'])
      merge(library, import_json)
    else
      library = zone.libraries.first
    end

    choicelists_dir = File.join(root_dir, 'choice_lists')
    if Dir.exists?(choicelists_dir)
      Dir.glob(File.join(choicelists_dir, '*.json')).each do |entry|
        ChoiceList.unpackage(library, entry)
        results[:choice_lists] += 1
      end
    end

    propdefs_dir = File.join(root_dir, 'property_definitions')
    if Dir.exists?(propdefs_dir)
      Dir.glob(File.join(propdefs_dir, '*.json')).each do |entry|
        PropertyDefinition.unpackage(library, entry)
        results[:property_definitions] += 1
      end
    end

    doctypes_dir = File.join(root_dir, 'document_types')
    if Dir.exists?(doctypes_dir)
      Dir.glob(File.join(doctypes_dir, '*.json')).each do |entry|
        DocumentType.unpackage(library, entry)
        results[:document_types] += 1
      end
    end

    viewdef_dir = File.join(root_dir, 'view_definitions')
    if Dir.exists?(viewdef_dir)
      Dir.glob(File.join(viewdef_dir, '*.json')).each do |entry|
        ViewDefinition.unpackage(library, entry)
        results[:view_definitions] += 1
      end
    end

    folder_dir = File.join(root_dir, 'folders')
    if Dir.exists?(folder_dir)
      Dir.foreach(folder_dir) do |entry|
        next if ['.', '..', '.svn', '.git'].include?(entry)
        folder_results = Folder.unpackage(library, nil, File.join(folder_dir, entry))
        results[:folders] += folder_results[:folders]
        results[:documents] += folder_results[:documents]
        results[:versions] += folder_results[:versions]
        results[:folders] += 1
      end
    end

    documents_dir = File.join(root_dir, 'documents')
    if Dir.exists?(documents_dir)
      Dir.foreach(documents_dir) do |entry|
        next if ['.', '..', '.svn', '.git'].include?(entry)
        results[:versions] += Document.unpackage(library, nil, File.join(documents_dir, entry))
        results[:documents] += 1
      end
    end

    return results

  end

  def propagate_acl()

    #Propagate to subfolders
    self.folders.root_folders.each do |subfolder|
      if subfolder.acl.inherits
        acl=self.acl.deep_clone()
        subfolder.acl = acl
        acl.inherits = true
        acl.save
        subfolder.propagate_acl()
      end
    end

    #Propagate to documents
    self.documents.in_folder(nil).each do |document|
      if document.acl.inherits
        acl = self.acl.deep_clone()
        document.acl=acl
        acl.inherits = true
        acl.save
      end
    end


  end
private

  def self.merge(library, data)
    begin

      library.description = data['description'] unless data['description'].nil?
      library.created_by = data['created_by'] unless data['created_by'].nil?
      library.created_at = data['created_at'] unless data['created_at'].nil?
      library.updated_by = data['updated_by'] unless data['updated_by'].nil?
      library.updated_at = data['updated_at'] unless data['updated_at'].nil?

      Acl.unpackage(library.acl, data['acl']) unless data['acl'].nil?

      Library.record_timestamps = false
      unless library.save

      end

    ensure
      Library.record_timestamps = true
    end
  end

  def create_defaults()

    #create default configuration
    self.configuration = self.zone.configurations.create(
        :configuration_settings => [
          ConfigurationSetting.create( :name => 'no_folder_mode', :value => false)
        ]
    )

    #createdefault ACL
    self.acl = self.zone.acls.create(
        :inherits => false,
        :acl_entries => [
            AclEntry.create(:grantee => self.zone.groups.admins.first, :role => self.zone.roles.admins.first, :precedence => Bfree::Acl::PrecedenceTypes.NamedGroup ),
            AclEntry.create(:grantee => self.zone.groups.everyones.first, :role => self.zone.roles.viewers.first, :precedence => Bfree::Acl::PrecedenceTypes.Everyone )
        ]
    )

    #create column monitors
    self.property_columns.create([
      {
          :data_type => DataType.boolean,
          :column_mask => 0,
          :max_columns => Bfree::ColumnMaximum.BooleanMax
      },
      {
          :data_type => DataType.datetime,
          :column_mask => 0,
          :max_columns => Bfree::ColumnMaximum.DateTimeMax
      },
      {
          :data_type => DataType.float,
          :column_mask => 0,
          :max_columns => Bfree::ColumnMaximum.FloatMax
      },
      {
          :data_type => DataType.integer,
          :column_mask => 0,
          :max_columns => Bfree::ColumnMaximum.IntegerMax
      },
      {
          :data_type => DataType.string,
          :column_mask => 0,
          :max_columns => Bfree::ColumnMaximum.StringMax
      },
      {
          :data_type => DataType.text,
          :column_mask => 0,
          :max_columns => Bfree::ColumnMaximum.TextMax
      },
    ])


    #create system Properties
    self.property_definitions.create([
      {
          :name => 'Title',
          :table_name => 'documents',
          :column_name => 'name',
          :data_type => DataType.string,
          :cardinality => Bfree::Cardinality.Single,
          :max_length => 255,
          :is_name => true,
          :is_system => true,
          :is_readonly => false,
          :created_by => self.created_by,
          :updated_by => self.updated_by
      },
      {
          :name => 'Description',
          :table_name => 'documents',
          :column_name => 'description',
          :data_type => DataType.text,
          :cardinality => Bfree::Cardinality.Single,
          :max_length => 255,
          :is_system => true,
          :is_readonly => false,
          :created_by => self.created_by,
          :updated_by => self.updated_by
      },
      {
          :name => 'Checked Out By',
          :table_name => 'documents',
          :column_name => 'checked_out_by',
          :data_type => DataType.string,
          :cardinality => Bfree::Cardinality.Single,
          :max_length => 64,
          :is_system => true,
          :is_readonly => true,
          :created_by => self.created_by,
          :updated_by => self.updated_by
      },
      {
          :name => 'Created By',
          :table_name => 'documents',
          :column_name => 'created_by',
          :data_type => DataType.string,
          :cardinality => Bfree::Cardinality.Single,
          :max_length => 64,
          :is_system => true,
          :is_readonly => true,
          :created_by => self.created_by,
          :updated_by => self.updated_by
      },
      {
          :name => 'Updated By',
          :table_name => 'documents',
          :column_name => 'updated_by',
          :data_type => DataType.string,
          :cardinality => Bfree::Cardinality.Single,
          :max_length => 64,
          :is_system => true,
          :is_readonly => true,
          :created_by => self.created_by,
          :updated_by => self.updated_by
      },
      {
          :name => 'Created At',
          :table_name => 'documents',
          :column_name => 'created_at',
          :data_type => DataType.datetime,
          :cardinality => Bfree::Cardinality.Single,
          :max_length => nil,
          :is_system => true,
          :is_readonly => true,
          :created_by => self.created_by,
          :updated_by => self.updated_by
      },
      {
          :name => 'Updated At',
          :table_name => 'documents',
          :column_name => 'updated_at',
          :data_type => DataType.datetime,
          :cardinality => Bfree::Cardinality.Single,
          :max_length => nil,
          :is_system => true,
          :is_readonly => true,
          :created_by => self.created_by,
          :updated_by => self.updated_by
      }
    ])

    #default document types
    document_type = self.document_types.create(
      :name => "Document",
      :description => "General system-defined document type",
      :is_system => true,
      :created_by => self.created_by,
      :updated_by => self.updated_by,
      :property_mappings => [
        PropertyMapping.create(
          :property_definition => self.property_definitions.find_by_name('Title'),
          :sort_order => 0,
          :is_required => true
        ),
        PropertyMapping.create(
          :property_definition => self.property_definitions.find_by_name('Description'),
          :sort_order => 1,
          :is_required => false
        ),
      ]
    )

    ViewDefinition.from_document_type(self, document_type, self.created_by, true).save()

    root_folder = self.zone.folders.create(
        :library => self,
        :name => self.name,
        :folder_type => VersaFile::FolderTypes.Root,
        :created_by => self.created_by,
        :updated_by => self.created_by,
        :parent_id => nil
    )

    #create trash folder
    trash = self.zone.folders.create(
      :library => self,
      :name => 'Recycle Bin',
      :folder_type => VersaFile::FolderTypes.Trash,
      :created_by => self.created_by,
      :updated_by => self.updated_by,
      :parent => root_folder
    )
    #create search folder
    search = self.zone.folders.create(
      :library => self,
      :name => 'Search',
      :folder_type => VersaFile::FolderTypes.Search,
      :created_by => self.created_by,
      :updated_by => self.updated_by,
      :parent => root_folder
    )

    #create share folder
    share_root = self.zone.folders.create(
      :library => self,
      :name => 'Shares',
      :folder_type => VersaFile::FolderTypes.ShareRoot,
      :created_by => self.created_by,
      :updated_by => self.updated_by,
      :parent => root_folder
    )

    #create default ACLs
    trash.acl = self.zone.acls.create(
        :inherits => false,
        :acl_entries => [
            AclEntry.create(:grantee => self.zone.groups.admins.first, :role => self.zone.roles.admins.first, :precedence => Bfree::Acl::PrecedenceTypes.NamedGroup)
        ]
    )
    trash.save

    share_root.acl = self.zone.acls.create(
        :inherits => false,
        :acl_entries => [
          AclEntry.create(:grantee => self.zone.groups.admins.first, :role => self.zone.roles.admins.first, :precedence => Bfree::Acl::PrecedenceTypes.NamedGroup),
          AclEntry.create(:grantee => self.zone.groups.everyones.first, :role => self.zone.roles.nones.first, :precedence => Bfree::Acl::PrecedenceTypes.Everyone)
        ]
    )
    share_root.save

  end

end
