import { Pool } from "threads";

export interface IThreadPool {
    run(thread: Function, scripts?: string[]);

    send(job: any);

    killAll();

    onError(listener: Function);

    onJobDone(listener: Function);

    onFinished(listener: Function);
}

/**
 * The ThreadPool class serves as a wrapper around the threads.js library.
 * 
 * https://github.com/andywer/threads.js/tree/master
 * 
 * We do this to make it easier to mock multi threading in the unit tests.
 * 
 * See test-config/mocks/MockThreadPool.ts for the mocked version.
 */
export class ThreadPool implements IThreadPool {
    private pool: any;

    constructor(numberOfThreads?: number) {
        this.pool = new Pool(numberOfThreads);
    }

    run(thread: Function, scripts?: string[]) {
        this.pool.run(thread, scripts);
    }

    send(job: any) {
        this.pool.send(job);
    }

    killAll() {
        this.pool.killAll();
    }

    onError(listener: Function) {
        this.pool.on("error", listener);
    }

    onJobDone(listener: Function) {
        this.pool.on("done", listener);
    }

    onFinished(listener: Function) {
        this.pool.on("finished", listener);
    }
}