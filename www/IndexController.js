var IndexController = function(appContext, indexAnimation) {
	
	var _self = this;
	
	this.currentResults = [];
	this.currentTerms = null;
	this.searchResultsMode = "list";
	
	this.onInit = function(indexView) {
		this.indexView = indexView;
		var inputBox = $("#inputBox")[0];
		
		inputBox.on("tagRemove", function(tag){
			/* appContext.recordTagMismatch(tag, inputBox.getTags(), function(){
				// do nothing
			}); */
		});
		
		inputBox.on("autocomplete", function(event){
			appContext.queryTags(event.request,event.callback);
		});
		
		inputBox.on("save", function(entry){
			appContext.saveEntry(entry.url, entry.tags, function(response){
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
			appContext.getTags(terms, function(response){
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

		$("#searchResultsToggleBtn").click(function(){
			if(_self.searchResultsMode == "list") {
				$("#resultsList").fadeOut("fast",function(){
					$("#entriesCanvas").fadeOut("fast", function(){
						if(_self.currentResults.length) {
							appContext.findRelatedTags(_self.currentTerms, function(relatedTags){
								$("#graphView")[0].setData(_self.currentResults, relatedTags, _self.currentTerms);
								$("#graphView").fadeIn();
								indexAnimation.animateAbove();
							});
						} else
							indexAnimation.animateCenter();
						_self.searchResultsMode = "graph";
					});	
				});
			} else {
				$("#graphView").fadeOut("fast",function(){
					$("#entriesCanvas").fadeIn("fast", function(){
						$("#resultsList")[0].setData(_self.currentResults);
						$("#resultsList").fadeIn();
						if(_self.currentResults.length)
							indexAnimation.animateUp();
						else
							indexAnimation.animateCenter();
						_self.searchResultsMode = "list";
					});	
				});
			}
		});
		
		$("#graphView")[0].on('tagClicked', function(tag){
			var terms = inputBox.getTags();
			terms.push(tag);
			inputBox.setTags(terms);
			_self.runEntriesQuery(terms);
		});
		
		$("#resultsList")[0].on("moreRequested", function(){
			googleSearchContext.searchMore(function(results, hasMore){
				for(var i = 0; i<results.length; i++)
					results[i].source = "google.com";
				$("#resultsList")[0].appendData(results);
				if(hasMore)
					$("#resultsList")[0].showMore();
				else
					$("#resultsList")[0].hideMore();
			});
		});
	};
	
	this.runEntriesQuery = function(terms) {
		hash = "#"+terms.join(" ");
		if(typeof history.pushState === "function")
			history.pushState({terms: terms}, "TechbrowserSearch", hash);
		else
			window.location.hash = hash;
		
		this.currentTerms = terms;
		appContext.queryEntries(terms, function(response){
			_self.currentResults = response;
			
			if(_self.searchResultsMode == "list") {
				
				googleSearchContext.search(terms, function(googleResults, hasMore){
					for(var i = 0; i<googleResults.length; i++) {
						var item = googleResults[i];
						response[response.length++] = {url: item.unescapedUrl, content: item.content, source: "google.com"};
					}
					
					_self.handleQueryResponseAsList(response, hasMore);
				});
			}
			if(_self.searchResultsMode == "graph") {
				_self.handleQueryResponseAsGraph(response);
			}
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
	
	this.handleQueryResponseAsList = function(response, hasMore) {
		$("#resultsList").fadeOut("fast",function(){
			
			$("#resultsList")[0].clearItems();
			
	    	if(response.length){
	    		$("#entriesCanvas")[0].setCircleData(0,'number',response.length+" matches");
				var resultsList = $("#resultsList");
				resultsList[0].setData(response);
				indexAnimation.animateUp();
				
				if(hasMore)
					$("#resultsList")[0].showMore();
				else
					$("#resultsList")[0].hideMore();
				
			} else {
				$("#resultsList")[0].hideMore();
				
				$("#entriesCanvas")[0].setCircleData(0,'number',undefined);
				$("#resultsList")[0].setEmpty();
				indexAnimation.animateCenter();
			}
	    	
	    	$("#resultsList").fadeIn("fast");
		});
	};
};