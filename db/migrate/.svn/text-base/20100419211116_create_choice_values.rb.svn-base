class CreateChoiceValues < ActiveRecord::Migration
  def self.up
    create_table :choice_values do |t|
      t.integer :choice_list_id
      t.string  :value
      t.string  :name
      t.integer :sort_order      
    end
  end

  def self.down
    drop_table :choice_values
  end
end
