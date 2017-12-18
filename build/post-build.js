"use strict";

const stylelintPkg = require("../node_modules/stylelint/package.json");
const pkgPath = require("path").join(__dirname, "..", "/package.json");
const mainPkg = require(pkgPath);
const {readFile, writeFile} = require("./files");

const bundle = "stylelint-bundle.js";
const workerBundle = "stylelint-bundle-worker.js";
const modComment = `/*!= Stylelint v${stylelintPkg.version} bundle =*/\n/* See https://github.com/openstyles/stylelint-bundle */\n`;

readFile(bundle)
  .then(data => {
    writeFile(bundle, modComment + data);
    return modComment + data;
  })
  .then(data => {
    readFile("./build/worker.js").then(worker => {
      writeFile(workerBundle, data + worker);
    });
  })
  .then(() => {
    mainPkg.version = stylelintPkg.version;
    writeFile(pkgPath, JSON.stringify(mainPkg, null, 2));
  });
