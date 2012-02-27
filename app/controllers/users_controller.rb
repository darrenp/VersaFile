class UsersController < ApplicationController
  require 'pony'

  before_filter :zone_required, :only => [:index, :show, :avatar, :create, :destroy, :update, :reset]
  before_filter :authorization_required, :except => [:reset]

  def avatar

    @user = @zone.users.find(params[:id])
    @avatar = @user.avatar

    unless @avatar.nil?
      redirect_to zone_avatar_path(@zone, @avatar)
    else
      redirect_to avatars_user_default_path
    end

  end


=begin
dont think this is needed
  # POST /users/1/upload
  def upload
    @user = @zone.users.find(params[:id])

    begin
      @avatar = @user.avatar
      @images=params[:avatars]
      if(@images!=nil)
        #html5 submission from firefox/safari/chrome/opera
        @image=@images[0]
      else
        #internet explorer submission
        @image=params[:uploadedfile0]
      end

      Avatar.transaction do
        unless @avatar.update_attributes(
            :image_file_name=>params[:original_filename],
            :image_content_type=>params[:content_type],
            :image=>@image
        )
        raise @avatar.errors


        end

      end

      respond_to do |format|
        format.json { render :json => "", :status => :ok }
      end
    rescue => e
      logger.error "Avatar update failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end
  end
=end

  # GET /users
  # GET /users.json
  def index
    if(params[:search] != nil)
      @search="%"+params[:search].upcase+"%"
      @users = @zone.users.find_by_sql ["SELECT `users`.* from `users` WHERE UPPER(name) LIKE(?) OR UPPER(FIRST_NAME) LIKE(?) OR UPPER(LAST_NAME) LIKE(?) OR UPPER(CONCAT(FIRST_NAME,' ',LAST_NAME)) LIKE(?) ORDER BY ?", @search, @search, @search, @search]
    elsif(params[:group_id])
      @users = @zone.groups.find_by_id(params[:group_id]).users.find(:all)
    else
      @users = @zone.users.all
    end

    @users.sort! do |a,b|
      String.natcmp(a.name, b.name, true)
    end
    if(params.has_key?("sort(-name)"))
      @users.revert!
    end

    for i in (0..@users.length-1)
      @users[i].sort_id=i
    end

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @users }
      format.js{
        ActiveRecord::Base.include_root_in_json = false
        render :json => @users.to_json( :except => [:password, :zone_id], :methods => [:disabled, :active_group, :sort_id] )
      }
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show

    @user = @zone.users.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @user.to_json( :except => [:password, :zone_id], :methods => [:disabled, :active_group] ) }
    end
  end

  # GET /users/new
  # GET /users/new.json
  def new
    @user = User.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  # POST /users
  # POST /users.json
  def create

    begin

      User.transaction do

        #TODO: should use RAILS uniqueness constraints
        if(@zone.users.find_by_name(params[:name]))
          raise "Username must be unique"
        end

        @tmp_password = params[:reset_password]

        @user = @zone.users.new(
          :name => params[:name],
          :password => @tmp_password,
          :first_name => params[:first_name],
          :last_name => params[:last_name],
          :email => params[:email],
          :created_by => @active_user.name,
          :updated_by => @active_user.name,
          :password_expires => Time.now
        )

        if params[:active_group].nil?
          @user.switch_to_group(nil)
        else
          @group = @zone.groups.find(params[:active_group])
          @user.switch_to_group(@group)
        end

        #avatar=Avatar.new(
        #  :zone_id => @zone.id,
        #  :imageable_id => @user.id,
        #  :imageable_type => 'User',
        #  :image => @zone.avatar.image
        #)
        #@user.avatar = avatar

        if !@user.save
          raise @user.errors
        end

        unless params[:disabled].nil?
          setACLDisabled(@user, params[:disabled])
        end

        unless @user.email.nil?
          @email = EmailWorker.new(@user.email, {:zone => @zone, :user => @user, :password => @tmp_password })
          @email.delay.send_user_created()
        end

      end

      respond_to do |format|
        format.html { redirect_to(@user, :notice => 'User was successfully created.') }
        format.xml  { render :xml => @user, :status => :created, :location => @user }
        format.json { render :json => @user.to_json(:except => :password, :methods => [:disabled, :active_group]), :status => :created, :location=> @user.dojo_url }
      end

    rescue => e
      logger.error "User creation failed => #{e.message}"
      respond_to do |format|
        format.html { render :action => "new" }
        format.xml  { render :xml => @user.errors, :status => :unprocessable_entity }
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /users/1
  # PUT /users/1.json
  def update

    begin

      @user = @zone.users.find(params[:id])

      User.transaction do

        @user.update_attributes(
          :first_name => params[:first_name],
          :last_name => params[:last_name],
          :email => params[:email],
          :updated_by => @active_user.name
        )

        if params[:active_group].nil?
          @user.switch_to_group(nil)
        else
          @group = @zone.groups.find(params[:active_group])
          @user.switch_to_group(@group)
        end

        unless params[:disabled].nil?
          setACLDisabled(@user, params[:disabled])
        end

        unless (params[:temp_file].nil?)
          @user.avatar = @zone.avatars.new(
            :image => UploaderHelper.read_file(@zone, session[:session_id], params[:temp_file][:file])
          )
        end

        unless params[:reset_password].blank?
          @user.update_attributes(
            :password => params[:reset_password],
            :password_expires => nil
          )
        end

        unless params[:old_password].nil?
          if(@user.verify_password(params[:old_password]))
            @user.update_attributes(
              :password => params[:new_password],
              :password_expires => nil
            )
          else
            raise "Incorrect password"
          end
        end

        unless @user.save
          raise @user.errors
        end

      end

      respond_to do |format|
        format.html { redirect_to(@user, :notice => 'User was successfully updated.') }
        format.xml  { head :ok }
        format.json { render :json => @user.to_json(:except => :password, :methods => [:disabled, :active_group]), :status => :ok, :location=> @user.dojo_url }
      end

    rescue => e
      logger.error "User update failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  #POST /users/reset
  def reset
    begin
      user=@zone.users.find_by_reset_fingerprint(params[:f])
      if(!user||!user.verify_reset_password(params[:oldPassword]))
        raise "Invalid credentials"
      else
      #@zone.authorize(user, params[:oldPassword], user.groups.first)

        user.password=params[:newPassword]
        user.reset_fingerprint=nil
        user.reset_password=nil
        user.save
      end
      respond_to do |format|
        format.json { render :json => "", :status => :ok}
      end
    rescue => e
      logger.error "User password reset failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    begin
      @user = User.find(params[:id])

      if(@user.name=='admin')
        raise "You cannot delete the administrator account"
      end
      User.transaction do

        acl_entry=@zone.acl.acl_entries.first(:conditions=>"GRANTEE_TYPE='User' AND GRANTEE_ID=#{@user.id}")
        if(acl_entry!=nil)
          acl_entry.destroy
        end

        if(@user.avatar!=nil)
          @user.avatar.destroy
        end

        @user.destroy
      end
      respond_to do |format|
        format.json { render :json => "", :status => :ok}
        format.html { redirect_to(users_url) }
        format.xml  { head :ok }
      end
    rescue => e
      logger.error "User delete failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end
  end



  def setACLDisabled(user, disabled)
    if(disabled)
      if(user.name=='admin')
        raise "You cannot disable the administrator account"
      end

      acl_entry=@zone.acl.acl_entries.first(:conditions=>"GRANTEE_TYPE='User' AND GRANTEE_ID=#{user.id}")
      if(acl_entry==nil||acl_entry.role.name!='None')
        if(acl_entry!=nil)
          acl_entry.destroy
        end

        role =  @zone.roles.find_by_name('None')
        @zone.acl.acl_entries << AclEntry.new(
          :role => role,
          :precedence => Bfree::Acl::PrecedenceTypes.NamedUser,
          :grantee_type=> 'User',
          :grantee_id => user.id
        )
      end
    else
      #acl_entry=@user.acl_entry;
      #logger.error(acl_entry.role.name)

      acl_entry=@zone.acl.acl_entries.first(:conditions=>"GRANTEE_TYPE='User' AND GRANTEE_ID=#{user.id}")
      if(acl_entry==nil||acl_entry.role.name=='None')
        if(acl_entry!=nil)
          acl_entry.destroy
        end
        role = user.name == 'admin' ? @zone.roles.find_by_name('Admin') : @zone.roles.find_by_name('Viewer');
        @zone.acl.acl_entries << AclEntry.new(
          :role => role,
          :precedence => Bfree::Acl::PrecedenceTypes.NamedUser,
          :grantee_type=> 'User',
          :grantee_id => user.id
        )
      end
    end
  end


end
