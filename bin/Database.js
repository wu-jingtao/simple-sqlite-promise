"use strict";
/**
 * Created by 吴劲韬 on 2017/3/13.
 */
const sqlite3 = require("sqlite3");
class Database {
    static get OPEN_READONLY() {
        return sqlite3.OPEN_READONLY;
    }
    static get OPEN_READWRITE() {
        return sqlite3.OPEN_READWRITE;
    }
    static get OPEN_CREATE() {
        return sqlite3.OPEN_CREATE;
    }
    /**
     * 开启以显示更多的错误消息。注意！这会严重影响数据库的性能
     *
     * @static
     * @returns {typeof Database}
     *
     * @memberOf Database
     */
    static verbose() {
        sqlite3.verbose();
        return Database;
    }
    /**
     * 根据文件路径异步打开sqlite数据库
     *
     * @static
     * @param {string} filename sqlite数据库的文健路径
     * @param {number} [mode=Database.OPEN_CREATE | Database.OPEN_READWRITE] 连接模式
     * @param {boolean} [cached=false] 是否使用之前打开过的连接
     * @returns {Promise<Database>} 返回数据库对象
     *
     * @memberOf Database
     */
    static connectDB(filename, mode = Database.OPEN_CREATE | Database.OPEN_READWRITE, cached = false) {
        return new Promise(function (resolve, reject) {
            if (cached) {
                const db = sqlite3.cached.Database(filename, mode, function (err) {
                    err ? reject(err) : resolve(new Database(db));
                });
            }
            const db = new sqlite3.Database(filename, mode, function (err) {
                err ? reject(err) : resolve(new Database(db));
            });
        });
    }
    constructor(db) {
        this.db = db;
    }
    /**
     * 关闭数据库连接
     *
     * @returns {Promise<void>}
     *
     * @memberOf Database
     */
    close() {
        return new Promise((resolve, reject) => {
            this.db.close(err => {
                err ? reject(err) : resolve();
            });
        });
    }
    /**
     * 当有未捕获到的数据库错误时触发
     *
     * @param {(err:Error)=>void} callback 回调函数
     *
     * @memberOf Database
     */
    onDatabaseError(callback) {
        this.db.on('error', callback);
    }
    /**
     * 执行"单条"sql语句(多条语句只执行第一条)，不返回sql执行结果。如果执行的是INSERT操作则返回插入id lastID，如果是UPDATE或DELETE 则会返回受影响的行数changes
     *
     * @param {string} sql 执行的sql语句
     * @param {any} param 如果sql中使用了占位符，则可在这传递参数
     * @returns {Promise<{ lastID?: number, changes?: number }>}
     *
     * @memberOf Database
     */
    run(sql, param) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, param, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        lastID: this.lastID,
                        changes: this.changes
                    });
                }
            });
        });
    }
    /**
     * 执行一条sql查询，返回第一行结果。结果按照{列名：值}键值对的形式返回。如果查询结果为空则返回空
     *
     * @param {string} sql sql查询语句
     * @param {*} param 如果sql中使用了占位符，则可在这传递参数
     * @returns {Promise<any>} 查询返回的结果
     *
     * @memberOf Database
     */
    get(sql, param) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, param, function (err, row) {
                err == null ? resolve(row) : reject(err);
            });
        });
    }
    /**
     * 执行一条sql查询，返回所有结果。结果按照{列名：值}键值对数组的形式返回。如果查询结果为空则返回空数组
     *
     * @param {string} sql sql查询语句
     * @param {*} param 如果sql中使用了占位符，则可在这传递参数
     * @returns {Promise<any[]>} 查询返回的结果
     *
     * @memberOf Database
     */
    all(sql, param) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, param, function (err, rows) {
                err == null ? resolve(rows) : reject(err);
            });
        });
    }
    /**
     * 执行多条sql语句，不返回任何结果。如果其中一条sql语句执行失败，则后续的sql语句将不会被执行（可以利用事务包裹所有语句来确保执行结果与预料一致）。
     *
     * @param {string} sql 要执行的sql语句
     * @returns {Promise<void>}
     *
     * @memberOf Database
     */
    exec(sql) {
        return new Promise((resolve, reject) => {
            this.db.exec(sql, function (err) {
                err == null ? resolve() : reject(err);
            });
        });
    }
}
module.exports = Database;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q0o7QUFFRCxpQkFBUyxRQUFRLENBQUMiLCJmaWxlIjoiRGF0YWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ3JlYXRlZCBieSDlkLTlirLpn6wgb24gMjAxNy8zLzEzLlxyXG4gKi9cclxuaW1wb3J0IHNxbGl0ZTMgPSByZXF1aXJlKCdzcWxpdGUzJyk7XHJcblxyXG5jbGFzcyBEYXRhYmFzZSB7XHJcblxyXG4gICAgc3RhdGljIGdldCBPUEVOX1JFQURPTkxZKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHNxbGl0ZTMuT1BFTl9SRUFET05MWTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IE9QRU5fUkVBRFdSSVRFKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHNxbGl0ZTMuT1BFTl9SRUFEV1JJVEU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBPUEVOX0NSRUFURSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBzcWxpdGUzLk9QRU5fQ1JFQVRFO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5byA5ZCv5Lul5pi+56S65pu05aSa55qE6ZSZ6K+v5raI5oGv44CC5rOo5oSP77yB6L+Z5Lya5Lil6YeN5b2x5ZON5pWw5o2u5bqT55qE5oCn6IO9XHJcbiAgICAgKiBcclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEByZXR1cm5zIHt0eXBlb2YgRGF0YWJhc2V9IFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHZlcmJvc2UoKTogdHlwZW9mIERhdGFiYXNlIHtcclxuICAgICAgICBzcWxpdGUzLnZlcmJvc2UoKTtcclxuICAgICAgICByZXR1cm4gRGF0YWJhc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja7mlofku7bot6/lvoTlvILmraXmiZPlvIBzcWxpdGXmlbDmja7lupNcclxuICAgICAqIFxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIHNxbGl0ZeaVsOaNruW6k+eahOaWh+WBpei3r+W+hFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttb2RlPURhdGFiYXNlLk9QRU5fQ1JFQVRFIHwgRGF0YWJhc2UuT1BFTl9SRUFEV1JJVEVdIOi/nuaOpeaooeW8j1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbY2FjaGVkPWZhbHNlXSDmmK/lkKbkvb/nlKjkuYvliY3miZPlvIDov4fnmoTov57mjqVcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPERhdGFiYXNlPn0g6L+U5Zue5pWw5o2u5bqT5a+56LGhXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29ubmVjdERCKGZpbGVuYW1lOiBzdHJpbmcsIG1vZGU6IG51bWJlciA9IERhdGFiYXNlLk9QRU5fQ1JFQVRFIHwgRGF0YWJhc2UuT1BFTl9SRUFEV1JJVEUsIGNhY2hlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPERhdGFiYXNlPihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmIChjYWNoZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRiID0gc3FsaXRlMy5jYWNoZWQuRGF0YWJhc2UoZmlsZW5hbWUsIG1vZGUsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUobmV3IERhdGFiYXNlKGRiKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBkYiA9IG5ldyBzcWxpdGUzLkRhdGFiYXNlKGZpbGVuYW1lLCBtb2RlLCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUobmV3IERhdGFiYXNlKGRiKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHNxbGl0ZeaVsOaNruW6k+i/nuaOpVxyXG4gICAgcHJpdmF0ZSBkYjogc3FsaXRlMy5EYXRhYmFzZTtcclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKGRiOiBzcWxpdGUzLkRhdGFiYXNlKSB7XHJcbiAgICAgICAgdGhpcy5kYiA9IGRiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWz6Zet5pWw5o2u5bqT6L+e5o6lXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGIuY2xvc2UoZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b2T5pyJ5pyq5o2V6I635Yiw55qE5pWw5o2u5bqT6ZSZ6K+v5pe26Kem5Y+RXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7KGVycjpFcnJvcik9PnZvaWR9IGNhbGxiYWNrIOWbnuiwg+WHveaVsFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgb25EYXRhYmFzZUVycm9yKGNhbGxiYWNrOiAoZXJyOiBFcnJvcikgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZGIub24oJ2Vycm9yJywgY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omn6KGMXCLljZXmnaFcInNxbOivreWPpSjlpJrmnaHor63lj6Xlj6rmiafooYznrKzkuIDmnaEp77yM5LiN6L+U5Zuec3Fs5omn6KGM57uT5p6c44CC5aaC5p6c5omn6KGM55qE5pivSU5TRVJU5pON5L2c5YiZ6L+U5Zue5o+S5YWlaWQgbGFzdElE77yM5aaC5p6c5pivVVBEQVRF5oiWREVMRVRFIOWImeS8mui/lOWbnuWPl+W9seWTjeeahOihjOaVsGNoYW5nZXNcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNxbCDmiafooYznmoRzcWzor63lj6VcclxuICAgICAqIEBwYXJhbSB7YW55fSBwYXJhbSDlpoLmnpxzcWzkuK3kvb/nlKjkuobljaDkvY3nrKbvvIzliJnlj6/lnKjov5nkvKDpgJLlj4LmlbBcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHsgbGFzdElEPzogbnVtYmVyLCBjaGFuZ2VzPzogbnVtYmVyIH0+fSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIHJ1bihzcWw6IHN0cmluZywgcGFyYW06IGFueSk6IFByb21pc2U8eyBsYXN0SUQ/OiBudW1iZXIsIGNoYW5nZXM/OiBudW1iZXIgfT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGIucnVuKHNxbCwgcGFyYW0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RJRDogdGhpcy5sYXN0SUQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZXM6IHRoaXMuY2hhbmdlc1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJp+ihjOS4gOadoXNxbOafpeivou+8jOi/lOWbnuesrOS4gOihjOe7k+aenOOAgue7k+aenOaMieeFp3vliJflkI3vvJrlgLx96ZSu5YC85a+555qE5b2i5byP6L+U5Zue44CC5aaC5p6c5p+l6K+i57uT5p6c5Li656m65YiZ6L+U5Zue56m6XHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzcWwgc3Fs5p+l6K+i6K+t5Y+lXHJcbiAgICAgKiBAcGFyYW0geyp9IHBhcmFtIOWmguaenHNxbOS4reS9v+eUqOS6huWNoOS9jeespu+8jOWImeWPr+WcqOi/meS8oOmAkuWPguaVsFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn0g5p+l6K+i6L+U5Zue55qE57uT5p6cXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBnZXQoc3FsOiBzdHJpbmcsIHBhcmFtOiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGIuZ2V0KHNxbCwgcGFyYW0sIGZ1bmN0aW9uIChlcnI6IEVycm9yLCByb3c6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgZXJyID09IG51bGwgPyByZXNvbHZlKHJvdykgOiByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJp+ihjOS4gOadoXNxbOafpeivou+8jOi/lOWbnuaJgOaciee7k+aenOOAgue7k+aenOaMieeFp3vliJflkI3vvJrlgLx96ZSu5YC85a+55pWw57uE55qE5b2i5byP6L+U5Zue44CC5aaC5p6c5p+l6K+i57uT5p6c5Li656m65YiZ6L+U5Zue56m65pWw57uEXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzcWwgc3Fs5p+l6K+i6K+t5Y+lXHJcbiAgICAgKiBAcGFyYW0geyp9IHBhcmFtIOWmguaenHNxbOS4reS9v+eUqOS6huWNoOS9jeespu+8jOWImeWPr+WcqOi/meS8oOmAkuWPguaVsFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55W10+fSDmn6Xor6Lov5Tlm57nmoTnu5PmnpxcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIGFsbChzcWw6IHN0cmluZywgcGFyYW06IGFueSk6IFByb21pc2U8YW55W10+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRiLmFsbChzcWwsIHBhcmFtLCBmdW5jdGlvbiAoZXJyOiBFcnJvciwgcm93czogYW55W10pIHtcclxuICAgICAgICAgICAgICAgIGVyciA9PSBudWxsID8gcmVzb2x2ZShyb3dzKSA6IHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omn6KGM5aSa5p2hc3Fs6K+t5Y+l77yM5LiN6L+U5Zue5Lu75L2V57uT5p6c44CC5aaC5p6c5YW25Lit5LiA5p2hc3Fs6K+t5Y+l5omn6KGM5aSx6LSl77yM5YiZ5ZCO57ut55qEc3Fs6K+t5Y+l5bCG5LiN5Lya6KKr5omn6KGM77yI5Y+v5Lul5Yip55So5LqL5Yqh5YyF6KO55omA5pyJ6K+t5Y+l5p2l56Gu5L+d5omn6KGM57uT5p6c5LiO6aKE5paZ5LiA6Ie077yJ44CCXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzcWwg6KaB5omn6KGM55qEc3Fs6K+t5Y+lXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBleGVjKHNxbDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kYi5leGVjKHNxbCwgZnVuY3Rpb24gKGVycjogRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGVyciA9PSBudWxsID8gcmVzb2x2ZSgpIDogcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IERhdGFiYXNlOyJdfQ==
