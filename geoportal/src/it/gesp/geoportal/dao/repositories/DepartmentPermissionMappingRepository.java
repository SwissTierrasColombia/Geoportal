package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.DepartmentPermissionMapping;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

@SuppressWarnings("rawtypes")
public class DepartmentPermissionMappingRepository extends BaseRepository {

	private static final Logger log = Logger.getLogger(DepartmentPermissionMappingRepository.class);
	
	public List<DepartmentPermissionMapping> getDepartmentPermissionMappingsFromPermissionList(Session session, List<String> permissionCodes) {
		
		Query query = session.createQuery("select dpm from DepartmentPermissionMapping dpm where dpm.codPermission in (:cods)");
		query.setParameterList("cods", permissionCodes);
		List res = query.list();

		return res;
	}
	
}
