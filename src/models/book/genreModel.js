const db = require('../../utils/database')
const table = 'book_genres'

module.exports = {
  getGenre: (data) => {
    const query = `SELECT id, name FROM ${table} ${parseInt(data.id) ? 'WHERE ?' : ''}`

    return new Promise((resolve, reject) => {
      if (data.id) {
        db.query(query, data, (err, res) => err ? reject(Error(err)) : resolve(res))
      } else {
        db.query(query, (err, res) => err ? reject(Error(err)) : resolve(res))
      }
    })
  },
  findGenreId: (data) => {
    const query = `SELECT id FROM ${table} WHERE ?`

    return new Promise((resolve, reject) => {
      db.query(query, data, (err, res) => err ? reject(Error(err)) : resolve(res.length))
    })
  },
  createGenre: (data) => {
    const query = `INSERT INTO ${table} SET ?`

    return new Promise((resolve, reject) => {
      db.query(query, data, (err, res) => err ? reject(Error(err)) : resolve(res))
    })
  },
  updateGenre: (data) => {
    const query = `UPDATE ${table} SET ? WHERE ?`

    return new Promise((resolve, reject) => {
      db.query(query, data, (err, res) => err ? reject(Error(err)) : resolve(res))
    })
  },
  deleteGenre: (data) => {
    const query = `DELETE FROM ${table} WHERE ?`

    return new Promise((resolve, reject) => {
      db.query(query, data, (err, res) => err ? reject(Error(err)) : resolve(res))
    })
  }
}
