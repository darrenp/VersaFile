module VersaFile

  SYSTEM_PATH = File.join('', 'data', 'VersaFile', 'system')

  configatron.versafile.mail.from = "\"VersaFile Accounts\" <accounts@versafile.com>"
  configatron.versafile.mail.account_reset.subject = "VersaFile Website Password Reset"
  configatron.versafile.mail.user_created.subject = "Welcome to VersaFile"
  configatron.versafile.mail.user_reset.subject = "VersaFile Password Reset"
  configatron.versafile.mail.zone_create_trial.subject = "Welcome to your {trial_period} day free trial of VersaFile"
  configatron.versafile.mail.zone_create_active.subject = "Welcome to VersaFile"
  configatron.versafile.mail.zone_upgrade_active.subject = "Welcome to VersaFile"
  configatron.versafile.mail.zone_upgrade_quota.subject = "VersaFile Account Upgrade Notification"

  configatron.versafile.dropbox.app_key = "utjo1v2e4xal91h"
  configatron.versafile.dropbox.app_secret = "q5eyeavqrg74sws"
  configatron.versafile.dropbox.access_type = :app_folder

  #folders are sorted by types (descending order)
  #gaps between indices are there to insert
  #new folder types if needed.
  module FolderTypes
    @@_root             = 0x0000
    @@_content          = 0x0001
    @@_share_root       = 0x0010
    @@_share            = 0x0011
    @@_dropbox_root     = 0x0014
    @@_dropbox_account  = 0x0015
    @@_dropbox_folder   = 0x0016
    @@_search           = 0x0020
    @@_trash            = 0x0040
    @@_error            = 0xFFFF

    def self.DropboxRoot
      @@_dropbox_root
    end

    def self.DropboxAccount
      @@_dropbox_account
    end

    def self.DropboxFolder
      @@_dropbox_folder
    end

    def self.Content
      @@_content
    end

    def self.Error
      @@_error
    end

    def self.Root
      @@_root
    end

    def self.Search
      @@_search
    end

    def self.Share
      @@_share
    end

    def self.ShareRoot
      @@_share_root
    end

    def self.Trash
      @@_trash
    end

  end

  module ReferenceTypes
    @@_content =  0x0000
    @@_share =    0x0011
    @@_trash =    0x0040

    def self.Content
      @@_content
    end

    def self.Share
      @@_share
    end

    def self.Trash
      @@_trash
    end
  end

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