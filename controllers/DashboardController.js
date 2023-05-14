
export default {
   get(req, res) {
    let templateVars = {
      username: req.session.username,
      flashMessage: req.session.flash,
    }
    if (!templateVars.username) {
      return res.redirect('/login')
    }
    req.session.flash = null
    return res.render('dashboard', templateVars)
  },
}