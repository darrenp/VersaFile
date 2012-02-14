class RkoUsersController < ApplicationController
  before_filter :superuser_required, :only => [:logoff]
  skip_before_filter :verify_authenticity_token, :only => [:logon]

  # GET /rko_users
  # GET /rko_users.json
  def index

    @rko_users = RkoUser.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @rko_users.to_json(:except=>:password) }
    end
  end

  # GET /rko_users/1
  # GET /rko_users/1.json
  def show

    @rko_user = RkoUser.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @rko_user.to_json(:except=>:password) }
    end
  end

  # GET /rko_users/new
  # GET /rko_users/new.json
  def new
    @rko_user = RkoUser.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @rko_user.to_json(:except=>:password) }
    end
  end

  # GET /rko_users/1/edit
  def edit
    @rko_user = RkoUser.find(params[:id])
  end

  # POST /rko_users
  # POST /rko_users.json
  def create
    @rko_user = RkoUser.new(params[:rko_user])

    respond_to do |format|
      if @rko_user.save
        format.html { redirect_to @rko_user, notice: 'Rko user was successfully created.' }
        format.json { render json: @rko_user.to_json(:except => :password), status: :created, location: @rko_user }
      else
        format.html { render action: "new" }
        format.json { render json: @rko_user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /rko_users/1
  # PUT /rko_users/1.json
  def update
    @rko_user = RkoUser.find(params[:id])

    if(params[:resetPassword])
      @rko_user.update_attribute(:password, params[:resetPassword])
    end

    respond_to do |format|
      if @rko_user.update_attributes(params[:rko_user])
        format.html { redirect_to @rko_user, notice: 'Rko user was successfully updated.' }
        format.json { render json: @rko_user.to_json(:except => :password), status: :created, location: @rko_user }
      else
        format.html { render action: "edit" }
        format.json { render json: @rko_user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /rko_users/1
  # DELETE /rko_users/1.json
  def destroy
    @rko_user = RkoUser.find(params[:id])
    @rko_user.destroy

    respond_to do |format|
      format.html { redirect_to rko_users_url }
      format.json { render :text=>"" }
    end
  end

  def logon

    begin

      raise Exceptions::InvalidCredentials.new(params[:username]) if params[:username].blank?
      @rko_user = RkoUser.find_by_name(params[:username])
      raise Exceptions::InvalidCredentials.new(params[:username]) if @rko_user.nil?

      logger.debug "Authorizing rko user '#{params[:username]}'..."
      if(!@rko_user.verify_password(params[:password]))
        raise Exceptions::InvalidCredentials.new(params[:username])
      end
      session[:super_user_id] = @rko_user.id
      logger.debug "'#{@rko_user.first_name} #{@rko_user.last_name}' is authorized."

      @token = form_authenticity_token

      respond_to do |format|
        format.html # authorize.html.erb
        format.xml  { render :xml => @rko_user }
        format.json { render :json => @rko_user }
        #format.json  { render :json => @rko_user.to_json(:except => [:password]) }
      end

    rescue => e
      logger.debug 'ERROR: ' + e.message
      session.clear
      respond_to do |format|
        format.json  { render :json => 'Login failed: ' + e.message, :status => :unprocessable_entity }
      end

    end

  end

  def logout

    session[:super_user_id] = nil

    respond_to do |format|
      format.json  { render :text=>"" }
    end
  end

  def logoff

    begin

      unless @super_user.nil?
        logger.debug("SESSION :> #{session}")
        logger.debug "User '#{@super_user.name}' [#{session[:super_user_id]}] logging off..."
        session.clear
        reset_session
        logger.debug "Logged off: [#{session[:super_user_id]}]"
        logger.debug("SESSION :> #{session}")
      end

      respond_to do |format|
        format.html # authorize.html.erb
        format.xml  { render :xml => @user }
        format.json  { render :json => '', status => :ok }
      end

    rescue => e
      logger.debug 'ERROR: ' + e.message
      session.clear
      respond_to do |format|
        format.json  { render :json => 'Logoff failed: ' + e.message, :status => :unprocessable_entity }
      end

    end


  end

end
