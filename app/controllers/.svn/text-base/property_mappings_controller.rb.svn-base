class PropertyMappingsController < ApplicationController
  before_filter :zone_required
  # GET /property_mappings
  # GET /property_mappings.xml
  def index
    @library = @zone.libraries.find_by_id(params[:library_id])
    @property_mappings = @library.property_mappings.find(:all)

    respond_to do |format|
      format.html { redirect_to @library }
      format.xml  { render :xml => @property_mappings }
      format.js {
        ActiveRecord::Base.include_root_in_json = false
        render :json => @property_mappings  #.to_json(:include => :property_definition)
      }
    end    
    
  end

  # POST /property_mappings
  # POST /property_mappings.xml
  def create
    begin
      @account = get_account(params[:account_id])
      @library = @account.libraries.find(params[:library_id])
      
      PropertyMapping.transaction do
        @property_mapping = @library.property_mappings.new(
          :document_type_id => params[:document_type_id],
          :property_definition_id => params[:property_definition_id],
          :sort_order => params[:sort_order],
          :is_required => params[:is_required]
        )
        
        unless @property_mapping.save
           raise @property_mapping.errors 
        end
        
      end

      respond_to do |format|
        format.html { redirect_to(@library) }
        format.xml  { render :xml => @property_mapping, :status => :created, :location => @property_mapping }  
        format.js  {
          render :json => @property_mapping, :status => :created, :location => "/libraries/#{@library.id}/property_mappings#{@property_mapping.id}" 
        }
      end
             
    rescue => e    
      logger.error "Property Mapping update failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end                
    end
        
  end

  # PUT /property_mappings/1
  # PUT /property_mappings/1.xml
  def update
    
    begin
      @account = get_account(params[:account_id])
      @library = @account.libraries.find(params[:library_id])
      @property_mapping = @library.property_mappings.find(params[:id])
      
      PropertyMapping.transaction do
          
          unless @property_mapping.update_attributes(
              :choice_list_id => params[:choice_list_id],
              :default_value => params[:default_value],
              :sort_order => params[:sort_order],
              :is_required => params[:is_required]
            )
                raise @property_mapping.errors                              
          end

      end
      
      respond_to do |format|
        format.html { redirect_to(@library) }
        format.xml  { head :ok }
        format.js {         
          render :json => @property_mapping, :status => :ok  
        } 
      end
      
    rescue => e    
      logger.error "Property Mapping update failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end                
    end
    
  end

  # DELETE /property_mappings/1
  # DELETE /property_mappings/1.xml
  def destroy
    
    begin
      @account = current_account
      @library = @account.libraries.find(params[:library_id])               
      @property_mapping = @library.property_mappings.find(params[:id])

      PropertyMapping.transaction do
        @property_mapping.destroy unless @property_mapping.blank?        
      end
 
      respond_to do |format|
        format.html { redirect_to(property_mappings_url) }
        format.xml  { head :ok }
        format.js { render :json => "", :status => :ok}
      end              
           
    rescue ActiveRecord::RecordNotFound
      respond_to do |format|
        format.html { redirect_to(property_mappings_url) }
        format.xml  { head :ok }
        format.js { render :json => "", :status => :ok}
      end   
    rescue => e    
      logger.error "Property Mapping deletion failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end       
    end     
  end     
       
end
