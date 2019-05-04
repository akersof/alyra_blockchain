//bitcoin use an unsigned integer for the unix timestamp so:
const crashTimeStamp =  0xFFFFFFFF ;
console.log("The apocalypse will come the: ", new Date(crashTimeStamp * 1000).toGMTString());