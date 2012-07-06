class CellDefinitionsController < ApplicationController
  before_filter :zone_required

  # GET /cell_definitions
  # GET /cell_definitions.xml
  def index
    
    @library = @zone.libraries.find(params[:library_id])

    if(params[:view_definition_id])
      @cell_definitions = @library.view_definitions.find_by_id(params[:view_definition_id]).cell_definitions.all(:order => "column_order ASC")
    else
      @cell_definitions = @library.cell_definitions.all(:order => "column_order ASC")
    end
    
    respond_to do |format|
      format.html { redirect_to @library }
      format.xml  { render :xml => @cell_definitions }
      format.js  { render :json => @cell_definitions }
    end
    
  end

  # POST /cell_definitions
  # POST /cell_definitions.xml
  def create
    
     begin
      @library = @zone.libraries.find(params[:library_id])
                
      CellDefinition.transaction do
        @cell_definition = @library.cell_definitions.new(
          :view_definition_id => params[:view_definition_id],
          :table_name => params[:table_name],
          :column_name => params[:column_name],
          :name => params[:name],
          :label => params[:label],
          :formatter => params[:formatter],
          :noresize => params[:noresize],
          :width => params[:width],
          :style => params[:style],
          :date_format => params[:date_format],
          :column_order => params[:column_order]
        )

        unless @cell_definition.save
           raise @cell_definition.errors  
        end
     
      end
   
      
      respond_to do |format|
        format.html { redirect_to(@cell_definition) }
        format.xml  { render :xml => @cell_definition, :status => :created, :location => @view_definition }
        format.js  {  
          render :json => @cell_definition, :status => :created, :location => "/libraries/#{@library.id}/cell_definitions/#{@cell_definition.id}"  
        }
      end
    
    rescue => e    
      logger.error "Cell Definition save failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end            
    end    
  end

  # PUT /cell_definitions/1
  # PUT /cell_definitions/1.xml
  def update
    begin
    
      @library = @zone.libraries.find(params[:library_id])
      @cell_definition = @library.cell_definitions.find(params[:id])
     
      CellDefinition.transaction do
          
        unless @cell_definition.update_attributes(
          :label => params[:label],
          :width => params[:width],
          :date_format => params[:date_format],
          :column_order => params[:column_order]
        )
          raise @cell_definition.errors
        end 
      
      end
      
      respond_to do |format|
        format.html { redirect_to(@cell_definition) }
        format.js { render :json => @cell_definition, :status => :ok  }
      end 
    
    rescue => e    
      logger.error "Cell Definition update failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end       
    end
       
  end

  # DELETE /cell_definitions/1
  # DELETE /cell_definitions/1.xml
  def destroy
    
    begin
      @library = @zone.libraries.find(params[:library_id])
      @cell_definition = @library.cell_definitions.find(params[:id])
      
      CellDefinition.transaction do        
         @cell_definition.destroy
      end
      
      respond_to do |format|
        format.html { redirect_to(cell_definitions_url) }
        format.xml  { head :ok }
        format.js { render :json => "", :status => :ok}
      end              
                        
    rescue => e    
      logger.error "Cell Definition deletion failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end       
    end
    
  end
end
