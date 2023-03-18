export default {
  get (req, res) {
    let templateVars = {
      date: req.params.date
    }
    res.render('predictions-create.pug', templateVars)
  },
  post() {

  }
}