Load Test Report

1. Test Overview

Project

Autopayment Mock API Performance Testing

Test Type

Load Testing

Testing Tool

- k6
- Grafana
- InfluxDB

Test Objective

The purpose of this load test was to evaluate API performance under expected production-like traffic conditions.

The test focused on:

- API response time
- Request success rate
- Error rate
- System stability under concurrent users
- Endpoint performance metrics

⸻

2. Test Environment

Component Configuration
Backend: default (Local Mock API)
Base URL: default (http://localhost:8080)
Authentication: Basic Authentication
Metrics Database: InfluxDB 1.8
Dashboard: Grafana

⸻

3. Tested Endpoints

The following endpoints were included in the load test scenario:

Health

- GET /health

Test

- GET /test

LOF

- POST /lofs/get_branch_lof
- GET /lofs/get-all-lof?page=1

Logs

- GET /logs/get-all-log

Organization

- GET /organizations/get-all-organization
- GET /organization/get_cron_organization
- GET /organization_cycles/organization-cycle

Cron

- GET /crons/get_cron

Cards

- GET /cards/get-cards/{id}
- POST /cards/register
- POST /cards/confirm

Payments

- POST /payments/payment-one

PWR

- POST /pwr/get-sms
- POST /pwr/confirm

⸻

4. Test Scenario

Test Script

tests/scenarios/full-load.js

Load Profile

Stage Duration Virtual Users
Ramp Up 1 minute 25
Increasing Load 2 minutes 100
Peak Load 2 minutes 200
Ramp Down 1 minute 0

Maximum concurrent virtual users:

200 VUs

Total test duration:

6 minutes

⸻

5. Performance Thresholds

The following thresholds were configured:

Metric Expected Result
HTTP request duration p95 < 1000ms
HTTP failed requests < 1%
Successful checks > 99%

⸻

6. Test Results

Threshold Results

Metric Expected Actual Status
HTTP request duration p95 < 1000ms p95 = 2.85ms PASS
HTTP failed requests < 1% 0% PASS
Success rate >99% 100% PASS

⸻

7. Request Statistics

Metric Result
Total Requests 32,200
Requests Per Second 89.24 req/s
Failed Requests 0
Successful Checks 96,600
Failed Checks 0
Data Received 212 MB
Data Sent 5.4 MB

⸻

8. Endpoint Performance Results

Endpoint Average Response Time
health 1.15 ms
test 1.18 ms
get_branch_lof 1.59 ms
get_all_lof 1.30 ms
get_all_log 1.34 ms
organizations 1.20 ms
cron_organizations 1.19 ms
organization_cycle 1.23 ms
get_cron 1.30 ms
get_cards 1.26 ms
register_card 1.46 ms
confirm_card 1.52 ms
payment_one 1.35 ms
pwr_sms 1.46 ms
pwr_confirm 1.26 ms

⸻

9. Observations

During the load test:

- The API successfully handled 200 concurrent virtual users.
- No HTTP request failures were detected.
- All endpoint requests returned successful responses.
- Response times remained significantly below the defined threshold.
- The system showed stable behavior during the entire test duration.

⸻

10. Conclusion

The load test results demonstrate that the API can handle expected traffic levels successfully.

The system achieved:

- 100% request success rate
- 0% HTTP failure rate
- Low response latency
- Stable performance under 200 concurrent users

No critical performance issues were identified during the load testing phase.

Further testing with production infrastructure, real database connections, and realistic production data is recommended.
