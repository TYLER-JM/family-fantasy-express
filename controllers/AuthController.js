import bcrypt from 'bcrypt'
import prisma from '../database/prismaClient.js'


export default {
  get(req, res) {
    res.render('login', {usernameSuccess: true, passwordSuccess: true})
  },
  async login(req, res) {
    let templateVars = {
      usernameSuccess: true,
      passwordSuccess: true
    }
    try {
      let user = await prisma.user.findFirstOrThrow({where: {username: req.body.username}, include: {owner: true}})
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        templateVars.passwordSuccess = false
        res.status(403).render('login', templateVars)
      }
      req.session.userId = user.id
      req.session.ownerId = user.owner.id
      req.session.username = user.username
      res.redirect('/')
    } catch (error) {
      templateVars.usernameSuccess = false
      req.session = null
      res.status(403).render('login', templateVars)
    }
  },
  logout(req, res) {
    req.session = null
    res.redirect('login')
  }

}