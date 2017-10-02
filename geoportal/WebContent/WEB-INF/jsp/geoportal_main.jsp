<%-- <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%> --%>
<%@page import="it.gesp.geoportal.dao.dto.SystemSettingDTO"%>
<%@page import="it.gesp.geoportal.services.SystemSettingService"%>
<%@page import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService,it.gesp.geoportal.constants.Permissions, it.gesp.geoportal.dao.entities.User, it.gesp.geoportal.services.SystemSettingService" %>

<!DOCTYPE html>
<html>
<head>
<title>Geoportal</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%-- 	<%@ include file="geoportal_import_js_min.jspf" %> --%>
	<%@ include file="geoportal_import_js_no_min.jspf" %>
	
</head>
<body>
	<div id="loading-panel"></div>
	<div id="container">
		<div id="topbanner">
			<div class="main">
				<div class="header">
					<div>
						<div class="logo-banner-left hondurasClass">
							<img src="images/banner/Honduras_flag.gif" alt="HONDURAS">
						</div>
						<div class="logo-banner-left icfClass">
							<img src="images/banner/icf_logo_white.jpg" alt="ICF">
						</div>
						<div class="logo-banner-left mosefClass">
							<img src="images/banner/UE_logo.jpg" alt="UE_LOGO">
						</div>
						<div class="logo-banner-left mosefClass">
							<img src="images/banner/mosef_scaled.png" alt="MOSEF">
						</div>
							
						<div class="logo-banner-left bannerText">
							<div data-locale_key="Header_Geoportal_Title" data-locale_ref="text" class="localizedElement"></div>
						</div>
						
					</div>
					
					<div class="header-switcher">
						<span>
							<a href="#" data-locale_key="Header_ContactUS_Link" data-locale_ref="text" class="localizedElement" style="margin-right: 10px;"></a>
						</span>
						<select id="language-selector" class="ui-select" onchange="changeGlobalLanguage($(this));">
							<option value="es">Español</option>
							<option value="en">English</option>
						</select>

						<% if (LoginService.currentUserHasPermission(session, Permissions.ACCESS_ADMINISTRATION_PANEL)) { %>
							<div id="open-administration-page"  onclick="openAdminPanelWindow()" data-locale_key="Page_Geoportal_Administration_Button_Title" data-locale_ref="title" class="localizedElement"><i class="fa fa-cog fa-2x"></i></div>
						<% } %>
						<div id="tabs-gn-switcher" data-page="tabs-gn" onclick="switchPage($(this))" data-locale_key="Page_Geonetwork_Switch_Button_Title" data-locale_ref="title" class="localizedElement"><i class="fa fa-spin fa-spinner fa-2x"></i></div>
						<div id="tabs-webgis-switcher" data-page="tabs-webgis" onclick="switchPage($(this))" data-locale_key="Page_Geoportal_Switch_Button_Title" data-locale_ref="title" class="localizedElement"><i class="fa fa-globe fa-2x"></i></div>
						
						<!-- Manual link -->
						<div id="manual-link" onclick="window.open('html_manual/user/Geoportal_User.html', '_blank ', 'location=no,menubar=no,titlebar=no,toolbar=no,resizable=yes,width=800,height=700')" data-locale_key="Page_Manual_Switch_Button_Title" data-locale_ref="title" class="localizedElement"><i class="fa fa-question fa-2x"></i></div>

						
						
					</div>
				</div>
			</div>
		</div>

		<div id="tabsWebgisGN">
			<div id="tabs-webgis" class="tabMain heightFull webgisGNTabs">
			
				<!-- TOOLBAR WEBGIS -->
				<div id="toolbar">
					<div id="toolbar-tools">
						<div id="logged-welcome" class="custom-hidden"></div>
						<div id="login_username_label" data-locale_key="Username_Text" data-locale_ref="text" class="localizedElement" style="display: inline-block;">Username:</div> <input id="login_username" type="text" name="username"></input>
						<div id="login_password_label" data-locale_key="Password_Text" data-locale_ref="text" class="localizedElement" style="display: inline-block;">Password:</div> <input id="login_password" type="password" name="password"></input>
						<button id="gis_login" data-locale_key="Login_Button_Title" data-locale_ref="text" class="localizedElement"></button>
						<button id="gis_logout" style="display:none;" data-locale_key="Logout_Button_Title" data-locale_ref="text" class="localizedElement"></button>		
					</div>
						
					<div id="baselayer-container">
						<select id="baselayers-select" class="ui-select"></select>
						<span id="baselayer-info-btn"></span>
					</div>
				</div>
				
				<!-- WEBGIS CONTAINER (map and footer) -->
				<div id="webgis" style="height: 100%;">
					<!-- <div id="toolbar" class="ui-widget-header ui-corner-all"> -->
					<div id="mapContainer">
					
						<div id="input-label-panel" data-locale_key="Save_Label_Panel" data-locale_ref="title" class="localizedElement custom-hidden">
							<div id="input-label-header" data-locale_key="Save_Label_Header" data-locale_ref="text" class="localizedElement"></div>
							<textarea id="input-label"></textarea>
							<div id="save-label-button" data-locale_key="Save_Label_Button" data-locale_ref="title" class="localizedElement" onclick="saveLabel();"><i class="fa fa-save fa-2x"></i></div>
						</div>
						
						<!-- BASE TOOLS PANEL -->
						<div id="base-tools-panel" class="tools-panel">
							
							<div id="gis_maxExtentBtn" data-locale_key="Base_Panel_MaxExtent" data-locale_ref="title" class="icon-container localizedElement"><i class="fa fa-arrows-alt fa-2x"></i></div>
							<div id="gis_prevBtn" data-locale_key="Base_Panel_PreviousZoom" data-locale_ref="title" class="icon-container localizedElement"><i class="fa fa-arrow-left fa-2x"></i></div>
							<div id="gis_nextBtn" data-locale_key="Base_Panel_NextZoom" data-locale_ref="title" class="icon-container localizedElement"><i class="fa fa-arrow-right fa-2x"></i></div>
							<!-- GO TO COORDS -->
							<div class="icon-container-all">
								<div id="gis_goToCoordinatesBtn" data-tool="coordinates" data-locale_key="Base_Panel_GoToCoordinates" data-locale_ref="title" class="icon-container localizedElement" onclick="AdvancedPanel.toggleAdvancedTools($(this));"><i class="fa fa-crosshairs fa-2x"></i></div>
								<div id="advance-goto-panel" class="tools-panel-right custom-hidden">
									<div data-locale_key="Base_Panel_GoToCoordinates" data-locale_ref="text" class="data-grid-form-header localizedElement"></div>
									<div class="itemform no-border">
										<div data-locale_key="GoTo_Coords_Epsg" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<select id="coords-epsg">
											<option value="EPSG:32616">WGS84/Utm 16N (X - Y)</option>
											<option value="EPSG:32617">WGS84/Utm 17N (X - Y)</option>
											<option value="EPSG:4326">WGS84 (Lon - Lat)</option>
										</select>
									</div>
									<div class="itemform no-border">
										<div id="coords-lon-label" data-locale_key="GoTo_Coords_X" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<input id="coords-lon">
									</div>
									<div class="itemform no-border">
										<div id="coords-lat-label" data-locale_key="GoTo_Coords_Y" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<input id="coords-lat">										
									</div>
									<div class="form-footer">
										<button data-locale_key="GoTo_Coords_Btn" data-locale_ref="text" class="localizedElement" id="goto-coordinates-btn" onclick="coordinates.goToCoordinates();"></button>
									</div>
								</div>
							</div>
							<div id="gis_getFeatureInfoBtn" data-locale_key="Base_Panel_FeatureInfo" data-locale_ref="title" class="icon-container ctrlButtons localizedElement"><i class="fa fa-info fa-2x"></i></div>
							<div id="gis_measureLineBtn" data-locale_key="Base_Panel_MeasureLine" data-locale_ref="title" class="icon-container ctrlButtons localizedElement"><i class="fa fa-arrows-h fa-2x"></i></div>
							<div id="gis_measureAreaBtn" data-locale_key="Base_Panel_MeasureArea" data-locale_ref="title" class="icon-container ctrlButtons localizedElement"><i class="fa fa-square-o fa-2x"></i></div>
							<div id="gis_gisOverviewBtn"" data-locale_key="Base_Panel_ShowOverview" data-locale_ref="title" class="icon-container localizedElement custom-hidden" onclick="gisOverview.toggle($(this));"><i class="fa fa-globe fa-2x"></i></div>
						</div>
						
						<!-- ******************** -->
						<!-- ADVANCED TOOLS PANEL -->
						<!-- ******************** -->
						<div id="advance-tools-panel" class="tools-panel-master horizontal-panel">
						
							<!-- PRINT TOOL -->
							<div class="icon-container-all">
								<!-- Icon -->
								<div id="gis-print" data-tool="print"  data-locale_key="Advanced_Panel_Print" data-locale_ref="title" class="icon-container localizedElement" onclick="AdvancedPanel.toggleAdvancedTools($(this));"><i class="fa fa-print fa-2x"></i></div>
								
								<!-- Print panel -->
								<div id="advance-print-panel" class="tools-panel custom-hidden">									
									<!-- Title Map -->
									<div class="itemform">
										<div data-locale_key="Print_Label_TitleMap" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<input id="print-title">
									</div>
									
<!-- 									Comment Map -->
<!-- 									<div class="itemform"> -->
<!-- 										<div data-locale_key="Print_Label_CommentMap" data-locale_ref="text" class="form-label-title localizedElement"></div> -->
<!-- 										<textarea rows="3" id="print-comment"></textarea> -->
<!-- 									</div> -->
									
									<!-- Print layout -->
									<div class="itemform no-border">
										<div data-locale_key="Print_Label_Layout" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<select id="print-layout"></select>
									</div>
									
									<!-- Print format (PNG, PDF, ...) -->
									<div class="itemform no-border">
										<div data-locale_key="Print_Label_Format" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<select id="print-format"></select>
									</div>
									
									<!-- Print Scale -->
									<div class="itemform no-border">
										<div data-locale_key="Print_Label_Scale" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<select id="print-scale"></select>
									</div>
									
									<!-- Print DPI -->
									<div class="itemform">
										<div data-locale_key="Print_Label_Dpi" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<select id="print-dpi"></select>
									</div>
									
									<!-- Print Rotation (counterclockwise -->
									<div class="itemform">
										<div data-locale_key="Print_Label_Rotation" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<input id="print-rotation_angle" type="number">
									</div>
									
									<!-- Include legend -->
									<div class="itemform">
										<div data-locale_key="Print_Label_Include_Legend" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<input id="print-include_legend" type="checkbox">
									</div>
									
									<!-- Footer action buttons form -->
									<div class="form-footer">
										<button id="print-submit" data-locale_key="Print_Submit" data-locale_ref="text" class="localizedElement" onclick="print.requests.submit();"></button>
									</div>
								</div>
							</div>	
													
							<!-- SEARCH WFS -->
							<div class="icon-container-all">
								<!-- Icon -->
								<div id="gis_FEAT" data-tool="searchwfs" data-locale_key="Advanced_Panel_Search_Enable" data-locale_ref="title" class="localizedElement icon-container" onclick="AdvancedPanel.toggleAdvancedTools($(this));"><i class="fa fa-search fa-2x"></i></div>
								
								<!-- Advanced tools panel -->
								<div id="advance-searchwfs-panel" class="tools-panel custom-hidden">
								
									<!-- FILTER KEYWORD -->
									<div class="itemform">
										<!-- Keyword label-->
										<div data-locale_key="Advanced_Panel_Search_Label_keyword" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<div>								
											<input id="gis_FEAT_KEYWORD" type="text" name="gis_FEAT_KEYWORD">										
										</div>
										<div>
											<!-- Search type (Exact or like) -->
											<input id="search_exact" type="checkbox">
											<div data-locale_key="Advanced_Panel_Search_Label_SearchType" data-locale_ref="text" class="localizedElement"></div>							
										</div>	
										<div style="padding: 3px 5px 0 0;">
											<!-- Search all layers and not only visible ones -->
											<input id="search_all_layers" type="checkbox">
											<div data-locale_key="Advanced_Panel_Search_Label_SearchAllLayers" data-locale_ref="text" class="localizedElement"></div>							
										</div>
									</div>
									
									<!-- FILTER BBOX -->
									<div class="itemform">
										<div data-locale_key="Advanced_Panel_Search_Label_SearchBbox" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<div class="items-radio float">
											<input id="search-bbox-deactive" type="radio" value="bbox-deactive" name="search-bbox" checked="checked">
											<div data-locale_key="Advanced_Panel_Search_Label_SearchBboxDeactive" data-locale_ref="text" class="localizedElement"></div>
											
											<input id="search-bbox-active" type="radio" value="bbox-active" name="search-bbox">
											<div style="padding: 3px 5px 0 0;" data-locale_key="Advanced_Panel_Search_Label_SearchBboxActive" data-locale_ref="text" class="localizedElement"></div>
										</div>
										
										<!-- BBOX manager panel -->
										<div id="search-bbox-panel" class="custom-hidden">
											<div id="search-bbox-selected-buttons">
												<div id="search-bbox-select-button" data-locale_key="Advanced_Panel_Search_SearchBboxSelectButton" data-locale_ref="title" class="localizedElement" onclick="controls.search.activate();"><i class="fa fa-pencil-square-o fa-medium"></i></div>
												<div id="search-bbox-toggle-button" data-locale_key="Advanced_Panel_Search_SearchBboxHideButton" data-locale_ref="title" class="localizedElement custom-hidden" onclick="searchP.toggleVisibilityBbox();"><i class="fa fa-eye fa-medium"></i></div>
											</div>
											<div id="search-bbox-selected-text"></div>
										</div>				
									</div>
									
									<!-- Footer (Confirm button) -->
									<div class="advance-searchwfs-footerform">
										<button id="advance-searchwfs-clean" data-locale_key="General_Clean" data-locale_ref="text" class="localizedElement" style="float:left;"></button>
										<button id="advance-searchwfs-confirm" data-locale_key="Advanced_Panel_Search_Confirm" data-locale_ref="text" class="localizedElement"></button>
									</div>
								</div>
							</div>
							<!-- END SEARCH WFS -->
							
							<!--  CSW -->
							<div class="icon-container-all">
								<!-- Icon -->
								<div id="gis_cswClientBtn" data-tool="catalogcsw"  data-locale_key="Metadata_Panel_Csw_Search" data-locale_ref="title" class="localizedElement icon-container" onclick="AdvancedPanel.toggleAdvancedTools($(this));"><i class="fa fa-binoculars fa-2x"></i></div>										
							</div>
							<!-- END CSW -->
							
							<!-- ADD WMS -->
							<div class="icon-container-all">
								<div id="gis_WMSDialog" data-locale_key="Base_Panel_AddWMS" data-locale_ref="title" class="icon-container localizedElement" onclick="addWmsDialog.toggle($(this));"><i class="fa fa-external-link fa-2x"></i></div>
							</div>
							<!-- ADD WMS END-->
							
							<!-- UPLOAD KML TOOL -->
							<div class="icon-container-all">
							
								<!-- Icon and button-->
								<div id="gis-uploadkml" data-tool="uploadkml"  data-locale_key="Advanced_Panel_KMLUpload" data-locale_ref="title" class="icon-container localizedElement" onclick="AdvancedPanel.toggleAdvancedTools($(this));"><i class="fa fa-upload fa-2x"></i></div>
								
								<!-- Upload KML panel -->
								<div id="advance-uploadkml-panel" class="tools-panel custom-hidden">									
									
									<!-- Choose File-->
									<div class="itemform">
										<div data-locale_key="KMLUpload_Label_ChooseFile" data-locale_ref="text" class="form-label-title localizedElement"></div>
<!-- 										<input id="uploadkml-input-file"type="file"> -->
										<input id="uploadkml-input-file-text" type="text" readonly>
										<div id="uploadkml-choose-file" data-locale_key="KMLUpload_Label_ChooseFileUpload" data-locale_ref="title" class="localizedElement grid-toolbar-item" style="margin:0px;" onclick="kmlupload.chooseFile();"><i class="fa fa-paperclip fa-2x"></i></div>
									</div>
									
									<!--Set projection -->
									<div class="itemform no-border">
										<div data-locale_key=KMLUpload_Label_SelectProjection data-locale_ref="text" class="form-label-title localizedElement"></div>
										<select id="uploadkml-select-proj">
											<option value="EPSG:900913">EPSG:900913</option>
											<option value="EPSG:4326">EPSG:4326</option>
										</select>
									</div>
			
									<div class="itemform">
										<div class="float" style="width:100%;">
											<!-- Extract styles -->
											<input id="uploadkml-extractstyles" type="checkbox">
											<div data-locale_key="KMLUpload_Label_ExtractStyles" data-locale_ref="text" class="localizedElement" style="padding-top:4px;"></div>							
										</div>
									</div>
									
									<div class="itemform">
										<div class="float" style="width:100%;">
											<!-- Extract attributes -->
											<input id="uploadkml-extractattributes" type="checkbox">
											<div data-locale_key="KMLUpload_Label_ExtractAttributes" data-locale_ref="text" class="localizedElement" style="padding-top:4px;"></div>							
										</div>
									</div>
									
									<!-- Footer action buttons form -->
									<div class="form-footer">
										<button id="uploadkml-submit" data-locale_key="KMLUpload_LabelSubmit" data-locale_ref="text" class="localizedElement" onclick="kmlupload.uploadKml();"></button>
									</div>
								</div>
							</div>
							<!-- END KML TOOL -->
							
							<!-- DOWNLOAD SHAPE -->
							<div class="icon-container-all">
							
								<!-- Icon and button-->
								<div id="gis_downloadBtn" data-locale_key="Base_Panel_Download" data-locale_ref="title" class="icon-container localizedElement"><i class="fa fa-download fa-2x"></i></div>
							</div>
							<!-- END DOWNLOAD SHAPE -->
							
							<!-- REDLINES -->
							<div class="icon-container-all">
								<!-- Icon -->
								<div id="gis_redlinesBtn" data-tool="redlines" data-locale_key="Advanced_Panel_Redline_Enable" data-locale_ref="title" class="localizedElement icon-container" onclick="AdvancedPanel.toggleAdvancedTools($(this));"><i class="fa fa-pencil-square-o fa-2x"></i></div>

								<!-- Advanced tools panel -->
								<div id="advance-redlines-panel" class="tools-panel horizontal-panel custom-hidden">
									<div class="section-panel">
										<div id="redline-zoom" data-locale_key="General_ZoomToLayer_Button_Title" data-locale_ref="title" class="localizedElement redline-ctrl icon-container ctrlButtons"  onclick="redlines.zoomToLayer();"><i class="fa fa-arrows-alt fa-2x"></i></div>
										<div id="redline-reload" data-locale_key="General_Reload_Button_Title" data-locale_ref="title" class="localizedElement redline-ctrl icon-container ctrlButtons"  onclick="redlines.reloadData(true);"><i class="fa fa-refresh fa-2x"></i></div>
									</div>
									<div id="redline-typegeoms" class="section-panel">
										<div id="redline-point" data-locale_key="Redline_Add_Point_Button_Title" data-locale_ref="title" data-action="pointDraw" class="localizedElement redline-ctrl icon-container ctrlButtons"  onclick="redlines.selectGeomType($(this));"><i class="fa fa-circle fa-2x"></i></div>
										<div id="redline-line" data-locale_key="Redline_Add_Line_Button_Title" data-locale_ref="title" data-action="lineDraw" class="localizedElement redline-ctrl icon-container ctrlButtons" onclick="redlines.selectGeomType($(this))"><i class="fa fa-share-alt fa-2x"></i></div>
										<div id="redline-polygon" data-locale_key="Redline_Add_Polygon_Button_Title" data-locale_ref="title" data-action="polygonDraw" class="localizedElement redline-ctrl icon-container ctrlButtons" onclick="redlines.selectGeomType($(this))"><i class="fa fa-square fa-2x"></i></div>								
									</div>
									<div id="redline-ctrl-edit" class="section-panel">
										<div id="redline-ctrl-select" data-locale_key="Redline_Select_Button_Title" data-locale_ref="title" data-action="select" class="localizedElement redline-ctrl icon-container ctrlButtons"  onclick="redlines.selectFeature($(this));"><i class="fa fa-hand-o-up fa-2x"></i></div>
										<div id="redline-ctrl-delete" data-locale_key="Redline_Delete_Button_Title" data-locale_ref="title" data-action="delete" class="localizedElement redline-ctrl icon-container ctrlButtons btn-disable" onclick="redlines.deleteFeature($(this));"><i class="fa fa-trash-o fa-2x"></i></div>
										<div id="redline-ctrl-modify" data-locale_key="Redline_Modify_Polygon_Button_Title" data-locale_ref="title" data-action="modify" class="localizedElement redline-ctrl icon-container ctrlButtons" onclick="redlines.modifyFeature($(this));"><i class="fa fa-pencil fa-2x"></i></div>
										<div id="redline-ctrl-label" data-locale_key="Redline_Label_Button_Title" data-locale_ref="title" data-action="addlabel" class="localizedElement redline-ctrl icon-container ctrlButtons btn-disable" onclick="redlines.addLabel($(this));"><i class="fa fa-file-text fa-2x"></i></div>							
									</div>
									
									<div class="section-panel">
										<div id="redline-download" data-locale_key="Redline_Download_Button_Title" data-locale_ref="title" class="localizedElement icon-container" onclick="redlines.downloadGeoms();"><i class="fa fa-download fa-2x"></i></div>
										
										<% // REDLINE SAVE PERMISSION
										if (LoginService.currentUserHasPermission(session, Permissions.REDLINE_INSERT)) { %>
										<div id="redline-save" data-locale_key="Redline_Save_Button_Title" data-locale_ref="title" class="localizedElement icon-container" onclick="redlines.saveGeoms();"><i class="fa fa-save fa-2x"></i></div>
										<% } //end REDLINE SAVE PERMISSION %>
									</div>
									
								</div>											
							</div>
							<!-- END REDLINES -->
							
							
							<!--  COMMENTS -->
							<% // COMMENTS READ PERMISSION
							if (LoginService.currentUserHasPermission(session, Permissions.COMMENTS_READ)) { %>
							<div class="icon-container-all">
								<!-- Icon -->
								<div id="gis_commentsBtn" data-tool="comments" data-locale_key="Advanced_Panel_Comments_Enable" data-locale_ref="title" class="localizedElement icon-container" onclick="AdvancedPanel.toggleAdvancedTools($(this));"><i class="fa fa-file-text-o fa-2x"></i></div>
								<div id="advance-comments-panel" class="tools-panel custom-hidden">									
									
									<div id="comments-form">							
										<!-- Simple search -->
										<div data-locale_key="Advanced_Panel_Comments" data-locale_ref="text" class="localizedElement label-form"></div>
										<div id="comments-input-container">
											<textarea id="comments-input" rows="6"></textarea>
										</div>
									</div>
									<!-- Footer action buttons form -->
									<div class="form-footer">
										<button id="comments-text-submit" data-locale_key="General_Save" data-locale_ref="text" class="localizedElement" onclick="comments.saveData();"></button>
									</div>
								</div>
							</div>
																			
							<% } //end COMMENTS READ PERMISSION %>
							<!-- END COMMENTS -->
							
							
							<!--  ALERTS -->
							<div class="icon-container-all">
								<!-- Icon -->
								<div id="gis_alertsBtn" data-tool="alerts" data-locale_key="Advanced_Panel_Alerts_Enable" data-locale_ref="title" class="localizedElement icon-container" onclick="AdvancedPanel.toggleAdvancedTools($(this));"><i class="fa fa-flag fa-2x"></i></div>
								
								<% // ALERTS READ PERMISSION
								/*
								 * Simple Alert Panel is available to all user that are not Alerts Admin, 
								 * (ie dont have the ALERTS_READ permission)
								*/
									if (!LoginService.currentUserHasPermission(session, Permissions.ALERTS_READ)) { 
								%>
							 	
								<!-- Simple Alert panel -->
								<div id="simple-advance-alerts-panel" class="tools-panel custom-hidden">									
									<div id="simple-advance-alerts-panel-links">
										<div id="simple-advance-alerts-panel-add-alert-link" data-tab="simple-advance-alerts-panel-add" class="simple-advance-alerts-panel-link simple-advance-alerts-panel-link-active" onclick="alerts.simplePanelSwitchMenu($(this));">
											<div class="simple-advance-alerts-panel-links-icon"><i class="fa fa-plus fa-2x"></i></div>
											<div data-locale_key=Advanced_Alerts_Insert_New data-locale_ref="text" class="localizedElement"></div>
										</div>
										<div id="simple-advance-alerts-panel-verify-alert-link" data-tab="simple-advance-alerts-panel-verify" class="simple-advance-alerts-panel-link" onclick="alerts.simplePanelSwitchMenu($(this));">
											<div class="simple-advance-alerts-panel-links-icon"><i class="fa fa-check fa-2x"></i></div>
											<div data-locale_key="Advanced_Alerts_Alert_Verify" data-locale_ref="text" class="localizedElement"></div>
										</div>
									</div>
									
									<!-- Add new Alert -->
									<div id="simple-advance-alerts-panel-add" class="itemform simple-advance-alerts-panel-tab-item" style="border-bottom: none;">
										<button id="alert-insert-new-btn" data-locale_key="General_Add" data-locale_ref="text" class="localizedElement" onclick="alerts.addNewAlertSimple();"></button>
									</div>
									
									<!-- Verify -->
									<div id="simple-advance-alerts-panel-verify" class="itemform simple-advance-alerts-panel-tab-item custom-hidden">
										<div data-locale_key="Advanced_Alerts_Label_Reference_Code" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<input id="alert-verify-referenceCode-input">
										<button id="alert-verify-btn" data-locale_key="General_Verify" data-locale_ref="text" class="localizedElement" onclick="alerts.verifyAlert($('#alert-verify-referenceCode-input'));"></button>
									</div>
								</div>
								<%  } //end ALERTS READ PERMISSION %>
																		
							</div>
							<!-- END ALERTS -->
<!-- 							 TEST -->
<!-- 							<div class="icon-container-all"> -->
<!-- 								Icon -->
<!-- 								<div id="test_INTERS" data-locale_key="Advanced_Panel_Alerts_Enable" data-locale_ref="title" class="localizedElement icon-container" onclick="provaIntersezione();"><i class="fa fa-flag fa-2x"></i></div> -->
<!-- 							</div> -->
						</div>
	
						<!-- ************* -->
						<!-- Map Container -->
						<!-- ************* -->
						<div id="map"></div>
						
						<!-- 
						Right Panel 
						Pannello contenente i layer caricati in mappa	 
						-->
						<div id="rightPanel">												
							<!-- <div id="menu_header" data-locale_key="Page_Menu_Header" data-locale_ref="text" class="localizedElement m-header">Geocatalogo-TEST</div> -->

							<!-- <div id="menu-catalog-service">
								<div id="menu-catalog-header"></div>
							</div> -->
							
							<div id="menu_toggle" data-locale_key="General_Collapse" data-locale_ref="title" class="localizedElement expanded" onclick="LayerMenu.toggleMenu($(this))">
								<div><i class="fa fa-caret-right"></i></div>
							</div>
							
							<!-- TABS MENU -->
							<div id="menu_tabs">
								<div id="menu-switcher">							
									<div id="menu-switcher-toc" class="menu-tab-switcher-item menu-tab-active" data-tab="tab_toc" onclick="LayerMenu.switchTabMenu($(this));">
										<div class="menu-switcher-icon"><i class="fa fa-reorder fa-2x"></i></div>
										<div id="link_tab_layer" data-locale_key="Page_Menu_Tab_Layer" data-locale_ref="text" class="localizedElement"></div>										
									</div>
									<div id="menu-switcher-search" class="menu-tab-switcher-item custom-hidden" data-tab="tab_search" onclick="LayerMenu.switchTabMenu($(this));">
										<div class="menu-switcher-icon"><i class="fa fa-search fa-2x"></i></div>
										<div id="link_tab_search" data-locale_key="Page_Menu_Tab_Search" data-locale_ref="text" class="localizedElement"></div>									
									</div>
								</div>
								
								<div id="tab_toc" class="tab-item">
												
									<!-- Class menu_tree_parent is to identify the parent Menu. No CSS -->
									<div id="tab_layers_active" class="legend_layer_tabs menu_tree_parent">
									
									
										<div id="menu_layers_active" class="root_item" data-grp_code="grp_layer_active">
											<div class="menu_title">
												<div id="miniLegend">
													<div data-locale_key="Page_Menu_Layer_Official" data-locale_ref="text" class="localizedElement"></div>
													<div data-locale_key="Page_Menu_Layer_Not_Official" data-locale_ref="text" class="localizedElement"></div>
												</div>
												<div data-locale_key="TOC_Layers_Selected_Panel" data-locale_ref="text" class="localizedElement root_text"></div>
											</div>
											<div class="menu_item_content">
												<ul class="menu_item_content_list"></ul>
											</div>
										</div>
									</div>
									
									<!-- Class menu_tree_parent is to identify the parent Menu. No CSS -->
									<div id="tab_layers" class="legend_layer_tabs menu_tree_parent">
										<div class="menu_title catalogLayerTitle">
											<div data-locale_key="TOC_Layers_List_Panel" data-locale_ref="text" class="localizedElement root_text"></div>
										</div>
										<div class="tab_content">	
											<div id="menu_layers" class="root_item custom-hidden" data-grp_code="wms">
												<div class="menu_title"
													onclick="tree.toggleMenuItemContent($(this).parents('.root_item'))">
													<div class="root_icon root_icon_collapsed"></div>
													<div data-locale_key="TOC_Layers_User_Added_WMS_Title" data-locale_ref="text" class="localizedElement root_text">WMS Layers</div>
												</div>
												<div class="menu_item_content custom-hidden">
													<ul class="menu_item_content_list"></ul>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div id="tab_search" class="legend_layer_tabs tab-item custom-hidden">
									<div id="search-header">
										<div id="search_result_panel_clear_all_cont" class="custom-hidden btn-icon-text-cont" onclick="javascript:searchResultPanel.clearSearchResultPanel();">										
											<span class="fa-stack">
												<i class="fa fa-search fa-stack-1x"></i>
												<i class="fa fa-ban fa-stack-2x text-danger"></i>
											</span>
											<span data-locale_key="Advanced_Panel_Search_ClearAll" data-locale_ref="text" class="localizedElement btn-icon-text"></span>												
										</div>
									</div>
									
									<div id="searchResultPanel"></div>
								</div>								
							</div>
						</div>
						<!-- END RIGHT PANEL -->

						
						<!-- ************************ -->
						<!-- PANEL ALERTS DIALOG 	  -->
						<!-- ************************ -->
						<% 
						// ALERTS READ PERMISSION
						/*
						 * Simple Alert Panel is available to all user that are not Alerts Admin, 
						 * (ie dont have the ALERTS_READ permission)
						*/
						if (LoginService.currentUserHasPermission(session, Permissions.ALERTS_READ)) { 
						%>
						<div id="full-advance-alerts-panel" class="custom-hidden">
							<div id="full-advance-alerts-panel-header">
<!-- 								<div data-locale_key="Advanced_Panel_Alerts" data-locale_ref="text" class="localizedElement custom-float-left" ></div> -->
<!-- 								<div data-locale_key="General_ClosePanel" data-locale_ref="title" class="localizedElement custom-float-right fa-custom-size" onclick="alerts.closeFullPanel();"><i class="close-collapse-button fa fa-times"></i></div> -->
<!-- 								<div data-locale_key="General_Expand_Collapse" data-locale_ref="title" class="localizedElement" onclick="alerts.toggleShowHideFullPanel();"><i class="close-collapse-button fa fa-chevron-down"></i></div> -->
							</div>
							
							<div class="data-grid-container">
								<div class="data-grid-actions">
								
									<% // ALERTS DOWNLOAD PERMISSION
									if (LoginService.currentUserHasPermission(session, Permissions.ALERTS_DOWNLOAD)) { %>
										<div id="alerts-download" 
										data-layer_name="<%=LoginService.getAlertsDownloadGeoserverLayerName(session)%>" 
										data-username="<%=LoginService.getAlertsDownloadGeoserverUsername(session)%>"
										data-password="<%=LoginService.getAlertsDownloadGeoserverPassword(session)%>"
										data-locale_key="Advanced_Alerts_Download_Alerts" data-locale_ref="title" data-action="download" class="localizedElement grid-toolbar-item" onclick="alerts.toggleActions($(this))"><i class="fa fa-download fa-2x"></i></div>
										
									<% } %>
									
									<!-- Button update status alert -->
									<div id="alerts-modify-status" data-locale_key=Advanced_Alerts_Modify_Alert_Status data-locale_ref="title" data-action="status" class="localizedElement grid-toolbar-item" onclick="alerts.toggleStatusForm($(this))"><i class="fa fa-flag-o fa-2x"></i></div>
									<div id="alerts-modify" data-locale_key="Advanced_Alerts_Modify_Alert" data-locale_ref="title" data-action="modify" class="localizedElement grid-toolbar-item" onclick="alerts.toggleActions($(this))"><i class="fa fa-edit fa-2x"></i></div>
									<div id="alerts-insert" data-locale_key="Advanced_Alerts_Insert_New" data-locale_ref="title" data-action="insert" class="localizedElement grid-toolbar-item" onclick="alerts.toggleActions($(this))"><i class="fa fa-plus fa-2x"></i></div>
									<div id="alerts-selectmap" data-locale_key="Advanced_Alerts_Select" data-locale_ref="title" data-action="selectmap" class="localizedElement grid-toolbar-item ctrlButtons" onclick="alerts.toggleActions($(this))"><i class="fa fa-location-arrow fa-2x"></i></div>
									<div id="alerts-zoom" data-locale_key="General_ZoomToLayer_Button_Title" data-locale_ref="title" class="localizedElement grid-toolbar-item"  onclick="alerts.zoomToLayer();"><i class="fa fa-arrows-alt fa-2x"></i></div>
									<div id="alerts-zoom-selected" data-locale_key="General_ZoomToFeature" data-locale_ref="title" class="localizedElement grid-toolbar-item"  onclick="alerts.zoomToSelected();"><i class="fa fa-search fa-2x"></i></div>
								</div>
								<table class="data-grid"></table>
							</div>
							
							<!-- FORM UPDATE STATUS FOR FULLPANEL -->
							<div id="data-grid-form-status" class="custom-hidden">
<!-- 								<div data-locale_key="Advanced_Alerts_FormHeader_Status" data-locale_ref="text" class="localizedElement data-grid-form-header"></div> -->
								<input type="hidden" id="changestatus-alerts-id">
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_StatusNote" data-locale_ref="text" class="localizedElement status-action-label"></div>
									<textarea rows="3" id="alerts-status-note"></textarea>
								</div>
								
								<div>
									<!-- Accept status (set to ongoing) -->
									<div class="itemform-status">
										<div id="alerts-status-accept" class="localizedElement status-actions" data-status="S" onclick="alerts.status.change($(this));"><i class="fa fa-wrench fa-2x"></i></div>
										<div data-locale_key="Advanced_Alerts_StatusAdmit" data-locale_ref="text" class="localizedElement status-action-label"></div>
									</div>
									
									<!-- Reject status -->
									<div class="itemform-status">
										<div id="alerts-status-reject" class="localizedElement status-actions" data-status="R" onclick="alerts.status.change($(this));"><i class="fa fa-thumbs-down fa-2x"></i></div>
										<div data-locale_key="Advanced_Alerts_StatusReject" data-locale_ref="text" class="localizedElement status-action-label"></div>
									</div>
									
									<!-- Check status -->
									<div class="itemform-status">
										<div id="alerts-status-check" class="localizedElement status-actions" data-status="C" onclick="alerts.status.change($(this));"><i class="fa fa-check fa-2x"></i></div>
										<div data-locale_key="Advanced_Alerts_StatusCheck" data-locale_ref="text" class="localizedElement status-action-label"></div>
									</div>
									
<!-- 											Archive status -->
<!-- 											<div class="itemform-status"> -->
<!-- 												<div id="alerts-status-archive" class="localizedElement status-actions" data-status="C" onclick="alerts.status.change($(this));"><i class="fa fa-archive fa-2x"></i></div> -->
<!-- 												<div data-locale_key="Advanced_Alerts_StatusArchive" data-locale_ref="text" class="localizedElement status-action-label"></div> -->
<!-- 											</div> -->
								</div>										
							</div>
							
							<!-- FORM INSERT ALERTS FOR FULLPANEL -->
							<form id="data-grid-form-insert" data-action="insert" class="custom-hidden alerts-form" onSubmit="return false">
								<div data-locale_key="Advanced_Alerts_FormHeader_Insert" data-locale_ref="text" class="localizedElement data-grid-form-header"></div>
								
								<!-- Name -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Name" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input type="text" id="insert-alerts-name" name="insert-alerts-name" required></div>
								</div>
								
								<!-- Fecha -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Date" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input type="text" id="insert-alerts-date" name="insert-alerts-date" required></div>
								</div>
								
								<!-- Type -->		
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Type" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><select id="insert-alerts-type"></select></div>
								</div>
								
								<!-- Departments -->		
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Department" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><select id="insert-alerts-department" ></select></div>
								</div>
								
								<!-- Description -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Desc" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><textarea id="insert-alerts-desc" required></textarea></div>
								</div>
								
								<!-- Email -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Email" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input type="text" id="insert-alerts-email" name="insert-alerts-email" type="email" required></div>
								</div>
								
								<!-- Telephone -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Phone" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input type="text" id="insert-alerts-phone" name="insert-alerts-phone" required></div>
								</div>
								
								<!-- Mobile -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Mobile" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input type="text" id="insert-alerts-mobile" name="insert-alerts-mobile" required></div>
								</div>
	
								<!-- Panel insert geometry -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_AddPoint" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div id="alerts-insert-typegeoms" class="form-horizontal-panel">
										<div id="alerts-point-insert" data-locale_key="Redline_Add_Point_Button_Title" data-locale_ref="title" data-action="pointDraw" class="localizedElement ctrlButtons" onclick="alerts.selectGeomType($(this));"><i class="fa fa-circle fa-lg"></i></div>
									</div>
<!-- 									<button data-locale_key="Redline_Add_Geometry_From_KML_Button_Title" data-locale_ref="text" class="localizedElement" onclick="alerts.loadGeomFromKMLToggled();"></button> -->
								</div>
								
<!-- 								<div id="insert-alerts-uploadkml-div"> -->
<!-- 								Choose File -->
<!-- 									<div class="itemform"> -->
<!-- 										<div data-locale_key="KMLUpload_Label_ChooseFile" data-locale_ref="text" class="form-label-title localizedElement"></div> -->
<!-- 										<input id="insert-alerts-uploadkml-input-file-text" type="text" readonly> -->
<!-- 										<div id="insert-alerts-uploadkml-choose-file" data-locale_key="KMLUpload_Label_ChooseFileUpload" data-locale_ref="title" class="localizedElement grid-toolbar-item" style="margin:0px;" onclick="alerts.chooseKMLFile();"><i class="fa fa-paperclip fa-2x"></i></div> -->
<!-- 									</div> -->
									
<!-- 									Set projection -->
<!-- 									<div class="itemform no-border"> -->
<!-- 										<div data-locale_key=KMLUpload_Label_SelectProjection data-locale_ref="text" class="form-label-title localizedElement"></div> -->
<!-- 										<select id="insert-alerts-uploadkml-select-proj"> -->
<!-- 											<option value="EPSG:900913">EPSG:900913</option> -->
<!-- 											<option value="EPSG:4326" selected >EPSG:4326</option> -->
<!-- 										</select> -->
<!-- 									</div> -->
<!-- 									<button data-locale_key="KMLUpload_LabelSubmit" data-locale_ref="text" class="localizedElement" onclick="alerts.uploadKMLFile();"></button> -->
<!-- 								</div> -->
								
								<!-- Footer action buttons form -->
								<div class="data-grid-form-footer">
									<button id="data-grid-insert-submit" data-locale_key="General_Save" data-locale_ref="text" class="localizedElement" onclick="alerts.saveData($('#data-grid-form-insert'));"></button>
									<button id="data-grid-insert-cancel" data-locale_key="General_Cancel" data-locale_ref="text" class="localizedElement" onclick="alerts.doAction('viewgrid');"></button>
								</div>
							</form>
							
							<!-- FORM DOWNLOAD ALERTS FOR FULLPANEL -->
							<div id="data-grid-form-download" data-action="download" class="custom-hidden alerts-form">
								<div data-locale_key="Advanced_Alerts_FormHeader_Download" data-locale_ref="text" class="localizedElement data-grid-form-header"></div>
								
								<!-- Fields data form -->
								
								<!-- Date FROM -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Download_Date_From" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<input type="text" id="download-alerts-datefrom">	
								</div>
								
								<!-- Date TO -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Download_Date_To" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<input type="text" id="download-alerts-dateto">
								</div>
								
								<!-- Footer action buttons form -->
								<div class="data-grid-form-footer">
									<button id="data-grid-download-submit" data-locale_key="General_Download" data-locale_ref="text" class="localizedElement" onclick="alerts.downloadZip();"></button>
									<button id="data-grid-download-cancel" data-locale_key="General_Cancel" data-locale_ref="text" class="localizedElement" onclick="alerts.doAction('viewgrid');"></button>
								</div>
							</div>
							
							<!-- FORM UPDATE ALERTS FOR FULLPANEL-->
							<form id="data-grid-form-update" data-action="update" class="custom-hidden alerts-form" onSubmit="return false">
								<div data-locale_key="Advanced_Alerts_FormHeader_Update" data-locale_ref="text" class="localizedElement data-grid-form-header"></div>						
								<!-- Fields data form -->
								<input type="hidden" id="update-alerts-id">

								<!-- Name -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Name" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input type="text" id="update-alerts-name" name="update-alerts-name"></div>
								</div>
								
								<!-- Fecha -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Date" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input type="text" id="update-alerts-date" name="update-alerts-date"></div>
								</div>
								
								<!-- Type -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Type" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><select id="update-alerts-type"></select></div>
								</div>
								
								<!-- Departments -->		
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Department" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><select id="update-alerts-department"></select></div>
								</div>
								
								<!-- Description -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Desc" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><textarea rows="2" id="update-alerts-desc"></textarea></div>
								</div>
								
								<!-- Email -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Email" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input type="text" id="update-alerts-email" name="update-alerts-email" type="email"></div>
								</div>

								<!-- Telephone -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Phone" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input type="text" id="update-alerts-phone" name="update-alerts-phone"></div>
								</div>
								
								<!-- Mobile -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Mobile" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input type="text" id="update-alerts-mobile" name="update-alerts-mobile"></div>
								</div>
								
								<!-- Panel update geometry -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_MovePoint" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div id="alerts-update-modgeom" data-locale_key="Advanced_Alerts_Update_Geom" data-locale_ref="title" data-action="modify" class="localizedElement" onclick="alerts.toggleEditModifyGeom($(this));"><i class="fa fa-arrows"></i></div>
<!-- 									<div class="itemform-inline custom-hidden"> -->
<!-- 										<div data-locale_key="Advanced_Alerts_Label_Form_AddPoint" data-locale_ref="text" class="localizedElement form-label-title"></div> -->
<!-- 										<div id="alerts-update-typegeoms" class="form-horizontal-panel"> -->
<!-- 											<div id="alerts-point-update" data-locale_key="Redline_Add_Point_Button_Title" data-locale_ref="title" data-action="pointDraw" class="localizedElement icon-container-form ctrlButtons"  onclick="alerts.selectGeomType($(this));"><i class="fa fa-circle fa-lg"></i></div> -->
<!-- 										</div> -->
<!-- 									</div> -->
								</div>
								
								<!-- Footer action buttons form -->
								<div class="data-grid-form-footer">
									<button id="data-grid-update-submit" data-locale_key="General_Save" data-locale_ref="text" class="localizedElement" onclick="alerts.saveData($(this).closest('.alerts-form'));"></button>
									<button id="data-grid-update-cancel" data-locale_key="General_Cancel" data-locale_ref="text" class="localizedElement" onclick="alerts.doAction('viewgrid');"></button>
								</div>
							</form>
						</div>
						<% } //END ALERT FULLPANEL %>
						
						
						<!-- ********************* -->
						<!-- CATALOG (CSW REQUEST) -->
						<!-- ********************* -->
						<div id="catalog" class="custom-hidden">
							<div id="csw-catalog-container">
								<div id="catalog-form">
									<!-- FILTER KEYWORD -->
									<div class="itemform">
										<!-- Keyword label-->
										<div data-locale_key="Metadata_Label_Form_SearchKeyWord" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<div>								
											<input id="catalog-input-keyword" type="text" >										
										</div>
									</div>
									
									<!-- FILTER BBOX -->
									<div class="itemform">
										<div data-locale_key="Advanced_Panel_Search_Label_SearchBbox" data-locale_ref="text" class="form-label-title localizedElement"></div>
										<div class="float">
											<input id="csw-search-bbox-deactive" type="radio" value="csw-bbox-deactive" name="csw-search-bbox" checked="checked">
											<div data-locale_key="Advanced_Panel_Search_Label_SearchBboxDeactive" data-locale_ref="text" class="localizedElement"></div>
											
											<input id="csw-search-bbox-active" type="radio" value="csw-bbox-active" name="csw-search-bbox">
											<div style="padding: 3px 5px 0 0;" data-locale_key="Advanced_Panel_Search_Label_SearchBboxActive" data-locale_ref="text" class="localizedElement"></div>
										</div>
										
										<!-- BBOX manager panel -->
										<div id="csw-catalog-bbox-panel" class="custom-hidden">
											<div id="csw-catalog-bbox-selected-buttons">
												<div id="csw-catalog-bbox-select-button" data-locale_key="Advanced_Panel_Search_SearchBboxSelectButton" data-locale_ref="title" class="localizedElement" onclick="controls.catalog.activate();"><i class="fa fa-pencil-square-o fa-medium"></i></div>
												<div id="csw-catalog-bbox-toggle-button" data-locale_key="Advanced_Panel_Search_SearchBboxHideButton" data-locale_ref="title" class="localizedElement custom-hidden" onclick="catalogCsw.toggleVisibilityBbox();"><i class="fa fa-eye fa-medium"></i></div>
											</div>
											<div id="csw-catalog-bbox-selected-text"></div>
										</div>				
									</div>
									
									<!-- Footer (Confirm button) -->
									<div class="advance-searchwfs-footerform">
										<button id="csw-catalog-clean" data-locale_key="General_Clean" data-locale_ref="text" class="localizedElement" style="float:left;"></button>
										<button id="csw-catalog-confirm" data-locale_key="General_Search" data-locale_ref="text" class="localizedElement" ></button>
									</div>
								</div>
								<div id="catalog-results">
									<div id="catalog-results-header" data-locale_key="Metadata_Panel_Csw_Search_Results" data-locale_ref="text" class="localizedElement"></div>			
									<div id="catalog-body"></div>
								</div>
							</div>	
						</div>
						
						<!-- ********************* -->
						<!--FEATURE GRID PANEL -->
						<!-- ********************* -->
						<div id="feature-grid-panel" style="display:none">
						
<!--  							<div id="feature-grid-panel-header"> -->
<!--  								<div id="feature-grid-panel-header-text" data-locale_key="FeatureGridPanel_Search_Header" data-locale_ref="text" class="localizedElement"></div> -->
<!-- 								<div id="feature-grid-panel-toolbar-close" data-locale_key="General_Close" data-locale_ref="title" class="localizedElement" onclick="featureGridPanel.closePanel();"><i class="close-collapse-button fa fa-times"></i></div> -->
<!-- 								<div id="feature-grid-panel-header-collapseBtn"data-locale_key="General_Expand_Collapse" data-locale_ref="title" class="localizedElement" onclick="featureGridPanel.toggleShowHide();"><i class="close-collapse-button fa fa-chevron-down"></i></div> -->
<!-- 							</div> -->
							<div id="feature-grid-panel-container">
	 							<div id="feature-grid-panel-toolbar">
									<button id="feature-grid-panel-toolbar-zoomto" data-locale_key="General_ZoomToFeature" data-locale_ref="text" class="localizedElement" style="display:none;" disabled onclick="featureGridPanel.zoomToSelected();"></button>
	<!--  								<button id="feature-grid-panel-toolbar-close" data-locale_key="General_Close" data-locale_ref="text" class="localizedElement" style="display:none;" onclick="featureGridPanel.closePanel();"></button>  -->
									<div id="feature-grid-panel-max-number-of-feature-reached"></div>
								</div>
	 							<div id="feature-grid-panel-grid-container"></div>
	 						</div>
						</div>
						
						
						<% 
						// ALERTS READ PERMISSION
						/*
						 * Simple Alert Panel is available to all user that are not Alerts Admin, 
						 * (ie dont have the ALERTS_READ permission)
						*/
						if (!LoginService.currentUserHasPermission(session, Permissions.ALERTS_READ)) { 
						%>
						<!-- FORM INSERT ALERTS FOR SIMPLEPANEL -->
						<form id="alert-simple-panel-insert" class="custom-hidden alerts-form" onSubmit="return false;">
<!-- 							<div id="alert-simple-panel-insert-header"> -->
<!-- 								<div data-locale_key="Advanced_Alerts_FormHeader_Insert" data-locale_ref="text" class="localizedElement custom-float-left" ></div> -->
<!-- 								<div data-locale_key="General_ClosePanel" data-locale_ref="title" class="localizedElement custom-float-right fa-custom-size" onclick="alerts.closeNewAlertSimple();"><i class="fa fa-times fa-2x"></i></div> -->
<!-- 							</div> -->
							
							<!-- Name -->
							<div class="itemform">
								<div data-locale_key="Advanced_Alerts_Label_Form_Name" data-locale_ref="text" class="localizedElement form-label-title"></div>
								<div><input type="text" id="simple-insert-alerts-name" name="simple-insert-alerts-name" ></div>
							</div>
							
							<!-- Fecha -->
							<div class="itemform">
								<div data-locale_key="Advanced_Alerts_Label_Form_Date" data-locale_ref="text" class="localizedElement form-label-title"></div>
								<div><input type="text" id="simple-insert-alerts-date" name="simple-insert-alerts-date" ></div>
							</div>
							
							<!-- Type -->		
							<div class="itemform">
								<div data-locale_key="Advanced_Alerts_Label_Form_Type" data-locale_ref="text" class="localizedElement form-label-title mandatoryFormat"></div>
								<div><select id="simple-insert-alerts-type"></select></div>
							</div>
									
							<!-- Departments -->		
							<div class="itemform">
								<div data-locale_key="Advanced_Alerts_Label_Form_Department" data-locale_ref="text" class="localizedElement form-label-title mandatoryFormat"></div>
								<div><select id="simple-insert-alerts-department"></select></div>
							</div>
													
<!-- 							Title -->
<!-- 							<div class="itemform"> -->
<!-- 								<div data-locale_key="Advanced_Alerts_Label_Form_Title" data-locale_ref="text" class="localizedElement form-label-title"></div> -->
<!-- 								<div><input type="text" id="simple-insert-alerts-title" name="simple-insert-alerts-title" required></div> -->
<!-- 							</div> -->
							
							<!-- Description -->
							<div class="itemform">
								<div data-locale_key="Advanced_Alerts_Label_Form_Desc" data-locale_ref="text" class="localizedElement form-label-title"></div>
								<div><textarea id="simple-insert-alerts-desc"></textarea></div>
							</div>
							
							<!-- Email -->
							<div class="itemform">
								<div data-locale_key="Advanced_Alerts_Label_Form_Email" data-locale_ref="text" class="localizedElement form-label-title"></div>
								<div><input type="email" id="simple-insert-alerts-email" name="simple-insert-alerts-email"></div>
							</div>
							
							<!-- Telephone -->
							<div class="itemform">
								<div data-locale_key="Advanced_Alerts_Label_Form_Phone" data-locale_ref="text" class="localizedElement form-label-title"></div>
								<div><input type="text" id="simple-insert-alerts-phone" name="simple-insert-alerts-phone"></div>
							</div>
							
							<!-- Mobile -->
							<div class="itemform">
								<div data-locale_key="Advanced_Alerts_Label_Form_Mobile" data-locale_ref="text" class="localizedElement form-label-title"></div>
								<div><input type="text" id="simple-insert-alerts-mobile" name="simple-insert-alerts-mobile"></div>
							</div>
							
							<!-- Panel insert geometry -->
							<div class="itemform">
								<div data-locale_key="Advanced_Alerts_Label_Form_AddPoint" data-locale_ref="text" class="localizedElement form-label-title"></div>
								<div id="simple-alerts-insert-typegeoms" class="form-horizontal-panel">
									<div id="simple-alerts-point-insert" style="width: auto;" data-locale_key="Redline_Add_Point_Button_Title" data-locale_ref="title" data-action="pointDraw" class="localizedElement ctrlButtons" onclick="alerts.selectGeomType($(this));"><i class="fa fa-circle fa-lg"></i></div>
								</div>
							</div>
							
							<!-- Panel insert geometry -->
							<div class="itemform">
								<div data-locale_key="General_Mandatory_Fields" data-locale_ref="text" class="localizedElement" style="width: auto !important"></div>
							</div>
							
							<!-- Footer action buttons form -->
							<div class="data-grid-form-footer">
								<button id="simple-alerts-insert-submit" data-locale_key="General_Save" data-locale_ref="text" class="localizedElement" onclick="alerts.saveNewAlertSimple();"></button>
								<button id="simple-alerts-insert-cancel" data-locale_key="General_Cancel" data-locale_ref="text" class="localizedElement" onclick="alerts.closeNewAlertSimple();"></button>
							</div>
						</form>
						
						<!-- FORM DETAIL ALERTS FOR SIMPLEPANEL -->
						<div id="alert-simple-panel-detail" class="custom-hidden alerts-form">
							<div class="formFieldScrollable">
								<!-- Name -->		
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Name" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input readonly type="text" id="simple-detail-alerts-name"></input></div>
								</div>
								
								<!-- Fecha -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Date" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input readonly type="text" id="simple-detail-alerts-date"></div>
								</div>
								
								<!-- Type -->		
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Type" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input readonly type="text" id="simple-detail-alerts-type"></input></div>
								</div>
								
								<!-- Departments -->		
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Department" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input readonly id="simple-detail-alerts-department" type="text"></input></div>
								</div>
								
								<!-- Description -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Desc" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><textarea readonly id="simple-detail-alerts-desc"></textarea></div>
								</div>
								
								<!-- Email -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Email" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input readonly type="text" id="simple-detail-alerts-email"></div>
								</div>
								
								<!-- Telephone -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Phone" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input readonly type="text" id="simple-detail-alerts-phone"></div>
								</div>
								
								<!-- Mobile -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Form_Mobile" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input readonly type="text" id="simple-detail-alerts-mobile"></div>
								</div>
								
								<!-- Insertion date -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Insert_Time" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input readonly type="text" id="simple-detail-alerts-insert-date"></input></div>
								</div>
								
								<!-- Current Status -->
								<div class="itemform">
									<div data-locale_key="Advanced_Alerts_Label_Current_Status" data-locale_ref="text" class="localizedElement form-label-title"></div>
									<div><input readonly type="text" id="simple-detail-alerts-current-status"></input></div>
								</div>
							</div>
							<!-- Footer action buttons form -->
							<div class="data-grid-form-footer">
								<button id="simple-alerts-detail-cancel" data-locale_key="General_Cancel" data-locale_ref="text" class="localizedElement" onclick="alerts.closeDetailVerifyPanel();"></button>
							</div>
						</div>
						
						<% } //ENDSIMPLEPANEL ALERTS_READ %>
						
						
						<div id="gis_information_popup" class="custom-hidden"></div>
						
						<div id="gis_layer_information_popup"></div>
						
						<div id="gis-map-overview" class="custom-hidden"></div>
						
					</div>
					<div id="footer">
						<div id="gis_version">Version: 1.1</div>
						<div id="gis_measures" class="custom-hidden"></div>
						
						<!-- Show information message depending on settings -->
						<% if (new SystemSettingService().showInformationMessage()) {%>
							<div id="gis_information_message" data-locale_key="InformationMessage_Icon" data-locale_ref="title" class="localizedElement"><i class="fa fa-info"></i></div>
						<%}%>
						
						<div id="gis_coordinates"></div>
						<div id="gis_current_scalebar"></div>
					</div>
				</div>
			</div>

			<div id="tabs-gn" class="webgisGNTabs">
<!-- 				<iframe id="geonetwork-container-iframe" src="http://geo-mosef.gesp.it/geonetwork/srv/spa/main.home" width="100%" height="100%" class="iframetab"></iframe> -->
<!-- 				<iframe id="geonetwork-container-iframe" src="http://localhost:8080/geonetwork/srv/spa/main.home" width="100%" height="100%" onload="javascript:removeGeonetworkTitle();" class="iframetab"></iframe>	 -->
					<iframe id="geonetwork-container-iframe" src="<%=new SystemSettingService().getGeonetworkUrl()%>/srv/spa/main.home" width="100%" height="100%" onload="javascript:geonetworkLoaded();" class="iframetab"></iframe>
			</div>
		</div>
	</div>
</body>

</html>