import axios, { Method, AxiosRequestConfig, AxiosError } from 'axios';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as fs from 'fs';

// Defined the structure of the configuration object
export interface Config {
  url: string;
  method: Method;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  qps: number;
  duration: number;
  output?: string;
}

// Defined the structure of the argv object
interface Argv {
  config?: string;
}

// Parse command-line arguments to get the path to the configuration file
const argv = yargs(hideBin(process.argv)).options({
  config: { type: 'string', describe: 'Path to the configuration file' },
}).argv as unknown as Argv;

// Function to read the configuration file
const readConfigFromFile = (configPath: string): Config => {
  try {
    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(rawConfig);
  } catch (error) {
    console.error('Error reading or parsing config file:', error);
    process.exit(1);
  }
};

// Function to send a single HTTP request and measure its latency
const sendRequest = async (config: Config, latencies: number[], successCount: { count: number }, errorCount: { count: number }, responseCodes: Record<number, number>) => {
  const start = Date.now();
  const requestConfig: AxiosRequestConfig = {
    method: config.method,
    url: config.url,
    headers: config.headers,
    data: config.body,
  };

  try {
    const response = await axios(requestConfig);
    const latency = Date.now() - start;
    latencies.push(latency);
    successCount.count++;

    // Record the response status code
    if (response?.status)
        responseCodes[response.status] = (responseCodes[response.status] || 0) + 1;
  } catch (error) {
    errorCount.count++;
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Axios response error:', error.response.status, error.response.data);
        responseCodes[error.response.status] = (responseCodes[error.response.status] || 0) + 1;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Axios request error: No response received', error.message);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Axios setup error:', error.message);
      }
    } else {
      // Handle non-Axios errors
      if (error instanceof ReferenceError && error.message) {
        console.error('Reference error:', error.message);
      } else if (error instanceof SyntaxError && error.message) {
        console.error('Syntax error:', error.message);
      } else if (error instanceof TypeError && error.message) {
        console.error('Type error:', error.message);
      } else if (error instanceof RangeError && error.message) {
        console.error('Range error:', error.message);
      } else if (error instanceof EvalError && error.message) {
        console.error('Eval error:', error.message);
      } else if ((error as NodeJS.ErrnoException).code) {
        // Handle system errors based on the error code
        const systemError = error as NodeJS.ErrnoException;
        switch (systemError.code) {
          case 'ENOENT':
            console.error('System error: No such file or directory', systemError.message);
            break;
          case 'EACCES':
            console.error('System error: Permission denied', systemError.message);
            break;
          case 'EADDRINUSE':
            console.error('System error: Address already in use', systemError.message);
            break;
          case 'ECONNREFUSED':
            console.error('System error: Connection refused', systemError.message);
            break;
          case 'EPIPE':
            console.error('System error: Broken pipe', systemError.message);
            break;
          case 'ECONNRESET':
            console.error('System error: Connection reset by peer', systemError.message);
            break;
          default:
            console.error('System error:', systemError.message);
        }
      } else {
        // Handle any other types of errors
        console.error('Unknown error:', error instanceof Error ? error.message: '');
      }
    }
  }
};

// Function to run the load test
export const runTest = async (config?: Config) => {
  if (!config && argv.config) {
    config = readConfigFromFile(argv.config);
  } else if (!config) {
    console.error('Configuration must be provided either as an argument or through a config file.');
    process.exit(1);
  }

  const { url, method, headers, body, qps, duration, output } = config;

  let successCount = { count: 0 };
  let errorCount = { count: 0 };
  let latencies: number[] = [];
  let responseCodes: Record<number, number> = {};

  const interval = 1000 / qps;
  const endTime = Date.now() + duration * 1000;
  const promises: Promise<void>[] = [];

  // Schedule requests at the specified QPS
  while (Date.now() < endTime) {
    promises.push(new Promise(resolve => setTimeout(async () => {
      await sendRequest(config!, latencies, successCount, errorCount, responseCodes);
      resolve();
    }, interval)));

    if (promises.length >= qps) {
      await Promise.all(promises);
      promises.length = 0; // Clear the array
    }
  }

  // Ensure all pending requests are completed
  await Promise.all(promises);

  // Calculate metrics
  const totalRequests = successCount.count + errorCount.count;
  const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const errorRate = (errorCount.count / totalRequests) * 100;
  latencies.sort((a, b) => a - b);
  const p90Latency = latencies[Math.floor(latencies.length * 0.9)];
  const throughput = totalRequests / duration;

  const results = {
    totalRequests,
    successCount: successCount.count,
    errorCount: errorCount.count,
    averageLatency: averageLatency.toFixed(2),
    p90Latency: p90Latency.toFixed(2),
    errorRate: errorRate.toFixed(2),
    throughput: +throughput.toFixed(2),
    responseCodes,
  };

  // Output results in the specified format
  if (output === 'json') {
    console.log(JSON.stringify(results, null, 2));
  }

  return results;
};

// Example usage with configuration passed directly
const exampleConfig: Config = {
  url: 'http://example.com',
  method: 'GET',
  qps: 10,
  duration: 10,
};

runTest(exampleConfig).catch(err => console.error('Unexpected error:', err));