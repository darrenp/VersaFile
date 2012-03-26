/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Account"]){dojo._hasResource["bfree.api.Account"]=true;dojo.provide("bfree.api.Account");dojo.require("bfree.api._Object");dojo.declare("bfree.api.Account",[bfree.api._Object],{constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));},isValid:function(){var _2=true;if(String.isBlank(this.name)){_2=false;}if(String.isBlank(this.email)){_2=false;}return _2;}});bfree.api.Account.AccountTypes={"FREE_TRIAL":0,"ACTIVE":1};bfree.api.Account.BillingTypes={"MONTHLY":0,"YEARLY":1};bfree.api.Account.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":""},"status":{type:"integer","default":""},"first_name":{type:"string","default":""},"last_name":{type:"string","default":""},"address":{type:"string","default":""},"province":{type:"string","default":""},"postal_code":{type:"string","default":""},"country":{type:"string","default":""},"phone":{type:"string","default":""},"billing_type":{type:"integer","default":""},"customer_code":{type:"string","default":""},"account_type":{type:"integer","default":""},"trial_period":{type:"integer","default":0},"email":{type:"string","default":""},"password":{type:"string","default":""},"created_at":{type:"date",format:"date-time"},"updated_at":{type:"date",format:"date-time"}},prototype:new bfree.api.Account()};}