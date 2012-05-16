class CreateReferences < ActiveRecord::Migration

  def up
    create_table :references do |t|
      t.integer :reference_type
      t.integer :library_id
      t.integer :folder_id
      t.integer :document_id
    end

    Document.all.each do |d|
      r = Reference.create(
            :reference_type => d.deleted? ?  VersaFile::ReferenceTypes.Trash : VersaFile::ReferenceTypes.Content,
            :library => d.library,
            :folder_id => d.folder_id.nil? ? 0 : d.folder_id,
            :document => d
        )

      unless d.acl.nil?
        r.acl = d.acl.deep_clone
        r.save
        d.acl.destroy
      end

    end

    remove_column :documents, :folder_id
  end

  def down

    change_table :documents do |t|
      t.integer :folder_id
    end

    Reference.all.each do |r|
      r.document.folder_id = r.folder.nil? ? 0 : r.folder.id
      r.document.acl = r.acl.deep_clone
      r.document.save
      r.acl.destroy
    end

    drop_table :references
  end

end
