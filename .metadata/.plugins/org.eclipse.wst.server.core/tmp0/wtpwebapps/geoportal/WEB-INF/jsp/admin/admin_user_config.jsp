<%-- <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%> --%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ page import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService,it.gesp.geoportal.constants.Permissions,it.gesp.geoportal.dao.entities.User" %>

<!DOCTYPE html>
<html>
<head>
<title>Configuracion de Usuarios</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%@ include file="admin_config_common_js.jspf" %>

<!-- Manager Users scripts and CSS-->
<link rel="stylesheet" href="css/admin/managerUsers.css" type="text/css">
<script type="text/javascript" src="scripts/admin/managerUsers.js"></script>

<!-- Start script -->
<script>
	$(document).ready(function(){
		LocaleManager.refreshLocale();
		AdminMenu.setUserConfigPageActive();
		mUsers.init();
	});
</script>

<style>
	#users-dt_wrapper {
	  position: absolute;
	  top: 50px;
	  bottom: 0px;
	  left: 0;
	  right: 0px;
	}
	
	#users-dt_wrapper .dataTables_scroll {
	  position: absolute;
	  top: 30px;
	  bottom: 0px;
	  left: 0;
	  right: 0px;
	}
	#users-dt_wrapper .dataTables_scrollBody {
	  overflow: auto;
	  position: absolute;
	  top: 25px;
	  bottom: 0;
	  height: auto !important;
	  overflow: auto;
	}
	
	#users-dt {
	  width: 100%;
	  position: absolute;
	  bottom: 0px;
	  top: 0px;
	}
	
	#users-dt_filter {
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
			<div id="grid-container">
				<div class="data-grid-actions">
					<div id="users-add" data-locale_key="Manager_Users_Button_Add" data-locale_ref="title" class="localizedElement grid-toolbar-item" onclick="mUsers.openAddForm();"><i class="fa fa-plus fa-2x"></i></div>
					<div id="users-delete" data-locale_key="Manager_Users_Button_Delete" data-locale_ref="title" class="localizedElement grid-toolbar-item custom-hidden" onclick="mUsers.requests.deleteUser();"><i class="fa fa-minus fa-2x"></i></div>
					<div id="users-enable" data-locale_key="Manager_Users_Button_Enable" data-locale_ref="title" data-action="enableUser" class="localizedElement grid-toolbar-item custom-hidden" onclick="mUsers.requests.changeStatusUser($(this).data('action'));"><i class="fa fa-check fa-2x"></i></div>
					<div id="users-disable" data-locale_key="Manager_Users_Button_Disable" data-locale_ref="title" data-action="disableUser" class="localizedElement grid-toolbar-item custom-hidden" onclick="mUsers.requests.changeStatusUser($(this).data('action'));"><i class="fa fa-times fa-2x"></i></div>
					<div id="users-update" data-locale_key="Manager_Users_Button_Update" data-locale_ref="title" class="localizedElement grid-toolbar-item custom-hidden" onclick="mUsers.openUpdateForm();"><i class="fa fa-edit fa-2x"></i></div>
					
				</div>
				<table id="users-dt"></table>
			</div>
		</jsp:body>
		
	</t:generic_admin_page>
	
	<form id="form-dialog" style="display:none" onSubmit="return false;">
		<input type="hidden" id="user-input-id">
		<div id="form-dialog-header" data-locale_key="Manager_Users_HeaderForm_Add" data-locale_ref="text" class="localizedElement data-grid-form-header"></div>
		<div class="itemform">
			<div data-locale_key="Manager_Users_Label_Name" data-locale_ref="text" class="localizedElement form-label-title"></div>
			<div><input type="text" id="user-input-name" name="user-input-name" required></div>
		</div>
		<div class="itemform">
			<div data-locale_key="Manager_Users_Label_Pass" data-locale_ref="text" class="localizedElement form-label-title"></div>
			<div><input type="password" id="user-input-pass" name="user-input-pass" required></div>
		</div>
		<div class="itemform">
			<div data-locale_key="Manager_Users_Label_ConfirmPass" data-locale_ref="text" class="localizedElement form-label-title"></div>
			<div><input type="password" id="user-input-confirmpass" name="user-input-confirmpass" required></div>
		</div>
		<div class="itemform">
			<div data-locale_key="Manager_Users_Label_Role" data-locale_ref="text" class="localizedElement form-label-title"></div>
			<div><select id="user-select-role"></select></div>
		</div>
<!-- 		<div class="form-footer"> -->
<!-- 			<button id="user-submit" data-locale_key="General_Save" data-locale_ref="text" class="localizedElement" onclick="mUsers.requests.insertUser();"></button> -->
<!-- 			<button id="user-cancel" data-locale_key="General_Cancel" data-locale_ref="text" class="localizedElement" onclick="mUsers.closeAddForm();"></button>																	 -->
<!-- 		</div> -->
	</form>

</body>
</html>
