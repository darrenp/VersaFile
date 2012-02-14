class CreateViewDefinitions < ActiveRecord::Migration
  def self.up
    create_table :view_definitions do |t|
      t.integer :library_id
      t.string  :name
      t.string  :description
      t.string  :scope
      t.string  :sort_by
      t.boolean :is_system, :default => false
      t.string  :created_by
      t.string  :updated_by
      
      t.timestamps
    end
  end

  def self.down
    drop_table :view_definitions
  end
end
