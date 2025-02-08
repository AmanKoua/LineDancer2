// returns a function, which will deterministically return a series of pseudo-random values, based on a seed.
export function createSeededRNG(state: number) {
    return function() {
        state = (state * 1664525 + 1013904223) % 4294967296; // LCG formula
        return (state >>> 0) / 4294967296; // Convert to [0, 1)
    };
}

export const sleep = async (time: number) => {
    return new Promise((res,rej) => {
        setTimeout(()=>{
            res(0);
        },time)
    })
}