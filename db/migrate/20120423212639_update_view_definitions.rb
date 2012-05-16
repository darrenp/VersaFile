class UpdateViewDefinitions < ActiveRecord::Migration
  def up
    @view_definitions=ViewDefinition.all

    @view_definitions.each do |vd|
      vd.cell_definitions.each do |cd|
        if(!((cd.table_name=="documents"&&cd.column_name=="state")||
          (cd.table_name=="versions"&&cd.column_name=="binary_content_type")))
          if(cd.width=="auto")
            cd.update_attributes!(:width=>"256px")
          end
          cd.update_attributes!(:noresize=>false)

          cd.save
        end
      end
    end
  end

  def down
  end
end
