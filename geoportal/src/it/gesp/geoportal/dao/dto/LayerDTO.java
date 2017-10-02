package it.gesp.geoportal.dao.dto;

import it.gesp.geoportal.dao.entities.LayerConfigVw;
import it.gesp.geoportal.dao.entities.MapConfigVw;

import java.util.Date;

public class LayerDTO {

	private int idLayer;
	private String layerName;
	private String layerTitle;
	private String layerDescription;
	private String mode = "single"; 
	private int idLayerType;
	private Integer idLayerSource;
	private String layerSourceName;
	private Integer idLayerConfig;
	private int position;
	private boolean enabled;
	private boolean baseLayer;
	private boolean external;
	private boolean downloadable;
	private String responsible;
	private boolean wfsSearchEnabled;;
	private boolean showInfoDialog;
	
	private String metadataUuid;
	private String wfsUrl;
	private String wcsUrl;
	
	private String cacheUrl;
	private String cacheWorkspace;
	private Boolean cacheEnabled;
	
	private String sldUrl;
	private Boolean sldOverrideEnabled;
	
	private String attributeNameForInfo;
	private String referenceDate;
	
	//private LayerConfigOLOptionsDTO layerConfigOLOptions;
	private Integer buffer;
	private Boolean displayOutsideMaxExtent;
	private Boolean isBaseLayer;
	private Boolean singleTile;
	private Double opacity;
	
	
	//private LayerConfigOptionsDTO layerConfigOptions;
	private String format;
	private Boolean transparent;

	
	public int getIdLayer() {
		return idLayer;
	}
	public void setIdLayer(int idLayer) {
		this.idLayer = idLayer;
	}
	public String getLayerName() {
		return layerName;
	}
	public void setLayerName(String layerName) {
		this.layerName = layerName;
	}
	public String getLayerTitle() {
		return layerTitle;
	}
	public void setLayerTitle(String layerTitle) {
		this.layerTitle = layerTitle;
	}
	public String getLayerDescription() {
		return layerDescription;
	}
	public void setLayerDescription(String layerDescription) {
		this.layerDescription = layerDescription;
	}
	public String getMode() {
		return mode;
	}
	public void setMode(String mode) {
		this.mode = mode;
	}
	public int getIdLayerType() {
		return idLayerType;
	}
	public void setIdLayerType(int idLayerType) {
		this.idLayerType = idLayerType;
	}
	public Integer getIdLayerConfig() {
		return idLayerConfig;
	}
	public void setIdLayerConfig(Integer idLayerConfig) {
		this.idLayerConfig = idLayerConfig;
	}
	public int getPosition() {
		return position;
	}
	public void setPosition(int position) {
		this.position = position;
	}
	public boolean isEnabled() {
		return enabled;
	}
	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}
	
	public boolean isBaseLayer() {
		return baseLayer;
	}
	public void setBaseLayer(boolean baseLayer) {
		this.baseLayer = baseLayer;
	}
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
	public Integer getIdLayerSource() {
		return idLayerSource;
	}
	public void setIdLayerSource(Integer idLayerSource) {
		this.idLayerSource = idLayerSource;
	}
	public String getCacheUrl() {
		return cacheUrl;
	}
	public void setCacheUrl(String cacheUrl) {
		this.cacheUrl = cacheUrl;
	}
	public String getCacheWorkspace() {
		return cacheWorkspace;
	}
	public void setCacheWorkspace(String cacheWorkspace) {
		this.cacheWorkspace = cacheWorkspace;
	}
	public Boolean isCacheEnabled() {
		return cacheEnabled;
	}
	public void setCacheEnabled(Boolean cacheEnabled) {
		this.cacheEnabled = cacheEnabled;
	}
	
	public static LayerDTO parseLayerDTOFromMapConfig(MapConfigVw mc) {
		
		//No layer for this LayerGroup
		if (mc.getId().getIdLayer() == 0) return null;
		
		LayerDTO lay = new LayerDTO();
		lay.setEnabled(mc.isEnabled());
		lay.setIdLayer(mc.getId().getIdLayer());
		lay.setIdLayerConfig(mc.getIdLayerConfig());
		lay.setIdLayerType(mc.getIdLayerType());
		lay.setIdLayerSource(mc.getIdLayerSource());
		
		lay.setLayerSourceName(mc.getLayerSourceName());
		
		lay.setLayerDescription(mc.getLayerDescription());
		lay.setLayerName(mc.getLayerName());
		lay.setLayerTitle(mc.getLayerTitle());
		lay.setMode(mc.getMode());
		lay.setPosition(mc.getLayerPosition());
		lay.setBaseLayer(mc.getBaseLayer());
		
		lay.setCacheUrl(mc.getCacheUrl());
		lay.setCacheEnabled(mc.getCacheEnabled());
		
		if (mc.getLayerConfigOptionsDTO() != null) {
			lay.setFormat(mc.getLayerConfigOptionsDTO().getFormat());
			lay.setTransparent(mc.getLayerConfigOptionsDTO().getTransparent());
		}
		
		if (mc.getLayerConfigOLOptionsDTO() != null) {
			lay.setBuffer(mc.getLayerConfigOLOptionsDTO().getBuffer());
			lay.setDisplayOutsideMaxExtent(mc.getLayerConfigOLOptionsDTO().getDisplayOutsideMaxExtent());
			lay.setBaseLayer(mc.getLayerConfigOLOptionsDTO().getIsBaseLayer());
			lay.setSingleTile(mc.getLayerConfigOLOptionsDTO().getSingleTile());
			lay.setOpacity(mc.getLayerConfigOLOptionsDTO().getOpacity());
		}
		return lay;
	}
	
	public static LayerDTO parseLayerDTOFromLayerConfig(LayerConfigVw lc) {
		
		LayerDTO lay = new LayerDTO();
		
		lay.setIdLayer(lc.getIdLayer());
		lay.setIdLayerConfig(lc.getIdLayerConfig());
		lay.setIdLayerType(lc.getIdLayerType());
		lay.setIdLayerSource(lc.getIdLayerSource());
		
		if (lc.getIdLayerSource() != null) {
			lay.setLayerSourceName(lc.getLayerSourceName());
		}
		
		lay.setLayerDescription(lc.getLayerDescription());
		lay.setLayerName(lc.getLayerName());
		lay.setLayerTitle(lc.getLayerTitle());
		
		lay.setResponsible(lc.getResponsible());
		
		lay.setMetadataUuid(lc.getMetadataUuid());
		lay.setExternal(lc.getExternal());
		lay.setDownloadable(lc.getDownloadable());
		
		lay.setWfsSearchEnabled(lc.getWfsSearchEnabled());
		
		lay.setWfsUrl(lc.getWfsUrl());
		lay.setWcsUrl(lc.getWcsUrl());
		
		lay.setShowInfoDialog(lc.getShowInfoDialog());
		
		lay.setMode(lc.getMode());
		
		lay.setBaseLayer(lc.getBaseLayer());
		
		//Cache
		lay.setCacheUrl(lc.getCacheUrl());
		lay.setCacheWorkspace(lc.getCacheWorkspace());
		lay.setCacheEnabled(lc.getCacheEnabled());
		
		//SLD
		lay.setSldUrl(lc.getSldUrl());
		lay.setSldOverrideEnabled(lc.isSldOverrideEnabled());
		
		lay.setAttributeNameForInfo(lc.getAttributeNameForInfo());
		lay.setReferenceDate(lc.getReferenceDate());
		
		if (lc.getLayerConfigOptionsDTO() != null) {
			lay.setFormat(lc.getLayerConfigOptionsDTO().getFormat());
			lay.setTransparent(lc.getLayerConfigOptionsDTO().getTransparent());
		}
		
		if (lc.getLayerConfigOLOptionsDTO() != null) {
			lay.setBuffer(lc.getLayerConfigOLOptionsDTO().getBuffer());
			lay.setDisplayOutsideMaxExtent(lc.getLayerConfigOLOptionsDTO().getDisplayOutsideMaxExtent());
			lay.setBaseLayer(lc.getLayerConfigOLOptionsDTO().getIsBaseLayer());
			lay.setSingleTile(lc.getLayerConfigOLOptionsDTO().getSingleTile());
			lay.setOpacity(lc.getLayerConfigOLOptionsDTO().getOpacity());
		}
		return lay;
	}
	public String getLayerSourceName() {
		return layerSourceName;
	}
	public void setLayerSourceName(String layerSourceName) {
		this.layerSourceName = layerSourceName;
	}
	public String getAttributeNameForInfo() {
		return attributeNameForInfo;
	}
	public void setAttributeNameForInfo(String attributeNameForInfo) {
		this.attributeNameForInfo = attributeNameForInfo;
	}
	public String getResponsible() {
		return responsible;
	}
	public void setResponsible(String responsible) {
		this.responsible = responsible;
	}
	public String getSldUrl() {
		return sldUrl;
	}
	public void setSldUrl(String sldUrl) {
		this.sldUrl = sldUrl;
	}
	public Boolean getSldOverrideEnabled() {
		return sldOverrideEnabled;
	}
	public void setSldOverrideEnabled(Boolean sldOverrideEnabled) {
		this.sldOverrideEnabled = sldOverrideEnabled;
	}
	public Boolean getCacheEnabled() {
		return cacheEnabled;
	}
	public boolean isExternal() {
		return external;
	}
	public void setExternal(boolean external) {
		this.external = external;
	}
	public boolean isDownloadable() {
		return downloadable;
	}
	public void setDownloadable(boolean downloadable) {
		this.downloadable = downloadable;
	}
	public boolean isWfsSearchEnabled() {
		return wfsSearchEnabled;
	}
	public void setWfsSearchEnabled(boolean wfsSearchEnabled) {
		this.wfsSearchEnabled = wfsSearchEnabled;
	}
	public String getReferenceDate() {
		return referenceDate;
	}
	public void setReferenceDate(String referenceDate) {
		this.referenceDate = referenceDate;
	}
	public String getMetadataUuid() {
		return metadataUuid;
	}
	public void setMetadataUuid(String metadataUuid) {
		this.metadataUuid = metadataUuid;
	}
	public String getWfsUrl() {
		return wfsUrl;
	}
	public void setWfsUrl(String wfsUrl) {
		this.wfsUrl = wfsUrl;
	}
	public String getWcsUrl() {
		return wcsUrl;
	}
	public void setWcsUrl(String wcsUrl) {
		this.wcsUrl = wcsUrl;
	}
	public boolean isShowInfoDialog() {
		return showInfoDialog;
	}
	public void setShowInfoDialog(boolean showInfoDialog) {
		this.showInfoDialog = showInfoDialog;
	}
}