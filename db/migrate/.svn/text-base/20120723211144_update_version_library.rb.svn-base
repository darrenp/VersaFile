class UpdateVersionLibrary < ActiveRecord::Migration
  def up
    @zones=Zone.all

    @zones.each do |zone|
      zone.libraries.each do |library|
        library.documents.each do |document|
          document.versions.each do |version|
            if(version.library_id == nil)
              version.library=library
              version.save
              #puts "Zone: #{version.zone_id} Library: #{version.library_id} Document: #{version.document_id} Version: #{version.id}"
            end
          end
        end
      end
    end
  end

  def down
  end
end
