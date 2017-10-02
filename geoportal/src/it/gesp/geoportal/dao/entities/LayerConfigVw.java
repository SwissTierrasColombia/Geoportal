package it.gesp.geoportal.dao.entities;

import it.gesp.geoportal.dao.dto.LayerConfigOLOptionsDTO;
import it.gesp.geoportal.dao.dto.LayerConfigOptionsDTO;
import it.gesp.geoportal.dao.dto.LayerDTO;
import it.gesp.geoportal.json.GeoportalGsonExclusionStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.Type;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Entity
@Table(name = "layer_config_vw")
public class LayerConfigVw {
	private int idLayer;
	private String layerName;
	private String layerTitle;
	private String layerDescription;
	private String mode;
	private Integer idLayerSource;
	private String layerSourceName;
	private Integer idLayerType;
	private Integer idLayerConfig;
	private Boolean baseLayer;
	private Boolean external;
	private Boolean downloadable;
	private String responsible;
	private String metadataUuid;
	private Boolean wfsSearchEnabled;
	private Boolean showInfoDialog;
	
	private String wfsUrl;
	private String wcsUrl;
	
	private String attributeNameForInfo;
	public String referenceDate;
	
	private LayerConfigOptionsDTO layerConfigOptionsDTO;
	private String layerOptions;
	
	private LayerConfigOLOptionsDTO layerConfigOLOptionsDTO;
	private String layerOLOptions;
	private String cacheUrl;
	private String cacheWorkspace;
	private Boolean cacheEnabled;
		
	private String sldUrl;
	private Boolean sldOverrideEnabled;
	
	@Id
	@Column(name = "id_layer", nullable = false)
	public int getIdLayer() {
		return idLayer;
	}

	public void setIdLayer(int idLayer) {
		this.idLayer = idLayer;
	}
	
	@Column(name = "s_name", nullable = false)
	public String getLayerName() {
		return layerName;
	}
	
	public void setLayerName(String layerName) {
		this.layerName = layerName;
	}
	
	@Column(name = "s_title", nullable = false)
	public String getLayerTitle() {
		return layerTitle;
	}
	
	public void setLayerTitle(String layerTitle) {
		this.layerTitle = layerTitle;
	}
	
	@Column(name = "s_description", nullable = false)
	public String getLayerDescription() {
		return layerDescription;
	}
	
	public void setLayerDescription(String layerDescription) {
		this.layerDescription = layerDescription;
	}
	
	@Column(name = "s_mode", nullable = false)
	public String getMode() {
		return mode;
	}
	
	public void setMode(String mode) {
		this.mode = mode;
	}
	
	@Column(name = "id_layersource")
	public Integer getIdLayerSource() {
		return idLayerSource;
	}
	
	public void setIdLayerSource(Integer idLayerSource) {
		this.idLayerSource = idLayerSource;
	}
	
	@Column(name = "s_layersource_name")
	public String getLayerSourceName() {
		return layerSourceName;
	}

	public void setLayerSourceName(String layerSourceName) {
		this.layerSourceName = layerSourceName;
	}
	
	@Column(name = "id_layer_type", nullable = false)
	public Integer getIdLayerType() {
		return idLayerType;
	}
	
	public void setIdLayerType(Integer idLayerType) {
		this.idLayerType = idLayerType;
	}
	
	@Column(name = "id_layer_config")
	public Integer getIdLayerConfig() {
		return idLayerConfig;
	}
	public void setIdLayerConfig(Integer idLayerConfig) {
		this.idLayerConfig = idLayerConfig;
	}

	@Column(name = "base_layer", nullable = false)
	public Boolean getBaseLayer() {
		return baseLayer;
	}

	public void setBaseLayer(Boolean baseLayer) {
		this.baseLayer = baseLayer;
	}

	@Type(type = "StringJsonObject")
	@Column(name = "s_options")
	public String getLayerOptions() {
		return layerOptions;
	}

	public void setLayerOptions(String layerOptions) {
		this.layerOptions = layerOptions;
		
		if (layerOptions != null) {
			Gson gson = new GsonBuilder().setExclusionStrategies(new GeoportalGsonExclusionStrategy()).create();
			LayerConfigOptionsDTO lco = gson.fromJson(layerOptions, LayerConfigOptionsDTO.class);
			this.layerConfigOptionsDTO = lco;
		}
	}

	@Type(type = "StringJsonObject")
	@Column(name = "s_ol_options")
	public String getLayerOLOptions() {
		return layerOLOptions;
	}
	
	public void setLayerOLOptions(String layerOLOptions) {
		this.layerOLOptions = layerOLOptions;
		
		if (layerOLOptions != null) {
			Gson gson = new GsonBuilder().setExclusionStrategies(new GeoportalGsonExclusionStrategy()).create();
			LayerConfigOLOptionsDTO lco = gson.fromJson(layerOLOptions, LayerConfigOLOptionsDTO.class);
			this.layerConfigOLOptionsDTO = lco;
		}
	}

	@Column(name = "s_cache_url")
	public String getCacheUrl() {
		return cacheUrl;
	}

	public void setCacheUrl(String cacheUrl) {
		this.cacheUrl = cacheUrl;
	}

	@Column(name = "s_cache_workspace")
	public String getCacheWorkspace() {
		return cacheWorkspace;
	}

	public void setCacheWorkspace(String cacheWorkspace) {
		this.cacheWorkspace = cacheWorkspace;
	}
	
	@Column(name = "cache_enabled")
	public Boolean getCacheEnabled() {
		return cacheEnabled;
	}

	public void setCacheEnabled(Boolean cacheEnabled) {
		this.cacheEnabled = cacheEnabled;
	}

	@Column(name = "s_sld_url", nullable=true)
	public String getSldUrl() {
		return sldUrl;
	}

	public void setSldUrl(String sldUrl) {
		this.sldUrl = sldUrl;
	}

	@Column(name = "sld_override")
	public Boolean isSldOverrideEnabled() {
		return sldOverrideEnabled;
	}

	public void setSldOverrideEnabled(Boolean sldOverrideEnabled) {
		this.sldOverrideEnabled = sldOverrideEnabled;
	}
	
	@Transient
	public LayerConfigOptionsDTO getLayerConfigOptionsDTO() {
		return layerConfigOptionsDTO;
	}

	public void setLayerConfigOptionsDTO(LayerConfigOptionsDTO layerConfigOptionsDTO) {
		this.layerConfigOptionsDTO = layerConfigOptionsDTO;
	}

	@Transient
	public LayerConfigOLOptionsDTO getLayerConfigOLOptionsDTO() {
		return layerConfigOLOptionsDTO;
	}

	public void setLayerConfigOLOptionsDTO(
			LayerConfigOLOptionsDTO layerConfigOLOptionsDTO) {
		this.layerConfigOLOptionsDTO = layerConfigOLOptionsDTO;
	}
	
	@Transient
	public LayerDTO createLayerDTOFromLayerConfig() {
		return LayerDTO.parseLayerDTOFromLayerConfig(this);
	}
	
	@Column(name = "s_attribute_name_for_info", nullable=true)
	public String getAttributeNameForInfo() {
		return attributeNameForInfo;
	}
	public void setAttributeNameForInfo(String attributeNameForInfo) {
		this.attributeNameForInfo = attributeNameForInfo;
	}
	
	@Column(name = "s_responsible", nullable=true)
	public String getResponsible() {
		return responsible;
	}

	public void setResponsible(String responsible) {
		this.responsible = responsible;
	}

	@Column(name = "external", nullable=false)
	public Boolean getExternal() {
		return external;
	}

	public void setExternal(Boolean external) {
		this.external = external;
	}

	@Column(name = "downloadable", nullable=false)
	public Boolean getDownloadable() {
		return downloadable;
	}

	public void setDownloadable(Boolean downloadable) {
		this.downloadable = downloadable;
	}
	
	@Column(name = "f_wfs_search_enabled", nullable=false)
	public Boolean getWfsSearchEnabled() {
		return wfsSearchEnabled;
	}

	public void setWfsSearchEnabled(Boolean wfsSearchEnabled) {
		this.wfsSearchEnabled = wfsSearchEnabled;
	}

	@Column(name = "s_reference_date", nullable = true)
	public String getReferenceDate() {
		return referenceDate;
	}

	public void setReferenceDate(String referenceDate) {
		this.referenceDate = referenceDate;
	}

	@Column(name = "s_metadata_uuid", nullable = true)
	public String getMetadataUuid() {
		return metadataUuid;
	}

	public void setMetadataUuid(String metadataUuid) {
		this.metadataUuid = metadataUuid;
	}
	
	@Column(name = "s_wfs_url", nullable = true)
	public String getWfsUrl() {
		return wfsUrl;
	}

	public void setWfsUrl(String wfsUrl) {
		this.wfsUrl = wfsUrl;
	}

	@Column(name = "s_wcs_url", nullable = true)
	public String getWcsUrl() {
		return wcsUrl;
	}

	public void setWcsUrl(String wcsUrl) {
		this.wcsUrl = wcsUrl;
	}

	@Column(name = "f_show_info_dialog", nullable = false)
	public Boolean getShowInfoDialog() {
		return showInfoDialog;
	}

	public void setShowInfoDialog(Boolean showInfoDialog) {
		this.showInfoDialog = showInfoDialog;
	}
}