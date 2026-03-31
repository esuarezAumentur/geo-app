const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');

const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const mapsRoutes = require('./modules/maps/maps.routes');
const poisRoutes = require('./modules/pois/pois.routes');
const storageRoutes = require('./modules/storage/storage.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/maps', poisRoutes);
app.use('/api/storage', storageRoutes);

app.use(errorHandler);

module.exports = app;
