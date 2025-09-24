from flask import request
from flask_restful import Resource
from sqlalchemy import func
from datetime import datetime, date, timedelta
from backend.database import db
from backend.models import Donor, Patient, BloodInventory, DonationRecord, Request

class DonorListResource(Resource):
    def get(self):
        donors = Donor.query.all()
        return {'donors': [donor.to_dict() for donor in donors]}, 200
    
    def post(self):
        data = request.get_json()
        try:
            # Convert last_donation_date string to date object if provided
            last_donation_date = None
            if data.get('last_donation_date'):
                last_donation_date = datetime.strptime(data['last_donation_date'], '%Y-%m-%d').date()
            
            donor = Donor()
            donor.name = data['name']
            donor.age = data['age']
            donor.gender = data['gender']
            donor.blood_group = data['blood_group']
            donor.contact = data['contact']
            donor.location = data['location']
            donor.last_donation_date = last_donation_date
            db.session.add(donor)
            db.session.commit()
            return {'message': 'Donor created successfully', 'donor': donor.to_dict()}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class DonorResource(Resource):
    def get(self, donor_id):
        donor = Donor.query.get_or_404(donor_id)
        return {'donor': donor.to_dict()}, 200
    
    def put(self, donor_id):
        donor = Donor.query.get_or_404(donor_id)
        data = request.get_json()
        try:
            donor.name = data.get('name', donor.name)
            donor.age = data.get('age', donor.age)
            donor.gender = data.get('gender', donor.gender)
            donor.blood_group = data.get('blood_group', donor.blood_group)
            donor.contact = data.get('contact', donor.contact)
            donor.location = data.get('location', donor.location)
            
            if data.get('last_donation_date'):
                donor.last_donation_date = datetime.strptime(data['last_donation_date'], '%Y-%m-%d').date()
            
            db.session.commit()
            return {'message': 'Donor updated successfully', 'donor': donor.to_dict()}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400
    
    def delete(self, donor_id):
        donor = Donor.query.get_or_404(donor_id)
        try:
            db.session.delete(donor)
            db.session.commit()
            return {'message': 'Donor deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class InventoryListResource(Resource):
    def get(self):
        inventory = BloodInventory.query.all()
        return {'inventory': [item.to_dict() for item in inventory]}, 200
    
    def post(self):
        data = request.get_json()
        try:
            expiry_date = datetime.strptime(data['expiry_date'], '%Y-%m-%d').date()
            
            inventory_item = BloodInventory()
            inventory_item.blood_group = data['blood_group']
            inventory_item.units_available = data['units_available']
            inventory_item.expiry_date = expiry_date
            db.session.add(inventory_item)
            db.session.commit()
            return {'message': 'Blood inventory created successfully', 'inventory': inventory_item.to_dict()}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class InventoryResource(Resource):
    def get(self, inventory_id):
        inventory_item = BloodInventory.query.get_or_404(inventory_id)
        return {'inventory': inventory_item.to_dict()}, 200
    
    def put(self, inventory_id):
        inventory_item = BloodInventory.query.get_or_404(inventory_id)
        data = request.get_json()
        try:
            inventory_item.blood_group = data.get('blood_group', inventory_item.blood_group)
            inventory_item.units_available = data.get('units_available', inventory_item.units_available)
            
            if data.get('expiry_date'):
                inventory_item.expiry_date = datetime.strptime(data['expiry_date'], '%Y-%m-%d').date()
            
            db.session.commit()
            return {'message': 'Blood inventory updated successfully', 'inventory': inventory_item.to_dict()}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400
    
    def delete(self, inventory_id):
        inventory_item = BloodInventory.query.get_or_404(inventory_id)
        try:
            db.session.delete(inventory_item)
            db.session.commit()
            return {'message': 'Blood inventory deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class RequestListResource(Resource):
    def get(self):
        requests = Request.query.all()
        return {'requests': [req.to_dict() for req in requests]}, 200
    
    def post(self):
        data = request.get_json()
        try:
            request_date = date.today()
            if data.get('date'):
                request_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            
            blood_request = Request()
            blood_request.patient_id = data['patient_id']
            blood_request.patient_name = data['patient_name']
            blood_request.blood_group = data['blood_group']
            blood_request.units_requested = data['units_requested']
            blood_request.date = request_date
            blood_request.status = data.get('status', 'Pending')
            blood_request.priority = data.get('priority', 'Medium')
            db.session.add(blood_request)
            db.session.commit()
            return {'message': 'Blood request created successfully', 'request': blood_request.to_dict()}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class RequestResource(Resource):
    def get(self, request_id):
        blood_request = Request.query.get_or_404(request_id)
        return {'request': blood_request.to_dict()}, 200
    
    def put(self, request_id):
        blood_request = Request.query.get_or_404(request_id)
        data = request.get_json()
        try:
            blood_request.patient_id = data.get('patient_id', blood_request.patient_id)
            blood_request.patient_name = data.get('patient_name', blood_request.patient_name)
            blood_request.blood_group = data.get('blood_group', blood_request.blood_group)
            blood_request.units_requested = data.get('units_requested', blood_request.units_requested)
            blood_request.status = data.get('status', blood_request.status)
            blood_request.priority = data.get('priority', blood_request.priority)
            
            if data.get('date'):
                blood_request.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            
            db.session.commit()
            return {'message': 'Blood request updated successfully', 'request': blood_request.to_dict()}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400
    
    def delete(self, request_id):
        blood_request = Request.query.get_or_404(request_id)
        try:
            db.session.delete(blood_request)
            db.session.commit()
            return {'message': 'Blood request deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class DashboardStatsResource(Resource):
    def get(self):
        try:
            # Get total counts
            total_donors = Donor.query.count()
            total_patients = Patient.query.count()
            total_requests = Request.query.count()
            pending_requests = Request.query.filter_by(status='Pending').count()
            critical_requests = Request.query.filter_by(priority='Critical').count()
            
            # Get total blood units in inventory
            total_units = db.session.query(func.sum(BloodInventory.units_available)).scalar() or 0
            
            # Get blood group distribution
            blood_group_distribution = db.session.query(
                BloodInventory.blood_group,
                func.sum(BloodInventory.units_available).label('total_units')
            ).group_by(BloodInventory.blood_group).all()
            
            blood_groups_data = {group: units for group, units in blood_group_distribution}
            
            # Get low stock alerts (less than 10 units)
            low_stock_items = BloodInventory.query.filter(BloodInventory.units_available < 10).all()
            
            # Get expiry alerts (expiring in next 7 days)
            expiry_date_threshold = date.today() + timedelta(days=7)
            expiry_alerts = BloodInventory.query.filter(BloodInventory.expiry_date <= expiry_date_threshold).all()
            
            # Recent donations (last 30 days)
            thirty_days_ago = date.today() - timedelta(days=30)
            recent_donations = DonationRecord.query.filter(DonationRecord.date_of_donation >= thirty_days_ago).count()
            
            # Monthly donation trends (last 6 months)
            monthly_donations = []
            for i in range(6):
                month_start = date.today().replace(day=1) - timedelta(days=30*i)
                next_month = (month_start.replace(day=28) + timedelta(days=4)).replace(day=1)
                count = DonationRecord.query.filter(
                    DonationRecord.date_of_donation >= month_start,
                    DonationRecord.date_of_donation < next_month
                ).count()
                monthly_donations.append({
                    'month': month_start.strftime('%B %Y'),
                    'donations': count
                })
            
            # Request status distribution
            status_distribution = db.session.query(
                Request.status,
                func.count(Request.id).label('count')
            ).group_by(Request.status).all()
            
            status_data = {status: count for status, count in status_distribution}
            
            return {
                'summary_cards': {
                    'total_donors': total_donors,
                    'total_patients': total_patients,
                    'total_blood_units': total_units,
                    'pending_requests': pending_requests,
                    'critical_requests': critical_requests,
                    'recent_donations': recent_donations
                },
                'charts': {
                    'blood_group_distribution': blood_groups_data,
                    'monthly_donations': monthly_donations,
                    'request_status_distribution': status_data
                },
                'alerts': {
                    'low_stock': [item.to_dict() for item in low_stock_items],
                    'expiry_alerts': [item.to_dict() for item in expiry_alerts]
                }
            }, 200
        except Exception as e:
            return {'error': str(e)}, 500

class PatientListResource(Resource):
    def get(self):
        patients = Patient.query.all()
        return {'patients': [patient.to_dict() for patient in patients]}, 200
    
    def post(self):
        data = request.get_json()
        try:
            patient = Patient()
            patient.name = data['name']
            patient.age = data['age']
            patient.blood_group = data['blood_group']
            patient.contact = data['contact']
            patient.location = data['location']
            patient.units_needed = data['units_needed']
            
            db.session.add(patient)
            db.session.commit()
            return {'message': 'Patient created successfully', 'patient': patient.to_dict()}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class PatientResource(Resource):
    def get(self, patient_id):
        patient = Patient.query.get_or_404(patient_id)
        return {'patient': patient.to_dict()}, 200
    
    def put(self, patient_id):
        patient = Patient.query.get_or_404(patient_id)
        data = request.get_json()
        try:
            patient.name = data.get('name', patient.name)
            patient.age = data.get('age', patient.age)
            patient.blood_group = data.get('blood_group', patient.blood_group)
            patient.contact = data.get('contact', patient.contact)
            patient.location = data.get('location', patient.location)
            patient.units_needed = data.get('units_needed', patient.units_needed)
            
            db.session.commit()
            return {'message': 'Patient updated successfully', 'patient': patient.to_dict()}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400
    
    def delete(self, patient_id):
        patient = Patient.query.get_or_404(patient_id)
        try:
            db.session.delete(patient)
            db.session.commit()
            return {'message': 'Patient deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class DonationRecordListResource(Resource):
    def get(self):
        records = DonationRecord.query.all()
        return {'donation_records': [record.to_dict() for record in records]}, 200
    
    def post(self):
        data = request.get_json()
        try:
            donation_date = date.today()
            if data.get('date_of_donation'):
                donation_date = datetime.strptime(data['date_of_donation'], '%Y-%m-%d').date()
            
            record = DonationRecord()
            record.donor_id = data['donor_id']
            record.donor_name = data['donor_name']
            record.blood_group = data['blood_group']
            record.date_of_donation = donation_date
            record.units_donated = data['units_donated']
            
            db.session.add(record)
            db.session.commit()
            return {'message': 'Donation record created successfully', 'record': record.to_dict()}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class DonationRecordResource(Resource):
    def get(self, record_id):
        record = DonationRecord.query.get_or_404(record_id)
        return {'record': record.to_dict()}, 200
    
    def put(self, record_id):
        record = DonationRecord.query.get_or_404(record_id)
        data = request.get_json()
        try:
            record.donor_id = data.get('donor_id', record.donor_id)
            record.donor_name = data.get('donor_name', record.donor_name)
            record.blood_group = data.get('blood_group', record.blood_group)
            record.units_donated = data.get('units_donated', record.units_donated)
            
            if data.get('date_of_donation'):
                record.date_of_donation = datetime.strptime(data['date_of_donation'], '%Y-%m-%d').date()
            
            db.session.commit()
            return {'message': 'Donation record updated successfully', 'record': record.to_dict()}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400
    
    def delete(self, record_id):
        record = DonationRecord.query.get_or_404(record_id)
        try:
            db.session.delete(record)
            db.session.commit()
            return {'message': 'Donation record deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400