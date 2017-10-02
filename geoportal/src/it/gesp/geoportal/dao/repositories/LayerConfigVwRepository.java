package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.LayerConfigVw;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Session;

public class LayerConfigVwRepository extends BaseRepository<LayerConfigVw> {

	private static final Logger log = Logger.getLogger(LayerConfigVwRepository.class);

	public List<LayerConfigVw> getLayerConfigVw(Session session) {
//		try {

			List<LayerConfigVw> results = this.getAll(session, LayerConfigVw.class);
			return results;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}

	}
}
