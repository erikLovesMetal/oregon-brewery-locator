require 'open-uri'

class Brewery < ActiveRecord::Base
	geocoded_by :address # address is an attribute of Brewery model
	# the callback to set longitude and latitude
  	after_validation :geocode

  	# TODO import WA breweries that are close to OR border.   Should include Wa in the Gorge and in the couv.
	def self.importBreweriesFromAPI()
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
					b.lat = coords.xpath("//lat").text
					b.long = coords.xpath("//lng").text
					b.city = i.at_xpath("city").text
					b.address = i.at_xpath("street").text
					b.state = i.at_xpath("state").text
					b.save
				# create brewery
				else
					Brewery.create({location_id: i.at_xpath("id").text,name: i.at_xpath("name").text,lat: coords.xpath("//lat").text,long: coords.xpath("//lng").text,city: i.at_xpath("city").text,address: i.at_xpath("street").text,state: i.at_xpath("state").text})
				end
			end
		end
		return counter.to_s
	end
end
