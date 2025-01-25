# ESP32 Air Quality and Dust Monitor System

A real-time air quality monitoring system that collects data from sensors and displays it on a dashboard.

## Features

- Collect data from ESP32 (Temperature, Humidity, Dust, Gas Levels)
- Backend with CRUD API using Node.js and PostgreSQL
- Real-time dashboard using Chart.js

## Deploy on Render.com

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/PoomGamerE/ESP32-Air-Quality-and-Dust-Monitor-System)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PoomGamerE/ESP32-Air-Quality-and-Dust-Monitor-System.git
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database and environment variables in `.env`.

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| POST   | `/api/data`     | Create a new record |
| GET    | `/api/data`     | Get all records     |
| PUT    | `/api/data/:id` | Update a record     |
| DELETE | `/api/data/:id` | Delete a record     |

## ESP32 Integration

- Update the WiFi credentials and server URL in `esp32_code.ino`.
- Upload the code to your ESP32.

## License

MIT License
