class AvatarsController < ApplicationController

  def zone_default
    send_file File.join(Rails.public_path, 'images', 'bfree.64.png'), :filename => 'zone.png', :type => 'image/png', :disposition => 'inline'
  end

  def user_default
    send_file File.join(Rails.public_path, 'images', 'user.64.png'), :filename => 'user.png', :type => 'image/png', :disposition => 'inline'
  end

  # GET /avatars
  # GET /avatars.json
  def index
    @avatars = Avatar.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @avatars }
    end
  end

  # GET /avatars/1
  # GET /avatars/1.json
  def show
    @avatar = Avatar.find(params[:id])
    send_file @avatar.image.path, :filename => @avatar.image.original_filename, :type => @avatar.image.content_type, :disposition => 'inline'
  end


  # GET /avatars/new
  # GET /avatars/new.json
  def new
    @avatar = Avatar.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @avatar }
    end
  end

  # GET /avatars/1/edit
  def edit
    @avatar = Avatar.find(params[:id])
  end

  # POST /avatars
  # POST /avatars.json
  def create
    @avatar = Avatar.new(params[:avatar])

    respond_to do |format|
      if @avatar.save
        format.html { redirect_to @avatar, notice: 'Avatar was successfully created.' }
        format.json { render json: @avatar, status: :created, location: @avatar }
      else
        format.html { render action: "new" }
        format.json { render json: @avatar.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /avatars/1
  # PUT /avatars/1.json
  def update
    @avatar = Avatar.find(params[:id])

    respond_to do |format|
      if @avatar.update_attributes(params[:avatar])
        format.html { redirect_to @avatar, notice: 'Avatar was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @avatar.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /avatars/1
  # DELETE /avatars/1.json
  def destroy
    @avatar = Avatar.find(params[:id])
    @avatar.destroy

    respond_to do |format|
      format.html { redirect_to avatars_url }
      format.json { head :ok }
    end
  end
end
