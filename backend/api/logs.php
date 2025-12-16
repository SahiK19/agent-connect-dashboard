<?php
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$logType = $_GET['type'] ?? 'all';
$limit = min((int)($_GET['limit'] ?? 100), 1000);

try {
    // Fetch logs from all sources
    $wazuhLogs = fetchWazuhLogs($limit);
    $snortLogs = fetchSnortLogs($limit);
    $correlationLogs = fetchCorrelationLogs($limit);
    
    $response = [
        'wazuh_logs' => $wazuhLogs,
        'snort_logs' => $snortLogs,
        'correlation_logs' => $correlationLogs,
        'total_count' => count($wazuhLogs) + count($snortLogs) + count($correlationLogs),
        'timestamp' => date('c')
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch logs',
        'message' => APP_ENV === 'development' ? $e->getMessage() : 'Internal server error'
    ]);
}

function fetchWazuhLogs($limit) {
    $wazuhManagerUrl = 'http://47.130.204.203:8000/alerts.json';
    
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'method' => 'GET'
        ]
    ]);
    
    $alertsData = @file_get_contents($wazuhManagerUrl, false, $context);
    
    if ($alertsData === false) {
        return [];
    }
    
    $lines = explode("\n", trim($alertsData));
    $alerts = [];
    
    foreach (array_slice($lines, -$limit) as $line) {
        if (empty(trim($line))) continue;
        
        $alert = json_decode($line, true);
        if ($alert) {
            $alerts[] = [
                'id' => $alert['id'] ?? uniqid(),
                'timestamp' => $alert['timestamp'] ?? date('c'),
                'agent_name' => $alert['agent']['name'] ?? 'unknown',
                'agent_ip' => $alert['agent']['ip'] ?? 'unknown',
                'rule_level' => $alert['rule']['level'] ?? 0,
                'rule_description' => $alert['rule']['description'] ?? 'Unknown event',
                'source_ip' => $alert['data']['srcip'] ?? $alert['agent']['ip'] ?? 'unknown',
                'dest_ip' => $alert['data']['dstip'] ?? 'unknown',
                'event_type' => determineEventType($alert),
                'severity' => determineSeverity($alert['rule']['level'] ?? 0),
                'description' => $alert['rule']['description'] ?? 'Security event detected',
                'raw_data' => $alert
            ];
        }
    }
    
    return array_reverse($alerts);
}

function fetchSnortLogs($limit) {
    $testVmUrl = 'http://192.168.100.197:8001/snort-logs?limit=' . $limit;
    
    $context = stream_context_create([
        'http' => [
            'timeout' => 5,
            'method' => 'GET'
        ]
    ]);
    
    $snortData = @file_get_contents($testVmUrl, false, $context);
    
    if ($snortData === false) {
        return [];
    }
    
    return json_decode($snortData, true) ?: [];
}

function fetchCorrelationLogs($limit) {
    $testVmUrl = 'http://192.168.100.197:8002/correlation-logs?limit=' . $limit;
    
    $context = stream_context_create([
        'http' => [
            'timeout' => 5,
            'method' => 'GET'
        ]
    ]);
    
    $correlationData = @file_get_contents($testVmUrl, false, $context);
    
    if ($correlationData === false) {
        return [];
    }
    
    return json_decode($correlationData, true) ?: [];
}

function determineEventType($alert) {
    $description = strtolower($alert['rule']['description'] ?? '');
    
    if (strpos($description, 'snort') !== false) return 'Snort IDS';
    if (strpos($description, 'correlation') !== false) return 'Correlation';
    if (strpos($description, 'ssh') !== false) return 'SSH Activity';
    if (strpos($description, 'login') !== false) return 'Authentication';
    if (strpos($description, 'scan') !== false) return 'Port Scan';
    if (strpos($description, 'attack') !== false) return 'Attack';
    
    return 'Security Event';
}

function determineSeverity($level) {
    if ($level >= 12) return 'critical';
    if ($level >= 7) return 'high';
    if ($level >= 4) return 'medium';
    return 'low';
}
?>