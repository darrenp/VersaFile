/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.Bfree"]){dojo._hasResource["bfree.widget.Bfree"]=true;dojo.provide("bfree.widget.Bfree");dojo.declare("bfree.widget.Bfree",null,{});bfree.widget.Bfree.ObjectTypes={"NONE":0,"ZONE":1,"USER":2,"GROUP":3,"PROP_DEF":8,"DOC_TYPE":9,"CHOICE_LIST":10,"VIEW_DEF":11,"DOCUMENT":12,"VERSION":13,"QUOTA":240};bfree.widget.Bfree.Commands={"NONE":0,"USRGRPEDIT":1,"EDIT_PERMISSIONS":2,"PRINT":3,"NEW":4,"SAVE":5,"EDIT":6,"REFRESH":7,"UNDO":8,"DELETE":9,"RESTORE":10,"MOVEUP":11,"MOVEDOWN":12,"EXPORT":13,"ADD":14,"REMOVE":15,"MOVE_UP":16,"MOVE_DOWN":17,"VIEW":18,"COPY":19,"MOVE":20,"CHECKOUT":21,"CHECKIN":22,"CANCEL_CKO":23,"SECURE":24,"EMPTY":25,"VERSIONS":26,"ADMIN":255,"EDIT_USER":1025,"ADMIN_USERS":61441,"ADMIN_GROUPS":61442,"ADMIN_PROP_DEFS":61443,"ADMIN_DOC_TYPES":61444,"ADMIN_CHOICE_LISTS":61445,"HELP":255,"LOGOFF":65535};dojo.has=function(_1,_2){return dojo.indexOf(_1,_2)>=0;};}