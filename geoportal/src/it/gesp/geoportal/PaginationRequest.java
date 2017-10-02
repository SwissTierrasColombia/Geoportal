package it.gesp.geoportal;

import it.gesp.geoportal.exceptions.DataInvalidException;

import javax.servlet.http.HttpServletRequest;

public class PaginationRequest {

	private int page;
	private int startFrom;
	private int size;
	private String sortColumn;
	private String sortDir;

	public PaginationRequest(HttpServletRequest request)
			throws DataInvalidException {

		try {
			
			String pageString = request.getParameter("draw");
			String startString = request.getParameter("start");
			String lengthString = request.getParameter("length");

			String sortColId = request.getParameter("order[0][column]");
			String colParamName = "columns[" + sortColId + "][data]";
			this.sortColumn = request.getParameter(colParamName);
			this.sortDir = request.getParameter("order[0][dir]");

			this.page = Integer.parseInt(pageString);
			int length = Integer.parseInt(lengthString);

			this.startFrom = Integer.parseInt(startString);
			this.size = length;	
			
		} catch (Exception x) {
			throw new DataInvalidException();
		}
	}

	public int getPage() {
		return page;
	}

	public int getStartFrom() {
		return startFrom;
	}

	public int getSize() {
		return size;
	}

	public String getSortColumn() {
		return sortColumn;
	}

	public String getSortDir() {
		return sortDir;
	}

}