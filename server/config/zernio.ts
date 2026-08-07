import { Zernio } from "@zernio/node";

const apiKey = process.env.API_KEY || process.env.ZERNIO_API_KEY || "sk_placeholder";

const zernio = new Zernio({
  apiKey,
  baseURL: "https://zernio.com/api",
});

export default zernio;