const express = require('express');
const { ioc } = require('@ponzujs/core');
const { picoPassport } = require('@ponzujs/security');
const { errorHandler, notFoundHandler } = require('./middlewares');
const { mountSwagger } = require('./mount-swagger');

function addSwagger(app, settings) {
  if (
    settings.mountDocs !== false &&
    (settings.mountDocs === true ||
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test')
  ) {
    mountSwagger(app, settings);
  }
}

function addPassport(app, settings) {
  if (settings.usePassport !== false) {
    const passport = ioc.get('passport') || picoPassport;
    app.use(passport.initialize());
  }
}

function premount(app, settings) {
  if (settings.premount) {
    settings.premount(app);
  }
  const limit = process.env.LIMIT_SIZE || '100mb';
  app.use(express.urlencoded({ extended: false, limit }));
  app.use(express.json({ limit }));
  addPassport(app, settings);
  addSwagger(app, settings);
}

function mount(app, settings) {
  if (settings.mount) {
    settings.mount(app);
  }
  if (settings.mountStatic !== false) {
    app.use(express.static(settings.staticPath || 'public'));
  }
  if (settings.errorHandler !== false) {
    app.use(settings.errorHandler || errorHandler);
  }
  if (settings.notFoundHandler !== false) {
    app.use(settings.notFoundHandler || notFoundHandler);
  }
}

function postmount(app, settings) {
  if (settings.postmount) {
    settings.postmount(app);
  }
}

function createApp(settings = {}) {
  const app = express();
  premount(app, settings);
  mount(app, settings);
  postmount(app, settings);
  return app;
}

module.exports = { createApp };
