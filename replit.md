# Blood Bank Management System (BBMS)

## Overview

A production-ready, comprehensive full-stack web application for managing blood bank operations, featuring donor management, blood inventory tracking, patient request handling, and real-time analytics. The system provides an interactive dashboard with animated metrics, comprehensive CRUD operations, modern responsive design, and enterprise-grade security for efficient blood bank administration. Ready for deployment with proper security configurations and production WSGI server support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Flask Framework**: RESTful API server with Flask-RESTful for structured endpoint management
- **Database Layer**: SQLAlchemy ORM with PostgreSQL for data persistence, featuring automated table creation and sample data population
- **API Design**: JSON-based REST endpoints following standard CRUD patterns for all entities (donors, patients, inventory, requests, donations)
- **Session Management**: Environment-based secret key configuration for secure session handling
- **Cross-Origin Support**: CORS enabled for frontend-backend communication

### Frontend Architecture
- **Single-Page Application**: Vanilla JavaScript with dynamic section switching and real-time data updates
- **Responsive Design**: Tailwind CSS framework with glass morphism effects and gradient backgrounds
- **Component Structure**: Modular JavaScript functions for data management, filtering, and UI interactions
- **State Management**: Global data storage with real-time synchronization between frontend and backend

### Database Schema
- **Donors**: Complete donor profiles with donation history tracking
- **Patients**: Patient information with blood requirements
- **Blood Inventory**: Stock levels with expiry date monitoring
- **Donation Records**: Historical donation tracking linked to donors
- **Requests**: Blood request management with status and priority tracking

### Data Flow Architecture
- **Real-time Dashboard**: Live metrics with Chart.js visualizations for blood group distribution and donation trends
- **Search & Filter System**: Client-side filtering for all data tables with multiple criteria support
- **CRUD Operations**: Complete create, read, update, delete functionality for all entities
- **Export Functionality**: CSV export capabilities for data analysis and reporting

### Security & Configuration
- **Production-Safe Configuration**: Mandatory SESSION_SECRET enforcement with no fallback to insecure defaults
- **Environment-Based Data Seeding**: Sample data population only in development mode via explicit flags
- **Connection Pooling**: Database connection optimization with pool recycling and pre-ping validation
- **CORS Security**: Configured cross-origin policies for API access control
- **Error Handling**: Comprehensive error management with rollback support for failed transactions
- **Production Deployment**: Ready for Gunicorn/WSGI deployment with security best practices

## External Dependencies

### Backend Dependencies
- **Flask**: Web framework for API development
- **Flask-RESTful**: RESTful API extension for structured endpoint creation
- **Flask-CORS**: Cross-origin resource sharing support
- **SQLAlchemy**: Database ORM for PostgreSQL integration
- **PostgreSQL**: Primary database for data persistence

### Frontend Dependencies
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Chart.js**: Interactive chart library for data visualization
- **Font Awesome**: Icon library for enhanced user interface

### Development Environment
- **Replit Platform**: Cloud-based development and deployment environment
- **PostgreSQL Database**: Automatically configured database service in Replit environment