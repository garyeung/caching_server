/**   commanderServer: 
     - receive options from terminal input
        port: should be a number if not, process exit
        origin: should be a url (should have someting to validate the url, maybe a regular expression?)
        clear-cache: should be a boolean;
    - after authenticating, pass port and origin to proxyServer 
       and pass clear-cache to cache server
*/
import { Command } from "commander";
import { proxyServer } from "./server";
import Cache from "./cache";
interface Options {
    port: string,
    origin: string,
    clearCache: boolean
}

const cache = new Cache();
export const program = new Command();
program.name("caching-proxy")
       .description("a CLI tool that starts a caching proxy server");
program.option('-p, --port <number>', 'the port on which the caching proxy server will run', '3000')
       .option('-o, --origin <url>', 'the URL of the server to which the requests will be forwarded')
       .option('-c, --clear-cache', ' to clear the cache', false)
       .action(async (options: Options) => {
            if(options.port && options.origin){
                if(isPort(options.port)){
                    proxyServer(parseInt(options.port), options.origin);
                }
                else{
                    console.error(`Unvalid Port: ${options.port}`);
                    process.exit(1);
                }

            }
           if(options.clearCache){

              const isCleaned = await cache.cleanCache();
              if(isCleaned){
                  console.log(`Clean all caches successfully`);
                process.exit(0);
              }
              else{
                  console.error(`Fail to clean caches`);
              }
           } 
       })
       .parse();


function isPort(numStr:string){
    // require
    // is a number
    // is a positive integer
    // range from 0 to 65535
   const num = Number(numStr);
   if(isNaN(num) || !Number.isInteger(num)){
        return false;
   }

   return num >= 0 && num <= 65535;

}

