function wrapPathToElement(path, id, async) {
	var req = new XMLHttpRequest();
	var handleResponse = function(componentHandler) {
		if(req.status == 200 || req.status == 304) {
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
		req.open("GET", path+".html", true);
		req.onreadystatechange  = function() { 
		     if(req.readyState  == 4) {
		     	handleResponse(async);
			 }
		}
		req.send();
	}
	else {
		req.open("GET", path+".html", false);
		req.send();
		return handleResponse();
	}
}

function executeScript(context, node) {
	for(var i = 0; i<node.childNodes.length; i++) {
		var builder = new Function(node.childNodes[i].data.replace(/^\s+|\s+$/g, ""));
		builder.apply(context);
	}
}

function executeScriptFromPath(context, path) {
	var req = new XMLHttpRequest();
	req.open("GET", path+".js", false);
	req.send();
	if(req.status != 200 && req.status != 304)
		throw new Error("script not found "+path);
		
	var builder = new Function(req.responseText);
	builder.apply(context);
}

function wrapToElement(node, id, parentDomNode) {
	if(node.nodeName == "script" && node.getAttribute("type") === "component-code") {
		executeScriptFromPath(parentDomNode, node.getAttribute("source"));
		return null;
	}
	else
	if(node.nodeName == "script" && node.getAttribute("src") !== null) {
	
		var script = document.createElement(node.nodeName);
		script.setAttribute('src', node.getAttribute("src"));
		if(node.getAttribute('id') !== null)
			script.setAttribute("id", node.getAttribute("id"));
			
		if(node.childNodes.length != 0) // text or cdata
			executeScript(script, node);

		return script;
	}
	else
	if(node.nodeName == "script" && node.getAttribute("source") !== null) {
	
		var element = wrapPathToElement(node.getAttribute("source"), node.getAttribute("id"));
		if(typeof parentDomNode !== 'undefined')
			parentDomNode[node.getAttribute("id")] = element;
		
		if(node.childNodes.length != 0) // text or cdata
			executeScript(element, node);
			
		return element;
	}
	else
	if(node.nodeName == "script" && node.getAttribute("source") === null) {
		executeScript(parentDomNode, node);
		return null;
	}
	else { // apply the node as it is by traversing its childs
		var e = document.createElement(node.nodeName);
		
		if(id)
			e.setAttribute('id', id);
			
		if(typeof node.attributes !== "undefined" && node.attributes !== null) 
			for(var i = 0; i<node.attributes.length; i++)
				e.setAttribute(node.attributes[i].name, node.attributes[i].value);
	
		for(var i = 0; i<node.childNodes.length; i++) {
			
			if(node.childNodes[i].nodeType == 8)
				continue;
				
			if(node.childNodes[i].nodeType == 3) {
				var text = document.createTextNode(node.childNodes[i].data);
				e.appendChild(text);
			}
			else {
				var value = wrapToElement(node.childNodes[i], null, e);
				if(value) {
					e.appendChild(value);
					if(value.getAttribute('id'))
						e[value.getAttribute('id')] = value;
				}
			}
		}

		return e;
	}
}

function overrideFromPath(parentElement, scriptElement, path, async) {
	if(typeof async !== "function") {
		var component = wrapPathToElement(path, scriptElement.getAttribute('id'));
		if(scriptElement.getAttribute('id'))
			parentElement[scriptElement.getAttribute('id')] = component;
		parentElement.replaceChild(component, scriptElement);
	} else {
		wrapPathToElement(path, scriptElement.getAttribute('id'),
				function(component) {
					if(scriptElement.getAttribute('id'))
						parentElement[scriptElement.getAttribute('id')] = component;
					// give component to the caller to be modified before rendering
					async(component); 
					// render synch
					parentElement.replaceChild(component, scriptElement);
				});
	}
}

function fireReadyEvent(target) {
	if(typeof target['__readyHandler__'] !== "undefined") {
		var handlers = target['__readyHandler__'];

		for(var i in handlers) {
			var handler = handlers[i];
			if(handler)
				handler();
		}
	}
	
	for(var i = 0; i<target.childNodes.length; i++)
		fireReadyEvent(target.childNodes[i]);
}

Component = function() {
	// TO BE USED
}

Component.appendFromPath = function(parentElement, path, id, async) {
	if(typeof async !== "function") {
		var component = wrapPathToElement(path, id);
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
						});
	}
}

Component.fromPath = function(path, id, async) {
	if(typeof async !== "function")
		return wrapPathToElement(path, id);
	else
		wrapPathToElement(path, id, async);
}

Component.listenReady = function(target, handler) {
	if(typeof target['__readyHandler__'] === "undefined")
		target['__readyHandler__'] = [];
		
	target['__readyHandler__'].push(handler);
}

Component.fireReadyEvent = fireReadyEvent;
    
var hasComponents = true;
while(hasComponents) {
	hasComponents = false;
	var x = document.body.getElementsByTagName("script");
	for(var i = 0; i<x.length; i++) {
		if(x[i].getAttribute('source')) {
			overrideFromPath(x[i].parentNode, x[i], x[i].getAttribute('source'));
			hasComponents = true;
			break;
		}
	}
}