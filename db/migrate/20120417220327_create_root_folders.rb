class CreateRootFolders < ActiveRecord::Migration
  def up

    Library.all.each do |library|
      Library.transaction do
        puts "Updating:> #{library.name}"

        #change type on existing 'Content' folders
        puts "Resetting folder types..."
        library.folders.all.each do |folder|
          folder.update_attribute(:folder_type, VersaFile::FolderTypes.Content) if (folder.folder_type.nil?) || (folder.folder_type == 0)
        end
        puts "done."

        #create root folder
        puts "Creating root folder object..."
        root_folder = zone.folders.create(
            :library => library,
            :name => library.name,
            :folder_type => VersaFile::FolderTypes.Root,
            :created_by => library.created_by,
            :updated_by => library.created_by,
            :parent_id => nil?
        )
        puts "done."

        #set all existing root-level children to be children of the root.
        puts "Resetting root folder children..."
        subfolders = library.folders.where(:parent_id => 0).each do |subfolder|
          subfolder.update_attribute(:parent_id, root_folder.id)
        end
        puts "done."

      end

    end

  end

  def down
  end
end
