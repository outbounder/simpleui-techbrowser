var componentCacheCollection = [];

function wrapPathToElement(path, id, async, useCache) {
	var req = new XMLHttpRequest();
	var handleResponse = function(componentHandler) {
		if(req.status == 200 || req.status == 304) {
			
			if (useCache && !componentCacheCollection[path])
				componentCacheCollection[path] = req.responseText;
			
		    if (window.DOMParser)
		    {
		        parser=new DOMParser();
		        xmlDoc=parser.parseFromString(req.responseText,"text/xml");
		    }
		    else // Internet Explorer
		    {
		        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		        xmlDoc.async="false";
		        xmlDoc.loadXML(req.responseText);
		    }
		    
			var element = wrapToElement(xmlDoc.firstChild, id);
			if(typeof componentHandler !== "function")
				return element;
			else
				componentHandler(element);
		}
		else
			throw new Error("component not found "+path);
	}
	
	if(typeof async === "function") {
		if (!useCache || !componentCacheCollection[path]) {
			req.open("GET", path+".html", true);
			req.onreadystatechange  = function() { 
			     if(req.readyState  == 4) {
			     	handleResponse(async);
				 }
			}
			
			req.send();
		}
		else
		{
			req = {status: 200, responseText: componentCacheCollection[path]};
			handleResponse(async);
		}
	}
	else {
		if (!useCache || !componentCacheCollection[path]) {
			req.open("GET", path+".html", false);
			req.send();
		}
		else
			req = {status: 200, responseText: componentCacheCollection[path]};
		
		return handleResponse();
	}
}


Component.appendFromPath = function(parentElement, path, id, async, useCache) {
	if(typeof async !== "function") {
		var component = wrapPathToElement(path, id, null, useCache);
		if(id)
			parentElement[id] = component;
		parentElement.appendChild(component);
		fireReadyEvent(component);
		return component;
	} else {
		wrapPathToElement(path, id, function(component) {
							if(id)
								parentElement[id] = component;
							// give component to the caller to be modified before rendering
							async(component);
							// render synch
							parentElement.appendChild(component);
							fireReadyEvent(component);
						}, useCache);
	}
}

Component.fromPath = function(path, id, async, useCache) {
	if(typeof async !== "function")
		return wrapPathToElement(path, id, null, useCache);
	else
		wrapPathToElement(path, id, async, useCache);
}