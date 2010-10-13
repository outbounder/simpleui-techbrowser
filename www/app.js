$(document).ready(function(){
	// autocomplete functionality
	$("#searchField").tagit({
		source: "http://api-techbrowser.appspot.com/suggest/search.jsonp",
		jsonp: true,
		param: 'q'
	});
	$("#searchField").bind("onchanged",function(){
		$("#searchForm").trigger("submit");
	});
	
	// search functionality
	$("#searchForm").submit(function(){
		var term = $("#searchField")[0].getValue();
		$.getJSON("http://api-techbrowser.appspot.com/search.jsonp?q="+term+"&callback=?", function(response) {
			$("#resultsDiv").fadeOut("fast",function(){
				$("#resultsDiv").empty();
	        	if(response.length){
					var resultsDiv = $('#resultsDiv');
					for(var i=0;i<response.length;i++){
						// Creating a new result object and firing its toString method:
						resultsDiv.append(new result(response[i]) + '');
					}
				}
	        	$("#resultsDiv").fadeIn("fast");
			});
	    });
		
		return false;
	});
	
	function result(r){
		
		// This is class definition. Object of this class are created for
		// each result. The markup is generated by the .toString() method.
		
		var arr = [];
		
		arr = [
			'<div class="webResult">',
			'<h2><a href="',r.url,'" target="_blank">',r.name,'</a></h2>',
			'<a href="',r.url,'" target="_blank">',r.ul,'</a>',
			'</div>'
		];
			
		
		// The toString method.
		this.toString = function(){
			return arr.join('');
		}
	}
});