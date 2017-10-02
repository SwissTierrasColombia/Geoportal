package it.gesp.geoportal.services;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLEncoder;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.SimpleHttpConnectionManager;
import org.apache.commons.httpclient.methods.InputStreamRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpConnectionManagerParams;
import org.apache.log4j.Logger;


public class HttpCallService {

	private static final Logger log = Logger.getLogger(HttpCallService.class);
	
	private static final int TIMEOUT = 30000;
	
	public String performHttpCall(URL url) throws Exception {
		return this.performHttpCall(url, null);
	}
	
	public String performHttpCall(URL url, String body) throws Exception {
		SimpleHttpConnectionManager singleConnectionManager = null;
    	HttpClient httpClient = null;

    	HttpConnectionManagerParams params = new HttpConnectionManagerParams();

        params.setSoTimeout(TIMEOUT);
        params.setConnectionTimeout(TIMEOUT);
        
        singleConnectionManager = new SimpleHttpConnectionManager();
        singleConnectionManager.setParams(params);
        httpClient = new HttpClient(singleConnectionManager);
        
        PostMethod requestMethod = new PostMethod(url.toExternalForm());
        
        if (body != null) {
        	//Post body
        	requestMethod.setRequestEntity(new InputStreamRequestEntity(new ByteArrayInputStream(body.getBytes())));
        }
        
        log.debug("Executing method POST on URL: " + url.toExternalForm());
        log.debug("Request body: " +body);
        
        requestMethod.setFollowRedirects(false);

        InputStream inputStreamServerResponse = null;
        ByteArrayOutputStream baos = null;
        
        try {

        	String responseString = null;
        	
        	// Execute the request
        	int intResponseCode = httpClient.executeMethod(requestMethod);
        	log.debug("Response from URL: " + url.toExternalForm() + " = " + intResponseCode);
            log.debug("Parsing response...");

            // Read the response
            inputStreamServerResponse = requestMethod.getResponseBodyAsStream();
            
            if(inputStreamServerResponse != null){
                byte[] b = new byte[1024];
                
                baos = new ByteArrayOutputStream(b.length);
                
                int read = 0;
    		    while((read = inputStreamServerResponse.read(b)) > 0){ 
    		      	baos.write(b, 0, read);
    		        baos.flush();
    		    }
    	            
    		   //responseString = new String(baos.toByteArray(), "UTF-8");
    		    responseString = new String(baos.toByteArray(), org.apache.commons.lang3.CharEncoding.UTF_8);
    		    
            }
            
            log.debug("Response String: " + responseString);
            return responseString;
            
        } catch (HttpException e) {
            log.error("Error executing HTTP method ", e);
            return null;
            
        } catch (IOException e) {
        	log.error("Error parsing the Response of the HTTP method ", e);
            return null;
        }
        finally {
			try {
	        	if(inputStreamServerResponse != null)
	        		inputStreamServerResponse.close();
			} catch (IOException e) {
				log.error("Error closing request input stream ", e);
				throw new Exception(e.getMessage());
			}
			
			try {
	        	if(baos != null){
	        		baos.flush();
	        		baos.close();
	        	}
			} catch (IOException e) {
				log.error("Error closing response stream ", e);
				throw new Exception(e.getMessage());
			}

			requestMethod.releaseConnection();
			singleConnectionManager.shutdown();
        }
	}
	
	public static String addParameterToURL(String URL, String name, String value){
		try {
			int qpos = URL.indexOf('?');
			int hpos = URL.indexOf('#');
			char sep = qpos == -1 ? '?' : '&';
			String seg = sep + URLEncoder.encode(name, "UTF-8") + '=' + URLEncoder.encode(value, "UTF-8");
			return hpos == -1 ? URL + seg : URL.substring(0, hpos) + seg + URL.substring(hpos);
		} catch (UnsupportedEncodingException x) {
			throw new IllegalArgumentException();
		}
	}
}
