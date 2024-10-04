import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 2 }, // Monte à 50 utilisateurs en 30s
    { duration: "1m", target: 2 }, // Maintient 50 utilisateurs pendant 1m
    { duration: "10s", target: 0 }, // Redescend à 0 utilisateurs
  ],
  tlsAuth: [
    {
      cert: open("../etc/ssl/certs/tswift.pem"),
      key: open("../etc/ssl/certs/tswift.pem"),
    },
  ],
};

export default function () {
  const res = http.get("https://tswift.local");
  check(res, {
    "status was 200": (r) => r.status === 200,
    "transaction time OK": (r) => r.timings.duration < 200,
  });
  sleep(1);
}