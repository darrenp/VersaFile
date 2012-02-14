/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.widget.zone.metrics.DocTypes"]){dojo._hasResource["versa.widget.zone.metrics.DocTypes"]=true;dojo.provide("versa.widget.zone.metrics.DocTypes");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.charting.Chart");dojo.require("dojox.charting.axis2d.Default");dojo.require("dojox.charting.plot2d.Pie");dojo.require("dojox.charting.action2d.Highlight");dojo.require("dojox.charting.action2d.MoveSlice");dojo.require("dojox.charting.themes.PlotKit.cyan");dojo.require("dojox.charting.widget.Legend");dojo.require("dojox.fx.easing");dojo.require("versa.widget.zone.metrics.themes.VersaColors");dojo.require("versa.widget.zone.metrics.themes.VersaGaugeOK");dojo.declare("versa.widget.zone.metrics.DocTypes",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("versa/widget/zone/metrics","template/DocTypes.html","<div style=\"height:120px;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"padding:4px 8px 4px 8px;height:100%;width:100%;\">\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"center\"\n                splitter=\"true\"\n                style=\"overflow:hidden;padding:8px;position:relative\"\n                class=\"highlightPane\">\n\n        <div class=\"dijitBoldLabel dijitLargeLabel dijitDarkLabel\" style=\"\">Document Types</div>\n        <div dojoAttachPoint=\"tableNode\"></div>\n\n        <div dojoAttachPoint=\"chartNode\" style=\"height:96px;width:96px;position:absolute;left:144px;top:4px\"></div>\n        <div dojoAttachPoint=\"legendNode\"></div>\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_wdgChart:null,zone:null,constructor:function(_1){},destroy:function(){this.inherited("destroy",arguments);},postCreate:function(){this.inherited("postCreate",arguments);this._metrics=this.library.getDocumentTypes().getMetrics({zone:this.zone,library:this.library});var _2=[];dojo.forEach(this._metrics,function(m,_3){_2.push({y:10,text:m.name});},this);this._wdgChart=new dojox.charting.Chart(this.chartNode);this._wdgChart.setTheme(dojox.charting.themes.VersaColors);this._wdgChart.addPlot("default",{type:"Pie",radius:36,startAngle:180,ticks:true,labelStyle:"default",labels:false});this._wdgChart.addSeries("Series1",_2);new dojox.charting.action2d.Tooltip(this._wdgChart,"default");new dojox.charting.action2d.MoveSlice(this._wdgChart,"default",{series:"Series1",scale:1.25,shift:0});this._wdgChart.render();this._wdgLegend=new dojox.charting.widget.Legend({"class":"versafile",chart:this._wdgChart,horizontal:false,style:"position:absolute;top:24px;left:256px"},this.legendNode);},startup:function(){this.inherited("startup",arguments);}});}