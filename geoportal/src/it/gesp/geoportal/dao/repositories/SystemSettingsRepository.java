package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.entities.SystemSetting;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

public class SystemSettingsRepository extends BaseRepository<SystemSetting> {

	private static final Logger log = Logger.getLogger(SystemSettingsRepository.class);
	
	public SystemSetting getSystemSettingByKey(String key) throws Exception{
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			String hql = "select ss from SystemSetting ss"
					+ " where ss.configKey = (:key)";

			Query query = session.createQuery(hql);
			query.setParameter("key", key);
			SystemSetting result = (SystemSetting) query.uniqueResult();
			return result;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public List<SystemSetting> getSystemSettings(Session session) {
		List<SystemSetting> systemSettings = null;
		systemSettings = this.getAll(session, SystemSetting.class);
		return systemSettings;
	}

	public void updateSystemSetting(Session session, String key, String value) {
		Query query = session.createQuery("update SystemSetting set value = :value" +
				" where key = :key");
		query.setParameter("value", value);
		query.setParameter("key", key);
		//int result = query.executeUpdate();
		query.executeUpdate();
	}
	
}
