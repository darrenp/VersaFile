class UploaderController < ApplicationController
  before_filter :zone_required
  skip_before_filter :verify_authenticity_token, :only => [:upload]
  #Skipping authenticity check on upload due to Flash submitting token incorrectly

  def clean

    begin

      unique_id = params[:authenticity_token]
      UploaderHelper.clean(@zone, unique_id)

      respond_to do |format|
        format.json { render :json => '', :status => :ok }
      end

    rescue => e
      logger.error "Temporary file cleanup failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end


  end

  def download
    unique_id = params[:authenticity_token]
    @tmp_file = UploaderHelper.read_file(@zone, unique_id, params[:file])
    @type = File.mime_type?(@tmp_file.path)
    send_file @tmp_file, :type => @type, :disposition => 'inline'
  end

  def preview

    @preview_element = nil
    @element = nil
    @target = nil
    @maintainAspectRatio = true

    unless params[:file].blank?
      @content_type = File.mime_type?(params[:file])
      @target = "/zones/#{@zone.subdomain}/uploader/download?file=#{params[:file]}&authenticity_token=#{CGI::escape(params[:authenticity_token])}"
      @preview_element = @zone.preview_elements.find_by_content_type(@content_type)
    end

    unless @preview_element.nil?
      @element = @preview_element.element_template % [@target, @content_type]
      @maintainAspectRatio = @preview_element.maintain_aspect_ratio
    end

    respond_to do |format|
      format.html { render :layout => false } # index.html.erb
    end

  end

  def upload

    #begin

      is_pkg = params[:pkg].nil? ? false : (params[:pkg] == 'true')
      unique_id = params[:authenticity_token]

      @upload_type = params[:upload_type].nil? ? '' : params[:upload_type].downcase

      case @upload_type
        when 'html5'
          uploaded_files = params[:uploadedfiles]
          uploadHTML5(@zone, unique_id, uploaded_files, is_pkg)
        when 'flash'
          uploaded_file = params[:uploadedfileFlash]
          uploadFlash(@zone, unique_id, uploaded_file, is_pkg)
        when 'iframe'
          uploaded_file = params[:uploadedfile0]
          uploadIFrame(@zone, unique_id, uploaded_file, is_pkg)
        else
          raise "Invalid Uploader type"
      end


=begin
      if(params[:upload_type] == 'html5')

        @retval = {
            :uploadedfiles => []
        }

        @files = []
        params[:uploadedfiles].each do |uploaded_file|

          file_info = (is_pkg ?
              UploaderHelper.write_pkg_file(@zone, uploaded_file) :
              UploaderHelper.write_file(@zone, unique_id, uploaded_file))

         @retval[:uploadedfiles] << {
            :name => uploaded_file.original_filename,
            :content_type => File.mime_type?(uploaded_file.original_filename),
            :size =>  uploaded_file.size,
            :file => file_info[:name]
         }

        end

        render :text =>  "(#{@retval.to_json})" #"{ \"uploadedfiles\": #{ @files.to_json } }"

      elsif(params[:upload_type] == 'flash')

        uploaded_file = params[:uploadedfileFlash]

        file_info = (is_pkg ?
              UploaderHelper.write_pkg_file(@zone, uploaded_file) :
              UploaderHelper.write_file(@zone, unique_id, uploaded_file))

        @fileinfo = {
          :name => uploaded_file.original_filename,
          :content_type => File.mime_type?(uploaded_file.original_filename),
          :size => uploaded_file.size,
          :file =>  file_info[:name]
        }

        return_text = "file=#{CGI::escape(@fileinfo[:file])},name=#{CGI::escape(@fileinfo[:name])},size=#{@fileinfo[:size]},type=#{@fileinfo[:content_type]}"
        logger.debug(return_text)
        render :text => return_text
      else

        uploaded_file = params[:uploadedfile0]

        file_info = (is_pkg ?
              UploaderHelper.write_pkg_file(@zone, uploaded_file) :
              UploaderHelper.write_file(@zone, unique_id, uploaded_file))

        @fileinfo = {
          :name => uploaded_file.original_filename,
          :content_type => File.mime_type?(uploaded_file.original_filename),
          :size => uploaded_file.size,
          :file =>  file_info[:name]
        }

        respond_to do |format|
          format.html {}
        end

      end

    rescue => e
      logger.error "Upload failed => #{e.message}"
      respond_to do |format|
        format.json { render :json => e.message, :status => :unprocessable_entity }
      end
    end
=end

  end

protected

def uploadHTML5(zone, unique_id, uploaded_files, is_pkg)

  #HTML5 - all files are received at once
  retval = { :uploadedfiles => []}
  file_info = nil
  error_msg = ''

  uploaded_files.each do |uploaded_file|

    begin
      #Write file to temp dir
      #If it is a "package" file, write in different dir
      file_info = (is_pkg ?
        UploaderHelper.write_pkg_file(zone, uploaded_file) :
        UploaderHelper.write_file(zone, unique_id, uploaded_file))
    rescue => e
      error_msg = e.message
    end

    #push current
    retval[:uploadedfiles] << {
            :name => uploaded_file.original_filename,
            :content_type => File.mime_type?(uploaded_file.original_filename),
            :size =>  file_info.nil? ? 0 : file_info[:size],
            :file => file_info.nil? ? uploaded_file.original_filename : file_info[:name],
            :error => error_msg
         }

  end

  render :text =>  "(#{retval.to_json})"
end

def uploadFlash(zone, unique_id, uploaded_file, is_pkg)
  file_info = nil
  error_msg = ''

  begin
    #Write file to temp dir
    #If it is a "package" file, write in different dir
    file_info = (is_pkg ?
      UploaderHelper.write_pkg_file(zone, uploaded_file) :
      UploaderHelper.write_file(zone, unique_id, uploaded_file))
  rescue => e
    error_msg = e.message
  end

  file_info = {
    :name => uploaded_file.original_filename,
    :content_type => File.mime_type?(uploaded_file.original_filename),
    :size =>  file_info.nil? ? 0 : file_info[:size],
    :file =>  file_info.nil? ? uploaded_file.original_filename : file_info[:name],
    :error => error_msg
  }

  logger.debug "file=#{CGI::escape(file_info[:file]).gsub(',', '%2C')},name=#{CGI::escape(file_info[:name]).gsub(',', '%2C')},size=#{file_info[:size]},type=#{file_info[:content_type]},error=#{file_info[:error]}"

  render :text => "file=#{CGI::escapeHTML(file_info[:file]).gsub(',', '%2C')},name=#{CGI::escapeHTML(file_info[:name]).gsub(',', '%2C')},size=#{file_info[:size]},type=#{file_info[:content_type]},error=#{file_info[:error]}"
end

def uploadIFrame(zone, unique_id, uploaded_file, is_pkg)
  file_info = nil
  error_msg = ''

  begin
    #Write file to temp dir
    #If it is a "package" file, write in different dir
    file_info = (is_pkg ?
      UploaderHelper.write_pkg_file(zone, uploaded_file) :
      UploaderHelper.write_file(zone, unique_id, uploaded_file))
  rescue => e
    error_msg = e.message
  end

  @file_info = {
    :name => uploaded_file.original_filename,
    :content_type => File.mime_type?(uploaded_file.original_filename),
    :size =>  file_info.nil? ? 0 : file_info[:size],
    :file =>  file_info.nil? ? uploaded_file.original_filename : file_info[:name],
    :error => error_msg
  }

  respond_to do |format|
    format.html {}
  end

end

end
