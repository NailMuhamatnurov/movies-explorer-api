require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleErrors = require('./middlewares/error-handler');
// const corsOption = require('./middlewares/cors');

const { PORT = 3000, dataMovies = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(dataMovies, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

// app.use(cors(corsOption));

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => PORT);
