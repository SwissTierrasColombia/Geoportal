--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.4
-- Dumped by pg_dump version 9.3.4
-- Started on 2015-06-03 12:32:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 7 (class 2615 OID 77884)
-- Name: external_data; Type: SCHEMA; Schema: -; Owner: icf
--

CREATE SCHEMA external_data;


ALTER SCHEMA external_data OWNER TO icf;

--
-- TOC entry 6 (class 2615 OID 77883)
-- Name: icf_data; Type: SCHEMA; Schema: -; Owner: icf
--

CREATE SCHEMA icf_data;


ALTER SCHEMA icf_data OWNER TO icf;

SET search_path = external_data, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 186 (class 1259 OID 79247)
-- Name: m1102va001970_hn; Type: TABLE; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE TABLE m1102va001970_hn (
    gid integer NOT NULL,
    cod character varying(50),
    depto character varying(50),
    shape_leng numeric,
    shape_area numeric,
    dep smallint,
    codpais character varying(2),
    km2 double precision,
    densidad double precision,
    geom public.geometry(MultiPolygon,32616)
);


ALTER TABLE external_data.m1102va001970_hn OWNER TO icf;

--
-- TOC entry 185 (class 1259 OID 79245)
-- Name: m1102va001970_hn_gid_seq; Type: SEQUENCE; Schema: external_data; Owner: icf
--

CREATE SEQUENCE m1102va001970_hn_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE external_data.m1102va001970_hn_gid_seq OWNER TO icf;

--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 185
-- Name: m1102va001970_hn_gid_seq; Type: SEQUENCE OWNED BY; Schema: external_data; Owner: icf
--

ALTER SEQUENCE m1102va001970_hn_gid_seq OWNED BY m1102va001970_hn.gid;


--
-- TOC entry 188 (class 1259 OID 79277)
-- Name: m1103va002001_hn; Type: TABLE; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE TABLE m1103va002001_hn (
    gid integer NOT NULL,
    nombre character varying(50),
    cod_muni character varying(16),
    dep smallint,
    mun smallint,
    cod_mun_ smallint,
    codpais character varying(2),
    shape_leng numeric,
    shape_area numeric,
    km2 double precision,
    densidad double precision,
    geom public.geometry(MultiPolygon,32616)
);


ALTER TABLE external_data.m1103va002001_hn OWNER TO icf;

--
-- TOC entry 187 (class 1259 OID 79275)
-- Name: m1103va002001_hn_gid_seq; Type: SEQUENCE; Schema: external_data; Owner: icf
--

CREATE SEQUENCE m1103va002001_hn_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE external_data.m1103va002001_hn_gid_seq OWNER TO icf;

--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 187
-- Name: m1103va002001_hn_gid_seq; Type: SEQUENCE OWNED BY; Schema: external_data; Owner: icf
--

ALTER SEQUENCE m1103va002001_hn_gid_seq OWNED BY m1103va002001_hn.gid;


--
-- TOC entry 190 (class 1259 OID 79580)
-- Name: m1105vp001988_hn; Type: TABLE; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE TABLE m1105vp001988_hn (
    gid integer NOT NULL,
    cod_caseri character varying(11),
    caserio character varying(30),
    sex_h numeric,
    sex_m numeric,
    ed_0a10 numeric,
    ed_11a20 numeric,
    ed_21a30 numeric,
    ed_31a40 numeric,
    ed_41a50 numeric,
    ed_51a60 numeric,
    ed_61a70 numeric,
    ed_71a80 numeric,
    ed_81a90 numeric,
    ed_91a100 numeric,
    ed__101 numeric,
    dd_codigo numeric,
    dm_codigo numeric,
    da_codigo numeric,
    dc_codigo numeric,
    cod_muni character varying(11),
    cod_aldea character varying(11),
    pob_total numeric,
    "categoría" character varying(100),
    municipio character varying(50),
    departamen character varying(50),
    aldea character varying(50),
    cod_dpto character varying(8),
    geom public.geometry(Point,32616),
    cod_categoria integer
);


ALTER TABLE external_data.m1105vp001988_hn OWNER TO icf;

--
-- TOC entry 189 (class 1259 OID 79578)
-- Name: m1105vp001988_hn_gid_seq; Type: SEQUENCE; Schema: external_data; Owner: icf
--

CREATE SEQUENCE m1105vp001988_hn_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE external_data.m1105vp001988_hn_gid_seq OWNER TO icf;

--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 189
-- Name: m1105vp001988_hn_gid_seq; Type: SEQUENCE OWNED BY; Schema: external_data; Owner: icf
--

ALTER SEQUENCE m1105vp001988_hn_gid_seq OWNED BY m1105vp001988_hn.gid;


--
-- TOC entry 192 (class 1259 OID 79592)
-- Name: m2301vl001970_hn; Type: TABLE; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE TABLE m2301vl001970_hn (
    gid integer NOT NULL,
    objectid integer,
    codigo smallint,
    descripc character varying(50),
    shape_leng numeric,
    geom public.geometry(MultiLineString,32616)
);


ALTER TABLE external_data.m2301vl001970_hn OWNER TO icf;

--
-- TOC entry 191 (class 1259 OID 79590)
-- Name: m2301vl001970_hn_gid_seq; Type: SEQUENCE; Schema: external_data; Owner: icf
--

CREATE SEQUENCE m2301vl001970_hn_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE external_data.m2301vl001970_hn_gid_seq OWNER TO icf;

--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 191
-- Name: m2301vl001970_hn_gid_seq; Type: SEQUENCE OWNED BY; Schema: external_data; Owner: icf
--

ALTER SEQUENCE m2301vl001970_hn_gid_seq OWNED BY m2301vl001970_hn.gid;


--
-- TOC entry 194 (class 1259 OID 80534)
-- Name: m3101vl001970_hn; Type: TABLE; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE TABLE m3101vl001970_hn (
    gid integer NOT NULL,
    codigo numeric,
    descripc character varying(50),
    tipo character varying(50),
    shape_leng numeric,
    geom public.geometry(MultiLineString,32616)
);


ALTER TABLE external_data.m3101vl001970_hn OWNER TO icf;

--
-- TOC entry 193 (class 1259 OID 80532)
-- Name: m3101vl001970_hn_gid_seq; Type: SEQUENCE; Schema: external_data; Owner: icf
--

CREATE SEQUENCE m3101vl001970_hn_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE external_data.m3101vl001970_hn_gid_seq OWNER TO icf;

--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 193
-- Name: m3101vl001970_hn_gid_seq; Type: SEQUENCE OWNED BY; Schema: external_data; Owner: icf
--

ALTER SEQUENCE m3101vl001970_hn_gid_seq OWNED BY m3101vl001970_hn.gid;


--
-- TOC entry 196 (class 1259 OID 81102)
-- Name: n2202va001973_hn; Type: TABLE; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE TABLE n2202va001973_hn (
    gid integer NOT NULL,
    area numeric,
    perimeter numeric,
    suelsim_ numeric,
    suelsim_id numeric,
    simbolo character varying(4),
    tipo character varying(7),
    suelo character varying(20),
    profundida character varying(15),
    drenaje character varying(10),
    ph character varying(6),
    ph_n_ double precision,
    pendiente character varying(7),
    color character varying(25),
    textura character varying(30),
    nombre_sue character varying(20),
    shape_leng numeric,
    shape_area numeric,
    geom public.geometry(MultiPolygon,32616)
);


ALTER TABLE external_data.n2202va001973_hn OWNER TO icf;

--
-- TOC entry 195 (class 1259 OID 81100)
-- Name: n2202va001973_hn_gid_seq; Type: SEQUENCE; Schema: external_data; Owner: icf
--

CREATE SEQUENCE n2202va001973_hn_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE external_data.n2202va001973_hn_gid_seq OWNER TO icf;

--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 195
-- Name: n2202va001973_hn_gid_seq; Type: SEQUENCE OWNED BY; Schema: external_data; Owner: icf
--

ALTER SEQUENCE n2202va001973_hn_gid_seq OWNED BY n2202va001973_hn.gid;


--
-- TOC entry 198 (class 1259 OID 81158)
-- Name: n2303vl000000_hn; Type: TABLE; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE TABLE n2303vl000000_hn (
    gid integer NOT NULL,
    area numeric,
    perimeter numeric,
    hidrogeo_ numeric,
    hidrogeo_i numeric,
    definicion character varying(70),
    geocodigo character varying(2),
    shape_leng numeric,
    shape_area numeric,
    geom public.geometry(MultiPolygon,32616)
);


ALTER TABLE external_data.n2303vl000000_hn OWNER TO icf;

--
-- TOC entry 197 (class 1259 OID 81156)
-- Name: n2303vl000000_hn_gid_seq; Type: SEQUENCE; Schema: external_data; Owner: icf
--

CREATE SEQUENCE n2303vl000000_hn_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE external_data.n2303vl000000_hn_gid_seq OWNER TO icf;

--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 197
-- Name: n2303vl000000_hn_gid_seq; Type: SEQUENCE OWNED BY; Schema: external_data; Owner: icf
--

ALTER SEQUENCE n2303vl000000_hn_gid_seq OWNED BY n2303vl000000_hn.gid;


--
-- TOC entry 200 (class 1259 OID 81404)
-- Name: n2502va002001_hn; Type: TABLE; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE TABLE n2502va002001_hn (
    gid integer NOT NULL,
    honutm16__ numeric,
    codhon_ character varying(16),
    id____ integer,
    id integer,
    area numeric,
    area_ha numeric,
    perimeter numeric,
    acres numeric,
    ecosistema character varying(100),
    shape_leng numeric,
    shape_area numeric,
    geom public.geometry(MultiPolygon,32616)
);


ALTER TABLE external_data.n2502va002001_hn OWNER TO icf;

--
-- TOC entry 199 (class 1259 OID 81402)
-- Name: n2502va002001_hn_gid_seq; Type: SEQUENCE; Schema: external_data; Owner: icf
--

CREATE SEQUENCE n2502va002001_hn_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE external_data.n2502va002001_hn_gid_seq OWNER TO icf;

--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 199
-- Name: n2502va002001_hn_gid_seq; Type: SEQUENCE OWNED BY; Schema: external_data; Owner: icf
--

ALTER SEQUENCE n2502va002001_hn_gid_seq OWNED BY n2502va002001_hn.gid;


--
-- TOC entry 202 (class 1259 OID 81776)
-- Name: n2503va000000_hn; Type: TABLE; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE TABLE n2503va000000_hn (
    gid integer NOT NULL,
    area numeric,
    perimeter numeric,
    ecol1_ numeric,
    ecol1_id numeric,
    tipo numeric,
    shape_leng numeric,
    shape_area numeric,
    geom public.geometry(MultiPolygon,32616)
);


ALTER TABLE external_data.n2503va000000_hn OWNER TO icf;

--
-- TOC entry 201 (class 1259 OID 81774)
-- Name: n2503va000000_hn_gid_seq; Type: SEQUENCE; Schema: external_data; Owner: icf
--

CREATE SEQUENCE n2503va000000_hn_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE external_data.n2503va000000_hn_gid_seq OWNER TO icf;

--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 201
-- Name: n2503va000000_hn_gid_seq; Type: SEQUENCE OWNED BY; Schema: external_data; Owner: icf
--

ALTER SEQUENCE n2503va000000_hn_gid_seq OWNED BY n2503va000000_hn.gid;


--
-- TOC entry 204 (class 1259 OID 81843)
-- Name: r1201vl001970_hn; Type: TABLE; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE TABLE r1201vl001970_hn (
    gid integer NOT NULL,
    objectid integer,
    altitud numeric,
    c100m character varying(50),
    c200m character varying(50),
    c500m character varying(50),
    otras character varying(50),
    shape_leng numeric,
    geom public.geometry(MultiLineString,32616)
);


ALTER TABLE external_data.r1201vl001970_hn OWNER TO icf;

--
-- TOC entry 203 (class 1259 OID 81841)
-- Name: r1201vl001970_hn_gid_seq; Type: SEQUENCE; Schema: external_data; Owner: icf
--

CREATE SEQUENCE r1201vl001970_hn_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE external_data.r1201vl001970_hn_gid_seq OWNER TO icf;

--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 203
-- Name: r1201vl001970_hn_gid_seq; Type: SEQUENCE OWNED BY; Schema: external_data; Owner: icf
--

ALTER SEQUENCE r1201vl001970_hn_gid_seq OWNED BY r1201vl001970_hn.gid;


SET search_path = icf_data, pg_catalog;

--
-- TOC entry 236 (class 1259 OID 94306)
-- Name: area_protegidas_test; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE area_protegidas_test (
    id integer NOT NULL,
    geom public.geometry(MultiPolygon,26716),
    gid integer,
    nom_micro_ character varying(77),
    municipio_ character varying(40),
    area_has__ numeric,
    depto_ character varying(50),
    "año_" numeric,
    no_ac character varying(50),
    observacio character varying(254)
);


ALTER TABLE icf_data.area_protegidas_test OWNER TO icf;

--
-- TOC entry 235 (class 1259 OID 94304)
-- Name: area_protegidas_test_id_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE area_protegidas_test_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.area_protegidas_test_id_seq OWNER TO icf;

--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 235
-- Name: area_protegidas_test_id_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE area_protegidas_test_id_seq OWNED BY area_protegidas_test.id;


--
-- TOC entry 228 (class 1259 OID 86393)
-- Name: areas_asignadas_contratos_de_manejo_forestal; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE areas_asignadas_contratos_de_manejo_forestal (
    gid integer NOT NULL,
    id integer,
    conv__ double precision,
    n_sitio character varying(150),
    organizaci character varying(254),
    asociacion character varying(254),
    comunidad character varying(150),
    municipio character varying(100),
    departamen character varying(150),
    r_forestal character varying(100),
    periodo character varying(16),
    vigencia double precision,
    area_auto double precision,
    fam_benef double precision,
    lim_norte character varying(150),
    lim_sur character varying(150),
    lim_este character varying(150),
    lim_oeste character varying(150),
    icf_rep character varying(254),
    org_rep character varying(254),
    corre double precision,
    hectares double precision,
    info character varying(254),
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.areas_asignadas_contratos_de_manejo_forestal OWNER TO icf;

--
-- TOC entry 227 (class 1259 OID 86391)
-- Name: areas_asignadas_contratos_de_manejo_forestal_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE areas_asignadas_contratos_de_manejo_forestal_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.areas_asignadas_contratos_de_manejo_forestal_gid_seq OWNER TO icf;

--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 227
-- Name: areas_asignadas_contratos_de_manejo_forestal_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE areas_asignadas_contratos_de_manejo_forestal_gid_seq OWNED BY areas_asignadas_contratos_de_manejo_forestal.gid;


--
-- TOC entry 240 (class 1259 OID 98045)
-- Name: areas_protegidas; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE areas_protegidas (
    id integer NOT NULL,
    geom public.geometry(MultiPolygon,26716),
    numeros numeric,
    categoria character varying(100),
    nombre2 character varying(100),
    zona character varying(20),
    hectares numeric
);


ALTER TABLE icf_data.areas_protegidas OWNER TO icf;

--
-- TOC entry 239 (class 1259 OID 98043)
-- Name: areas_protegidas_id_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE areas_protegidas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.areas_protegidas_id_seq OWNER TO icf;

--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 239
-- Name: areas_protegidas_id_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE areas_protegidas_id_seq OWNED BY areas_protegidas.id;


--
-- TOC entry 230 (class 1259 OID 86763)
-- Name: areas_titulada_biosfera_a_favor_de_estado; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE areas_titulada_biosfera_a_favor_de_estado (
    gid integer NOT NULL,
    numeros double precision,
    nombre character varying(100),
    categoria character varying(100),
    decreto_no character varying(200),
    perimeter_ double precision,
    hectares double precision,
    et_id integer,
    et_source character varying(254),
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.areas_titulada_biosfera_a_favor_de_estado OWNER TO icf;

--
-- TOC entry 229 (class 1259 OID 86761)
-- Name: areas_titulada_biosfera_a_favor_de_estado_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE areas_titulada_biosfera_a_favor_de_estado_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.areas_titulada_biosfera_a_favor_de_estado_gid_seq OWNER TO icf;

--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 229
-- Name: areas_titulada_biosfera_a_favor_de_estado_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE areas_titulada_biosfera_a_favor_de_estado_gid_seq OWNED BY areas_titulada_biosfera_a_favor_de_estado.gid;


--
-- TOC entry 232 (class 1259 OID 86780)
-- Name: areas_tituladas_a_favor_de_estado; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE areas_tituladas_a_favor_de_estado (
    gid integer NOT NULL,
    id double precision,
    nombre character varying(32),
    departamen character varying(32),
    amparo_leg character varying(50),
    acuerdo_es character varying(50),
    numero_cat character varying(50),
    registro_d character varying(70),
    bajo_no_ character varying(50),
    tomo character varying(50),
    lugar_y_fe character varying(50),
    et_id integer,
    et_source character varying(254),
    municipio_ character varying(100),
    categoria character varying(100),
    "observació" character varying(150),
    hectares numeric,
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.areas_tituladas_a_favor_de_estado OWNER TO icf;

--
-- TOC entry 231 (class 1259 OID 86778)
-- Name: areas_tituladas_a_favor_de_estado_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE areas_tituladas_a_favor_de_estado_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.areas_tituladas_a_favor_de_estado_gid_seq OWNER TO icf;

--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 231
-- Name: areas_tituladas_a_favor_de_estado_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE areas_tituladas_a_favor_de_estado_gid_seq OWNED BY areas_tituladas_a_favor_de_estado.gid;


--
-- TOC entry 234 (class 1259 OID 86824)
-- Name: microcuencas_declaradas; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE microcuencas_declaradas (
    gid integer NOT NULL,
    nom_micro_ character varying(77),
    municipio_ character varying(40),
    area_has__ numeric,
    depto_ character varying(50),
    "año_" double precision,
    no_ac character varying(50),
    observacio character varying(254),
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.microcuencas_declaradas OWNER TO icf;

--
-- TOC entry 233 (class 1259 OID 86822)
-- Name: microcuencas_declaradas_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE microcuencas_declaradas_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.microcuencas_declaradas_gid_seq OWNER TO icf;

--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 233
-- Name: microcuencas_declaradas_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE microcuencas_declaradas_gid_seq OWNED BY microcuencas_declaradas.gid;


--
-- TOC entry 238 (class 1259 OID 97730)
-- Name: plan_manejo_atlantida; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE plan_manejo_atlantida (
    id_0 integer NOT NULL,
    geom public.geometry(MultiPolygon,26716),
    gid integer,
    registro__ character varying(44),
    "resolución" character varying(100),
    reg__fores character varying(56),
    u_e_p_ character varying(62),
    departamen character varying(100),
    propietari character varying(100),
    municipio character varying(100),
    dictamen_l character varying(100),
    nombre_pm character varying(60),
    "período" character varying(30),
    class character varying(10),
    fecha_ingr character varying(10),
    id character varying(4),
    observacio character varying(254),
    area double precision,
    perimeter double precision,
    hectares double precision
);


ALTER TABLE icf_data.plan_manejo_atlantida OWNER TO icf;

--
-- TOC entry 237 (class 1259 OID 97728)
-- Name: plan_manejo_atlantida_id_0_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE plan_manejo_atlantida_id_0_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.plan_manejo_atlantida_id_0_seq OWNER TO icf;

--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 237
-- Name: plan_manejo_atlantida_id_0_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE plan_manejo_atlantida_id_0_seq OWNED BY plan_manejo_atlantida.id_0;


--
-- TOC entry 206 (class 1259 OID 84887)
-- Name: pm_atlantida; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE pm_atlantida (
    gid integer NOT NULL,
    registro__ character varying(44),
    "resolución" character varying(100),
    reg__fores character varying(56),
    u_e_p_ character varying(62),
    departamen character varying(100),
    propietari character varying(100),
    municipio character varying(100),
    dictamen_l character varying(100),
    nombre_pm character varying(60),
    "período" character varying(30),
    class character varying(10),
    fecha_ingr character varying(10),
    id character varying(4),
    observacio character varying(254),
    area double precision,
    perimeter double precision,
    hectares double precision,
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.pm_atlantida OWNER TO icf;

--
-- TOC entry 205 (class 1259 OID 84885)
-- Name: pm_atlantida_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE pm_atlantida_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.pm_atlantida_gid_seq OWNER TO icf;

--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 205
-- Name: pm_atlantida_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE pm_atlantida_gid_seq OWNED BY pm_atlantida.gid;


--
-- TOC entry 208 (class 1259 OID 84937)
-- Name: pm_biosfera; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE pm_biosfera (
    gid integer NOT NULL,
    id integer,
    periodo character varying(16),
    nombre_pm character varying(70),
    departamen character varying(100),
    propietari character varying(100),
    municipio character varying(100),
    "resolución" character varying(100),
    registro character varying(100),
    u_e_p character varying(100),
    dict_legal character varying(100),
    clase character varying(10),
    area double precision,
    perimeter double precision,
    hectares double precision,
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.pm_biosfera OWNER TO icf;

--
-- TOC entry 207 (class 1259 OID 84935)
-- Name: pm_biosfera_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE pm_biosfera_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.pm_biosfera_gid_seq OWNER TO icf;

--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 207
-- Name: pm_biosfera_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE pm_biosfera_gid_seq OWNED BY pm_biosfera.gid;


--
-- TOC entry 210 (class 1259 OID 84963)
-- Name: pm_comayagua; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE pm_comayagua (
    gid integer NOT NULL,
    id integer,
    periodo character varying(16),
    nombre_pm character varying(70),
    departamen character varying(100),
    propietari character varying(100),
    municipio character varying(100),
    "resolución" character varying(100),
    registro character varying(100),
    dict_legal character varying(100),
    u_e_p character varying(100),
    fecha_ingr character varying(10),
    re_clas character varying(24),
    uquinqueni character varying(5),
    observac_1 character varying(254),
    onbservac_ character varying(254),
    hectares numeric,
    observac_3 character varying(254),
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.pm_comayagua OWNER TO icf;

--
-- TOC entry 209 (class 1259 OID 84961)
-- Name: pm_comayagua_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE pm_comayagua_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.pm_comayagua_gid_seq OWNER TO icf;

--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 209
-- Name: pm_comayagua_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE pm_comayagua_gid_seq OWNED BY pm_comayagua.gid;


--
-- TOC entry 212 (class 1259 OID 85086)
-- Name: pm_el_paraiso; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE pm_el_paraiso (
    gid integer NOT NULL,
    id integer,
    periodo character varying(16),
    nombre_pm character varying(70),
    r_forestal character varying(100),
    municipio character varying(100),
    departamen character varying(100),
    "resolución" character varying(100),
    propietari character varying(100),
    registro character varying(100),
    u_e_p character varying(100),
    dict_legal character varying(100),
    fecha_ingr character varying(10),
    clase character varying(10),
    observacio character varying(250),
    quinquenio character varying(5),
    hectares numeric,
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.pm_el_paraiso OWNER TO icf;

--
-- TOC entry 211 (class 1259 OID 85084)
-- Name: pm_el_paraiso_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE pm_el_paraiso_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.pm_el_paraiso_gid_seq OWNER TO icf;

--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 211
-- Name: pm_el_paraiso_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE pm_el_paraiso_gid_seq OWNED BY pm_el_paraiso.gid;


--
-- TOC entry 214 (class 1259 OID 85151)
-- Name: pm_fcomorazan; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE pm_fcomorazan (
    gid integer NOT NULL,
    id integer,
    "resolución" character varying(100),
    r_forestal character varying(100),
    municipio character varying(100),
    departamen character varying(100),
    registro character varying(100),
    propietari character varying(100),
    nombre_pm character varying(200),
    periodo character varying(50),
    u_e_p character varying(100),
    dict_legal character varying(100),
    fecha_ingr character varying(10),
    observacio character varying(200),
    re_clas character varying(10),
    quinquenio character varying(5),
    hectares numeric,
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.pm_fcomorazan OWNER TO icf;

--
-- TOC entry 213 (class 1259 OID 85149)
-- Name: pm_fcomorazan_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE pm_fcomorazan_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.pm_fcomorazan_gid_seq OWNER TO icf;

--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 213
-- Name: pm_fcomorazan_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE pm_fcomorazan_gid_seq OWNED BY pm_fcomorazan.gid;


--
-- TOC entry 216 (class 1259 OID 85381)
-- Name: pm_mosquitia; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE pm_mosquitia (
    gid integer NOT NULL,
    id integer,
    periodo character varying(16),
    nombre_pm character varying(70),
    departamen character varying(100),
    propietari character varying(100),
    municipio character varying(100),
    "resolución" character varying(100),
    r_forestal character varying(100),
    registro character varying(100),
    u_e_p character varying(100),
    dict_legal character varying(100),
    clase character varying(10),
    observacio character varying(80),
    hectares numeric,
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.pm_mosquitia OWNER TO icf;

--
-- TOC entry 215 (class 1259 OID 85379)
-- Name: pm_mosquitia_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE pm_mosquitia_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.pm_mosquitia_gid_seq OWNER TO icf;

--
-- TOC entry 3538 (class 0 OID 0)
-- Dependencies: 215
-- Name: pm_mosquitia_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE pm_mosquitia_gid_seq OWNED BY pm_mosquitia.gid;


--
-- TOC entry 218 (class 1259 OID 85403)
-- Name: pm_noroccidente; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE pm_noroccidente (
    gid integer NOT NULL,
    id integer,
    periodo character varying(16),
    nombre_pm character varying(70),
    departamen character varying(100),
    propietari character varying(100),
    municipio character varying(100),
    "resolución" character varying(100),
    u_g_p_ character varying(250),
    observacio character varying(250),
    r_forestal character varying(150),
    registro character varying(100),
    dict_legal character varying(100),
    fecha_ingr character varying(10),
    clase character varying(10),
    quinquenio character varying(5),
    hectares numeric,
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.pm_noroccidente OWNER TO icf;

--
-- TOC entry 217 (class 1259 OID 85401)
-- Name: pm_noroccidente_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE pm_noroccidente_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.pm_noroccidente_gid_seq OWNER TO icf;

--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 217
-- Name: pm_noroccidente_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE pm_noroccidente_gid_seq OWNED BY pm_noroccidente.gid;


--
-- TOC entry 220 (class 1259 OID 85442)
-- Name: pm_occidente; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE pm_occidente (
    gid integer NOT NULL,
    id integer,
    periodo character varying(16),
    nombre_pm character varying(70),
    departamen character varying(100),
    propietari character varying(100),
    municipio character varying(100),
    "resolución" character varying(100),
    u_g_p_ character varying(250),
    observacio character varying(250),
    r_forestal character varying(150),
    registro character varying(100),
    dict_legal character varying(100),
    clase character varying(10),
    quinquenio character varying(5),
    hectares numeric,
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.pm_occidente OWNER TO icf;

--
-- TOC entry 219 (class 1259 OID 85440)
-- Name: pm_occidente_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE pm_occidente_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.pm_occidente_gid_seq OWNER TO icf;

--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 219
-- Name: pm_occidente_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE pm_occidente_gid_seq OWNED BY pm_occidente.gid;


--
-- TOC entry 222 (class 1259 OID 85469)
-- Name: pm_olancho; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE pm_olancho (
    gid integer NOT NULL,
    id integer,
    periodo character varying(16),
    r_forestal character varying(100),
    u_e_p character varying(100),
    nombre_pm character varying(70),
    municipio character varying(100),
    departamen character varying(100),
    "resolución" character varying(100),
    registro character varying(100),
    propietari character varying(100),
    dict_legal character varying(100),
    observacio character varying(254),
    fecha_ingr character varying(10),
    clase character varying(10),
    quinquenio character varying(5),
    hectares numeric,
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.pm_olancho OWNER TO icf;

--
-- TOC entry 221 (class 1259 OID 85467)
-- Name: pm_olancho_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE pm_olancho_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.pm_olancho_gid_seq OWNER TO icf;

--
-- TOC entry 3541 (class 0 OID 0)
-- Dependencies: 221
-- Name: pm_olancho_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE pm_olancho_gid_seq OWNED BY pm_olancho.gid;


--
-- TOC entry 224 (class 1259 OID 85856)
-- Name: pm_pacifico; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE pm_pacifico (
    gid integer NOT NULL,
    id integer,
    periodo character varying(16),
    registro__ character varying(44),
    nombre_pm character varying(70),
    departamen character varying(100),
    propietari character varying(100),
    municipio character varying(100),
    "resolución" character varying(100),
    "región_for" character varying(100),
    u_e_p character varying(100),
    dict_legal character varying(100),
    clase character varying(10),
    "observació" character varying(254),
    quinquenio character varying(10),
    hectares numeric,
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.pm_pacifico OWNER TO icf;

--
-- TOC entry 223 (class 1259 OID 85854)
-- Name: pm_pacifico_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE pm_pacifico_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.pm_pacifico_gid_seq OWNER TO icf;

--
-- TOC entry 3542 (class 0 OID 0)
-- Dependencies: 223
-- Name: pm_pacifico_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE pm_pacifico_gid_seq OWNED BY pm_pacifico.gid;


--
-- TOC entry 226 (class 1259 OID 85873)
-- Name: pm_yoro; Type: TABLE; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE TABLE pm_yoro (
    gid integer NOT NULL,
    id integer,
    periodo character varying(16),
    nombre_pm character varying(70),
    registro__ character varying(44),
    propietari character varying(100),
    departamen character varying(100),
    r_forestal character varying(200),
    municipio character varying(100),
    "resolución" character varying(100),
    "observació" character varying(200),
    u_e_p character varying(100),
    dict_legal character varying(100),
    fecha_ingr character varying(10),
    clase character varying(10),
    quinquenio character varying(5),
    hectares numeric,
    geom public.geometry(MultiPolygon,26716)
);


ALTER TABLE icf_data.pm_yoro OWNER TO icf;

--
-- TOC entry 225 (class 1259 OID 85871)
-- Name: pm_yoro_gid_seq; Type: SEQUENCE; Schema: icf_data; Owner: icf
--

CREATE SEQUENCE pm_yoro_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE icf_data.pm_yoro_gid_seq OWNER TO icf;

--
-- TOC entry 3543 (class 0 OID 0)
-- Dependencies: 225
-- Name: pm_yoro_gid_seq; Type: SEQUENCE OWNED BY; Schema: icf_data; Owner: icf
--

ALTER SEQUENCE pm_yoro_gid_seq OWNED BY pm_yoro.gid;


SET search_path = external_data, pg_catalog;

--
-- TOC entry 3224 (class 2604 OID 79250)
-- Name: gid; Type: DEFAULT; Schema: external_data; Owner: icf
--

ALTER TABLE ONLY m1102va001970_hn ALTER COLUMN gid SET DEFAULT nextval('m1102va001970_hn_gid_seq'::regclass);


--
-- TOC entry 3225 (class 2604 OID 79280)
-- Name: gid; Type: DEFAULT; Schema: external_data; Owner: icf
--

ALTER TABLE ONLY m1103va002001_hn ALTER COLUMN gid SET DEFAULT nextval('m1103va002001_hn_gid_seq'::regclass);


--
-- TOC entry 3226 (class 2604 OID 79583)
-- Name: gid; Type: DEFAULT; Schema: external_data; Owner: icf
--

ALTER TABLE ONLY m1105vp001988_hn ALTER COLUMN gid SET DEFAULT nextval('m1105vp001988_hn_gid_seq'::regclass);


--
-- TOC entry 3227 (class 2604 OID 79595)
-- Name: gid; Type: DEFAULT; Schema: external_data; Owner: icf
--

ALTER TABLE ONLY m2301vl001970_hn ALTER COLUMN gid SET DEFAULT nextval('m2301vl001970_hn_gid_seq'::regclass);


--
-- TOC entry 3228 (class 2604 OID 80537)
-- Name: gid; Type: DEFAULT; Schema: external_data; Owner: icf
--

ALTER TABLE ONLY m3101vl001970_hn ALTER COLUMN gid SET DEFAULT nextval('m3101vl001970_hn_gid_seq'::regclass);


--
-- TOC entry 3229 (class 2604 OID 81105)
-- Name: gid; Type: DEFAULT; Schema: external_data; Owner: icf
--

ALTER TABLE ONLY n2202va001973_hn ALTER COLUMN gid SET DEFAULT nextval('n2202va001973_hn_gid_seq'::regclass);


--
-- TOC entry 3230 (class 2604 OID 81161)
-- Name: gid; Type: DEFAULT; Schema: external_data; Owner: icf
--

ALTER TABLE ONLY n2303vl000000_hn ALTER COLUMN gid SET DEFAULT nextval('n2303vl000000_hn_gid_seq'::regclass);


--
-- TOC entry 3231 (class 2604 OID 81407)
-- Name: gid; Type: DEFAULT; Schema: external_data; Owner: icf
--

ALTER TABLE ONLY n2502va002001_hn ALTER COLUMN gid SET DEFAULT nextval('n2502va002001_hn_gid_seq'::regclass);


--
-- TOC entry 3232 (class 2604 OID 81779)
-- Name: gid; Type: DEFAULT; Schema: external_data; Owner: icf
--

ALTER TABLE ONLY n2503va000000_hn ALTER COLUMN gid SET DEFAULT nextval('n2503va000000_hn_gid_seq'::regclass);


--
-- TOC entry 3233 (class 2604 OID 81846)
-- Name: gid; Type: DEFAULT; Schema: external_data; Owner: icf
--

ALTER TABLE ONLY r1201vl001970_hn ALTER COLUMN gid SET DEFAULT nextval('r1201vl001970_hn_gid_seq'::regclass);


SET search_path = icf_data, pg_catalog;

--
-- TOC entry 3249 (class 2604 OID 94309)
-- Name: id; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY area_protegidas_test ALTER COLUMN id SET DEFAULT nextval('area_protegidas_test_id_seq'::regclass);


--
-- TOC entry 3245 (class 2604 OID 86396)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY areas_asignadas_contratos_de_manejo_forestal ALTER COLUMN gid SET DEFAULT nextval('areas_asignadas_contratos_de_manejo_forestal_gid_seq'::regclass);


--
-- TOC entry 3251 (class 2604 OID 98048)
-- Name: id; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY areas_protegidas ALTER COLUMN id SET DEFAULT nextval('areas_protegidas_id_seq'::regclass);


--
-- TOC entry 3246 (class 2604 OID 86766)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY areas_titulada_biosfera_a_favor_de_estado ALTER COLUMN gid SET DEFAULT nextval('areas_titulada_biosfera_a_favor_de_estado_gid_seq'::regclass);


--
-- TOC entry 3247 (class 2604 OID 86783)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY areas_tituladas_a_favor_de_estado ALTER COLUMN gid SET DEFAULT nextval('areas_tituladas_a_favor_de_estado_gid_seq'::regclass);


--
-- TOC entry 3248 (class 2604 OID 86827)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY microcuencas_declaradas ALTER COLUMN gid SET DEFAULT nextval('microcuencas_declaradas_gid_seq'::regclass);


--
-- TOC entry 3250 (class 2604 OID 97733)
-- Name: id_0; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY plan_manejo_atlantida ALTER COLUMN id_0 SET DEFAULT nextval('plan_manejo_atlantida_id_0_seq'::regclass);


--
-- TOC entry 3234 (class 2604 OID 84890)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY pm_atlantida ALTER COLUMN gid SET DEFAULT nextval('pm_atlantida_gid_seq'::regclass);


--
-- TOC entry 3235 (class 2604 OID 84940)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY pm_biosfera ALTER COLUMN gid SET DEFAULT nextval('pm_biosfera_gid_seq'::regclass);


--
-- TOC entry 3236 (class 2604 OID 84966)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY pm_comayagua ALTER COLUMN gid SET DEFAULT nextval('pm_comayagua_gid_seq'::regclass);


--
-- TOC entry 3237 (class 2604 OID 85089)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY pm_el_paraiso ALTER COLUMN gid SET DEFAULT nextval('pm_el_paraiso_gid_seq'::regclass);


--
-- TOC entry 3238 (class 2604 OID 85154)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY pm_fcomorazan ALTER COLUMN gid SET DEFAULT nextval('pm_fcomorazan_gid_seq'::regclass);


--
-- TOC entry 3239 (class 2604 OID 85384)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY pm_mosquitia ALTER COLUMN gid SET DEFAULT nextval('pm_mosquitia_gid_seq'::regclass);


--
-- TOC entry 3240 (class 2604 OID 85406)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY pm_noroccidente ALTER COLUMN gid SET DEFAULT nextval('pm_noroccidente_gid_seq'::regclass);


--
-- TOC entry 3241 (class 2604 OID 85445)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY pm_occidente ALTER COLUMN gid SET DEFAULT nextval('pm_occidente_gid_seq'::regclass);


--
-- TOC entry 3242 (class 2604 OID 85472)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY pm_olancho ALTER COLUMN gid SET DEFAULT nextval('pm_olancho_gid_seq'::regclass);


--
-- TOC entry 3243 (class 2604 OID 85859)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY pm_pacifico ALTER COLUMN gid SET DEFAULT nextval('pm_pacifico_gid_seq'::regclass);


--
-- TOC entry 3244 (class 2604 OID 85876)
-- Name: gid; Type: DEFAULT; Schema: icf_data; Owner: icf
--

ALTER TABLE ONLY pm_yoro ALTER COLUMN gid SET DEFAULT nextval('pm_yoro_gid_seq'::regclass);


SET search_path = external_data, pg_catalog;

--
-- TOC entry 3254 (class 2606 OID 79255)
-- Name: m1102va001970_hn_pkey; Type: CONSTRAINT; Schema: external_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY m1102va001970_hn
    ADD CONSTRAINT m1102va001970_hn_pkey PRIMARY KEY (gid);


--
-- TOC entry 3257 (class 2606 OID 79285)
-- Name: m1103va002001_hn_pkey; Type: CONSTRAINT; Schema: external_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY m1103va002001_hn
    ADD CONSTRAINT m1103va002001_hn_pkey PRIMARY KEY (gid);


--
-- TOC entry 3262 (class 2606 OID 79588)
-- Name: m1105vp001988_hn_pkey; Type: CONSTRAINT; Schema: external_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY m1105vp001988_hn
    ADD CONSTRAINT m1105vp001988_hn_pkey PRIMARY KEY (gid);


--
-- TOC entry 3266 (class 2606 OID 79600)
-- Name: m2301vl001970_hn_pkey; Type: CONSTRAINT; Schema: external_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY m2301vl001970_hn
    ADD CONSTRAINT m2301vl001970_hn_pkey PRIMARY KEY (gid);


--
-- TOC entry 3270 (class 2606 OID 80542)
-- Name: m3101vl001970_hn_pkey; Type: CONSTRAINT; Schema: external_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY m3101vl001970_hn
    ADD CONSTRAINT m3101vl001970_hn_pkey PRIMARY KEY (gid);


--
-- TOC entry 3273 (class 2606 OID 81110)
-- Name: n2202va001973_hn_pkey; Type: CONSTRAINT; Schema: external_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY n2202va001973_hn
    ADD CONSTRAINT n2202va001973_hn_pkey PRIMARY KEY (gid);


--
-- TOC entry 3276 (class 2606 OID 81166)
-- Name: n2303vl000000_hn_pkey; Type: CONSTRAINT; Schema: external_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY n2303vl000000_hn
    ADD CONSTRAINT n2303vl000000_hn_pkey PRIMARY KEY (gid);


--
-- TOC entry 3279 (class 2606 OID 81412)
-- Name: n2502va002001_hn_pkey; Type: CONSTRAINT; Schema: external_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY n2502va002001_hn
    ADD CONSTRAINT n2502va002001_hn_pkey PRIMARY KEY (gid);


--
-- TOC entry 3282 (class 2606 OID 81784)
-- Name: n2503va000000_hn_pkey; Type: CONSTRAINT; Schema: external_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY n2503va000000_hn
    ADD CONSTRAINT n2503va000000_hn_pkey PRIMARY KEY (gid);


--
-- TOC entry 3287 (class 2606 OID 81851)
-- Name: r1201vl001970_hn_pkey; Type: CONSTRAINT; Schema: external_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY r1201vl001970_hn
    ADD CONSTRAINT r1201vl001970_hn_pkey PRIMARY KEY (gid);


SET search_path = icf_data, pg_catalog;

--
-- TOC entry 3334 (class 2606 OID 94311)
-- Name: area_protegidas_test_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY area_protegidas_test
    ADD CONSTRAINT area_protegidas_test_pkey PRIMARY KEY (id);


--
-- TOC entry 3323 (class 2606 OID 86401)
-- Name: areas_asignadas_contratos_de_manejo_forestal_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY areas_asignadas_contratos_de_manejo_forestal
    ADD CONSTRAINT areas_asignadas_contratos_de_manejo_forestal_pkey PRIMARY KEY (gid);


--
-- TOC entry 3340 (class 2606 OID 98050)
-- Name: areas_protegidas_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY areas_protegidas
    ADD CONSTRAINT areas_protegidas_pkey PRIMARY KEY (id);


--
-- TOC entry 3326 (class 2606 OID 86771)
-- Name: areas_titulada_biosfera_a_favor_de_estado_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY areas_titulada_biosfera_a_favor_de_estado
    ADD CONSTRAINT areas_titulada_biosfera_a_favor_de_estado_pkey PRIMARY KEY (gid);


--
-- TOC entry 3329 (class 2606 OID 86788)
-- Name: areas_tituladas_a_favor_de_estado_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY areas_tituladas_a_favor_de_estado
    ADD CONSTRAINT areas_tituladas_a_favor_de_estado_pkey PRIMARY KEY (gid);


--
-- TOC entry 3332 (class 2606 OID 86832)
-- Name: microcuencas_declaradas_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY microcuencas_declaradas
    ADD CONSTRAINT microcuencas_declaradas_pkey PRIMARY KEY (gid);


--
-- TOC entry 3337 (class 2606 OID 97735)
-- Name: plan_manejo_atlantida_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY plan_manejo_atlantida
    ADD CONSTRAINT plan_manejo_atlantida_pkey PRIMARY KEY (id_0);


--
-- TOC entry 3290 (class 2606 OID 84895)
-- Name: pm_atlantida_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY pm_atlantida
    ADD CONSTRAINT pm_atlantida_pkey PRIMARY KEY (gid);


--
-- TOC entry 3293 (class 2606 OID 84945)
-- Name: pm_biosfera_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY pm_biosfera
    ADD CONSTRAINT pm_biosfera_pkey PRIMARY KEY (gid);


--
-- TOC entry 3296 (class 2606 OID 84971)
-- Name: pm_comayagua_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY pm_comayagua
    ADD CONSTRAINT pm_comayagua_pkey PRIMARY KEY (gid);


--
-- TOC entry 3299 (class 2606 OID 85094)
-- Name: pm_el_paraiso_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY pm_el_paraiso
    ADD CONSTRAINT pm_el_paraiso_pkey PRIMARY KEY (gid);


--
-- TOC entry 3302 (class 2606 OID 85159)
-- Name: pm_fcomorazan_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY pm_fcomorazan
    ADD CONSTRAINT pm_fcomorazan_pkey PRIMARY KEY (gid);


--
-- TOC entry 3305 (class 2606 OID 85389)
-- Name: pm_mosquitia_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY pm_mosquitia
    ADD CONSTRAINT pm_mosquitia_pkey PRIMARY KEY (gid);


--
-- TOC entry 3308 (class 2606 OID 85411)
-- Name: pm_noroccidente_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY pm_noroccidente
    ADD CONSTRAINT pm_noroccidente_pkey PRIMARY KEY (gid);


--
-- TOC entry 3311 (class 2606 OID 85450)
-- Name: pm_occidente_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY pm_occidente
    ADD CONSTRAINT pm_occidente_pkey PRIMARY KEY (gid);


--
-- TOC entry 3314 (class 2606 OID 85477)
-- Name: pm_olancho_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY pm_olancho
    ADD CONSTRAINT pm_olancho_pkey PRIMARY KEY (gid);


--
-- TOC entry 3317 (class 2606 OID 85864)
-- Name: pm_pacifico_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY pm_pacifico
    ADD CONSTRAINT pm_pacifico_pkey PRIMARY KEY (gid);


--
-- TOC entry 3320 (class 2606 OID 85881)
-- Name: pm_yoro_pkey; Type: CONSTRAINT; Schema: icf_data; Owner: icf; Tablespace: 
--

ALTER TABLE ONLY pm_yoro
    ADD CONSTRAINT pm_yoro_pkey PRIMARY KEY (gid);


SET search_path = external_data, pg_catalog;

--
-- TOC entry 3258 (class 1259 OID 86916)
-- Name: idx_m1105vp001988_hn_categoria; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX idx_m1105vp001988_hn_categoria ON m1105vp001988_hn USING btree ("categoría");


--
-- TOC entry 3259 (class 1259 OID 86927)
-- Name: idx_m1105vp001988_hn_cod_categoria; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX idx_m1105vp001988_hn_cod_categoria ON m1105vp001988_hn USING btree (cod_categoria);


--
-- TOC entry 3263 (class 1259 OID 86898)
-- Name: idx_m2301vL001970_HN_codigo; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX "idx_m2301vL001970_HN_codigo" ON m2301vl001970_hn USING btree (codigo);


--
-- TOC entry 3267 (class 1259 OID 86899)
-- Name: idx_m3101vl001970_hn_codigo; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX idx_m3101vl001970_hn_codigo ON m3101vl001970_hn USING btree (codigo);


--
-- TOC entry 3283 (class 1259 OID 86891)
-- Name: idx_r1201vl001970_hn_c500m; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX idx_r1201vl001970_hn_c500m ON r1201vl001970_hn USING btree (c500m);


--
-- TOC entry 3252 (class 1259 OID 79274)
-- Name: m1102va001970_hn_geom_gist; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX m1102va001970_hn_geom_gist ON m1102va001970_hn USING gist (geom);


--
-- TOC entry 3255 (class 1259 OID 79577)
-- Name: m1103va002001_hn_geom_gist; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX m1103va002001_hn_geom_gist ON m1103va002001_hn USING gist (geom);


--
-- TOC entry 3260 (class 1259 OID 79589)
-- Name: m1105vp001988_hn_geom_gist; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX m1105vp001988_hn_geom_gist ON m1105vp001988_hn USING gist (geom);


--
-- TOC entry 3264 (class 1259 OID 80531)
-- Name: m2301vl001970_hn_geom_gist; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX m2301vl001970_hn_geom_gist ON m2301vl001970_hn USING gist (geom);


--
-- TOC entry 3268 (class 1259 OID 81099)
-- Name: m3101vl001970_hn_geom_gist; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX m3101vl001970_hn_geom_gist ON m3101vl001970_hn USING gist (geom);


--
-- TOC entry 3271 (class 1259 OID 81155)
-- Name: n2202va001973_hn_geom_gist; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX n2202va001973_hn_geom_gist ON n2202va001973_hn USING gist (geom);


--
-- TOC entry 3274 (class 1259 OID 81401)
-- Name: n2303vl000000_hn_geom_gist; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX n2303vl000000_hn_geom_gist ON n2303vl000000_hn USING gist (geom);


--
-- TOC entry 3277 (class 1259 OID 81773)
-- Name: n2502va002001_hn_geom_gist; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX n2502va002001_hn_geom_gist ON n2502va002001_hn USING gist (geom);


--
-- TOC entry 3280 (class 1259 OID 81840)
-- Name: n2503va000000_hn_geom_gist; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX n2503va000000_hn_geom_gist ON n2503va000000_hn USING gist (geom);


--
-- TOC entry 3284 (class 1259 OID 82339)
-- Name: r1201vl001970_hn_geom_gist; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX r1201vl001970_hn_geom_gist ON r1201vl001970_hn USING gist (geom);


--
-- TOC entry 3285 (class 1259 OID 86892)
-- Name: r1201vl001970_hn_otras; Type: INDEX; Schema: external_data; Owner: icf; Tablespace: 
--

CREATE INDEX r1201vl001970_hn_otras ON r1201vl001970_hn USING btree (otras);


SET search_path = icf_data, pg_catalog;

--
-- TOC entry 3321 (class 1259 OID 86674)
-- Name: areas_asignadas_contratos_de_manejo_forestal_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX areas_asignadas_contratos_de_manejo_forestal_geom_gist ON areas_asignadas_contratos_de_manejo_forestal USING gist (geom);


--
-- TOC entry 3324 (class 1259 OID 86777)
-- Name: areas_titulada_biosfera_a_favor_de_estado_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX areas_titulada_biosfera_a_favor_de_estado_geom_gist ON areas_titulada_biosfera_a_favor_de_estado USING gist (geom);


--
-- TOC entry 3327 (class 1259 OID 86821)
-- Name: areas_tituladas_a_favor_de_estado_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX areas_tituladas_a_favor_de_estado_geom_gist ON areas_tituladas_a_favor_de_estado USING gist (geom);


--
-- TOC entry 3330 (class 1259 OID 86852)
-- Name: microcuencas_declaradas_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX microcuencas_declaradas_geom_gist ON microcuencas_declaradas USING gist (geom);


--
-- TOC entry 3288 (class 1259 OID 84934)
-- Name: pm_atlantida_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX pm_atlantida_geom_gist ON pm_atlantida USING gist (geom);


--
-- TOC entry 3291 (class 1259 OID 84960)
-- Name: pm_biosfera_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX pm_biosfera_geom_gist ON pm_biosfera USING gist (geom);


--
-- TOC entry 3294 (class 1259 OID 85083)
-- Name: pm_comayagua_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX pm_comayagua_geom_gist ON pm_comayagua USING gist (geom);


--
-- TOC entry 3297 (class 1259 OID 85148)
-- Name: pm_el_paraiso_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX pm_el_paraiso_geom_gist ON pm_el_paraiso USING gist (geom);


--
-- TOC entry 3300 (class 1259 OID 85378)
-- Name: pm_fcomorazan_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX pm_fcomorazan_geom_gist ON pm_fcomorazan USING gist (geom);


--
-- TOC entry 3303 (class 1259 OID 85400)
-- Name: pm_mosquitia_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX pm_mosquitia_geom_gist ON pm_mosquitia USING gist (geom);


--
-- TOC entry 3306 (class 1259 OID 85439)
-- Name: pm_noroccidente_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX pm_noroccidente_geom_gist ON pm_noroccidente USING gist (geom);


--
-- TOC entry 3309 (class 1259 OID 85466)
-- Name: pm_occidente_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX pm_occidente_geom_gist ON pm_occidente USING gist (geom);


--
-- TOC entry 3312 (class 1259 OID 85853)
-- Name: pm_olancho_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX pm_olancho_geom_gist ON pm_olancho USING gist (geom);


--
-- TOC entry 3315 (class 1259 OID 85870)
-- Name: pm_pacifico_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX pm_pacifico_geom_gist ON pm_pacifico USING gist (geom);


--
-- TOC entry 3318 (class 1259 OID 85917)
-- Name: pm_yoro_geom_gist; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX pm_yoro_geom_gist ON pm_yoro USING gist (geom);


--
-- TOC entry 3335 (class 1259 OID 94334)
-- Name: sidx_area_protegidas_test_geom; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX sidx_area_protegidas_test_geom ON area_protegidas_test USING gist (geom);


--
-- TOC entry 3341 (class 1259 OID 98128)
-- Name: sidx_areas_protegidas_geom; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX sidx_areas_protegidas_geom ON areas_protegidas USING gist (geom);


--
-- TOC entry 3338 (class 1259 OID 97778)
-- Name: sidx_plan_manejo_atlantida_geom; Type: INDEX; Schema: icf_data; Owner: icf; Tablespace: 
--

CREATE INDEX sidx_plan_manejo_atlantida_geom ON plan_manejo_atlantida USING gist (geom);


-- Completed on 2015-06-03 12:33:01

--
-- PostgreSQL database dump complete
--

