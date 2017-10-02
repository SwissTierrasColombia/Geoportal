--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.4
-- Dumped by pg_dump version 9.3.4
-- Started on 2015-06-03 11:27:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 7 (class 2615 OID 49749)
-- Name: geoportal; Type: SCHEMA; Schema: -; Owner: geoportal_user
--

CREATE SCHEMA geoportal;


ALTER SCHEMA geoportal OWNER TO geoportal_user;

SET search_path = geoportal, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 184 (class 1259 OID 49750)
-- Name: alert_geom_line; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE alert_geom_line (
    id_geom integer NOT NULL,
    the_geom public.geometry(LineString,4326)
);


ALTER TABLE geoportal.alert_geom_line OWNER TO geoportal_user;

--
-- TOC entry 185 (class 1259 OID 49756)
-- Name: alert_geom_point; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE alert_geom_point (
    id_geom integer NOT NULL,
    the_geom public.geometry(Point,4326)
);


ALTER TABLE geoportal.alert_geom_point OWNER TO geoportal_user;

--
-- TOC entry 186 (class 1259 OID 49762)
-- Name: alert_geom_polygon; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE alert_geom_polygon (
    id_geom integer NOT NULL,
    the_geom public.geometry(Polygon,4326)
);


ALTER TABLE geoportal.alert_geom_polygon OWNER TO geoportal_user;

--
-- TOC entry 208 (class 1259 OID 49946)
-- Name: alert_geoms; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE alert_geoms
    START WITH 55
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.alert_geoms OWNER TO geoportal_user;

--
-- TOC entry 187 (class 1259 OID 49768)
-- Name: alerts; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE alerts (
    id_alert integer NOT NULL,
    id_user integer,
    title character varying,
    description character varying NOT NULL,
    c_status_curr character varying(1) NOT NULL,
    id_alert_type integer NOT NULL,
    insert_time timestamp without time zone,
    geometry_type character varying NOT NULL,
    id_geom integer NOT NULL,
    reference_code character varying,
    submitter_name character varying,
    submitter_email character varying,
    dep_name character varying,
    dep_cod character varying,
    inserted_by_muni_name character varying,
    inserted_by_muni_cod character varying,
    from_sit_muni boolean DEFAULT false NOT NULL,
    date_event date,
    phone_num character varying,
    mobile_num character varying
);


ALTER TABLE geoportal.alerts OWNER TO geoportal_user;

--
-- TOC entry 188 (class 1259 OID 49774)
-- Name: alert_id_alert_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE alert_id_alert_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.alert_id_alert_seq OWNER TO geoportal_user;

--
-- TOC entry 3550 (class 0 OID 0)
-- Dependencies: 188
-- Name: alert_id_alert_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE alert_id_alert_seq OWNED BY alerts.id_alert;


--
-- TOC entry 189 (class 1259 OID 49776)
-- Name: alert_status; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE alert_status (
    c_status character varying(1) NOT NULL,
    name character varying
);


ALTER TABLE geoportal.alert_status OWNER TO geoportal_user;

--
-- TOC entry 190 (class 1259 OID 49782)
-- Name: alert_status_history; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE alert_status_history (
    id_alert integer,
    c_status character varying(1),
    date_change timestamp without time zone,
    id_history integer NOT NULL,
    note character varying
);


ALTER TABLE geoportal.alert_status_history OWNER TO geoportal_user;

--
-- TOC entry 191 (class 1259 OID 49788)
-- Name: alert_status_history_id_history_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE alert_status_history_id_history_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.alert_status_history_id_history_seq OWNER TO geoportal_user;

--
-- TOC entry 3551 (class 0 OID 0)
-- Dependencies: 191
-- Name: alert_status_history_id_history_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE alert_status_history_id_history_seq OWNED BY alert_status_history.id_history;


--
-- TOC entry 192 (class 1259 OID 49790)
-- Name: alert_types; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE alert_types (
    id_alert_type integer NOT NULL,
    name character varying,
    key character varying
);


ALTER TABLE geoportal.alert_types OWNER TO geoportal_user;

--
-- TOC entry 193 (class 1259 OID 49796)
-- Name: alert_types_id_alert_type_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE alert_types_id_alert_type_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.alert_types_id_alert_type_seq OWNER TO geoportal_user;

--
-- TOC entry 3552 (class 0 OID 0)
-- Dependencies: 193
-- Name: alert_types_id_alert_type_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE alert_types_id_alert_type_seq OWNED BY alert_types.id_alert_type;


--
-- TOC entry 233 (class 1259 OID 94429)
-- Name: alerts_intersections; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE alerts_intersections (
    id integer NOT NULL,
    name character varying NOT NULL,
    id_layer integer,
    key_column_name character varying,
    desc_column_name character varying,
    geom_column_name character varying,
    active boolean DEFAULT false NOT NULL,
    CONSTRAINT ck_alerts_intersections CHECK (((((((active = true) AND (id_layer IS NOT NULL)) AND (key_column_name IS NOT NULL)) AND (desc_column_name IS NOT NULL)) AND (geom_column_name IS NOT NULL)) OR (active = false)))
);


ALTER TABLE geoportal.alerts_intersections OWNER TO geoportal_user;

--
-- TOC entry 234 (class 1259 OID 94446)
-- Name: alerts_intersections_id_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE alerts_intersections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.alerts_intersections_id_seq OWNER TO geoportal_user;

--
-- TOC entry 3553 (class 0 OID 0)
-- Dependencies: 234
-- Name: alerts_intersections_id_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE alerts_intersections_id_seq OWNED BY alerts_intersections.id;


--
-- TOC entry 232 (class 1259 OID 94420)
-- Name: alerts_settings; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE alerts_settings (
    id integer NOT NULL,
    key character varying NOT NULL,
    value character varying NOT NULL
);


ALTER TABLE geoportal.alerts_settings OWNER TO geoportal_user;

--
-- TOC entry 231 (class 1259 OID 94418)
-- Name: alerts_settings_id_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE alerts_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.alerts_settings_id_seq OWNER TO geoportal_user;

--
-- TOC entry 3554 (class 0 OID 0)
-- Dependencies: 231
-- Name: alerts_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE alerts_settings_id_seq OWNED BY alerts_settings.id;


--
-- TOC entry 225 (class 1259 OID 77323)
-- Name: comments; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE comments (
    id_comment integer NOT NULL,
    id_user integer NOT NULL,
    value character varying
);


ALTER TABLE geoportal.comments OWNER TO geoportal_user;

--
-- TOC entry 226 (class 1259 OID 77326)
-- Name: comments_p_comment_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE comments_p_comment_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.comments_p_comment_seq OWNER TO geoportal_user;

--
-- TOC entry 3555 (class 0 OID 0)
-- Dependencies: 226
-- Name: comments_p_comment_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE comments_p_comment_seq OWNED BY comments.id_comment;


--
-- TOC entry 235 (class 1259 OID 94553)
-- Name: departments_permissions_mapping; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE departments_permissions_mapping (
    id integer NOT NULL,
    c_permission character varying NOT NULL,
    identif_value character varying NOT NULL
);


ALTER TABLE geoportal.departments_permissions_mapping OWNER TO geoportal_user;

--
-- TOC entry 236 (class 1259 OID 94556)
-- Name: departments_permissions_mapping_id_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE departments_permissions_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.departments_permissions_mapping_id_seq OWNER TO geoportal_user;

--
-- TOC entry 3556 (class 0 OID 0)
-- Dependencies: 236
-- Name: departments_permissions_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE departments_permissions_mapping_id_seq OWNED BY departments_permissions_mapping.id;


--
-- TOC entry 230 (class 1259 OID 77773)
-- Name: general_settings; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE general_settings (
    id integer NOT NULL,
    key character varying NOT NULL,
    value character varying NOT NULL
);


ALTER TABLE geoportal.general_settings OWNER TO geoportal_user;

--
-- TOC entry 229 (class 1259 OID 77771)
-- Name: general_settings_id_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE general_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.general_settings_id_seq OWNER TO geoportal_user;

--
-- TOC entry 3557 (class 0 OID 0)
-- Dependencies: 229
-- Name: general_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE general_settings_id_seq OWNED BY general_settings.id;


--
-- TOC entry 223 (class 1259 OID 77189)
-- Name: layerconfigs; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE layerconfigs (
    id_layer_config integer NOT NULL,
    s_options json,
    s_ol_options json,
    s_cache_url character varying,
    cache_enabled boolean DEFAULT false NOT NULL,
    s_sld_url character varying,
    sld_override boolean DEFAULT false NOT NULL,
    s_cache_workspace character varying
);


ALTER TABLE geoportal.layerconfigs OWNER TO geoportal_user;

--
-- TOC entry 224 (class 1259 OID 77192)
-- Name: layer_config_id_layer_config_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE layer_config_id_layer_config_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.layer_config_id_layer_config_seq OWNER TO geoportal_user;

--
-- TOC entry 3558 (class 0 OID 0)
-- Dependencies: 224
-- Name: layer_config_id_layer_config_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE layer_config_id_layer_config_seq OWNED BY layerconfigs.id_layer_config;


--
-- TOC entry 219 (class 1259 OID 77134)
-- Name: layers; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE layers (
    id_layer integer NOT NULL,
    s_name character varying NOT NULL,
    s_title character varying NOT NULL,
    s_description character varying,
    id_layersource integer,
    s_mode character varying DEFAULT 'single'::character varying NOT NULL,
    id_layer_type integer NOT NULL,
    id_layer_config integer,
    base_layer boolean DEFAULT false NOT NULL,
    s_attribute_name_for_info character varying,
    reference_layer_for_alerts boolean DEFAULT false NOT NULL,
    s_responsible character varying,
    external boolean DEFAULT false NOT NULL,
    f_wfs_search_enabled boolean DEFAULT false NOT NULL,
    s_reference_date character varying,
    s_metadata_uuid character varying,
    s_wfs_url character varying,
    s_wcs_url character varying,
    downloadable boolean DEFAULT false NOT NULL,
    f_show_info_dialog boolean DEFAULT true NOT NULL
);


ALTER TABLE geoportal.layers OWNER TO geoportal_user;

--
-- TOC entry 217 (class 1259 OID 77123)
-- Name: layersources; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE layersources (
    id_layersource integer NOT NULL,
    s_url character varying,
    s_layersource_name character varying,
    s_layersource_description character varying,
    s_cache_url character varying,
    enabled_external_wms_list boolean DEFAULT false
);


ALTER TABLE geoportal.layersources OWNER TO geoportal_user;

--
-- TOC entry 238 (class 1259 OID 98202)
-- Name: layer_config_vw; Type: VIEW; Schema: geoportal; Owner: geoportal_user
--

CREATE VIEW layer_config_vw AS
 SELECT l.id_layer,
    l.s_name,
    l.s_title,
    l.s_description,
    l.id_layersource,
    sources.s_layersource_name,
    l.s_mode,
    l.base_layer,
    l.id_layer_type,
    l.s_attribute_name_for_info,
    l.s_reference_date,
    l.s_responsible,
    l.s_metadata_uuid,
    l.external,
    l.downloadable,
    l.f_wfs_search_enabled,
    l.s_wfs_url,
    l.s_wcs_url,
    l.f_show_info_dialog,
    conf.id_layer_config,
    conf.s_options,
    conf.s_ol_options,
    conf.s_cache_url,
    conf.s_cache_workspace,
    conf.cache_enabled,
    conf.s_sld_url,
    conf.sld_override
   FROM ((layers l
   LEFT JOIN layerconfigs conf ON ((l.id_layer_config = conf.id_layer_config)))
   LEFT JOIN layersources sources ON ((sources.id_layersource = l.id_layersource)))
  ORDER BY l.s_name;


ALTER TABLE geoportal.layer_config_vw OWNER TO geoportal_user;

--
-- TOC entry 215 (class 1259 OID 77107)
-- Name: layergroups; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE layergroups (
    id_layergroup integer NOT NULL,
    s_name character varying NOT NULL,
    id_map integer NOT NULL,
    "position" integer,
    background boolean DEFAULT false NOT NULL
);


ALTER TABLE geoportal.layergroups OWNER TO geoportal_user;

--
-- TOC entry 214 (class 1259 OID 77105)
-- Name: layer_group_id_layer_group_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE layer_group_id_layer_group_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.layer_group_id_layer_group_seq OWNER TO geoportal_user;

--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 214
-- Name: layer_group_id_layer_group_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE layer_group_id_layer_group_seq OWNED BY layergroups.id_layergroup;


--
-- TOC entry 216 (class 1259 OID 77121)
-- Name: layer_id_layer_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE layer_id_layer_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.layer_id_layer_seq OWNER TO geoportal_user;

--
-- TOC entry 3560 (class 0 OID 0)
-- Dependencies: 216
-- Name: layer_id_layer_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE layer_id_layer_seq OWNED BY layersources.id_layersource;


--
-- TOC entry 218 (class 1259 OID 77132)
-- Name: layer_id_layer_seq1; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE layer_id_layer_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.layer_id_layer_seq1 OWNER TO geoportal_user;

--
-- TOC entry 3561 (class 0 OID 0)
-- Dependencies: 218
-- Name: layer_id_layer_seq1; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE layer_id_layer_seq1 OWNED BY layers.id_layer;


--
-- TOC entry 221 (class 1259 OID 77143)
-- Name: layer_types; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE layer_types (
    id_layer_type integer NOT NULL,
    s_type_name character varying NOT NULL
);


ALTER TABLE geoportal.layer_types OWNER TO geoportal_user;

--
-- TOC entry 220 (class 1259 OID 77141)
-- Name: layer_type_id_layer_type_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE layer_type_id_layer_type_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.layer_type_id_layer_type_seq OWNER TO geoportal_user;

--
-- TOC entry 3562 (class 0 OID 0)
-- Dependencies: 220
-- Name: layer_type_id_layer_type_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE layer_type_id_layer_type_seq OWNED BY layer_types.id_layer_type;


--
-- TOC entry 222 (class 1259 OID 77167)
-- Name: layergroups_layers; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE layergroups_layers (
    id_layergroup integer NOT NULL,
    id_layer integer NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    "position" integer NOT NULL
);


ALTER TABLE geoportal.layergroups_layers OWNER TO geoportal_user;

--
-- TOC entry 194 (class 1259 OID 49806)
-- Name: logs; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE logs (
    id_log integer NOT NULL,
    id_user integer,
    operation character varying,
    description character varying,
    operation_time timestamp without time zone,
    context character varying
);


ALTER TABLE geoportal.logs OWNER TO geoportal_user;

--
-- TOC entry 195 (class 1259 OID 49812)
-- Name: logs_id_log_seq1; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE logs_id_log_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.logs_id_log_seq1 OWNER TO geoportal_user;

--
-- TOC entry 3563 (class 0 OID 0)
-- Dependencies: 195
-- Name: logs_id_log_seq1; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE logs_id_log_seq1 OWNED BY logs.id_log;


--
-- TOC entry 239 (class 1259 OID 98250)
-- Name: map_config_vw; Type: VIEW; Schema: geoportal; Owner: geoportal_user
--

CREATE VIEW map_config_vw AS
 SELECT lg.id_layergroup,
    lg.s_name AS layergroup_name,
    lg."position" AS layergroup_position,
    lg.id_map,
    lg.background,
    lgl."position",
    lgl.enabled,
    COALESCE(l.id_layer, 0) AS id_layer,
    l.s_name,
    l.s_title,
    l.s_description,
    l.id_layersource,
    sources.s_layersource_name,
    l.s_mode,
    l.base_layer,
    l.id_layer_type,
    conf.id_layer_config,
    conf.s_options,
    conf.s_ol_options,
    conf.s_cache_url,
    conf.cache_enabled
   FROM ((((layergroups lg
   LEFT JOIN layergroups_layers lgl ON ((lg.id_layergroup = lgl.id_layergroup)))
   LEFT JOIN layers l ON ((l.id_layer = lgl.id_layer)))
   LEFT JOIN layerconfigs conf ON ((l.id_layer_config = conf.id_layer_config)))
   LEFT JOIN layersources sources ON ((sources.id_layersource = l.id_layersource)))
  ORDER BY lg.id_map, lg.id_layergroup, lgl."position";


ALTER TABLE geoportal.map_config_vw OWNER TO geoportal_user;

--
-- TOC entry 212 (class 1259 OID 77091)
-- Name: maps; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE maps (
    id_map integer NOT NULL,
    s_name character varying NOT NULL,
    s_projection character varying NOT NULL,
    s_units character varying NOT NULL,
    s_max_extent character varying NOT NULL,
    s_center character varying NOT NULL,
    n_zoom integer NOT NULL,
    d_center_x double precision NOT NULL,
    d_center_y double precision NOT NULL,
    f_show_overview boolean DEFAULT false NOT NULL,
    j_custom_scales json,
    d_dots_per_inch_override double precision,
    j_custom_resolutions json,
    custom_scales_resolutions character varying,
    f_maxscale double precision,
    f_default_extent_minx double precision NOT NULL,
    f_default_extent_miny double precision NOT NULL,
    f_default_extent_maxx double precision NOT NULL,
    f_default_extent_maxy double precision NOT NULL
);


ALTER TABLE geoportal.maps OWNER TO geoportal_user;

--
-- TOC entry 213 (class 1259 OID 77094)
-- Name: map_id_map_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE map_id_map_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.map_id_map_seq OWNER TO geoportal_user;

--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 213
-- Name: map_id_map_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE map_id_map_seq OWNED BY maps.id_map;


--
-- TOC entry 209 (class 1259 OID 49948)
-- Name: modules_id_module_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE modules_id_module_seq
    START WITH 18
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.modules_id_module_seq OWNER TO geoportal_user;

--
-- TOC entry 196 (class 1259 OID 49814)
-- Name: permissions; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE permissions (
    id_permission integer NOT NULL,
    c_permission character varying(50) NOT NULL,
    description character varying(50),
    description_en character varying,
    description_es character varying
);


ALTER TABLE geoportal.permissions OWNER TO geoportal_user;

--
-- TOC entry 197 (class 1259 OID 49818)
-- Name: redlining_line; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE redlining_line (
    id_redlining integer NOT NULL,
    id_user integer,
    type character varying(1),
    label character varying,
    geometry character varying,
    the_geom public.geometry(LineString,4326)
);


ALTER TABLE geoportal.redlining_line OWNER TO geoportal_user;

--
-- TOC entry 198 (class 1259 OID 49824)
-- Name: redlining_line_id_redlining_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE redlining_line_id_redlining_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.redlining_line_id_redlining_seq OWNER TO geoportal_user;

--
-- TOC entry 3565 (class 0 OID 0)
-- Dependencies: 198
-- Name: redlining_line_id_redlining_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE redlining_line_id_redlining_seq OWNED BY redlining_line.id_redlining;


--
-- TOC entry 199 (class 1259 OID 49826)
-- Name: redlining_point; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE redlining_point (
    id_redlining integer NOT NULL,
    id_user integer,
    type character varying(1),
    label character varying,
    geometry character varying,
    the_geom public.geometry(Point,4326)
);


ALTER TABLE geoportal.redlining_point OWNER TO geoportal_user;

--
-- TOC entry 200 (class 1259 OID 49832)
-- Name: redlining_point_id_redlining_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE redlining_point_id_redlining_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.redlining_point_id_redlining_seq OWNER TO geoportal_user;

--
-- TOC entry 3566 (class 0 OID 0)
-- Dependencies: 200
-- Name: redlining_point_id_redlining_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE redlining_point_id_redlining_seq OWNED BY redlining_point.id_redlining;


--
-- TOC entry 201 (class 1259 OID 49834)
-- Name: redlining_polygon; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE redlining_polygon (
    id_redlining integer NOT NULL,
    id_user integer,
    type character varying(1),
    label character varying,
    geometry character varying,
    the_geom public.geometry(Polygon,4326)
);


ALTER TABLE geoportal.redlining_polygon OWNER TO geoportal_user;

--
-- TOC entry 202 (class 1259 OID 49840)
-- Name: redlining_polygon_id_redlining_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE redlining_polygon_id_redlining_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.redlining_polygon_id_redlining_seq OWNER TO geoportal_user;

--
-- TOC entry 3567 (class 0 OID 0)
-- Dependencies: 202
-- Name: redlining_polygon_id_redlining_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE redlining_polygon_id_redlining_seq OWNED BY redlining_polygon.id_redlining;


--
-- TOC entry 210 (class 1259 OID 49950)
-- Name: redlining_redlining_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE redlining_redlining_seq
    START WITH 273
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.redlining_redlining_seq OWNER TO geoportal_user;

--
-- TOC entry 203 (class 1259 OID 49842)
-- Name: role_permission; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE role_permission (
    id_role integer NOT NULL,
    id_permission integer NOT NULL
);


ALTER TABLE geoportal.role_permission OWNER TO geoportal_user;

--
-- TOC entry 204 (class 1259 OID 49845)
-- Name: roles; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE roles (
    id_role integer NOT NULL,
    role_name character varying NOT NULL,
    description character varying
);


ALTER TABLE geoportal.roles OWNER TO geoportal_user;

--
-- TOC entry 205 (class 1259 OID 49851)
-- Name: roles_id_role_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE roles_id_role_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.roles_id_role_seq OWNER TO geoportal_user;

--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 205
-- Name: roles_id_role_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE roles_id_role_seq OWNED BY roles.id_role;


--
-- TOC entry 227 (class 1259 OID 77382)
-- Name: system_settings; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE system_settings (
    id integer NOT NULL,
    key character varying NOT NULL,
    value character varying NOT NULL
);


ALTER TABLE geoportal.system_settings OWNER TO geoportal_user;

--
-- TOC entry 228 (class 1259 OID 77385)
-- Name: system_settings_id_system_setting_seq; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE system_settings_id_system_setting_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.system_settings_id_system_setting_seq OWNER TO geoportal_user;

--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 228
-- Name: system_settings_id_system_setting_seq; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE system_settings_id_system_setting_seq OWNED BY system_settings.id;


--
-- TOC entry 206 (class 1259 OID 49853)
-- Name: users; Type: TABLE; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE TABLE users (
    id_user integer NOT NULL,
    password_old character varying(20),
    username character varying(20) NOT NULL,
    id_role integer,
    f_disabled boolean DEFAULT false NOT NULL,
    f_deleted boolean DEFAULT false NOT NULL,
    password_hash character varying,
    CONSTRAINT chk_users_id_role_f_deleted CHECK ((((f_deleted = true) AND (id_role IS NULL)) OR ((f_deleted = false) AND (id_role IS NOT NULL))))
);


ALTER TABLE geoportal.users OWNER TO geoportal_user;

--
-- TOC entry 207 (class 1259 OID 49858)
-- Name: users_id_user_seq1; Type: SEQUENCE; Schema: geoportal; Owner: geoportal_user
--

CREATE SEQUENCE users_id_user_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geoportal.users_id_user_seq1 OWNER TO geoportal_user;

--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 207
-- Name: users_id_user_seq1; Type: SEQUENCE OWNED BY; Schema: geoportal; Owner: geoportal_user
--

ALTER SEQUENCE users_id_user_seq1 OWNED BY users.id_user;


--
-- TOC entry 237 (class 1259 OID 94578)
-- Name: vw_alerts; Type: VIEW; Schema: geoportal; Owner: geoportal_user
--

CREATE VIEW vw_alerts AS
 SELECT a.id_alert,
    a.id_alert_type,
    at.name AS type_name,
    a.geometry_type,
    a.id_user,
    a.title,
    a.description,
    a.reference_code,
    a.submitter_name,
    a.submitter_email,
    a.insert_time,
    a.date_event,
    a.phone_num,
    a.mobile_num,
    a.c_status_curr,
    a.dep_name,
    a.dep_cod,
    a.inserted_by_muni_name,
    a.inserted_by_muni_cod,
    a.from_sit_muni,
    als.name AS status_curr_name,
        CASE a.geometry_type
            WHEN 'point'::text THEN public.st_astext(gp.the_geom)
            ELSE NULL::text
        END AS wkt_geometry,
    last_modified_status.date_change
   FROM ((((alerts a
   JOIN alert_types at ON ((a.id_alert_type = at.id_alert_type)))
   JOIN alert_status als ON (((als.c_status)::text = (a.c_status_curr)::text)))
   JOIN alert_geom_point gp ON ((gp.id_geom = a.id_geom)))
   LEFT JOIN ( SELECT ash.id_alert,
    ash.c_status,
    ash.date_change,
    ash.id_history,
    ash.note
   FROM (alert_status_history ash
   JOIN ( SELECT alert_status_history.id_alert,
            max(alert_status_history.date_change) AS last_update
           FROM alert_status_history
          GROUP BY alert_status_history.id_alert) a_1 ON (((a_1.id_alert = ash.id_alert) AND (a_1.last_update = ash.date_change))))) last_modified_status ON ((last_modified_status.id_alert = a.id_alert)));


ALTER TABLE geoportal.vw_alerts OWNER TO geoportal_user;

--
-- TOC entry 241 (class 1259 OID 98348)
-- Name: vw_alerts_publish; Type: VIEW; Schema: geoportal; Owner: geoportal_user
--

CREATE VIEW vw_alerts_publish AS
 SELECT vw_alerts.id_alert,
    vw_alerts.id_alert_type,
    vw_alerts.reference_code,
    vw_alerts.type_name,
    vw_alerts.title,
    vw_alerts.description,
    vw_alerts.submitter_name,
    vw_alerts.submitter_email,
    vw_alerts.date_event,
    vw_alerts.phone_num,
    vw_alerts.mobile_num,
    vw_alerts.insert_time,
    vw_alerts.c_status_curr,
    vw_alerts.dep_name,
    vw_alerts.dep_cod,
    vw_alerts.inserted_by_muni_name,
    vw_alerts.inserted_by_muni_cod,
    vw_alerts.from_sit_muni,
    vw_alerts.status_curr_name,
    (public.st_geomfromtext(vw_alerts.wkt_geometry, 4326))::public.geometry(Geometry,4326) AS st_geomfromtext
   FROM vw_alerts;


ALTER TABLE geoportal.vw_alerts_publish OWNER TO geoportal_user;

--
-- TOC entry 240 (class 1259 OID 98334)
-- Name: vw_alerts_sit_read; Type: VIEW; Schema: geoportal; Owner: geoportal_user
--

CREATE VIEW vw_alerts_sit_read AS
 SELECT vw_alerts.id_alert,
    vw_alerts.id_alert_type,
    vw_alerts.reference_code,
    vw_alerts.type_name,
    vw_alerts.title,
    vw_alerts.description,
    vw_alerts.submitter_name,
    vw_alerts.submitter_email,
    vw_alerts.date_event,
    vw_alerts.phone_num,
    vw_alerts.mobile_num,
    vw_alerts.insert_time,
    vw_alerts.c_status_curr,
    vw_alerts.dep_name,
    vw_alerts.dep_cod,
    vw_alerts.inserted_by_muni_name,
    vw_alerts.inserted_by_muni_cod,
    vw_alerts.from_sit_muni,
    vw_alerts.status_curr_name,
    vw_alerts.wkt_geometry,
    (public.st_geomfromtext(vw_alerts.wkt_geometry, 4326))::public.geometry(Geometry,4326) AS st_geomfromtext
   FROM vw_alerts;


ALTER TABLE geoportal.vw_alerts_sit_read OWNER TO geoportal_user;

--
-- TOC entry 211 (class 1259 OID 75719)
-- Name: vw_alerts_test; Type: VIEW; Schema: geoportal; Owner: geoportal_user
--

CREATE VIEW vw_alerts_test AS
 SELECT a.id_alert,
    a.id_alert_type,
    at.name AS type_name,
    a.geometry_type,
    a.id_user,
    a.title,
    a.description,
    a.insert_time,
    a.c_status_curr,
    als.name AS status_curr_name,
        CASE a.geometry_type
            WHEN 'point'::text THEN gp.the_geom
            WHEN 'line'::text THEN gl.the_geom
            WHEN 'polygon'::text THEN gpol.the_geom
            ELSE NULL::public.geometry
        END AS geometry
   FROM (((((alerts a
   JOIN alert_types at ON ((a.id_alert_type = at.id_alert_type)))
   JOIN alert_status als ON (((als.c_status)::text = (a.c_status_curr)::text)))
   LEFT JOIN alert_geom_point gp ON ((gp.id_geom = a.id_geom)))
   LEFT JOIN alert_geom_line gl ON ((gl.id_geom = a.id_geom)))
   LEFT JOIN alert_geom_polygon gpol ON ((gpol.id_geom = a.id_geom)));


ALTER TABLE geoportal.vw_alerts_test OWNER TO geoportal_user;

--
-- TOC entry 3239 (class 2604 OID 49860)
-- Name: id_history; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY alert_status_history ALTER COLUMN id_history SET DEFAULT nextval('alert_status_history_id_history_seq'::regclass);


--
-- TOC entry 3240 (class 2604 OID 49861)
-- Name: id_alert_type; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY alert_types ALTER COLUMN id_alert_type SET DEFAULT nextval('alert_types_id_alert_type_seq'::regclass);


--
-- TOC entry 3238 (class 2604 OID 49862)
-- Name: id_alert; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY alerts ALTER COLUMN id_alert SET DEFAULT nextval('alert_id_alert_seq'::regclass);


--
-- TOC entry 3273 (class 2604 OID 94448)
-- Name: id; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY alerts_intersections ALTER COLUMN id SET DEFAULT nextval('alerts_intersections_id_seq'::regclass);


--
-- TOC entry 3272 (class 2604 OID 94423)
-- Name: id; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY alerts_settings ALTER COLUMN id SET DEFAULT nextval('alerts_settings_id_seq'::regclass);


--
-- TOC entry 3269 (class 2604 OID 77328)
-- Name: id_comment; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY comments ALTER COLUMN id_comment SET DEFAULT nextval('comments_p_comment_seq'::regclass);


--
-- TOC entry 3276 (class 2604 OID 94558)
-- Name: id; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY departments_permissions_mapping ALTER COLUMN id SET DEFAULT nextval('departments_permissions_mapping_id_seq'::regclass);


--
-- TOC entry 3271 (class 2604 OID 77776)
-- Name: id; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY general_settings ALTER COLUMN id SET DEFAULT nextval('general_settings_id_seq'::regclass);


--
-- TOC entry 3264 (class 2604 OID 77146)
-- Name: id_layer_type; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY layer_types ALTER COLUMN id_layer_type SET DEFAULT nextval('layer_type_id_layer_type_seq'::regclass);


--
-- TOC entry 3266 (class 2604 OID 77194)
-- Name: id_layer_config; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY layerconfigs ALTER COLUMN id_layer_config SET DEFAULT nextval('layer_config_id_layer_config_seq'::regclass);


--
-- TOC entry 3253 (class 2604 OID 77110)
-- Name: id_layergroup; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY layergroups ALTER COLUMN id_layergroup SET DEFAULT nextval('layer_group_id_layer_group_seq'::regclass);


--
-- TOC entry 3261 (class 2604 OID 77137)
-- Name: id_layer; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY layers ALTER COLUMN id_layer SET DEFAULT nextval('layer_id_layer_seq1'::regclass);


--
-- TOC entry 3255 (class 2604 OID 77126)
-- Name: id_layersource; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY layersources ALTER COLUMN id_layersource SET DEFAULT nextval('layer_id_layer_seq'::regclass);


--
-- TOC entry 3241 (class 2604 OID 49864)
-- Name: id_log; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY logs ALTER COLUMN id_log SET DEFAULT nextval('logs_id_log_seq1'::regclass);


--
-- TOC entry 3250 (class 2604 OID 77096)
-- Name: id_map; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY maps ALTER COLUMN id_map SET DEFAULT nextval('map_id_map_seq'::regclass);


--
-- TOC entry 3242 (class 2604 OID 49865)
-- Name: id_redlining; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY redlining_line ALTER COLUMN id_redlining SET DEFAULT nextval('redlining_line_id_redlining_seq'::regclass);


--
-- TOC entry 3243 (class 2604 OID 49866)
-- Name: id_redlining; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY redlining_point ALTER COLUMN id_redlining SET DEFAULT nextval('redlining_point_id_redlining_seq'::regclass);


--
-- TOC entry 3244 (class 2604 OID 49867)
-- Name: id_redlining; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY redlining_polygon ALTER COLUMN id_redlining SET DEFAULT nextval('redlining_polygon_id_redlining_seq'::regclass);


--
-- TOC entry 3245 (class 2604 OID 49868)
-- Name: id_role; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY roles ALTER COLUMN id_role SET DEFAULT nextval('roles_id_role_seq'::regclass);


--
-- TOC entry 3270 (class 2604 OID 77387)
-- Name: id; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY system_settings ALTER COLUMN id SET DEFAULT nextval('system_settings_id_system_setting_seq'::regclass);


--
-- TOC entry 3248 (class 2604 OID 49869)
-- Name: id_user; Type: DEFAULT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY users ALTER COLUMN id_user SET DEFAULT nextval('users_id_user_seq1'::regclass);


--
-- TOC entry 3494 (class 0 OID 49750)
-- Dependencies: 184
-- Data for Name: alert_geom_line; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--



--
-- TOC entry 3495 (class 0 OID 49756)
-- Dependencies: 185
-- Data for Name: alert_geom_point; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO alert_geom_point VALUES (253, '0101000020E61000001559A3D98FAD55C00930D71643752C40');


--
-- TOC entry 3496 (class 0 OID 49762)
-- Dependencies: 186
-- Data for Name: alert_geom_polygon; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--



--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 208
-- Name: alert_geoms; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('alert_geoms', 253, true);


--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 188
-- Name: alert_id_alert_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('alert_id_alert_seq', 212, true);


--
-- TOC entry 3499 (class 0 OID 49776)
-- Dependencies: 189
-- Data for Name: alert_status; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO alert_status VALUES ('R', 'Rechazado');
INSERT INTO alert_status VALUES ('I', 'Ingresado');
INSERT INTO alert_status VALUES ('S', 'En seguimiento');
INSERT INTO alert_status VALUES ('C', 'Comprobado');


--
-- TOC entry 3500 (class 0 OID 49782)
-- Dependencies: 190
-- Data for Name: alert_status_history; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--



--
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 191
-- Name: alert_status_history_id_history_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('alert_status_history_id_history_seq', 77, true);


--
-- TOC entry 3502 (class 0 OID 49790)
-- Dependencies: 192
-- Data for Name: alert_types; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO alert_types VALUES (1, 'Incendios', NULL);
INSERT INTO alert_types VALUES (2, 'Tala ilegal', '
');
INSERT INTO alert_types VALUES (3, 'Plagas forestales', NULL);
INSERT INTO alert_types VALUES (11, 'A', NULL);


--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 193
-- Name: alert_types_id_alert_type_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('alert_types_id_alert_type_seq', 11, true);


--
-- TOC entry 3497 (class 0 OID 49768)
-- Dependencies: 187
-- Data for Name: alerts; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO alerts VALUES (212, 40, NULL, '', 'I', 1, '2015-05-27 09:46:03.56', 'point', 253, 'GGff8QJ', '', '', 'El Paraiso', '7', '', '715', true, '0032-11-04', '', '');


--
-- TOC entry 3542 (class 0 OID 94429)
-- Dependencies: 233
-- Data for Name: alerts_intersections; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO alerts_intersections VALUES (3, 'MUNICIPALITIES', 55, 'cod_mun_', 'nombre', 'geom', true);
INSERT INTO alerts_intersections VALUES (2, 'DEPARTMENTS', 54, 'dep', 'depto', 'geom', true);


--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 234
-- Name: alerts_intersections_id_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('alerts_intersections_id_seq', 4, true);


--
-- TOC entry 3541 (class 0 OID 94420)
-- Dependencies: 232
-- Data for Name: alerts_settings; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO alerts_settings VALUES (2, 'ALERTS_ADDED_NOTE_MESSAGE', '');


--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 231
-- Name: alerts_settings_id_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('alerts_settings_id_seq', 2, true);


--
-- TOC entry 3534 (class 0 OID 77323)
-- Dependencies: 225
-- Data for Name: comments; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--



--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 226
-- Name: comments_p_comment_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('comments_p_comment_seq', 1, true);


--
-- TOC entry 3544 (class 0 OID 94553)
-- Dependencies: 235
-- Data for Name: departments_permissions_mapping; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO departments_permissions_mapping VALUES (1, 'ALERTS_EDIT_DEP_ATLANTIDA', '1');
INSERT INTO departments_permissions_mapping VALUES (2, 'ALERTS_EDIT_DEP_COMAYAGUA', '3');
INSERT INTO departments_permissions_mapping VALUES (3, 'ALERTS_EDIT_DEP_COPAN', '4');
INSERT INTO departments_permissions_mapping VALUES (4, 'ALERTS_EDIT_DEP_ELPARAISO', '7');
INSERT INTO departments_permissions_mapping VALUES (5, 'ALERTS_EDIT_DEP_FMORAZAN', '8');
INSERT INTO departments_permissions_mapping VALUES (6, 'ALERTS_EDIT_DEP_INTIBUCA', '10');
INSERT INTO departments_permissions_mapping VALUES (7, 'ALERTS_EDIT_DEP_LAPAZ', '12');
INSERT INTO departments_permissions_mapping VALUES (8, 'ALERTS_EDIT_DEP_LEMPIRA', '13');
INSERT INTO departments_permissions_mapping VALUES (9, 'ALERTS_EDIT_DEP_SANTABARBARA', '16');
INSERT INTO departments_permissions_mapping VALUES (10, 'ALERTS_EDIT_DEP_OLANCHO', '15');
INSERT INTO departments_permissions_mapping VALUES (11, 'ALERTS_EDIT_DEP_YORO', '18');
INSERT INTO departments_permissions_mapping VALUES (12, 'ALERTS_EDIT_DEP_ISLASBAHIA', '11');
INSERT INTO departments_permissions_mapping VALUES (13, 'ALERTS_EDIT_DEP_VALLE', '17');
INSERT INTO departments_permissions_mapping VALUES (14, 'ALERTS_EDIT_DEP_GRACIASDIOS', '9');
INSERT INTO departments_permissions_mapping VALUES (15, 'ALERTS_EDIT_DEP_CHOLUTECA', '6');
INSERT INTO departments_permissions_mapping VALUES (16, 'ALERTS_EDIT_DEP_COLON', '2');
INSERT INTO departments_permissions_mapping VALUES (17, 'ALERTS_EDIT_DEP_CORTEZ', '5');
INSERT INTO departments_permissions_mapping VALUES (18, 'ALERTS_EDIT_DEP_OCOTEPEQUE', '14');


--
-- TOC entry 3578 (class 0 OID 0)
-- Dependencies: 236
-- Name: departments_permissions_mapping_id_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('departments_permissions_mapping_id_seq', 18, true);


--
-- TOC entry 3539 (class 0 OID 77773)
-- Dependencies: 230
-- Data for Name: general_settings; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO general_settings VALUES (1, 'INITIAL_MESSAGE', 'Bienvenidos al Geoportal del Sector Forestal de 
Honduras.');
INSERT INTO general_settings VALUES (2, 'SHOW_INITIAL_MESSAGE', 'false');
INSERT INTO general_settings VALUES (3, 'INFORMATION_MESSAGE', '<p>
<b>Nota:</b>
</p>
<p>Los limites politicos-administrativos de Honduras y limites administrativos utilizados en sta mapa, fueron tomados del Sistema Nacional de Informacion Territorial (SINIT): la inclusion de los mismos se ha realizado esclusivamente para relacionarlos con los elementos cartograficos rapresentados en este mapa.
</p><p>Los resultados obtenidos de la cobertura forestal y uso de la tierra fueron determinados a partir del procesamiento y clasificacion de imagenes satellitares del sensor RapidEye de los anos 2012 y 2013.
</p>
<p>
Todos los derechos de reproduccion del presente mapa corresponden al Instituto Nacional de Conservacion y Desarrollo Forestal Areas Protegidas y Vida Silvestre, 2014.
</p>
<p>
Republica de Honduras, Centroamerica.
</p>');
INSERT INTO general_settings VALUES (4, 'SHOW_INFORMATION_MESSAGE', 'true');


--
-- TOC entry 3579 (class 0 OID 0)
-- Dependencies: 229
-- Name: general_settings_id_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('general_settings_id_seq', 4, true);


--
-- TOC entry 3580 (class 0 OID 0)
-- Dependencies: 224
-- Name: layer_config_id_layer_config_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('layer_config_id_layer_config_seq', 56, true);


--
-- TOC entry 3581 (class 0 OID 0)
-- Dependencies: 214
-- Name: layer_group_id_layer_group_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('layer_group_id_layer_group_seq', 43, true);


--
-- TOC entry 3582 (class 0 OID 0)
-- Dependencies: 216
-- Name: layer_id_layer_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('layer_id_layer_seq', 10, true);


--
-- TOC entry 3583 (class 0 OID 0)
-- Dependencies: 218
-- Name: layer_id_layer_seq1; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('layer_id_layer_seq1', 79, true);


--
-- TOC entry 3584 (class 0 OID 0)
-- Dependencies: 220
-- Name: layer_type_id_layer_type_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('layer_type_id_layer_type_seq', 4, true);


--
-- TOC entry 3530 (class 0 OID 77143)
-- Dependencies: 221
-- Data for Name: layer_types; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO layer_types VALUES (1, 'wms');
INSERT INTO layer_types VALUES (2, 'google');
INSERT INTO layer_types VALUES (3, 'osm');
INSERT INTO layer_types VALUES (4, 'bing');
INSERT INTO layer_types VALUES (5, 'mapquest');


--
-- TOC entry 3532 (class 0 OID 77189)
-- Dependencies: 223
-- Data for Name: layerconfigs; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO layerconfigs VALUES (3, '{
 	        	"format": "image/png8",
 	        	"transparent" : true
 	        }', '{
 	         	"buffer": 0,
                "displayOutsideMaxExtent": true,
                "isBaseLayer": false,
                "singleTile": false
 	        }', NULL, false, NULL, false, NULL);
INSERT INTO layerconfigs VALUES (4, '{
 	        	"format": "image/png8",
 	        	"transparent" : true
 	        }', '{
 	         	"buffer": 0,
                "displayOutsideMaxExtent": true,
                "isBaseLayer": false,
                "singleTile": false
 	        }', NULL, false, NULL, false, NULL);
INSERT INTO layerconfigs VALUES (5, '{
 	        	"format": "image/png8",
 	        	"transparent" : true
 	        }', '{
 	         	"buffer": 0,
                "displayOutsideMaxExtent": true,
                "isBaseLayer": false,
                "singleTile": false,
                "opacity" : 0.5
 	        }', NULL, false, NULL, false, NULL);
INSERT INTO layerconfigs VALUES (17, '{"format":"image/png","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0}', '', false, NULL, false, NULL);
INSERT INTO layerconfigs VALUES (38, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (28, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (18, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0}', '', false, NULL, false, NULL);
INSERT INTO layerconfigs VALUES (16, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0}', '', false, NULL, false, NULL);
INSERT INTO layerconfigs VALUES (15, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0}', '', false, NULL, false, NULL);
INSERT INTO layerconfigs VALUES (27, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (26, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (25, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (24, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (11, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0}', '', false, NULL, false, NULL);
INSERT INTO layerconfigs VALUES (23, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (14, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', '', false, NULL, false, NULL);
INSERT INTO layerconfigs VALUES (22, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (21, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (13, '{"format":"image/png","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', '', false, '', false, NULL);
INSERT INTO layerconfigs VALUES (39, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0}', '', false, '', false, NULL);
INSERT INTO layerconfigs VALUES (41, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (20, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (6, '{"format":"image/png","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', false, '', false, 'icf');
INSERT INTO layerconfigs VALUES (9, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":true,"singleTile":false,"opacity":0.5,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (53, '{"format":"image/jpeg","transparent":false}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":true,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (51, '{"format":"image/jpeg","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0}', '', false, '', false, '');
INSERT INTO layerconfigs VALUES (52, '{"format":"image/jpeg","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0}', '', false, '', false, '');
INSERT INTO layerconfigs VALUES (54, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":true,"opacity":1.0}', '', false, '', false, '');
INSERT INTO layerconfigs VALUES (43, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":true,"opacity":1.0}', '', false, '', false, '');
INSERT INTO layerconfigs VALUES (44, '{"format":"image/jpeg","transparent":false}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":true,"opacity":1.0}', '', false, '', false, '');
INSERT INTO layerconfigs VALUES (45, '{"format":"image/png","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":true,"opacity":1.0}', '', false, '', false, '');
INSERT INTO layerconfigs VALUES (46, '{"format":"image/png","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":true,"opacity":1.0}', '', false, '', false, '');
INSERT INTO layerconfigs VALUES (47, '{"format":"image/png","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":true,"opacity":1.0}', '', false, '', false, '');
INSERT INTO layerconfigs VALUES (48, '{"format":"image/png","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":true,"opacity":1.0}', '', false, '', false, '');
INSERT INTO layerconfigs VALUES (50, '{"format":"image/jpeg","transparent":false}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":true,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (34, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (30, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":0.8,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (49, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (8, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":0.0}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, NULL, false, 'icf');
INSERT INTO layerconfigs VALUES (1, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (12, '{"format":"image/png","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (42, '{"format":"image/jpeg","transparent":false}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":true,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (10, '{"format":"image/png","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":0.5,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, NULL, false, 'icf');
INSERT INTO layerconfigs VALUES (7, '{"format":"image/png","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":0.4,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (37, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (33, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (40, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (19, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', false, '', false, 'icf');
INSERT INTO layerconfigs VALUES (36, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (35, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (29, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":0.8,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (2, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, NULL, true, 'icf');
INSERT INTO layerconfigs VALUES (55, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (56, '{"format":"image/png","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (32, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');
INSERT INTO layerconfigs VALUES (31, '{"format":"image/png8","transparent":true}', '{"buffer":0,"displayOutsideMaxExtent":true,"isBaseLayer":false,"singleTile":false,"opacity":1.0,"tileSize":[512,512]}', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', true, '', false, 'icf');


--
-- TOC entry 3524 (class 0 OID 77107)
-- Dependencies: 215
-- Data for Name: layergroups; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO layergroups VALUES (2, 'background', 2, 1, true);
INSERT INTO layergroups VALUES (18, 'Cartografia', 2, 3, false);
INSERT INTO layergroups VALUES (32, 'otra prueba', 2, 2, false);
INSERT INTO layergroups VALUES (3, 'Recursos Naturales', 2, 5, false);
INSERT INTO layergroups VALUES (23, 'prueba', 2, 4, false);
INSERT INTO layergroups VALUES (36, 'Planes de manejo forestal', 8, 3, false);
INSERT INTO layergroups VALUES (38, 'Microcuencas', 8, 4, false);
INSERT INTO layergroups VALUES (43, 'Fisio', 8, 9, false);
INSERT INTO layergroups VALUES (41, 'Infraestructura', 8, 7, false);
INSERT INTO layergroups VALUES (34, 'Capas de fondo', 8, 1, true);
INSERT INTO layergroups VALUES (37, 'Áreas protegidas', 8, 2, false);
INSERT INTO layergroups VALUES (39, 'Áreas tituladas a favor del Estado', 8, 5, false);
INSERT INTO layergroups VALUES (40, 'Áreas asignadas', 8, 6, false);
INSERT INTO layergroups VALUES (42, 'Cartografía', 8, 8, false);


--
-- TOC entry 3531 (class 0 OID 77167)
-- Dependencies: 222
-- Data for Name: layergroups_layers; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO layergroups_layers VALUES (37, 69, false, 1);
INSERT INTO layergroups_layers VALUES (34, 12, false, 4);
INSERT INTO layergroups_layers VALUES (34, 11, false, 5);
INSERT INTO layergroups_layers VALUES (34, 13, false, 6);
INSERT INTO layergroups_layers VALUES (34, 29, false, 7);
INSERT INTO layergroups_layers VALUES (36, 48, false, 9);
INSERT INTO layergroups_layers VALUES (36, 75, false, 10);
INSERT INTO layergroups_layers VALUES (36, 76, false, 11);
INSERT INTO layergroups_layers VALUES (34, 79, false, 8);
INSERT INTO layergroups_layers VALUES (36, 40, false, 1);
INSERT INTO layergroups_layers VALUES (36, 41, false, 2);
INSERT INTO layergroups_layers VALUES (36, 42, false, 3);
INSERT INTO layergroups_layers VALUES (36, 43, false, 4);
INSERT INTO layergroups_layers VALUES (36, 44, false, 5);
INSERT INTO layergroups_layers VALUES (36, 45, false, 6);
INSERT INTO layergroups_layers VALUES (36, 46, false, 7);
INSERT INTO layergroups_layers VALUES (36, 47, false, 8);
INSERT INTO layergroups_layers VALUES (38, 49, false, 1);
INSERT INTO layergroups_layers VALUES (39, 50, false, 1);
INSERT INTO layergroups_layers VALUES (40, 51, false, 1);
INSERT INTO layergroups_layers VALUES (41, 52, false, 1);
INSERT INTO layergroups_layers VALUES (43, 53, false, 1);
INSERT INTO layergroups_layers VALUES (43, 58, false, 2);
INSERT INTO layergroups_layers VALUES (43, 59, false, 3);
INSERT INTO layergroups_layers VALUES (43, 60, false, 4);
INSERT INTO layergroups_layers VALUES (34, 62, false, 3);
INSERT INTO layergroups_layers VALUES (34, 70, false, 2);
INSERT INTO layergroups_layers VALUES (34, 73, false, 1);
INSERT INTO layergroups_layers VALUES (2, 11, false, 1);
INSERT INTO layergroups_layers VALUES (42, 57, false, 4);
INSERT INTO layergroups_layers VALUES (42, 56, false, 3);
INSERT INTO layergroups_layers VALUES (42, 55, false, 2);
INSERT INTO layergroups_layers VALUES (42, 54, false, 1);


--
-- TOC entry 3528 (class 0 OID 77134)
-- Dependencies: 219
-- Data for Name: layers; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO layers VALUES (56, 'm1105vp001988_hn', 'Asentamientos humanos', 'Asentamientos humanos', 8, 'single', 1, 36, false, 'caserio', false, 'SINIT', true, true, '', NULL, 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', NULL, false, true);
INSERT INTO layers VALUES (49, 'microcuencas_declaradas', 'Microcuencas declaradas legalmente', 'La capa contiene datos sobre las Microcuencas declaradas legalmente.', 8, 'single', 1, 29, false, 'nom_micro_', false, 'ICF', false, true, NULL, '7a3f5d42-e15f-4495-b6ff-6086991646a1', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', NULL, true, true);
INSERT INTO layers VALUES (55, 'm1103va002001_hn', 'Limites Municipios', 'Limites Municipios', 8, 'single', 1, 35, false, 'nombre', false, 'SINIT', true, false, '', '7923190a-cd04-4fc4-8b67-a17af952c6e0', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', NULL, false, true);
INSERT INTO layers VALUES (54, 'm1102va001970_hn', 'Limites departamentales', 'Limites departamentales', 8, 'single', 1, 34, false, '', true, 'SINIT', true, false, '', '4a76139b-e195-464e-9851-c1ffe6c856c3', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', true, true);
INSERT INTO layers VALUES (51, 'areas_asignadas_contratos_de_manejo_forestal', 'Áreas asignadas mediante contratos de manejo forestal comunitario', 'Áreas asignadas mediante contratos de manejo forestal comunitario', 8, 'single', 1, 31, false, 'n_sitio', false, 'ICF', false, false, '', '1ce6146d-f8bf-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (50, 'areas_tituladas_a_favor_de_estado', 'Áreas nacionales tituladas a favor del Estado', 'Áreas nacionales tituladas a favor del Estado', 8, 'single', 1, 30, false, 'nombre', false, 'ICF', false, false, '', '4b2702ec-f8be-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (48, 'pm_yoro', 'Planes de manejo forestal - Yoro', 'Planes de manejo forestal - Yoro', 8, 'single', 1, 28, false, 'nombre_pm', false, 'ICF', false, false, '', '54c9e329-f8ba-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (47, 'pm_occidente', 'Planes de manejo forestal - Occidente', 'Planes de manejo forestal - Occidente', 8, 'single', 1, 27, false, 'nombre_pm', false, 'ICF', false, false, '', 'f2abc8c8-f8b9-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (46, 'pm_noroccidente', 'Planes de manejo forestal - Nord occidente', 'Planes de manejo forestal - Nord occidente', 8, 'single', 1, 26, false, 'nombre_pm', false, 'ICF', false, false, '', 'ad714fa7-f8b9-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (45, 'pm_mosquitia', 'Planes de manejo forestal - Mosquitia', 'Planes de manejo forestal - Mosquitia', 8, 'single', 1, 25, false, 'nombre_pm', false, 'ICF', false, false, '', '5249bd66-f8b9-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (44, 'pm_fcomorazan', 'Planes de manejo forestal - Francisco Morazan', 'Planes de manejo forestal - Francisco Morazan', 8, 'single', 1, 24, false, 'nombre_pm', false, 'ICF', false, false, '', 'c5c747e5-f8b8-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (43, 'pm_el_paraiso', 'Planes de manejo forestal - El paraiso', 'Planes de manejo forestal - El paraiso', 8, 'single', 1, 23, false, 'nombre_pm', false, 'ICF', false, false, '', '9b51f244-f8b7-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (42, 'pm_comayagua', 'Planes de manejo forestal - Comayagua', 'Planes de manejo forestal - Comayagua', 8, 'single', 1, 22, false, 'nombre_pm', false, 'ICF', false, false, '', '7eff313b-f8b5-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (41, 'pm_biosfera', 'Planes de manejo forestal - Biosfera', 'Planes de manejo forestal - Biosfera', 8, 'single', 1, 21, false, 'nombre_pm', false, 'ICF', false, false, '', '0ef2003a-f8b4-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (11, 'ROADMAP', 'Google ROADMAP', 'Google ROADMAP desc', NULL, 'single', 2, NULL, true, NULL, false, NULL, false, false, NULL, NULL, NULL, NULL, false, false);
INSERT INTO layers VALUES (12, 'SATELLITE', 'Google SATELLITE', 'Google SATELLITE desc', NULL, 'single', 2, NULL, true, NULL, false, NULL, false, false, NULL, NULL, NULL, NULL, false, false);
INSERT INTO layers VALUES (13, 'HYBRID', 'Google HYBRID', 'Google HYBRID desc', NULL, 'single', 2, NULL, true, NULL, false, NULL, false, false, NULL, NULL, NULL, NULL, false, false);
INSERT INTO layers VALUES (14, 'TERRAIN', 'Google TERRAIN', 'Google TERRAIN desc', NULL, 'single', 2, NULL, true, NULL, false, NULL, false, false, NULL, NULL, NULL, NULL, false, false);
INSERT INTO layers VALUES (15, 'AERIAL', 'Bing AERIAL', 'Bing AERIAL desc', NULL, 'single', 4, NULL, true, NULL, false, NULL, false, false, NULL, NULL, NULL, NULL, false, false);
INSERT INTO layers VALUES (16, 'ROAD', 'Bing ROAD', 'Bing ROAD desc', NULL, 'single', 4, NULL, true, NULL, false, NULL, false, false, NULL, NULL, NULL, NULL, false, false);
INSERT INTO layers VALUES (17, 'HYBRID', 'Bing HYBRID', 'Bing HYBRID desc', NULL, 'single', 4, NULL, true, NULL, false, NULL, false, false, NULL, NULL, NULL, NULL, false, false);
INSERT INTO layers VALUES (29, 'OSM', 'OSM', 'OSM', NULL, 'single', 3, NULL, true, NULL, false, NULL, false, false, NULL, NULL, NULL, NULL, false, false);
INSERT INTO layers VALUES (79, 'OSM', 'MAPQUEST OSM', 'MAPQUEST OSM', NULL, 'single', 5, NULL, true, NULL, false, NULL, false, false, NULL, NULL, NULL, NULL, false, false);
INSERT INTO layers VALUES (70, 'icf_fondo_dem', 'DEM', 'DEM', 8, 'single', 1, 50, true, '', false, 'ICF', false, false, '', '', '', 'http://geoportal-mosef.gesp.it/geoserver/icf/wcs', false, false);
INSERT INTO layers VALUES (61, 'n2202va001973_hn', 'Tipo de suelos (Simmons)', 'Tipo de suelos (Simmons)', 8, 'single', 1, 41, false, 'nombre_sue', false, 'SINIT', true, false, '', '', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (58, 'n2303vl000000_hn', 'Hidrogeología', 'Hidrogeología', 8, 'single', 1, 38, false, '', false, 'SINIT', true, false, '', '', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (52, 'm3101vl001970_hn', 'Red Vial - escala 1:50000', 'Red Vial - escala 1:50000', 8, 'single', 1, 32, false, '', false, 'SINIT', true, false, '', '', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (53, 'm2301vl001970_hn', 'Red Hídrica - escala 1:50000', 'Red Hídrica - escala 1:50000', 8, 'single', 1, 33, false, '', false, 'SINIT', true, false, NULL, NULL, 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', NULL, false, true);
INSERT INTO layers VALUES (59, 'n2503va000000_hn', 'Zonas de Vida', 'Zonas de Vida', 8, 'single', 1, 39, false, '', false, 'SINIT', true, false, NULL, NULL, 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', NULL, false, true);
INSERT INTO layers VALUES (40, 'pm_atlantida', 'Planes de manejo forestal - Atlántida', 'Planes de manejo forestal - Atlántida', 8, 'single', 1, 20, false, 'nombre_pm', false, 'ICF', false, false, '', '5751c019-f8b2-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (57, 'r1201vl001970_hn', 'Curvas de nivel (100m)', 'Curvas de nivel (100m)', 8, 'single', 1, 37, false, '', false, 'SINIT', true, false, NULL, NULL, 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', NULL, false, true);
INSERT INTO layers VALUES (60, 'n2502va002001_hn', 'Ecosistemas vegetales', 'Ecosistemas vegetales', 8, 'single', 1, 40, false, 'ecosistema', false, 'SINIT', true, false, '', '', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', NULL, true, true);
INSERT INTO layers VALUES (69, 'areas_protegidas', 'Areas Protegidas', 'Areas Protegidas de Honduras', 8, 'single', 1, 49, false, 'nombre2', false, 'ICF', false, true, '', '104cf197-f88e-11e4-a3e1-fc15b4ed182a', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', NULL, true, true);
INSERT INTO layers VALUES (62, 'honduras_base_layer', 'Limites Administrativos', 'Limites Administrativos', 8, 'single', 1, 42, true, '', false, 'SINIT', false, false, '', '', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', NULL, false, false);
INSERT INTO layers VALUES (73, 'icf_fondo_forestal', 'Mapa Forestal', 'Mapa Forestal ICF', 8, 'single', 1, 53, true, '', false, 'ICF', false, false, '', '', '', '', false, true);
INSERT INTO layers VALUES (75, 'pm_olancho', 'Planes de manejo forestal - Olancho', 'Planes de manejo forestal - Olancho', 8, 'single', 1, 55, false, 'nombre_pm', false, 'ICF', false, false, '', '968ae59b-f8bd-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);
INSERT INTO layers VALUES (76, 'pm_pacifico', 'Planes de manejo forestal - Pacifico', 'Planes de manejo forestal - Pacifico', 8, 'single', 1, 56, false, 'nombre_pm', false, 'ICF', false, false, '', '6627458a-f8bb-11e4-a3e1-ac7ba15eb5eb', 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs', '', false, true);


--
-- TOC entry 3526 (class 0 OID 77123)
-- Dependencies: 217
-- Data for Name: layersources; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO layersources VALUES (8, 'http://geoportal-mosef.gesp.it/geoserver/icf/wms', 'WMS Geoserver ICF', 'WMS Geoserver ICF', 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms', false);
INSERT INTO layersources VALUES (10, 'http://geoespacial.sinap.hn:8080/geoserver/wms', 'WMS Path 2', 'Nuevo servidor WMS del PATH', '', true);


--
-- TOC entry 3504 (class 0 OID 49806)
-- Dependencies: 194
-- Data for Name: logs; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--



--
-- TOC entry 3585 (class 0 OID 0)
-- Dependencies: 195
-- Name: logs_id_log_seq1; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('logs_id_log_seq1', 1474, true);


--
-- TOC entry 3586 (class 0 OID 0)
-- Dependencies: 213
-- Name: map_id_map_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('map_id_map_seq', 8, true);


--
-- TOC entry 3521 (class 0 OID 77091)
-- Dependencies: 212
-- Data for Name: maps; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO maps VALUES (2, 'mosef_map', 'EPSG:900913', 'm', '[-20037508.34, -20037508.34,20037508.34, 20037508.34]', '[-9663959.000000, 1672805.000000]', 8, -9663959, 1672805, true, '[1000,2000,5000,10000,25000,50000,100000,150000,200000,250000,500000,1000000,2000000,3000000,4000000]', 90.714285714285722, '[0.27999999999999997,0.5599999999999999,1.4,2.8,6.999999999999999,13.999999999999998,27.999999999999996,41.99999999999999,55.99999999999999,70.0,140.0,280.0,560.0,839.9999999999999,1120.0]', 'none', NULL, -9973337, 1439825, -9254827, 1894167);
INSERT INTO maps VALUES (8, 'icf_map', 'EPSG:900913', 'm', '[-20037508.34, -20037508.34,20037508.34, 20037508.34]', '[-9663959.000000, 1672805.000000]', 4, -9663959, 1672805, true, '[1000,2000,5000,10000,25000,50000,100000,150000,200000,250000,500000,1000000,2000000,3000000,4000000]', 90.714285714285694, '[0.2985821416974068,0.5971642833948135,1.194328566789627,2.388657133579254,4.777314267158508,9.554628534317017,19.109257068634033,38.218514137268066,76.43702827453613,152.87405654907226,305.74811309814453,611.4962261962891,1222.9924523925781,2445.9849047851562,4891.9698095703125,9783.939619140625]', 'resolutions', 1066.3647917764531, 9973337, 1439825, -9254827, 1894167);


--
-- TOC entry 3587 (class 0 OID 0)
-- Dependencies: 209
-- Name: modules_id_module_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('modules_id_module_seq', 18, false);


--
-- TOC entry 3506 (class 0 OID 49814)
-- Dependencies: 196
-- Data for Name: permissions; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO permissions VALUES (17, 'USER_SELF_CHANGE_PASSWORD', 'USER_SELF_CHANGE_PASSWORD', 'Allows the user to change his password.', 'Permite al usuario modificar su contraseña.');
INSERT INTO permissions VALUES (18, 'USER_CHANGE_PASSWORD', 'USER_CHANGE_PASSWORD', 'Allows the user to change other users'' passwords.', 'Permite al usuario modificar la contraseña de otros usuarios.');
INSERT INTO permissions VALUES (15, 'ROLE_ADMINISTRATION', 'ROLE_ADMINISTRATION_DESC', 'Allows the user to access the "Role administration" page of the administration panel.', 'Permite al usuario acceder a la pagina de "Configuración de roles".');
INSERT INTO permissions VALUES (16, 'USER_ADMINISTRATION', 'USER_ADMINISTRATION', 'Allows the user to access the "User administration" page of the administration panel.', 'Permite al usuario acceder a la pagina de "Configuración de usuarios".');
INSERT INTO permissions VALUES (32, 'ALERTS_WS_MUNI_SIT', 'ALERTS_WS_MUNI_SIT', 'Allows the user to invoke the Municipal SIT Service', 'Permite al usuario llamar al servicio de Reportes de Incidencias del SIT Municipal.');
INSERT INTO permissions VALUES (8, 'ALERTS_READ', 'ALERTS_READ', 'Allows the user to see the alerts (both the alphanumeric and the geometry components).', 'Permite al usuario ver los Reportes De incidencias (componente alfanumerica y geometria).');
INSERT INTO permissions VALUES (11, 'COMMENTS_READ', 'COMMENTS_READ', 'Allow to read the comments associated to the map.', 'Permite al usuario leer sus comentarios guardados en el sistema.');
INSERT INTO permissions VALUES (10, 'REDLINE_INSERT', 'REDLINE_INSERT', 'Allows the user to save his redlines in the system.', 'Permite al usuario guardar sus dibujos en el sistema.');
INSERT INTO permissions VALUES (12, 'COMMENTS_INSERT', 'COMMENTS_INSERT', 'Allow to add, modify or remove a comment associated to the map.', 'Permite insertar, modificar y remover los comentarios guardados en el sistema.');
INSERT INTO permissions VALUES (43, 'ALERTS_EDIT_DEP_YORO', 'ALERTS_EDIT_DEP_YORO', 'Allows the user to edit the Alerts located in the Yoro Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Yoro');
INSERT INTO permissions VALUES (22, 'SHOW_LOGS_ADMINISTRATION', 'SHOW_LOGS_ADMINISTRATION', 'Allows the user to access the "Logs" page of the administration panel.', 'Permite al usuario acceder a la pagina de "Logs" en el panel de administracion.');
INSERT INTO permissions VALUES (23, 'TEST_REQUESTS_ADMINISTRATION', 'TEST_REQUESTS_ADMINISTRATION', 'Allows the user to access the "Test requests" page of the administration panel.', 'Permite al usuario acceder a la pagina de "Pruebas de llamadas" en el panel de administracion.');
INSERT INTO permissions VALUES (29, 'MAP_SETTING_CONFIG_ADMINISTRATION', 'MAP_SETTING_CONFIG_ADMINISTRATION', 'Allows the user to access the "Map settings" page of the administration panel.', 'Permite al usuario acceder a la pagina de "Parametros del mapa" en el panel de administracion.');
INSERT INTO permissions VALUES (24, 'ACCESS_ADMINISTRATION_PANEL', 'ACCESS_ADMINISTRATION_PANEL', 'Allows the user to access the Administration panel.', 'Permite al usuario acceder al panel de administracion del geoportal.');
INSERT INTO permissions VALUES (19, 'MAP_CONFIG_ADMINISTRATION', 'MAP_CONFIG_ADMINISTRATION', 'Allows the user to access the "Map configuration" page of the administration panel.', 'Permite al usuario acceder a la pagina de "Configuración del mapa".');
INSERT INTO permissions VALUES (21, 'SOURCE_CONFIG_ADMINISTRATION', 'SOURCE_CONFIG_ADMINISTRATION', 'Allows the user to access the "WMS Sources configuration" page of the administration panel.', 'Permite al usuario acceder a la pagina de "Configuración de Fuentes WMS".');
INSERT INTO permissions VALUES (20, 'LAYER_CONFIG_ADMINISTRATION', 'LAYER_CONFIG_ADMINISTRATION', 'Allows the user to access the "Layer configuration" page of the administration panel.', 'Permite al usuario acceder a la pagina de "Configuración de capas".');
INSERT INTO permissions VALUES (26, 'SYSTEM_CONFIG_ADMINISTRATION', 'SYSTEM_CONFIG_ADMINISTRATION', 'Allows the user to access the "System configuration" page of the administration panel.', 'Permite al usuario acceder a la pagina de "Configuración del sistema" en el panel de administracion.');
INSERT INTO permissions VALUES (27, 'GENERAL_CONFIG_ADMINISTRATION', 'GENERAL_CONFIG_ADMINISTRATION', 'Allows the user to access the "General configuration" page of the administration panel.', 'Permite al usuario acceder a la pagina de "Configuración general" en el panel de administracion.');
INSERT INTO permissions VALUES (30, 'ALERTS_CHANGE_STATUS', 'ALERTS_CHANGE_STATUS', 'Allows the user to change the status of an alert.', 'Permite al usuario modificar el estado de un Reporte de Incidencia.');
INSERT INTO permissions VALUES (33, 'ALERTS_EDIT_DEP_ATLANTIDA', 'ALERTS_EDIT_DEP_ATLANTIDA', 'Allows the user to edit the Alerts located in the Atlantida Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Atlantida');
INSERT INTO permissions VALUES (34, 'ALERTS_EDIT_DEP_COMAYAGUA', 'ALERTS_EDIT_DEP_COMAYAGUA', 'Allows the user to edit the Alerts located in the Comayagua Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Comayagua');
INSERT INTO permissions VALUES (35, 'ALERTS_EDIT_DEP_COPAN', 'ALERTS_EDIT_DEP_COPAN', 'Allows the user to edit the Alerts located in the Copan Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Copan');
INSERT INTO permissions VALUES (36, 'ALERTS_EDIT_DEP_ELPARAISO', 'ALERTS_EDIT_DEP_ELPARAISO', 'Allows the user to edit the Alerts located in the El Paraiso Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de El Paraiso');
INSERT INTO permissions VALUES (37, 'ALERTS_EDIT_DEP_FMORAZAN', 'ALERTS_EDIT_DEP_FMORAZAN', 'Allows the user to edit the Alerts located in the Francisco Morazan Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Francisco Morazan');
INSERT INTO permissions VALUES (38, 'ALERTS_EDIT_DEP_INTIBUCA', 'ALERTS_EDIT_DEP_INTIBUCA', 'Allows the user to edit the Alerts located in the Intibuca Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Intibuca');
INSERT INTO permissions VALUES (39, 'ALERTS_EDIT_DEP_LAPAZ', 'ALERTS_EDIT_DEP_LAPAZ', 'Allows the user to edit the Alerts located in the La Paz Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de La Paz');
INSERT INTO permissions VALUES (40, 'ALERTS_EDIT_DEP_LEMPIRA', 'ALERTS_EDIT_DEP_LEMPIRA', 'Allows the user to edit the Alerts located in the Lempira Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Lempira');
INSERT INTO permissions VALUES (41, 'ALERTS_EDIT_DEP_SANTABARBARA', 'ALERTS_EDIT_DEP_SANTABARBARA', 'Allows the user to edit the Alerts located in the Santa Barbara Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Santa Barbara');
INSERT INTO permissions VALUES (42, 'ALERTS_EDIT_DEP_OLANCHO', 'ALERTS_EDIT_DEP_OLANCHO', 'Allows the user to edit the Alerts located in the Olancho Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Olancho');
INSERT INTO permissions VALUES (44, 'ALERTS_EDIT_DEP_ISLASBAHIA', 'ALERTS_EDIT_DEP_ISLASBAHIA', 'Allows the user to edit the Alerts located in the Islas de la Bahia Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Islas de la Bahia');
INSERT INTO permissions VALUES (45, 'ALERTS_EDIT_DEP_VALLE', 'ALERTS_EDIT_DEP_VALLE', 'Allows the user to edit the Alerts located in the Valle Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Valle');
INSERT INTO permissions VALUES (46, 'ALERTS_EDIT_DEP_GRACIASDIOS', 'ALERTS_EDIT_DEP_GRACIASDIOS', 'Allows the user to edit the Alerts located in the Gracias a Dios Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Gracias a Dios');
INSERT INTO permissions VALUES (47, 'ALERTS_EDIT_DEP_CHOLUTECA', 'ALERTS_EDIT_DEP_CHOLUTECA', 'Allows the user to edit the Alerts located in the Choluteca Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Choluteca');
INSERT INTO permissions VALUES (48, 'ALERTS_EDIT_DEP_COLON', 'ALERTS_EDIT_DEP_COLON', 'Allows the user to edit the Alerts located in the Colon Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Colon');
INSERT INTO permissions VALUES (28, 'ALERTS_CONFIG_ADMINISTRATION', 'ALERTS_CONFIG_ADMINISTRATION', 'Allows the user to access the "Alerts configuration" page of the administration panel.', 'Permite al usuario acceder a la pagina de "Configuración de los Reportes de Incidencia" en el panel de administracion.');
INSERT INTO permissions VALUES (49, 'ALERTS_EDIT_DEP_CORTEZ', 'ALERTS_EDIT_DEP_CORTEZ', 'Allows the user to edit the Alerts located in the Cortez Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Cortez');
INSERT INTO permissions VALUES (50, 'ALERTS_EDIT_DEP_OCOTEPEQUE', 'ALERTS_EDIT_DEP_OCOTEPEQUE', 'Allows the user to edit the Alerts located in the Ocotepeque Department', 'Permite al usuatio editar los Reportes de Incidencias ubicadas en el departamento de Ocotepeque');
INSERT INTO permissions VALUES (25, 'ALERTS_DOWNLOAD', 'ALERTS_DOWNLOAD', 'Allows the user to download the Zip file of the alerts.', 'Permite al usuario descargar un archivo ZIP de los Reportes de Incidencia.');
INSERT INTO permissions VALUES (31, 'ALERTS_UPDATE', 'ALERTS_UPDATE', 'Allows the user to modify the information of an alert. It does not allow to change its status.', 'Permite al usuario modificar las informaciones de un Reporte de Incidencia. No permite modificar su estado.');


--
-- TOC entry 3507 (class 0 OID 49818)
-- Dependencies: 197
-- Data for Name: redlining_line; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--



--
-- TOC entry 3588 (class 0 OID 0)
-- Dependencies: 198
-- Name: redlining_line_id_redlining_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('redlining_line_id_redlining_seq', 40, true);


--
-- TOC entry 3509 (class 0 OID 49826)
-- Dependencies: 199
-- Data for Name: redlining_point; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--



--
-- TOC entry 3589 (class 0 OID 0)
-- Dependencies: 200
-- Name: redlining_point_id_redlining_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('redlining_point_id_redlining_seq', 190, true);


--
-- TOC entry 3511 (class 0 OID 49834)
-- Dependencies: 201
-- Data for Name: redlining_polygon; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--



--
-- TOC entry 3590 (class 0 OID 0)
-- Dependencies: 202
-- Name: redlining_polygon_id_redlining_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('redlining_polygon_id_redlining_seq', 19, true);


--
-- TOC entry 3591 (class 0 OID 0)
-- Dependencies: 210
-- Name: redlining_redlining_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('redlining_redlining_seq', 273, false);


--
-- TOC entry 3513 (class 0 OID 49842)
-- Dependencies: 203
-- Data for Name: role_permission; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO role_permission VALUES (1, 8);
INSERT INTO role_permission VALUES (1, 10);
INSERT INTO role_permission VALUES (1, 11);
INSERT INTO role_permission VALUES (1, 12);
INSERT INTO role_permission VALUES (1, 15);
INSERT INTO role_permission VALUES (1, 16);
INSERT INTO role_permission VALUES (1, 17);
INSERT INTO role_permission VALUES (1, 18);
INSERT INTO role_permission VALUES (1, 27);
INSERT INTO role_permission VALUES (1, 28);
INSERT INTO role_permission VALUES (1, 29);
INSERT INTO role_permission VALUES (1, 30);
INSERT INTO role_permission VALUES (1, 31);
INSERT INTO role_permission VALUES (1, 19);
INSERT INTO role_permission VALUES (1, 22);
INSERT INTO role_permission VALUES (1, 23);
INSERT INTO role_permission VALUES (1, 20);
INSERT INTO role_permission VALUES (1, 21);
INSERT INTO role_permission VALUES (2, 8);
INSERT INTO role_permission VALUES (1, 24);
INSERT INTO role_permission VALUES (2, 23);
INSERT INTO role_permission VALUES (2, 12);
INSERT INTO role_permission VALUES (2, 18);
INSERT INTO role_permission VALUES (1, 25);
INSERT INTO role_permission VALUES (1, 26);
INSERT INTO role_permission VALUES (1, 32);
INSERT INTO role_permission VALUES (1, 33);
INSERT INTO role_permission VALUES (13, 32);
INSERT INTO role_permission VALUES (21, 25);
INSERT INTO role_permission VALUES (21, 8);
INSERT INTO role_permission VALUES (21, 47);
INSERT INTO role_permission VALUES (21, 31);
INSERT INTO role_permission VALUES (22, 25);
INSERT INTO role_permission VALUES (22, 31);
INSERT INTO role_permission VALUES (22, 33);
INSERT INTO role_permission VALUES (22, 8);
INSERT INTO role_permission VALUES (23, 25);
INSERT INTO role_permission VALUES (23, 8);
INSERT INTO role_permission VALUES (23, 48);
INSERT INTO role_permission VALUES (23, 31);
INSERT INTO role_permission VALUES (24, 25);
INSERT INTO role_permission VALUES (24, 31);
INSERT INTO role_permission VALUES (24, 34);
INSERT INTO role_permission VALUES (24, 8);
INSERT INTO role_permission VALUES (25, 35);
INSERT INTO role_permission VALUES (25, 25);
INSERT INTO role_permission VALUES (25, 31);
INSERT INTO role_permission VALUES (25, 8);
INSERT INTO role_permission VALUES (26, 49);
INSERT INTO role_permission VALUES (26, 25);
INSERT INTO role_permission VALUES (26, 31);
INSERT INTO role_permission VALUES (26, 8);
INSERT INTO role_permission VALUES (27, 25);
INSERT INTO role_permission VALUES (27, 36);
INSERT INTO role_permission VALUES (27, 31);
INSERT INTO role_permission VALUES (27, 8);
INSERT INTO role_permission VALUES (28, 25);
INSERT INTO role_permission VALUES (28, 31);
INSERT INTO role_permission VALUES (28, 8);
INSERT INTO role_permission VALUES (28, 37);
INSERT INTO role_permission VALUES (29, 46);
INSERT INTO role_permission VALUES (29, 25);
INSERT INTO role_permission VALUES (29, 8);
INSERT INTO role_permission VALUES (29, 31);
INSERT INTO role_permission VALUES (30, 8);
INSERT INTO role_permission VALUES (30, 31);
INSERT INTO role_permission VALUES (30, 25);
INSERT INTO role_permission VALUES (30, 38);
INSERT INTO role_permission VALUES (31, 31);
INSERT INTO role_permission VALUES (31, 25);
INSERT INTO role_permission VALUES (31, 8);
INSERT INTO role_permission VALUES (31, 44);
INSERT INTO role_permission VALUES (32, 39);
INSERT INTO role_permission VALUES (32, 31);
INSERT INTO role_permission VALUES (32, 25);
INSERT INTO role_permission VALUES (32, 8);
INSERT INTO role_permission VALUES (33, 40);
INSERT INTO role_permission VALUES (33, 25);
INSERT INTO role_permission VALUES (33, 8);
INSERT INTO role_permission VALUES (33, 31);
INSERT INTO role_permission VALUES (34, 50);
INSERT INTO role_permission VALUES (34, 31);
INSERT INTO role_permission VALUES (34, 8);
INSERT INTO role_permission VALUES (34, 25);
INSERT INTO role_permission VALUES (35, 31);
INSERT INTO role_permission VALUES (35, 25);
INSERT INTO role_permission VALUES (35, 8);
INSERT INTO role_permission VALUES (35, 42);
INSERT INTO role_permission VALUES (36, 25);
INSERT INTO role_permission VALUES (36, 41);
INSERT INTO role_permission VALUES (36, 8);
INSERT INTO role_permission VALUES (36, 31);
INSERT INTO role_permission VALUES (37, 45);
INSERT INTO role_permission VALUES (37, 8);
INSERT INTO role_permission VALUES (37, 25);
INSERT INTO role_permission VALUES (37, 31);
INSERT INTO role_permission VALUES (38, 25);
INSERT INTO role_permission VALUES (38, 8);
INSERT INTO role_permission VALUES (38, 43);
INSERT INTO role_permission VALUES (38, 31);
INSERT INTO role_permission VALUES (1, 42);
INSERT INTO role_permission VALUES (1, 45);
INSERT INTO role_permission VALUES (1, 40);
INSERT INTO role_permission VALUES (1, 35);
INSERT INTO role_permission VALUES (1, 36);
INSERT INTO role_permission VALUES (1, 50);
INSERT INTO role_permission VALUES (1, 39);
INSERT INTO role_permission VALUES (1, 46);
INSERT INTO role_permission VALUES (1, 34);
INSERT INTO role_permission VALUES (1, 44);
INSERT INTO role_permission VALUES (1, 38);
INSERT INTO role_permission VALUES (1, 49);
INSERT INTO role_permission VALUES (1, 48);
INSERT INTO role_permission VALUES (1, 41);
INSERT INTO role_permission VALUES (1, 37);
INSERT INTO role_permission VALUES (1, 43);
INSERT INTO role_permission VALUES (1, 47);
INSERT INTO role_permission VALUES (22, 30);
INSERT INTO role_permission VALUES (23, 30);
INSERT INTO role_permission VALUES (24, 30);
INSERT INTO role_permission VALUES (25, 30);
INSERT INTO role_permission VALUES (26, 30);
INSERT INTO role_permission VALUES (21, 30);
INSERT INTO role_permission VALUES (27, 30);
INSERT INTO role_permission VALUES (28, 30);
INSERT INTO role_permission VALUES (29, 30);
INSERT INTO role_permission VALUES (30, 30);
INSERT INTO role_permission VALUES (31, 30);
INSERT INTO role_permission VALUES (32, 30);
INSERT INTO role_permission VALUES (33, 30);
INSERT INTO role_permission VALUES (34, 30);
INSERT INTO role_permission VALUES (35, 30);
INSERT INTO role_permission VALUES (36, 30);
INSERT INTO role_permission VALUES (37, 30);
INSERT INTO role_permission VALUES (38, 30);
INSERT INTO role_permission VALUES (22, 11);
INSERT INTO role_permission VALUES (22, 10);
INSERT INTO role_permission VALUES (22, 12);
INSERT INTO role_permission VALUES (23, 12);
INSERT INTO role_permission VALUES (23, 10);
INSERT INTO role_permission VALUES (23, 11);
INSERT INTO role_permission VALUES (24, 10);
INSERT INTO role_permission VALUES (24, 12);
INSERT INTO role_permission VALUES (24, 11);
INSERT INTO role_permission VALUES (25, 11);
INSERT INTO role_permission VALUES (25, 12);
INSERT INTO role_permission VALUES (25, 10);
INSERT INTO role_permission VALUES (26, 12);
INSERT INTO role_permission VALUES (26, 11);
INSERT INTO role_permission VALUES (26, 10);
INSERT INTO role_permission VALUES (21, 10);
INSERT INTO role_permission VALUES (21, 12);
INSERT INTO role_permission VALUES (21, 11);
INSERT INTO role_permission VALUES (27, 11);
INSERT INTO role_permission VALUES (27, 12);
INSERT INTO role_permission VALUES (27, 10);
INSERT INTO role_permission VALUES (28, 12);
INSERT INTO role_permission VALUES (28, 10);
INSERT INTO role_permission VALUES (28, 11);
INSERT INTO role_permission VALUES (29, 11);
INSERT INTO role_permission VALUES (29, 10);
INSERT INTO role_permission VALUES (29, 12);
INSERT INTO role_permission VALUES (30, 11);
INSERT INTO role_permission VALUES (30, 12);
INSERT INTO role_permission VALUES (30, 10);
INSERT INTO role_permission VALUES (31, 12);
INSERT INTO role_permission VALUES (31, 10);
INSERT INTO role_permission VALUES (31, 11);
INSERT INTO role_permission VALUES (32, 10);
INSERT INTO role_permission VALUES (32, 12);
INSERT INTO role_permission VALUES (32, 11);
INSERT INTO role_permission VALUES (33, 10);
INSERT INTO role_permission VALUES (33, 11);
INSERT INTO role_permission VALUES (33, 12);
INSERT INTO role_permission VALUES (34, 11);
INSERT INTO role_permission VALUES (34, 12);
INSERT INTO role_permission VALUES (34, 10);
INSERT INTO role_permission VALUES (35, 12);
INSERT INTO role_permission VALUES (35, 11);
INSERT INTO role_permission VALUES (35, 10);
INSERT INTO role_permission VALUES (36, 11);
INSERT INTO role_permission VALUES (36, 10);
INSERT INTO role_permission VALUES (36, 12);
INSERT INTO role_permission VALUES (37, 12);
INSERT INTO role_permission VALUES (37, 10);
INSERT INTO role_permission VALUES (37, 11);
INSERT INTO role_permission VALUES (38, 12);
INSERT INTO role_permission VALUES (38, 11);
INSERT INTO role_permission VALUES (38, 10);
INSERT INTO role_permission VALUES (40, 10);


--
-- TOC entry 3514 (class 0 OID 49845)
-- Dependencies: 204
-- Data for Name: roles; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO roles VALUES (2, 'normal user', 'desc normal');
INSERT INTO roles VALUES (13, 'Rol SIT Municipal', 'Rol usado por el usuario del SIT Municipal');
INSERT INTO roles VALUES (21, 'Rol Administrador Choluteca', 'Rol de Administracion Regional para el departamento de Choluteca');
INSERT INTO roles VALUES (22, 'Rol Administrador Atlantida', 'Rol de Administracion Regional para el departamento de Atlantida');
INSERT INTO roles VALUES (23, 'Rol Administrador Colon', 'Rol de Administracion Regional para el departamento de Colon');
INSERT INTO roles VALUES (24, 'Rol Administrador Comayagua', 'Rol de Administracion Regional para el departamento de Comayagua');
INSERT INTO roles VALUES (25, 'Rol Administrador Copan', 'Rol de Administracion Regional para el departamento de Copan');
INSERT INTO roles VALUES (26, 'Rol Administrador Cortez', 'Rol de Administracion Regional para el departamento de Cortez');
INSERT INTO roles VALUES (27, 'Rol Administrador el Paraiso', 'Rol de Administracion Regional para el departamento de el Paraiso');
INSERT INTO roles VALUES (28, 'Rol Administrador F. Morazan', 'Rol de Administracion Regional para el departamento de F. Morazan');
INSERT INTO roles VALUES (29, 'Rol Administrador Gracias a Dios', 'Rol de Administracion Regional para el departamento de Gracias a Dios');
INSERT INTO roles VALUES (30, 'Rol Administrador Intibuca', 'Rol de Administracion Regional para el departamento de Intibuca');
INSERT INTO roles VALUES (31, 'Rol Administrador Islas Bahia', 'Rol de Administracion Regional para el departamento de Islas Bahia');
INSERT INTO roles VALUES (32, 'Rol Administrador La Paz', 'Rol de Administracion Regional para el departamento de La Paz');
INSERT INTO roles VALUES (33, 'Rol Administrador Lempira', 'Rol de Administracion Regional para el departamento de Lempira');
INSERT INTO roles VALUES (34, 'Rol Administrador Ocotepeque', 'Rol de Administracion Regional para el departamento de Ocotepeque');
INSERT INTO roles VALUES (35, 'Rol Administrador Olancho', 'Rol de Administracion Regional para el departamento de Olancho');
INSERT INTO roles VALUES (36, 'Rol Administrador Santa Barbara', 'Rol de Administracion Regional para el departamento de Santa Barbara');
INSERT INTO roles VALUES (37, 'Rol Administrador Valle', 'Rol de Administracion Regional para el departamento de Valle');
INSERT INTO roles VALUES (38, 'Rol Administrador Yoro', 'Rol de Administracion Regional para el departamento de Yoro');
INSERT INTO roles VALUES (1, 'Administrator general', 'Administrador general del sistema. Tiene todos los permisos');
INSERT INTO roles VALUES (40, 'Test usuario visualizacion', 'Test usuario visualizacion');


--
-- TOC entry 3592 (class 0 OID 0)
-- Dependencies: 205
-- Name: roles_id_role_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('roles_id_role_seq', 40, true);


--
-- TOC entry 3536 (class 0 OID 77382)
-- Dependencies: 227
-- Data for Name: system_settings; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO system_settings VALUES (1, 'PROXY_URL', '/http_proxy/proxy?url=');
INSERT INTO system_settings VALUES (5, 'PRINT_SERVLET_URL', '../print-servlet-mod2');
INSERT INTO system_settings VALUES (8, 'PRINT_IMAGES_FOLDER', 'c:/print_images_data_folder');
INSERT INTO system_settings VALUES (2, 'GEOSERVER_URL', 'http://geoportal-mosef.gesp.it/geoserver');
INSERT INTO system_settings VALUES (4, 'GEONETWORK_URL', 'http://geo-mosef.gesp.it/geonetwork');
INSERT INTO system_settings VALUES (6, 'SEARCH_MAX_HITS_PER_LAYER', '100');
INSERT INTO system_settings VALUES (10, 'MAX_NUMBER_OF_SELECTABLE_LAYERS', '50');
INSERT INTO system_settings VALUES (7, 'AJAX_REQUEST_TIMEOUT_MSEC', '20000');
INSERT INTO system_settings VALUES (17, 'AJAX_REQUEST_PRINT_TIMEOUT_MSEC', '45000');
INSERT INTO system_settings VALUES (9, 'FEATURE_ATTRIBUTE_HYPERLINK_FIELD', 'et_source');
INSERT INTO system_settings VALUES (12, 'ALERTS_LEGEND_URL', 'http://localhost:8080/geoportal/images/legends/denuncias.png');
INSERT INTO system_settings VALUES (13, 'REDLINES_LEGEND_URL', 'http://localhost:8080/geoportal/images/legends/dibujo.png');
INSERT INTO system_settings VALUES (14, 'ALERTS_GEOSERVER_LAYER_NAME', 'icf:vw_alerts_publish');
INSERT INTO system_settings VALUES (15, 'ALERTS_GEOSERVER_USERNAME', 'alerts_view');
INSERT INTO system_settings VALUES (16, 'ALERTS_GEOSERVER_PASSWORD', 'alerts_view');


--
-- TOC entry 3593 (class 0 OID 0)
-- Dependencies: 228
-- Name: system_settings_id_system_setting_seq; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('system_settings_id_system_setting_seq', 17, true);


--
-- TOC entry 3516 (class 0 OID 49853)
-- Dependencies: 206
-- Data for Name: users; Type: TABLE DATA; Schema: geoportal; Owner: geoportal_user
--

INSERT INTO users VALUES (52, NULL, 'morazan', 28, false, false, 'e9e6b5b47993cee7c8d1c7bc9fc5be16');
INSERT INTO users VALUES (53, NULL, 'graciasadios', 29, false, false, '13f87ac9e88c258970e563df85d2c66b');
INSERT INTO users VALUES (54, NULL, 'intibuca', 30, false, false, '67e0ca50b12ff66b4f2de5508fcdbf7d');
INSERT INTO users VALUES (55, NULL, 'islasbahia', 31, false, false, '0cd605cd9d29f181421521acd7736ba6');
INSERT INTO users VALUES (56, NULL, 'lapaz', 32, false, false, '24b95636d8b3f044eb23016b8a6b42ad');
INSERT INTO users VALUES (57, NULL, 'lempira', 33, false, false, '97827e9d64e3d7eac6584b1e53311f99');
INSERT INTO users VALUES (58, NULL, 'ocotepeque', 34, false, false, 'bdfaaa461f115bdb624c4b6b5e07d26d');
INSERT INTO users VALUES (59, NULL, 'olancho', 35, false, false, 'e44441f4c05181586606a136568d172a');
INSERT INTO users VALUES (60, NULL, 'santabarbara', 36, false, false, 'fe058dd144ce2c584cdac0d30a1fd5f3');
INSERT INTO users VALUES (61, NULL, 'valle', 37, false, false, '4621dd08d8452ad13df5b30b29e5b9b7');
INSERT INTO users VALUES (62, NULL, 'yoro', 38, false, false, '8d12b031c734ae58a597256d14d8b8aa');
INSERT INTO users VALUES (63, NULL, 'usuario1', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (64, NULL, 'usuario2', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (65, NULL, 'usuario3', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (66, NULL, 'usuario4', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (67, NULL, 'usuario5', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (68, NULL, 'usuario6', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (69, NULL, 'usuario7', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (45, NULL, 'atlantida', 22, false, false, '02480b909b487ffa36e2ac38eb03c5ba');
INSERT INTO users VALUES (70, NULL, 'usuario8', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (71, NULL, 'usuario9', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (72, NULL, 'usuario10', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (73, NULL, 'usuario11', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (46, NULL, 'colon', 23, false, false, 'cd474d96b7d33934e9dc47b57cb4c445');
INSERT INTO users VALUES (74, NULL, 'usuario12', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (47, NULL, 'comayagua', 24, false, false, 'e28be7150c8d2f164883b12876361200');
INSERT INTO users VALUES (48, NULL, 'copan', 25, false, false, '8dcd0920df22b4ebf7390321940c4fac');
INSERT INTO users VALUES (49, NULL, 'cortez', 26, false, false, 'e9d8fd1a46b1cb02f90e7eb7e1c07377');
INSERT INTO users VALUES (50, NULL, 'choluteca', 21, false, false, '4d1007fd2b9077471c20da7fa73c5253');
INSERT INTO users VALUES (75, NULL, 'usuario13', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (76, NULL, 'usuario14', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (51, NULL, 'paraiso', 27, false, false, '77620f067dfe09605d7a8d94ea2aceb9');
INSERT INTO users VALUES (77, NULL, 'usuario15', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (78, NULL, 'usuario16', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (79, NULL, 'usuario17', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (80, NULL, 'usuario18', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (81, NULL, 'usuario19', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (92, NULL, 'usuario30', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (93, NULL, 'usuario31', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (94, NULL, 'usuario32', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (95, NULL, 'usuario33', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (96, NULL, 'usuario34', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (97, NULL, 'usuario35', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (1, 'mosef', 'mosef', 1, false, false, 'dc736c46b66dc6293fe35ff89bc5205d');
INSERT INTO users VALUES (98, NULL, 'usuario36', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (99, NULL, 'usuario37', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (100, NULL, 'usuario38', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (101, NULL, 'usuario39', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (102, NULL, 'usuario40', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (103, NULL, 'usuario41', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (104, NULL, 'usuario42', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (105, NULL, 'usuario43', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (106, NULL, 'usuario44', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (107, NULL, 'usuario45', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (108, NULL, 'usuario46', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (109, NULL, 'usuario47', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (110, NULL, 'usuario48', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (111, NULL, 'usuario49', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (112, NULL, 'usuario50', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (82, NULL, 'usuario20', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (83, NULL, 'usuario21', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (84, NULL, 'usuario22', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (85, NULL, 'usuario23', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (86, NULL, 'usuario24', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (87, NULL, 'usuario25', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (88, NULL, 'usuario26', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (89, NULL, 'usuario27', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (90, NULL, 'usuario28', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (91, NULL, 'usuario29', 40, false, false, 'f8032d5cae3de20fcec887f395ec9a6a');
INSERT INTO users VALUES (40, NULL, 'sit_user', 13, false, false, 'b0b5dbe047eb2bae669571e7259e2e3b');


--
-- TOC entry 3594 (class 0 OID 0)
-- Dependencies: 207
-- Name: users_id_user_seq1; Type: SEQUENCE SET; Schema: geoportal; Owner: geoportal_user
--

SELECT pg_catalog.setval('users_id_user_seq1', 112, true);


--
-- TOC entry 3295 (class 2606 OID 49871)
-- Name: alert_type_id_alert_type; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY alert_types
    ADD CONSTRAINT alert_type_id_alert_type PRIMARY KEY (id_alert_type);


--
-- TOC entry 3304 (class 2606 OID 49873)
-- Name: fk_id_redlining_line; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY redlining_line
    ADD CONSTRAINT fk_id_redlining_line PRIMARY KEY (id_redlining);


--
-- TOC entry 3306 (class 2606 OID 49875)
-- Name: fk_id_redlining_point; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY redlining_point
    ADD CONSTRAINT fk_id_redlining_point PRIMARY KEY (id_redlining);


--
-- TOC entry 3308 (class 2606 OID 49877)
-- Name: fk_id_redlining_polygon; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY redlining_polygon
    ADD CONSTRAINT fk_id_redlining_polygon PRIMARY KEY (id_redlining);


--
-- TOC entry 3300 (class 2606 OID 49881)
-- Name: permissions_pkey; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id_permission);


--
-- TOC entry 3278 (class 2606 OID 49883)
-- Name: pk_alert_geom_line_id_geom; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY alert_geom_line
    ADD CONSTRAINT pk_alert_geom_line_id_geom PRIMARY KEY (id_geom);


--
-- TOC entry 3281 (class 2606 OID 49885)
-- Name: pk_alert_geom_point_id_geom; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY alert_geom_point
    ADD CONSTRAINT pk_alert_geom_point_id_geom PRIMARY KEY (id_geom);


--
-- TOC entry 3283 (class 2606 OID 49887)
-- Name: pk_alert_geom_polygon_id_geom; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY alert_geom_polygon
    ADD CONSTRAINT pk_alert_geom_polygon_id_geom PRIMARY KEY (id_geom);


--
-- TOC entry 3291 (class 2606 OID 49889)
-- Name: pk_alert_status_c_status; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY alert_status
    ADD CONSTRAINT pk_alert_status_c_status PRIMARY KEY (c_status);


--
-- TOC entry 3293 (class 2606 OID 49891)
-- Name: pk_alert_status_history; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY alert_status_history
    ADD CONSTRAINT pk_alert_status_history PRIMARY KEY (id_history);


--
-- TOC entry 3289 (class 2606 OID 49893)
-- Name: pk_alerts_id_alert; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY alerts
    ADD CONSTRAINT pk_alerts_id_alert PRIMARY KEY (id_alert);


--
-- TOC entry 3352 (class 2606 OID 94453)
-- Name: pk_alerts_intersections_id; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY alerts_intersections
    ADD CONSTRAINT pk_alerts_intersections_id PRIMARY KEY (id);


--
-- TOC entry 3349 (class 2606 OID 94428)
-- Name: pk_alerts_settings_id; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY alerts_settings
    ADD CONSTRAINT pk_alerts_settings_id PRIMARY KEY (id);


--
-- TOC entry 3341 (class 2606 OID 77336)
-- Name: pk_comments_id_comment; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT pk_comments_id_comment PRIMARY KEY (id_comment);


--
-- TOC entry 3357 (class 2606 OID 94566)
-- Name: pk_departments_permissions_mapping_id; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY departments_permissions_mapping
    ADD CONSTRAINT pk_departments_permissions_mapping_id PRIMARY KEY (id);


--
-- TOC entry 3347 (class 2606 OID 77781)
-- Name: pk_general_settings_id; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY general_settings
    ADD CONSTRAINT pk_general_settings_id PRIMARY KEY (id);


--
-- TOC entry 3338 (class 2606 OID 77199)
-- Name: pk_layer_config_id_layer_config; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY layerconfigs
    ADD CONSTRAINT pk_layer_config_id_layer_config PRIMARY KEY (id_layer_config);


--
-- TOC entry 3332 (class 2606 OID 77151)
-- Name: pk_layer_types_id_layer_type; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY layer_types
    ADD CONSTRAINT pk_layer_types_id_layer_type PRIMARY KEY (id_layer_type);


--
-- TOC entry 3321 (class 2606 OID 77115)
-- Name: pk_layergroup_id_layergroup; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY layergroups
    ADD CONSTRAINT pk_layergroup_id_layergroup PRIMARY KEY (id_layergroup);


--
-- TOC entry 3334 (class 2606 OID 77172)
-- Name: pk_layergroups_layers; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY layergroups_layers
    ADD CONSTRAINT pk_layergroups_layers PRIMARY KEY (id_layergroup, id_layer);


--
-- TOC entry 3330 (class 2606 OID 77160)
-- Name: pk_layers_id_layer; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY layers
    ADD CONSTRAINT pk_layers_id_layer PRIMARY KEY (id_layer);


--
-- TOC entry 3325 (class 2606 OID 77131)
-- Name: pk_layersources_id_layersource; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY layersources
    ADD CONSTRAINT pk_layersources_id_layersource PRIMARY KEY (id_layersource);


--
-- TOC entry 3298 (class 2606 OID 49895)
-- Name: pk_logs_id_log; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY logs
    ADD CONSTRAINT pk_logs_id_log PRIMARY KEY (id_log);


--
-- TOC entry 3319 (class 2606 OID 77104)
-- Name: pk_maps_id_map; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY maps
    ADD CONSTRAINT pk_maps_id_map PRIMARY KEY (id_map);


--
-- TOC entry 3311 (class 2606 OID 49897)
-- Name: pk_role_permission; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY role_permission
    ADD CONSTRAINT pk_role_permission PRIMARY KEY (id_role, id_permission);


--
-- TOC entry 3313 (class 2606 OID 49899)
-- Name: pk_roles_id_role; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT pk_roles_id_role PRIMARY KEY (id_role);


--
-- TOC entry 3343 (class 2606 OID 77395)
-- Name: pk_system_settings_id; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY system_settings
    ADD CONSTRAINT pk_system_settings_id PRIMARY KEY (id);


--
-- TOC entry 3354 (class 2606 OID 94458)
-- Name: uk_alerts_intersections_name; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY alerts_intersections
    ADD CONSTRAINT uk_alerts_intersections_name UNIQUE (name);


--
-- TOC entry 3336 (class 2606 OID 77220)
-- Name: uk_id_layergroup_position; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY layergroups_layers
    ADD CONSTRAINT uk_id_layergroup_position UNIQUE (id_layergroup, "position");


--
-- TOC entry 3323 (class 2606 OID 77218)
-- Name: uk_id_map_position; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY layergroups
    ADD CONSTRAINT uk_id_map_position UNIQUE (id_map, "position");


--
-- TOC entry 3302 (class 2606 OID 94568)
-- Name: uk_permissions_c_permission; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY permissions
    ADD CONSTRAINT uk_permissions_c_permission UNIQUE (c_permission);


--
-- TOC entry 3345 (class 2606 OID 77397)
-- Name: uk_system_settings_key; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY system_settings
    ADD CONSTRAINT uk_system_settings_key UNIQUE (key);


--
-- TOC entry 3317 (class 2606 OID 49903)
-- Name: users_pkey; Type: CONSTRAINT; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);


--
-- TOC entry 3284 (class 1259 OID 49904)
-- Name: fki_alerts_c_status_curr; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX fki_alerts_c_status_curr ON alerts USING btree (c_status_curr);


--
-- TOC entry 3285 (class 1259 OID 49905)
-- Name: fki_alerts_id_alert_type; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX fki_alerts_id_alert_type ON alerts USING btree (id_alert_type);


--
-- TOC entry 3286 (class 1259 OID 49906)
-- Name: fki_alerts_id_user; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX fki_alerts_id_user ON alerts USING btree (id_user);


--
-- TOC entry 3350 (class 1259 OID 94464)
-- Name: fki_alerts_intersections_id_layer; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX fki_alerts_intersections_id_layer ON alerts_intersections USING btree (id_layer);


--
-- TOC entry 3339 (class 1259 OID 77342)
-- Name: fki_comments_id_user; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX fki_comments_id_user ON comments USING btree (id_user);


--
-- TOC entry 3355 (class 1259 OID 94574)
-- Name: fki_departments_permissions_mapping_c_permission; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX fki_departments_permissions_mapping_c_permission ON departments_permissions_mapping USING btree (c_permission);


--
-- TOC entry 3326 (class 1259 OID 77208)
-- Name: fki_layers_id_layerconfig; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX fki_layers_id_layerconfig ON layers USING btree (id_layer_config);


--
-- TOC entry 3327 (class 1259 OID 77166)
-- Name: fki_layers_id_layersource; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX fki_layers_id_layersource ON layers USING btree (id_layersource);


--
-- TOC entry 3328 (class 1259 OID 77188)
-- Name: fki_layers_id_layertype; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX fki_layers_id_layertype ON layers USING btree (id_layer_type);


--
-- TOC entry 3296 (class 1259 OID 49907)
-- Name: fki_logs_id_user; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX fki_logs_id_user ON logs USING btree (id_user);


--
-- TOC entry 3309 (class 1259 OID 49908)
-- Name: fki_role_permission_id_permission; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX fki_role_permission_id_permission ON role_permission USING btree (id_permission);


--
-- TOC entry 3314 (class 1259 OID 49909)
-- Name: fki_users_role; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX fki_users_role ON users USING btree (id_role);


--
-- TOC entry 3279 (class 1259 OID 94597)
-- Name: idx_alert_geom_point_geom; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX idx_alert_geom_point_geom ON alert_geom_point USING gist (the_geom);


--
-- TOC entry 3287 (class 1259 OID 94598)
-- Name: idx_alerts_reference_code; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX idx_alerts_reference_code ON alerts USING btree (reference_code);


--
-- TOC entry 3315 (class 1259 OID 94596)
-- Name: idx_users_username; Type: INDEX; Schema: geoportal; Owner: geoportal_user; Tablespace: 
--

CREATE INDEX idx_users_username ON users USING btree (username);


--
-- TOC entry 3360 (class 2606 OID 49910)
-- Name: fk_alerts_c_status_curr; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY alerts
    ADD CONSTRAINT fk_alerts_c_status_curr FOREIGN KEY (c_status_curr) REFERENCES alert_status(c_status);


--
-- TOC entry 3359 (class 2606 OID 49915)
-- Name: fk_alerts_id_alert_type; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY alerts
    ADD CONSTRAINT fk_alerts_id_alert_type FOREIGN KEY (id_alert_type) REFERENCES alert_types(id_alert_type);


--
-- TOC entry 3358 (class 2606 OID 49920)
-- Name: fk_alerts_id_user; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY alerts
    ADD CONSTRAINT fk_alerts_id_user FOREIGN KEY (id_user) REFERENCES users(id_user);


--
-- TOC entry 3372 (class 2606 OID 94459)
-- Name: fk_alerts_intersections_id_layer; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY alerts_intersections
    ADD CONSTRAINT fk_alerts_intersections_id_layer FOREIGN KEY (id_layer) REFERENCES layers(id_layer);


--
-- TOC entry 3371 (class 2606 OID 77337)
-- Name: fk_comments_id_user; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT fk_comments_id_user FOREIGN KEY (id_user) REFERENCES users(id_user);


--
-- TOC entry 3373 (class 2606 OID 94569)
-- Name: fk_departments_permissions_mapping_c_permission; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY departments_permissions_mapping
    ADD CONSTRAINT fk_departments_permissions_mapping_c_permission FOREIGN KEY (c_permission) REFERENCES permissions(c_permission);


--
-- TOC entry 3365 (class 2606 OID 77116)
-- Name: fk_layergroups_id_map; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY layergroups
    ADD CONSTRAINT fk_layergroups_id_map FOREIGN KEY (id_map) REFERENCES maps(id_map);


--
-- TOC entry 3369 (class 2606 OID 77178)
-- Name: fk_layergroups_layer_id_layer; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY layergroups_layers
    ADD CONSTRAINT fk_layergroups_layer_id_layer FOREIGN KEY (id_layer) REFERENCES layers(id_layer);


--
-- TOC entry 3370 (class 2606 OID 77173)
-- Name: fk_layergroups_layer_id_layergroup; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY layergroups_layers
    ADD CONSTRAINT fk_layergroups_layer_id_layergroup FOREIGN KEY (id_layergroup) REFERENCES layergroups(id_layergroup);


--
-- TOC entry 3366 (class 2606 OID 77203)
-- Name: fk_layers_id_layerconfig; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY layers
    ADD CONSTRAINT fk_layers_id_layerconfig FOREIGN KEY (id_layer_config) REFERENCES layerconfigs(id_layer_config);


--
-- TOC entry 3368 (class 2606 OID 77161)
-- Name: fk_layers_id_layersource; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY layers
    ADD CONSTRAINT fk_layers_id_layersource FOREIGN KEY (id_layersource) REFERENCES layersources(id_layersource);


--
-- TOC entry 3367 (class 2606 OID 77183)
-- Name: fk_layers_id_layertype; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY layers
    ADD CONSTRAINT fk_layers_id_layertype FOREIGN KEY (id_layer_type) REFERENCES layer_types(id_layer_type);


--
-- TOC entry 3361 (class 2606 OID 49925)
-- Name: fk_logs_id_user; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY logs
    ADD CONSTRAINT fk_logs_id_user FOREIGN KEY (id_user) REFERENCES users(id_user);


--
-- TOC entry 3363 (class 2606 OID 49930)
-- Name: fk_role_permission_id_permission; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY role_permission
    ADD CONSTRAINT fk_role_permission_id_permission FOREIGN KEY (id_permission) REFERENCES permissions(id_permission);


--
-- TOC entry 3362 (class 2606 OID 94591)
-- Name: fk_role_permission_id_role; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY role_permission
    ADD CONSTRAINT fk_role_permission_id_role FOREIGN KEY (id_role) REFERENCES roles(id_role) ON DELETE CASCADE;


--
-- TOC entry 3364 (class 2606 OID 98175)
-- Name: fk_users_id_role; Type: FK CONSTRAINT; Schema: geoportal; Owner: geoportal_user
--

ALTER TABLE ONLY users
    ADD CONSTRAINT fk_users_id_role FOREIGN KEY (id_role) REFERENCES roles(id_role);


-- Completed on 2015-06-03 11:27:52

--
-- PostgreSQL database dump complete
--

