class MapController < ApplicationController

	def index()
		# puts location.methods
	end

	def getBreweryMarkerCoords()
		breweries = Brewery.where(is_active:true).all
		render :json => breweries.as_json
	end
end
