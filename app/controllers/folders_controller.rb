class FoldersController < ApplicationController
  before_filter :library_required
  before_filter :authorization_required

  # GET /folders
  # GET /folders.json
  def index

    @library=@zone.libraries.viewable(@active_user, @active_group).find(:all, :conditions=>{:id=>params[:library_id]})
    if @library.length==0
      @folders=[]
    else
      @folders = @library.first.folders.root_folders.viewable(@active_user, @active_group)
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @folders.to_json(:user => @active_user, :group => @active_group) }
    end

  end

  # GET /folders/1
  # GET /folders/1.json
  def show

    #@folders = @library.folders.find(params[:id]) root_folders.viewable(@active_user, @active_group).order('is_trash DESC, is_search DESC, name ASC')
    @folder = Folder.find(params[:id]) #.viewable(@active_user, @active_group)

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @folder.to_json(:user => @active_user, :group => @active_group), location: @folder.dojo_url  }
    end
  end

  # GET /folders/new
  # GET /folders/new.json
  def new

    @folder = Folder.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @folder }
    end
  end

  # GET /folders/1/edit
  def edit
    @folder = Folder.find(params[:id])
  end

  # POST /folders
  # POST /folders.json
  def create

    #if(params[:parent_id]==0 || params[:parent_id] <= 0)
    #  @parentFolder = nil
    #else
    #  @parentFolder = @library.folders.find(params[:parent_id])
    #end

    @folder = @zone.folders.new(
        :library => @library,
        :name => params[:name],
        :created_by => @active_user.name,
        :updated_by => @active_user.name,
        :parent_id => params[:parent_id]
    )

    respond_to do |format|
      if @folder.save
        format.html { redirect_to @folder, notice: 'Folder was successfully created.' }
        format.json  { render :json => @folder.as_json(:user => @active_user, :group => @active_group), status: :created, location: @folder.dojo_url }
      else
        format.html { render action: "new" }
        format.json { render json: @folder.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /folders/1
  # PUT /folders/1.json
  def update

    @folder = @library.folders.find(params[:id])

    respond_to do |format|
      if @folder.update_attributes(:name => params[:name], :parent_id=>params[:parent_id])
        #flash[:notice] = 'Folder was successfully updated.'
        format.html { redirect_to(@folder) }
        #format.xml  { head :ok }
        format.js  {  render :json => @folder.to_json(:user => @active_user, :group => @active_group), :status => :ok, :location=>@folder.dojo_url }
      else
        #format.html { render :action => "edit" }
        #format.xml  { render :xml => @folder.errors, :status => :unprocessable_entity }
        format.js  { render :json => 'Folder update failed: ' + @folder.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /folders/1
  # DELETE /folders/1.json
  def destroy

    begin

      @folder = @library.folders.find(params[:id])

      Folder.transaction do
        @folder.deleteDocuments(User.find_by_id(session[:active_user_id]))
        @folder.destroy
      end

      respond_to do |format|
        format.html { redirect_to(folders_url) }
        format.xml  { head :ok }
        format.js { render :json => '', :status => :ok }
      end

    rescue => e
      err_msg = "Folder deletion failed => #{e.message}"
      logger.error err_msg
      respond_to do |format|
        format.js { render :json => err_msg, :status => :unprocessable_entity }
      end
    end
  end
end
