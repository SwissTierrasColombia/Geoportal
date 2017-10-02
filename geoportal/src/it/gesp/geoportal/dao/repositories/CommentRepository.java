package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.Comment;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

public class CommentRepository extends BaseRepository<Comment> {

	private static final Logger log = Logger.getLogger(CommentRepository.class);
	
	@SuppressWarnings("unchecked")
	public Comment getCommentByUser(Session session, User user) {
//		try {
			
			//Retrieve only the map with the given mapName
			Criteria criteria = session.createCriteria(Comment.class);
			criteria.add(Restrictions.eq("user", user));
			List<Comment> comments = criteria.list();
			
			if (comments.size() > 0) {
				return comments.get(0);
			}
			return null;
			
//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
	
}
