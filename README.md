# Unity

🌍 **Empowering Communities, One Connection at a Time** 🤝

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
  - `app/` — Application routes and pages
  - `components/` — Reusable React components
  - `lib/` — Utilities and database connection logic
  - `models/` — Mongoose models for MongoDB collections
- `public/` — Static assets

## 🛠️ Technologies

- **Frontend:** TypeScript, Next.js 15, React 19, Tailwind CSS, ShadCN/UI, Lucide React
- **Backend:** Next.js API Routes, Mongoose ODM, Civic Auth
- **Database:** MongoDB

## 🎯 Local Setup

### Prerequisites

- Node.js (v22 or higher)
- MongoDB (local or cloud instance)

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
- `Conversation` & `Message` — Messaging between users

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

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](LICENSE)
