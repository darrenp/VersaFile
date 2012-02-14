class CreatePropertyMappings < ActiveRecord::Migration
  def change
    create_table :property_mappings do |t|
      t.integer :document_type_id
      t.integer :property_definition_id
      t.integer :sort_order
      t.boolean :is_required
      t.string  :default_value
      t.integer :choice_list_id
    end
  end
end
