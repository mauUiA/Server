/*Code is made by ChatGPT
 * and edited by Maurizio Barrella*/

// Import the HTTP module to create a web server
var http = require('http');

// Import the MySQL module to interact with the MySQL database
var mysql = require('mysql2');

// Import the URL module to parse URL strings
var url = require('url');

// Create a connection to the MySQL database
var con = mysql.createConnection({
  host: "******",  // Database host
  user: "******",  // Database user
  password: "******",  // Database user's password
  database: "******"  // Database name
});

// Create an HTTP server
http.createServer(function (req, res) {
  // Set CORS headers to allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowable methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowable headers

  // Handle preflight OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);  // No Content status
    res.end();
    return;
  }

  // Parse the URL from the request
  var parsedUrl = url.parse(req.url, true);

  // Handle GET requests to the /getData endpoint
  if (req.method === 'GET' && parsedUrl.pathname === '/getData') {
    var sql = "SELECT * FROM SensorData ORDER BY ID DESC";  // SQL query to select all sensor data
    con.query(sql, function (err, result) {
      if (err) {
        console.error(err);  // Log the error
        res.writeHead(500, {'Content-Type': 'application/json'});  // Internal Server Error status
        res.end(JSON.stringify({ error: 'Failed to fetch sensor data' }));  // Send error response
      } else {
        res.writeHead(200, {'Content-Type': 'application/json'});  // OK status
        res.end(JSON.stringify(result));  // Send the query result as JSON
      }
    });

  // Handle POST requests to the /sendData endpoint
  } else if (req.method === 'POST' && parsedUrl.pathname === '/sendData') {
    var body = '';  // Initialize an empty string to store the request body

    // Collect the data chunks in the request body
    req.on('data', function (chunk) {
      body += chunk.toString();
    });

    // Once the request body is fully received
    req.on('end', function () {
      try {
        var sensorData = JSON.parse(body);  // Parse the request body as JSON
        
        var temperature = sensorData.Temperature.replace(/[^0-9.]/g, '');  // Sanitize temperature value
        var humidity = sensorData.Humidity.replace(/[^0-9.]/g, '');  // Sanitize humidity value
        var batteryLevel = sensorData.Battery_Level;  // Use battery level directly

        // SQL query to insert the sensor data into the database
        var sql = "INSERT INTO SensorData (SensorID, Temperature, Humidity, Battery_Level) VALUES (?, ?, ?, ?)";
        
        // Execute the SQL query with the sanitized data
        con.query(sql, [sensorData.SensorID, temperature, humidity, batteryLevel], function (err, result) {
          if (err) {
            console.error(err);  // Log the error
            res.writeHead(500, {'Content-Type': 'text/plain'});  // Internal Server Error status
            res.end('Failed to insert sensor data');  // Send error response
          } else {
            console.log("Sensor data inserted");  // Log success message
            res.writeHead(200, {'Content-Type': 'text/plain'});  // OK status
            res.end('Sensor data inserted');  // Send success response
          }
        });
      } catch (error) {
        console.error('Error parsing data or invalid data:', error);  // Log parsing error
        res.writeHead(400, {'Content-Type': 'text/plain'});  // Bad Request status
        res.end('Bad request: ' + error.message);  // Send error response
      }
    });

  // Handle requests to the root URL
  } else if (parsedUrl.pathname === '/') {
    res.writeHead(200, {'Content-Type': 'text/plain'});  // OK status
    res.end('Welcome to the Sensor Data Server!');  // Send welcome message

  // Handle all other requests
  } else {
    res.writeHead(404, {'Content-Type': 'application/json'});  // Not Found status
    res.end(JSON.stringify({ error: 'Not Found' }));  // Send error response
  }

// Listen on port 3000 on all network interfaces
}).listen(3000, '0.0.0.0', () => {
  console.log('Server running at http://here_is_your_server_addres:3000');  // Log server running message
});
