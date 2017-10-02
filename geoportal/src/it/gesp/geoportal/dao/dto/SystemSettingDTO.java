package it.gesp.geoportal.dao.dto;

import it.gesp.geoportal.constants.SystemSettings;
import it.gesp.geoportal.dao.entities.SystemSetting;

import java.util.ArrayList;
import java.util.List;

public class SystemSettingDTO {

	private String proxyUrl;
	private String printServletUrl;
	private String printImagesFolder;
	private String geoserverUrl;
	private String geonetworkUrl;
	private Integer searchMaxResultForLayer;
	private Integer maxNumberOfSelectedLayers;
	private Integer ajaxTimeout;
	private Integer ajaxPrintTimeout;
	private String featureInfoHyperlinkField;
	
	private String alertsLegendImageUrl;
	private String redlinesLegendImageUrl;
	
	private String alertsLayerName;
	private String alertsDownloadUsername;
	private String alertsDownloadPassword;
	
	public String getProxyUrl() {
		return proxyUrl;
	}
	public void setProxyUrl(String proxyUrl) {
		this.proxyUrl = proxyUrl;
	}
	public String getPrintServletUrl() {
		return printServletUrl;
	}
	public void setPrintServletUrl(String printServletUrl) {
		this.printServletUrl = printServletUrl;
	}
	public String getPrintImagesFolder() {
		return printImagesFolder;
	}
	public void setPrintImagesFolder(String printImagesFolder) {
		
		/*
		 * Invert the path (linux style).
		 */
		printImagesFolder = printImagesFolder.replace("\\", "/");
		this.printImagesFolder = printImagesFolder;
	}
	public String getGeoserverUrl() {
		return geoserverUrl;
	}
	public void setGeoserverUrl(String geoserverUrl) {
		this.geoserverUrl = geoserverUrl;
	}
	public String getGeonetworkUrl() {
		return geonetworkUrl;
	}
	public void setGeonetworkUrl(String geonetworkUrl) {
		this.geonetworkUrl = geonetworkUrl;
	}
	public Integer getSearchMaxResultForLayer() {
		return searchMaxResultForLayer;
	}
	public void setSearchMaxResultForLayer(Integer searchMaxResultForLayer) {
		this.searchMaxResultForLayer = searchMaxResultForLayer;
	}
	public Integer getAjaxTimeout() {
		return ajaxTimeout;
	}
	public void setAjaxTimeout(Integer ajaxTimeout) {
		this.ajaxTimeout = ajaxTimeout;
	}
	public String getFeatureInfoHyperlinkField() {
		return featureInfoHyperlinkField;
	}
	public void setFeatureInfoHyperlinkField(String featureInfoHyperlinkField) {
		this.featureInfoHyperlinkField = featureInfoHyperlinkField;
	}
	public Integer getMaxNumberOfSelectedLayers() {
		return maxNumberOfSelectedLayers;
	}
	public void setMaxNumberOfSelectedLayers(Integer maxNumberOfSelectedLayers) {
		this.maxNumberOfSelectedLayers = maxNumberOfSelectedLayers;
	}
	public String getAlertsLegendImageUrl() {
		return alertsLegendImageUrl;
	}
	public void setAlertsLegendImageUrl(String alertsLegendImageUrl) {
		this.alertsLegendImageUrl = alertsLegendImageUrl;
	}
	public String getRedlinesLegendImageUrl() {
		return redlinesLegendImageUrl;
	}
	public void setRedlinesLegendImageUrl(String redlinesLegendImageUrl) {
		this.redlinesLegendImageUrl = redlinesLegendImageUrl;
	}
	public List<SystemSetting> getSettings() {
		List<SystemSetting> list = new ArrayList<SystemSetting>();
		
		list.add(new SystemSetting(SystemSettings.PROXY_URL, getProxyUrl()));
		list.add(new SystemSetting(SystemSettings.PRINT_SERVLET_URL, getPrintServletUrl()));
		list.add(new SystemSetting(SystemSettings.PRINT_IMAGES_FOLDER, getPrintImagesFolder()));
		list.add(new SystemSetting(SystemSettings.GEOSERVER_URL, getGeoserverUrl()));
		list.add(new SystemSetting(SystemSettings.GEONETWORK_URL, getGeonetworkUrl()));
		list.add(new SystemSetting(SystemSettings.SEARCH_MAX_HITS_PER_LAYER, getSearchMaxResultForLayer().toString()));
		list.add(new SystemSetting(SystemSettings.MAX_NUMBER_OF_SELECTABLE_LAYERS, getMaxNumberOfSelectedLayers().toString()));
		list.add(new SystemSetting(SystemSettings.AJAX_REQUEST_TIMEOUT_MSEC, getAjaxTimeout().toString()));
		list.add(new SystemSetting(SystemSettings.AJAX_REQUEST_PRINT_TIMEOUT_MSEC, getAjaxPrintTimeout().toString()));
		
		list.add(new SystemSetting(SystemSettings.FEATURE_ATTRIBUTE_HYPERLINK_FIELD, getFeatureInfoHyperlinkField()));
		list.add(new SystemSetting(SystemSettings.ALERTS_LEGEND_URL, getAlertsLegendImageUrl()));
		list.add(new SystemSetting(SystemSettings.REDLINES_LEGEND_URL, getRedlinesLegendImageUrl()));
		
		list.add(new SystemSetting(SystemSettings.ALERTS_GEOSERVER_LAYER_NAME, getAlertsLayerName()));
		list.add(new SystemSetting(SystemSettings.ALERTS_GEOSERVER_USERNAME, getAlertsDownloadUsername()));
		list.add(new SystemSetting(SystemSettings.ALERTS_GEOSERVER_PASSWORD, getAlertsDownloadPassword()));
		
		return list;
	}
	
	
	public static SystemSettingDTO parseFromSystemSettingsClient(List<SystemSetting> settings) {
		SystemSettingDTO settingDTO = new SystemSettingDTO();
		
		for(SystemSetting s : settings) {
			
			if (SystemSettings.PROXY_URL.equals(s.getConfigKey())) {
				settingDTO.setProxyUrl(s.getConfigValue());
				continue;
			}
			
			if (SystemSettings.PRINT_SERVLET_URL.equals(s.getConfigKey())) {
				settingDTO.setPrintServletUrl(s.getConfigValue());
				continue;
			}
			
			if (SystemSettings.PRINT_IMAGES_FOLDER.equals(s.getConfigKey())) {
				settingDTO.setPrintImagesFolder(s.getConfigValue());
				continue;
			}
			
			if (SystemSettings.GEOSERVER_URL.equals(s.getConfigKey())) {
				settingDTO.setGeoserverUrl(s.getConfigValue());
				continue;
			}
			
			if (SystemSettings.GEONETWORK_URL.equals(s.getConfigKey())) {
				settingDTO.setGeonetworkUrl(s.getConfigValue());
				continue;
			}
			
			if (SystemSettings.SEARCH_MAX_HITS_PER_LAYER.equals(s.getConfigKey())) {
				Integer val = Integer.parseInt(s.getConfigValue());
				settingDTO.setSearchMaxResultForLayer(val);
				continue;
			}
			
			if (SystemSettings.MAX_NUMBER_OF_SELECTABLE_LAYERS .equals(s.getConfigKey())) {
				Integer val = Integer.parseInt(s.getConfigValue());
				settingDTO.setMaxNumberOfSelectedLayers(val);
				continue;
			}
			
			if (SystemSettings.AJAX_REQUEST_TIMEOUT_MSEC.equals(s.getConfigKey())) {
				Integer val = Integer.parseInt(s.getConfigValue());
				settingDTO.setAjaxTimeout(val);
				continue;
			}
			
			if (SystemSettings.AJAX_REQUEST_PRINT_TIMEOUT_MSEC.equals(s.getConfigKey())) {
				Integer val = Integer.parseInt(s.getConfigValue());
				settingDTO.setAjaxPrintTimeout(val);
				continue;
			}
			
			if (SystemSettings.FEATURE_ATTRIBUTE_HYPERLINK_FIELD.equals(s.getConfigKey())) {
				settingDTO.setFeatureInfoHyperlinkField(s.getConfigValue());
				continue;
			}
			
			if (SystemSettings.ALERTS_LEGEND_URL.equals(s.getConfigKey())) {
				settingDTO.setAlertsLegendImageUrl(s.getConfigValue());
				continue;
			}
			
			if (SystemSettings.REDLINES_LEGEND_URL.equals(s.getConfigKey())) {
				settingDTO.setRedlinesLegendImageUrl(s.getConfigValue());
				continue;
			}
			
			if (SystemSettings.ALERTS_GEOSERVER_LAYER_NAME.equals(s.getConfigKey())) {
				settingDTO.setAlertsLayerName(s.getConfigValue());
				continue;
			}
			
			if (SystemSettings.ALERTS_GEOSERVER_USERNAME.equals(s.getConfigKey())) {
				settingDTO.setAlertsDownloadUsername(s.getConfigValue());
				continue;
			}
			
			if (SystemSettings.ALERTS_GEOSERVER_PASSWORD.equals(s.getConfigKey())) {
				settingDTO.setAlertsDownloadPassword(s.getConfigValue());
				continue;
			}
		}
		
		return settingDTO;
	}
	
	public static SystemSettingDTO parseFromSystemSettingsAdmin(List<SystemSetting> settings) {
		SystemSettingDTO settingDTO = parseFromSystemSettingsClient(settings);
		
		for(SystemSetting s : settings) {
			
			if (SystemSettings.ALERTS_GEOSERVER_LAYER_NAME.equals(s.getConfigKey())) {
				settingDTO.setAlertsLayerName(s.getConfigValue());
				continue;
			}
			
			if (SystemSettings.ALERTS_GEOSERVER_USERNAME.equals(s.getConfigKey())) {
				settingDTO.setAlertsDownloadUsername(s.getConfigValue());
				continue;
			}
			
			if (SystemSettings.ALERTS_GEOSERVER_PASSWORD.equals(s.getConfigKey())) {
				settingDTO.setAlertsDownloadPassword(s.getConfigValue());
				continue;
			}
		}
		
		return settingDTO;
	}
	
	public String getAlertsLayerName() {
		return alertsLayerName;
	}
	public void setAlertsLayerName(String alertsLayerName) {
		this.alertsLayerName = alertsLayerName;
	}
	public String getAlertsDownloadUsername() {
		return alertsDownloadUsername;
	}
	public void setAlertsDownloadUsername(String alertsDownloadUsername) {
		this.alertsDownloadUsername = alertsDownloadUsername;
	}
	public String getAlertsDownloadPassword() {
		return alertsDownloadPassword;
	}
	public void setAlertsDownloadPassword(String alertsDownloadPassword) {
		this.alertsDownloadPassword = alertsDownloadPassword;
	}
	public Integer getAjaxPrintTimeout() {
		return ajaxPrintTimeout;
	}
	public void setAjaxPrintTimeout(Integer ajaxPrintTimeout) {
		this.ajaxPrintTimeout = ajaxPrintTimeout;
	}
	
}