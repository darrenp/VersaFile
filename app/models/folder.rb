class Folder < ActiveRecord::Base
  acts_as_tree :order => "name"
  belongs_to :zone
  belongs_to :library
  has_one :acl, :as => :securable
  has_many  :documents
  before_create :create_acl

  scope :root_folders, lambda {
    where('parent_id=0')
  }

  scope :viewable, lambda { |user, group|

    select('folders.*, viewable.active_permissions')
    .joins("INNER JOIN ( #{Acl.viewable('Folder', user, group).to_sql} ) AS viewable ON viewable.id = folders.id")
    .order('is_trash DESC, is_search DESC, name ASC')
  }

  def text_path

    if self.parent != nil
      return "#{self.parent.text_path}/#{self.name}"
    else
     #return "/#{self.library.zone.name}/#{self.name}"
      return "/#{self.name}"
    end

  end

  def document_count
    if is_trash
      return self.library.documents.deleted.length
    else
      return self.documents.length
    end

  end

  def parent_id
    self[:parent_id].nil? ? 0 : self[:parent_id]
  end

  def propagate_acl()

    #Propagate to subfolders
    self.children.each do |subfolder|
      if subfolder.acl.inherits
        acl=self.acl.deep_clone()
        subfolder.acl = acl
        acl.inherits = true
        acl.save
        subfolder.propagate_acl()
      end
    end

    #Propagate to documents
    self.documents.each do |document|
      if document.acl.inherits
        document.acl = self.acl.deep_clone()
        document.acl.inherits = true
        document.save
      end
    end


  end

  def dojo_path

    return ["0", self.id.to_s] if parent.nil?
    return  parent.dojo_path << self.id.to_s

  end

  def dojo_url
    return "/zones/#{self.library.zone.subdomain}/libraries/#{self.library.id}/folders/#{self.id}"
  end

  def as_json(options={})


    if(options[:as_ref])
      json_obj = {
          '$ref' => self.id,
          :name => self.name,
          :children => (self.children.count > 0),
          :path => self.dojo_path
      }
    else
      json_obj = super.as_json(options)
      json_obj[:path] = self.dojo_path
      json_obj[:document_count] = self.document_count
      json_obj[:text_path] = self.text_path
      json_obj[:active_permissions] = self.acl.get_role(options[:user], options[:group]).permissions
      json_obj[:children] = []

      self.children.viewable(options[:user], options[:group]).each do |child|

        json_obj[:children] << {
            '$ref' => child.id,
            :name => child.name,
            :children => (child.children.count > 0)
        }
      end
    end

    return json_obj
  end

  def deleteDocuments(user)
    self.children.each do |subfolder|
      #logger.debug "...#{subfolder.path}"
      subfolder.deleteDocuments(user)
    end

    self.documents.each do |document|
      logger.debug document.name
      document.soft_delete(user)
    end
  end

  def package(root_folder)

    results = {
      :folders => 0,
      :documents => 0,
      :versions => 0
    }

    folder_dir = File.join(root_folder, self.name)
    folder_dir = Pathname.new(folder_dir).cleanpath()
    FileUtils.mkdir_p folder_dir

    exportable = {
        :name => self.name,
        :created_at => self.created_at,
        :created_by => self.created_by,
        :updated_at => self.updated_at,
        :updated_by => self.updated_by,
        :acl => self.acl.package()
    }
    _json = ActiveSupport::JSON.encode(exportable)

    json_file = File.join(folder_dir, "_folder.json")
    File.open(json_file, 'w'){ |json_file| json_file.write _json }

    documents_dir = File.join(folder_dir, 'documents')
    FileUtils.mkdir_p documents_dir
    documents = self.library.documents.in_folder(self)
    documents.each do |document|
      results[:documents] += 1
      results[:versions] += document.package(documents_dir)
    end

    folder_dir = File.join(folder_dir, 'folders')
    FileUtils.mkdir_p folder_dir
    self.children.each do |subfolder|
      results[:folders] += 1
      subfolder_results = subfolder.package(folder_dir)
      results[:folders] += subfolder_results[:folders]
      results[:documents] += subfolder_results[:documents]
      results[:versions] += subfolder_results[:versions]
    end

    return results
  end

  def self.unpackage(library, parent, root_dir)

    results = {
      :folders => 0,
      :documents => 0,
      :versions => 0
    }

    import_json = ActiveSupport::JSON.decode(IO.read(File.join(root_dir, '_folder.json')))

    folder = (parent.nil?) ?
                library.folders.root_folders.find_by_name(import_json['name']) :
                parent.children.find_by_name(import_json['name'])

    if(folder.nil?)
      folder = library.zone.folders.new(
        :library => library,
        :name => import_json['name'],
        :parent_id => (parent.nil?) ? 0 : parent.id
      )
    end

    merge(folder, import_json)

    folder_dir = File.join(root_dir, 'folders')
    if Dir.exists?(folder_dir)
      Dir.foreach(folder_dir) do |entry|
        next if ['.', '..', '.svn', '.git'].include?(entry)
        subfolder_results = Folder.unpackage(library, folder, File.join(folder_dir, entry))
        results[:folders] += subfolder_results[:folders]
        results[:documents] += subfolder_results[:documents]
        results[:versions] += subfolder_results[:versions]
        results[:folders] += 1
      end
    end

    documents_dir = File.join(root_dir, 'documents')
    if Dir.exists?(documents_dir)
      Dir.foreach(documents_dir) do |entry|
        next if ['.', '..', '.svn', '.git'].include?(entry)
        results[:documents] += 1
        results[:versions] += Document.unpackage(library, folder, File.join(documents_dir, entry))
      end
    end

    return results

  end

  def create_acl

    self.acl = (self.parent.nil?) ?
                  self.library.acl.deep_clone :
                  self.parent.acl.deep_clone
    self.acl.inherits = true

  end

private



  def self.merge(folder, data)

    begin

      folder.created_by = data['created_by'] unless data['created_by'].nil?
      folder.created_at = data['created_at'] unless data['created_at'].nil?
      folder.updated_by = data['updated_by'] unless data['updated_by'].nil?
      folder.updated_at = data['updated_at'] unless data['updated_at'].nil?

      Folder.record_timestamps = false
      unless folder.save

      end

      folder.create_acl if folder.acl.nil?
      Acl.unpackage(folder.acl, data['acl']) unless data['acl'].nil?

    ensure
      Folder.record_timestamps = true
    end

  end

end
