class CreateAclEntries < ActiveRecord::Migration
  def change
    create_table :acl_entries do |t|
      t.integer :acl_id
      t.integer :role_id
      t.references :grantee, :polymorphic => true
      t.integer :precedence
    end
  end
end
