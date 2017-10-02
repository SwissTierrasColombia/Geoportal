package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.LayerConfig;
import it.gesp.geoportal.dao.entities.LayerSource;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

public class LayerConfigRepository extends BaseRepository<LayerConfig> {

	private static final Logger log = Logger.getLogger(LayerConfigRepository.class);

	@SuppressWarnings("unchecked")
	public List<LayerConfig> getLayerConfigs(Session session) {
//		try {

			List<LayerConfig> layerConfigs = null;
			layerConfigs = this.getAll(session, LayerConfig.class);
			return layerConfigs;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
	
	
//	public List<LayerSource> getLayerSourcesByMapId(Session session, int mapId) {
//		try {
//
//			String hql = "select lgl.pk.layer.layerSource from LayerGroupLayer lgl"
//					+ " where lgl.pk.layerGroup.idLayerGroup in ("
//					+ " select lg.idLayerGroup from LayerGroup lg "
//					+ " where lg.idMap = (:idMap) )";
//
//			Query query = session.createQuery(hql);
//			query.setParameter("idMap", mapId);
//			List<LayerSource> layerGroupLayers = query.list();
//
//			return layerGroupLayers;
//
//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
//	}
}
