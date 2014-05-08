json.array!(@breweries) do |brewery|
  json.extract! brewery, :id, :name, :notes, :lat, :long
  json.url brewery_url(brewery, format: :json)
end
