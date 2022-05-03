import { AxiosRequestConfig } from 'axios';
import crypto from 'crypto';

function createSignature(config: AxiosRequestConfig) {
  console.log('Creating a signature for the request...');

  const APP_SECRET = process.env.SUMSUB_APP_SECRET ?? "";
  var ts = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac('sha256', APP_SECRET);
  signature.update(ts + (config.method ?? "GET").toUpperCase() + config.url);

  config.headers = {
    ...config.headers,
    'X-App-Access-Ts': ts,
    'X-App-Access-Sig': signature.digest('hex'),
  }

  return config;
};

function createAccessToken(config: AxiosRequestConfig, externalUserId: string, levelName = 'basic-kyc-level', ttlInSecs = 600) {
  console.log("Creating an access token for initializng SDK...");

  const method = 'post';
  const url = `/resources/accessTokens?userId=${externalUserId}&ttlInSecs=${ttlInSecs}&levelName=${levelName}`;
  const APP_TOKEN = process.env.SUMSUB_APP_TOKEN ?? "";

  var headers = {
    'Accept': 'application/json',
    'X-App-Token': APP_TOKEN
  };

  config.method = method;
  config.url = url;
  config.headers = headers;
  config.data = null;

  return config;
};

export { createSignature, createAccessToken };