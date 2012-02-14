class PropertyColumnsController < ApplicationController
  
  def get_available
    @property_column = PropertyColumn.find(params[:property_column_id])

    respond_to do |format|
      format.html { redirect_to(@property_column.library) }
      format.xml  { render :xml => @property_column }
      format.js {            
        ActiveRecord::Base.include_root_in_json = false
        render :json =>@property_column.filter_columns(true)
      }
    end
    
  end
  
  def get_used
    @property_column = PropertyColumn.find(params[:property_column_id])

    respond_to do |format|
      format.html { redirect_to(@property_column.library) }
      format.xml  { render :xml => @property_column }
      format.js {            
        ActiveRecord::Base.include_root_in_json = false
        render :json =>@property_column.filter_columns(false)
      }
    end
  end
  
  # GET /property_columns
  # GET /property_columns.xml
  def index
    @property_columns = PropertyColumn.find(:all)

    respond_to do |format|
      format.html { redirect_to root_path }
      format.xml  { render :xml => @property_columns }
      format.js {            
        ActiveRecord::Base.include_root_in_json = false
        render :json => @property_columns.to_json(:methods => [:available_columns, :used_columns])
      }
            
    end
  end
end
