const express = require('express');
const bodyParser = require('body-parser');
const StellarSdk = require('stellar-sdk');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/firmar-challenge', async (req, res) => {
  try {
    const { transaction } = req.body;

    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined");
    }

    if (!transaction) {
      return res.status(400).json({ error: 'Falta el parámetro: transaction' });
    }

    const keypair = StellarSdk.Keypair.fromSecret(process.env.SECRET_KEY);

    // Parseamos el challenge recibido
    const tx = StellarSdk.TransactionBuilder.fromXDR(transaction, StellarSdk.Networks.TESTNET);
    tx.sign(keypair);

    res.json({
      challenge_signed: tx.toEnvelope().toXDR('base64')
    });
  } catch (err) {
    console.error('Error al firmar el challenge:', err);
    res.status(500).json({ error: 'Error al firmar el challenge' });
  }
});

app.listen(port, () => {
  console.log(`Microservicio SEP-10 activo en puerto ${port}`);
});
