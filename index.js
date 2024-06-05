// const express = require('express');
// const bodyParser = require('body-parser');
// const QRCode = require('qrcode');
// const cors = require('cors');
// const app = express();
// const port = 3002;

// app.use(bodyParser.json());
// app.use(cors());

// app.post('/qrcode', async (req, res) => {
//   try {
//     const { data } = req.body;
//     const qrCodeURL = await QRCode.toDataURL(data);
//     res.status(200).json({ message: 'QR Code généré avec succès', qrCodeURL });
//   } catch (error) {
//     console.error('Erreur lors de la génération du QR Code :', error);
//     res.status(500).json({ message: 'Erreur lors de la génération du QR Code' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Serveur démarré sur le port ${port}`);
// });


// const express = require('express');
// const bodyParser = require('body-parser');
// const QRCode = require('qrcode');
// const cors = require('cors');
// const app = express();
// const port = 3002;

// app.use(bodyParser.json());
// app.use(cors());

// app.post('/qrcode', async (req, res) => {
//   try {
//     console.log('Données reçues:', req.body);
//     const { data } = req.body;
//     if (!data) {
//       throw new Error('Données manquantes');
//     }
//     const qrCodeURL = await QRCode.toDataURL(JSON.stringify(data));
//     res.status(200).json({ message: 'QR Code généré avec succès', qrCodeURL });
//   } catch (error) {
//     console.error('Erreur lors de la génération du QR Code :', error);
//     res.status(500).json({ message: 'Erreur lors de la génération du QR Code', error: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Serveur démarré sur le port ${port}`);
// });


// const express = require('express');
// const bodyParser = require('body-parser');
// const QRCode = require('qrcode');
// const cors = require('cors');
// const app = express();
// const port = 3002;

// app.use(bodyParser.json());
// app.use(cors());

// app.post('/qrcode', async (req, res) => {
//   try {
//     console.log('Données reçues:', req.body);
//     const { data } = req.body;
//     if (!data || !data.producer) {
//       throw new Error('Données manquantes');
//     }
//     const qrData = JSON.stringify({
//       product: {
//         name: data.name,
//         description: data.description,
//         price: data.price,
//         category: data.category,
//       },
//       producer: {
//         name: data.producer.name,
//         address: data.producer.address,
//         phone: data.producer.phone,
//         email: data.producer.email,
//       }
//     });
//     const qrCodeURL = await QRCode.toDataURL(qrData);
//     res.status(200).json({ message: 'QR Code généré avec succès', qrCodeURL });
//   } catch (error) {
//     console.error('Erreur lors de la génération du QR Code :', error);
//     res.status(500).json({ message: 'Erreur lors de la génération du QR Code', error: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Serveur démarré sur le port ${port}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const cors = require('cors');
const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use(cors());

app.post('/qrcode', async (req, res) => {
  try {
    console.log('Données reçues:', req.body);
    const { data } = req.body;
    if (!data || !data.producer) {
      throw new Error('Données manquantes');
    }
    // Générer une URL unique pour les données
    const qrData = JSON.stringify({
      product: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
      },
      producer: {
        name: data.producer.name,
        address: data.producer.address,
        phone: data.producer.phone,
        email: data.producer.email,
      }
    });
    const base64Data = Buffer.from(qrData).toString('base64');
    const qrCodeURL = await QRCode.toDataURL(`http://localhost:3002/display?data=${base64Data}`);
    res.status(200).json({ message: 'QR Code généré avec succès', qrCodeURL });
  } catch (error) {
    console.error('Erreur lors de la génération du QR Code :', error);
    res.status(500).json({ message: 'Erreur lors de la génération du QR Code', error: error.message });
  }
});

app.get('/display', (req, res) => {
  const base64Data = req.query.data;
  const decodedData = JSON.parse(Buffer.from(base64Data, 'base64').toString('utf-8'));
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Détails du Produit</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { font-size: 24px; margin-bottom: 20px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; }
        .value { margin-left: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Détails du Produit</div>
        <div class="field"><span class="label">Nom du produit:</span><span class="value">${decodedData.product.name}</span></div>
        <div class="field"><span class="label">Description:</span><span class="value">${decodedData.product.description}</span></div>
        <div class="field"><span class="label">Prix:</span><span class="value">${decodedData.product.price}</span></div>
        <div class="field"><span class="label">Catégorie:</span><span class="value">${decodedData.product.category}</span></div>
        <div class="header">Coordonnées du Producteur</div>
        <div class="field"><span class="label">Nom:</span><span class="value">${decodedData.producer.name}</span></div>
        <div class="field"><span class="label">Adresse:</span><span class="value">${decodedData.producer.address}</span></div>
        <div class="field"><span class="label">Téléphone:</span><span class="value">${decodedData.producer.phone}</span></div>
        <div class="field"><span class="label">Email:</span><span class="value">${decodedData.producer.email}</span></div>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
