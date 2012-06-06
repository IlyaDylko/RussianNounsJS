﻿
# основной источник информации:
# Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.

misc = 
requiredString = (v) ->
  if(typeof v != "string")
    throw new Error(v + " is not a string.")

### Абстракция над справочником слов из БД. ###
class Vocabulary
  ###* является ли слово несклоняемым ###
  isIndeclinable:(word) ->
    # должно спрашивать из базы (их не так уж много)
    false





DeclensionDefinition =
  0: 'разносклоняемые "путь" и "дитя"'
  1: 'муж., средний род без окончания'
  2: 'слова на "а", "я" (м., ж. и общий род)'
  3: 'жен. род без окончания, слова на "мя"'

window.Gender =
  "FEMININE": "женский род"
  "MASCULINE": "мужской род"
  "NEUTER": "средний род"
  "COMMON": "общий род"


vocabulary = new Vocabulary()
  
###* 
Определяет склонение существительных
@param word слово в именительном падеже
@param gender пол
@returns {integer} склонение (см. DeclensionDefinition)
###
window.getDeclension = (word, gender) ->
  requiredString(word)
  requiredString(gender)
  
  # todo: избавиться от substr
  if vocabulary.isIndeclinable word
    throw new Error("indeclinable word")
  
  switch gender
    when Gender.FEMININE 
      t = word.substr(-1, 1)
      `t == "а" || t == "я" ? 2 : 3`
    when Gender.MASCULINE
      t = word.substr(-1, 1)
      `t == "а" || t == "я" ? 2 :
      word == "путь" ? 0 : 1`
    when "neuter"
      `word == "дитя" ? 0 :
      word.substr(-2, 2) == "мя" ? 3 : 1`
    when "common" then 2  # они все на -а, -я, либо несклоняемые
    else
      throw new Error("incorrect gender")


###* Русский стеммер из Snowball JavaScript Library. ###
getStem = (word) ->
  stemmer = new Snowball('Russian');
  stemmer.setCurrent(word);
  stemmer.stem();
  stemmer.getCurrent();

decline = (word, gender) ->
  stem = getStem word
  declension = getDeclension word, gender
  
  switch declension
    when 0 then stem
    when 1
      throw new Error("unsupported")
    when 2
      throw new Error("unsupported")
    when 3
      throw new Error("unsupported")

window.getStem = getStem
window.decline = decline