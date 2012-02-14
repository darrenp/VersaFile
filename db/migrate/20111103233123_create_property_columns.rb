class CreatePropertyColumns < ActiveRecord::Migration
  def change
    create_table :property_columns do |t|
      t.integer :library_id
      t.integer :data_type_id
      t.column  :column_mask, :bigint, :default => 0
      t.integer :max_columns
    end
  end
end
