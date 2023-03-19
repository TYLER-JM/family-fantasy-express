export default {
  get (req, res) {
    let templateVars = {
      date: req.params.date,
      username: req.session.username
    }
    if (!templateVars.username) {
      res.redirect('/login')
    }
    res.render('predictions-create.pug', templateVars)
  },
  post() {

  }
}