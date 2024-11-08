# Medify - Doctor Appointment Booking System

**Medify** is a comprehensive doctor appointment booking application that serves both patients and admins. It enables patients to book appointments, communicate with admins, and track their appointment status. Admins have the power to manage appointments, respond to patient inquiries, and onboard new doctors and admins. Medify provides a seamless interface for efficient healthcare management and communication.

## 🌟 Features

### For Patients
- **Appointment Booking**: Patients can easily browse available slots and book appointments with their chosen doctor.
- **Messaging**: Patients can send messages to admins, enabling direct communication for inquiries and support.

### For Admins
- **Message Management**: Admins can view and respond to messages sent by patients.
- **Appointment Management**: Admins have the authority to update the status of patient appointments, ensuring smooth and transparent communication.
- **Doctor Management**: Admins can onboard new doctors to expand the network and accommodate more patients.
- **Admin Management**: Ability to add additional admins for distributed management and streamlined operations.

## 🛠️ Tech Stack

- **Frontend**: React ⚛️
- **Backend**: Node.js 🟩, Express 🚀
- **Database**: MongoDB 🍃

## 🚀 Installation Guide

Follow these steps to set up the Vibely project locally for development.

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** and **npm**: [Download and install Node.js](https://nodejs.org/)
- **MongoDB**: Ensure you have a running MongoDB instance, either locally or via [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- **Cloudinary**: Sign up at [Cloudinary](https://cloudinary.com/) and obtain your API credentials for media storage.

### Steps to Install

1. **Clone the Repository**

   Clone the repository to your local machine using Git:

   ```bash
   git clone https://github.com/your-username/medify-appointment-booking.git
   ```
   
2. **Navigate to the Project Directory**

   After cloning the repository in Step 1, change into the project directory:

   ```bash
   cd medify-appointment-booking
   ```
3. **Install Dependencies**

   The Vibely project has separate dependencies for the backend and frontend. You’ll need to install these separately.

   - **Backend dependencies**:

     First, navigate to the backend folder and install all necessary packages by running the following commands:

     ```bash
     cd backend
     npm install
     ```

     This will install all required dependencies for the server-side, such as Express, MongoDB, Socket.IO, and others.

   - **Frontend dependencies**:

     Next, go to the frontend folder and install the dependencies needed for the client-side:

     ```bash
     cd ../frontend
     npm install
     ```
     Then, go to the dashboard folder and install the dependencies needed for the admin dashboard:

     ```bash
     cd ../dashboard
     npm install
     ```

     This will install all required packages for the frontend of patient and admin.

   Once both backend and frontend dependencies are installed, you're ready to configure your environment variables in Step 4.

4. **Environment Setup**

   To configure the necessary environment variables, create a `.env` file inside the `backend` folder. This file will store sensitive information required for the application to connect to external services securely.

   In the `backend/.env` file, add the following configuration:

   ```plaintext
   PORT = 4000

   MONGO_URI= your_mongodb_uri
   FRONTEND_URL = your_frontend_url
   DASHBOARD_URL = your_dashboard_url
   JWT_SECRET_KEY = your_jwt_secret_key
   JWT_EXPIRES = your_jwt_expiration_period
   COOKIE_EXPIRE = your_cookie_expire_period
   CLOUDINARY_CLOUD_NAME = your_cloud_name
   CLOUDINARY_API_SECRET = your_cloudinary_api_secret
   CLOUDINARY_API_KEY = your_cloudinary_api_key
   ```
   Replace each placeholder with your actual values:

   MONGODB_URI: The connection string for your MongoDB database.
   JWT_SECRET: A secret key for signing JSON Web Tokens (choose a strong, unique value).
   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: Your Cloudinary account credentials, used for storing media files.
   PORT: Port number for the backend server to listen on (default is 5000).
   
5. **Starting the Application**

   Now that dependencies are installed and environment variables are configured, you can start both the backend and frontend servers. Open two separate terminals to run each server individually.

   - **Start the backend server**:

     In the first terminal, navigate to the `backend` directory and start the server with the following commands:

     ```bash
     cd backend
     npm run dev
     ```

     This will start the backend server in development mode on the port specified in the `.env` file.

   - **Start the frontend server**:

     In the second terminal, navigate to the `frontend` directory and run the following commands:

     ```bash
     cd frontend
     npm run dev
     ```
     In the third terminal, navigate to the `dashboard` directory and run the following commands:

     ```bash
     cd dashboard
     npm run dev
     ```

     This will launch the frontend and dashboard React application.


