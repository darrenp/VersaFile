class CreateCellDefinitions < ActiveRecord::Migration
  def self.up
    create_table :cell_definitions do |t|
      t.integer   :library_id
      t.integer   :view_definition_id
      t.string    :table_name
      t.string    :column_name
      t.string    :name
      t.string    :label
      t.integer   :formatter
      t.boolean   :noresize
      t.string    :width
      t.string    :style
      t.integer   :column_order
      t.string    :date_format
    end
  end

  def self.down
    drop_table :cell_definitions
  end
end
