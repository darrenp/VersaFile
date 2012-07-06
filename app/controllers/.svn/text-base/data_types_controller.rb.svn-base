class DataTypesController < ApplicationController

  # GET /data_types
  # GET /data_types.json
  def index

    @data_types = DataType.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @data_types }
    end

  end

end
