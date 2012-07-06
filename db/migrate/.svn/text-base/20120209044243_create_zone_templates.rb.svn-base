class CreateZoneTemplates < ActiveRecord::Migration
  def change

    create_table(:zone_templates, :id => false) do |t|
      t.column :id, :integer
      t.string :name
      t.string :folder_name
    end
    execute "ALTER TABLE zone_templates ADD PRIMARY KEY (id);"

  end
end
