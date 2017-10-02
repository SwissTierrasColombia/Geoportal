package it.gesp.geoportal.services;

import it.gesp.geoportal.constants.MapSettings;
import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.entities.Layer;
import it.gesp.geoportal.dao.entities.LayerConfig;
import it.gesp.geoportal.dao.entities.LayerGroup;
import it.gesp.geoportal.dao.entities.LayerGroupLayer;
import it.gesp.geoportal.dao.entities.Map;
import it.gesp.geoportal.dao.repositories.LayerGroupRepository;
import it.gesp.geoportal.dao.repositories.MapRepository;
import it.gesp.geoportal.json.JsonFactory;
import it.gesp.geoportal.utils.Utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.hibernate.Session;

import com.google.gson.Gson;

public class MapConfigService {
	private static final Logger log = Logger.getLogger(MapConfigService.class);
	
	private java.util.Map<String, Object> getMapToolsConfig(Map currentMap) {
		java.util.Map<String, Object> mapToolsConfigMap = new LinkedHashMap<String, Object>();
		
		mapToolsConfigMap.put("scalebar", getScaleBarConfig());
		mapToolsConfigMap.put("loadingPanel", getLoadingPanelConfig());
		mapToolsConfigMap.put("mouseCoordinates", getMouseCoordinatesConfig());
		mapToolsConfigMap.put("measures", getMeasuresConfig());
		mapToolsConfigMap.put("overview", getOverviewConfig(currentMap));
		
		return mapToolsConfigMap;
	}
	
	private java.util.Map<String, Object>  getScaleBarConfig() {
		java.util.Map<String, Object> scaleBarMap = new LinkedHashMap<String, Object>();
		
		scaleBarMap.put("enabled", new Boolean(true));
		scaleBarMap.put("displaySystem", "metric");
		scaleBarMap.put("divisions", 2);
		scaleBarMap.put("subdivisions", 2);
		scaleBarMap.put("singleLine", new Boolean(false));
		
		return scaleBarMap;
	}
	
	private java.util.Map<String, Object>  getLoadingPanelConfig() {
		java.util.Map<String, Object> loadingPanelMap = new LinkedHashMap<String, Object>();
		
		loadingPanelMap.put("enabled", new Boolean(false));
		return loadingPanelMap;
	}
	
	private java.util.Map<String, Object>  getMouseCoordinatesConfig() {
		java.util.Map<String, Object> mouseCoordinatesMap = new LinkedHashMap<String, Object>();
		
		mouseCoordinatesMap.put("enabled", new Boolean(true));
		mouseCoordinatesMap.put("numDigits", 0);
		
		return mouseCoordinatesMap;
	}
	
	private java.util.Map<String, Object>  getOverviewConfig(Map currentMap) {
		java.util.Map<String, Object> measuresMap = new LinkedHashMap<String, Object>();
		
		measuresMap.put("enabled", currentMap.isShowOverview());
		return measuresMap;
	}
	
	private java.util.Map<String, Object>  getMeasuresConfig() {
		java.util.Map<String, Object> measuresMap = new LinkedHashMap<String, Object>();
		
		measuresMap.put("enabled", new Boolean(false));
		return measuresMap;
	}
	
	private java.util.Map<String, Object> createLayerJsonMap(Layer layer, String groupCode, String groupName, long layerPosition, boolean enabledByDefault) {
		java.util.Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		
		String typeName = layer.getLayerType().getTypeName();
		
		/*
		 * This is required for WMS...
		 */
		if ("wms".equals(typeName)) {
			LayerConfig layerConfig = layer.getLayerConfig();
			resultMap.put("url", layer.getLayerSource().getUrl());
			resultMap.put("wmsOptions", layerConfig.getParsedOptions());
			resultMap.put("olOptions", layerConfig.getParsedOlOptions());
			resultMap.put("group", groupCode);
			
			//Description
			resultMap.put("description", layer.getLayerDescription());
			
			//Responsible
			resultMap.put("responsible", layer.getResponsible());
			
			//isExternal
			resultMap.put("external", layer.isExternal());
			
			//isDownloadable
			resultMap.put("downloadable", layer.isDownloadable());
			
			//Wfs search enabled
			resultMap.put("wfsSearchEnabled", layer.isWfsSearchEnabled());
			
			//Show Info dialog
			resultMap.put("showInfoDialog", layer.isShowInfoDialog());
			
			//Sld and Sld Override
			if (layerConfig.isSldOverrideEnabled()) {
				resultMap.put("sldUrl", layerConfig.getSldUrl());
			}
			
			/*
			 * Handle cache url
			 * 
			 * TODO: Handle cache url in a better way,,,, 
			 */
			if (layerConfig.isCacheEnabled()) {
				resultMap.put("cacheUrl", layerConfig.getCacheUrl());
				resultMap.put("cacheWorkspace", layerConfig.getCacheWorkspace());
			}
			
			resultMap.put("attributeNameForInfo", layer.getAttributeNameForInfo());
			resultMap.put("referenceDate", layer.getReferenceDate());
			
			//metadataUuid
			if (!Utils.isNullOrEmpty(layer.getMetadataUuid())) {
				resultMap.put("metadataUrl", layer.getMetadataUuid());	
			}
			
			//wfsUrl
			if (!Utils.isNullOrEmpty(layer.getWfsUrl())) {
				resultMap.put("wfsUrl", layer.getWfsUrl());	
			}
			
			//wcsUrl
			if (!Utils.isNullOrEmpty(layer.getWcsUrl())) {
				resultMap.put("wcsUrl", layer.getWcsUrl());	
			}
			
		}
		else {
			//resultMap.put("group", "background");
			resultMap.put("group", groupCode);
		}
		
		// TEMP
		resultMap.put("groupName", groupName);
		
		/*
		 * This works for all types (WMS, Google, Bing, OSM...)
		 */
		resultMap.put("source", typeName);
		resultMap.put("title", layer.getLayerTitle());
		resultMap.put("name", layer.getLayerName());
		resultMap.put("position", layerPosition);
		resultMap.put("enabled", enabledByDefault);
		
		if (layer.isReferenceLayerForAlerts()) {
			resultMap.put("referenceLayerForAlerts", layer.isReferenceLayerForAlerts());
		}
		
		return resultMap;
	}
	
	@SuppressWarnings("rawtypes")
	private List<java.util.Map> getLayers(Session session, Map map) {
		
		/*
		 * This must be changes, as the number of generated queries is excessive.
		 */
		
		List<java.util.Map> layerList = new ArrayList<java.util.Map>();
		
		/*
		 * Get groups
		 */
		List<LayerGroup> groups = new LayerGroupRepository().getLayerGroupsByMapId(session, map.getIdMap());
		for (LayerGroup group : groups) {
			String groupCode = "" + group.getIdLayerGroup();
			String groupName = group.getLayerGroupName();
			
			Set<LayerGroupLayer> groupLayerList = group.getLayerGroupLayer();
			
			/*
			 * Get layers
			 */
			for(LayerGroupLayer lgl : groupLayerList) {
				Layer layer = lgl.getLayer();
				long layerPosition = lgl.getPosition();
				boolean layerEnabledByDefault = lgl.isEnabled();
				java.util.Map<String, Object> layer1Map = createLayerJsonMap(layer, groupCode, groupName, layerPosition, layerEnabledByDefault);
				layerList.add(layer1Map);
			}
		}

		return layerList;
	}
	
	
	private java.util.Map<String, Object> getMapConfig(Map map) {
		
		java.util.Map<String, Object> m = new LinkedHashMap<String, Object>();
		m.put("projection", map.getProjection());
		m.put("units", map.getUnits());
		//m.put("maxExtent", map.getMaxExtentAsObject());
		
		//Replaced by DEFAULT EXTENT
		//m.put("center", map.getCenterCoordsAsObject());
		//m.put("zoom", map.getZoom());
		
		m.put("defaultExtent", map.getDefaultExtentAsObject());
		
		
		if (map.getMaxScale() != null) {
			m.put("maxScale", map.getMaxScale());	
		}
		
		if (MapSettings.CUSTOM_SCALE_RESOLUTIONS_RESOLUTIONS.equals(map.getEnableCustomScalesResolutions())) {
			m.put("customResolutions", map.getCustomResolutionsAsList());	
		}
		else if (MapSettings.CUSTOM_SCALE_RESOLUTIONS_SCALES.equals(map.getEnableCustomScalesResolutions())) {
			m.put("customScales", map.getCustomScalesAsList());	
		}
		
		if (map.getDotsPerInch() != null) {
			m.put("dotsPerInch", map.getDotsPerInch());
		}
		
		return m;
	}
	
	public String getConfigAsJson(int idMap) throws Exception {
		String jsonResult = "";
		
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			SystemSettingService sss = new SystemSettingService();
			
			java.util.Map<String, Object> m = new LinkedHashMap<String, Object>();
			Map currentMap = new MapRepository().getById(Map.class, idMap);
			
			m.put("general", sss.getGeneralConfig(session));
			
			m.put("tools", getMapToolsConfig(currentMap));
			m.put("map", getMapConfig(currentMap));
			m.put("layers", getLayers(session, currentMap));
			
			List<java.util.Map> groupList = new ArrayList<java.util.Map>();
			
			List<LayerGroup> groups = new LayerGroupRepository().getLayerGroupsByMapId(session, currentMap.getIdMap());
			for(LayerGroup group : groups) {
				java.util.Map<String, Object> map = new LinkedHashMap<String, Object>();
				map.put("name", "" + group.getIdLayerGroup());
				map.put("code", "" + group.getIdLayerGroup());
				map.put("background", group.isBackground());
				map.put("title", group.getLayerGroupName());
				map.put("position", group.getPosition());
				
				groupList.add(map);
			}
			
			m.put("layersGroups", groupList);
			
			Gson gson = JsonFactory.getGson(true, false, true);
			jsonResult = gson.toJson(m);
			
			
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
		
		return jsonResult;
	}
	
	public String getMapConfigAsJson(int idMap) throws Exception {
		
		String jsonResult = "";
		
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			SystemSettingService sss = new SystemSettingService();
			
			java.util.Map<String, Object> m = new LinkedHashMap<String, Object>();
			Map currentMap = new MapRepository().getById(Map.class, idMap);
			
			m.put("general", sss.getGeneralConfig(session));
			
			m.put("tools", getMapToolsConfig(currentMap));
			m.put("map", getMapConfig(currentMap));
			m.put("layers", getLayers(session, currentMap));
			
			Gson gson = JsonFactory.getGson(true, false, true);
			jsonResult = gson.toJson(m);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
		
		return jsonResult;
	}
	
	public String getGroupConfigAsJson(int idMap) throws Exception {
		String jsonResult = "";
		
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			
			java.util.Map<String, Object> m = new LinkedHashMap<String, Object>();
			Map currentMap = new MapRepository().getById(Map.class, idMap);
			
			List<java.util.Map> groupList = new ArrayList<java.util.Map>();
			
			List<LayerGroup> groups = new LayerGroupRepository().getLayerGroupsByMapId(session, currentMap.getIdMap());
			for(LayerGroup group : groups) {
				java.util.Map<String, Object> map = new LinkedHashMap<String, Object>();
				map.put("name", "" + group.getIdLayerGroup());
				map.put("code", "" + group.getIdLayerGroup());
				map.put("background", group.isBackground());
				map.put("title", group.getLayerGroupName());
				map.put("position", group.getPosition());
				
				groupList.add(map);
			}
			
			m.put("layersGroups", groupList);
			
			Gson gson = JsonFactory.getGson(true, false, true);
			jsonResult = gson.toJson(m);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
		
		return jsonResult;
	}
	
	public String getLayerServicesListAsJson(int idMap) throws Exception {
		String jsonResult = "";
		
		List<java.util.Map<String, String>> list = new ArrayList<java.util.Map<String, String>>();
		
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			
			
//			java.util.Map<String, Object> m = new LinkedHashMap<String, Object>();
//			Map currentMap = new MapRepository().getById(Map.class, idMap);
			
			/*
			 * Get groups
			 */
			List<LayerGroup> groups = new LayerGroupRepository().getLayerGroupsByMapId(session, idMap);
			for (LayerGroup group : groups) {
				Set<LayerGroupLayer> groupLayerList = group.getLayerGroupLayer();
				/*
				 * Get layers
				 */
				for(LayerGroupLayer lgl : groupLayerList) {
					Layer layer = lgl.getLayer();
					
					//Exclude commercial layer(s)
					if (layer.getLayerSource() == null) continue;
					
					java.util.Map<String, String> layerMap = new HashMap<String, String>();
					
					layerMap.put("layerTitle", layer.getLayerTitle());
					
					layerMap.put("layerDescription", layer.getLayerDescription());
					layerMap.put("layerName", layer.getLayerName());
					layerMap.put("officialLayer", Boolean.toString(!layer.isExternal()));
					layerMap.put("WMSServerURL", layer.getLayerSource().getUrl());
					layerMap.put("WFSServerURL", layer.getWfsUrl());
					layerMap.put("WCSServerURL", layer.getWcsUrl());
					list.add(layerMap);
				}
			}
			
			Gson gson = JsonFactory.getGson(true, false, true);
			jsonResult = gson.toJson(list);

			return jsonResult;
			
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
}
