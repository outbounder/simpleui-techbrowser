this.exports = function(settings) {
	this.googleSettings = settings.googleWebSearchSettings;

	this.queryWebResults = function(terms, handler) {
		this.lastTerms = terms;
		this.googleSettings.page = 0;
		
		
		var apiURL = 'http://ajax.googleapis.com/ajax/services/search/'+settings.type+'?v=1.0&callback=?';
		$.getJSON(apiURL, { 
			   q:terms.join(" "),
			   rsz:settings.perPage,
			   start:this.googleSettings.page*this.googleSettings.perPage
			 },
			 function(r){
				var results = r.responseData.results;
				var cursor = r.responseData.cursor;
				handler(results, 
						cursor.estimatedResultCount > (settings.page+1)*settings.perPage, 
						cursor.estimatedResultCount);
		});
	};
	
	this.searchGoogleMore = function(handler) {
		if(this.lastTerms) {
			this.googleSettings.page += 1;
			this.queryWebResults(this.lastTerms, handler);
		}
		else
			handler([]);
	};
};
