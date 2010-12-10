var AppContext =  function() {
	var endpoint = "http://api-techbrowser.appspot.com/", //"http://localhost:8080/"
		googleAppKey = "18358026133409707365",
		facebookAppKey = '165991020094008',
		googleAnalyticsKey = 'UA-11129132-4';
	
	this.query = function(terms, callback) {
		$.getJSON(endpoint+"search.jsonp?q="+terms+"&callback=?", function(response) {
			callback(response);
	    });
	};
};