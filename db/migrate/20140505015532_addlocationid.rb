class Addlocationid < ActiveRecord::Migration
  def change
  	add_column :breweries, :location_id, :int
  end
end
