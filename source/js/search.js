// A local search script with the help of
// [hexo-generator-search](https://github.com/PaicHyperionDev/hexo-generator-search)
// Copyright (C) 2015
// Joseph Pan <http://github.com/wzpan>
// Shuhao Mao <http://github.com/maoshuhao>
// This library is free software; you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 2.1 of the
// License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
// 02110-1301 USA
//
// Modified by:
// Pieter Robberechts <http://github.com/probberechts>

/*exported searchFunc*/
var searchFunc = function(path, searchId, contentId) {

//待搜索关键词
  function getAllCombinations(keywords) {
    var i, j, result = [];

    for (i = 0; i < keywords.length; i++) {
        for (j = i + 1; j < keywords.length + 1; j++) {
            result.push(keywords.slice(i, j).join(" "));
        }
    }
    return result;
  }

  $.ajax({
    url: path,
    dataType: "xml",
    success: function(xmlResponse) {
      // get the contents from search data
      var datas = $("entry", xmlResponse).map(function() {
        return {
          title: $("title", this).text(),
          content: $("content", this).text(),
          content1: $("content-autos", this).text(),
          content2: $("content-autot", this).text(),
          url: $("link", this).attr("href")
        };
      }).get();

      var $input = document.getElementById(searchId);
      if (!$input) { return; }
      var $resultContent = document.getElementById(contentId);

      $input.addEventListener("input", async function(){
        var resultList = [];
        var keywords = getAllCombinations(this.value.trim().toLowerCase().split(" "))
          .sort(function(a,b) { return b.split(" ").length - a.split(" ").length; });
        $resultContent.innerHTML = "";
        if (this.value.trim().length <= 0) {
          return;
        }
        // perform local searching
        datas.forEach(function(data) {
          var matches = 0;
          if (!data.title || data.title.trim() === "") {
            data.title = "无标题";
          }
          var dataTitle = data.title.trim().toLowerCase();
          var dataTitleLowerCase = dataTitle.toLowerCase();
          var dataContent = data.content.trim();
          var dataContentLowerCase = dataContent.toLowerCase();
          var dataContentLowerCase_jt = data.content1.toLowerCase();
          var dataContentLowerCase_ft = data.content2.toLowerCase();
          var dataUrl = data.url;
          var indexTitle = -1;
          var indexContent = -1;
          var firstOccur = -1;
          var matchKeywords = [];
          // only match artiles with not empty contents
          if (dataContent !== "") {
            keywords.forEach(function(keyword) {
              indexTitle = dataTitleLowerCase.indexOf(keyword);
              indexContent = (dataContentLowerCase.indexOf(keyword) + 1 || dataContentLowerCase_jt.indexOf(keyword) + 1 || dataContentLowerCase_ft.indexOf(keyword) + 1) - 1;
              matchKeywords.push(dataContentLowerCase.substring(indexContent, indexContent + keyword.length));
          
              if( indexTitle >= 0 || indexContent >= 0 ){
                matches += 1;
                if (indexContent < 0) {
                  indexContent = 0;
                }
                if (firstOccur < 0) {
                  firstOccur = indexContent;
                }
              }
            });
          }
          // show search results
          if (matches > 0) {
            var searchResult = {};
            searchResult.rank = matches;
            searchResult.str = "<li><a href='"+ dataUrl +"' class='search-result-title'>"+ dataTitle +"</a>";
            if (firstOccur >= 0) {
              // cut out 100 characters
              var start = firstOccur - 20;
              var end = firstOccur + 80;

              if(start < 0){
                start = 0;
              }

              if(start == 0){
                end = 100;
              }

              if(end > dataContent.length){
                end = dataContent.length;
              }

              var matchContent = dataContent.substring(start, end);

              // highlight all keywords
              var regS = new RegExp(matchKeywords.join("|"), "gi");
              matchContent = matchContent.replace(regS, function(keyword) {
                return "<em class=\"search-keyword\">"+keyword+"</em>";
              });

              searchResult.str += "<p class=\"search-result\">" + matchContent +"...</p>";
            }
            searchResult.str += "</li>";
            resultList.push(searchResult);
          }
        });
        if (resultList.length) {
          resultList.sort(function(a, b) {
              return b.rank - a.rank;
          });
          var result ="<ul class=\"search-result-list\">";
          for (var i = 0; i < resultList.length; i++) {
            result += resultList[i].str;
          }
          result += "</ul>";
          $resultContent.innerHTML = result;
        }
      });
    }
  });
};
