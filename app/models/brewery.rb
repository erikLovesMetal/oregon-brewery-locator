require 'open-uri'

class Brewery < ActiveRecord::Base
	geocoded_by :address_city_state # address is an attribute of Brewery model
	# reverse_geocoded_by :latitude, :longitude
	# the callback to set longitude and latitude
  	after_validation :geocode,if: ->(brewery){ brewery.address.present? and brewery.address_changed? }
  	# if: ->(brewery){ brewery.address.present? and brewery.address_changed? }

  	# geocode by all 3
  	def address_city_state
  		self.address + ' ' + self.city + ', ' + self.state
	end

  	# TODO import WA breweries that are close to OR border ( maybe 50miles from border?).   Should include Wa in the Gorge and in the couv.
	def self.importBreweriesFromAPI()
		# GET OREGON BREWERIES
		doc = Nokogiri::XML(open("http://beermapping.com/webservice/locstate/05a1a701dca974e16978f0c9027709b1/or"))
		root = doc.root
		items = root.xpath("//location")
		counter = 0
		items.each do |i|
			if i.at_xpath("status").text == 'Brewpub' or i.at_xpath("status").text == 'Brewery' or i.at_xpath("status").text == 'Beer Bar'
				counter += 1
				coords = Nokogiri::XML(open("http://beermapping.com/webservice/locmap/05a1a701dca974e16978f0c9027709b1/#{i.at_xpath("id").text}"))
				# update brewery
				if Brewery.exists?(:location_id => i.at_xpath("id").text)
					b = Brewery.find_by(location_id: i.at_xpath("id").text)
					b.name = i.at_xpath("name").text
					# b.lat = coords.xpath("//lat").text
					# b.long = coords.xpath("//lng").text
					b.city = i.at_xpath("city").text
					b.address = i.at_xpath("street").text
					b.state = i.at_xpath("state").text
					b.save
				# create brewery
				else
					# took out lat and long... geolocation doign for us
					Brewery.create({location_id: i.at_xpath("id").text,name: i.at_xpath("name").text,city: i.at_xpath("city").text,address: i.at_xpath("street").text,state: i.at_xpath("state").text})
				end
			end
		end

		# GET WA BREWERIES
		wadoc = Nokogiri::XML(open("http://beermapping.com/webservice/loccity/05a1a701dca974e16978f0c9027709b1/vancouver,wa"))
		waroot = wadoc.root
		waitems = waroot.xpath("//location")
		waitems.each do |j|
			if j.at_xpath("status").text == 'Brewpub' or j.at_xpath("status").text == 'Brewery' or j.at_xpath("status").text == 'Beer Bar'
				counter += 1
				wacoords = Nokogiri::XML(open("http://beermapping.com/webservice/locmap/05a1a701dca974e16978f0c9027709b1/#{j.at_xpath("id").text}"))
				# update brewery
				if Brewery.exists?(:location_id => j.at_xpath("id").text)
					wb = Brewery.find_by(location_id: j.at_xpath("id").text)
					wb.name = j.at_xpath("name").text
					# wb.lat = wacoords.xpath("//lat").text
					# wb.long = wacoords.xpath("//lng").text
					wb.city = j.at_xpath("city").text
					wb.address = j.at_xpath("street").text
					wb.state = j.at_xpath("state").text
					wb.save
				# create brewery
				else
					# took out lat and long... geolocation doign for us
					Brewery.create({location_id: j.at_xpath("id").text,name: j.at_xpath("name").text,city: j.at_xpath("city").text,address: j.at_xpath("street").text,state: j.at_xpath("state").text})
				end
			end
		end

		return counter.to_s
	end

	# parse the state from the users current lat and long
	def self.getCurrentUserState(lat,long)
		location = Geocoder.address([lat,long])
		cityState = location.match('((?:\w|\s)+),\s(AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY)')
		return cityState.to_s.split(',')[1].strip
	end
end
