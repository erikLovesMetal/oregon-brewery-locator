class MapController < ApplicationController

	def index()
		# puts location.methods
	end

	def getBreweryMarkerCoords()
		breweries = Brewery.all
		render :json => breweries.as_json
	end
end
