class BreweriesController < ApplicationController
  before_action :set_brewery, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, :except => :getCurrentUserState
  layout "admin"

  # GET /breweries
  # GET /breweries.json
  def index
    @breweries = Brewery.order(name: :asc).paginate(:page => params[:page],:per_page => 30)
    # TODO change this to the current location from JS APi
    r = Brewery.near("3532 NE 6th Ave Portland, OR", 1)
    @withinTen = r.all
    puts "below"
    puts request.location.city
  end

  # GET /breweries/1
  # GET /breweries/1.json
  def show
  end

  # GET /breweries/new
  def new
    @brewery = Brewery.new
  end

  # GET /breweries/1/edit
  def edit
  end

  # POST /breweries
  # POST /breweries.json
  def create
    @brewery = Brewery.new(brewery_params)

    respond_to do |format|
      if @brewery.save
        format.html { redirect_to @brewery, notice: 'Brewery was successfully created.' }
        format.json { render action: 'show', status: :created, location: @brewery }
      else
        format.html { render action: 'new' }
        format.json { render json: @brewery.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /breweries/1
  # PATCH/PUT /breweries/1.json
  def update
    respond_to do |format|
      if @brewery.update(brewery_params)
        format.html { redirect_to @brewery, notice: 'Brewery was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @brewery.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /breweries/1
  # DELETE /breweries/1.json
  def destroy
    @brewery.destroy
    respond_to do |format|
      format.html { redirect_to breweries_url }
      format.json { head :no_content }
    end
  end

  def importBreweriesFromAPI()
    @importTotal = Brewery.importBreweriesFromAPI()
    redirect_to breweries_url,notice: 'Breweries Imported.'
  end

  def deleteBreweries()
    Brewery.delete_all()
    redirect_to breweries_url,notice: 'Breweries Deleted.'
  end

  # check the state the user lat/long in 
  def getCurrentUserState()
    usersState = Brewery.getCurrentUserState(params[:lat],params[:long])
    # reverse geolocate lat long and get users state
    render json:{state: usersState}, status: 200
  end

  # set brewery to active / inactive 
  # IDEA!.. could this just use the edit or update method above?...
  def setBreweryActive()
    # brewer_id and answer coming in from the ajax call
    b = Brewery.find(params[:brewery_id])
    b.is_active = params[:answer]
    b.save
    render :nothing => true, :status => 200
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_brewery
      @brewery = Brewery.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def brewery_params
      params.require(:brewery).permit(:name, :notes, :lat, :long)
    end
end
