const axios = require("axios");
const cheerio = require("cheerio");
import { IMusic } from "./type";
import { chunk } from "./utils";

// All the HTML structure in the result is the same so
async function scrapList(htmlString: string): Promise<IMusic[]> {
  const $ = cheerio.load(htmlString);

  const data: Array<{ text: string; link: string }> = [];
  $(".list tbody tr td a").each((_i: any, el: any) => {
    const text = $(el).text();
    const link = $(el).attr().href;
    data.push({ text, link });
  });

  // the list is flat, so must be regrouped per 3 (title / artist / lyricsLink)
  return chunk(data, 3).map((el) => {
    return {
      title: el[0].text,
      artist: el[1].text,
      lyricsLink: el[0].link,
    };
  });
}

async function search(query: string): Promise<IMusic[]> {
  const url = `https://tononkira.serasera.org/tononkira?q=${query}`;

  try {
    const page = await axios.get(url);
    return await scrapList(page.data);
  } catch (err) {
    throw err;
  }
}

async function searchBy(
  title: string = "",
  artist: string = "",
  lyrics: string = ""
): Promise<IMusic[]> {
  const url = `https://tononkira.serasera.org/tononkira?lohateny=${title}&anarana=${artist}&hira=${lyrics}&submit=Tadiavo`;

  try {
    const page = await axios.get(url);
    return await scrapList(page.data);
  } catch (err) {
    throw err;
  }
}

async function searchByTitle(title: string): Promise<IMusic[]> {
  return await searchBy(title);
}

async function searchByArtist(artist: string): Promise<IMusic[]> {
  return await searchBy("", artist);
}

async function searchByLyrics(lyrics: string): Promise<IMusic[]> {
  return await searchBy("", "", lyrics);
}

async function getLyricsByUrl(url: string): Promise<string> {
  const page = await axios.get(url);
  const $ = cheerio.load(page.data);

  // Remove all the Div inside the lyric box
  $(".col.l-2-3.s-1-1 div").remove();
  return $(".col.l-2-3.s-1-1").text().trim();
}

/**
 * Gets the last link on the first page of the lyric list, extracts the number from the link, and returns it
 * @returns The number of available lyrics
 */

async function getAllAvailableLyricsCount(url: string): Promise<number> {
  const page = await axios.get(url);
  const $ = cheerio.load(page.data);
  const lastLink = $("#main > a:last-of-type").attr("href") as string;
  const count = lastLink.substring(lastLink.lastIndexOf("/") + 1);
  return +count;
}

/**
 * Scrapes the list of all available lyrics from the website, then scrapes the lyrics from each page
 * @param params - { limited: boolean, limit: string }
 * @returns An array of objects with the following structure: { title: string, artist: string, lyricsLink: string }
 */
async function getAllAvailableLyrics(
  params: {
    limited: boolean;
    limit: number;
  } = { limited: true, limit: 40 }
): Promise<IMusic[]> {
  let url = "https://tononkira.serasera.org/tononkira/hira/results";

  const pageList: Array<Promise<{ data: string }>> = [];
  const lyricsList: Array<Promise<IMusic[]>> = [];

  let count = params.limited
    ? params.limit
    : await getAllAvailableLyricsCount(url);

  count = count < 20 ? 0 : count;

  for (let i = 0; i <= count; i += 20) {
    url = `${url}/${i || ""}`;
    const page = axios.get(url);
    pageList.push(page);
    url = "https://tononkira.serasera.org/tononkira/hira/results";
  }

  try {
    const allPage = await Promise.allSettled(pageList);

    for (const page of allPage) {
      if (page.status === "fulfilled") {
        const list = scrapList(page.value.data);
        lyricsList.push(list);
      }
    }
    return (await Promise.all(lyricsList)).flat(1);
  } catch (err) {
    throw err;
  }
}

export {
  search,
  searchBy,
  searchByTitle,
  searchByArtist,
  searchByLyrics,
  getLyricsByUrl,
  getAllAvailableLyrics,
  IMusic,
};
