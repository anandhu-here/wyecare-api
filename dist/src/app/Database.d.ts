declare class Database {
    private static _instance;
    private _isConnected;
    private _count;
    private constructor();
    get isConnected(): boolean;
    static getInstance(): Database;
    _connect: () => Promise<void>;
}
export default Database;
