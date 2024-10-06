# Mini Loan App

Welcome to the Mini Loan App! This application provides a platform for managing loans for both administrators and clients.

## Features : 
1. User Registration and Loan Request
2. Loan Approval Process
3. Repayment Management
4. Additional Loan Requests

## Cloning the Project from GitHub : 

To clone the Mini Loan App project from GitHub, follow these steps:

1. Open your terminal or command prompt.
2. Navigate to the directory where you want to clone the project.
3. Use the following command to clone the repository:

   ```bash
   git clone https://github.com/your-username/mini-loan-app.git
   
   cd mini-loan-app

### Running on Local Server

If you prefer to run the application locally, follow these steps:

#### Using npm

1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Run the client: `npm run dev`
4. Navigate to the server directory: `cd ../server`
5. Install dependencies: `npm install`
6. Run the server: `nodemon`

Make sure the server is running on Port 5000 and the client on Port 5173.

## Admin Credentials

To upgrade a user to an administrator:

1. Log in using the provided admin credentials.
2. Navigate to the user management section.
3. Select the user you want to upgrade.
4. Modify the user's profile in the MongoDB database, changing the `user_type` field from "user" to "admin".
5. The user will now have administrative privileges and can access the admin features of the application.

Feel free to explore and enjoy managing your loans!
