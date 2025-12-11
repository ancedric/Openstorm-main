--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-11-26 01:06:37

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 98305)
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    shopid integer NOT NULL,
    amount integer NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 225 (class 1259 OID 98304)
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 225
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- TOC entry 224 (class 1259 OID 82003)
-- Name: dailysales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dailysales (
    id integer NOT NULL,
    shopid integer NOT NULL,
    nbsales integer DEFAULT 0,
    totalamount numeric(10,2) DEFAULT 0.00,
    date date NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 82002)
-- Name: dailysales_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dailysales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 223
-- Name: dailysales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dailysales_id_seq OWNED BY public.dailysales.id;


--
-- TOC entry 228 (class 1259 OID 98318)
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    cartid integer NOT NULL,
    productid integer NOT NULL,
    quantity integer NOT NULL,
    unitprice integer NOT NULL,
    reduction integer,
    total numeric(10,2) NOT NULL,
    date date NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 98317)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 227
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 222 (class 1259 OID 81952)
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    ref character varying(255) NOT NULL,
    shopref character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    category character varying(30) NOT NULL,
    summary character varying(255) NOT NULL,
    description text NOT NULL,
    supplier character varying(45),
    price integer NOT NULL,
    reduction integer,
    stock integer,
    status character varying(30),
    image character varying(255),
    createdat date NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 81951)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 230 (class 1259 OID 106504)
-- Name: renewals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.renewals (
    id integer NOT NULL,
    shopref character varying(255) NOT NULL,
    userplan character varying(255) NOT NULL,
    capture character varying(255) NOT NULL
);


--
-- TOC entry 229 (class 1259 OID 106503)
-- Name: renewals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.renewals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 229
-- Name: renewals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.renewals_id_seq OWNED BY public.renewals.id;


--
-- TOC entry 220 (class 1259 OID 81936)
-- Name: shops; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shops (
    id integer NOT NULL,
    ref character varying(255) NOT NULL,
    userref character varying(255) NOT NULL,
    name character varying(100) NOT NULL,
    cash integer DEFAULT 0,
    activity character varying(100) NOT NULL,
    openinghour time without time zone,
    closehour time without time zone,
    country character varying(100) NOT NULL,
    city character varying(100) NOT NULL,
    remainingactivationtime integer DEFAULT 0,
    image character varying(30),
    createdat date NOT NULL,
    last_update_time timestamp without time zone DEFAULT now()
);


--
-- TOC entry 219 (class 1259 OID 81935)
-- Name: shops_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shops_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 219
-- Name: shops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shops_id_seq OWNED BY public.shops.id;


--
-- TOC entry 218 (class 1259 OID 81922)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    ref character varying(255) NOT NULL,
    firstname character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(15),
    role character varying(20) NOT NULL,
    plan character varying(20) DEFAULT 'free'::character varying,
    createdat date NOT NULL,
    photo character varying(255)
);


--
-- TOC entry 217 (class 1259 OID 81921)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4681 (class 2604 OID 98308)
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- TOC entry 4678 (class 2604 OID 82006)
-- Name: dailysales id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dailysales ALTER COLUMN id SET DEFAULT nextval('public.dailysales_id_seq'::regclass);


--
-- TOC entry 4683 (class 2604 OID 98321)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4677 (class 2604 OID 81955)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4684 (class 2604 OID 106507)
-- Name: renewals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.renewals ALTER COLUMN id SET DEFAULT nextval('public.renewals_id_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 81939)
-- Name: shops id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shops ALTER COLUMN id SET DEFAULT nextval('public.shops_id_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 81925)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4702 (class 2606 OID 98311)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- TOC entry 4700 (class 2606 OID 82010)
-- Name: dailysales dailysales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dailysales
    ADD CONSTRAINT dailysales_pkey PRIMARY KEY (id);


--
-- TOC entry 4704 (class 2606 OID 98323)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4696 (class 2606 OID 81959)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4698 (class 2606 OID 90139)
-- Name: products products_ref_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_ref_key UNIQUE (ref);


--
-- TOC entry 4706 (class 2606 OID 106511)
-- Name: renewals renewals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.renewals
    ADD CONSTRAINT renewals_pkey PRIMARY KEY (id);


--
-- TOC entry 4692 (class 2606 OID 81943)
-- Name: shops shops_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (id);


--
-- TOC entry 4694 (class 2606 OID 90120)
-- Name: shops shops_ref_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_ref_key UNIQUE (ref);


--
-- TOC entry 4686 (class 2606 OID 81934)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4688 (class 2606 OID 81930)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4690 (class 2606 OID 90113)
-- Name: users users_ref_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ref_key UNIQUE (ref);


--
-- TOC entry 4710 (class 2606 OID 98312)
-- Name: carts carts_shopid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_shopid_fkey FOREIGN KEY (shopid) REFERENCES public.shops(id) ON DELETE CASCADE;


--
-- TOC entry 4709 (class 2606 OID 82011)
-- Name: dailysales dailysales_shopid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dailysales
    ADD CONSTRAINT dailysales_shopid_fkey FOREIGN KEY (shopid) REFERENCES public.shops(id) ON DELETE CASCADE;


--
-- TOC entry 4711 (class 2606 OID 98324)
-- Name: orders orders_cartid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_cartid_fkey FOREIGN KEY (cartid) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- TOC entry 4708 (class 2606 OID 90145)
-- Name: products products_shopref_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_shopref_fkey FOREIGN KEY (shopref) REFERENCES public.shops(ref) ON DELETE CASCADE;


--
-- TOC entry 4712 (class 2606 OID 106512)
-- Name: renewals renewals_shopref_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.renewals
    ADD CONSTRAINT renewals_shopref_fkey FOREIGN KEY (shopref) REFERENCES public.shops(ref) ON DELETE CASCADE;


--
-- TOC entry 4707 (class 2606 OID 90133)
-- Name: shops shops_userref_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_userref_fkey FOREIGN KEY (userref) REFERENCES public.users(ref) ON DELETE CASCADE;


-- Completed on 2025-11-26 01:06:41

--
-- PostgreSQL database dump complete
--

