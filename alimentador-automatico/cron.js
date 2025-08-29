import RSSParser from 'rss-parser';
import slugify from 'slugify';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import  randomUUID from 'crypto';
import { fileURLToPath } from 'url';

import cron from 'node-cron';

const client = createClient({
  projectId: 'e1afdefg',
  dataset: 'production',
  token: 'sk59HNI3K3xtlkxU3UTwY0fDxlyazuiKPJnKurPRn1Eto8b0WwudxWRXWqBO0qiXNKzYgsYMBYNpIpCokOutZaQxPmr1eWU6hCKk4JQ1ZJRS78Su7kWS30f5zO5YQOuH4pzot5VdKwInfFiPrvKYJP7CNypjVJfK2KFrj5azmzHLvBIJHuvG',
  useCdn: false,
  apiVersion: '2023-08-01',
});


// 2. Gera bloco de texto com _key para block e children
function gerarBloco(texto) {
  return [
    {
      _type: 'block',
      _key: randomUUID,
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: randomUUID,
          text: texto,
        },
      ],
    },
  ];
}

//3. Criar Artigo conforme o scheme 
async function criarArtigoCompleto() {
  const tituloPT = 'Notícia completa com imagem';
  const tituloEN = 'Full news article with image';
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const caminhoImagem = path.join(__dirname, 'imagem.jpg'); // sua imagem local

  try {
    // 4. Upload da imagem
    const assetImagem = await client.assets.upload('image', fs.createReadStream(caminhoImagem), {
      filename: 'imagem.jpg',
    });

    // 5. Monta o artigo
    const artigo = {
      _type: 'newsArticle',
      title: {
        pt: tituloPT,
        en: tituloEN,
      },
      slug: {
        _type: 'slug',
        current: slugify(tituloPT, { lower: true, strict: true }),
      },
      summary: {
        pt: 'Resumo em português da notícia.',
        en: 'English summary of the news article.',
      },
      content: {
        pt: gerarBloco('Este é o conteúdo da notícia em português.'),
        en: gerarBloco('This is the content of the news article in English.'),
      },
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: assetImagem._id,
        },
      },
      youtubeUrl: 'https://www.youtube.com/watch?v=VIDEO_ID',
      country: 'Brasil',
      category: 'Política',
      publishedAt: new Date().toISOString(),
      readTime: '3 min',
      source: 'BRICS News',
      featured: false,
      status: 'published',
    };

    // 6. Envia para o Sanity
    const resultado = await client.create(artigo);
    console.log('✅ Artigo criado com sucesso! ID:', resultado._id);
  } catch (erro) {
    console.error('❌ Erro ao criar artigo:', erro.message);
  }
}

criarArtigoCompleto();

//Executar funcao todo dia as 10h da manha pm2 gerenciando no servidor
cron.schedule('0 10 * * *', () => {
  console.log('🕙 Executando função criarArtigo às 10h...');
  criarArtigoCompleto();
});

// async function testarUploadImagem() {
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);
//   const imagePath = path.join(__dirname, 'imagem.jpg');

//   if (!fs.existsSync(imagePath)) {
//     console.error('❌ Arquivo não encontrado:', imagePath);
//     return;
//   }

//   try {
//     const asset = await client.assets.upload('image', fs.createReadStream(imagePath), {
//       filename: 'imagem.jpg',
//     });

//     console.log('✅ Upload bem-sucedido. Asset ID:', asset._id);
//     console.log('📷 URL da imagem:', asset.url);
//   } catch (error) {
//     console.error('❌ Falha no upload:', error.message);
//   }
// }
// testarUploadImagem();
// async function importarDoRss() {
//   const parser = new RSSParser();

//   try {
//     const feed = await parser.parseURL('https://iol.co.za/rss/iol/news/world/');
//     const primeiraNoticia = feed.items[0];

//     if (!primeiraNoticia) {
//       console.log('Nenhuma notícia encontrada no RSS.');
//       return;
//     }

//     const { title, link, contentSnippet, pubDate } = primeiraNoticia;

//     // const tituloTraduzido = await translate(title, { to: 'pt' });
//     // const corpoTraduzido = await translate(contentSnippet || '', { to: 'pt' });

//     const novaNoticia = {
//       _type: 'article',
//       title: title,
//       slug: {
//         _type: 'slug',
//         current: slugify(title, { lower: true, strict: true }),
//       },
//       body: contentSnippet,
//       url: link,
//       publishedAt: new Date(pubDate).toISOString(),
//     };

//     const resultado = await client.create(novaNoticia);
//     console.log('✅ Notícia publicada no Sanity:', resultado._id);
//   } catch (error) {
//     console.error('❌ Erro ao importar notícia:', error.message);
//   }
// }
