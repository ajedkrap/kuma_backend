const genreModel = require('../../models/book/genreModel')
const resData = require('../../helper/response')

module.exports = {
  getGenre: (req, res) => {
    const { id } = req.params
    const getGenre = genreModel.getGenre({ id: parseInt(id) })

    getGenre.then((result) => {
      res.status(200).send(resData(
        true, 'Get genre success', result
      ))
    }).catch(_ => {
      res.status(400).send(resData(
        false, 'Get genre failed'
      ))
    })
  },
  createGenre: (req, res) => {
    const { name } = req.body
    const createGenre = genreModel.createGenre({ name: name })

    createGenre.then(_ => {
      res.status(201).send(resData(
        true, 'Create genre success', { name: name }
      ))
    }).catch(_ => {
      res.status(400).send(resData(
        false, 'Create genre failed'
      ))
    })
  },
  updateGenre: async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const checkGenreId = await genreModel.findGenreId({ id: parseInt(id) })

    if (checkGenreId) {
      const data = [
        { name: name, update_at: new Date() },
        { id: parseInt(id) }
      ]
      const updateGenre = genreModel.updateGenre(data)

      updateGenre.then(_ => {
        res.status(200).send(resData(
          true, 'Update genre success', data
        ))
      }).catch(_ => {
        res.status(400).send(resData(
          false, 'Update genre failed'
        ))
      })
    } else {
      res.status(400).send(resData(
        false, 'Author not found'
      ))
    }
  },
  deleteGenre: (req, res) => {
    const { id } = req.params
    const deleteGenre = genreModel.deleteGenre({ id: id })

    deleteGenre.then(_ => {
      res.status(200).send(resData(
        true, 'Delete genre success', { idGenre: id }
      ))
    }).catch(_ => {
      res.status(400).send(resData(
        false, 'Delete genre success'
      ))
    })
  }
}
