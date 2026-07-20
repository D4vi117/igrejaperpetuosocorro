require("dotenv").config();

const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { google } = require("googleapis");

setGlobalOptions({
  region: "southamerica-east1",
  maxInstances: 10,
});

admin.initializeApp();
const db = getFirestore();

console.log("Admin:", !!admin);
console.log("Firestore:", !!admin.firestore);
console.log("FieldValue:", FieldValue);

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

  /////////////////////////////
 ///// Get youtube videos ////
/////////////////////////////
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

exports.updateVideos = onSchedule(
{
    schedule:"0 0 * * MON",
    timeZone:"America/Sao_Paulo"
},
async()=>{

    await sincronizarYoutube();

});

async function sincronizarYoutube(){

    const youtube = google.youtube({
        version: "v3",
        auth: YOUTUBE_API_KEY,
    });

    const resposta = await youtube.search.list({
        part:["snippet"],
        channelId: CHANNEL_ID,
        maxResults:5,
        order:"date",
        type:"video"
    });

    const videos = resposta.data.items;

    for(const video of videos){
        const id = video.id.videoId;
        const doc = await db
            .collection("youtubeVideos")
            .doc(id)
            .get();

        if(doc.exists){
            continue;
        }

        await db
        .collection("youtubeVideos")
        .doc(id)
        .set({
            titulo: video.snippet.title,
            descricao: video.snippet.description,
            url: `https://youtube.com/watch?v=${id}`,
            thumbnail: video.snippet.thumbnails.high.url,
            publicadoEm: video.snippet.publishedAt,
            criadoEm: FieldValue.serverTimestamp(),
        });

        console.log(
            "Salvo:",
            video.snippet.title
        );
    }
}

  ///////////////////////////////////////////////////
 ///// TEMPORÁRIO: importação única do histórico ////
///// APAGUE ESTA FUNÇÃO DEPOIS DE RODAR 1 VEZ  ////
///////////////////////////////////////////////////
/*
exports.importarHistoricoYoutube = onRequest(async (req, res) => {

    const youtube = google.youtube({
        version: "v3",
        auth: YOUTUBE_API_KEY,
    });

    let nextPageToken = undefined;
    let totalSalvos = 0;

    try {
        do {
            const resposta = await youtube.search.list({
                part: ["snippet"],
                channelId: CHANNEL_ID,
                maxResults: 50,
                order: "date",
                type: "video",
                pageToken: nextPageToken,
            });

            const videos = resposta.data.items;

            for (const video of videos) {
                const id = video.id.videoId;

                const doc = await db.collection("youtubeVideos").doc(id).get();
                if (doc.exists) {
                    continue;
                }

                await db.collection("youtubeVideos").doc(id).set({
                    titulo: video.snippet.title,
                    descricao: video.snippet.description,
                    url: `https://youtube.com/watch?v=${id}`,
                    thumbnail: video.snippet.thumbnails.high.url,
                    publicadoEm: video.snippet.publishedAt,
                    criadoEm: FieldValue.serverTimestamp(),
                });

                totalSalvos++;
                console.log("Salvo:", video.snippet.title);
            }

            nextPageToken = resposta.data.nextPageToken;

        } while (nextPageToken);

        res.json({ sucesso: true, totalSalvos });

    } catch (erro) {
        console.error("Erro na importação:", erro);
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});
*/