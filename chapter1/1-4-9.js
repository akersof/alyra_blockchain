const genesisTime = 1231006505;
const currentTime = new Date().getTime() / 1000;
const diff = currentTime - genesisTime;
const curBlocksHeaderSize = 80 * (diff / 60 / 10);
console.log(`The current size of all blockchain header is: ${curBlocksHeaderSize / 1000000} mega bytes`);