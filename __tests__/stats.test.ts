import { mean, stddev } from '../stats';

describe('stats module', () => {
  test('mean function calculates the correct mean', () => {
    const values = [1, 2, 3, 4, 5];
    const result = mean(values);
    expect(result).toBe(3);
  });

  test('stddev function calculates the correct standard deviation', () => {
    const values = [1, 2, 3, 4, 5];
    const result = stddev(values);
    expect(result).toBeCloseTo(1.414, 3);
  });

  test('mean function handles empty array', () => {
    const values: number[] = [];
    const result = mean(values);
    expect(result).toBeNaN();
  });

  test('stddev function handles empty array', () => {
    const values: number[] = [];
    const result = stddev(values);
    expect(result).toBeNaN();
  });

  test('mean function handles single element array', () => {
    const values = [5];
    const result = mean(values);
    expect(result).toBe(5);
  });

  test('stddev function handles single element array', () => {
    const values = [5];
    const result = stddev(values);
    expect(result).toBe(0);
  });
});
