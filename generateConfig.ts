interface MaxScaleConfigProps {
  masterHost: string;
  slaveHosts: string[];
  maxscaleUser: string;
}

interface MaxScaleUserConfigProps {
  maxscaleAdminPassword: string;
  maxscaleMonitorPassword: string;
  dbUser: string;
  dbPassword: string;
}

export function generateMaxScaleConfig(props: MaxScaleConfigProps): string {
  return `
[maxscale]
threads=auto
admin_secure_gui=false
admin_host=0.0.0.0
auth_connect_timeout=90000ms

[server1]
type=server
address=${props.masterHost}
port=3306
protocol=MariaDBBackend
${props.slaveHosts
  .map(
    (host, index) => `
[server${index + 2}]
type=server
address=${host}
port=3306
protocol=MariaDBBackend
`
  )
  .join("")}

[ReplicationMonitor]
type=monitor
module=mariadbmon
servers=server1,${props.slaveHosts
    .map((_, index) => `server${index + 2}`)
    .join(",")}
user=maxscale_monitor
password=MaxScaleMonitorPassword
auto_rejoin=true
monitor_interval=500ms
auto_failover=true
enforce_read_only_slaves = true
enforce_writable_master=false
cooperative_monitoring_locks=majority_of_all

[Read-Write-Service]
type=service
router=readwritesplit
servers=server1,${props.slaveHosts
    .map((_, index) => `server${index + 2}`)
    .join(",")}
user=${props.maxscaleUser}
password=maxscaleAdminPassword
transaction_replay_timeout=30s
causal_reads = global
causal_reads_timeout=1s
transaction_replay_retry_on_deadlock=true
master_reconnection = true
transaction_replay = true
transaction_replay_max_size = 10Mi
transaction_replay_attempts = 10
delayed_retry = ON
delayed_retry_timeout = 240s
prune_sescmd_history = true
slave_selection_criteria = ADAPTIVE_ROUTING
master_accept_reads = true

[Read-Write-Listener]
type=listener
service=Read-Write-Service
protocol=MariaDBClient
port=3307
`;
}


export function generateSQLConfig(props: MaxScaleUserConfigProps ): string { 
  
  return `
CREATE USER IF NOT EXISTS 'maxscale_admin'@'%' IDENTIFIED BY '${props.maxscaleAdminPassword}';
CREATE USER IF NOT EXISTS '${props.dbUser}'@'%' IDENTIFIED BY '${props.dbPassword}';
GRANT SELECT ON mysql.user TO 'maxscale_admin'@'%';
GRANT SELECT ON mysql.db TO 'maxscale_admin'@'%';
GRANT SELECT ON mysql.tables_priv TO 'maxscale_admin'@'%';
GRANT SELECT ON mysql.columns_priv TO 'maxscale_admin'@'%';
GRANT SELECT ON mysql.procs_priv TO 'maxscale_admin'@'%';
GRANT SELECT ON mysql.proxies_priv TO 'maxscale_admin'@'%';
GRANT SELECT ON mysql.roles_mapping TO 'maxscale_admin'@'%';
GRANT SHOW DATABASES ON *.* TO 'maxscale_admin'@'%';
FLUSH PRIVILEGES;

CREATE USER IF NOT EXISTS 'maxscale_monitor'@'%' IDENTIFIED BY '${props.maxscaleMonitorPassword}';

GRANT REPLICATION CLIENT on *.* to 'maxscale_monitor'@'%';
GRANT REPLICATION SLAVE on *.* to 'maxscale_monitor'@'%';
GRANT SLAVE MONITOR ON *.* TO 'maxscale_monitor'@'%';
GRANT SUPER, RELOAD on *.* to 'maxscale_monitor'@'%';
GRANT READ_ONLY ADMIN ON *.* TO 'maxscale_monitor'@'%';
GRANT BINLOG ADMIN ON *.* TO 'maxscale_monitor'@'%';
GRANT REPLICATION SLAVE ADMIN ON *.* TO 'maxscale_monitor'@'%';
FLUSH PRIVILEGES;

GRANT ALL PRIVILEGES ON *.* TO '${props.dbUser}'@'%';
FLUSH PRIVILEGES;
`;
}