class CreateContentTypes < ActiveRecord::Migration
  def change
    create_table :content_types do |t|
      t.string :binary_content_type
      t.string :open_as
    end
  end
end
