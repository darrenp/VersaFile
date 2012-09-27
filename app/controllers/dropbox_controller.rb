class DropboxController < ApplicationController

  before_filter :library_required

  #GET /access
  def access
    dbsession=DropboxSession.new(configatron.versafile.dropbox.app_key, configatron.versafile.dropbox.app_secret)

    session[:dropbox_request]=dbsession

    redirect_to dbsession.get_authorize_url("#{request.protocol}#{request.host_with_port}#{request.fullpath}".sub('access', 'finished'))

    #respond_to do |format|
    #  format.json{ render json: json }
    #end
  end

  #GET /connection
  def show
    uid=params[:id]

    sezzion=@library.db_sessions.find_by_dropbox_uid(uid.to_i)
    dbsession=sezzion.getSession

    json={:id => sezzion.dropbox_uid,
          :request_token => dbsession.get_request_token().key,
          :request_secret => dbsession.get_request_token().secret,
          :access_token => dbsession.get_access_token().key,
          :access_secret => dbsession.get_access_token().secret}

    respond_to do |format|
      format.json{render json: json}
    end
  end

  def finished
    dbsession=session[:dropbox_request]

    dbsession.get_access_token

    client=DropboxClient.new(dbsession, configatron.versafile.dropbox.access_type)
    account = client.account_info()

    sezzion=@library.db_sessions.find_by_dropbox_uid(account['uid'])

    if(sezzion==nil)
      sezzion=@library.db_sessions.new(
          :zone=>@library.zone,
          :dropbox_uid=>account['uid']
      )
    end

    sezzion.session=dbsession.serialize
    sezzion.save

    @dbroot=@zone.folders.find_by_folder_type(VersaFile::FolderTypes.DropboxRoot)

    @folder = @zone.folders.new(
      :library => @library,
      :name => account['display_name'],
      :folder_type => VersaFile::FolderTypes.DropboxAccount,
      :created_by => 'Dropbox',
      :updated_by => 'Dropbox',
      :parent_id => @dbroot.id,
      :dropbox_uid => account['uid'],
      :dropbox_path => '/'
    )
    unless @folder.save
      raise_errors(@folder.errors)
    end


    respond_to do |format|
      format.html
    end
  end
end
