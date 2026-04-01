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
const MongoTagRepository = require('./modules/tags/infrastructure/persistence/MongoTagRepository');
const MongoLocationRepository = require('./modules/locations/infrastructure/persistence/MongoLocationRepository');
const MongoRouteRepository = require('./modules/routes/infrastructure/persistence/MongoRouteRepository');
const MongoModelRepository = require('./modules/models/infrastructure/persistence/MongoModelRepository');
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

// Tags use cases
const ListTags = require('./modules/tags/application/useCases/ListTags');
const GetTag = require('./modules/tags/application/useCases/GetTag');
const CreateTag = require('./modules/tags/application/useCases/CreateTag');
const UpdateTag = require('./modules/tags/application/useCases/UpdateTag');
const DeleteTag = require('./modules/tags/application/useCases/DeleteTag');

// Locations use cases
const ListLocations = require('./modules/locations/application/useCases/ListLocations');
const GetLocation = require('./modules/locations/application/useCases/GetLocation');
const CreateLocation = require('./modules/locations/application/useCases/CreateLocation');
const UpdateLocation = require('./modules/locations/application/useCases/UpdateLocation');
const DeleteLocation = require('./modules/locations/application/useCases/DeleteLocation');

// Routes use cases
const ListRoutes = require('./modules/routes/application/useCases/ListRoutes');
const GetRoute = require('./modules/routes/application/useCases/GetRoute');
const CreateRoute = require('./modules/routes/application/useCases/CreateRoute');
const UpdateRoute = require('./modules/routes/application/useCases/UpdateRoute');
const DeleteRoute = require('./modules/routes/application/useCases/DeleteRoute');

// Models use cases
const ListModels = require('./modules/models/application/useCases/ListModels');
const GetModel = require('./modules/models/application/useCases/GetModel');
const CreateModel = require('./modules/models/application/useCases/CreateModel');
const UpdateModel = require('./modules/models/application/useCases/UpdateModel');
const DeleteModel = require('./modules/models/application/useCases/DeleteModel');

// Storage use cases
const UploadFile = require('./modules/storage/application/useCases/UploadFile');
const DownloadFile = require('./modules/storage/application/useCases/DownloadFile');
const DeleteFile = require('./modules/storage/application/useCases/DeleteFile');

// Primary adapters (HTTP routers)
const makeAuthRouter = require('./modules/auth/infrastructure/http/auth.routes');
const makeUsersRouter = require('./modules/users/infrastructure/http/users.routes');
const makeTagsRouter = require('./modules/tags/infrastructure/http/tags.routes');
const makeLocationsRouter = require('./modules/locations/infrastructure/http/locations.routes');
const makeRoutesRouter = require('./modules/routes/infrastructure/http/routes.routes');
const makeModelsRouter = require('./modules/models/infrastructure/http/models.routes');
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
const tagRepo = new MongoTagRepository();
const locationRepo = new MongoLocationRepository();
const routeRepo = new MongoRouteRepository();
const modelRepo = new MongoModelRepository();
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

app.use('/api/tags', makeTagsRouter({
  listTags:  new ListTags(tagRepo),
  getTag:    new GetTag(tagRepo),
  createTag: new CreateTag(tagRepo),
  updateTag: new UpdateTag(tagRepo),
  deleteTag: new DeleteTag(tagRepo),
}));

app.use('/api/locations', makeLocationsRouter({
  listLocations:  new ListLocations(locationRepo),
  getLocation:    new GetLocation(locationRepo),
  createLocation: new CreateLocation(locationRepo),
  updateLocation: new UpdateLocation(locationRepo),
  deleteLocation: new DeleteLocation(locationRepo),
}));

app.use('/api/routes', makeRoutesRouter({
  listRoutes:  new ListRoutes(routeRepo),
  getRoute:    new GetRoute(routeRepo),
  createRoute: new CreateRoute(routeRepo),
  updateRoute: new UpdateRoute(routeRepo),
  deleteRoute: new DeleteRoute(routeRepo),
}));

app.use('/api/models', makeModelsRouter({
  listModels:  new ListModels(modelRepo),
  getModel:    new GetModel(modelRepo),
  createModel: new CreateModel(modelRepo),
  updateModel: new UpdateModel(modelRepo),
  deleteModel: new DeleteModel(modelRepo),
}));

app.use('/api/storage', makeStorageRouter({
  uploadFile:   new UploadFile(storageAdapter),
  downloadFile: new DownloadFile(storageAdapter),
  deleteFile:   new DeleteFile(storageAdapter),
}, upload));

app.use(errorHandler);

module.exports = app;
