# Personal Website for Hannah

This repository hosts the code for **Hannah's website** built with a **TypeScript React frontend** and a **Django REST framework backend**. It incorporates modern web development practices, smooth animations, and dynamic content rendering.

## 🚀 Features

### 🌟 Core Functionality

- **Stunning Spring and Parallax Effects Using react-spring-parallax:** Inspired by Apple, leverage the power of react-spring-parallax to create visually stunning spring and parallax effects. This library allows for smooth, physics-based animations and interactive scrolling experiences, providing users with a dynamic and engaging interface. Implement fluid transitions between elements, ensuring the animations are not just visually appealing but also enhance usability and navigation.

- **3D World with three.js and Texture Mapping:** Utilize three.js to craft immersive 3D environments that captivate users. Enhance realism with texture mapping, adding detailed surfaces to 3D models. This approach allows for the creation of interactive and visually compelling scenes, providing users with a deeply engaging and immersive experience. From simple models to complex worlds, three.js ensures robust and scalable 3D rendering.

- **Robust navbar Inspired by OpenAI Logic:** Design a modern and intuitive navbar based on OpenAI's user-friendly principles. This approach prioritizes seamless user experience, ensuring that navigation feels natural and responsive. By combining advanced logic with a clean aesthetic, the navbar enhances usability while maintaining a minimalist design.

- **Dynamic Data with No Frontend Hardcoding:** Eliminate hardcoded frontend data by fetching all content dynamically from the backend. This ensures that the user interface is always up-to-date, reflecting the latest changes and interactions. By decoupling the frontend and backend, this approach enables greater flexibility, scalability, and easier maintenance. Dynamic rendering guarantees content updates in real-time, enhancing both user experience and operational efficiency.

- **AI-Powered Search and Feedback Analysis:** Leverage AI to analyze user feedback and enable intelligent search capabilities.
- **Multiple Login Options:**
  - Email + Password
  - Username + Password
  - Username + Email
- **Smooth Animations:** Create a polished, user-friendly experience with subtle, smooth animations.
- **Dynamic Rendering:** Ensure content dynamically updates to reflect user interactions and backend data changes.
- **Markdown with Emojis and Responses:** Add rich content by supporting markdown input, including emojis and styled responses.

---

## 🛠️ Tech Stack

### Frontend

- **Language:** TypeScript
- **Framework:** React
- **Libraries:**
  - **React Router DOM:** For client-side routing.
  - **Axios:** For HTTP requests to the backend.
  - **JWTDecode:** For handling JSON Web Tokens.
  - **React Spring:** For spring animation and parallax effect, make content more life like.
  - **three.js:** For the creation of 3D pages, integrated by useEffect and useRef from react.
- **Styling:** Native CSS with nested selectors for better organization and maintainability.

### Backend

- **Language:** Python
- **Framework:** Django with Django REST framework for building RESTful APIs.
- **Libraries:**
  - **matplotlib** For creating visualization directly in the backend.
  - **pandas** For simpler processing matplotlib.
  - **numpy** For mathematical computations.
  - **httpx** For sending asynchronous requests to third party apis.

---

## 📂 File Structure

### Frontend (`/frontend`)

## ⚙️ Installation and Setup

### Prerequisites

Ensure the following tools are installed on your machine:

- **Node.js** and **npm** (or **yarn**) for frontend development
- **Python 3.10+** and **pip** for backend development
- **Django** and **Django REST Framework**

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

### Frontend Tools

- Stunning Animation, both 2D and 3D
- Robust API communication with multiple layer of protections with axios
- Handing writing CSS instead of genetic ones, integrates with typescript via documents selector

### Backend Tools

- Django REST Framework for scalable API development.
- Httpx for fast, asynchronous requests.
- Matplotlib for data visualizations
