import os
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from backend.database import db

# Create the app
app = Flask(__name__, static_folder='frontend', static_url_path='')

# Enable CORS for all domains on all routes
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Setup a secret key, required by sessions
session_secret = os.environ.get("SESSION_SECRET")
if not session_secret:
    raise ValueError("SESSION_SECRET environment variable is required for production deployment. Set a secure random string.")
app.secret_key = session_secret

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the app with the extension
db.init_app(app)

# Initialize Flask-RESTful
api = Api(app)

# Import models and resources after app creation to avoid circular imports
# Import resources
from backend.resources import (
    DonorListResource, DonorResource,
    PatientListResource, PatientResource,
    InventoryListResource, InventoryResource,
    RequestListResource, RequestResource,
    DonationRecordListResource, DonationRecordResource,
    DashboardStatsResource
)

with app.app_context():
    # Import models to ensure they are registered with SQLAlchemy
    import backend.models  # noqa: F401
    
    # Create all tables
    db.create_all()
    
    # Import and run sample data population only in development
    if os.environ.get('FLASK_ENV') == 'development' or os.environ.get('POPULATE_SAMPLE_DATA', '').lower() == 'true':
        from backend.sample_data import populate_sample_data
        populate_sample_data()

# Add API endpoints
api.add_resource(DonorListResource, '/api/donors')
api.add_resource(DonorResource, '/api/donors/<int:donor_id>')
api.add_resource(PatientListResource, '/api/patients')
api.add_resource(PatientResource, '/api/patients/<int:patient_id>')
api.add_resource(InventoryListResource, '/api/inventory')
api.add_resource(InventoryResource, '/api/inventory/<int:inventory_id>')
api.add_resource(RequestListResource, '/api/requests')
api.add_resource(RequestResource, '/api/requests/<int:request_id>')
api.add_resource(DonationRecordListResource, '/api/donation-records')
api.add_resource(DonationRecordResource, '/api/donation-records/<int:record_id>')
api.add_resource(DashboardStatsResource, '/api/dashboard-stats')

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
