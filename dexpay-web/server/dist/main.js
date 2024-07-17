"use strict";
// server/src/main.ts
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const lightspark_sdk_1 = require("@lightsparkdev/lightspark-sdk");
const speed_insights_1 = require("@vercel/speed-insights");
(0, speed_insights_1.injectSpeedInsights)();
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors({
    origin: "*",
    methods: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Needed for Vercel deployments
module.exports = app;
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get("/", async (_req, res) => {
    res.status(200).json({ status: "OK" });
});
app.get("/api/auth/token", (_req, res) => {
    const jwt = require("jsonwebtoken");
    const fs = require("fs");
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
    const responseProducts = await fetch(`${process.env.SHOPBOX_APIURL}/products?api-token=${process.env.SHOPBOX_APIKEY}`);
    const responseTags = await fetch(`${process.env.SHOPBOX_APIURL}/tags?api-token=${process.env.SHOPBOX_APIKEY}`);
    const jsonProducts = await responseProducts.json();
    let productsList = jsonProducts?.data?.map((product) => {
        return {
            id: product.uid,
            name: product.name,
            categoryId: product.tag,
            sku: product.sku,
            imageUrl: product?.image0?.image_original,
            description: product.description,
            sellingPrice: product.selling_price,
            ratingsCount: 55,
            ratingsValue: 3 + Math.random() * 2,
        };
    }) ?? [];
    const jsonTags = await responseTags.json();
    let tagsList = jsonTags?.data?.map((tag) => {
        return {
            name: tag.name,
            id: tag.id,
        };
    }) ?? [];
    res.status(200).json({ products: productsList, categories: tagsList });
});
app.get("/api/lightning/wallets", async (_req, res) => {
    const lightsparkClient = new lightspark_sdk_1.LightsparkClient(new lightspark_sdk_1.AccountTokenAuthProvider(process.env.LIGHTSPARK_API_TOKEN_CLIENT_ID, process.env.LIGHTSPARK_API_TOKEN_CLIENT_SECRET));
    const account = await lightsparkClient.getCurrentAccount();
    const wallets = await account.getWallets(lightsparkClient, 0);
    const nodes = await account.getNodes(lightsparkClient, 0);
    const localBalance = account.getLocalBalance(lightsparkClient, [
        lightspark_sdk_1.BitcoinNetwork.REGTEST,
        lightspark_sdk_1.BitcoinNetwork.TESTNET,
        lightspark_sdk_1.BitcoinNetwork.MAINNET,
    ]);
    const remoteBalance = account.getRemoteBalance(lightsparkClient, [
        lightspark_sdk_1.BitcoinNetwork.REGTEST,
        lightspark_sdk_1.BitcoinNetwork.TESTNET,
        lightspark_sdk_1.BitcoinNetwork.MAINNET,
    ]);
    const blockChain = account.getBlockchainBalance(lightsparkClient, [
        lightspark_sdk_1.BitcoinNetwork.REGTEST,
        lightspark_sdk_1.BitcoinNetwork.TESTNET,
        lightspark_sdk_1.BitcoinNetwork.MAINNET,
    ]);
    res.status(200).json({
        account,
        wallets,
        localBalance,
        remoteBalance,
        blockChain,
        nodes,
    });
});
app.post("/api/invoice", async (_req, res) => {
    console.log("Creating invoice: ", _req.body);
    const invoiceParams = _req.body;
    console.log("Params: ", invoiceParams);
    const lightsparkClient = new lightspark_sdk_1.LightsparkClient(new lightspark_sdk_1.AccountTokenAuthProvider(process.env.LIGHTSPARK_API_TOKEN_CLIENT_ID, process.env.LIGHTSPARK_API_TOKEN_CLIENT_SECRET));
    const account = await lightsparkClient.getCurrentAccount();
    const nodes = await account.getNodes(lightsparkClient, 0);
    const priceInSats = Math.round(((invoiceParams.totalPrice ?? 0) /
        nodes.entities[0].balances.availableToWithdrawBalance
            .preferredCurrencyValueRounded) *
        1000 *
        1000 *
        1000);
    const lnInvoice = await lightsparkClient.createTestModeInvoice(nodes.entities[0].id, priceInSats, invoiceParams.text ?? "No description");
    res.status(200).json({
        owner: "Greatest bar in the world",
        priceInSats: 2 * 1000 * 1000, //priceInSats
        //`lightning:${lnInvoice}`,
        lnInvoice: "lightning:lnbc20m1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqsfpp3qjmp7lwpagxun9pygexvgpjdc4jdj85fr9yq20q82gphp2nflc7jtzrcazrra7wwgzxqc8u7754cdlpfrmccae92qgzqvzq2ps8pqqqqqqpqqqqq9qqqvpeuqafqxu92d8lr6fvg0r5gv0heeeqgcrqlnm6jhphu9y00rrhy4grqszsvpcgpy9qqqqqqgqqqqq7qqzqj9n4evl6mr5aj9f58zp6fyjzup6ywn3x6sk8akg5v4tgn2q8g4fhx05wf6juaxu9760yp46454gpg5mtzgerlzezqcqvjnhjh8z3g2qqdhhwkj",
    });
});
