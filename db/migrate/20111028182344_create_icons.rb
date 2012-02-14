class CreateIcons < ActiveRecord::Migration
  def change
    create_table :icons do |t|
      t.string :content_type
      t.string :file_name
    end
  end
end
