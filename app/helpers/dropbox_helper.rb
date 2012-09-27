module DropboxHelper

  def self.copy_to_dropbox(params, library, active_user, active_group)
    folder_id = params[:folder_id].to_i
    @folder = (folder_id == 0) ? nil : library.folders.viewable(active_user, active_group).find(folder_id)

    uid=@folder.dropbox_uid
    path=@folder.dropbox_path

    reference = library.references.viewable(active_user, active_group).full.find(params[:id])
    document = reference.document
    reference.move_to_dropbox(uid, path)

    return document, reference
  end

  def self.move_dropbox(params, library, active_user, active_group)
    folder_id = params[:folder_id].to_i
    @folder = (folder_id == 0) ? nil : library.folders.viewable(active_user, active_group).find(folder_id)

    uid, path=DropboxHelper.parse_id(params[:id])

    sezzion=library.db_sessions.find_by_dropbox_uid(uid)
    dbsession=sezzion.getSession()

    dbclient=DropboxClient.new(dbsession, configatron.versafile.dropbox.access_type)

    meta=dbclient.metadata(path)
    name=meta['path'].slice(meta['path'].rindex('/')+1..meta['path'].length)

    dbclient.file_move(meta['path'], @folder.dropbox_path+'/'+name)

    ref={
      :name=>meta['path'].slice(meta['path'].rindex('/')+1..meta['path'].length),
      :active_permissions=>2147483647,
      :updated_by=>'Dropbox',
      :created_by=>'Dropbox',
      :binary_content_type=>meta['mime_type'],
      :major_version_number=>1,
      :minor_version_number=>0,
      :binary_file_size=>meta['bytes'],
      :folder_id=>params[:query],
      :document_id=>'db'+uid.to_s+"-"+meta['path'].to_s.gsub("/",">").gsub(".","<"),
      :id=>'db'+uid.to_s+"-"+meta['path'].to_s.gsub("/",">").gsub(".","<"),
      :reference_type=>0,
      :state=>16,
      :is_dropbox_proxy=>true
    }

    doc=library.zone.documents.new(
      :library => library,
      :name=>meta['path'],
      :updated_by=>'Dropbox',
      :created_by=>'Dropbox',
      :document_type_id=>library.document_types.first.id,
      :document_type=>library.document_types.first,
      :id=>'db'+uid.to_s+"-"+meta['path'].to_s.gsub("/",">").gsub(".", "<"),
      :state=>16
    )

    return doc, ref

  end

  def self.copy_from_dropbox(params, library, active_user, active_group)
    Document.transaction do

      uid, path=DropboxHelper.parse_id(params[:id])

      sezzion=library.db_sessions.find_by_dropbox_uid(uid)
      dbsession=sezzion.getSession()

      dbclient=DropboxClient.new(dbsession, configatron.versafile.dropbox.access_type)

      isMinorVersion = false
      unique_id = params[:authenticity_token]

      @document_type = library.document_types.first

      @folder = (params[:folder_id].nil? || params[:folder_id] == 0) ? nil : library.folders.viewable(active_user, active_group).find(params[:folder_id])
      raise "Folder has not been specified" if @folder.nil?

      tmp_file, meta=dbclient.get_file_and_metadata(path)
      #meta=dbclient.metadata(path)
      name=meta['path'].slice(meta['path'].rindex('/')+1..meta['path'].length)
      UploaderHelper.write_binary_file(library.zone, unique_id, tmp_file, name)

      tmp_file = UploaderHelper.read_file(library.zone, unique_id, name)
      @version = Version.supersede(library, nil, tmp_file, isMinorVersion)
      @version.dropbox_uid=uid
      @version.dropbox_path=meta['path']

      @document = library.zone.documents.new({
          :library => library,
          :document_type => @document_type,
          :name => name,
          :description => '',
          :state => Bfree::DocumentStates.CheckedIn,
          :created_by => active_user.name,
          :updated_by => active_user.name,
          :versions => [ @version ]
      })

      @document.update_metadata(params)

      if(@version.binary_content_type.blank?)
        @version.binary_content_type = binary_content_type
      end

      unless @document.save
        raise @document.errors
      end

      @reference = library.references.create({
        :reference_type => VersaFile::ReferenceTypes.Content,
        :document => @document,
        :folder_id => (@folder.nil? ? 0 : @folder.id)
      })

      @document.delay.extract_content()

    end

    return @document, @reference
  end

  def self.parse_id(id)
    uid=id.sub("db", "")
    uid=uid.slice(0..(uid.index("-")-1))
    path=id
    path=path.slice((path.index("-")+1)..path.length)
    path=path.gsub(">","/").gsub("<", ".")

    return uid, path

  end
end
