package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.AlertSetting;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

@SuppressWarnings("rawtypes")
public class AlertSettingsRepository extends BaseRepository {

	private static final Logger log = Logger.getLogger(AlertSettingsRepository.class);
	
	public List<AlertSetting> getAlertSettings(Session session) {

		List<AlertSetting> alertSettings = null;
		alertSettings = this.getAll(session, AlertSetting.class);
		return alertSettings;
	}

	public void updateAlertSetting(Session session, String key, String value) {
		Query query = session.createQuery("update AlertSetting set value = :value" +
				" where key = :key");
		query.setParameter("value", value);
		query.setParameter("key", key);
		query.executeUpdate();
	}
	
	public AlertSetting getAlertSettingByKey(Session session, String key) {
		Query query = session.createQuery("select a from AlertSetting a where key = :key");
		query.setParameter("key", key);
		List res = query.list();
		
		AlertSetting as = (AlertSetting)res.get(0); 
		return as;
	}
}
