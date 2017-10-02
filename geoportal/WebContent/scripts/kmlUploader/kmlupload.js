var kmlupload = {
	active : false,
	panel: null,
	fileInput: null,
	
	/** *************
	 *  Init kmlupload
	 *  *************/
	init: function() {
			this.panel = $("#advance-uploadkml-panel");
			this.button = $("#gis-uploadkml");
			this.fileTextField = $('#uploadkml-input-file-text');
			
			//$("#uploadkml-choose-file").button();
			$("#uploadkml-submit").button();
	},
	
	/** ****************************************
	 *  Enable/Disable kml upload tool
	 *  *****************************************/
	toggle: function() {
		if (this.panel == null) {
			this.init();
		}
		if (this.active === false) {
			this.activate();
		}
		else {
			this.deactivate();
		}
	},
	
	activate: function() {
		this.cleanForm();
		
		var button = this.button;
		button.addClass("btn-active");
		this.active = true;
		this.openPanel();
	},
	
	deactivate: function() {
		if (this.panel == null) {
			this.init();
		}
		
		var button = this.button;
		button.removeClass("btn-active");
		this.active = false;
		this.closePanel();
	},
	
	openPanel: function() {
		this.panel.show();
	},
	
	closePanel: function() {	
		// Close tools panel
		//if(this.panel != null) {
			this.panel.hide();
		//}
	},
	
	chooseFile: function() {
		this.fileInput = new KmlUploader().chooseFile(this.fileTextField);	
	},
	
	uploadKml: function() {
		var data = this.getKmlUploadDataForm();
		
		new KmlUploader().loadKMLInTOC(data,
			function() {
				//close dialog
			kmlupload.deactivate();
				
		}, function(){
				alert('fail');
		});
	},
	
	cleanForm: function() {
		$("#uploadkml-extractstyles").attr("checked", false);
		$("#uploadkml-extractattributes").attr("checked", false);
		$("#uploadkml-input-file-text").val("");
	},
	
	getKmlUploadDataForm: function() {
		var data = new Object();
		//data.fileInput = $("#uploadkml-input-file");
		data.fileInput = this.fileInput;
		data.groupName = "Kml";
		data.projection = $("#uploadkml-select-proj").val();
		data.extractStyles = $("#uploadkml-extractstyles").is(":checked");
		data.extractAttributes = $("#uploadkml-extractattributes").is(":checked");
		
		return data;
	}
};