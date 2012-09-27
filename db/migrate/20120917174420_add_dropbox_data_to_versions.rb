class AddDropboxDataToVersions < ActiveRecord::Migration
  def change
    add_column :versions, :dropbox_uid, :integer
    add_column :versions, :dropbox_path, :text
  end
end
