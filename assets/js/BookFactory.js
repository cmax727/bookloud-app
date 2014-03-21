function BookFactory(){
	this.idBook;
	this.shortCode;
	this.unit;
	this.bookVersion;
	this.url;
	this.color;
	this.imageUrl;
	this.numPages;
	this.visible;
	this.md5;
	this.lastDivHeight = 2 * settings.divHeight;
	this.lastDivWidth = settings.divWidth/2;	
}

BookFactory.prototype.createBook = function(arrData, pel){
	var data = arrData;
	var pallete = pel;	
	var i = data.idBook;
	var inc = 0;
	var count ;
	if(data.clickcount == undefined){
		 count = 0;
	} else {
		if(count >= 2){
			inc = 20;
		}
		if(count >= 4){
			inc = 50;
		}
	}
	
	
	// Append LI to UL
	$("#books").append('<li class="book" id="book'+ i +'">' + '</li>');	

	$('#book' + i).css({
		width:settings.listWidth + inc, 
		height:settings.listHeight, 
		listStyleType: 'none', 
		float:'left'
	});

	// create delete button for each book maybe removed
	$('#book' + i).append('<a class="del" id="dele' + i + '" data-toggle="modal" data-target="#delpopup">Delete </a>');
	$('.del').hide();

	
	// Add P tag to LI
	$('#book' + i).append('<p class="topP" id="pTop' + i + '" />');
	$('#pTop' + i).css({
		width:settings.listWidth + inc
	});

	// Add cover Image
	if(data.ImageUrl != '0' && data.ImageUrl != ''){
		$('#book' + i).append('<img class = "preloaderImg" src="assets/image/preloader.gif" id="uImglocal' + i + '"/>');		
		//EventBus.dispatch(EVENT.SHOWEDPRELOADER)	
	} else {
		console.log("Image URL not found")
	}

	 
	if(data.Book !=''){
		$('#pTop'+i).html(data.Book);				
	} else{
		$('#pTop'+i).html('A Book With No Cover');				
	}	
	
	//Append TOP Div to LI
	$('#book' + i).append('<div class="uDiv" id=divu' + i + '>' + '</div>');
	$('#divu'+ i).css({
		width:settings.topDivWidth + inc,
		height:settings.topDivHeight,
		backgroundColor:'#'+ pallete[0]			
	});

		

	
	$("#book" + i).append('<div class=num id=num' +i + '> </div>');	
	// Show Number of Pages
	if(data.NumPages != ''){
		$('#num'+i).html(data.NumPages + " Pages");
	}
	//Append Bottom Div to LI
	$('#book' + i).append('<div class=bDiv id=divb' + i + '>' + '</div>');
	$('#divb'+ i).css({
		width:settings.bottomDivWidth + inc, 
		height:settings.bottomDivHeight, 
		backgroundColor:'#'+pallete[1]				
	});	

	// Append P tag to Bottom Div
	$('#book' + i).append('<p class="botP" id="pBot' + i + '" />');
	if(data.Book !=''){
		$('#pBot'+i).html(data.Book);				
	} else{
		$('#pBot'+i).html('A Book With No Cover');				
	}
	$('#book' + i).append('<p class="link" id="link' + i + '"><a class="settinglink">Book Settings</a></p>');
	$('#link'+ i).css({
		marginLeft:50 + inc + "px",				
	});
	
	// Append Right Div to LI
	$('#book' + i).append('<div class=rDiv id=divr' + i + '>' + '</div>');
	$('#divr'+ i).css({
		width:settings.rightDivWidth, 
		height:settings.rightDivHeight, 
		backgroundColor:'#'+pallete[2], 				
		marginLeft:130 + inc + 'px'				
	});	
}

BookFactory.prototype.drawBook = function(parent, name, data, pallete, alreadySubscribe){
	var i = data.idBook;
	
	$('#' + parent).append('<li class="newbook" id=' + name + 'book'+ i +'>' + '</li>');
	$('#' + name + 'book' + i).css({
		width:settings.listWidth, 
		height:settings.listHeight,
		float:'left'
	});


	// Add Cover Image to P
	//var path = data.ImageUrl.nativePath;
	//path = path.split('\\').join('/');


	// Add P tag to LI
	$('#' + name + 'book' + i).append('<p class="topP" id=' + name + 'pTop' + i + ' />');
	$('#' + name + 'pTop' + i).css({
		width:settings.listWidth,		
	});


	if(data.Book !=''){ 
		$('#' + name + 'pTop'+i).html(data.Book);	
	} else{
		$('#' + name + 'pTop'+i).html('A Book Without Title');				
	}
 
	$('#' + name + 'book' + i).append('<div class="uDiv" id=' + name + 'divu' + i + '>' + '</div>');
	$('#' + name + 'divu'+ i).css({
		width:settings.topDivWidth,
		height:settings.topDivHeight,
		backgroundColor:'#'+pallete[0],		
	});
	
	if(data.ImageUrl){
		$('#' + name + 'book' + i).append('<img class ="preloaderImg" src="assets/image/preloader.gif" id="uImg' + name + i + '"/>');		
		//EventBus.dispatch(EVENT.SHOWEDPRELOADER)		
	}

	
	$('#' + name + 'book' + i).append('<div class=num id=' + name +  'num' + i + '> </div>');
	// Show Number of Pages
	if(data.NumPages != ''){
		$('#' + name + 'num'+i).html(data.NumPages + " Pages");
	}
	//Append Bottom Div to LI
	$('#' + name + 'book' + i).append('<div class=bDiv id=' + name + 'divb' + i + '>' + '</div>');
	$('#' + name + 'divb'+ i).css({
		width:settings.bottomDivWidth, 
		height:settings.bottomDivHeight, 
		backgroundColor:'#'+pallete[1]				
	});	


	
	// Append P tag to Bottom Div
	$('#' + name + 'book' + i).append('<p class="botP" id=' + name + 'pBottom' + i + ' />');
	if(data.Book !=''){
		$('#' + name + 'pBottom'+i).html(data.Book);				
	} else{
		$('#' + name + 'pBottom'+i).html('A Book With No Cover');				
	}
	$('#' +  name + 'book' + i).append('<p class="subscribe" id="' + name + 'subscribe' + i + '">Subscribe</p>');
	$('#' +  name + 'book' + i).append('<p class="unsubscribe" id="' + name + 'unsubscribe' + i + '">Unsubscribe</p>');
	if(!alreadySubscribe){
		$('#' + name + 'subscribe' + i).show();
		$('#' + name + 'unsubscribe' + i).hide();
	}else{
		$('#' + name + 'subscribe' + i).hide();
		$('#' + name + 'unsubscribe' + i).show();
	}
	
	
	// Append Right Div to LI
	$('#' + name + 'book' + i).append('<div class=rDiv id=' + name + 'divr' + i + '>' + '</div>');
	$('#' + name + 'divr'+ i).css({
		width:settings.rightDivWidth, 
		height:settings.rightDivHeight, 
		backgroundColor:'#'+pallete[2], 				
		marginLeft:130 + 'px'				
	});	
}
