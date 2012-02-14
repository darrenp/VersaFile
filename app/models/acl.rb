class Acl < ActiveRecord::Base
  belongs_to :zone
  belongs_to :securable, :polymorphic => true
  has_many :acl_entries, :dependent => :destroy

  scope :viewable, lambda { |type, user, group|

    everyone = group.zone.groups.find_by_name('Everyone')

    select('acls.securable_id AS id, roles.permissions AS active_permissions')
    .joins(
        "INNER JOIN (
          SELECT acls.id, MAX(precedence) as precedence
          FROM acls
          INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
          WHERE (securable_type = '#{type}') AND ((grantee_id = #{user.id} AND grantee_type ='User') OR (grantee_id = #{group.id} AND grantee_type = 'Group') OR (grantee_id = #{everyone.id} AND grantee_type = 'Group'))
          GROUP BY securable_id
        ) AS active ON ((active.id = acls.id) AND (acls.securable_type = '#{type}'))",
        "INNER JOIN acl_entries ON acl_entries.acl_id = acls.id AND active.precedence = acl_entries.precedence",
        "INNER JOIN roles ON roles.id = acl_entries.role_id"
    )
    .where("(roles.permissions != #{Bfree::Acl::Permissions.None}) AND ((grantee_id = #{user.id} AND grantee_type = 'User') OR (grantee_id = #{group.id} AND grantee_type = 'Group') OR (grantee_id = #{everyone.id} AND grantee_type = 'Group'))")
  }


  def get_role(user, group)

    everyone = user.zone.groups.find_by_name('Everyone')
    group = everyone if group.nil?

    acl_entry = self.acl_entries.find(  :first,
                            :conditions => "((grantee_id = #{user.id}) AND (grantee_type = 'User'))
                                            OR ((grantee_id = #{group.id}) AND (grantee_type = 'Group'))
                                            OR ((grantee_id = #{everyone.id}) AND (grantee_type = 'Group'))",
                            :order => 'precedence DESC'
    )

    return acl_entry.nil? ? nil : acl_entry.role
  end

  def deep_clone

    my_clone = self.dup

    self.acl_entries.each do |acl_entry|
      my_clone.acl_entries << acl_entry.dup
    end

    return my_clone
  end

  def package

    exportable = {
        :inherits => self.inherits,
        :entries => []
    }

    self.acl_entries.each do |entry|
      next if entry.grantee.nil?
      exportable[:entries] << {
          :grantee_type => entry.grantee_type,
          :grantee_name => entry.grantee.name,
          :precedence => entry.precedence,
          :role => entry.role.name
      }
    end

    return ActiveSupport::JSON.encode(exportable)
  end

  def self.unpackage(acl, _json)

    import = ActiveSupport::JSON.decode(_json)

    logger.debug("INHERITS:> #{import['inherits']}")
    acl.inherits = import['inherits']
    acl.acl_entries.destroy_all

    import['entries'].each do |entry|
    role = acl.zone.roles.find_by_name(entry['role'])

      grantee = (entry['grantee_type'].casecmp('User') == 0) ?
           acl.zone.users.find_by_name(entry['grantee_name']) :
           acl.zone.groups.find_by_name(entry['grantee_name'])

      next if grantee.nil?

      acl.acl_entries.push << AclEntry.new(
          :role => role,
          :precedence => entry['precedence'],
          :grantee => grantee
      )

      acl.save

    end

  end

end
