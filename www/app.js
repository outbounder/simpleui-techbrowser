$(document).ready(function(){
	
	Component.overrideCurrent();
	$("#controlmenu")[0].select("public");
});

var app = {
	ownerUID : null,
	endpoint : "http://localhost:8080/", //http://api-techbrowser.appspot.com/
	requestLogin : function(onLoginHandler) {
		var loginDialog = Component.fromPath("component/login");
		console.log(loginDialog);
		
		SexyLightbox.initialize();
		SexyLightbox.showDOM(null,loginDialog,500,200,true,"#000000");
		loginDialog.dialog = SexyLightbox;
	}
};