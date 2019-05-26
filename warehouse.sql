-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-05-2019 a las 19:26:18
-- Versión del servidor: 10.1.38-MariaDB
-- Versión de PHP: 7.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `warehouse`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `t_product`
--

CREATE TABLE `t_product` (
  `p_code` varchar(30) NOT NULL,
  `p_name` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `t_product_control`
--

CREATE TABLE `t_product_control` (
  `p_code` varchar(30) NOT NULL,
  `p_name` varchar(30) NOT NULL,
  `p_action` varchar(10) NOT NULL,
  `p_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_card_uid` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `t_user`
--

CREATE TABLE `t_user` (
  `card_uid` varchar(30) NOT NULL,
  `u_first_name` varchar(30) DEFAULT NULL,
  `u_last_name` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `t_product`
--
ALTER TABLE `t_product`
  ADD PRIMARY KEY (`p_code`);

--
-- Indices de la tabla `t_user`
--
ALTER TABLE `t_user`
  ADD PRIMARY KEY (`card_uid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
