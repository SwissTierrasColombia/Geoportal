package it.gesp.geoportal.servlets;

import it.gesp.geoportal.exceptions.DataInvalidException;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;

public class DownloadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(DownloadServlet.class);

	public DownloadServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doWork(request, response);
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doWork(request, response);
	}

	@SuppressWarnings("unchecked")
	private void doWork(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String oper = request.getParameter("oper");
		try {

			/*
			 * DOWNLOAD as TXT File 
			 */
			if ("downloadTextAsFile".equalsIgnoreCase(oper)) {
				String fileName = request.getParameter("fileName");
				String content = request.getParameter("content");
				
				//REF: http://www.mkyong.com/java/how-to-download-file-from-website-java-jsp/
				
				response.setContentType("application/octet-stream");
				response.setHeader("Content-Disposition", "attachment;filename=" + fileName);

				StringBuffer sb = new StringBuffer(content);
				InputStream in = new ByteArrayInputStream(sb.toString().getBytes("UTF-8"));
				ServletOutputStream out = response.getOutputStream();
				
				//Apache Commons IO to copy a from a stream to the other stream.
				IOUtils.copy(in, out);
//				byte[] outputByte = new byte[4096];
//				//copy binary contect to output stream
//				while(in.read(outputByte, 0, 4096) != -1)
//				{
//					out.write(outputByte, 0, 4096);
//				}
				in.close();
				out.flush();
				out.close();
				
			}
			else {
				log.debug("Wrong OPER param");
				throw new DataInvalidException();
			}
			
		} catch (Exception x) {
			log.debug("Generic exception", x);
		}
	}
}
