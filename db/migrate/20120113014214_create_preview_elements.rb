class CreatePreviewElements < ActiveRecord::Migration
  def change
    create_table :preview_elements do |t|
      t.integer :zone_id
      t.string :content_type
      t.text :element_template
      t.boolean :maintain_aspect_ratio, :default => false
      t.string  :created_by
      t.string :updated_by
      t.timestamps
    end
  end
end
