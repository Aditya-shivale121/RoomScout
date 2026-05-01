# RoomScout 🏠

A platform that helps students discover PG accommodations based on real location data, user reviews, and owner-managed listings.

Built as a full-stack application to simulate a real-world rental system with authentication, geolocation, and media handling.

---

## 🌐 Live Demo

[https://roomscout.onrender.com/](https://roomscout.onrender.com/)

---

## ✨ Features

### Core Functionality

* User authentication (signup/login/logout using Passport.js)
* Create, edit, and delete PG listings
* View all listings and individual listing details
* Add and delete reviews with ratings
* Image upload support (Cloudinary with local fallback)
* Location-based data using geocoding (GeoJSON)

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB with Mongoose
* Passport.js (authentication)
* Joi (validation)
* Cloudinary (image storage)

### Frontend

* EJS (template engine)
* Vanilla CSS
* JavaScript

---

## 📂 Project Structure

```
RoomScout/
├── models/        # Database schemas (User, Listing, Review)
├── controllers/   # Business logic
├── routes/        # API route definitions
├── views/         # EJS templates
├── public/        # Static files (CSS, JS, images)
├── utils/         # Helper functions
├── middleware.js  # Custom middleware
├── schema.js      # Joi validation schemas
├── app.js         # Main server file
```

---

## 🔐 Key Concepts Implemented

* Authentication and session management using Passport.js
* Authorization (only owners can edit/delete listings)
* RESTful routing
* Server-side validation using Joi
* Error handling using custom middleware
* MVC pattern for code organization

---

## 🧠 Design Decisions

* Used MVC architecture to keep code modular and maintainable
* Implemented server-side validation to prevent invalid data
* Used GeoJSON format for storing location to enable location-based queries
* Designed ownership-based authorization for secure data control

---

## 🚀 Getting Started

### Prerequisites

* Node.js
* MongoDB Atlas or local MongoDB

### Installation

```bash
git clone https://github.com/Aditya-shivale121/RoomScout.git
cd RoomScout
npm install
```

### Environment Setup

Create a `.env` file:

```env
ATLASDB_URL=your_mongodb_connection
SESSION_SECRET=your_secret_key

# Optional
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Run the app

```bash
npm start
```

App will run on:

```
http://localhost:3000
```

---

## 📌 What I Learned

* Designing and structuring a full-stack application using MVC
* Implementing authentication and authorization securely
* Handling file uploads and integrating third-party services
* Managing relational data in MongoDB using references
* Writing cleaner backend logic with middleware and validation

---

## 👤 Author

Aditya Shivale

GitHub: [https://github.com/Aditya-shivale121](https://github.com/Aditya-shivale121)

---
