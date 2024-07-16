import { Command } from 'commander';
import { performance } from 'perf_hooks';
import http from 'http';
import https from 'https';
import { makeRequest, startLoadTest, reportMetrics } from '../loadTester';

// Mock dependencies
jest.mock('http');
jest.mock('https');
jest.mock('url');
jest.mock('commander');

// Mock commander Command instance
const mockedCommand = Command as jest.MockedClass<typeof Command>;
const mockOpts = {
  url: 'http://example.com',
  qps: '20',
  concurrency: '5',
  method: 'POST',
  header: ['Content-Type: application/json'],
  data: '{"key":"value"}',
  duration: '30',
};
const mockedProgram = new mockedCommand();

describe('loadTester module', () => {
  let originalProcess: NodeJS.Process;

  beforeAll(() => {
    originalProcess = global.process;
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.process = originalProcess;
  });

  test('startLoadTest initiates correct number of requests', async () => {
    jest.spyOn(global, 'setTimeout').mockImplementationOnce((fn) => {
      fn();
      return 1 as any;
    });

    await startLoadTest();

    expect(setTimeout).toHaveBeenCalledTimes(1);
  });

  test('reportMetrics function reports correct metrics', () => {
    const metrics = {
      latency: [100, 200, 300, 400, 500],
      errorCount: 1,
    };

    const consoleSpy = jest.spyOn(console, 'log');

    jest.spyOn(performance, 'now').mockReturnValueOnce(2000);

    reportMetrics();

    expect(consoleSpy).toHaveBeenCalledWith('Total requests: 6');
    expect(consoleSpy).toHaveBeenCalledWith('Successful requests: 5');
    expect(consoleSpy).toHaveBeenCalledWith('Error rate: 16.666666666666664%');
    expect(consoleSpy).toHaveBeenCalledWith('Average latency: 300.00ms');
    expect(consoleSpy).toHaveBeenCalledWith('Min latency: 100.00ms');
    expect(consoleSpy).toHaveBeenCalledWith('Max latency: 500.00ms');
    expect(consoleSpy).toHaveBeenCalledWith('Latency standard deviation: 158.11ms');
  });
});