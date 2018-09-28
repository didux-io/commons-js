/**
 * Abstraction around a file system.
 */
export interface IStorageManager {
    /**
     * Reads the content of a file as text.
     */
    read(path: string): Promise<string>;
    /**
     * Writes the given text data to the given path.
     */
    write(path: string, data: string): Promise<void>;

    /**
     * Reads the content of a file and parses it as JSON.
     * A Javascript object will be returned.
     */
    readJSON<T>(path: string): Promise<T>;
    /**
     * Writes the given Javascript object as JSON to the given path.
     */
    writeJSON(path: string, data: any): Promise<void>;
}
