class CreateGroups < ActiveRecord::Migration
  def change
    create_table :groups do |t|
      t.integer :zone_id
      t.string  :name
      t.string  :description, :limit => 255
      t.boolean :is_admin, :default => false
      t.boolean :is_everyone, :default => false
      t.string  :created_by
      t.string  :updated_by
      t.timestamps
    end
  end
end
