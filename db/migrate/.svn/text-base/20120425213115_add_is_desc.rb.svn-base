class AddIsDesc < ActiveRecord::Migration
  def up

    add_column :view_definitions, :is_desc, :boolean, :default => false
    ViewDefinition.all.each do |v|
      v.update_attribute(:is_desc, false)
    end

  end

  def down
    remove_column :view_definitions, :is_desc
  end
end
