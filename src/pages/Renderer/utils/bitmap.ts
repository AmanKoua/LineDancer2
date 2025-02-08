export class Bitmap {

    bitmapSize: number; // number of bits
    bitmapArr: Uint8Array;

    /**
     * @param bitmapSize number of bits to account for in the map
     */
    constructor(bitmapSize: number){
        this.bitmapSize = bitmapSize;
        this.bitmapArr = new Uint8Array(Math.ceil(bitmapSize / 8));
    }

    setBitValue(index: number, val: boolean){
        const arrayIdx = Math.floor(index / 8);
        const bitIdx = index % 8;
        const bitMask = 128; // 10000000

        if (arrayIdx >= this.bitmapArr.length || arrayIdx < 0){
            throw new Error(`Bitmap cannot set value, because array index ${arrayIdx} is out of bounds!`);
        }

        if(val){
            this.bitmapArr[arrayIdx] |= bitMask >> bitIdx;
        } else {
            this.bitmapArr[arrayIdx] &= ~bitMask >> bitIdx;
        }
    }

    getBitValue(index: number) : boolean{
        const arrayIdx = Math.floor(index / 8);
        const bitIdx = index % 8;
        const bitMask = 128; // 10000000

        if (arrayIdx >= this.bitmapArr.length || arrayIdx < 0){
            throw new Error(`Bitmap cannot set value, because array index ${arrayIdx} is out of bounds!`);
        }

        return ((bitMask >> bitIdx) & this.bitmapArr[arrayIdx]) > 0;
    }

}