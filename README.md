# Event Management System

A full-stack Event Management System built using Clean Architecture principles and modern web technologies.

---

## 🚀 Tech Stack

### Backend
- .NET 10
- Clean Architecture
- CQRS Pattern
- MediatR
- Entity Framework Core
- PostgreSQL
- Keycloak (Authentication & Authorization - in progress)

### Frontend
- React
- Vite
- TailwindCSS
- Role-based UI
- REST API integration

---

## ✨ Features

- Event CRUD operations
- Admin authorization
- User event registration / unregistration
- Layered architecture (Domain, Application, Infrastructure, API)
- Separation of concerns
- Scalable backend structure

---

## 🏗 Architecture

The backend follows Clean Architecture:

- Domain → Entities
- Application → CQRS + Business logic
- Infrastructure → Database + External services
- API → Controllers

---

## 🛠 Run Backend

```bash
dotnet run
