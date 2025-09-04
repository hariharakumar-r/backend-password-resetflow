# Password Reset Flow - BackEnd - MERN Stack -Guvi Zen Class Project
This is a BackEnd repo consists Password Reset Flow App Using Node JS [MERN]. 

## Render Deployment URL

I have attached the link for the Base URL of the Deployment. Along with the link use routes to generate the API Calls.
[BackendBaseURL](https://passwordresetflowfsdbackend.onrender.com)

## Postman Documentation URL
[Postman Documentation URL:](https://documenter.getpostman.com/view/38692959/2sAYBXDC7E)


## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Deployment](#deployment)


## Features
- **User Registration**: Register new users with hashed passwords. 
- **User Login**: Authenticate users and issue JWTs for authorized access.
- **JWT-Based Authorization**: Protect routes using httpOnly tokens.
- **Secure User Info Retrieval**: Users can retrieve their information using valid tokens.
- **Error Handling and Validation**: Proper error messages and input validations.
- **API Documentation**: Detailed documentation using Postman, with sample requests and responses.

## Tech Stack
- **Node.js**: JavaScript runtime for server-side applications.
- **Express.js**: Minimalist web framework for Node.js.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT**: JSON Web Token for secure token-based authentication.
- **Postman**: API testing and documentation.
- **NodeMailer** : To Generate Email after Successful registration and Reset Password. 

## Setup and Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yourrepository.git
   cd yourrepository

2. Install dependencies:

    ```bash 
    npm install express
    npm install bcrypt
    npm install nodemon --save-dev
    npm install cookie-parser
    npm install dotenv
    npm install jsonwebtoken 
    npm install mongoose
    npm install body-parser
    npm install nodemailer

3. Setting up environment variables .
4. Run the Application
    ```bash
    npm run dev   // In VS Code
    npm start     // In Server Deployment

## Environment Variables

Both of these values were put under .gitignore concerning security.

- **MongoDB Database URL** - The URL for the database stored in Atlas
- **Secret Key** - Which is used in hashing the token in token encryption and decryption phase. 
- **Email ID** - Sender Email ID
- **Password App** -Sender Password - It can be fetched in Gmail App Passwords.



## Folder Structure

.

├── controllers      # Contains controller functions

├── models           # Contains Mongoose models

├── routes           # Defines routes for the application

├── utils            # Middleware for JWT token verification

├── index.js         # Basefile (e.g., database connection)

└── README.md        # Project documentation

## API Endpoints

1. ` POST /api/v1/register` **Register a User**: Send a POST request to `/api/v1/register` with JSON payload containing username, email, and password.
2. `POST /api/v1/login` **Login User**: Send a POST request to `/api/v1/login` with username and password. You’ll receive a JWT if credentials are valid.
3.  `GET /api/v1/userInfo` **Access Protected Routes - Personal Information**: Send requests to protected routes with `Authorization: httpOnly-cookie <token>` `WithCredintials:True` after logging in to get the information of the logged in user. 
4. `POST api/v1/signout` **Logout User**: Send a POST request to `api/v1/signout`. It clears the token which is stored in the browser and logged out from the browser. If it is logged out, then we can't use the protected route `api/v1/userInfo`.
5.  `POST /api/v1/resetPassword` **Reset Password** : It is used to reset the password.It is used to generate a token which will be used to create a new password. 
5.  `POST /api/v1/setNewPassword` **Set New Password** : After generating a token, you can input the token as key and new password to create a new password.

> [!NOTE]
> The First two routes ***Register*** and ***Login*** are public routes. The remaining are protected routes. Unless you logged in from the browser, you cannot access those protected routes.

## Deployment

The application can be deployed to Render for public access.

1. Pushed the code to GitHub.
2. Deployed the application by connecting our GitHub repository to Render.
3. Use the [Render URL](https://passwordresetflowfsdbackend.onrender.com) to access your deployed API."# backend-password-resetflow" 
"# backend-password-resetflow" 
