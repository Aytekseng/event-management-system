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
```

**Backend runs on:**
`https://localhost:5252`

---

## 🛠 Run Frontend

```bash
cd event-web
npm install
npm run dev
```

**Frontend runs on:**
`http://localhost:5173`

---

## 🔐 Authentication

* Authentication is handled via **Keycloak**.
* Role-based access control (RBAC) is implemented for admin endpoints.

---

## 📌 Project Status

🚧 **Work in Progress**
*Improving UI/UX and finalizing authentication flow.*

---

## 📷 Screenshots

*(Screenshots will be added after UI polish.)*

---

## 👨‍💻 Author

Developed by **Aytek Aksu**
