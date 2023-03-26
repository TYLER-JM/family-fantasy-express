
export default {
   get(req, res) {
    let templateVars = {
      username: req.session.username,
      flashMessage: req.session.flash,
    }
    if (!templateVars.username) {
      res.redirect('/login')
    }
    req.session.flash = null
    res.render('dashboard', templateVars)
  },
}