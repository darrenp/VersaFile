class CreateAccounts < ActiveRecord::Migration
  def change
    create_table :accounts do |t|
      t.string      :email, :null => false, :unique => true
      t.string      :customer_code
      t.string      :name, :null => false, :unique => true
      t.string      :first_name
      t.string      :last_name
      t.string      :address
      t.string      :city
      t.string      :postal_code, :limit => 32
      t.string      :province, :limit => 8
      t.string      :country, :limit => 8
      t.string      :phone, :limit => 32
      t.integer     :billing_type
      t.integer     :account_type
      t.integer     :trial_period
      t.string      :password, :limit => 64
      t.integer     :status, :default => 0
      t.string      :created_by
      t.string      :updated_by
      t.timestamps
    end
  end
end
