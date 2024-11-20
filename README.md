# caching_server
(https://roadmap.sh/projects/caching-server)  
This is a simple caching proxy server. it forwards requests to the actual server and cache the responses. If the same request is made again, it returns the cached response instead of forwarding the request to the server. 

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Redis 

## Installation 
```sh
git clone https://github.com/garyeung/caching_server_CLI.git 

cd caching_server_CLI 

npm install 
```
After connecting your own Redis database, creating your .env file according to the .env.example file

## Usage
```sh
npm run build
npm run exec -- -h  # help
npm run exec -- -p  -o   ## port and origin 
npm run exec -- -c    ## clean cache
```
## Projet Structure
```
/project
  /src
    cli:  gets port, origin and clean-cache order
          checks if the port is the legal port or not
    server: runs the proxy server on the specified port and pass the origin url to the proxy middleware
    cache: functions clean cache, get cache and save cache in Redis
    proxyMiddleware: responses if has cache otherwise requests to origin and saves cache