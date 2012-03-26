class AclsController < ApplicationController
  before_filter :zone_required
  before_filter :authorization_required

  # GET /acls
  # GET /acls.json
  def index
    @acls = @zone.acls.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @acls }
    end
  end

  # GET /acls/1
  # GET /acls/1.json
  def show

    @acl = params[:securable_type].nil? ?
                  @zone.acls.find(params[:id]) :
                  @zone.acls.find_by_securable_id(params[:id], :conditions => { :securable_type => params[:securable_type]})

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @acl }
      format.json  { render :json => @acl.to_json(:include => {:acl_entries => {:only => [:grantee_id, :grantee_type, :role_id]} }) }
    end

  end

  # GET /acls/new
  # GET /acls/new.json
  def new
    @acl = Acl.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @acl }
    end
  end

  # GET /acls/1/edit
  def edit
    @acl = @zone.acls.find(params[:id])
  end

  # POST /acls
  # POST /acls.json
  def create
    @acl = @zone.acls.new(params[:acl])

    respond_to do |format|
      if @acl.save
        format.html { redirect_to @acl, notice: 'Acl was successfully created.' }
        format.json { render json: @acl, status: :created, location: @acl }
      else
        format.html { render action: "new" }
        format.json { render json: @acl.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /acls/1
  # PUT /acls/1.json
  def update

    begin

      @acl = params[:securable_type].nil? ?
                  @zone.acls.find(params[:id]) :
                  @zone.acls.find_by_securable_id(params[:id], :conditions => { :securable_type => params[:securable_type]})
      @entries = params[:acl_entries]

      Acl.transaction do

        @acl.inherits = params[:inherits]
        if @acl.inherits && @acl.securable.respond_to?(:inherit_acl)
          @acl = @acl.securable.inherit_acl()
        else

          @acl.acl_entries.clear
          @entries.each do |entry|
            grantee = AclsHelper.get_grantee(@zone, entry[:grantee_type], entry[:grantee_id])
            precedence = AclsHelper.get_precedence(grantee)
            role = @zone.roles.find(entry[:role_id])

             @acl.acl_entries << AclEntry.new(
                :role => role,
                :precedence => precedence,
                :grantee => grantee
            )

          end

          unless @acl.save
            raise @acl.errors
          end
        end

        #Propogate to children
        if(@acl.securable.respond_to?(:propagate_acl))
          @acl.securable.propagate_acl()
        end

      end

      @role = @acl.get_role(@active_user, @active_group)

      respond_to do |format|
        format.json  { render :json => @acl.to_json(:include => {:acl_entries => {:only => [:grantee_id, :grantee_type, :role_id]} }) }
        #format.json { render :json => @role.permissions, :status => :ok }
      end

    rescue => e
      logger.error "ACL update failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /acls/1
  # DELETE /acls/1.json
  def destroy
    @acl = @zone.acls.find(params[:id])
    @acl.destroy

    respond_to do |format|
      format.html { redirect_to acls_url }
      format.json { head :ok }
    end
  end
end
