import express from "express";
import validators, {
  DepositBody,
  WalletParams,
  WithdrawBody,
} from "./validators";
import db from "./mockDatabase";
import store from "./mockStore";
import { InventoryParams } from "./validators";
import axios from "axios";

const moralisKey =
  "ak4ClPYq259ou7IVWWx1OmFr5xDHrzWHk9A3cwgpM1gXB0TBjZRHN7s8ViUZGQ4y";

let router = express.Router();

// gets tokens in inventory for wallet address
// req.query: InventoryParams
// res: TokenData[]
router.get("/inventory", (req, res, next) => {
  const validate = validators.validateInventoryParams;
  const valid = validate(req.query);
  if (!valid) {
    res.status(400).send("400");
    return;
  }

  const params: InventoryParams = req.query as any;
  const tokenIds = store.getInventoryTokens(params.address);

  res.send(db.getTokenData(Object.keys(tokenIds)));
});

// gets tokens for wallet address
// req.query: WalletParams
// res: TokenData[]
router.get("/wallet", async (req, res) => {
  const validate = validators.validateWalletParams;
  const valid = validate(req.query);
  if (!valid) {
    res.status(400).send("400");
    return;
  }

  const capsuleResponse = await axios.get(
    `https://deep-index.moralis.io/api/v2/${req.query.address}/nft/0xAf615B61448691fC3E4c61AE4F015d6e77b6CCa8?chain=eth&format=decimal`,
    {
      headers: {
        "X-API-Key": moralisKey,
      },
    }
  );

  console.log(capsuleResponse.data);

  const params: WalletParams = req.query as any;
  const tokenIds = store.getWalletTokens(params.address);

  res.send(db.getTokenData(Object.keys(tokenIds)));
});

// transfers tokens from wallet into inventory
// req.body: DepositBody
router.post("/deposit", (req, res) => {
  console.log(req.body);

  const validate = validators.validateDepositBody;
  const valid = validate(req.body);
  if (!valid) {
    res.status(400).send("400");
    console.log(validate.errors);
    return;
  }

  const params: DepositBody = req.body;
  store.deposit(params.address, params.tokenIds);

  setTimeout(() => {
    res.status(200).send({});
  }, 5000);
});

// transfers tokens from inventory into wallet
// req.body: WithdrawBody
router.post("/withdraw", (req, res) => {
  const validate = validators.validateWithdrawBody;
  const valid = validate(req.body);
  if (!valid) {
    res.status(400).send("400");
    return;
  }

  const params: WithdrawBody = req.body;
  store.withdraw(params.address, params.tokenIds);
  res.status(200).send({});
});

// resets trait metadata to initial values
router.get("/resetMetadata", (req, res) => {
  res.send("");
});

export default router;
