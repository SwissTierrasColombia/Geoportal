package it.gesp.geoportal.servlets;

import it.gesp.geoportal.locale.LocaleUtils;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

public class TestServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(Login.class);

	public TestServlet() {
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

//		String x = LocaleUtils.sayHello();
//		PrintWriter w = response.getWriter();
//		w.write(x);
//
//		w.flush();
	}

}
