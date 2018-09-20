import { IThreadPool } from "../src/merkle/ThreadPool";

export class MockThreadPool implements IThreadPool {
    errorListeners: Function[] = [];
    jobDoneListener: Function[] = [];
    finishedListeners: Function[] = [];

    poolIsKilled: boolean = false;

    run(thread: Function, scripts?: string[]) {
        // Do nothing, we don't actually run any logic.
    }

    send(job: any) {
        // Do nothing
    }

    killAll() {
        this.poolIsKilled = true;
    }

    onError(listener: Function) {
        this.errorListeners.push(listener);
    }

    onJobDone(listener: Function) {
        this.jobDoneListener.push(listener);
    }

    onFinished(listener: Function) {
        this.finishedListeners.push(listener);
    }

    notifyErrorListeners(job: any, error: any) {
        this.errorListeners.forEach((listener) => listener(job, error));
    }

    notifyJobDoneListener(job: any, result: any) {
        this.jobDoneListener.forEach((listener) => listener(job, result));
    }

    notifyFinishedListener() {
        this.finishedListeners.forEach((listener) => listener());
    }
}