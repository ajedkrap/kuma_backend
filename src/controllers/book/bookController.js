const bookModel = require('../../models/book/bookModel')
const pagination = require('../../utils/pagination')
const upload = require('../../utils/multer')
const { Validator } = require('node-input-validator')
const resData = require('../../helper/response')

module.exports = {
  getBook: async (req, res) => {
    const { id } = req.params
    const { search, sort } = req.query
    const totalData = id ? 0 : await bookModel.countBook({ name: search })
    const paginate = id ? { start: null, end: null } : pagination.set(req.query, totalData)
    const getBook = bookModel.getBook({ id: parseInt(id), name: search, sort: sort }, paginate.start, paginate.end)

    getBook.then((result) => {
      if (result.length < 1) {
        res.status(400).send(resData(
          false, 'Book not found'
        ))
      } else {
        res.status(200).send(resData(
          true, 'Get book success', result, paginate
        ))
      }
    }).catch(_ => {
      console.log(_)
      res.status(400).send(resData(
        false, 'Get book failed'
      ))
    })
  },
  createBook: (req, res) => {
    upload(req, res, () => {
      if (req.fileValidationError) {
        return res.status(400).send(resData(
          false, req.fileValidationError
        ))
      } else if (!req.file) {
        return res.status(400).send(resData(
          false, 'Please select an image to upload'
        ))
      }
      // Validator
      const valid = new Validator(req.body, {
        name: 'required|string',
        description: 'required|string',
        genreId: 'required|numeric',
        authorId: 'required|numeric',
        statusId: 'required|numeric',
        published: 'required',
        language: 'required|string'
      })

      let error = ''

      valid.check().then((matched) => {
        for (const prop in valid.errors) {
          error = valid.errors[prop].message
        }
        if (!matched) {
          res.status(422).send(resData(
            false, error
          ))
        }
      })

      const { filename } = req.file
      const { name, description, genreId, authorId, statusId, published, language } = req.body
      const data = {
        name: name,
        description: description,
        cover: `book/cover/${filename}`,
        genre_id: genreId,
        author_id: authorId,
        status_id: statusId,
        published: published,
        language: language
      }
      const createBook = bookModel.createBook(data)

      createBook.then(_ => {
        res.status(201).send(resData(
          true, 'Create book success', data
        ))
      }).catch(_ => {
        res.status(400).send(resData(
          false, 'Create book failed'
        ))
      })
    })
  },
  updateBook: async (req, res) => {
    const { id } = req.params
    const getBook = await bookModel.findBookId({ id: parseInt(id) })
    const updateData = req.body
    const data = [updateData, { id: parseInt(id) }]

    if (getBook) {
      const updateBook = bookModel.updateBook(data)
      updateBook.then(_ => {
        res.status(200).send(resData(
          true, 'Update book success', data
        ))
      }).catch(_ => {
        res.status(400).send(resData(
          false, 'Update book failed'
        ))
      })
    } else {
      res.status(400).send(resData(
        false, 'Book not found'
      ))
    }
  },
  updateCoverBook: (req, res) => {
    upload(req, res, async () => {
      if (req.fileValidationError) {
        return res.status(400).send(resData(
          false, req.fileValidationError
        ))
      } else if (!req.file) {
        return res.status(400).send(resData(
          false, 'Please select an image to upload'
        ))
      }

      const { id } = req.params
      const { filename } = req.file
      const getBook = await bookModel.findBookId({ id: parseInt(id) })

      if (getBook) {
        const data = [
          {
            cover: `book/cover/${filename}`,
            update_at: new Date()
          },
          { id: parseInt(id) }
        ]

        const updateBook = bookModel.updateBook(data)
        updateBook.then(_ => {
          res.status(200).send(resData(
            true, 'Update cover book success', data
          ))
        }).catch(_ => {
          res.status(400).send(resData(
            false, 'Update cover book failed'
          ))
        })
      } else {
        res.status(400).send(resData(
          false, 'Book not found'
        ))
      }
    })
  },
  deleteBook: (req, res) => {
    const { id } = req.params
    const deleteBook = bookModel.deleteBook({ id: id })

    deleteBook.then(_ => {
      res.status(200).send(resData(
        true, 'Delete book success', { idBook: id }
      ))
    }).catch(_ => {
      res.status(400).send(resData(
        false, 'Delete book failed'
      ))
    })
  }
}
