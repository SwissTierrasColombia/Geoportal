package it.geosolutions.httpproxy;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.SimpleHttpConnectionManager;
import org.apache.commons.httpclient.params.HttpConnectionManagerParams;

public class HttpClientFactory {
	
	private final static Logger LOGGER = Logger.getLogger(HttpClientFactory.class.toString());
	
	public final static String HTTP_CLIENT_SESSION_KEY = "KEY";
	
	ProxyConfig proxyConfig;
	
	/**
     * An Apache commons HTTP client backed by a multithreaded connection manager that allows to reuse connections to the backing server and to limit
     * the max number of concurrent connections.
     */
//    private MultiThreadedHttpConnectionManager multiThreadedConnectionManager;

    /**
     * An HTTP "user-agent", containing an HTTP state and one or more HTTP connections, to which HTTP methods can be applied.
     */
    private HttpClient multiThreadedHttpClient;
    
    
    static private Map<Long, HttpClient> httpClientMap = new HashMap<Long, HttpClient>();
    
    private long nextHttpClientMapKey = 0;
    
	HttpClientFactory(ProxyConfig proxyConfig) {
		this.proxyConfig = proxyConfig;	
		init();
	}

	public static void closeSession(Long key) {
		
		synchronized(httpClientMap) {
			HttpClient httpClient = httpClientMap.get(key);
			
			if (httpClient != null) {
				//Shut it down and remove key from map...
				httpClientMap.remove(key);
				((MultiThreadedHttpConnectionManager)httpClient.getHttpConnectionManager()).shutdown();
			}
		}
	}
	
	private void init() {
        
        //Get operation mode.
        if (OperationMode.SHARED_MULTITHREADED.equals(proxyConfig.getOperationMode())) {
        	
        	/*
        	 * If it is a SHARED connection model, a Multithreaded connection manager
        	 * is created and it is used for all connections
        	 */
        	
        	//Set parameters
        	HttpConnectionManagerParams params = new HttpConnectionManagerParams();
        	params.setSoTimeout(proxyConfig.getSoTimeout());
            params.setConnectionTimeout(proxyConfig.getConnectionTimeout());
            params.setMaxTotalConnections(proxyConfig.getMaxTotalConnections());
            params.setDefaultMaxConnectionsPerHost(proxyConfig.getDefaultMaxConnectionsPerHost());
        	
            multiThreadedHttpClient = createMultiThreadedHttpClient(params);
        }        
	}
	
	public void closeHttpClient(HttpClient httpClient, boolean forceClose) {
		if (OperationMode.PER_REQUEST.equals(proxyConfig.getOperationMode()) || forceClose)
        	((SimpleHttpConnectionManager)httpClient.getHttpConnectionManager()).shutdown();
	}
	
	private Long getNextHttpClientMapKey() {
		Long key = this.nextHttpClientMapKey;
		this.nextHttpClientMapKey++;
		
		return key;
	}
	public HttpClient getHttpClient(HttpServletRequest httpServletRequest, boolean singleRequestOverride) {
		
        if (OperationMode.SHARED_MULTITHREADED.equals(proxyConfig.getOperationMode()) && !singleRequestOverride) {
        	//Shared 
        	HttpClient httpClient = multiThreadedHttpClient;
        	return httpClient;
        }
        else if (OperationMode.PER_REQUEST.equals(proxyConfig.getOperationMode()) || singleRequestOverride) {
        	//Per-request or singlerequest override
        	HttpClient httpClient = createSingleHttpClient();
        	return httpClient;
        }
        else if (OperationMode.PER_SESSION.equals(proxyConfig.getOperationMode()) && !singleRequestOverride) {
        	//Per-session
        	
        	//See if there is a session already associated to this request
        	HttpSession session = httpServletRequest.getSession(false);
        	if (session == null) {
        		//New session
        		HttpSession newSession = httpServletRequest.getSession(true);
        		
        		//Set session timeout... (seconds)
        		//newSession.setMaxInactiveInterval(30);
        		
        		Long key = getNextHttpClientMapKey();
        		newSession.setAttribute(HTTP_CLIENT_SESSION_KEY, key);
        		
        		//New HttpClient
        		HttpClient newHttpClient = getSessionHttpClient();
        		
        		//Add to map
        		httpClientMap.put(key,  newHttpClient);
        		
        		return newHttpClient;
        	}
        	else {
        		//Session already established
        		Long key = (Long) session.getAttribute(HTTP_CLIENT_SESSION_KEY);
        		
        		synchronized(httpClientMap) {
	        		HttpClient httpClient = httpClientMap.get(key);
	        		
	        		if (key == null) {
	        			LOGGER.severe("Session key is null. Generating a new one and a new HttpClient!");
	        			key = getNextHttpClientMapKey();
	        			session.setAttribute(HTTP_CLIENT_SESSION_KEY, key);
	        			
	        			//New HttpClient
	            		HttpClient newHttpClient = getSessionHttpClient();
	            		
	            		//Add to map
	            		httpClientMap.put(key,  newHttpClient);
	            		
	            		return newHttpClient;
	        		}
	        		
	        		if (httpClient == null) {
	        			LOGGER.severe("Session key is not null, but the HttpClient is null! Generating a new HttpClient and reattaching it to the same key!");
	        			
	        			//New HttpClient
	            		HttpClient newHttpClient = getSessionHttpClient();
	            		
	            		//Add to map
	            		httpClientMap.put(key,  newHttpClient);
	            		
	            		return newHttpClient;
	        		}
	        		
	        		//Everything seems fine
	        		return httpClient;
        		}
        	}
        }
        LOGGER.severe("no httpclient created!!");
        return null;
	}
	
	
	private HttpClient createMultiThreadedHttpClient(HttpConnectionManagerParams params) {
		MultiThreadedHttpConnectionManager multiThreadedConnectionManager = new MultiThreadedHttpConnectionManager();

        //setSystemProxy(params);
        
        multiThreadedConnectionManager.setParams(params);
        HttpClient multiThreadedHttpClient = new HttpClient(multiThreadedConnectionManager);
        
        //
        // Check for system proxy usage
        //
        try {
            String proxyHost = System.getProperty("http.proxyHost");
            int proxyPort = 80;

            if (proxyHost != null && !proxyHost.isEmpty()) {
                try {
                    proxyPort = (System.getProperty("http.proxyPort") != null ? 
                    		Integer.parseInt(System.getProperty("http.proxyPort")) : proxyPort);
                    
                    multiThreadedHttpClient.getHostConfiguration().setProxy(proxyHost, proxyPort);

                } catch (Exception ex) {
                    LOGGER.warning("No proxy port found");
                }
            }
            
        } catch (Exception ex) {
            LOGGER.warning("Exception while setting the system proxy: " + ex.getLocalizedMessage());
        }
        
        return multiThreadedHttpClient;
    }
	
	
	private HttpClient createSingleHttpClient() {
    	SimpleHttpConnectionManager singleConnectionManager = null;
    	HttpClient httpClient = null;

    	HttpConnectionManagerParams params = new HttpConnectionManagerParams();

        params.setSoTimeout(proxyConfig.getSoTimeout());
        params.setConnectionTimeout(proxyConfig.getConnectionTimeout());
        //params.setMaxTotalConnections(proxyConfig.getMaxTotalConnections());
        
        //setSystemProxy(params);
        singleConnectionManager = new SimpleHttpConnectionManager();
        singleConnectionManager.setParams(params);
        httpClient = new HttpClient(singleConnectionManager);
        
        //
        // Check for system proxy usage
        //
        try {
            String proxyHost = System.getProperty("http.proxyHost");
            int proxyPort = 80;

            if (proxyHost != null && !proxyHost.isEmpty()) {
                try {
                    proxyPort = (System.getProperty("http.proxyPort") != null ? 
                    		Integer.parseInt(System.getProperty("http.proxyPort")) : proxyPort);
                    
                    //Da vedere...
                    httpClient.getHostConfiguration().setProxy(proxyHost, proxyPort);

                } catch (Exception ex) {
                    LOGGER.warning("No proxy port found");
                }
            }
            
        } catch (Exception ex) {
            LOGGER.warning("Exception while setting the system proxy: " + ex.getLocalizedMessage());
        }
        
        return httpClient;
    }
    
    private HttpClient getSessionHttpClient() {
    	
    	//Set parameters
    	HttpConnectionManagerParams params = new HttpConnectionManagerParams();
    	params.setSoTimeout(proxyConfig.getSoTimeout());
        params.setConnectionTimeout(proxyConfig.getConnectionTimeout());
        params.setMaxTotalConnections(proxyConfig.getMaxTotalConnections());
        params.setDefaultMaxConnectionsPerHost(proxyConfig.getDefaultMaxConnectionsPerHost());
    	
        HttpClient httpClient = this.createMultiThreadedHttpClient(params);
    	return httpClient;
    }
}
