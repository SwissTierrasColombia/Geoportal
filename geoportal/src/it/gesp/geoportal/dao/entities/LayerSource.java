package it.gesp.geoportal.dao.entities;

import it.gesp.geoportal.GsonExclude;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "layersources", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_layersource" }) })
public class LayerSource {

	private int idLayerSource;
	private String url;
	private String cacheUrl;
	private String layerSourceName;
	private String layerSourceDescription;
	private boolean addToExternalWmsList;
	
	@GsonExclude
	private Set<Layer> layers = new HashSet<Layer>(0);
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_layersource", nullable = false, unique = true)
	public int getIdLayerSource() {
		return idLayerSource;
	}

	public void setIdLayerSource(int idLayerSource) {
		this.idLayerSource = idLayerSource;
	}

	@Column(name = "s_url", nullable = false)
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Column(name = "s_cache_url", nullable = true)
	public String getCacheUrl() {
		return cacheUrl;
	}

	public void setCacheUrl(String cacheUrl) {
		this.cacheUrl = cacheUrl;
	}
	
	public void setLayerSourceName(String layerSourceName) {
		this.layerSourceName = layerSourceName;
	}

	@Column(name = "s_layersource_description")
	public String getLayerSourceDescription() {
		return layerSourceDescription;
	}

	public void setLayerSourceDescription(String layerSourceDescription) {
		this.layerSourceDescription = layerSourceDescription;
	}

	@Column(name = "s_layersource_name")
	public String getLayerSourceName() {
		return layerSourceName;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "layerSource")
	public Set<Layer> getLayers() {
		return layers;
	}

	public void setLayers(Set<Layer> layers) {
		this.layers = layers;
	}

	@Column(name = "enabled_external_wms_list", nullable=false)
	public boolean isAddToExternalWmsList() {
		return addToExternalWmsList;
	}

	public void setAddToExternalWmsList(boolean addToExternalWmsList) {
		this.addToExternalWmsList = addToExternalWmsList;
	}
	
}