var AppContext =  function() {
	var endpoint = "http://api-techbrowser.appspot.com/",
		googleAnalyticsKey = 'UA-11129132-4',
		lastQuery = null,
		timeout = null;
	
	this.query = function(terms, callback) {
		if(terms.join(" ") == lastQuery)
			return;
		lastQuery = terms.join(" ");
		ajaxCall = $.getJSON(endpoint+"search.jsonp?q="+terms.join(" ")+"&callback=?", function(response) {
			callback(response);
	    });
	};
	
	this.getTag = function(request, callback) {
		var url = endpoint+"suggest/tag.jsonp?q="+request.term+"&callback=?";
		$.getJSON(url, function(data) {
			callback(data);
		});
	};
	
	this.getTags = function(url, callback) {
		$.getJSON(endpoint+"suggest/tags.jsonp?url="+url+"&callback=?", function(response) {
			callback(response);
	    });
	};
	
	this.saveEntry = function(url, tags, callback) {
		var saveurl = endpoint+"entry.jsonp?url="+url+"&tags="+tags.join(" ")+"&callback=?";
		$.getJSON(saveurl, function(response){
			callback(response);
		});
	};
};
