class MapController < ApplicationController

	def index()
		# puts location.methods
	end

	def getBreweryMarkerCoords()
		breweries = Brewery.order(name: :asc).where(is_active:true).all
		render :json => breweries.as_json
	end
end
