/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.ChoiceValues"]){dojo._hasResource["bfree.api.ChoiceValues"]=true;dojo.provide("bfree.api.ChoiceValues");dojo.require("bfree.api.ChoiceValue");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Error");dojo.declare("bfree.api.ChoiceValues",[bfree.api._Collection],{choiceList:null,library:null,zone:null,constructor:function(_1){this.zone=_1.zone;this.library=_1.library;this.choiceList=_1.choiceList;if(this.choiceList){this.target=dojo.replace(bfree.api.ChoiceValues.TRGT,[this.zone.subdomain,this.library.id,this.choiceList.id]);}else{this.target=dojo.replace(bfree.api.ChoiceValues.TRGT_NO_LIST,[this.zone.subdomain,this.library.id]);}this.schema=bfree.api.ChoiceValue.schema;this.cache=true;this._initialize();}});bfree.api.ChoiceValues.TRGT="/zones/{0}/libraries/{1}/choice_lists/{2}/choice_values";bfree.api.ChoiceValues.TRGT_NO_LIST="/zones/{0}/libraries/{1}/choice_values";}