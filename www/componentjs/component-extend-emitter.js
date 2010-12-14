(function() {
	// private space execution
	function override(f, g) { return function() { return g.apply(f,arguments); }; };
	
	Component.augment = override(Component.augment, function(element) {
		element.$eventHandlers = [];
		element.on = function(eventName, handler) {
			for(var i in this.$eventHandlers)
				if(this.$eventHandlers[i].name === eventName && this.$eventHandlers[i].handle === handler)
					return;
			
			this.$eventHandlers.push({name: eventName, handle: handler});
		};
		element.emit = function(eventName, eventData) {
			for(var i in this.$eventHandlers)
				if(this.$eventHandlers[i].name == eventName) {
					var returnValue = this.$eventHandlers[i].handle(eventData);
					if(typeof returnValue != "undefined")
						return returnValue;
				}
		};
		element.stopListen = function(eventName, handler) {
			for(var i in this.$eventHandlers)
				if(this.$eventHandlers[i].name == eventName)
					this.$eventHandlers[i].splice(i,1); // TODO this may cause issues
		};
		return this(element);
	});
})();