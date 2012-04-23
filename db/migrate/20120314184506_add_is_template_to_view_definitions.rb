class AddIsTemplateToViewDefinitions < ActiveRecord::Migration
  def change
    add_column :view_definitions, :is_template, :boolean, :default=>true
    add_column :view_definitions, :is_desc, :boolean, :default => false

    ViewDefinition.all.each do |view_definition|
      view_definition.update_attribute(:is_desc, false)
    end

  end
end
