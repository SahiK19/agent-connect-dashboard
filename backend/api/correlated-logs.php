<?php
require_once '../config/cors.php';
require_once '../config/database.php';

header('Content-Type: application/json');

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Query to get correlated security logs
    $query = "SELECT timestamp, source, severity, message, created_at 
              FROM security_logs 
              WHERE correlated = 1 
              ORDER BY created_at DESC 
              LIMIT 50";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $logs = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $logs[] = [
            'timestamp' => $row['timestamp'],
            'source' => $row['source'],
            'severity' => $row['severity'],
            'message' => $row['message'],
            'created_at' => $row['created_at']
        ];
    }
    
    echo json_encode($logs);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch correlated logs: ' . $e->getMessage()]);
}
?>