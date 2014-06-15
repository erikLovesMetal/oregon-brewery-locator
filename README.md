oregon-brewery-locator
======================

Mapping app that takes current location and maps breweries in vicinity.  Breweris are managed in a login protected admin section with a tool that allows managing the breweries and their lat/longs and information about them. The admin tool has import feature that imports most the breweries into the admin tool.  Also using geocoding to look up lat/longs of breweries that arent in beermapping API.  Can also manually add breweries.

Heroku URL: http://oregon-brewery-locator.herokuapp.com/

* Ruby v2.0 / Rails 4

* beermapping api (http://beermapping.com/api/) doesnt seem to have them all

* Ruby geocoder gem (https://github.com/alexreisner/geocoder) for reverse geocoding

* Sqlite locally / PostGresSQL production

* Add TDD ..

* AngularJS (try and find excuse to use..) with leaflet.JS directive

* Deployed to Heroku

* make the map responsive so it works on mobile USING LEAFLET.JS!!!!

* Theme the map with Bootleaf theme
