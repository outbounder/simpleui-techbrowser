var IndexAnimation = function() {
	this.animationTimeout = 3*1.618;
	this.animationTimeoutId = null;
	this.pendingAnimationFunc = null;
	
	this.animateAbove = function() {
		$("#inputBox").animate({ 
		    top: "0%",
		    marginTop: "0px"
		  }, 
		  200);
		
		$(".ui-autocomplete").animate({ 
		    top: "40px"
		  }, 
		  500);
		
	};
	
	this.animateUp = function() {
		this.pendingAnimationFunc = this.animateUpImpl;
		this.delayAnimation();
	};
	
	this.animateCenter = function() {
		this.pendingAnimationFunc = this.animateCenterImpl;
		this.delayAnimation();
	};
	
	this.delayAnimation = function() {
		if(this.pendingAnimationFunc) {
			if(this.animationTimeoutId)
				clearTimeout(this.animationTimeoutId);
			var _self = this;
			this.animationTimeoutId = setTimeout(function(){ _self.pendingAnimationFunc(); }, this.animationTimeout);
		}
	};
	
	this.animateUpImpl = function() {
		$("#inputBox").animate({ 
		    top: "0%",
		    marginTop: "250px"
		  }, 
		  200);
		
		$(".ui-autocomplete").animate({ 
		    top: "290px"
		  }, 
		  500);
		
		$("#entriesCanvas").animate({ 
		    top: "0%",
		    marginTop: "0px"
		  }, 
		  200);
		
		$("#resultsList").animate({ 
			top: "0%",
			marginTop: "380px"
		  }, 200 );
	};
	
	this.animateCenterImpl = function() {
		$("#entriesCanvas").animate({ 
		    top: "50%",
		    marginTop: "-221px"
		  }, 200 );
		
		$("#inputBox").animate({ 
		    top: "50%",
		    marginTop: "10px"
		  }, 200 );
		
		$(".ui-autocomplete").animate({ 
		    top: "530px"
		  }, 
		  500);
		
		$("#resultsList").animate({ 
			top: "50%",
			marginTop: "170px"
		  }, 200 );
	};
};