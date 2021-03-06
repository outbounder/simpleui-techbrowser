exports = function(view) {
	
	var entriesLoader = new require("../models/db/Entries.js");
	var webResultsLoader = new require("../models/db/GoogleWebResults.js");
	
	view.renderResults = function(results, hasMore, allCount) {
		view.clearItems();
    	for(var i = 0; i<items.length; i++)
    		view.addItem(items[i]);
    	if(hasMore)
    		$("#more", this).show();
    	else
    		$("#more", this).hide();
    	this.emit("renderComplete", {results: results, hasMore: hasMore, allCount: allCount});
	};
	
	view.renderMoreResults = function(results, hasMore, allCount) {
		for(var i = 0; i<items.length; i++)
    		view.addItem(items[i]);
    	if(hasMore)
    		$("#more", this).show();
    	else
    		$("#more", this).hide();
    	this.emit("renderComplete", {results: results, hasMore: hasMore, allCount: allCount});
	};
	
	view.addItem = function(itemData) {
		var item = Component.fromPath("/app/views/resultsItem.html");
		item.bindTo(itemData);
		this.results.appendChild(item);
	};
	
	view.clearItems = function() {
		$(view.results).empty();
	};
	
	$("#moreBtn", view).click(function(){
		view.showMoreResults();
	});
};