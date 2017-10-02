package it.gesp.geoportal.listeners;

import it.gesp.geoportal.dao.SessionFactoryManager;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.log4j.Logger;


public class AppStartListener implements ServletContextListener {
	
	private static final Logger log = Logger.getLogger(AppStartListener.class);

	@Override
	public void contextInitialized(ServletContextEvent event) {
		/*
		 * Load hibernate
		 */
		log.info("Context Initialized: Initializing Hibernate Session Factory....");
		SessionFactoryManager.initSessionFactory();
		log.info("Context Initialized: Application Start: Session Factory initialized.");
	}
	
	@Override
	public void contextDestroyed(ServletContextEvent event) {

		/*
		 * Close hibernate
		 */
		log.info("Context Destroyed: Shutting down Hibernate Session Factory....");
		SessionFactoryManager.shutdownSessionFactory();
		log.info("Context Destroyed: Session Factory shut down.");
	}

}
