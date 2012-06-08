class ApplicationController < ActionController::Base
  protect_from_forgery

  has_mobile_fu
  before_filter :force_mobile_format

  before_filter :set_p3p

  def set_p3p
    response.headers["P3P"] = 'CP="CAO PSA OUR"'
  end

  def active_user

    if(@zone.users.exists?(session[:active_user_id]))

      @active_user = @zone.users.find(session[:active_user_id]) if session[:active_user_id]

      unless @active_user.nil?
        @active_group = @active_user.groups.first
        @active_group = @zone.groups.find_by_name('Everyone') if @active_group.nil?
      end

    else

      session.clear
      reset_session
      @active_user = nil

    end

    return @active_user
  end

  def account_user

    if Account.exists?(session[:account_user_id])
      @account_user = Account.find(session[:account_user_id]) if session[:account_user_id]
    end

  end

  def super_user

    if RkoUser.exists?(session[:super_user_id])
      @super_user = RkoUser.find(session[:super_user_id]) if session[:super_user_id]
    else
      session.clear
      reset_session
      @super_user = nil
    end

  end


  def is_session_active()

    logger.debug("EXPIRY TIME => #{session[:expiry_time]}")
    if session[:expiry_time].nil? or session[:expiry_time] < Time.now
      session.clear
      reset_session
      raise Exceptions::SessionExpired.new
    end

    return true
  end

  def guest_authorization_required()
    raise Exceptions::AuthorizationRequired.new if session[:guest_user_id].nil?

    logger.debug session[:guest_user_id]

  end

  def authorization_required()
    if(params[:f])
      @user=@zone.users.find_by_reset_fingerprint(params[:f])
      unless(@user.nil?)
        redirect_to :controller => 'zones', :id => @zone.subdomain, :action => 'expired', :f=>params[:f]
        return
      end
    end

    if self.active_user.nil?
      raise Exceptions::AuthorizationRequired.new
    end


=begin
#TODO: RE-IMPLEMENT session expiry
    if !session[:expiry_time].nil? and session[:expiry_time] < Time.now
      session.clear
      reset_session
      raise Exceptions::SessionExpired.new
    end

    session_timeout = @zone.configuration.configuration_settings.find_by_name('session_timeout').value.to_i
    session[:expiry_time] = session_timeout.seconds.from_now
    logger.debug("EXPIRY TIME => #{session[:expiry_time]}")
=end

  end

  def superuser_required

    if self.super_user.nil?
       raise Exceptions::AuthorizationRequired.new("Administration user authentication required.")
    end

  end

  def accountuser_required

    if self.account_user.nil? && self.super_user.nil?
      raise Exceptions::AuthorizationRequired.new("Account authentication required.")
    end

    @account_user = (@account_user.nil?) ? @super_user : @account_user

  end


  def get_zone_node(id)

    if(request.subdomains.first.downcase=="admin")
      return nil
    end

    zone_node ||= nil

    if id.blank?
      zone_node ||= ZoneNode.find_by_subdomain(request.subdomains.first)
      raise Exceptions::InvalidSubdomain.new(request.subdomains.first) if zone_node.blank?
    else
      zone_node ||= ZoneNode.find(id)
    end

    return zone_node

  end

  def zone_node_required
     @zone_node = get_zone_node(nil)
  end

  def zone_required()
    zone_id = params[:zone_id].nil? ? params[:id] : params[:zone_id]
    @zone = Zone.find_by_subdomain(zone_id)
    @zone = Zone.find(zone_id) if @zone.nil?
  end

  def library_required()
      zone_required()
      @library = @zone.libraries.find(params[:library_id])
  end

  def raise_errors(errors)

    err_msg = []
    errors.each do |err|
      err_msg << errors[err].join(';')
    end

    raise err_msg.join(';')
  end


end
