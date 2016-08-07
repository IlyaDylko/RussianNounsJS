﻿
var main = function() {

var russianNouns = new RussianNouns(new MockVocabulary())

var cases = [Case.NOMINATIVE, Case.GENITIVE, Case.DATIVE, 
             Case.ACCUSATIVE, Case.INSTRUMENTAL, Case.PREPOSITIONAL];

var dataM = [
    ['стол', 'стола', 'столу', 'стол', 'столом', 'столе']
  , ['муж', 'мужа', 'мужу', 'мужа', 'мужем', 'муже']
  
  , ['музей', 'музея', 'музею', 'музей', 'музеем', 'музее']
  , ['пролетарий', 'пролетария', 'пролетарию', 'пролетария', 'пролетарием', 'пролетарии']
  
  , ['дворище', 'дворища', 'дворищу', 'дворище', 'дворищем', 'дворище']
  
  // адьективное склонение
  , ['лесничий', 'лесничего', 'лесничему', 'лесничего', 'лесничим', 'лесничем']
  
  , ['Георгий', 'Георгия', 'Георгию', 'Георгия', 'Георгием', 'Георгии']
  , ['Алексей', 'Алексея', 'Алексею', 'Алексея', 'Алексеем', 'Алексее']
  , ['Гоша', 'Гоши', 'Гоше', 'Гошу', 'Гошей', 'Гоше']
  
  , ['путь', 'пути', 'пути', 'путь', 'путем', 'пути']
  , ['дядя', 'дяди', 'дяде', 'дядю', 'дядей', 'дяде']
  
  , ['ебарь', 'ебаря', 'ебарю', 'ебаря', 'ебарем', 'ебаре']
  , ['еж', 'ежа', 'ежу', 'ежа', 'ежом', 'еже']
  , ['ежик', 'ежика', 'ежику', 'ежика', 'ежиком', 'ежике']
  , ['ерш', 'ерша', 'ершу', 'ерша', 'ершом', 'ерше']
  , ['ершик', 'ершика', 'ершику', 'ершика', 'ершиком', 'ершике']
  
  , ['чирей', 'чирья', 'чирью', 'чирей', 'чирьем', 'чирье']
  , ['иудей', 'иудея', 'иудею', 'иудея', 'иудеем', 'иудее']
  
  , ['парашют', 'парашюта', 'парашюту', 'парашют', 'парашютом', 'парашюте']
  , ['вокзал', 'вокзала', 'вокзалу', 'вокзал', 'вокзалом', 'вокзале']
  , ['параход', 'парахода', 'параходу', 'параход', 'параходом', 'параходе']
  , ['дирижабль', 'дирижабля', 'дирижаблю', 'дирижабль', 'дирижаблем', 'дирижабле']
  , ['мармелад', 'мармелада', 'мармеладу', 'мармелад', 'мармеладом', 'мармеладе']
  , ['Вася', 'Васи', 'Васе', 'Васю', 'Васей', 'Васе']
  , ['гвоздь', 'гвоздя', 'гвоздю', 'гвоздь', 'гвоздем', 'гвозде']
  , ['пилот', 'пилота', 'пилоту', 'пилота', 'пилотом', 'пилоте']
  , ['пистолет', 'пистолета', 'пистолету', 'пистолет', 'пистолетом', 'пистолете']
  , ['вопль', 'вопля', 'воплю', 'вопль', 'воплем', 'вопле']
  , ['закат', 'заката', 'закату', 'закат', 'закатом', 'закате']
  //, ['', '', '', '', '', '']
];

var dataF = [
    ['страна', 'страны', 'стране', 'страну', 'страной', 'стране']
  , ['Ксюха', 'Ксюхи', 'Ксюхе', 'Ксюху', 'Ксюхой', 'Ксюхе']
  , ['Москва', 'Москвы', 'Москве', 'Москву', 'Москвой', 'Москве']
  
  // жи, ши, шипящие
  , ['чаша', 'чаши', 'чаше', 'чашу', 'чашей', 'чаше']
  , ['ложа', 'ложи', 'ложе', 'ложу', 'ложей', 'ложе']
  , ['чаща', 'чащи', 'чаще', 'чащу', 'чащей', 'чаще']  // 4a
  , ['моча', 'мочи', 'моче', 'мочу', 'мочой', 'моче']  // 4b
  , ['туча', 'тучи', 'туче', 'тучу', 'тучей', 'туче']
  
  , ['мочь', 'мочи', 'мочи', 'мочь', 'мочью', 'мочи']
  
  // слова с основой на задненебные
  , ['рука', 'руки', 'руке', 'руку', 'рукой', 'руке']
  , ['дуга', 'дуги', 'дуге', 'дугу', 'дугой', 'дуге']
  , ['сноха', 'снохи', 'снохе', 'сноху', 'снохой', 'снохе']
  
  , ['птица', 'птицы', 'птице', 'птицу', 'птицей', 'птице']
  , ['земля', 'земли', 'земле', 'землю', 'землей', 'земле']
  , ['армия', 'армии', 'армии', 'армию', 'армией', 'армии']
  , ['соя', 'сои', 'сое', 'сою', 'соей', 'сое']
  
  , ['бровь', 'брови', 'брови', 'бровь', 'бровью', 'брови']
  
  //, ['', '', '', '', '', '']
];

var dataN = [
    ['село', 'села', 'селу', 'село', 'селом', 'селе']
  , ['поле', 'поля', 'полю', 'поле', 'полем', 'поле']
  , ['строение', 'строения', 'строению', 'строение', 'строением', 'строении']
  , ['вымя', 'вымени', 'вымени', 'вымя', 'выменем', 'вымени']
  
    // примеры несклоняемого существительного
  , ['пальто', 'пальто', 'пальто', 'пальто', 'пальто', 'пальто']
  , ['рагу','рагу','рагу','рагу','рагу','рагу']
  , ['такси','такси','такси','такси','такси','такси']
  //, ['', '', '', '', '', '']
];


var dataC = [
    ['бедняжка', 'бедняжки', 'бедняжке', 'бедняжку', 'бедняжкой', 'бедняжке']
  , ['молодец', 'молодца', 'молодцу', 'молодца', 'молодцом', 'молодце']
  , ['человечище', 'человечища', 'человечищу', 'человечища', 'человечищем', 'человечище']
  , ['хиппи', 'хиппи', 'хиппи', 'хиппи', 'хиппи', 'хиппи']
  //, ['', '', '', '', '', '']
];

var result = [];

var wrongForms = 0;
var wrongWords = 0;
var totalForms = (dataM.length + dataF.length + dataN.length) * 6;
var totalWords = dataM.length + dataF.length + dataN.length;


function test(data, gender) {
	for (var i = 0; i < data.length; i++) {
		
		var word = data[i][0];
		var expResults = data[i];
		
		var r = [];
		
		for (var j = 0; j < cases.length; j++) {
			var c = cases[j];
			var expected = expResults[j];
			
			try {
				var actual = russianNouns.decline(word, gender, c);
			} catch(e) {
				var actual = '-----';
				if (e.message !== "unsupported") throw e;
			}
			if (actual == expected) {
				var ok = true;
				var failure = false;
			} else {
				var ok = false;
				var failure = true;
				wrongForms++;
			}
			r.push({"expexted":expected,"actual":actual,"ok":ok,"failure":failure});
		}
		
		if (gender == Gender.MASCULINE) { var g = 'мужской'; var gbg = "#df5" }
		if (gender == Gender.FEMININE) { var g = 'женский'; var gbg = "#9f5" }
		if (gender == Gender.NEUTER) { var g = 'средний'; var gbg = "#f59" }
		if (gender == Gender.COMMON) { var g = 'общий'; }
		
		var declension = '';
		try {
			var declension = russianNouns.getDeclension(word, gender);
		} catch (e) {}
		
		if (declension === '') { var dColor = '#999999'; }
		else if (declension === 1) { var dColor = '#3ef481'; }
		else if (declension === 2) { var dColor = '#96f43e'; }
		else if (declension === 3) { var dColor = '#f3f43e'; }
		else { var dColor = '#fff'; }
		
		
		result.push({"wordForms":r,"gender":g, "genderColor":gbg, "declension":declension, "dColor":dColor});
	}
}

test(dataM, Gender.MASCULINE);
test(dataF, Gender.FEMININE);
test(dataN, Gender.NEUTER);
test(dataC, Gender.COMMON);

var json = {"items":result};
console.log(json);

var template = $('#template').val();
var html = Mustache.to_html(template, json);
$('#result').append(html);
$('#stats').text((totalForms-wrongForms)+'/'+totalForms + ' (' + ((totalForms-wrongForms)/totalForms*100).toFixed(2) + '%)');

};
setTimeout(main, 500);