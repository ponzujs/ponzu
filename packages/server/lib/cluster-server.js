const cluster = require('cluster');
const express = require('express');
const { ioc } = require('@ponzujs/core');
const { createApp } = require('./create-app');
const { CONFIG } = require('./constants');

function fork(workers) {
  const worker = cluster.fork();
  workers.push(worker);
  return worker;
}

function addHooks(worker, workers, settings) {
  if (settings.onMessageFunctions) {
    worker.on('message', (msg) => {
      settings.onMessageFunctions.forEach((func) => {
        func(workers, msg);
      });
    });
  }
}

function forkAndAddHooks(workers, settings) {
  const worker = fork(workers);
  addHooks(worker, workers, settings);
  return worker;
}

function orchestrate(settings = {}) {
  const logger = ioc.get('logger');
  logger.info(`Starting Master process with PID ${process.pid}`);
  const numClusters = settings.numClusters || CONFIG.NUM_CLUSTERS;
  logger.info(`Number of Clusters is ${numClusters}`);
  const workers = [];
  for (let i = 0; i < numClusters; i += 1) {
    forkAndAddHooks(workers, settings);
  }
  cluster.on('exit', (worker) => {
    logger.info(`Worker with PID ${worker.process.pid} died.`);
    const idx = workers.indexOf(worker);
    if (idx > -1) {
      workers.splice(idx, 1);
    }
    forkAndAddHooks(workers, settings);
  });
}

function serve(settings = {}) {
  const logger = ioc.get('logger');
  logger.info(`Worker with PID ${process.pid} started.`);
  const app = createApp(settings);
  const port = settings.port || CONFIG.PORT;
  app.listen(port, (err) => {
    if (err) {
      logger.error(err);
    }
  });
  return app;
}

function startClusterServer(settings = {}) {
  return cluster.isMaster ? orchestrate(settings) : serve(settings);
}

module.exports = {
  orchestrate,
  serve,
  startClusterServer,
  Router: express.Router,
};
