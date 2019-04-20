class Node {
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
    isLeaf() {
        return this.value && !this.left && !this.right;
    }
}

class Tree {
    constructor(){
        this.root = null;
    }
    add(value){
        const _add = node => {
            if (value < node.value)
                node.left !== null ? _add(node.left) : node.left = new Node(value);
            else if(value > node.value)
                node.right !== null ? _add(node.right) : node.right = new Node(value);
            else
                return null;
        };
        this.root === null ? this.root = new Node(value) : _add(this.root);
    }
    //return a list [bool, Node, int]
    //1st element is a bool to check the presence of the value
    //2nd element is a the node containing the value
    //3th element is the parent node. Useful for deleting later
    //4th element is a the depth from the root where is the node containing the value
    find(value){
        const go = (value, node, parent, depth) => {
            if(node === null) return [false, null, null, null];
            else if(value === node.value) return [true, node, parent, depth];
            else
                return value < node.value ? go(value, node.left, node,  ++depth) : go(value, node.right, node, ++depth);
        };
        return go(value, this.root, null, 0);
    }
    //return a string containing the infix expression of the tree
    infixStr() {
        const go = (node) => {
            if(node === null) return "";
            else if(node.isLeaf()) return `${node.value}`;
            else
                return `${go(node.left)} ${node.value} ${go(node.right)}`;
        };
        return go(this.root);
    }
    del(value) {
        let [exists, node, parent, ] = this.find(value);
        //Value doesn't exist
        if(!exists) return null;
        //Value is in a leaf
        else if(node.isLeaf()) {
            parent.left === node ? parent.left = null : parent.right = null;
        }
        //Value has just 1 child
        else if(node.left === null || node.right === null) {
            let child = node.left === null ? node.right : node.left;
            parent.left === node ? parent.left = child : parent.right = child;
        }else { //Value has 2 children;
            //First we need to find if we are successor of root.left or success of root.right
            //For the exercise we could just check if the value to delete is greater or lesser than this.root.value
            //But this is a more general approach.
            const findRep = (node, direction) => {
                if(direction === "left") {
                    return node.left === null ? node : findRep(node.left, "left");

                } else if(direction === "right") {
                    return node.right === null ? node : findRep(node.right, "right");
                }
            };
            if(this.isParent(this.root.left.value, value) || this.root.left === node) {
                // we are on the left side of the binary tree.
                // We need to find the child the most at the right (the highest of the smallest)
                // and replace the node we want to delete with this child
                let rep = findRep(node.right, "right");
                let tmp = rep.value;
                this.del(rep.value);
                node.value = tmp;
            }
            else {
                // we are on the right side of the binary tree.
                // We need to find the child the most at the left. The highest of the smallest
                // and the replace the node we want to delete with this child
                let rep = findRep(node.left, "left");
                let tmp = rep.value;
                this.del(rep.value);
                node.value = tmp;
            }
        }
        node = null;
    }
    //check if valueChild is successor of valueParent
    isParent(valueParent, valueChild) {
        //2 same values return false
        if(valueParent === valueChild) return false;
        //Get the node object corresponding to our values
        let [existChild, nodeChild, nodeChildDirectParent, ] = this.find(valueChild);
        let [existParent, nodeParent, , ] = this.find(valueParent);
        //if any of the values doesn't exits return false;
        if(!existChild || !existParent) return false;
        //if the child to check is root node return false;
        if(nodeChild === this.root) return false;
        //recursion until we find a nodeParent as ancestor of nodeChild.
        // return a bool
        const go = node => {
            //Direct parent of our current node
            if(node === nodeParent) {
                return true;
            }
            else if(node === this.root)
                return false;
            else {
                let [, , directParent,] = this.find(node.value);
                return go(directParent);
            }
        };
        return go(nodeChildDirectParent);

    }

}

//Test
let tree = new Tree();
tree.add(6); tree.add(3); tree.add(10); tree.add(2); tree.add(5); tree.add(4); tree.add(9); tree.add(12);
tree.add(11); tree.add(13);
tree.del(10);
console.log(tree.infixStr());



