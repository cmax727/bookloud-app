function SQLitePlugin(){
	var _this = this;
	var conn;
	var fs = require('fs');
	sqlite3 = require('sqlite3').verbose();

	SQLitePlugin.prototype.openDatabase = function(name,cb,errCb){		
		var path = createPath()
		var dbTarget = path + appStoragePath.userPath + '/Documents/Contents/' + name;
		var dbTargetExists = fs.existsSync(dbTarget);
		if(!dbTargetExists){
			errCb('target not found');
		} else {
			conn = new sqlite3.Database(dbTarget);			
			return conn;
		}		
	};


	SQLitePlugin.prototype.transaction = function(query,cb,errCb){
		try{
			conn.all(query, function(err, row) {
				if(!err){
					cb(row);
				}else{
					console.log('error in transaction ', errCb)
					errCb(err);
				}
			});
		}catch(e){
			errCb(e);
		}

	};
	SQLitePlugin.prototype.executeSql = function(query,success,errCb){		
		try{
			conn.run(query);

		}catch(e){
			errCb(e)
		}
	};

	SQLitePlugin.prototype.readQuery = function(method,options,success,error){
		switch(method){
			case 'open':
				handleOpen(options,function(res){
					success(res);
				},function(err){
					error(err);
				});
				break;
			case 'backgroundExecuteSqlBatch':
				handleSqlQuery(options,function(res){
					success(res);
				}, function(err){
					error(err);
				});
				break;
			case 'backgroundExecuteSql':
				handleSqlTransQuery(options,function(res){
					success(res);
				}, function(err){
					error(err);
				});
				break;
		}	
	}

	function handleOpen(options,success,error){
		_this.openDatabase(options.name,function(res){
			success(res);
		},function(err){
			error(err);
		});
	};

	function handleSqlQuery(options,success,error){	
		_this.executeSql(options.executes[1].query[0],function(res){			
			success(res);
		},function(err){
			error(err);
		});	
	};

	function handleSqlTransQuery(options,success,error){
		_this.transaction(options.query[0],function(res){	
			success(res);
		},function(err){
			error(err);
		});
	};
}