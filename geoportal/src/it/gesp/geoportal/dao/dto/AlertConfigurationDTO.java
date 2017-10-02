package it.gesp.geoportal.dao.dto;

import it.gesp.geoportal.dao.entities.Layer;

import java.util.List;

public class AlertConfigurationDTO {

	private List<Layer> layerList;
	private Integer referenceLayerId;
	private String alertAddedMessage;
	
	public List<Layer> getLayerList() {
		return layerList;
	}
	public void setLayerList(List<Layer> layerList) {
		this.layerList = layerList;
	}
	public Integer getReferenceLayerId() {
		return referenceLayerId;
	}
	public void setReferenceLayerId(Integer referenceLayerId) {
		this.referenceLayerId = referenceLayerId;
	}
	public String getAlertAddedMessage() {
		return alertAddedMessage;
	}
	public void setAlertAddedMessage(String alertAddedMessage) {
		this.alertAddedMessage = alertAddedMessage;
	}
	
	
}