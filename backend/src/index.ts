import express, { Router } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { Model } from "objection";
import Knex from "knex";
import knexConfiig from "../knexfile";
import routes from "./routes/index";
import bodyParser from "body-parser";

const knex = Knex(knexConfiig.development);

Model.knex(knex);

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
