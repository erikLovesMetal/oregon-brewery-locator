class AddIsActiveToBreweries < ActiveRecord::Migration
  def change
    add_column :breweries, :is_active, :boolean, :default => true
  end
end
