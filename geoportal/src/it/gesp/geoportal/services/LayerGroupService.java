package it.gesp.geoportal.services;

import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.entities.Layer;
import it.gesp.geoportal.dao.entities.LayerGroup;
import it.gesp.geoportal.dao.entities.LayerGroupLayer;
import it.gesp.geoportal.dao.entities.LayerGroupLayerId;
import it.gesp.geoportal.dao.entities.MapConfigVw;
import it.gesp.geoportal.dao.repositories.LayerGroupLayerRepository;
import it.gesp.geoportal.dao.repositories.LayerGroupRepository;
import it.gesp.geoportal.dao.repositories.LayerRepository;
import it.gesp.geoportal.dao.repositories.MapConfigVwRepository;
import it.gesp.geoportal.exceptions.DataInvalidException;
import it.gesp.geoportal.exceptions.OperationInvalidException;

import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

public class LayerGroupService {
	private static final Logger log = Logger.getLogger(LayerGroupService.class);

	public List<LayerGroup> getLayerGroups() throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerGroupRepository lgr = new LayerGroupRepository();

			return lgr.getLayerGroups(session);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}

	public List<LayerGroup> getLayerGroupsByMapId(int mapId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerGroupRepository lgr = new LayerGroupRepository();

			return lgr.getLayerGroupsByMapId(session, mapId);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}

	public List<MapConfigVw> getGroupsAndLayersByMapId(int mapId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			MapConfigVwRepository mcr = new MapConfigVwRepository();
			return mcr.getMapConfigVwByMapId(session, mapId);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}

	public void addLayerGroup(LayerGroup layerGroup) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerGroupRepository lgr = new LayerGroupRepository();

			Transaction tx = session.beginTransaction();
			try {

				/*
				 * A layergroup can be inserted if it does not exist the same group in the same map
				 */
				LayerGroup existingLayerGroup = lgr.getLayerGroupsByMapIdAndName(session, layerGroup.getIdMap(), layerGroup.getLayerGroupName());
				if (existingLayerGroup != null) {
					throw new OperationInvalidException("EXC_LAYERGROUP_WITH_SAME_NAME_ALREADY_ASSOCIATED_TO_MAP", "A LayerGroup with the same name is already associated to the Map.");
				}

				//Set the position...
				long currentMaxPosition = lgr.getMaxLayerGroupPositionInMap(session, layerGroup.getIdMap());
				layerGroup.setPosition(currentMaxPosition + 1);
				
				lgr.save(session, layerGroup);

				tx.commit();
			} catch (Exception x) {
				// log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}

	public void updateLayerGroup(int mapId, int layerGroupId, String layerGroupName) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerGroupRepository lgr = new LayerGroupRepository();

			Transaction tx = session.beginTransaction();
			try {

				/*
				 * A layergroup can be inserted if it does not exist the same group in the same map
				 */
				LayerGroup existingLayerGroup = lgr.getById(session, LayerGroup.class, layerGroupId);
				
				if (existingLayerGroup == null) {
					throw OperationInvalidException.createMissingIdExeption("LayerGroup", layerGroupId);
				}

				//Check if there is a layerGroup with the same name already associated to the map
				LayerGroup existingLayerGroupWithSameName = lgr.getLayerGroupsByMapIdAndName(session, mapId, layerGroupName);
				if (existingLayerGroupWithSameName != null) {
					throw new OperationInvalidException("EXC_LAYERGROUP_WITH_SAME_NAME_ALREADY_ASSOCIATED_TO_MAP", "A LayerGroup with the same name is already associated to the Map.");
				}
				
				//Change the layerGroupName and save
				existingLayerGroup.setLayerGroupName(layerGroupName);
				lgr.update(session, existingLayerGroup);
				
				tx.commit();
				
			} catch (Exception x) {
				// log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void deleteLayerGroup(int layerGroupId, boolean forceLayerDeletion) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerGroupRepository lgr = new LayerGroupRepository();
			LayerGroupLayerRepository lglr = new LayerGroupLayerRepository();

			Transaction tx = session.beginTransaction();
			try {
				LayerGroup existingLayerGroup = lgr.getById(session, LayerGroup.class, layerGroupId);

				if (existingLayerGroup == null) {
					throw OperationInvalidException.createMissingIdExeption("LayerGroup", layerGroupId);
				}
				
				//Check if the layerGroup has associated layers...
				Set<LayerGroupLayer> layers = existingLayerGroup.getLayerGroupLayer();
				
				if (layers.size() == 0) {
					lgr.delete(session, existingLayerGroup);	
				}
				else if (layers.size() > 0 && !forceLayerDeletion) {
					throw new OperationInvalidException("EXC_LAYERGROUP_DELETE_ERROR_LAYERS_ASSOCIATED", "The layergroup cannot be deleted. There are " + layers.size() + " layers associated.", "" + layers.size());
				}
				else {
					//Delete the layers
					for (LayerGroupLayer lgl : layers) {
						lglr.delete(session, lgl);
					}
					//layers.clear();
					//Delete the layerGroup
					lgr.delete(session, existingLayerGroup);
				}
				
				//The positions must be changed, as we dont want to leave holes in the "positions"...
				long positionOfDeletedLayerGroup = existingLayerGroup.getPosition();
				int mapId = existingLayerGroup.getIdMap();
				
				session.flush();
				
				Criteria criteria = session
						.createCriteria(LayerGroup.class)
						.add(Restrictions.eq("idMap", mapId))
						.add(Restrictions.gt("position", positionOfDeletedLayerGroup))
						.addOrder(Order.asc("position"));

				List<LayerGroup> positionsToUpdateList = criteria.list();
				
				// Decrement...
				for (LayerGroup grp : positionsToUpdateList) {
					long currentPosition = grp.getPosition();
					grp.setPosition(currentPosition - 1);

					// save it
					lgr.update(session, grp);
				}
				
				session.flush();
				
				//Verify...
				//checkPositionHolesForGroups(session, mapId);
				
				tx.commit();
				
			} catch (Exception x) {
				//log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	private void checkPositionHolesForGroups(Session session, int mapId) throws Exception {
		//Get Layergroups by map...
		Criteria criteria = session
				.createCriteria(LayerGroup.class)
				.add(Restrictions.eq("idMap", mapId))
				.addOrder(Order.asc("position"));;
		
		List<LayerGroup> groups = criteria.list();
		
		long lastPosition = 0;
		for(int j = 0; j < groups.size(); j++) {
			LayerGroup group = groups.get(j);
			long currentPos = group.getPosition();
			if (currentPos <= lastPosition || (currentPos != lastPosition + 1)) {
				throw new OperationInvalidException("Error in groups ordering...");
			}
			
			lastPosition++;
		}
	}
	

	public void reorderLayerGroup(int layerGroupId, long newPosition) throws Exception {
		
		if(newPosition <=0) {
			throw new DataInvalidException("newPosition is <=0");
		}
		
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerGroupRepository lgr = new LayerGroupRepository();

			Transaction tx = session.beginTransaction();
			try {
				/*
				 * Test that the layerGroup exists
				 */
				LayerGroup layerGroup = lgr.getById(session, LayerGroup.class,
						layerGroupId);

				if (layerGroup == null) {
					throw OperationInvalidException.createMissingIdExeption(
							"LayerGroup", layerGroupId);
				}
				
				int mapId = layerGroup.getIdMap();
				
				long oldPosition = layerGroup.getPosition();

				/*
				 * Items with a position < oldPosition do not change. 
				 * Items with a position between oldPosition and newPosition must
				 * be changed by one 
				 * Items with a position > newPosition do not change.
				 */
				Criteria criteria = null;
				
				if (oldPosition == newPosition) {
					// it is the same position!
					return;
				}
				
				// Temporary save of the group
				layerGroup.setPosition(0);
				lgr.save(session, layerGroup);
				
				session.flush();
				
				int increment = 0;
				
				if (newPosition > oldPosition) {
					criteria = session
							.createCriteria(LayerGroup.class)
							.add(Restrictions.eq("idMap", mapId))
							.add(Restrictions.ge("position", oldPosition))
							.add(Restrictions.le("position", newPosition))
							.addOrder(Order.asc("position"));
					
					increment = -1;
					
				} 
				else {
					criteria = session
							.createCriteria(LayerGroup.class)
							.add(Restrictions.eq("idMap", mapId))
							.add(Restrictions.ge("position", newPosition))
							.add(Restrictions.le("position", oldPosition))
							.addOrder(Order.desc("position"));
					
					increment = 1;
				}
				
				List<LayerGroup> positionsToUpdateList = criteria.list();

				// Add increment
				for (LayerGroup grp : positionsToUpdateList) {
					long currentPosition = grp.getPosition();
					grp.setPosition(currentPosition + increment);

					// save it
					lgr.update(session, grp);
				}

				session.flush();

				//Set the new position to the group and save it.
				layerGroup.setPosition(newPosition);
				lgr.update(session, layerGroup);
				
				tx.commit();
				
			} catch (Exception x) {
				// log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void addLayerToLayerGroup(int layerGroupId, int layerId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			Transaction tx = session.beginTransaction();
			
			try {
				
				addLayerToLayerGroup(session, layerGroupId, layerId);
				tx.commit();
				
			} catch (Exception x) {
				// log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	private void addLayerToLayerGroup(Session session, int layerGroupId, int layerId) throws Exception {
		LayerRepository lr = new LayerRepository();
		LayerGroupRepository lgr = new LayerGroupRepository();
		LayerGroupLayerRepository lglr = new LayerGroupLayerRepository();
		
		/*
		 * Test that the layer and the layerGroup exist
		 */
		Layer layer = lr.getById(session, Layer.class, layerId);
		LayerGroup layerGroup = lgr.getById(session, LayerGroup.class,
				layerGroupId);

		if (layer == null) {
			throw OperationInvalidException.createMissingIdExeption(
					"Layer", layerId);
		}

		if (layerGroup == null) {
			throw OperationInvalidException.createMissingIdExeption(
					"LayerGroup", layerGroupId);
		}

		/*
		 * Check if the layer is already associated to a group.
		 */
		LayerGroupLayer existingLgl = lglr
				.getLayerGroupsLayerByGroupIdAndLayerId(session,
						layerGroupId, layerId);

		if (existingLgl != null) {
			//Already existing!!!!
			throw new OperationInvalidException("EXC_LAYER_ADD_ERROR_ALREADY_ASSOCIATED_TO_LAYERGROUP", "Layer is already associated to the group " + layerGroup.getLayerGroupName(), layerGroup.getLayerGroupName());
		}
		
		/*
		 * Check if the layer is already associated to any group of the map...
		 */
		int idMap = layerGroup.getIdMap();
		List<LayerGroupLayer> associationsOfLayerToMap = lglr.getLayerGroupsLayerByMapIdAndLayerId(session, idMap, layerId);
		if (associationsOfLayerToMap.size() > 0) {
			//The layer is already associated to the map.
			throw new OperationInvalidException("EXC_LAYERGROUP_ADD__ALREADY_ASSOCIATED_TO_MAP", "The layer is already associated to the map.");
		}
		
		/*
		 * Check that if is a base_layer, it is associated to a background group and viceversa.
		 */
		if ((layer.isBaseLayer() && !layerGroup.isBackground())) {
			throw new OperationInvalidException("EXC_LAYER_ADD_ERROR_BASELAYER", "A base layer can be associated only to the background group.");
		}

		if ((!layer.isBaseLayer() && layerGroup.isBackground())) {
			throw new OperationInvalidException("EXC_LAYER_ADD_ERROR_NO_BACKGROUND_GROUP", "A standard layer cannot be associated to the background group.");
		}
		
		/*
		 * Get last position of the group to determine the maximum...
		 */
		long maxCurrentPosition = 0;
		
		Criteria numLayersInGroupCriteria = session
			    .createCriteria(LayerGroupLayer.class)
			    .add(Restrictions.eq("pk.layerGroup.idLayerGroup",layerGroupId))
			    .setProjection(Projections.rowCount());
		long numLayersInGroup = (Long) numLayersInGroupCriteria.uniqueResult();
		
		if (numLayersInGroup > 0) {
			Criteria maxPositionInGroupCriteria = session
				    .createCriteria(LayerGroupLayer.class)
				    .add(Restrictions.eq("pk.layerGroup.idLayerGroup",layerGroupId))
				    .setProjection(Projections.max("position"));
			maxCurrentPosition = (Long) maxPositionInGroupCriteria.uniqueResult();
		}
		
		long newPosition = maxCurrentPosition + 1;
		
		LayerGroupLayer lgl = new LayerGroupLayer();

		LayerGroupLayerId pk = new LayerGroupLayerId();
		pk.setLayer(layer);
		pk.setLayerGroup(layerGroup);

		lgl.setPk(pk);
		lgl.setPosition(newPosition);

		// Get the existing lgl's with a position >= to the
		// specified one
		Criteria criteria = session
				.createCriteria(LayerGroupLayer.class)
				.add(Restrictions.eq("pk.layerGroup.idLayerGroup",
						layerGroupId))
				.add(Restrictions.ge("position", newPosition));

		List<LayerGroupLayer> positionsToUpdateList = criteria.list();

		// Increment this list by 1
		for (LayerGroupLayer lay : positionsToUpdateList) {
			long currentPosition = lay.getPosition();
			lay.setPosition(currentPosition + 1);

			// save it
			lglr.save(session, lay);
		}
		session.flush();

		// Save new LGL
		lglr.save(session, lgl);
		
		session.flush();
	}
	
	public void reorderLayerInGroup(int layerGroupId, int layerId, long newPosition) throws Exception {
		
		if(newPosition <=0) {
			throw new DataInvalidException("newPosition is <=0");
		}
		
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerRepository lr = new LayerRepository();
			LayerGroupRepository lgr = new LayerGroupRepository();
			LayerGroupLayerRepository lglr = new LayerGroupLayerRepository();

			Transaction tx = session.beginTransaction();
			try {
				/*
				 * Test that the layer and the layerGroup exist
				 */
				Layer layer = lr.getById(session, Layer.class, layerId);
				LayerGroup layerGroup = lgr.getById(session, LayerGroup.class,
						layerGroupId);

				if (layer == null) {
					throw OperationInvalidException.createMissingIdExeption(
							"Layer", layerId);
				}

				if (layerGroup == null) {
					throw OperationInvalidException.createMissingIdExeption(
							"LayerGroup", layerGroupId);
				}

				/*
				 * Check if association exists
				 */
				LayerGroupLayer existingLgl = lglr
						.getLayerGroupsLayerByGroupIdAndLayerId(session,
								layerGroupId, layerId);

				if (existingLgl == null) {
					// Association does not exist
					throw new OperationInvalidException("EXC_LAYER_REORDER_ERROR_NOT_ASSOCIATED_TO_LAYERGROUP", "The layer is not associated to group.");
				}
					
				/*
				 * Association already existing: just a reorder.
				 */
				long oldPosition = existingLgl.getPosition();

				/*
				 * Items with a position < oldPosition do not change. 
				 * Items with a position between oldPosition and newPosition must
				 * be changed by one Items with a position > newPosition do
				 * not change.
				 */
				Criteria criteria = null;
				
				if (oldPosition == newPosition) {
					// it is the same position!
					return;
				}
				
				// Temporary save of new LGL
				existingLgl.setPosition(0);
				lglr.save(session, existingLgl);
				
				session.flush();
				
				int increment = 0;
				
				if (newPosition > oldPosition) {
					criteria = session
							.createCriteria(LayerGroupLayer.class)
							.add(Restrictions.eq("pk.layerGroup.idLayerGroup", layerGroupId))
							.add(Restrictions.ge("position", oldPosition))
							.add(Restrictions.le("position", newPosition))
							.addOrder(Order.asc("position"));
					
					increment = -1;
					
				} 
				else {
					criteria = session
							.createCriteria(LayerGroupLayer.class)
							.add(Restrictions.eq("pk.layerGroup.idLayerGroup", layerGroupId))
							.add(Restrictions.ge("position", newPosition))
							.add(Restrictions.le("position", oldPosition))
							.addOrder(Order.desc("position"));
					
					increment = 1;
				}

				List<LayerGroupLayer> positionsToUpdateList = criteria.list();

				// Add increment
				for (LayerGroupLayer lay : positionsToUpdateList) {
					long currentPosition = lay.getPosition();
					lay.setPosition(currentPosition + increment);

					// save it
					lglr.save(session, lay);
				}

				session.flush();
				
				// Update  LGL with the new position.
				existingLgl.setPosition(newPosition);
				lglr.save(session, existingLgl);

				tx.commit();
				
			} catch (Exception x) {
				// log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void moveLayerFromGroups(int oldLayerGroupId, int layerId, int newLayerGroupId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerRepository lr = new LayerRepository();
			LayerGroupRepository lgr = new LayerGroupRepository();

			Transaction tx = session.beginTransaction();
			try {
				/*
				 * Test that the layer and the oldLayerGroupId exist
				 */
				Layer layer = lr.getById(session, Layer.class, layerId);
				LayerGroup oldlayerGroup = lgr.getById(session, LayerGroup.class, oldLayerGroupId);
				LayerGroup newlayerGroup = lgr.getById(session, LayerGroup.class, newLayerGroupId);

				if (layer == null) {
					throw OperationInvalidException.createMissingIdExeption(
							"Layer", layerId);
				}

				if (oldlayerGroup == null) {
					throw OperationInvalidException.createMissingIdExeption(
							"LayerGroup", oldLayerGroupId);
				}
				
				if (newlayerGroup == null) {
					throw OperationInvalidException.createMissingIdExeption(
							"LayerGroup", newLayerGroupId);
				}

				//Remove from old group and add to the new one
				this.removeLayerFromLayerGroup(session, oldLayerGroupId, layerId);
				
				this.addLayerToLayerGroup(session, newLayerGroupId, layerId);

				tx.commit();
				
			} catch (Exception x) {
				// log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void removeLayerFromLayerGroup(int layerGroupId, int layerId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			

			Transaction tx = session.beginTransaction();
			try {
				removeLayerFromLayerGroup(session, layerGroupId, layerId);
				tx.commit();
			} catch (Exception x) {
				// log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	private void removeLayerFromLayerGroup(Session session, int layerGroupId, int layerId) throws Exception {
		LayerRepository lr = new LayerRepository();
		LayerGroupRepository lgr = new LayerGroupRepository();
		LayerGroupLayerRepository lglr = new LayerGroupLayerRepository();
		
		/*
		 * Test that the layer and the layerGroup exist
		 */
		Layer layer = lr.getById(session, Layer.class, layerId);
		LayerGroup layerGroup = lgr.getById(session, LayerGroup.class,
				layerGroupId);

		if (layer == null) {
			throw OperationInvalidException.createMissingIdExeption(
					"Layer", layerId);
		}

		if (layerGroup == null) {
			throw OperationInvalidException.createMissingIdExeption(
					"LayerGroup", layerGroupId);
		}

		/*
		 * Check if association exists
		 */
		LayerGroupLayer existingLgl = lglr.getLayerGroupsLayerByGroupIdAndLayerId(session, layerGroupId, layerId);

		if (existingLgl == null) return;
		
		removeLayerFromLayerGroup(session, existingLgl);
		
	}
	
	void removeLayerFromLayerGroup(Session session, LayerGroupLayer existingLgl) throws Exception {
		LayerGroupLayerRepository lglr = new LayerGroupLayerRepository();
		
		long oldPosition = existingLgl.getPosition();
		
		int layerGroupId = existingLgl.getLayerGroup().getIdLayerGroup();
		
		/*
		 * Items with a position greater than the oldPosition must be decremented by one
		 */
		Criteria criteria =  session
						.createCriteria(LayerGroupLayer.class)
						.add(Restrictions.eq("pk.layerGroup.idLayerGroup", layerGroupId))
						.add(Restrictions.gt("position", oldPosition))
						.addOrder(Order.asc("position"));

		List<LayerGroupLayer> positionsToUpdateList = criteria.list();

		// Remove the LGL
		lglr.delete(session, existingLgl);
		
		session.flush();
		
		// Decrement by 1
		for (LayerGroupLayer lay : positionsToUpdateList) {
			long currentPosition = lay.getPosition();
			lay.setPosition(currentPosition - 1);

			// save it
			lglr.save(session, lay);
		}
		session.flush();
	}
	
}
