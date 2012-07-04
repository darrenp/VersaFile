class CreateZones < ActiveRecord::Migration
  def change
    create_table :zones do |t|
      t.string :subdomain, :unique => true
      t.string :name
      t.string :fingerprint
      t.string :created_by
      t.string :updated_by
      t.timestamps
    end
  end
end
