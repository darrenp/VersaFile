class UpdateShareRootAcls < ActiveRecord::Migration
  def up

    Folder.transaction do

      #Change ACL on shared root to be 'Admins' = 'Admin', 'Everyone' = 'None'
      #Users won't be able to share until admin enables access
      Folder.where(:folder_type => VersaFile::FolderTypes.ShareRoot).each do |share_root|
        puts ("Updating ACL on Share Root for library #{share_root.library.name}")
        my_zone = share_root.library.zone
        share_root.acl = my_zone.acls.create(
          :inherits => false,
          :acl_entries => [
            AclEntry.create(:grantee => my_zone.groups.admins.first, :role => my_zone.roles.admins.first, :precedence => Bfree::Acl::PrecedenceTypes.NamedGroup),
            AclEntry.create(:grantee => my_zone.groups.everyones.first, :role => my_zone.roles.none, :precedence => Bfree::Acl::PrecedenceTypes.Everyone)
          ]
        )
        share_root.save
      end

    end

  end

  def down
  end
end
