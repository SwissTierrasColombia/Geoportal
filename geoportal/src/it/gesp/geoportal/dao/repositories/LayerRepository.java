package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.Layer;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

public class LayerRepository extends BaseRepository<Layer> {

	private static final Logger log = Logger.getLogger(LayerRepository.class);

	@SuppressWarnings("unchecked")
	public List<Layer> getLayers(Session session, boolean excludeCommercialLayers) {
		List<Layer> layers = null;
		
		String hql ="select layer from Layer layer ";
				  
		
		if (excludeCommercialLayers) {
			hql += " where layer.layerSource is not null";
		}
		
		Query query = session.createQuery(hql);
		layers = query.list();
		//layers = this.getAll(session, Layer.class);
		
		return layers;
	}
	
	public void setReferenceLayerForAlert(Session session, int mapId, Integer layerId) {
//		try {
			Layer selectedLayer = null;
			
			/*
			 * If it is null -> remove.
			 */
			
			/*
			 * 1 - Test that the layer belong to the map and it is associated
			 */
			String hql ="select layer from Layer layer "
					  + "where layer.idLayer in ( "
					  + "select lgl.pk.layer.idLayer from LayerGroupLayer lgl "
					  + "where lgl.pk.layerGroup.idMap = (:idMap) )"
					  + " and layer.idLayer = (:layerId) ";

			Query query = session.createQuery(hql);
			query.setParameter("idMap", mapId);
			query.setParameter("layerId", layerId);
			List<Layer> layers = query.list();
			
			boolean error = false;
			if (layers.size() == 0) {
//				//Error to remove
				error = true;
			}
			else {
				selectedLayer = layers.get(0);
			}
			
			/*
			 * 3 - Test the layer is not a basemap
			 */
			if (selectedLayer != null && selectedLayer.isBaseLayer()) {
				error = true;
			}

			/*
			 * Empty all reference layer of the given mapId
			 */
			List<Layer> associatedLayerToMap = getAssociatedLayers(session, mapId, false);
			for (Layer lay : associatedLayerToMap) {
				lay.setReferenceLayerForAlerts(false);
				session.update(lay);
			}
			
			if (selectedLayer != null && !error) {
				selectedLayer.setReferenceLayerForAlerts(true);
				session.update(selectedLayer);
			}
			
//		} catch (Exception x) {
//			// Log
//			throw x;
//		}	
	}
	
	public Layer getReferenceLayerForAlerts(Session session, int mapId) {
//		try {

			String hql ="select layer from Layer layer "
					  + "where layer.idLayer in ( "
					  + "select lgl.pk.layer.idLayer from LayerGroupLayer lgl "
					  + "where lgl.pk.layerGroup.idMap = (:idMap) )"
					  + "and layer.referenceLayerForAlerts is true";

			Query query = session.createQuery(hql);
			query.setParameter("idMap", mapId);
			List<Layer> layers = query.list();
			if (layers.size() > 0) {
				return layers.get(0);
			} else {
				return null;
			}

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
	
	public List<Layer> getAssociatedLayers(Session session, int mapId, boolean excludeBasemap) {
//		try {

			String hql ="select layer from Layer layer "
					  + "where layer.idLayer in ( "
					  + "select lgl.pk.layer.idLayer from LayerGroupLayer lgl "
					  + "where lgl.pk.layerGroup.idMap = (:idMap) )";
			
			if (excludeBasemap) {
				hql += " and layer.baseLayer is not true";
			}
			

			Query query = session.createQuery(hql);
			query.setParameter("idMap", mapId);
			List<Layer> layers = query.list();

			return layers;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
	
	public List<Object[]> getUnAssociatedLayers(Session session, int mapId) {
//		try {

		/*
		 * Old version
		 */
//		String hql ="select layer, layer.layerSource.layerSourceName from Layer layer "
//				  + "where layer.idLayer not in ( "
//				  + "select lgl.pk.layer.idLayer from LayerGroupLayer lgl "
//				  + "where lgl.pk.layerGroup.idMap = (:idMap) )"
//				  + "order by layer.layerSource.layerSourceName, layer.layerTitle";
		
			String hql ="select layer, layerSource.layerSourceName from Layer layer "
					  + "left join layer.layerSource as layerSource "
					  + "where layer.idLayer not in ( "
					  + "select lgl.pk.layer.idLayer from LayerGroupLayer lgl "
					  + "where lgl.pk.layerGroup.idMap = (:idMap) )"
					  + "order by layerSource.layerSourceName, layer.layerTitle";

			Query query = session.createQuery(hql);
			query.setParameter("idMap", mapId);
			//List<Layer> layerGroupLayers = query.list();
			List<Object[]> layers = query.list();
			
			return layers;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}

	@SuppressWarnings("unchecked")
	public List<Layer> getLayersByMapId(Session session, int mapId) {
//		try {

			String hql = "select lgl.pk.layer from LayerGroupLayer lgl"
					+ " where lgl.pk.layerGroup.idLayerGroup in ("
					+ " select lg.idLayerGroup from LayerGroup lg "
					+ " where lg.idMap = (:idMap) )";

//			if (excludeCommercialLayers) {
//				hql += " and lgl.pk.layer.layerSource is not null";
//			}
			
			Query query = session.createQuery(hql);
			query.setParameter("idMap", mapId);
			List<Layer> layerGroupLayers = query.list();

			return layerGroupLayers;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
	
}
