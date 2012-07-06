class CreateDocumentTypes < ActiveRecord::Migration
  def change
    create_table :document_types do |t|
      t.integer :library_id
      t.string :name
      t.text    :description
      t.boolean :is_system, :default => false
      t.string  :created_by
      t.string :updated_by
      t.timestamps
    end
  end
end
