class Version < ActiveRecord::Base
  belongs_to :zone
  belongs_to :library
  belongs_to :document
  has_attached_file   :binary,
                      :path => ":system_path/:subdomain/content/:binary_primary_folder/:binary_secondary_folder/:binary_storage_name",
                      :restricted_characters => /[_]/

  has_one :content_type, :primary_key=>"binary_content_type", :foreign_key => "binary_content_type"
  before_save :pre_save_actions
  attr_accessor :sort_id


  def self.supersede(library, current_version, temp_file, as_minor)

    unless(current_version.nil?)

      current_version.update_attribute(:is_current_version, false)

      major_version = current_version.major_version_number
      minor_version = current_version.minor_version_number

      if as_minor
        minor_version += 1
      else
        major_version += 1
        minor_version = 0
      end

    else
      major_version = as_minor ? 0 : 1
      minor_version = as_minor ? 1 : 0
    end

    version = library.zone.versions.new(
        :library => library,
        :binary => temp_file,
        :major_version_number => major_version,
        :minor_version_number => minor_version,
        :is_current_version => true
      )

    return version
  end

  def zone
    self.document.library.zone
  end

  def synchronize
    self.document.add_flag(Bfree::DocumentStates.Synchronizing)
    self.document.save
    self.delay.synchronize_delay()
  end

  def synchronize_delay()
    uid, path=self.document.get_dropbox_uid_and_path()

    dbsession=self.zone.db_sessions.find_by_dropbox_uid(uid).getSession
    dbclient=DropboxClient.new(dbsession, configatron.versafile.dropbox.access_type)

    local_filepath = self.path

    dbclient.put_file(path, File.open(local_filepath, "rb"), true)

    document=self.library.documents.find_by_id(self.document.id)
    document.remove_flag(Bfree::DocumentStates.Synchronizing)
    document.save

    oldversion=self.document.versions.find_by_dropbox_uid_and_dropbox_path(uid, path)
    oldversion.dropbox_uid=nil
    oldversion.dropbox_path=nil
    oldversion.save

    newversion=self.document.versions.find_by_id(self.id)
    newversion.dropbox_uid=uid
    newversion.dropbox_path=path
    newversion.save

    #self.document.remove_flag(Bfree::DocumentStates.Synchronizing)
    #self.document.save

  end

  def binary_primary_folder
    self.binary_storage_name[0,1]
  end

  def binary_secondary_folder
    self.binary_storage_name[1,2]
  end

  def path
    return File.join(VersaFile::SYSTEM_PATH, self.zone.subdomain, 'content', self.binary_primary_folder, self.binary_secondary_folder, self.binary_storage_name)
  end

  def pre_save_actions
    self.binary_storage_name = self.generate_storage_name
    self.binary_uniqueness_key = self.generate_uniqueness_key
  end

  #generate a unique storage name for content file on the filesystem
  def generate_storage_name
    ext = self.binary_file_name.scan(/\.\w+$/)

    key = self.document.library.zone.id.to_s(16)
    key += ".#{self.document.library.id.to_s(16)}"
    key += ".#{self.document.id.to_s(16)}"
    key += ".#{self.major_version_number.to_s(16)}"
    key += ".#{self.minor_version_number.to_s(16)}"

    storage_name = "#{Digest::SHA1.hexdigest(key)}"
    storage_name << ext[0] unless ext.empty?

    return storage_name
  end

  def dojo_url
    return "/zones/#{self.document.library.zone.subdomain}/libraries/#{self.document.library.id}/documents/#{self.document.id}/versions/#{self.id}"
  end

  def generate_uniqueness_key
    Digest::MD5.hexdigest(binary.to_file.read) unless binary.to_file.nil?
  end

  def package(root_folder)
    version_dir = File.join(root_folder, "version.#{self.major_version_number}_#{self.minor_version_number}")
    version_dir = Pathname.new(version_dir).cleanpath()
    FileUtils.mkdir_p version_dir

    exportable = {
      :binary_file_name => self.binary_file_name,
      :major_version_number => self.major_version_number,
      :minor_version_number => self.minor_version_number,
      :is_current_version => self.is_current_version
    }
    _json = ActiveSupport::JSON.encode(exportable)

    json_file = File.join(version_dir, "_version.json")
    File.open(json_file, 'w'){ |json_file| json_file.write _json }

    dst_path = File.join(version_dir, self.binary_file_name)
    FileUtils.cp(self.path, dst_path)

  end

  def self.unpackage(document, root_dir)

    import_json = ActiveSupport::JSON.decode(IO.read(File.join(root_dir, '_version.json')))

    file_path = File.join(root_dir, import_json['binary_file_name'])
    logger.debug(":> #{file_path}")

    version = nil
    File.open(file_path) { |file|
      version = document.zone.versions.new(
        :binary => file,
        :major_version_number => import_json['major_version_number'],
        :minor_version_number => import_json['minor_version_number'],
        :is_current_version => import_json['is_current_version']
      )
    }

    document.versions.push(version) unless version.nil?

  end

end
