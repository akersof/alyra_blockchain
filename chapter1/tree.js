class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
    add(value) {
        if(value < this.value)
            if(this.left === null)
                this.left = new Node(value);
            else
                this.left.add(value);
        else
            if(this.right === null)
                    this.right = new Node(value);
            else
                    this.right.add(value)
    }
}

class Tree {
    constructor(root) {
        this.root = root;
    }
    addNode(value) {
        this.root.add(value);
    }
    showTree() {
        console.log(this.root.value);
    }
}

let node = new Node(10);
let tree = new Tree(node);
tree.addNode(45);