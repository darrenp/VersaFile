class GroupsController < ApplicationController
  before_filter :zone_required
  before_filter :authorization_required

  # GET /groups
  # GET /groups.json
  def index
    order="name"
    if(params.has_key?("sort(-name)"))
      order="name DESC"
    end

    if(params[:name]&&params[:name]!="*")
      @groups = @zone.groups.find_by_name(params[:name], :order=>order)
    else
      @groups = @zone.groups.all(:order => order)
    end

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @groups }
      format.json  { render :json => @groups.to_json(:methods => [:active_users] ) }
    end
  end

  # GET /groups/1
  # GET /groups/1.json
  def show

    @group = @zone.groups.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json  { render :json => @group.to_json(:except => [:zone_id] )}
    end
  end

  # GET /groups/new
  # GET /groups/new.json
  def new
    @group = Group.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @group }
    end
  end

  # GET /groups/1/edit
  def edit
    @group = Group.find(params[:id])
  end

  # POST /groups
  # POST /groups.json
  def create

    begin

      if(@zone.groups.find_by_name(params[:name]))
        raise "The group name must be unique"
      end

      Group.transaction do

        @active_users = []

        @group = @zone.groups.new(
          :name=>params[:name],
          :description=>params[:description],
          :users => @active_users,
          :created_by => @active_user.name,
          :updated_by => @active_user.name
        )

        unless @group.save
          raise @group.errors
        end

        unless params[:active_users].nil?

          params[:active_users].each do |active_user|
            @user = @zone.users.find(active_user[:user_id])
            @user.switch_to_group(@group)
          end

        end

        respond_to do |format|
          format.html { redirect_to(@group, :notice => 'Group was successfully created.') }
          format.xml  { render :xml => @group, :status => :created, :location => @group }
          format.json { render :json => @group.to_json(:methods => [:active_users]), :status => :created, :location => @group.dojo_url}
        end

      end

    rescue => e
      logger.error "Group creation failed => #{e.message}"
      respond_to do |format|
        format.html { render :action => "new" }
        format.xml  { render :xml => @group.errors, :status => :unprocessable_entity }
        format.json { render :json => e.message, :status=> :unprocessable_entity }
      end

    end

  end

  # PUT /groups/1
  # PUT /groups/1.json
  def update

    begin

      @group = @zone.groups.find(params[:id])

      Group.transaction do

        unless @group.update_attributes(
          :name=>params[:name],
          :description=>params[:description],
          :updated_by => @active_user.name
        )
          raise @group.errors
        end

        unless params[:active_users].nil?

          #check if admin is still in admin group
          if @group.is_admin
            admin_found = false
            @admin = @zone.users.admins.first
            params[:active_users].each do |active_user|
              admin_found = @admin.id == active_user[:user_id]
              break if admin_found
            end
            raise "You cannot remove the admin account from the Administrators group" unless admin_found
          end

          #clear will automatically put users in everyone
          @group.users.clear
          unless @group.is_everyone
            params[:active_users].each do |active_user|
              @user = @zone.users.find(active_user[:user_id])
              @user.switch_to_group(@group)
            end
          end

        end

        unless @group.save
          raise @group.errors
        end

      end

      respond_to do |format|
        format.json { render :json => @group.to_json(:methods => [:active_users]), :status => :ok, :location => @group.dojo_url}
      end

    rescue => e
      logger.error "Group update failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /groups/1
  # DELETE /groups/1.json
  def destroy

    begin

      @group = @zone.groups.find(params[:id])

      raise "You cannot delete #{@group.name}" if (@group.is_admin || @group.is_everyone)

      Group.transaction do
        @group.destroy
        #active_record assocation will clean up the group -> users mapping
      end


      respond_to do |format|
        format.html { redirect_to(groups_url) }
        format.xml  { head :ok }
        format.json { render :json => "", :status => :ok}
      end
    rescue => e
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end
  end

end
