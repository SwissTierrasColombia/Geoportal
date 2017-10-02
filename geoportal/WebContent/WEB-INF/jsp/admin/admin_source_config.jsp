<%-- <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%> --%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ page import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService,it.gesp.geoportal.constants.Permissions,it.gesp.geoportal.dao.entities.User" %>

<!DOCTYPE html>
<html>
<head>
<title>Configuracion de fuentes WMS</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%@ include file="admin_config_common_js.jspf" %>

<!-- Manager Sources scripts and CSS-->
<script type="text/javascript" src="scripts/admin/wmsSources/managerSources.js"></script>

<!-- Start script -->
<script>
	$(document).ready(function(){
		LocaleManager.refreshLocale();
		AdminMenu.setSourceConfigPageActive();
		mSources.init();
	});
</script>

<style>

.formwidth {
	width: 250px;
}

#form-dialog .itemform .form-label-title {
	padding-top: 7px; 
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
					<div id="sources-add" data-locale_key="Manager_Sources_Button_Add" data-locale_ref="title" class="localizedElement grid-toolbar-item" onclick="mSources.openAddForm();"><i class="fa fa-plus fa-2x"></i></div>
					<div id="sources-update" data-locale_key="Manager_Sources_Button_Update" data-locale_ref="title" class="localizedElement grid-toolbar-item" onclick="mSources.openUpdateForm();"><i class="fa fa-edit fa-2x"></i></div>
					<div id="sources-delete" data-locale_key="Manager_Sources_Button_Delete" data-locale_ref="title" class="localizedElement grid-toolbar-item " onclick="mSources.requests.deleteSource();"><i class="fa fa-minus fa-2x"></i></div>
				</div>
				<table id="sources-dt"></table>
			</div>
		</jsp:body>
		
	</t:generic_admin_page>
	
	<form id="form-dialog" style="display:none" onSubmit="return false;">
		<div id="form-dialog-header" data-locale_key="Manager_Sources_HeaderForm_Add" data-locale_ref="text" class="localizedElement data-grid-form-header"></div>
		<input type="hidden" id="sources-input-id">
		
		<div class="itemform">
			<div data-locale_key="Manager_Sources_Label_Name" data-locale_ref="text" class="localizedElement form-label-title"></div>
			<div><input type="text" id="sources-input-name" name="sources-input-name" class="formwidth" required></div>
		</div>
		<div class="itemform">
			<div data-locale_key="Manager_Sources_Label_Description" data-locale_ref="text" class="localizedElement form-label-title"></div>
			<div><input type="text" id="sources-input-description" name="sources-input-description" class="formwidth"></div>
		</div>
		
		<div class="itemform">
			<div data-locale_key="Manager_Sources_Label_AddToExternalWmsList" data-locale_ref="text" class="localizedElement form-label-title label-checkbox"></div>
			<div><input type="checkbox" id="sources-input-add-to-external-wmslist"></div>
		</div>
		
		<div class="itemform">
			<div data-locale_key="Manager_Sources_Label_Url" data-locale_ref="text" class="localizedElement form-label-title"></div>
			<div><input id="sources-input-url" name="sources-input-url" required class="formwidth"></div>
		</div>
		<div class="itemform">
			<div data-locale_key="Manager_Sources_Label_CacheUrl" data-locale_ref="text" class="localizedElement form-label-title"></div>
			<div><input id="sources-input-cacheurl" name="sources-input-cacheurl" class="formwidth"></div>
		</div>
		
		<!-- Footer action buttons form -->
		<div class="form-footer"></div>
	</form>

</body>
</html>
