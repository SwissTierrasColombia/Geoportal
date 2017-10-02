package it.gesp.geoportal.servlets;

import it.gesp.geoportal.PaginationObject;
import it.gesp.geoportal.constants.Permissions;
import it.gesp.geoportal.dao.dto.LayerDTO;
import it.gesp.geoportal.dao.entities.Layer;
import it.gesp.geoportal.dao.entities.LayerSource;
import it.gesp.geoportal.dao.entities.LayerType;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.exceptions.DataInvalidException;
import it.gesp.geoportal.exceptions.OperationInvalidException;
import it.gesp.geoportal.exceptions.PermissionInvalidException;
import it.gesp.geoportal.locale.LocaleUtils;
import it.gesp.geoportal.services.LayerService;
import it.gesp.geoportal.services.LoginService;
import it.gesp.geoportal.utils.Utils;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

public class LayerConfigServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(LayerConfigServlet.class);
	private ResourceBundle dbMessages = LocaleUtils.getDBMessages();
	//private ResourceBundle userMessages = LocaleUtils.getUserMessages("en");

	public LayerConfigServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doWork(request, response);
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doWork(request, response);
	}

	@SuppressWarnings("unchecked")
	private void doWork(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession currentSession = request.getSession(false);
		
		String currentLanguage = LoginService.getCurrentLanguageFromSessionOrDefault(currentSession);
		ResourceBundle userMessages = LocaleUtils.getUserMessages(currentLanguage);
		
		User currentUser = LoginService.getLoggedInUserFromSession(currentSession);
		//currentUser = new UserService().getUserByUsername("mosef", true);
		
		LayerService layerService = new LayerService();
				
		PrintWriter w = response.getWriter();
		String jsonRes = null;

		String oper = request.getParameter("oper");

		/*
		 * Check that the user is connected
		 */
		if (currentUser == null) {
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_NOT_LOGGED_IN"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
			return;
		}

		try {

			/*
			 * LAYERS FOR A MAP
			 */
			if ("layers".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				//List<Layer> layers = layerService.getLayersByMapId(idMap);
				List<Layer> layers = layerService.getLayers(false);
				PaginationObject<Layer> paginationObject = PaginationObject.createFromList(layers);
				jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(paginationObject, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * LAYERS FOR A MAP
			 */
			else if ("layerDetailList".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				/*
				 * Google, Bing, OSM
				 */
				boolean showCommercialProviders = false;
				
				List<LayerDTO> layers = layerService.getLayerDetailsList(showCommercialProviders);
				PaginationObject<Layer> paginationObject = PaginationObject.createFromList(layers);
				jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(paginationObject, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * LAYERDETAIL
			 */
			else if ("layerDetail".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				//layerId
				int layerId = -1;
				try {
					String layerIdStr = request.getParameter("layerId");
					layerId = Integer.parseInt(layerIdStr);
				} catch (Exception x) {
					log.debug("Error parsing layerId parameter");
					throw new DataInvalidException();
				}
				
				Layer layer = layerService.getLayerDetails(layerId);
				
				jsonRes = GeoportalResponse.createSuccessResponse(layer, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * ADD WMS LAYER
			 */
			else if ("addWMSLayer".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				//Layer name
				String layerName = request.getParameter("layerName");
				if (Utils.isNullOrEmpty(layerName)) {
					log.debug("Error parsing layerName parameter");
					throw new DataInvalidException();
				}
				
				//Layer title
				String layerTitle = request.getParameter("layerTitle");
				if (Utils.isNullOrEmpty(layerTitle)) {
					log.debug("Error parsing layerTitle parameter");
					throw new DataInvalidException();
				}
				
				//Layer description (can be null)
				String layerDescription = request.getParameter("layerDescription");
				
				//Layer responsible (can be null)
				String layerResponsible = request.getParameter("responsible");
				
				//Metadata UUID ( can be null)
				String metadataUuid = request.getParameter("metadataUuid");
				
				//Wfs Url
				String wfsUrl = request.getParameter("wfsUrl");
				
				//Wcs Url
				String wcsUrl = request.getParameter("wcsUrl");
				
				//external (defaults to false)
				boolean external = false;
				try {
					String externalStr = request.getParameter("external");
					if (!Utils.isNullOrEmpty(externalStr)) {
						external = Boolean.parseBoolean(externalStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing external parameter");
					throw new DataInvalidException();
				}
				
				//downloadable (defaults to false)
				boolean downloadable = false;
				try {
					String downloadableStr = request.getParameter("downloadable");
					if (!Utils.isNullOrEmpty(downloadableStr)) {
						downloadable = Boolean.parseBoolean(downloadableStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing downloadable parameter");
					throw new DataInvalidException();
				}
				
				//Layer mode (defaults to single)
				String layerMode = "single";
				if (request.getParameter("layerMode") != null) {
					layerMode = request.getParameter("layerMode");
				}
				
				//LayerSourceId (can be null)
				Integer layerSourceId = null;
				try {
					String layerSourceIdStr = request.getParameter("layerSourceId");
					if (!Utils.isNullOrEmpty(layerSourceIdStr)) {
						layerSourceId = Integer.parseInt(layerSourceIdStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing layerSourceId parameter");
					throw new DataInvalidException();
				}

				//Base layer (defaults to false)
				boolean baseLayer = false;
				try {
					String isBaseLayerStr = request.getParameter("baseLayer");
					if (!Utils.isNullOrEmpty(isBaseLayerStr)) {
						baseLayer = Boolean.parseBoolean(isBaseLayerStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing baseLayer parameter");
					throw new DataInvalidException();
				}
				
				//showInfoDialog (defaults to true)
				boolean showInfoDialog = true;
				try {
					String showInfoDialogStr = request.getParameter("showInfoDialog");
					if (!Utils.isNullOrEmpty(showInfoDialogStr)) {
						showInfoDialog = Boolean.parseBoolean(showInfoDialogStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing showInfoDialog parameter");
					throw new DataInvalidException();
				}
				
				//SingleTile (defaults to false) 
				boolean singleTile = false;
				try {
					String singleTileStr = request.getParameter("singleTile");
					if (!Utils.isNullOrEmpty(singleTileStr)) {
						singleTile = Boolean.parseBoolean(singleTileStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing singleTile parameter");
					throw new DataInvalidException();
				}
				
				//imageFormat
				String imageFormat = request.getParameter("imageFormat");
				if (Utils.isNullOrEmpty(imageFormat)) {
					log.debug("Error parsing imageFormat parameter");
					throw new DataInvalidException();
				}
				
				//opacity
				double opacity = 1;
				try {
					String opacityStr = request.getParameter("opacity");
					if (!Utils.isNullOrEmpty(opacityStr)) {
						opacity = Double.parseDouble(opacityStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing opacity parameter");
					throw new DataInvalidException();
				}
				
				//attributeNameForInfo (can be null)
				String attributeNameForInfo = request.getParameter("attributeNameForInfo");
				
				//referenceDate (can be null)
				String referenceDate = request.getParameter("referenceDate");
				
				//CacheURL (can be null)
				String cacheUrl = request.getParameter("cacheUrl");
				
				//CacheWorkspace (can be null)
				String cacheWorkspace = request.getParameter("cacheWorkspace");
				
				//CacheEnabled (defaults to false)
				boolean cacheEnabled = false;
				try {
					String cacheEnabledStr = request.getParameter("cacheEnabled");
					if (!Utils.isNullOrEmpty(cacheEnabledStr)) {
						cacheEnabled = Boolean.parseBoolean(cacheEnabledStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing cacheEnabled parameter");
					throw new DataInvalidException();
				}
				
				//WfsSearchEnabled (defaults to false)
				boolean wfsSearchEnabled = false;
				try {
					String wfsSearchEnabledStr = request.getParameter("wfsSearchEnabled");
					if (!Utils.isNullOrEmpty(wfsSearchEnabledStr)) {
						wfsSearchEnabled = Boolean.parseBoolean(wfsSearchEnabledStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing wfsSearchEnabled parameter");
					throw new DataInvalidException();
				}
				
				/*
				 * Test that if caching is enabled, the cacheUrl is setup.
				 */
				if (cacheEnabled && (cacheUrl == null || "".equals(cacheUrl.trim()))) {
					log.debug("cacheEnabled is true but no cacheUrl specified.");
					throw new DataInvalidException();
				}
				
				//SLDURL (can be null)
				String sldUrl = request.getParameter("sldUrl");
				
				//sldOverrideEnabled (defaults to false)
				boolean sldOverrideEnabled = false;
				try {
					String sldOverrideEnabledStr = request.getParameter("sldOverrideEnabled");
					if (!Utils.isNullOrEmpty(sldOverrideEnabledStr)) {
						sldOverrideEnabled = Boolean.parseBoolean(sldOverrideEnabledStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing sldOverrideEnabled parameter");
					throw new DataInvalidException();
				}
				/*
				 * Test that if sldOverride is enabled, the sldUrl is setup.
				 */
				if (sldOverrideEnabled && (sldUrl == null || "".equals(sldUrl.trim()))) {
					log.debug("sldOverrideEnabled is true but no sldUrl specified.");
					throw new DataInvalidException();
				}
				
				Layer layer = new Layer();
				layer.setLayerDescription(layerDescription);
				layer.setResponsible(layerResponsible);
				layer.setMetadataUuid(metadataUuid);
				layer.setWfsUrl(wfsUrl);
				layer.setWcsUrl(wcsUrl);
				layer.setExternal(external);
				layer.setDownloadable(downloadable);
				layer.setLayerName(layerName);
				layer.setLayerTitle(layerTitle);
				layer.setBaseLayer(baseLayer);
				layer.setAttributeNameForInfo(attributeNameForInfo);
				layer.setReferenceDate(referenceDate);
				
				if (!Utils.isNullOrEmpty(layerMode)) {
					layer.setMode(layerMode);
				}
				
				layer.setWfsSearchEnabled(wfsSearchEnabled);
				layer.setShowInfoDialog(showInfoDialog);
				
				layerService.addWMSLayer(layer, layerSourceId, imageFormat, opacity, singleTile, cacheUrl, cacheWorkspace, cacheEnabled, sldUrl, sldOverrideEnabled);
				
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * UPDATE WMS LAYER
			 */
			else if ("updateWMSLayer".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				//layerId
				int layerId = -1;
				try {
					String layerIdStr = request.getParameter("layerId");
					layerId = Integer.parseInt(layerIdStr);
				} catch (Exception x) {
					log.debug("Error parsing layerId parameter");
					throw new DataInvalidException();
				}
				
				//ForceUpdate (false by default)
				boolean forceUpdate = false;
				try {
					String forceUpdateStr = request.getParameter("forceUpdate");
					if (!Utils.isNullOrEmpty(forceUpdateStr)) {
						forceUpdate = Boolean.parseBoolean(forceUpdateStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing forceUpdate parameter");
					throw new DataInvalidException();
				}
				
				//Layer name
				String layerName = request.getParameter("layerName");
				if (Utils.isNullOrEmpty(layerName)) {
					log.debug("Error parsing layerName parameter");
					throw new DataInvalidException();
				}
				
				//Layer title
				String layerTitle = request.getParameter("layerTitle");
				if (Utils.isNullOrEmpty(layerTitle)) {
					log.debug("Error parsing layerTitle parameter");
					throw new DataInvalidException();
				}
				
				//Layer description (can be null)
				String layerDescription = request.getParameter("layerDescription");
				
				//Layer responsible (can be null)
				String layerResponsible = request.getParameter("responsible");
				
				//Metadata UUID ( can be null)
				String metadataUuid = request.getParameter("metadataUuid");
				
				//Wfs Url
				String wfsUrl = request.getParameter("wfsUrl");
				
				//Wcs Url
				String wcsUrl = request.getParameter("wcsUrl");
				
				//external (defaults to false)
				boolean external = false;
				try {
					String externalStr = request.getParameter("external");
					if (!Utils.isNullOrEmpty(externalStr)) {
						external = Boolean.parseBoolean(externalStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing external parameter");
					throw new DataInvalidException();
				}
				
				//downloadable (defaults to false)
				boolean downloadable = false;
				try {
					String downloadableStr = request.getParameter("downloadable");
					if (!Utils.isNullOrEmpty(downloadableStr)) {
						downloadable = Boolean.parseBoolean(downloadableStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing downloadable parameter");
					throw new DataInvalidException();
				}
				
				//Layer mode (defaults to single)
				String layerMode = "single";
				if (request.getParameter("layerMode") != null) {
					layerMode = request.getParameter("layerMode");
				}
				
				//LayerSourceId (can be null)
				Integer layerSourceId = null;
				try {
					String layerSourceIdStr = request.getParameter("layerSourceId");
					if (!Utils.isNullOrEmpty(layerSourceIdStr)) {
						layerSourceId = Integer.parseInt(layerSourceIdStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing layerSourceId parameter");
					throw new DataInvalidException();
				}

				//Base layer (defaults to false)
				boolean baseLayer = false;
				try {
					String isBaseLayerStr = request.getParameter("baseLayer");
					if (!Utils.isNullOrEmpty(isBaseLayerStr)) {
						baseLayer = Boolean.parseBoolean(isBaseLayerStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing baseLayer parameter");
					throw new DataInvalidException();
				}
				
				//showInfoDialog (defaults to true)
				boolean showInfoDialog = true;
				try {
					String showInfoDialogStr = request.getParameter("showInfoDialog");
					if (!Utils.isNullOrEmpty(showInfoDialogStr)) {
						showInfoDialog = Boolean.parseBoolean(showInfoDialogStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing showInfoDialog parameter");
					throw new DataInvalidException();
				}
				
				//SingleTile (defaults to false) 
				boolean singleTile = false;
				try {
					String singleTileStr = request.getParameter("singleTile");
					if (!Utils.isNullOrEmpty(singleTileStr)) {
						singleTile = Boolean.parseBoolean(singleTileStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing singleTile parameter");
					throw new DataInvalidException();
				}
				
				//imageFormat
				String imageFormat = request.getParameter("imageFormat");
				if (Utils.isNullOrEmpty(imageFormat)) {
					log.debug("Error parsing imageFormat parameter");
					throw new DataInvalidException();
				}
				
				//opacity
				double opacity = 1;
				try {
					String opacityStr = request.getParameter("opacity");
					if (!Utils.isNullOrEmpty(opacityStr)) {
						opacity = Double.parseDouble(opacityStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing opacity parameter");
					throw new DataInvalidException();
				}
				
				//attributeNameForInfo (can be null)
				String attributeNameForInfo = request.getParameter("attributeNameForInfo");
				
				//referenceDate (can be null)
				String referenceDate = request.getParameter("referenceDate");
				
				//CacheURL (can be null)
				String cacheUrl = request.getParameter("cacheUrl");
				
				//CacheWorkspace (can be null)
				String cacheWorkspace = request.getParameter("cacheWorkspace");
				
				//CacheEnabled (defaults to false)
				boolean cacheEnabled = false;
				try {
					String cacheEnabledStr = request.getParameter("cacheEnabled");
					if (!Utils.isNullOrEmpty(cacheEnabledStr)) {
						cacheEnabled = Boolean.parseBoolean(cacheEnabledStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing cacheEnabled parameter");
					throw new DataInvalidException();
				}
				
				//WfsSearchEnabled (defaults to false)
				boolean wfsSearchEnabled = false;
				try {
					String wfsSearchEnabledStr = request.getParameter("wfsSearchEnabled");
					if (!Utils.isNullOrEmpty(wfsSearchEnabledStr)) {
						wfsSearchEnabled = Boolean.parseBoolean(wfsSearchEnabledStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing wfsSearchEnabled parameter");
					throw new DataInvalidException();
				}
				
				/*
				 * Test that if caching is enabled, the cacheUrl is setup.
				 */
				if (cacheEnabled && (cacheUrl == null || "".equals(cacheUrl.trim()))) {
					log.debug("cacheEnabled is true but no cacheUrl specified.");
					throw new DataInvalidException();
				}
				
				//SLDURL (can be null)
				String sldUrl = request.getParameter("sldUrl");
				
				//sldOverrideEnabled (defaults to false)
				boolean sldOverrideEnabled = false;
				try {
					String sldOverrideEnabledStr = request.getParameter("sldOverrideEnabled");
					if (!Utils.isNullOrEmpty(sldOverrideEnabledStr)) {
						sldOverrideEnabled = Boolean.parseBoolean(sldOverrideEnabledStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing sldOverrideEnabled parameter");
					throw new DataInvalidException();
				}
				/*
				 * Test that if sldOverride is enabled, the sldUrl is setup.
				 */
				if (sldOverrideEnabled && (sldUrl == null || "".equals(sldUrl.trim()))) {
					log.debug("sldOverrideEnabled is true but no sldUrl specified.");
					throw new DataInvalidException();
				}
				
				Layer newLayer = new Layer();
				newLayer.setLayerDescription(layerDescription);
				newLayer.setResponsible(layerResponsible);
				newLayer.setMetadataUuid(metadataUuid);
				newLayer.setWfsUrl(wfsUrl);
				newLayer.setWcsUrl(wcsUrl);
				newLayer.setExternal(external);
				newLayer.setDownloadable(downloadable);
				newLayer.setLayerName(layerName);
				newLayer.setLayerTitle(layerTitle);
				newLayer.setBaseLayer(baseLayer);
				
				if (!Utils.isNullOrEmpty(layerMode)) {
					newLayer.setMode(layerMode);
				}
				
				newLayer.setAttributeNameForInfo(attributeNameForInfo);
				newLayer.setReferenceDate(referenceDate);
				
				newLayer.setWfsSearchEnabled(wfsSearchEnabled);
				newLayer.setShowInfoDialog(showInfoDialog);
				
				layerService.updateWMSLayer(layerId, newLayer, layerSourceId, imageFormat, opacity, singleTile, cacheUrl, cacheWorkspace, cacheEnabled, sldUrl, sldOverrideEnabled, forceUpdate);
				
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * DELETE LAYER
			 */
			else if ("deleteLayer".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				//layerId
				int layerId = -1;
				try {
					String layerIdStr = request.getParameter("layerId");
					layerId = Integer.parseInt(layerIdStr);
				} catch (Exception x) {
					log.debug("Error parsing layerId parameter");
					throw new DataInvalidException();
				}
				
				//ForceDeletion (false by default)
				boolean forceDeletion = false;
				try {
					String forceDeletionStr = request.getParameter("forceDeletion");
					if (!Utils.isNullOrEmpty(forceDeletionStr)) {
						forceDeletion = Boolean.parseBoolean(forceDeletionStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing forceDeletion parameter");
					throw new DataInvalidException();
				}
				
				layerService.deleteLayer(layerId, forceDeletion);
				
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * LAYERSOURCES
			 */
			else if ("layerSources".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				List<LayerSource> layerSources = layerService.getLayerSources();
				PaginationObject<LayerSource> paginationObject = PaginationObject.createFromList(layerSources);
				jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(paginationObject, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * ADD LAYERSOURCE
			 */
			else if ("addLayerSource".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				//URL
				String url = request.getParameter("url");
				if (Utils.isNullOrEmpty(url)) {
					log.debug("Error parsing url parameter");
					throw new DataInvalidException();
				}
				
				//Cache URL (can be null)
				String cacheUrl = request.getParameter("cacheUrl");
				
				
				//Name
				String name = request.getParameter("name");
				if (Utils.isNullOrEmpty(name)) {
					log.debug("Error parsing name parameter");
					throw new DataInvalidException();
				}
				
				//description (can be null)
				String description = request.getParameter("description");
				
				
				//enabled_external_wms_list (false by default)
				boolean addToExternalWmsList = false;
				try {
					String addToExternalWmsListStr = request.getParameter("addToExternalWmsList");
					if (!Utils.isNullOrEmpty(addToExternalWmsListStr)) {
						addToExternalWmsList = Boolean.parseBoolean(addToExternalWmsListStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing addToExternalWmsList parameter");
					throw new DataInvalidException();
				}
				
				LayerSource ls = new LayerSource();
				ls.setLayerSourceDescription(description);
				ls.setLayerSourceName(name);
				ls.setUrl(url);
				ls.setAddToExternalWmsList(addToExternalWmsList);
				ls.setCacheUrl(cacheUrl);
				layerService.addLayerSource(ls);
				
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * UPDATE LAYERSOURCE
			 */
			else if ("updateLayerSource".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				//layerSourceId
				int layerSourceId = -1;
				try {
					String layerSourceIdStr = request.getParameter("layerSourceId");
					layerSourceId = Integer.parseInt(layerSourceIdStr);
				} catch (Exception x) {
					log.debug("Error parsing layerSourceId parameter");
					throw new DataInvalidException();
				}
				
				//URL
				String url = request.getParameter("url");
				if (Utils.isNullOrEmpty(url)) {
					log.debug("Error parsing url parameter");
					throw new DataInvalidException();
				}
				
				//Cache URL (can be null)
				String cacheUrl = request.getParameter("cacheUrl");
				
				//Name
				String name = request.getParameter("name");
				if (Utils.isNullOrEmpty(name)) {
					log.debug("Error parsing name parameter");
					throw new DataInvalidException();
				}
				
				//description (can be null)
				String description = request.getParameter("description");
				
				//enabled_external_wms_list (false by default)
				boolean addToExternalWmsList = false;
				try {
					String addToExternalWmsListStr = request.getParameter("addToExternalWmsList");
					if (!Utils.isNullOrEmpty(addToExternalWmsListStr)) {
						addToExternalWmsList = Boolean.parseBoolean(addToExternalWmsListStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing addToExternalWmsList parameter");
					throw new DataInvalidException();
				}
				
				layerService.updateLayerSource(layerSourceId, url, name, description, cacheUrl, addToExternalWmsList);
				
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * DELETE LAYERSOURCE
			 */
			else if ("deleteLayerSource".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				//layerSourceId
				int layerSourceId = -1;
				try {
					String layerSourceIdStr = request.getParameter("layerSourceId");
					layerSourceId = Integer.parseInt(layerSourceIdStr);
				} catch (Exception x) {
					log.debug("Error parsing layerSourceId parameter");
					throw new DataInvalidException();
				}
				
				//ForceDeletion (false by default)
				boolean forceDeletion = false;
				try {
					String forceDeletionStr = request.getParameter("forceDeletion");
					if (!Utils.isNullOrEmpty(forceDeletionStr)) {
						forceDeletion = Boolean.parseBoolean(forceDeletionStr);
					}
				} catch (Exception x) {
					log.debug("Error parsing baseLayer parameter");
					throw new DataInvalidException();
				}
				
				layerService.deleteLayerSource(layerSourceId, forceDeletion);
				
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * LAYERTYPES
			 */
			else if ("layerTypes".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				List<LayerType> layerTypes = layerService.getLayerTypes();
				PaginationObject<LayerType> paginationObject = PaginationObject.createFromList(layerTypes);
				jsonRes = GeoportalResponse.createSuccessResponse(paginationObject, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			else if ("test".equalsIgnoreCase(oper)) {
				layerService.test();
			}
			else {
				log.debug("Wrong OPER param");
				throw new DataInvalidException();
			}

		} catch (DataInvalidException de) {
			log.debug("Data invalid exception.", de);
			if (de.getMessage() != null) {
				jsonRes = GeoportalResponse.createErrorResponse(de.getMessage());
			} else {
				jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("MISSING_PARAMETERS"));
			}
			ServletUtils.writeAndFlush(log, w, jsonRes);

		} catch (PermissionInvalidException pei) {
			log.debug("Permssion invalid exception", pei);
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
		} catch (OperationInvalidException oie) {
			try {
				String realMess = MessageFormat.format(userMessages.getString(oie.getExceptionCode()), (Object[])oie.getArgs());
				log.debug("OperationInvalidException", oie);
				jsonRes = GeoportalResponse.createErrorResponse(realMess, oie.getExceptionCode());
			} catch (Exception x) {
				jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("GENERIC_ERROR"));
			}
			ServletUtils.writeAndFlush(log, w, jsonRes);
			
		} catch (Exception x) {
			log.debug("Generic exception", x);
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("GENERIC_ERROR"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
		}

	}

}
