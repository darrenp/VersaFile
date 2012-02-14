class CreateVersions < ActiveRecord::Migration
  def change
    create_table :versions do |t|
      t.integer   :zone_id
      t.integer   :document_id
      t.string    :binary_file_name
      t.string    :binary_storage_name
      t.string    :binary_content_type
      t.integer   :binary_file_size
      t.string    :binary_uniqueness_key
      t.boolean   :is_current_version
      t.integer   :major_version_number
      t.integer   :minor_version_number
    end
  end
end
