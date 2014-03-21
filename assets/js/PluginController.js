function PluginController(){
	var fs = require('fs');	
	
	PluginController.prototype.showBrowser = function(message,successCB,failCB){
		console.log("message is ", message)
		var param = message.split(',');
		var path = param[0];
		var showClose = param[1];
		//var pathExists = fs.existsSync(path);
		//if(!pathExists){
			// failCB("Path not found.");
	//	} else {
			$('#showbrowser').modal('show');
			var tempPath = path.slice(5);
			var localPath = createPath();
			var commonPath = localPath + appStoragePath.userPath + '/Documents';
			var targetPath = commonPath + tempPath;
			var finalPath = targetPath.split('\\').join('/');
			window.parent.console.log("path for show browser ", finalPath);
			$('#showbrowseriframe').attr('src',finalPath);
			$('#showbrowseriframe').load(function(){				
				successCB(true);
			}).error(function(err){
				if(err){					
					failCB(err);
					$('#showbrowserclose').hide();
				}
			});
			if(!showClose){
				$('#showbrowserclose').hide();
			}
			
	//	}		
	};	

	PluginController.prototype.closeBrowser = function(message, successCB,failCB){
		$('showbrowseriframe').src = '';
		$('showbrowser').modal('hide');
		// body...
	};
	PluginController.prototype.reloadBrowser = function(message, successCB,failCB){	
		var param = message.split('#');
		var pageId = param[0];
		//window.scrollTo(0, $("#contentcontainer"+pageId).offset().top);
		//$('#contentcontainer').pageId()
		var srcPath = $('#contentcontainer'+pageId).attr('src');
		var srcPathExists = fs.existsSync(srcPath);
		if(!srcPathExists){
			failCB("Path not found");
		}else {
			$('#contentcontainer'+pageId).attr('src','');
			$('#contentcontainer'+pageId).attr('src',srcPath);
			$('#contentcontainer'+pageId).load(function(){
				$('html,body').animate({scrollTop: $('#contentcontainer'+pageId).offset().top});
				if(successCB != undefined && successCB != ''){
					successCB('success');
				}
				
			}).error(function(err){
				if(err){
					if(failCB != undefined && failCB != ''){
						failCB(err);
					}
					
				}
			});			
		}		
	};
	PluginController.prototype.submitActivity = function(message, successCB, failCB){	
		var param = message.split(',');
		// body...
	};
	PluginController.prototype.getDirection = function(message, successCB, failCB){	
		// body...
		successCB(scrollStatus)
	};
	PluginController.prototype.getSelectedUserID = function(message, successCB, failCB){
		// Should be possibly changed from null to or/and userid 
		//successCB(userSettings.userId);
		if(userSettings.userType==0){
			successCB(userSettings.userId)			
		} else {
			successCB(null)			
		}
		// body...
	};
	PluginController.prototype.getSelectedActivity = function(message, successCB, failCB){
	
		// body...
	};
	PluginController.prototype.getSelectedPageID = function(message, successCB, failCB){	
		for(var i=0; i<pageContent.length;i++){
			var iframeObj = $('#contentcontainer'+pageContent[i].pid);
			var minTop = iframeObj.offset().top;		
			var height = iframeObj.css('height').split('px').join('');			
			var maxTop = parseInt(minTop) + parseInt(height);
			if(st > minTop && st <= maxTop ){
				var elemId = iframeObj.attr('id');
				var id = elemId.slice(16);
				successCB(id);
			}			
		}
		// body...
	};
	PluginController.prototype.getKey = function(message, successCB, failCB){	
		successCB(userSettings.token)		
		// body...
	};
	PluginController.prototype.getStudentKey = function(message, successCB, failCB){	
		// body...
	};
}
