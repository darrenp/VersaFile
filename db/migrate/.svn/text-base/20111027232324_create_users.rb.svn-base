class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.integer :zone_id
      t.string :name, :null => false
      t.boolean :is_admin, :default => false
      t.string :password, :null => false
      t.string :email
      t.string :first_name
      t.string :last_name
      t.integer :state
      t.string :created_by
      t.string :updated_by
      t.datetime :password_expires
      t.string :reset_fingerprint
      t.string :reset_password
      t.timestamps
    end
  end
end
