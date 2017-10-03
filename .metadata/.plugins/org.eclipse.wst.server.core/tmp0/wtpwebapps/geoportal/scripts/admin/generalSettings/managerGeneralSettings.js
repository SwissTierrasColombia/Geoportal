var mGeneralSettings = {
	
	getDataFromPage: function() {
		var settings = new Object();
		
		settings.initialMessage = $("#initial-message-txt").val();
		settings.showInitialMessage = $("#initial-message-chk").is(":checked");
		settings.informationMessage = $("#information-message-txt").val();
		settings.showInformationMessage = $("#information-message-chk").is(":checked");
		return settings;
	},
	
	populatePage: function(data) {
		$("#initial-message-txt").val(data.initialMessage);
		$("#initial-message-chk").prop('checked', data.showInitialMessage);
		$("#information-message-txt").val(data.informationMessage);
		$("#information-message-chk").prop('checked', data.showInformationMessage);
	},
	
	requests: {		
		
		getData: function() {
			
			//Reset validator
			if(validator) {
				validator.reset();
			}
			
			Utils.ajaxCallSynch("./systemConfig", "POST", "json", {
				oper: "generalConfigs"
			}, function(response) {				
				if(response.success) {
					mGeneralSettings.populatePage(response.result);
				}
			});
		},
		
		saveData: function() {
			var isValid = validator.valid();
			if(!isValid) {
				return;
			}
			
			var settings = mGeneralSettings.getDataFromPage();
			Utils.ajaxCallSynch("./systemConfig", "POST", "json", {
				oper: "saveGeneralConfigs",
				settings: JSON.stringify(settings) 
			}, function(response) {				
				if(response.success) {
					AlertDialog.createOkDefaultDialog(LocaleManager.getKey("Manager_Item_ConfigSystem"), LocaleManager.getKey("Manager_Config_Saved_Ok"), "info", function() {
						//Reload
						mGeneralSettings.requests.getData();
					});
				}
			});
		}
		
	}
};