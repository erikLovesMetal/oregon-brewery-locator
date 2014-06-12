class RemoveLatandLongFromBreweries < ActiveRecord::Migration
  def change
  	remove_column :breweries, :lat, :float
  	remove_column :breweries, :long, :float
  end
end
