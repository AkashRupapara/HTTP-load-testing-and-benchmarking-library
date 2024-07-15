import axios from 'axios';
import { Config, runTest } from './index'; // Export the runTest function from index.ts for testing

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('runTest should correctly calculate metrics', async () => {
  mockedAxios.get.mockResolvedValue({ status: 200 });

  const config = {
    url: 'http://example.com',
    method: 'GET',
    qps: 10,
    duration: 1,
    output: 'json'
  } as Config;

  // Call the runTest function with the mock config
  const results = await runTest(config);

  // Assertions based on expected behavior
  expect(results.totalRequests).toBeGreaterThan(0);
  expect(results.successCount).toBeGreaterThan(0);
  expect(results.errorCount).toBe(0);
  expect(results.averageLatency).toBeDefined();
  expect(results.p90Latency).toBeDefined();
  expect(results.errorRate).toBe('0.00');
  expect(results.throughput as unknown as Number).toBeGreaterThan(0);
});