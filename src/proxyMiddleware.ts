import { Request, Response } from "express";
import axios from "axios";
import https from 'https';
import Cache from "./cache";

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    timeout: 10000,
})

const cache = new Cache();
function proxyMiddleWare(originUrl: string){
    return async (req:Request, res: Response) => {
            console.group('Caching Proxy Start');
            console.time();
            const url = `${originUrl}${req.path}`; 
            console.log(`Original: ${originUrl}`);
            console.log(`Request path: ${req.path}`);
            console.log(`Orginal + Request path: ${url}`);

            const cacheKey = `${req.method}:${req.url}`;
            const cachedResponse = await cache.getCache(cacheKey);

            if(cachedResponse){
                res.set('X-Cache', "HIT")
                    .status(cachedResponse.status)
                    .set(cachedResponse.headers)
                    .send(cachedResponse.body);
                console.info('Success response from cache');
                console.timeEnd();
                console.groupEnd();
                return;
            }

            try {
               const response = await axiosInstance({
                method: req.method,
                url: url,
                headers: {
                    ...req.headers,
                    host: new URL(originUrl).host
                },
                data: req.body,
                validateStatus: (status) => true,
               })

               const isSaved =  await cache.saveCache(cacheKey, {
                status: response.status,
                headers: response.headers,
                body: response.data,
                
               });              
               if(isSaved){
                res.set("X-Cache", "MISS")
                    .status(response.status)
                    .set(response.headers)
                    .send(response.data);
                console.info("Success response from origin");
                console.timeEnd();
                console.groupEnd();
                return;
               }

               else{
                 throw new Error("Can't save cache");
               }

            } catch (error) {
                console.error("Proxy middleware error:", error);
                res.status(500).send("Proxy middleware Error");
                
            }
    }
}

export default proxyMiddleWare;