import { Command } from 'commander';
import { performance } from 'perf_hooks';
import { reportMetrics } from './reportMetrics';
import http from 'http';
import https from 'https';
import url from 'url';

const program = new Command();

program
  .requiredOption('-u, --url <url>', 'URL to load test')
  .requiredOption('-q, --qps <qps>', 'Queries per second')
  .option('-c, --concurrency <concurrency>', 'Number of concurrent requests', '1')
  .option('-m, --method <method>', 'HTTP method to use', 'GET')
  .option('-H, --header <headers...>', 'Custom headers')
  .option('-d, --data <data>', 'Request payload')
  .option('-t, --duration <duration>', 'Test duration in seconds', '30') // New duration option
  .parse(process.argv);

const options = program.opts();
const targetUrl = options.url;
const qps = parseInt(options.qps, 10);
const concurrency = parseInt(options.concurrency, 10);
const method = options.method.toUpperCase();
const headers = options.header ? options.header.reduce((acc: any, h: string) => {
  const [key, value] = h.split(':');
  acc[key.trim()] = value.trim();
  return acc;
}, {}) : {};
const data = options.data || '';
const duration = parseInt(options.duration, 10) * 1000; // Convert duration to milliseconds

if (!targetUrl) {
  console.error('Error: URL is required.');
  process.exit(1);
}

const parsedUrl = url.parse(targetUrl);
const httpModule = parsedUrl.protocol === 'https:' ? https : http;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Define metrics interface and initialize metrics
export interface Metrics {
  latency: number[];
  errorCount: number;
}

const metrics: Metrics = {
  latency: [],
  errorCount: 0,
};

// Function to make HTTP/HTTPS request
export const makeRequest = () => {
  const start = performance.now();
  const req = httpModule.request(targetUrl, { method, headers }, (res) => {
    res.on('data', () => {}); // Consume response data to free up memory
    res.on('end', () => {
      const end = performance.now();
      metrics.latency.push(end - start);
    });
  });

  req.on('error', () => {
    metrics.errorCount++;
  });

  if (data) {
    req.write(data);
  }

  req.end();
};

const startLoadTest = async () => {
  const interval = 1000 / qps; // Interval between requests in milliseconds
  const startTime = performance.now();
  const endTime = startTime + duration;

  const worker = async () => {
    while (performance.now() < endTime) {
      makeRequest();
      await sleep(interval);
    }
  };

  const workers = new Array(concurrency).fill(null).map(() => worker());
  await Promise.all(workers); // Start all workers

  // Ensure to stop making requests after the specified duration
  const reports = reportMetrics(metrics); // Report metrics after test completes
  console.log(`Total requests: ${reports.totalRequests}`);
  console.log(`Successful requests: ${reports.successCount}`);
  console.log(`Error rate: ${reports.errorRate}%`);
  console.log(`Average latency: ${reports.averageLatency}ms`);
  console.log(`Min latency: ${reports.minLatency}ms`);
  console.log(`Max latency: ${reports.maxLatency}ms`);
  console.log(`Latency standard deviation: ${reports.latencyStdDev}ms`);

  process.exit(0); // Force terminate the process
};

startLoadTest(); // Start the load test