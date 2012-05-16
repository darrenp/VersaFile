class ViewMappingsController < ApplicationController
  before_filter :library_required
  before_filter :authorization_required

  # GET /view_mappings
  # GET /view_mappings.json
  def index

    if(params[:user_id]&&params[:folder_id])
      @view_mappings = @library.view_mappings.find_or_create_by_folder_id_and_user_id(params[:folder_id], params[:user_id])
    else
      @view_mappings = @library.view_mappings.all
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @view_mappings }
    end
  end

  # GET /view_mappings/1
  # GET /view_mappings/1.json
  def show
    @view_mapping = ViewMapping.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @view_mapping }
    end
  end

  # GET /view_mappings/new
  # GET /view_mappings/new.json
  def new
    @view_mapping = ViewMapping.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @view_mapping }
    end
  end

  # GET /view_mappings/1/edit
  def edit
    @view_mapping = ViewMapping.find(params[:id])
  end

  # POST /view_mappings
  # POST /view_mappings.json
  def create
    @view_mapping = ViewMapping.new(params[:view_mapping])

    respond_to do |format|
      if @view_mapping.save
        format.html { redirect_to @view_mapping, notice: 'View mapping was successfully created.' }
        format.json { render json: @view_mapping, status: :created, location: @view_mapping }
      else
        format.html { render action: "new" }
        format.json { render json: @view_mapping.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /view_mappings/1
  # PUT /view_mappings/1.json
  def update
    @view_mapping = ViewMapping.find(params[:id])

    respond_to do |format|
      if @view_mapping.update_attributes(params[:view_mapping])
        format.html { redirect_to @view_mapping, notice: 'View mapping was successfully updated.' }
        format.json { render :json =>@view_mapping, :status=>:ok, :location=>@view_mapping.dojo_url }
      else
        format.html { render action: "edit" }
        format.json { render json: @view_mapping.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /view_mappings/1
  # DELETE /view_mappings/1.json
  def destroy
    @view_mapping = ViewMapping.find(params[:id])
    @view_mapping.destroy

    respond_to do |format|
      format.html { redirect_to view_mappings_url }
      format.json { head :ok }
    end
  end
end
