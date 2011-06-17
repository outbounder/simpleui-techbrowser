exports = function(data, image){
 			
	this.ready = false;
	this.data = data;
	this.image =  image;
	this.edges = [];
	
	this.emit = function(eventName, eventData) {
		for(var i = 0; i<this.listeners.length; i++)
			if(this.listeners[i].eventName == eventName)
				this.listeners[i].handler(eventData);
	};
	
	this.on = function(eventName, eventHandler) {
		this.listeners[i].push({eventName: eventName, handler: eventHandler});
	};
	
	this.render = function(context) {
		if(this.onrender)
			this.onrender();
		context.drawImage(this.image, this.data.x-this.image.width/2, this.data.y-this.image.height/2);
		if(typeof this.data.text != "undefined" && this.data.text != null) {
			context.font = "bold "+this.data.fontSize+"px sans-serif";
			context.fillStyle = "#eee";
			var textWidth = context.measureText(this.data.text).width;
			context.fillText(this.data.text,this.getCenterX()-textWidth/2,this.getCenterY());
			context.fillStyle = "#000";
			context.fillText(this.data.text,this.getCenterX()-textWidth/2-1,this.getCenterY()-1);
		}
		if(typeof this.data.alt != "undefined" && this.data.alt != null) {
			context.font = (this.data.fontSize-2)+"px sans-serif";
			context.fillStyle = "#eee";
			var textSize = context.measureText(this.data.alt);
			var textWidth = textSize.width;
			var textHeight = this.data.fontSize;
			context.fillText(this.data.alt,this.getCenterX()-textWidth/2,this.getCenterY()+textHeight);
			context.fillStyle = "#000";
			context.fillText(this.data.alt,this.getCenterX()-textWidth/2-1,this.getCenterY()+textHeight-1);
		}
	};
	
	this.link = function(node) {
		this.edges.push(node);
		node.edges.push(this);
	};

	this.getX = function() { return this.data.x-this.image.width/2; };
	this.getY = function() { return this.data.y-this.image.height/2; };
	this.getWidth = function() { return this.image.width; };
	this.getHeight = function() { return this.image.height; };
	this.getCenterX = function() { return this.data.x; }; 
	this.getCenterY = function() { return this.data.y; };
	this.checkCollision = function(x,y) {
		if( x > this.data.x-this.image.width/2 && x < this.data.x+this.image.width/2 && 
			y > this.data.y-this.image.height/2 && y < this.data.y+this.image.height/2) {
			return true;
		}
		return false;
	};
};