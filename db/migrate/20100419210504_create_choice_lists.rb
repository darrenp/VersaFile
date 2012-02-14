class CreateChoiceLists < ActiveRecord::Migration
  def self.up
    create_table :choice_lists do |t|
      t.integer :library_id
      t.string  :name
      t.string  :description
      t.integer :data_type_id
      t.string  :created_by
      t.string  :updated_by
      t.timestamps
    end
  end

  def self.down
    drop_table :choice_lists
  end
end
