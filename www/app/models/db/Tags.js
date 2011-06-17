this.exports = function() {
	var endpoint = settings.techbrowser.endpoint;
	
	this.findRelatedTags = function(terms, callback) {
		ajaxCall = $.getJSON(endpoint+"tags/related.json?callback=?&tags="+terms.join(" "), function(response) {
			callback(response);
	    });
	};
	
	this.queryTags = function(request, callback) {
		var url = endpoint+"tags/query.json?callback=?&q="+request.term;
		$.getJSON(url, function(data) {
			callback(data);
		});
	};
	
	this.getTags = function(url, callback) {
		$.getJSON(endpoint+"tags/suggest.json?callback=?&url="+encodeURIComponent(url), function(response) {
			callback(response);
	    });
	};
	
	this.recordTagMismatch = function(tagname, tags, callback) {
		var url = endpoint+"tags/mismatch.json?callback=?&tagname="+tagname+"&tags="+tags.join(" ");
		$.getJSON(url, function(response){
			callback(response);
		});
	};
}
