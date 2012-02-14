class CreateZoneNodes < ActiveRecord::Migration
  def change
    create_table :zone_nodes do |t|
      t.integer :account_id
      t.integer :server_id
      t.string :name
      t.string :subdomain, :unique => true
      t.string :fingerprint, :unique => true
      t.string :status

      t.integer :current_users, :default => 0
      t.integer :max_users
      t.column  :current_disk_space, :bigint, :default => 0
      t.column  :max_disk_space, :bigint
      t.boolean :deployed
      t.integer :template_id

      t.timestamps
    end
  end
end
