import express from 'express'
import Owner from './database/models/Owner.js'
import path from 'path'

const PORT = 3000
const app = express()
app.set('view engine', 'pug')
app.use(express.static(path.resolve()))


app.get('/', (req, res) => {

  Owner.findMany().then((owners) => {
    let templateVars = {owners}
    res.render('owners', templateVars)
  }).catch((e) => {
    console.error(e)
    process.exit(1)
  })

})

app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
})