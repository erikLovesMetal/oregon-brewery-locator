class MapController < ApplicationController

	def index()
		
	end

	def getBreweryMarkerCoords()
		breweries = Brewery.all
		render :json => breweries.as_json
	end
end
