#!/bin/bash
echo "Restaurando base de datos desde el dump..."
pg_restore -U $POSTGRES_USER -d $POSTGRES_DB /docker-entrypoint-initdb.d/backup.dump
echo "Restauración completada."
