
# 🌐 GuaraníHost – Frontend

Frontend for **GuaraníHost**, a vacation rental platform in Paraguay with integrated tour packages. Built using Vue 3, TypeScript, Tailwind CSS and Axios.

[![Backend Repo](https://img.shields.io/badge/🌐%20Backend-GuaraníHost-blueviolet?style=for-the-badge)](https://github.com/monicaSernaS/guarani_host_backend)

## ✨ Features

- Public and protected views
- Responsive UI (mobile, tablet, desktop)
- Dark/light theme toggle
- Role-based dashboards:
  - Admin: manage all users, properties, bookings, tours
  - Host: manage own listings and reservations
  - User: make reservations and manage profile
- Image upload and preview (to backend/Cloudinary)
- Booking filters, export to PDF/CSV
- Real-time form validation and alerts

## 🛠️ Tech Stack

- **Vue 3** + **TypeScript**
- **Tailwind CSS**
- **Vue Router** + **Pinia**
- **Axios** for HTTP
- **SweetAlert2** for alerts
- **Lucide** for icons

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/youruser/guaranihost.git
cd guaranihost/frontend

# 2. Install dependencies
npm install

# 3. Run locally
npm run dev
```
##⚙️ Environment Variables

Create a .env file and add your backend URL:
```
env
Copiar código
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📂 Project Structure
```
frontend/
├── components/
├── composables/
├── services/
├── views/
├── router/
└── App.vue
```

## 🔐 Authentication

- JWT stored in localStorage

- Global route guards

- Axios interceptors for Authorization headers

## 🧪 Lint & Format
```
# Lint code
npm run lint

# Format with Prettier
npm run format
```
## 📬 Contact

Created by 
[![Iván Martínez - LinkedIn](https://img.shields.io/badge/Iván%20Martínez-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/iv%C3%A1n-mart%C3%ADnez-s%C3%A1nchez/)
&  [![Mónica Serna - LinkedIn](https://img.shields.io/badge/Mónica%20Serna-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/monicasernasantander/)

