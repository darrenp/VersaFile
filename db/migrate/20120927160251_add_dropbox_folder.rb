class AddDropboxFolder < ActiveRecord::Migration
  def up
    Library.all.each do |library|
      if(library.folders.find_by_folder_type(VersaFile::FolderTypes.DropboxRoot)==nil)
        folder=library.folders.new(
          :zone=>library.zone,
          :parent_id=>library.root_folder.id,
          :name=>'Dropbox',
          :created_by=>'admin',
          :updated_by=>'admin',
          :folder_type=>VersaFile::FolderTypes.DropboxRoot
        )
        folder.save
      end
    end
  end

  def down
    folders=Folder.find_all_by_folder_type(VersaFile::FolderTypes.DropboxRoot)
    folders.destroy
  end
end
