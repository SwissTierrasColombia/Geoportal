package it.gesp.geoportal.exceptions;

@SuppressWarnings("serial")
public class PermissionInvalidException extends RuntimeException {

	public PermissionInvalidException(String string) {
		super(string);
	}
	
	public PermissionInvalidException() {
		super();
	}

}