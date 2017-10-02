package it.gesp.geoportal.dao.entities;

import it.gesp.geoportal.dao.dto.LayerConfigOLOptionsDTO;
import it.gesp.geoportal.dao.dto.LayerConfigOptionsDTO;
import it.gesp.geoportal.dao.dto.LayerDTO;
import it.gesp.geoportal.json.GeoportalGsonExclusionStrategy;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.Type;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Entity
@Table(name = "map_config_vw")
public class MapConfigVw {

	private MapConfigVwId id;
	
	//private int idLayerGroup;
	private String layerGroupName;
	private long layerGroupPosition;
	private Integer idMap;
	private Integer layerPosition;
	private Boolean enabled;
	//private int idLayer;
	private String layerName;
	private String layerTitle;
	private String layerDescription;
	private String mode;
	private Integer idLayerSource;
	private String layerSourceName;
	private Integer idLayerType;
	private Integer idLayerConfig;
	private Boolean baseLayer;
	private Boolean backgroundGroup;
	
	private LayerConfigOptionsDTO layerConfigOptionsDTO;
	private String layerOptions;
	
	private LayerConfigOLOptionsDTO layerConfigOLOptionsDTO;
	private String layerOLOptions;
	private String cacheUrl;
	private Boolean cacheEnabled;
	
	@EmbeddedId
	public MapConfigVwId getId() {
		return id;
	}

	public void setId(MapConfigVwId id) {
		this.id = id;
	}
	
	@Column(name = "layergroup_name", nullable = false)
	public String getLayerGroupName() {
		return layerGroupName;
	}
	
	public void setLayerGroupName(String layerGroupName) {
		this.layerGroupName = layerGroupName;
	}
	
	@Column(name = "id_map", nullable = false)
	public Integer getIdMap() {
		return idMap;
	}
	
	public void setIdMap(Integer idMap) {
		this.idMap = idMap;
	}
	
	@Column(name = "position", nullable = false)
	public Integer getLayerPosition() {
		return layerPosition;
	}
	
	public void setLayerPosition(Integer layerPosition) {
		this.layerPosition = layerPosition;
	}
	
	@Column(name = "enabled", nullable = false)
	public Boolean isEnabled() {
		return enabled;
	}
	
	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
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

	@Column(name = "layergroup_position", nullable = false)
	public long getLayerGroupPosition() {
		return layerGroupPosition;
	}

	public void setLayerGroupPosition(long layerGroupPosition) {
		this.layerGroupPosition = layerGroupPosition;
	}

	@Column(name = "base_layer", nullable = false)
	public Boolean getBaseLayer() {
		return baseLayer;
	}

	public void setBaseLayer(Boolean baseLayer) {
		this.baseLayer = baseLayer;
	}

	@Column(name = "background", nullable = false)
	public Boolean getBackgroundGroup() {
		return backgroundGroup;
	}

	public void setBackgroundGroup(Boolean backgroundGroup) {
		this.backgroundGroup = backgroundGroup;
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

	@Column(name = "cache_enabled")
	public Boolean getCacheEnabled() {
		return cacheEnabled;
	}

	public void setCacheEnabled(Boolean cacheEnabled) {
		this.cacheEnabled = cacheEnabled;
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
	public LayerDTO createLayerDTOFromMapConfig() {
		return LayerDTO.parseLayerDTOFromMapConfig(this);
	}

	@Column(name = "s_layersource_name", nullable=true)
	public String getLayerSourceName() {
		return layerSourceName;
	}

	public void setLayerSourceName(String layerSourceName) {
		this.layerSourceName = layerSourceName;
	}
}