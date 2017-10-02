package it.gesp.geoportal.servlets;

import it.gesp.geoportal.locale.LocaleUtils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.pdf.AcroFields;
import com.lowagie.text.pdf.PdfCopy;
import com.lowagie.text.pdf.PdfReader;
import com.lowagie.text.pdf.PdfStamper;

public class PdfServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(Login.class);

	public PdfServlet() {
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

	private void doWork(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String x = "pippo";
		PrintWriter w = response.getWriter();
		w.write(x);
		try {
			test();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		w.flush();
	}

	private static final String OUTPUT_FILE = "c:\\output_file_correct.pdf";
	private static final String TEMPLATE_FILE = "c:\\DDT_FP.pdf";
	private static final String TEMP_FILE = "c:\\temp_file.pdf";

	private void test() throws Exception {
		byte[] image = null;

		try {
			OutputStream fos = new FileOutputStream(OUTPUT_FILE);
			Document docPdf = new Document();
			PdfCopy pc = new PdfCopy(docPdf, fos);
			docPdf.open();

			FileInputStream existingTemplateFis = new FileInputStream(
					TEMPLATE_FILE);

			// open existing pdf
			PdfReader pdfReader = new PdfReader(existingTemplateFis);

			// temp mem stream
			// FileOutputStream fosTemp = new FileOutputStream(TEMP_FILE);
			ByteArrayOutputStream fosTemp = new ByteArrayOutputStream();

			// Stamper
			PdfStamper stamper = new PdfStamper(pdfReader, fosTemp);

			// Mapping

			// "Flatten" the form so it wont be editable/usable anymore
			stamper.setFormFlattening(true);
			stamper.close();
			pdfReader.close();

			// PdfReader tmpPdfReader = new PdfReader(TEMP_FILE);
			byte[] barr = fosTemp.toByteArray();
			PdfReader tmpPdfReader = new PdfReader(new ByteArrayInputStream(
					barr));

			pc.addPage(pc.getImportedPage(tmpPdfReader, 1));
			tmpPdfReader.close();

			pc.close();
			// image = ReportUtility.FileToByte(workingDir + tmpDDT);

			// return image;

		} catch (Exception ex) {
			throw ex;
		}
	}

	private void Map(PdfStamper stamper) {
//		try {
//			AcroFields acroFields = stamper.getAcroFields();
//			Set<String> fieldKeys = acroFields.getFields().keySet();
//
//			for (String fieldKey : fieldKeys) {
//				switch (fieldKey) {
//				// Identificativo
//				case "identificativo":
//					acroFields.setField(fieldKey, "IDDD");
//
//					break;
//				}
//			}
//
//		} catch (IOException ioex) {
//			ioex.printStackTrace();
//		} catch (DocumentException dex) {
//			dex.printStackTrace();
//		}
	}

}
