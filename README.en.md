# Out Catering - Catering Quote System

A premium catering service quote inquiry and AI consultation system.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- (Optional) Chroma Vector DB

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with actual values (GEMINI_API_KEY, MONGODB_URI, etc.)

# Start development server
npm run dev
```

## 📁 Project Structure

```
out_catering/
├── client/                 # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── styles/         # CSS styles
│   └── index.html
├── server/                 # Backend (Express + TypeScript)
│   ├── routes/             # API routes
│   └── services/           # Business logic
├── shared/                 # Shared types
└── package.json
```

## 🎨 Key Features

### Customer-facing
- ✨ Luxury pastel design
- 💬 24/7 AI chatbot consultation
- 📝 Quote inquiry form
- 📞 Contact and service information

### Admin Dashboard (/admin)
- 📊 Dashboard with statistics
- 📁 Document/Vector DB management
- 👥 Customer management
- 📝 Inquiry/Reservation management
- 📢 Notice board management

## 🔧 Tech Stack

| Area | Technology |
|------|------------|
| Frontend | React, TypeScript, Vite |
| Backend | Express, TypeScript |
| Database | MongoDB |
| AI | Google Gemini |
| Vector DB | Chroma |

## 📄 API Endpoints

- `POST /api/chat` - AI chatbot conversation
- `POST /api/inquiries` - Submit quote inquiry
- `POST /api/documents/upload` - Upload document
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics

## 🔐 Default Admin Account

- Username: `admin`
- Password: `admin1234`

## 📜 License

MIT License
