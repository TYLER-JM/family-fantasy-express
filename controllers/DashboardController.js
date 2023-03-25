
export default {
   get(req, res) {
    let templateVars = {
      username: req.session.username
    }
    if (!templateVars.username) {
      res.redirect('/login')
    }
    res.render('dashboard', templateVars)
  },
}