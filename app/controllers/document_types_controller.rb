class DocumentTypesController < ApplicationController
  before_filter :library_required
  before_filter :authorization_required

  # GET /document_types/1/metrics
  # GET /document_types/1/metrics.json
  def dtmetrics

    begin

      @document_types = @library.document_types.all

      if params[:id].nil?
        respond_to do |format|
          format.html # index.html.erb
          format.json { render json: @document_types.to_json(:only => [:id, :name], :methods => :metrics ) }
        end
      else
        @document_type = @library.document_types.find(params[:id])
        @metrics = @document_type.metrics()
        respond_to do |format|
          format.html # index.html.erb
          format.json { render json: @metrics }
        end
      end

    rescue => e
      logger.error "Document Type metrics generation failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  # GET /document_types
  # GET /document_types.json
  def index

    @document_types = @library.document_types.all

    @document_types.sort! do |a,b|
      String.natcmp(a.name, b.name, true)
    end
    if(params.has_key?("sort(-name)"))
      @document_types.revert!
    end

    for i in (0..@document_types.length-1)
      @document_types[i].sort_id=i
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @document_types.to_json(:methods=>[:sort_id], :include => {:property_mappings => {:except => [:id, :document_type_id ] } }) }
    end

  end

  # GET /document_types/1
  # GET /document_types/1.json
  def show

    @document_type = @library.document_types.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @document_type.to_json(:include => {:property_mappings => {:except => [:id, :document_type_id ] } }) }
    end
  end

  # GET /document_types/new
  # GET /document_types/new.json
  def new
    @document_type = DocumentType.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @document_type }
    end
  end

  # GET /document_types/1/edit
  def edit
    @document_type = DocumentType.find(params[:id])
  end

  # POST /document_types
  # POST /document_types.json
  def create

    begin

      DocumentType.transaction do

        @document_type = @library.document_types.new(
          :name => params[:name],
          :description => params[:description],
          :created_by => @active_user.name,
          :updated_by => @active_user.name
        )

        params[:property_mappings].each do |property_mapping|
          property_definition = @library.property_definitions.find(property_mapping[:property_definition_id])
          @document_type.property_mappings << PropertyMapping.create(
              :property_definition => property_definition,
              :sort_order => property_mapping[:sort_order],
              :is_required => property_mapping[:is_required],
              :choice_list_id => property_mapping[:choice_list_id],
              :default_value => property_mapping[:default_value]
          )
        end

        unless @document_type.save
          raise @document_type.errors
        end

      end

      respond_to do |format|
        format.html { redirect_to @document_type, notice: 'Document Type was successfully created.' }
        format.json { render json: @document_type.to_json(:include => {:property_mappings => {:except => [:id, :document_type_id ] } }), status: :created, location: @document_type.dojo_url }
      end

    rescue => e
      logger.error "Document Type creation failed => #{e.message}"
        respond_to do |format|
          format.json { render :json => e.message, :status => :unprocessable_entity }
        end
    end

  end

  # PUT /document_types/1
  # PUT /document_types/1.json
  def update

    begin

      DocumentType.transaction do

        @document_type = @library.document_types.find(params[:id])

        @document_type.update_attributes(
            :name => params[:name],
            :description => params[:description],
            :updated_by => @active_user.name
        )

        @document_type.property_mappings.destroy_all
        params[:property_mappings].each do |property_mapping|
          property_definition = @library.property_definitions.find(property_mapping[:property_definition_id])
          @document_type.property_mappings << PropertyMapping.create(
              :property_definition => property_definition,
              :sort_order => property_mapping[:sort_order],
              :is_required => property_mapping[:is_required],
              :choice_list_id => property_mapping[:choice_list_id],
              :default_value => property_mapping[:default_value]
          )
        end

        unless @document_type.save
          raise @document_type.errors
        end

      end

      respond_to do |format|
        format.html { redirect_to @document_type, notice: 'Document Type was successfully updated' }
        format.json { render json: @document_type.to_json(:include => {:property_mappings => {:except => [:id, :document_type_id ] } }), status: :ok }
      end

    rescue => e
      logger.error "Document Type update failed => #{e.message}"
        respond_to do |format|
          format.json { render :json => e.message, :status => :unprocessable_entity }
        end
    end

  end

  # DELETE /document_types/1
  # DELETE /document_types/1.json
  def destroy

    begin

      @document_type = @library.document_types.find(params[:id])

      raise "#{@document_type.documents.count} document(s) are assigned to Document Type '#{@document_type.name}'" if @document_type.documents.count > 0
      @document_type.destroy

      respond_to do |format|
        format.html { redirect_to document_types_url }
        format.js { render :json => "", :status => :ok}
      end

    rescue => e
      logger.error "Document Type deletion failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end
end
