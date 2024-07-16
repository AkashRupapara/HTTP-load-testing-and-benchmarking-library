export const mean = (arr: number[]): number => {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
};

export const stddev = (arr: number[]): number => {
    const avg = mean(arr);
    const squareDiffs = arr.map(value => {
        const diff = value - avg;
        return diff * diff;
    });
    const avgSquareDiff = mean(squareDiffs);
    return Math.sqrt(avgSquareDiff);
};
  