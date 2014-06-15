class AdminController < ApplicationController
	layout "admin"
	before_action :authenticate_user!, :only => :index
	
	def index()
		
	end
end
