class CreateAvatars < ActiveRecord::Migration
  def change
    create_table :avatars do |t|
      t.integer :zone_id, :null => false
      t.references :imageable, :polymorphic => true
      t.string  :image_file_name, :null => false
      t.string  :image_storage_name, :null => false
      t.string  :image_content_type
      t.integer :image_file_size
      t.datetime :image_updated_at
      t.timestamps
    end
  end
end
