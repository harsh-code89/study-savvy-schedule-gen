
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# In-memory storage (replace with a database in production)
subjects = []
study_plans = []

@app.route('/api/subjects', methods=['GET', 'POST'])
def handle_subjects():
    global subjects
    if request.method == 'POST':
        new_subject = request.json
        # Convert exam date string to datetime object
        if new_subject.get('examDate'):
            new_subject['examDate'] = new_subject['examDate']
        subjects.append(new_subject)
        return jsonify(new_subject), 201
    else:
        return jsonify(subjects)

@app.route('/api/subjects/<subject_id>', methods=['DELETE'])
def delete_subject(subject_id):
    global subjects
    initial_length = len(subjects)
    subjects = [s for s in subjects if s['id'] != subject_id]
    if len(subjects) < initial_length:
        return jsonify({"message": "Subject deleted successfully"}), 200
    return jsonify({"message": "Subject not found"}), 404

@app.route('/api/study-plan', methods=['POST'])
def generate_study_plan():
    data = request.json
    received_subjects = data.get('subjects', [])
    available_times = data.get('availableTimes', [])
    start_date = data.get('startDate')
    end_date = data.get('endDate')
    
    # Basic validation
    if not received_subjects or not start_date or not end_date:
        return jsonify({"error": "Missing required data"}), 400
    
    # This is where we would call our study plan generation logic
    # For now, use a simple algorithm - one session per chapter per day
    sessions = []
    
    # Convert string dates to datetime
    start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
    end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
    
    current_date = start
    
    # Simple algorithm - allocate chapters across available days
    for subject in received_subjects:
        for chapter in subject['chapters']:
            if current_date > end:
                break
                
            # Find day of week
            day_of_week = current_date.strftime('%A')
            
            # Find available hours for this day
            day_hours = next((time['hours'] for time in available_times if time['day'] == day_of_week), 0)
            
            if day_hours > 0:
                # Create study session
                session = {
                    "id": f"session_{len(sessions)}",
                    "date": current_date.isoformat(),
                    "subjectId": subject['id'],
                    "chapterId": chapter['id'],
                    "duration": min(chapter['estimatedHours'], day_hours),
                    "completed": False
                }
                sessions.append(session)
            
            # Move to next day
            current_date += timedelta(days=1)
    
    study_plan = {
        "sessions": sessions,
        "startDate": start.isoformat(),
        "endDate": end.isoformat()
    }
    
    # Save the generated plan
    study_plans.append(study_plan)
    
    return jsonify(study_plan)

@app.route('/api/study-sessions/<session_id>', methods=['PATCH'])
def update_session(session_id):
    data = request.json
    
    # Update the session in our plans
    for plan in study_plans:
        for session in plan['sessions']:
            if session['id'] == session_id:
                for key, value in data.items():
                    session[key] = value
                return jsonify(session)
    
    return jsonify({"error": "Session not found"}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
