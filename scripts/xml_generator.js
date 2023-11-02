'use strict';
var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();
var pathFn = require('path');
var fs = require('fs');

env.addFilter('uriencode', function(str) {
	return encodeURI(str);
});

env.addFilter('noControlChars', function(str) {
	return str && str.replace(/[\x00-\x1F\x7F]/g, '');
});

const OpenCC = require('opencc');
const t2s = new OpenCC('t2s.json');
const s2t = new OpenCC('s2t.json');

env.addFilter('t2s', function(str) {
  return t2s.convertSync(str);
});

env.addFilter('s2t', function(str) {
  return s2t.convertSync(str);
});

env.addFilter('stripHtml', function(str) {
  return str.trim().replace(/<style([\s\S]*?)<\/style>/gi, "")
            .replace(/<script([\s\S]*?)<\/script>/gi, "")
            .replace(/<figure([\s\S]*?)<\/figure>/gi, "")
            .replace(/<\/div>/ig, "")
            .replace(/<\/li>/ig, "")
            .replace(/<li>/ig, "")
            .replace(/<\/ul>/ig, "")
            .replace(/<\/p>/ig, "")
            .replace(/<br\s*[\/]?>/gi, "")
            .replace(/<[^>]+>/ig, "");
});

hexo.extend.generator.register('xml', function(locals){
  var config = this.config;
  var searchConfig = config.search;

  var searchTmplSrc = searchConfig.template || pathFn.join(__dirname, '../templates/search.xml');
  var searchTmpl = nunjucks.compile(fs.readFileSync(searchTmplSrc, 'utf8'), env);

  var template = searchTmpl;
  var searchfield = searchConfig.field;
  var content = searchConfig.content;
  if (content == undefined) content=true;

  var posts, pages;

  if(searchfield.trim() != ''){
    searchfield = searchfield.trim();
    if(searchfield == 'post'){
      posts = locals.posts.sort('-date');
    }else if(searchfield == 'page'){
      pages = locals.pages;
    }else{
      posts = locals.posts.sort('-date');
      pages = locals.pages;
    }
  }else{
    posts = locals.posts.sort('-date');
  }

  var rootURL;
  if (config.root == null){
    rootURL = "/";
  }else{
    rootURL = config.root;
  }

  var xml = template.render({
    config: config,
    posts: posts,
    pages: pages,
    content: content,
    url: rootURL
  });

  return {
    path: searchConfig.path,
    data: xml
  };
});
