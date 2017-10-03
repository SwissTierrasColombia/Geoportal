var comments = {
	vLayer: null,
	panel: null,
	
	/** *************
	 *  Init Comments
	 *  *************/
	init: function() {
		if(this.panel == null) {
			this.panel = $("#advance-comments-panel");
			//this.panel = $("#comments-notes");
			this.button = $("#gis_commentsBtn");
			this.inputText = $("#comments-input");
			$("#comments-text-submit").button();
		}
		
		this.requests.getComment();
		this.openPanel();
	},
	
	/** ****************************************
	 *  Enable/Disable comments
	 *  Init vector layer and open manager panel
	 *  *****************************************/
	toggle: function(button) {	
		if(!button.hasClass("btn-active")) {
			this.activate(button);
		}
		else {
			this.deactivate(button);
		}
	},
	
	activate: function(button) {
		button.addClass("btn-active");
		this.init();
		this.active = true;		
	},
	
	deactivate: function(button) {
		if(!button) {
			button = $('#gis_commentsBtn');
		}
		button.removeClass("btn-active");
		this.closePanel();
		this.active = false;
	},
	
	/** ***************************
	 *  Close comments panel
	 *  ***************************/
	closePanel: function() {	
		if(this.panel != null) {
			this.panel.hide();
		}
	},
	
	/** ***************************
	 *  Open comments manager panel
	 *  ***************************/
	openPanel: function() {
		if(this.panel != null) {
			this.panel.show();
		}
	},
	
	/** **************************
	 *  Save comments input text
	 *  **************************/
	saveData: function() {
		var dataInput = this.inputText.val();
		this.requests.saveComment(dataInput);
	},
	
	requests: {
		saveComment: function(data) {
			Utils.ajaxCall(Services.getCommentsUrl(), "POST", "json", {
				oper: "saveComment",
				commentText: data
			}, function(response){
				if(response.success) {
					comments.requests.getComment();

					AlertDialog.createOkDefaultDialog(
						LocaleManager.getKey("Advanced_Panel_Comments"), 
						LocaleManager.getKey("General_Save_Ok")
					);
				}
			});
		},
		
		getComment: function() {
			Utils.ajaxCall(Services.getCommentsUrl(), "POST", "json", {
				oper: "getComment"
			}, function(response){
				if(response.success && response.hasOwnProperty("result")) {
					comments.inputText.val(response.result.text);
				}
			});			
		}
	}
	
};