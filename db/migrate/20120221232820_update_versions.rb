class UpdateVersions < ActiveRecord::Migration

  def up
    change_table :versions do |t|
      t.integer :library_id
    end

    Version.all.each do |v|
      v.update_attribute(:library, v.document.library)
    end

  end

  def down
    remove_column :versions, :library_id
  end

end
