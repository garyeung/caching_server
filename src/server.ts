/** 
  proxyServer: receive port and origin  from commander server to run the caching proxy server
      - after starting to run the server, the server run on port and forward requests to the origin
      - the server should be initially the origin response to client
      - when the client makes a request, the server ask for the cache server, if the cache server have the same request, return it and add "X-Cache: HIT" to the response to client. 
         else ask the origin with the request and return it to the client adding  "X-Cache: MISS" and caching it in cache server.

*/

import express from 'express';
import proxyMiddleWare from './proxyMiddleware';

export function proxyServer(port: number, origin: string){
    const originUrl = origin.replace(/\/$/,'');
    const server = express();
    server.use(express.json());
    server.use(proxyMiddleWare(originUrl));

try {
    server.listen(port, () => {
        console.log(`Caching server running on ${port} successfully`);
    })
    
} catch (error) {
        console.error(`Server fail to run on ${port}`, error);
        process.exit(1);
    
} 

}