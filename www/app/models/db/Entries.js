// EntriesLoader, responsible for loading(iterating) through remote entries.
this.exports = function() {
	
	// additional "entries" loader
	var googleWebResultsLoader = new require("./GoogleWebResults.js");
	var endpoint = settings.techbrowser.endpoint;
	var currentOffset = 0;
	var currentLimit = settings.techbrowser.query.limit;
	var lastQueryTerms = [];
	
	this.queryEntries = function(terms, callback) {
		lastQueryTerms = terms;
		currentOffset = 0;
		
		this.doQueryEntries(callback);
	};
	
	this.queryEntriesMore = function(callback) {
		currentOffset += currentLimit;
		this.doQueryEntries(lastQueryTerms, callback);
	};
	
	this.doQueryEntries = function(terms, callback) {
		$.getJSON(endpoint+"entries/query.json?callback=?"+
			"&tags="+terms.join(" ")+
			"&offset="+currentOffset+
			"&limit="+currentLimit, 
			function(queryEntriesResponse) {
				callback(queryEntriesResponse.results, 
						 queryEntriesResponse.count > currentOffset+currentLimit, 
						 queryEntriesResponse.count);
			});
	};
	
	this.saveEntry = function(url, tags, callback) {
		var saveurl = endpoint+"entries/submit.json?callback=?&url="+encodeURIComponent(url)+"&tags="+tags.join(" ");
		$.getJSON(saveurl, function(response){
			callback(response);
		});
	};
	
}
