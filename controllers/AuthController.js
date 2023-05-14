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
      console.log('WHERE AM I , trying to login:', req.body.username)
      let user = await prisma.user.findFirstOrThrow({where: {username: req.body.username}, include: {owner: true}})
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        templateVars.passwordSuccess = false
        return res.status(403).render('login', templateVars)
      }
      req.session.userId = user.id
      req.session.ownerId = user.owner.id
      req.session.username = user.username
      return res.redirect('/')
    } catch (error) {
      console.log('ERROR in server', error)
      templateVars.usernameSuccess = false
      req.session = null
      return res.status(403).render('login', templateVars)
    }
  },

  logout(req, res) {
    req.session = null
    res.redirect('login')
  }

}