import { Metrics } from './loadTester';
import { mean, stddev } from './stats';

// Function to report metrics
export const reportMetrics = (observations: Metrics) => {
    const totalRequests = observations.latency.length + observations.errorCount;
    const successCount = observations.latency.length;
    const averageLatency = mean(observations.latency);
    const minLatency = Math.min(...observations.latency);
    const maxLatency = Math.max(...observations.latency);
    const latencyStdDev = stddev(observations.latency);

    return {
        totalRequests,
        successCount,
        errorRate: (observations.errorCount / totalRequests) * 100,
        averageLatency: +averageLatency.toFixed(2),
        minLatency: +minLatency.toFixed(2),
        maxLatency: +maxLatency.toFixed(2),
        latencyStdDev: +latencyStdDev.toFixed(2)
    }
  };
  