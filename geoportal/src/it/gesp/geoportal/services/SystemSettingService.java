package it.gesp.geoportal.services;

import it.gesp.geoportal.constants.Permissions;
import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.dto.GeneralSettingDTO;
import it.gesp.geoportal.dao.dto.SystemSettingDTO;
import it.gesp.geoportal.dao.dto.WmsServerDTO;
import it.gesp.geoportal.dao.entities.GeneralSetting;
import it.gesp.geoportal.dao.entities.LayerSource;
import it.gesp.geoportal.dao.entities.SystemSetting;
import it.gesp.geoportal.dao.repositories.GeneralSettingsRepository;
import it.gesp.geoportal.dao.repositories.SystemSettingsRepository;
import it.gesp.geoportal.json.JsonFactory;
import it.gesp.geoportal.servlets.GeoportalResponse;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;

import com.google.gson.Gson;

public class SystemSettingService {
	private static final Logger log = Logger.getLogger(SystemSettingService.class);
	
	public java.util.Map<String, Object> getGeneralConfig(Session session) {
		java.util.Map<String, Object> generalConfigMap = new LinkedHashMap<String, Object>();
		
		GeneralSettingsRepository gsr = new GeneralSettingsRepository();
		
		List<GeneralSetting> generalSettings = gsr.getGeneralSettings(session);
		GeneralSettingDTO settings = GeneralSettingDTO.parseFromSystemSettings(generalSettings);
		
		generalConfigMap.put("showInitialMessage", settings.isShowInitialMessage());
		generalConfigMap.put("initialMessage", settings.getInitialMessage());
		return generalConfigMap;
	}
	
	public String getGeonetworkUrl() {
		SystemSetting ss = null;
		try {
			ss = new SystemSettingsRepository().getSystemSettingByKey("GEONETWORK_URL");
		} catch (Exception e) {
			log.debug(e);
			new RuntimeException(e);
		}
		return ss.getConfigValue();
	}
	
	public String getSystemSettingByKey(String key) {
		
		SystemSetting ss = null;
		try {
			ss = new SystemSettingsRepository().getSystemSettingByKey(key);
		} catch (Exception e) {
			log.debug(e);
			new RuntimeException(e);
		}
		return ss.getConfigValue();
	}
	
	
	public String getAdminSystemSettingsAsJson() throws Exception {
		List<SystemSetting> systemSettings = this.getSystemSettings();
		SystemSettingDTO settings = SystemSettingDTO.parseFromSystemSettingsAdmin(systemSettings);
		String jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(settings, true);
		return jsonRes;
	}
	
	public String getClientSystemSettingsAsJson() throws Exception {
		List<SystemSetting> systemSettings = this.getSystemSettings();
		SystemSettingDTO settings = SystemSettingDTO.parseFromSystemSettingsClient(systemSettings);
		String jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(settings, true);
		return jsonRes;
	}
	
	public String getGeneralSettingsAsJson() throws Exception {
		List<GeneralSetting> generalSettings = this.getGeneralSettings();
		GeneralSettingDTO settings = GeneralSettingDTO.parseFromSystemSettings(generalSettings);
		String jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(settings, true);
		return jsonRes;
	}
	
	public List<GeneralSetting> getGeneralSettings() throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			GeneralSettingsRepository gsr = new GeneralSettingsRepository();
			
			return gsr.getGeneralSettings(session);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public boolean showInformationMessage() {
		boolean res = false;
		List<GeneralSetting> generalSettings = null;
		try {
			generalSettings = getGeneralSettings();
		} catch (Exception e) {
			new RuntimeException(e);
		} 
		GeneralSettingDTO settings = GeneralSettingDTO.parseFromSystemSettings(generalSettings);
		return settings.isShowInformationMessage();
	}
	
	
	private List<SystemSetting> getSystemSettings() throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			SystemSettingsRepository ssr = new SystemSettingsRepository();
			
			return ssr.getSystemSettings(session);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void saveSystemSettings(SystemSettingDTO systemSettings) throws Exception {
		List<SystemSetting> settings = systemSettings.getSettings();
		SystemSettingsRepository ssr = new SystemSettingsRepository();
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();

			Transaction tx = session.beginTransaction();
			try {
				
				for (SystemSetting s : settings) {
					//Call the update
					ssr.updateSystemSetting(session, s.getConfigKey(), s.getConfigValue());
				}

				tx.commit();
			} catch (Exception x) {
				//log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void saveGeneralSettings(GeneralSettingDTO generalSettings) throws Exception {
		List<GeneralSetting> settings = generalSettings.getSettings();
		GeneralSettingsRepository gsr = new GeneralSettingsRepository();
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();

			Transaction tx = session.beginTransaction();
			try {
				
				for (GeneralSetting s : settings) {
					//Call the update
					gsr.updateGeneralSetting(session, s.getConfigKey(), s.getConfigValue());
				}

				tx.commit();
			} catch (Exception x) {
				//log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	public String getExternalWMSServerConfigAsJson() throws Exception {
		String jsonResult = "";
		
		List<WmsServerDTO> serverList = new ArrayList<WmsServerDTO>();

		//Test
		//serverList.add(new WmsServerDTO("Mosef - http://192.168.10.72:8080/geoserver/mosef/wms", "http://192.168.10.72:8080/geoserver/mosef/wms"));
		//serverList.add(new WmsServerDTO("Guyana - http://192.168.10.240:8081/geoserver/Guyana/wms", "http://192.168.10.240:8081/geoserver/Guyana/wms"));
		
		LayerService ls = new LayerService();
		List<LayerSource> sources = ls.getExternalLayerSources();
		
		for (LayerSource layerSource : sources) {
			serverList.add(new WmsServerDTO(layerSource.getLayerSourceName() + " - " + layerSource.getUrl(), layerSource.getUrl()));
		}
		
		java.util.Map<String, Object> m = new LinkedHashMap<String, Object>();
		m.put("wms_list", serverList);
		
		Gson gson = JsonFactory.getGson(true, false, true);
		jsonResult = gson.toJson(m);
		
		return jsonResult;
	}
	
}
