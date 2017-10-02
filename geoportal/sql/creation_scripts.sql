  
CREATE TABLE permissions
(
  id_permission integer NOT NULL DEFAULT nextval('modules_id_module_seq'::regclass),
  c_permission character varying(20),
  description character varying(50),
  name character varying(20),
  CONSTRAINT permissions_pkey PRIMARY KEY (id_permission)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE permissions
  OWNER TO geoportal_user;
  

CREATE TABLE users
(
  id_user serial NOT NULL,
  password character varying(20),
  username character varying(20),
  CONSTRAINT users_pkey PRIMARY KEY (id_user)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users
  OWNER TO geoportal_user;
  
-- Inserimento user test
INSERT INTO users
(
  password,
  username
)
VALUES 
(
  'mosef',
  'mosef'
);

  
CREATE TABLE user_permission
(
  id_permission integer NOT NULL,
  id_user integer NOT NULL,
  CONSTRAINT user_permission_pkey PRIMARY KEY (id_permission, id_user),
  CONSTRAINT fk_6if3j8xnjlv5l0nvelpyhwoyv FOREIGN KEY (id_user)
      REFERENCES permissions (id_permission) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_byl1tfuxp77bjytcra59araha FOREIGN KEY (id_permission)
      REFERENCES users (id_user) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE user_permission
  OWNER TO geoportal_user; 
  
CREATE TABLE redlining_point
(
  id_redlining serial NOT NULL DEFAULT nextval('redlining_redlining_seq'::regclass),
  id_user integer,
  type character varying(1),
  label character varying,
  geometry character varying,
  CONSTRAINT fk_id_redlining_point PRIMARY KEY (id_redlining)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE redlining_point
  OWNER TO geoportal_user;

CREATE TABLE redlining_line
(
  id_redlining serial NOT NULL DEFAULT nextval('redlining_redlining_seq'::regclass),
  id_user integer,
  type character varying(1),
  label character varying,
  geometry character varying,
  CONSTRAINT fk_id_redlining_line PRIMARY KEY (id_redlining)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE redlining_line
  OWNER TO geoportal_user;
  
CREATE TABLE redlining_polygon
(
  id_redlining serial NOT NULL DEFAULT nextval('redlining_redlining_seq'::regclass),
  id_user integer,
  type character varying(1),
  label character varying,
  geometry character varying,
  CONSTRAINT fk_id_redlining_polygon PRIMARY KEY (id_redlining)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE redlining_polygon
  OWNER TO geoportal_user;

SELECT AddGeometryColumn ('redlining_point','the_geom',4326,'POINT',2);
SELECT AddGeometryColumn ('redlining_line','the_geom',4326,'LINESTRING',2);
SELECT AddGeometryColumn ('redlining_polygon','the_geom',4326,'POLYGON',2);


-- ALERTS (DENUNCIAS)
CREATE TABLE alert_types
(
  id_alert_type serial NOT NULL,
  name character varying,
  CONSTRAINT alert_type_id_alert_type PRIMARY KEY (id_alert_type)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE alert_types
  OWNER TO geoportal_user;
  

CREATE TABLE alert_point
(
  id_alert serial NOT NULL,
  id_user integer,
  label character varying,
  geometry character varying,
  CONSTRAINT fk_id_alert_point PRIMARY KEY (id_alert)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE alert_point
  OWNER TO geoportal_user;

CREATE TABLE alert_line
(
  id_alert serial NOT NULL,
  id_user integer,
  label character varying,
  geometry character varying,
  CONSTRAINT fk_id_alert_line PRIMARY KEY (id_alert)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE alert_line
  OWNER TO geoportal_user;
  
CREATE TABLE alert_polygon
(
  id_alert serial NOT NULL,
  id_user integer,
  label character varying,
  geometry character varying,
  CONSTRAINT fk_id_alert_polygon PRIMARY KEY (id_alert)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE alert_polygon
  OWNER TO geoportal_user;

SELECT AddGeometryColumn ('alert_point','the_geom',4326,'POINT',2);
SELECT AddGeometryColumn ('alert_line','the_geom',4326,'LINESTRING',2);
SELECT AddGeometryColumn ('alert_polygon','the_geom',4326,'POLYGON',2);

--LOG TABLE
CREATE TABLE logs
(
  id_log serial NOT NULL,
  id_user integer,
  operation character varying,
  description character varying,
  operation_time timestamp without time zone,
  context character varying,
  CONSTRAINT pk_logs_id_log PRIMARY KEY (id_log)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE logs
  OWNER TO geoportal_user;

  
  
--- VIEWS
create view test.vw_alerts AS
(
select id_alert, A.id_alert_type, AT.name as type_name, geometry_type, id_user, title, description, insert_time, c_status_curr , ALS.name as status_curr_name,
CASE A.geometry_type 
WHEN 'point' THEN ST_AsText(GP.the_geom)
WHEN 'line' THEN ST_AsText(GL.the_geom)
WHEN 'polygon' THEN ST_AsText(GPOL.the_geom)
END as wkt_geometry
from test.alerts A 
join test.alert_types AT on A.id_alert_type = AT.id_alert_type
join test.alert_status AS ALS on ALS.c_status = A.c_status_curr
left join test.alert_geom_point GP on GP.id_geom = A.id_geom
left join test.alert_geom_line GL on GL.id_geom = A.id_geom
left join test.alert_geom_polygon GPOL on GPOL.id_geom = A.id_geom
)