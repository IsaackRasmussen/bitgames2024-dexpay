// server/src/main.ts

import "dotenv/config";
import {
  AccountTokenAuthProvider,
  BitcoinNetwork,
  InvoiceType,
  LightsparkClient,
} from "@lightsparkdev/lightspark-sdk";
import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();

const jwt = require("jsonwebtoken");
const fs = require("fs");

const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", async (_req, res) => {
  res.status(200).json({ status: "OK" });
});
app.get("/api/lightning/wallets", async (_req, res) => {
  const lightsparkClient = new LightsparkClient(
    new AccountTokenAuthProvider(
      process.env.LIGHTSPARK_API_TOKEN_CLIENT_ID,
      process.env.LIGHTSPARK_API_TOKEN_CLIENT_SECRET
    )
    //"https://api.dev.dev.sparkinfra.net"
  );

  const account = await lightsparkClient.getCurrentAccount();
  const wallets = await account.getWallets(lightsparkClient, 0);
  const nodes = await account.getNodes(lightsparkClient, 0);
  const localBalance = account.getLocalBalance(lightsparkClient, [
    BitcoinNetwork.REGTEST,
    BitcoinNetwork.TESTNET,
    BitcoinNetwork.MAINNET,
  ]);
  const remoteBalance = account.getRemoteBalance(lightsparkClient, [
    BitcoinNetwork.REGTEST,
    BitcoinNetwork.TESTNET,
    BitcoinNetwork.MAINNET,
  ]);
  const blockChain = account.getBlockchainBalance(lightsparkClient, [
    BitcoinNetwork.REGTEST,
    BitcoinNetwork.TESTNET,
    BitcoinNetwork.MAINNET,
  ]);
  const lnInvoice = await lightsparkClient.createInvoice(
    nodes.entities[0].id,
    10000,
    "test meta"
  );

  res.status(200).json({
    account,
    lnInvoice,
    wallets,
    localBalance,
    remoteBalance,
    blockChain,
    nodes,
  });
});

app.get("/api/auth/token", (_req, res) => {
  // Create a JSON object that contains the claims for your JWT.
  const claims = {
    aud: "https://api.lightspark.com",
    // Any unique identifier for the user.
    sub: "0190a565-ce2e-04f8-0000-115358a96029",
    // True to use the test environment, false to use the production environment.
    test: true,
    iat: 1516239022,
    // Expiration time for the JWT.
    exp: 1799393363,
  };

  var privateKey = fs.readFileSync(".privatekey", "utf8");
  const token = jwt.sign(claims, privateKey, { algorithm: "ES256" });

  res.status(200).json({ token: token });
});

app.get("/api/products/all", async (_req, res) => {
  const responseProducts = await fetch(
    `${process.env.SHOPBOX_APIURL}/products?api-token=${process.env.SHOPBOX_APIKEY}`
  );
  const responseTags = await fetch(
    `${process.env.SHOPBOX_APIURL}/tags?api-token=${process.env.SHOPBOX_APIKEY}`
  );

  const jsonProducts = await responseProducts.json();
  let productsList =
    (jsonProducts as any)?.data?.map((product) => {
      return {
        id: product.id,
        name: product.name,
        categoryId: product.tag,
        sku: product.sku,
        imageUrl: product?.image0?.image_original,
        description: product.description,
        sellingPrice: product.sellingPrice,
      };
    }) ?? [];

  const jsonTags = await responseTags.json();
  let tagsList =
    (jsonTags as any)?.data?.map((tag) => {
      return {
        name: tag.name,
        id: tag.id,
      };
    }) ?? [];

  res.status(200).json({ products: productsList, categories: tagsList });
});

app.post("/api/products/rating", async (_req, res) => {});
