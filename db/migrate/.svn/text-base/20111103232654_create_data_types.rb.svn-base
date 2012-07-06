class CreateDataTypes < ActiveRecord::Migration
  def change

    create_table(:data_types, :id => false) do |t|
      t.column :id, :integer
      t.string :name
      t.string :prefix
      t.boolean :allow_choice_list, :default => false
    end
    execute "ALTER TABLE data_types ADD PRIMARY KEY (id);"

  end



end

