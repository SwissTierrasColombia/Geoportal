package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.GeneralSetting;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

public class GeneralSettingsRepository extends BaseRepository<GeneralSetting> {

	private static final Logger log = Logger.getLogger(GeneralSettingsRepository.class);
	
	public List<GeneralSetting> getGeneralSettings(Session session) {
//		try {
			List<GeneralSetting> generalSettings = null;
			generalSettings = this.getAll(session, GeneralSetting.class);
			return generalSettings;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}

	public void updateGeneralSetting(Session session, String key, String value) {
		Query query = session.createQuery("update GeneralSetting set value = :value" +
				" where key = :key");
		query.setParameter("value", value);
		query.setParameter("key", key);
		//int result = query.executeUpdate();
		query.executeUpdate();
	}
	
}
