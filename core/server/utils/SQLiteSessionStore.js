// ref: https://github.com/rawberg/connect-sqlite3
import expressSession from 'express-session'
import events from 'events'

const TABLE = 'sessions'

const oneDay = 86400000

export default class SQLiteSessionStore extends expressSession.Store {
  constructor ({ db, table } = {}) {
    super()

    this.table = table || TABLE

    if (!db) throw Error('SQLite database is required')
    this.db = db

    this.client = new events.EventEmitter()

    this.db.exec(
      'CREATE TABLE IF NOT EXISTS ' + this.table + ' (' + 'sid PRIMARY KEY, ' + 'expired, sess)',
      err => {
        if (err) throw err
        this.client.emit('connect')

        dbCleanup(this)
        setInterval(dbCleanup, oneDay, this).unref()
      }
    )
  }

  get (sid, fn) {
    const now = new Date().getTime()
    this.db.get('SELECT sess FROM ' + this.table + ' WHERE sid = ? AND ? <= expired', [sid, now],
      function (err, row) {
        if (err) fn(err)
        if (!row) return fn()
        fn(null, JSON.parse(row.sess))
      }
    )
  }

  set (sid, sess, fn) {
    try {
      const maxAge = sess.cookie.maxAge
      const now = new Date().getTime()
      const expired = maxAge ? now + maxAge : now + oneDay
      sess = JSON.stringify(sess)

      this.db.all('INSERT OR REPLACE INTO ' + this.table + ' VALUES (?, ?, ?)',
        [sid, expired, sess],
        function () { fn?.apply(this, arguments) }
      )
    } catch (e) {
      fn?.(e)
    }
  }

  destroy (sid, fn) {
    this.db.run('DELETE FROM ' + this.table + ' WHERE sid = ?', [sid], fn)
  }

  length (fn) {
    this.db.all('SELECT COUNT(*) AS count FROM ' + this.table + '', function (err, rows) {
      if (err) fn(err)
      fn(null, rows[0].count)
    })
  }

  clear (fn) {
    this.db.exec('DELETE FROM ' + this.table + '', function (err) {
      if (err) fn(err)
      fn(null, true)
    })
  }

  touch (sid, session, fn) {
    if (session && session.cookie && session.cookie.expires) {
      const now = new Date().getTime()
      const cookieExpires = new Date(session.cookie.expires).getTime()
      this.db.run('UPDATE ' + this.table + ' SET expired=? WHERE sid = ? AND ? <= expired',
        [cookieExpires, sid, now],
        function (err) {
          if (fn) {
            if (err) fn(err)
            fn(null, true)
          }
        }
      )
    } else {
      fn(null, true)
    }
  }
}

function dbCleanup (store) {
  const now = new Date().getTime()
  store.db.run('DELETE FROM ' + store.table + ' WHERE ? > expired', [now])
}
