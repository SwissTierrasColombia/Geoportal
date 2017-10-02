package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.LayerGroupLayer;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

public class LayerGroupLayerRepository extends BaseRepository<LayerGroupLayer> {

	private static final Logger log = Logger
			.getLogger(LayerGroupLayerRepository.class);

	
	public List<LayerGroupLayer> getLayerGroupsLayerByMapId(Session session,
			int mapId) {
//		try {

			String hql = "select lgl from LayerGroupLayer lgl "
					+ "where pk.layerGroup.idLayerGroup in ("
					+ " select lg.idLayerGroup from LayerGroup lg "
					+ " where lg.idMap = (:idMap) )";

			Query query = session.createQuery(hql);
			query.setParameter("idMap", mapId);
			List<LayerGroupLayer> layerGroupLayers = query.list();

			return layerGroupLayers;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
	
	@SuppressWarnings("unchecked")
	public List<LayerGroupLayer> getLayerGroupsLayerByGroupId(Session session,
			int groupId) {
//		try {

			Criteria criteria = session
					.createCriteria(LayerGroupLayer.class)
					.add(Restrictions.eq("pk.layerGroup.idLayerGroup", groupId));

			List<LayerGroupLayer> layerGroupLayers = criteria.list();

			return layerGroupLayers;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}

	public List<LayerGroupLayer> getLayerGroupsLayerByMapIdAndLayerId(Session session,
			int mapId, int layerId) {
//		try {

			String hql = "select lgl from LayerGroupLayer lgl"
					+ " where pk.layer.idLayer = (:idLayer) "
					+ " and pk.layerGroup.idLayerGroup in ("
					+ " select lg.idLayerGroup from LayerGroup lg "
					+ " where lg.idMap = (:idMap) )";

			Query query = session.createQuery(hql);
			query.setParameter("idLayer", layerId);
			query.setParameter("idMap", mapId);
			List<LayerGroupLayer> layerGroupLayers = query.list();

			return layerGroupLayers;
			
//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
	
	public LayerGroupLayer getLayerGroupsLayerByGroupIdAndLayerId(Session session,
		int groupId, int layerId) {
//		try {

			Criteria criteria = session
					.createCriteria(LayerGroupLayer.class)
					.add(Restrictions.eq("pk.layerGroup.idLayerGroup", groupId))
					.add(Restrictions.eq("pk.layer.idLayer", layerId));

			List<LayerGroupLayer> layerGroupLayers = criteria.list();
			
			if (layerGroupLayers.size() > 1) {
				throw new RuntimeException("Size should be 1 or less");
			}

			if (layerGroupLayers.size() == 0) return null;
			
			return layerGroupLayers.get(0);
			
//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
	
}
