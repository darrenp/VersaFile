
class ZonesController < ApplicationController
  before_filter :zone_required, :except => [:missing,:index,:new,:create, :usage, :exists]
  before_filter(:only => :show) do |controller|
    authorization_required() unless controller.request.format.json?
  end
  skip_before_filter :verify_authenticity_token, :only => [:create, :update]


  rescue_from Exceptions::AuthorizationRequired do |exception|

    begin
      respond_to do |format|
        format.html { redirect_to :controller => 'zones', :action => 'welcome', :id => @zone.subdomain }
        format.json { render :json => 'Login failed: ' + exception.message, :status => :unauthorized }
      end
    rescue => e
      logger.debug 'ERROR: ' + e.message
    end

  end

  rescue_from Exceptions::SessionExpired do |exception|
    begin
      respond_to do |format|
        format.html { redirect_to :controller => 'zones', :action => 'welcome', :id => 1 }
        format.json { render :json => 'Session expired' , :status => :unauthorized }
      end
    rescue => e
      logger.debug 'ERROR: ' + e.message
    end
  end

  # GET /document_types/1/metrics
  # GET /document_types/1/metrics.json
  def metrics

    begin

      @metrics = @zone.generateMetrics();

      respond_to do |format|
        format.html # index.html.erb
        format.json { render json: @metrics }
      end

    rescue => e
      logger.error "Zone metrics generation failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  def alive

    begin

      is_active = is_session_active()
      rsp_status = :ok

    rescue => e
      logger.error("ERROR => #{e.message}")
      is_active = false
      rsp_status = :unauthorized
    end

    respond_to do |format|
        format.json  { render :json => is_active, :status => rsp_status }
    end

  end

  def avatar

    @avatar = @zone.avatar
    unless @avatar.nil?
      redirect_to zone_avatar_path(@zone, @avatar)
    else
      redirect_to avatars_zone_default_path
    end

  end

  #GET /zones/exists
  #GET /zones/exists.json
  def exists
    respond_to do |format|
      format.json { render :text=>"#{params[:exists]}({exists: true});", status: :ok }
    end
  end

  def usage

    zone=Zone.find_by_subdomain(params[:subdomain])

    users=zone.users.all.count

    size=`du -sb #{"#{Rails.root}/system/#{zone.subdomain}/"}`
    size=size.split("\t")[0].to_i

    #Find.find("#{Rails.root}/system/#{zone.subdomain}/content/") do |f| size += File.stat(f).size end

    x={:users=>users, :size=>size}

    respond_to do |format|
        format.html  { render :json => x}
        format.json  { render :json => x}
    end
  end

  def logon

    begin

      raise Exceptions::InvalidCredentials.new(params[:username]) if params[:username].blank?
      @user = @zone.users.find_by_name(params[:username])
      raise Exceptions::InvalidCredentials.new(params[:username]) if @user.nil?
      @group = @user.groups.first

      logger.debug "Authorizing user '#{params[:username]}@#{@zone.subdomain}'..."
      @zone.authorize(@user, params[:password], @group)
      session[:active_user_id] = @user.id
      authorization_required
      logger.debug "'#{@user.qualified_name}' is authorized."

      respond_to do |format|
        format.html # authorize.html.erb
        format.xml  { render :xml => @user }
        format.json  { render :json => @user.to_json(:except => [:password, :zone_id]) }
      end

    rescue Exceptions::InvalidSubdomain => e

    rescue => e
      logger.debug 'ERROR: ' + e.message
      session.clear
      respond_to do |format|
        format.json  { render :json => 'Logon failed: ' + e.message, :status => :unprocessable_entity }
      end

    end

  end

  def logoff

    begin

      unless active_user.nil?
        logger.debug "User '#{active_user.qualified_name}' logging off..."
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

  # GET /zones/welcome
  # GET /zones/1.xml
  def welcome

    respond_to do |format|
      format.html {

        if @zone.nil? || active_user.nil?
          render :layout => false
        else
          redirect_to :controller => 'zones', :id => @zone.subdomain, :action => 'show'
        end

      } # welcome.html.erb
      format.xml  { render :xml => @zone }
    end

  end

  #GET /zones/1/expired
  def expired
    @user=active_user
    respond_to do |format|
      format.html # expired.html.erb
    end
  end

  # GET /zones/1/reset
  def reset
    begin

      @user=User.find_by_name(params[:username])

      if((@user == nil) || @user.email.nil? || @user.email.downcase != params[:email].downcase)
        raise "We could not find an account that matches your credentials, please contact your administrator."
      end

      o =  [('a'..'z'),('A'..'Z')].map{|i| i.to_a}.flatten
      fngrprint  =  (0..20).map{ o[rand(o.length)]  }.join
      @tmp_password=(0..8).map{o[rand(o.length)]}.join

      unless @user.update_attributes(
        :reset_fingerprint => fngrprint,
        :reset_password => @tmp_password)
        raise @user.errors
      end

      #TODO: This should use delayed_job so the user doesn't have
      #to wait for the email to be constructed and sent
      unless @user.email.nil?
        @email = EmailWorker.new(@user.email, {:zone => @zone, :user => @user, :password => @tmp_password, :fingerprint=>fngrprint })
        @email.delay.send_user_reset()
      end

      respond_to do |format|
        logger.debug('SUCCESS')
        format.json  { render :json => '', status => :ok }
      end

    rescue => e
      logger.error "User #{params[:username]} attempted reset with email #{params[:email]}: #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end


  end

  # GET /zones
  # GET /zones.json
  def index
    @zones = Zone.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @zones }
    end
  end

  # GET /zones/1
  # GET /zones/1.json
  def show

    @library = @zone.libraries.first

    respond_to do |format|
      format.html {
        @user = active_user
        if(@user != nil && @user.password_expires !=nil && @user.password_expires < Time.now)
          redirect_to :controller => 'zones', :id => @zone.subdomain, :action => 'expired'
          return
        else
          render :layout => false
        end
      }# show.html.erb
      format.json { render :json => @zone.to_json(
          :include => {  :configuration => {:include => {:configuration_settings => {:only => [:name, :value]}},
                            :only => [:configuration_settings]}},
          :methods => [:trial_expiry],
          :except => [:fingerprint, :zone_avatar_id]) }
    end

  end

  # GET /zones/new
  # GET /zones/new.json
  def new

    @zone = Zone.new
    @zone.name = params[:name]
    @zone.subdomain = params[:subdomain]
    @zone.fingerprint = params[:fingerprint]

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @zone }
    end
  end

  # GET /zones/1/edit
  def edit
    @zone = Zone.find(params[:id])
  end

  # POST /zones
  # POST /zones.json
  def create

    begin

      Zone.transaction do

        @zone = Zone.create(
          :name => params[:name],
          :subdomain => params[:subdomain],
          :fingerprint => params[:fingerprint],
          :created_by => params[:created_by],
          :updated_by => params[:created_by]
        )

        #set admin info
        @temp_password = User.generate_password
        logger.debug("PASSWORD:> #{@temp_password}")

        @admin = @zone.users.admins.first
        @admin.update_attributes({
          :email => params[:email],
          :password => @temp_password,
          :first_name => params[:first_name],
          :last_name => params[:last_name]
        })

        @zone.configuration.configuration_settings.create([
          { :name => 'user_quota', :value => params[:user_quota].to_s },
          { :name => 'disk_quota', :value => params[:disk_quota].to_s },
          { :name => 'trial_period', :value => params[:trial_period].to_s }
        ])

        unless @zone.save
          raise @zone.errors.full_messages().join(';')
        end

        template_id = params[:template_id].nil? ?
                      VersaFile::ZoneTemplates.None :
                      params[:template_id]

        if ZoneTemplate.exists?(template_id)
          zone_template = ZoneTemplate.find(template_id)
          zone_template.apply(@zone)
        end

        @email = EmailWorker.new(@admin.email, {:zone => @zone, :user => @admin, :password => @temp_password })
        if(params[:trial_period].to_i < 0)
          @email.delay.send_zone_creation_active()
        else
          @email.delay.send_zone_creation_trial()
        end

      end

      respond_to do |format|
        format.html { redirect_to zone_url, notice: 'Zone was successfully created.' }
        format.json { render :json => @zone, :status => :created, :location => @zone.dojo_url }
      end

    rescue => e
      logger.error("Zone creation failed:> #{e.message}")
      render :json => e.message, :status => :unprocessable_entity
    end

  end

  # PUT /zones/1
  # PUT /zones/1.json
  def update

    begin

      @admin = @zone.users.admins.first

      Zone.transaction do

        send_upgrade_email = false

        @zone.name = params[:name] unless params[:name].nil?

        #update configuration
        cfg_user_quota = @zone.configuration.configuration_settings.find_by_name('user_quota')
        cfg_user_quota.value = params[:user_quota] unless params[:user_quota].nil?
        cfg_disk_quota = @zone.configuration.configuration_settings.find_by_name('disk_quota')
        cfg_disk_quota.value = params[:disk_quota] unless params[:disk_quota].nil?
        cfg_trial_period = @zone.configuration.configuration_settings.find_by_name('trial_period')
        cfg_trial_period.value = params[:trial_period] unless params[:trial_period].nil?

        send_email_active = (cfg_trial_period.value_changed? && (cfg_trial_period.value.to_i < 0))
        send_email_upgrade = (cfg_user_quota.value_changed? || cfg_disk_quota.value_changed?)

        @zone.updated_by = params[:updated_by] unless params[:updated_by].nil?
        unless @zone.save
          raise_errors(@zone.errors)
        end

        cfg_user_quota.save
        cfg_disk_quota.save
        cfg_trial_period.save

        if(send_email_active)
          @email = EmailWorker.new(@admin.email, {:zone => @zone })
          @email.delay.send_zone_upgrade_active()
        end
        if(send_email_upgrade)
          user_quota_str = cfg_user_quota.value
          disk_quota_str = Object.new.extend(ActionView::Helpers::NumberHelper).number_to_human_size(cfg_disk_quota.value.to_i)
          @email = EmailWorker.new(@admin.email, {:zone => @zone, :user_quota => user_quota_str, :disk_quota => disk_quota_str })
          @email.delay.send_zone_upgrade_quota()
        end

      end

      respond_to do |format|
        format.html { redirect_to zone_url, notice: 'Zone was successfully updated.' }
        format.json { render :json => @zone, :status => :ok }
      end

    rescue => e
      logger.error("Zone update failed:> #{e.message}")
      render :json => e.message, :status => :unprocessable_entity
    end

  end

  # DELETE /zones/1
  # DELETE /zones/1.json
  def destroy
    @zone = Zone.find(params[:id])
    @zone.destroy

    respond_to do |format|
      format.html { redirect_to zones_url }
      format.json { head :ok }
    end
  end
end

