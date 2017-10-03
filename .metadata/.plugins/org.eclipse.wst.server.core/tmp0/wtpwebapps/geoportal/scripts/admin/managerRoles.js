var mRoles = {
	pRList: null,
	pForm: null,
	dtPanel: null,
	dt: null,
	pPermissionsAll: null,
	pPermissionsAssoc: null,
	dragdropOptions: null,
	formValidator: null,
	
	dialogHeight: 220,
	
	permissionDescriptionColumnName: null,
	
	// Init roles manager page
	init: function() {
		
		var currentLanguage = LocaleManager.getCurrentLocale();
		if ("es" === currentLanguage) {
			permissionDescriptionColumnName = "esDescription";
		}
		else {
			permissionDescriptionColumnName = "enDescription";
		}
		
		if(this.dtPanel == null) {
			this.dtPanel = $("#roles-dt");
			this.initDt();
			
			this.pPermissionsAll = $("#panel-permissions-all");
			this.pPermissionsAssoc = $("#panel-permissions-assoc");
		}
	},

	createAddFormPanel: function() {
		if(this.formValidator) {
			this.formValidator.reset();
		}
		
		$("#form-dialog-header").data("locale_key", "Manager_RolesPermission_HeaderForm_Add");
		LocaleManager.refreshLocalizedElement($("#form-dialog-header"));
		
		this.pForm = $("#form-dialog");
		
		this.formValidator = new Validate({
			form: this.pForm
		});

		var buttons = {};			
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Save')] = function(){
			var isValid = mRoles.formValidator.valid();
			if(!isValid) {
				return;
			}
			mRoles.requests.insertRole();
		};
		
		
		DialogUtils.renderDialog(LocaleManager.getKey("Manager_RolesPermissions_TitleForm_Add"), buttons, {
			modal: true,
			resizable: false,
			height: this.dialogHeight,
			width: 400,
			closeFn: function() {
				Utils.cleanForm(mRoles.pForm);
			}
		}, this.pForm);
		
		$("#role-submit, #role-cancel").button();
	},
	
	createUpdateFormPanel: function() {
		if(this.formValidator) {
			this.formValidator.reset();
		}
		
		$("#form-dialog-header").data("locale_key", "Manager_RolesPermission_HeaderForm_Update");
		LocaleManager.refreshLocalizedElement($("#form-dialog-header"));
		
		this.pForm = $("#form-dialog");
		
		this.formValidator = new Validate({
			form: this.pForm
		});

		var buttons = {};			
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Modify')] = function(){
			var isValid = mRoles.formValidator.valid();
			if(!isValid) {
				return;
			}
			mRoles.requests.updateRole();
		};
		
		DialogUtils.renderDialog(LocaleManager.getKey("Manager_RolesPermissions_TitleForm_Update"), buttons, {
			modal: true,
			resizable: false,
			height: this.dialogHeight,
			width: 400,
			closeFn: function() {
				Utils.cleanForm(mRoles.pForm);
			}
		}, this.pForm);
	},
	
	// Init list of roles (datatable)
	initDt: function() {
		if(this.dt == null) {
			this.dt = this.dtPanel
			.on('search.dt', function (e) { 
				Utils.deselectAllVisibleRows(mRoles.dt);
				mRoles.toggleButtonActivation();
			}).dataTable({
				"dom": '<"toolbar">frtp',
				"serverSide": true,
		        "scrollY": "200px",
		        "processing": true,
		        "scrollCollapse": true,
		        "paginationType": "full",
	        	"ajax": function (data, callback, settings) {	        		
	        	    Utils.ajaxCall("./roles?oper=roles", "get", "json", data, function(response){
	        	    	var data = response.result;
	        	    	callback(data);
	        	    });
	        	},
		        "columns": [
		            { "data": "idRole", "name": "idRole", "title": "ID", "sortable": false, "visible": false},
		            { "data": "roleName", "name": "roleName", "title": LocaleManager.getKey("Manager_RolesPermissions_Grid_Name"), "sortable": false, "visible": true },
		            { "data": "roleDescription", "name": "roleDescription", "title": LocaleManager.getKey("Manager_RolesPermissions_Grid_Description"), "sortable": false, "visible": true }
		        ]
	        	,
		        "language": {
	                "url": "scripts/locale/datatable/dt_" + LocaleManager.locale + ".lang"
	            },
	            "paginate": false
		    });
			
			this.dt.find("tbody").on('click', 'tr', function(e){
				if(mRoles.requests.isEdit) {
					mRoles.openSaveConfirm();
					return;
				}
				
				if($(this).hasClass('selected')) {
					$(this).removeClass('selected');
				}
				else {
					mRoles.dt.find("tbody tr").removeClass("selected");
					$(this).addClass('selected');					
				}
				
				mRoles.toggleButtonActivation();
				
				// Add events to row click
				mRoles.loadPermission();
			});
		}
	},
	
	// Enable proper button
	toggleButtonActivation: function() {
		var rol = Utils.getSelectedRow(this.dt)[0];
		
		if(Utils.isNullOrUndefined(rol)) {
			//No row selected
			$("#roles-delete").hide();
			$("#roles-update").hide();
			$("#roles-save-permissions").hide();
		}
		else {
			$("#roles-delete").show();
			$("#roles-update").show();
			$("#roles-save-permissions").show();
		}
	},
	
	// Open dialog form insert role
	openAddForm: function() {
		Utils.cleanForm(this.pForm);
		this.createAddFormPanel();
		this.pForm.dialog("open");
	},
	
	// Open dialog form update user
	openUpdateForm: function() {

		Utils.cleanForm(this.pForm);
		this.createUpdateFormPanel();
		
		var selectedRow = Utils.getSelectedRow(this.dt)[0];
		this.populateRoleForm(selectedRow);
		
		this.pForm.dialog("open");
	},
	
	confirmDelete: function() {
		AlertDialog.createConfirmDefaultDialog(
			LocaleManager.getKey("General_MsgConfirmTitle"), 
			LocaleManager.getKey("Manager_RolesPermission_MsgConfirmDelete"), 
			function() {
				mRoles.requests.deleteRole();
		});
	},
	
	closeForm: function() {
		if(this.pForm != null) 
			this.pForm.dialog("close");
	},
	
	populateRoleForm: function(selectedRow) {
		$("#role-input-id").val(selectedRow.idRole);
		$("#role-input-name").val(selectedRow.roleName);
		$("#role-input-desc").val(selectedRow.roleDescription);
	},
	
	loadPermission: function() {
		var row = Utils.getSelectedRow(mRoles.dt)[0];
		if(Utils.isNullOrUndefined(row) || row.length == 0) {
			this.pPermissionsAssoc.empty();
			this.pPermissionsAll.empty();
			return;
		}
		
		this.requests.getAllPermissions(row.idRole);
		this.requests.getAssocPermissions(row.idRole);
		
		return;
	},
	
	/**
	 *  Set option to enable drag and drop on panels
	 *  - direction1: parameters for enable drag and drop from panel A to panel B
	 *  - direction2: parameters for enable drag and drop from panel B to panel A (optional)
	 *  -- source: items to drag
	 *  -- dest: container accepting drop
	 *  -- acceptDrop: restricting drop to specific items
	 *  -- onDrop: function to create new item after drop ends
	 *
	 */
	setDragDropOptions: function() {
		this.dragdropOptions = {
			direction1: {
				source: $(".row-permission-all"),
				dest: this.pPermissionsAssoc,
				acceptDrop: ".row-permission-all",
				onDrop: function( event, ui ){
					var item = $("<div>").attr({"class": "row-permission-assoc"}).data("roleId", $(ui.draggable).data("roleId")).append(
						$("<div>").attr({"class": "row-permission-left"}).text($(ui.draggable).find(".row-permission-left").text()),
						$("<div>").attr({"class": "row-permission-right"}).text($(ui.draggable).find(".row-permission-right").text())
					);
					return item;
				},
				//Function di check
				onDropCheck: function(okCheckFn, koCheckFn, params) {
					//Chiamata, salvataggio
					//Utils.ajaxCall(service, method, type, params, fnOkCallBack, fnKoCallback);
					okCheckFn();
				},				
				okCheck: function(response) {
					return true;
				},
				koCheck: function() {
					return;
				}
			},
			direction2: {
				source: $(".row-permission-assoc"),
				dest: this.pPermissionsAll,
				acceptDrop: ".row-permission-assoc",
				onDrop: function( event, ui ){
					var item = $("<div>").attr({"class": "row-permission-all"}).data("roleId", $(ui.draggable).data("roleId")).append(
						$("<div>").attr({"class": "row-permission-left"}).text($(ui.draggable).find(".row-permission-left").text()),
						$("<div>").attr({"class": "row-permission-right"}).text($(ui.draggable).find(".row-permission-right").text())
					);
					return item;
				},
				//Function di check
				onDropCheck: function(okCheckFn, koCheckFn, params) {
					//Chiamata, salvataggio
					//Utils.ajaxCall(service, method, type, params, fnOkCallBack, fnKoCallback);
					okCheckFn();
				},				
				okCheck: function() {
					return true;
				},
				koCheck: function() {
					return;
				}
			}
		};
		
		return;
	},
	
	// View all permissions into panel
	viewAllPermissions: function(data) {
		this.pPermissionsAll.empty();
		
		$.each(data, function(index, item) {			
			mRoles.pPermissionsAll.append(mRoles.getDomPermissionAll(item));
		});
				
		//Permission All request is ok.
		this.requests.permissionAll = true;
		
		if(this.requests.permissionAssoc === true && this.requests.permissionAll === true) {
			this.setDragDropOptions();
			DragDrop.enable(this.dragdropOptions);
		}
	},
	
	// View associated permissions into panel
	viewAssocPermissions: function(data) {
		this.pPermissionsAssoc.empty();
		
		$.each(data, function(index, item) {	
			mRoles.pPermissionsAssoc.append(mRoles.getDomPermissionAssoc(item));
		});
		
		// If requests permission has been done, enable drag and drop on panels
		//var check = this.checkGetPermission("permissionassoc");
		//Permission Assoc request is ok.
		this.requests.permissionAssoc = true;
		
		if(this.requests.permissionAssoc === true && this.requests.permissionAll === true) {
			this.setDragDropOptions();
			DragDrop.enable(this.dragdropOptions);
		}
	},
	
	getDomPermissionAll: function(permission) {
		var row = $("<div>").attr({"class": "row-permission-all"});
		
		row.append(
			$("<div>").attr({"class": "row-permission-left"}).text(permission.codPermission),
			$("<div>").attr({"class": "row-permission-right"}).text(permission[permissionDescriptionColumnName])
		).data("roleId", permission.idPermission);
		
		return row;
	},
	
	/**
	 * Returns dom element row of permission associated
	 * @param permission
	 * @returns
	 */
	getDomPermissionAssoc: function(permission) {
		var row = $("<div>").attr({"class": "row-permission-assoc"});
		
		row.append(
			$("<div>").attr({"class": "row-permission-left"}).text(permission.codPermission),
			$("<div>").attr({"class": "row-permission-right"}).text(permission[permissionDescriptionColumnName])
		).data("roleId", permission.idPermission);
		
		return row;
	},
	
	// Get permissions set
	getNewPermissions: function() {
		var idsPermission = [];
		var permissionsElements = this.pPermissionsAssoc.find(".row-permission-assoc");
		$.each(permissionsElements, function(index, item){
			idsPermission.push($(item).data("roleId"));
		});
		
		return idsPermission;
	},
	
	// Open dialog confirm Save
	openSaveConfirm: function() {
		AlertDialog.createOkDialog({
			title: LocaleManager.getKey("General_MsgConfirmTitle"),
			message: LocaleManager.getKey("Manager_RolesPermission_MsgConfirmModify"),
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
				
				// Reload permissions (without saving edit)
				mRoles.loadPermission();
				
				// Remove edit mode status on roles
				mRoles.requests.isEdit = false;
				return;
			}		
		});
	},
	
	getRoleDataForm: function() {
		var role = new Object();
			role.name = $("#role-input-name").val();
			role.desc = $("#role-input-desc").val();
			role.id = $("#role-input-id").val();
			
		return role;
	},
	
	reloadRoles: function(callback, resetPaging) {
		this.dt.api().ajax.reload(callback, resetPaging);
	},
	
	requests: {
		//permissionsAll: false,
		permissionAssoc: false,
		isEdit: false,
		
		getAllPermissions: function(id) {
			Utils.ajaxCall("./roles", "POST", "json", {
				oper: "availablePermissions",
				roleId: id
			}, function(response) {
				var perm = response.result;
				var orderedPerm = Utils.orderByAttribute(perm, "codPermission", "asc");
				mRoles.viewAllPermissions(orderedPerm);
			});
		},
		
		getAssocPermissions: function(id) {
			Utils.ajaxCall("./roles", "POST", "json", {
				oper: "associatedPermissions",
				roleId: id
			}, function(response) {
				var perm = response.result;
				var orderedPerm = Utils.orderByAttribute(perm, "codPermission", "asc");
				mRoles.viewAssocPermissions(perm);
			});			
		},
		
		save: function() {
			var permissionIds = mRoles.getNewPermissions();
			var roleId = Utils.getSelectedRow(mRoles.dt)[0].idRole;
			
			Utils.ajaxCall("./roles", "POST", "json", {
				oper: "setPermissions",
				roleId: roleId,
				permissionIds: JSON.stringify(permissionIds)
			}, function(response) {
				// Remove edit mode status on roles
				mRoles.requests.isEdit = false;
				
				if(response.success) {
					AlertDialog.createOkDefaultDialog(
						LocaleManager.getKey("Manager_RolesPermission_Button_SavePerm"), 
						LocaleManager.getKey("Manager_RolesPermission_Permission_Save_OK")
					);
					mRoles.loadPermission();
					return;
				}				
			});			
		},
		
		insertRole: function() {
			var valid = mRoles.formValidator.valid();
			if(!valid) {
				return;
			}
			
			var role = mRoles.getRoleDataForm();
			if(role.name == "") {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Error_Title"), 
					LocaleManager.getKey("Manager_Roles_Insert_EmptyName")
				);
				
				return;
			}
			Utils.ajaxCall("./roles", "POST", "json", {
				oper: "addRole",
				roleName: role.name,
				roleDescription: role.desc
			}, function(response) {
				// Remove edit mode status on roles
				mRoles.requests.isEdit = false;
				
				if(response.success) {
					mRoles.reloadRoles(null, false);
					mRoles.closeForm();
				}
			});		
		},
		
		updateRole: function() {
			var valid = mRoles.formValidator.valid();
			if(!valid) {
				return;
			}
			
			var role = mRoles.getRoleDataForm();
			if(role.name == "") {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Error_Title"), 
					LocaleManager.getKey("Manager_Roles_Insert_EmptyName")
				);
				
				return;
			}

			Utils.ajaxCall("./roles", "POST", "json", {
				oper: "updateRole",
				roleId: role.id,
				roleName: role.name,
				roleDescription: role.desc
			}, function(response) {
				// Remove edit mode status on roles
				mRoles.requests.isEdit = false;
				
				if(response.success) {
					mRoles.reloadRoles(null, false);
					mRoles.closeForm();
				}
			});
		},
		
		deleteRole: function() {
			var row = Utils.getSelectedRow(mRoles.dt)[0];
			if(row.length == 0) {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Error_Title"), 
					LocaleManager.getKey("General_No_Dt_Record_Selected")
				);
				return;
			}
			
			var roleId = Utils.getSelectedRow(mRoles.dt)[0].idRole;
			
			Utils.ajaxCall("./roles", "POST", "json", {
				oper: "deleteRole",
				roleId: roleId
			}, function(response) {
				// Remove edit mode status on roles
				mRoles.requests.isEdit = false;
				
				if(response.success) {
					AlertDialog.createOkDefaultDialog(
						LocaleManager.getKey("Manager_RolesPermission_Role_Delete"), 
						LocaleManager.getKey("Manager_RolesPermission_Role_Delete_OK")
					);
					mRoles.reloadRoles(null, false);
					mRoles.loadPermission();
					mRoles.closeForm();
					
				}
			});			
		}
	}
};