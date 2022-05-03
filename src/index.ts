import express, { Request, Response } from 'express';
import cors from 'cors';
import axios, { AxiosRequestConfig } from 'axios';
import { createAccessToken, createSignature } from './helpers';
import 'dotenv/config'

const PORT = 3001;
const app = express();

const BASE_URL = "https://api.sumsub.com";
const config: AxiosRequestConfig = {
  baseURL: BASE_URL
};

app.use(cors());
axios.interceptors.request.use(createSignature, function (error) {
  return Promise.reject(error);
});

app.get('/access-token', async (req: Request, res: Response) => {
  const externalUserId = "random-JSToken-" + Math.random().toString(36).substring(2, 9);
  const levelName = 'basic-kyc-level';
  try {
    const response = await axios(createAccessToken(config, externalUserId, levelName, 600));
    console.log(response.data);
  } catch (err: any) {
    console.log(err.response.data);
  }
  return res.status(200).json({ success: true }).end();
});

app.listen(PORT);
console.log("app is listening ", PORT);