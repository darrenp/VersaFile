class PackagerController < ApplicationController
  before_filter :zone_required
  skip_before_filter :verify_authenticity_token, :only => [:upload]

  def download

    @package_name = params[:pkg]

    zip_file = "#{@package_name}.zip"
    root_dir = File.join(VersaFile::SYSTEM_PATH, @zone.subdomain, 'packages')
    zip_path = File.join(root_dir, zip_file)

    send_file zip_path, :filename => zip_file, :type => 'application/zip', :disposition => 'attachment'

  end

  def import
    respond_to do |format|
      format.html {render :layout => false }
      format.json { render json: {}, :status => :ok }
    end
  end

  def import_upload
    @library=@zone.libraries.first

    @file=params[:importfile]

    base_path = File.join(VersaFile::SYSTEM_PATH, @zone.subdomain, 'packages')
    zip_path = File.join(VersaFile::SYSTEM_PATH, @zone.subdomain, 'packages', "#{@file.original_filename}")
    dst_dir =  File.join(VersaFile::SYSTEM_PATH, @zone.subdomain, 'packages', "#{@file.original_filename.sub(".zip", "")}")

    FileUtils.rm_rf(zip_path)
    FileUtils.rm_rf(dst_dir)

    FileUtils.mkdir_p File.join(base_path)

    File.open(zip_path, "wb") { |f| f.write(@file.read) }

    pkg_dir = Archive.new(zip_path).to_directory(dst_dir)

    @library.import(dst_dir)

    respond_to do |format|
      format.html {render :layout => false }
      format.json { render json: {}, :status => :ok }
    end
  end

  def package

    begin

      @host = "#{request.protocol}#{request.host_with_port}"
      @package_name = "#{Digest::SHA1.hexdigest(@zone.subdomain + Time.now.to_f.to_s)}"

      root_dir = File.join(VersaFile::SYSTEM_PATH, @zone.subdomain, 'packages', @package_name)
      root_dir = Pathname.new(root_dir).cleanpath()
      FileUtils.mkdir_p File.join(root_dir)

      @results = @zone.package(root_dir)

      @zip_file = Archive.new("#{@package_name}.zip").from_directory(root_dir)
      @results[:package_size] =   Object.new.extend(ActionView::Helpers::NumberHelper).number_to_human_size(File.size(@zip_file))

      FileUtils.rm_rf(root_dir)

      @package_url = "#{@host}/packager/#{@zone.subdomain}/download?pkg=#{@package_name}"

      respond_to do |format|
        format.html {render :layout => false }
        format.json { render json: {}, :status => :ok }
      end

    end

  end

  def unpack

    @package_name = params[:pkg]
    zip_path = File.join(VersaFile::SYSTEM_PATH, @zone.subdomain, 'packages', "#{@package_name}.zip")
    dst_dir =  File.join(VersaFile::SYSTEM_PATH, @zone.subdomain, 'packages', @package_name)

    pkg_dir = Archive.new(zip_path).to_directory(dst_dir)

    @results = @zone.unpackage(pkg_dir)

    FileUtils.rm_rf(pkg_dir)

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: {} }
    end

  end

  def unpackage

    @host = "#{request.protocol}#{request.host_with_port}"
    @package_url = "#{@host}/packager/#{@zone.subdomain}/unpack?pkg="

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: {} }
    end

  end



end
