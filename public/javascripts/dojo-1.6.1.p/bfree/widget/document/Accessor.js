/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.document.Accessor"]){dojo._hasResource["bfree.widget.document.Accessor"]=true;dojo.provide("bfree.widget.document.Accessor");dojo.declare("bfree.widget.document.Accessor",null,{library:null,zone:null,constructor:function(_1){this.library=_1.library;this.zone=_1.zone;},doCancelCheckout:function(_2){try{_2.cancelCheckout({zone:this.zone,library:this.library});}finally{this.library.getDocuments().refreshItem(_2.getId());}},doCheckout:function(_3){try{_3.checkout({zone:this.zone,library:this.library});}finally{this.library.getDocuments().refreshItem(_3.getId());}},doCopyLocal:function(_4){_4.copyLocal({zone:this.zone,library:this.library});},doRestore:function(_5,_6){try{_5.restore({zone:this.zone,library:this.library});this.library.getDocuments().store.onDelete(_5);}finally{this.library.getDocuments().refreshItem(_5.getId());}},doView:function(_7){var _8=bfree.api.Utilities.getBox({scale:0.75});_7.view({zone:this.zone,library:this.library,windowBox:_8});}});}