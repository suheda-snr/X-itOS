# X-itOS - Escape Room Check-In System

<div align="center">

**A tablet-compatible check-in application for escape room management**

[![Expo](https://img.shields.io/badge/Expo-52.0-000020?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-11.5-FFCA28?style=flat&logo=firebase)](https://firebase.google.com)

</div>

---

## 📖 Overview

X-itOS is a comprehensive tablet application designed for escape room facilities. Placed at the entrance of each escape room, this app enables seamless player check-ins via QR code scanning, real-time game monitoring, statistics tracking, and leaderboard management. The system integrates with escape room hardware to monitor puzzle progress and manage hints in real time.

### Related Projects

This project is part of the X-it ecosystem:

- **[X-it Mobile App](https://github.com/oamk-fontys/X-it)** - Social media app for players to track performances, view leaderboards, and connect with other players
- **[X-it Backend](https://github.com/oamk-fontys/X-it-back-end)** - RESTful API backend built with NestJS, PostgreSQL database, and Docker containerization, powering both X-itOS and X-it mobile applications

---

## ✨ Key Features

### Player Management
- 📱 **QR Code Scanning** - Scan pre-purchased tickets and player profile codes
- 👥 **Team Setup** - Add players via account QR codes or as guests
- 🏷️ **Team Naming** - Set custom team names with profanity filtering (max 15 characters)
- 👶 **Age Classification** - Specify child or adult status for guests

### Game Management
- ⏱️ **Real-Time Monitoring** - Track puzzle status and game progress
- 💡 **Hint System** - Admins can send hints to players during gameplay
- 🎮 **Hardware Control** - Control room objects and environmental elements
- ✅ **Game Completion** - Automatic detection of escape success/failure with time tracking

### Statistics & Leaderboards
- 📊 **Performance Tracking** - Record completion times, hints used, and success status
- 🏆 **Top 5 Leaderboard** - Display best performances per room
- 🔐 **Privacy Control** - Players can consent to share statistics (visible in their X-it mobile app profile) or discard all data

### Admin Panel
- 🔑 **Secure Access** - 5-tap activation with company-specific passcode
- 🏢 **Room Configuration** - Assign specific rooms to each tablet
- 🎯 **Company Account Login** - Manage multiple room configurations

---

## 🛠️ Tech Stack

### Frontend (X-itOS)
- **Framework**: [Expo](https://expo.dev) 52.0 with React Native 0.76
- **Language**: TypeScript
- **Routing**: Expo Router (file-based routing)
- **State Management**: Zustand stores
- **UI Components**: Custom components with Lucide icons
- **Camera/QR**: Expo Camera & Barcode Scanner
- **Storage**: Expo Secure Store
- **Additional**: Profanity filter, JWT utilities, haptic feedback

### Backend Infrastructure
- **Primary Backend**: [X-it Backend](https://github.com/oamk-fontys/X-it-back-end)
  - **Framework**: [NestJS](https://nestjs.com) - Progressive Node.js framework
  - **Database**: [PostgreSQL](https://www.postgresql.org) - Relational database for data persistence
  - **Containerization**: [Docker](https://www.docker.com) - Container platform for deployment
  - **API**: RESTful API architecture
  - **Handles**: Authentication, bookings, user management, statistics, leaderboards, company management

- **Hardware Simulation**: Firebase
  - **Database**: Firebase Firestore - Real-time database for room hardware state
  - **Purpose**: Simulates escape room hardware (puzzles, controllable objects, sensors)
  - **Real-time Updates**: Monitors puzzle status and game progress

---

## 📋 Prerequisites

- Node.js 18+ and npm installed
- TypeScript 5.3+
- Expo CLI 
- Android Emulator
- **Primary Backend** - [X-it Backend](https://github.com/oamk-fontys/X-it-back-end) running
  - Docker installed for backend containerization
  - PostgreSQL 14+ (managed via Docker)
  - NestJS backend service running
  - Handles authentication, bookings, statistics, and all business logic
- **Hardware Simulation** - Firebase project with Firestore configured
  - Used exclusively for simulating escape room hardware states
  - Real-time puzzle status and controllable objects

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/oamk-fontys/X-itOS.git
cd X-itOS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

**Important**: Ensure the [X-it Backend](https://github.com/oamk-fontys/X-it-back-end) project is installed and running before starting the development server. Refer to the backend repository for setup instructions.


### 4. Configure Firebase (Hardware Simulation)

**Note**: Firebase is used exclusively for simulating escape room hardware states (puzzles, sensors, controllable objects). All other functionality (authentication, bookings, user data, statistics) is handled by the NestJS backend.

### 5. Start the Development Server

```bash
npx expo start
```
---

## 📁 Project Structure

```
X-itOS/
├── app/                          # Main application screens
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Home/landing screen
│   ├── welcome.tsx              # Welcome screen
│   ├── passcode.tsx             # Admin passcode entry
│   ├── PlayerActions.tsx        # Player management
│   ├── playersinfoadding.tsx   # Add player information
│   ├── [teaminfo].tsx           # Team setup (dynamic route)
│   ├── (auth)/                  # Authentication screens
│   │   └── login.tsx
│   ├── firebase/                # Firebase configuration
│   │   ├── firebaseConfig.js
│   │   └── firebaseAuthApi.js
│   ├── GameStatistics/          # Stats and leaderboards
│   │   ├── [TeamStats].tsx
│   │   └── Leaderboard.tsx
│   ├── QRScanner/               # QR code scanning
│   │   ├── PersonalQR.tsx
│   │   └── TicketQR.tsx
│   └── room/                    # Room management
│       ├── index.tsx
│       ├── [id].tsx             # Room detail (dynamic route)
│       └── map.tsx
├── api/                         # API integration
│   ├── authApi.tsx
│   ├── companyApi.tsx
│   └── gameApi.tsx
├── components/                   # Reusable components
│   ├── GameTimer.tsx
│   ├── Modal.tsx
│   ├── QRScanner.tsx
│   └── elements/                # UI elements
│       ├── Button.tsx
│       ├── IconButton.tsx
│       ├── InputField.tsx
│       └── PasswordInputField.tsx
├── stateStore/                  # Zustand state management
│   ├── authStore.tsx
│   ├── companyStore.tsx
│   └── gameStore.tsx
├── types/                       # TypeScript type definitions
│   ├── authState.tsx
│   ├── booking.tsx
│   ├── company.tsx
│   ├── game.tsx
│   ├── player.tsx
│   └── user.tsx
├── utils/                       # Helper utilities
│   ├── ageUtils.tsx
│   ├── formatTime.tsx
│   ├── jwtUtils.tsx
│   ├── profanity.tsx
│   └── useHintScheduler.tsx
└── styles/                      # Style definitions
    ├── common.tsx
    ├── modal.tsx
    ├── playersInfo.tsx
    ├── qrScannerStyles.tsx
    └── room.tsx
```

---

## 🔒 Security & Validation

- **QR Code Validation**: Tickets can only be scanned once; rooms must be reset before new scans
- **Profanity Filtering**: Team names are validated against inappropriate content
- **Character Limits**: Team names limited to 15 characters
- **Admin Protection**: 5-tap secret activation + company-specific passcode
- **Data Privacy**: Players explicitly consent to statistics storage; accepted statistics are synced to their X-it mobile app profile for viewing and tracking across all escape rooms

---

## 👥 Team

Developed by the OAMK-Fontys team for escape room facility management.

---

<div align="center">

**Built with ❤️**

</div>
