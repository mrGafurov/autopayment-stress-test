import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';
import { Trend, Rate } from 'k6/metrics';
import { config } from '../../config/config.js';

const successRate = new Rate('success_rate');

const responseTrend = new Trend(
  'stress_get_branch_lof_duration'
);

export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '2m', target: 300 },
    { duration: '2m', target: 600 },
    { duration: '2m', target: 1000 },
    { duration: '1m', target: 0 },
  ],

  thresholds: {
    http_req_failed: [
      'rate<0.05',
    ],

    http_req_duration: [
      'p(95)<2000',
    ],

    success_rate: [
      'rate>0.95',
    ],
  },
};


function authHeaders() {
  const credentials =
    `${config.username}:${config.password}`;

  return {
    Authorization:
      `Basic ${encoding.b64encode(credentials)}`,

    'Content-Type':
      'application/json',
  };
}


export default function () {

  const response = http.post(
    `${config.baseUrl}/lofs/get_branch_lof`,

    JSON.stringify({
      organization_id: 10,
    }),

    {
      headers: authHeaders(),

      tags: {
        endpoint: 'get_branch_lof',
      },
    }
  );


  responseTrend.add(
    response.timings.duration
  );


  const ok = check(response, {

    'status is 200': (r) =>
      r.status === 200,


    'response time < 2s': (r) =>
      r.timings.duration < 2000,


    'response body exists': (r) =>
      r.body && r.body.length > 0,

  });


  successRate.add(ok);


  sleep(0.5);
}