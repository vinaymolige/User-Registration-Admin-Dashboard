# User Registration & Admin Dashboard

A full-stack web application built with **Spring Boot 3** (backend) and **Angular 17** (frontend).

## Features

- **User Registration Form** – firstName, lastName, email, phone, password with confirm-password check
- **Form Validation** – frontend (Angular Reactive Forms) + backend (Jakarta Bean Validation)
- **H2 In-Memory Database** – zero-config persistence via Spring Data JPA (swap to MySQL via `application.properties`)
- **Admin Dashboard** – paginated table listing all registered users
- **Edit Users** – pre-filled edit form with optional password change
- **Delete Users** – confirmation dialog, instant table refresh

## Screenshots

| Registration Form | Admin Dashboard | Edit User |
|---|---|---|
| ![Registration](https://github.com/user-attachments/assets/f39dd8ea-e5cb-4667-967e-079ed2d0ee60) | ![Admin Dashboard](https://github.com/user-attachments/assets/0359da8f-6b1b-448c-b44a-568641ffdba2) | ![Edit User](https://github.com/user-attachments/assets/33fa0f9b-7319-4089-bed4-d93b5b89284f) |

## Project Structure

```
├── backend/          # Spring Boot 3.2 Maven project
│   └── src/main/java/com/example/userregistration/
│       ├── controller/   # REST endpoints (/api/users)
│       ├── service/      # Business logic
│       ├── model/        # JPA entity (User)
│       ├── repository/   # Spring Data JPA
│       ├── dto/          # Request DTO with validation
│       ├── exception/    # Custom exceptions
│       └── config/       # CORS configuration
└── frontend/         # Angular 17 standalone-component app
    └── src/app/
        ├── components/   # registration, admin-dashboard, edit-user
        ├── services/     # UserService (HttpClient)
        └── models/       # User interface
```

## Running the Application

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+ / npm

### Backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api/users`.  
H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:userdb`)

### Frontend

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200` in your browser.

### Switch to MySQL

Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/userdb
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
```

Add the MySQL driver dependency to `backend/pom.xml`:

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

## API Reference

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | /api/users         | List all users       |
| GET    | /api/users/{id}    | Get user by ID       |
| POST   | /api/users         | Register new user    |
| PUT    | /api/users/{id}    | Update user          |
| DELETE | /api/users/{id}    | Delete user          |
