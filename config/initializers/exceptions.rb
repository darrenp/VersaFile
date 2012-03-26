if __FILE__ == $0
  # TODO Generate stub
end

module Exceptions

  class AuthorizationRequired < StandardError;

  end

  class InvalidSubdomain < StandardError;
    attr :subdomain

    def initialize(subdomain)
      super()
      @subdomain = subdomain
    end

    def message()
      return "Invalid subdomain: '#{self.subdomain}'"
    end

  end

  class InvalidCredentials < StandardError;
    attr :username

    def initialize(username)
      super()
      @username = username
    end

    def message()
      return 'Invalid username or password'
    end

  end

  class SessionExpired < StandardError;

  end

  class TrialExpired < StandardError;

    def message()
      return "Your trial period has expired."
    end

  end

  class UserDisabled < StandardError;
    attr :username

    def initialize(username)
      super()
      @username = username
    end

    def message()
      return "The user '#{self.username}' has been disabled."
    end
  end

  class PermissionError < StandardError
    attr :acl_permission
    attr :username

    def initialize(username, permission)
      super()
      @username = username
      @acl_permission = permission
    end

    def message()
      return "The user '#{self.username}' does not have permission to this action"
    end

  end


end