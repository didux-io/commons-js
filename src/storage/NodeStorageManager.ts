import { IStorageManager } from "./IStorageManager";
import * as fs from "fs";

export class NodeStorageManager implements IStorageManager {
    remove(path: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.unlink(path, (error) => {
                if(!error)
                    resolve();
                else
                    reject(error);
            });
        });
    }

    read(path: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(path, (error, data) => {
                if(!error) {
                    resolve(data.toString());
                }
                else {
                    reject(error);
                }
            });
        });
    }    
    write(path: string, data: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.writeFile(path, data, (error) => {
                if(error)
                    resolve();
                else
                    reject(error);
            });
        });
    }

    readJSON<T>(path: string): Promise<T> {
        return this.read(path).then(
            (str) => JSON.parse(str)
        );
    }
    writeJSON(path: string, data: any): Promise<void> {
        return this.write(path, JSON.stringify(data));
    }
}
