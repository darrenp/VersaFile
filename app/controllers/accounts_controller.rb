class AccountsController < ApplicationController
  before_filter :superuser_required, :except => [:get_token, :show, :reset_password, :update, :logon, :logoff]
  before_filter :accountuser_required, :only => [:get_token, :show, :reset_password, :update, :logoff]
  skip_before_filter :verify_authenticity_token, :only => [:logon]

  rescue_from Exceptions::AuthorizationRequired do |exception|

    begin
      respond_to do |format|
        #format.html { redirect_to :controller => 'zones', :action => 'welcome', :id => @zone.subdomain }
        format.json { render :json => 'Login failed: ' + exception.message, :status => :unauthorized }
      end
    rescue => e
      logger.debug 'ERROR: ' + e.message
    end

  end

  def get_token

    begin

      @token = ''
      unless @account_user.nil?
        @token = form_authenticity_token
      end

      render :text => @token

    rescue => e
      logger.debug 'Token generation failed: ' + e.message
      session.clear
      respond_to do |format|
        format.json  { render :json => 'Token generation failed: ' + e.message, :status => :unprocessable_entity }
      end

    end

  end

  def logoff

    begin

      unless @account_user.nil?
        logger.debug "Username '#{@account_user.email}' logging off..."
        session.clear
        reset_session
        logger.debug "Logged off."
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

  def logon

    begin

      raise Exceptions::InvalidCredentials.new(params[:email]) if params[:email].blank?
      @account = Account.active.find_by_email(params[:email])
      raise Exceptions::InvalidCredentials.new(params[:email]) if @account.nil?

      logger.debug "Authorizing Account holder '#{params[:email]}'..."
      if(!@account.verify_password(params[:password]))
        raise Exceptions::InvalidCredentials.new(params[:@account])
      end

      session[:account_user_id] = @account.id
      logger.debug "'#{@account.email}' is authorized."

      respond_to do |format|
        format.html # authorize.html.erb
        format.xml  { render :xml => @account }
        format.json { render :json => @account.to_json(:except => [:password], :methods => [:subdomains]) }
      end

    rescue => e
      logger.debug 'ERROR: ' + e.message
      session.clear
      respond_to do |format|
        format.json  { render :json => 'Login failed: ' + e.message, :status => :unprocessable_entity }
      end
    end

  end

  # GET /accounts
  # GET /accounts.json
  def index

    begin

      @accounts = Account.active
      render json: @accounts.to_json(:except=>:password, :methods => [:subdomains, :template] )

    rescue => e
      render :json => e.message, :status => :unprocessable_entity
    end

  end

  # GET /accounts/1
  # GET /accounts/1.json
  def show

    begin

      @account = Account.active.find_by_email(params[:id])
      @account = Account.active.find(params[:id]) if @account.nil?

      if @account_user.instance_of?(Account)
        #verify user is accessing his/her own account
        raise "Username '#{@account_user.email}' does not have access to this account" if @account != @account_user
      end

      render json: @account.to_json(:except=>:password, :methods => [:subdomains, :template])

    rescue => e
      logger.debug 'ERROR: ' + e.message
      render :json => e.message, :status => :unprocessable_entity
    end

  end

  # GET /accounts/new
  # GET /accounts/new.json
  def new

    @account = Account.new(

    )

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @account }
    end
  end

  # GET /accounts/1/edit
  def edit
    @account = Account.find(params[:id])
  end

  # POST /accounts
  # POST /accounts.json
  def create

    begin

      Account.transaction do

        @server = Server.where(:current => true).first
        raise "A VersaFile server has not been defined" if @server.nil?

        @account = Account.new(params[:account])

        @account.trial_period = ((@account.account_type == VersaFile::AccountTypes.Trial) ? @account.trial_period : -1)
        @account.status = VersaFile::AccountStates.Enabled
        @account.created_by = @super_user.name
        @account.updated_by = @super_user.name

        unless @account.save
          raise_errors(@account.errors)
        end

        params[:subdomains].each do |subdomain|

          logger.debug("SUBDOMAIN:> #{subdomain[:name]}")

          @zone_node = @account.zone_nodes.create(
            :server => @server,
            :name => @account.name,
            :template_id => (params[:template].nil? ? VersaFile::CreationTemplates.None : params[:template]),
            :subdomain => subdomain[:name],
            :status => 0,
            :current_users => 0,
            :max_users => subdomain[:user_quota],
            :current_disk_space => 0,
            :max_disk_space => subdomain[:disk_quota].to_i * VersaFile::DiskSizes.Gigabyte,
            :deployed => false
          )

          unless @zone_node.valid?
            raise_errors( @zone_node.errors)
          end

        end

        #Auto Deploy!!!
        @zone_node.delay.zone_deploy

      end

      respond_to do |format|
        format.html { redirect_to @account, notice: 'Account was successfully created.' }
        format.json { render json: @account.to_json(:except=>:password, :methods => [:subdomains, :template]), status: :created, location: @account }
      end

    rescue => e
      logger.error "Account creation failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  #POST /accounts/1/reset_password
  #POST /accounts/1/reset_password.json
  def reset_password

    begin

      Account.transaction do

        @account = Account.active.find_by_email(params[:id])
        @account = Account.active.find(params[:id]) if @account.nil?

        if @account_user.instance_of?(Account)
          #verify user is accessing his/her own account
          raise "Username '#{@account_user.email}' does not have access to this account" if @account != @account_user
        end

        @temp_password = User.generate_password

        @account.update_attributes(
            :password => @temp_password,
            :status => VersaFile::AccountStates.Reset,
            :updated_by => @account_user.instance_of?(RkoUser) ? @account_user.name : @account_user.email
        )

        unless @account.save
          raise @account.errors.full_messages().join(';')
        end

        @email = EmailWorker.new(@account.email, {:account => @account, :password => @temp_password })
        @email.delay.send_account_reset()

      end

      respond_to do |format|
        format.html { redirect_to @account, notice: 'Account was successfully created.' }
        format.json { render :json => {}, :status => :ok }
      end

    rescue => e
      logger.error "Reset password failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end


  # PUT /accounts/1
  # PUT /accounts/1.json
  def update

    begin

      update_zone = false

      @account = Account.active.find_by_email(params[:id])
      @account = Account.active.find(params[:id]) if @account.nil?

      if @account_user.instance_of?(Account)
        #verify user is accessing his/her own account
        raise "Username '#{@account_user.email}' does not have access to this account" if @account != @account_user
      end

      Account.transaction do

        #changed from "update_attributes" because
        # - not all attributes can be updated
        # - params may contain one or more (might not be all) attributes
        # - super-user can change attrs that user cannot
        @account[:name] = params[:name] unless params[:name].nil?
        @account[:first_name] = params[:first_name] unless params[:first_name].nil?
        @account[:last_name] = params[:last_name] unless params[:last_name].nil?
        @account[:address] = params[:address] unless params[:address].nil?
        @account[:city] = params[:city] unless params[:city].nil?
        @account[:province] = params[:province] unless params[:province].nil?
        @account[:country] = params[:country] unless params[:country].nil?
        @account[:postal_code] = params[:postal_code] unless params[:postal_code].nil?
        @account[:phone] = params[:phone] unless params[:phone].nil?

        #Change password?
        unless (params[:password].nil? || params[:new_password].nil?)
          raise Exceptions::InvalidCredentials.new(@account.email) unless @account.verify_password(params[:password])
          @account[:password] = params[:new_password]
          @account[:status] = VersaFile::AccountStates.Enabled
        end

        #Allow super-user to modify these
        if @account_user.instance_of?(RkoUser)
          @account[:customer_code] = params[:customer_code] unless params[:customer_code].nil?
          @account[:billing_type] = params[:billing_type] unless params[:billing_type].nil?
          @account[:account_type] = params[:account_type] unless params[:account_type].nil?
          @account[:trial_period] = ((@account[:account_type] == VersaFile::AccountTypes.Trial) ? params[:trial_period] : -1) unless params[:trial_period].nil?
        end

        @account[:updated_by] = @account_user.instance_of?(RkoUser) ? @account_user.name : @account_user.email

        update_zone |= @account.trial_period_changed?
        unless @account.save
          raise_errors(@account.errors)
        end

        unless params[:subdomains].nil?

          params[:subdomains].each do |subdomain|
            @zone_node = @account.zone_nodes.find_by_subdomain(subdomain[:name])
            raise "Zone '#{subdomain[:name]}' is not associated with account '#{@account.name}'" if @zone_node.nil?

            @zone_node.name = @account.name unless @account.name.nil?
            @zone_node.max_users = subdomain[:user_quota] unless subdomain[:user_quota].nil?
            @zone_node.max_disk_space = (subdomain[:disk_quota].to_i * VersaFile::DiskSizes.Gigabyte) unless subdomain[:disk_quota].nil?

            update_zone |= @account.name_changed? |
                            @zone_node.max_users_changed? |
                            @zone_node.max_disk_space_changed?

            unless @zone_node.save
              raise_errors(@zone_node.errors)
            end

          end

        end

        #Update remote zone information
        logger.debug("UPDATE:> #{update_zone}")
        if update_zone
          @account.zone_nodes.each do |zone_node|
               zone_node.delay.zone_update
          end
        end


      end

      respond_to do |format|
        format.html { redirect_to @account, notice: 'Account was successfully created.' }
        format.json { render json: @account.to_json(:except=>:password, :methods => [:subdomains, :template]), status: :ok }
      end

    rescue => e
      logger.error "Account update failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  # DELETE /accounts/1
  # DELETE /accounts/1.json
  def destroy

    begin

      @account = Account.find_by_email(params[:id])
      @account = Account.find(params[:id]) if @account.nil?

      Account.transaction do

        @account.status = VersaFile::AccountStates.Deleted
        @account.created_by = @super_user.name
        @account.updated_by = @super_user.name

        unless @account.save
          raise @account.errors.full_messages().join(';')
        end

      end

      respond_to do |format|
        format.html { redirect_to @account, notice: 'Account was successfully deleted.' }
        format.json { render :text => "" }
      end

    rescue => e
      logger.error "Account deletion failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

end
