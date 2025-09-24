from datetime import datetime, date, timedelta
from backend.database import db
from backend.models import Donor, Patient, BloodInventory, DonationRecord, Request

def populate_sample_data():
    """Populate the database with sample data if tables are empty"""
    
    # Check if data already exists
    if Donor.query.first() is not None:
        return
    
    try:
        # Sample Donors
        donors_data = [
            {'name': 'John Smith', 'age': 28, 'gender': 'Male', 'blood_group': 'O+', 'contact': '555-0101', 'location': 'New York, NY', 'last_donation_date': date.today() - timedelta(days=90)},
            {'name': 'Emily Johnson', 'age': 34, 'gender': 'Female', 'blood_group': 'A+', 'contact': '555-0102', 'location': 'Los Angeles, CA', 'last_donation_date': date.today() - timedelta(days=45)},
            {'name': 'Michael Brown', 'age': 42, 'gender': 'Male', 'blood_group': 'B+', 'contact': '555-0103', 'location': 'Chicago, IL', 'last_donation_date': date.today() - timedelta(days=60)},
            {'name': 'Sarah Davis', 'age': 29, 'gender': 'Female', 'blood_group': 'AB+', 'contact': '555-0104', 'location': 'Houston, TX', 'last_donation_date': date.today() - timedelta(days=30)},
            {'name': 'David Wilson', 'age': 35, 'gender': 'Male', 'blood_group': 'O-', 'contact': '555-0105', 'location': 'Phoenix, AZ', 'last_donation_date': date.today() - timedelta(days=75)},
            {'name': 'Lisa Anderson', 'age': 31, 'gender': 'Female', 'blood_group': 'A-', 'contact': '555-0106', 'location': 'Philadelphia, PA', 'last_donation_date': date.today() - timedelta(days=20)},
            {'name': 'Robert Taylor', 'age': 27, 'gender': 'Male', 'blood_group': 'B-', 'contact': '555-0107', 'location': 'San Antonio, TX', 'last_donation_date': date.today() - timedelta(days=50)},
            {'name': 'Jennifer Martinez', 'age': 38, 'gender': 'Female', 'blood_group': 'AB-', 'contact': '555-0108', 'location': 'San Diego, CA', 'last_donation_date': date.today() - timedelta(days=40)}
        ]
        
        for donor_data in donors_data:
            donor = Donor()
            for key, value in donor_data.items():
                setattr(donor, key, value)
            db.session.add(donor)
        
        # Sample Patients
        patients_data = [
            {'name': 'Alice Cooper', 'age': 25, 'blood_group': 'O+', 'contact': '555-0201', 'location': 'Boston, MA', 'units_needed': 2},
            {'name': 'Bob Martinez', 'age': 45, 'blood_group': 'A+', 'contact': '555-0202', 'location': 'Seattle, WA', 'units_needed': 3},
            {'name': 'Carol Thompson', 'age': 32, 'blood_group': 'B+', 'contact': '555-0203', 'location': 'Denver, CO', 'units_needed': 1},
            {'name': 'Daniel Lee', 'age': 28, 'blood_group': 'AB+', 'contact': '555-0204', 'location': 'Miami, FL', 'units_needed': 2},
            {'name': 'Eva Rodriguez', 'age': 55, 'blood_group': 'O-', 'contact': '555-0205', 'location': 'Atlanta, GA', 'units_needed': 4}
        ]
        
        for patient_data in patients_data:
            patient = Patient()
            for key, value in patient_data.items():
                setattr(patient, key, value)
            db.session.add(patient)
        
        # Sample Blood Inventory
        blood_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        inventory_data = []
        
        for blood_group in blood_groups:
            # Add multiple entries with different expiry dates
            inventory_data.extend([
                {'blood_group': blood_group, 'units_available': 15, 'expiry_date': date.today() + timedelta(days=30)},
                {'blood_group': blood_group, 'units_available': 8, 'expiry_date': date.today() + timedelta(days=15)},
                {'blood_group': blood_group, 'units_available': 12, 'expiry_date': date.today() + timedelta(days=45)}
            ])
        
        # Add some low stock items
        inventory_data.extend([
            {'blood_group': 'AB-', 'units_available': 3, 'expiry_date': date.today() + timedelta(days=20)},
            {'blood_group': 'B-', 'units_available': 5, 'expiry_date': date.today() + timedelta(days=10)}
        ])
        
        for inv_data in inventory_data:
            inventory = BloodInventory()
            for key, value in inv_data.items():
                setattr(inventory, key, value)
            db.session.add(inventory)
        
        # Sample Donation Records
        donation_records = [
            {'donor_id': 1, 'donor_name': 'John Smith', 'blood_group': 'O+', 'date_of_donation': date.today() - timedelta(days=90), 'units_donated': 1},
            {'donor_id': 2, 'donor_name': 'Emily Johnson', 'blood_group': 'A+', 'date_of_donation': date.today() - timedelta(days=45), 'units_donated': 1},
            {'donor_id': 3, 'donor_name': 'Michael Brown', 'blood_group': 'B+', 'date_of_donation': date.today() - timedelta(days=60), 'units_donated': 1},
            {'donor_id': 4, 'donor_name': 'Sarah Davis', 'blood_group': 'AB+', 'date_of_donation': date.today() - timedelta(days=30), 'units_donated': 2},
            {'donor_id': 5, 'donor_name': 'David Wilson', 'blood_group': 'O-', 'date_of_donation': date.today() - timedelta(days=75), 'units_donated': 1},
            {'donor_id': 6, 'donor_name': 'Lisa Anderson', 'blood_group': 'A-', 'date_of_donation': date.today() - timedelta(days=20), 'units_donated': 1},
            {'donor_id': 7, 'donor_name': 'Robert Taylor', 'blood_group': 'B-', 'date_of_donation': date.today() - timedelta(days=50), 'units_donated': 1},
            {'donor_id': 8, 'donor_name': 'Jennifer Martinez', 'blood_group': 'AB-', 'date_of_donation': date.today() - timedelta(days=40), 'units_donated': 1}
        ]
        
        for record_data in donation_records:
            record = DonationRecord()
            for key, value in record_data.items():
                setattr(record, key, value)
            db.session.add(record)
        
        # Sample Requests
        requests_data = [
            {'patient_id': 1, 'patient_name': 'Alice Cooper', 'blood_group': 'O+', 'units_requested': 2, 'date': date.today() - timedelta(days=5), 'status': 'Pending', 'priority': 'High'},
            {'patient_id': 2, 'patient_name': 'Bob Martinez', 'blood_group': 'A+', 'units_requested': 3, 'date': date.today() - timedelta(days=3), 'status': 'Approved', 'priority': 'Medium'},
            {'patient_id': 3, 'patient_name': 'Carol Thompson', 'blood_group': 'B+', 'units_requested': 1, 'date': date.today() - timedelta(days=7), 'status': 'Fulfilled', 'priority': 'Low'},
            {'patient_id': 4, 'patient_name': 'Daniel Lee', 'blood_group': 'AB+', 'units_requested': 2, 'date': date.today() - timedelta(days=2), 'status': 'Pending', 'priority': 'Critical'},
            {'patient_id': 5, 'patient_name': 'Eva Rodriguez', 'blood_group': 'O-', 'units_requested': 4, 'date': date.today() - timedelta(days=1), 'status': 'Pending', 'priority': 'Critical'}
        ]
        
        for request_data in requests_data:
            blood_request = Request()
            for key, value in request_data.items():
                setattr(blood_request, key, value)
            db.session.add(blood_request)
        
        # Commit all changes
        db.session.commit()
        print("Sample data populated successfully!")
        
    except Exception as e:
        db.session.rollback()
        print(f"Error populating sample data: {e}")
        raise e