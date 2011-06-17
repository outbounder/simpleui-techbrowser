exports = function(view) {
	
	var indexAnimation = new require("./IndexAnimation.js")();
	var tagsDB = require("/app/models/db/Tags.js");
	var entriesDB = require("/app/models/db/Entries.js");
	
	var _self = this;
	this.searchResultsMode = "list";

	this.indexView = view;
	var inputBox = $("#inputBox", view)[0];
	
	inputBox.on("tagRemove", function(tag){
		/* appContext.recordTagMismatch(tag, inputBox.getTags(), function(){
			// do nothing
		}); */
	});

	inputBox.on("autocomplete", function(event){
		tagsDB.queryTags(event.request,event.callback);
	});
	
	inputBox.on("save", function(entry){
		entriesDB.saveEntry(entry.url, entry.tags, function(response){
			if(response != "OK") {
				entry.errorHandler("failed to save entry due "+response);
				return;
			}
			
			inputBox.setTags(entry.tags);
			inputBox.emit("query", entry.tags);
		});
	});
	
	inputBox.on("urlInputComplete", function(terms){
		inputBox.setLoading(true);
		tagsDB.getTags(terms, function(response){
			inputBox.setLoading(false);
			if(response.length > 0)
				inputBox.setTags(response, true);
		});
	});
	
	inputBox.on("keyhit", function(){
		indexAnimation.delayAnimation();
	});
	
	inputBox.on("query", function(terms){
		_self.runEntriesQuery(terms);
	});
	
	$("#searchResultsToggleBtn").click(function(){
		if(_self.searchResultsMode == "list") {
			$("#resultsList").fadeOut("fast",function(){
				_self.searchResultsMode = "graph";
				_self.runEntriesQuery(inputBox.getTags());
			});
		} else {
			$("#graphView").fadeOut("fast",function(){
				_self.searchResultsMode = "list";
				_self.runEntriesQuery(inputBox.getTags());
			});
		}
	});
	
	$("#graphView", view)[0].on('tagClicked', function(tag){
		var terms = inputBox.getTags();
		terms.push(tag);
		inputBox.setTags(terms);
		_self.runEntriesQuery(terms);
	});
	
	this.runEntriesQuery = function(terms) {
		hash = "#"+terms.join(" ");
		if(typeof history.pushState === "function")
			history.pushState({terms: terms}, "TechbrowserSearch", hash);
		else
			window.location.hash = hash;
		
		if(_self.searchResultsMode == "list") {
			$("#resultsList").fadeOut("fast");
			$("#resultsList")[0].showResultsForTags(terms, this.handleQueryResponseAsList);
		} else {
			$("#graphView").fadeOut("fast");
			$("#graphView")[0].showResultsForTags(terms, this.handleQueryResponseAsGraph);
		}
	};
	
	this.showResultsForTags = function(tags) {
		entriesLoader.queryEntries(tags, function(results, hasMore, allCount){
			if(hasMore) {
				view.renderResults(results, hasMore);
			}
			else
				webResultsLoader.queryWebResults(tags, function(webResults, webResultsHasMore, webResultsAllCount){
					for(var i = 0; i<webResults.length; i++)
						results.push(webResults[i]);
					view.renderResults(results, webResultsHasMore, allCount+webResultsAllCount);
				});
		});
	};

	this.showMoreResults = function() {
		if(entriesLoader.hasMore)
			entriesLoader.queryMoreEntries(function(results, hasMore, allCount){
				if(hasMore) {
					view.renderMoreResults(results, hasMore, allCount);
				} else 
					webResultsLoader.queryMoreWebResults(function(webResults, webResultsHasMore, webResultsAllCount) {
						for(var i = 0; i<webResults.length; i++)
							results.push(webResults[i]);
						view.renderMoreResults(results, webResultsHasMore, allCount+webResultsAllCount);	
					});
			});
		else
			webResultsLoader.queryMoreWebResults(function(webResults, webResultsHasMore, webResultsAllCount) {
				for(var i = 0; i<webResults.length; i++)
					results.push(webResults[i]);
				view.renderMoreResults(results, webResultsHasMore, allCount+webResultsAllCount);	
			});	
	};
	
	this.handleQueryResponseAsGraph = function(response,relatedTags) {
		var graphView = $("#graphView")[0];
		$(graphView).fadeOut("fast",function(){
			graphView.clear();
			
			if(response.length) {
				appContext.findRelatedTags(_self.currentTerms, function(tags){
					graphView.setData(response, tags, _self.currentTerms);
					$(graphView).fadeIn("fast");
					indexAnimation.animateAbove();
				});
			} else {
				indexAnimation.animateCenter();
				$(graphView).fadeIn("fast");
			}
		});
	};
	
	this.handleQueryResponseAsList = function(response, hasMore, allCount, currentOffset) {
    	if(response.length){
    		$("#entriesCanvas")[0].setCircleData(0,'number',currentOffset+"/"+allCount);
			indexAnimation.animateUp();
		} else {
			$("#entriesCanvas")[0].setCircleData(0,'number',undefined);
			indexAnimation.animateCenter();
		}
    	
	    $("#resultsList").fadeIn("fast");
	};
	
	if(window.onpopstate)
		window.onpopstate = function(event) {
			if(typeof event.terms != 'undefined') {
				inputBox.setTags(event.terms);
				_self.runEntriesQuery(event.terms);
			}
		};
	
	var hash = window.location.hash;
	if(hash.length > 0) {
		terms = hash.substr(1).split(" ");
		inputBox.setTags(terms);
		_self.runEntriesQuery(terms);
	}
};
