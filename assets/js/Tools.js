var Tools ={
	checkInternet:function(cb) {
	    $.get('http://www.google.com', function(data) {    
	        cb(true);
	    }).error(function(){
	        cb(false);
	    });
  	}



}