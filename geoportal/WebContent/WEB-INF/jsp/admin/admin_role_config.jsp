<%-- <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> --%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ page import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService,it.gesp.geoportal.constants.Permissions,it.gesp.geoportal.dao.entities.User" %>

<!DOCTYPE html>
<html>
<head>
<title>Configuracion de Roles</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%@ include file="admin_config_common_js.jspf" %>

<!-- Manager Roles scripts and CSS -->
<link rel="stylesheet" href="css/admin/managerRoles.css" type="text/css">
<script type="text/javascript" src="scripts/admin/managerRoles.js"></script>

<!-- Start script -->
<script>
	$(document).ready(function(){
		LocaleManager.refreshLocale();
		AdminMenu.setRoleConfigPageActive();
		mRoles.init();
	});
</script>

<style>

#form-dialog input, #form-dialog textarea {
	width: 243px;
}

#form-dialog .form-label-title {
	padding-top: 7px;
}

#roles-dt_wrapper {
  position: absolute;
  top: 50px;
  bottom: 0px;
  left: 0;
  right: 0px;
}

#roles-dt_wrapper .dataTables_scroll {
  position: absolute;
  top: 30px;
  bottom: 0px;
  left: 0;
  right: 0px;
}
#roles-dt_wrapper .dataTables_scrollBody {
  overflow: auto;
  position: absolute;
  top: 25px;
  bottom: 0;
  height: auto !important;
  overflow: auto;
}

#roles-dt {
  width: 100%;
  position: absolute;
  bottom: 0px;
  top: 0px;
}

#roles-dt_filter {
  padding-right: 6px;
}

</style>

</head>
<body>

<t:generic_admin_page>
	
	<jsp:attribute name="header">
    </jsp:attribute>
    <jsp:attribute name="footer">
    </jsp:attribute>

	<jsp:body>
		
		<div id="panel-left">
			<div class="data-grid-actions">
				<div id="roles-save-permissions" data-locale_key="Manager_RolesPermission_Button_SavePerm" data-locale_ref="title" class="localizedElement grid-toolbar-item custom-hidden" onclick="mRoles.requests.save();"><i class="fa fa-save fa-2x"></i></div>
				<div id="roles-add" data-locale_key="Manager_RolesPermission_Button_Add" data-locale_ref="title" class="localizedElement grid-toolbar-item" onclick="mRoles.openAddForm();"><i class="fa fa-plus fa-2x"></i></div>
				<div id="roles-delete" data-locale_key="Manager_RolesPermission_Button_Delete" data-locale_ref="title" class="localizedElement grid-toolbar-item custom-hidden" onclick="mRoles.confirmDelete();"><i class="fa fa-minus fa-2x"></i></div>
				<div id="roles-update" data-locale_key="Manager_RolesPermission_Button_Update" data-locale_ref="title" class="localizedElement grid-toolbar-item custom-hidden" onclick="mRoles.openUpdateForm();"><i class="fa fa-edit fa-2x"></i></div>
				
				
			</div>
			<table id="roles-dt"></table>
		</div>
		<div id="panel-center">
			<div class="panel-container-permissions" style="bottom: 50%; top:0;">
				<div class="panel-header-permissions localizedElement" data-locale_key="Manager_RolesPermission_All_Title" data-locale_ref="text"></div>
				<div id="panel-permissions-all"></div>
			</div>
			<div class="panel-container-permissions" style="top: 50%; bottom:0;">
				<div class="panel-header-permissions localizedElement" data-locale_key="Manager_RolesPermission_Assoc_Title" data-locale_ref="text"></div>
				<div id="panel-permissions-assoc"></div>
			</div>	
		</div>
		
	</jsp:body>
</t:generic_admin_page>

	<!-- Dialog -->
	<form id="form-dialog" onSubmit="return false;" class="custom-hidden">
		<div id="form-dialog-header" data-locale_key="Manager_RolesPermission_HeaderForm_Add" data-locale_ref="text" class="localizedElement data-grid-form-header"></div>
		<input type="hidden" id="role-input-id">
		<div class="itemform">
			<div data-locale_key="Manager_RolesPermissions_Label_RoleName" data-locale_ref="text" class="localizedElement form-label-title"></div>
			<div><input type="text" id="role-input-name" name="role-input-name" required></div>
		</div>
		<div class="itemform">
			<div data-locale_key="Manager_RolesPermissions_Label_RoleDesc" data-locale_ref="text" class="localizedElement form-label-title"></div>
			<div><textarea rows="3" id="role-input-desc"></textarea></div>
		</div>
		
	</form>
</body>

</html>