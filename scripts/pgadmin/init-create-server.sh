#!/bin/sh
# Init pgAdmin (dev)
# -> uniquement servers.json (méthode officielle)

set -eu

PGADMIN_DATA_DIR=${PGADMIN_DATA_DIR:-/var/lib/pgadmin}

PG_HOST=${PG_HOST:-postgres}
PG_PORT=${PG_PORT:-5432}
PG_DB=${PG_DB:-kompagnon}
PG_USER=${PG_USER:-postgres}

log() { printf "%s\n" "[init-pgadmin] $*"; }

target_file="$PGADMIN_DATA_DIR/servers.json"

log "Writing servers.json to $target_file"
mkdir -p "$PGADMIN_DATA_DIR"

cat > "$target_file" <<JSON
{
  "Servers": {
    "1": {
      "Name": "kompagnon-postgres",
      "Group": "Servers",
      "Host": "$PG_HOST",
      "Port": $PG_PORT,
      "MaintenanceDB": "$PG_DB",
      "Username": "$PG_USER",
      "SSLMode": "prefer",
      "Comment": "Auto-created (servers.json)"
    }
  }
}
JSON

log "servers.json written successfully."
