import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from '../../config/config.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],

  thresholds: {
    http_req_duration: [
      'p(95)<500',
    ],

    http_req_failed: [
      'rate<0.01',
    ],

    checks: [
      'rate>0.99',
    ],
  },
};

export default function () {
  const response = http.get(`${config.baseUrl}/health`);

  check(response, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}