const SERVER_FAILURE = 500;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CREATED = 201;
const UrlPattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

module.exports =  UrlPattern, CREATED, NOT_FOUND, BAD_REQUEST, SERVER_FAILURE;

//экспорт в фигурных скобках приводит к ошибке в консоли.
// начинает жаловаться на то, что UrlPattern не является регулярным выражением "regex must be RegExp"



