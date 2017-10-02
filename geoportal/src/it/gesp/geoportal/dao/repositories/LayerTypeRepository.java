package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.LayerType;
import it.gesp.geoportal.dao.entities.Map;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

public class LayerTypeRepository extends BaseRepository<LayerType> {

	private static final Logger log = Logger.getLogger(LayerTypeRepository.class);


	@SuppressWarnings("unchecked")
	public List<LayerType> getLayerTypes(Session session) {
//		try {
			List<LayerType> layerTypes = null;
			layerTypes = this.getAll(session, LayerType.class);
			return layerTypes;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}

	@SuppressWarnings("unchecked")
	public LayerType getWMSLayerType(Session session) {
//		try {
			Criteria criteria = session.createCriteria(LayerType.class);
			criteria.add(Restrictions.eq("typeName", "wms"));
			List<LayerType> results = criteria.list();
			if (results.size() != 1) {
				return null;
			}
			
			return results.get(0);
//
//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
}
