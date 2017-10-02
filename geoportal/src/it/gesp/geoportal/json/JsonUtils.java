package it.gesp.geoportal.json;

import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class JsonUtils {

	public static List<String> parseJsonAsStringList(Gson gson, String json) {
		Type collectionType = new TypeToken<List<String>>() {}.getType();
		List<String> resultList = gson.fromJson(json, collectionType);
		
		return resultList;
	}
	
	public static List<Integer> parseJsonAsIntegerList(Gson gson, String json) {
		Type collectionType = new TypeToken<List<Integer>>() {}.getType();
		List<Integer> resultList = gson.fromJson(json, collectionType);
		
		return resultList;
	}
	
	public static List<Double> parseJsonAsDoubleList(Gson gson, String json) {
		Type collectionType = new TypeToken<List<Double>>() {}.getType();
		List<Double> resultList = gson.fromJson(json, collectionType);
		
		return resultList;
	}
}
