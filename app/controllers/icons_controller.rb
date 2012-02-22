class IconsController < ApplicationController
  # GET /icons
  # GET /icons.json
  def index
    @icons = Icon.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @icons }
    end
  end

  # GET /icons/1
  # GET /icons/1.json
  def show
    file_name = 'default.png'
    size = 16.to_s
    @icon = Icon.find_by_content_type(params[:id])

    file_name = @icon.file_name unless @icon.nil?
    size = params[:size] unless params[:size].nil?

    path = Rails.root.join('public/images/mimetypes', size, file_name).to_s
    send_file path, :type => 'image/png', :disposition =>'inline'

  end

  # GET /icons/new
  # GET /icons/new.json
  def new
    @icon = Icon.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @icon }
    end
  end

  # GET /icons/1/edit
  def edit
    @icon = Icon.find(params[:id])
  end

  # POST /icons
  # POST /icons.json
  def create
    @icon = Icon.new(params[:icon])

    respond_to do |format|
      if @icon.save
        format.html { redirect_to @icon, notice: 'Icon was successfully created.' }
        format.json { render json: @icon, status: :created, location: @icon }
      else
        format.html { render action: "new" }
        format.json { render json: @icon.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /icons/1
  # PUT /icons/1.json
  def update
    @icon = Icon.find(params[:id])

    respond_to do |format|
      if @icon.update_attributes(params[:icon])
        format.html { redirect_to @icon, notice: 'Icon was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @icon.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /icons/1
  # DELETE /icons/1.json
  def destroy
    @icon = Icon.find(params[:id])
    @icon.destroy

    respond_to do |format|
      format.html { redirect_to icons_url }
      format.json { head :ok }
    end
  end
end
