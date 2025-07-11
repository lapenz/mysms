# MySMS Messenger

A full-stack SMS messaging application that allows users to send and receive SMS messages through a modern web interface.

<img width="1478" height="844" alt="Screenshot 2025-07-11 at 2 14 18 PM" src="https://github.com/user-attachments/assets/d35fe480-2e27-44d6-b628-9c9688eae15a" />

## 🚀 Features

- **Send SMS Messages**: Send text messages to any phone number
- **Receive SMS Messages**: Get real-time notifications for incoming messages
- **User Authentication**: Secure login and registration with JWT tokens
- **Message History**: View all sent and received messages with visual distinction
- **Real-time Updates**: Automatic polling for new messages every 5 seconds
- **Visual Notifications**: Smooth animations and sound alerts for new messages
- **Responsive Design**: Modern UI that works on desktop and mobile

## 🏗️ Architecture

### Backend (Rails API)
- **Framework**: Ruby on Rails 8.0.2 (API mode)
- **Database**: MongoDB with Mongoid ODM
- **Authentication**: Devise with JWT tokens
- **SMS Service**: Twilio API integration
- **Webhooks**: Receives incoming SMS from Twilio

### Frontend (Angular)
- **Framework**: Angular 18 with standalone components
- **UI Library**: Angular Material
- **Authentication**: JWT token management
- **Real-time**: Polling-based updates
- **Styling**: Modern CSS with animations

## 🛠️ Tech Stack

### Backend
- Ruby 3.3.5
- Rails 8.0.2
- MongoDB
- Mongoid
- Devise + devise-jwt
- Twilio SDK
- Puma web server

### Frontend
- Angular 18
- Angular Material
- TypeScript
- RxJS
- Modern CSS

## 📁 Project Structure

```
mysms/
├── mysms-backend/          # Rails API
│   ├── app/
│   │   ├── controllers/    # API endpoints
│   │   ├── models/         # MongoDB models
│   │   └── ...
│   ├── config/             # Rails configuration
│   └── ...
├── mysms-frontend/         # Angular app
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # UI components
│   │   │   ├── services/   # API services
│   │   │   └── ...
│   │   └── ...
│   └── ...
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Ruby 3.3.5
- Node.js 18+
- MongoDB
- Twilio account

### Backend Setup
```bash
cd mysms-backend
bundle install
cp .env.example .env  # Configure your environment variables
rails db:create
rails db:seed
rails server
```

### Frontend Setup
```bash
cd mysms-frontend
npm install
ng serve
```

### Environment Variables
Create a `.env` file in `mysms-backend/` with:
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## 🔧 Configuration

### Twilio Setup
1. Create a Twilio account
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Configure webhook URL: `https://your-domain.com/messages/webhook`

### MongoDB
- Install and start MongoDB
- The app will automatically create the database on first run

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Send Messages**: Use the message form to send SMS
3. **View History**: See all messages with visual distinction
4. **Real-time Updates**: New messages appear automatically
5. **Notifications**: Get sound and visual alerts for incoming messages

## 🎨 UI Features

- **Message Types**: Green styling for sent messages, blue for received
- **Animations**: Smooth pulse effects for new messages
- **Responsive**: Works on all screen sizes
- **Modern Design**: Clean, professional interface

## 🔒 Security

- JWT token authentication
- Secure password hashing with Devise
- CORS configuration for frontend
- Environment variable protection

## 📊 API Endpoints

- `POST /users/sign_up` - User registration
- `POST /users/sign_in` - User login
- `GET /messages` - Get user messages
- `POST /messages` - Send new message
- `POST /messages/webhook` - Twilio webhook (incoming SMS)

