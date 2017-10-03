<%-- <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%> --%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ page import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService,it.gesp.geoportal.constants.Permissions,it.gesp.geoportal.dao.entities.User" %>

<!DOCTYPE html>
<html>
<head>
<title>Configuracion de Capas</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%@ include file="admin_config_common_js.jspf" %>

<!--  Ajax Prefilter -->
<script type="text/javascript" src="scripts/jqueryFilter/AjaxPrefilter.js"></script>

<!-- Layer Config scripts and CSS-->
<link rel="stylesheet" href="css/admin/managerLayers.css" type="text/css">
<script type="text/javascript" src="scripts/admin/layers/managerLayers.js"></script>
	
<!-- Capabilities support -->
<script type="text/javascript" src="lib/openlayers/OpenLayers-2.13.1/OpenLayers.js"></script>
<script type="text/javascript" src="scripts/capabilities/getCapabilities.js"></script>


<style>
table.dataTable, table.dataTable th, table.dataTable td {
	white-space: normal !important;
}
</style>

<!-- Start script -->
<script>
	$(document).ready(function(){
	
		var OL_PROXY_URL = GLOBAL_SETTINGS.proxyUrl;
		AjaxPrefilter.activateProxyFilter(OL_PROXY_URL);
		
		/*
		 * Set the OpenLayers Proxy to bypass the Same Origin Policy issue.
		 */
		OpenLayers.ProxyHost = OL_PROXY_URL;
		
		LocaleManager.refreshLocale();
		AdminMenu.setLayerConfigPageActive();
		Utils.enableTooltip();
		mLayers.init();
	});
</script>

<style>
	#layers-dt_wrapper {
	  position: absolute;
	  top: 50px;
	  bottom: 0px;
	  left: 0;
	  right: 0px;
	}
	
	#layers-dt_wrapper .dataTables_scroll {
	  position: absolute;
	  top: 30px;
	  bottom: 0px;
	  left: 0;
	  right: 0px;
	}
	#layers-dt_wrapper .dataTables_scrollBody {
	  overflow: auto;
	  position: absolute;
	  top: 55px;
	  bottom: 0;
	  height: auto !important;
	  overflow: auto;
	}
	
	#layers-dt {
	  width: 100%;
	  position: absolute;
	  bottom: 0px;
	  top: 0px;
	}
	
	#layers-dt_filter {
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
					<div id="layers-add" data-locale_key="Manager_Layers_Button_Add" data-locale_ref="title" class="localizedElement grid-toolbar-item" onclick="mLayers.openAddForm();"><i class="fa fa-plus fa-2x"></i></div>
					<div id="layers-update" data-locale_key="Manager_Layers_Button_Update" data-locale_ref="title" class="localizedElement grid-toolbar-item" onclick="mLayers.openUpdateForm();"><i class="fa fa-edit fa-2x"></i></div>
					<div id="layers-delete" data-locale_key="Manager_Layers_Button_Delete" data-locale_ref="title" class="localizedElement grid-toolbar-item" onclick="mLayers.deleteLayer();"><i class="fa fa-minus fa-2x"></i></div>
				</div>
				<table id="layers-dt"></table>
			</div>
		</jsp:body>
		
	</t:generic_admin_page>
	
	<form id="form-dialog" style="display:none" onSubmit="return false;">
		<div id="form-dialog-header" data-locale_key="Manager_Layers_HeaderForm_Add" data-locale_ref="text" class="localizedElement data-grid-form-header"></div>
		<input type="hidden" id="layer-input-id">
		
		<div class="form-items-container">
			<div class="form-items-left">
				
				<!-- 
				DATOS DE IDENTIFICACION DE LA CAPA EN EL SERVIDOR 
				-->
				<fieldset>
					<legend data-locale_key="Manager_Layers_Fieldset_Legend_Identification" data-locale_ref="text" class="localizedElement"></legend>
					<!-- Fuente de la capa -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_Source" data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><select id="layer-select-source" onchange="mLayers.layerSourceSelected();"></select></div>
					</div>
					
					<!-- Nombre de la capa -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_Name" data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div>
							<input type="text" id="layer-input-name" name="layer-input-name" required>
							<button id="layer-load-wms" data-locale_key="Manager_Layers_Button_NameFromWMS" data-locale_ref="title" class="localizedElement" onclick="mLayers.loadLayersFromWMS();"></button>
						</div>
				</div>
				</fieldset>

				<!-- 
				Datos "Descriptivos de la capa 
				-->
				<fieldset>
					<legend data-locale_key="Manager_Layers_Fieldset_Legend_DataDescription" data-locale_ref="text" class="localizedElement"></legend>
					<!-- Titulo de la capa -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_Title" data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="text" id="layer-input-title" name="layer-input-title" required></div>
					</div>
					
					<!-- Description -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_Desc" data-locale_ref="text" class="localizedElement form-label-title"></div>
							<div><textarea rows="5" id="layer-input-desc"></textarea></div>
					</div>
					
					<!-- Capa oficial? -->
					<div class="itemform">
						<div data-locale_key=Manager_Layers_Label_isExternal data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="checkbox" id="layer-input-is-external" name="layer-input-is-external"></div>
					</div>
					<!-- Responsible Party -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_Responsible" data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="text" id="layer-input-responsible"></div>
					</div>
					<!-- Layer Reference Date -->
					<div class="itemform">
						<div data-locale_key=Manager_Layers_Label_ReferenceDate data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="text" id="layer-input-reference-date" name="layer-input-reference-date"></div>
					</div>
				</fieldset>
				
				<!-- 
					ENLACE A LOS METADATOS 
				-->
				<fieldset>
					<legend data-locale_key="Manager_Layers_Fieldset_Legend_MetadataLink" data-locale_ref="text" class="localizedElement"></legend>
					<!--  Metadata UUID -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_MetadataUUID" data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="text" id="layer-input-metadata_uuid"></div>
					</div>
					
					<!--  iMAGE FORMAT -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_Format" data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div>
							<select id="layer-select-format">
								<option value="image/png">png</option>
								<option value="image/png8">png8</option>
								<option value="image/jpeg">jpeg</option>
							</select>
						</div>
					</div>
				</fieldset>
				
				<fieldset>
					<legend data-locale_key="Manager_Layers_Fieldset_Legend_LayerAccessMode" data-locale_ref="text" class="localizedElement"></legend>
					<!-- SLD -->
					<div class="itemform">
						<div data-locale_key=Manager_Layers_Label_Override_SldUrl data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="checkbox" id="layer-input-attribute-override-sldurl" name="layer-input-attribute-override-sldurl"></div>
					</div>
					
					<!--  SLD Url -->
					<div class="itemform">
						<div data-locale_key=Manager_Layers_Label_SldUrl data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="text" id="layer-input-attribute-sldurl" name="layer-input-attribute-sldurl"></div>
					</div>
					
					<!--  Cache Url -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_CacheUrl" data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input id="layer-input-cacheurl" name="layer-input-cacheurl"></div>
					</div>
					
					<!--  Cache Workspace -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_CacheWorkspace" data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input id="layer-input-cacheworkspace" name="layer-input-cacheworkspace"></div>
					</div>
					
					<!--  Cache Enables -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_CacheEnabled" data-locale_ref="text" class="localizedElement form-label-title label-checkbox"></div>
						<div><input type="checkbox" id="layer-input-cacheEnabled"></div>
					</div>
					
					<!-- Tiled -->
					<div class="itemform">					
						<div data-locale_key="Manager_Layers_Label_Tiled" data-locale_ref="text" class="localizedElement form-label-title label-checkbox"></div>
						<div><input type="checkbox" id="layer-input-tiled"></div>
	<!-- 					<div data-locale_key="Manager_Layers_Label_Tiled_Size_X" data-locale_ref="text" class="localizedElement form-label-title label-checkbox"></div> -->
	<!-- 					<div><input type="digits" id="layer-input-tiled-sizex" name="layer-input-tiled-sizex" disabled></div> -->
						
	<!-- 					<div data-locale_key="Manager_Layers_Label_Tiled_Size_Y" data-locale_ref="text" class="localizedElement form-label-title label-checkbox"></div> -->
	<!-- 					<div><input type="digits" id="layer-input-tiled-sizey" name="layer-input-tiled-sizey" disabled></div> -->
					</div>
				
				</fieldset>
				
				<!-- 
					MODALIDAD DE PUBLICACION DE LA CAPA EN EL GEOPORTAL 
				-->
				<fieldset>
					<legend data-locale_key="Manager_Layers_Fieldset_Legend_GeoportalLayerPublicationMode" data-locale_ref="text" class="localizedElement"></legend>
				
					<!-- baselayer -->
					<div class="itemform">					
						<div data-locale_key="Manager_Layers_Label_Baselayer" data-locale_ref="text" class="localizedElement form-label-title label-checkbox"></div>
						<div><input type="checkbox" id="layer-input-baselayer"></div>
					</div>
					
					<!-- opacity -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_Opacity" data-locale_ref="text" class="localizedElement form-label-title label-checkbox"></div>
						<div id="layer-input-opacity" class="item-slider-transparency"></div>
					</div>
					
					<!-- Downloadable -->
					<div class="itemform">
						<div data-locale_key=Manager_Layers_Label_isDownloadable data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="checkbox" id="layer-input-downloadable" name="layer-input-downloadable"></div>
					</div>
					
					<!-- WFS Search enabled -->
					<div class="itemform">
						<div data-locale_key=Manager_Layers_Label_WfsSearcheEnabled data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="checkbox" id="layer-input-wfsSearchEnabled" name="layer-input-wfsSearchEnabled"></div>
					</div>
					
					<!-- Attribute Name for Info -->
					<div class="itemform">
						<div data-locale_key=Manager_Layers_Label_AttributeNameForInfo data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="text" id="layer-input-attribute-name-for-info" name="layer-input-attribute-name-for-info"></div>
					</div>
					
					<!-- SHOW INFO DIALOG -->
					<div class="itemform">					
						<div data-locale_key="Manager_Layers_Label_ShowInfoDialog" data-locale_ref="text" class="localizedElement form-label-title label-checkbox"></div>
						<div><input type="checkbox" id="layer-input-show_info_dialog"></div>
					</div>
				</fieldset>
				
				<!-- 
					DISTRIBUTION INFORMATION 
				-->
				<fieldset>
					<legend data-locale_key="Manager_Layers_Fieldset_Legend_DistributionInfo" data-locale_ref="text" class="localizedElement"></legend>
					<!--  WFS URL -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_WfsUrl" data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="text" id="layer-input-wfs_url"></div>
					</div>
					
					<!--  WCS URL -->
					<div class="itemform">
						<div data-locale_key="Manager_Layers_Label_WcsUrl" data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="text" id="layer-input-wcs_url"></div>
					</div>
				</fieldset>
			</div>
		</div>
	</form>
	
	<div id="form-del-dialog"></div>
	<div id="select-layer-fromwms" style="display:none">
		<div data-locale_key="Manager_Layers_HeaderSelectLayerWms" data-locale_ref="text" class="localizedElement data-grid-form-header"></div>
		<div id="layer-list-wms"></div>
	</div>

</body>
</html>
