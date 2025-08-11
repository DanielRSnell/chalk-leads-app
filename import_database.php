<?php

// PHP script to import SQLite database from SQL dump

echo "Importing database from SQL dump...\n";

$databasePath = 'database/database.sqlite';
$sqlDumpPath = 'database/production_export.sql';

// Remove existing database if it exists
if (file_exists($databasePath)) {
    unlink($databasePath);
}

// Create new SQLite database
$pdo = new PDO("sqlite:$databasePath");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Read SQL dump file
if (!file_exists($sqlDumpPath)) {
    echo "Error: SQL dump file not found at $sqlDumpPath\n";
    exit(1);
}

$sqlContent = file_get_contents($sqlDumpPath);

// Execute the SQL commands
try {
    $pdo->exec($sqlContent);
    echo "Database imported successfully!\n";
} catch (PDOException $e) {
    echo "Error importing database: " . $e->getMessage() . "\n";
    exit(1);
}