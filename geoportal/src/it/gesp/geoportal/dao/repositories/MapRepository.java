package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.Map;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

public class MapRepository extends BaseRepository<Map> {

	private static final Logger log = Logger.getLogger(MapRepository.class);
	
	@SuppressWarnings("unchecked")
	public Map getMapByName(Session session, String mapName) {
//		try {
			
			//Retrieve only the map with the given mapName
			Criteria criteria = session.createCriteria(Map.class);
			criteria.add(Restrictions.eq("mapName", mapName));
			List<Map> results = criteria.list();
			if (results.size() != 1) {
				return null;
			}
			
			return results.get(0);

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
}
