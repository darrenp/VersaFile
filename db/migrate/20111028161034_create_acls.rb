class CreateAcls < ActiveRecord::Migration
  def change
    create_table :acls do |t|
      t.integer :zone_id, :null => false
      t.references :securable, :polymorphic => true
      t.boolean :inherits
    end
  end
end
