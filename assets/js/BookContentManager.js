function BookContentManager() {
	var count = 0;
	var typeFlag = 0;
	var _this = this;
	var parentCount;
	var strDom = '';
	var fs = require('fs');
	var mkdirp = require('mkdirp');
	var rimraf = require('rimraf');
	var ncp = require('ncp').ncp;
	var contentArr = [];
	var path = createPath();
	var firstElemFlag = 0;
	var dbName;
	var contentCopyArr = [];
	var currentIframeHeight=0;
	var currentPage = 1;
	var totalPages = 0;
	var counter = 0;

	var currentIframeToAdjust;

	BookContentManager.prototype.init = function(name){
		$('#bookcontentview').show();
		$('#userbook').show();
		$('#navigation').hide();
		$('#bookview').hide();
		$('#methoddraw').html('');	
		$('#methoddraw').hide();		
		$('#title').hide();
		$('#btn').hide();	
		$('#userbook').html('');
		$('#userbook').css('marginLeft','5%');
		var screenHeight = $("body").height() - ($("#footer").height()/2);
		$('#userbook').css('height',screenHeight+"px");
		// $('#userbook').css('overflow','auto');
		$('#navlist').html('');		
		$("#pagination").show();
		$("#footerlist").hide();
		counter = 0;

		// Setting global variable bookName;
		bookSettings.bookName = name;
		count = 0;
		currentIframeHeight=0;
		typeFlag = 0;
		strDom = '';
		dbName = name + '/contents.db';
		lastScrollTop=0;
		scrollAns = 0;
		//Extract sync contents and add it to userid folder
		manageSync();
		var dbLink = new SQLitePlugin();
		console.log(dbLink)
		dbLink.openDatabase(dbName);
		_this.getContent(dbLink,name);		

		$(window).bind('hashchange', function(e) { 
			navigateToContent();
		});

	};

	//Extract sync contents and add it to userid folder	
	function manageSync(){
		var path = createPath();
		var contentSrc = path + appStoragePath.userPath + '/Documents/Contents/Sync/' + bookSettings.bookName + '/' ; 
		var userIdFolder = path + appStoragePath.userPath + '/Documents/Contents/Sync/temp/'  + userSettings.userId + '/'; 
		var oldName = path + appStoragePath.userPath + '/Documents/Contents/Sync/temp/';
		var newName = path + appStoragePath.userPath + '/Documents/Contents/Sync/' + bookSettings.bookName + '/';
		var userSyncFolder = path + appStoragePath.userPath + '/Documents/Contents/Sync/' + bookSettings.bookName + '/' + userSettings.userId + '/';
		var userSyncFolderExists = fs.existsSync(userSyncFolder);
		if(!userSyncFolderExists){
			mkdirp(userIdFolder, function(err){
				if(err){
					console.log(err)
				} else {
					ncp(contentSrc, userIdFolder, function(err){
						if(err){
							console.log(err)
						} else {
							console.log("files copied successfully")	
							rimraf(contentSrc, function(err){
								if(err){
									console.log(err);
								} else {
									fs.renameSync(oldName, newName)
								}		
							});											
						}
					});
				} 			
			});	
		}		
	};

	BookContentManager.prototype.getContent = function(dbLink,name){
		contentCopyArr = [];
		$('#methoddraw').append('<iframe class="drawframe" id="drawframe"></iframe>');		
		
		// Load index page
		var indexPage = path + appStoragePath.userPath + '/Documents/Contents/' + name + '/' + 'index.html';
		$('#userbook').append('<iframe class="contentcontainer" id="indexcontainer" style="visibility:hidden;height:0px;display:none;" scrolling="no" frameborder="0"></iframe>');
		$('#indexcontainer').attr('src', indexPage);
		$('#indexcontainer').load(function() {
			this.style.visibility = 'hidden';
			//this.style.height =	this.contentWindow.document.body.offsetHeight + 'px';
		});

		//var methPath = path + appStoragePath.userPath + '/Documents/Library/version1/whiteboard/index.html';
		var methPath = path + appStoragePath.userPath + '/Documents/Library/version1/mathoddraw.html';
		$('#drawframe').attr('src', methPath)		
	 	var dbc = new ContentDBManager();
	 	dbc.getBookData(dbLink,function(res){			
			for(var i=0;i<res.length;i++){
				var targetPage = path + appStoragePath.userPath + '/Documents/Contents/' + name + '/' + res[i].PID + '.html';
				var targetPageExist = fs.existsSync(targetPage);
				if(targetPageExist){
					var contentObj = {};
					contentObj.targetPage = targetPage;
					contentObj.title = res[i].Title;
					contentObj.subTitle = res[i].SubTitle;
					contentObj.chapId = res[i].ChapID;
					contentObj.type = res[i].Type;
					contentObj.pid = res[i].PID;
					contentObj.color = res[i].ColorHex;
					contentObj.pageNum = res[i].PageNum;
					// push content data in array
					contentArr.push(contentObj);
					contentCopyArr.push(contentObj);
			
				} else {
					console.log("Content page not found")
				}			
			}
			loadContent(contentArr[0]);
			createNavLinks(contentCopyArr);
		});
	};

	function navigateToContent(){
		var contentpid = window.location.hash.toString().split("#contentcontainer").join("");
		for(var num=0; num<contentArr.length; num++){
			if(contentpid == contentArr[num].pid)
			{
				removeAllPrevious();
				counter = num;
				$("#currentPage").html(counter+1);
				showNextPage(counter);
				break;
			}
		}
	}
	function loadContent(contentData){
		var scroll = 0;
		appendFrame(contentData, counter);

		$("#backbtn").bind("click", function(e){			
			counter--;
			if(counter>0){
				showPreviousPage(counter);
			}else{
				counter = 1;
			}
		});

		$("#nextbtn").bind("click", function(e){
			counter++;
			if(counter<contentArr.length){
				showNextPage(counter);
				$("#currentPage").html(counter);
			}else{
				counter = contentArr.length;
				$("#userbook").scrollTop($("#userbook").height());
				$("#currentPage").html(counter);
			}
		});
		$("#totalPages").html(contentArr.length);
		$("#currentPage").html(counter+1);
	};

	function showNextPage(pageNumber){
		//$("#userbook").scrollTop( $("#userbook").scrollTop()+$("#userbook").height());
		appendFrame(contentArr[pageNumber], pageNumber);
		if(pageNumber-2>=0){
			removeFrame(pageNumber-2);
		}
	};

	function showPreviousPage(pageNumber){
		$("#currentPage").html(pageNumber);
		if((pageNumber+1)==contentArr.length){
			$("#userbook").scrollTop(0);
		}
		prependFrame(contentArr[pageNumber-1], pageNumber-1);
		if(pageNumber+2<=contentArr.length){
			removeFrame(pageNumber+2);
		}
	};	

	function removeAllPrevious(){
		$(".frameContainer").remove();
	}
	function removeFrame(pageNumber){
		$('div[name=page'+pageNumber+']').remove();
	};

	function appendFrame(contentData, pageNumber) {
		$('#userbook').append('<div class="frameContainer" name="page'+pageNumber+'"><iframe class="contentcontainer" id="contentcontainer' + contentData.pid + '" style="visibility:hidden" width="100%" scrolling="no" frameborder="0"></iframe></div>');
			$('#contentcontainer' + contentData.pid).attr('src',"file:///"+contentData.targetPage);												
			$('#contentcontainer' + contentData.pid).load(function(){
				this.style.visibility = 'visible';
				this.style.height =	this.contentWindow.document.body.offsetHeight + 'px';
				currentIframeHeight = parseFloat(currentIframeHeight) + parseFloat(this.style.height.split('px').join(''));
				if(pageNumber==0){
					counter++;
					appendFrame(contentArr[pageNumber+1], pageNumber+1);
					$("#currentPage").html(counter);
				}
				//addObserver('contentcontainer' + contentData.pid);
			});
	};	

	function prependFrame(contentData, pageNumber) {
		$('#userbook').prepend('<div class="frameContainer" name="page'+pageNumber+'"><iframe class="contentcontainer" id="contentcontainer' + contentData.pid + '" style="visibility:hidden" width="100%" scrolling="no" frameborder="0"></iframe></div>');
			$('#contentcontainer' + contentData.pid).attr('src',contentData.targetPage);												
			$('#contentcontainer' + contentData.pid).load(function(){
				this.style.visibility = 'visible';
				this.style.height =	this.contentWindow.document.body.offsetHeight + 'px';
				currentIframeHeight = parseFloat(currentIframeHeight) + parseFloat(this.style.height.split('px').join(''));
				//addObserver('contentcontainer' + contentData.pid);
			});
	};	

	function addObserver(elemId){
		$myiFrame = $('#' + elemId);		
		var myIframe = $myiFrame[0];
		//currentIframeToAdjust = myIframe;

			var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
			 var target = myIframe.contentDocument.querySelector(".tools");
			 console.log(target)

			  var observer = new MutationObserver(function(mutations) {
			   	 setIframeHeight();
			  });
			 
			  var config = {
			    attributes: true,
			    childList: true,
			    characterData: true,
			    subtree: true
			  };
			  observer.observe(target, config);
	}

	function setIframeHeight(){
		 /*currentIframeToAdjust.height('auto');*/
		  /*var newHeight = $('html', currentIframeToAdjust.contentDocument).height();*/
		  
		  /*currentIframeToAdjust.height(newHeight);*/
/*
		  currentIframeToAdjust.style.height = currentIframeToAdjust.contentWindow.document.body.offsetHeight+"px";
		  console.log(currentIframeToAdjust.contentWindow.document.body.offsetHeight+"--"+currentIframeToAdjust.id);*/
	}
	
	BookContentManager.prototype.resetData = function(){
		contentArr=[];
		contentCopyArr =[];
		bookSettings.pageContent=[];
		$("#backbtn").unbind("click");		
		$("#nextbtn").unbind("click");
		$('#navlist').html('');
		$(window).unbind('hashchange');
	};

	// create table of contents links
	function createNavLinks(contentData){
		strDom = "";
		for(var i=0; i< contentData.length; i++){
			console.log("copy content array object",contentData[i].title);
			if(contentData[i].type > 1){
				if(!typeFlag){
					parentCount = count-1;
					strDom += '<ul><li class="iframelink" id="iframelink' + count + '" style="background-color:' + contentData[i].color + '"><a href="' + '#contentcontainer' + contentData[i].pid + '">' + contentData[i].subTitle + '</a></li>';
					typeFlag=1;
				} else {
					strDom += '<li class="iframelink" id="iframelink' + count  + '" style="background-color:' + contentData[i].color + '"><a href="' + '#contentcontainer' + contentData[i].pid + '">' + contentData[i].subTitle + '</a></li>';
				}
			} else{
				if(typeFlag == 1){
					strDom += '</ul><li class="iframelink" id="iframelink' + count + '" style="background-color:' + contentData[i].color + '"><a href="' + '#contentcontainer' + contentData[i].pid + '">' + contentData[i].title + '</a>';
					typeFlag=0;
				} else {
					if(!firstElemFlag){
						strDom += '<li class="iframelink" id="iframelink' + count + '" style="background-color:' + contentData[i].color + '"><a href="' + '#contentcontainer' + contentData[i].pid + '">' + contentData[i].title + '</a></li>';
						firstElemFlag = 1;
					} else {
						strDom += '</li><li class="iframelink" id="iframelink' + count + '" style="background-color:' + contentData[i].color + '"><a href="' + '#contentcontainer' + contentData[i].pid + '">' + contentData[i].title + '</a>';				
					}					
				}					
			}			
		}
		$('#navlist').append(strDom);
	};
}



