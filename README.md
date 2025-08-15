

# OnBoarding APP

A full-stack onboarding wizard web application built with React, Tailwind CSS, and Node.js/Express backend. The app allows users to sign up, log in, and complete a multi-step onboarding form. Admins can configure the steps and form components dynamically.







## Features


User Authentication: Sign up and login with email and password.

Multi-Step Onboarding: Users complete steps with forms like About Me, Address, and Birthdate.

Dynamic Form Configuration: Admins can manage which components appear on each step.

Persistent Progress: User progress is saved in the backend.

Data Table: Admins can view submitted user data in a table with all form fields.

Responsive UI: Built with Tailwind CSS for a smooth experience on all devices.

API Integration: All API calls are centralized in a dedicated file for cleaner code.



## Tech Stack

**Client:** React, Tailwind CSS, Vite

**Server:** Node.js, Express, MongoDB

**HTTP Client:** Axios

**Notifications:** Custom Toast component

**Deployment:** Vercel (frontend) / Render (backend)
# Environment Variables

    To run this project, you will need to add the following environment variables to your .env file
    Create a .env file in the root of the frontend and backend with the following:

## Frontend
`VITE_API_BASE_URL`=https://your-backend-url.com

## Backend 
`MONGO_URI`=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dbname


# To-Do (Future Enhancements)
    Enhance App Security:
    Implement JWT tokens.
    Improve Error Handling:
    Make error messages more descriptive to enhance the user experience.

# Additional Features:
    Add more dynamic form components.
    Improve admin panel.