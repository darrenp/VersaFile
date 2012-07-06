class UpdateIndex < ActiveRecord::Migration
  def up
    @documents=Document.all

    @documents.each do |document|
      if(document!=nil)
        document.body=""
        document.metadata=""
        document.save
        document.delay.extract_content()
      end
    end
  end

  def down
  end
end
