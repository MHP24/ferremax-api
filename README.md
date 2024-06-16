<h1 align="center">Ferremax API</h1>

<div align="center">
  <a href="https://ferremax-api.mg-hp.com/api/v1/docs" target="_blank">
    <img src="ferremax-api.jpg" width="200" alt="Ferremax logo" />
  </a>

  <div align="center">
    <img src="https://github.com/marwin1991/profile-technology-icons/assets/136815194/519bfaf3-c242-431e-a269-876979f05574" width="30" height="30"/>
    <img src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" width="30" height="30"/>
    <img src="https://user-images.githubusercontent.com/25181517/117208740-bfb78400-adf5-11eb-97bb-09072b6bedfc.png" width="30" height="30"/>
    <img src="https://user-images.githubusercontent.com/25181517/117207330-263ba280-adf4-11eb-9b97-0ac5b40bc3be.png" width="30" height="30"/>
    <img src="https://user-images.githubusercontent.com/25181517/186711335-a3729606-5a78-4496-9a36-06efcc74f800.png" width="30" height="30"/>
    <img src="https://user-images.githubusercontent.com/25181517/183049794-a3dfaddd-22ee-4ffe-b0b4-549ccd4879f9.png" width="30" height="30"/>
    <img src="https://user-images.githubusercontent.com/25181517/187955008-981340e6-b4cc-441b-80cf-7a5e94d29e7e.png" width="30" height="30"/>
  </div>
</div>

## Table of contents
- [About this project](#about-this-project)
- [Setup and installation](#setup-and-installation)
- [Production demo](#production-demo)
- [Quick stage demo](#quick-stage-demo)
- [API Spec & Documentation](#api-spec-documentation)


## <a id="about-this-project"></a>About this project 📕
This is a project based in a [template](https://github.com/MHP24/nestjs-template) created by [MHP24](https://github.com/MHP24) that includes a development setup and environment multi OS support ready-to-use outside the box, and has the config ready for:

<ul>
  <li>ESLint</li>
  <li>Prettier integration</li>
  <li>Docker hot reload feature (Windows supported)</li>
  <li>Husky integration</li>
  <li>Commit lint (Conventional commits standard)</li>
  <li>Joi .env validation schema</li>
</ul>

## <a id="setup-and-installation"></a>Setup and installation 🚀 

Before using this template, ensure you have [Node.js](https://nodejs.org/en) installed (version 20.12.0 for this template) and [Docker (optional)](https://www.docker.com/) installed and running.

### Steps

 1 . Install dependencies using [yarn __(required)__](https://yarnpkg.com/) as package manager:
```bash
  yarn
```

 2 . Replace __.env.template__ file variables and rename it as __.env__ file

#### __Environment variables specification__ &nbsp;

|__Variable__|__Type__|__Description__|
|---|---|---|
PORT | Integer (positive) | Port where app runs |
DB_URL | String | URL connection string for the PostgreSQL database __used by PrismaORM__ |
JWT_SECRET | String | Secret key for signing JWTs |
JWT_REFRESH_SECRET | String | Secret key for signing refresh JWTs |
JWT_EXPIRE_TEXT | String | Expiration time for JWTs in a readable format (e.g. "12h") |
JWT_REFRESH_EXPIRE_TEXT | String | Expiration time for refresh JWTs in a readable format (e.g. "1d")
JWT_EXPIRE_SECONDS | Integer (positive) | Expiration time for JWTs in seconds |
DB_NAME | String | Name of the PostgreSQL database (can be provided for docker container) |
DB_HOST | String | Host address of the PostgreSQL database (can be provided for docker container) |
DB_PORT | Integer (positive) | Port on which the PostgreSQL database (can be provided for docker container) |
DB_USER | String | Username for the PostgreSQL database (can be provided for docker container) |
DB_PASSWORD | String | Password for the PostgreSQL database (can be provided for docker container) |

<hr>
 

3 . __Database setup__ using PrismaORM (needs PostgreSQL database available, feel free to use docker-compose.dev.yml)
```bash
  yarn prisma:init
```

 4 . __Start development mode:__ Start the development server:
```bash
  yarn start:dev
```

 5 . __Populate database using seed endpoint__
```bash
  POST to: http://127.0.0.1:PORT/api/v1/seed
```

## <a id="production-demo"></a>Production demo 📟
Demo available at: https://ferremax-api.mg-hp.com/api/v1/docs


## <a id="quick-stage-demo"></a>Quick stage demo ⭐ 

To start a quick demo you must to have [Docker](https://www.docker.com/) installed and running.

### Steps

1 . __Configure .env file__: Follow instructions from [Setup and installation](#setup-and-installation) -> Step 2

2 . __Start Docker stage compose file__
```bash
  docker compose -f docker-compose.stage-local.yml up
```

## <a id="api-spec-documentation"></a>API Spec & Documentation 📗 

If your app is running correctly you will find the specification at: http://127.0.0.1:PORT/api/v1/docs