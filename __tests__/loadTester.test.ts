import { performance } from 'perf_hooks';
import url from 'url';
import { startLoadTest, reportMetrics } from '../loadTester';
import { Command } from 'commander';

const parsedUrl = {
  protocol: 'http:',
  hostname: 'example.com',
  port: null,
  path: '/',
  href: 'http://example.com/',
  pathname: '/',
};

describe('loadTester module', () => {
  let originalProcess: NodeJS.Process;

  beforeAll(() => {
    originalProcess = global.process;
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.process = originalProcess;
  });

  beforeEach(() => {
    // Mock dependencies
    jest.mock('commander', () => {
      const mCommand = {
        requiredOption: jest.fn().mockReturnThis(),
        option: jest.fn().mockReturnThis(),
        parse: jest.fn().mockReturnThis(),
        opts: jest.fn(()=>{
          const mockOpts = {
            url: 'http://example.com',
            qps: '20',
            concurrency: '5',
            method: 'POST',
            header: ['Content-Type: application/json'],
            data: '{"key":"value"}',
            duration: '30',
          };
          return mockOpts;
        }),
      };
      return { Command: jest.fn(() => mCommand) };
    });    
    jest.spyOn(url, 'parse').mockReturnValue(parsedUrl as unknown as url.UrlWithStringQuery);
  });

  test('startLoadTest initiates correct number of requests', async () => {
    // Mocking setTimeout to call the function synchronously
    jest.spyOn(global, 'setTimeout').mockImplementationOnce((fn) => {
      fn();
      return 1 as any; // Mocking the timer ID
    });

    await startLoadTest(); // Calling the function under test

    // Asserting that setTimeout was called exactly once
    expect(setTimeout).toHaveBeenCalledTimes(1);
  });

  test('reportMetrics function reports correct metrics', () => {
    // Mocking metrics data
    const metrics = {
      latency: [100, 200, 300, 400, 500],
      errorCount: 1,
    };

    const consoleSpy = jest.spyOn(console, 'log');

    // Mocking performance.now() to return a fixed value
    jest.spyOn(performance, 'now').mockReturnValueOnce(2000);

    reportMetrics(); // Calling the function under test

    // Assertions to check if metrics are reported correctly
    expect(consoleSpy).toHaveBeenCalledWith('Total requests: 6');
    expect(consoleSpy).toHaveBeenCalledWith('Successful requests: 5');
    expect(consoleSpy).toHaveBeenCalledWith('Error rate: 16.666666666666664%');
    expect(consoleSpy).toHaveBeenCalledWith('Average latency: 300.00ms');
    expect(consoleSpy).toHaveBeenCalledWith('Min latency: 100.00ms');
    expect(consoleSpy).toHaveBeenCalledWith('Max latency: 500.00ms');
    expect(consoleSpy).toHaveBeenCalledWith('Latency standard deviation: 158.11ms');
  });
});
