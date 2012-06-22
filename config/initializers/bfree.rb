require 'mimetype_fu'
require 'pony'
require 'shellwords'
require 'csv'
require 'prawn'

configatron.bfree.major_version = 2
configatron.bfree.minor_version = 12
configatron.bfree.revision_number = 6
configatron.bfree.build_number = 2202

configatron.dojo.version = ((Rails.env == 'development') ? '1.6.1.d' : '1.6.1.p')
configatron.mobile.dojo.version = ((Rails.env == 'development') ? '1.7.2.d' : '1.7.2.p')

configatron.admin.reserved.subdomains=["admin", "mysql", "dev", "vf1"]

configatron.bfree.mail.support = "support@versafile.com"
configatron.bfree.mail.from = "\"VersaFile Accounts\" <accounts@versafile.com>"

Pony.options = {:via => :smtp, :via_options => {
  :address              => 'versamail.versafile.com',
  :port                 => '25999',
  :enable_starttls_auto => true,
  :user_name            => 'VersaFileService',
  :password             => 'BFreeItWas2011!',
  :authentication       => :login #:plain#, # :plain, :login, :cram_md5, no auth by default
  #:domain               => "localhost.localdomain" # the HELO domain provided by the client to the server
}}

module Bfree

  module SearchTypes
    @@_none = 0
    @@_folder = 1
    @@_simple = 2
    @@_advanced = 3
    @@_trash = 4

    def self.None
      @@_none
    end

    def self.Folder
      @@_folder
    end

    def self.Simple
      @@_simple
    end

    def self.Advanced
      @@_advanced
    end

    def self.Trash
      @@_trash
    end

  end

  module Cardinality
    @@_void = 0
    @@_single = 1
    @@_multiple = 2

    def self.Single
      @@_single
    end

    def self.Multiple
      @@_multiple
    end

  end

  module ColumnMaximum
    @@_string = 64
    @@_boolean = 24
    @@_integer = 16
    @@_float = 16
    @@_datetime = 16
    @@_text = 8

    def self.BooleanMax
      @@_boolean
    end

    def self.DateTimeMax
      @@_datetime
    end

    def self.FloatMax
      @@_float
    end

    def self.IntegerMax
      @@_integer
    end

    def self.StringMax
      @@_string
    end

    def self.TextMax
      @@_text
    end

  end

  module DataTypes
    @@_void = 0
    @@_boolean = 1
    @@_integer = 2
    @@_float = 3
    @@_datetime = 4
    @@_string = 5
    @@_text = 6

    def self.Void
      @@_void
    end

    def self.Boolean
      @@_boolean
    end

    def self.Integer
      @@_integer
    end

    def self.Float
      @@_float
    end

    def self.DateTime
      @@_datetime
    end

    def self.String
      @@_string
    end

    def self.Text
      @@_text
    end

  end

  module Acl

    module Permissions
      @@_none =           0x00000000
      @@_view =           0x00000001
      @@_read_metadata =  0x00000002
      @@_write_metadata = 0x00000004
      @@_version =        0x00000008
      @@_create_files =   0x00000010
      @@_create_folders = 0x00000020
      @@_create_views =   0x00000040
      @@_delete =         0x00000080
      @@_read_acl =       0x00000100
      @@_write_acl =      0x00000200
      @@_admin =          0x7FFFFFFF

      def self.None
        @@_none
      end
      def self.View
        @@_view
      end
      def self.ReadMetadata
        @@_read_metadata
      end
      def self.WriteMetadata
        @@_write_metadata
      end
      def self.Version
        @@_version
      end
      def self.CreateFiles
        @@_create_files
      end
      def self.CreateFolders
        @@_create_folders
      end
      def self.CreateViews
        @@_create_views
      end
      def self.Delete
        @@_delete
      end
      def self.ReadACL
        @@_read_acl
      end
      def self.WriteACL
        @@_write_acl
      end
      def self.Admin
        @@_admin
      end
    end

    module PrecedenceTypes
      @@_unknown      = 0x0000
      @@_everyone     = 0x0001
      @@_named_group  = 0x0010
      @@_named_user   = 0x0100

      def self.Unknown
        @@_unknown
      end

      def self.Everyone
        @@_everyone
      end

      def self.NamedGroup
        @@_named_group
      end

      def self.NamedUser
        @@_named_user
      end

    end

    module Roles
      @@_none =     Permissions.None
      @@_viewer =   Permissions.View |
                    Permissions.ReadMetadata |
                    Permissions.CreateViews |
                    Permissions.ReadACL
      @@_author =   Permissions.View |
                    Permissions.ReadMetadata |
                    Permissions.WriteMetadata |
                    Permissions.Version |
                    Permissions.CreateFiles |
                    Permissions.CreateFolders |
                    Permissions.CreateViews |
                    Permissions.ReadACL
      @@_owner =    Permissions.View |
                    Permissions.ReadMetadata |
                    Permissions.WriteMetadata |
                    Permissions.Version |
                    Permissions.CreateFiles |
                    Permissions.CreateFolders |
                    Permissions.CreateViews |
                    Permissions.Delete |
                    Permissions.ReadACL |
                    Permissions.WriteACL
      @@_admin =    Permissions.Admin

      def self.None
        @@_none
      end
      def self.Viewer
        @@_viewer
      end
      def self.Author
        @@_author
      end
      def self.Owner
        @@_owner
      end
      def self.Admin
        @@_admin
      end

    end

  end

  module DocumentStates

    @@_none =         0x0000
    @@_pending =      0x0001
    @@_uploaded =     0x0002
    @@_busy =         0x0004
    @@_indexed  =     0x0010
    @@_checked_in =   0x0020
    @@_checked_out =  0x0040
    @@_invalid =      0x0400
    @@_deleted =      0x0800
    @@_error =        0xFFFF


    def self.to_string(state)
      if(state&DocumentStates.CheckedIn==DocumentStates.CheckedIn)
        return "checked in"
      elsif(state&DocumentStates.CheckedOut==DocumentStates.CheckedOut)
        return "checked out"
      elsif(state&DocumentStates.Busy==DocumentStates.Busy)
        return "busy"
      elsif(state&DocumentStates.Deleted==DocumentStates.Deleted)
        return "deleted"
      elsif(state&DocumentStates.Pending==DocumentStates.Pending)
        return "pending"
      end
    end

    def self.None
      @@_none
    end

    def self.Busy
      @@_busy
    end

    def self.Pending
      @@_pending
    end

    def self.Uploaded
        @@_uploaded
    end

    def self.Indexed
      @@_indexed
    end

    def self.CheckedIn
      @@_checked_in
    end

    def self.CheckedOut
      @@_checked_out
    end

    def self.Invalid
      @@_invalid
    end

    def self.Deleted
      @@_deleted
    end

  end

  module ViewFormats
    @@_none = 0
    @@_icon = 1
    @@_size = 2
    @@_state = 4

    def self.None
      @@_none
    end

    def self.Icon
      @@_icon
    end

    def self.Size
      @@_size
    end

    def self.State
      @@_state
    end

  end

  module Cardinality
    @@_void = 0
    @@_single = 1
    @@_multiple = 2

    def self.Single
      @@_single
    end

    def self.Multiple
      @@_multiple
    end

  end

  module DataTypes
    @@_void = 0
    @@_boolean = 1
    @@_integer = 2
    @@_float = 3
    @@_datetime = 4
    @@_string = 5
    @@_text = 6

    def self.Void
      @@_void
    end

    def self.Boolean
      @@_boolean
    end

    def self.Integer
      @@_integer
    end

    def self.Float
      @@_float
    end

    def self.DateTime
      @@_datetime
    end

    def self.String
      @@_string
    end

    def self.Text
      @@_text
    end

  end

end
