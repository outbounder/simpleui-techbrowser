require = _require = function(path,rootDir) {
	if(!rootDir || typeof rootDir == "undefined")
		rootDir = "";
	
	var requireFunc = function(path,rootDir) {
		if(path.lastIndexOf("/") != -1)
			rootDir = path.substr(0,path.lastIndexOf("/")+1);
		
		if(typeof this.cache == "undefined")
			this.cache = {};
		
		var compile = function(code) {
			var exportsCode = "var exports = {};\n";
			var rootDirCode = "var rootDir = '"+rootDir+"';\n";
			var requireCode = "var require = function(path){ return _require(path, rootDir); };\n";
			var returnCode = "\nreturn exports;";
			var funcCode = exportsCode+rootDirCode+requireCode+code+returnCode;
			var moduleFunc = new Function(funcCode);
			return moduleFunc.call(this);
		};
		
		if(this.cache[path]) {
			return compile(this.cache[path]);
		} else {
			var req = new XMLHttpRequest();
			req.open("GET", path, false);
			req.send(null); // null because of FF3.0
			if (req.status == 200 || req.status == 304 || req.status == 0 ) {
				this.cache[path] = req.responseText;
				return compile(this.cache[path]);
			} else if(req.status == 404)
				throw new Error("module not found "+path,path);
			else
				throw new Error(req.status+" "+req.responseText);
		}
	};
	
	return requireFunc(rootDir+path,rootDir);
};