var AugmentController = function() {
	this.onInit = function() {
		var hash = window.location.hash;
		if(hash.length > 0) {
			url = hash.substr(1);
			url = decodeURIComponent( url );
			$("#realPage").attr("src",  url);
			$("#closeLink").attr("href", url);
		}
		
		$("#addButton").mouseover(function(){
			this.src = "images/add_over.png";
			this.isOver = true;
		});
		
		$("#addButton").mouseout(function(){
			this.src = "images/add_normal.png";
			this.isOver = undefined;
		});
		
		$("#addButton").mousedown(function(){
			this.src = "images/add_down.png";
		});
		
		$("#addButton").mouseup(function(){
			if(this.isOver)
				this.src = "images/add_over.png";
			else
				this.src = "images/add_normal.png";
		});
	};
};