package it.gesp.geoportal.dao.entities;

import it.gesp.geoportal.GsonExclude;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "layers", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_layer" }) })
public class Layer {

	private int idLayer;
	private String layerName;
	private String layerTitle;
	private String layerDescription;
	private String mode = "single";
	private String attributeNameForInfo;
	private String responsible;
	private String referenceDate;

	private String metadataUuid;
	
	private String wfsUrl;
	private String wcsUrl;
	
	private boolean showInfoDialog;
	
	/*
	 * This contains the id of the layerSource.
	 * It is automatically set when the Layer is loaded by hibernate
	 */
	public int idLayerSource;
	
	@GsonExclude
	private LayerType layerType;
	
	@GsonExclude
	private LayerConfig layerConfig;
	private boolean baseLayer;
	private boolean external;
	private boolean downloadable;
	
	private boolean wfsSearchEnabled;
	
	@GsonExclude
	private Set<LayerGroupLayer> layerGroupLayer = new HashSet<LayerGroupLayer>(0);
	
	@GsonExclude
	private LayerSource layerSource;
	
	private boolean referenceLayerForAlerts;
	
	@GsonExclude
	private Set<AlertIntersection> alertIntersections = new HashSet<AlertIntersection>(0);
	
	/*
	 * cascade=CascadeType.ALL
	 * Commented as Casdade all means that attaching/detaching elements to this collection
	 * cause automcatic insert/update on the database....
	 */
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "pk.layer")
	public Set<LayerGroupLayer> getLayerGroupLayer() {
		return layerGroupLayer;
	}

	public void setLayerGroupLayer(Set<LayerGroupLayer> layerGroupLayer) {
		this.layerGroupLayer = layerGroupLayer;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "referenceLayer")
	public Set<AlertIntersection> getAlertIntersections() {
		return alertIntersections;
	}

	public void setAlertIntersections(Set<AlertIntersection> alertIntersections) {
		this.alertIntersections = alertIntersections;
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_layer", nullable = false, unique = true)
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

	//Nullable because in the database there is a Default
	@Column(name = "s_mode", nullable = true)
	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="id_layersource")
	public LayerSource getLayerSource() {
		return layerSource;
	}

	public void setLayerSource(LayerSource layerSource) {
		this.layerSource = layerSource;
		
		/*
		 * This sets the id of the layerSource.
		 * It is automatically set when the Layer is loaded by hibernate
		 */
		if (layerSource != null) {
			this.idLayerSource = layerSource.getIdLayerSource();
		}
	}
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="id_layer_type")
	public LayerType getLayerType() {
		return layerType;
	}

	public void setLayerType(LayerType layerType) {
		this.layerType = layerType;
	}

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="id_layer_config")
	public LayerConfig getLayerConfig() {
		return layerConfig;
	}

	public void setLayerConfig(LayerConfig layerConfig) {
		this.layerConfig = layerConfig;
	}

	@Column(name = "base_layer", nullable = false)
	public boolean isBaseLayer() {
		return baseLayer;
	}

	public void setBaseLayer(boolean baseLayer) {
		this.baseLayer = baseLayer;
	}
	
	@Transient
	public int getIdLayerSource() {
		return getLayerSource().getIdLayerSource();
	}
	
	@Column(name = "s_attribute_name_for_info", nullable=true)
	public String getAttributeNameForInfo() {
		return attributeNameForInfo;
	}

	public void setAttributeNameForInfo(String attributeNameForInfo) {
		this.attributeNameForInfo = attributeNameForInfo;
	}

	@Column(name = "reference_layer_for_alerts", nullable = false)
	public boolean isReferenceLayerForAlerts() {
		return referenceLayerForAlerts;
	}

	public void setReferenceLayerForAlerts(boolean referenceLayerForAlerts) {
		this.referenceLayerForAlerts = referenceLayerForAlerts;
	}

	@Column(name = "s_responsible", nullable = true)
	public String getResponsible() {
		return responsible;
	}

	public void setResponsible(String responsible) {
		this.responsible = responsible;
	}

	@Column(name = "external", nullable = false)
	public boolean isExternal() {
		return external;
	}

	public void setExternal(boolean isExternal) {
		this.external = isExternal;
	}
	
	@Column(name = "downloadable", nullable = false)
	public boolean isDownloadable() {
		return downloadable;
	}

	public void setDownloadable(boolean downloadable) {
		this.downloadable = downloadable;
	}
	
	@Column(name = "f_wfs_search_enabled", nullable = false)
	public boolean isWfsSearchEnabled() {
		return wfsSearchEnabled;
	}

	public void setWfsSearchEnabled(boolean wfsSearchEnabled) {
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
	public boolean isShowInfoDialog() {
		return showInfoDialog;
	}

	public void setShowInfoDialog(boolean showInfoDialog) {
		this.showInfoDialog = showInfoDialog;
	}
}