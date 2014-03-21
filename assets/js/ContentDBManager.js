function ContentDBManager() {
	ContentDBManager.prototype.getBookData = function(dbc,cb) {
		var query = "SELECT * from Pages";
		dbc.transaction(query, function(res){
			cb(res);
		})		
	};
}