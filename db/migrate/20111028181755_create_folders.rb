class CreateFolders < ActiveRecord::Migration
  def change
    create_table :folders do |t|
      t.integer :zone_id
      t.integer :library_id
      t.integer :parent_id
      t.string :name, :null => false
      t.boolean :is_trash, :default => false
      t.boolean :is_search, :default => false
      t.string :created_by
      t.string :updated_by
      t.timestamps
    end
  end
end
