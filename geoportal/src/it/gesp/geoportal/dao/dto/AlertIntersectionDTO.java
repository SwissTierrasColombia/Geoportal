package it.gesp.geoportal.dao.dto;

import it.gesp.geoportal.dao.entities.AlertIntersection;


public class AlertIntersectionDTO {
	
	private Integer id;
	private String name;
	private Integer layerId;
	private String layerName;
	private String layerUrl;
	private String keyColumnName;
	private String descColumnName;
	private String geomColumnName;
	private Boolean active;
	
	
	public static AlertIntersectionDTO parseFromAlertIntersection(AlertIntersection ai) {
		AlertIntersectionDTO dto = new AlertIntersectionDTO();
		
		dto.setId(ai.getId());
		dto.setName(ai.getName());
		
		if (ai.getReferenceLayer() != null) {
			dto.setLayerId(ai.getReferenceLayer().getIdLayer());
			dto.setLayerName(ai.getReferenceLayer().getLayerName());
			dto.setLayerUrl(ai.getReferenceLayer().getWfsUrl());	
		}
		
		dto.setKeyColumnName(ai.getKeyColumnName());
		dto.setDescColumnName(ai.getDescColumnName());
		dto.setGeomColumnName(ai.getGeomColumnName());
		dto.setActive(ai.isActive());
		
		return dto;
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getLayerId() {
		return layerId;
	}
	public void setLayerId(Integer layerId) {
		this.layerId = layerId;
	}
	public String getLayerName() {
		return layerName;
	}
	public void setLayerName(String layerName) {
		this.layerName = layerName;
	}
	public String getLayerUrl() {
		return layerUrl;
	}
	public void setLayerUrl(String layerUrl) {
		this.layerUrl = layerUrl;
	}
	public String getKeyColumnName() {
		return keyColumnName;
	}
	public void setKeyColumnName(String keyColumnName) {
		this.keyColumnName = keyColumnName;
	}
	public String getDescColumnName() {
		return descColumnName;
	}
	public void setDescColumnName(String descColumnName) {
		this.descColumnName = descColumnName;
	}
	public String getGeomColumnName() {
		return geomColumnName;
	}
	public void setGeomColumnName(String geomColumnName) {
		this.geomColumnName = geomColumnName;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
}