package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.MapConfigVw;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

public class MapConfigVwRepository extends BaseRepository<MapConfigVw> {

	private static final Logger log = Logger.getLogger(MapConfigVwRepository.class);

	public List<MapConfigVw> getMapConfigVwByMapId(Session session, int mapId) {
//		try {

			// Retrieve only the map with the given mapId
			Criteria criteria = session.createCriteria(MapConfigVw.class);
			criteria.add(Restrictions.eq("idMap", mapId));
			List<MapConfigVw> results = criteria.list();

			return results;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
	
//	public List<MapConfigVw> getMapConfigVw(Session session) {
//		try {
//
//			List<MapConfigVw> results = this.getAll(session, MapConfigVw.class);
//			return results;
//
//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
//
//	}
}
