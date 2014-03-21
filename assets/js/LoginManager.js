function LoginManager($debug){
	var _this = this;
	var debug = $debug;
	var spinner;
    var booldbSetuped = false;
    var dbObj;
    var flag =false;
	LoginManager.prototype.showView = function() {
		_this.spinner = new Spinner(spinneropts).spin();
		$('#loginView').fadeIn(200);

		/*if(localStorage.username != undefined){
			$('#log').val(localStorage.username);
		}*/
        dbObj = DBManager.getInstance();

        $('#login').click(function(e){
	    	_this.doLogin();
	    });
	};

	LoginManager.prototype.doLogin = function(){
		var username = $('#log').val();
	    var password = $('#pass').val();
	    var server = $("#server").val();
		if(debug){
			username = "post2seth@gmail.com";
			password = "yourp@ss";            
		}
		/*if(localStorage.username != undefined){
            _this.checkUserData(username,password);
        }else{*/
            _this.showNoNetwork(function(res){
                if(res){
                    _this.checkLogin(username, password);
                    $("#login #loginpreloader").append(_this.spinner.el);
                    $('#login').prop('disabled', true);
                }
            });
        /*}*/
	};

	LoginManager.prototype.showNoNetwork = function(cb) {
		$("#login").html('Signing in &nbsp;&nbsp;<span class="glyphicon" id="loginpreloader" style="vertical-align:middle;"></span>');
      	$("#login #loginpreloader").append(_this.spinner.el);

      	$('#login').prop('disabled', true);
	    Tools.checkInternet(function(res){
	        if(!res){
	        	$('#networkerror').modal('show');
	          	$("#login").html('No Internet Connection&nbsp;&nbsp;<span class="glyphicon" id="loginpreloader" style="vertical-align:middle;"></span>');
	          	if(cb!=null){
	          		cb(false);
	          	}
	        }else{
	          $('#login').prop('disabled', false);
	          $("#login").html('Signing in &nbsp;&nbsp;<span class="glyphicon" id="loginpreloader" style="vertical-align:middle;"></span>');
	          if(cb!=null){
	          	cb(true);
	          }
	        }
	    });
  	};

  	LoginManager.prototype.checkLogin = function(username, password){
        var s = new server();
        s.Login(username, password, function(response,result){
            if(response){
                userSettings.key = result.Key;
                userSettings.token = result.Token;
                userSettings.userType = result.UserType;
                userSettings.userId = result.idUser;
                
                localStorage.id = userSettings.userId;
                localStorage.seluserid = userSettings.userType;
                localStorage.username = username;
                localStorage.key = result.Key;
                localStorage.token = result.Token;

                _this.addUser(username, password,s);

            } else{
                _this.showLoginError();
            }
        });
    };

    LoginManager.prototype.addUser = function(name,pass,s){
        _this.checkUserExist(name,pass,function(res,email,password){
            if(res){
                if(pass !== password){
                    dbObj.updateUser(name,pass);
                }                    
            } else {
                dbObj.addUser(name,pass);
            }
            if(!flag) {
                flag=1;
               _this.loginSuccess(dbObj, s);
            }
        });
    }

    LoginManager.prototype.checkUserExist = function(name,pass,cb){
        dbObj.checkUser(name,pass,function(res,email,password){
            if(res){
                cb(true,email,password);
            } else {
                cb(false);
            }
        });
    };

    LoginManager.prototype.checkUserData = function(name,pass){        
        dbObj.checkUserLogin(name,pass,function(res,row){
            if(res){          
                console.log('row returned for check user login ', row)
                localStorage.seluserid = userSettings.userId = row.userId;
                userSettings.userType = row.userType;
                localStorage.key = row.key
                if(!flag){
                    flag=1;
                    _this.loginSuccess(dbObj, false);
                }
            } else {
                _this.showLoginError();
            }
        });
    };

    LoginManager.prototype.loginSuccess = function($dbObject, $serverObject) {
        EventBus.dispatch(EVENT.CHANGEVIEW, this, "bookview");
    };
    LoginManager.prototype.showLoginError = function() {
        $("#login-error").fadeIn(300);
        setInterval(function(){
            $("#login-error").fadeOut(300);
        }, 2000);
    };
    LoginManager.prototype.destroyView = function() {
		$('#loginView').hide();
		$('#login').prop('disabled', false);
	    $("#login").html('Sign in &nbsp;&nbsp;<span class="glyphicon" id="loginpreloader" style="vertical-align:middle;"></span>');
	};
	_this.showView();
}