module VersaFile

  SYSTEM_PATH = File.join(Rails.root, '..', 'system')

  configatron.versafile.mail.from = "\"VersaFile Accounts\" <accounts@versafile.com>"
  configatron.versafile.mail.account_reset.subject = "VersaFile Password Reset"
  configatron.versafile.mail.user_created.subject = "Welcome to VersaFile"
  configatron.versafile.mail.user_reset.subject = "VersaFile Password Reset"
  configatron.versafile.mail.zone_create_trial.subject = "Welcome to your {trial_period} day free trial of VersaFile"
  configatron.versafile.mail.zone_create_active.subject = "Welcome to VersaFile"
  configatron.versafile.mail.zone_upgrade_active.subject = "Welcome to VesaFile"
  configatron.versafile.mail.zone_upgrade_quota.subject = "VersaFile Account Upgrade Notification"




  module ZoneTemplates
    @@_none   = 0x0000
    @@_smb    = 0x0001

    def self.None
      @@_none
    end

    def self.SmallBusiness
      @@_smb
    end

  end

  module DiskSizes
    @@_byte     = 1
    @@_kilobyte = 1024
    @@_megabyte = 1048576
    @@_gigabyte = 1073741824
    @@_terabyte = 1099511627776
    @@_petabyte = 1125899906842624

    def self.Byte
      @@_byte
    end

    def self.Gigabyte
      @@_gigabyte
    end

    def self.Kilobyte
      @@_kilobyte
    end

    def self.Megabyte
      @@_megabyte
    end

    def self.Petabyte
      @@_petabyte
    end

    def self.Terabyte
      @@_terabyte
    end

  end

  module AccountStates
    @@_pending =   0x0000
    @@_enabled =    0x0001
    @@_reset =      0x0002
    @@_disabled =   0x4000
    @@_deleted =    0x8000

    def self.Deleted
      @@_deleted
    end

    def self.Disabled
      @@_disabled
    end

    def self.Enabled
      @@_enabled
    end

    def self.Pending
      @@_pending
    end

    def self.Reset
      @@_reset
    end

  end

  module AccountTypes
    @@_trial  = 0x00
    @@_active = 0x01

    def self.Active
      @@_active
    end

    def self.Trial
      @@_trial
    end

  end

  module TrialStates
    @@_expired = 0x0000
    @@_no_trial = -0x0001
    @@_infinite = 0xFFFF

    def self.Expired
      @@_expired
    end

    def self.NoTrial
      @@_no_trial
    end

    def self.Infinite
      @@_infinite
    end

  end

  module ZoneStates
    @@_disabled = 0x0000
    @@_enabled =  0x0001
    @@_pending = 0x0002
    @@_deleted = 0x8000

    def self.Deleted
      @@_deleted
    end

    def self.Disabled
      @@_disabled
    end

    def self.Enabled
      @@_enabled
    end

    def self.Pending
      @@_pending
    end


  end

end