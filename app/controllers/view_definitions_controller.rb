class ViewDefinitionsController < ApplicationController
  before_filter :zone_required
  # GET /view_definitions
  # GET /view_definitions.xml
  def index

    @library = @zone.libraries.find(params[:library_id])
    @view_definitions = @library.view_definitions.all(:order => "name")

    respond_to do |format|
      format.html { redirect_to @library }
      format.xml  { render :xml => @view_definitions }
      format.json { render json: @view_definitions.to_json(:include => {:cell_definitions => {:except => [:id, :library_id, :view_definition_id]}}) }
    end
  end

  # GET /view_definitions/1
  # GET /view_definitions/1.json
  def show
    @library = @zone.libraries.find(params[:library_id])
    @view_definition = @library.view_definitions.find_by_id(params[:id])

    respond_to do |format|
      format.html { redirect_to @library }
      format.xml  { render :xml => @view_definition }
      format.json { render json: @view_definition.to_json(:include => {:cell_definitions => {:except => [:id, :library_id, :view_definition_id]}}) }
    end
  end

  # POST /view_definitions
  # POST /view_definitions.xml
  def create
    
    begin
      @library = @zone.libraries.find(params[:library_id])
                
      ViewDefinition.transaction do
        @view_definition = @library.view_definitions.new(
          :name => params[:name],
          :description => params[:description],
          :scope => params[:scope],
          :sort_by => params[:sort_by],
          :is_system => params[:is_system],
          :created_by => User.find_by_id(session[:active_user_id]).name,
          :updated_by => User.find_by_id(session[:active_user_id]).name
        )

        params[:cell_definitions].each do |cell_definition|
          @view_definition.cell_definitions << @library.cell_definitions.create(
              :column_order => cell_definition[:column_order],
              :table_name => cell_definition[:table_name],
              :column_name => cell_definition[:column_name],
              :name => cell_definition[:name],
              :label => cell_definition[:label],
              :width => cell_definition[:width],
              :style => cell_definition[:style],
              :formatter => cell_definition[:formatter],
              :noresize => cell_definition[:noresize]
          )
        end

        unless @view_definition.save
           raise @view_definition.errors  
        end
     
      end
      
      respond_to do |format|
        format.html { redirect_to(@library) }
        format.xml  { render :xml => @view_definition, :status => :created, :location => @view_definition }
        format.json  { render :json => @view_definition.to_json(:include => {:cell_definitions => {:except => [:id, :library_id, :view_definition_id]}}), :status => :created, :location => @view_definition.dojo_url }
      end
                
    rescue => e    
      logger.error "View Definition save failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end                
    end    

  end

  # PUT /view_definitions/1
  # PUT /view_definitions/1.xml
  def update
    
    begin
    
      @library = @zone.libraries.find(params[:library_id])
      @view_definition = @library.view_definitions.find(params[:id])
     
      ViewDefinition.transaction do
          
        @view_definition.update_attributes(
          :name => params[:name],
          :description => params[:description],
          :scope => params[:scope],
          :sort_by => params[:sort_by],
          :updated_by => User.find_by_id(session[:active_user_id]).name
        )

        @view_definition.cell_definitions.destroy_all
        params[:cell_definitions].each do |cell_definition|
          @view_definition.cell_definitions << @library.cell_definitions.create(
              :column_order => cell_definition[:column_order],
              :table_name => cell_definition[:table_name],
              :column_name => cell_definition[:column_name],
              :name => cell_definition[:name],
              :label => cell_definition[:label],
              :width => cell_definition[:width],
              :style => cell_definition[:style],
              :formatter => cell_definition[:formatter],
              :noresize => cell_definition[:noresize]
          )
        end

        unless @view_definition.save
          raise @view_definition.errors
        end
      
      end
      
      respond_to do |format|
        format.html { redirect_to(@library) }
        format.js { render :json => @view_definition, :status => :ok  }
        format.json  { render :json => @view_definition.to_json(:include => {:cell_definitions => {:except => [:id, :library_id, :view_definition_id]}}), :status => :ok }
      end 
    
    rescue => e    
      logger.error "View Definition update failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end       
    end
    
  end

  # DELETE /view_definitions/1
  # DELETE /view_definitions/1.xml
  def destroy
    begin
      @library = @zone.libraries.find(params[:library_id])
      @view_definition = @library.view_definitions.find(params[:id])
      
      @view_definition.users.clear
      
      ViewDefinition.transaction do        
         @view_definition.destroy
      end
      
      respond_to do |format|
        format.html { redirect_to(view_definitions_url) }
        format.xml  { head :ok }
        format.js { render :json => "", :status => :ok}
      end              
                        
    rescue => e    
      logger.error "View Definition deletion failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end       
    end     
  end   
  
end
