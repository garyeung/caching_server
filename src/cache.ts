/**
   cacheServer:
      save cache
      get cache
      clean caches
 * 
 */
import { config } from 'dotenv';
import {createClient} from 'redis';
export interface cacheValue {
    status: number,
    headers: any,
    body: any
}
config();

class Cache {
    private client;
    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL
        });
        (async ()=> await this.connect())();
    }

    private async connect(){
        try {
           if((!this.client.isOpen)){
            await this.client.connect();
            console.log("Redis connected successfully")

           }
        } catch (error) {
           console.error("Fail to connect redis ") 
        }
    }

    async saveCache(key:string ,value: cacheValue){
        try {
            await  this.client.set(key, JSON.stringify(value), {
              EX: 3600 // 1 hour expiry
             }) 
             return true;
            
        } catch (error) {
            console.error("Error to save cache: ", error)
           return false; 
        }
    }

    async getCache(key:string){
        try {
           const value = await this.client.get(key);

           if(value){
            return JSON.parse(value) as cacheValue;
           }
           return null;
            
        } catch (error) {
           console.error("Error to get cache: ", error) 
           return null;
        }
    }

    async cleanCache(key?: string){
        try {
            if(key){
                await this.client.del(key);
            }
            else{
                await this.client.flushAll();
            }
            return true;
            
        } catch (error) {
           console.error("Error to clean cache: ", error) 
           return false;

        }
    }
}

export default Cache;