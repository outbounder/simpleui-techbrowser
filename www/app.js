var app = {
	ownerUID : null,
	ownerFB : null,
	ownerGoogle : null,
	endpoint : "http://localhost:8080/", // http://api-techbrowser.appspot.com/
	searchMode : "public",
	googleAppKey : "18358026133409707365",
	facebookAppKey: '165991020094008',
	
	requestUserLogin : function() {
		var loginDialog = Component.fromPath("component/login");
		SexyLightbox.initialize();
		SexyLightbox.showDOM(null, loginDialog, 500, 200, true, "#000000");
		loginDialog.dialog = SexyLightbox;
		loginDialog.init();
		loginDialog.on("pending", function(provider){
			SexyLightbox.close();
		});
		loginDialog.on("selected", function(provider){
			SexyLightbox.close();
			app.setOwnerUID(provider);
		});
	},
	googleUserLogin : function(uid) {
		if(uid != null) {
			this.setOwnerUID(uid);
			this.ownerGoogle = uid;
		}
	},
	facebookUserLogin : function(uid) {
		if(uid != null) {
			this.setOwnerUID(uid);
			this.ownerFB = uid;
		}
	},
	hookToSocialLogins : function() {
		var _self = this;
		google.friendconnect.container.initOpenSocialApi({
			site : this.googleAppKey,
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

	},
	hasUser : function() {
		return this.ownerUID != null;
	},
	getProvider : function() {
		return this.ownerUID.split("@")[1];
	},
	setOwnerUID : function(uid) {
		this.ownerUID = uid;
		$("#loggedbox")[0].setProvider(this.getProvider());
		if(this.searchMode == "own")
			$("#searchbox")[0].setTitle("search own@"+this.getProvider()+" entries by entering tags bellow");
	},
	setSearchMode : function(value){
		app.searchMode = value;
		$("#controlmenu")[0].highlight(app.searchMode);
		if(value == "public")
			$("#searchbox")[0].setTitle("search public entries by entering tags bellow");
		else
		if(value == "own") {
			var ownProvider = this.ownerUID.split("@")[1];
			$("#searchbox")[0].setTitle("search own@"+ownProvider+" entries by entering tags bellow");
		}
	}
};

$(document).ready(function() {
	
	FB.init({appId: app.facebookAppKey, status: true, cookie: true, xfbml: true});

	Component.overrideCurrent();
	
	app.setSearchMode(app.searchMode);

	app.hookToSocialLogins();
	
	$("#controlmenu")[0].on("highlight", function(data) {
		if(data == "own" && !app.hasUser()) {
			app.requestUserLogin();
			return false;
		}

		app.setSearchMode(data);
		return false;
	});
});