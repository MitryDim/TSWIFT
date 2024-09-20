interface MaxScaleConfigProps {
  masterHost: string;
  slaveHosts: string[];
  maxscaleUser: string;
  maxscalePassword: string;
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
password=secret
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
password=${props.maxscalePassword}
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
