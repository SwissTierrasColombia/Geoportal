package it.geosolutions.httpproxy;

public interface OperationMode {
	public static final String SHARED_MULTITHREADED = "shared";
	public static final String PER_REQUEST = "per_request";
	public static final String PER_SESSION = "per_session";
}
