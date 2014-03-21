function App(){
  var ngui;
  var _this = this;
  var debug;
  var currentView;
  var footer;
  var dbObject;
  App.prototype.initApp = function() {
      _this.debug = false;
      _this.currentView = null;
      _this.ngui = require('nw.gui');
      _this.makeLayout();
      var intError = new UnhandledError();
      intError.getUnhandledError();

      _this.footer= new Footer();
      _this.footer.initFooter();

      EventBus.addEventListener(EVENT.DBSETUP, function(e){
         _this.gotoView(null, "loginview");
      });
      dbObject = DBManager.getInstance();
  };

  App.prototype.makeLayout = function() {
      var nwin = this.ngui.Window.get(); // Get the current window
      nwin.maximize();
      nwin.show();
      if(_this.debug){
        nwin.showDevTools();  
      }
      
      $('title').text("Physics First " + settings.version);  
      $('#preloader').hide();
      $('#bookview').hide();  
      $("#showDel").hide();
      EventBus.addEventListener(EVENT.CHANGEVIEW, this.gotoView, this);
      
      //
  };

  
  App.prototype.gotoView = function(event, strViewId, objData) {
      if(_this.currentView!=null){
        _this.currentView.destroyView();
      }

      switch(strViewId){
        case "loginview":
        case "account":
          _this.currentView = new LoginManager(_this.debug);
          $("#showDel").hide();
        break;
        case "bookview":
        case "library":
          _this.currentView = new BookManager();
          _this.currentView.init();
          _this.footer.showActive("library");
          $("#showDel").show();
        break;
        case "serverview":
        break;
        case "searchview":
        break;
        case "bookcontentview":
        break;
        case "reviewsview":
        case "review":
          $("#showDel").hide();
        break;
        case "drawingview":
        break;
        default:
        break;
      }
      //Session["currentView"] = strViewId;
       //
  };

};

/**Starting up app*/
$(document).ready(function(){
    var app = new App();
    app.initApp();
});

/** catching unhandled errors globally*/
function UnhandledError(){
    UnhandledError.prototype.getUnhandledError = function() {
      process.on('uncaughtException', function (err) {
        console.log('Caught exception: ' + err);
        return;
      });
    };  
  };

/** Prelaoder options */
var spinneropts = {
  lines: 11, // The number of lines to draw
  length: 3, // The length of each line
  width: 2, // The line thickness
  radius: 5, // The radius of the inner circle
  corners: 0.9, // Corner roundness (0..1)
  rotate: 11, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#fff', // #rgb or #rrggbb or array of colors
  speed: 1.4, // Rounds per second
  trail: 85, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};