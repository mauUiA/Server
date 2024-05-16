# Server

This project is created to handle sensor data using a Node.js server and a MySQL database.
To run the application it is necessary to crate a profile on https://www.mysql.com/

## Introduction

This Node.js project sets up a server to interact with a MySQL database, handling GET and POST requests to fetch and insert sensor data.

## File Structure

- `server_GET_POST.js`: The main file where the server is created and all request handling logic is implemented.

## Usage

Once the server is running, it will automatically handle incoming requests. The server supports the following endpoints:

### Endpoints

- **GET /getData**: Fetches all sensor data from the database.
  - **Response:**
    - `200 OK`: An array of sensor data objects in JSON format.
    - `500 Internal Server Error`: An error message if the data fetch fails.

- **POST /sendData**: Inserts new sensor data into the database.
  - **Request Body:**
    - `SensorID` (string): The ID of the sensor.
    - `Temperature` (string): The temperature reading from the sensor.
    - `Humidity` (string): The humidity reading from the sensor.
    - `Battery_Level` (number): The battery level of the sensor.
  - **Response:**
    - `200 OK`: A success message if the data is inserted successfully.
    - `400 Bad Request`: An error message if the request body is invalid.
    - `500 Internal Server Error`: An error message if the data insertion fails.

### Example

**GET /getData**

```sh
curl -X GET http://localhost:3000/getData
```

**POST /sendData**

```sh
curl -X POST http://localhost:3000/sendData \
-H "Content-Type: application/json" \
-d '{"SensorID": "sensor_1", "Temperature": "22.5", "Humidity": "45.2", "Battery_Level": 85}'
```

