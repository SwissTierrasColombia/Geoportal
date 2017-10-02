package it.gesp.geoportal.json;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JsonFactory {

	public static Gson getGson() {
		return getGson(true, false, false);
	}

	public static Gson getGsonWithNoFilters() {
		return getGson(false, false, false);
	}

	public static Gson getGson(boolean filterExposedFields,
			boolean serializeNulls, boolean prettyPrinting) {
		Gson gson = null;
		GsonBuilder gsonBuilder = new GsonBuilder();

		// Enable pretty printing.
		if (prettyPrinting) {
			gsonBuilder.setPrettyPrinting();
		}

		if (filterExposedFields) {
			gsonBuilder.setExclusionStrategies(new GeoportalGsonExclusionStrategy());
		}
		if (serializeNulls) {
			gsonBuilder.serializeNulls();
		}

		gson = gsonBuilder.create();

		return gson;
	}
}
