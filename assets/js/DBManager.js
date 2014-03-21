var DBManager = (function () {
  // Instance stores a reference to the Singleton
  var instance; 
	var conn;
	var dbFile;
	var queryStmt;
	var db;
	var sqlite3;
	var fs ;
	var dbPath;
  function init() {
 
    // Singleton
	setupDB();
	function setupDB(cb){
		var ngui = require('nw.gui');
		Session["appStoragePath"] = ngui.App.dataPath;

		console.log("going to start setting up DB");
		fs = require('fs');
		var userPath = Session["appStoragePath"] + appStoragePath.userPath + '/';
        var path = "/";
        if(process.env.OS != undefined){
        	path = "\\";
        }

        var arrAppPath = process.execPath.split(path);
        arrAppPath.splice(arrAppPath.length-1, 1);
        var strAppPath = arrAppPath.join(path);

        var copyPath = strAppPath+'/assets/settings/template.db';
        
        var path = fs.exists(userPath+"bookcollection.db", function (res) {
        	if(!res){
                fs.mkdir(userPath, function(){
                	copyFile(copyPath, userPath+"bookcollection.db", function(err){
				       if(err){
				       	console.log(err);
				       } else{
				       	sqlite3 = require('sqlite3').verbose();
				        db = new sqlite3.Database(userPath + 'bookcollection.db');  
				        EventBus.dispatch(EVENT.DBSETUP);
				       }
				    });
                });                
            } else{
            	sqlite3 = require('sqlite3').verbose();
				db = new sqlite3.Database(userPath + 'bookcollection.db');  				
				EventBus.dispatch(EVENT.DBSETUP);				
            }
            	
            
        });    
                
	};

	function copyFile(source, target, cb) {
	  var cbCalled = false;
	  var rd = fs.createReadStream(source);
	  rd.on("error", function(err) {
	    done(err);
	  });
	  var wr = fs.createWriteStream(target);
	  wr.on("error", function(err) {
	    done(err);
	  });
	  wr.on("close", function(ex) {
	    done(ex);
	  });
	  rd.pipe(wr);

	  function done(err) {
	    if (!cbCalled) {
	      cb(err);
	      cbCalled = true;
	    }
	  }
	};

    return {
		      // Public methods and variables
				checkUser:function(name,pass,cb){
					db.all('SELECT * FROM user WHERE email="' + name + '"', function(err,row){
						if(row.length>0){
							cb(true,row[0].email,row[0].password)
						} else {
							cb(false);
						}
					});
				},
				addUser:function(name,pass){
					db.run('INSERT INTO user (email,password,userId,userType,key)'+
						'VALUES ("' + name + '", "' + pass + '", "' + userSettings.userId + '", "' + userSettings.userType + '", "' + userSettings.key + '")');
				},
				updateUser:function(name,pass){
					db.run('UPDATE USER SET password =' + pass + ' WHERE email =' + name);
				},
				checkUserLogin:function(name,pass,cb){
					db.all('SELECT * from user WHERE email="' + name + '" AND password="' + pass + '"', function(err,row){
						if(err){
							console.log(err)
						} else{
							if(row.length > 0){
								cb(true,row[0])
							} else {
								cb(false)
							}
						}
					});
				},
				getData:function(cb){
					db.all('SELECT * FROM book WHERE userId = ' + localStorage.seluserid, function(err, row) {
						cb(row);                
			        });		
				},
				insertToDownloadList:function(data){

				},

				addToDownloadList:function(data){
					db.run('UPDATE download SET downloadlist = ' + data  + ' WHERE id=1');		
				},

				updateBookInfo:function(id, page, title){
					var sql = 'UPDATE book SET NumPages="' + page +'", Book="' + title + '"WHERE idBook=' + id;
					execute(sql);
				},

				deleteBookInfo:function(id){
					db.run('DELETE FROM book WHERE idBook = ' + id);		
				},

				getBookSettingData:function(){
					//db.run('SELECT tname, cname FROM teacher_to_course LEFT JOIN teachers ON teachers.teacher_id = teacher_to_course.teacher_id LEFT JOIN course ON course.course_id = teacher_to_course.course_id');
					
				},

				storeBookSettings:function(teacher,course,id){
					var sql = 'UPDATE book SET teacher="' + teacher + '", course="' + course +'" WHERE idBook=' +id;
					execute(sql);
				},

				getNameFromId:function(id,cb){
					var query = 'SELECT Book from book WHERE idBook=' + id +' AND userId=' + localStorage.seluserid;
					db.all('SELECT Book from book WHERE idBook=' + id +' AND userId=' + localStorage.seluserid, function(err,row){
						if(err){
							console.log(err);
							cb(false);
						} else {
							console.log("row is ",row);
							if(row.length > 0){
								cb(true,row[0].Book)
							} else {
								cb(false);
							}
						}
					});
				},

				addBooks:function(imgUrl, idBook, sCode, book, numPages, color, userId){
					db.run("INSERT INTO book (ImageUrl, idBook, ShortCode, Book, NumPages, Color, userId)" + 
			    		'VALUES ("' + imgUrl + '" , "' + idBook + '" ,"'+ sCode + '","' + book + '","' + numPages + '",' + color + ',"' + userId + '"' + ')');
				},

				incClick:function(id){
					db.run('UPDATE book set clickcount = clickcount + 1 WHERE idBook=' + id);   		    
				},

				checkIfBookExist:function(bookid, id, cb){
					db.all('SELECT idBook FROM book WHERE userId = ' + localStorage.seluserid + ' AND idBook = ' + bookid, function(err, row) {
						if(err){
							console.log(err)
							console.log(0,id);
						} else {
							if(row.length > 0){
								cb(row[0].idBook, id);
							} else {
								cb(0, id);
							}				
						}
			        });

				},
				getDownloadData:function(cb){		
				
					db.all('SELECT * FROM download', function(err, row) {
						if(err){
							console.log(err);
						} else {
							if(row.length > 0){
								cb(row[0].downloadlist)			
							} else {
								cb(0);
							}				
						}
			        });
			    }
    };
  };
  return {
 
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {
 
      if ( !instance ) {
        instance = init();
      }
 
      return instance;
    }
 
  };
 
})();