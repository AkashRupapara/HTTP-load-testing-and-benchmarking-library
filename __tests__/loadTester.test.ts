import { performance } from 'perf_hooks';
import { reportMetrics } from '../reportMetrics';

describe('loadTester module', () => {
  test('reportMetrics function reports correct metrics', () => {
    // Mocking metrics data
    const metrics = {
      latency: [100, 200, 300, 400, 500],
      errorCount: 1,
    };
    // Mocking performance.now() to return a fixed value
    jest.spyOn(performance, 'now').mockReturnValueOnce(2000);

    const reports = reportMetrics(metrics); // Calling the function under test

    // Assertions to check if metrics are reported correctly
    expect(reports.totalRequests).toBe(6);
    expect(reports.successCount).toBe(5);
    expect(reports.errorRate).toBe(16.666666666666664);
    expect(reports.averageLatency).toBe(300);
    expect(reports.minLatency).toBe(100.00);
    expect(reports.maxLatency).toBe(500.00);
    expect(reports.latencyStdDev).toBe(141.42);
  });
});
