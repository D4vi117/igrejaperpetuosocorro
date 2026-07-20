const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");

setGlobalOptions({
  region: "southamerica-east1",
  maxInstances: 10,
});

exports.video = onRequest(async (req, res) => {
  const { video } = req.query;

  res.json({
    success: true,
    endpoint: "video",
    video,
    data: {},
    relacionados: {
      anteriores: [],
      proximos: [],
    },
  });
});

exports.busca = onRequest(async (req, res) => {
  const {
    busca = "",
    tipo = "allMidias",
    limite = 5,
    pagina = 1,
  } = req.query;

  res.json({
    success: true,
    pagina_atual: Number(pagina),
    total_paginas: 0,
    total_registros: 0,
    filtros: {
      busca,
      tipo,
      limite: Number(limite),
    },
    data: [],
  });
});