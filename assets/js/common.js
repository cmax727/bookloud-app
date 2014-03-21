var merge = function(one, two){
  for(var method in two) {
    one[method] = two[method];
  }
  return one;
}
function jsonParse(str){
	if(typeof str != 'object'){
		return JSON.parse(str);
	}
	return str;
}

function createPath(){
	var path = "/";
  if(process.env.OS != undefined){
    path = "\\";
  }
	var arrAppPath =  Session["appStoragePath"].split(path);
  var strAppPath = arrAppPath.join(path);
  return strAppPath;
}

function url_domain(data) {
	var i = {};
  var    a      = document.createElement('a');
         a.href = data;
  i.h = a.hostname;
  i.p = a.pathname;
  return i;
}

function showView(){
    //  e.preventDefault();
    $('#loginView').hide();
     $("#login #loginpreloader").html("");
    $('#bookview').fadeIn();
    $("#login").prop('disabled', false);
}

function network(){
	if(navigator.onLine){
		return 1;
	} else {
		return 0;
	}	
}  

var scrollStatus;
var st;
$(function(){
    var lastScrollTop = 0, delta = 5;
    $(window).scroll(function(event){
    	
       st = $(this).scrollTop();
       if(Math.abs(lastScrollTop - st) <= delta)
          return;
       
       if (st > lastScrollTop){
           // downscroll code
           console.log('scroll down');
           scrollStatus = 0;
       } else {
          // upscroll code
          console.log('scroll up');
          scrollStatus = 1;
       }
       lastScrollTop = st;
    });
});