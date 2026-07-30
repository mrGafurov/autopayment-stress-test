Stress Test Report

1. Test Overview

Project

Autopayment Mock API Performance Testing

Test Type

Stress Testing

Testing Tool

* k6
* Grafana
* InfluxDB

Test Objective

The purpose of this stress test was to evaluate system behavior under high traffic conditions beyond normal expected load.

The test focused on:

* Maximum concurrent user handling capability
* API stability under heavy traffic
* Response time degradation
* Error rate under stress conditions
* Overall system reliability

⸻

2. Test Environment

Component	Configuration
Backend:	default (Local Mock API)
Base URL:	default (http://localhost:8080)
Authentication:	Basic Authentication
Metrics Database:	InfluxDB 1.8
Dashboard:	Grafana

⸻

3. Tested Endpoints

The stress test included the following API endpoints:

Health

* GET /health

Test

* GET /test

LOF

* POST /lofs/get_branch_lof
* GET /lofs/get-all-lof?page=1

Logs

* GET /logs/get-all-log

Organization

* GET /organizations/get-all-organization
* GET /organization/get_cron_organization
* GET /organization_cycles/organization-cycle

Cron

* GET /crons/get_cron

Cards

* GET /cards/get-cards/{id}
* POST /cards/register
* POST /cards/confirm

Payments

* POST /payments/payment-one

PWR

* POST /pwr/get-sms
* POST /pwr/confirm

⸻

4. Test Scenario

Test Script

tests/scenarios/stress.js

Stress Profile

Stage	Duration	Virtual Users
Ramp Up	1 minute	100
High Load	2 minutes	300
Heavy Load	2 minutes	600
Maximum Stress	2 minutes	1000
Ramp Down	1 minute	0

Maximum concurrent virtual users:

1000 VUs

Total test duration:

8 minutes

⸻

5. Performance Thresholds

The following thresholds were configured:

Metric	Expected Result
HTTP request duration	p95 < 2000ms
HTTP failed requests	< 5%
Successful checks	> 95%

⸻

6. Test Results

Threshold Results

Metric	Expected	Actual	Status
HTTP request duration	p95 < 2000ms	p95 = 4.19ms	PASS
HTTP failed requests	< 5%	0%	PASS
Success rate	>95%	100%	PASS

⸻

7. Request Statistics

Metric	Result
Total Requests	206,925
Requests Per Second	430.67 req/s
Failed Requests	0
Successful Checks	620,775
Failed Checks	0
Maximum Virtual Users	1000
Data Received	1.4 GB
Data Sent	35 MB

⸻

8. Endpoint Performance Results

Endpoint	Average Response Time
health	1.40 ms
test	1.48 ms
get_branch_lof	1.66 ms
get_all_lof	1.47 ms
get_all_log	1.55 ms
organizations	1.44 ms
cron_organizations	1.39 ms
organization_cycle	1.45 ms
get_cron	1.50 ms
get_cards	1.42 ms
register_card	1.55 ms
confirm_card	1.46 ms
payment_one	1.54 ms
pwr_sms	1.89 ms
pwr_confirm	1.29 ms

⸻

9. Observations

During the stress test:

* The system successfully handled up to 1000 concurrent virtual users.
* No HTTP request failures occurred during the test.
* All API endpoints continued returning successful responses.
* Response times remained within the defined threshold.
* No significant performance degradation was observed under heavy traffic.

The highest observed response time:

272.39 ms

The highest endpoint average response time:

pwr_sms - 1.89 ms

⸻

10. Comparison With Load Test

Metric	Load Test	Stress Test
Maximum VUs	200	1000
Duration	6 minutes	8 minutes
Total Requests	32,200	206,925
Requests/sec	89.24	430.67
Failed Requests	0%	0%
Success Rate	100%	100%
p95 Response Time	2.85 ms	4.19 ms

⸻

11. Conclusion

The stress test demonstrated that the API remained stable under extreme traffic conditions.

The system successfully handled:

* 1000 concurrent virtual users
* More than 200,000 requests
* Over 430 requests per second

No critical performance issues, failures, or instability were detected.

The API showed strong resilience under stress conditions.

For production readiness, additional testing with real infrastructure, database load, external integrations, and production-level data volumes is recommended.