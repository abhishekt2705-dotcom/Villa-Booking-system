# VillaBook - Spring Boot Backend

A robust, interview-ready Java Spring Boot backend for the Villa Booking System.

## Technologies Used
- **Java 17 / 21 / 25**
- **Spring Boot 3.3.4**
- **Spring Data JPA & Hibernate**
- **Spring Security 6** with stateless **JWT Authentication**
- **BCrypt Password Hashing**
- **MySQL 8.0**
- **Maven**

---

## Database Configuration
The application automatically creates and connects to the MySQL database `villa_booking_db`.

Make sure MySQL is running on `localhost:3306`.
If your MySQL root user has a password other than `root`, you can update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/villa_booking_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

---

## How to Run

```bash
# In "Backend villa" folder:
mvn clean spring-boot:run
```

The server will start on port `8080` (http://localhost:8080).

---

## Default Seed Data
On startup, the system automatically seeds the following users and villas if the database is fresh:

### Users:
| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@villabook.com` | `admin123` | System Admin |
| **CUSTOMER** | `john@example.com` | `password123` | John Doe |
| **CUSTOMER** | `jane@example.com` | `password123` | Jane Smith |

### Villas:
1. **Villa Paradise** (Goa) - ₹5,000 / night (Max 4 Guests) - ACTIVE
2. **Ocean Breeze Villa** (Alibaug) - ₹7,500 / night (Max 6 Guests) - ACTIVE
3. **Mountain Retreat Villa** (Manali) - ₹4,200 / night (Max 4 Guests) - ACTIVE
4. **Royal Palms Luxury Villa** (Udaipur) - ₹12,000 / night (Max 8 Guests) - ACTIVE

---

## Key REST API Endpoints

### Authentication
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - Login returning JWT token

### Public / Customer Villas
- `GET /api/villas` - Get all active villas
- `GET /api/villas/{id}` - Get villa details
- `GET /api/villas/{id}/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD` - Real-time backend availability check

### Customer Bookings
- `POST /api/bookings` - Confirm booking (requires JWT Bearer token)
- `GET /api/bookings/my` - Get current customer's bookings
- `PUT /api/bookings/{id}/cancel` - Cancel a booking

### Admin APIs (Requires `ROLE_ADMIN`)
- `GET /api/admin/dashboard` - Dashboard metrics (Total Villas, Total Customers, Total Bookings, Confirmed Bookings)
- `GET /api/admin/villas` - List all villas (including inactive)
- `POST /api/admin/villas` - Add new villa
- `PUT /api/admin/villas/{id}` - Update villa
- `DELETE /api/admin/villas/{id}` - Delete villa
- `GET /api/admin/bookings` - List all system bookings
- `PUT /api/admin/bookings/{id}/status` - Update booking status (`CONFIRMED`, `CANCELLED`, `COMPLETED`)
- `GET /api/admin/customers` - List registered customers and booking count

---

## Date Overlap Logic Explained for Machine Test Interview
A date interval $[checkIn_{new}, checkOut_{new})$ overlaps with an existing booking $[checkIn_{existing}, checkOut_{existing})$ when:
```sql
b.villa.id = :villaId 
AND b.status != 'CANCELLED' 
AND b.checkIn < :checkOut 
AND b.checkOut > :checkIn
```
- Example: If an existing booking is 10 Oct &rarr; 15 Oct:
  - 8 Oct &rarr; 12 Oct is **UNAVAILABLE** (overlaps 10-12)
  - 10 Oct &rarr; 15 Oct is **UNAVAILABLE** (exact match)
  - 12 Oct &rarr; 18 Oct is **UNAVAILABLE** (overlaps 12-15)
  - 5 Oct &rarr; 10 Oct is **AVAILABLE** (check-out morning allows check-in afternoon)
  - 15 Oct &rarr; 20 Oct is **AVAILABLE**
