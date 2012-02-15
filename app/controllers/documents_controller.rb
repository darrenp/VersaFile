class DocumentsController < ApplicationController
  before_filter :library_required
  before_filter :authorization_required
  prawnto :filename => "export.pdf", :prawn => { :page_layout => :landscape }

  # PUT /document/1/cancel_checkout
  def cancel_checkout

    begin

      @document = @library.documents.viewable(@active_user, @active_group).find(params[:id])

      Document.transaction do
          @document.cancel_checkout(@active_user)
      end

      respond_to do |format|
        format.html { redirect_to @document, notice: 'Document was successfully updated.' }
        format.json { render :json => @document.to_json( :include => {:current_version => { :except => [:id, :document_id, :content_storage_name, :content_uniqueness_key, :is_current_version] }} ), :status => :ok, :location=>@document.dojo_url }
      end

    rescue => e
      logger.error "Document cancel checkout failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  # PUT /document/1/checkin
  def checkin

    begin

      isMinorVersion = params[:isMinorVersion].nil? ? false : params[:isMinorVersion]
      unique_id = params[:authenticity_token]

      @document = @library.documents.find(params[:id])
      @temp_file = UploaderHelper.read_file(@zone, unique_id, params[:current_version][:binary_file_name])

       Document.transaction do

         @document.update_attributes(
            :name => params[:name],
            :description => params[:description],
            :updated_by => @active_user.name
          )

          @document.update_metadata(params)
          @document.custom_metadata = @document.generate_custom_metadata()

          @version = Version.supersede(@zone, @document.current_version, @temp_file, isMinorVersion)
          if(@version.binary_content_type.blank?)
            @version.binary_content_type = params[:temp_file][:content_type]
          end
          @document.versions.push(@version)

          @document.checkin(@active_user)
          @document[:active_permissions] = @document.acl.get_role(@active_user, @active_group).permissions

          unless @document.save && @version.save
            raise @document.errors
          end

      end


      respond_to do |format|
        format.html { redirect_to @document, notice: 'Document was successfully checked in.' }
        format.json { render :json =>@document.to_json( :include => {:current_version => { :except => [:id, :document_id, :content_storage_name, :content_uniqueness_key, :is_current_version] }} ), :status => :ok, :location=>@document.dojo_url }
      end

    rescue => e
      logger.error "Document checkin failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  # PUT /document/1/checkout
  def checkout

    begin

      @document = @library.documents.viewable(@active_user, @active_group).find(params[:id])

      Document.transaction do
          @document.checkout(@active_user)
      end

      respond_to do |format|
        format.html { redirect_to @document, notice: 'Document was successfully updated.' }
        format.json { render :json => @document.to_json( :include => {:current_version => { :except => [:id, :document_id, :content_storage_name, :content_uniqueness_key, :is_current_version] }} ), :status => :ok, :location=>@document.dojo_url }
      end

    rescue => e
      logger.error "Document checkout failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  # PUT /document/1/file
  def file

    begin

      @document = @library.documents.find(params[:id])
      @folder = @library.folders.find(params[:folder_id])

      Document.transaction do
          @document.update_attributes(
              :folder => @folder,
              :updated_by => @active_user.name
          )

          if @document.acl.inherits
            @document.acl = @folder.acl.deep_clone()
            @document.acl.inherits = true
            @document.save
          end

      end

      respond_to do |format|
        format.html { redirect_to @document, notice: 'Document was successfully filed.' }
        format.json { render :json => @document.to_json( :include => {:current_version => { :except => [:id, :document_id, :content_storage_name, :content_uniqueness_key, :is_current_version] }} ), :status => :ok, :location=>@document.dojo_url }
      end

    rescue => e
      logger.error "Document file failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  def unfile

    begin

      @document = @library.documents.find(params[:id])

      Document.transaction do
          @document.update_attributes(
              :folder_id => 0,
              :updated_by => @active_user.name
          )

          if @document.acl.inherits
            @document.acl = @library.acl.deep_clone()
            @document.acl.inherits = true
            @document.save
          end

      end

      respond_to do |format|
        format.html { redirect_to @document, notice: 'Document was successfully unfiled.' }
        format.json { render :json =>@document.to_json( :include => {:current_version => { :except => [:id, :document_id, :content_storage_name, :content_uniqueness_key, :is_current_version] }} ), :status => :ok, :location=>@document.dojo_url }
      end

    rescue => e
      logger.error "Document unfile failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  # GET /documents
  # GET /documents.json
  def index

    @documents = []

    if params[:view].blank?
      @view_definition = @library.view_definitions.first
    else
      @view_definition = @library.view_definitions.find(params[:view])
    end
    @cell_definitions = @view_definition.cell_definitions.all

    columns = DocumentsHelper::generate_columns(params)
    joins = DocumentsHelper::generate_joins(params)
    sort = DocumentsHelper::generate_sort(params)
    range = DocumentsHelper::generate_range(request)

    @count = 0
    @documents = []

    @library=@zone.libraries.viewable(@active_user, @active_group).find(:all, :conditions=>{:id=>params[:library_id]})
    if(@library.length==0)
      @documents=[]
    else
      @library=@library.first
      case params[:type].to_i

        when Bfree::SearchTypes.Folder
          @folder = @library.folders.find_by_id(params[:query])
          if((@folder.nil?) || (!@folder.is_trash))
              @query = @library.documents.viewable(@active_user, @active_group).in_folder(@folder)
          else
              @query = @library.documents.deleted
          end
        when Bfree::SearchTypes.Simple
          @simple_text = params[:query]
          @query = @library.documents.viewable(@active_user, @active_group).simple(@simple_text)
        when Bfree::SearchTypes.Advanced
          @advanced = ActiveSupport::JSON.decode(params[:query])
          @query = @library.documents.viewable(@active_user, @active_group).advanced(@library, @advanced)
      end

      if(params[:type].to_i != Bfree::SearchTypes.None)
        @count = @query.count

        if(request.format=='application/json')
          @documents = @query.browse(columns,joins,sort,range)
        else
          @documents = @query.browse(columns,joins,sort,nil)
        end

      end
    end



    headers['Content-Range'] = "#{range['offset']}-#{range['offset'] + range['row_count']}/#{@count}"

    respond_to do |format|
      format.csv  {
        unless @documents.nil?
          formatted_documents = DocumentsHelper.generate_view(@documents,@cell_definitions,'csv')
          csv_string = CSV.generate do |csv|
            csv << formatted_documents[0].keys

            formatted_documents.each do |doc|
              csv << doc.values
            end
          end

          send_data(csv_string, :type => 'text/csv; charset=utf-8; header=present', :filename => "documents.csv")
        end
      }
      format.html # index.html.erb
      format.json  { render :json => @documents.to_json(:except => [:body,:metadata,:custom_metadata], :include => { :current_version => { :except => [:id, :document_id, :content_storage_name, :content_uniqueness_key, :is_current_version] }} ) }
      format.pdf
      format.xml  { send_data(DocumentsHelper.generate_view(@documents,@cell_definitions,'xml').to_xml, :filename => "documents.xml") }
    end

  end

  # GET /documents/1
  # GET /documents/1.json
  def show
    begin
      @document = @library.documents.allowed(@active_user, @active_group).find(params[:id])

      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @document.to_json( :include => {:current_version => { :except => [:id, :document_id, :content_storage_name, :content_uniqueness_key, :is_current_version] }} ) }
      end
    rescue ActiveRecord::RecordNotFound => e
      respond_to do |format|
        format.json { render :text => "{action:\"refresh\"}", status: :unprocessable_entity }
      end
    rescue => e
      logger.error "Document show failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  # GET /documents/new
  # GET /documents/new.json
  def new
    @document = Document.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @document }
    end
  end

  # GET /documents/1/edit
  def edit
    @document = Document.find(params[:id])
  end

  #post /documents/empty
  def empty
    @documents = @library.documents.deleted

    @documents.each do |document|
      document.destroy
      document.acl.destroy unless document.acl.nil?
    end

    respond_to do |format|
      format.json { render :json => "", :status => :ok }
    end
  end

  # POST /documents
  # POST /documents.json
  def create

    begin

      Document.transaction do

        isMinorVersion = params[:isMinorVersion].nil? ? false : params[:isMinorVersion]
        unique_id = params[:authenticity_token]

        @document_type = @library.document_types.find(params[:document_type_id]);

        tmp_file = UploaderHelper.read_file(@zone, unique_id, params[:current_version][:binary_file_name])
        logger.debug("FILE:> #{tmp_file.path}")
        @version = Version.supersede(@zone, nil, tmp_file, isMinorVersion)
        logger.debug("FILE:> #{@version.binary_file_name}")

        @document = @zone.documents.new({
            :library => @library,
            :document_type => @document_type,
            :folder_id => params[:folder_id],
            :name => params[:name],
            :description => params[:description],
            :state => Bfree::DocumentStates.CheckedIn,
            :created_by => @active_user.name,
            :updated_by => @active_user.name,
            :versions => [
              @version
            ]
        })

        @document.update_metadata(params)

        if(@version.binary_content_type=="")
          @version.binary_content_type=params[:current_version][:binary_content_type]
        end

        unless @document.save
          raise @document.errors
        end

        @document[:active_permissions] = @document.acl.get_role(@active_user, @active_group).permissions
        @document.delay.extract_content()

      end

      columns = DocumentsHelper.columns_from_doc_type(@document.document_type)

      respond_to do |format|
        format.html { redirect_to @document, notice: 'Document was successfully created.' }
        format.json { render json: @document.to_json( :only => columns, :include => {:current_version => { :only => [:binary_file_name, :binary_storage_type, :binary_content_type, :binary_file_size, :major_version_number, :minor_version_number] }} ), status: :created, location: @document.dojo_url }
        #format.json  { render :json => @documents.to_json(:except => [:body,:metadata,:custom_metadata], :include => { :current_version => { :except => [:id, :document_id, :content_storage_name, :content_uniqueness_key, :is_current_version] }} ) }
      end

    rescue => e
      logger.error "Document creation failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  # PUT /documents/1
  # PUT /documents/1.json
  def update
    begin
      @document = Document.find(params[:id])

      Document.transaction do

        @document.update_attributes(
            :name => params[:name],
            :description => params[:description],
            :updated_by => @active_user.name,
            :state => params[:state],
            :folder_id => params[:folder_id]
        )

        @document.update_metadata(params)
        @document.custom_metadata = @document.generate_custom_metadata()

        unless @document.save
          raise @document.errors
        end

      end

      respond_to do |format|
        format.html { redirect_to @document, notice: 'Document was successfully updated.' }
        format.json { render :json =>@document.to_json( :include => {:current_version => { :except => [:id, :document_id, :content_storage_name, :content_uniqueness_key, :is_current_version] }} ), :status => :ok, :location=>@document.dojo_url }
      end
    rescue ActiveRecord::RecordNotFound => e
      respond_to do |format|
        format.json { render :text => "{action:\"refresh\"}", status: :unprocessable_entity }
      end
    rescue => e

      respond_to do |format|
        format.html { render action: "edit" }
        format.json { render json: e.message, status: :unprocessable_entity }
      end
    end
  end

  # POST /documents/1/download.js
  def download

    begin

    @document = @library.documents.viewable(@active_user, @active_group).find(params[:id])
    logger.info "Preparing '#{@document.name}' for download..."

    version=@document.current_version

    local_filepath = version.path
    orig_filename = version.binary_file_name
    type = version.content_type&&params[:disposition]=='inline' ? version.content_type.open_as : version.binary_content_type

    send_file local_filepath, :filename => orig_filename, :type => type, :disposition => params[:disposition]

    rescue ActiveRecord::RecordNotFound=>e
      #Better error message that doesn't expose database'
      logger.error "Document download failed => #{e.message}"
      @errMsg = "Download failed: Couldn't find specified document"
      respond_to do |format|
        format.html { render :layout => false, :template => 'documents/missing' }
        format.json { render :json => @errMsg, :status => :unprocessable_entity }
      end
    rescue => e
      logger.error "Document download failed => #{e.message}"
      @errMsg = "Download failed: #{e.message}"
      respond_to do |format|
        format.html { render :layout => false, :template => 'documents/missing' }
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end

  end

  # DELETE /documents/1
  # DELETE /documents/1.json
  def destroy

    begin

      Document.transaction do
        @document = @library.documents.find(params[:id])

        if(@document.state & Bfree::DocumentStates.Deleted == Bfree::DocumentStates.Deleted)
          @document.destroy
          @document.acl.destroy unless @document.acl.nil?
          #@document.acl = @document.library.zone.acls.create(
          #    :inherits => false,
          #    :acl_entries => [
          #        AclEntry.create(:grantee => self.library.zone.groups.admins.first, :role => self.library.zone.roles.admins.first, :precedence => Bfree::Acl::PrecedenceTypes.NamedGroup )
          #    ]
          #)
        else
          @document.soft_delete(@active_user)
        end

      end

      respond_to do |format|
        format.html { redirect_to(@document) }
        format.xml  { head :ok }
        format.json { render :json => "", :status => :ok }
      end

    rescue => e
      logger.error "Document deletion failed => #{e.message}"
        respond_to do |format|
          format.json { render :json => e.message, :status => :unprocessable_entity }
        end
    end

  end

  # PUT /documents/1/restore
  # PUT /documents/1/restore.json
  def restore

    begin

      Document.transaction do
        @document = @library.documents.find(params[:id])
        @document.soft_restore(@active_user)
      end

      respond_to do |format|
        format.html { redirect_to @document, notice: 'Document was successfully restored.' }
        format.json { render :json => @document.to_json( :include => {:current_version => { :except => [:id, :document_id, :content_storage_name, :content_uniqueness_key, :is_current_version] }} ), :status => :ok, :location=>@document.dojo_url }
      end

    rescue => e
      logger.error "Document restoration failed => #{e.message}"
        respond_to do |format|
          format.json { render :json => e.message, :status => :unprocessable_entity }
        end
    end

  end

end
