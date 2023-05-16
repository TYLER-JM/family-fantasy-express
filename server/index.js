import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'

import path from 'path'
import DashboardController from '../controllers/DashboardController.js'
import StandingsController from '../controllers/StandingsController.js'
import PredictionsController from '../controllers/PredictionsControllers.js'
import AuthController from '../controllers/AuthController.js'

const PORT = process.env.PORT || '8080'
const HOST = process.env.HOST || '0.0.0.0'
const app = express()
app.set('view engine', 'pug')
app.use(express.static(path.resolve()))

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', DashboardController.get)

app.get('/login', AuthController.get)
app.post('/login', AuthController.login)
app.post('/logout', AuthController.logout)

app.get('/standings', StandingsController.get)

app.get('/predictions/list', PredictionsController.list)
app.get('/predictions/create', PredictionsController.get)
app.post('/predictions/create', PredictionsController.post)
app.get('/games/load/:addDays', PredictionsController.loadGames)
app.get('/predictions/load/:page', PredictionsController.loadPredictions)

app.listen(PORT, HOST, () => {
  console.log(`app listening on port: ${HOST}:${PORT}`);
})