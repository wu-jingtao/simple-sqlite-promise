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
        this._db = db;
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
            this._db.close(err => {
                err ? reject(err) : resolve();
            });
        });
    }
    /**
     * 注册事件监听器
     *
     * @param {(err:Error)=>void} callback 回调函数
     *
     * @memberOf Database
     */
    on(event, callback) {
        this._db.on(event, callback);
    }
    /**
     * 执行"单条"sql语句(多条语句只执行第一条)，不返回sql执行结果。如果执行的是INSERT操作则返回插入id lastID，如果是UPDATE或DELETE 则会返回受影响的行数changes
     *
     * @param {string} sql 执行的sql语句
     * @param {string | number | boolean | void} param 如果sql中使用了占位符，则可在这传递参数
     * @returns {Promise<{ lastID?: number, changes?: number }>}
     *
     * @memberOf Database
     */
    run(sql, ...param) {
        return new Promise((resolve, reject) => {
            this._db.run(sql, ...param, function (err) {
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
     * @param {string | number | boolean | void} param 如果sql中使用了占位符，则可在这传递参数
     * @returns {Promise<any>} 查询返回的结果
     *
     * @memberOf Database
     */
    get(sql, ...param) {
        return new Promise((resolve, reject) => {
            this._db.get(sql, param, function (err, row) {
                err == null ? resolve(row) : reject(err);
            });
        });
    }
    /**
     * 执行一条sql查询，返回所有结果。结果按照{列名：值}键值对数组的形式返回。如果查询结果为空则返回空数组
     *
     * @param {string} sql sql查询语句
     * @param {string | number | boolean | void} param 如果sql中使用了占位符，则可在这传递参数
     * @returns {Promise<any[]>} 查询返回的结果
     *
     * @memberOf Database
     */
    all(sql, ...param) {
        return new Promise((resolve, reject) => {
            this._db.all(sql, param, function (err, rows) {
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
            this._db.exec(sql, function (err) {
                err == null ? resolve() : reject(err);
            });
        });
    }
}
module.exports = Database;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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O1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFFRCxpQkFBUyxRQUFRLENBQUMiLCJmaWxlIjoiRGF0YWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ3JlYXRlZCBieSDlkLTlirLpn6wgb24gMjAxNy8zLzEzLlxyXG4gKi9cclxuaW1wb3J0IHNxbGl0ZTMgPSByZXF1aXJlKCdzcWxpdGUzJyk7XHJcblxyXG5jbGFzcyBEYXRhYmFzZSB7XHJcblxyXG4gICAgc3RhdGljIGdldCBPUEVOX1JFQURPTkxZKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHNxbGl0ZTMuT1BFTl9SRUFET05MWTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IE9QRU5fUkVBRFdSSVRFKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHNxbGl0ZTMuT1BFTl9SRUFEV1JJVEU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBPUEVOX0NSRUFURSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBzcWxpdGUzLk9QRU5fQ1JFQVRFO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5byA5ZCv5Lul5pi+56S65pu05aSa55qE6ZSZ6K+v5raI5oGv44CC5rOo5oSP77yB6L+Z5Lya5Lil6YeN5b2x5ZON5pWw5o2u5bqT55qE5oCn6IO9XHJcbiAgICAgKiBcclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEByZXR1cm5zIHt0eXBlb2YgRGF0YWJhc2V9IFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHZlcmJvc2UoKTogdHlwZW9mIERhdGFiYXNlIHtcclxuICAgICAgICBzcWxpdGUzLnZlcmJvc2UoKTtcclxuICAgICAgICByZXR1cm4gRGF0YWJhc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja7mlofku7bot6/lvoTlvILmraXmiZPlvIBzcWxpdGXmlbDmja7lupNcclxuICAgICAqIFxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIHNxbGl0ZeaVsOaNruW6k+eahOaWh+WBpei3r+W+hFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttb2RlPURhdGFiYXNlLk9QRU5fQ1JFQVRFIHwgRGF0YWJhc2UuT1BFTl9SRUFEV1JJVEVdIOi/nuaOpeaooeW8j1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbY2FjaGVkPWZhbHNlXSDmmK/lkKbkvb/nlKjkuYvliY3miZPlvIDov4fnmoTov57mjqVcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPERhdGFiYXNlPn0g6L+U5Zue5pWw5o2u5bqT5a+56LGhXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29ubmVjdERCKGZpbGVuYW1lOiBzdHJpbmcsIG1vZGU6IG51bWJlciA9IERhdGFiYXNlLk9QRU5fQ1JFQVRFIHwgRGF0YWJhc2UuT1BFTl9SRUFEV1JJVEUsIGNhY2hlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPERhdGFiYXNlPihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmIChjYWNoZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRiID0gc3FsaXRlMy5jYWNoZWQuRGF0YWJhc2UoZmlsZW5hbWUsIG1vZGUsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUobmV3IERhdGFiYXNlKGRiKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBkYiA9IG5ldyBzcWxpdGUzLkRhdGFiYXNlKGZpbGVuYW1lLCBtb2RlLCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUobmV3IERhdGFiYXNlKGRiKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWOn+Wni+eahHNxbGl0ZTPmlbDmja7lupPov57mjqUqL1xyXG4gICAgcHJpdmF0ZSBfZGI6IHNxbGl0ZTMuRGF0YWJhc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihkYjogc3FsaXRlMy5EYXRhYmFzZSkge1xyXG4gICAgICAgIHRoaXMuX2RiID0gZGI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhbPpl63mlbDmja7lupPov57mjqVcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgY2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGIuY2xvc2UoZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rOo5YaM5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7KGVycjpFcnJvcik9PnZvaWR9IGNhbGxiYWNrIOWbnuiwg+WHveaVsFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnI6IEVycm9yKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGIub24oZXZlbnQsIGNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJp+ihjFwi5Y2V5p2hXCJzcWzor63lj6Uo5aSa5p2h6K+t5Y+l5Y+q5omn6KGM56ys5LiA5p2hKe+8jOS4jei/lOWbnnNxbOaJp+ihjOe7k+aenOOAguWmguaenOaJp+ihjOeahOaYr0lOU0VSVOaTjeS9nOWImei/lOWbnuaPkuWFpWlkIGxhc3RJRO+8jOWmguaenOaYr1VQREFUReaIlkRFTEVURSDliJnkvJrov5Tlm57lj5flvbHlk43nmoTooYzmlbBjaGFuZ2VzXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzcWwg5omn6KGM55qEc3Fs6K+t5Y+lXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCB2b2lkfSBwYXJhbSDlpoLmnpxzcWzkuK3kvb/nlKjkuobljaDkvY3nrKbvvIzliJnlj6/lnKjov5nkvKDpgJLlj4LmlbBcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHsgbGFzdElEPzogbnVtYmVyLCBjaGFuZ2VzPzogbnVtYmVyIH0+fSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIHJ1bihzcWw6IHN0cmluZywgLi4ucGFyYW06IChzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgdm9pZClbXSk6IFByb21pc2U8eyBsYXN0SUQ/OiBudW1iZXIsIGNoYW5nZXM/OiBudW1iZXIgfT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RiLnJ1bihzcWwsIC4uLnBhcmFtLCBmdW5jdGlvbiAoZXJyOiBFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdElEOiB0aGlzLmxhc3RJRCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlczogdGhpcy5jaGFuZ2VzXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omn6KGM5LiA5p2hc3Fs5p+l6K+i77yM6L+U5Zue56ys5LiA6KGM57uT5p6c44CC57uT5p6c5oyJ54Wne+WIl+WQje+8muWAvH3plK7lgLzlr7nnmoTlvaLlvI/ov5Tlm57jgILlpoLmnpzmn6Xor6Lnu5PmnpzkuLrnqbrliJnov5Tlm57nqbpcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNxbCBzcWzmn6Xor6Lor63lj6VcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHZvaWR9IHBhcmFtIOWmguaenHNxbOS4reS9v+eUqOS6huWNoOS9jeespu+8jOWImeWPr+WcqOi/meS8oOmAkuWPguaVsFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn0g5p+l6K+i6L+U5Zue55qE57uT5p6cXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBnZXQoc3FsOiBzdHJpbmcsIC4uLnBhcmFtOiAoc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHZvaWQpW10pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RiLmdldChzcWwsIHBhcmFtLCBmdW5jdGlvbiAoZXJyOiBFcnJvciwgcm93OiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGVyciA9PSBudWxsID8gcmVzb2x2ZShyb3cpIDogcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiafooYzkuIDmnaFzcWzmn6Xor6LvvIzov5Tlm57miYDmnInnu5PmnpzjgILnu5PmnpzmjInnhad75YiX5ZCN77ya5YC8femUruWAvOWvueaVsOe7hOeahOW9ouW8j+i/lOWbnuOAguWmguaenOafpeivoue7k+aenOS4uuepuuWImei/lOWbnuepuuaVsOe7hFxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3FsIHNxbOafpeivouivreWPpVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgdm9pZH0gcGFyYW0g5aaC5p6cc3Fs5Lit5L2/55So5LqG5Y2g5L2N56ym77yM5YiZ5Y+v5Zyo6L+Z5Lyg6YCS5Y+C5pWwXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnlbXT59IOafpeivoui/lOWbnueahOe7k+aenFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgYWxsKHNxbDogc3RyaW5nLCAuLi5wYXJhbTogKHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCB2b2lkKVtdKTogUHJvbWlzZTxhbnlbXT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RiLmFsbChzcWwsIHBhcmFtLCBmdW5jdGlvbiAoZXJyOiBFcnJvciwgcm93czogYW55W10pIHtcclxuICAgICAgICAgICAgICAgIGVyciA9PSBudWxsID8gcmVzb2x2ZShyb3dzKSA6IHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omn6KGM5aSa5p2hc3Fs6K+t5Y+l77yM5LiN6L+U5Zue5Lu75L2V57uT5p6c44CC5aaC5p6c5YW25Lit5LiA5p2hc3Fs6K+t5Y+l5omn6KGM5aSx6LSl77yM5YiZ5ZCO57ut55qEc3Fs6K+t5Y+l5bCG5LiN5Lya6KKr5omn6KGM77yI5Y+v5Lul5Yip55So5LqL5Yqh5YyF6KO55omA5pyJ6K+t5Y+l5p2l56Gu5L+d5omn6KGM57uT5p6c5LiO6aKE5paZ5LiA6Ie077yJ44CCXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzcWwg6KaB5omn6KGM55qEc3Fs6K+t5Y+lXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBleGVjKHNxbDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGIuZXhlYyhzcWwsIGZ1bmN0aW9uIChlcnI6IEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBlcnIgPT0gbnVsbCA/IHJlc29sdmUoKSA6IHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgPSBEYXRhYmFzZTsiXX0=
