class Zone < ActiveRecord::Base
  has_many :configurations
  has_one :configuration, :as => :configurable
  has_many :avatars
  has_one :avatar, :as => :imageable
  has_many :choice_lists
  has_many :folders
  has_many :documents
  has_many  :versions
  has_many :preview_elements
  has_many :groups
  has_many :users
  has_many :roles
  has_many :libraries
  has_many :acls
  has_one :acl, :as => :securable
  after_create :create_defaults

  validate :subdomain, :uniqueness => true

  def authorize(user, password, group)

    role = self.acl.get_role(user, group)

    raise Exceptions::InvalidCredentials.new(user.name) unless user.verify_password(password)
    raise Exceptions::UserDisabled.new(user.name) if (role.nil?) || (role.permissions == Bfree::Acl::Permissions.None)

  end

  def dojo_url
    return "/zones/#{self.subdomain}"
  end

  def metrics()

    group_count = self.groups.count
    user_count = self.users.count
    trial_expiry = self.trial_expiry
    libraries = []

    self.libraries.each do |library|
      metrics = library.metrics
      libraries.push({
        name: library.name,
        choicelist_count: metrics[:choicelist_count],
        propertydefinition_count: metrics[:propertydefinition_count],
        documenttype_count: metrics[:documenttype_count],
        viewdefinition_count: metrics[:viewdefinition_count],
        folder_count: metrics[:folder_count],
        document_count: metrics[:document_count],
        version_count: metrics[:version_count],
        content_size: metrics[:content_size],
        document_types: metrics[:document_types]
      })
    end

    return {
        :group_count => group_count,
        :user_count => user_count,
        :trial_expiry => trial_expiry,
        :libraries => libraries
    }
  end

  def package(root_folder)

    results = {
        :subdomain => self.subdomain,
        :users => 0,
        :groups => 0,
        :choice_lists => 0,
        :property_definitions => 0,
        :document_types => 0,
        :view_definitions => 0,
        :folders => 0,
        :documents => 0,
        :versions => 0
    }

    exportable = {
        :subdomain => self.subdomain,
        :name => self.name,
        :fingerprint => self.fingerprint,
        :created_at => self.created_at,
        :created_by => self.created_by,
        :updated_at => self.updated_at,
        :updated_by => self.updated_by,
        :acl => self.acl.package()
    }
    _json = ActiveSupport::JSON.encode(exportable)

    zone_filepath = File.join(root_folder, '_zone.json')
    File.open(zone_filepath, 'w'){ |json_file| json_file.write _json }

    users_dir = File.join(root_folder, 'users')
    FileUtils.mkdir_p users_dir
    self.users.each do |user|
      user.package(users_dir)
      results[:users] += 1
    end

    groups_dir = File.join(root_folder, 'groups')
    FileUtils.mkdir_p groups_dir
    self.groups.each do |group|
      next if group.is_everyone
      group.package(groups_dir)
      results[:groups] += 1
    end

    #We have only 1 library (for now)
    libraries_dir = File.join(root_folder, 'libraries')
    FileUtils.mkdir libraries_dir
    library = self.libraries.first
    library_dir = File.join(libraries_dir, "library")
    FileUtils.mkdir library_dir
    library_results = library.package(library_dir)
    results[:choice_lists] += library_results[:choice_lists]
    results[:property_definitions] += library_results[:property_definitions]
    results[:document_types] += library_results[:document_types]
    results[:view_definitions] += library_results[:view_definitions]
    results[:folders] += library_results[:folders]
    results[:documents] += library_results[:documents]
    results[:versions] += library_results[:versions]

    return results

  end

  def trial_expiry

    trial_period = self.configuration.configuration_settings.find_by_name('trial_period').value.to_i

    return trial_period if (trial_period == VersaFile::TrialStates.NoTrial ||
                            trial_period == VersaFile::TrialStates.Infinite)

    expiry_date =  self.created_at + trial_period.days
    days_left = ((expiry_date - Time.now) / 1.day).ceil
    days_left = VersaFile::TrialStates.Expired if days_left < 0

    return days_left

  end

  def unpackage(root_dir)

    results = {
            :subdomain => self.subdomain,
            :users => 0,
            :groups => 0,
            :choice_lists => 0,
            :property_definitions => 0,
            :document_types => 0,
            :view_definitions => 0,
            :folders => 0,
            :documents => 0,
            :versions => 0
        }

    zone_file = File.join(root_dir, '_zone.json')
    if File.exists?(zone_file)
      import_json = ActiveSupport::JSON.decode(IO.read(zone_file))
      merge(import_json)
    end

    users_dir = File.join(root_dir, 'users')
    if Dir.exists?(users_dir)
      Dir.glob(File.join(users_dir, '*.json')).each do |entry|
        User.unpackage(self, entry)
        results[:users] += 1
      end
    end

    groups_dir = File.join(root_dir, 'groups')
    if Dir.exists?(groups_dir)
      Dir.glob(File.join(groups_dir, '*.json')).each do |entry|
        Group.unpackage(self, entry)
        results[:groups] += 1
      end
    end

    libraries_dir = File.join(root_dir, 'libraries')
    if Dir.exists?(groups_dir)
      Dir.foreach(libraries_dir) do |entry|
        next if ['.', '..', '.svn', '.git'].include?(entry)
        library_results = Library.unpackage(self, File.join(libraries_dir, entry))
        results[:choice_lists] += library_results[:choice_lists]
        results[:property_definitions] += library_results[:property_definitions]
        results[:document_types] += library_results[:document_types]
        results[:view_definitions] += library_results[:view_definitions]
        results[:folders] += library_results[:folders]
        results[:documents] += library_results[:documents]
        results[:versions] += library_results[:versions]
      end
    end

    return results

  end

private

  def merge(data)

    begin

      self.created_by = data['created_by'] unless data['created_by'].nil?
      self.created_at = data['created_at'] unless data['created_at'].nil?
      self.updated_by = data['updated_by'] unless data['updated_by'].nil?
      self.updated_at = data['updated_at'] unless data['updated_at'].nil?

      Acl.unpackage(self.acl, data['acl']) unless data['acl'].nil?

      unless self.save

      end

    ensure
       Zone.record_timestamps = true
    end


  end

  def create_defaults()

    #Set Default Configuration values
    self.configuration = self.configurations.create(
        :configuration_settings => [
            ConfigurationSetting.create(:name => 'session_timeout', :value => '1200')
        ]
    )

    #create default preview elements
    self.preview_elements.create([
      {
          :content_type => "application/pdf",
          :element_template => "<object data=\"%s#navpanes=1&scrollbar=0&toolbar=0\" type=\"%s\" width=\"100%%\" height=\"100%%\"></object>",
          :maintain_aspect_ratio => false,
          :created_by => self.created_by,
          :updated_by => self.updated_by,
      },
      {
          :content_type => "text/plain",
          :element_template => "<object data=\"%s\" type=\"%s\" width=\"100%%\" height=\"100%%\"></object>",
          :maintain_aspect_ratio => false,
          :created_by => self.created_by,
          :updated_by => self.updated_by,
      }
    ])

    #create default groups
    self.groups.create([
      { :name => 'Administrators',
        :description => 'Users in this group have administrative authority such that they can access all administrative functions and all site content.',
        :is_admin => true,
        :created_by => self.created_by,
        :updated_by => self.updated_by },

      { :name => 'Everyone',
        :description => 'Default group that all regular users belong to.',
        :is_everyone => true,
        :created_by => self.created_by,
        :updated_by => self.updated_by }
    ])

    #create default users
    self.users.create(
        :name => 'admin',
        :password => 'admin',
        :is_admin => true,
        :created_by => self.created_by,
        :updated_by => self.updated_by,
        :password_expires => Time.now,
        :groups => [self.groups.admins.first]
    )

    #create default roles
    self.roles.create([
      { :name => 'Admin', :permissions => Bfree::Acl::Roles.Admin, :created_by => self.created_by, :updated_by => self.updated_by },
      { :name => 'Owner', :permissions => Bfree::Acl::Roles.Owner, :created_by => self.created_by, :updated_by => self.updated_by },
      { :name => 'Author', :permissions => Bfree::Acl::Roles.Author, :created_by => self.created_by, :updated_by => self.updated_by },
      { :name => 'Viewer', :permissions => Bfree::Acl::Roles.Viewer, :created_by => self.created_by, :updated_by => self.updated_by },
      { :name => 'None', :permissions => Bfree::Acl::Roles.None, :created_by => self.created_by, :updated_by => self.updated_by }
    ])


    self.acl = self.acls.create(
        :inherits => false,
        :acl_entries => [
          AclEntry.create(
              :grantee => self.users.admins.first,
              :role => self.roles.admins.first,
              :precedence => Bfree::Acl::PrecedenceTypes.NamedUser
          )
        ]
    )


    #create default library (must have one)
    self.libraries.create(
        :name => self.name,
        :description => 'TODO: create default description',
        :created_by => self.created_by,
        :updated_by => self.updated_by
    )

  end

end
