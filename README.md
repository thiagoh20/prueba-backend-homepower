# API de Productos - NestJS

Una API RESTful completa para la gestión de productos, desarrollada con NestJS, TypeORM y PostgreSQL. Puede ejecutarse como servicio tradicional o como función serverless (AWS Lambda + API Gateway).

## 🚀 Características

- **CRUD completo** para entidades de productos
- **Validaciones robustas** con DTOs y class-validator
- **Manejo de excepciones** personalizado
- **Base de datos PostgreSQL** con TypeORM
- **Despliegue como función Lambda** con AWS API Gateway
- **Configuración con variables de entorno**
- **Pruebas unitarias** con Jest
- **Logging** de requests y responses
- **CORS** habilitado
- **Docker** para base de datos

## 📋 Requisitos

- Node.js (v18 o superior)
- npm 
- Docker y Docker Compose
- PostgreSQL (via Docker)
- AWS CLI (para despliegue o prueba de funciones Lambda)
- AWS SAM CLI (para ejecutar la Lambda localmente)
- 

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone 
cd prueba-backend-homepower
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=thiago
DB_PASSWORD=mypassword
DB_NAME=my_db_productos

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 4. Iniciar la base de datos con Docker
```bash
docker-compose up -d postgres
docker-compose ps  
docker-compose exec postgres bash
psql -h localhost -d my_db_productos -U thiago
```

### 5. Ejecutar la aplicación
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```
 ## ⚙️ Ejecutar Lambda Localmente con AWS SAM

Esta API puede ser desplegada y probada localmente como una función Lambda utilizando [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).

### 📦 Requisitos

- AWS CLI configurado (`aws configure`)
- [SAM CLI instalado](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- Docker (para emular el entorno Lambda)

### 1. Clonar el repositorio
```bash
git clone 
cd prueba-backend-homepower
```

### 2. Instalar dependencias
```bash
npm install
```
### 3. esbuild global
```bash
npm install -g esbuild
```
### 4. Build SAM aplicacion
```bash
sam build
```
### 5. Build SAM aplicacion y ejecucion local
```bash
sam build && sam local start-api   

sam build && sam local start-api --port 3001
```
## 🔗 Endpoints de la API por medio de lambda local

### Base URL Lambda
```
 http://127.0.0.1:3000/productos
 ```



## 🗄️ Estructura de la Base de Datos

### Entidad Producto
```typescript
{
  id: string (UUID, Primary Key)
  nombre: string (máximo 255 caracteres)
  precio: number (decimal con 2 decimales)
  stock: number (entero, mínimo 0)
  createdAt: Date
  updatedAt: Date
}
```

## 🔗 Endpoints de la API

### Base URL local
```
http://localhost:3000
```

### Productos

#### Crear producto
```http
POST /productos
Content-Type: application/json

{
  "nombre": "Producto Ejemplo",
  "precio": 99.99,
  "stock": 50
}
```

#### Obtener todos los productos
```http
GET /productos
```

#### Obtener productos con filtros
```http
# Por nombre
GET /productos?nombre=Producto

# Por rango de precio
GET /productos?minPrice=50&maxPrice=150
```

#### Obtener producto por ID
```http
GET /productos/{id}
```

#### Actualizar producto
```http
PATCH /productos/{id}
Content-Type: application/json

{
  "nombre": "Producto Actualizado",
  "precio": 149.99,
  "stock": 25
}
```

#### Eliminar producto
```http
DELETE /productos/{id}
```

#### Actualizar stock específicamente
```http
PATCH /productos/{id}/stock
Content-Type: application/json

{
  "stock": 100
}
```
# Ejemplos de Uso de la API

## Configuración inicial

Asegúrate de que la aplicación esté ejecutándose en `http://localhost:3000`

## Ejemplos con cURL

### 1. Crear un producto

```bash
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop Gaming",
    "precio": 1299.99,
    "stock": 15
  }'
```

**Respuesta esperada:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "nombre": "Laptop Gaming",
  "precio": 1299.99,
  "stock": 15,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Obtener todos los productos

```bash
curl -X GET http://localhost:3000/productos
```

### 3. Obtener un producto por ID

```bash
curl -X GET http://localhost:3000/productos/123e4567-e89b-12d3-a456-426614174000
```

### 4. Buscar productos por nombre

```bash
curl -X GET "http://localhost:3000/productos?nombre=Laptop"
```

### 5. Buscar productos por rango de precio

```bash
curl -X GET "http://localhost:3000/productos?minPrice=1000&maxPrice=1500"
```

### 6. Actualizar un producto

```bash
curl -X PATCH http://localhost:3000/productos/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 1199.99,
    "stock": 20
  }'
```

### 7. Actualizar solo el stock

```bash
curl -X PATCH http://localhost:3000/productos/123e4567-e89b-12d3-a456-426614174000/stock \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 25
  }'
```

### 8. Eliminar un producto

```bash
curl -X DELETE http://localhost:3000/productos/123e4567-e89b-12d3-a456-426614174000
```

## Ejemplos de Respuestas de Error

### Error de validación

**Request:**
```bash
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "",
    "precio": -10,
    "stock": -5
  }'
```

**Response:**
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/productos",
  "method": "POST",
  "message": {
    "message": [
      "nombre should not be empty",
      "El precio debe ser un número positivo",
      "El stock no puede ser negativo"
    ],
    "error": "Bad Request",
    "statusCode": 400
  }
}
```

### Producto no encontrado

**Request:**
```bash
curl -X GET http://localhost:3000/productos/invalid-uuid
```

**Response:**
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/productos/invalid-uuid",
  "method": "GET",
  "message": {
    "message": "Validation failed (uuid is expected)",
    "error": "Bad Request",
    "statusCode": 400
  }
}
```

## Datos de Prueba

Aquí tienes algunos productos de ejemplo para probar la API:

```json
[
  {
    "nombre": "Laptop Gaming ASUS ROG",
    "precio": 1599.99,
    "stock": 10
  },
  {
    "nombre": "Mouse Logitech MX Master 3",
    "precio": 99.99,
    "stock": 50
  },
  {
    "nombre": "Teclado Mecánico Corsair K95",
    "precio": 199.99,
    "stock": 25
  },
  {
    "nombre": "Monitor 4K Samsung 27\"",
    "precio": 399.99,
    "stock": 15
  },
  {
    "nombre": "Auriculares Sony WH-1000XM4",
    "precio": 349.99,
    "stock": 30
  }
]
```

## Script de Prueba Completo

```bash
#!/bin/bash

echo "=== Creando productos de prueba ==="

# Crear productos
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Laptop Gaming", "precio": 1299.99, "stock": 15}'

curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Mouse Gaming", "precio": 79.99, "stock": 100}'

curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Teclado Mecánico", "precio": 149.99, "stock": 50}'

echo -e "\n=== Obteniendo todos los productos ==="
curl -X GET http://localhost:3000/productos

echo -e "\n=== Buscando productos por precio (100-200) ==="
curl -X GET "http://localhost:3000/productos?minPrice=100&maxPrice=200"

echo -e "\n=== Prueba completada ==="
```

## Herramientas Recomendadas

- **Postman**: Para pruebas interactivas de la API

## 📝 Validaciones

### CreateProductoDto
- **nombre**: Requerido, string, máximo 255 caracteres
- **precio**: Requerido, número positivo con máximo 2 decimales
- **stock**: Requerido, número entero no negativo

### UpdateProductoDto
- Todos los campos son opcionales
- Mismas validaciones que CreateProductoDto cuando se proporcionan

## 🧪 Pruebas

### Ejecutar todas las pruebas
```bash
npm run test
```


## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev      # Inicia en modo desarrollo con hot reload
npm run start:debug    # Inicia en modo debug

# Producción
npm run build          # Compila el proyecto
npm run start:prod     # Inicia en modo producción

# Pruebas
npm run test           # Ejecuta pruebas unitarias
```

## 🐳 Docker

### Iniciar base de datos
```bash
docker-compose up -d postgres
docker-compose ps  
docker-compose exec postgres bash
psql -h localhost -d my_db_productos -U thiago
```

### Detener base de datos
```bash
docker-compose down
```

### Ver logs de la base de datos
```bash
docker-compose logs postgres
```


## 🛡️ Seguridad y Buenas Prácticas

### Validaciones
- **DTOs** con decoradores de class-validator
- **Pipes de validación** globales
- **Whitelist** para filtrar propiedades no permitidas
- **Transform** automático de tipos

### Manejo de Errores
- **Filtro de excepciones** global personalizado
- **Logging** detallado de errores
- **Respuestas consistentes** de error
- **Códigos de estado HTTP** apropiados

### Base de Datos
- **TypeORM** para ORM
- **Migraciones** automáticas en desarrollo
- **Conexión segura** con variables de entorno
- **Validación de UUID** en parámetros
## 🧩 Configuración de AWS Lambda y API Gateway (`template.yaml`)

El despliegue de esta API en AWS se realiza como una función **Lambda** conectada a un **API Gateway HTTP** utilizando **AWS SAM**.

### 📄 Estructura del archivo `template.yaml`

```yaml
AWSTemplateFormatVersion: 2010-09-09
Transform: AWS::Serverless-2016-10-31
Description: Serverless for technical 

Parameters:
  DBHost:
    Type: String
    Description: Database host for the Productos API

  DBPort:
    Type: Number

  DBUsername:
    Type: String
    Description: Database username for the Productos API

  DBPassword:
    Type: String
    NoEcho: true
    Description: Database password for the Productos API

  DBName:
    Type: String
    Description: Database name for the Productos API

Globals:
  Api:
    Cors:
      AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
      AllowHeaders: "'*'"
      AllowOrigin: "'*'"

Resources:
  AppApi:
    Type: AWS::Serverless::HttpApi
    Properties:
      Name: HomePowerAPI
      Description: HTTP API Gateway for HomePower
      StageName: Prod

  ProductsFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: .
      Handler: lambda.handler
      Runtime: nodejs20.x
      MemorySize: 512
      Timeout: 10
      Environment:
        Variables:
          DB_HOST: !Ref DBHost
          DB_PORT: !Ref DBPort
          DB_USERNAME: !Ref DBUsername
          DB_PASSWORD: !Ref DBPassword
          DB_NAME: !Ref DBName
      Events:
        ProductosRoute:
          Type: HttpApi
          Properties:
            Path: /productos
            Method: ANY
            ApiId: !Ref AppApi
    Metadata:
      BuildMethod: esbuild
      BuildProperties:
        Minify: true
        Target: "es2020"
        Sourcemap: true
        EntryPoints:
          - lambda.ts
        External:
          - pg-hstore
          - '@nestjs/websockets'
          - '@nestjs/websockets/socket-module'
          - '@nestjs/microservices'
          - '@nestjs/microservices/microservices-module'

Outputs:
  AppApiEndpoint:
    Description: API Endpoint
    Value: !Sub "https://${AppApi}.execute-api.${AWS::Region}.amazonaws.com/Prod"
``` 
## 🚀 Despliegue Automático con GitHub Actions + AWS SAM

Esta API se despliega automáticamente en AWS como una función Lambda integrada con API Gateway utilizando GitHub Actions.

### ⚙️ Flujo de Despliegue


Ubicado en `.github/workflows/deploy.yml`

Cada vez que haces push a la rama `main` , se ejecuta un workflow que:

1. Compila el proyecto
2. Empaqueta la aplicación con AWS SAM
3. Despliega la Lambda con `sam deploy`

### 🧾 Configuración Github Actions

Este archivo contiene las configuraciones necesarias para el entorno de producción (nombre de stack, región, etc.).

### 🔐 Secretos necesarios en GitHub

Debes definir los siguientes secretos en tu repositorio de GitHub (`Settings > Secrets and variables > Actions`):

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### 🛠️ Ejemplo de paso en GitHub Actions

```yaml

- name: Desplegar con SAM
  run: sam deploy --config-file samconfig.toml --no-confirm-changeset --no-fail-on-empty-changeset
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_DEFAULT_REGION: us-east-1
```
## ✅ Integración Continua: Pruebas Unitarias con GitHub Actions

Este proyecto utiliza **GitHub Actions** para ejecutar automáticamente las pruebas unitarias en cada push o pull request hacia cualquier rama (`branches: [ "**" ]`).

### 🔍 Workflow de Pruebas

Ubicado en `.github/workflows/run_tests.yml`

### 📦 ¿Qué hace este workflow?

1. **Clona el repositorio**
2. **Instala Node.js v22**
3. **Instala las dependencias del proyecto**
4. **Ejecuta los tests con Jest**

### 🧪 Script del workflow (`run_tests.yml`)

```yaml
name: Run Tests

on:
  push:
    branches: [ "**" ]
  pull_request:
    branches: [ "**" ]

jobs:
  test:
    name: Run Unit Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
```

### Variables de entorno
```env
NODE_ENV=production
DB_HOST=<production-db-host>
DB_PORT=5432
DB_USERNAME=<production-username>
DB_PASSWORD=<production-password>
DB_NAME=<production-database>
PORT=3000
```
## 👥 Autores

- **Santiago hernandez** - *Desarrollador Back end* - [TuGitHub](https://github.com/thiagoh20)

