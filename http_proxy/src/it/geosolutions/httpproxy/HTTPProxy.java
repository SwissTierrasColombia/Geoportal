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
 */
package it.geosolutions.httpproxy;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpConnectionManager;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.SimpleHttpConnectionManager;
import org.apache.commons.httpclient.methods.DeleteMethod;
import org.apache.commons.httpclient.methods.EntityEnclosingMethod;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.InputStreamRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.PutMethod;
import org.apache.commons.httpclient.methods.multipart.ByteArrayPartSource;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;
import org.apache.commons.httpclient.params.HttpConnectionManagerParams;

/**
 * HTTPProxy class.
 * 
 * @author Alessio Fabiani at alessio.fabiani@geo-solutions.it
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 * @author Simone Giannecchini, GeoSolutions SAS
 */
public class HTTPProxy extends HttpServlet {

    /**
     * Serialization UID.
     */
    private static final long serialVersionUID = -4770692886388850680L;

    private final static Logger LOGGER = Logger.getLogger(HTTPProxy.class.toString());

    /**
     * The maximum size for uploaded files in bytes. Default value is 5MB.
     */
    private int maxFileUploadSize = Utils.DEFAULT_MAX_FILE_UPLOAD_SIZE;

//    /**
//     * An Apache commons HTTP client backed by a multithreaded connection manager that allows to reuse connections to the backing server and to limit
//     * the max number of concurrent connections.
//     */
//    private MultiThreadedHttpConnectionManager multiThreadedConnectionManager;
//
//    /**
//     * An HTTP "user-agent", containing an HTTP state and one or more HTTP connections, to which HTTP methods can be applied.
//     */
//    private HttpClient multiThreadedHttpClient;

    /**
     * The proxy configuration.
     */
    private ProxyConfig proxyConfig;

    /**
     * HttpClient Factory
     */
    private static HttpClientFactory httpClientFactory;
    
    /**
     * The proxy collbacks to provide checks.
     */
    private List<ProxyCallback> callbacks;

    /**
     * Initialize the <code>ProxyServlet</code>
     * 
     * @param servletConfig The Servlet configuration passed in by the servlet conatiner
     */
    public void init(ServletConfig servletConfig) throws ServletException {
        super.init(servletConfig);

        ServletContext context = getServletContext();
        String proxyPropPath = context.getInitParameter("proxyPropPath");

        proxyConfig = new ProxyConfig(getServletContext(), proxyPropPath);

        httpClientFactory = new HttpClientFactory(proxyConfig);
        
//        proxyConfig.setOperationMode("shared");
//        
//        //Get operation mode.
//        if ("shared".equals(proxyConfig.getOperationMode())) {
//        	
//        	/*
//        	 * If it is a SHARED connection model, a Multithreaded connection manager
//        	 * is created and it is used for all connections
//        	 */
//        	
//        	multiThreadedConnectionManager = new MultiThreadedHttpConnectionManager();
//        	
//        	//Set parameters
//        	HttpConnectionManagerParams params = new HttpConnectionManagerParams();
//
//            params.setSoTimeout(proxyConfig.getSoTimeout());
//            params.setConnectionTimeout(proxyConfig.getConnectionTimeout());
//            params.setMaxTotalConnections(proxyConfig.getMaxTotalConnections());
//            params.setDefaultMaxConnectionsPerHost(proxyConfig.getDefaultMaxConnectionsPerHost());
//
//            //setSystemProxy(params);
//            
//            multiThreadedConnectionManager.setParams(params);
//            multiThreadedHttpClient = new HttpClient(multiThreadedConnectionManager);
//            
//            //
//            // Check for system proxy usage
//            //
//            try {
//                String proxyHost = System.getProperty("http.proxyHost");
//                int proxyPort = 80;
//
//                if (proxyHost != null && !proxyHost.isEmpty()) {
//                    try {
//                        proxyPort = (System.getProperty("http.proxyPort") != null ? 
//                        		Integer.parseInt(System.getProperty("http.proxyPort")) : proxyPort);
//                        
//                        multiThreadedHttpClient.getHostConfiguration().setProxy(proxyHost, proxyPort);
//
//                    } catch (Exception ex) {
//                        LOGGER.warning("No proxy port found");
//                    }
//                }
//                
//            } catch (Exception ex) {
//                LOGGER.warning("Exception while setting the system proxy: " + ex.getLocalizedMessage());
//            }
//        }
        
        /*
         * In case the Operation Mode is set to REQUEST or SESSION, no
         * initialization is done in the servlet init.
         */

        // //////////////////////////////////////////
        // Setup the callbacks (in the future this
        // will be a pluggable lookup).
        // //////////////////////////////////////////

        callbacks = new ArrayList<ProxyCallback>();
        callbacks.add(new MimeTypeChecker(proxyConfig));
        callbacks.add(new HostNameChecker(proxyConfig));
        callbacks.add(new RequestTypeChecker(proxyConfig));
        callbacks.add(new MethodsChecker(proxyConfig));
        callbacks.add(new HostChecker(proxyConfig));
    }
    
    /**
     * Set the system proxy host and port
     * 
     * @param params
     */
    /*public static void setSystemProxy(HttpConnectionManagerParams params) {
        try {
            String proxyHost = System.getProperty("http.proxyHost");
            int proxyPort = 80;

            if (proxyHost != null && !proxyHost.isEmpty()) {
                try {
                    proxyPort = (System.getProperty("http.proxyPort") != null ? Integer.parseInt(System.getProperty("http.proxyPort")) : proxyPort);

                    System.setProperty("java.net.useSystemProxies", "true");

                    params.setParameter("http.proxyHost", proxyHost);
                    params.setParameter("http.proxyPort", proxyPort);
                    
                    String nonProxyHosts = System.getProperty("http.nonProxyHosts");
                    if(nonProxyHosts != null && !nonProxyHosts.isEmpty()){
                    	params.setParameter("http.nonProxyHosts", nonProxyHosts);                   	
                    }

                } catch (Exception ex) {
                    LOGGER.warning("No proxy port found");
                }
            }
            
        } catch (Exception ex) {
            LOGGER.warning("Exception while setting the system proxy: " + ex.getLocalizedMessage());
        }
    }*/

    /**
     * @param request
     * @param response
     * @throws IOException
     */
    void onInit(HttpServletRequest request, HttpServletResponse response, URL url)
            throws IOException {
        for (ProxyCallback callback : callbacks) {
            callback.onRequest(request, response, url);
        }
    }

    /**
     * @param method
     * @throws IOException
     */
    final void onRemoteResponse(HttpMethod method) throws IOException {
        for (ProxyCallback callback : callbacks) {
            callback.onRemoteResponse(method);
        }
    }

    /**
     * @throws IOException
     */
    void onFinish() throws IOException {
        for (ProxyCallback callback : callbacks) {
            callback.onFinish();
        }
    }

    /**
     * Performs an HTTP GET request
     * 
     * @param httpServletRequest The {@link HttpServletRequest} object passed in by the servlet engine representing the client request to be proxied
     * @param httpServletResponse The {@link HttpServletResponse} object by which we can send a proxied response to the client
     */
    public void doGet(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse)
            throws IOException, ServletException {

        try {

            URL url = null;
            String user = null, password = null;
            
            String singleStr = null;
            boolean singleRequest = false;

            Set<?> entrySet = httpServletRequest.getParameterMap().entrySet();

            for (Object anEntrySet : entrySet) {
                Map.Entry header = (Map.Entry) anEntrySet;
                String key = (String) header.getKey();
                String value = ((String[]) header.getValue())[0];

                if ("user".equals(key)) {
                    user = value;
                } else if ("password".equals(key)) {
                    password = value;
                } else if ("url".equals(key)) {
                    url = new URL(value);
                } else if ("single".equals(key)) {
                	if (value.equalsIgnoreCase("true")) singleRequest = true;
                }
            }

            if (url != null) {

                onInit(httpServletRequest, httpServletResponse, url);

                // //////////////////////////////
                // Create a GET request
                // //////////////////////////////

                GetMethod getMethodProxyRequest = new GetMethod(url.toExternalForm());

                // //////////////////////////////
                // Forward the request headers
                // //////////////////////////////

                final ProxyInfo proxyInfo = setProxyRequestHeaders(url, httpServletRequest,
                        getMethodProxyRequest);
                
                // ////////////////////////////////////////////////
                // Get the HttpClient based on the OPERATIONAL MODE
                // ////////////////////////////////////////////////
                
                HttpClient httpClient = null;
                httpClient = httpClientFactory.getHttpClient(httpServletRequest, singleRequest);
                
                // //////////////////////////////
                // Execute the proxy request
                // //////////////////////////////
                
                RequestExecutor re = new RequestExecutor(proxyConfig);
                re.executeProxyRequest(httpClient, getMethodProxyRequest, httpServletRequest,
                        httpServletResponse, user, password, proxyInfo, new RequestExecutorCallbacks() {
							
                	@Override
					public void onRemoteResponse(HttpMethod httpMethodProxyRequest) throws IOException {
						HTTPProxy.this.onRemoteResponse(httpMethodProxyRequest);
					}
				});
                
                httpClientFactory.closeHttpClient(httpClient, singleRequest);
            }
        } catch (HttpErrorException ex) {
            httpServletResponse.sendError(ex.getCode(), ex.getMessage());
        } finally {
            onFinish();
        }
    }

    /**
     * Performs an HTTP POST request
     * 
     * @param httpServletRequest The {@link HttpServletRequest} object passed in by the servlet engine representing the client request to be proxied
     * @param httpServletResponse The {@link HttpServletResponse} object by which we can send a proxied response to the client
     */
    public void doPost(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) throws IOException, ServletException {
        try {

            URL url = null;
            String user = null, password = null;
            String singleStr = null;
            boolean singleRequest = false;
            
            
            //Parse the queryString to not read the request body calling getParameter from httpServletRequest
            // so the method can simply forward the request body
            Map<String,String> pars=  splitQuery(httpServletRequest.getQueryString());

            for (String  key : pars.keySet()) {

                String value = pars.get(key);

                if ("user".equals(key)) {
                    user = value;
                } else if ("password".equals(key)) {
                    password = value;
                } else if ("url".equals(key)) {
                    url = new URL(value);
                } else if ("single".equals(key)) {
                	if (value.equalsIgnoreCase("true")) singleRequest = true;
                }
            }

            if (url != null) {

                onInit(httpServletRequest, httpServletResponse, url);

                // /////////////////////////////////
                // Create a standard POST request
                // /////////////////////////////////

                PostMethod postMethodProxyRequest = new PostMethod(url.toExternalForm());

                // /////////////////////////////////
                // Forward the request headers
                // /////////////////////////////////

                final ProxyInfo proxyInfo = setProxyRequestHeaders(url, httpServletRequest,
                        postMethodProxyRequest);

                // //////////////////////////////////////////////////
                // Check if this is a mulitpart (file upload) POST
                // //////////////////////////////////////////////////

                if (ServletFileUpload.isMultipartContent(httpServletRequest)) {
                    this.handleMultipart(postMethodProxyRequest, httpServletRequest);
                } else {
                    this.handleStandard(postMethodProxyRequest, httpServletRequest);
                }

                // ////////////////////////////////////////////////
                // Get the HttpClient based on the OPERATIONAL MODE
                // ////////////////////////////////////////////////
                
                HttpClient httpClient = null;
                httpClient = httpClientFactory.getHttpClient(httpServletRequest, singleRequest);
                
                // //////////////////////////////
                // Execute the proxy request
                // //////////////////////////////
                RequestExecutor re = new RequestExecutor(proxyConfig);
                re.executeProxyRequest(httpClient, postMethodProxyRequest, httpServletRequest,
                        httpServletResponse, user, password, proxyInfo, new RequestExecutorCallbacks() {
							
                	@Override
					public void onRemoteResponse(HttpMethod httpMethodProxyRequest) throws IOException {
                		HTTPProxy.this.onRemoteResponse(httpMethodProxyRequest);
					}
				});
                
                httpClientFactory.closeHttpClient(httpClient, singleRequest);
                
            }

        } catch (HttpErrorException ex) {
            httpServletResponse.sendError(ex.getCode(), ex.getMessage());
        } finally {
            onFinish();
        }
    }

    /**
     * Performs an HTTP PUT request
     * 
     * @param httpServletRequest The {@link HttpServletRequest} object passed in by the servlet engine representing the client request to be proxied
     * @param httpServletResponse The {@link HttpServletResponse} object by which we can send a proxied response to the client
     */
    public void doPut(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse)
            throws IOException, ServletException {

        try {

            URL url = null;
            String user = null, password = null;
          //Parse the queryString to not read the request body calling getParameter from httpServletRequest
            // so the method can simply forward the request body
            Map<String,String> pars=  splitQuery(httpServletRequest.getQueryString());

            boolean singleRequest = false;
            
            for (String  key : pars.keySet()) {

                String value = pars.get(key);

                if ("user".equals(key)) {
                    user = value;
                } else if ("password".equals(key)) {
                    password = value;
                } else if ("url".equals(key)) {
                    url = new URL(value);
                } else if ("single".equals(key)) {
                	if (value.equalsIgnoreCase("true")) singleRequest = true;
                }
            }
            if (url != null) {

                onInit(httpServletRequest, httpServletResponse, url);

                // ////////////////////////////////
                // Create a standard PUT request
                // ////////////////////////////////

                PutMethod putMethodProxyRequest = new PutMethod(url.toExternalForm());

                // ////////////////////////////////
                // Forward the request headers
                // ////////////////////////////////

                final ProxyInfo proxyInfo = setProxyRequestHeaders(url, httpServletRequest,
                        putMethodProxyRequest);

                // //////////////////////////////////////////////////
                // Check if this is a mulitpart (file upload) PUT
                // //////////////////////////////////////////////////

                if (ServletFileUpload.isMultipartContent(httpServletRequest)) {
                    this.handleMultipart(putMethodProxyRequest, httpServletRequest);
                } else {
                    this.handleStandard(putMethodProxyRequest, httpServletRequest);
                }

                // ////////////////////////////////////////////////
                // Get the HttpClient based on the OPERATIONAL MODE
                // ////////////////////////////////////////////////
                
                HttpClient httpClient = null;
                httpClient = httpClientFactory.getHttpClient(httpServletRequest, singleRequest);
                
                // //////////////////////////////
                // Execute the proxy request
                // //////////////////////////////
                RequestExecutor re = new RequestExecutor(proxyConfig);
                re.executeProxyRequest(httpClient, putMethodProxyRequest, httpServletRequest,
                        httpServletResponse, user, password, proxyInfo, new RequestExecutorCallbacks() {
							
                	@Override
					public void onRemoteResponse(HttpMethod httpMethodProxyRequest) throws IOException {
                		HTTPProxy.this.onRemoteResponse(httpMethodProxyRequest);
					}
				});

                httpClientFactory.closeHttpClient(httpClient, singleRequest);
                
            }

        } catch (HttpErrorException ex) {
            httpServletResponse.sendError(ex.getCode(), ex.getMessage());
        } finally {
            onFinish();
        }

    }

    /**
     * Performs an HTTP DELETE request
     * 
     * @param httpServletRequest The {@link HttpServletRequest} object passed in by the servlet engine representing the client request to be proxied
     * @param httpServletResponse The {@link HttpServletResponse} object by which we can send a proxied response to the client
     */
    public void doDelete(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) throws IOException, ServletException {

        try {
            URL url = null;
            String user = null, password = null;

          //Parse the queryString to not read the request body calling getParameter from httpServletRequest
            Map<String,String> pars=  splitQuery(httpServletRequest.getQueryString());

            boolean singleRequest = false;
            
            for (String  key : pars.keySet()) {

                String value = pars.get(key);

                if ("user".equals(key)) {
                    user = value;
                } else if ("password".equals(key)) {
                    password = value;
                } else if ("url".equals(key)) {
                    url = new URL(value);
                } else if ("single".equals(key)) {
                	if (value.equalsIgnoreCase("true")) singleRequest = true;
                }
            }

            if (url != null) {

                onInit(httpServletRequest, httpServletResponse, url);

                // ////////////////////////////////
                // Create a standard DELETE request
                // ////////////////////////////////

                DeleteMethod deleteMethodProxyRequest = new DeleteMethod(url.toExternalForm());

                // ////////////////////////////////
                // Forward the request headers
                // ////////////////////////////////

                final ProxyInfo proxyInfo = setProxyRequestHeaders(url, httpServletRequest,
                        deleteMethodProxyRequest);

                // ////////////////////////////////////////////////
                // Get the HttpClient based on the OPERATIONAL MODE
                // ////////////////////////////////////////////////
                
                HttpClient httpClient = null;
                httpClient = httpClientFactory.getHttpClient(httpServletRequest, singleRequest);
                
                // //////////////////////////////
                // Execute the proxy request
                // //////////////////////////////
                RequestExecutor re = new RequestExecutor(proxyConfig);
                re.executeProxyRequest(httpClient, deleteMethodProxyRequest, httpServletRequest,
                        httpServletResponse, user, password, proxyInfo, new RequestExecutorCallbacks() {
							
                	@Override
					public void onRemoteResponse(HttpMethod httpMethodProxyRequest) throws IOException {
						HTTPProxy.this.onRemoteResponse(httpMethodProxyRequest);
					}
				});

                httpClientFactory.closeHttpClient(httpClient, singleRequest);
            }

        } catch (HttpErrorException ex) {
            httpServletResponse.sendError(ex.getCode(), ex.getMessage());
        } finally {
            onFinish();
        }
    }

    /**
     * Sets up the given {@link PostMethod} to send the same multipart POST data as was sent in the given {@link HttpServletRequest}
     * 
     * @param postMethodProxyRequest The {@link PostMethod} that we are configuring to send a multipart POST request
     * @param httpServletRequest The {@link HttpServletRequest} that contains the mutlipart POST data to be sent via the {@link PostMethod}
     */
    private void handleMultipart(EntityEnclosingMethod methodProxyRequest,
            HttpServletRequest httpServletRequest) throws ServletException {

        // ////////////////////////////////////////////
        // Create a factory for disk-based file items
        // ////////////////////////////////////////////

        DiskFileItemFactory diskFileItemFactory = new DiskFileItemFactory();

        // /////////////////////////////
        // Set factory constraints
        // /////////////////////////////

        diskFileItemFactory.setSizeThreshold(this.getMaxFileUploadSize());
        diskFileItemFactory.setRepository(Utils.DEFAULT_FILE_UPLOAD_TEMP_DIRECTORY);

        // //////////////////////////////////
        // Create a new file upload handler
        // //////////////////////////////////

        ServletFileUpload servletFileUpload = new ServletFileUpload(diskFileItemFactory);

        // //////////////////////////
        // Parse the request
        // //////////////////////////

        try {

            // /////////////////////////////////////
            // Get the multipart items as a list
            // /////////////////////////////////////

            List<FileItem> listFileItems = (List<FileItem>) servletFileUpload
                    .parseRequest(httpServletRequest);

            // /////////////////////////////////////////
            // Create a list to hold all of the parts
            // /////////////////////////////////////////

            List<Part> listParts = new ArrayList<Part>();

            // /////////////////////////////////////////
            // Iterate the multipart items list
            // /////////////////////////////////////////

            for (FileItem fileItemCurrent : listFileItems) {

                // //////////////////////////////////////
                // If the current item is a form field,
                // then create a string part
                // //////////////////////////////////////

                if (fileItemCurrent.isFormField()) {
                    StringPart stringPart = new StringPart(
                    // The field name
                            fileItemCurrent.getFieldName(),
                            // The field value
                            fileItemCurrent.getString());

                    // ////////////////////////////
                    // Add the part to the list
                    // ////////////////////////////

                    listParts.add(stringPart);

                } else {

                    // /////////////////////////////////////////////////////
                    // The item is a file upload, so we create a FilePart
                    // /////////////////////////////////////////////////////

                    FilePart filePart = new FilePart(

                    // /////////////////////
                    // The field name
                    // /////////////////////

                            fileItemCurrent.getFieldName(),

                            new ByteArrayPartSource(
                            // The uploaded file name
                                    fileItemCurrent.getName(),
                                    // The uploaded file contents
                                    fileItemCurrent.get()));

                    // /////////////////////////////
                    // Add the part to the list
                    // /////////////////////////////

                    listParts.add(filePart);
                }
            }

            MultipartRequestEntity multipartRequestEntity = new MultipartRequestEntity(
                    listParts.toArray(new Part[] {}), methodProxyRequest.getParams());

            methodProxyRequest.setRequestEntity(multipartRequestEntity);

            // ////////////////////////////////////////////////////////////////////////
            // The current content-type header (received from the client) IS of
            // type "multipart/form-data", but the content-type header also
            // contains the chunk boundary string of the chunks. Currently, this
            // header is using the boundary of the client request, since we
            // blindly copied all headers from the client request to the proxy
            // request. However, we are creating a new request with a new chunk
            // boundary string, so it is necessary that we re-set the
            // content-type string to reflect the new chunk boundary string
            // ////////////////////////////////////////////////////////////////////////

            methodProxyRequest.setRequestHeader(Utils.CONTENT_TYPE_HEADER_NAME,
                    multipartRequestEntity.getContentType());

        } catch (FileUploadException fileUploadException) {
            throw new ServletException(fileUploadException);
        }
    }

    /**
     * Sets up the given {@link PostMethod} to send the same standard POST data as was sent in the given {@link HttpServletRequest}
     * 
     * @param postMethodProxyRequest The {@link PostMethod} that we are configuring to send a standard POST request
     * @param httpServletRequest The {@link HttpServletRequest} that contains the POST data to be sent via the {@link PostMethod}
     * @throws IOException
     */
    private void handleStandard(EntityEnclosingMethod methodProxyRequest,
            HttpServletRequest httpServletRequest) throws IOException {
		  try {
		      
			  InputStream is =httpServletRequest.getInputStream();
			 
		      methodProxyRequest.setRequestEntity(new InputStreamRequestEntity(httpServletRequest.getInputStream()));
		      //LOGGER.info("original request content length:" + httpServletRequest.getContentLength());
		      //LOGGER.info("proxied request content length:" +methodProxyRequest.getRequestEntity().getContentLength()+"");
		       
		  } catch (IOException e) {
		      throw new IOException(e);
		  }
    }

    

    /**
     * Retrieves all of the headers from the servlet request and sets them on the proxy request
     * 
     * @param httpServletRequest The request object representing the client's request to the servlet engine
     * @param httpMethodProxyRequest The request that we are about to send to the proxy host
     * @return ProxyInfo
     */
    @SuppressWarnings("rawtypes")
    private ProxyInfo setProxyRequestHeaders(URL url, HttpServletRequest httpServletRequest,
            HttpMethod httpMethodProxyRequest) {

        final String proxyHost = url.getHost();
        final int proxyPort = url.getPort();
        final String proxyPath = url.getPath();
        final ProxyInfo proxyInfo = new ProxyInfo(proxyHost, proxyPath, proxyPort);

        // ////////////////////////////////////////
        // Get an Enumeration of all of the header
        // names sent by the client.
        // ////////////////////////////////////////

        Enumeration enumerationOfHeaderNames = httpServletRequest.getHeaderNames();

        while (enumerationOfHeaderNames.hasMoreElements()) {
            String stringHeaderName = (String) enumerationOfHeaderNames.nextElement();

            if (stringHeaderName.equalsIgnoreCase(Utils.CONTENT_LENGTH_HEADER_NAME))
                continue;

            // ////////////////////////////////////////////////////////////////////////
            // As per the Java Servlet API 2.5 documentation:
            // Some headers, such as Accept-Language can be sent by clients
            // as several headers each with a different value rather than
            // sending the header as a comma separated list.
            // Thus, we get an Enumeration of the header values sent by the client
            // ////////////////////////////////////////////////////////////////////////

            Enumeration enumerationOfHeaderValues = httpServletRequest.getHeaders(stringHeaderName);

            while (enumerationOfHeaderValues.hasMoreElements()) {
                String stringHeaderValue = (String) enumerationOfHeaderValues.nextElement();

                // ////////////////////////////////////////////////////////////////
                // In case the proxy host is running multiple virtual servers,
                // rewrite the Host header to ensure that we get content from
                // the correct virtual server
                // ////////////////////////////////////////////////////////////////

                if (stringHeaderName.equalsIgnoreCase(Utils.HOST_HEADER_NAME)) {
                    stringHeaderValue = Utils.getProxyHostAndPort(proxyInfo);
                }

                // ////////////////////////
                // Skip GZIP Responses
                // ////////////////////////

                if (stringHeaderName.equalsIgnoreCase(Utils.HTTP_HEADER_ACCEPT_ENCODING)
                        && stringHeaderValue.toLowerCase().contains("gzip"))
                    continue;
                if (stringHeaderName.equalsIgnoreCase(Utils.HTTP_HEADER_CONTENT_ENCODING)
                        && stringHeaderValue.toLowerCase().contains("gzip"))
                    continue;
                if (stringHeaderName.equalsIgnoreCase(Utils.HTTP_HEADER_TRANSFER_ENCODING))
                    continue;

                Header header = new Header(stringHeaderName, stringHeaderValue);

                // /////////////////////////////////////////////
                // Set the same header on the proxy request
                // /////////////////////////////////////////////

                httpMethodProxyRequest.setRequestHeader(header);
            }
        }

        return proxyInfo;
    }

    private Map<String,String> splitQuery(String query) throws UnsupportedEncodingException {
        Map<String, String> query_pairs = new LinkedHashMap<String, String>();
        
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
        }
        return query_pairs;
    }
    /**
     * @return int the maximum file upload size.
     */
    public int getMaxFileUploadSize() {
        return maxFileUploadSize;
    }

    
    
}
