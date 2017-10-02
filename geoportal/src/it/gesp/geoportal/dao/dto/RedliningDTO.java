package it.gesp.geoportal.dao.dto;


public class RedliningDTO {

	private static final String EPSG_DEFAULT_REDLINING = "EPSG:4326";
	
	private int idRedline;
	private String wktGeometry;
	private String geometryType;
	private String redliningType;
	private String label;
	private String epsg;
	private String show;

	public int getIdRedline() {
		return idRedline;
	}
	public void setIdRedline(int idRedline) {
		this.idRedline = idRedline;
	}
	
	public String getWktGeometry() {
		return wktGeometry;
	}
	public void setWktGeometry(String wktGeometry) {
		this.wktGeometry = wktGeometry;
	}
	public String getGeometryType() {
		return geometryType;
	}
	public void setGeometryType(String geometryType) {
		this.geometryType = geometryType;
	}
	public String getEpsg() {
		return epsg;
	}
	public void setEpsg(String epsg) {
		this.epsg = epsg;
	}
	
	public String getRedliningType() {
		return redliningType;
	}
	public void setRedliningType(String redliningType) {
		this.redliningType = redliningType;
	}
	
	public static RedliningDTO parseRedlining(Object ob) {
		Object featureArray[] = (Object[]) ob;
		int idRedline = (Integer) featureArray[0];
		int idUser = (Integer) featureArray[1];
		String label = (String) featureArray[2];
		String wktGeometry = (String) featureArray[3];

		RedliningDTO feat = new RedliningDTO();
		feat.setIdRedline(idRedline);
		// feat.setUserName("" + idUser);
		feat.setLabel(label);
		
		/*
		 * If there is a label, then "show" must be set to "yes"
		 */
		if (label != null && !"".equals(label)) {
			feat.setShow("yes");
		}
		
		feat.setWktGeometry(wktGeometry);
		feat.setEpsg(EPSG_DEFAULT_REDLINING);
		return feat;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	
	public void setShow(String show) {
		this.show = show;
	}
	
	public String getShow() {
		return show;
	}
	
}