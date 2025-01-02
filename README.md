# Personal Website for Hannah!

This repository hosts the code for **Hannah's website** built with a **TypeScript React frontend** and a **Django REST framework backend**. It incorporates modern web development practices, smooth animations, and dynamic content rendering.

## 🚀 Features

### 🌟 Core Functionality

-   **AI-Powered Search and Feedback Analysis:** Leverage AI to analyze user feedback and enable intelligent search capabilities.
-   **Multiple Login Options:**
    -   Email + Password
    -   Username + Password
    -   Username + Email
-   **Smooth Animations:** Create a polished, user-friendly experience with subtle, smooth animations.
-   **Dynamic Rendering:** Ensure content dynamically updates to reflect user interactions and backend data changes.
-   **Markdown with Emojis and Responses:** Add rich content by supporting markdown input, including emojis and styled responses.

---

## 🛠️ Tech Stack

### Frontend

-   **Language:** TypeScript
-   **Framework:** React
-   **Libraries:**
    -   **React Router DOM:** For client-side routing.
    -   **Axios:** For HTTP requests to the backend.
    -   **JWTDecode:** For handling JSON Web Tokens.
-   **Styling:** Native CSS with nested selectors for better organization and maintainability.

### Backend

-   **Language:** Python
-   **Framework:** Django with Django REST framework for building RESTful APIs.

---

## 📂 File Structure

### Frontend (`/frontend`)

## ⚙️ Installation and Setup

### Prerequisites

Ensure the following tools are installed on your machine:

-   **Node.js** and **npm** (or **yarn**) for frontend development
-   **Python 3.10+** and **pip** for backend development
-   **Django** and **Django REST Framework**

### Steps to Run

1. **Clone the repository:**

    ```zsh
    git clone https://github.com/kevin-panoptic-dev/hannah-site
    ```

2. **Set up the backend**

    ```zsh
    cd backend
    python -m venv env
    source env/bin/activate
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```

3. **Set up the frontend**
    ```zsh
    cd frontend
    npm install
    npm install axios jwt-decode react-router-dom
    npm run dev
    ```

## 📖 Usage

1. **Authentication:**

    - Choose from multiple login options (email + password, username + password, or username + email).
    - Secure your sessions with JWT.

2. **AI Search:**

    - Use intelligent search to find relevant content quickly.
    - Analyze feedback for actionable insights.

3. **Dynamic Features:**
    - Add and view responses enriched with emojis and markdown.
    - Experience smooth animations and real-time updates.

---

## 📚 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add a feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## 💻 Tech Highlights

### Frontend Tools:

-   React Router DOM for seamless navigation.
-   Axios for API communication with the Django backend.
-   CSS with nesting for a clean, structured style.

### Backend Tools:

-   Django REST Framework for scalable API development.
