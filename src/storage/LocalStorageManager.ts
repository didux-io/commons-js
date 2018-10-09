import { IStorageManager } from "./IStorageManager";

export class LocalStorageManager implements IStorageManager {
    remove(path: string): Promise<void> {
        localStorage.removeItem(path);

        return Promise.resolve();
    }

    read(path: string): Promise<string> {
        let data = localStorage.getItem(path);

        return Promise.resolve(data);
    }    
    write(path: string, data: string): Promise<void> {
        localStorage.setItem(path, data);

        return Promise.resolve();
    }

    readJSON<T>(path: string): Promise<T> {
        return this.read(path).then(
            (data) => JSON.parse(data)
        );
    }
    writeJSON(path: string, data: any): Promise<void> {
        return this.write(path, JSON.stringify(data));
    }
}