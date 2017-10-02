package it.gesp.geoportal.servlets;

import java.io.PrintWriter;

import org.apache.log4j.Logger;

public class ServletUtils {
	static void writeAndFlush( Logger logger, PrintWriter w, String jsonRes) {
		logger.debug("Response: " + jsonRes);
		w.write(jsonRes);
		w.flush();
		return;
	}
}
