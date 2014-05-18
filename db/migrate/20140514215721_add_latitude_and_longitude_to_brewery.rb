class AddLatitudeAndLongitudeToBrewery < ActiveRecord::Migration
  def change
    add_column :breweries, :latitude, :float
    add_column :breweries, :longitude, :float
  end
end
