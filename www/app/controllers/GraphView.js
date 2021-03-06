exports = function(view) {
	var Stage = require("./graphView/Stage.js");
	var Node = require("./graphView/Node.js");

	var stage = new Stage(view.canvas);

	this.setData = function(entryItems, tagItems, terms) {
		this.canvas.width = stage.width = $(this).width();
		this.canvas.height = stage.height = $(this).height();

		this.clear();

		// add root first
		var root = new Node({
			x : stage.width / 2,
			y : stage.height / 2
		});
		
		root.data.text = terms.join(" ");
		root.data.fontSize = 14;
		loadImageForNode(stage, root, 0);
		stage.add(root);

		// add count node
		var counter = new Node({
			x : stage.width / 2 + 50,
			y : stage.height / 2 - 50
		});
		counter.link(root);
		counter.data.fontSize = 12;
		counter.data.text = (entryItems.length + tagItems.length) + " matches";
		loadImageForNode(stage, counter, 1);
		stage.add(counter);

		for ( var i = 0; i < tagItems.length; i++) {
			tagItems[i] = {
				text : tagItems[i]
			};
			tagItems[i].tag = true;
		}
		addGraphNodes(stage, root, tagItems, 3, 350, 7, this);

		// display exact hits
		var host = function(url) {
			var firstSlash = url.indexOf("/");
			return url.substring(firstSlash + 2, url.indexOf("/",
					firstSlash + 2));
		};
		var url = function(url) {
			var firstSlash = url.indexOf("/");
			return url.substring(url.indexOf("/", firstSlash + 2));
		}
		for ( var i = 0; i < entryItems.length; i++) {
			entryItems[i].text = host(entryItems[i].url);
			entryItems[i].alt = url(entryItems[i].url);
			entryItems[i].entry = true;
		}
		addGraphNodes(stage, root, entryItems, 2, 250, 0, this);

		stage.renderOnReady();
	}

	this.clear = function() {
		stage.clear();
		stage.renderOnReady();
	}

	this.setNodeData = function(nodeIndex, dataName, dataValue) {
		stage.at(nodeIndex).data[dataName] = dataValue;
		stage.renderOnReady();
	}
}