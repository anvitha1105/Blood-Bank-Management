from datetime import datetime
from sqlalchemy import Integer, String, Date, DateTime, Text, Enum
from sqlalchemy.orm import Mapped, mapped_column
from backend.database import db

class Donor(db.Model):
    __tablename__ = 'donors'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[str] = mapped_column(Enum('Male', 'Female', 'Other', name='gender_enum'), nullable=False)
    blood_group: Mapped[str] = mapped_column(Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', name='blood_group_enum'), nullable=False)
    contact: Mapped[str] = mapped_column(String(15), nullable=False)
    location: Mapped[str] = mapped_column(String(200), nullable=False)
    last_donation_date: Mapped[datetime] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'gender': self.gender,
            'blood_group': self.blood_group,
            'contact': self.contact,
            'location': self.location,
            'last_donation_date': self.last_donation_date.isoformat() if self.last_donation_date else None,
            'created_at': self.created_at.isoformat()
        }

class Patient(db.Model):
    __tablename__ = 'patients'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    blood_group: Mapped[str] = mapped_column(Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', name='patient_blood_group_enum'), nullable=False)
    contact: Mapped[str] = mapped_column(String(15), nullable=False)
    location: Mapped[str] = mapped_column(String(200), nullable=False)
    units_needed: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'blood_group': self.blood_group,
            'contact': self.contact,
            'location': self.location,
            'units_needed': self.units_needed,
            'created_at': self.created_at.isoformat()
        }

class BloodInventory(db.Model):
    __tablename__ = 'blood_inventory'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    blood_group: Mapped[str] = mapped_column(Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', name='inventory_blood_group_enum'), nullable=False)
    units_available: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    expiry_date: Mapped[datetime] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'blood_group': self.blood_group,
            'units_available': self.units_available,
            'expiry_date': self.expiry_date.isoformat(),
            'created_at': self.created_at.isoformat()
        }

class DonationRecord(db.Model):
    __tablename__ = 'donation_records'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    donor_id: Mapped[int] = mapped_column(Integer, nullable=False)
    donor_name: Mapped[str] = mapped_column(String(100), nullable=False)
    blood_group: Mapped[str] = mapped_column(Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', name='donation_blood_group_enum'), nullable=False)
    date_of_donation: Mapped[datetime] = mapped_column(Date, nullable=False, default=datetime.utcnow)
    units_donated: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'donor_id': self.donor_id,
            'donor_name': self.donor_name,
            'blood_group': self.blood_group,
            'date_of_donation': self.date_of_donation.isoformat(),
            'units_donated': self.units_donated,
            'created_at': self.created_at.isoformat()
        }

class Request(db.Model):
    __tablename__ = 'requests'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    patient_id: Mapped[int] = mapped_column(Integer, nullable=False)
    patient_name: Mapped[str] = mapped_column(String(100), nullable=False)
    blood_group: Mapped[str] = mapped_column(Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', name='request_blood_group_enum'), nullable=False)
    units_requested: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[datetime] = mapped_column(Date, nullable=False, default=datetime.utcnow)
    status: Mapped[str] = mapped_column(Enum('Pending', 'Approved', 'Fulfilled', 'Rejected', name='request_status_enum'), nullable=False, default='Pending')
    priority: Mapped[str] = mapped_column(Enum('Low', 'Medium', 'High', 'Critical', name='priority_enum'), nullable=False, default='Medium')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'patient_name': self.patient_name,
            'blood_group': self.blood_group,
            'units_requested': self.units_requested,
            'date': self.date.isoformat(),
            'status': self.status,
            'priority': self.priority,
            'created_at': self.created_at.isoformat()
        }