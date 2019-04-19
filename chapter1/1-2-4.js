/*
    Find an algorithm for finding transactions that will provide us best reward in changing currencies
    Bellow what we know:
        84 Doge -> 32 LTC (1 Doge = 0.381 LTC)

        29 Doge -> 80 ETH (1 Doge = 2.75 ETH)

        300 ETH ->  62 BTC (1 ETH = 0.206 BTC)

        288 LTC -> 2304 ETH (1 LTC = 8 ETH)

        27 BTC -> 46 Doge (1 BTC = 1.7 Doge)

        33 BTC -> 16 LTC (1 BTC = 0.48 LTC)

 A classical graph theory problem. This is a Weighted directed cyclic graph
 */

//As we don't have so many edges lets represent our graph in adjaceny List
class Vertex {}


class Edge {
    constructor(vertexSrc, vertexDst, ratio) {
        this.src = vertexSrc;
        this.dst = vertexDst;
        this.ratio = ratio;
    }
}

class Graph {
    constructor(){
        this.adjList = {};
    }
    addVertex(vertex) {
        this.adjList[vertex] = []
    }
    addEdge(vertexSrc, vertexDst, ratio) {
        this.adjList[vertexSrc].push({dst: vertexDst, ratio: ratio});
    }
}

const graph = new Graph();

graph.addVertex('Doge');
graph.addVertex('ETH');
graph.addVertex('LTC');
graph.addVertex('BTC');

graph.addEdge('Doge', 'LTC', 0.381);
graph.addEdge('Doge', 'ETH', 2.75);
graph.addEdge('ETH', 'BTC', 0.206);
graph.addEdge('LTC', 'ETH', 8);
graph.addEdge('BTC', 'Doge', 1.7);
graph.addEdge('BTC', 'LTC', 0.48);

console.log(JSON.stringify(graph));

