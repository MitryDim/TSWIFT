FROM grafana/k6

COPY k6-bench.js /etc/k6/scripts/

CMD ["k6", "run", "/etc/k6/scripts/k6-bench.js"]
