"use strict";
/**
 * Created by 吴劲韬 on 2017/3/13.
 */
const sqlite3 = require("sqlite3");
class Database {
    /**启动模式*/
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
     * 当有未捕获到的数据库错误时触发
     *
     * @param {(err:Error)=>void} callback 回调函数
     *
     * @memberOf Database
     */
    onDatabaseError(callback) {
        this._db.on('error', callback);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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O1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFFRCxpQkFBUyxRQUFRLENBQUMiLCJmaWxlIjoiRGF0YWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ3JlYXRlZCBieSDlkLTlirLpn6wgb24gMjAxNy8zLzEzLlxyXG4gKi9cclxuaW1wb3J0IHNxbGl0ZTMgPSByZXF1aXJlKCdzcWxpdGUzJyk7XHJcblxyXG5jbGFzcyBEYXRhYmFzZSB7XHJcblxyXG4gICAgLyoq5ZCv5Yqo5qih5byPKi9cclxuICAgIHN0YXRpYyBnZXQgT1BFTl9SRUFET05MWSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBzcWxpdGUzLk9QRU5fUkVBRE9OTFk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBPUEVOX1JFQURXUklURSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBzcWxpdGUzLk9QRU5fUkVBRFdSSVRFO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgT1BFTl9DUkVBVEUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gc3FsaXRlMy5PUEVOX0NSRUFURTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW8gOWQr+S7peaYvuekuuabtOWkmueahOmUmeivr+a2iOaBr+OAguazqOaEj++8gei/meS8muS4pemHjeW9seWTjeaVsOaNruW6k+eahOaAp+iDvVxyXG4gICAgICogXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcmV0dXJucyB7dHlwZW9mIERhdGFiYXNlfSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB2ZXJib3NlKCk6IHR5cGVvZiBEYXRhYmFzZSB7XHJcbiAgICAgICAgc3FsaXRlMy52ZXJib3NlKCk7XHJcbiAgICAgICAgcmV0dXJuIERhdGFiYXNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC55o2u5paH5Lu26Lev5b6E5byC5q2l5omT5byAc3FsaXRl5pWw5o2u5bqTXHJcbiAgICAgKiBcclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSBzcWxpdGXmlbDmja7lupPnmoTmloflgaXot6/lvoRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbW9kZT1EYXRhYmFzZS5PUEVOX0NSRUFURSB8IERhdGFiYXNlLk9QRU5fUkVBRFdSSVRFXSDov57mjqXmqKHlvI9cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NhY2hlZD1mYWxzZV0g5piv5ZCm5L2/55So5LmL5YmN5omT5byA6L+H55qE6L+e5o6lXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxEYXRhYmFzZT59IOi/lOWbnuaVsOaNruW6k+WvueixoVxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvbm5lY3REQihmaWxlbmFtZTogc3RyaW5nLCBtb2RlOiBudW1iZXIgPSBEYXRhYmFzZS5PUEVOX0NSRUFURSB8IERhdGFiYXNlLk9QRU5fUkVBRFdSSVRFLCBjYWNoZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxEYXRhYmFzZT4oZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICBpZiAoY2FjaGVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYiA9IHNxbGl0ZTMuY2FjaGVkLkRhdGFiYXNlKGZpbGVuYW1lLCBtb2RlLCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKG5ldyBEYXRhYmFzZShkYikpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZGIgPSBuZXcgc3FsaXRlMy5EYXRhYmFzZShmaWxlbmFtZSwgbW9kZSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKG5ldyBEYXRhYmFzZShkYikpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKirljp/lp4vnmoRzcWxpdGUz5pWw5o2u5bqT6L+e5o6lKi9cclxuICAgIHByaXZhdGUgX2RiOiBzcWxpdGUzLkRhdGFiYXNlO1xyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoZGI6IHNxbGl0ZTMuRGF0YWJhc2UpIHtcclxuICAgICAgICB0aGlzLl9kYiA9IGRiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWz6Zet5pWw5o2u5bqT6L+e5o6lXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RiLmNsb3NlKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+acieacquaNleiOt+WIsOeahOaVsOaNruW6k+mUmeivr+aXtuinpuWPkVxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0geyhlcnI6RXJyb3IpPT52b2lkfSBjYWxsYmFjayDlm57osIPlh73mlbBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIG9uRGF0YWJhc2VFcnJvcihjYWxsYmFjazogKGVycjogRXJyb3IpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9kYi5vbignZXJyb3InLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiafooYxcIuWNleadoVwic3Fs6K+t5Y+lKOWkmuadoeivreWPpeWPquaJp+ihjOesrOS4gOadoSnvvIzkuI3ov5Tlm55zcWzmiafooYznu5PmnpzjgILlpoLmnpzmiafooYznmoTmmK9JTlNFUlTmk43kvZzliJnov5Tlm57mj5LlhaVpZCBsYXN0SUTvvIzlpoLmnpzmmK9VUERBVEXmiJZERUxFVEUg5YiZ5Lya6L+U5Zue5Y+X5b2x5ZON55qE6KGM5pWwY2hhbmdlc1xyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3FsIOaJp+ihjOeahHNxbOivreWPpVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgdm9pZH0gcGFyYW0g5aaC5p6cc3Fs5Lit5L2/55So5LqG5Y2g5L2N56ym77yM5YiZ5Y+v5Zyo6L+Z5Lyg6YCS5Y+C5pWwXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx7IGxhc3RJRD86IG51bWJlciwgY2hhbmdlcz86IG51bWJlciB9Pn0gXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBydW4oc3FsOiBzdHJpbmcsIC4uLnBhcmFtOiAoc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHZvaWQpW10pOiBQcm9taXNlPHsgbGFzdElEPzogbnVtYmVyLCBjaGFuZ2VzPzogbnVtYmVyIH0+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kYi5ydW4oc3FsLCAuLi5wYXJhbSwgZnVuY3Rpb24gKGVycjogRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RJRDogdGhpcy5sYXN0SUQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZXM6IHRoaXMuY2hhbmdlc1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJp+ihjOS4gOadoXNxbOafpeivou+8jOi/lOWbnuesrOS4gOihjOe7k+aenOOAgue7k+aenOaMieeFp3vliJflkI3vvJrlgLx96ZSu5YC85a+555qE5b2i5byP6L+U5Zue44CC5aaC5p6c5p+l6K+i57uT5p6c5Li656m65YiZ6L+U5Zue56m6XHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzcWwgc3Fs5p+l6K+i6K+t5Y+lXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCB2b2lkfSBwYXJhbSDlpoLmnpxzcWzkuK3kvb/nlKjkuobljaDkvY3nrKbvvIzliJnlj6/lnKjov5nkvKDpgJLlj4LmlbBcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59IOafpeivoui/lOWbnueahOe7k+aenFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgZ2V0KHNxbDogc3RyaW5nLCAuLi5wYXJhbTogKHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCB2b2lkKVtdKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kYi5nZXQoc3FsLCBwYXJhbSwgZnVuY3Rpb24gKGVycjogRXJyb3IsIHJvdzogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBlcnIgPT0gbnVsbCA/IHJlc29sdmUocm93KSA6IHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omn6KGM5LiA5p2hc3Fs5p+l6K+i77yM6L+U5Zue5omA5pyJ57uT5p6c44CC57uT5p6c5oyJ54Wne+WIl+WQje+8muWAvH3plK7lgLzlr7nmlbDnu4TnmoTlvaLlvI/ov5Tlm57jgILlpoLmnpzmn6Xor6Lnu5PmnpzkuLrnqbrliJnov5Tlm57nqbrmlbDnu4RcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNxbCBzcWzmn6Xor6Lor63lj6VcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHZvaWR9IHBhcmFtIOWmguaenHNxbOS4reS9v+eUqOS6huWNoOS9jeespu+8jOWImeWPr+WcqOi/meS8oOmAkuWPguaVsFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55W10+fSDmn6Xor6Lov5Tlm57nmoTnu5PmnpxcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIGFsbChzcWw6IHN0cmluZywgLi4ucGFyYW06IChzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgdm9pZClbXSk6IFByb21pc2U8YW55W10+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kYi5hbGwoc3FsLCBwYXJhbSwgZnVuY3Rpb24gKGVycjogRXJyb3IsIHJvd3M6IGFueVtdKSB7XHJcbiAgICAgICAgICAgICAgICBlcnIgPT0gbnVsbCA/IHJlc29sdmUocm93cykgOiByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJp+ihjOWkmuadoXNxbOivreWPpe+8jOS4jei/lOWbnuS7u+S9lee7k+aenOOAguWmguaenOWFtuS4reS4gOadoXNxbOivreWPpeaJp+ihjOWksei0pe+8jOWImeWQjue7reeahHNxbOivreWPpeWwhuS4jeS8muiiq+aJp+ihjO+8iOWPr+S7peWIqeeUqOS6i+WKoeWMheijueaJgOacieivreWPpeadpeehruS/neaJp+ihjOe7k+aenOS4jumihOaWmeS4gOiHtO+8ieOAglxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3FsIOimgeaJp+ihjOeahHNxbOivreWPpVxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgZXhlYyhzcWw6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RiLmV4ZWMoc3FsLCBmdW5jdGlvbiAoZXJyOiBFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgZXJyID09IG51bGwgPyByZXNvbHZlKCkgOiByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0ID0gRGF0YWJhc2U7Il19
