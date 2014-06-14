Geocoder.configure(
  # geocoding service
  lookup: :google,

  # :http_proxy => ENV['QUOTAGUARD_URL'],
  # :timeout => 50,

  # geocoding service request timeout (in seconds)
  timeout: 3,

  # default units
  units: :km
)