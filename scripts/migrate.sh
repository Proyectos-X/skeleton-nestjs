#!/bin/sh
# Script para ejecutar graphile-migrate con un archivo .env específico

# Modo de entorno: por defecto "dev"
ENVIRONMENT=${1:-dev}
ENV_FILE=".env.${ENVIRONMENT}"

# Si no existe el .env.<ENV>, usa .env
if [ ! -f "$ENV_FILE" ]; then
  echo "Archivo $ENV_FILE no encontrado. Usando .env por defecto..."
  ENV_FILE=".env"
fi

echo "Cargando variables desde $ENV_FILE"
set -o allexport
[ -f "$ENV_FILE" ] && source "$ENV_FILE"
set +o allexport

# Shift para quitar el primer argumento ($1 = entorno)
shift

# Ejecutar graphile-migrate con el resto de argumentos
graphile-migrate "$@"
