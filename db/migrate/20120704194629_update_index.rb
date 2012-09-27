class UpdateIndex < ActiveRecord::Migration
  def up
    @documents=Document.all

    @documents.each do |document|
      if(document!=nil)

        puts "#{document.id}:#{document.name}"

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
