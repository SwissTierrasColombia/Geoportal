var gisOverview = {
	active : false,
	panel: null,
	
	showButton: function() {
		$("#gis_gisOverviewBtn").show();
	},
	
	init: function() {
		if(this.panel == null) {	
			this.panel = $("#gis-map-overview");
			this.button = $("#gis_gisOverviewBtn");
		}
	},
	
	onToggleEventFn: function() {
		adjustTocHeight();
	},
	
	isShown: function() {
		var shown = $("#gis_gisOverviewBtn").hasClass("btn-active");
		return shown;
	},
	
	/** ****************************************
	 *  Enable/Disable print tool
	 *  Init vector layer and open print panel
	 *  *****************************************/
	toggle: function(button) {	
		if(!button.hasClass("btn-active")) {
		//if(!this.isShown()) {
			this.activate(button);
		}
		else {
			this.deactivate(button);
		}
		
		this.onToggleEventFn();
	},
	
	activate: function(button) {
		button.addClass("btn-active");
		this.init();	
		this.openOverview();
	},
	
	deactivate: function(button) {
		if(!button)
			if(this.button == null)
				return;
			button = this.button;
		
		button.removeClass("btn-active");
		this.closeOverview();
	},
	
	openOverview: function() {
		
		//Force close of GIS note message...
		GisNoteMessage.forceClose();
		
		this.panel.show();
	},
	
	closeOverview: function() {
		this.panel.hide();
	}
};