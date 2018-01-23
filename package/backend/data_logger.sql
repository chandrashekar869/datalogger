-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema data_logger
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `data_logger` ;

-- -----------------------------------------------------
-- Schema data_logger
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `data_logger` DEFAULT CHARACTER SET utf8 ;
USE `data_logger` ;

-- -----------------------------------------------------
-- Table `data_logger`.`analog`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`analog` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`analog` (
  `device_id` VARCHAR(45) NOT NULL,
  `ang1_offset` INT(5) NOT NULL,
  `ang1_threshold` VARCHAR(10) NOT NULL,
  `ang1_upper_limit` INT(6) NOT NULL,
  `ang1_lower_limit` INT(6) NOT NULL,
  `ang1_method` VARCHAR(45) NOT NULL,
  `ang1_relay` VARCHAR(5) NOT NULL,
  `ang2_offset` INT(5) NOT NULL,
  `ang2_threshold` VARCHAR(10) NOT NULL,
  `ang2_upper_limit` INT(6) NOT NULL,
  `ang2_lower_limit` INT(6) NOT NULL,
  `ang2_method` VARCHAR(45) NOT NULL,
  `ang2_relay` VARCHAR(5) NOT NULL,
  `ang3_offset` INT(5) NOT NULL,
  `ang3_threshold` VARCHAR(10) NOT NULL,
  `ang3_upper_limit` INT(6) NOT NULL,
  `ang3_lower_limit` INT(6) NOT NULL,
  `ang3_method` VARCHAR(45) NOT NULL,
  `ang3_relay` VARCHAR(5) NOT NULL,
  `ang4_offset` INT(5) NOT NULL,
  `ang4_threshold` VARCHAR(10) NOT NULL,
  `ang4_upper_limit` INT(6) NOT NULL,
  `ang4_lower_limit` INT(6) NOT NULL,
  `ang4_method` VARCHAR(45) NOT NULL,
  `ang4_relay` VARCHAR(5) NOT NULL,
  `ang5_offset` INT(5) NOT NULL,
  `ang5_threshold` VARCHAR(10) NOT NULL,
  `ang5_upper_limit` INT(6) NOT NULL,
  `ang5_lower_limit` INT(6) NOT NULL,
  `ang5_method` VARCHAR(45) NOT NULL,
  `ang5_relay` VARCHAR(5) NOT NULL,
  `ang6_offset` INT(5) NOT NULL,
  `ang6_threshold` VARCHAR(10) NOT NULL,
  `ang6_upper_limit` INT(6) NOT NULL,
  `ang6_lower_limit` INT(6) NOT NULL,
  `ang6_method` VARCHAR(45) NOT NULL,
  `ang6_relay` VARCHAR(5) NOT NULL,
  `ang7_offset` INT(5) NOT NULL,
  `ang7_threshold` VARCHAR(10) NOT NULL,
  `ang7_upper_limit` INT(6) NOT NULL,
  `ang7_lower_limit` INT(6) NOT NULL,
  `ang7_method` VARCHAR(45) NOT NULL,
  `ang7_relay` VARCHAR(5) NOT NULL,
  `ang8_offset` INT(5) NOT NULL,
  `ang8_threshold` VARCHAR(10) NOT NULL,
  `ang8_upper_limit` INT(6) NOT NULL,
  `ang8_lower_limit` INT(6) NOT NULL,
  `ang8_method` VARCHAR(45) NOT NULL,
  `ang8_relay` VARCHAR(5) NOT NULL,
  `master_phone_number` VARCHAR(13) NOT NULL,
  `phone_number_1` VARCHAR(45) NOT NULL,
  `phone_number_2` VARCHAR(45) NOT NULL,
  `phone_number_3` VARCHAR(45) NOT NULL,
  `phone_number_4` VARCHAR(45) NOT NULL,
  `phone_number_5` VARCHAR(45) NOT NULL,
  `phone_number_6` VARCHAR(45) NOT NULL,
  `phone_number_7` VARCHAR(45) NOT NULL,
  `phone_number_8` VARCHAR(45) NOT NULL,
  `phone_number_9` VARCHAR(45) NOT NULL,
  `phone_number_10` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`config_change`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`config_change` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`config_change` (
  `device_id` VARCHAR(45) NOT NULL,
  `analog` INT(2) NOT NULL DEFAULT '0',
  `date_time_config` INT(2) NOT NULL DEFAULT '0',
  `digital_count_config` INT(2) NOT NULL DEFAULT '0',
  `home_config` INT(2) NOT NULL DEFAULT '0',
  `network_config` INT(2) NOT NULL DEFAULT '0',
  `serial_config` INT(2) NOT NULL DEFAULT '0',
  `server_config` INT(2) NOT NULL DEFAULT '0',
  `slave_config` INT(2) NOT NULL DEFAULT '0',
  `ssl_config` INT(2) NOT NULL DEFAULT '0',
  `config_changes` INT(10) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`control_data`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`control_data` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`control_data` (
  `device_id` VARCHAR(45) NOT NULL,
  `solenoid` VARCHAR(45) NOT NULL,
  `last_updated` DATETIME NOT NULL,
  `device_state_updated` TINYINT(4) NOT NULL,
  `relay_changes` INT(11) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`date_time_config`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`date_time_config` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`date_time_config` (
  `device_id` VARCHAR(100) NOT NULL,
  `enable_ntp` VARCHAR(10) NOT NULL,
  `ntp_server_ip` VARCHAR(50) NOT NULL,
  `ntp_port_no` INT(4) NOT NULL,
  `time_zone` VARCHAR(10) NOT NULL,
  `ntp_update_time_interval` INT(10) NOT NULL,
  `rtc_current_date` DATE NOT NULL,
  `rtc_current_time` TIME NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`device_configuration`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`device_configuration` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`device_configuration` (
  `device_id` INT(11) NOT NULL,
  `config_password` VARCHAR(45) NOT NULL,
  `config_date` DATETIME NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `netMask` VARCHAR(45) NOT NULL,
  `gateWay` VARCHAR(45) NOT NULL,
  `dns_ip_address` VARCHAR(45) NOT NULL,
  `network_interface` VARCHAR(45) NOT NULL,
  `dhcp` TINYINT(4) NOT NULL,
  `http_post_interval` INT(11) NOT NULL,
  `config_unit_id` VARCHAR(45) NOT NULL,
  `remote_data_pata` VARCHAR(45) NOT NULL,
  `config_server_address` VARCHAR(45) NOT NULL,
  `connectivity_timeout` INT(11) NOT NULL,
  `related_relay` INT(11) NOT NULL,
  `relay_initial_state` TINYINT(4) NOT NULL,
  `relay_next_state_duration` INT(11) NOT NULL,
  `ssl` TINYINT(4) NOT NULL,
  `device_state_updated` TINYINT(4) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`device_log_current`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`device_log_current` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`device_log_current` (
  `device_Id` VARCHAR(50) NOT NULL,
  `tank_pressure` DECIMAL(10,0) NOT NULL,
  `line_pressure` DECIMAL(10,0) NOT NULL,
  `gas_level` INT(5) NOT NULL,
  `gas_detector` INT(5) NOT NULL,
  `meter1` VARCHAR(8) NOT NULL,
  `meter2` VARCHAR(8) NOT NULL,
  `meter3` VARCHAR(8) NOT NULL,
  `meter4` VARCHAR(8) NOT NULL,
  `log_time` DATETIME NOT NULL,
  `solenoid` VARCHAR(8) NOT NULL,
  `power_level` INT(11) NOT NULL,
  `gas_leak` TINYINT(4) NOT NULL,
  `low_gas` TINYINT(4) NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `device_location` VARCHAR(200) NOT NULL,
  `coordinates` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`device_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `data_logger`.`device_log_historical`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`device_log_historical` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`device_log_historical` (
  `_id` INT(11) NOT NULL AUTO_INCREMENT,
  `device_id` VARCHAR(45) NOT NULL,
  `tank_pressure` DECIMAL(10,0) NOT NULL,
  `line_pressure` DECIMAL(10,0) NOT NULL,
  `gas_level` INT(5) NOT NULL,
  `gas_detector` INT(5) NOT NULL,
  `meter1` VARCHAR(8) NOT NULL,
  `meter2` VARCHAR(8) NOT NULL,
  `meter3` VARCHAR(8) NOT NULL,
  `meter4` VARCHAR(8) NOT NULL,
  `log_time` DATETIME NOT NULL,
  `solenoid` VARCHAR(8) NOT NULL,
  `power_level` INT(11) NOT NULL,
  `gas_leak` TINYINT(4) NOT NULL,
  `low_gas` TINYINT(4) NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `device_location` VARCHAR(200) NOT NULL,
  `coordinates` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 286
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `idx_report` ON `data_logger`.`device_log_historical` (`device_id` ASC);


-- -----------------------------------------------------
-- Table `data_logger`.`devicelist`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`devicelist` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`devicelist` (
  `device_id` VARCHAR(45) NOT NULL,
  `device_password` VARCHAR(100) NOT NULL,
  `session_id` VARCHAR(100) NOT NULL,
  `customer_name` VARCHAR(45) NOT NULL,
  `coordinates` VARCHAR(45) NOT NULL,
  `address` VARCHAR(200) NOT NULL,
  `config_password` VARCHAR(45) NOT NULL DEFAULT 'service_password',
  `gsm_mobile_number` VARCHAR(45) NOT NULL,
  `key_location` VARCHAR(45) NOT NULL,
  `server_gen_reqid` VARCHAR(45) NOT NULL,
  `device_req_id` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`digital_count_config`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`digital_count_config` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`digital_count_config` (
  `device_id` VARCHAR(100) NOT NULL,
  `digi1_pulse_count` VARCHAR(10) NOT NULL,
  `digi1_digital_change` VARCHAR(50) NOT NULL,
  `digi1_pulse_count_number` INT(10) NOT NULL,
  `digi1_set_pulse_count` INT(10) NOT NULL,
  `digi2_pulse_count` VARCHAR(10) NOT NULL,
  `digi2_digital_change` VARCHAR(50) NOT NULL,
  `digi2_pulse_count_number` INT(10) NOT NULL,
  `digi2_set_pulse_count` INT(10) NOT NULL,
  `digi3_pulse_count` VARCHAR(10) NOT NULL,
  `digi3_digital_change` VARCHAR(50) NOT NULL,
  `digi3_pulse_count_number` INT(10) NOT NULL,
  `digi3_set_pulse_count` INT(10) NOT NULL,
  `digi4_pulse_count` VARCHAR(10) NOT NULL,
  `digi4_digital_change` VARCHAR(50) NOT NULL,
  `digi4_pulse_count_number` INT(10) NOT NULL,
  `digi4_set_pulse_count` INT(10) NOT NULL,
  `digi5_pulse_count` VARCHAR(10) NOT NULL,
  `digi5_digital_change` VARCHAR(50) NOT NULL,
  `digi5_pulse_count_number` INT(10) NOT NULL,
  `digi5_set_pulse_count` INT(10) NOT NULL,
  `digi6_pulse_count` VARCHAR(10) NOT NULL,
  `digi6_digital_change` VARCHAR(50) NOT NULL,
  `digi6_pulse_count_number` INT(10) NOT NULL,
  `digi6_set_pulse_count` INT(10) NOT NULL,
  `digi7_pulse_count` VARCHAR(10) NOT NULL,
  `digi7_digital_change` VARCHAR(50) NOT NULL,
  `digi7_pulse_count_number` INT(10) NOT NULL,
  `digi7_set_pulse_count` INT(10) NOT NULL,
  `digi8_pulse_count` VARCHAR(10) NOT NULL,
  `digi8_digital_change` VARCHAR(50) NOT NULL,
  `digi8_pulse_count_number` INT(10) NOT NULL,
  `digi8_set_pulse_count` INT(10) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`home_config`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`home_config` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`home_config` (
  `device_id` VARCHAR(45) NOT NULL,
  `mac_address` VARCHAR(100) NOT NULL,
  `firmware_version` VARCHAR(20) NOT NULL,
  `product_model` VARCHAR(20) NOT NULL,
  `boot_loader` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`network_config`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`network_config` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`network_config` (
  `device_id` VARCHAR(45) NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `netMask` VARCHAR(45) NOT NULL,
  `gateWay` VARCHAR(45) NOT NULL,
  `dns_ip_address` VARCHAR(45) NOT NULL,
  `network_interface` VARCHAR(45) NOT NULL,
  `dhcp` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`raw_table`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`raw_table` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`raw_table` (
  `_id` INT(11) NOT NULL AUTO_INCREMENT,
  `device_id` VARCHAR(45) NOT NULL,
  `device_user` VARCHAR(100) NOT NULL,
  `pwd` VARCHAR(100) NOT NULL,
  `analog_ch1` VARCHAR(50) NOT NULL,
  `analog_ch2` VARCHAR(50) NOT NULL,
  `analog_ch3` VARCHAR(50) NOT NULL,
  `analog_ch4` VARCHAR(50) NOT NULL,
  `analog_ch5` VARCHAR(50) NOT NULL,
  `analog_ch6` VARCHAR(50) NOT NULL,
  `analog_ch7` VARCHAR(50) NOT NULL,
  `analog_ch8` VARCHAR(50) NOT NULL,
  `digital` INT(11) NOT NULL,
  `capture_time` DATETIME NOT NULL,
  `state` TINYINT(4) NOT NULL,
  `alarm` TINYINT(4) NOT NULL,
  `threshold` INT(11) NOT NULL,
  `gas_level` DECIMAL(5,3) NOT NULL,
  `Relay` INT(8) NOT NULL,
  `DC_OCH1` VARCHAR(45) NOT NULL,
  `DC_OCH2` VARCHAR(45) NOT NULL,
  `DC_OCH3` VARCHAR(45) NOT NULL,
  `DC_OCH4` VARCHAR(45) NOT NULL,
  `DC_CH1` VARCHAR(45) NOT NULL,
  `DC_CH2` VARCHAR(45) NOT NULL,
  `DC_CH3` VARCHAR(45) NOT NULL,
  `DC_CH4` VARCHAR(45) NOT NULL,
  `DC_OCH9` VARCHAR(45) NOT NULL,
  `DC_OCH10` VARCHAR(45) NOT NULL,
  `DC_OCH11` VARCHAR(45) NOT NULL,
  `DC_OCH12` VARCHAR(45) NOT NULL,
  `address` VARCHAR(200) NOT NULL,
  `locationLL` VARCHAR(100) NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `configuration_file_location` VARCHAR(100) NOT NULL,
  `device_transaction_id` INT(8) NOT NULL,
  `server_transaction_id` INT(8) NOT NULL,
  `configuration_password` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 441
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `data_logger`.`serial_config`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`serial_config` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`serial_config` (
  `device_id` VARCHAR(45) NOT NULL,
  `rs232_baud_rate` BIGINT(10) NOT NULL,
  `rs232_data_bits` VARCHAR(25) NOT NULL,
  `rs232_parity` VARCHAR(10) NOT NULL,
  `rs232_stop_bits` INT(2) NOT NULL,
  `rs232_flow_control` VARCHAR(10) NOT NULL,
  `rs232_c_timeout` INT(10) NOT NULL,
  `rs485_baud_rate` BIGINT(10) NOT NULL,
  `rs485_data_bits` VARCHAR(25) NOT NULL,
  `rs485_parity` VARCHAR(10) NOT NULL,
  `rs485_stop_bits` INT(2) NOT NULL,
  `rs485_c_timeout` INT(10) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`server_config`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`server_config` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`server_config` (
  `device_id` VARCHAR(45) NOT NULL,
  `ipfiltering` VARCHAR(100) NOT NULL,
  `server_connect_wait_time` INT(4) NOT NULL,
  `remote_ip` VARCHAR(20) NOT NULL,
  `remote_port_no` INT(4) NOT NULL,
  `server_path` VARCHAR(200) NOT NULL,
  `connection_inactive_timeout` INT(10) NOT NULL,
  `defeat_long_ack` VARCHAR(15) NOT NULL,
  `restart_on_loss_of_link` VARCHAR(15) NOT NULL,
  `telnet_IAC` VARCHAR(15) NOT NULL,
  `retain_relay_status` VARCHAR(15) NOT NULL,
  `data_backup` VARCHAR(15) NOT NULL,
  `time_stamp` VARCHAR(15) NOT NULL,
  `server_connectivity_timeout` INT(4) NOT NULL,
  `server_connectivity_timeout_related_relay` VARCHAR(15) NOT NULL,
  `Relay_initial_state` VARCHAR(3) NOT NULL,
  `relay_next_state_duration` INT(10) NOT NULL,
  `login_user_id` VARCHAR(45) NOT NULL,
  `login_password` VARCHAR(45) NOT NULL,
  `SFD` VARCHAR(10) NOT NULL,
  `DLM` VARCHAR(10) NOT NULL,
  `packet_try` INT(5) NOT NULL,
  `response_timeout` INT(5) NOT NULL,
  `GSM` VARCHAR(10) NOT NULL,
  `APN` VARCHAR(50) NOT NULL,
  `gsm_user_id` VARCHAR(45) NOT NULL,
  `gsm_password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`session_log`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`session_log` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`session_log` (
  `_id` INT(11) NOT NULL AUTO_INCREMENT,
  `device_id` VARCHAR(45) NOT NULL,
  `log_time` DATETIME NOT NULL,
  `data` VARCHAR(10000) NULL DEFAULT NULL,
  PRIMARY KEY (`_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 374
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`slave_config`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`slave_config` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`slave_config` (
  `device_id` VARCHAR(45) NOT NULL,
  `http_post_interval` INT(10) NOT NULL,
  `unit_id` VARCHAR(20) NOT NULL,
  `remote_data_path` VARCHAR(100) NOT NULL,
  `ups_query` VARCHAR(50) NOT NULL,
  `http_method` VARCHAR(5) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`ssl_config`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`ssl_config` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`ssl_config` (
  `device_id` VARCHAR(100) NOT NULL,
  `ssl_mode` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_logger`.`user_details`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`user_details` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`user_details` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `password` VARCHAR(45) NOT NULL,
  `user_name` VARCHAR(45) NOT NULL,
  `email_id` VARCHAR(45) NOT NULL,
  `role` VARCHAR(45) NOT NULL DEFAULT 'user',
  `contact_no` VARCHAR(10) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `last_update_time` DATETIME NOT NULL,
  `approved` TINYINT(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 55
DEFAULT CHARACTER SET = utf8;

CREATE UNIQUE INDEX `email_id_UNIQUE` ON `data_logger`.`user_details` (`email_id` ASC);


-- -----------------------------------------------------
-- Table `data_logger`.`user_device_list`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_logger`.`user_device_list` ;

CREATE TABLE IF NOT EXISTS `data_logger`.`user_device_list` (
  `user_id` INT(11) NULL DEFAULT NULL,
  `device_id` VARCHAR(45) NULL DEFAULT NULL,
  `sl_no` INT(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`sl_no`),
  CONSTRAINT `user_device_list_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `data_logger`.`user_details` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_device_list_ibfk_2`
    FOREIGN KEY (`device_id`)
    REFERENCES `data_logger`.`devicelist` (`device_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 206
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `device_id` ON `data_logger`.`user_device_list` (`device_id` ASC);

CREATE INDEX `user_device_list_ibfk_1_idx` ON `data_logger`.`user_device_list` (`user_id` ASC);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
