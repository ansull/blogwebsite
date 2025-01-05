# Blog Platform

This is a blog platform with user authentication, built using Node.js, Express, PostgreSQL, and Docker. The platform consists of three microservices: User Service, Blog Service, and Comment Service.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and authentication
- Create, read, update, and delete blogs
- Comment on blogs
- JWT-based authentication
- Dockerized microservices

## Architecture

The project is divided into three microservices:

1. **User Service**: Manages user registration, login, and user data.
2. **Blog Service**: Manages blog creation, retrieval, updating, and deletion.
3. **Comment Service**: Manages comments on blogs.

## Installation

### Prerequisites

- Node.js (v18.x)
- Docker
- Docker Compose

### Steps

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/blog-platform.git
    cd blog-platform
    ```

2. Create a `.env` file in the root directory and add the following environment variables:

    ```properties
    PORT=3000
    DB_USER=postgres
    DB_PASSWORD=yourpassword
    DB_HOST=yourdbhost
    DB_PORT=5432
    DB_NAME=blog_db
    JWT_SECRET=yourjwtsecret

    USER_PORT=80
    BLOG_PORT=3001
    COMMENT_PORT=3002
    ```

3. Install dependencies:

    ```sh
    npm install
    ```

4. Initialize the database:

    ```sh
    docker-compose up -d postgres
    ```

5. Run the services:

    ```sh
    npm run start-all
    ```

## Usage

# User, Blog, and Comment Services

## Running in Development Mode
To run the User Service in development mode with hot-reloading, run:
```
npm run dev
```

## Environment Variables
The following environment variables need to be set in the `.env` file:

- `PORT`: The port on which the main application runs.
- `DB_USER`: The PostgreSQL database user.
- `DB_PASSWORD`: The PostgreSQL database password.
- `DB_HOST`: The PostgreSQL database host.
- `DB_PORT`: The PostgreSQL database port.
- `DB_NAME`: The PostgreSQL database name.
- `JWT_SECRET`: The secret key for JWT authentication.
- `USER_PORT`: The port for the User Service.
- `BLOG_PORT`: The port for the Blog Service.
- `COMMENT_PORT`: The port for the Comment Service.

## API Endpoints

### User Service
- **POST** `/api/users/register`: Register a new user.
- **POST** `/api/users/login`: Login a user.
- **GET** `/api/users/:id`: Get user details.
- **PUT** `/api/users/:id`: Update user details.
- **DELETE** `/api/users/:id`: Delete a user.

### Blog Service
- **POST** `/api/blogs`: Create a new blog.
- **GET** `/api/blogs`: Get all blogs.
- **GET** `/api/blogs/:id`: Get a blog by ID.
- **PUT** `/api/blogs/:id`: Update a blog.
- **DELETE** `/api/blogs/:id`: Delete a blog.

### Comment Service
- **POST** `/api/comments`: Create a new comment.
- **GET** `/api/comments`: Get comments by blog ID.

## Docker

### Building and Running with Docker Compose
To build and run the services using Docker Compose, run:
```
docker-compose up --build
```
This will build the Docker images and start the services defined in the `docker-compose.yml` file.

### Stopping the Services
To stop the services, run:
```
docker-compose down
```

### Running the Services

To start all services, run:

```sh
npm run start-all
