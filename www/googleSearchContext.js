var GoogleSearchContext = function() {
	var settings = {
		type		: 'web',
		perPage		: 8,			// A maximum of 8 is allowed by Google
		page		: 0				// The start page
	};
	
	
	this.search = function(terms, handler) {
		this.lastTerms = terms;
		settings.page = 0;
		
		var apiURL = 'http://ajax.googleapis.com/ajax/services/search/'+settings.type+'?v=1.0&callback=?';
		$.getJSON(apiURL,{q:terms.join(" "),rsz:settings.perPage,start:settings.page*settings.perPage},function(r){
			var results = r.responseData.results;
			
			var cursor = r.responseData.cursor;
			
			if( cursor.estimatedResultCount > (settings.page+1)*settings.perPage)
				handler(results, true);
			else
				handler(results, false);
		});
	};
	
	this.searchMore = function(handler) {
		if(this.lastTerms) {
			settings.page += 1;
			this.search(this.lastTerms, handler);
		}
		else
			handler([]);
	};
};