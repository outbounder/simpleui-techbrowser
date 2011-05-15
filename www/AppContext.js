var AppContext =  function() {
	this.googleAnalyticsKey = 'UA-11129132-4';
	this.endpoint = /*"http://api-techbrowser.appspot.com/";//*/"http://localhost:8080/";  
		
	this.queryEntries = function(terms, callback) {
		ajaxCall = $.getJSON(this.endpoint+"search.jsonp?callback=?&q="+terms.join(" "), function(response) {
			callback(response);
	    });
	};
	
	this.queryTags = function(terms, callback) {
		ajaxCall = $.getJSON(this.endpoint+"searchTags.jsonp?callback=?&q="+terms.join(" "), function(response) {
			callback(response);
	    });
	};
	
	this.getTag = function(request, callback) {
		var url = this.endpoint+"suggest/tag.jsonp?callback=?&q="+request.term;
		$.getJSON(url, function(data) {
			callback(data);
		});
	};
	
	this.getTags = function(url, callback) {
		$.getJSON(this.endpoint+"suggest/tags.jsonp?callback=?&url="+encodeURIComponent(url), function(response) {
			callback(response);
	    });
	};
	
	this.saveEntry = function(url, tags, callback) {
		var saveurl = this.endpoint+"entry.jsonp?callback=?&url="+encodeURIComponent(url)+"&tags="+tags.join(" ");
		$.getJSON(saveurl, function(response){
			callback(response);
		});
	};
	
	this.recordTagMismatch = function(tagname, tags, callback) {
		var url = this.endpoint+"recordTagMismatch.jsonp?callback=?&tagname="+tagname+"&tags="+tags.join(" ");
		$.getJSON(url, function(response){
			callback(response);
		});
	};
};