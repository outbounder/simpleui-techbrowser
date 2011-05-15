var loadedImages = [];
var loadImageForNode = function(stage, node, i) {
	if(loadedImages["images/circle"+i+".png"]) {
		node.ready = true;
		node.image = loadedImages[nodeImage.src];
	} else {
		var nodeImage = new Image();
		nodeImage.src = "images/circle"+i+".png";
		nodeImage.index = i;
		nodeImage.onload = function(){
			node.ready = true;
			node.image = this;
			stage.renderOnReady();
		};
		loadedImages[nodeImage.src] = nodeImage;
	}
};

var addGraphNodes = function(stage, root, items, nodeImageNumber, radius, startAngle, view) {
	var angleStep = 360/items.length;
	var curAngle = startAngle?startAngle:0;
	for(var i = 0; i<items.length; i++) {
		var node = new Node(items[i]);
		node.data.x = root.getCenterX();
		node.data.x += Math.cos(curAngle)*radius;
		node.data.y = root.getCenterY();
		node.data.y += Math.sin(curAngle)*radius;
		node.onrender = function() {
			if(this.over)
				this.data.fontSize = 21;
			else
				this.data.fontSize = 12;
			this.over = false;
		};
		node.onmouseup = function() {
			if(this.data.entry)
				window.location = this.data.url;
			else
				view.emit("tagClicked", this.data.text);
		};
		node.onmousemove = function(e) {
			this.over = true;
			return true;
		};
		loadImageForNode(stage, node, nodeImageNumber);
		node.link(root);
		stage.add(node);
		curAngle += angleStep;
	}
};