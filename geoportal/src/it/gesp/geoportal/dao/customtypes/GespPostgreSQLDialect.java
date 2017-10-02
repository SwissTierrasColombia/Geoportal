package it.gesp.geoportal.dao.customtypes;

import java.sql.Types;

import org.hibernate.dialect.PostgreSQL9Dialect;

public class GespPostgreSQLDialect extends PostgreSQL9Dialect  {

    public GespPostgreSQLDialect() {

        super();

        this.registerColumnType(Types.JAVA_OBJECT, "json");
    }
}