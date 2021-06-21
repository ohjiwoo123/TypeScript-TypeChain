import * as CryptoJS from "crypto-js";

class Block {
    public index: number;
    public hash: string;
    public previoushash: string;
    public data: string;
    public timestamp:number;

    static calculateBlockHash = (
        index : number,
        previoushash : string, 
        timestamp : number, 
        data : string): string => CryptoJS.SHA256(
        index + previoushash + timestamp + data
    ).toString();

    static validateStructure=(aBlock:Block):boolean =>
        typeof aBlock.index === "number" && 
        typeof aBlock.hash ==="string" && 
        typeof aBlock.previoushash === "string" &&
        typeof aBlock.timestamp === "number" &&
        typeof aBlock.data === "string";

    constructor(
        index: number,
        hash: string,
        previoushash: string,
        data: string,
        timestamp:number
    ){
        this.index = index;
        this.hash = hash;
        this.previoushash = previoushash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock: Block = new Block(0,"2020202020","","hello",123456);

let blockchain: [Block] = [genesisBlock];

const getBlockchain = () : Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length -1];

const getNewTimeStamp = () : number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data:string) : Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index+1;
    const newTimeStamp: number = getNewTimeStamp();
    const newHash: string = Block.calculateBlockHash(
        newIndex,
        previousBlock.hash,
        newTimeStamp,
        data
    );
    const newBlock: Block = new Block(
        newIndex,
        newHash,
        previousBlock.hash,
        data,
        newTimeStamp
    );
    addBlock(newBlock);
    return newBlock;
}

const getHashforBlock = (aBlock:Block):string=>
    Block.calculateBlockHash(
        aBlock.index,
        aBlock.previoushash,
        aBlock.timestamp,
        aBlock.data
    );


const isBlockValid =(candidateBlock: Block, previousBlock:Block) : boolean => {
    if(!Block.validateStructure(candidateBlock)){
        return false;
    } else if(previousBlock.index + 1 !== candidateBlock.index){
        return false;
    } else if(previousBlock.hash !== candidateBlock.previoushash) {
        return false;
    } else if(getHashforBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    } else {
        return true;
    }
};

const addBlock = (candidateBlock: Block):void => {
    if(isBlockValid(candidateBlock, getLatestBlock())){
        blockchain.push(candidateBlock);
    }
}

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockchain);

export {};