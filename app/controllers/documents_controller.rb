class DocumentsController < ApplicationController
  before_filter :library_required
  before_filter :authorization_required
  prawnto :filename => "export.pdf", :prawn => { :page_layout => :landscape }

  rescue_from Exception, :with => :document_error
  rescue_from ActiveRecord::RecordNotFound, :with => :document_not_found


  # PUT /document/1/file
  def file

    @document = @library.documents.viewable(@active_user, @active_group).not_deleted.full.find(params[:id])
    @folder = @library.folders.find(params[:folder_id]) #TODO: What happens if folder has been deleted

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

    columns = DocumentsHelper.columns_by_doctype(@document)

    respond_to do |format|
        format.html { redirect_to @document, notice: 'Document was successfully filed.' }
        format.json { render json: @document.to_json(:only => columns) }
    end

  end

  def unfile

    @document = @library.documents.viewable(@active_user, @active_group).not_deleted.full.find(params[:id])

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

    columns = DocumentsHelper.columns_by_doctype(@document)

    respond_to do |format|
      format.html { redirect_to @document, notice: 'Document was successfully unfiled.' }
      format.json { render json: @document.to_json(:only => columns) }
    end

  end

  # GET /documents
  # GET /documents.json
  def index

    @query_type = params[:type].nil? ? Bfree::SearchTypes.None : params[:type].to_i
    @view = @library.view_definitions.find_by_id(params[:view])
    @documents = []
    @query = nil

    sort = DocumentsHelper::generate_sort(params)
    range = DocumentsHelper::generate_range(request)

      case @query_type
        when Bfree::SearchTypes.Folder
          @folder = @library.folders.find_by_id(params[:query])
          @query = @library.documents.viewable(@active_user, @active_group).active.in_folder(@folder)
        when Bfree::SearchTypes.Trash
          @query = @library.documents.viewable(@active_user, @active_group).deleted
        when Bfree::SearchTypes.Simple
          @simple_text = params[:query]
          @query = @library.documents.viewable(@active_user, @active_group).simple(@simple_text)
        when Bfree::SearchTypes.Advanced
          @advanced = ActiveSupport::JSON.decode(params[:query])
          @query = @library.documents.viewable(@active_user, @active_group).advanced(@library, @advanced)
      end

      @count = @query.nil? ? 0 : @query.count
      @documents = @query.browse(@view, sort, range) unless @query.nil?

      headers['Content-Range'] = "#{range['offset']}-#{range['offset'] + range['row_count']}/#{@count}"

      respond_to do |format|
        format.csv { send_data(to_csv(@documents, @view), :type => 'text/csv; charset=utf-8; header=present', :filename => "documents.csv") }
        format.html # index.html.erb
        format.json  { render :json => @documents }
        format.pdf
        format.xml  { send_data(DocumentsHelper.generate_view(@documents, @view,'xml').to_xml, :filename => "documents.xml") }
      end


  end

  # GET /documents/1
  # GET /documents/1.json
  def show

    @document = @library.documents.full.find(params[:id])
    columns = DocumentsHelper.columns_by_doctype(@document)

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @document.to_json(:only => columns) }
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

    Document.transaction do

      isMinorVersion = params[:isMinorVersion].nil? ? false : params[:isMinorVersion]
      unique_id = params[:authenticity_token]

      @document_type = @library.document_types.find(params[:document_type_id]);
      @folder = (params[:folder_id].nil? || params[:folder_id] == 0) ? nil : @library.folders.viewable(@active_user, @active_group).find(params[:folder_id])

      tmp_file = UploaderHelper.read_file(@zone, unique_id, params[:binary_file_name])
      @version = Version.supersede(@library, nil, tmp_file, isMinorVersion)

      @document = @zone.documents.new({
          :library => @library,
          :document_type => @document_type,
          :name => params[:name],
          :description => params[:description],
          :state => Bfree::DocumentStates.CheckedIn,
          :created_by => @active_user.name,
          :updated_by => @active_user.name,
          :versions => [ @version ]
      })

      @document.update_metadata(params)

      if(@version.binary_content_type.blank?)
        @version.binary_content_type = params[:binary_content_type]
      end

      unless @document.save
        raise @document.errors
      end

      @reference = @library.references.create({
        :reference_type => VersaFile::ReferenceTypes.Content,
        :document => @document,
        :folder_id => (@folder.nil? ? 0 : @folder.id)
      })

      @document.delay.extract_content()

    end

    columns = DocumentsHelper.columns_by_doctype(@document)
    @document = @library.documents.full.find(@document.id)

    respond_to do |format|
      format.html { redirect_to @document, notice: 'Document was successfully created.' }
      format.json { render json: @document.to_json(:only => columns), status: :created, location: @document.dojo_url }
    end

  end

  # PUT /documents/1
  # PUT /documents/1.json
  def update

    @document = @library.documents.viewable(@active_user, @active_group).not_deleted.full.find(params[:id])

    #CHECK PERMISSIONS HERE
    unless Acl.has_rights(@document.active_permissions, Bfree::Acl::Permissions.WriteMetadata)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.WriteMetadata)
    end

    Document.transaction do

      @document.update_attributes(
          :name => params[:name],
          :description => params[:description],
          :updated_by => @active_user.name,
          :state => params[:state],
          :folder_id => params[:folder_id],
          :document_type_id => params[:document_type_id],
          :custom_metadata => nil
      )

      @document_type=DocumentType.find(@document.document_type_id)
      @document.document_type_name = @document_type.name

      @document.update_metadata(params)

      unless @document.save
        raise @document.errors
      end

    end

    columns = DocumentsHelper.columns_by_doctype(@document)

    respond_to do |format|
      format.html { redirect_to @document, notice: 'Document was successfully updated.' }
      format.json { render json: @document.to_json(:only => columns), :status => :ok }
    end

  end

  # POST /documents/1/download.js
  def download

    @document = @library.documents.viewable(@active_user, @active_group).full.find(params[:id])
    logger.info "Preparing '#{@document.name}' for download..."

    version = params[:version_id].nil? ? @document.current_version : @document.versions.find(params[:version_id])

    local_filepath = version.path
    orig_filename = version.binary_file_name
    type = version.content_type&&params[:disposition]=='inline' ? version.content_type.open_as : version.binary_content_type

    send_file local_filepath, :filename => orig_filename, :type => type, :disposition => params[:disposition]

  end

  #PUT /documents/1/soft_delete.json
  def soft_delete

    @document = @library.documents.viewable(@active_user, @active_group).not_deleted.full.find(params[:id])

    unless Acl.has_rights(@document.active_permissions, Bfree::Acl::Permissions.Delete)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.Delete)
    end

    Document.transaction do
      @document.soft_delete(@active_user)
    end

    columns = DocumentsHelper.columns_by_doctype(@document)

    respond_to do |format|
      format.html { redirect_to @document, notice: 'Document was successfully deleted.' }
      format.json { render json: @document.to_json(:only => columns) }
    end

  end

  # DELETE /documents/1
  # DELETE /documents/1.json
  def destroy

    @document = @library.documents.viewable(@active_user, @active_group).full.find(params[:id])

    #CHECK PERMISSIONS HERE
    unless Acl.has_rights(@document.active_permissions, Bfree::Acl::Permissions.Delete)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.Delete)
    end

    Document.transaction do

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
      format.json { render :json => [], :status => :ok }
    end


  end

  # PUT /documents/1/restore
  # PUT /documents/1/restore.json
  def restore

    @document = @library.documents.find(params[:id])

    Document.transaction do
      @document.soft_restore(@active_user)
    end

    columns = DocumentsHelper.columns_by_doctype(@document)

    respond_to do |format|
      format.html { redirect_to @document, notice: 'Document was successfully restored.' }
      format.json { render json: @document.to_json(:only => columns) }
    end

  end

:protected

  def document_error(e)
    logger.error "Failed perform document action => #{e.message}"
    logger.error "#{e.backtrace.join('\n')}"
    respond_to do |format|
      format.json { render :json => e.message, :status => :unprocessable_entity }
    end
  end

  def document_not_found(e)
    logger.error "Failed to retrieve document => #{e.message}"
    logger.error "#{e.backtrace.join('\n')}"
    respond_to do |format|
        msg = "Document with id = #{params[:id]} could not be found. It may have been deleted or your permissions may have been revoked."
        format.json { render :json => msg, :status => :not_found }
      end
  end

  def to_csv(documents, view)
    formatted_documents = DocumentsHelper.generate_view(documents, view, 'csv')
    csv_string = CSV.generate do |csv|
      csv << formatted_documents[0].keys
      formatted_documents.each do |doc|
        csv << doc.values
      end
    end
    return csv_string
  end


end
