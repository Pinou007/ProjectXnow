//=============================================================================
 /*:
 * @plugindesc Add a window for the game time in the menu
 * @author Avsoft Studio
 *
 * @help
 * ==========================================================================
 * ============================How to use it ?===============================
 * ==========================================================================
 * Just put this plugin into your game project and that's all !
 * The window will appear automatically after that.
 * If you use the altMenuScreen plugin, please use the alternative version of
 * this plugin.
 * 
 * No parameters are available for this plugin.
 * 
 * Warning : 
 * -> Try to put this plugin at the end of the list of all your plugin
 * in order to avoid conflict between them.
 * -> Those plugins function only if you use the classic display of the menu
 * screen or the alternative version given in your game project.
 * 
 * ==========================================================================
 * =================================Changelog================================
 * ==========================================================================
 * Version 1.00 :
 *  - Finished plug-in
 */

function Window_Timer() {
   this.initialize.apply(this, arguments);
}
Window_Timer.prototype = Object.create(Window_Base.prototype);
Window_Timer.prototype.constructor = Window_Timer;

Window_Timer.prototype.initialize = function(x, y) {
   var width = this.windowWidth();
   var height = this.windowHeight();
   Window_Base.prototype.initialize.call(this, x, y, width, height);
   this.refresh();
};

Window_Timer.prototype.windowWidth = function() {
   return 240;
};

Window_Timer.prototype.windowHeight = function() {
   return this.fittingHeight(1);
};

Window_Timer.prototype.refresh = function() {
   var x = this.textPadding();
   var width = this.contents.width - this.textPadding() * 2;
   this.contents.clear();
   this.drawText(this.value(), x, 0, width);
};

Window_Timer.prototype.value = function() {
   return $gameSystem.playtimeText();
};

Window_Timer.prototype.open = function() {
   this.refresh();
   Window_Base.prototype.open.call(this);
};

var _Scene_Menu_new = Scene_Menu.prototype.create;
Scene_Menu.prototype.create = function() {
   _Scene_Menu_new.call(this);
   this._statusWindow.x = this._commandWindow.width;
   this._statusWindow.y = 0;
   this.createTimeWindow();
   this._goldWindow.x = 0;
   this._goldWindow.width = this._commandWindow.width;
	this._goldWindow.y = Graphics.boxHeight - this._goldWindow.height;
};

Scene_Menu.prototype.update = function() {
   Scene_Base.prototype.update.call(this);
   this._timeWindow.refresh();
}

Scene_Menu.prototype.createTimeWindow = function() {
   this._timeWindow = new Window_Timer(0, 0);
   this._timeWindow.width = this._commandWindow.width;
   this._timeWindow.x = 0;
   this._timeWindow.y = Graphics.boxHeight - (this._timeWindow.height*2);
   this.addWindow(this._timeWindow);
};

