class CreatePropertyDefinitions < ActiveRecord::Migration
  def change
    create_table :property_definitions do |t|
      t.integer   :library_id
      t.integer   :data_type_id
      t.string    :name
      t.text      :description
      t.string    :table_name
      t.string    :column_name
      t.integer   :cardinality
      t.integer   :max_length
      t.boolean   :is_system
      t.boolean   :is_readonly
      t.boolean   :is_name, :default => false
      t.string    :created_by
      t.string    :updated_by
      t.timestamps
    end
  end
end
