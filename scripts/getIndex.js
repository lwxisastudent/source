hexo.extend.helper.register("getIndex", function (title){
    if(title.indexOf('\.') == -1){
        return 200;
    }
    
    var s = title.split('\.')[0];
    var n1 = parseInt(s);
    if(!isNaN(n1)){
        return n1;
    }
    
    s = s.replace(/[^\d]/g, "");
    n1 = parseInt(s);
    if(!isNaN(n1)){
        return n1 + 100;
    }else{
        return 100;
    }
    
});