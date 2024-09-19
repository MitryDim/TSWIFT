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
user=${props.maxscaleUser}
password=${props.maxscalePassword}

[Read-Write-Service]
type=service
router=readwritesplit
servers=server1,${props.slaveHosts
    .map((_, index) => `server${index + 2}`)
    .join(",")}
user=${props.maxscaleUser}
password=${props.maxscalePassword}
localhost_match_wildcard_host=false

[Read-Write-Listener]
type=listener
service=Read-Write-Service
protocol=MariaDBClient
port=3307
`;
}
