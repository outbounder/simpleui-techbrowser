exports = function(view) {
	view.addButton.setData({x: 580, y:219});
	
	$("#error", view).hide();
	
	$(view.cancel).click(function(){
		view.setMode("search");
	});
	
	view.setError = function(error){
		$("#error", view).show();
		$("#error", view).text(error);
	}
	
	view.clearError = function() {
		$("#error", view).hide();
	}
	
	$(view.addButton).click(function() {
		var url = $(view.link).attr('href');
		var tags = view.userInput.getTags();
		if(tags.length == 0) {
			view.setError("can not save url without tags");
			return;
		}
		
		view.setMode("search");
		var result = view.emit("save", {url: url, tags: tags, errorHandler:function(error){
			view.setError(error);
		}});
	});
	
	view.userInput.on("keyhit", function() {
		view.emit("keyhit");
	});
	
	view.userInput.on("inputChanged",function() {
		view.clearError();
		
		if(view.mode == "input") // do nothing on change due current entry input process
			return; 

		var value = view.userInput.getInputValue();
		var tags = view.userInput.getTags();
		if(value != "")
			tags.push(value);
		
		view.emit("query", tags);
	});
	
	view.userInput.on("urlInputComplete",function(value){
		view.setMode("input");
		view.emit("urlInputComplete", value);
	});
	
	view.userInput.on("autocomplete", function(event){
		view.emit("autocomplete", event);
	});
	
	view.userInput.on("tagRemove", function(tag) {
		if(view.mode == "input") {
			view.emit("tagRemove", tag);
		}
	});
	
	view.closeAutosuggestBox = function() {
		view.userInput.closeAutosuggestBox();
	}
	
	view.showAutosuggestBox = function(){
		view.userInput.showAutosuggestBox();
	}
	
	view.setTags = function(tags, notifyOnRemove) {
		view.userInput.setTags(tags, notifyOnRemove);
	}
	
	view.getTags = function(tags) {
		return view.userInput.getTags();
	}
	
	view.setMode = function(mode){
		view.clearError();
		view.mode = mode;
		if(mode == "input") {
			var value = view.userInput.getInputValue();
			$(view.link).text(value);
			$(view.link).attr('href',value);
			
			
			view.userInput.setInputHintValue("type to add additional tags");
			view.userInput.clearAll();
			
			$(view.link).show();
			$(view.cancel).show();
			$(view.addButton).show();
		} else if(mode == "search"){
			view.userInput.setInputHintValue("type here to search entries or type/paste url to add it");
			$(view.link).hide();
			$(view.cancel).hide();
			$(view.addButton).hide();
			view.userInput.clearAll();
		}
	}
	
	view.setLoading = function(value){
		view.userInput.setLoading(value);
	}
	
	view.setMode("search");
};