/**
 * Created by 吴劲韬 on 2017/3/13.
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    static verbose() {
        sqlite3.verbose();
        return Database;
    }
    /**
     * 连接到指定的sqlite数据库
     * @static
     * @param {string} filename sqlite数据库的文健路径
     * @param {number} [mode=Database.OPEN_CREATE | Database.OPEN_READWRITE] 连接模式
     * @param {boolean} [cached=false] 是否使用之前打开过的连接
     * @returns
     *
     * @memberOf Database
     */
    static connectDB(filename, mode = Database.OPEN_CREATE | Database.OPEN_READWRITE, cached = false) {
        return __awaiter(this, void 0, void 0, function* () {
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
     * 执行sql语句，不返回sql执行结果。如果执行的是INSERT操作则返回插入id：lastID，如果是UPDATE或DELETE 则会返回受影响的行数changes
     *
     * @param {string} sql 执行的sql语句
     * @param {any} param 如果sql中使用了占位符，则可在这传递参数
     * @returns {Promise<{ lastID?: string, changes?: number }>}
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
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHOzs7Ozs7Ozs7OztBQUVILG1DQUFtQztBQUVuQztJQUVJLE1BQU0sS0FBSyxhQUFhO1FBQ3BCLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxNQUFNLEtBQUssY0FBYztRQUNyQixNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsTUFBTSxLQUFLLFdBQVc7UUFDbEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7SUFDL0IsQ0FBQztJQUdELE1BQU0sQ0FBQyxPQUFPO1FBQ1YsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2xCLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILE1BQU0sQ0FBTyxTQUFTLENBQUMsUUFBZ0IsRUFBRSxPQUFlLFFBQVEsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsRUFBRSxTQUFrQixLQUFLOztZQUMzSCxNQUFNLENBQUMsSUFBSSxPQUFPLENBQVcsVUFBVSxPQUFPLEVBQUUsTUFBTTtnQkFDbEQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDVCxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsR0FBRzt3QkFDNUQsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbEQsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztnQkFDRCxNQUFNLEVBQUUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFVLEdBQUc7b0JBQ3pELEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7SUFLRCxZQUFvQixFQUFvQjtRQUNwQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsS0FBSztRQUNELE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ3JDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUc7Z0JBQ2IsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFVO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9CLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsVUFBVSxHQUFHO2dCQUNqQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLENBQUM7d0JBQ0osTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO3dCQUNuQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87cUJBQ3hCLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FHSiIsImZpbGUiOiJEYXRhYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IOWQtOWKsumfrCBvbiAyMDE3LzMvMTMuXHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMgc3FsaXRlMyBmcm9tICdzcWxpdGUzJztcclxuXHJcbmNsYXNzIERhdGFiYXNlIHtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IE9QRU5fUkVBRE9OTFkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gc3FsaXRlMy5PUEVOX1JFQURPTkxZO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgT1BFTl9SRUFEV1JJVEUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gc3FsaXRlMy5PUEVOX1JFQURXUklURTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IE9QRU5fQ1JFQVRFKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHNxbGl0ZTMuT1BFTl9DUkVBVEU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHN0YXRpYyB2ZXJib3NlKCk6IHR5cGVvZiBEYXRhYmFzZSB7XHJcbiAgICAgICAgc3FsaXRlMy52ZXJib3NlKCk7XHJcbiAgICAgICAgcmV0dXJuIERhdGFiYXNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+e5o6l5Yiw5oyH5a6a55qEc3FsaXRl5pWw5o2u5bqTXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgc3FsaXRl5pWw5o2u5bqT55qE5paH5YGl6Lev5b6EXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21vZGU9RGF0YWJhc2UuT1BFTl9DUkVBVEUgfCBEYXRhYmFzZS5PUEVOX1JFQURXUklURV0g6L+e5o6l5qih5byPXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjYWNoZWQ9ZmFsc2VdIOaYr+WQpuS9v+eUqOS5i+WJjeaJk+W8gOi/h+eahOi/nuaOpVxyXG4gICAgICogQHJldHVybnMgXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBEYXRhYmFzZVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgY29ubmVjdERCKGZpbGVuYW1lOiBzdHJpbmcsIG1vZGU6IG51bWJlciA9IERhdGFiYXNlLk9QRU5fQ1JFQVRFIHwgRGF0YWJhc2UuT1BFTl9SRUFEV1JJVEUsIGNhY2hlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPERhdGFiYXNlPihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmIChjYWNoZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRiID0gc3FsaXRlMy5jYWNoZWQuRGF0YWJhc2UoZmlsZW5hbWUsIG1vZGUsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUobmV3IERhdGFiYXNlKGRiKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBkYiA9IG5ldyBzcWxpdGUzLkRhdGFiYXNlKGZpbGVuYW1lLCBtb2RlLCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUobmV3IERhdGFiYXNlKGRiKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHNxbGl0ZeaVsOaNruW6k+i/nuaOpVxyXG4gICAgcHJpdmF0ZSBkYjogc3FsaXRlMy5EYXRhYmFzZTtcclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKGRiOiBzcWxpdGUzLkRhdGFiYXNlKSB7XHJcbiAgICAgICAgdGhpcy5kYiA9IGRiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWz6Zet5pWw5o2u5bqT6L+e5o6lXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIERhdGFiYXNlXHJcbiAgICAgKi9cclxuICAgIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGIuY2xvc2UoZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omn6KGMc3Fs6K+t5Y+l77yM5LiN6L+U5Zuec3Fs5omn6KGM57uT5p6c44CC5aaC5p6c5omn6KGM55qE5pivSU5TRVJU5pON5L2c5YiZ6L+U5Zue5o+S5YWlaWTvvJpsYXN0SUTvvIzlpoLmnpzmmK9VUERBVEXmiJZERUxFVEUg5YiZ5Lya6L+U5Zue5Y+X5b2x5ZON55qE6KGM5pWwY2hhbmdlc1xyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3FsIOaJp+ihjOeahHNxbOivreWPpVxyXG4gICAgICogQHBhcmFtIHthbnl9IHBhcmFtIOWmguaenHNxbOS4reS9v+eUqOS6huWNoOS9jeespu+8jOWImeWPr+WcqOi/meS8oOmAkuWPguaVsFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8eyBsYXN0SUQ/OiBzdHJpbmcsIGNoYW5nZXM/OiBudW1iZXIgfT59IFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgRGF0YWJhc2VcclxuICAgICAqL1xyXG4gICAgcnVuKHNxbDogc3RyaW5nLCBwYXJhbTogYW55KTogUHJvbWlzZTx7IGxhc3RJRD86IHN0cmluZywgY2hhbmdlcz86IG51bWJlciB9PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kYi5ydW4oc3FsLCBwYXJhbSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdElEOiB0aGlzLmxhc3RJRCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlczogdGhpcy5jaGFuZ2VzXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG59XHJcbiJdfQ==
