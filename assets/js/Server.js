function server(){
	var header = {
		'username':localStorage.username,
		'token':localStorage.token
	};
	var http = require('http');
	var fs  = require('fs');

	function callServer(u,t,d,cb){
		$.ajax({
			url:settings.urlPath+u,
			type:t,
			headers:{"USERNAME":header.username,"PASSWORD":header.token},
			data:d
		})
		.always(function(res) {
			//result(res);
			cb(res);
		});
	}
	function getData(o, cb){
		var port    = o.port || 80;
	    var options = {
	      host: o.img.h,
	      port: port,
	      path: o.img.p,
	      headers: {"USERNAME":header.username,"PASSWORD":header.token}
	    };
	    http.get(options, function(res) {
	    	//res.setEncoding('binary');
	        //var fileData = '';
	        var crypto = require('crypto');
	        var md5sum = crypto.createHash('md5');
	        var file = fs.createWriteStream(o.dest);
	        var totalSize = parseInt(res.headers['content-length'], 10);
	        var barWidth = 0;
	        currentSize = 0;
	        res.on('data', function(chunk){
	        	console.log("Writing data Chunk")
	        	file.write(chunk);
	        	md5sum.update(chunk);
	        	currentSize += chunk.length;
                barWidth = 100 * currentSize / totalSize;
	        	$('#bar').css({
	        		width:barWidth + '%'
	        	});	        	
	        });

	        res.on('end', function(){	        	
				file.end();		
	        });
	        file.on('finish', function(){
	        var d = md5sum.digest('hex');
				console.log(d, "md5checksum of file");
	        	cb(1,d);  						
			})
	    }).on('error', function(e) {
	        console.log("Got error: " + e.message);
	    });
	};

	function getImageData(o, cb){
		console.log("image url is ", o.img.h, o.img.p)
		var port    = o.port || 80;
	    var options = {
	      host: o.img.h,
	      port: port,
	      path: o.img.p,
	      headers: {"USERNAME":header.username,"PASSWORD":header.token}
	    };
	    http.get(options, function(res) {
	    	//res.setEncoding('binary');
	    	console.log("destination is ", o.dest)
	        //var fileData = '';
	        var lastIndexofDot = o.dest.lastIndexOf(".");
	        var ext = o.dest.substr(lastIndexofDot, o.dest.length);
	        var tmpPath = o.dest.substr(0, lastIndexofDot);

	        var file = fs.createWriteStream(tmpPath+".tmp");
	        res.on('data', function(chunk){
	        	file.write(chunk);
	        	console.log("Writing image Chunk")
	        });

	        res.on('end', function(){	        	
				file.end();				
	        });
	        file.on('finish', function(){
	        	fs.rename(tmpPath+".tmp", tmpPath+ext, function(){
	        		cb(1); 
	        	});
	        	//EventBus.dispatch(EVENT.FILEDOWNLOADED);
			})
	    }).on('error', function(e) {
	        console.log("Got error: " + e.message);
	    });
	};

	server.prototype.Login = function(uname,pwd,cb) {
		/*Login*/
		$.ajax({
			url:settings.urlPath+'login',
			type:'get',
			headers:{"USERNAME":uname,"PASSWORD":pwd}
		})
		.always(function(res) {
			res = jsonParse(res);
			//result(res.Message);
			if(res.Message != 'Login Success'){
				cb(false,res);
			}else{
				header.username = uname;
				header.token = res.Token;

				/*header.username = localStorage.username;
				header.token = localStorage.token;*/
		//		_this.Users('nay@amdon.com');
				cb(true,res);				
			}
		});
	};
	server.prototype.Users = function(username,pwd,teacher,cb) {
		if(!username){
			/*get user list*/
			callServer('users','get',{},function(res){
				cb(res);
			});
		}else{
			username = Base64.encode(username);
			if(!pwd || !teacher){
				/*get user data*/
				callServer('users/'+username,'get',{'username':username},function(res){
					return res;
				});
			}else{
				/*register user*/
				callServer('users','post',{'username':username,'password':pwd,'teacher':teacher},function(res){
					return res;
				});
			}
		}
	};
	server.prototype.Libraries = function(cb) {
		/*get library list*/
		callServer('libraries','get',{},function(res){
			cb(res);
		});
	};
	server.prototype.Books = function(cb) {
		/*get book list*/
		callServer('books','get',{},function(res){
			 cb(res);
		})		
	};
	
	server.prototype.getBookCover = function(imgName,des,cb) {
		var i = settings.urlPath+'covers/'+imgName;
		im = url_domain(i);
		getImageData({
	        img:im,
	        dest: des
	    },function(res){
	    	if(res){
	    		cb(1);
	    	} else {
	    		cb(0);
	    	}	        
	    })
	};

	server.prototype.Classes = function(teacher,cb) {
		callServer('submissions','get',{'teacher':teacher},function(res){
			cb(res);
		})
	};
	server.prototype.Submission = function(email,activityid,file) {
		if(email&&activityid&&file){
			callServer('submissions','post',{'teacher':email,'activity':activityid,'file':file},function(res){
				return res;
			})
		}else{
			callServer('submissions','get',{},function(res){
				return res;
			})
		}
	};
	server.prototype.Feedback = function(idSubmission,score,file) {
		if(idSubmission&&score&&file){
			callServer('feedbacks','post',{'idSubmission':idSubmission,'Score':score,'file':file},function(res){
				return res;
			});
		}else{
			callServer('feedbacks','get',{},function(res){
				return res;
			});
		}
	};
	server.prototype.Subscription = function(idBook,cb) {
		callServer('subscriptions','post',{'idBook':idBook},function(res){
			cb(res);
		})
	};
	server.prototype.Unsubscription = function(idBook, cb) {
		callServer('subscriptions/' + idBook + '/' ,'delete',{},function(res){
			cb(res);
		})
	};
	server.prototype.Search = function(query, cb) {
		callServer('search/' + query,'get',{},function(res){
			cb(res);
		})
	};

	server.prototype.Download = function(url, dest, cb) {
		if(dest.length){
			im = url_domain(url);
			
			getData({
		        img:im,
		        dest: dest
		    },function(res,calMD5){
		    	if(res){
		    		cb("success",calMD5);		    		
		    	} else{
		    		console.log(err)
		    		cb("error");		    		
		    	}		        
		    })
		} else {
			cb("error");			
		}		
	};
}