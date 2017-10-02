package it.geosolutions.httpproxy;

import java.io.IOException;

import org.apache.commons.httpclient.HttpMethod;

/**
*
* @author Andrea Pogliaghi - Gesp Srl
*/

public interface RequestExecutorCallbacks {
	public void onRemoteResponse(HttpMethod httpMethodProxyRequest) throws IOException;
	
}
