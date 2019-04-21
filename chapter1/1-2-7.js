// Exercise: create a hash table of size 8 to access data
// The hash table has to be of size 8, so i use linked list separate chaining insertion for ou 16 entries

const HASH_TABLE_SIZE = 8;

//our
const data = [
    ["Amsterdam", "153.8.223.72"], ["Chennai", "169.38.84.49"], ["Dallas", "169.46.49.112"],
    ["Dallas, TX, USA", "184.173.213.155"], ["Frankfurt", "159.122.100.41"], ["Hong Kong", "119.81.134.212"],
    ["London", "5.10.5.200"], ["London", "158.176.81.249"], ["Melbourne", "168.1.168.251"],
    ["Mexico City", "169.57.7.230"], ["Milan", "159.122.142.111"], ["Paris", "159.8.78.42"],
    ["San Jose", "192.155.217.197"], ["São Paulo", "169.57.163.228"], ["Toronto", "169.56.184.72"],
    ["Washington DC", "50.87.60.166"]

];

//really simple hash function.
const hashFunction = str => {
    let hash = 0;
    for(let i = 0; i < str.length; ++i)
        hash = (hash + str.charCodeAt(i) * 3 ** i) % HASH_TABLE_SIZE;
    // hash has to be between 0 - 7
    return hash;
};

// Element for our hasTable.
// #TODO: We could do better with the data field only containing indexes to our database...
class LinkedData {
    constructor(location, ip, next=null) {
        this.location = location;
        this.ip = ip;
        this.next = next;
    }
}

//our hash table; Idealy our hashTable should just contain indexes to a database/array
class HashTable {
    constructor(data=null){
        this.table = new Array(HASH_TABLE_SIZE).fill(null);
    }
    //returns true if insertions is successful;
    insert(key, value) {
        let hash = hashFunction(key);
        if(this.table[hash] === null) {
            this.table[hash] = new LinkedData(key, value);
            return true;
        }
        else {
            let head = this.table[hash];
            while(head.next !== null) head = head.next;
            head.next = new LinkedData(key, value);
            return true;
        }
    }
    lookup(str) {
        let result = "";
        let hash = hashFunction(str);
        let head = this.table[hash];
        if(head === null) return null;
        else {
            while(head !== null) {
                if (str === head.location)
                    result = result + head.ip + ", ";
                head = head.next;
            }
            return result.slice(0, -1); // remove the last "," character and return
        }

        return result.length === 0 ? null : result;
    }
}

//Test
let hashTable = new HashTable();

//Fill the hashTable
for(let i = 0; i < data.length; ++i) {
    hashTable.insert(...data[i]);
}

//test lookup on all our data;
for(let i = 0; i < data.length; ++i) {
    console.log(`${data[i][0]}: ${hashTable.lookup(data[i][0])}`);
}

