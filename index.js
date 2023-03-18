import express from 'express'
import Owner from './database/models/Owner.js'
import path from 'path'
import DashboardController from './controllers/DashboardController.js'
import StandingsController from './controllers/StandingsController.js'
import PredictionsControllers from './controllers/PredictionsControllers.js'
import LoginController from './controllers/LoginController.js'

const PORT = 3000
const app = express()
app.set('view engine', 'pug')
app.use(express.static(path.resolve()))


app.get('/', DashboardController.get)

app.get('/login', LoginController.get)
app.post('/login', LoginController.post)

app.get('/standings', StandingsController.get)

app.get('/predictions/:date', PredictionsControllers.get)

app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
})