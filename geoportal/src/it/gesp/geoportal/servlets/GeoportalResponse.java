package it.gesp.geoportal.servlets;

import it.gesp.geoportal.json.JsonFactory;

import com.google.gson.Gson;

public class GeoportalResponse {
	private boolean success;
	private String msg;
	private Object result;
	private String code;
	private String detailMsg;
	
	public boolean isSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public Object getResult() {
		return result;
	}
	public void setResult(Object result) {
		this.result = result;
	}
	
	public static String createSuccessResponseWithSerializationOfNulls(Object result, boolean filterExposedFields) {
		return createSuccessResponse(result, filterExposedFields, true);
	}
	
	public static String createSuccessResponse(Object result, boolean filterExposedFields) {
		return createSuccessResponse(result, filterExposedFields, false); 
	}
	
	private static String createSuccessResponse(Object result, boolean filterExposedFields, boolean serializeNulls) {
		GeoportalResponse gpr = new GeoportalResponse();
		gpr.setSuccess(true);
		gpr.setResult(result);
		
		Gson gson = JsonFactory.getGson(filterExposedFields, serializeNulls, false);
		String jsonRes = gson.toJson(gpr);
		return jsonRes; 
	}
	
	public static String createErrorResponse(String message) {
		return createErrorResponse(message, null, null);
	}
	
	public static String createErrorResponse(String message, String exceptionCode) {
		return createErrorResponse(message, exceptionCode, null);
	}
	
	public static String createErrorResponse(String message, String exceptionCode, String detailMessage) {
		GeoportalResponse gpr = new GeoportalResponse();
		gpr.setSuccess(false);
		gpr.setMsg(message);
		gpr.setDetailMsg(detailMessage);
		if (exceptionCode != null && !"".equalsIgnoreCase(exceptionCode)) {
			gpr.setCode(exceptionCode);
		}
		
		Gson gson = JsonFactory.getGson();
		String jsonRes = gson.toJson(gpr);
		return jsonRes;
	}
	public String getDetailMsg() {
		return detailMsg;
	}
	public void setDetailMsg(String detailMsg) {
		this.detailMsg = detailMsg;
	}
	
}
