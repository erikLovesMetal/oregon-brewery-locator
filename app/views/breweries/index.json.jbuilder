json.array!(@breweries) do |brewery|
  json.extract! brewery, :id, :name, :notes, :latitude, :longitude
  json.url brewery_url(brewery, format: :json)
end
