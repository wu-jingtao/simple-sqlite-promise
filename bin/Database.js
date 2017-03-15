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
     * @param {boolean} [cached=false] 是否使用之前打开过的连接
     * @returns {Promise<Database>}
     *
     * @memberOf Database
     */
    static connectDB(filename, cached) {
        return new Promise(function (resolve, reject) {
            const defaultMode = Database.OPEN_CREATE | Database.OPEN_READWRITE;
            if (cached === true) {
                const db = sqlite3.cached.Database(filename, defaultMode, function (err) {
                    err ? reject(err) : resolve(new Database(db));
                });
            }
            else {
                const db = new sqlite3.Database(filename, defaultMode, function (err) {
                    err ? reject(err) : resolve(new Database(db));
                });
            }
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
     * @param event 事件名
     * @param callback 回调函数
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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RSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBRUQsaUJBQVMsUUFBUSxDQUFDIiwiZmlsZSI6IkRhdGFiYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENyZWF0ZWQgYnkg5ZC05Yqy6Z+sIG9uIDIwMTcvMy8xMy5cclxuICovXHJcbmltcG9ydCBzcWxpdGUzID0gcmVxdWlyZSgnc3FsaXRlMycpO1xyXG5cclxuY2xhc3MgRGF0YWJhc2Uge1xyXG5cclxuICAgIHN0YXRpYyBnZXQgT1BFTl9SRUFET05MWSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBzcWxpdGUzLk9QRU5fUkVBRE9OTFk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBPUEVOX1JFQURXUklURSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBzcWxpdGUzLk9QRU5fUkVBRFdSSVRFO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgT1BFTl9DUkVBVEUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gc3FsaXRlMy5PUEVOX0NSRUFURTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW8gOWQr+S7peaYvuekuuabtOWkmueahOmUmeivr+a2iOaBr+OAguazqOaEj++8gei/meS8muS4pemHjeW9seWTjeaVsOaNruW6k+eahOaAp+iDvVxyXG4gICAgICogXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcmV0dXJucyB7dHlwZW9mIERhdGFiYXNlfSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB2ZXJib3NlKCk6IHR5cGVvZiBEYXRhYmFzZSB7XHJcbiAgICAgICAgc3FsaXRlMy52ZXJib3NlKCk7XHJcbiAgICAgICAgcmV0dXJuIERhdGFiYXNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC55o2u5paH5Lu26Lev5b6E5byC5q2l5omT5byAc3FsaXRl5pWw5o2u5bqTXHJcbiAgICAgKiBcclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSBzcWxpdGXmlbDmja7lupPnmoTmloflgaXot6/lvoRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbW9kZT1EYXRhYmFzZS5PUEVOX0NSRUFURSB8IERhdGFiYXNlLk9QRU5fUkVBRFdSSVRFXSDov57mjqXmqKHlvI9cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NhY2hlZD1mYWxzZV0g5piv5ZCm5L2/55So5LmL5YmN5omT5byA6L+H55qE6L+e5o6lXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxEYXRhYmFzZT59IOi/lOWbnuaVsOaNruW6k+WvueixoVxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvbm5lY3REQihmaWxlbmFtZTogc3RyaW5nLCBtb2RlPzogbnVtYmVyLCBjYWNoZWQ/OiBib29sZWFuKTogUHJvbWlzZTxEYXRhYmFzZT47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja7mlofku7bot6/lvoTlvILmraXmiZPlvIBzcWxpdGXmlbDmja7lupNcclxuICAgICAqIFxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIHNxbGl0ZeaVsOaNruW6k+eahOaWh+WBpei3r+W+hFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbY2FjaGVkPWZhbHNlXSDmmK/lkKbkvb/nlKjkuYvliY3miZPlvIDov4fnmoTov57mjqVcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPERhdGFiYXNlPn0gXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29ubmVjdERCKGZpbGVuYW1lOiBzdHJpbmcsIGNhY2hlZD86IG51bWJlciB8IGJvb2xlYW4pOiBQcm9taXNlPERhdGFiYXNlPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPERhdGFiYXNlPihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0TW9kZSA9IERhdGFiYXNlLk9QRU5fQ1JFQVRFIHwgRGF0YWJhc2UuT1BFTl9SRUFEV1JJVEU7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FjaGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYiA9IHNxbGl0ZTMuY2FjaGVkLkRhdGFiYXNlKGZpbGVuYW1lLCBkZWZhdWx0TW9kZSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShuZXcgRGF0YWJhc2UoZGIpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGIgPSBuZXcgc3FsaXRlMy5EYXRhYmFzZShmaWxlbmFtZSwgZGVmYXVsdE1vZGUsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUobmV3IERhdGFiYXNlKGRiKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWOn+Wni+eahHNxbGl0ZTPmlbDmja7lupPov57mjqUqL1xyXG4gICAgcHJpdmF0ZSBfZGI6IHNxbGl0ZTMuRGF0YWJhc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihkYjogc3FsaXRlMy5EYXRhYmFzZSkge1xyXG4gICAgICAgIHRoaXMuX2RiID0gZGI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhbPpl63mlbDmja7lupPov57mjqVcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgY2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGIuY2xvc2UoZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rOo5YaM5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBldmVudCDkuovku7blkI1cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayDlm57osIPlh73mlbBcclxuICAgICAqL1xyXG4gICAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6ICguLi5wYXJhbTogYW55W10pID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9kYi5vbihldmVudCwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omn6KGMXCLljZXmnaFcInNxbOivreWPpSjlpJrmnaHor63lj6Xlj6rmiafooYznrKzkuIDmnaEp77yM5LiN6L+U5Zuec3Fs5omn6KGM57uT5p6c44CC5aaC5p6c5omn6KGM55qE5pivSU5TRVJU5pON5L2c5YiZ6L+U5Zue5o+S5YWlaWQgbGFzdElE77yM5aaC5p6c5pivVVBEQVRF5oiWREVMRVRFIOWImeS8mui/lOWbnuWPl+W9seWTjeeahOihjOaVsGNoYW5nZXNcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNxbCDmiafooYznmoRzcWzor63lj6VcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHZvaWR9IHBhcmFtIOWmguaenHNxbOS4reS9v+eUqOS6huWNoOS9jeespu+8jOWImeWPr+WcqOi/meS8oOmAkuWPguaVsFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8eyBsYXN0SUQ/OiBudW1iZXIsIGNoYW5nZXM/OiBudW1iZXIgfT59IFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgcnVuKHNxbDogc3RyaW5nLCAuLi5wYXJhbTogKHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCB2b2lkKVtdKTogUHJvbWlzZTx7IGxhc3RJRD86IG51bWJlciwgY2hhbmdlcz86IG51bWJlciB9PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGIucnVuKHNxbCwgLi4ucGFyYW0sIGZ1bmN0aW9uIChlcnI6IEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0SUQ6IHRoaXMubGFzdElELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VzOiB0aGlzLmNoYW5nZXNcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiafooYzkuIDmnaFzcWzmn6Xor6LvvIzov5Tlm57nrKzkuIDooYznu5PmnpzjgILnu5PmnpzmjInnhad75YiX5ZCN77ya5YC8femUruWAvOWvueeahOW9ouW8j+i/lOWbnuOAguWmguaenOafpeivoue7k+aenOS4uuepuuWImei/lOWbnuepulxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3FsIHNxbOafpeivouivreWPpVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgdm9pZH0gcGFyYW0g5aaC5p6cc3Fs5Lit5L2/55So5LqG5Y2g5L2N56ym77yM5YiZ5Y+v5Zyo6L+Z5Lyg6YCS5Y+C5pWwXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fSDmn6Xor6Lov5Tlm57nmoTnu5PmnpxcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIGdldChzcWw6IHN0cmluZywgLi4ucGFyYW06IChzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgdm9pZClbXSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGIuZ2V0KHNxbCwgcGFyYW0sIGZ1bmN0aW9uIChlcnI6IEVycm9yLCByb3c6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgZXJyID09IG51bGwgPyByZXNvbHZlKHJvdykgOiByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJp+ihjOS4gOadoXNxbOafpeivou+8jOi/lOWbnuaJgOaciee7k+aenOOAgue7k+aenOaMieeFp3vliJflkI3vvJrlgLx96ZSu5YC85a+55pWw57uE55qE5b2i5byP6L+U5Zue44CC5aaC5p6c5p+l6K+i57uT5p6c5Li656m65YiZ6L+U5Zue56m65pWw57uEXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzcWwgc3Fs5p+l6K+i6K+t5Y+lXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCB2b2lkfSBwYXJhbSDlpoLmnpxzcWzkuK3kvb/nlKjkuobljaDkvY3nrKbvvIzliJnlj6/lnKjov5nkvKDpgJLlj4LmlbBcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueVtdPn0g5p+l6K+i6L+U5Zue55qE57uT5p6cXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBhbGwoc3FsOiBzdHJpbmcsIC4uLnBhcmFtOiAoc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHZvaWQpW10pOiBQcm9taXNlPGFueVtdPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGIuYWxsKHNxbCwgcGFyYW0sIGZ1bmN0aW9uIChlcnI6IEVycm9yLCByb3dzOiBhbnlbXSkge1xyXG4gICAgICAgICAgICAgICAgZXJyID09IG51bGwgPyByZXNvbHZlKHJvd3MpIDogcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiafooYzlpJrmnaFzcWzor63lj6XvvIzkuI3ov5Tlm57ku7vkvZXnu5PmnpzjgILlpoLmnpzlhbbkuK3kuIDmnaFzcWzor63lj6XmiafooYzlpLHotKXvvIzliJnlkI7nu63nmoRzcWzor63lj6XlsIbkuI3kvJrooqvmiafooYzvvIjlj6/ku6XliKnnlKjkuovliqHljIXoo7nmiYDmnInor63lj6XmnaXnoa7kv53miafooYznu5PmnpzkuI7pooTmlpnkuIDoh7TvvInjgIJcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNxbCDopoHmiafooYznmoRzcWzor63lj6VcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIGV4ZWMoc3FsOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kYi5leGVjKHNxbCwgZnVuY3Rpb24gKGVycjogRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGVyciA9PSBudWxsID8gcmVzb2x2ZSgpIDogcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IERhdGFiYXNlOyJdfQ==
