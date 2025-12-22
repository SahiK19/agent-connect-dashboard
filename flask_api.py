#!/usr/bin/env python3

from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Database configuration - update with your actual credentials
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_password',  # Update this
    'database': 'security_logs'
}

@app.route('/api/wazuh-logs', methods=['GET'])
def get_wazuh_logs():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM wazuh_logs ORDER BY created_at DESC LIMIT 100")
        logs = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(logs)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/snort-logs', methods=['GET'])
def get_snort_logs():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM snort_logs ORDER BY created_at DESC LIMIT 100")
        logs = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(logs)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/activity-overview', methods=['GET'])
def get_activity_overview():
    try:
        # Connect to database
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        # Get hourly counts for last 24 hours
        # Snort logs
        snort_query = """
        SELECT HOUR(created_at) as hour, COUNT(*) as count 
        FROM snort_logs 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY HOUR(created_at)
        """
        
        # Wazuh logs  
        wazuh_query = """
        SELECT HOUR(created_at) as hour, COUNT(*) as count 
        FROM wazuh_logs 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY HOUR(created_at)
        """
        
        # Correlated logs
        correlated_query = """
        SELECT HOUR(created_at) as hour, COUNT(*) as count 
        FROM security_logs 
        WHERE correlated = 1 AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY HOUR(created_at)
        """
        
        # Execute queries
        cursor.execute(snort_query)
        snort_data = cursor.fetchall()
        
        cursor.execute(wazuh_query)
        wazuh_data = cursor.fetchall()
        
        cursor.execute(correlated_query)
        correlated_data = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Format response
        response = {
            "snort": snort_data,
            "wazuh": wazuh_data,
            "correlated": correlated_data
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/correlated-logs', methods=['GET'])
def get_correlated_logs():
    try:
        # Connect to database
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        # Get correlated logs
        query = """
        SELECT id, timestamp, source, message, severity, raw_json, created_at 
        FROM security_logs 
        WHERE correlated = 1 
        ORDER BY created_at DESC 
        LIMIT 50
        """
        
        cursor.execute(query)
        logs = cursor.fetchall()
        
        # Process logs to extract messages from raw_json if needed
        processed_logs = []
        for log in logs:
            processed_log = dict(log)
            
            # If message is empty, try to extract from raw_json
            if not processed_log.get('message') and processed_log.get('raw_json'):
                try:
                    raw_data = json.loads(processed_log['raw_json'])
                    if raw_data.get('message'):
                        processed_log['message'] = raw_data['message']
                    elif raw_data.get('correlation_type'):
                        processed_log['message'] = raw_data['correlation_type']
                    elif raw_data.get('stage1') and raw_data.get('stage2'):
                        stage1 = raw_data['stage1'].get('wazuh_alert', 'Unknown event')
                        stage2 = raw_data['stage2'].get('wazuh_alert', 'Unknown event')
                        processed_log['message'] = f"Correlated events: {stage1} → {stage2}"
                except:
                    pass
            
            # Ensure message has a value
            if not processed_log.get('message'):
                processed_log['message'] = 'No description available'
                
            processed_logs.append(processed_log)
        
        cursor.close()
        conn.close()
        
        return jsonify(processed_logs)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)