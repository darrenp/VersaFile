class ReferencesController < ApplicationController
  before_filter :library_required
  before_filter :authorization_required
  prawnto :filename => "export.pdf", :prawn => { :page_layout => :landscape }
  #rescue_from Exception, :with => :reference_error
  #rescue_from ActiveRecord::RecordNotFound, :with => :reference_not_found

  # PUT /reference/1/cancel_checkout
  def cancel_checkout

    @reference = @library.references.viewable(@active_user, @active_group).complete.find(params[:id])

    #CHECK PERMISSIONS HERE
    unless Acl.has_rights(@reference.active_permissions, Bfree::Acl::Permissions.Version)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.Version)
    end

    Document.transaction do
        @reference.document.cancel_checkout(@active_user)
    end

    columns = ReferencesHelper.columns_by_doctype(@reference.document)
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @reference.to_json(:only => columns) }
    end

  end

   # PUT /document/1/checkin
  def checkin

    @reference = @library.references.viewable(@active_user, @active_group).complete.find(params[:id])

    #CHECK PERMISSIONS HERE
    unless Acl.has_rights(@reference.active_permissions, Bfree::Acl::Permissions.Version)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.Version)
    end

    #retrieve temporary file
    unique_id = params[:authenticity_token]
    @temp_file = UploaderHelper.read_file(@zone, unique_id, params[:binary_file_name])

    Document.transaction do
      @reference.document.checkin(@active_user, params, @temp_file)

      unless @reference.document.save
        raise @reference.document.errors
      end

    end

    columns = ReferencesHelper.columns_by_doctype(@reference.document)
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @reference.to_json(:only => columns) }
    end

  end


  # PUT /reference/1/checkout
  def checkout

    @reference = @library.references.viewable(@active_user, @active_group).complete.find(params[:id])

    #CHECK PERMISSIONS HERE
    unless Acl.has_rights(@reference.active_permissions, Bfree::Acl::Permissions.Version)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.Version)
    end

    Document.transaction do
       @reference.document.checkout(@active_user)
    end

    columns = ReferencesHelper.columns_by_doctype(@reference.document)
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @reference.to_json(:only => columns) }
    end

  end

  def download

    @reference = @library.references.viewable(@active_user, @active_group).full.find(params[:id])

    #CHECK PERMISSIONS HERE
    unless Acl.has_rights(@reference.active_permissions, Bfree::Acl::Permissions.View)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.View)
    end

    document = @reference.document
    disposition = params[:disposition].nil? ? 'inline' : params[:disposition]
    version = params[:version_id].nil? ? document.current_version : document.versions.find(params[:version_id])

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

  def file

    @reference = @library.references.viewable(@active_user, @active_group).full.find(params[:id])
    unless Acl.has_rights(@reference.active_permissions, Bfree::Acl::Permissions.WriteMetadata)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.WriteMetadata)
    end

    folder_id = params[:folder_id].to_i
    @folder = (folder_id == 0) ? nil : @library.folders.viewable(@active_user, @active_group).find(folder_id)
    raise "Folder has not been specified or is invalid" if @folder.nil?

    if !Acl.has_rights(@folder.active_permissions, Bfree::Acl::Permissions.CreateFiles)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.CreateFiles)
    end

    Reference.transaction do
      @reference.file_in_folder(@folder, @active_user)
    end

    columns = ReferencesHelper.columns_by_doctype(@reference.document)
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @reference.to_json(:only => columns) }
    end

  end

  # GET /references
  # GET /references.json
  def index

    @query_type = params[:type].nil? ? Bfree::SearchTypes.None : params[:type].to_i
    @view = @library.view_definitions.find_by_id(params[:view])
    @references = []
    @query = nil
    @count = 0

    sort = ReferencesHelper::generate_sort(params)
    range = ReferencesHelper::generate_range(request)

    case @query_type
      when Bfree::SearchTypes.Folder
        @folder = @library.folders.find_by_id(params[:query])
        @query = @library.references.viewable(@active_user, @active_group).in_folder(@folder).not_deleted
      when Bfree::SearchTypes.Simple
          @simple_text = params[:query]
          @query = @library.references.viewable(@active_user, @active_group).simple(@simple_text).not_deleted.content
      when Bfree::SearchTypes.Advanced
        @advanced = ActiveSupport::JSON.decode(params[:query])
        @query = @library.references.viewable(@active_user, @active_group).advanced(@library, @advanced).not_deleted.content
      when Bfree::SearchTypes.Trash
        @query = @library.references.viewable(@active_user, @active_group).deleted
    end

    @count = @query.browse(nil, nil, nil).count unless @query.nil?
    @references = @query.browse(@view, sort, range) unless @query.nil?

    unless range['row_count'] < 0
      headers['Content-Range'] = "#{range['offset']}-#{range['offset'] + range['row_count'] - 1}/#{@count}"
    end

    respond_to do |format|
      format.csv { send_data(to_csv(@references, @view), :type => 'text/csv; charset=utf-8; header=present', :filename => "documents.csv") }
      format.html # index.html.erb
      format.json { render json: @references }
      format.pdf
      format.xml  { send_data(DocumentsHelper.generate_view(@references, @view,'xml').to_xml, :filename => "documents.xml") }
    end
  end

  def share

    @reference = @library.references.viewable(@active_user, @active_group).complete.find(params[:id])
    unless Acl.has_rights(@reference.active_permissions, Bfree::Acl::Permissions.WriteMetadata)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.WriteMetadata)
    end

    folder_id = params[:folder_id].to_i
    @folder = @library.folders.viewable(@active_user, @active_group).find(folder_id)
    if !(Acl.has_rights(@folder.active_permissions, Bfree::Acl::Permissions.CreateFiles) && (@folder.folder_type == VersaFile::FolderTypes.Share))
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.CreateFiles)
    end

    unless @folder.references.exists?(:document_id => @reference.document_id)
      shared_reference = @reference.create_share(@folder, @active_user)
      shared_reference.save()
    end

    columns = ReferencesHelper.columns_by_doctype(@reference.document)
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @reference.to_json(:only => columns) }
    end

  end

  def unshare

    @shared_ref = @library.references.viewable(@active_user, @active_group).complete.find(params[:id])
    unless Acl.has_rights(@shared_ref.active_permissions, Bfree::Acl::Permissions.Delete)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.Delete)
    end

    Reference.transaction do
      #Does not destroy referenced document
      @shared_ref.destroy
    end

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: [], :status => :ok }
    end

  end

  # GET /references/1
  # GET /references/1.json
  def show

    @reference = @library.references.viewable(@active_user, @active_group).complete.find(params[:id])

    columns = ReferencesHelper.columns_by_doctype(@reference.document)
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @reference.to_json(:only => columns) }
    end


  end

  # GET /references/new
  # GET /references/new.json
  def new
    @reference = Reference.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @reference }
    end
  end

  # GET /references/1/edit
  def edit
    @reference = Reference.find(params[:id])
  end

  # POST /references
  # POST /references.json
  def create
    @reference = Reference.new(params[:reference])

    respond_to do |format|
      if @reference.save
        format.html { redirect_to @reference, notice: 'Reference was successfully created.' }
        format.json { render json: @reference, status: :created, location: @reference }
      else
        format.html { render action: "new" }
        format.json { render json: @reference.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /references/1
  # PUT /references/1.json
  def update

    @reference = @library.references.viewable(@active_user, @active_group).complete.find(params[:id])

    #CHECK PERMISSIONS HERE
    unless Acl.has_rights(@reference.active_permissions, Bfree::Acl::Permissions.WriteMetadata)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.WriteMetadata)
    end

    Document.transaction do

      @reference.document.update_properties(@active_user, params)

      unless @reference.document.save
        raise @reference.document.errors
      end

    end

    columns = ReferencesHelper.columns_by_doctype(@reference.document)
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @reference.to_json(:only => columns) }
    end

  end

   #PUT /references/1/restore.json
  def restore

    @folder = nil
    @reference = @library.references.viewable(@active_user, @active_group).full.find(params[:id])

    #CHECK PERMISSIONS HERE
    unless Acl.has_rights(@reference.active_permissions, Bfree::Acl::Permissions.Delete)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.Delete)
    end

    @folder = @library.folders.viewable(@active_user, @active_group).find_by_id(params[:folder_id]) unless params[:folder_id].nil?

    Reference.transaction do
      @reference.soft_restore(@folder, @active_user)
    end

    columns = ReferencesHelper.columns_by_doctype(@reference.document)
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @reference.to_json(:only => columns) }
    end

  end

  #PUT /references/1/soft_delete.json
  def soft_delete

    @reference = @library.references.viewable(@active_user, @active_group).full.find(params[:id])

    #CHECK PERMISSIONS HERE
    unless Acl.has_rights(@reference.active_permissions, Bfree::Acl::Permissions.Delete)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.Delete)
    end

    Reference.transaction do
      @reference.soft_delete(@active_user)
    end

    columns = ReferencesHelper.columns_by_doctype(@reference.document)
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @reference.to_json(:only => columns) }
    end

  end

  # DELETE /references/1
  # DELETE /references/1.json
  def destroy

    @reference = @library.references.viewable(@active_user, @active_group).full.find(params[:id])
    unless Acl.has_rights(@reference.active_permissions, Bfree::Acl::Permissions.Delete)
      raise Exceptions::PermissionError.new(@active_user.name, Bfree::Acl::Permissions.Delete)
    end

    @document = @reference.document

    Document.transaction do

      #document must already be in a (soft) deleted state.
      if @document.deleted?
        @document.destroy
      else
        @reference.soft_delete(@active_user)
      end

    end

    respond_to do |format|
      format.html { redirect_to references_url }
      format.json { render :json => [], :status => :ok }
    end

  end

:protected

  def reference_error(e)
    logger.error "Failed perform document action => #{e.message}"
    logger.error "#{e.backtrace.join('\n')}"
    @msg = e.message
    respond_to do |format|
      format.html { render 'references/error' }
      format.json { render :json => @msg, :status => :unprocessable_entity }
    end
  end

  def reference_not_found(e)
    logger.error "Failed to retrieve document => #{e.message}"
    logger.error "#{e.backtrace.join('\n')}"
    respond_to do |format|
        @msg = "Reference with id = #{params[:id]} could not be found. It may have been deleted or your permissions may have been revoked."
        format.html { render 'references/error' }
        format.json { render :json => @msg, :status => :not_found }
      end
  end

  def to_csv(references, view)
    formatted_documents = DocumentsHelper.generate_view(references, view, 'csv')
    csv_string = CSV.generate do |csv|
      csv << formatted_documents[0].keys
      formatted_documents.each do |doc|
        csv << doc.values
      end
    end
    return csv_string
  end

  def create_document(tmp_file, title)

    Document.transaction do

      isMinorVersion = false

      @document_type = @library.document_types.find_by_name('Document')

      @folder = @library.folders.viewable(@active_user, @active_group).root_folders.first
      raise "Folder has not been specified" if @folder.nil?

      @version = Version.supersede(@library, nil, tmp_file, isMinorVersion)

      @document = @zone.documents.new({
          :library => @library,
          :document_type => @document_type,
          :name => title,
          :description => '',
          :state => Bfree::DocumentStates.CheckedIn,
          :created_by => @active_user.name,
          :updated_by => @active_user.name,
          :versions => [ @version ]
      })

      #@document.update_metadata(params)
      #if(@version.binary_content_type.blank?)
      #@version.binary_content_type = params[:binary_content_type]
      #end

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

  end

  def bulk_add
     i = 1
    dir = Rails.root.join('test', 'documents')
    (1..39).each do |x|
      Dir.foreach(dir) do |tmp_entry|
        next if ['.', '..'].include?(tmp_entry)
        if !File.directory?(tmp_entry)
          title = "document.%.12f" % Time.now.to_f
          logger.debug("%04d %s %s" % [i, tmp_entry, title])
          File.open(File.join(dir, tmp_entry)) do |file|
            self.create_document(file, title)
          end
          i += 1
        end
      end
    end
  end

end
