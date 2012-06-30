class SharesController < ApplicationController
  before_filter :zone_node_required, :only => :forward
  before_filter :zone_required, :only => :show
  before_filter :guest_authorization_required, :only => [:shared_items, :download]

  def authorize

    begin

      @share = Share.find_by_fingerprint(params[:id])
      @share.authorize(params[:password])

      session[:guest_user_id] = "guest@%s" % request.remote_ip

      respond_to do |format|
        format.html { render :layout => false } # master.html.erb
        format.json { render json: @share.to_json(:except => [:password, :library_id, :folder_id]) }
      end

    rescue => e
      logger.debug 'ERROR: ' + e.message
      respond_to do |format|
        format.json  { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  def download

    @share = Share.find_by_fingerprint(params[:id])
    @reference = @share.folder.references.find(params[:item_id])

    document = @reference.document
    disposition = params[:disposition].nil? ? 'inline' : params[:disposition]
    version = document.current_version
    type = version.content_type && disposition == 'inline' ?
              version.content_type.open_as :
              version.binary_content_type

    send_file(
        version.path,
        :filename => version.binary_file_name,
        :type => type,
        :disposition => disposition
    )

  end

  def shared_items

    @share = Share.find_by_fingerprint(params[:id])
    @items = @share.folder.references.not_deleted.full.order('name ASC')

    respond_to do |format|
      format.json { render json: @items }
    end

  end

  def show

    begin

      @share = Share.find_by_fingerprint(params[:id])

      raise "Share cannot be found" if @share.nil?
      raise "Share expired" if @share.expired?

    rescue => e
      @error = e
    end

    respond_to do |format|
      format.html { render :layout => false } # master.html.erb
      format.json { render json: @share.to_json(:except => [:password, :library_id, :folder_id]) }
    end

  end

  def forward
    @share_url = @zone_node.share_url(params[:id])
    logger.debug("Accessing zone => '#{@zone_node.name}'")
    respond_to do |format|
      format.html { render :layout => false } # master.html.erb
    end
  end

end
