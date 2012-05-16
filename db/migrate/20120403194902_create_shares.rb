class CreateShares < ActiveRecord::Migration
  def change
    create_table :shares do |t|
      t.integer :library_id
      t.integer :folder_id
      t.string :fingerprint
      t.string :password
      t.datetime :expiry
    end
  end
end
