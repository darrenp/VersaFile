class Group < ActiveRecord::Base
  belongs_to :zone
  has_and_belongs_to_many :users

  scope :admins, lambda {
    where(:is_admin => true)
  }

  scope :everyones, lambda {
    where(:is_everyone => true)
  }

  def active_users

    users = []

    if(self.is_everyone)

      users = self.zone.users.find :all,
                 :select => 'id as \'user_id\''

    else

      users = self.zone.users.find :all,
                    :select => 'groups_users.user_id',
                    :joins => 'INNER JOIN groups_users ON users.id = groups_users.user_id',
                    :conditions => "groups_users.group_id = #{self.id}"
    end

    return users
  end

  def dojo_url
    return "/zones/#{self.zone.subdomain}/groups/#{self.id}"
  end

  def package(root_folder)

    exportable = {
        :id => self.id,
        :name => self.name,
        :is_admin => self.is_admin,
        :is_everyone => self.is_everyone,
        :description => self.description,
        :created_at => self.created_at,
        :created_by => self.created_by,
        :updated_at => self.updated_at,
        :updated_by => self.updated_by,
        :users => []
    }

    self.users.each do | user |
      exportable[:users] << user.name
    end

    _json = ActiveSupport::JSON.encode(exportable)

    json_file = File.join(root_folder, "#{self.name}.json")
    json_file = Pathname.new(json_file).cleanpath()
    File.open(json_file, 'w'){ |json_file| json_file.write _json }

  end

  def self.unpackage(zone, file_path)

    begin

      import_json = ActiveSupport::JSON.decode(IO.read(file_path))

      group = zone.groups.find_by_name(import_json['name'])
      if group.nil?
        group = zone.groups.new(:name => import_json['name'])
      end

      group.description = import_json['description']
      group.created_by = import_json['created_by']
      group.created_at = import_json['created_at']
      group.updated_by = import_json['updated_by']
      group.updated_at = import_json['updated_at']

      import_json['users'].each do |user_name|
        user = zone.users.find_by_name(user_name)
        unless user.nil?
          user.switch_to_group(group)
        end

      end

      Group.record_timestamps = false
      unless group.save

      end

    ensure
      Group.record_timestamps = true
    end

  end

end
