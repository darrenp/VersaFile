class AddDropboxDataToFolder < ActiveRecord::Migration
  def change
    add_column :folders, :dropbox_uid, :integer
    add_column :folders, :dropbox_path, :text
  end
end
