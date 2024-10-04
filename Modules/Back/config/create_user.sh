#!/bin/bash
# Utiliser les variables d'environnement injectées par CDKTF
mariadb -uroot -p${MYSQL_ROOT_PASSWORD} <<-EOSQL
CREATE USER IF NOT EXISTS 'maxscale_admin'@'%' IDENTIFIED BY '${MAXSCALE_ADMIN_PASSWORD}';
CREATE USER IF NOT EXISTS '${MYSQL_DB_USER}'@'%' IDENTIFIED BY '${MYSQL_DB_USER_PASSWORD}';
GRANT SELECT ON mysql.user TO 'maxscale_admin'@'%';
GRANT SELECT ON mysql.db TO 'maxscale_admin'@'%';
GRANT SELECT ON mysql.tables_priv TO 'maxscale_admin'@'%';
GRANT SELECT ON mysql.columns_priv TO 'maxscale_admin'@'%';
GRANT SELECT ON mysql.procs_priv TO 'maxscale_admin'@'%';
GRANT SELECT ON mysql.proxies_priv TO 'maxscale_admin'@'%';
GRANT SELECT ON mysql.roles_mapping TO 'maxscale_admin'@'%';
GRANT SHOW DATABASES ON *.* TO 'maxscale_admin'@'%';
FLUSH PRIVILEGES;

CREATE USER IF NOT EXISTS 'maxscale_monitor'@'%' IDENTIFIED BY '${MAXSCALE_MONITORING_PASSWORD}';

GRANT REPLICATION CLIENT on *.* to 'maxscale_monitor'@'%';
GRANT REPLICATION SLAVE on *.* to 'maxscale_monitor'@'%';
GRANT SLAVE MONITOR ON *.* TO 'maxscale_monitor'@'%';
GRANT SUPER, RELOAD on *.* to 'maxscale_monitor'@'%';
GRANT READ_ONLY ADMIN ON *.* TO 'maxscale_monitor'@'%';
GRANT BINLOG ADMIN ON *.* TO 'maxscale_monitor'@'%';
GRANT REPLICATION SLAVE ADMIN ON *.* TO 'maxscale_monitor'@'%';
FLUSH PRIVILEGES;

GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_DB_USER}'@'%';
FLUSH PRIVILEGES;
EOSQL
