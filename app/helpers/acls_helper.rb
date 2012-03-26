module AclsHelper

  def self.get_grantee(zone, grantee_type, grantee_id)

    grantee = (grantee_type.downcase == 'user') ?
                zone.users.find_by_id(grantee_id) :
                zone.groups.find_by_id(grantee_id)

    return grantee
  end

  def self.get_precedence(grantee)

    precedence = Bfree::Acl::PrecedenceTypes.Unknown

    if grantee.is_a?(Group)
      precedence = grantee.is_everyone ?
                    Bfree::Acl::PrecedenceTypes.Everyone :
                    Bfree::Acl::PrecedenceTypes.NamedGroup
    else
      precedence = Bfree::Acl::PrecedenceTypes.NamedUser
    end

    return precedence
  end

end


