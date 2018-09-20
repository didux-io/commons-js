import { ThreadPool } from "./ThreadPool";

describe("ThreadPool", () => {
    let pool: ThreadPool;
    let internalPool: any;

    beforeEach(() => {
        pool = new ThreadPool();
        internalPool = (<any>pool).pool;
    });

    it("should handle run correctly", () => {
        spyOn(internalPool, "run");

        let thread = () => {};
        let scripts = [
            "one.js", "two.js", "three.js"
        ];

        pool.run(thread, scripts);

        expect(internalPool.run).toHaveBeenCalledWith(thread, scripts);
    });

    it("should handle send correctly", () => {
        spyOn(internalPool, "send");

        let job = {this: "is", sparta: ":)"};

        pool.send(job);

        expect(internalPool.send).toHaveBeenCalledWith(job);
    });

    it("should handle killAll correctly", () => {
        spyOn(internalPool, "killAll");

        pool.killAll();

        expect(internalPool.killAll).toHaveBeenCalled();
    });

    it("should handle onError correctly", () => {
        spyOn(internalPool, "on");

        let listener = () => {};

        pool.onError(listener);

        expect(internalPool.on).toHaveBeenCalledWith("error", listener);
    });

    it("should handle onJobDone correctly", () => {
        spyOn(internalPool, "on");

        let listener = () => {};

        pool.onJobDone(listener);

        expect(internalPool.on).toHaveBeenCalledWith("done", listener);
    });

    it("should handle onFinished correctly", () => {
        spyOn(internalPool, "on");

        let listener = () => {};

        pool.onFinished(listener);

        expect(internalPool.on).toHaveBeenCalledWith("finished", listener);
    });
});