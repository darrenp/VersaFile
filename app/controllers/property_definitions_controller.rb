class PropertyDefinitionsController < ApplicationController
  before_filter :library_required
  before_filter :authorization_required

  # GET /property_definitions
  # GET /property_definitions.json
  def index

    @property_definitions = @library.property_definitions.all

    @property_definitions.sort! do |a,b|
      String.natcmp(a.name, b.name, true)
    end
    if(params.has_key?("sort(-name)"))
      @property_definitions.revert!
    end

    for i in (0..@property_definitions.length-1)
      @property_definitions[i].sort_id=i
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @property_definitions.to_json({:methods=>[:document_types_count, :sort_id]}) }
    end
  end

  # GET /property_definitions/1
  # GET /property_definitions/1.json
  def show
    @property_definition = PropertyDefinition.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @property_definition }
    end
  end

  # GET /property_definitions/new
  # GET /property_definitions/new.json
  def new
    @property_definition = PropertyDefinition.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @property_definition }
    end
  end

  # GET /property_definitions/1/edit
  def edit
    @property_definition = PropertyDefinition.find(params[:id])
  end

  # POST /property_definitions
  # POST /property_definitions.json
  def create

    begin

      #deterimine next available column for data type
      @property_column = @library.property_columns.find_by_data_type_id(params[:data_type_id])
      column = @property_column.next

      PropertyDefinition.transaction do

        @property_definition = @library.property_definitions.new(
          :name => params[:name],
          :table_name => "documents",
          :column_name => column[:name],
          :data_type => @property_column.data_type,
          :cardinality => params[:cardinality],
          :max_length => params[:max_length],
          :is_readonly => params[:is_readonly],
          :is_system => params[:is_system],
          :is_name => false,
          :created_by => @active_user.name,
          :updated_by => @active_user.name,
          :description=> params[:description]
        )

        if @property_definition.save
          #mark the column as "taken"
          @property_column.set_column(column[:index], true)
          raise @property_column.errors unless @property_column.save
        else
          raise @property_definition.errors
        end

      end

      respond_to do |format|
        format.html { redirect_to @property_definition, notice: 'Property definition was successfully created.' }
        format.json { render json: @property_definition, status: :created, location: @property_definition.dojo_url }
      end

    rescue => e
      logger.error "Property Definition creation failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end


  # PUT /property_definitions/1
  # PUT /property_definitions/1.json
  def update

    begin

      @property_definition = @library.property_definitions.find(params[:id])

      if @property_definition.update_attributes(
            :name => params[:name],
            :max_length => params[:max_length],
            :description => params[:description],
            :updated_by => @active_user.name
        )

      else
          raise @property_definition.errors
      end

      respond_to do |format|
        format.html { redirect_to(@property_definition, :notice => 'Property Definition was successfully updated.') }
        format.xml  { head :ok }
        format.json { render json: @property_definition, status: :ok, location: @property_definition.dojo_url }
      end

    rescue => e
      logger.error "Property Definition update failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  # DELETE /property_definitions/1
  # DELETE /property_definitions/1.json
  def destroy

    begin

      @property_definition = @library.property_definitions.find(params[:id])
      raise "Property Definition is a member of one or more Document Types and cannot be deleted" if @property_definition.document_types.count > 0

      PropertyDefinition.transaction do

        #mark the column as available
        @property_column = @library.property_columns.find_by_data_type_id(@property_definition.data_type_id)
        idx = PropertyColumn.index_from_name(@property_definition.column_name)
        @property_column.set_column(idx, false)
        raise @property_column.errors unless @property_column.save

        #clear the column data
        @library.documents.update_all("#{@property_definition.column_name} = NULL")

        @property_definition.destroy
      end

      respond_to do |format|
        format.html { redirect_to property_definitions_url }
        format.js { render :json => "", :status => :ok}
      end

    rescue => e
      logger.error "Property Definition deletion failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

end
