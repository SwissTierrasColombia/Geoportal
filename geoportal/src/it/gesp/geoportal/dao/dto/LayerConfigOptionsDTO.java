package it.gesp.geoportal.dao.dto;

import it.gesp.geoportal.json.JsonFactory;

import com.google.gson.Gson;


public class LayerConfigOptionsDTO {

	private String format;
	private Boolean transparent;

	public String getFormat() {
		return format;
	}
	public void setFormat(String format) {
		this.format = format;
	}
	public Boolean getTransparent() {
		return transparent;
	}
	public void setTransparent(Boolean transparent) {
		this.transparent = transparent;
	}
	
	public String toJson() {
		Gson gson = JsonFactory.getGson();
		String optionsAsJson = gson.toJson(this);
		return optionsAsJson;
	}
}