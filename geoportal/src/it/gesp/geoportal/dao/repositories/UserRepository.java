package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.entities.Permission;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.FetchMode;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

public class UserRepository extends BaseRepository<User> {

	private static final Logger log = Logger.getLogger(UserRepository.class);
	
	@SuppressWarnings("unchecked")
	public List<User> getUsers(Session session, boolean retrievePassword) {
		List<User> users = null;
		//users = this.getAll(session, User.class);
		
		//Retrieve only the users that are not deleted!
		Criteria criteria = session.createCriteria(User.class);
		criteria.add(Restrictions.eq("deleted", false));
		users = criteria.list();
		
		if (!retrievePassword) {
			for(User u : users) {
				u.setPassword(null);
			}
		}
		
		return users;
	}
	
	public void deleteUser(Session session, int userId) {
		User user = getById(session, User.class, userId);
		delete(session, user);
	} 
	
	public User getUserByUsername(String username, boolean includePermissions) throws Exception{
		Session session = null;
		
		try {
			session = SessionFactoryManager.openSession();
			return getUserForLoginByUsername(session, username, includePermissions);
		} catch (Exception x) {
			throw x;
		} finally {
			session.close();
		}
	}
	
	public List<User> getUsersForRoleId(Session session, int roleId) {
		String hql ="select u from User u "
				  + "where u.role.idRole = (:roleId)";

		Query query = session.createQuery(hql).setParameter("roleId", roleId);
		
		List<User> users = query.list();
		
		return users;
	}
	
	public User getUserForLoginByUsername(Session session, String username, boolean includePermissions) {
		Criteria criteria = session.createCriteria(User.class);

//		if (includePermissions) {
//			/*
//			 * Be careful with fetch mode: JOIN, as it does not work with pagination
//			 * look here:
//			 * http://www.theotherian.com/2013/07/hibernate-joins-maxresults.html
//			 * http://blog.xebia.com/2008/12/11/sorting-and-pagination-with-hibernate-criteria-how-it-can-go-wrong-with-joins/
//			 * http://floledermann.blogspot.it/2007/10/solving-hibernate-criterias-distinct.html
//			 * 
//			 */
//			criteria.setFetchMode("permissions", FetchMode.JOIN);
//			criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
//		}
		
		if (includePermissions) {
			criteria.setFetchMode("role", FetchMode.JOIN);
		}
		criteria.add(Restrictions.eq("username", username));
		criteria.add(Restrictions.eq("deleted", false));
		criteria.add(Restrictions.eq("disabled", false));
		
		List<User> users = criteria.list();
		
		if (users.size() != 1) {
			return null;
		}
		
		User user = users.get(0);
		if (includePermissions) {
			List<String> permissionCodList = new ArrayList<String>();
			for (Permission p : user.getRole().getPermissions()) {
				permissionCodList.add(p.getCodPermission());
				
			}
			user.setPermissionCodList(permissionCodList);
		}
		
		return user;
	}
}
