class CreateBreweries < ActiveRecord::Migration
  def change
    create_table :breweries do |t|
      t.string :name
      t.text :notes
      t.string :lat
      t.string :long

      t.timestamps
    end
  end
end
