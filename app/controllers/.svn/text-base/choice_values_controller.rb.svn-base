class ChoiceValuesController < ApplicationController
  before_filter :zone_required
  # GET /choice_values
  # GET /choice_values.xml
  def index
    @library = @zone.libraries.find(params[:library_id])
    if (params[:choice_list_id])
      @choice_list = @library.choice_lists.find(params[:choice_list_id])
      @choice_values = @choice_list.choice_values.all(:order => "sort_order")
    else
      @choice_values = @library.choice_values.all
    end

    respond_to do |format|
      format.html { redirect_to @library }
      format.xml  { render :xml => @choice_values }
      format.js  { render :json => @choice_values }
    end
  end

  # GET /choice_values/1
  # GET /choice_values/1.xml
  def show
    @choice_value = ChoiceValue.find(params[:id])

    respond_to do |format|
      format.html { redirect_to choice_values_path }
      format.xml  { render :xml => @choice_value }
      format.js  { render :json => @choice_value }
    end
  end

  # POST /choice_values
  # POST /choice_values.xml
  def create
    begin
      @library = @zone.libraries.find(params[:library_id])
      @choice_list = @library.choice_lists.find(params[:choice_list_id])                                  
                
      ChoiceValue.transaction do
        @choice_value = @library.choice_values.new(          
          :name => params[:name],
          :value => params[:value],
          :sort_order => params[:sort_order]           
        )
        
        @choice_list.choice_values.push(@choice_value)
        
        unless @choice_value.save
           raise @choice_value.errors  
        end
     
      end
      
      respond_to do |format|
        format.html { redirect_to(@choice_value) }
        format.xml  { render :xml => @choice_value, :status => :created, :location => @choice_value }
        format.js  {  
          render :json => @choice_value, :status => :created, :location => "/libraries/#{@library.id}/choice_values/#{@choice_value.id}"  
        }
      end
                
    rescue => e    
      logger.error "Choice Value save failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end                
    end  
  end

  # PUT /choice_values/1
  # PUT /choice_values/1.xml
  def update
    
    begin
    
      @library = @zone.libraries.find(params[:library_id])
      @choice_value = @library.choice_values.find(params[:id])     
     
      ChoiceValue.transaction do
        
        unless @choice_value.update_attributes(  
          :name => params[:name],
          :value => params[:value],
          :sort_order => params[:sort_order]
         )
          raise @choice_value.errors
        end 
                        
      end
      
      respond_to do |format|
        format.html { redirect_to(@choice_value) }
        format.js { 
          render :json => @choice_value, :status => :ok  
        }
      end 
    
    rescue => e    
      logger.error "Choice Value update failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end       
    end    

  end

  # DELETE /choice_values/1
  # DELETE /choice_values/1.xml
  def destroy
    
    begin
      @library = @zone.libraries.find(params[:library_id])
      @choice_value = @library.choice_values.find(params[:id])
      
      ChoiceValue.transaction do        
         @choice_value.destroy
      end
      
      respond_to do |format|
        format.html { redirect_to(choice_values_url) }
        format.xml  { head :ok }
        format.js { render :json => "", :status => :ok}
      end              
                        
    rescue => e    
      logger.error "Choice Value deletion failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end       
    end     
  end        
       
end
