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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBRUQsaUJBQVMsUUFBUSxDQUFDIiwiZmlsZSI6IkRhdGFiYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENyZWF0ZWQgYnkg5ZC05Yqy6Z+sIG9uIDIwMTcvMy8xMy5cclxuICovXHJcbmltcG9ydCBzcWxpdGUzID0gcmVxdWlyZSgnc3FsaXRlMycpO1xyXG5cclxuY2xhc3MgRGF0YWJhc2Uge1xyXG5cclxuICAgIC8qKuWQr+WKqOaooeW8jyovXHJcbiAgICBzdGF0aWMgZ2V0IE9QRU5fUkVBRE9OTFkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gc3FsaXRlMy5PUEVOX1JFQURPTkxZO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgT1BFTl9SRUFEV1JJVEUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gc3FsaXRlMy5PUEVOX1JFQURXUklURTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IE9QRU5fQ1JFQVRFKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHNxbGl0ZTMuT1BFTl9DUkVBVEU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvIDlkK/ku6XmmL7npLrmm7TlpJrnmoTplJnor6/mtojmga/jgILms6jmhI/vvIHov5nkvJrkuKXph43lvbHlk43mlbDmja7lupPnmoTmgKfog71cclxuICAgICAqIFxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHJldHVybnMge3R5cGVvZiBEYXRhYmFzZX0gXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdmVyYm9zZSgpOiB0eXBlb2YgRGF0YWJhc2Uge1xyXG4gICAgICAgIHNxbGl0ZTMudmVyYm9zZSgpO1xyXG4gICAgICAgIHJldHVybiBEYXRhYmFzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNruaWh+S7tui3r+W+hOW8guatpeaJk+W8gHNxbGl0ZeaVsOaNruW6k1xyXG4gICAgICogXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgc3FsaXRl5pWw5o2u5bqT55qE5paH5YGl6Lev5b6EXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21vZGU9RGF0YWJhc2UuT1BFTl9DUkVBVEUgfCBEYXRhYmFzZS5PUEVOX1JFQURXUklURV0g6L+e5o6l5qih5byPXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjYWNoZWQ9ZmFsc2VdIOaYr+WQpuS9v+eUqOS5i+WJjeaJk+W8gOi/h+eahOi/nuaOpVxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8RGF0YWJhc2U+fSDov5Tlm57mlbDmja7lupPlr7nosaFcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb25uZWN0REIoZmlsZW5hbWU6IHN0cmluZywgbW9kZTogbnVtYmVyID0gRGF0YWJhc2UuT1BFTl9DUkVBVEUgfCBEYXRhYmFzZS5PUEVOX1JFQURXUklURSwgY2FjaGVkOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8RGF0YWJhc2U+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgaWYgKGNhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGIgPSBzcWxpdGUzLmNhY2hlZC5EYXRhYmFzZShmaWxlbmFtZSwgbW9kZSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShuZXcgRGF0YWJhc2UoZGIpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGRiID0gbmV3IHNxbGl0ZTMuRGF0YWJhc2UoZmlsZW5hbWUsIG1vZGUsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShuZXcgRGF0YWJhc2UoZGIpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Y6f5aeL55qEc3FsaXRlM+aVsOaNruW6k+i/nuaOpSovXHJcbiAgICBwcml2YXRlIF9kYjogc3FsaXRlMy5EYXRhYmFzZTtcclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKGRiOiBzcWxpdGUzLkRhdGFiYXNlKSB7XHJcbiAgICAgICAgdGhpcy5fZGIgPSBkYjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWFs+mXreaVsOaNruW6k+i/nuaOpVxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kYi5jbG9zZShlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozkuovku7bnm5HlkKzlmahcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHsoZXJyOkVycm9yKT0+dm9pZH0gY2FsbGJhY2sg5Zue6LCD5Ye95pWwXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogKGVycjogRXJyb3IpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9kYi5vbihldmVudCwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omn6KGMXCLljZXmnaFcInNxbOivreWPpSjlpJrmnaHor63lj6Xlj6rmiafooYznrKzkuIDmnaEp77yM5LiN6L+U5Zuec3Fs5omn6KGM57uT5p6c44CC5aaC5p6c5omn6KGM55qE5pivSU5TRVJU5pON5L2c5YiZ6L+U5Zue5o+S5YWlaWQgbGFzdElE77yM5aaC5p6c5pivVVBEQVRF5oiWREVMRVRFIOWImeS8mui/lOWbnuWPl+W9seWTjeeahOihjOaVsGNoYW5nZXNcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNxbCDmiafooYznmoRzcWzor63lj6VcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHZvaWR9IHBhcmFtIOWmguaenHNxbOS4reS9v+eUqOS6huWNoOS9jeespu+8jOWImeWPr+WcqOi/meS8oOmAkuWPguaVsFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8eyBsYXN0SUQ/OiBudW1iZXIsIGNoYW5nZXM/OiBudW1iZXIgfT59IFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgcnVuKHNxbDogc3RyaW5nLCAuLi5wYXJhbTogKHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCB2b2lkKVtdKTogUHJvbWlzZTx7IGxhc3RJRD86IG51bWJlciwgY2hhbmdlcz86IG51bWJlciB9PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGIucnVuKHNxbCwgLi4ucGFyYW0sIGZ1bmN0aW9uIChlcnI6IEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0SUQ6IHRoaXMubGFzdElELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VzOiB0aGlzLmNoYW5nZXNcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiafooYzkuIDmnaFzcWzmn6Xor6LvvIzov5Tlm57nrKzkuIDooYznu5PmnpzjgILnu5PmnpzmjInnhad75YiX5ZCN77ya5YC8femUruWAvOWvueeahOW9ouW8j+i/lOWbnuOAguWmguaenOafpeivoue7k+aenOS4uuepuuWImei/lOWbnuepulxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3FsIHNxbOafpeivouivreWPpVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgdm9pZH0gcGFyYW0g5aaC5p6cc3Fs5Lit5L2/55So5LqG5Y2g5L2N56ym77yM5YiZ5Y+v5Zyo6L+Z5Lyg6YCS5Y+C5pWwXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fSDmn6Xor6Lov5Tlm57nmoTnu5PmnpxcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIGdldChzcWw6IHN0cmluZywgLi4ucGFyYW06IChzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgdm9pZClbXSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGIuZ2V0KHNxbCwgcGFyYW0sIGZ1bmN0aW9uIChlcnI6IEVycm9yLCByb3c6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgZXJyID09IG51bGwgPyByZXNvbHZlKHJvdykgOiByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJp+ihjOS4gOadoXNxbOafpeivou+8jOi/lOWbnuaJgOaciee7k+aenOOAgue7k+aenOaMieeFp3vliJflkI3vvJrlgLx96ZSu5YC85a+55pWw57uE55qE5b2i5byP6L+U5Zue44CC5aaC5p6c5p+l6K+i57uT5p6c5Li656m65YiZ6L+U5Zue56m65pWw57uEXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzcWwgc3Fs5p+l6K+i6K+t5Y+lXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCB2b2lkfSBwYXJhbSDlpoLmnpxzcWzkuK3kvb/nlKjkuobljaDkvY3nrKbvvIzliJnlj6/lnKjov5nkvKDpgJLlj4LmlbBcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueVtdPn0g5p+l6K+i6L+U5Zue55qE57uT5p6cXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBhbGwoc3FsOiBzdHJpbmcsIC4uLnBhcmFtOiAoc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHZvaWQpW10pOiBQcm9taXNlPGFueVtdPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGIuYWxsKHNxbCwgcGFyYW0sIGZ1bmN0aW9uIChlcnI6IEVycm9yLCByb3dzOiBhbnlbXSkge1xyXG4gICAgICAgICAgICAgICAgZXJyID09IG51bGwgPyByZXNvbHZlKHJvd3MpIDogcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiafooYzlpJrmnaFzcWzor63lj6XvvIzkuI3ov5Tlm57ku7vkvZXnu5PmnpzjgILlpoLmnpzlhbbkuK3kuIDmnaFzcWzor63lj6XmiafooYzlpLHotKXvvIzliJnlkI7nu63nmoRzcWzor63lj6XlsIbkuI3kvJrooqvmiafooYzvvIjlj6/ku6XliKnnlKjkuovliqHljIXoo7nmiYDmnInor63lj6XmnaXnoa7kv53miafooYznu5PmnpzkuI7pooTmlpnkuIDoh7TvvInjgIJcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNxbCDopoHmiafooYznmoRzcWzor63lj6VcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIGV4ZWMoc3FsOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kYi5leGVjKHNxbCwgZnVuY3Rpb24gKGVycjogRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGVyciA9PSBudWxsID8gcmVzb2x2ZSgpIDogcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IERhdGFiYXNlOyJdfQ==
