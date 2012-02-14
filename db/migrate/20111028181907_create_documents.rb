class CreateDocuments < ActiveRecord::Migration

  def self.up
    create_table :documents, :options => 'ENGINE=MyISAM'  do |t|
      t.integer :zone_id
      t.integer :library_id
      t.integer :folder_id

      #System owned properties
      t.string :name, :null => false
      t.integer :document_type_id, :null => false
      t.string :checked_out_by
      t.string :created_by
      t.string :updated_by
      t.column  :state, "bigint unsigned", :default => Bfree::DocumentStates.None
      t.text    :description
      t.column    :body, :longtext
      t.column    :metadata, :text
      t.column    :custom_metadata, :text

      #Create custom property columns
      #Strings
      Bfree::ColumnMaximum.StringMax.times do |n|
        column_name = "prp_str%03d" % (n + 1)
        t.string column_name
      end

      #Booleans
      Bfree::ColumnMaximum.BooleanMax.times do |n|
        column_name = "prp_bln%03d" % (n + 1)
        t.boolean column_name
      end

      #Integers
      Bfree::ColumnMaximum.IntegerMax.times do |n|
        column_name = "prp_int%03d" % (n + 1)
        t.integer column_name
      end

      #Floats
      Bfree::ColumnMaximum.FloatMax.times do |n|
        column_name = "prp_flt%03d" % (n + 1)
        t.float column_name
      end

      #Dates
      Bfree::ColumnMaximum.DateTimeMax.times do |n|
        column_name = "prp_dtt%03d" % (n + 1)
        t.datetime column_name
      end

      #Text
      Bfree::ColumnMaximum.TextMax.times do |n|
        column_name = "prp_txt%03d" % (n + 1)
        t.text column_name
      end

      t.timestamps
    end

    execute "CREATE FULLTEXT INDEX fulltext_document ON documents (body,metadata,custom_metadata)"
  end

  def self.down
    drop_table :documents
  end

end
