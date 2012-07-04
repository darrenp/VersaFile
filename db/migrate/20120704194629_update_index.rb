class UpdateIndex < ActiveRecord::Migration
  def up
    @documents=Document.all

    @documents.each do |document|
      document.delay.extract_content()
    end
  end

  def down
  end
end
