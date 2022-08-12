export function chunk<T>(array:Array<T> , n:number) {
    const chunkSize = n;
    let ArrayOfChunk = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        ArrayOfChunk.push(chunk);
    }

    return ArrayOfChunk;
}