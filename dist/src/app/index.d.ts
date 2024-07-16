declare class App {
    private db;
    constructor();
    _init: () => Promise<void>;
    getExpressApp: () => import("express").Application;
}
export default App;
