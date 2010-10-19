var _self = this;
this.lastActiveButton = null;
this.section = null;

this.highlight = function(value) {
	if(_self.lastActiveButton)
		_self.lastActiveButton.removeClass("active");
	
	if(typeof value === "string") {
		_self.lastActiveButton = $("#"+value, _self);
		_self.section = value;
	}
	else {
		_self.lastActiveButton = $(value);
		_self.section = value.getAttribute("id");
	}
	
	if(_self.lastActiveButton) {
		_self.lastActiveButton.addClass("active");
	}
	
};

this.select = function(value) {
	if(typeof value !== "string") 
		value = value.getAttribute("id");
	
	if(!app.ownerUID && value == "own") {
		app.requestLogin(function(logged){
			if(!logged)
				this.highlight("public");
		});
		return;
	}
	
	this.highlight(value);
};

$("a", this).click(function(){
	console.log(this); //WTF!
	_self.select(this);
});