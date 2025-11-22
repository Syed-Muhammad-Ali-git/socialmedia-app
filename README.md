# Social Network Web Application

## Project Overview

This is a simple social network web application prototype that enables user registration, login, posting content (text and images), commenting, liking posts, and managing user avatars. It is a client-side application that uses localStorage for data persistence.

## Main Features

- User Registration and Login with form validation
- User session maintained via localStorage
- Create posts with text and optional image upload
- View posts with author info, timestamps, likes, and comments
- Edit and delete posts and comments owned by the current user
- Upload and remove user profile avatars
- Quick Links sidebar for navigation
- Responsive layout with sidebar toggling on small screens
- Notifications and confirmation dialogs using SweetAlert2
- Simple time ago formatting for post timestamps

## Project Structure

### HTML

- `index.html`: Main landing page showing user’s feed and post creation UI.
- `loginform/login.html`: Login form page (scripts included here for login form handling).
- `sign-inform/signin.html`: Signup form page (scripts included here for registration handling).

### CSS

- All CSS files are under `assets/css/`
- `style.css`: Main stylesheet for the application styling.
- `login.css` and `signup.css`: Styles for login and signup pages respectively.

### JavaScript

- `assets/js/app.js`: Main application logic for home page, including posts, comments, avatars, UI behaviors.
- `assets/js/login.js`: Handles login page form validation and submission.
- `assets/js/signin.js`: Handles signup page form validation and submission.

### Libraries

- Bootstrap for responsive styling and UI components.
- Font Awesome for icons.
- SweetAlert2 for modals and alerts.

## How It Works

- When a user visits the login page, they can enter their credentials to log in or navigate to the signup page.
- On signup, user data is saved to localStorage and the user is auto-logged in.
- Upon successful login, users are redirected to the main page (`index.html`).
- Users can create posts with text and images. Posts are saved in localStorage.
- Users can like, comment, edit, and delete their own posts and comments.
- User profile avatars can be uploaded, previewed, and removed.
- Posts display author info and timestamps formatted as relative time (e.g., "2 hours ago").
- UI includes responsive navigation and sidebar toggling for better usability on small devices.

## How to Run

1. Open `loginform/login.html` in a browser to log in.
2. Open `sign-inform/signin.html` to register a new account.
3. After logging in, `index.html` serves as the main application screen.
4. No backend server is required; this is a fully client-side app using browser localStorage.

## Notes

- All data is stored locally in the browser's localStorage; clearing browser data will erase users and posts.
- Image uploads are handled as base64 data URLs stored in localStorage.
- This is a prototype and not meant for production use.

## Future Improvements

- Implement server-side backend and database for persistence.
- Add real authentication and security features.
- Improve UI/UX and accessibility.
- Add friend and notification systems.

---

_Created by Syed Muhammad ALi, Social Network Demo Project._
