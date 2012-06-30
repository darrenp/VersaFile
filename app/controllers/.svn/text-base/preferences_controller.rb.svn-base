class PreferencesController < ApplicationController
  # GET /preferences
  # GET /preferences.xml
  def index
    @account = get_account(params[:account_id])
    @library = @account.libraries.find(params[:library_id])
    @preferences = @library.preferences.all

    respond_to do |format|
      format.html { redirect_to @library }
      format.xml  { render :xml => @preferences }
      format.js { render :json => @preferences }
    end
  end

  # POST /preferences
  # POST /preferences.xml
  def create
    begin
      @account = get_account(params[:account_id])
      @library = @account.libraries.find(params[:library_id])
      
      Preference.transaction do
        @preference = @library.preferences.new(
          :name => params[:name],
          :value => params[:value],
          :created_by => session[:active_user].name,
          :updated_by => session[:active_user].name
        )
        
        unless @preference.save
           raise @preference.errors  
        end
      end
      
      respond_to do |format|
        format.html { redirect_to(@library) }
        format.xml  { render :xml => @preference, :status => :created, :location => @preference }
        format.js  {  
          render :json => @preference, :status => :created, :location => "/libraries/#{@library.id}/preferences/#{@preference.id}"
        }
      end
    
    rescue => e
      logger.error "Preference save failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /preferences/1
  # PUT /preferences/1.xml
  def update
    begin
      @account = current_account
      @library = @account.libraries.find(params[:library_id])
      @preference = @library.preferences.find(params[:id])
     
      Preference.transaction do
        unless @preference.update_attributes(
          :name => params[:name],
          :value => params[:value],
          :updated_at => Time.now,
          :updated_by => session[:active_user].name
        )
          raise @preference.errors
        end 
      end
      
      respond_to do |format|
        format.html { redirect_to(@library) }
        format.js { render :json => @preference, :status => :ok  }
      end 
    
    rescue => e
      logger.error "Preference update failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end
    end
    
  end

  # DELETE /preferences/1
  # DELETE /preferences/1.xml
  def destroy
    begin
      @account = current_account
      @library = @account.libraries.find(params[:library_id])
      @preference = @library.preferences.find(params[:id])
      
      Preference.transaction do
         @preference.destroy
      end
      
      respond_to do |format|
        format.html { redirect_to(preferences_url) }
        format.xml  { head :ok }
        format.js { render :json => "", :status => :ok}
      end
    
    rescue => e
      logger.error "Preference deletion failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end
    end
  end
end
