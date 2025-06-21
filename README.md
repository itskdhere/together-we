# QuickAid

[![Docker Build Check](https://github.com/itskdhere/QuickAid/actions/workflows/docker_build_check.yml/badge.svg)](https://github.com/itskdhere/QuickAid/actions/workflows/docker_build_check.yml)
[![Release Docker Images](https://github.com/itskdhere/QuickAid/actions/workflows/release.yml/badge.svg)](https://github.com/itskdhere/QuickAid/actions/workflows/release.yml)

🤖 AI-Powered Medical Assistance at Your Fingertips 💊

## 📋 Overview

QuickAid is a comprehensive healthcare platform designed to provide immediate medical assistance and community support. The application combines AI-powered medical advice, emergency services access, community support, and health resources in one easy-to-use platform.

## ✨ Features

- 🩺 **Self Diagnostics**: Get AI-powered symptoms analysis and preliminary guidance.
- 📍 **Find Nearby**: Locate the closest hospitals, clinics, and emergency services in your area.
- 🚨 **Emergency Assistance** - Get ambulance services with your exact location details.
- 👥 **Community Support**: Connect with others and share health-related experiences.
- 💡 **Health Tips**: Get personalized health tips and advice based on your profile.
- 📞 **Emergency Contacts**: Quick access to emergency contacts and helplines.

## 📁 Project Structure

- 🧠 **ai**: Python-based AI RAG service using Flask, Google Generative AI and Sentence-Transformers for medical assistance.
- 💻 **client**: React frontend built with TypeScript, Vite, Tailwind CSS, and ShadCN/UI components.
- 📃 **docs**: Documentation for the project.
- ⚙️ **etc**: Nginx configuration, SSL certificates, and other configuration files.
- 🗄️ **server**: Node.js backend with Express, TypeScript, MongoDB, authentication, and API routes.
- 🏗️ **terraform**: Infrastructure as Code for deployment to Google Cloud Platform.
- 🐳 **docker-compose.yml**: Docker Compose file for production deployment.

## 🛠️ Technologies

- 🎨 **Frontend:** TypeScript, Vite, React 18, React Router, Tailwind CSS, ShadCN/UI, Framer Motion, Lucide React, Axios.

- 🔧 **Backend:** TypeScript, Node.js, Express.js, Passport.js, JWT, Bcrypt, Axios, Mongoose ODM, AI SDK, Zod, DotEnv, ESbuild.

- 🌐 **APIs:** Gemini API, Google Maps API.

- 🗃️ **Database:** MongoDB.

- 🤖 **AI:** Python, Flask, Sentence-Transformers, Vertex AI, BigQuery.

- 🚀 **DevOps**: Nginx, Docker, Docker Compose, Terraform, Google Cloud Platform, GitHub Actions, Docker Hub.

## 🎯 Local Setup

### 📋 Prerequisites

- 🟢 Node.js (v22 or higher)
- 🐍 Python (v3.13 or higher)
- 🗃️ MongoDB (local or cloud instance)
- ☁️ Google Cloud Platform (with billing enabled)
- 🐳 Docker and Docker Compose (optional)

### ⚙️ Installation & Setup

1. 📥 Clone the repository:

   ```bash
   git clone https://github.com/itskdhere/QuickAid.git
   cd QuickAid
   ```

2. 🔧 Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration.

3. 🐳 Start the development environment with Docker:
   ```bash
   docker compose up -d
   ```

**Or,** Run Individual Services:

- 💻 Frontend

  ```bash
  cd client
  npm install
  ```

  ```bash
  npm run dev
  ```

- 🗄️ Backend

  ```bash
  cd server
  npm install
  ```

  ```bash
  npm run dev
  ```

- 🧠 AI Service

  ```bash
  cd ai
  pip install -r requirements.txt
  python setup.py
  ```

  ```bash
  python app.py
  ```

## 🚀 Deployment

The application can be deployed using Terraform to Google Cloud Platform.

```bash
cd terraform
terraform init
terraform plan
```

```bash
terraform apply
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. 🍴 Fork the repository [here](https://github.com/itskdhere/QuickAid/fork)
2. 🌟 Create your feature branch: `git checkout -b feature/amazing-feature`
3. 💾 Commit your changes: `git commit -m 'Add some amazing feature'`
4. 📤 Push to the branch: `git push origin feature/amazing-feature`
5. 📬 Open a Pull Request

---

<p align="center">
Built with 💜 by Turing Devs
</p>
