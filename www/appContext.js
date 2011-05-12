var AppContext =  function() {
	var endpoint = /*"http://api-techbrowser.appspot.com/";//*/"http://localhost:8080/";  
		googleAnalyticsKey = 'UA-11129132-4',
		lastQuery = null,
		timeout = null;
	
	this.query = function(terms, callback) {
		if(terms.join(" ") == lastQuery)
			return;
		lastQuery = terms.join(" ");
		ajaxCall = $.getJSON(endpoint+"search.jsonp?callback=?&q="+terms.join(" "), function(response) {
			callback(response);
	    });
	};
	
	this.getTag = function(request, callback) {
		var url = endpoint+"suggest/tag.jsonp?callback=?&q="+request.term;
		$.getJSON(url, function(data) {
			callback(data);
		});
	};
	
	this.getTags = function(url, callback) {
		$.getJSON(endpoint+"suggest/tags.jsonp?callback=?&url="+encodeURIComponent(url), function(response) {
			callback(response);
	    });
	};
	
	this.saveEntry = function(url, tags, callback) {
		var saveurl = endpoint+"entry.jsonp?callback=?&url="+encodeURIComponent(url)+"&tags="+tags.join(" ");
		console.log(saveurl);
		$.getJSON(saveurl, function(response){
			callback(response);
		});
	};
};