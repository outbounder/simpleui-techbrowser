var AppContext =  function() {
	var endpoint = "http://localhost:8080/";//"http://api-techbrowser.appspot.com/";  
		googleAnalyticsKey = 'UA-11129132-4',
		lastQuery = null,
		timeout = null;
	
	this.query = function(terms, callback) {
		if(terms == lastQuery)
			return;
		
		lastQuery = terms;
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

var AppSocialContext = function() {
	
	var googleAppKey = "18358026133409707365",
		facebookAppKey = '165991020094008';
	
	this.requestUserLogin = function() {
		// TODO implement
	}

	this.googleUserLogin = function(uid) {
		if(uid != null) {
			this.setOwnerUID(uid);
			this.ownerGoogle = uid;
		}
	}
	
	this.facebookUserLogin = function(uid) {
		if(uid != null) {
			this.setOwnerUID(uid);
			this.ownerFB = uid;
		}
	}
	
	this.hookToSocialLogins = function() {
		
		FB.init({appId: facebookAppKey, status: true, cookie: true, xfbml: true});
		
		var _self = this;
		google.friendconnect.container.initOpenSocialApi({
			site : googleAppKey,
			onload : function(securityToken) {
				var req = opensocial.newDataRequest();
				req.add(req.newFetchPersonRequest("VIEWER"), "viewer_data");
				req.send(onData);
			}
		});

		// callback handler for datarequest.send() from above
		function onData(data) {
			var viewer_info = document.getElementById("viewer-info");
			if (data.get("viewer_data").hadError()) {
				_self.googleUserLogin(null);
			} else {
				var viewer = data.get("viewer_data").getData();
				_self.googleUserLogin(viewer.getId() + "@googleconnect.com");
			}
		};
		
		FB.getLoginStatus(function(response) {
		  if (response.session) {
			  _self.facebookUserLogin(response.session.uid+"@facebookconnect.com");
		  } else {
			  _self.facebookUserLogin(null);
		  }
		});
		
		FB.Event.subscribe('auth.sessionChange', function(response) {
		    if (response.session) {
		    	_self.facebookUserLogin(response.session.uid+"@facebookconnect.com");
		    } else {
		    	_self.facebookUserLogin(null);
		    }
		});

	}
	
	this.hasUser = function() {
		return this.ownerUID != null;
	}
	
	this.getProvider = function() {
		return this.ownerUID.split("@")[1];
	}
	
	this.setOwnerUID = function(uid) {
		this.ownerUID = uid;
		$("#loggedbox")[0].setProvider(this.getProvider());
		if(this.searchMode == "own")
			$("#searchbox")[0].setTitle("search own@"+this.getProvider()+" entries by entering tags bellow");
	}
}