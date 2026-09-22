# VillaBook - React Frontend

A clean, responsive, and modern React frontend for the Villa Booking System.

## Technologies Used
- **React.js 18**
- **Vite**
- **Tailwind CSS**
- **React Router DOM 6**
- **Axios**
- **Lucide Icons**

---

## How to Run

```bash
# In "Frontend villa" folder:
npm install
npm run dev
```

The application runs at http://localhost:5173.

---

## Pages & User Flows

### Customer Experience:
1. **Home (`/`)**:
   - Hero header: *"Find Your Perfect Villa"*
   - Date range search box
   - Featured available villas grid
   - Value propositions
2. **Customer Registration (`/register`)**:
   - Form fields: Name, Email, Password, Confirm Password
   - Live client-side and backend validation
3. **Customer Login (`/login`)**:
   - Quick one-click Demo credentials for Admin and Customer
   - JWT token storage in localStorage and Axios interceptor
4. **Villas Catalog (`/villas`)**:
   - Search by name & location filter
   - Villa cards showing image, price per night, and capacity
5. **Villa Details (`/villas/:id`)**:
   - High resolution photos, pricing, amenities
   - Check-in / Check-out date selection
   - **Check Availability button**: calls backend `/api/villas/{id}/availability`
   - Real-time availability feedback
   - Dynamic price calculation: $\text{nights} \times \text{pricePerNight}$
   - **Confirm Booking button**: double-checks availability on backend and completes reservation
6. **My Bookings (`/my-bookings`)**:
   - View reservation history, status badges (`CONFIRMED`, `CANCELLED`, `COMPLETED`), and Cancel button

### Admin Experience:
1. **Dashboard (`/admin`)**:
   - 4 Metric cards: Total Villas, Total Customers, Total Bookings, Confirmed Bookings
   - Quick navigation shortcuts & recent bookings table
2. **Villa Management (`/admin/villas`)**:
   - List all villas with ACTIVE/INACTIVE badges
   - Actions to Add, Edit, or Delete villas
3. **Add Villa (`/admin/villas/add`)** & **Edit Villa (`/admin/villas/edit/:id`)**:
   - Forms to manage villa information, pricing, capacity, images, and status
4. **Booking Management (`/admin/bookings`)**:
   - View all customer reservations across the platform
   - Update status directly: Confirm, Cancel, Complete
5. **Customer Management (`/admin/customers`)**:
   - View registered customers with total booking count
