class CreateLibraries < ActiveRecord::Migration
  def change
    create_table :libraries do |t|
      t.integer :zone_id
      t.string  :name
      t.string  :description
      t.string  :created_by
      t.string  :updated_by
      t.timestamps
    end
  end
end
