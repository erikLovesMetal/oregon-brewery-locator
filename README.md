oregon-brewery-locator
======================

Mapping app that takes current location and maps breweries in vicinity.  Breweris are managed in a login protected admin section with a tool that allows managing the breweries and their lat/longs and information about them. The admin tool has import feature that imports most the breweries into the admin tool.  Also using geocoding to look up lat/longs of breweries that arent in beermapping API.  Can also manually add breweries.

Heroku URL: http://oregon-brewery-locator.herokuapp.com/

* Ruby v2.1 / Rails 4

* beermapping api (http://beermapping.com/api/) (doesnt have them all)

* Ruby geocoder gem (https://github.com/alexreisner/geocoder) for geocoding

* Sqlite locally / PostGresSQL production

* AngularJS  w/ leaflet.JS directive map

* Bootleaf theme for Leaflet Map

* Devise for admin tool security

* TODO

* Add TDD ..
