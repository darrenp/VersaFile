class UpdateDocumentsColumns < ActiveRecord::Migration
  def up

    change_table :documents do |t|

      #Strings
      Bfree::ColumnMaximum.StringMax.times do |n|
        column_name = "prp_str%03d" % (n + 1)
        unless Document.column_names.include? column_name
          puts "CREATING:> #{column_name}"
          t.string column_name
        end
      end

      #Booleans
      Bfree::ColumnMaximum.BooleanMax.times do |n|
        column_name = "prp_bln%03d" % (n + 1)
        unless Document.column_names.include? column_name
          puts "CREATING:> #{column_name}"
          t.boolean column_name
        end
      end

      #Integers
      Bfree::ColumnMaximum.IntegerMax.times do |n|
        column_name = "prp_int%03d" % (n + 1)
        unless Document.column_names.include? column_name
          puts "CREATING:> #{column_name}"
          t.integer column_name
        end
      end

      #Floats
      Bfree::ColumnMaximum.FloatMax.times do |n|
        column_name = "prp_flt%03d" % (n + 1)
        unless Document.column_names.include? column_name
          puts "CREATING:> #{column_name}"
          t.float column_name
        end
      end

      #Dates
      Bfree::ColumnMaximum.DateTimeMax.times do |n|
        column_name = "prp_dtt%03d" % (n + 1)
        unless Document.column_names.include? column_name
          puts "CREATING:> #{column_name}"
          t.datetime column_name
        end
      end

      #Text
      Bfree::ColumnMaximum.TextMax.times do |n|
        column_name = "prp_txt%03d" % (n + 1)
        unless Document.column_names.include? column_name
          puts "CREATING:> #{column_name}"
          t.text column_name
        end
      end
    end

  end

  def down
  end

end
