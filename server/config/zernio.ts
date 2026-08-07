import {Zernio} from "@zernio/node";

const zernio = new Zernio({
    apiKey: process.env.API_KEY || "",
    baseURL: "https://zernio.com/api",
});

export default zernio;