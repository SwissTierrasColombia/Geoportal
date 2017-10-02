/*
 *  Copyright (C) 2007 - 2011 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *  
 *  This class has been created by Gesp SRL and it is based upon the
 *  
 */
package it.geosolutions.httpproxy;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.UsernamePasswordCredentials;
import org.apache.commons.httpclient.auth.AuthScope;

/**
 *
 * @author Alessio Fabiani at alessio.fabiani@geo-solutions.it
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 * @author Simone Giannecchini, GeoSolutions SAS
 * @contributor Andrea Pogliaghi, Gesp Srl
 */
public class RequestExecutor {

	ProxyConfig proxyConfig;
	
	public RequestExecutor(ProxyConfig config) {
        this.proxyConfig = config;
    }
	
	private final static Logger LOGGER = Logger.getLogger(RequestExecutor.class.toString());
	
	/**
     * Executes the {@link HttpMethod} passed in and sends the proxy response back to the client via the given {@link HttpServletResponse}
     * 
     * @param httpMethodProxyRequest An object representing the proxy request to be made
     * @param httpServletResponse An object by which we can send the proxied response back to the client
     * @param digest
     * @throws IOException Can be thrown by the {@link HttpClient}.executeMethod
     * @throws ServletException Can be thrown to indicate that another error has occurred
     */
    void executeProxyRequest(HttpClient httpClient, HttpMethod httpMethodProxyRequest,
            HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
            String user, String password, ProxyInfo proxyInfo, RequestExecutorCallbacks callbacks) throws IOException, ServletException {
    	
    	//???? ???
//    	httpClient.getState().clearCredentials();
//    	httpClient.getState().clearProxyCredentials();
//    	httpClient.getState().clearCookies();
    	///////
    	
        if (user != null && password != null) {
            //Authenticate user
        	UsernamePasswordCredentials upc = new UsernamePasswordCredentials(user, password);
            //multiThreadedHttpClient.getState().setCredentials(AuthScope.ANY, upc);
        	httpClient.getState().setCredentials(AuthScope.ANY, upc);
        	httpClient.getParams().setAuthenticationPreemptive(proxyConfig.isAuthorizationPreemptive());
            httpMethodProxyRequest.setDoAuthentication(true);
        } else {
        	//Do not authenticate user and remove existing authentication...
        	httpMethodProxyRequest.setDoAuthentication(false);
        }
        
        httpMethodProxyRequest.setFollowRedirects(false);

        InputStream inputStreamServerResponse = null;
        ByteArrayOutputStream baos = null;
        
        try {

            // //////////////////////////
            // Execute the request
            // //////////////////////////

            int intProxyResponseCode = httpClient.executeMethod(httpMethodProxyRequest);

            //onRemoteResponse(httpMethodProxyRequest);
            callbacks.onRemoteResponse(httpMethodProxyRequest);

            // ////////////////////////////////////////////////////////////////////////////////
            // Check if the proxy response is a redirect
            // The following code is adapted from
            // org.tigris.noodle.filters.CheckForRedirect
            // Hooray for open source software
            // ////////////////////////////////////////////////////////////////////////////////

            if (intProxyResponseCode >= HttpServletResponse.SC_MULTIPLE_CHOICES /* 300 */
                    && intProxyResponseCode < HttpServletResponse.SC_NOT_MODIFIED /* 304 */) {

                String stringStatusCode = Integer.toString(intProxyResponseCode);
                String stringLocation = httpMethodProxyRequest.getResponseHeader(
                        Utils.LOCATION_HEADER).getValue();

                if (stringLocation == null) {
                    throw new ServletException("Recieved status code: " + stringStatusCode
                            + " but no " + Utils.LOCATION_HEADER
                            + " header was found in the response");
                }

                // /////////////////////////////////////////////
                // Modify the redirect to go to this proxy
                // servlet rather that the proxied host
                // /////////////////////////////////////////////

                String stringMyHostName = httpServletRequest.getServerName();

                if (httpServletRequest.getServerPort() != 80) {
                    stringMyHostName += ":" + httpServletRequest.getServerPort();
                }

                stringMyHostName += httpServletRequest.getContextPath();
                httpServletResponse.sendRedirect(stringLocation.replace(
                        Utils.getProxyHostAndPort(proxyInfo) + proxyInfo.getProxyPath(),
                        stringMyHostName));

                return;

            } else if (intProxyResponseCode == HttpServletResponse.SC_NOT_MODIFIED) {

                // ///////////////////////////////////////////////////////////////
                // 304 needs special handling. See:
                // http://www.ics.uci.edu/pub/ietf/http/rfc1945.html#Code304
                // We get a 304 whenever passed an 'If-Modified-Since'
                // header and the data on disk has not changed; server
                // responds w/ a 304 saying I'm not going to send the
                // body because the file has not changed.
                // ///////////////////////////////////////////////////////////////

                httpServletResponse.setIntHeader(Utils.CONTENT_LENGTH_HEADER_NAME, 0);
                httpServletResponse.setStatus(HttpServletResponse.SC_NOT_MODIFIED);

                return;
            }

            // /////////////////////////////////////////////
            // Pass the response code back to the client
            // /////////////////////////////////////////////

            httpServletResponse.setStatus(intProxyResponseCode);

            // /////////////////////////////////////////////
            // Pass response headers back to the client
            // /////////////////////////////////////////////

            Header[] headerArrayResponse = httpMethodProxyRequest.getResponseHeaders();

            for (Header header : headerArrayResponse) {

                // /////////////////////////
                // Skip GZIP Responses
                // /////////////////////////

                if (header.getName().equalsIgnoreCase(Utils.HTTP_HEADER_ACCEPT_ENCODING)
                        && header.getValue().toLowerCase().contains("gzip"))
                    continue;
                else if (header.getName().equalsIgnoreCase(Utils.HTTP_HEADER_CONTENT_ENCODING)
                        && header.getValue().toLowerCase().contains("gzip"))
                    continue;
                else if (header.getName().equalsIgnoreCase(Utils.HTTP_HEADER_TRANSFER_ENCODING))
                    continue;
//                else if (header.getName().equalsIgnoreCase(Utils.HTTP_HEADER_WWW_AUTHENTICATE))
//                    continue;                
                else
                    httpServletResponse.setHeader(header.getName(), header.getValue());
            }

            // ///////////////////////////////////
            // Send the content to the client
            // ///////////////////////////////////
            
            inputStreamServerResponse = httpMethodProxyRequest
            		.getResponseBodyAsStream();
            
            if(inputStreamServerResponse != null){
                byte[] b = new byte[proxyConfig.getDefaultStreamByteSize()];
                
                baos = new ByteArrayOutputStream(b.length);
                
                int read = 0;
    		    while((read = inputStreamServerResponse.read(b)) > 0){ 
    		      	baos.write(b, 0, read);
    		        baos.flush();
    		    }
    	            
    		    baos.writeTo(httpServletResponse.getOutputStream());
            }
            
        } catch (HttpException e) {
            if (LOGGER.isLoggable(Level.SEVERE))
                LOGGER.log(Level.SEVERE, "Error executing HTTP method ", e);
        } finally {
			try {
	        	if(inputStreamServerResponse != null)
	        		inputStreamServerResponse.close();
			} catch (IOException e) {
				if (LOGGER.isLoggable(Level.SEVERE))
					LOGGER.log(Level.SEVERE,
							"Error closing request input stream ", e);
				throw new ServletException(e.getMessage());
			}
			
			try {
	        	if(baos != null){
	        		baos.flush();
	        		baos.close();
	        	}
			} catch (IOException e) {
				if (LOGGER.isLoggable(Level.SEVERE))
					LOGGER.log(Level.SEVERE,
							"Error closing response stream ", e);
				throw new ServletException(e.getMessage());
			}
        	
            httpMethodProxyRequest.releaseConnection();
            
        }
    }
}
