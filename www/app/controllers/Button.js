exports = function(view) {
	$(view).mouseover(function(){
		view.src = "/app/views/images/"+$(view).attr("image-type")+"_over.png";
		view.isOver = true;
	});
	
	$(view).mouseout(function(){
		view.src = "/app/views/images/"+$(view).attr("image-type")+"_normal.png";
		view.isOver = undefined;
	});
	
	$(view).mousedown(function(){
		view.src = "/app/views/images/"+$(view).attr("image-type")+"_down.png";
	});
	
	$(view).mouseup(function(){
		if(view.isOver)
			view.src = "/app/views/images/"+$(view).attr("image-type")+"_over.png";
		else
			view.src = "/app/views/images/"+$(view).attr("image-type")+"_normal.png";
	});
	
	view.setData = function(data){
		view.src = "/app/views/images/"+$(view).attr("image-type")+"_normal.png";
		view.style.top = data.y+"px";
		view.style.left = data.x+"px";
	};
};