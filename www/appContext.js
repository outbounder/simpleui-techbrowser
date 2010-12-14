var AppContext =  function() {
	var endpoint = "http://localhost:8080/"; //"http://api-techbrowser.appspot.com/"
		googleAppKey = "18358026133409707365",
		facebookAppKey = '165991020094008',
		googleAnalyticsKey = 'UA-11129132-4',
		lastQuery = null,
		timeout = null,
		ajaxCall = null;
	
	this.query = function(terms, callback) {
		if(terms == lastQuery)
			return;
		
		lastQuery = terms;
		ajaxCall = $.getJSON(endpoint+"search.jsonp?q="+terms+"&callback=?", function(response) {
			callback(response);
	    });
	};
	
	this.getTags = function(term, callback) {
		ajaxCall = $.getJSON(endpoint+"suggest/tags.jsonp?url="+term+"&callback=?", function(response) {
			callback(response);
	    });
	};
	
	this.saveEntry = function(url, tags, callback) {
		var saveurl = endpoint+"entry.jsonp?url="+url+"&tags="+tags+"&callback=?";
		$.getJSON(saveurl, function(response){
			callback(response);
		});
	};
};