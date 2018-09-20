import { IStorageManager } from "../src/storage/IStorageManager";

export class MockStorageManager implements IStorageManager {
    read(path: string): Promise<string> {
        throw new Error("Method not implemented.");
    }    
    write(path: string, data: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    readJSON<T>(path: string): Promise<T> {
        throw new Error("Method not implemented.");
    }
    writeJSON(path: string, data: any): Promise<void> {
        throw new Error("Method not implemented.");
    }


}