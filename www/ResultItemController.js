var ResultItemController = function() {
	
	this.extend = function(view) {
		
		view.setData = function(response) {
			
			if(typeof response.source !== "undefined" && response.source !== "api-techbrowser.com") {
				$("#link", this).attr("href", response.url).text(response.url);
			} else
				$("#link", this).attr("href", response.url).text(response.url);
			$("#favicon", this).attr("src", "http://"+response.url.match(/:\/\/(.[^/]+)/)[1]+"/favicon.ico" );
			$("#favicon", this)[0].onerror = function() {
				$(this).hide();
			}
			
			if(typeof response.tagsRaw !== "undefined") {
				$(".content", this).html("<b>"+response.tagsRaw.join(" ")+"</b>");
				$(".tagsInputBox", this)[0].setTags(response.tagsRaw);
			}
			else
			if(typeof response.content !== "undefined") 
				$(".content", this).html(response.content);
			else
				$(".content", this).hide();
				
			$(".resultItemMenu", this).hide();
			if(typeof response.source !== "undefined") {
				$(".source", this).text("source: "+response.source);
			}
			else {
				$(".source", this).text("source: api-techbrowser.com");
				$(".resultItemMenu", this).show();
			}
				
			$(".edit", this).hide();
			$(".view", this).show();
			view.viewMode = "view";
		}
		
		view.setMode = function(mode) {
			if(view.viewMode != mode) {
				$("."+view.viewMode, view).fadeOut("fast",function(){
					$("."+mode, view).fadeIn("fast");
				});
			}
			view.viewMode = mode;
		}
		
		$(".editButton", view).click(function(){
			view.setMode("edit");
		});
		
		$(".cancelButton", view).click(function(){
			view.setMode("view");
		});
		
		$(".tagsInputBox", view)[0].on("tagRemove", function(tag){
			/*appContext.recordTagMismatch(tag, inputBox.getTags(), function(){
				// do nothing
			});*/
		});
		
		$(".tagsInputBox", view)[0].on("autocomplete", function(event){
			appContext.queryTags(event.request,event.callback);
		});
	}
}
