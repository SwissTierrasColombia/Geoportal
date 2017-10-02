package it.geosolutions.httpproxy;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

public class CustomSessionListener implements HttpSessionListener {
	
	private static int totalActiveSessions;
	
	@Override
	  public void sessionDestroyed(HttpSessionEvent event) {
		totalActiveSessions--;
		System.out.println("sessionDestroyed - deduct one session from counter " + totalActiveSessions + ")");
		HttpSession session = event.getSession();
		ServletContext context = session.getServletContext();
		String proxyPropPath = context.getInitParameter("proxyPropPath");
        
		ProxyConfig proxyConfig = new ProxyConfig(context, proxyPropPath);
		if (OperationMode.PER_SESSION.equals(proxyConfig.getOperationMode())) {
			//Kill the HttpClients
			System.out.println("Killing the Http client corresponding to the Session...");
			Long key = (Long)session.getAttribute(HttpClientFactory.HTTP_CLIENT_SESSION_KEY);
			System.out.println("Key: " + key);
			HttpClientFactory.closeSession(key);
		}
	  }

	@Override
	public void sessionCreated(HttpSessionEvent arg0) {
		totalActiveSessions++;
		System.out.println("sessionCreated - add one session into counter (" + totalActiveSessions + ")");
		
	}
}
