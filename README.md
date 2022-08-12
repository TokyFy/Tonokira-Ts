# Tonokira-Ts 
![npm](https://img.shields.io/npm/v/tonokira)

It's a wrapper for tononkira.serasera.org (Lyrics database for Malagasy Songs)

## 📦 Install

```shell
npm i tonokira

#or

yarn add tonokira
```

## 🚀 Usage

```typescript

const tonokira = require('tonokira');

(async () => {
    const result = await tonokira.search('kristel');
    const lyrics = await tonokira.getLyricsByUrl('https://tononkira.serasera.org/hira/kristel/akao');

    console.log(result);
    console.log(lyrics);
})();

```

Result :

```shell
[
  {
    title: 'Akao',
    artist: 'Kristel',
    lyricsLink: 'https://tononkira.serasera.org/hira/kristel/akao'
  },
  {
    title: 'Irony',
    artist: 'Kristel',
    lyricsLink: 'https://tononkira.serasera.org/hira/kristel/irony-2'
  }
]

Toa variana ianao
Toa mialalao
Izaho mitady anao
Lasalasa ny sainao
Mieritreritra aho
Mitady izay ho atao

Toa manirery
Tsy misy mpijery
ToaTsiky dia ampy manam-pery
Izaho tsy hamela anao ho very
Na dia very jery
Na dia irery
Ho avy aho
Hanambitamby anao

Ho avy aho (akao… akao…)
Ho avy any aminao (akao… akao…)
```


## 🥰 Contributing

Contributions, issues and feature requests are welcome!

## 📝 Note
Inspired by [Tonokira](https://github.com/gaetan1903/tononkira) (written in Python)
## ✨ Support

Give a ⭐️ if this project helped you!
