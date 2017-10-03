var addWmsDialog = null;
var AddWMSDialog = function() {
	 
	var self = this;
	
	this.wmsDialogOpen = false;
	this.wmsDialog = null;
	
	this.wmsListLoaded = false;
	this.wmsList = null;
	this.lp = null; //Loading panel
	this.grid = null;
	this.outerGridContainer = null;
	
	/** ****************************************
	 *  Enable/Disable print tool
	 *  Init vector layer and open print panel
	 *  *****************************************/
	this.toggle = function(button) {	
		if(!button.hasClass("btn-active")) {
			this.showWMSDialog();
		}
		else {
			this.deactivate(button);
		}
	};
	
	this.fetchWmsList = function(callbackFn) {
		$.ajax({
			//url : "config/wms_list.json",
			url : "./systemConfig",
			type : "GET",
			dataType : "json",
			cache : false,
			data: {
				oper: "exportExternalWmsServersAsJson"
			}
		}).done(function(jsonObject) {

			self.wmsList = jsonObject.wms_list;
			self.wmsListLoaded = true;
			
			if (!Utils.isNullOrUndefined(callbackFn)) {
				callbackFn(jsonObject.wms_list);
			}
		}).fail(function() {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				LocaleManager.getKey("AlertDialog_Error_Msg_GetCapabilities_fail")
			);
		});
	};
	
	this._addToWmsList = function(url) {
		var newWms = {
			url: url,
			name: url
		};
		this.wmsList.push(newWms);
	};
	
	this.populateWmsListAndLoadCapabilities = function(wmsList) {
		/*
		 * Once the list of available WMS servers is fetched, each item is added
		 * to the WMS Select Box
		 */

		$.each(wmsList, function(k, v) {
			var url = v.url;
			var name = v.name;
			self._appendToWMSSelectBox(url, name);
		});

		// Get the selected wms from the select-box and load its layers...
		var selOpt = $("#wmsList").find(":selected");

		var text = selOpt.text();
		var name = selOpt.attr("name");
		
		var ttt = this.outerGridContainer.find(".flexigrid");
		self.lp = new LoadingPanel(ttt, LocaleManager.getKey("Loading"), false);
		self.lp.addLoading();
		
		self.loadCapabilitiesIntoGrid(name, this.grid, function() {
			//Removing loading panel
			self.lp.removeLoading();
		});
	};
	
	
	/**
	 * Utility function to add a new WMS (Url, Name) to the dropdown list
	 * 
	 * @param url
	 *            Url of the WMS
	 * @param name
	 *            Logical name of the WMS
	 */
	this._appendToWMSSelectBox = function(url, name) {
		var selectBox = $("#wmsList");

		var option = $("<option>", {
			name : url
		}).html(name);
		selectBox.append(option);	
	};
	
	this._refreshCapabilitiesForSelectedWMS = function(capabilities) {
		var selectedOption = $("#wmsList").find(":selected");
		selectedOption.data({
			"capabilities" : capabilities
		});
	};
	
	/**
	 * Utility function to get the selected WMS (Url, Name)
	 * 
	 * Returns this object: { url = ".....", name = "....." }
	 * 
	 * @returns Returns a JSON with these parameters: {url: "...", name: "..."}
	 */
	this._getSelectedWMSFromDropdownList = function() {

		var selOpt = $("#wmsList").find(":selected");
		var text = selOpt.text();
		var name = selOpt.attr("name");

		var res = {
			url : name,
			name : text,
			capabilities : selOpt.data("capabilities")
		};

		return res;

	};
	
	/**
	 * Utility function to retrieve the selected row of a grid.
	 * 
	 * @param obj
	 *            The GRID
	 * @returns the selected ROW
	 */
	this._getSelectedRowFromGRID = function(obj) {
		var row = null;
		$(".trSelected", obj).each(function(k, v) {
			row = v;
			return;
		});
		return row;
	};
	
	
	this.wmsDialogCloseCallbackFn = function() {
		self.wmsDialogOpen = false;
		self.wmsDialog = null;
		$("#gis_WMSDialog").removeClass("btn-active");
	};
	
	//Close WMS Dialog
	this.deactivate = function() {
		this.wmsDialog.dialog("close");
	};
	
	/**
	 * Shows the WMS Dialog.
	 */
	this.showWMSDialog = function() {
		
		if (this.wmsDialogOpen === true) {
			alert('already open');
			return;
		}
		
		$("#gis_WMSDialog").addClass("btn-active");
		/*
		 * Build the grid
		 */
		this.outerGridContainer = $("<div>", {
				id : "wms_grid_container"
		});
		
		this.grid = $("<div>");
		var grid = this.grid;
		
		this.outerGridContainer.append(this.grid);
		
		/*
		 * Build the WMS select Box
		 */
		var selectBox = $("<select id='wmsList'>").change(function() {
			/*
			 * When an item in the select box is selected, a GET CAPABILITIES
			 * request is triggered and the corresponding layers are loaded in the
			 * WMS grid.
			 */

			// Show loading panel
			var ttt = self.outerGridContainer.find(".flexigrid");
			self.lp = new LoadingPanel(ttt, LocaleManager.getKey("Loading"), false);
			self.lp.addLoading();

			var selOpt = $(this).find(":selected");
			var text = selOpt.text();
			var name = selOpt.attr("name");
			self.loadCapabilitiesIntoGrid(name, grid, function() {
				//Error.
				//Removing loading panel
				self.lp.removeLoading();
			});
		});

		/*
		 * Build the ADD NEW WMS Server Button
		 */
		var addWMSButton = $("<button>", {
			id : "wms_addWMS"
		}).text(LocaleManager.getKey("WMS_Add_New")).button().click(function() {

			/*
			 * When the button is clicked, a new Dialog is shown.
			 */
			var newDialog = null;

			/*
			 * This function is called when the URL is inserted and validated
			 * against the Javascript validator. A GETCAPABILITIES is triggered.
			 * 
			 * If successful, the server is added to the WMS Server Dropdown list If
			 * it fails, an error is displayed.
			 */
			var validUrlInsertedCallbackFn = function(url) {
				
				var loadingPanel = new LoadingPanel(newDialog, LocaleManager.getKey("Loading"), false);
				loadingPanel.addLoading();
				/*
				 * Test whether the URL is valid and corresponds to a WMS Server...
				 */
				doGetCapabilities_JQ(url, function(capabilities) {

					/*
					 * Adding the WMS to the list of WMS...
					 */
					self._appendToWMSSelectBox(url, url);
					self._refreshCapabilitiesForSelectedWMS(capabilities);
					self._addToWmsList(url);

					/*
					 * Close dialog
					 */
					newDialog.dialog("close");
					loadingPanel.removeLoading();

				}, function(jqXHR, textStatus, error) {
					/*
					 * Error: the GETCapabilities call has FAILED.
					 */
					if (error === "timeout") {
						AlertDialog.createOkDefaultDialog(
							LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Title"), 
							LocaleManager.getKey("Server_Timeout_Error")
						);
					} else {
						AlertDialog.createOkDefaultDialog(
							LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Title"), 
							LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Text")
						);
					}
					loadingPanel.removeLoading();
				});
			};
			
			/*
			 * Create the new WMS Server dialog passing the callbacks and open the
			 * dialog
			 */
			newDialog = displayAddWMSDialog(validUrlInsertedCallbackFn);
			newDialog.dialog("open");
		});

		/*
		 * Building the WMS Dialog
		 */
		var WMSDialogContent = $("<div>").append(
					$("<div>").attr("style", "padding:5px;").append(
							LocaleManager.getKey("WMSDialog_SelectWMS_Label"), selectBox, addWMSButton)
					, this.outerGridContainer);

		var dialogButtons = {};

		dialogButtons[LocaleManager.getKey("WMSDialog_Button_AddLayer")] = function() {
			self.addLayerClicked(grid);
		};

		dialogButtons[LocaleManager.getKey("WMSDialog_Button_Done")] = function() {
			dialogDiv.dialog("close");
		};

		var dialogDiv = DialogUtils.createDialog(LocaleManager.getKey("WMSDialog_Title"),
			dialogButtons, {
				width : 700,
				height : 350,
				resizable : false,
				modal: true,
				closeFn: function() {
					self.wmsDialogCloseCallbackFn();
				}
			}, WMSDialogContent);

		// Building the Grid
		grid.flexigrid({
			colModel : [ {
				display : LocaleManager.getKey("WMSDialog_Grid_Title"),
				name : 'title',
				width : 430,
				sortable : true,
				align : 'left'
			}, {
				// display : 'Value',
				display : LocaleManager.getKey("WMSDialog_Grid_Id"),
				name : 'id',
				width : 200,
				sortable : true,
				align : 'left'
			} ],
			dataType : 'json',
			singleSelect : true,
			height : 178,
			//width: 650,
			id : "pippo"
		});

		/*
		 * Add click function to grid. When a row is selected, the corresponding
		 * layer is registered in the Catalog and added to the map.
		 */
		grid.dblclick(function(event) {
			self.addLayerClicked($(this));
		});

		/*
		 * WMSDialog is shown
		 */
		dialogDiv.dialog("open");
		this.wmsDialogOpen = true;

		/*
		 * Populate WMS list
		 */
		
		if (this.wmsListLoaded) {
			this.populateWmsListAndLoadCapabilities(this.wmsList);
		} else {
			this.fetchWmsList(function(wms_list){
				self.populateWmsListAndLoadCapabilities(wms_list);
			});
		}
		
		self.wmsDialog =dialogDiv;
	};
	
	
	this.addLayerClicked = function(grid) {

		// Get selected row
		var row = this._getSelectedRowFromGRID(grid);
		if (Utils.isNullOrUndefined(row)) {
			return;
		}

		// Get layer Title and Name
		var layerTitle = $('td[abbr="title"] >div', row).html();
		var layerName = $('td[abbr="id"] >div', row).html();

		// Get selected WMS Server from the dropdown
		var selectedWMSServer = this._getSelectedWMSFromDropdownList();
		
		/*
		 * If the layer is already in the catalog, just open it.
		 * Otherwise load it from the WMS
		 */
		var serverURL = selectedWMSServer.url;
		var layerLI = LayerMenu.getLayerLIFromMenu(serverURL, layerName);
		
		if(!Utils.isNullOrUndefined(layerLI)){
			LayerMenu.selectAndOpenLayerInMenu(layerLI);
		}
		else 
		{
			var capabilities = selectedWMSServer.capabilities;

			// Add to the WebGIS...
			LoadLayersUtils.addLayerWMSToCatalogAndWebGIS(selectedWMSServer.url, layerName, layerTitle, capabilities);
		}
	};
	
	
	/**
	 * Performs a GET CAPABILITIES to the specified URL and loads the results in the
	 * GRID
	 * 
	 * @param url
	 *            The url of the server (eg: http://localhost:8080/geoserver/wms
	 * @param grid
	 *            The Grid object
	 */
	this.loadCapabilitiesIntoGrid = function(url, grid, successOrFailFn) {

		doGetCapabilities_JQ(url, function(capabilities) {

			// Refresh the capabilities for the selected WMS
			self._refreshCapabilitiesForSelectedWMS(capabilities);

			var tableRows = new Array();

			/*
			 * Check capabilities error...
			 */
			if (!Utils.isNullOrUndefined(capabilities.capability)) {
				//Ok
				var layers = capabilities.capability.layers;

				$.each(layers, function(key, value) {
					var title = value.title;
					var name = value.name;
					var prop_i = {
						cell : [ title, name ]
					};

					tableRows.push(prop_i);
				});

				var data = {
					total : tableRows.length,
					page : 1,
					rows : tableRows
				};

				grid.flexAddData(data);
			}
			else {
				//Error...
				alert('error');
			}
			
			grid.flexReload();

			//Capabilities added to grid. Removing loading panel
			if (!Utils.isNullOrUndefined(successOrFailFn)) {
				successOrFailFn();	
			}
			
		}, function(jqXHR, textStatus, error) {
			/*
			 * Error getting the capabilities or server timeout...
			 * Showing an alert...
			 */
			//If error = "timeout" -
			if (error === "timeout") {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Title"), 
					LocaleManager.getKey("Server_Timeout_Error")
				);
			} else {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Title"), 
					LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Text")
				);	
			}
			
			if (!Utils.isNullOrUndefined(successOrFailFn)) {
				successOrFailFn();	
			}
		});

	};
};

addWmsDialog = new AddWMSDialog();