package it.gesp.geoportal.dao.dto;

public class AlertCoordinatesDTO {
	private String xAlert;
	private String yAlert;
	
	public AlertCoordinatesDTO(String xAlert, String yAlert) {
		this.xAlert = xAlert;
		this.yAlert = yAlert;
	}
	
	public String getxAlert() {
		return xAlert;
	}
	public void setxAlert(String xAlert) {
		this.xAlert = xAlert;
	}
	public String getyAlert() {
		return yAlert;
	}
	public void setyAlert(String yAlert) {
		this.yAlert = yAlert;
	}
}
