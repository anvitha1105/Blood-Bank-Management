# Blood Bank Management System (BBMS)

A comprehensive full-stack web application for managing blood bank operations, built with Flask backend and modern interactive frontend.

## 🎯 Project Overview

The Blood Bank Management System is a complete solution for managing donors, blood inventory, patient requests, and analytics. It features a stunning modern interface with real-time dashboard, interactive charts, and comprehensive CRUD operations.

### ✨ Key Features

- **Interactive Dashboard** with animated metrics cards and real-time charts
- **Donor Management** with complete CRUD operations and search functionality
- **Blood Inventory Tracking** with low-stock and expiry alerts
- **Patient Request Management** with priority and status tracking
- **Analytics & Charts** using Chart.js for visual data representation
- **CSV Export** functionality for all data tables
- **Responsive Design** that works on all devices
- **Real-time Alerts** for critical situations

## 🏗️ Architecture

### Backend (Flask + PostgreSQL)
- **Flask** with Flask-RESTful for API endpoints
- **SQLAlchemy** for database ORM
- **PostgreSQL** for data persistence
- **Flask-CORS** for cross-origin requests
- **RESTful API** design with JSON responses

### Frontend (Modern Web Technologies)
- **Single-Page Application** with vanilla JavaScript
- **Tailwind CSS** for modern, responsive design
- **Chart.js** for interactive data visualizations
- **Font Awesome** icons for enhanced UI
- **Glass morphism** design with gradients and animations

### Database Schema
- **Donors**: Personal information and donation history
- **Patients**: Patient details and blood requirements
- **Blood Inventory**: Stock levels and expiry tracking
- **Donation Records**: Complete donation history
- **Requests**: Blood requests with status and priority

## 🚀 Zero-Error Setup Guide

### Prerequisites
- Python 3.11 or higher
- PostgreSQL database (automatically configured in Replit)

### Installation Steps

1. **Clone the Repository** (if not already in Replit)
   ```bash
   git clone <repository-url>
   cd blood-bank-management-system
   ```

2. **Install Dependencies**
   ```bash
   pip install flask flask-restful flask-sqlalchemy flask-cors psycopg2-binary
   ```

3. **Database Setup**
   - The PostgreSQL database is automatically configured in Replit
   - Environment variables are automatically set
   - Tables are created automatically on first run

4. **Run the Application**
   
   For Development:
   ```bash
   export SESSION_SECRET="your-dev-secret-key"
   export FLASK_ENV="development"
   export FLASK_DEBUG="true"
   export POPULATE_SAMPLE_DATA="true"
   python main.py
   ```
   
   For Production:
   ```bash
   export SESSION_SECRET="$(openssl rand -hex 32)"
   python main.py
   ```
   
   For Production with Gunicorn (Recommended):
   ```bash
   pip install gunicorn
   gunicorn --bind 0.0.0.0:5000 --workers 4 main:app
   ```

5. **Access the Application**
   - Open your browser and navigate to `http://localhost:5000`
   - The application will automatically populate with sample data

### Environment Variables (Auto-configured in Replit)
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Flask session secret key (REQUIRED - must be a secure random string)
- `FLASK_ENV`: Set to 'development' for development features
- `POPULATE_SAMPLE_DATA`: Set to 'true' to populate with sample data (development only)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Database credentials

## 📚 API Documentation

### Base URL
```
/api
```

### Donors Endpoints

#### GET /api/donors
Get all donors
```json
{
  "donors": [
    {
      "id": 1,
      "name": "John Smith",
      "age": 28,
      "gender": "Male",
      "blood_group": "O+",
      "contact": "555-0101",
      "location": "New York, NY",
      "last_donation_date": "2024-06-24",
      "created_at": "2024-09-24T07:37:27.123456"
    }
  ]
}
```

#### POST /api/donors
Create a new donor
```json
{
  "name": "Jane Doe",
  "age": 30,
  "gender": "Female",
  "blood_group": "A+",
  "contact": "555-0102",
  "location": "Los Angeles, CA",
  "last_donation_date": "2024-08-15"
}
```

#### PUT /api/donors/{id}
Update an existing donor

#### DELETE /api/donors/{id}
Delete a donor

### Inventory Endpoints

#### GET /api/inventory
Get all blood inventory items

#### POST /api/inventory
Add blood units to inventory
```json
{
  "blood_group": "O+",
  "units_available": 10,
  "expiry_date": "2024-12-31"
}
```

#### PUT /api/inventory/{id}
Update inventory item

#### DELETE /api/inventory/{id}
Delete inventory item

### Requests Endpoints

#### GET /api/requests
Get all blood requests

#### POST /api/requests
Create a new blood request
```json
{
  "patient_id": 1,
  "patient_name": "Alice Cooper",
  "blood_group": "O+",
  "units_requested": 2,
  "priority": "High",
  "status": "Pending"
}
```

#### PUT /api/requests/{id}
Update a blood request

#### DELETE /api/requests/{id}
Delete a blood request

### Analytics Endpoint

#### GET /api/dashboard-stats
Get comprehensive dashboard statistics
```json
{
  "summary_cards": {
    "total_donors": 8,
    "total_patients": 5,
    "total_blood_units": 280,
    "pending_requests": 3,
    "critical_requests": 2,
    "recent_donations": 8
  },
  "charts": {
    "blood_group_distribution": {
      "A+": 35,
      "O+": 35,
      "B+": 35
    },
    "monthly_donations": [...],
    "request_status_distribution": {...}
  },
  "alerts": {
    "low_stock": [...],
    "expiry_alerts": [...]
  }
}
```

## 🎮 How to Use

### Dashboard
- **View Key Metrics**: Total donors, patients, blood units, and pending requests
- **Interactive Charts**: Blood group distribution and monthly donation trends
- **Alerts**: Real-time notifications for low stock and expiring blood units

### Donor Management
1. Click **"Donors"** in the navigation
2. **Add New Donor**: Click "Add New Donor" button and fill the form
3. **Search/Filter**: Use search box or blood group filter
4. **Edit/Delete**: Use action buttons in the table
5. **Export**: Click "Export CSV" to download donor data

### Blood Inventory
1. Navigate to **"Inventory"** section
2. **Add Blood Units**: Click "Add Blood Units" and specify details
3. **Monitor Status**: View stock levels and expiry dates
4. **Manage Stock**: Edit or remove inventory items
5. **Track Alerts**: Monitor low stock and expiry warnings

### Blood Requests
1. Go to **"Requests"** section
2. **Create Request**: Click "New Request" and fill patient details
3. **Set Priority**: Choose from Low, Medium, High, or Critical
4. **Update Status**: Change from Pending to Approved/Fulfilled/Rejected
5. **Filter Requests**: Search by patient name or filter by status

### Data Export
- Each section has an **"Export CSV"** button
- Downloads include all visible (filtered) data
- Files are automatically named (donors.csv, inventory.csv, requests.csv)

## 🚀 Production Deployment

### For Production Use
The application is designed to be production-ready. For production deployment:

1. **Environment Configuration**
   - Set `FLASK_DEBUG=false` (default)
   - **MANDATORY**: Set `SESSION_SECRET` to a secure random string (use `openssl rand -hex 32`)
   - Do NOT set `FLASK_ENV=development` or `POPULATE_SAMPLE_DATA=true` in production
   - Use PostgreSQL with proper connection pooling

2. **Recommended Production Setup**
   ```bash
   # Install production WSGI server
   pip install gunicorn
   
   # Set required environment variables
   export SESSION_SECRET="$(openssl rand -hex 32)"
   export DATABASE_URL="your-postgresql-connection-string"
   
   # Run with Gunicorn
   gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 30 main:app
   ```

3. **Security Considerations**
   - Debug mode is disabled by default in production
   - CORS is configured for API security
   - Input validation on all endpoints
   - SQL injection protection via SQLAlchemy ORM

4. **Performance Optimization**
   - Database connection pooling enabled
   - Efficient chart rendering with Chart.js
   - Optimized API responses with pagination support

## 🔧 Technical Details

### File Structure
```
├── main.py                 # Main Flask application
├── backend/
│   ├── database.py         # Database configuration
│   ├── models.py          # SQLAlchemy models
│   ├── resources.py       # API endpoints
│   └── sample_data.py     # Sample data population
├── frontend/
│   ├── index.html         # Single-page application
│   └── scripts.js         # Frontend JavaScript
└── README.md              # This documentation
```

### Key Technologies
- **Backend**: Flask 3.1.2, SQLAlchemy 2.0.43, PostgreSQL
- **Frontend**: Tailwind CSS, Chart.js, Font Awesome, Vanilla JS
- **Database**: PostgreSQL with automatic migrations
- **Deployment**: Configured for Replit with auto-scaling

### Security Features
- **CORS Protection**: Configured for API security
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: SQLAlchemy ORM protection
- **Session Management**: Secure session handling

## 🎨 Design Features

### Visual Elements
- **Glass Morphism**: Modern translucent design elements
- **Gradient Backgrounds**: Beautiful color transitions
- **Animated Cards**: Hover effects and smooth transitions
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Color-coded Status**: Visual indicators for priorities and status

### User Experience
- **Intuitive Navigation**: Clear section-based organization
- **Real-time Feedback**: Success/error notifications
- **Fast Loading**: Optimized for quick response times
- **Accessibility**: Clean typography and color contrast

## 🚦 Status Indicators

### Blood Inventory Status
- **🟢 Good**: Adequate stock with safe expiry dates
- **🟡 Low Stock**: Less than 10 units available
- **🔴 Expiring Soon**: Expires within 7 days

### Request Priority Levels
- **🔴 Critical**: Immediate attention required
- **🟠 High**: High priority
- **🔵 Medium**: Standard priority
- **🟢 Low**: Can wait

### Request Status
- **🟡 Pending**: Awaiting approval
- **🔵 Approved**: Approved but not fulfilled
- **🟢 Fulfilled**: Completed successfully
- **🔴 Rejected**: Request denied

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check environment variables are set correctly
   - Restart the application

2. **CORS Errors**
   - CORS is automatically configured
   - Check if frontend is served from the same domain

3. **Sample Data Not Loading**
   - Check database permissions
   - Review application logs for errors
   - Ensure database tables are created

### Performance Tips
- The application automatically handles database connection pooling
- Charts are optimized for smooth animations
- Data is cached efficiently for better performance

## 📝 Development Notes

This application is designed to work perfectly out-of-the-box without any login or authentication requirements. It's a complete demonstration of a modern blood bank management system with real functionality and beautiful design.

The codebase is well-commented and follows best practices for both frontend and backend development. All features are implemented with error handling and user-friendly feedback.

## 📄 License

This project is created for educational and demonstration purposes. Feel free to use and modify as needed.

---

**Blood Bank Management System** - Saving lives through technology 🩸❤️