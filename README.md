# RussianNounsJS

## Features

* Declination of words. Only in the singular yet.
* Pluralization in the nominative case.

## Usage

```js
RussianNouns.caseList();
// [
//     "именительный",
//     "родительный",
//     "дательный",
//     "винительный",
//     "творительный",
//     "предложный",
//     "местный"
// ]

// Grammatical gender is a noun class system in Russian.
RussianNouns.genders();
// {
//     FEMININE: "женский",
//     MASCULINE: "мужской",
//     NEUTER: "средний",
//     COMMON: "общий"
// }

const rne = new RussianNouns.Engine();

rne.decline({text: 'имя', gender: 'средний'}, 'родительный');
// [ "имени" ]

rne.decline({text: 'имя', gender: 'средний'}, 'творительный');
// [ "именем" ]

const Gender = RussianNouns.genders();
const Case = RussianNouns.cases();

let coat = {
    text: 'пальто',
    gender: Gender.NEUTER,
    indeclinable: true
};

rne.decline(coat, Case.GENITIVE);
// [ "пальто" ]

RussianNouns.getDeclension(coat);
// -1

let mountain = {
    text: 'гора',
    gender: 'женский'
};

RussianNouns.caseList().map(c => {
    return rne.decline(mountain, c);
});
// [
//     ["гора"]
//     ["горы"]
//     ["горе"]
//     ["гору"]
//     ["горой", "горою"]
//     ["горе"],
//     ["горе"]
// ]

rne.pluralize(mountain);
// [ "горы" ]

RussianNouns.getDeclension(mountain);
// 2

RussianNouns.getSchoolDeclension(mountain);
// 1

let way = {
    text: 'путь',
    gender: 'мужской'
};

RussianNouns.getDeclension(way);
// 0

let кринж = {
    text: 'кринж',
    gender: Gender.MASCULINE
};

rne.decline(кринж, Case.INSTRUMENTAL);  // [ "кринжем" ]

// Change of stresses.
// Before the hyphen, there are singular settings.
// After the hyphen are the plural settings.
// The letter number in the settings is the case number in caseList().
// S — Stress is on the stem only.
// s — Stress is more often on the stem.
// b — Stress can be both on the stem and the ending equally.
// e — Stress is more often on the ending.
// E — Stress is on the ending only.
rne.sd.put(кринж, 'SEESESE-EEEEEE');

rne.decline(кринж, Case.INSTRUMENTAL);  // [ "кринжом" ]

rne.sd.put(кринж, 'SEESbSE-EEEEEE');
rne.decline(кринж, Case.INSTRUMENTAL);  // [ "кринжем", "кринжом" ]

rne.sd.put(кринж, 'SEESsSE-EEEEEE');
rne.decline(кринж, Case.INSTRUMENTAL);  // [ "кринжем", "кринжом" ]

rne.sd.put(кринж, 'SEESeSE-EEEEEE');
rne.decline(кринж, Case.INSTRUMENTAL);  // [ "кринжом", "кринжем" ]
```

```js
const rne = new RussianNouns.Engine();

const Ⰳ = (word, caseNumber) => {
    const c = RussianNouns.caseList()[caseNumber - 1];
    return rne.decline(word, c)[0];
};

const Ⰴ = (word, caseNumber) => {
    const c = RussianNouns.caseList()[caseNumber - 1];
    const result = rne.decline(word, c);
    return result[result.length - 1];
};

const ⰃⰃ = (word, caseNumber) => {
    const c = RussianNouns.caseList()[caseNumber - 1];
    const pluralForm = rne.pluralize(word)[0];
    return rne.decline(word, c, pluralForm)[0];
};

const L = RussianNouns.createLemma;
const Gender = RussianNouns.genders();
const cap = (str) => str[0].toUpperCase() + str.substring(1);

// -----------------------------------------------

// Александр Сергеевич Пушкин
// Зимний вечер (фрагмент)

const буря = L({text: 'буря', gender: Gender.FEMININE});
const мгла = L({text: 'мгла', gender: Gender.FEMININE});
const небо = L({text: 'небо', gender: Gender.NEUTER});
const вихрь = L({text: 'вихрь', gender: Gender.MASCULINE});

const зверь = L({text: 'зверь', gender: Gender.MASCULINE, animate: true});
const дитя = L({text: 'дитя', gender: Gender.NEUTER, animate: true});

const кровля = L({text: 'кровля', gender: Gender.FEMININE});
const солома = L({text: 'солома', gender: Gender.FEMININE});

const путник = L({text: 'путник', gender: Gender.MASCULINE, animate: true});
const окошко = L({text: 'окошко', gender: Gender.NEUTER});

console.log(`${cap(Ⰳ(буря, 1))} ${Ⰴ(мгла, 5)} ${Ⰳ(небо, 4)} кроет,
${cap(ⰃⰃ(вихрь, 4))} снежные крутя;
То, как ${Ⰳ(зверь, 1)}, она завоет,
То заплачет, как ${Ⰳ(дитя, 1)},
То по ${Ⰳ(кровля, 3)} обветшалой
Вдруг ${Ⰳ(солома, 5)} зашумит,
То, как ${Ⰳ(путник, 1)} запоздалый,
К нам в ${Ⰳ(окошко, 4)} застучит.`);

// Буря мглою небо кроет,
// Вихри снежные крутя;
// То, как зверь, она завоет,
// То заплачет, как дитя,
// То по кровле обветшалой
// Вдруг соломой зашумит,
// То, как путник запоздалый,
// К нам в окошко застучит.
```
**[Demo](https://georgy7.github.io/RussianNounsJS/)**  :point_left:

[Run tests in web-browser](https://georgy7.github.io/RussianNounsJS/testing.html) (based on OpenCorpora)

## References
- Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
- http://en.wikipedia.org/wiki/Russian_grammar
- К семантике русского локатива ("второго предложного" падежа) - Плунгян В. А., Семиотика и информатика. - Вып. 37. - М., 2002. - С. 229-254

## Similar software

- [Morphos](https://github.com/wapmorgan/Morphos) (PHP, MIT)

For anthroponyms only:

- [Petrovich](https://github.com/petrovich) — (JS, Java, Python and more, MIT)
- [sklonenie](https://github.com/danakt/sklonenie) (JS, MIT)
