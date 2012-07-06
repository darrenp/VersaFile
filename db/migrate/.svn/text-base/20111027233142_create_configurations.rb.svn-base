class CreateConfigurations < ActiveRecord::Migration
  def change
    create_table :configurations do |t|
      t.integer :zone_id, :null => false
      t.references :configurable, :polymorphic => true
    end
  end
end
