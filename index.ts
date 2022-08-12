const axios = require('axios');
const cheerio = require('cheerio');
import {IMusic} from "./type";
import {chunk} from "./utils";

// All the HTML structure in the result are the same so
async function scrapList (htmlString : string) : Promise<IMusic[]> {
    const $ = cheerio.load(htmlString);

    const data:Array<{text:string , link:string}> = [];
    $('.list tbody tr td a').each((_i: any, el: any)=>{
        const text =  $(el).text();
        const link = $(el).attr().href;
        data.push({ text, link });
    });

    // the list is flat so must be regrouped per 3 (title / artist / lyricsLink)
    return chunk(data, 3).map(el => {
        return {
            title: el[0].text,
            artist: el[1].text,
            lyricsLink: el[0].link
        }
    });
}

async function search (query : string) : Promise<IMusic[]> {
    const url = `https://tononkira.serasera.org/tononkira?q=${query}`;

    try {
        const page = await axios.get(url);
        return await scrapList(page.data);

    } catch (err) {
       throw err;
    }
}

async function searchBy (title : string = '' , artist : string = '' , lyrics:string = '') : Promise<IMusic[]> {
    const url = `https://tononkira.serasera.org/tononkira?lohateny=${title}&anarana=${artist}&hira=${lyrics}&submit=Tadiavo`;

    try {
        const page = await axios.get(url);
        return await scrapList(page.data);

    } catch (err) {
        throw err;
    }
}

async function searchByTitle(title : string) : Promise<IMusic[]> {
    return await searchBy(title);
}

async function searchByArtist(artist : string) : Promise<IMusic[]> {
    return await searchBy('' , artist)
}

async function searchByLyrics(lyrics : string) : Promise<IMusic[]> {
    return await searchBy('' , '' , lyrics);
}

async function getLyricsByUrl (url : string) : Promise<string> {
    const page = await axios.get(url);
    const $ = cheerio.load(page.data);

    // Remove all the Div inside the lyrics box
    $('.col.l-2-3.s-1-1 div').remove();
    return $('.col.l-2-3.s-1-1').text().trim();
}

export {search , searchBy , searchByTitle , searchByArtist , searchByLyrics , getLyricsByUrl , IMusic};