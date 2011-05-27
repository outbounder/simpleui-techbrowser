var AppContext =  function() {
	this.googleAnalyticsKey = 'UA-11129132-4';
	this.endpoint = "http://api-techbrowser.appspot.com/";//*/"http://localhost:8080/";  
		
	this.queryEntries = function(terms, callback) {
		ajaxCall = $.getJSON(this.endpoint+"entries/query.json?callback=?&tags="+terms.join(" "), function(response) {
			callback(response);
	    });
	};
	
	this.findRelatedTags = function(terms, callback) {
		ajaxCall = $.getJSON(this.endpoint+"tags/related.json?callback=?&tags="+terms.join(" "), function(response) {
			callback(response);
	    });
	};
	
	this.queryTags = function(request, callback) {
		var url = this.endpoint+"tags/query.json?callback=?&q="+request.term;
		$.getJSON(url, function(data) {
			callback(data);
		});
	};
	
	this.getTags = function(url, callback) {
		$.getJSON(this.endpoint+"tags/suggest.json?callback=?&url="+encodeURIComponent(url), function(response) {
			callback(response);
	    });
	};
	
	this.saveEntry = function(url, tags, callback) {
		var saveurl = this.endpoint+"entries/submit.json?callback=?&url="+encodeURIComponent(url)+"&tags="+tags.join(" ");
		$.getJSON(saveurl, function(response){
			callback(response);
		});
	};
	
	this.recordTagMismatch = function(tagname, tags, callback) {
		var url = this.endpoint+"tags/mismatch.json?callback=?&tagname="+tagname+"&tags="+tags.join(" ");
		$.getJSON(url, function(response){
			callback(response);
		});
	};
};
