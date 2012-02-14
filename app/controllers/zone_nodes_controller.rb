class ZoneNodesController < ApplicationController
  before_filter :zone_node_required, :only => :bfree

  require 'net/https'
  require 'net/http'
  require 'uri'

  rescue_from Exceptions::AuthorizationRequired do |exception|

    begin
      respond_to do |format|
        format.html { render :layout => false, :template => 'admin/welcome' }
        format.json { render :json => 'Login failed: ' + exception.message, :status => :unauthorized }
      end
    rescue => e
      logger.debug 'ERROR: ' + e.message
    end

  end

  # GET /zone_nodes/master
  def bfree

    if(request.subdomains.first.downcase == "admin")

      superuser_required()

      if(session[:super_user_id] != nil)
        @active_rko_user = RkoUser.find_by_id(session[:super_user_id])
      end

      respond_to do |format|
        if @active_rko_user.nil?
          format.html { render :layout => false, :template => 'admin/welcome' }
        else
          format.html { render :layout => false, :template => 'admin/show' }
        end
      end

    else

      logger.debug("Accessing zone => '#{@zone_node.name}'")
      respond_to do |format|
        format.html { render :layout => false } # master.html.erb
      end

    end

  end

  # GET /zone_nodes
  # GET /zone_nodes.json
  def index

    if params[:account_id].blank?
      @zone_nodes = ZoneNode.all
    else
      @account = Account.find(params[:account_id])
      @zone_nodes = @account.zone_nodes.all
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @zone_nodes }
    end
  end

  # GET /zone_nodes/1
  # GET /zone_nodes/1.json
  def show
    @zone_node = ZoneNode.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @zone_node, location: @zone_node }
    end
  end

  # GET /zone_nodes/new
  # GET /zone_nodes/new.json
  def new

    @account = Account.find(params[:account_id])
    @server = Server.where('current = true').first
    @zone_node = @account.zone_nodes.new(
        :name => @account.name,
        :server => @server
    )

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @zone_node }
    end
  end

  # GET /zone_nodes/1/edit
  def edit
    @account = Account.find(params[:account_id])
    @zone_node = @account.zone_nodes.find(params[:id])
    @server = @zone_node.server
  end

  # POST /zone_nodes
  # POST /zone_nodes.json
  def create

    begin

      ZoneNode.transaction do

        @zone_node = ZoneNode.new(params[:zone_node])
        unless @zone_node.save
          raise @zone_node.errors.full_messages().join(';')
        end

      end

      respond_to do |format|
        format.html { redirect_to account_zone_node_url, notice: 'Zone was successfully created.' }
        format.json { render json: @zone_node, status: :created, location: @zone_node }
      end

    rescue => e
      logger.error("Zone creation failed:> #{e.message}")
      render :json => e.message, :status => :unprocessable_entity
    end

  end

  # PUT /zone_nodes/1
  # PUT /zone_nodes/1.json
  def update
    begin
      if(configatron.admin.reserved.subdomains.include?(params[:subdomain]))
        raise "The subdomain #{params[:subdomain]} is reserved."
      end

      @zone_node = ZoneNode.find(params[:id])

      respond_to do |format|
        if @zone_node.update_attributes(params[:zone_node])
          format.html { redirect_to @zone_node, notice: 'Zone node was successfully updated.' }
          format.json { render json: @zone_node, status: :created, location: @zone_node }
        else
          format.html { render action: "edit" }
          format.json { render json: @zone_node.errors, status: :unprocessable_entity }
        end
      end
    rescue => e
      respond_to do |format|
        format.html { render action: "edit" }
        format.json { render :text=> e, status: :unprocessable_entity }
      end
    end

  end

  def update_current_usage
    @zone_node = ZoneNode.find(params[:id])

    u="#{@zone_node.server.base_url}/zones/usage"

    url = URI.parse(u)

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl=@zone_node.server.protocol=="https"
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    #http.ca_file = '/etc/ssl/rkocert/ssl.crt' if File.exists?('/etc/ssl/rkocert/ssl.crt')

    form={:subdomain=>@zone_node.subdomain}

    request = Net::HTTP::Post.new(url.request_uri)
    request.set_form_data(form)

    response = http.request(request)

    #puts "Request Body: #{request.body}"
    #puts "Response Body: #{response.body}"

    body=JSON.parse(response.body)

    #puts "Response Body: #{body}"
    #puts "Response Body Size: #{body["size"]}"
    #puts "Response Body Users: #{body["users"]}"

    @zone_node.current_disk_space = body["size"]
    @zone_node.current_users = body["users"]

    respond_to do |format|
      if @zone_node.save
        format.json { render json: @zone_node, status: :created, location: @zone_node }
      else
        format.json { render json: @zone_node.errors, status: :unprocessable_entity }
      end
    end
  end

  def deploy

    @zone_node = ZoneNode.find(params[:id])

    @zone_node.deployed=1
    @zone_node.server.active=1

    #TODO: CHANGE TO ACTIVE SERVER!!!!
    u="#{@zone_node.server.base_url}/zones.json"

    url = URI.parse(u)

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = @zone_node.server.protocol=="https"
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    form={:name=>@zone_node.name,
          :subdomain=>@zone_node.subdomain,
          :fingerprint=>@zone_node.fingerprint}

    request = Net::HTTP::Post.new(url.request_uri)
    request.set_form_data(form)

    response = http.request(request)

    puts "Response Body: #{response.body}"

    respond_to do |format|
      if @zone_node.save
        format.json { render json: @zone_node, status: :created, location: @zone_node }
      else
        format.json { render json: @zone_node.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /zone_nodes/1
  # DELETE /zone_nodes/1.json
  def destroy
    @zone_node = ZoneNode.find(params[:id])
    @zone_node.destroy

    respond_to do |format|
      format.html { redirect_to zone_nodes_url }
      format.json { render :text => "" }
    end
  end
end
