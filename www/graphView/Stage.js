var Stage = function(canvas) {
	var _self = this;
	
	this.width = canvas.width;
	this.height = canvas.height;
	this.context = canvas.getContext('2d');
	this.nodes = [];
	this.allChecked = false;
	
	this.clear = function() {
		this.nodes = [];
		this.allChecked = false;
	};
	
	this.add = function(node) {
		this.nodes.push(node);
		this.allChecked = false;
	};
	
	this.at = function(index) {
		return this.nodes[index];
	};
	
	var wasInterated = false;
	canvas.onmousemove = function(e) {
		var interacted = false;
		for(var i = 0; i<_self.nodes.length; i++) {
			var node = _self.nodes[i];
			if(node.onmousemove && node.checkCollision(e.clientX,e.clientY)) {
				wasInterated = true;
				interacted = true;
				if(node.onmousemove(e))
					_self.renderOnReady();
			}
		}
		if(wasInterated && !interacted) {
			_self.renderOnReady();
			wasInterated = false;
		}
	};
	
	canvas.onmousedown = function(e) {
		for(var i = 0; i<_self.nodes.length; i++) {
			var node = _self.nodes[i];
			if(node.onmousedown && node.checkCollision(e.clientX,e.clientY))
					if(node.onmousedown(e))
						_self.renderOnReady();
		}
	};
	
	canvas.onmouseup = function(e) {
		for(var i = 0; i<_self.nodes.length; i++) {
			var node = _self.nodes[i];
			if(node.onmouseup && node.checkCollision(e.clientX,e.clientY))
					if(node.onmouseup(e))
						_self.renderOnReady();
		}
	};
	
	this.render = function() {
		console.log("rendering "+this.nodes.length);
		this.context.clearRect(0, 0, this.width, this.height);
		
		this.context.beginPath();
		for(var i = 0; i<this.nodes.length; i++) {
			var node = this.nodes[i];
			for(var k = 0; k<node.edges.length; k++) {
				var edgeNode = node.edges[k];
				this.context.moveTo(node.getCenterX(),node.getCenterY());
				this.context.lineTo(edgeNode.getCenterX(),edgeNode.getCenterY());
			}
		}
		
		this.context.strokeStyle = "#fff"; 
		this.context.stroke(); 
		
		for(var i = 0; i<this.nodes.length; i++)
			this.nodes[i].render(this.context);
	};
	
	this.renderOnReady = function(){
		if(!this.allChecked) {
			for(var i = 0; i<this.nodes.length; i++) {
				if(!this.nodes[i].ready)
					return;
			}
			this.allChecked = true;
		}
		
		try {
			this.render();
		} catch(e) {
			console.log(e);
		}
	};
};