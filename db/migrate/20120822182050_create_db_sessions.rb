class CreateDbSessions < ActiveRecord::Migration
  def change
    create_table :db_sessions do |t|
      t.integer :zone_id
      t.integer :library_id
      t.integer :dropbox_uid
      t.text :session

      t.timestamps
    end
  end
end
