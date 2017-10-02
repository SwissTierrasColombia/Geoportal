package it.gesp.geoportal.exceptions;

@SuppressWarnings("serial")
public class DataInvalidException extends RuntimeException {

	public DataInvalidException() {
		super();
	}
	
	public DataInvalidException(String string) {
		super(string);
	}

}