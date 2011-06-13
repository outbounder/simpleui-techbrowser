this.exports = function() {
	this.googleAnalyticsKey = 'UA-11129132-4';
	this.googleWebSearchSettings = {
		type		: 'web',
		perPage		: 8,			// A maximum of 8 is allowed by Google
		page		: 0				// The start page
	};
	this.techbrowser = {
		endpoint : /*"http://api-techbrowser.appspot.com/",//*/"http://localhost:8080/",
		query : {
			limit: 50
		}
	};
}