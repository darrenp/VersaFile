module UsersHelper


  def self.doReset(active_user, target_user, params)
    reset = {
        :doPassword => false,
        :password => nil,
        :doExpiry => false,
        :expiry => nil
    }

    #case 1: User updates an expired password OR admin user changes his/her own
    #password on the user administration screen
    #state
    # - valid "password" parameter only
    # - must be logged on as target user
    # - expiry is cleared
    #case 2: Administrator resets password on 'User Administrator' screen
    #state:
    # - valid "password" parameter only
    # - must be logged in as an administrator
    # - expiry is set (user must change on next logon)
    #case 3: User changes his/her own password on "Profile" screen
    #state:
    # - valid "password" parameter
    # - valid "old_password" parameter
    # - "old_password" verified on target user
    # - expiry is cleared
    unless params[:password].blank?
      if params[:old_password].blank? && (active_user == target_user)
          reset[:doPassword] = true
          reset[:password] = params[:password]
          reset[:doExpiry] = true
          reset[:expiry] = nil
      elsif params[:old_password].blank? && active_user.is_admin?
          reset[:doPassword] = true
          reset[:password] = params[:password]
          reset[:doExpiry] = true
          reset[:expiry] = Time.now
      else
        raise Exceptions::InvalidCredentials.new(target_user.name) unless target_user.verify_password(params[:old_password])
        reset[:doPassword] = true
        reset[:password] = params[:password]
        reset[:doExpiry] = true
        reset[:expiry] = nil
      end
    end

    return reset
  end

end
