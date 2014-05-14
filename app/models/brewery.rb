require 'open-uri'

class Brewery < ActiveRecord::Base

	def self.importBreweriesFromAPI()
		doc = Nokogiri::XML(open("http://beermapping.com/webservice/locstate/05a1a701dca974e16978f0c9027709b1/or"))
		root = doc.root
		items = root.xpath("//location")
		counter = 0
		items.each do |i|
			if i.at_xpath("status").text == 'Brewpub' or i.at_xpath("status").text == 'Brewery' 
				counter += 1
				# puts i.at_xpath("id").text + ' ' + i.at_xpath("name").text + ' ' + i.at_xpath("status").text
				coords = Nokogiri::XML(open("http://beermapping.com/webservice/locmap/05a1a701dca974e16978f0c9027709b1/#{i.at_xpath("id").text}"))
				# puts coords.xpath("//name").text + ' ' + coords.xpath("//lat").text + ' ' + coords.xpath("//lng").text
				Brewery.create({location_id: i.at_xpath("id").text,name: i.at_xpath("name").text,lat: coords.xpath("//lat").text,long: coords.xpath("//lng").text})
			end
		end
		# puts "----------------------"
		# puts "total " + counter.to_s
		# get lat long http://beermapping.com/webservice/locmap/API_KEY/<location id from above>

		# doc2 = Nokogiri::XML(open("http://beermapping.com/webservice/locmap/05a1a701dca974e16978f0c9027709b1/14556"))
		# puts doc2 

		return doc
	end
end
