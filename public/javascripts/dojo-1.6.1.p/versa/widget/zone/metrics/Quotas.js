/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.widget.zone.metrics.Quotas"]){dojo._hasResource["versa.widget.zone.metrics.Quotas"]=true;dojo.provide("versa.widget.zone.metrics.Quotas");dojo.require("bfree.widget.Label");dojo.require("bfree.widget.PropertyTable");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("versa.widget.zone.metrics.DiskQuota");dojo.require("versa.widget.zone.metrics.UserQuota");dojo.declare("versa.widget.zone.metrics.Quotas",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("versa/widget/zone/metrics","template/Quotas.html","<div style=\"height:100%;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        dojoAttachPoint=\"mainContainer\"\n        design=\"headline\"\n        gutters=\"true\"\n        style=\"height:100%;width:100%;\">\n\n    <div    dojoType=\"dijit.layout.BorderContainer\"\n            design=\"headline\"\n            gutters=\"false\"\n            region=\"center\"\n            class=\"highlightPane\"\n            style=\"height:100%;width:100%;\">\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"top\"\n                style=\"overflow:hidden;padding:8px 8px 0 8px;position:relative\">\n\n            <div class=\"dijitBoldLabel dijitLargeLabel dijitDarkLabel\" style=\"\">Quotas</div>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.BorderContainer\"\n                design=\"sidebar\"\n                gutters=\"false\"\n                splitter=\"false\"\n                region=\"center\"\n                style=\"width:100%;height:100%\">\n\n            <div    dojoType=\"dijit.layout.ContentPane\"\n                    splitter=\"false\"\n                    region=\"center\"\n                    style=\"overflow:hidden;padding:0;position:relative\">\n\n                <div dojoAttachPoint=\"userQuotaNode\"></div>\n\n            </div>\n\n            <div    dojoType=\"dijit.layout.ContentPane\"\n                    splitter=\"false\"\n                    region=\"right\"\n                    style=\"overflow:hidden;padding:0;position:relative;width:272px\">\n\n                <div dojoAttachPoint=\"diskQuotaNode\"></div>\n\n            </div>\n\n         </div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_wdgDiskQuota:null,_wdgUserQuota:null,diskQuota:null,diskUsed:null,userCount:null,userQuota:null,constructor:function(_1){},destroy:function(){this.inherited("destroy",arguments);},postCreate:function(){this.inherited("postCreate",arguments);this._wdgUserQuota=new versa.widget.zone.metrics.UserQuota({userCount:this.userCount,userQuota:this.userQuota},this.userQuotaNode);this._wdgDiskQuota=new versa.widget.zone.metrics.DiskQuota({diskUsed:this.diskUsed,diskQuota:this.diskQuota},this.diskQuotaNode);},resize:function(){this.inherited("resize",arguments);this.mainContainer.resize();},startup:function(){this.inherited("startup",arguments);this._wdgUserQuota.startup();}});}