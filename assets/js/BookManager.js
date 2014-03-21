function BookManager(){
	var test = false;
	var s = new server();
	var index=0;
	var _this=this;
	var count = 0;
	var bookCount = 0;
	var teacher=0;
	var course=0;
	var objJson;	
	var bookId = 0;
	var token = 0;
	var pallete = [];
	var colorCombo = [];
	var color = [];
	var d;
	var bCont = new BookContentManager();
	var downloadUrl = [];
	var bookArr = [];
	var tempArr = [];
	var bookName;
	var idArr = [];
	var titleArr = [];
	var downloadCount = 0;
	var coverImageArr = [];
	var imgToken = 0;
	var marginFlag=0;
	var drawFlag=0;
	var navFlag=0;
	var tempPath;
	var fs = require('fs');
	var mkdirp = require('mkdirp');	
	var rimraf = require('rimraf');
	var ncp = require('ncp').ncp;			
	var teacherArr = [];

	color[0] = "C53D97,E146AC,A93481";
	color[1] = "27A40B,2DBB0D,228C0A";
	color[2] = "BA8D11,D4A114,9F790F";
	color[3] = "C8471E,E55123,AC3D1A";
	color[4] = "BB0929,D60A2F,A20923";
	color[5] = "0098D2,00AEF0,0082B4";
	color[6] = "571C96,6420AB,4B1880";
	color[7] = "CF007A,ED008C,B20069";
	color[8] = "995DBA,AF6AD5,834FA0";
	color[9] = "64DF00,55BF00,99FF33";
	color[10] = "DF673F,FF7648,BF5836";
	color[11] = "D358AD,F165C6,B54C94";
	color[12] = "059E66,06B475,048758";
	color[13] = "CAAC25,E7C42A,DBDC00";
	color[14] = "81B71F,93D124,6E9D1B";
	color[15] = "32B8A4,3AD6C0,43F5DB";
	
	BookManager.prototype.init = function(){
			d = DBManager.getInstance();

			createPallete();
			this.create(_this);

			$('#bookcontentview').hide();
			$('#title').html(settings.title);
			$('.view').show();
			_this.checkDownloads();				
			_this.getBooks();
			_this.getTeachers();
			_this.createNewBookView();
			
			$('.link').bind("click", _this.setId);
			

			$('#bookviewclose').bind("click", function(e){
				$('#userbook').html('');
			});
			$('#btndel').bind("click", function(e){
				_this.deleteBookInfo();
				$('#delpopup').modal('hide');
			});

			$('.del').bind("click", function(e){
				$('delpopup').modal({
					keyboard: false,
					show:true
				});
			});

			$('#addbook').bind("click", function(e){
				$('.view').hide();
				$('.nobooks').hide();
				$('.newview').fadeIn();
				$("#newbookdiv").show();
				$('#preloader').hide();
				$("#showDel").hide();
			});

			$('#method').bind("click", function(e){
				if(!drawFlag){
					var isVisible = $('#navigation').is(':visible');
					if (isVisible) {
						$('#navigation').hide();
						navFlag=1;
					}
					$('#userbook').hide();
					$('#methoddraw').fadeIn();
					drawFlag=1;					
				}else{
					if(navFlag){
						$('#navigation').fadeIn();
						navFlag=0;
					}
					$('#userbook').fadeIn();
					$('#methoddraw').hide();
					drawFlag=0;
				}
			});

			$('#backtolib').bind("click", function(e){
				$('.newview').hide();
				if(downloadUrl.length > 0) {
					$('#preloader').fadeIn();
				}
				$('.view').fadeIn();
				//$('body').removeClass('bgblack');
				var length = $('#books').children().length;
				if(length == 0){
					$('.nobooks').fadeIn();
				}
				$("#showDel").show();				
			});

			$('#backtohome').bind("click", function(e){
				bCont.resetData();
				$('#bookcontentview').hide();
				$('#bookview').fadeIn();
				$('#title').show();
				$('#btn').show();
				$("#pagination").hide();
				$("#footerlist").show();
				drawFlag=0;				
			});

			$('#searchcontent').bind("click", function(e){
				var isVisible = $('#methoddraw').is(':visible');
				if(!isVisible){
					if(!marginFlag){
						$('#navigation').fadeIn();
						$('#userbook').css('marginLeft','287px');
						marginFlag=1;
					}else{
						$('#navigation').hide();
						$('#userbook').css('marginLeft','50px');
						marginFlag=0;
					}
				}				
			});

			$('#showDel').bind("click", function(e){
				console.log("clicking del", $('.del').is(':visible'))
				$('.del').is(':visible')==false?$('.del').show():$('.del').hide();

				//$(this).parent().addClass("current");
			});

		    $('#search').bind("keyup", function (e){
		    	if(e.keyCode == 13){
			    	_this.searchBook(e, _this);
			    	 $('#search').clearSearch({ callback: function() { 
			    	 	$('#bookstore').fadeIn();
						$('#searchstore').hide();
						$('#searchbooklist').html("");
						$('.newbooklist').fadeIn();
			    	 }});
				    // change width
				    //$('#search').width('200px').change();			        
			    }

			    if(e.keyCode == 8 || e.keyCode == 46) {
			    	var val = $('#search').val();
			    	if(val==""){
			    		$('#bookstore').fadeIn();
						$('#searchstore').hide();
						$('#searchbooklist').html("");
						$('.newbooklist').fadeIn();
			    	}
			    }
			})

			$('#btnclose').bind("click", function(e){
				$('#delpopup').modal('hide');
			});			
	};

	BookManager.prototype.getTeachers = function(){
		s.Users('','','',function(res){
			var base64Username;
			var result = jsonParse(res)
			console.log('userlist is ', result)
			for(var i=0;i<result.length;i++){
				if(result[i].UserType == '1'){
					teacherArr.push(result[i].Username);
					base64Username = Base64.encode(result[i].Username)
					s.Classes(base64Username, function(res){	
						console.log('result for classes',res)					
						var classResult = jsonParse(res);												
					});
				}
			}			
		});		
	};

	

		BookManager.prototype.checkDownloads = function(){
			// Check for pending downloads
			console.log("Checking dfor downlaods");
			if(!navigator.onLine || !s){
				if(!s){
					$(servererror).modal('show');
				} else {
					$(networkerror).modal('show');
				}				
			} else{
				d.getDownloadData(function(res){
					if(res == "foo"){
						console.log("No pending downloads");					
					} else {
						var downloadUrlDB = jsonParse(res);
						for(var i=0;i<downloadUrlDB.length;i++){
							var downObj = {};
							downObj.url = downloadUrlDB[i].url;
							downObj.commonPath = downloadUrlDB[i].commonPath;
							downObj.targetPath = downloadUrlDB[i].targetPath;
							downObj.unzipPath = downloadUrlDB[i].unzipPath;
							downObj.MD5 = downloadUrlDB[i].MD5;
							downObj.fileType = downloadUrlDB[i].fileType;
							downObj.idBook = downloadUrlDB[i].idBook;
							titleArr.push(downObj.fileType);
							idArr.push(downObj.idBook);
							if(downObj.idBook != 0) {
								$('#book' + downObj.idBook).css({
									opacity:0.5
								});
							}					
							downloadUrl.push(downObj);									
						}					
						$('#preloader').show();
						$('#preloadertext').html('Downloading ' + titleArr[0]);
						
						EventBus.addEventListener(EVENT.FILESAVED, function(e){
							$('#book' + idArr[0]).css({
								opacity:1.0
							});							
						});	
						addToDownloadArr(downloadUrl);	
						if(!test){
							downloadData(downloadUrl[0].url, downloadUrl[0].commonPath, downloadUrl[0].targetPath, downloadUrl[0].unzipPath, downloadUrl[0].MD5, downloadUrl[0].fileType);
						}				
						
					}
				});				
			}
			if(!navigator.onLine || !s){
				if(!s){
					$(servererror).modal('show');
				} else {
					$(networkerror).modal('show');
				}
			} else {
				// Check for Libraries
				s.Libraries(function(res){
					var data = jsonParse(res);
					var path = createPath();
					var version;
					var commonPath = path + appStoragePath.userPath + '/Documents/';
					for(var i=0; i<data.length;i++){
						version = data[i].Library;
						var MD5 = data[i].MD5PC;
						var target = commonPath + 'Library/';
						var targetPath = target + version;
						
						var unzipPath = target;
						var unzipPathExist = fs.existsSync(unzipPath);
						
						if(!unzipPathExist){
							mkdirp(unzipPath, function(err){
								if(err){
									console.log(err);
								} else {
									console.log("Library Creation Successful!.")								
								}
							});
						}
						var downObj = {};
						// Add Lib data to DownLoad Object
						downObj.url = data[i].UrlPC;
						downObj.commonPath = commonPath;
						downObj.targetPath = targetPath;					
						downObj.unzipPath = unzipPath;
						downObj.MD5 = MD5;
						downObj.fileType = "Library " + version;
						downObj.idBook = 0;
						idArr.push(downObj.idBook);
						// Get version path and check if it exists
						var versionPath = targetPath;
						
						var versionPathExist = fs.existsSync(versionPath);
						
						if(versionPathExist){
							console.log("Found Existing Library")
							continue;						
						} else{
							$("#preloader").show();
							titleArr.push(downObj.fileType);
							$('#preloadertext').html('Downloading ' + titleArr[0]);
							downloadUrl.push(downObj);
							addToDownloadArr(downloadUrl);
							if(!test){
								downloadData(downloadUrl[0].url, downloadUrl[0].commonPath, downloadUrl[0].targetPath, downloadUrl[0].unzipPath, downloadUrl[0].MD5, downloadUrl[0].fileType);
							}					
						}			
					}			
				});
			}		
		};


		function addToDownloadArr(downloadUrl) {
			var downString = JSON.stringify(downloadUrl);
			var escapeString = "'" + downString + "'";
			// Add string download object to database
			d.addToDownloadList(escapeString);			
		};

		function downloadData(url, commonPath, targetPath, unzipPath, MD5Hash, fileType) {
			if(token){
				console.log("Existing token found. Cannot download")				
			} else {
				token = 1;				
				var AdmZip = require('adm-zip');
				var destination = targetPath+".zip";

				if(!navigator.onLine || !s){
					if(!s){
						$(servererror).modal('show');
					} else {
						$(networkerror).modal('show');
					}
				} else {					
					s.Download(url, destination, function(status,calMD5){
						if(status=="success"){
							$('#preloadertext').show();
							$('#preloadertext').html(titleArr[0] + ' download successful');
							console.log(MD5Hash, "md5 from server");
							if(calMD5 == MD5Hash){
								console.log("Md5 matched. Unzipping file")
								var zip = new AdmZip(destination);
								zip.extractAllTo(unzipPath, true);
								$('#preloadertext').html('Extracting ' + titleArr[0]);
								fs.unlink(destination);
								$('#preloadertext').html(titleArr[0] + ' extraction successful');

								if(fileType.indexOf('Book') != -1){
									console.log("Should not see this while downloadloading library")
									manageBooks(unzipPath, commonPath);
								} else {
									token = 0;
									delFromDownloadArr(downloadUrl);
								}
							} else {
								console.log("MD5 match failed.")
								token=0;
								downloadCount++;
								if(downloadCount >= settings.downloadLimit){
									$('#preloadertext').html('');
									$('#preloadertext').hide();	
									$('#exception').modal('show');
									downloadCount = 0;
									delFromDownloadArr(downloadUrl);
								} else {
									console.log("Downloading again.")
									if(!test){
										downloadData(url, commonPath, targetPath, unzipPath, MD5Hash, fileType);
									}								
								}							
							}							
						}else{
							alert("Error in download, Please try again later");						
						}						
					});
				}	
			}			
		};
		
		function manageBooks(unzipPath, commonPath){			
			$('#preloadertext').html('Extracting ' + titleArr[0] + ' content');
			var unzipSrc = unzipPath+'bak';

			var source = unzipSrc + '/Contents/';
			fs.renameSync(unzipPath, unzipSrc);
			ncp.limit = 16;
			ncp(source, commonPath, function (err) {
				if (err) {
					console.log(err);
				}
				var syncSrc = unzipSrc+'/Sync/';
				var syncPath = commonPath+'Sync/';
				var syncPathExist = fs.existsSync(syncPath);
				if(!syncPathExist){
					mkdirp(syncPath, function(err){
						if(err){
							console.log(err);
						} else {
							copyData(syncSrc,syncPath,unzipSrc,commonPath);
						}
					});
				} else {
					copyData(syncSrc,syncPath,unzipSrc,commonPath);
				}								
			});			
		};

		function copyData(syncSrc,syncPath,unzipSrc,commonPath){
			var unzipSrcExists = fs.existsSync(unzipSrc);
			
			ncp(syncSrc,syncPath,function(err){				
				if(err){
					console.log(err);
				}
				rimraf(unzipSrc, function(err){
					if(err != null){
						console.log('found err in copy data rimraf')
						console.log(err);
					} else {
						console.log("unlinking ds_store");
						fs.unlink(commonPath+'.DS_Store');
						fs.unlink(syncPath+'.DS_Store');				
					}
				});				
			});	
			token=0;
			delFromDownloadArr(downloadUrl);
		};

		function removeBackup(unzipSrc, commonPath){
			console.log("Inside remove backup");		
		};

		function delFromDownloadArr(downloadUrl){
			console.log("deleting item from download array")
			EventBus.dispatch(EVENT.FILESAVED);
			downloadUrl.splice(0,1);
			idArr.splice(0,1);
			titleArr.splice(0,1);			
						
			if(downloadUrl.length == 0){
				console.log("Updating DB")
				$('#preloader').hide();
				var string = "'" + "foo" + "'";
				d.addToDownloadList(string);			
			} else {
				$('.bar').css({
					width:'0%'
				});
				$('#preloadertext').html('Downloading ' + titleArr[0])
				var downString = JSON.stringify(downloadUrl);
				var escapeString = "'" + downString + "'";
				d.addToDownloadList(escapeString);
				if(!test){
					downloadData(downloadUrl[0].url, downloadUrl[0].commonPath, downloadUrl[0].targetPath, downloadUrl[0].unzipPath, downloadUrl[0].MD5, downloadUrl[0].fileType);
				}				
			}		
		};

		BookManager.prototype.create = function() {
			var _this = this;
			var b = new Array();
			initDB(function(res){
				console.log("found result from initDB ", res);
				if(res.length){
					$('.nobooks').hide();
					for(var i=0;i<res.length;i++) {
						b[i] = new BookFactory();	
						b[i].createBook(res[i], pallete[res[i].Color]);			
					}
					//$('.del').hide();
					$('.book').click(function(e){
						console.log("book clicked ", e.target, e.currentTarget);
						switch($(e.target).attr('class')){
							case "settinglink":
								$("#booksettingpopup").modal("show");
								_this.loadBookSettings();
							break;	
							case "del":
								_this.setId(e);
							break;
							default:
								var targetId = e.currentTarget.id.slice(-1);
								var targetName = $('#pTop' + targetId).text();							
								bCont.init(targetName);
								_this.checkClick(e);
								$('#preloader').hide();
							break;
						}
					});	
				} else {
					$('.container').append('<div class="nobooks"> There Are No Books To Display. Click on "Get More Books" to Download Books</div>');
					$('.nobooks').show();
				}

				if(!navigator.onLine || !s){
					var path = createPath();
					var targetPath;
					var target;
					var imagePath
					for(var i=0;i<res.length;i++) {
						targetPath = path + appStoragePath.userPath + '/Documents/Contents/Covers/' + res[i].Book;
						target = targetPath.split('\\').join('/');
						imagePath = target + '/' + res[i].Book +"_cover.png";
						_this.updateLocalCover(res[i].idBook, 'local', imagePath);
					}					
				}				
			});			
		};

		BookManager.prototype.deleteBookInfo =  function(){
			var baseId = Base64.encode(bookId);
			s.Unsubscription(baseId, function(res){
				d.deleteBookInfo(bookId);
				$('#book' + bookId).remove();				
			});
			$('#newsubscribe' + bookId ).show();
			$('#newunsubscribe' + bookId ).hide();
			$('#book' + bookId).remove();
			var length = $('#books').children().length;
			if(length == 0){
				$('.nobooks').show();
			}
			deleteBookContent(bookId);				
		};

		function deleteBookContent(id){
			var path = createPath();
			console.log("deleting book content")
			d.getNameFromId(id,function(res,data){
				console.log("result is ", res);
				console.log("data is ", data);
				if(res){
					var bookPath = path + appStoragePath.userPath + '/Documents/Contents/' + data;
					var syncPath = path + appStoragePath.userPath + '/Documents/Contents/Sync/' + data;
					console.log('bookpath is ', bookPath )
					console.log('syncpath is', syncPath)
					rimraf(bookPath, function(err){
						if(err){
							console.log(err);
						} 
					});
					rimraf(syncPath, function(err){
						if(err){
							console.log(err);
						} 
					});
				}
			});
		};

		BookManager.prototype.searchBook = function(e, thisObj){
			var querry = e.target.value;
			var query = Base64.encode(querry);
			var path = createPath();
			var commonPath;			
			var imageUrl;
			console.log("query is ", query)
			var sb = new Array();
			if(!navigator.onLine || !s){
				if(!s){
					$(servererror).modal('show');
				} else {
					$(networkerror).modal('show');
				}
			} else {
				s.Search(query, function(res){
					console.log("Result is ", res)
					if(query == ''){
						$('#bookstore').show();
						$('#searchstore').hide();
						$('#searchbooklist').html("");
						$('.newbooklist').show();
					} else{
						$('#searchstore').html("");
						$('#searchstore').show();
						$('#bookstore').hide();
						$('#searchstore').html('Search results for "' + querry + '" ...');
						$('.newbooklist').hide();
						var data = thisObj.parseLocalJsonData("search", res);
						$('#searchbooklist').html("");	
						var b = [];
						for(var i=0;i<data.length;i++) {
							d.checkIfBookExist(data[i].idBook, i, function(res, id){
								var alreadyExist = false;
								if(res!=0){
									alreadyExist = true;
								} 						
								b[id] = new BookFactory();
								b[id].drawBook("searchbooklist", "search", data[id], pallete[data[id].Color], alreadyExist);
								
								// Create Image path and get Image.
								commonPath = path + appStoragePath.userPath + '/Documents/Contents/';
								imageUrl = commonPath + 'Covers/' + data[id].Book + '/' + data[id].Book +"_cover.png";;
								_this.updateCover(data[id].idBook, "search", imageUrl)
								
								if(id == (data.length -1)) {
									EventBus.dispatch(EVENT.CHECKEDSUBSCRIPTION);
								}
														
							});

						}
						EventBus.addEventListener(EVENT.CHECKEDSUBSCRIPTION, function(e){
							$('.subscribe').click(function(e){
								var tid = e.target.id;
								var searchId = tid.slice(0,2);
								if(searchId == 'se'){
									_this.subscribeBook(e);
								}							
							});
							$('.unsubscribe').click(function(e){
								var tid = e.target.id;
								var searchId = tid.slice(0,2);
								if(searchId == 'se'){
									_this.unsubscribeBook(e);
								}


							});

						});	
					}					
				});
			}
		};		
			
		// Parse color array and store each color in pallete array. 
		function createPallete(){
			for(var i=0;i< color.length;i++){
				pallete[i] = new Array();
				colorCombo[i] = color[i].split(",");	
				for(var j=0;j<3;j++){
					pallete[i][j] = colorCombo[i][j];					
				}
			}
		};

		BookManager.prototype.createNewBookView = function(){
			var query = '';
			var path = createPath();	
			if(!navigator.onLine || !s){
				if(!s){
					$(servererror).modal('show');
				} else {
					$(networkerror).modal('show');
				}
			} else {
				s.Search(query, function(res){
					var data = _this.parseJsonData("new", res);
					var b = [];
					for(var i=0;i<data.length;i++) {
						d.checkIfBookExist(data[i].idBook, i, function(res, id){
							var alreadyExist = false;
							if(res!=0){
								alreadyExist = true;
							} 						
							b[id] = new BookFactory();
							b[id].drawBook("newbooklist", "new", data[id], pallete[data[id].Color], alreadyExist);

							if(id == (data.length -1)) {
								EventBus.dispatch(EVENT.CHECKEDSUBSCRIPTION);
							}
							var targetPath = path + appStoragePath.userPath + '/Documents/Contents/Covers/' + data[id].Book;
							var target = targetPath.split('\\').join('/');
							var imagePath = target + '/' + data[id].Book+"_cover.png";
							var pathExist = fs.existsSync(imagePath);
							/*console.log(pathExist, "------------------------- pathExist -----------------")*/
							if(pathExist){
								console.log("path exists attaching cover", data[id].Book)
								_this.updateCover(data[id].idBook, "local", data[id].ImageUrl);
							}													
						});
					}
					EventBus.addEventListener(EVENT.CHECKEDSUBSCRIPTION, function(e){
						$('.subscribe').click(function(e){
							var tid = e.target.id;
							var searchId = tid.slice(0,2);
							if(searchId == 'ne'){
								_this.subscribeBook(e);
							}							
						});
						$('.unsubscribe').click(function(e){
							var tid = e.target.id;
							var searchId = tid.slice(0,2);
							if(searchId == 'ne'){
								_this.unsubscribeBook(e);
							}
						});
					});				
				});
			}
		};
		
		
		BookManager.prototype.getBooks = function(){
			console.log("checking for ebooks")
			if(!navigator.onLine || !s){
				if(!s){
					$(servererror).modal('show');
				} else {
					$(networkerror).modal('show');
				}
			} else {
				s.Books(function(result){
					var resData = _this.parseLocalJsonData("local",result);
					console.log("book list coming from server ", resData)
					var b = new Array();
					var book = new BookFactory();
					for(var i=0;i<resData.length;i++) {
						//tempArr[i] = resData[i];
						d.checkIfBookExist(resData[i].idBook, i, function(res, id){
							var alreadyExist = false;
							if(res!=0){
								alreadyExist = true;
							} else { 
								var baseId = Base64.encode(resData[id].idBook);
								var device = '';
								var path = createPath();
								var commonPath = path + appStoragePath.userPath + '/Documents/Contents/';
								var url = settings.urlPath+'books/'+ baseId + '/' + device;	
								var targetPath = commonPath + resData[id].Book;					
								var unzipPath = targetPath;
								var bookPathExist = fs.existsSync(unzipPath);
								var downObj = {};
								downObj.url = url;
								downObj.commonPath = commonPath;
								downObj.targetPath = targetPath;					
								downObj.unzipPath = unzipPath;
								downObj.MD5 = resData[id].MD5;
								downObj.fileType = "Book " + resData[id].Book; 
								downObj.idBook = resData[id].idBook
								downloadUrl.push(downObj);
								$('.nobooks').hide();
								titleArr.push(downObj.fileType)

								// Add to Download List		
								addToDownloadArr(downloadUrl);
								// Create Book Just before Downloading and make it dimmed
								var b = new BookFactory();
								idArr.push(resData[id].idBook)
								//Insert Book in databases
								d.addBooks(resData[id].ImageUrl, resData[id].idBook, resData[id].ShortCode, resData[id].Book, resData[id].NumPages, resData[id].Color, localStorage.seluserid);
								// Hide no book message
								$('.nobooks').hide();

								b.createBook(resData[id], pallete[resData[id].Color]);

								$('#book' + resData[id].idBook).click(function(e){
									if(e.target.id.slice(0,3) != 'del'){
										var targetId = e.target.id.slice(-1);
										var targetName = $('#pTop' + targetId).text();							
										bCont.init(targetName);
										_this.checkClick(e);
									}						
								});		
								
								$('.del').click(function(e){
									_this.setId(e);					
								});

								$('#book' + resData[id].idBook).css({
									opacity:0.5
								});
								$('#preloader').show();
								$('#preloadertext').html('Downloading ' + titleArr[0]);
								if(!test){
									downloadData(downloadUrl[0].url, downloadUrl[0].commonPath, downloadUrl[0].targetPath, downloadUrl[0].unzipPath, downloadUrl[0].MD5, downloadUrl[0].fileType, downloadUrl[0].idBook);
								}
									
								EventBus.addEventListener(EVENT.FILESAVED, function(e){
									console.log("recieved event inside getbooks")
									console.log('idArr is ', idArr);
									if(idArr[0] != 0){
										$('#book' + idArr[0]).css({
											opacity:1.0
										});
									}
																	
								});							
							}					
							
						});
					}							
				});
			}		
		};
		BookManager.prototype.getCover = function(name, id, img,unit, thisObj){
			console.log("id img unit ", id, img, unit)
			var img64 = Base64.encode(img);
			var path = createPath();
			var targetPath = path + appStoragePath.userPath + '/Documents/Contents/Covers/' + unit;
			var pathExist = fs.existsSync(targetPath);
			var target = targetPath.split('\\').join('/');
			var imagePath = target + '/' + unit+"_cover.png";
			var imgObj = {};
			imgObj.img64 = img64;
			imgObj.imagePath = imagePath;
			imgObj.name = name;
			imgObj.id = id;
			coverImageArr.push(imgObj);
			console.log(coverImageArr)
			//_this.downloadCover(coverImageArr[0].img64, coverImageArr[0].imagePath, coverImageArr[0].name, coverImageArr[0].id);
			if(!pathExist){
				mkdirp(targetPath, function (err){
					if(err){
						console.log(err)
					} else{
						console.log("downloading cover for ", imagePath)												
					}
				});
			}
			return imagePath;
		};

		BookManager.prototype.downloadCover = function(img64, imagePath, name, id){
			if(imgToken){				
				return;
			}
			console.log("downloading cover for Image Path", imagePath)
			if(!navigator.onLine || !s){
				if(!s){
					$(servererror).modal('show');
				} else {
					$(networkerror).modal('show');
				}
			} else {
				s.getBookCover(img64,imagePath, function(res){
					if(res){
						_this.updateCover(id, name, imagePath);
						imgToken=1;
						coverImageArr.splice(0,1);
						if(coverImageArr.length > 0){
							console.log("cover image length is greater than zero. Resetting token and Downloading other.")
							imgToken=0;
							_this.downloadCover(coverImageArr[0].img64, coverImageArr[0].imagePath, coverImageArr[0].name, coverImageArr[0].id);
						}					
					}							
				});
			}
		};
		
		BookManager.prototype.updateCover  = function(id, name, imagePath){
			$('#uImglocal' + id +", "+'#uImgnew' + id+", "+'#uImgsearch' + id).attr('src',imagePath).load(function(){
				$(this).removeClass('preloaderImg');
				$(this).addClass('imgUp');
			});

			/*name = "new";
			$( + name + id).attr('src',imagePath).load(function(){
				//$('#uImg' + name + id).attr('src',imagePath);								
				$(this).removeClass('preloaderImg');
				$(this).addClass('imgUp');
			});*/
		};

		/*BookManager.prototype.updateLocalCover = function(id, name, imagePath){
			console.log("Updating local cover for ", id, name, imagePath)
			$('#uImg' + name + id).attr('src',imagePath);								
			$('#uImg' + name + id).removeClass('preloaderImg');
			$('#uImg' + name +id).addClass('imgUp');
		};
*/
		BookManager.prototype.parseJsonData = function(name, data) {
			var res = $.parseJSON(data);
			var bookdata = new Array();
			for(var i=0; i<res.length;i++){
				bookdata[i] = {};
				bookdata[i].idBook = res[i].idBook;
				bookdata[i].ShortCode = res[i].ShortCode;
				bookdata[i].Book = res[i].Book;
				bookdata[i].Version = res[i].Version;
				bookdata[i].Url = res[i].Url;
				bookdata[i].Color = res[i].Color;
				bookdata[i].NumPages = res[i].NumPages;
				//Incorrect Spelling Coming from server. May be changed
				bookdata[i].Visibality = res[i].Visibality;
				bookdata[i].MD5 = res[i].MD5;
				
				// Store data in bookObj if displaying Server Library for Future Reference
				var bookObj = {};
				bookObj.idBook = res[i].idBook;
				bookObj.ShortCode = res[i].ShortCode;
				bookObj.Book = res[i].Book;
				bookObj.Version = res[i].Version;
				bookObj.Book = res[i].Book;
				bookObj.Url = res[i].Url;
				bookObj.Color = res[i].Color;
				bookObj.NumPages = res[i].NumPages;
				bookObj.Visibality = res[i].Visibality;
				bookObj.MD5 = res[i].MD5;
				
				// Get Image If Image URL is not empty 
				if(res[i].ImageUrl){
					console.log("getting image url for ", res[i].ImageUrl)
					bookdata[i].ImageUrl = this.getCover(name, bookdata[i].idBook, res[i].ImageUrl,res[i].Book, this);

					//bookdata[i].ImageUrl
					bookObj.ImageUrl = bookdata[i].ImageUrl;	
				} else {
					bookdata[i].ImageUrl = 0;
					bookObj.ImageUrl = 0;										
				}
					
				bookArr.push(bookObj);				
			}
			var imagePathExist = fs.existsSync(coverImageArr[0].imagePath);
			if(!imagePathExist){
				_this.downloadCover(coverImageArr[0].img64, coverImageArr[0].imagePath, coverImageArr[0].name, coverImageArr[0].id);
			}
			
			return bookdata;
		};

		BookManager.prototype.parseLocalJsonData = function(name, data) {
			var res = $.parseJSON(data);
			var bookdata = new Array();
			for(var i=0; i<res.length;i++){
				bookdata[i] = {};
				bookdata[i].idBook = res[i].idBook;
				bookdata[i].ShortCode = res[i].ShortCode;
				bookdata[i].Book = res[i].Book;
				bookdata[i].Version = res[i].Version;
				bookdata[i].Url = res[i].Url;
				bookdata[i].Color = res[i].Color;
				bookdata[i].NumPages = res[i].NumPages;
				//Incorrect Spelling Coming from server. May be changed
				bookdata[i].Visibality = res[i].Visibality;
				bookdata[i].MD5 = res[i].MD5;
				
				var path = createPath();
				var targetPath = path + appStoragePath.userPath + '/Documents/Contents/Covers/' + res[i].Book;
				var target = targetPath.split('\\').join('/');
				var imagePath = target + '/' + res[i].Book +"_cover.png";			
				bookdata[i].ImageUrl = imagePath;				
			}
			return bookdata;
		};

		BookManager.prototype.unsubscribeBook = function(e){
			var idEvent = e.target.id;
			var id = idEvent.slice(-1);
			var baseId = Base64.encode(id);

			$('#newsubscribe' +id ).show();
			$('#searchsubscribe' +id ).show();
			$('#newunsubscribe' +id ).hide();
			$('#searchunsubscribe' +id ).hide();
			
			if(!navigator.onLine || !s){
				if(!s){
					$(servererror).modal('show');
				} else {
					$(networkerror).modal('show');
				}
			} else {
				s.Unsubscription(baseId, function(res){
					console.log(res);
					deleteBookContent(id);			
					d.deleteBookInfo(id);
					$('#book' + id).remove();
					
				});
			}
		};

		BookManager.prototype.subscribeBook = function(e){
			var idEvent = e.target.id;
			var id = idEvent.slice(-1);
			$('#newsubscribe' +id ).hide();
			$('#searchsubscribe' +id ).hide();
			$('#newunsubscribe' +id ).show();
			$('#searchunsubscribe' +id ).show();
			var baseId = Base64.encode(id);
			var device = '';
			var path = createPath();			
			var commonPath = path + appStoragePath.userPath + '/Documents/Contents/';
			var url = settings.urlPath+'books/'+ baseId + '/' + device;	
			for(var i=0;i<bookArr.length;i++) {
				if(bookArr[i].idBook == id){
					var targetPath = commonPath + bookArr[i].Book;					
					var unzipPath = targetPath;
					var bookTitle = bookArr[i].Book
					var imageUrl = commonPath + 'Covers/' + bookTitle
					var drawObj = bookArr[i];
					var MD5 = bookArr[i].MD5;	
					bookName = 	bookArr[i].Book;	
				}
			}
			
			console.log(id, baseId)
			if(!navigator.onLine || !s){
				console.log("network connection is ", navigator.onLine)
				if(!s){
					$(servererror).modal('show');
				} else {
					$(networkerror).modal('show');
				}
			} else {
				s.Subscription(id, function(result){
					console.log(result);
						
					d.checkIfBookExist(id, i, function(res, id){
						if(res){
							console.log("Book Already downloaded")						
						} else {
							var downObj = {};							
							// Add Lib data to DownLoad Object
							downObj.url = url;
							downObj.commonPath = commonPath;
							downObj.targetPath = targetPath;					
							downObj.unzipPath = unzipPath;
							downObj.MD5 = MD5;
							downObj.fileType = "Book " +  bookName;
							downObj.idBook = drawObj.idBook;
							
							// Add object to downloadURL
							downloadUrl.push(downObj);

							titleArr.push(downObj.fileType)

							// Add to Download List		
							addToDownloadArr(downloadUrl);
							// Create Book Just before Downloading and make it dimmed
							var b = new BookFactory();
							idArr.push(drawObj.idBook)
							//Insert Book in databases
							d.addBooks(drawObj.ImageUrl, drawObj.idBook, drawObj.ShortCode, drawObj.Book, drawObj.NumPages, drawObj.Color, localStorage.seluserid);
							// Hide no book message
							$('.nobooks').hide();
							b.createBook(drawObj, pallete[drawObj.Color]);
							
							console.log("Image url on subscription",drawObj.ImageUrl)
							//_this.updateLocalCover(drawObj.idBook, "local", drawObj.ImageUrl)

							//$('.del').hide();
							$('.book').click(function(e){
								if(e.target.id.slice(0,3) != 'del'){
									var targetId = e.target.id.slice(-1);
									var targetName = $('#pTop' + targetId).text();							
									bCont.init(targetName);
									_this.checkClick(e);
								}							
							});	
							$('.del').click(function(e){
								_this.setId(e);					
							});

							$('#book' + drawObj.idBook).css({
								opacity:0.5
							});
							$('#preloadertext').html('Downloading ' + titleArr[0]);
							if(!test){
								downloadData(downloadUrl[0].url, downloadUrl[0].commonPath, downloadUrl[0].targetPath, downloadUrl[0].unzipPath, downloadUrl[0].MD5, downloadUrl[0].fileType, downloadUrl[0].idBook);
							}
							
							EventBus.addEventListener(EVENT.FILESAVED, function(e){
								console.log("recieved change opacity event inside subsription")
								if(idArr[0] != 0){
									$('#book' + idArr[0]).css({
										opacity:1.0
									});
								}
															
							});	
						}					
					})				
					
				});
			}
		};

		BookManager.prototype.checkClick = function(e){
			var elemId = e.target.id;
			var id = elemId.slice(-1);
			if(id != ''){
				d.incClick(id);
			}						
		};

		BookManager.prototype.setId = function(e){
			var elemId = e.target.id;
			bookId = elemId.slice(-1);			
		};

		BookManager.prototype.initBookSettings = function(){
			/*
			var d = new DB();
			var result = d.getBookSettingData();
			BookManager.loadBookSettings(result);
			*/
		};

		BookManager.prototype.saveBookSettings = function(teacher, course){
			/*
			var d = new DB();
			if(teacher != 0 && course != 0){
				var result = d.storeBookSettings(teacher, course,bookId);
			}
			*/		
		};

		BookManager.prototype.loadBookSettings = function(){
			console.log('loading teacher list ')
			var str='';
			for(var i=0;i<teacherArr.length;i++) {
				str += '<tr><td>' + teacherArr[i] + '</td>' + '<td>' + '' + '</td></tr>';			
			}
			$('#booktable').html(str);
		};

		BookManager.prototype.destroyView = function() {
			$("#bookview").hide();
			$("#books").html('');
			$('.newview').hide();
			$("#newbookdiv").hide();
			$("#newbooklist").html("");

			$('#showDel').unbind("click");
			$('.link').unbind("click");

			$('#search').unbind("keyup");
			$('.link').unbind("click");
			$('#bookviewclose').unbind("click");
			$('#btndel').unbind("click");

			$('.del').unbind("click");
			$('#addbook').unbind("click");
			$('#method').unbind("click");
			$('#backtolib').unbind("click");
			$('#backtohome').unbind("click");
			$('#searchcontent').unbind("click");

			$('#search').unbind("keyup");
			$('#btnclose').unbind("click");
		};

		function initDB(cb) {			
			console.log("Calling DB")
			d.getData(function(data){
				console.log("getting data", data)
				cb(data);				
			});
		};	

		//_this.init();
	}
