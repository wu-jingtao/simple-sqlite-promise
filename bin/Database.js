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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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UUFDTixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQUVELGlCQUFTLFFBQVEsQ0FBQyIsImZpbGUiOiJEYXRhYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IOWQtOWKsumfrCBvbiAyMDE3LzMvMTMuXHJcbiAqL1xyXG5pbXBvcnQgc3FsaXRlMyA9IHJlcXVpcmUoJ3NxbGl0ZTMnKTtcclxuXHJcbmNsYXNzIERhdGFiYXNlIHtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IE9QRU5fUkVBRE9OTFkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gc3FsaXRlMy5PUEVOX1JFQURPTkxZO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgT1BFTl9SRUFEV1JJVEUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gc3FsaXRlMy5PUEVOX1JFQURXUklURTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IE9QRU5fQ1JFQVRFKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHNxbGl0ZTMuT1BFTl9DUkVBVEU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvIDlkK/ku6XmmL7npLrmm7TlpJrnmoTplJnor6/mtojmga/jgILms6jmhI/vvIHov5nkvJrkuKXph43lvbHlk43mlbDmja7lupPnmoTmgKfog71cclxuICAgICAqIFxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHJldHVybnMge3R5cGVvZiBEYXRhYmFzZX0gXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdmVyYm9zZSgpOiB0eXBlb2YgRGF0YWJhc2Uge1xyXG4gICAgICAgIHNxbGl0ZTMudmVyYm9zZSgpO1xyXG4gICAgICAgIHJldHVybiBEYXRhYmFzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNruaWh+S7tui3r+W+hOW8guatpeaJk+W8gHNxbGl0ZeaVsOaNruW6k1xyXG4gICAgICogXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgc3FsaXRl5pWw5o2u5bqT55qE5paH5YGl6Lev5b6EXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21vZGU9RGF0YWJhc2UuT1BFTl9DUkVBVEUgfCBEYXRhYmFzZS5PUEVOX1JFQURXUklURV0g6L+e5o6l5qih5byPXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjYWNoZWQ9ZmFsc2VdIOaYr+WQpuS9v+eUqOS5i+WJjeaJk+W8gOi/h+eahOi/nuaOpVxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8RGF0YWJhc2U+fSDov5Tlm57mlbDmja7lupPlr7nosaFcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb25uZWN0REIoZmlsZW5hbWU6IHN0cmluZywgbW9kZTogbnVtYmVyID0gRGF0YWJhc2UuT1BFTl9DUkVBVEUgfCBEYXRhYmFzZS5PUEVOX1JFQURXUklURSwgY2FjaGVkOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8RGF0YWJhc2U+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgaWYgKGNhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGIgPSBzcWxpdGUzLmNhY2hlZC5EYXRhYmFzZShmaWxlbmFtZSwgbW9kZSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShuZXcgRGF0YWJhc2UoZGIpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGRiID0gbmV3IHNxbGl0ZTMuRGF0YWJhc2UoZmlsZW5hbWUsIG1vZGUsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShuZXcgRGF0YWJhc2UoZGIpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Y6f5aeL55qEc3FsaXRlM+aVsOaNruW6k+i/nuaOpSovXHJcbiAgICBwcml2YXRlIF9kYjogc3FsaXRlMy5EYXRhYmFzZTtcclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKGRiOiBzcWxpdGUzLkRhdGFiYXNlKSB7XHJcbiAgICAgICAgdGhpcy5fZGIgPSBkYjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWFs+mXreaVsOaNruW6k+i/nuaOpVxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kYi5jbG9zZShlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozkuovku7bnm5HlkKzlmahcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGV2ZW50IOS6i+S7tuWQjVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogKC4uLnBhcmFtOiBhbnlbXSkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RiLm9uKGV2ZW50LCBjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiafooYxcIuWNleadoVwic3Fs6K+t5Y+lKOWkmuadoeivreWPpeWPquaJp+ihjOesrOS4gOadoSnvvIzkuI3ov5Tlm55zcWzmiafooYznu5PmnpzjgILlpoLmnpzmiafooYznmoTmmK9JTlNFUlTmk43kvZzliJnov5Tlm57mj5LlhaVpZCBsYXN0SUTvvIzlpoLmnpzmmK9VUERBVEXmiJZERUxFVEUg5YiZ5Lya6L+U5Zue5Y+X5b2x5ZON55qE6KGM5pWwY2hhbmdlc1xyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3FsIOaJp+ihjOeahHNxbOivreWPpVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgdm9pZH0gcGFyYW0g5aaC5p6cc3Fs5Lit5L2/55So5LqG5Y2g5L2N56ym77yM5YiZ5Y+v5Zyo6L+Z5Lyg6YCS5Y+C5pWwXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx7IGxhc3RJRD86IG51bWJlciwgY2hhbmdlcz86IG51bWJlciB9Pn0gXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBydW4oc3FsOiBzdHJpbmcsIC4uLnBhcmFtOiAoc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHZvaWQpW10pOiBQcm9taXNlPHsgbGFzdElEPzogbnVtYmVyLCBjaGFuZ2VzPzogbnVtYmVyIH0+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kYi5ydW4oc3FsLCAuLi5wYXJhbSwgZnVuY3Rpb24gKGVycjogRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RJRDogdGhpcy5sYXN0SUQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZXM6IHRoaXMuY2hhbmdlc1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJp+ihjOS4gOadoXNxbOafpeivou+8jOi/lOWbnuesrOS4gOihjOe7k+aenOOAgue7k+aenOaMieeFp3vliJflkI3vvJrlgLx96ZSu5YC85a+555qE5b2i5byP6L+U5Zue44CC5aaC5p6c5p+l6K+i57uT5p6c5Li656m65YiZ6L+U5Zue56m6XHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzcWwgc3Fs5p+l6K+i6K+t5Y+lXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCB2b2lkfSBwYXJhbSDlpoLmnpxzcWzkuK3kvb/nlKjkuobljaDkvY3nrKbvvIzliJnlj6/lnKjov5nkvKDpgJLlj4LmlbBcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59IOafpeivoui/lOWbnueahOe7k+aenFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgZ2V0KHNxbDogc3RyaW5nLCAuLi5wYXJhbTogKHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCB2b2lkKVtdKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kYi5nZXQoc3FsLCBwYXJhbSwgZnVuY3Rpb24gKGVycjogRXJyb3IsIHJvdzogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBlcnIgPT0gbnVsbCA/IHJlc29sdmUocm93KSA6IHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omn6KGM5LiA5p2hc3Fs5p+l6K+i77yM6L+U5Zue5omA5pyJ57uT5p6c44CC57uT5p6c5oyJ54Wne+WIl+WQje+8muWAvH3plK7lgLzlr7nmlbDnu4TnmoTlvaLlvI/ov5Tlm57jgILlpoLmnpzmn6Xor6Lnu5PmnpzkuLrnqbrliJnov5Tlm57nqbrmlbDnu4RcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNxbCBzcWzmn6Xor6Lor63lj6VcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHZvaWR9IHBhcmFtIOWmguaenHNxbOS4reS9v+eUqOS6huWNoOS9jeespu+8jOWImeWPr+WcqOi/meS8oOmAkuWPguaVsFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55W10+fSDmn6Xor6Lov5Tlm57nmoTnu5PmnpxcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIGFsbChzcWw6IHN0cmluZywgLi4ucGFyYW06IChzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgdm9pZClbXSk6IFByb21pc2U8YW55W10+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kYi5hbGwoc3FsLCBwYXJhbSwgZnVuY3Rpb24gKGVycjogRXJyb3IsIHJvd3M6IGFueVtdKSB7XHJcbiAgICAgICAgICAgICAgICBlcnIgPT0gbnVsbCA/IHJlc29sdmUocm93cykgOiByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJp+ihjOWkmuadoXNxbOivreWPpe+8jOS4jei/lOWbnuS7u+S9lee7k+aenOOAguWmguaenOWFtuS4reS4gOadoXNxbOivreWPpeaJp+ihjOWksei0pe+8jOWImeWQjue7reeahHNxbOivreWPpeWwhuS4jeS8muiiq+aJp+ihjO+8iOWPr+S7peWIqeeUqOS6i+WKoeWMheijueaJgOacieivreWPpeadpeehruS/neaJp+ihjOe7k+aenOS4jumihOaWmeS4gOiHtO+8ieOAglxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3FsIOimgeaJp+ihjOeahHNxbOivreWPpVxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgZXhlYyhzcWw6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RiLmV4ZWMoc3FsLCBmdW5jdGlvbiAoZXJyOiBFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgZXJyID09IG51bGwgPyByZXNvbHZlKCkgOiByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0ID0gRGF0YWJhc2U7Il19
