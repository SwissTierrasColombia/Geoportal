package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.LayerSource;
import it.gesp.geoportal.dao.entities.Map;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

public class LayerSourceRepository extends BaseRepository<LayerSource> {

	private static final Logger log = Logger.getLogger(LayerSourceRepository.class);

	@SuppressWarnings("unchecked")
	public List<LayerSource> getLayerSources(Session session) {
//		try {

			List<LayerSource> layerSources = null;
			layerSources = this.getAll(session, LayerSource.class);
			return layerSources;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
	
	public List<LayerSource> getExternalLayerSources(Session session) {
		
		Criteria criteria = session.createCriteria(LayerSource.class);
		criteria.add(Restrictions.eq("addToExternalWmsList", true));
		List<LayerSource> results = criteria.list();
		return results;
	}
	
	
	public List<LayerSource> getLayerSourcesByMapId(Session session, int mapId) {
//		try {

			String hql = "select lgl.pk.layer.layerSource from LayerGroupLayer lgl"
					+ " where lgl.pk.layerGroup.idLayerGroup in ("
					+ " select lg.idLayerGroup from LayerGroup lg "
					+ " where lg.idMap = (:idMap) )";

			Query query = session.createQuery(hql);
			query.setParameter("idMap", mapId);
			List<LayerSource> layerGroupLayers = query.list();

			return layerGroupLayers;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
}
