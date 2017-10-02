--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.4
-- Dumped by pg_dump version 9.3.4
-- Started on 2015-06-03 12:37:19

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


-- Completed on 2015-06-03 12:37:20

--
-- PostgreSQL database dump complete
--

