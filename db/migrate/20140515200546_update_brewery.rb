class UpdateBrewery < ActiveRecord::Migration
  def change
  	add_column :breweries, :address, :string
    add_column :breweries, :city, :string
    add_column :breweries, :state, :string
  end
end
