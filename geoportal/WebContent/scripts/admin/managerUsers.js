var mUsers = {
	pForm: null,
	formValidator: null,
	dtPanel: null,
	dt: null,
	
	// Init users manager page
	init: function() {	
		if(this.dtPanel == null) {
			this.dtPanel = $("#users-dt");
			this.initDt();
		}
		
		// Load roles into dialog
		this.requests.getRoles();
		
		$("#user-submit, #user-cancel").button();
	},
	
	// Init list of roles (datatable)
	initDt: function() {
		if(this.dt == null) {
			this.dt = this.dtPanel
			.on('search.dt', function (e) { 
				Utils.deselectAllVisibleRows(mUsers.dt);
				mUsers.toggleButtonActivation();
			}).dataTable({
				"dom": '<"toolbar">frtp',
				"serverSide": false,
		        "scrollY": "500px",
		        "scrollX": true,
		        "processing": true,
		        "scrollCollapse": true,
		        "paginationType": "full",
	        	"ajax": function (data, callback, settings) {	        		
	        	    Utils.ajaxCall("./users?oper=users", "get", "json", data, function(response){
	        	    	var data = response.result;
	        	    	callback(data);
	        	    });
	        	},
		        "columns": [
		            { "data": "idUser", "name": "idUser", "title": "ID", "sortable": false, "visible": false},
		            { "data": "username", "name": "username", "title": LocaleManager.getKey("Manager_Users_Grid_Name"), "sortable": true, "visible": true },
		            { "data": "password", "name": "password", "title": "Password", "sortable": false, "visible": false },
		            { "data": "role.idRole", "name": "idRole", "title": "idRole", "sortable": false, "visible": false },
		            { "data": "role.roleName", "name": "roleName", "title": LocaleManager.getKey("Manager_Users_Grid_Role"), "sortable": true, "visible": true },
		            { "data": "role.roleDescription", "name": "roleDescription", "title": LocaleManager.getKey("Manager_Users_Grid_RoleDesc"), "sortable": true, "visible": true },
		            { "data": "disabled", "name": "disabled", "title": LocaleManager.getKey("Manager_Users_Grid_EnabledDisabled"), "sortable": true, "visible": true, 
		            	"render": function ( data, type, row ) {
		            		//return mUsers.getActivationIcon(data);
		            		return AdminUtils.getGridIconForBoolean(!data);
		            	}
		            }	                   
		        ]
	        	,
		        "language": {
	                "url": "scripts/locale/datatable/dt_" + LocaleManager.locale + ".lang"
	            },
	            "paginate": false
		    });
			
			this.dt.find("tbody").on('click', 'tr', function(e){				
				if($(this).hasClass('selected')) {
					$(this).removeClass('selected');
				}
				else {
					mUsers.dt.find("tbody tr").removeClass("selected");
					$(this).addClass('selected');					
				}
				
				mUsers.toggleButtonActivation();
			});
		}
	},
	
	// Enable proper button to enable/disable user
	toggleButtonActivation: function() {
		var user = Utils.getSelectedRow(this.dt)[0];
		
		if(Utils.isNullOrUndefined(user)) {
			
			//No row selected
			$("#users-delete").hide();
			$("#users-update").hide();
			$("#users-enable").hide();
			$("#users-disable").hide();
		}
		else {
			$("#users-delete").show();
			$("#users-update").show();
			
			var isDisabled = user.disabled;
			
			$("#users-enable, #users-disable").hide();
			
			if(isDisabled) {
				// Disabled. Use can be enabled
				$("#users-enable").show();
			}
			else {
				$("#users-disable").show();
			}	
		}
	},
	
	// Open dialog form insert user
	openAddForm: function() {
		Utils.cleanForm(this.pForm);
		this.createAddFormPanel();
		this.pForm.dialog("open");
		
	},
	
//	closeAddForm: function() {
//		if(this.pForm != null) 
//			this.pForm.dialog("close");
//	},
	
	// Open dialog confirm Save
	openSaveConfirm: function() {
		var valid = this.formValidator.valid();
		if(!valid) {
			return;
		}
		
		AlertDialog.createOkDialog({
			title: "Warning",
			message: "Do you want to save modifications?",
			okButton: true,
			okFn: function() {
				mRoles.requests.save();
				$(this).dialog('destroy').remove();
				
				// Remove edit mode status on roles
				mRoles.requests.isEdit = false;
			},
			cancelButton: true,
			cancelFn: function() {
				$(this).dialog('destroy').remove();
				
				// Remove edit mode status on roles
				mRoles.requests.isEdit = false;
				return;
			}		
		});
	},
	
	// Open dialog form update user
	openUpdateForm: function() {

		Utils.cleanForm(this.pForm);
		this.createUpdateFormPanel();
		
		var selectedRow = Utils.getSelectedRow(this.dt)[0];
		this.populateUserForm(selectedRow);
		
		this.pForm.dialog("open");
	},
	
//	closeUpdateForm: function() {
//		if(this.pForm != null) 
//			this.pForm.dialog("close");
//	},
	
	createAddFormPanel: function() {
		if(this.validForm) {
			this.validForm.reset();
		}
		
		this.pForm = $("#form-dialog");
		
		this.formValidator = new Validate({
			form: this.pForm
		});
		
		$("#form-dialog-header").data("locale_key", "Manager_Users_HeaderForm_Add");
		LocaleManager.refreshLocalizedElement($("#form-dialog-header"));
		
		//Username param is modifiable
		$("#user-input-name").attr("readonly", false);
		
		var buttons = {};			
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Save')] = function(){
			var isValid = mUsers.formValidator.valid();
			if(!isValid) {
				return;
			}
			mUsers.requests.insertUser();
		};
		
		DialogUtils.renderDialog(LocaleManager.getKey("Manager_Users_HeaderForm_Add"), buttons, {
			modal: true,
			resizable: false,
			height: 280,
			width: 400,
			closeFn: function() {
				Utils.cleanForm(this.pForm);
			}
		}, this.pForm);
		
	},
	
	createUpdateFormPanel: function() {
		if(this.validForm) {
			this.validForm.reset();
		}
		
		this.pForm = $("#form-dialog");
		
		this.formValidator = new Validate({
			form: this.pForm
		});
		
		//Reset validator
		if(this.formValidator) {
			this.formValidator.reset();
		}
		
		$("#form-dialog-header").data("locale_key", "Manager_Users_HeaderForm_Update");
		LocaleManager.refreshLocalizedElement($("#form-dialog-header"));
		
		//Username param is not modifiable
		$("#user-input-name").attr("readonly", true);
		
		var buttons = {};			
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Save')] = function(){
			var isValid = mUsers.formValidator.valid();
			if(!isValid) {
				return;
			}
			mUsers.requests.updateUser();
		};
		
		DialogUtils.renderDialog(LocaleManager.getKey("Manager_Users_HeaderForm_Update"), buttons, {
			modal: true,
			resizable: false,
			height: 280,
			width: 400,
			closeFn: function() {
				Utils.cleanForm(this.pForm);
			}
		}, this.pForm);
		
	},
	
	getUserDataForm: function() {
		var user = new Object();
			user.name = $("#user-input-name").val();
			user.pass = $("#user-input-pass").val();
			user.confirmpass = $("#user-input-confirmpass").val();
			user.role = $("#user-select-role option:selected").val();
			user.userId = $("#user-input-id").val();
			
		return user;
	},
	
	populateUserForm: function(selectedRow) {
		$("#user-input-id").val(selectedRow.idUser);
		$("#user-input-name").val(selectedRow.username);
		//$("#user-input-pass").val(selectedRow.password);
		//$("#user-input-confirmpass").val(selectedRow.password);
		
		//Select the correct combobox value
		Utils.ComboSetSelectedValue($("#user-select-role"), selectedRow.role, "idRole");
	},
	
	reloadUsers: function(callback, resetPaging) {
		this.dt.api().ajax.reload(callback, resetPaging);
	},
	
	checkFormsUser: function(user) {
		// Check not empty fields
		if(user.name == "" || user.pass == "" || user.confirmpass == "") {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				LocaleManager.getKey("Manager_User_Insert_EmptyFields")
			);
			
			return false;
		}
		
		if(user.pass !== user.confirmpass) {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				LocaleManager.getKey("Manager_User_Insert_PasswordNotMatching")
			);
			
			return false;
		}
		
		return true;
	},

	
	requests: {		
		getRoles: function() {
			Utils.ajaxCall("./roles", "POST", "json", {
				oper: "roles"
			}, function(response) {
				Utils.populateCombo($("#user-select-role"), response.result.data, "idRole", "roleName");
			});
		},
		
		updateUser: function() {
			var user = mUsers.getUserDataForm();
			var checkValues = mUsers.checkFormsUser(user);

			if(checkValues) {
				Utils.ajaxCall("./users", "POST", "json", {
					oper: "updateUser",
					userId: user.userId,
					password: md5(user.pass),
					roleId: user.role
				}, function(response) {				
					if(response.success) {
						mUsers.pForm.dialog("close");
						AlertDialog.createOkDefaultDialog(LocaleManager.getKey("Manager_Users_Form_Result_Title"), LocaleManager.getKey("Manager_Users_Upd_Ok"), "info", function() {
							mUsers.reloadUsers(null, false);
						});
					}
				});
			}
		},
		
		insertUser: function() {
			var user = mUsers.getUserDataForm();
			var checkValues = mUsers.checkFormsUser(user);

			if(checkValues) {
				Utils.ajaxCall("./users", "POST", "json", {
					oper: "addUser",
					username: user.name,
					password: md5(user.pass),
					roleId: user.role
				}, function(response) {				
					if(response.success) {
						mUsers.pForm.dialog("close");
						AlertDialog.createOkDefaultDialog(LocaleManager.getKey("Manager_Users_Form_Result_Title"), LocaleManager.getKey("Manager_Users_Add_Ok"), "info", function() {
							mUsers.reloadUsers(null, false);							
						});
					}
				});
			}
		},
		
		deleteUser: function() {
			var row = Utils.getSelectedRow(mUsers.dt)[0];
			if(row.length == 0) {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Error_Title"), 
					LocaleManager.getKey("General_No_Dt_Record_Selected")
				);
				
				return;
			}
			
			var userId = Utils.getSelectedRow(mUsers.dt)[0].idUser;
			
			AlertDialog.createConfirmDefaultDialog(
				LocaleManager.getKey("General_MsgConfirmTitle"),
				LocaleManager.getKey("Manager_Users_MsgConfirmDelete"),
				function(){
					Utils.ajaxCall("./users", "POST", "json", {
						oper: "deleteUser",
						userId: userId
					}, function(response) {			
						if(response.success) {
							//mUsers.pForm.dialog("close");
							AlertDialog.createOkDefaultDialog(LocaleManager.getKey("Manager_Users_Form_Result_Title"), LocaleManager.getKey("Manager_Users_Del_Ok"), "info", function() {
								mUsers.reloadUsers(null, false);
							});
						}
					});	
			});
		},
		
		changeStatusUser: function(action) {
			var row = Utils.getSelectedRow(mUsers.dt)[0];
			if(row.length == 0) {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Error_Title"), 
					LocaleManager.getKey("General_No_Dt_Record_Selected")
				);
				
				return;
			}
			
			var userId = Utils.getSelectedRow(mUsers.dt)[0].idUser;
			
			Utils.ajaxCall("./users", "POST", "json", {
				oper: action,
				userId: userId
			}, function(response) {
				//mUsers.pForm.dialog("close");
				AlertDialog.createOkDefaultDialog(LocaleManager.getKey("Manager_Users_Form_Result_Title"), LocaleManager.getKey("General_Save_Ok"), "info", function() {
					mUsers.reloadUsers(null, false);
				});
			});			
		}
	}
};