class UpdateSortOrder < ActiveRecord::Migration
  def up
    ViewDefinition.all.each do |vd|
      for i in 0..vd.cell_definitions.length-1
        vd.cell_definitions[i].update_attributes!(:column_order=>i)
      end
      vd.save
    end

    DocumentType.all.each do |dt|
      for i in 0..dt.property_mappings.length-1
        dt.property_mappings[i].update_attributes!(:sort_order=>i)
      end
      dt.save
    end

    ChoiceList.all.each do |cl|
      for i in 0..cl.choice_values.length-1
        cl.choice_values[i].update_attributes!(:sort_order=>i)
      end
      cl.save
    end
  end

  def down
  end
end
