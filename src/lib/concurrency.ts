export const DEFAULT_CONCURRENCY_LIMIT = 4;

/**
 * Maps async work over items while limiting concurrent workers.
 */
export async function mapWithConcurrency<T, TResult>(
    items: T[],
    concurrency: number,
    worker: (item: T, index: number) => Promise<TResult>
): Promise<TResult[]> {
    if (!Number.isFinite(concurrency) || concurrency < 1) {
        throw new Error(`Invalid concurrency value: ${concurrency}`);
    }

    if (items.length === 0) return [];

    const results = new Array<TResult>(items.length);
    let nextIndex = 0;

    const runWorker = async () => {
        while (true) {
            const currentIndex = nextIndex++;
            if (currentIndex >= items.length) return;
            results[currentIndex] = await worker(items[currentIndex], currentIndex);
        }
    };

    const workerCount = Math.min(concurrency, items.length);
    await Promise.all(Array.from({ length: workerCount }, () => runWorker()));

    return results;
}
