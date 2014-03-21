function Footer(){
	var _this = this;
	Footer.prototype.initFooter = function(){

		 $("#footer").click(function(e){
		 	if(e.target.id != "showDel" && e.target.id != "footer" && e.target.id !="footerlist" 
		 		&& e.target.id!="pagination" && e.target.id!="nextbtn" && e.target.id!="backbtn"){
		 		_this.showActive(e.target.id);
        		_this.changeView(e.target.id);
		 	}
        });
	};	

	Footer.prototype.showActive = function(strCuurentId) {
		$("#footerlist li").removeClass("current");
		$("#"+strCuurentId).parent().addClass("current");
	};

	Footer.prototype.changeView = function(strViewID) {
		EventBus.dispatch(EVENT.CHANGEVIEW, this, strViewID);
	};
};