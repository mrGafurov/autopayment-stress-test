import http from "k6/http";
import { check, sleep } from "k6";
import { config } from "../../config/config.js";
import encoding from "k6/encoding";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "30s", target: 0 },
  ],

  thresholds: {
    http_req_duration: ["p(95)<1000"],

    http_req_failed: ["rate<0.01"],

    checks: ["rate>0.99"],
  },
};

export default function () {
  const payload = JSON.stringify({
    organization_id: 10,
  });

  const credentials = `${config.username}:${config.password}`;

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${encoding.b64encode(credentials)}`,
    },
  };

  const response = http.post(
    `${config.baseUrl}/lofs/get_branch_lof`,
    payload,
    params,
  );

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response received": (r) => r.body !== undefined,
  });

  sleep(1);
}
