var AppContext =  function() {
	var endpoint = "http://api-techbrowser.appspot.com/", //"http://localhost:8080/"
		googleAppKey = "18358026133409707365",
		facebookAppKey = '165991020094008',
		googleAnalyticsKey = 'UA-11129132-4',
		lastQuery = null,
		timeout = null,
		ajaxCall = null;
	
	this.query = function(terms, callback) {
		if(timeout)
			clearTimeout(timeout);
		
		timeout = setTimeout(function(){
			if(ajaxCall)
				ajaxCall.abort();
			
			if(terms == lastQuery)
				return;
			
			lastQuery = terms;
			ajaxCall = $.getJSON(endpoint+"search.jsonp?q="+terms+"&callback=?", function(response) {
				callback(response);
		    });
		},150);
	};
};