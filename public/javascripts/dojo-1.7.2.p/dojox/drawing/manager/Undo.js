//>>built
define(["dijit","dojo","dojox"],function(_1,_2,_3){_2.provide("dojox.drawing.manager.Undo");_3.drawing.manager.Undo=_3.drawing.util.oo.declare(function(_4){this.keys=_4.keys;this.undostack=[];this.redostack=[];_2.connect(this.keys,"onKeyDown",this,"onKeyDown");},{onKeyDown:function(_5){if(!_5.cmmd){return;}if(_5.keyCode==90&&!_5.shift){this.undo();}else{if((_5.keyCode==90&&_5.shift)||_5.keyCode==89){this.redo();}}},add:function(_6){_6.args=_2.mixin({},_6.args);this.undostack.push(_6);},apply:function(_7,_8,_9){_2.hitch(_7,_8)(_9);},undo:function(){var o=this.undostack.pop();if(!o){return;}o.before();this.redostack.push(o);},redo:function(){var o=this.redostack.pop();if(!o){return;}if(o.after){o.after();}else{o.before();}this.undostack.push(o);}});});