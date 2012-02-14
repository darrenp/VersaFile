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

    if params[:securable_type].nil?
      @acl = @zone.acls.find(params[:id])
    else
      @acl = @zone.acls.find_by_securable_id(params[:id], :conditions => { :securable_type => params[:securable_type]})
    end

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @acl }
      format.json  { render :json => @acl.to_json( :include =>
                                                      {:acl_entries => { :include =>
                                                                             {  :role => {:only => [:id, :name, :permissions]},
                                                                                :grantee => {:only => [:id, :name]} } }},
                                                                          :except => [ :zone_id ] ) }
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

      if params[:securable_type].nil?
        @acl = @zone.acls.find(params[:id])
      else
        @acl = @zone.acls.find_by_securable_id(params[:id], :conditions => { :securable_type => params[:securable_type]})
      end

      Acl.transaction do

        @acl.inherits = params[:inherits]
        @acl.acl_entries.destroy_all

        params[:acl_entries].each do |acl_entry|
          @role = @zone.roles.find( acl_entry[:role_id])

            if(acl_entry[:grantee_type] == 'user')
              @grantee = @zone.users.find(acl_entry[:grantee_id])
              @precedence = Bfree::Acl::PrecedenceTypes.NamedUser
            else
              @grantee = @zone.groups.find(acl_entry[:grantee_id])
              @precedence = (@grantee.name == 'Everyone') ? Bfree::Acl::PrecedenceTypes.Everyone : Bfree::Acl::PrecedenceTypes.NamedGroup
              if(@grantee.name=='Everyone'&&params[:inherits])
                acl=nil
                if(@acl.securable_type=='Document')
                  if(@acl.securable.folder_id==0)
                    acl=@acl.securable.library.acl
                  else
                    acl=@acl.securable.folder.acl
                  end
                else
                  if(@acl.securable.parent_id==0)
                    acl=@acl.securable.library.acl
                  else
                    acl=@acl.securable.parent.acl
                  end
                end
                  @role=acl.acl_entries.first(:conditions=>"grantee_type='Group' AND grantee_id=#{@grantee.id}").role
              end
            end


            @acl.acl_entries << AclEntry.new(
                :role => @role,
                :precedence => @precedence,
                :grantee => @grantee
            )

        end

        unless @acl.save
          raise @acl.errors
        end

        #Propogate to children
        if(@acl.securable.respond_to?(:propagate_acl))
          @acl.securable.propagate_acl()
        end

      end

      @role = @acl.get_role(@active_user, @active_group)

      respond_to do |format|
        format.json { render :json => @role.permissions, :status => :ok }
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
