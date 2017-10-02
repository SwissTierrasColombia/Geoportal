package it.gesp.geoportal.dao.dto;

import it.gesp.geoportal.dao.entities.Map;
import it.gesp.geoportal.json.JsonFactory;

import java.util.List;

import com.google.gson.Gson;

public class MapDTO {

	private int idMap;
	private String mapName;
	private String projection;
	private Integer zoom;
	private Double maxScale;
	private String units;
	
	private Double centerx;
	private Double centery;
	
//	private Double minx;
//	private Double miny;
//	private Double maxx;
//	private Double maxy;
	
	private Double defaultExtentMinX;
	private Double defaultExtentMinY;
	private Double defaultExtentMaxX;
	private Double defaultExtentMaxY;
	
	
	private Boolean showOverview;
	
	private Double dotsPerInch;
	private String enableCustomScalesResolutions;

	private List<Integer> customScales;
	private List<Double> customResolutions;
	
	public int getIdMap() {
		return idMap;
	}

	public void setIdMap(int idMap) {
		this.idMap = idMap;
	}

	public String getMapName() {
		return mapName;
	}

	public void setMapName(String mapName) {
		this.mapName = mapName;
	}

	public String getProjection() {
		return projection;
	}

	public void setProjection(String projection) {
		this.projection = projection;
	}

	public Integer getZoom() {
		return zoom;
	}

	public void setZoom(Integer zoom) {
		this.zoom = zoom;
	}
	
	public String getUnits() {
		return units;
	}

	public void setUnits(String units) {
		this.units = units;
	}
	
	public Double getCenterx() {
		return centerx;
	}

	public void setCenterx(Double centerx) {
		this.centerx = centerx;
	}

	public Double getCentery() {
		return centery;
	}

	public void setCentery(Double centery) {
		this.centery = centery;
	}

//	public Double getMinx() {
//		return minx;
//	}
//
//	public void setMinx(Double minx) {
//		this.minx = minx;
//	}
//
//	public Double getMiny() {
//		return miny;
//	}
//
//	public void setMiny(Double miny) {
//		this.miny = miny;
//	}
//
//	public Double getMaxx() {
//		return maxx;
//	}
//
//	public void setMaxx(Double maxx) {
//		this.maxx = maxx;
//	}
//
//	public Double getMaxy() {
//		return maxy;
//	}
//
//	public void setMaxy(Double maxy) {
//		this.maxy = maxy;
//	}
	
	public static MapDTO parseFromMap(Map map) {
		MapDTO mapDTO = new MapDTO();
		
		mapDTO.setIdMap(map.getIdMap());
		mapDTO.setMapName(map.getMapName());
		mapDTO.setProjection(map.getProjection());
		mapDTO.setMaxScale(map.getMaxScale());
		mapDTO.setUnits(map.getUnits());
		
		
		//Center & Zoom
//		mapDTO.setZoom(map.getZoom());
//		mapDTO.setCenterx(map.getCenterXCoord());
//		mapDTO.setCentery(map.getCenterYCoord());
		
		//Default Extent
		mapDTO.setDefaultExtentMinX(map.getDefaultExtentMinX());
		mapDTO.setDefaultExtentMinY(map.getDefaultExtentMinY());
		mapDTO.setDefaultExtentMaxX(map.getDefaultExtentMaxX());
		mapDTO.setDefaultExtentMaxY(map.getDefaultExtentMaxY());
		
		//Show overview
		mapDTO.setShowOverview(map.isShowOverview());
		
		//Scales
		mapDTO.setEnableCustomScalesResolutions(map.getEnableCustomScalesResolutions());
		mapDTO.setCustomScales(map.getCustomScalesAsList());
		mapDTO.setCustomResolutions(map.getCustomResolutionsAsList());
		
		//Dots per inch override
		mapDTO.setDotsPerInch(map.getDotsPerInch());
		
		//Extent
//		List<Double> extentList = map.getMaxExtentAsObject();
//		
//		if (extentList.size() == 4) {
//			mapDTO.setMinx(extentList.get(0));
//			mapDTO.setMiny(extentList.get(1));
//			mapDTO.setMaxx(extentList.get(2));
//			mapDTO.setMaxy(extentList.get(3));
//		}
		
		return mapDTO;
	}

	public Boolean getShowOverview() {
		return showOverview;
	}

	public void setShowOverview(Boolean showOverview) {
		this.showOverview = showOverview;
	}

	public Double getDotsPerInch() {
		return dotsPerInch;
	}

	public void setDotsPerInch(Double dotsPerInch) {
		this.dotsPerInch = dotsPerInch;
	}

	public List<Integer> getCustomScales() {
		return customScales;
	}

	public void setCustomScales(List<Integer> customScales) {
		this.customScales = customScales;
	}

	public String getCustomScalesAsJson() {
		Gson gson = JsonFactory.getGson();
		String customScalesAsJson = gson.toJson(this.customScales);
		return customScalesAsJson;
	}

	public String getCustomResolutionsAsJson() {
		Gson gson = JsonFactory.getGson();
		String customResolutionsAsJson = gson.toJson(this.customResolutions);
		return customResolutionsAsJson;
	}
	
	public String getEnableCustomScalesResolutions() {
		return enableCustomScalesResolutions;
	}

	public void setEnableCustomScalesResolutions(
			String enableCustomScalesResolutions) {
		this.enableCustomScalesResolutions = enableCustomScalesResolutions;
	}

	public List<Double> getCustomResolutions() {
		return customResolutions;
	}

	public void setCustomResolutions(List<Double> customResolutions) {
		this.customResolutions = customResolutions;
	}

	public Double getMaxScale() {
		return maxScale;
	}

	public void setMaxScale(Double maxScale) {
		this.maxScale = maxScale;
	}

	public Double getDefaultExtentMinX() {
		return defaultExtentMinX;
	}

	public void setDefaultExtentMinX(Double defaultExtentMinX) {
		this.defaultExtentMinX = defaultExtentMinX;
	}

	public Double getDefaultExtentMinY() {
		return defaultExtentMinY;
	}

	public void setDefaultExtentMinY(Double defaultExtentMinY) {
		this.defaultExtentMinY = defaultExtentMinY;
	}

	public Double getDefaultExtentMaxX() {
		return defaultExtentMaxX;
	}

	public void setDefaultExtentMaxX(Double defaultExtentMaxX) {
		this.defaultExtentMaxX = defaultExtentMaxX;
	}

	public Double getDefaultExtentMaxY() {
		return defaultExtentMaxY;
	}

	public void setDefaultExtentMaxY(Double defaultExtentMaxY) {
		this.defaultExtentMaxY = defaultExtentMaxY;
	}
	
}