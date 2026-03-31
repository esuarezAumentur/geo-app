const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');

// Shared infrastructure
const errorHandler = require('./shared/infrastructure/http/middlewares/errorHandler');

// Secondary adapters (persistence + disk)
const MongoAuthUserRepository = require('./modules/auth/infrastructure/persistence/MongoAuthUserRepository');
const MongoUserRepository = require('./modules/users/infrastructure/persistence/MongoUserRepository');
const MongoMapRepository = require('./modules/maps/infrastructure/persistence/MongoMapRepository');
const MongoPoiRepository = require('./modules/pois/infrastructure/persistence/MongoPoiRepository');
const DiskStorageAdapter = require('./modules/storage/infrastructure/disk/DiskStorageAdapter');
const { upload } = require('./modules/storage/infrastructure/disk/multer.config');

// Auth use cases
const RegisterUser = require('./modules/auth/application/useCases/RegisterUser');
const LoginUser = require('./modules/auth/application/useCases/LoginUser');
const RefreshToken = require('./modules/auth/application/useCases/RefreshToken');

// Users use cases
const ListUsers = require('./modules/users/application/useCases/ListUsers');
const GetUser = require('./modules/users/application/useCases/GetUser');
const CreateUser = require('./modules/users/application/useCases/CreateUser');
const UpdateUser = require('./modules/users/application/useCases/UpdateUser');
const DeleteUser = require('./modules/users/application/useCases/DeleteUser');

// Maps use cases
const ListMaps = require('./modules/maps/application/useCases/ListMaps');
const GetMap = require('./modules/maps/application/useCases/GetMap');
const CreateMap = require('./modules/maps/application/useCases/CreateMap');
const UpdateMap = require('./modules/maps/application/useCases/UpdateMap');
const DeleteMap = require('./modules/maps/application/useCases/DeleteMap');

// POIs use cases
const ListPois = require('./modules/pois/application/useCases/ListPois');
const GetPoi = require('./modules/pois/application/useCases/GetPoi');
const CreatePoi = require('./modules/pois/application/useCases/CreatePoi');
const UpdatePoi = require('./modules/pois/application/useCases/UpdatePoi');
const DeletePoi = require('./modules/pois/application/useCases/DeletePoi');
const ReorderPois = require('./modules/pois/application/useCases/ReorderPois');

// Storage use cases
const UploadFile = require('./modules/storage/application/useCases/UploadFile');
const DownloadFile = require('./modules/storage/application/useCases/DownloadFile');
const DeleteFile = require('./modules/storage/application/useCases/DeleteFile');

// Primary adapters (HTTP routers)
const makeAuthRouter = require('./modules/auth/infrastructure/http/auth.routes');
const makeUsersRouter = require('./modules/users/infrastructure/http/users.routes');
const makeMapsRouter = require('./modules/maps/infrastructure/http/maps.routes');
const makePoisRouter = require('./modules/pois/infrastructure/http/pois.routes');
const makeStorageRouter = require('./modules/storage/infrastructure/http/storage.routes');

// ── App setup ────────────────────────────────────────────────────────────────

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Dependency injection ──────────────────────────────────────────────────────

const authUserRepo = new MongoAuthUserRepository();
const userRepo = new MongoUserRepository();
const mapRepo = new MongoMapRepository();
const poiRepo = new MongoPoiRepository();
const storageAdapter = new DiskStorageAdapter();

// ── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', makeAuthRouter({
  registerUser: new RegisterUser(authUserRepo),
  loginUser:    new LoginUser(authUserRepo),
  refreshToken: new RefreshToken(authUserRepo),
}));

app.use('/api/users', makeUsersRouter({
  listUsers:  new ListUsers(userRepo),
  getUser:    new GetUser(userRepo),
  createUser: new CreateUser(userRepo),
  updateUser: new UpdateUser(userRepo),
  deleteUser: new DeleteUser(userRepo),
}));

app.use('/api/maps', makeMapsRouter({
  listMaps:  new ListMaps(mapRepo),
  getMap:    new GetMap(mapRepo),
  createMap: new CreateMap(mapRepo),
  updateMap: new UpdateMap(mapRepo),
  deleteMap: new DeleteMap(mapRepo),
}));

app.use('/api/maps', makePoisRouter({
  listPois:   new ListPois(poiRepo, mapRepo),
  getPoi:     new GetPoi(poiRepo),
  createPoi:  new CreatePoi(poiRepo, mapRepo),
  updatePoi:  new UpdatePoi(poiRepo),
  deletePoi:  new DeletePoi(poiRepo),
  reorderPois: new ReorderPois(poiRepo, mapRepo),
}));

app.use('/api/storage', makeStorageRouter({
  uploadFile:   new UploadFile(storageAdapter),
  downloadFile: new DownloadFile(storageAdapter),
  deleteFile:   new DeleteFile(storageAdapter),
}, upload));

app.use(errorHandler);

module.exports = app;
