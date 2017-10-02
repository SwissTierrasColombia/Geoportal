package it.gesp.geoportal.services;

import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.entities.Comment;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.dao.repositories.CommentRepository;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class CommentService {
	private static final Logger log = Logger.getLogger(CommentService.class);
	
	public Comment getCommentByUser(User user) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			CommentRepository cr = new CommentRepository();
			return cr.getCommentByUser(session, user);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void saveCommentForUser(User user, String commentText) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			CommentRepository cr = new CommentRepository();

			Transaction tx = session.beginTransaction();
			try {

				/*
				 * Check existing comment for the user
				 */
				Comment existingCommentForUser = cr.getCommentByUser(session, user);
				if (existingCommentForUser == null) {
					//Not existing
					Comment comment = new Comment();
					comment.setUser(user);
					comment.setText(commentText);
					
					cr.save(session, comment);
				}
				else {
					//Already existing
					existingCommentForUser.setText(commentText);
					
					cr.save(session, existingCommentForUser);
				}
				
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
}
