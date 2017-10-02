package it.gesp.geoportal.dao.dto;

import it.gesp.geoportal.json.JsonFactory;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;


public class LayerConfigOLOptionsDTO {

	private Integer buffer;
	private Boolean displayOutsideMaxExtent;
	private Boolean isBaseLayer;
	private Boolean singleTile;
	private Double opacity;
	private List<Integer> tileSize;
	
	public Integer getBuffer() {
		return buffer;
	}
	public void setBuffer(Integer buffer) {
		this.buffer = buffer;
	}
	public Boolean getDisplayOutsideMaxExtent() {
		return displayOutsideMaxExtent;
	}
	public void setDisplayOutsideMaxExtent(Boolean displayOutsideMaxExtent) {
		this.displayOutsideMaxExtent = displayOutsideMaxExtent;
	}
	public Boolean getIsBaseLayer() {
		return isBaseLayer;
	}
	public void setIsBaseLayer(Boolean isBaseLayer) {
		this.isBaseLayer = isBaseLayer;
	}
	public Boolean getSingleTile() {
		return singleTile;
	}
	public void setSingleTile(Boolean singleTile) {
		this.singleTile = singleTile;
	}
	public Double getOpacity() {
		return opacity;
	}
	public void setOpacity(Double opacity) {
		this.opacity = opacity;
	}
	
	public String toJson() {
		Gson gson = JsonFactory.getGson();
		String olOptionsAsJson = gson.toJson(this);
		return olOptionsAsJson;
	}
	public List<Integer> getTileSize() {
		return this.tileSize;
	}
	public void setTileSize(List<Integer> tileSize) {
		this.tileSize = tileSize;
	}
}