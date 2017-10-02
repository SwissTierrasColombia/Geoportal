var KmlUploader = function() {
	
	/*
	 * This just retrieves the features from the KML.
	 */
	this.getFeaturesFromKML = function(data, okFn, failFn) {
		
		var fileInput = data.fileInput[0];
		
		//Just consider the first file...
		var file = fileInput.files[0];
        var reader = new FileReader();
 
        
        reader.onload = function() {
        	try {
        		
	        	strKML = reader.result;
	        	console.log(strKML);
	        	
	        	/*
	        	 * KML format
	             * 
	             * External projection: projection of the data contained in the KML file...
	             * Internal projection: projection of the map...
	             */ 
	            var kmlFormat = new OpenLayers.Format.KML({
	                'internalProjection': map.getProjectionObject(),
	                'externalProjection': new OpenLayers.Projection(data.projection),
	                extractStyles: data.extractStyles,
	                extractAttributes: data.extractAttributes
	            });
	            
	            var kmlFeatures = kmlFormat.read(strKML);
	            
	            if (kmlFeatures.length <=0) {
	            	alert('No features in file...');
	            	if (!Utils.isNullOrUndefined(failFn)) {
	        			failFn();
	        			return;
	        		}
	            }
	            
	            //OK, call the OKFn
	            okFn(kmlFeatures);
	            
        	}
        	catch(err) {
        		alert('Error parsing the KML file...');
        		if (!Utils.isNullOrUndefined(failFn)) {
        			failFn();
        			return;
        		}
        	}
        };
        
        reader.readAsText(file); 
		
	};
	
	/*
	 * Used by the kmlupload to load the KML in the TOC
	 */
	this.loadKMLInTOC = function(data, okFn, failFn) {
		
		var fileInput = data.fileInput[0];
		
		//Just consider the first file...
		var file = fileInput.files[0];
        var reader = new FileReader();
 
        //Data
        var title = file.name;
        var groupName = data.groupName;
        
        reader.onload = function() {
        	
        	var vLayer = null;
        	
        	try {
        		
	        	strKML = reader.result;
	        	console.log(strKML);
	        	
	        	/*
	        	 * KML format
	             * 
	             * External projection: projection of the data contained in the KML file...
	             * Internal projection: projection of the map...
	             */ 
	            var kmlFormat = new OpenLayers.Format.KML({
	                'internalProjection': map.getProjectionObject(),
	                'externalProjection': new OpenLayers.Projection(data.projection),
	                extractStyles: data.extractStyles,
	                extractAttributes: data.extractAttributes
	            });
	            
	            var kmlFeatures = kmlFormat.read(strKML);
	            
	            if (kmlFeatures.length <=0) {
	            	alert('No features in file...');
	            	if (!Utils.isNullOrUndefined(failFn)) {
	        			failFn();
	        			return;
	        		}
	            }
	            
	            var vLayer = new OpenLayers.Layer.Vector(title,{
	    			displayInLayerSwitcher : false,
	    			projection : new OpenLayers.Projection(map.getProjection())
	    		});
	            
	            vLayer.addFeatures(kmlFeatures);
        	}
        	catch(err) {
        		alert('Error parsing the KML file...');
        		if (!Utils.isNullOrUndefined(failFn)) {
        			failFn();
        			return;
        		}
        	}
            //Add to map...
        	map.addLayer(vLayer);
        	
        	var bounds = vLayer.getDataExtent();
        	//Add KML to catalog & menu...
        	var conf = {
        			"source" : "kml",
        			"title" : title,
        			"enabled" : true,
        			"bounds" : bounds,
        			"group" : groupName
        	};
        	
        	var layerConfig_i = new LayerConfig(conf);

        	// Adds the layer to the LayerConfigCatalog
        	catalog.addLayerToConfig(layerConfig_i);

//        	//Create a group
//        	tree.createNewGroupInMenu(groupName, groupName);
//            
//        	//Add layer to menu
//        	var layerLI = LayerMenu.addToMenu(layerConfig_i, vLayer, true, true, false);
//        	
//        	//This opens the menu and selects the layer.
        	
        	//LayerMenu.addToSelectedLayerMenu(layerConfig_i.getId(), vLayer, true, true, false);
        	LayerMenu.addToSelectedLayerMenu({
        		id: layerConfig_i.getId(),
        		layerOL: vLayer,
        		enabled : true,
        		hasDelete: true,
        		hasLegend: false
        	});
        	
        	zoomToExtent(bounds, true);
        	map.zoomOut();
            
            //Ok, all done..
            if (!Utils.isNullOrUndefined(okFn)) {
            	okFn();
            }
            
        };
        
        reader.readAsText(file); 
	};
	
	
	this.chooseFile = function(fileTextField, optionalInputID) {
		
		/*
		 * If the ID of the generated INPUT (Choose file dialog) is passed, than it is
		 * used. Otherwise a default is generated
		 */
		var idForInput = "uploadkml-input-file";
		if (!Utils.isNullOrUndefined(optionalInputID)) {
			idForInput = optionalInputID;
		}
		
		/*
		* Trigger a file open dialog.
		*/
		
		if ( $("#" + idForInput).length >0 ) {
			$("#" + idForInput).remove();
		}
		
		var input = $("<input>").attr("id", idForInput) .attr("type", "file").change(function() {
			var fileInput = $(this)[0];

			//Just consider the first file...
			var file = fileInput.files[0];
			 
			//if (file.name.match(/\.(txt|json|xml|kml)$/)) {
		    if (file.name.match(/\.(kml)$/)) {
		    	//Input field...
		    	//$("#uploadkml-input-file-text").val(file.name);
		    	fileTextField.val(file.name);
		    }
		    else {
		        alert("File not supported, kml files only");
		    }
		});
		
		$("body").append(input);
		input.click();
		
		/*
		 * Return the newly generated input (type="file")
		 */
		return input;
	};
};

