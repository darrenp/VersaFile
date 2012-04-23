class UpdateFolderTypes < ActiveRecord::Migration
  def up

    change_table :folders do |t|
      t.integer :folder_type
    end

    Folder.all.each do |f|

      folder_type = VersaFile::FolderTypes.Content
      folder_type = VersaFile::FolderTypes.Trash if f.is_trash
      folder_type = VersaFile::FolderTypes.Search if f.is_search

      f.update_attribute(:folder_type, folder_type)

    end

    remove_column :folders, :is_search
    remove_column :folders, :is_trash

    Folder.reset_column_information

    Library.all.each do |l|
      l.zone.folders.create(
          :library => l,
          :name => 'Shares',
          :folder_type => VersaFile::FolderTypes.ShareRoot,
          :created_by => l.created_by,
          :updated_by => l.updated_by,
          :parent_id => 0
      )
    end

  end

  def down

    Folder.destroy_all(:folder_type => VersaFile::FolderTypes.Share)

    change_table :folders do |t|
      t.integer :is_search
      t.integer :is_trash
    end

    Folder.reset_column_information

    Folder.all.each do |f|

      is_search = (f.folder_type == VersaFile::FolderTypes.Search)
      is_trash = (f.folder_type == VersaFile::FolderTypes.Trash)

      f.update_attributes(
          :is_search => is_search,
          :is_trash => is_trash
      )

    end

    remove_column :folders, :folder_type

  end

end
