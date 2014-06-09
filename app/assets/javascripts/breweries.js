// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

$(function(){
	$('.btn-toggle').click(function() {
	    var btns = $(this).find('.btn').toggleClass('active');  
	    var answer = false

	    // loop through both buttons, and get the button that is was answered
	    btns.each(function(index){
	     	if($(this).attr('class').indexOf('active') > -1){
	     		answer = $(this).attr('id').split('_')[1];
	     	};
	    });

	    // pass value into ajax call
	    $.ajax({
	    	url: '/admin/setBreweryActive',
	    	type: 'post',
	    	data: {brewery_id:$(this).find('.btn').attr('id'),answer:answer},
	    	success: function (data) {
	    		// success
	    	},
	    	error: function(){
	    		// error
	    	}
	    });
	    
	    // toggle the active adn inactive classes 
	    if ($(this).find('.btn-primary').size()>0) {
	    	$(this).find('.btn').toggleClass('btn-primary');
	    }

	    $(this).find('.btn').toggleClass('btn-default');
	});
})


