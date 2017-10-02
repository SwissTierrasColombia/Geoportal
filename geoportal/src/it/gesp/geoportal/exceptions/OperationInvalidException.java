package it.gesp.geoportal.exceptions;

@SuppressWarnings("serial")
public class OperationInvalidException extends RuntimeException {

	private String exceptionCode;
	private String[] args;
	private String detailException;
	
	public OperationInvalidException(String string) {
		super(string);
	}

	public OperationInvalidException(String code, String string, String...varargs ) {
		super(string);
		this.exceptionCode = code;
		this.args = varargs;
	}
	
	public static OperationInvalidException createExceptionWithDetailMessage(String detailMessage, String code, String string,  String...varargs) {
		OperationInvalidException oie = new OperationInvalidException(code, string, varargs);
		oie.setDetailException(detailMessage);
		
		return oie;
	}
	
	public static OperationInvalidException createMissingIdExeption(String entityName, int id) {
		return new OperationInvalidException("EXC_ENTITY_NOT_EXISTS", "Object " + entityName + " with id " + id + " does not exist.", entityName, "" + id);
	}
	
	public static OperationInvalidException createMissingKeyExeption(String entityName, String key) {
		return new OperationInvalidException("EXC_ENTITY_NOT_EXISTS", "Object " + entityName + " with key " + key + " does not exist.", entityName, "" + key);
	}

	public static OperationInvalidException createMissingKeyExeption(String detailMessage, String entityName, String key) {
		OperationInvalidException oie = new OperationInvalidException("EXC_ENTITY_NOT_EXISTS", "Object " + entityName + " with key " + key + " does not exist.", entityName, "" + key);
		oie.setDetailException(detailMessage);
		
		return oie;
	}
	
	public static OperationInvalidException createAlertReferenceCodeExeption(String refCode) {
		return new OperationInvalidException("EXC_ALERT_REFCODE_NOT_EXISTS", "The alert with referenceCode " + refCode + " does not exist.", refCode);
	}
	
	public String getExceptionCode() {
		return exceptionCode;
	}

	public void setExceptionCode(String exceptionCode) {
		this.exceptionCode = exceptionCode;
	}

	public String[] getArgs() {
		return args;
	}

	public void setArgs(String[] args) {
		this.args = args;
	}

	public String getDetailException() {
		return detailException;
	}

	public void setDetailException(String detailException) {
		this.detailException = detailException;
	}
	
}