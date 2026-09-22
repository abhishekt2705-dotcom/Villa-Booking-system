# 🏡 VillaBook - Full-Stack Villa Booking System

A clean, responsive, and fully functional full-stack Villa Booking application built for interview machine tests.

---

## 🌟 Tech Stack

### Frontend
- **React.js 18**
- **Vite**
- **Tailwind CSS**
- **React Router DOM v6**
- **Axios**
- **Lucide Icons**

### Backend
- **Java 17 / 21 / 25**
- **Spring Boot 3.3.4**
- **Spring Data JPA & Hibernate**
- **Spring Security 6**
- **JWT (JSON Web Token) Authentication**
- **BCrypt Password Hashing**
- **Maven**

### Database
- **MySQL 8.0**

---

## 📁 Repository Structure

```
Villa-Booking-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/villabook/
│   │   │   │   ├── config/          # DataInitializer (Auto-seeding)
│   │   │   │   ├── controller/      # Auth, Villa, Booking, Admin controllers
│   │   │   │   ├── dto/             # Request & Response DTOs
│   │   │   │   ├── entity/          # User, Villa, Booking JPA entities
│   │   │   │   ├── exception/       # GlobalExceptionHandler & custom exceptions
│   │   │   │   ├── repository/      # Spring Data Repositories & Overlap queries
│   │   │   │   ├── security/        # JWT Filter, TokenProvider, SecurityConfig
│   │   │   │   └── service/         # Business logic services
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── schema.sql
│   │   └── test/                    # JUnit 5 & Mockito test cases
│   ├── pom.xml
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── api/                     # Axios instance with JWT interceptor
│   │   ├── components/              # Navbar, Footer, Route Guards, Alert
│   │   ├── context/                 # AuthContext
│   │   ├── pages/                   # Customer pages (Home, Villas, Details, MyBookings)
│   │   │   └── admin/               # Admin pages (Dashboard, Villas, Bookings, Customers)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
└── README.md
```

---

## 👥 User Roles & Permissions

1. **CUSTOMER**:
   - Browse active villas with search and location filtering.
   - View detailed villa specifications and photos.
   - **Check availability** for selected dates (backed by real-time date overlap logic on the backend).
   - View booking summary (nights, price/night, total calculation) and confirm bookings.
   - Access **My Bookings** to view reservation statuses (`CONFIRMED`, `CANCELLED`, `COMPLETED`) and cancel bookings.
   - Cannot access `/admin/**` routes.

2. **ADMIN**:
   - Access the **Admin Dashboard** with live metrics (Total Villas, Total Customers, Total Bookings, Confirmed Bookings).
   - **Villa Management**: Create new villas, view all villas (including inactive), edit existing villas, and delete villas.
   - **Booking Management**: View all reservations across the platform and update their status (`CONFIRMED`, `CANCELLED`, `COMPLETED`).
   - **Customer Directory**: View registered customer details and their booking counts.

---

## 🔑 Pre-Seeded Sample Credentials

On first run, the backend automatically seeds the database with:

| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@villabook.com` | `admin123` | System Admin |
| **CUSTOMER** | `john@example.com` | `password123` | John Doe |
| **CUSTOMER** | `jane@example.com` | `password123` | Jane Smith |

> **Tip**: On the `/login` page, you can click the quick autofill buttons to immediately sign in as Admin or Customer.

---

## 🗓️ Real-Time Date Overlap Algorithm

To prevent double bookings, the backend executes the following interval query in `BookingRepository`:

```sql
SELECT b FROM Booking b 
WHERE b.villa.id = :villaId 
  AND b.status != 'CANCELLED' 
  AND b.checkIn < :checkOut 
  AND b.checkOut > :checkIn
```

- If an existing booking is `10 Oct -> 15 Oct`:
  - `8 Oct -> 12 Oct` ❌ **Unavailable** (Overlaps 10–12)
  - `10 Oct -> 15 Oct` ❌ **Unavailable** (Exact conflict)
  - `12 Oct -> 18 Oct` ❌ **Unavailable** (Overlaps 12–15)
  - `5 Oct -> 10 Oct` ✅ **Available** (Morning checkout allows afternoon checkin)
  - `15 Oct -> 20 Oct` ✅ **Available** (Valid non-overlapping range)

---

## 🚀 Getting Started

### 1. Database Setup
Ensure MySQL is running on `localhost:3306`. The backend will automatically create the database `villa` and all necessary tables.

Configuration in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/villa?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=Abhi@123
spring.jpa.hibernate.ddl-auto=update
```

### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
```
*Backend API starts at `http://localhost:8080`*

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## 📡 REST API Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register customer account |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `GET` | `/api/villas` | Public | Get all active villas |
| `GET` | `/api/villas/{id}` | Public | Get villa details |
| `GET` | `/api/villas/{id}/availability` | Public | Check date availability (`checkIn`, `checkOut`) |
| `POST` | `/api/bookings` | Authenticated | Create a new booking |
| `GET` | `/api/bookings/my` | Authenticated | Get current customer's bookings |
| `PUT` | `/api/bookings/{id}/cancel` | Authenticated | Cancel a booking |
| `GET` | `/api/admin/dashboard` | Admin | Dashboard statistics |
| `GET` | `/api/admin/villas` | Admin | List all villas |
| `POST` | `/api/admin/villas` | Admin | Add a new villa |
| `PUT` | `/api/admin/villas/{id}` | Admin | Update a villa |
| `DELETE` | `/api/admin/villas/{id}` | Admin | Delete a villa |
| `GET` | `/api/admin/bookings` | Admin | List all bookings |
| `PUT` | `/api/admin/bookings/{id}/status`| Admin | Update booking status |
| `GET` | `/api/admin/customers` | Admin | List registered customers |
