class FoldersController < ApplicationController
  before_filter :library_required
  before_filter :authorization_required
  rescue_from Exception, :with => :folder_error

  def root

    begin

      @folders = @library.folders.viewable(@active_user, @active_group).root_folders
      raise "Access Denied to library '#{@library.name}'" if @folders.size < 1

      respond_to do |format|
        format.html # index.html.erb
        format.json { render :json => @folders.to_json(:user => @active_user, :group => @active_group) }
      end
    rescue => e
      logger.error("Root Folder Error:> #{e.message}")
      @folders = [{
        :id => 0,
        :name => e.message,
        :folder_type => VersaFile::FolderTypes.Error,
        :children => [],
        :active_permissions => Bfree::Acl::Permissions.View
      }]
      respond_to do |format|
        format.html
        format.json { render :json => @folders }
      end

    end

  end

  # GET /folders
  # GET /folders.json
  def index

    if(params[:parent_id])
      @folders = @library.folders.viewable(@active_user, @active_group).find_all_by_parent_id(params[:parent_id])
    else
      @folders = @library.folders.viewable(@active_user, @active_group).root_folders
    end


    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @folders.to_json(:user => @active_user, :group => @active_group) }
    end

  end

  def share_items

    @folder = @library.folders.viewable(@active_user, @active_group).find(params[:id])
    if !(Acl.has_rights(@folder.active_permissions, Bfree::Acl::Permissions.CreateFiles) && (@folder.folder_type == VersaFile::FolderTypes.Share))
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.CreateFiles)
    end

    params['reference_ids'].each do |reference_id|

      reference = @library.references.viewable(@active_user, @active_group).complete.find(reference_id)
      unless Acl.has_rights(reference.active_permissions, Bfree::Acl::Permissions.WriteMetadata)
        raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.WriteMetadata)
      end

      unless @folder.references.exists?(:document_id => reference.document_id)
        shared_reference = reference.create_share(@folder, @active_user)
        shared_reference.save()
      end

    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => '' }
    end

  end

  # GET /folders/1
  # GET /folders/1.json
  def show

    @folder = @library.folders.viewable(@active_user, @active_group).find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @folder.to_json(
          :user => @active_user,
          :group => @active_group,
          :request => request), location: @folder.dojo_url  }
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

    begin

      @parent = nil
      @share = nil

      folder_type = params[:folder_type].nil? ? VersaFile::FolderTypes.Content : params[:folder_type]
      parent_id = params[:parent_id].nil? ? nil : params[:parent_id].to_i

      @parent = @library.folders.viewable(@active_user, @active_group).find_by_id(parent_id) unless parent_id.nil?
      @parent = @library.root_folder if (@parent.nil? && (folder_type != VersaFile::FolderTypes.Root))

      Folder.transaction do

        @folder = @zone.folders.new(
            :library => @library,
            :name => params[:name],
            :folder_type => folder_type,
            :created_by => @active_user.name,
            :updated_by => @active_user.name,
            :parent_id => @parent.nil? ? nil : @parent.id
        )

        unless @folder.save
          raise_errors(@folder.errors)
        end

        if(folder_type == VersaFile::FolderTypes.Share)

          @share = @library.shares.create(
              :folder => @folder,
              :password => params[:password],
              :expiry => params[:expiry]
          )

          unless params[:seed_id].nil?
            @seed = @library.folders.find(params[:seed_id])
            @seed.references.each do |reference|
              active_role = reference.get_active_role(@active_user, @active_group)
              next if !Acl.has_rights(active_role.permissions, Bfree::Acl::Permissions.WriteMetadata)
              shared_reference = reference.create_share(@folder, @active_user)
              shared_reference.save()
            end

            #replicater seed's ACL
            @folder.acl = @seed.acl.deep_clone
            @folder.acl.update_attribute(:inherits, false);

          end

        end

      end

      respond_to do |format|
        format.html { redirect_to @folder, notice: 'Folder was successfully created.' }
        format.json  { render :json => @folder.as_json(:user => @active_user, :group => @active_group, :request => request), :status => :created, location: @folder.dojo_url }
      end

    rescue => e
      logger.error "Folder creation failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  # PUT /folders/1
  # PUT /folders/1.json
  def update

    @folder = @library.folders.viewable(@active_user, @active_group).find(params[:id])
    unless Acl.has_rights(@folder.active_permissions, Bfree::Acl::Permissions.WriteMetadata)||
           Acl.has_rights(@folder.active_permissions, Bfree::Acl::Permissions.View)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.WriteMetadata)
    end

    if(Acl.has_rights(@folder.active_permissions, Bfree::Acl::Permissions.WriteMetadata))
      Folder.transaction do

        #change name here
        @folder.name = params[:name] unless params[:name].nil?

        #change parent folder here
        unless ((params[:parent_id].nil?) || (@folder.folder_type != VersaFile::FolderTypes.Content))
          #attempt to retrieve parent folder -- assign root if folder not found.
          @parent = @library.folders.viewable(@active_user, @active_group).find_by_id(params[:parent_id])
          @parent = @library.root_folder if (@parent.nil? && @folder.folder_type != VersaFile::FolderTypes.Root)
          @folder.file_in_folder(@parent) if @folder.parent != @parent
        end

        #update share properties
        if(@folder.folder_type == VersaFile::FolderTypes.Share)
          @folder.share.password = params[:password] unless params[:password].nil?||params[:password]==""
          @folder.share.expiry = params[:expiry]
        end

        unless @folder.save
          raise_errors(@folder.errors)
        end

        #can have only one custom view per folder/user, so...
        @view_mapping = @library.view_mappings.find_by_folder_id_and_user_id(@folder.id, @active_user.id)
        unless @view_mapping.nil? || @view_mapping.view_definition.is_template
          #if view is a template don't delete it
          #OR current view_definition has been updated, don't deleted it
          @view_mapping.view_definition.destroy unless @view_mapping.view_definition.id == params[:view_definition_id]
        end
      end

    end

    if(Acl.has_rights(@folder.active_permissions, Bfree::Acl::Permissions.View))
      #create new mapping
      @view_mapping = @library.view_mappings.find_or_initialize_by_folder_id_and_user_id(@folder.id, @active_user.id)
      @view_mapping.view_definition = @library.view_definitions.find(params[:view_definition_id])
      unless @view_mapping.save
        raise_errors(@view_mapping.errors)
      end
    end


    respond_to do |format|
      format.json  { render :json => @folder.as_json(
          :user => @active_user,
          :group => @active_group,
          :request => request), :status => :ok, :location => @folder.dojo_url }
    end

  end

  # DELETE /folders/1
  # DELETE /folders/1.json
  def destroy

    begin

      @folder = @library.folders.viewable(@active_user, @active_group).find(params[:id])
      destroy_permissions = (@folder.folder_type == VersaFile::FolderTypes.Share) ?
                                Bfree::Acl::Permissions.WriteMetadata :
                                Bfree::Acl::Permissions.Delete

      unless Acl.has_rights(@folder.active_permissions, destroy_permissions)
        raise Exceptions::PermissionError.new(@active_user.name, destroy_permissions)
      end

      Folder.transaction do

        if @folder.folder_type == VersaFile::FolderTypes.Share
          @folder.references.destroy_all
          @folder.destroy
        else
          #Soft delete all contained documents (recursive), then delete folder
          @folder.soft_delete(User.find_by_id(session[:active_user_id]))
          @folder.destroy
        end

      end

      respond_to do |format|
        format.html { redirect_to(folders_url) }
        format.js { render :json => nil, :status => :no_content }
      end

    rescue => e
      err_msg = "Folder deletion failed => #{e.message}"
      logger.error err_msg
      respond_to do |format|
        format.js { render :json => err_msg, :status => :unprocessable_entity }
      end
    end
  end


:protected

  def folder_error(e)
    logger.error "Failed perform folder action => #{e.message}"

  end

end
