/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.widget.zone.metrics.themes.VersaGaugeDanger"]){dojo._hasResource["versa.widget.zone.metrics.themes.VersaGaugeDanger"]=true;dojo.provide("versa.widget.zone.metrics.themes.VersaGaugeDanger");dojo.require("dojox.charting.Theme");dojo.require("dojox.charting.themes.gradientGenerator");(function(){var dc=dojox.charting,_1=dc.themes,_2=["#f00","#000"],_3={type:"linear",space:"plot",x1:0,y1:0,x2:0,y2:100};_1.VersaGaugeDanger=new dc.Theme({chart:{fill:"transparent"},plotarea:{fill:"transparent"},seriesThemes:_1.gradientGenerator.generateMiniTheme(_2,_3,90,40,25)});})();}