//=========================================================
// Cae_InventoryOpenAt.js
//=========================================================

/*:
 * @plugindesc v1.2 - Open the item menu to a specific category/item via plugin command.
 * @author Caethyril
 *
 * @help Plugin Commands:
 *   OpenInventoryAt
 *     - opens the item scene
 *   OpenInventoryAt categoryId
 *     - opens the item scene to the specified category
 *   OpenInventoryAt categoryId itemId
 *     - opens the item scene to the specified category & item ID
 *
 *   Examples:
 *     OpenInventoryAt 1    - opens inventory & selects first category
 *     OpenInventoryAt 2 6  - opens inventory & selects item ID 6 in category 2
 *
 * Compatibility:
 *   If using Yanfly's Item Core, load this plugin after Yanfly's.
 *   Aliases:
 *     Scene_Item: create
 *
 * Terms of use:
 *   Free to use and modify.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Update log:
 *   1.2: Yanfly's Item Core: now selects the first matching independent item.
 *   1.1: No longer causes follow-up "normal" inventory access to auto-select. 
 *        Rewrote the code a bit and added "Default Category" plugin parameter.
 *   1.0: Initial release!
 *
 * @param Default Category
 * @text Default Category
 * @type number
 * @min 0
 * @desc Category highlighted when opening the inventory normally.
 * Default: 0 (no change)
 * @default 0
 */

var Imported = Imported || {};				// Import namespace
Imported.Cae_InventoryOpenAt = 1.2;			// Import declaration

var CAE = CAE || {};					// Author namespace
CAE.InventoryOpenAt = CAE.InventoryOpenAt || {};	// Plugin namespace

(function(_) {

'use strict';

	const PLUGIN_NAME = 'Cae_InventoryOpenAt';
	const ERR_PRE     = PLUGIN_NAME + '.js ';
	const ERR_NOPARAM = ERR_PRE + 'could not find its parameters!\nCheck you have named the plugin correctly and try again.';

	const PCOM = 'OpenInventoryAt'.toUpperCase();

	_.params = PluginManager.parameters(PLUGIN_NAME);
	if (_.params === undefined) throw new Error(ERR_NOPARAM);

	_.catDef = parseInt(_.params['Default Category'], 10) || 0;

	_.catId  = 0;		// Category ID to select
	_.itemId = 0;		// Item ID to select
	_.catBase = 1;		// Category IDs start at 1

// ============== Utility ============== //

	// Currently on inventory scene?
	_.isSceneItem = function() { return SceneManager._scene instanceof Scene_Item; };

	// Item match? Use different metric for Yanfly's indepenedent items
	_.checkItem = function(id, item) {
		if (Imported.YEP_ItemCore && item.baseItemId) {
			return item.baseItemId === id;
		}
		return item.id === id;
	};

	// Select category and item IDs as appropriate
	_.select = function() {
		if (!_.isSceneItem()) return;
		let wCat = SceneManager._scene._categoryWindow;
		let wInv = wCat._itemWindow;
		let iCat = _.catDef;
		let iInv = 0;
		if (_.catId > 0) {
			iCat = _.catId;
			wCat.select(iCat - _.catBase);
			wInv.setCategory(wCat.currentSymbol());
			if (_.itemId > 0) {
				wInv._data.some(function(item, index) {
					if (_.checkItem(_.itemId, item)) {
						iInv = index;
						return true;
					}
					return false;
				});
			}
			wCat.deactivate();
			wInv.activate();
			wInv.select(iInv);
		} else if (iCat > 0) {
			wCat.select(iCat - _.catBase);
		}
	};

	// Reset plugin vars
	_.reset = function() { _.catId = 0; _.itemId = 0; };

	// Open inventory scene and/or select specified category/item
	_.open = function(categoryId, itemId) {
		_.catId  = parseInt(categoryId, 10);
		_.itemId = parseInt(itemId, 10);
		if (_.isSceneItem()) {
			_.select();
		} else {
			SceneManager.push(Scene_Item);
		}
	};

// ============ Alterations ============ //

	// Create, then apply selection as appropriate
	_.Scene_Item_create = Scene_Item.prototype.create;
	Scene_Item.prototype.create = function() {
		_.Scene_Item_create.call(this);
		_.select();
		_.reset();
	};

	// Plugin commmand!
	_.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_.Game_Interpreter_pluginCommand.call(this, command, args);
		if (command.toUpperCase() === PCOM) _.open(args[0], args[1]);
	};

})(CAE.InventoryOpenAt);