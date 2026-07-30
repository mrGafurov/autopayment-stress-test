# Autopayment stress testing

This project contains **Load Testing** and **Stress Testing** scenarios using **k6**.

The project includes:

- Local mock backend API
- k6 performance test scenarios
- InfluxDB for metrics storage
- Grafana dashboards for visualization
- Test reports

---

# Project Structure

```
.
├── backend/
│   └── server.js              # Local mock backend API
│
├── config/
│   └── config.js              # k6 environment configuration
│
├── dashboards/
│   └── grafana dashboards
│
├── reports/
│   ├── load-test-report.md
│   └── stress-test-report.md
│
├── tests/
│   └── scenarios/
│       ├── full-load.js       # Load test scenario
│       └── stress.js          # Stress test scenario
│
├── docker-compose.yml         # InfluxDB + Grafana setup
├── README.md
├── Makefile
└── .env.example
```

---

# Requirements

Before running tests, install:

## Node.js

Required for running the local mock backend.

Check installation:

```bash
node -v
```

---

## k6

Install k6:

https://grafana.com/docs/k6/latest/set-up/install-k6/

Check installation:

```bash
k6 version
```

---

## Docker

Required for running InfluxDB and Grafana.

Check installation:

```bash
docker --version
```

---

# Environment Configuration

Create `.env` file in the project root.

Example:

```env
BASE_URL=http://localhost:8080

BASIC_USERNAME=test

BASIC_PASSWORD=test123
```

Environment variables:

| Variable | Description |
|---|---|
| BASE_URL | Backend API URL |
| BASIC_USERNAME | Basic Auth username |
| BASIC_PASSWORD | Basic Auth password |

---

# 1. Start Local Backend

Go to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start server:

```bash
npm start
```

Expected output:

```
Mock API running on port 8080
```

Backend is available:

```
http://localhost:8080
```

---

# 2. Start Monitoring Stack

From project root:

```bash
docker-compose up -d
```

This starts:

## InfluxDB

```
http://localhost:8086
```

## Grafana

```
http://localhost:3000
```

Grafana default credentials:

```
username: admin
password: admin
```

## Import Grafana Dashboard

A pre-configured Grafana dashboard is included in the repository.

1. Open Grafana in your browser.
2. Navigate to **Dashboards → Import**.
3. Click **Upload JSON file**.
4. Select the dashboard file located at:

```text
dashboards/autopayment-dashboard.json
```

5. Choose the **InfluxDB** data source (the same one configured for k6 metrics).
6. Click **Import**.

After importing, the dashboard will display the performance metrics collected during the load and stress tests, including:

- Virtual Users (VUs)
- Max Virtual Users
- HTTP Requests
- Requests Per Second (RPS)
- Request Duration
- Success Rate
- Error Rate
- Endpoint Response Times
- Endpoint Throughput
- Data Sent / Received
- Iterations Per Second

Run either the load or stress test, refresh the dashboard, and the metrics will be displayed automatically.

---

# 3. Run Load Test

Load test simulates normal application traffic.

Scenario:

- Ramp up users gradually
- Maximum 200 virtual users
- Multiple API endpoints tested
- Response time and success rate monitored


Run:

```bash
make load
```

Load test includes:

- Health endpoint
- Authentication endpoints
- LOF endpoints
- Organization endpoints
- Cron endpoints
- Card endpoints
- Payment endpoints
- PWR endpoints

---

# 4. Run Stress Test

Stress test checks system behavior under extreme load.

Scenario:

- Gradual increase of traffic
- Up to 1000 virtual users
- Checks system stability under high pressure


Run:

```bash
make stress
```

Stress test validates:

- Maximum throughput
- Response time degradation
- Error rate
- System stability

---

# Tested Endpoints

## General

| Endpoint | Method |
|---|---|
| `/health` | GET |
| `/test` | GET |

---

## LOF

| Endpoint | Method |
|---|---|
| `/lofs/get_branch_lof` | POST |
| `/lofs/get-all-lof?page=1` | GET |

---

## Logs

| Endpoint | Method |
|---|---|
| `/logs/get-all-log` | GET |

---

## Organizations

| Endpoint | Method |
|---|---|
| `/organizations/get-all-organization` | GET |
| `/organization/get_cron_organization` | GET |
| `/organization_cycles/organization-cycle` | GET |

---

## Cron

| Endpoint | Method |
|---|---|
| `/crons/get_cron` | GET |

---

## Cards

| Endpoint | Method |
|---|---|
| `/cards/get-cards/{id}` | GET |
| `/cards/register` | POST |
| `/cards/confirm` | POST |

---

## Payments

| Endpoint | Method |
|---|---|
| `/payments/payment-one` | POST |

---

## PWR

| Endpoint | Method |
|---|---|
| `/pwr/get-sms` | POST |
| `/pwr/confirm` | POST |

---

# Grafana Dashboard

Grafana dashboard contains performance monitoring panels:

- Virtual Users
- Maximum Virtual Users
- HTTP Requests
- Request Duration
- Checks Passed
- Error Rate
- Requests Per Second
- Response Time Percentiles
- Endpoint Performance
- Data Transfer Rate

---

# Test Reports

Performance reports are available in:

```
reports/
```

Included reports:

```
load-test-report.md
stress-test-report.md
```

Reports contain:

- Test configuration
- Load profile
- Tested endpoints
- Threshold results
- Performance metrics
- Conclusions

---

# Stop Services

Stop Grafana and InfluxDB:

```bash
docker-compose down
```

---

# Troubleshooting

## Backend connection error

Check backend status:

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{
  "status": "ok"
}
```

---

## InfluxDB connection error

Check containers:

```bash
docker ps
```

Restart services:

```bash
docker-compose restart
```

---

# Notes

- Tests are designed for the provided mock backend environment.
- Before running tests make sure backend, InfluxDB and Grafana are running.
- Do not commit `.env` file into repository.
- Use `.env.example` for sharing configuration templates.
