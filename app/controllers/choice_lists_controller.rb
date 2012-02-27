class ChoiceListsController < ApplicationController
  before_filter :library_required
  before_filter :authorization_required

  def metrics
    begin
      @library = @zone.libraries.find(params[:library_id])
      @choice_list = @library.choice_lists.find(params[:choice_list_id])

      @property_mapping_count = @choice_list.property_mappings.count
      
      respond_to do |format|       
        format.js {                      
          render :json => {
              :property_mapping_count => @property_mapping_count
          }, :status => :ok
        }
      end               
                        
    rescue => e    
      logger.error "Choice List metrics retrieval failed => #{e.message}"
      respond_to do |format|
        format.js { render :json => e.message, :status => :unprocessable_entity }
      end       
    end 
    
  end
  
  # GET /choice_lists
  # GET /choice_lists.xml
  def index

    @choice_lists = @library.choice_lists.all

    @choice_lists.sort! do |a,b|
      String.natcmp(a.name, b.name, true)
    end
    if(params.has_key?("sort(-name)"))
      @choice_lists.revert!
    end

    for i in (0..@choice_lists.length-1)
      @choice_lists[i].sort_id=i
    end

    respond_to do |format|
      format.html { redirect_to @library }
      format.xml  { render :xml => @choice_lists }
      format.json  { render :json => @choice_lists.to_json(:methods=>[:sort_id], :include => {:choice_values=> {:except => [:id, :library_id, :choice_list_id ] } }, :except => [:library_id]) }
    end
  end

  #GET /choice_lists/1
  def show
    @library = @zone.libraries.find(params[:library_id])
    @choice_list = @library.choice_lists.find_by_id(params[:id])

    respond_to do |format|
      format.json  { render :json => @choice_list}
    end
  end

  # POST /choice_lists
  # POST /choice_lists.xml
  def create

    begin

      ChoiceList.transaction do

        @choice_list = @library.choice_lists.new(
            :name => params[:name],
            :description => params[:description],
            :data_type_id => params[:data_type_id],
            :created_by => @active_user.name,
            :updated_by => @active_user.name
        )

        params[:choice_values].each do |choice_value|
          @choice_list.choice_values << ChoiceValue.create(
              :name => choice_value[:name],
              :value => choice_value[:value],
              :sort_order => choice_value[:sort_order]
          )
        end

        unless @choice_list.save
          raise @choice_list.errors
        end

      end

      respond_to do |format|
        format.html { redirect_to @choice_list, notice: 'Choice List was successfully created.' }
        format.json { render json: @choice_list.to_json(:include => {:choice_values=> {:except => [:id, :library_id, :choice_list_id ] } }), status: :created, location: @choice_list.dojo_url }
      end

    rescue => e
      logger.error "Choice List creation failed => #{e.message}"
        respond_to do |format|
          format.json { render :json => e.message, :status => :unprocessable_entity }
        end
    end

  end

  # PUT /choice_lists/1
  # PUT /choice_lists/1.xml
  def update

    begin

      ChoiceList.transaction do

        @choice_list = @library.choice_lists.find(params[:id])

        @choice_list.update_attributes(
            :name => params[:name],
            :description => params[:description],
            :updated_by => @active_user.name,
            :updated_at => Time.now
        )

        @choice_list.choice_values.destroy_all
        params[:choice_values].each do |choice_value|

          next if choice_value[:sort_order] < 0

          @choice_list.choice_values << ChoiceValue.create(
              :name => choice_value[:name],
              :value => choice_value[:value],
              :sort_order => choice_value[:sort_order]
          )
        end

        unless @choice_list.save
          raise @choice_list.errors
        end

      end

      respond_to do |format|
        format.html { redirect_to @document_type, notice: 'Document Type was successfully updated' }
        format.json { render json: @choice_list.to_json(:include => {:choice_values=> {:except => [:id, :library_id, :choice_list_id ] } }), status: :ok, location: @choice_list.dojo_url }
      end

    rescue => e
      logger.error "Choice List update failed => #{e.message}"
        respond_to do |format|
          format.json { render :json => e.message, :status => :unprocessable_entity }
        end
    end

  end

  # DELETE /choice_lists/1
  # DELETE /choice_lists/1.xml
  def destroy

    begin

      @choice_list = @library.choice_lists.find(params[:id])
      raise "Choice List is assigned in one or more Document Types and cannot be deleted" if @choice_list.property_mappings.count > 1

      @choice_list.destroy

      respond_to do |format|
        format.html { redirect_to zone_library_choice_lists_url }
        format.js { render :json => "", :status => :ok}
      end

    rescue => e
      logger.error "Choice List deletion failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

end
