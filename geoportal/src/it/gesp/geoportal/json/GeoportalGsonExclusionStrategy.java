package it.gesp.geoportal.json;

import it.gesp.geoportal.GsonExclude;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;

public class GeoportalGsonExclusionStrategy implements ExclusionStrategy{

//	private final Class<?> typeToSkip;

//    private GeoportalGsonExclusionStrategy(Class<?> typeToSkip) {
//      this.typeToSkip = typeToSkip;
//    }

    @Override
    public boolean shouldSkipClass(Class<?> clazz) {
      return false;
    }

    @Override
    public boolean shouldSkipField(FieldAttributes f) {
      return f.getAnnotation(GsonExclude.class) != null;
    }

}