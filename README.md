<h1 align="center">
Unity
</h1>

<p align="center">
<img src="./public/logo.png" width="90" alt="logo" />
</p>

<p align="center">
🌍 <b>Empowering Communities, One Connection at a Time</b> 🤝
</p>

## 📋 Overview

Unity is a collaborative platform designed to connect volunteers, organizations, and individuals for social good. The application streamlines event management and volunteering opportunities in a single, user-friendly interface.

## ✨ Features

- 📝 **Event Management**: Create, join, and manage community events.
- 🧑‍🤝‍🧑 **Volunteer Matching**: Find and connect with volunteering opportunities that match your skills.
- 🏢 **Organization Profiles**: Organizations can post events, manage volunteers, and track participation.
- 📍 **Location-Based Discovery**: Find events and organizations near you.
- 🔒 **Authentication**: Secure login and onboarding with Civic Auth.

## 📁 Project Structure

- `src/` — Next.js 15 app directory, React components, and all frontend logic
  - `app/` — Application routes, pages, server actions
  - `components/` — Reusable React components
  - `lib/` — Utilities and database connection logic
  - `models/` — Mongoose models for MongoDB collections
- `public/` — Static assets

## 🛠️ Technologies

- **Web App:** TypeScript, Next.js 15, React 19, Tailwind CSS, ShadCN/UI, Lucide React
- **Database:** MongoDB
- **Authentication:** Civic Auth

## 🎯 Local Setup

### Prerequisites

- Node.js (v22 or higher)
- MongoDB (local or cloud instance)
- Civic Auth account

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd unity
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration (see below for required variables).

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

### Environment Variables

- `MONGODB_URI` — MongoDB connection string
- `CIVIC_AUTH_CLIENT_ID` — Civic Auth client ID

## 🗄️ Mongoose Models

- `User` — User profile and authentication
- `Organization` — Organization details and events
- `Event` — Community event details
- `Volunteer` — Volunteer profile and skills

## 🧩 UI & Styling

- **Tailwind CSS** for utility-first styling
- **ShadCN/UI** for component library
- **Lucide React** for icons

## 🛡️ Authentication

- Civic Auth integration for secure login and onboarding
- Auth-protected routes using Next.js middleware

## 📝 Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Lint codebase

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. 🍴 Fork the repository [here](https://github.com/itskdhere/QuickAid/fork)
2. 🌟 Create your feature branch: `git checkout -b feature/amazing-feature`
3. 💾 Commit your changes: `git commit -m 'Add some amazing feature'`
4. 📤 Push to the branch: `git push origin feature/amazing-feature`
5. 📬 Open a Pull Request

---

<p align="center">
Built with 💜 by Turing Devs at Hack4Bengal 4.0
</p>
