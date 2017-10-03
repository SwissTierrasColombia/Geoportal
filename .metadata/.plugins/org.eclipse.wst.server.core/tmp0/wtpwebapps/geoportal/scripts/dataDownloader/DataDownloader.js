var DataDownloader = function() {
	
	this.downloadZip = function (url, featureName) {
		
//		var params = {
//				SERVICE : "WFS",
//				VERSION : "1.0.0", // 2.0.0
//				REQUEST : "GetFeature",
//				typeName : 'mosef:red_vial_2000',
//				outputFormat : 'SHAPE-ZIP'
//
//			};
		
		var corr = this.insertParam(url, "service", "WFS");
		corr = this.insertParam(corr, "VERSION", "1.0.0");
		corr = this.insertParam(corr, "REQUEST", "GetFeature");
		corr = this.insertParam(corr, "typeName", featureName);
		corr = this.insertParam(corr, "outputFormat" ,'SHAPE-ZIP');
		window.location.assign(corr);
	};
	
	this.insertParam = function(uri, key, value) {
		  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
		  if (uri.match(re)) {
		    return uri.replace(re, '$1' + key + "=" + value + '$2');
		  }
		  else {
		    return uri + separator + key + "=" + value;
		  }
	};
	
	this.downloadText = function(options) {
		var fileName = "file.txt";
		
		if (!Utils.isNullOrUndefined(options.fileName)) {
			fileName = options.fileName;
		}

		//Create a form and submit it!
		var form = $("<form>").attr({
			"action": "./download",
			"method": "post"
			//"target": "_blank"
		}).append(this.createInput("hidden", "oper", "downloadTextAsFile"))
		.append(this.createInput("hidden", "content", options.content))
		.append(this.createInput("hidden", "fileName", fileName));
		
		form.submit();
	};
	
	this.createInput = function(type, name, value) {
		var inputElem = $("<input>").attr({
			"type": type,
			"name": name,
			"value" : value
		});
		return inputElem;
	};
	
};

