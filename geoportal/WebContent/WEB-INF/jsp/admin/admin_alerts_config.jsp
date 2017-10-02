<%-- <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%> --%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ page import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService,it.gesp.geoportal.constants.Permissions,it.gesp.geoportal.dao.entities.User,it.gesp.geoportal.services.LogService" %>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%@ include file="admin_config_common_js.jspf" %>

<!-- Manager System Configs scripts and CSS-->
<link rel="stylesheet" href="css/admin/alertSettings.css" type="text/css">
<script type="text/javascript" src="scripts/admin/alertSettings/alertSettings.js"></script>

<!-- Start script -->
<script>
	var validator = null;

	$(document).ready(function(){
		LocaleManager.refreshLocale();
		AdminMenu.setAlertConfigPageActive();
		mAlertSettings.requests.getData();
		mAlertSettings.requests.getTypeData();
		mAlertSettings.requests.getIntersectionData();
		
		validator = new Validate({
			form: $("#form-dialog")
		});
		
		mAlertSettings.init();
	});
	
</script>

 <style>
	#feedback { font-size: 1.4em; }
	#list_alert_types .ui-selecting { background: #b0bed9; }
	#list_alert_types .ui-selected { background: #b0bed9; }
	
	#list_alert_types { 
	list-style-type: none;
		margin: 0;
		width: 300px;
		padding-left: 300px;
		word-wrap: break-word;
		padding-top: 20px:
	}
	
	#list_alert_types li { margin: 2px; padding: 0.4em; height: 18px; }
	
	#alertTypeConfigContainer .data-grid-actions {
		padding-left: 300px;
	}
	
	#alertTypeConfigContainer .data-grid-actions div {
		float: left !important;
	}
	
	#ref_layers_select {
		width: 405px;
	}
	
	#alert-type-name{
		width: 250px;
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
		
		<form id="alertsConfigContainer" onSubmit="return false;">		
			<div class="header">
				<div data-locale_key="Manager_Alerts_Title" data-locale_ref="text" class="localizedElement"></div>
			</div>
						
			<div class="itemform">
				<div data-locale_key="Manager_Alerts_Select_RefLayer" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><select id="ref_layers_select"></select></div>
			</div>

			<div class="itemform">
				<div data-locale_key="Manager_Alerts_Added_MessageText" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><textarea id="alerts-added-message-txt" name="alerts-added-message-txt" rows="10" required style="width: 400px;"></textarea></div>
			</div>
			
			<button id="submit" data-locale_key="General_Save" data-locale_ref="text" class="localizedElement" onclick="mAlertSettings.requests.saveData();"></button>
			<button id="cancel" data-locale_key="General_Cancel" data-locale_ref="text" class="localizedElement" onclick="mAlertSettings.requests.getData();"></button>			
			
		</form>
		
		<form id="alertTypeConfigContainer" onSubmit="return false;">
			<div class="header">
				<div data-locale_key=Manager_Alerts_Types_Title data-locale_ref="text" class="localizedElement"></div>
			</div>
			
			<div class="simpleitemform" style="padding-top:7px; border-bottom:0px;">
				<div data-locale_key=Manager_Alerts_Types_List data-locale_ref="text" class="localizedElement form-label-title"></div>
				
				<div class="data-grid-actions">
					<div id="types-add" data-locale_key="Manager_Alerts_Types_Button_Add" data-locale_ref="title" class="localizedElement grid-toolbar-item" onclick="mAlertSettings.openAddTypeForm();"><i class="fa fa-plus fa-2x"></i></div>
					<div id="types-update" data-locale_key="Manager_Alerts_Types_Button_Update" data-locale_ref="title" class="localizedElement grid-toolbar-item custom-hidden" onclick="mAlertSettings.openUpdateTypeForm();"><i class="fa fa-edit fa-2x"></i></div>
					<div id="types-delete" data-locale_key="Manager_Alerts_Types_Button_Delete" data-locale_ref="title" class="localizedElement grid-toolbar-item custom-hidden" onclick="mAlertSettings.deleteType();"><i class="fa fa-minus fa-2x"></i></div>
				</div>
				
				<div>
					<ol id="list_alert_types">
					</ol>
				</div>
			</div>
			
<!-- 			<button id="submit-type" data-locale_key="General_Save" data-locale_ref="text" class="localizedElement" onclick="mAlertSettings.requests.saveTypeData();"></button> -->
<!-- 			<button id="cancel-type" data-locale_key="General_Cancel" data-locale_ref="text" class="localizedElement" onclick="mAlertSettings.requests.getTypeData();"></button>		 -->
		
		</form>
		
		<form id="alertsIntersectionConfigContainer" onSubmit="return false;">		
			
			<!-- Nacionales -->
			
<!-- 			<div class="header"> -->
<!-- 				<div data-locale_key="Manager_Alerts_NationalBoundary_Intersection_Title" data-locale_ref="text" class="localizedElement"></div> -->
<!-- 			</div> -->
			
<!-- 			<div class="itemform"> -->
<!-- 				<div data-locale_key="Manager_Alerts_Select_NationalBoundaries_RefLayer" data-locale_ref="text" class="localizedElement form-label-title"></div> -->
<!-- 				<div><select id="nationalboundaries-layer-select"></select></div> -->
<!-- 			</div> -->

<!-- 			<div class="itemform"> -->
<!-- 				<div data-locale_key=Manager_Alerts_NationalBoundaries_Active data-locale_ref="text" class="localizedElement form-label-title"></div> -->
<!-- 				<div><input type="checkbox" id="nationalboundaries-active"></div> -->
<!-- 			</div> -->
			
			<!-- Departementos -->
			
			<div class="header">
				<div data-locale_key="Manager_Alerts_Department_Intersection_Title" data-locale_ref="text" class="localizedElement"></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_Alerts_Select_Department_RefLayer" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><select id="departments-layer-select"></select></div>
			</div>
					
			<div class="itemform">
				<div data-locale_key="Manager_Alerts_Department_Key_ColumnName" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="departments-key-columnName" name="departments-key-columnName"></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_Alerts_Department_Desc_ColumnName" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="departments-desc-columnName" name="departments-desc-columnName"></div>
			</div>
			
			<div class="itemform" style="padding-bottom: 10px;">
				<div data-locale_key="Manager_Alerts_Department_Geom_ColumnName" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="departments-geom-columnName" name="departments-geom-columnName"></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key=Manager_Alerts_Department_Active data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input type="checkbox" id="departments-active"></div>
			</div>
			
			<!-- Municipios -->
			
			<div class="header">
				<div data-locale_key="Manager_Alerts_Municipality_Intersection_Title" data-locale_ref="text" class="localizedElement"></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_Alerts_Select_Municipality_RefLayer" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><select id="municipalities-layer-select"></select></div>
			</div>
					
			<div class="itemform">
				<div data-locale_key="Manager_Alerts_Municipality_Key_ColumnName" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="municipalities-key-columnName" name="municipalities-key-columnName"></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_Alerts_Municipality_Desc_ColumnName" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="municipalities-desc-columnName" name="municipalities-desc-columnName"></div>
			</div>
			
			<div class="itemform" style="padding-bottom: 10px;">
				<div data-locale_key="Manager_Alerts_Municipality_Geom_ColumnName" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="municipalities-geom-columnName" name="municipalities-geom-columnName"></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key=Manager_Alerts_Municipality_Active data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input type="checkbox" id="municipalities-active"></div>
			</div>
			
			<button id="submit-int" data-locale_key="General_Save" data-locale_ref="text" class="localizedElement" onclick="mAlertSettings.requests.saveIntersectionData();"></button>
			<button id="cancel-int" data-locale_key="General_Cancel" data-locale_ref="text" class="localizedElement" onclick="mAlertSettings.requests.getIntersectionData();"></button>			
			
		</form>
		
		
		</jsp:body>
		
	</t:generic_admin_page>
	
	<form id="form-dialog" style="display:none" onSubmit="return false;">
		<div id="form-dialog-header" data-locale_key="Manager_Alerts_Types_HeaderForm_Add" data-locale_ref="text" class="localizedElement data-grid-form-header"></div>
		<input type="hidden" id="type-input-id">
		
		<div class="form-items-container">
			<div class="form-items-left">
				<div class="itemform">
					<div data-locale_key="Manager_Alerts_Types_Label_Name" data-locale_ref="text" class="localizedElement form-label-title"></div>
					<div><input type="text" id="alert-type-name" name="alert-type-name" required></div>
				</div>
				
				
			</div>
		</div>
	</form>
	
	<div id="form-del-dialog"></div>
	
</body>
</html>
