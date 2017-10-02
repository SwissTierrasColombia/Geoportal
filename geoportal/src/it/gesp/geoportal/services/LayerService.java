package it.gesp.geoportal.services;

import static ch.lambdaj.Lambda.extract;
import static ch.lambdaj.Lambda.having;
import static ch.lambdaj.Lambda.on;
import static ch.lambdaj.Lambda.select;
import static ch.lambdaj.collection.LambdaCollections.with;
import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.dto.AlertConfigurationDTO;
import it.gesp.geoportal.dao.dto.LayerConfigOLOptionsDTO;
import it.gesp.geoportal.dao.dto.LayerConfigOptionsDTO;
import it.gesp.geoportal.dao.dto.LayerDTO;
import it.gesp.geoportal.dao.entities.AlertIntersection;
import it.gesp.geoportal.dao.entities.Layer;
import it.gesp.geoportal.dao.entities.LayerConfig;
import it.gesp.geoportal.dao.entities.LayerConfigVw;
import it.gesp.geoportal.dao.entities.LayerGroupLayer;
import it.gesp.geoportal.dao.entities.LayerSource;
import it.gesp.geoportal.dao.entities.LayerType;
import it.gesp.geoportal.dao.repositories.LayerConfigRepository;
import it.gesp.geoportal.dao.repositories.LayerConfigVwRepository;
import it.gesp.geoportal.dao.repositories.LayerGroupLayerRepository;
import it.gesp.geoportal.dao.repositories.LayerRepository;
import it.gesp.geoportal.dao.repositories.LayerSourceRepository;
import it.gesp.geoportal.dao.repositories.LayerTypeRepository;
import it.gesp.geoportal.exceptions.OperationInvalidException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.hamcrest.core.StringContains;
import org.hamcrest.text.IsEqualIgnoringCase;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class LayerService {
	private static final Logger log = Logger.getLogger(LayerService.class);
	
	public List<Layer> getLayers(boolean excludeCommercialLayers) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerRepository lr = new LayerRepository();
			
			return lr.getLayers(session, excludeCommercialLayers);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public List<LayerDTO> getLayerDetailsList(boolean showCommercialProviders) throws Exception {
		
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerConfigVwRepository lcr = new LayerConfigVwRepository();
			List<LayerConfigVw> list = lcr.getLayerConfigVw(session);
			
			/*Compose LayerDTO...*/
			List<LayerDTO> combinedFluent = with(list)
					.extract((on(LayerConfigVw.class).createLayerDTOFromLayerConfig()));
			
			List<LayerDTO> myResult = new ArrayList<LayerDTO>(combinedFluent);
			
			if (!showCommercialProviders) {
				//Remove layers that dont have a "id_layersource"
				
				Iterator<LayerDTO> iter = myResult.iterator();
				while (iter.hasNext()) {
					LayerDTO la = iter.next();
					if (la.getIdLayerSource() == null) {
						iter.remove();
					}
				}
			}
			
			return myResult;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public List<LayerDTO> getUnassociatedLayers(int mapId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerRepository lr = new LayerRepository();
			
			List<LayerDTO> layerDTOList = new ArrayList<LayerDTO>();
			
			List<Object[]> layerList = lr.getUnAssociatedLayers(session, mapId);
			for(Object[] obj : layerList) {
				
				Layer layer = (Layer)(obj[0]);
				String sourceName = (String)(obj[1]);
				
				LayerDTO lay = new LayerDTO();
				
				lay.setIdLayer(layer.getIdLayer());
				lay.setBaseLayer(layer.isBaseLayer());
				
				lay.setLayerName(layer.getLayerName());
				lay.setLayerTitle(layer.getLayerTitle());
				lay.setLayerDescription(layer.getLayerDescription());
				
				lay.setLayerSourceName(sourceName);
				lay.setExternal(layer.isExternal());

				layerDTOList.add(lay);
			}
			
			return layerDTOList;
			
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public List<Layer> getLayersByLayerGroupId_Cycle(int layerGroupId) throws Exception {
	
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerGroupLayerRepository lgr = new LayerGroupLayerRepository();

			List<LayerGroupLayer> layerGroupLayers = lgr.getLayerGroupsLayerByGroupId(session, layerGroupId);
			
			List <Layer> layers = new ArrayList<Layer>(); 
			
			for(LayerGroupLayer lgl : layerGroupLayers) {
				Layer lay = lgl.getLayer();
				layers.add(lay);
			}
			
			return layers;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public List<Layer> getLayersByMapId_Cycle(int mapId) throws Exception {
		
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerGroupLayerRepository lgr = new LayerGroupLayerRepository();

			List<LayerGroupLayer> layerGroupLayers = lgr.getLayerGroupsLayerByMapId(session, mapId);
			
			List <Layer> layers = new ArrayList<Layer>(); 
			
			for(LayerGroupLayer lgl : layerGroupLayers) {
				Layer lay = lgl.getLayer();
				layers.add(lay);
			}
			
			return layers;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public List <Layer> getLayersByMapId(int mapId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();

			LayerRepository lr = new LayerRepository();
			List <Layer> layers = lr.getLayersByMapId(session, mapId);
			
			return layers;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public Layer getLayerDetails(int layerId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			
			LayerRepository lr = new LayerRepository();
			
			Layer lay = lr.getById(Layer.class, layerId);
			
			if (lay == null) {
				throw OperationInvalidException.createMissingIdExeption("Layer", layerId);
			}
			
			return lay;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	private LayerConfig createLayerConfig(String imageFormat, double opacity, boolean singleTile, 
			boolean isBaseLayer, String cacheUrl, String cacheWorkspace, boolean cacheEnabled, String sldUrl, boolean sldOverrideEnabled) {
		
		//Gson gson = JsonFactory.getGson();
		
		LayerConfig lc = new LayerConfig();
		
		lc.setCacheUrl(cacheUrl);
		lc.setCacheWorkspace(cacheWorkspace);
		lc.setCacheEnabled(cacheEnabled);
		
		lc.setSldUrl(sldUrl);
		lc.setSldOverrideEnabled(sldOverrideEnabled);
		
		LayerConfigOptionsDTO options = new LayerConfigOptionsDTO();
		options.setFormat(imageFormat);
		
		/*
		 * If it is a JPEG image, it is not transparent!
		 */
		if ("imageFormat".contains("jpeg")) {
			options.setTransparent(false);	
		}
		else {
			options.setTransparent(true);
		}
		//String optionsAsJson = gson.toJson(options);
		String optionsAsJson = options.toJson();
		
		
		LayerConfigOLOptionsDTO olOptions = new LayerConfigOLOptionsDTO();
		
		//Default...
		olOptions.setBuffer(0);
		olOptions.setDisplayOutsideMaxExtent(true);
		olOptions.setIsBaseLayer(isBaseLayer);
		olOptions.setSingleTile(singleTile);
		
		olOptions.setOpacity(opacity);
		
		//String olOptionsAsJson = gson.toJson(olOptions);
		String olOptionsAsJson = olOptions.toJson();
		
		lc.setOptions(optionsAsJson);
		lc.setOlOptions(olOptionsAsJson);
		
		return lc;
	}
	
	public void addWMSLayer(Layer layer, Integer layerSourceId, String imageFormat, double opacity, 
			boolean singleTile, String cacheUrl, String cacheWorkspace, boolean cacheEnabled, String sldUrl, boolean sldOverrideEnabled) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerRepository lgr = new LayerRepository();
			LayerSourceRepository lsr = new LayerSourceRepository();
			LayerConfigRepository lcr = new LayerConfigRepository();
			LayerTypeRepository ltr = new LayerTypeRepository();

			Transaction tx = session.beginTransaction();
			try {
				
				/*
				 * Test that the layerSource exists (if specified)
				 */
				if (layerSourceId != null ) {
					LayerSource existingLayerSource = lsr.getById(session, LayerSource.class, layerSourceId);
					
					if (existingLayerSource == null) {
						throw OperationInvalidException.createMissingIdExeption("LayerSource", layerSourceId);
					}
					
					layer.setLayerSource(existingLayerSource);
					
				} 
				
				//Create a Layer Config with the corresponding parameters
				LayerConfig layerConfig = createLayerConfig(imageFormat, opacity, singleTile, layer.isBaseLayer(), cacheUrl, cacheWorkspace, cacheEnabled, sldUrl, sldOverrideEnabled);
				layer.setLayerConfig(layerConfig);
				
				//Save it
				lcr.save(session, layerConfig);
				
				
				/*
				 * Get the WMS Layer Type
				 */
				LayerType wmsLayerType = ltr.getWMSLayerType(session);
				
				if (wmsLayerType == null) {
					throw OperationInvalidException.createMissingKeyExeption("LayerType", "wms");
				}
				
				layer.setLayerType(wmsLayerType);
				
				lgr.save(session, layer);
				
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
	
	public void updateWMSLayer(int layerId, Layer newLayer, Integer newLayerSourceId, String newImageFormat, 
			double newOpacity, boolean singleTile, String newCacheUrl, String cacheWorkspace, 
			boolean newCacheEnabled, String sldUrl, boolean sldOverrideEnabled, boolean forceUpdate) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerRepository lr = new LayerRepository();
			LayerSourceRepository lsr = new LayerSourceRepository();
			LayerConfigRepository lcr = new LayerConfigRepository();
			
			LayerGroupService lgs = new LayerGroupService();

			Transaction tx = session.beginTransaction();
			try {
				
				Layer existingLayer = lr.getById(session, Layer.class, layerId);
				
				if (existingLayer == null) {
					throw OperationInvalidException.createMissingIdExeption("Layer", layerId);
				}
				
				/*
				 * If type is not WMS --> error
				 */
				if (!existingLayer.getLayerType().getTypeName().equals("wms")) {
					throw new OperationInvalidException("LAYER IS NOT A WMS!! ERROR");
				}
				
				/*
				 * Test that the layerSource exists (if specified)
				 */
				if (newLayerSourceId != null ) {
					LayerSource existingLayerSource = lsr.getById(session, LayerSource.class, newLayerSourceId);
					
					if (existingLayerSource == null) {
						throw OperationInvalidException.createMissingIdExeption("LayerSource", newLayerSourceId);
					}
					
					existingLayer.setLayerSource(existingLayerSource);
					
				} 
				
				
				/*
				 * Test if the isBaseLayer setting is being changed.
				 * If it is being changed, and the layer is associated to a GROUP,
				 * we send an error to the Caller.
				 * If we are forcing the update, skip this test
				 */
				if (existingLayer.isBaseLayer() != newLayer.isBaseLayer()) {
					//Base layer setting is changed.
					Set<LayerGroupLayer> set = existingLayer.getLayerGroupLayer();
					int associatedToGroups = set.size();
					
					if (associatedToGroups > 0) {
						if (!forceUpdate) {
							String groupName = set.iterator().next().getLayerGroup().getLayerGroupName();
							if (newLayer.isBaseLayer()) {
								//TO base layer
								throw new OperationInvalidException("EXC_LAYER_CHANGE_TO_BASELAYER_LAYER_GROUP", "The layer is currently associated to group " + groupName + ". If you set BaseLayer to true, the layer will be removed from group " + groupName + ".", groupName);	
							}
							else {
								//FROM base layer
								throw new OperationInvalidException("EXC_LAYER_CHANGE_FROM_BASELAYER_LAYER_GROUP", "The layer is currently associated to group " + groupName + ". If you set BaseLayer to false, the layer will be removed from group " + groupName + ".", groupName);
							}
						} else {
						
							//Let's deassociate the layer from the group.
							for(LayerGroupLayer lgr : set) {
								lgs.removeLayerFromLayerGroup(session, lgr);
							}
						}
					}
				}
				
				existingLayer.setBaseLayer(newLayer.isBaseLayer());
				existingLayer.setLayerTitle(newLayer.getLayerTitle());
				existingLayer.setLayerName(newLayer.getLayerName());
				existingLayer.setLayerDescription(newLayer.getLayerDescription());
				existingLayer.setResponsible(newLayer.getResponsible());
				existingLayer.setMetadataUuid(newLayer.getMetadataUuid());
				existingLayer.setWfsUrl(newLayer.getWfsUrl());
				existingLayer.setWcsUrl(newLayer.getWcsUrl());
				existingLayer.setExternal(newLayer.isExternal());
				existingLayer.setDownloadable(newLayer.isDownloadable());
				existingLayer.setWfsSearchEnabled(newLayer.isWfsSearchEnabled());
				existingLayer.setShowInfoDialog(newLayer.isShowInfoDialog());
				
				existingLayer.setAttributeNameForInfo(newLayer.getAttributeNameForInfo());
				existingLayer.setReferenceDate(newLayer.getReferenceDate());
				
				//Create a Layer Config with the corresponding parameters
				LayerConfig layerConfig = existingLayer.getLayerConfig();
				layerConfig.setCacheEnabled(newCacheEnabled);
				layerConfig.setCacheUrl(newCacheUrl);
				layerConfig.setCacheWorkspace(cacheWorkspace);
				
				layerConfig.setSldOverrideEnabled(sldOverrideEnabled);
				layerConfig.setSldUrl(sldUrl);
				
				//createLayerConfig(imageFormat, opacity, layer.isBaseLayer(), cacheUrl, cacheEnabled);
				LayerConfigOptionsDTO opts = layerConfig.getParsedOptions(); 
				
				/*
				 * If it is a JPEG image, it is not transparent!
				 */
				if (newImageFormat.contains("jpeg")) {
					opts.setTransparent(false);	
				}
				else {
					opts.setTransparent(true);
				}
				
				opts.setFormat(newImageFormat);
				
				LayerConfigOLOptionsDTO olOpts = layerConfig.getParsedOlOptions();
				olOpts.setIsBaseLayer(newLayer.isBaseLayer());
				olOpts.setOpacity(newOpacity);
				olOpts.setSingleTile(singleTile);
				
				layerConfig.setOptions(opts.toJson());
				layerConfig.setOlOptions(olOpts.toJson());
				
				//Save it
				lcr.update(session, layerConfig);
				
				lr.update(session, existingLayer);
				
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
	
	public void deleteLayer(int layerId, boolean forceDeletion) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerRepository lr = new LayerRepository();

			Transaction tx = session.beginTransaction();
			try {
				Layer existingLayer = lr.getById(session, Layer.class, layerId);
				
				if (existingLayer == null) {
					throw OperationInvalidException.createMissingIdExeption("Layer", layerId);
				}
				
				//Call the deletion
				deleteLayer(session, existingLayer, forceDeletion);

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
	
	private void deleteLayer(Session session, Layer existingLayer, boolean forceDeletion) throws Exception {
		LayerRepository lr = new LayerRepository();
		LayerGroupLayerRepository lglr = new LayerGroupLayerRepository();
		
		LayerGroupService lgs= new LayerGroupService();
		
		//Check if the layer has been associated to any group..
		Set<LayerGroupLayer> layerGroupAssociation = existingLayer.getLayerGroupLayer();
		int timesLayerIsUsed = layerGroupAssociation.size();
		
		//Check if the layer is used by the AlertIntersection
		Set<AlertIntersection> alertIntersections = existingLayer.getAlertIntersections();
		int timesLayerIsUsedInIntersections = alertIntersections.size();
		
		if ((timesLayerIsUsed + timesLayerIsUsedInIntersections) == 0) {
			lr.delete(session, existingLayer);
		}
		else if (timesLayerIsUsedInIntersections > 0) {
			throw new OperationInvalidException("EXC_LAYER_DELETE_ERROR_ALERTS_INTERSECTIONS_USING_LAYER", "Layer cannot be deleted");
		}
		else if (timesLayerIsUsed > 0 && !forceDeletion) {
			throw new OperationInvalidException("EXC_LAYER_DELETE_ERROR_GROUPS_USING_LAYER", "The layer cannot be deleted. There are " + timesLayerIsUsed + " groups using this layer.", "" + timesLayerIsUsed);
		}
		else {
			//Delete the association with the groups..
			for (LayerGroupLayer lgl : layerGroupAssociation) {
				//lglr.delete(session, lgl);
				//lgs.removeLayerFromLayerGroup(session, lgl.getLayerGroup().getIdLayerGroup(), lgl.getLayer().getIdLayer());
				lgs.removeLayerFromLayerGroup(session, lgl);
			}
			//layerGroupAssociation.clear();
			
			session.flush();
			
			//Delete the layer
			lr.delete(session, existingLayer);
		}
	}
	
	public List <LayerSource> getLayerSourcesByMapId(int mapId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();

			LayerSourceRepository lsr = new LayerSourceRepository();
			List <LayerSource> layers = lsr.getLayerSourcesByMapId(session, mapId);
			
			return layers;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	} 
	
	public List<LayerSource> getExternalLayerSources() throws Exception {
		
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();

			LayerSourceRepository lsr = new LayerSourceRepository();
			List <LayerSource> layerSources = lsr.getExternalLayerSources(session);
			
			return layerSources;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}

	public List <LayerSource> getLayerSources() throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();

			LayerSourceRepository lsr = new LayerSourceRepository();
			List <LayerSource> layers = lsr.getLayerSources(session);
			
			return layers;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void updateLayerSource(int layerSourceId, String newUrl, String newName, String newDescription, String newCacheUrl, boolean addToExternalWmsList) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerSourceRepository lsr = new LayerSourceRepository();

			Transaction tx = session.beginTransaction();
			try {
				LayerSource existingLayerSource = lsr.getById(session, LayerSource.class, layerSourceId);
				
				if (existingLayerSource == null) {
					throw OperationInvalidException.createMissingIdExeption("LayerSource", layerSourceId);
				}
				
				existingLayerSource.setUrl(newUrl);
				existingLayerSource.setCacheUrl(newCacheUrl);
				existingLayerSource.setLayerSourceName(newName);
				existingLayerSource.setLayerSourceDescription(newDescription);
				existingLayerSource.setAddToExternalWmsList(addToExternalWmsList);
				
				/*
				 * TODO
				 * If the cacheUrl changes,
				 * maybe also the layerCacheUrl should change accordingly...
				 */
				
				lsr.update(session, existingLayerSource);

				tx.commit();
			} catch (Exception x) {
				log.debug(x);
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
	
	public void deleteLayerSource(int layerSourceId, boolean forceDeletion) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerSourceRepository lsr = new LayerSourceRepository();

			Transaction tx = session.beginTransaction();
			try {
				LayerSource existingLayerSource = lsr.getById(session, LayerSource.class, layerSourceId);
				
				if (existingLayerSource == null) {
					throw OperationInvalidException.createMissingIdExeption("LayerSource", layerSourceId);
				}
				
				//Check if the layersource is used by any layers...
				
				Set<Layer> layersAssociation = existingLayerSource.getLayers();
				int timesLayerSourceIsUsed = layersAssociation.size();
				
				if (timesLayerSourceIsUsed == 0) {
					lsr.delete(session, existingLayerSource);
				}
				else if (timesLayerSourceIsUsed > 0 && !forceDeletion) {
					throw new OperationInvalidException("EXC_LAYERSOURCE_DELETE_ERROR_LAYERS_USING_LAYERSOURCE", "The layer cannot be deleted. There are " + timesLayerSourceIsUsed + " groups using this source.", "" + timesLayerSourceIsUsed);
				}
				else {
					//Delete the corresponding layers...
					for (Layer lay : layersAssociation) {
						deleteLayer(session, lay, forceDeletion);
					}
					//layersAssociation.clear();
					
					session.flush();
					
					//Delete the layersource
					lsr.delete(session, existingLayerSource);
				}

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
	
	public void addLayerSource(LayerSource layerSource) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerSourceRepository lsr = new LayerSourceRepository();

			Transaction tx = session.beginTransaction();
			try {
				
				lsr.save(session, layerSource);

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
	
	public List <LayerType> getLayerTypes() throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();

			LayerTypeRepository ltr = new LayerTypeRepository();
			List <LayerType> layerTypes = ltr.getLayerTypes(session);
			
			return layerTypes;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void test() throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();

			//Try lambdaJ
			
			Layer la1 = new Layer();
			la1.setLayerName("la1");
			
			Layer la2 = new Layer();
			la2.setLayerName("lb2");
			
			Layer la3 = new Layer();
			la3.setLayerName("lc3");
			
			Layer la4 = new Layer();
			la4.setLayerName("la1");
			
//			List<Layer> lays = new ArrayList<>();
//			lays.add(la1);
//			lays.add(la2);
//			lays.add(la3);
			
			/*
			 * REF:
			 * http://harisupriyanto.blogspot.it/2012/09/using-lambdaj-list-of-example.html
			 */
			
			List<Layer> lays = Arrays.asList(la1, la2, la3, la4);
			
			//Filter
			List<Layer> filtered = select(lays, having(on(Layer.class).getLayerName(), StringContains.containsString("la")));
			
			//Combine, exptract and select
			List<String> combined = extract(select(lays, having(on(Layer.class).getLayerName(), IsEqualIgnoringCase.equalToIgnoringCase("la1"))), on(Layer.class).getLayerName());
			
			/*
			 * With Fluent API (Lambda Collections)
			 * REF: https://code.google.com/p/lambdaj/wiki/LambdaCollections
			 * 
			 */
			List<String> combinedFluent = with(lays)
					.retain(
							having(
									on(Layer.class).getLayerName(), 
									StringContains.containsString("la")))
					.extract(on(Layer.class).getLayerName());
			
			Set<String> combinedFluent2 = with(lays).extract(on(Layer.class).getLayerName()).distinct();
			
			throw new OperationInvalidException("CODE", "error", "ciao");

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
}
