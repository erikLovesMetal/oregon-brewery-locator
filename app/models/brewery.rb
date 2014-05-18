require 'open-uri'

class Brewery < ActiveRecord::Base
	geocoded_by :address # address is an attribute of MyModel
	# the callback to set longitude and latitude
  	after_validation :geocode

	def self.importBreweriesFromAPI()
		doc = Nokogiri::XML(open("http://beermapping.com/webservice/locstate/05a1a701dca974e16978f0c9027709b1/or"))
		root = doc.root
		items = root.xpath("//location")
		counter = 0
		items.each do |i|
			if i.at_xpath("status").text == 'Brewpub' or i.at_xpath("status").text == 'Brewery'
				# puts i.to_s
				counter += 1
				# puts i.at_xpath("id").text + ' ' + i.at_xpath("name").text + ' ' + i.at_xpath("status").text
				coords = Nokogiri::XML(open("http://beermapping.com/webservice/locmap/05a1a701dca974e16978f0c9027709b1/#{i.at_xpath("id").text}"))
				puts i.at_xpath("name").text
				Brewery.create({location_id: i.at_xpath("id").text,name: i.at_xpath("name").text,lat: coords.xpath("//lat").text,long: coords.xpath("//lng").text,city: i.at_xpath("city").text,address: i.at_xpath("street").text,state: i.at_xpath("state").text})
			end
		end
		# puts "total " + counter.to_s

		return counter.to_s
	end
end
