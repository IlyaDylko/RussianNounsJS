/*
  Copyright (c) 2011-2020 Устинов Георгий Михайлович

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
(function () {
    'use strict';

    // Ссылки:
    // - Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
    // - Статья http://en.wikipedia.org/wiki/Russian_grammar
    // - К семантике русского локатива - Плунгян В. А., Семиотика и информатика. - Вып. 37. - М., 2002. - С. 229-254

    //------------------------------
    // API
    //------------------------------
    const RussianNouns = {
        cases: () => {
            return {
                NOMINATIVE: 'именительный',
                GENITIVE: 'родительный',
                DATIVE: 'дательный',
                ACCUSATIVE: 'винительный',
                INSTRUMENTAL: 'творительный',
                PREPOSITIONAL: 'предложный',

                /**
                 * Важно понимать, что отличающийся от предложного падежа локатив иногда используется
                 * только с одним предлогом (только «в» или только «на»), а с другим или вообще
                 * не употребляется, или склоняется иначе.
                 *
                 * Например, мы говорим «на ветру», «в тылу (врага)». Но мы не говорим «в ветру», «на тылу».
                 * Обычно говорят «на тыльной стороне чего-либо» и, возможно, «в ветре» (скорее «в воздухе»).
                 *
                 * Мы говорим «на бегу», но также «в беге».
                 *
                 * Есть существительные, которые одинаково используются с предлогами «в» и «на».
                 * Например: в снегу — на снегу, во льду — на льду, в пуху — на пуху.
                 *
                 * В. А. Плунгян выделяет у слов мужского рода с особыми формами локатива
                 * семь семантических классов:
                 *  1. вместилища («в»);
                 *  2. пространства («в»);
                 *  3. конфигурации объектов, образующих устойчивые структуры (например, «ряд», «строй» — «в»);
                 *  4. поверхности («на»);
                 *  5. объекты с функциональной поверхностью («на»);
                 *  6. вещества («в» и «на»);
                 *  7. ситуации («в» и «на»).
                 *
                 * А также, у слов женского рода третьего склонения с особыми формами локатива
                 * пять семантических классов.
                 * Однако, у локатива в словах женского рода третьего склонения отличается от предложного падежа
                 * только ударение — смещается на последний слог, на письме они не отличаются.
                 */
                LOCATIVE: 'местный'
            };
        },
        caseList: () => {
            return [
                RussianNouns.cases().NOMINATIVE,
                RussianNouns.cases().GENITIVE,
                RussianNouns.cases().DATIVE,
                RussianNouns.cases().ACCUSATIVE,
                RussianNouns.cases().INSTRUMENTAL,
                RussianNouns.cases().PREPOSITIONAL,
                RussianNouns.cases().LOCATIVE
            ];
        },
        declensions: () => {
            return {
                0: 'разносклоняемые "путь" и "дитя"',
                1: 'муж., средний род без окончания',
                2: 'слова на "а", "я" (м., ж. и общий род)',
                3: 'жен. род без окончания, слова на "мя"'
            };
        },
        genders: () => {
            return {
                "FEMININE": "женский",
                "MASCULINE": "мужской",
                "NEUTER": "средний",
                "COMMON": "общий"
            };
        },
        Lemma: class Lemma {
            constructor(nominativeSingular, gender, pluraliaTantum, indeclinable, animate, surname) {
                this.pluraliaTantum = pluraliaTantum;
                this.indeclinable = indeclinable;
                this.animate = animate;
                this.surname = surname;
                if ((nominativeSingular == null) || (gender == null)) {
                    throw 'A word and a grammatical gender required.';
                }
                if (!Object.values(RussianNouns.genders()).includes(gender)) {
                    throw 'Bad grammatical gender.';
                }
                this.nominativeSingular = '' + nominativeSingular;
                this.internalGender = gender;
            }

            clone() {
                return new RussianNouns.Lemma(
                    this.nominativeSingular,
                    this.internalGender,
                    this.pluraliaTantum,
                    this.indeclinable,
                    this.animate,
                    this.surname
                );
            }

            text() {
                return this.nominativeSingular;
            }

            isPluraliaTantum() {
                return this.pluraliaTantum;
            }

            isIndeclinable() {
                return this.indeclinable;
            }

            isAnimate() {
                return this.animate || this.surname;
            }

            isSurname() {
                return this.surname;
            }

            gender() {
                return this.internalGender;
            }

        },
        createLemma: (o) => {
            if (o instanceof RussianNouns.Lemma) {
                return o;
            }
            return new RussianNouns.Lemma(o.text, o.gender, o.pluraliaTantum, o.indeclinable, o.animate, o.surname);
        },

        /**
         * «Названия „первое склонение“ и „второе склонение“ в школьной практике и вузовском преподавании
         * нередко закрепляются за разными разрядами слов. В школьных учебниках первым склонением называют изменение
         * слов с окончанием -а (вода), во многих вузовских пособиях и академических грамматиках — слов мужского
         * рода (стол) и среднего рода (окно)».
         *
         * Современный русский язык. Морфология — Камынина А.А., Уч. пос. 1999, страница 67,
         * § 36 Склонение имен существительных
         *
         * @param lemma
         * @returns {number} Склонение по Камыниной; -1 для несклоняемых существительных.
         */
        getDeclension: (lemma) => {
            return getDeclension(RussianNouns.createLemma(lemma));
        },

        /**
         * Почти везде указывают именно это число. Например, в Викисловаре.
         *
         * Неправильно работает для существительных pluralia tantum («ножницы», «дрожжи», «белила» и т.п.).
         *
         * @param lemma
         * @returns {number} «Школьный» вариант склонения (вода — первое склонение; стол, окно — второе склонение). Для несклоняемых возвращает минус единицу.
         */
        getSchoolDeclension: (lemma) => {
            const d = getDeclension(RussianNouns.createLemma(lemma));
            if (d === 1) {
                return 2;
            } else if (d === 2) {
                return 1;
            } else {
                return d;
            }
        },

        /**
         *
         * @param {RussianNouns.Lemma|Object} lemma
         * @param {string} grammaticalCase
         * @returns {Array} Список, т.к. бывают вторые родительный, винительный падежи. Существительные
         * женского рода в творительном могут иметь как окончания -ей -ой, так и -ею -ою.
         * Второй предложный падеж (местный падеж, локатив) не включен в предложный.
         */
        decline: (lemma, grammaticalCase) => {
            return declineAsList(RussianNouns.createLemma(lemma), grammaticalCase);
        },

        /**
         * @param {RussianNouns.Lemma|Object} lemma
         * @returns {Array}
         */
        pluralize: (lemma) => {
            const o = RussianNouns.createLemma(lemma);
            if (o.isPluraliaTantum()) {
                return [o.text()];
            } else {
                return pluralize(o);
            }
        }
    };

    window.RussianNouns = RussianNouns;

    //------------------------------
    // End of API
    //------------------------------

    const Case = RussianNouns.cases();

    const Gender = RussianNouns.genders();

    const misc = {
        requiredString: (v) => {
            if (typeof v !== "string") {
                throw new Error(v + " is not a string.");
            }
        }
    };

    const consonantsExceptJ = [
        'б', 'в', 'г', 'д', 'ж', 'з', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ'
    ];

    const vowels = ['а', 'о', 'у', 'э', 'ы', 'я', 'ё', 'ю', 'е', 'и'];

    function isVowel(character) {
        return vowels.includes(character.toLowerCase());
    }

    function isUpper(s) {
        return s === s.toUpperCase();
    }

    function syllableCount(s) {
        return s.split('').filter(isVowel).length;
    }

    function last(str) {
        if (str && str.length) {
            return str[str.length - 1];
        } else {
            return '';
        }
    }

    function lastN(str, n) {
        return str.substring(str.length - n);
    }

    function initial(s) {
        if (s.length <= 1) {
            return '';
        }
        return s.substring(0, s.length - 1);
    }

    function nInitial(str, n) {
        let part = str;
        for (let i = 1; i <= n; i++) {
            part = initial(part);
        }
        return part;
    }

    function lastOfNInitial(str, n) {
        return last(nInitial(str, n));
    }

    function endsWithAny(w, arr) {
        return arr.filter(a => w.endsWith(a)).length > 0;
    }

    function unYo(s) {
        return s.replace('ё', 'е').replace('Ё', 'Е');
    }

    function reYo(s) {
        return s.replace('е', 'ё').replace('Е', 'Ё');
    }

    const StemUtil = {
        getNounStem: (lemma) => {
            const word = lemma.text();
            const lcWord = word.toLowerCase();
            const gender = lemma.gender();
            const lastChar = last(word);

            if (['пес', 'пёс', 'шов'].includes(lcWord)) {
                return nInitial(word, 2) + lastChar;
            }

            if (lcWord.endsWith('рёк') && syllableCount(word) >= 2) {
                return nInitial(word, 2) + 'ьк';
            } else if (lcWord.endsWith('ёк') && isVowel(lastOfNInitial(word, 2))) {
                return nInitial(word, 2) + 'йк';
            }

            if (consonantsExceptJ.includes(last(lcWord))) {
                return word;
            }
            if ('ь' === last(lcWord)) {

                const en2a2b = [
                    'ясень', 'бюллетень', 'олень', 'гордень', 'пельмень',
                    'ячмень'
                ];

                if (lcWord.endsWith('ень') && (gender === Gender.MASCULINE) && !endsWithAny(lcWord, en2a2b)) {
                    return word.substring(0, word.length - 3) + 'н';
                } else {
                    return initial(word);
                }
            }
            if ('ь' === last(initial(lcWord))) {
                return initial(word);
            }
            if ('о' === last(lcWord) && ['л', 'м', 'н', 'т', 'х', 'в', 'с'].includes(last(initial(lcWord)))) {
                return initial(word);
            }
            return StemUtil.getStem(word);
        },
        getStem: (word) => {
            const c = last(word).toLowerCase();
            if (('й' === c || isVowel(c)) && isVowel(last(initial(word)))) {
                return nInitial(word, 2);
            }
            if (isVowel(c)) {
                return initial(word);
            }
            return word;
        },
        getInit: (s) => {
            return initial(s);
        },
        getLastTwoChars: (s) => {
            if (s.length <= 1) {
                return '';
            }
            return s.substring(s.length - 2, s.length);
        }
    };

    function getDeclension(lemma) {
        const word = lemma.text();
        const lcWord = word.toLowerCase();
        const gender = lemma.gender();
        misc.requiredString(word);
        misc.requiredString(gender);

        if (lemma.isIndeclinable()) {
            return -1;
        }

        const t = last(lcWord);
        switch (gender) {
            case Gender.FEMININE:
                return t == "а" || t == "я" ? 2 : 3;
            case Gender.MASCULINE:
                return t == "а" || t == "я" ? 2 :
                    lcWord == "путь" ? 0 : 1;
            case Gender.NEUTER:
                return ['дитя', 'полудитя'].includes(lcWord) ? 0 :
                    StemUtil.getLastTwoChars(lcWord) == "мя" ? 3 : 1;
            case Gender.COMMON:
                if (t === 'а' || t === 'я') {
                    return 2;
                } else if (t === 'и') {
                    return -1;
                } else {
                    return 1;
                }
            default:
                throw new Error("incorrect gender");
        }
    }

    function tsWord(w) {
        return last(w) === 'ц';
    }

    function tsStem(word) {
        const lcWord = word.toLowerCase();
        const head = initial(word);
        const lcHead = head.toLowerCase();
        if ('а' === last(lcHead)) {
            return head;
        } else if ('близнец' === lcWord) {    // Также, польские имена могут сюда попадать.
            return head;
        } else if (lastN(lcHead, 2) === 'ле') {
            const beforeLe = lastOfNInitial(lcHead, 2);
            if (isVowel(beforeLe) || ('л' === beforeLe)) {
                return initial(head) + 'ь';
            } else {
                return head;
            }
        } else if (isVowel(word[word.length - 2]) && (lcWord[lcWord.length - 2] !== 'и')) {
            if (isVowel(word[word.length - 3])) {
                return nInitial(word, 2) + 'й';
            } else {
                return nInitial(word, 2);
            }
        } else {
            return head;
        }
    }

    function okWord(w) {
        const tok = [
            'лапоток', 'желток'
        ];
        const tok2 = [
            'поток', 'приток', 'переток', 'проток', 'биоток', 'электроток',
            'восток', 'водосток', 'водоток', 'воток',
            'знаток'
        ];
        return (endsWithAny(w, ['чек', 'шек']) && (w.length >= 6))
            || endsWithAny(w, tok)
            || (
                w.endsWith('ок') && !w.endsWith('шок') && !(w === 'урок')
                && !endsWithAny(w, tok2)
                && !isVowel(lastOfNInitial(w, 2))
                && (isVowel(lastOfNInitial(w, 3)) || endsWithAny(nInitial(w, 2), ['ст', 'рт']))
                && w.length >= 4
            );
    }

    function softD1(w) {
        const lastChar = last(w);
        return lastChar === 'ь' || (['е', 'ё'].includes(lastChar) && !w.endsWith('це'));
    }

    function halfSomething(word) {
        if (word.startsWith('пол')
            && ['и', 'ы', 'а', 'я', 'ь'].includes(last(word))
            && (syllableCount(word) >= 2)) {

            let subWord = word.substring(3);

            // На случай дефисов.
            let offset = subWord.search(/[а-яА-Я]/);

            // Сюда не должны попадать как минимум
            // мягкий и твердый знаки помимо гласных.

            return (offset >= 0) && consonantsExceptJ.concat('й').includes(subWord[offset].toLowerCase());

        } else {
            return false;
        }
    }

    function decline0(lemma, grCase) {
        const word = lemma.text();
        const lcWord = word.toLowerCase();
        if (lcWord.endsWith('путь')) {
            if (grCase === Case.INSTRUMENTAL) {
                return initial(word) + 'ём';
            } else {
                return decline3(lemma, grCase);
            }
        } else if (lcWord.endsWith('дитя')) {
            switch (grCase) {
                case Case.NOMINATIVE:
                case Case.ACCUSATIVE:
                    return word;
                case Case.GENITIVE:
                case Case.DATIVE:
                case Case.PREPOSITIONAL:
                case Case.LOCATIVE:
                    return word + 'ти';
                case Case.INSTRUMENTAL:
                    return [word + 'тей', word + 'тею'];
            }
        } else {
            throw new Error("unsupported");
        }
    }

    function decline1(lemma, grCase) {
        const word = lemma.text();
        const lcWord = word.toLowerCase();
        const gender = lemma.gender();
        const half = halfSomething(lcWord);

        if (half && endsWithAny(lcWord, ['и', 'ы'])) {

            if ([Case.NOMINATIVE, Case.ACCUSATIVE].includes(grCase)) {
                return word;
            } else {
                let w = word;

                if (!['полминуты'].includes(lcWord)) {
                    w = 'полу' + w.substring(3);
                }

                const lemmaCopy = lemma.clone();
                lemmaCopy.internalGender = Gender.FEMININE;

                if ('полпути' === lcWord) {
                    if ([Case.PREPOSITIONAL, Case.LOCATIVE].includes(grCase)) {
                        return word;
                    } else {
                        lemmaCopy.nominativeSingular = initial(w) + 'ь';
                        return decline0(lemmaCopy, grCase);
                    }
                } else if (w.toLowerCase().endsWith('зни')) {
                    lemmaCopy.nominativeSingular = initial(w) + 'ь';
                    return decline3(lemmaCopy, grCase);
                } else {
                    const e = (last(w).toLowerCase() === 'н') ? 'я' : 'а';
                    lemmaCopy.nominativeSingular = initial(w) + e;
                    return decline2(lemmaCopy, grCase);
                }
            }
        }

        let stem = StemUtil.getNounStem(lemma);
        let lcStem = stem.toLowerCase();

        let head = initial(word);
        const soft = (half && lcWord.endsWith('я')) || softD1(lcWord);

        if (half) {
            stem = 'полу' + stem.substring(3);
            head = 'полу' + head.substring(3);
        }

        function iyWord() {
            return last(lcWord) === 'й' || ['ий', 'ие', 'иё'].includes(StemUtil.getLastTwoChars(lcWord));
        }

        function schWord() {
            return ['ч', 'щ'].includes(last(lcStem));
        }

        function surnameType1() {
            return lemma.isSurname() && (lcWord.endsWith('ин') || lcWord.endsWith('ов') || lcWord.endsWith('ев'));
        }

        function iyoy() {
            return (StemUtil.getLastTwoChars(lcWord) === 'ый')
                || (lcWord.endsWith('ной') && syllableCount(word) >= 2);
        }

        switch (grCase) {
            case Case.NOMINATIVE:
                return word;
            case Case.GENITIVE:
                if ((iyWord() && lemma.isSurname())
                    || iyoy()
                    || endsWithAny(lcWord, ['ое', 'нький', 'ский', 'евой', 'овой'])) {
                    return stem + 'ого';
                } else if (lcWord.endsWith('ее')) {
                    return stem + 'его';
                } else if (iyWord()) {
                    return head + 'я';
                } else if (soft && !schWord()) {
                    return stem + 'я';
                } else if (tsWord(lcWord)) {
                    return tsStem(word) + 'ца';
                } else if (okWord(lcWord)) {
                    return word.substring(0, word.length - 2) + 'ка';
                } else {
                    return stem + 'а';
                }
            case Case.DATIVE:
                if ((iyWord() && lemma.isSurname())
                    || iyoy()
                    || endsWithAny(lcWord, ['ое', 'нький', 'ский', 'евой', 'овой'])) {
                    return stem + 'ому';
                } else if (lcWord.endsWith('ее')) {
                    return stem + 'ему';
                } else if (iyWord()) {
                    return head + 'ю';
                } else if (soft && !schWord()) {
                    return stem + 'ю';
                } else if (tsWord(lcWord)) {
                    return tsStem(word) + 'цу';
                } else if (okWord(lcWord)) {
                    return word.substring(0, word.length - 2) + 'ку';
                } else {
                    return stem + 'у';
                }
            case Case.ACCUSATIVE:
                if (gender === Gender.NEUTER) {
                    return word;
                } else {
                    const a = lemma.isAnimate();
                    if (a === true) {
                        return decline1(lemma, Case.GENITIVE);
                    } else {
                        return word;
                    }
                }
            case Case.INSTRUMENTAL:
                if ((iyWord() && lemma.isSurname()) || endsWithAny(lcWord, ['ое', 'ее', 'нький', 'ский'])) {

                    if (lcWord !== 'целое') {
                        return stem + 'им';
                    } else {
                        return stem + 'ым';
                    }

                } else if (iyoy() || endsWithAny(lcWord, ['евой', 'овой'])) {
                    return stem + 'ым';
                } else if (iyWord()) {
                    return head + 'ем';
                } else if (soft || ['ж', 'ч', 'ш'].includes(last(lcStem))) {
                    return stem + 'ем';
                } else if (tsWord(lcWord)) {
                    return tsStem(word) + 'цем';
                } else if (lcWord.endsWith('це')) {
                    return word + 'м';
                } else if (okWord(lcWord)) {
                    return word.substring(0, word.length - 2) + 'ком';
                } else if (surnameType1()) {
                    return word + 'ым';
                } else {
                    return stem + 'ом';
                }
            case Case.PREPOSITIONAL:
                if ((iyWord() && lemma.isSurname())
                    || iyoy()
                    || endsWithAny(lcWord, ['ое', 'нький', 'ский', 'евой', 'овой'])) {
                    return stem + 'ом';
                } else if (lcWord.endsWith('ее')) {
                    return stem + 'ем';
                } else if (['ий', 'ие'].includes(StemUtil.getLastTwoChars(lcWord))) {
                    return head + 'и';
                } else if ((last(lcWord) === 'й') || ('иё' === StemUtil.getLastTwoChars(lcWord))) {
                    return head + 'е';
                } else if (tsWord(lcWord)) {
                    return tsStem(word) + 'це';
                } else if (okWord(lcWord)) {
                    return word.substring(0, word.length - 2) + 'ке';
                } else {
                    return stem + 'е';
                }
            case Case.LOCATIVE:
                const specialWords = {
                    'ветер': 'ветру',
                    'лоб': 'лбу',
                    'лёд': 'льду',
                    'лед': 'льду',
                    'мох': 'мху',
                    'угол': 'углу'
                };
                const uWords = [
                    'ад', 'бок', 'бор', 'бред', 'быт', 'верх', 'вид',
                    'глаз', 'горб', 'гроб',
                    'долг', 'дым', 'зад', 'клей', 'край', 'круг', 'лад',
                    'лес', 'луг', 'мёд', 'мед', 'мел', 'мех',
                    'мозг', 'низ', 'нос', 'плен', 'пол', 'полк', 'порт', 'пух',
                    'рай', 'род', 'сад', 'снег', 'строй', 'тыл', 'ход', 'шкаф',
                    'яр'
                ];
                if (specialWords.hasOwnProperty(lcWord)) {
                    return specialWords[lcWord];
                }
                if (uWords.includes(lcWord)) {
                    if (last(lcWord) === 'й') {
                        return word.substring(0, word.length - 1) + 'ю';
                    } else {
                        return word + 'у';
                    }
                }
                return decline1(lemma, Case.PREPOSITIONAL);
        }
    }

    function decline2(lemma, grCase) {
        const word = lemma.text();
        const lcWord = word.toLowerCase();

        const stem = StemUtil.getNounStem(lemma);
        const lcStem = stem.toLowerCase();

        const head = StemUtil.getInit(word);
        const soft = () => {
            return last(lcWord) === 'я';
        };
        const surnameLike = () => {
            return lcWord.endsWith('ова') || lcWord.endsWith('ева') || (lcWord.endsWith('ина') && !lcWord.endsWith('стина'));
        };
        const ayaWord = () => {
            return lcWord.endsWith('ая') && !((word.length < 3) || isVowel(last(stem)));
        };
        switch (grCase) {
            case Case.NOMINATIVE:
                return word;
            case Case.GENITIVE:
                if (ayaWord()) {
                    return stem + 'ой';
                } else if (lemma.isSurname()) {
                    return head + 'ой';
                } else if (
                    soft() || ['ч', 'ж', 'ш', 'щ', 'г', 'к', 'х'].includes(last(lcStem))  // soft, sibilant or velar
                ) {
                    return head + 'и';
                } else {
                    return head + 'ы';
                }
            case Case.DATIVE:
                if (ayaWord()) {
                    return stem + 'ой';
                } else if (lemma.isSurname()) {
                    return head + 'ой';
                } else if (StemUtil.getLastTwoChars(lcWord) === 'ия') {
                    return head + 'и';
                } else {
                    return head + 'е';
                }
            case Case.ACCUSATIVE:
                if (ayaWord()) {
                    return stem + 'ую';
                } else if (soft()) {
                    return head + 'ю';
                } else {
                    return head + 'у';
                }
            case Case.INSTRUMENTAL:
                if (ayaWord()) {
                    return stem + 'ой';
                } else if (soft() || ['ц', 'ч', 'ж', 'ш', 'щ'].includes(last(lcStem))) {
                    if ('и' === last(head).toLowerCase()) {
                        return head + 'ей';
                    } else {
                        return [head + 'ей', head + 'ею'];
                    }
                } else {
                    return [head + 'ой', head + 'ою'];
                }
            case Case.PREPOSITIONAL:
                if (ayaWord()) {
                    return stem + 'ой';
                } else if (lemma.isSurname()) {
                    return head + 'ой';
                } else if (StemUtil.getLastTwoChars(lcWord) === 'ия') {
                    return head + 'и';
                } else {
                    return head + 'е';
                }
            case Case.LOCATIVE:
                return decline2(lemma, Case.PREPOSITIONAL);
        }
    }

    const specialD3 = {
        'дочь': 'дочерь',
        'мать': 'матерь'
    };

    function decline3(lemma, grCase) {
        const word = lemma.text();
        const lcWord = word.toLowerCase();
        if (![Case.NOMINATIVE, Case.ACCUSATIVE].includes(grCase)) {
            if (specialD3.hasOwnProperty(lcWord)) {
                const lemmaCopy = lemma.clone();
                lemmaCopy.nominativeSingular = specialD3[lcWord];
                return decline3(lemmaCopy, grCase);
            }
        }
        const stem = StemUtil.getNounStem(lemma);
        if (StemUtil.getLastTwoChars(lcWord) === 'мя') {
            switch (grCase) {
                case Case.NOMINATIVE:
                    return word;
                case Case.GENITIVE:
                    return stem + 'ени';
                case Case.DATIVE:
                    return stem + 'ени';
                case Case.ACCUSATIVE:
                    return word;
                case Case.INSTRUMENTAL:
                    return stem + 'енем';
                case Case.PREPOSITIONAL:
                    return stem + 'ени';
                case Case.LOCATIVE:
                    return decline3(lemma, Case.PREPOSITIONAL);
            }
        } else {
            switch (grCase) {
                case Case.NOMINATIVE:
                    return word;
                case Case.GENITIVE:
                    return stem + 'и';
                case Case.DATIVE:
                    return stem + 'и';
                case Case.ACCUSATIVE:
                    return word;
                case Case.INSTRUMENTAL:
                    return stem + 'ью';
                case Case.PREPOSITIONAL:
                    return stem + 'и';
                case Case.LOCATIVE:
                    return decline3(lemma, Case.PREPOSITIONAL);
            }
        }
    }

    function declineAsList(lemma, grCase) {
        const r = decline(lemma, grCase);
        if (r instanceof Array) {
            return r;
        }
        return [r];
    }

    function decline(lemma, grCase) {
        const word = lemma.text();
        const lcWord = word.toLowerCase();
        if (lemma.isIndeclinable()) {
            return word;
        }
        if (lemma.isPluraliaTantum()) {
            throw "PluraliaTantum words are unsupported.";
        }
        const declension = getDeclension(lemma);
        switch (declension) {
            case -1:
                return word;
            case 0:
                return decline0(lemma, grCase);
            case 1:
                return decline1(lemma, grCase);
            case 2:
                return decline2(lemma, grCase);
            case 3:
                return decline3(lemma, grCase);
        }
    }

    function pluralize(lemma) {
        const result = [];

        const word = lemma.text();
        const lcWord = word.toLowerCase();

        const stem = StemUtil.getNounStem(lemma);
        const lcStem = stem.toLowerCase();

        const gender = lemma.gender();
        const declension = getDeclension(lemma);

        const simpleFirstPart = (('й' == last(lcWord) || isVowel(last(word))) && isVowel(last(initial(word))))
            ? initial(word)
            : stem;

        function softPatronymic() {
            if (lcWord.endsWith('евич') || lcWord.endsWith('евна')) {
                return lcWord.indexOf('ье') >= 0;
            }
        }

        function softPatronymicForm2() {
            const part = simpleFirstPart;
            const index = part.toLowerCase().indexOf('ье');
            const r = isUpper(part[index]) ? 'И' : 'и';
            return part.substring(0, index) + r + part.substring(index + 1);
        }

        function ы_и() {
            if (['г', 'х', 'ч', 'ж', 'ш', 'щ', 'к'].includes(last(lcStem))
                || ['я', 'й', 'ь'].includes(last(lcWord))) {

                if (softPatronymic()) {
                    result.push(softPatronymicForm2() + 'и');
                    result.push(simpleFirstPart + 'и');
                } else {
                    result.push(simpleFirstPart + 'и');
                }

            } else if (tsWord(lcWord)) {
                result.push(tsStem(word) + 'цы');

            } else {

                if (softPatronymic()) {
                    result.push(softPatronymicForm2() + 'ы');
                    result.push(simpleFirstPart + 'ы');
                } else {
                    result.push(simpleFirstPart + 'ы');
                }

            }
        }

        switch (declension) {
            case -1:
                result.push(word);
                break;
            case 0:
                if (lcWord === 'путь') {
                    result.push('пути');
                } else if (lcWord.endsWith('дитя')) {
                    result.push(nInitial(word, 3) + 'ети');
                } else {
                    throw new Error("unsupported");
                }
                break;
            case 1:

                const ya = [
                    'зять',
                    'друг',
                    'брат', 'собрат',
                    'лист', 'стул',
                    'брус',
                    'обод', 'полоз',
                    'струп',
                    'подмастерье',

                    'перо',
                    'шило'
                ];

                const softStem = (last(lcStem) === 'ь')
                    ? stem
                    : (
                        (last(lcStem) === 'к') ? (initial(stem) + 'чь') : (
                            (last(lcStem) === 'г') ? (initial(stem) + 'зь') : (stem + 'ь')
                        )
                    );

                if (ya.includes(lcWord)) {

                    result.push(softStem + 'я');

                } else if (Gender.MASCULINE === gender) {

                    const aWords = [
                        'адрес',
                        'берег', 'бок',
                        'век',
                        'вес',
                        'вечер',
                        'лес', 'снег',
                        'глаз',
                        'город',
                        'дом',
                        'детдом',
                        'счет', 'счёт'
                    ];

                    const aWords2 = [
                        'поезд',
                        'цех'
                    ];

                    const aWords3 = [
                        'год',
                        'вексель',
                        'ветер'     // TODO ветр-а / ветр-ы
                    ];

                    const ya2 = [
                        'лоскут',
                        'повод',
                        'прут',
                        'сук'
                    ];

                    if ('сын' === lcWord) {

                        result.push('сыновья');
                        ы_и();

                    } else if ('человек' === lcWord) {

                        result.push('люди');
                        ы_и();

                    } else if (ya2.includes(lcWord)) {

                        ы_и();
                        result.push(softStem + 'я');

                    } else if (aWords.includes(lcWord) || endsWithAny(lcWord, aWords2) || aWords3.includes(lcWord)) {

                        const s = unYo(stem);

                        if (softD1(lcWord)) {
                            result.push(s + 'я');
                        } else {
                            result.push(s + 'а');
                        }

                        if (aWords3.includes(lcWord)) {
                            ы_и();
                        }

                    } else if (
                        lcWord.endsWith('анин') || lcWord.endsWith('янин')      // Кроме имён.
                        || ['барин', 'боярин'].includes(lcWord)
                    ) {
                        // "барин" - "бары" тоже фигурирует в словарях,
                        // но может возникать путаница с "барами" (от слова "бар").
                        result.push(nInitial(word, 2) + 'е');
                    } else if (['цыган'].includes(lcWord)) {
                        result.push(word + 'е');
                    } else if ((lcWord.endsWith('ёнок') || lcWord.endsWith('енок'))
                        && !endsWithAny(lcWord, ['коленок', 'стенок', 'венок', 'ценок'])) {
                        result.push(nInitial(word, 4) + 'ята');
                    } else if (lcWord.endsWith('ёночек')) {
                        result.push(nInitial(word, 6) + 'ятки');
                    } else if (lcWord.endsWith('онок')
                        && ['ч', 'ж', 'ш'].includes(lastOfNInitial(lcWord, 4))
                        && !lcWord.endsWith('бочонок')) {
                        result.push(nInitial(word, 4) + 'ата');
                    } else if (okWord(lcWord)) {
                        result.push(word.substring(0, word.length - 2) + 'ки')
                    } else if (lcWord.endsWith('ый') || endsWithAny(lcWord, ['щий', 'чий', 'жний', 'шний'])) {
                        result.push(initial(word) + 'е');
                    } else if ((lcWord.endsWith('вой') && syllableCount(nInitial(word, 3)) >= 2)
                        || (lcWord.endsWith('ной') && word.length >= 6)) {
                        result.push(nInitial(word, 2) + 'ые');
                    } else if (lcWord.endsWith('его')) {
                        result.push(nInitial(word, 3) + 'ие');
                    } else {
                        ы_и();
                    }
                } else if (Gender.NEUTER === gender) {

                    if ('ухо' === lcWord) {
                        result.push('уши');
                    } else if ('око' === lcWord) {
                        result.push('очи');
                    } else if (endsWithAny(lcWord, ['ко', 'чо'])
                        && !endsWithAny(lcWord, ['войско', 'облако'])
                    ) {
                        result.push(initial(word) + 'и');
                    } else if (lcWord.endsWith('имое')) {
                        result.push(stem + 'ые')

                    } else if (lcWord.endsWith('ее')) {
                        result.push(stem + 'ие');

                    } else if (lcWord.endsWith('ое')) {

                        if (endsWithAny(lcStem, ['г', 'к', 'ж', 'ш'])) {
                            result.push(stem + 'ие');
                        } else {
                            result.push(stem + 'ые');
                        }

                    } else if (endsWithAny(lcWord, ['ие', 'иё'])) {
                        result.push(nInitial(word, 2) + 'ия');

                    } else if (endsWithAny(lcWord, ['ье', 'ьё'])) {

                        let w = nInitial(word, 2);

                        if (last(lcWord) === 'е') {
                            result.push(w + 'ия');
                        }

                        result.push(w + 'ья');

                    } else if (endsWithAny(lcWord, [
                        'дерево', 'звено', 'крыло'
                    ])) {
                        result.push(stem + 'ья');
                    } else if ('дно' === lcWord) {
                        result.push('донья');
                    } else if ('чудо' === lcWord) {
                        result.push('чудеса');
                        result.push('чуда');
                    } else if (endsWithAny(lcWord, ['ле', 'ре'])) {
                        result.push(stem + 'я');
                    } else if ([
                        'тесло', 'стекло',
                        'бедро', 'берцо',
                        'чело', 'стегно', 'стебло'
                    ].includes(lcWord)) {
                        // "Стекла" легко перепутать с глаголом,
                        // "тесла" — c Tesla,
                        // другие слова — с родительным падежом ед. ч.
                        result.push(reYo(stem) + 'а');
                    } else {
                        result.push(stem + 'а');
                    }
                } else {
                    result.push(stem + 'и');
                }
                break;
            case 2:

                if ('заря' === lcWord) {
                    result.push('зори');

                } else if (lcWord.endsWith('ая')) {
                    if (['ж', 'ш'].includes(last(lcStem)) || endsWithAny(lcStem, ['ск', 'цк'])) {
                        result.push(stem + 'ие');
                    } else {
                        result.push(stem + 'ые');
                    }
                } else {
                    ы_и();
                }
                break;
            case 3:
                if (StemUtil.getLastTwoChars(lcWord) === 'мя') {
                    result.push(stem + 'ена');
                } else if (specialD3.hasOwnProperty(lcWord)) {
                    result.push(initial(specialD3[lcWord]) + 'и');
                } else if (Gender.FEMININE === gender) {
                    result.push(simpleFirstPart + 'и');
                } else {
                    if (last(simpleFirstPart) === 'и') {
                        result.push(simpleFirstPart + 'я');
                    } else {
                        result.push(simpleFirstPart + 'а');
                    }
                }
                break;
        }

        return result;
    }

})();