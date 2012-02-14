class OperatorsController < ApplicationController

  # GET /operators
  # GET /operators.json
  def index
    @operators = Operator.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @operators }
    end
  end

  # GET /operators/1
  # GET /operators/1.json
  def show

    @operator = Operator.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @operator }
    end

  end


end
