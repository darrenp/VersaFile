class CreateServers < ActiveRecord::Migration
  def change
    create_table :servers do |t|
      t.string :name
      t.string :protocol
      t.string :host
      t.integer :port
      t.boolean :active, :default => false
      t.boolean :current, :default => false
      t.timestamps
    end
  end
end
