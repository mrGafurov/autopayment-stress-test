load:
	BASE_URL=http://localhost:8080 \
	BASIC_USERNAME=test \
	BASIC_PASSWORD=test123 \
	k6 run --out influxdb=http://localhost:8086/k6 tests/scenarios/full-load.js

stress:
	BASE_URL=http://localhost:8080 \
	BASIC_USERNAME=test \
	BASIC_PASSWORD=test123 \
	k6 run --out influxdb=http://localhost:8086/k6 tests/scenarios/stress-full.js