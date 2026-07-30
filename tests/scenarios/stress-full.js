import http from "k6/http";
import { check, sleep } from "k6";
import encoding from "k6/encoding";
import { Trend, Rate } from "k6/metrics";
import { config } from "../../config/config.js";

const successRate = new Rate("success_rate");

const endpointTrend = {
  health: new Trend("stress_health_duration"),
  test: new Trend("stress_test_duration"),

  get_branch_lof: new Trend("stress_get_branch_lof_duration"),
  get_all_lof: new Trend("stress_get_all_lof_duration"),
  get_all_log: new Trend("stress_get_all_log_duration"),

  organizations: new Trend("stress_organizations_duration"),
  cron_organizations: new Trend("stress_cron_organizations_duration"),
  organization_cycle: new Trend("stress_organization_cycle_duration"),
  get_cron: new Trend("stress_get_cron_duration"),

  get_cards: new Trend("stress_get_cards_duration"),
  register_card: new Trend("stress_register_card_duration"),
  confirm_card: new Trend("stress_confirm_card_duration"),

  payment_one: new Trend("stress_payment_one_duration"),
  payment_reverse: new Trend("stress_payment_reverse_duration"),

  pwr_sms: new Trend("stress_pwr_sms_duration"),
  pwr_confirm: new Trend("stress_pwr_confirm_duration"),
};


const bodyRequiredEndpoints = [
  "health",
  "test",
  "get_branch_lof",
  "get_all_lof",
  "get_all_log",
  "organizations",
  "cron_organizations",
  "organization_cycle",
  "get_cron",
  "get_cards",
  "register_card",
  "confirm_card",
  "pwr_sms",
  "pwr_confirm",
];


export const options = {

  stages: [
    { duration: "1m", target: 100 },
    { duration: "2m", target: 300 },
    { duration: "2m", target: 600 },
    { duration: "2m", target: 1000 },
    { duration: "1m", target: 0 },
  ],


  thresholds: {

    http_req_failed: [
      "rate<0.05",
    ],

    http_req_duration: [
      "p(95)<2000",
    ],

    success_rate: [
      "rate>0.95",
    ],

  },

};


function authHeaders() {

  const credentials =
    `${config.username}:${config.password}`;


  return {
    Authorization:
      `Basic ${encoding.b64encode(credentials)}`,

    "Content-Type":
      "application/json",
  };

}

export default function () {
  const random = Math.random();

  let response;
  let endpoint = "";


  if (random < 0.1) {

    endpoint = "health";

    response = http.get(
      `${config.baseUrl}/health`,
      {
        tags: { endpoint },
      }
    );


  } else if (random < 0.2) {

    endpoint = "test";

    response = http.get(
      `${config.baseUrl}/test`,
      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else if (random < 0.45) {

    endpoint = "get_branch_lof";

    response = http.post(
      `${config.baseUrl}/lofs/get_branch_lof`,

      JSON.stringify({
        organization_id: 10,
      }),

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else if (random < 0.6) {

    endpoint = "get_all_lof";

    response = http.get(
      `${config.baseUrl}/lofs/get-all-lof?page=1`,

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else if (random < 0.72) {

    endpoint = "get_all_log";

    response = http.get(
      `${config.baseUrl}/logs/get-all-log`,

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else if (random < 0.8) {

    endpoint = "organizations";

    response = http.get(
      `${config.baseUrl}/organizations/get-all-organization`,

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else if (random < 0.88) {

    endpoint = "cron_organizations";

    response = http.get(
      `${config.baseUrl}/organization/get_cron_organization`,

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else if (random < 0.95) {

    endpoint = "organization_cycle";

    response = http.get(
      `${config.baseUrl}/organization_cycles/organization-cycle`,

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else if (random < 0.96) {

    endpoint = "get_cron";

    response = http.get(
      `${config.baseUrl}/crons/get_cron`,

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else if (random < 0.97) {

    endpoint = "get_cards";

    response = http.get(
      `${config.baseUrl}/cards/get-cards/482913`,

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else if (random < 0.98) {

    endpoint = "register_card";

    response = http.post(
      `${config.baseUrl}/cards/register`,

      JSON.stringify({
        contract_id: 482913,
        card_number: "8600123456781234",
        expire_date: "2809",
      }),

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else if (random < 0.99) {

    endpoint = "confirm_card";

    response = http.post(
      `${config.baseUrl}/cards/confirm`,

      JSON.stringify({
        session: 8891234,
        otp: "123456",
      }),

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else if (random < 0.995) {

    endpoint = "payment_one";

    response = http.post(
      `${config.baseUrl}/payments/payment-one`,

      JSON.stringify({
        lof_id: 90210,
      }),

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else if (random < 0.999) {

    endpoint = "pwr_sms";

    response = http.post(
      `${config.baseUrl}/pwr/get-sms`,

      JSON.stringify({
        amount: 250000,
        card_number: "8600123456781234",
        expire_date: "2809",
        contract_id: 482913,
      }),

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );


  } else {

    endpoint = "pwr_confirm";

    response = http.post(
      `${config.baseUrl}/pwr/confirm`,

      JSON.stringify({
        otp: "123456",
        session: 8891234,
      }),

      {
        headers: authHeaders(),
        tags: { endpoint },
      }
    );

  }


  if (endpointTrend[endpoint]) {
    endpointTrend[endpoint].add(
      response.timings.duration
    );
  }


  const ok = check(response, {

    "status is 200": (r) =>
      r.status === 200,


    "response time < 2000ms": (r) =>
      r.timings.duration < 2000,


    "response body exists": (r) => {

      if (!bodyRequiredEndpoints.includes(endpoint)) {
        return true;
      }

      return r.body && r.body.length > 0;

    },

  });


  successRate.add(ok);


  sleep(1);
}