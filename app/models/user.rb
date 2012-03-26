class User < ActiveRecord::Base
  belongs_to :zone
  has_and_belongs_to_many :groups
  has_one :avatar, :as => :imageable
  after_create :after_create

  attr_accessor :sort_id

  scope :admins, lambda {
    where(:is_admin => 1)
  }

  def self.generate_password
    SecureRandom.base64(8)
  end

  def active_group
    return self.active_group_object.id
  end

  def active_group_object
     grp = self.groups.first
    if grp.nil?
      grp = self.zone.groups.everyones.first
    end

    return grp
  end

  def qualified_name
    return "#{self.name}@#{self.zone.subdomain}"
  end

  def full_name

    val = ''
    val += self.first_name unless self.first_name.blank?

    unless self.last_name.blank?
      val += ' ' unless val.blank?
      val += self.last_name unless self.last_name.blank?
    end

    val = self.name if val.blank?

    return val
  end

  def password=(value)
    logger.debug("VALUE: '#{value}'")
    write_attribute('password', User.encrypt(value))
  end

  def raw_password=(value)
    write_attribute('password', value)
  end

  def reset_password=(value)
    if(value==nil)
      write_attribute('reset_password', nil)
    else
      write_attribute('reset_password', User.encrypt(value))
    end
  end

  def disabled

    if(self.is_admin)
      return false
    end

    role = self.zone.acl.get_role(self, nil)
    return ((role.nil?) || (role.permissions == Bfree::Acl::Permissions.None))

  end

  def is_admin?
    return self.is_admin || self.active_group_object.is_admin
  end

  def verify_password(password)
    isVerified = true

    unless (password == self.password)
      enc_password = User.encrypt(password)
      isVerified = (enc_password == self.password)
    end

    return isVerified
  end

  def verify_reset_password(reset_password)
    isVerified = true

    unless (reset_password == self.reset_password)
      enc_password = User.encrypt(reset_password)
      isVerified = (enc_password == self.reset_password)
    end

    return isVerified
  end

  def dojo_url
    return "/zones/#{self.zone.subdomain}/users/#{self.id}"
  end

  def switch_to_group(group)

    return if self.groups.exists?(:id => group.id)
    raise "You cannot change the Administrator account's group'" if self.is_admin && !group.is_admin

    self.groups.clear
    unless (group.nil? || group.is_everyone)
      self.groups << group
    end
    self.save

  end

  def package(root_folder)

    exportable = {
        :id => self.id,
        :is_admin => self.is_admin,
        :name => self.name,
        :password => self.password,
        :email => self.email,
        :first_name => self.first_name,
        :last_name => self.last_name,
        :state => self.state,
        :password_expires => self.password_expires,
        :reset_fingerprint => self.reset_fingerprint,
        :reset_password => self.reset_password,
        :created_at => self.created_at,
        :created_by => self.created_by,
        :updated_at => self.updated_at,
        :updated_by => self.updated_by,
    }

    _json = ActiveSupport::JSON.encode(exportable)

    json_file = File.join(root_folder, "#{self.name}.json")
    json_file = Pathname.new(json_file).cleanpath()
    File.open(json_file, 'w'){ |json_file| json_file.write _json }

  end

  def self.unpackage(zone, file_path)

    begin
      import_json = ActiveSupport::JSON.decode(IO.read(file_path))

      user = zone.users.find_by_name(import_json['name'])
      if user.nil?
        user = zone.users.new(:name => import_json['name'])
      end

      user.is_admin = import_json['is_admin']
      user.raw_password = import_json['password']
      user.email = import_json['email']
      user.first_name = import_json['first_name']
      user.last_name = import_json['last_name']
      user.state = import_json['state']
      user.password_expires = import_json['password_expires']
      user.reset_fingerprint = import_json['reset_fingerprint']
      user.created_at = import_json['created_at']
      user.created_by = import_json['created_by']
      user.updated_at = import_json['updated_at']
      user.updated_by = import_json['updated_by']

      User.record_timestamps = false
      unless user.save

      end

    ensure
      User.record_timestamps = true
    end

  end



private

  def after_create

  end

  def self.encrypt(value)
    Digest::SHA1.hexdigest(value)
  end


end
