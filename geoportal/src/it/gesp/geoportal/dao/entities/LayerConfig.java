package it.gesp.geoportal.dao.entities;

import java.util.ArrayList;
import java.util.List;

import it.gesp.geoportal.dao.customtypes.StringJsonUserType;
import it.gesp.geoportal.dao.dto.LayerConfigOLOptionsDTO;
import it.gesp.geoportal.dao.dto.LayerConfigOptionsDTO;
import it.gesp.geoportal.json.GeoportalGsonExclusionStrategy;
import it.gesp.geoportal.json.JsonFactory;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Entity
@TypeDefs( {@TypeDef( name= "StringJsonObject", typeClass = StringJsonUserType.class)})
@Table(name = "layerconfigs", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_layer_config" }) })
public class LayerConfig {

	/*
	 * Default tilesize 
	 */
	private final static int DEFAULT_TILESIZE_X = 256;
	private final static int DEFAULT_TILESIZE_Y = 256;
	
	private int idLayerConfig;
	private String options;
	private String olOptions;
	private String cacheUrl;
	private boolean cacheEnabled;
	
	private String cacheWorkspace;
	
	private String sldUrl;
	private boolean sldOverrideEnabled;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_layer_config", nullable = false, unique = true)
	public int getIdLayerConfig() {
		return idLayerConfig;
	}

	public void setIdLayerConfig(int idLayerConfig) {
		this.idLayerConfig = idLayerConfig;
	}

	@Type(type = "StringJsonObject")
	@Column(name = "s_options")
	public String getOptions() {
		return options;
	}

	public void setOptions(String options) {
		this.options = options;
	}

	@Transient
	public LayerConfigOptionsDTO getParsedOptions() {
		String options = this.getOptions();

		Gson gson = JsonFactory.getGson();
		LayerConfigOptionsDTO myJson = gson.fromJson(options, LayerConfigOptionsDTO.class);
		return myJson;
	}
	
	@Type(type = "StringJsonObject")
	@Column(name = "s_ol_options")
	public String getOlOptions() {
		return olOptions;
	}

	public void setOlOptions(String olOptions) {
		this.olOptions = olOptions;
	}
	
	@Transient
	public LayerConfigOLOptionsDTO getParsedOlOptions() {
		String olOptions = this.getOlOptions();

		Gson gson = new GsonBuilder().setExclusionStrategies(new GeoportalGsonExclusionStrategy()).create();
		LayerConfigOLOptionsDTO lcoDTO = gson.fromJson(olOptions, LayerConfigOLOptionsDTO.class);
		
		if (lcoDTO.getSingleTile() == false)  {
			/*
			 * Set default tile size if not specified
			 */
			if (lcoDTO.getTileSize() == null) {
				List<Integer> tileSize =  new ArrayList<Integer>();
				tileSize.add(DEFAULT_TILESIZE_X);
				tileSize.add(DEFAULT_TILESIZE_Y);
				lcoDTO.setTileSize(tileSize);
			}
			
		}
		
		return lcoDTO;
	}

	@Column(name = "s_cache_url")
	public String getCacheUrl() {
		return cacheUrl;
	}

	public void setCacheUrl(String cacheUrl) {
		this.cacheUrl = cacheUrl;
	}

	@Column(name = "cache_enabled")
	public boolean isCacheEnabled() {
		return cacheEnabled;
	}

	public void setCacheEnabled(boolean cacheEnabled) {
		this.cacheEnabled = cacheEnabled;
	}

	@Column(name = "s_sld_url", nullable=true)
	public String getSldUrl() {
		return sldUrl;
	}

	public void setSldUrl(String sldUrl) {
		this.sldUrl = sldUrl;
	}

	@Column(name = "sld_override", nullable=false)
	public boolean isSldOverrideEnabled() {
		return sldOverrideEnabled;
	}

	public void setSldOverrideEnabled(boolean sldOverrideEnabled) {
		this.sldOverrideEnabled = sldOverrideEnabled;
	}

	@Column(name = "s_cache_workspace", nullable = true)
	public String getCacheWorkspace() {
		return cacheWorkspace;
	}

	public void setCacheWorkspace(String cacheWorkspace) {
		this.cacheWorkspace = cacheWorkspace;
	}
}