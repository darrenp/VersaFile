class VersionsController < ApplicationController
  before_filter :library_required
  before_filter :authorization_required

  # GET /versions
  # GET /versions.json
  def index
    @versions = Version.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @versions }
    end
  end

  # GET /versions/1
  # GET /versions/1.json
  def show
    @version = Version.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @version }
    end
  end

  # GET /versions/new
  # GET /versions/new.json
  def new
    @version = Version.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @version }
    end
  end

  # GET /versions/1/edit
  def edit
    @version = Version.find(params[:id])
  end

  # POST /versions
  # POST /versions.json
  def create
    begin

      @document = @library.documents.find(params[:document_id])

      Document.transaction do


        p=params

        major_version_number = 1
        minor_version_number = 0

        #unmark the previous version
        unless @document.current_version.blank?
          prev_version = Version.find(@document.current_version.id)
          major_version_number = prev_version.major_version_number
          minor_version_number = prev_version.minor_version_number
          prev_version.update_attribute(:is_current_version, false)
        end

        minor_version_number += 1

        @version = @document.versions.new(
            :binary => UploaderHelper.read_file(@zone, session[:session_id], params[:temp_file][:file]),
            :binary_file_name => params[:temp_file][:name],
            :major_version_number => major_version_number,
            :minor_version_number => minor_version_number,
            :is_current_version => true
        )
        #@document.versions.push(new_version)

        #@document.checkin(User.find_by_id(session[:active_user_id]))

        unless @document.save
          raise @document.errors
        end
      end

      respond_to do |format|
          format.html { redirect_to(@document) }
          format.xml  { head :ok }
          format.js {
            render :json => @version, :status => :created, :location => @version.dojo_url
          }
        end

      rescue => e
        logger.error "Document checkin failed => #{e.message}"
        respond_to do |format|
            format.js { render :json => e.message, :status => :unprocessable_entity }
        end

    end
  end

  # PUT /versions/1
  # PUT /versions/1.json
  def update
    @version = Version.find(params[:id])

    respond_to do |format|
      if @version.update_attributes(params[:version])
        format.html { redirect_to @version, notice: 'Version was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @version.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /versions/1
  # DELETE /versions/1.json
  def destroy
    @version = Version.find(params[:id])
    @version.destroy

    respond_to do |format|
      format.html { redirect_to versions_url }
      format.json { head :ok }
    end
  end
end
