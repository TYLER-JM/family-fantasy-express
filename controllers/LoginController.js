export default {
  get(req, res) {
    res.render('login')
  },
  post(req, res) {
    res.redirect('/')
  }
}