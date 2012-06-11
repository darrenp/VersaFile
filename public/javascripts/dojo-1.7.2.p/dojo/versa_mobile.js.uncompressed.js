/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

//>>built
require({cache:{
'dojox/mobile/ToolBarButton':function(){
define("dojox/mobile/ToolBarButton", [
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"./common",
	"./_ItemBase"
], function(declare, win, domClass, domConstruct, domStyle, common, ItemBase){
/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/ToolBarButton
	// summary:
	//		A button widget that is placed in the Heading widget.

	return declare("dojox.mobile.ToolBarButton", ItemBase, {
		// summary:
		//		A button widget that is placed in the Heading widget.
		// description:
		//		ToolBarButton is a button that is placed in the Heading
		//		widget. It is a subclass of dojox.mobile._ItemBase just like
		//		ListItem or IconItem. So, unlike Button, it has basically the
		//		same capability as ListItem or IconItem, such as icon support,
		//		transition, etc.

		// selected: Boolean
		//		If true, the button is in the selected status.
		selected: false,

		// btnClass: String
		//		Deprecated.
		btnClass: "",

		/* internal properties */	
		_defaultColor: "mblColorDefault",
		_selColor: "mblColorDefaultSel",

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement("div");
			this.inheritParams();
			domClass.add(this.domNode, "mblToolBarButton mblArrowButtonText");
			var color;
			if(this.selected){
				color = this._selColor;
			}else if(this.domNode.className.indexOf("mblColor") == -1){
				color = this._defaultColor;
			}
			domClass.add(this.domNode, color);
	
			if(!this.label){
				this.label = this.domNode.innerHTML;
			}

			if(this.icon && this.icon != "none"){
				this.iconNode = domConstruct.create("div", {className:"mblToolBarButtonIcon"}, this.domNode);
				common.createIcon(this.icon, this.iconPos, null, this.alt, this.iconNode);
				if(this.iconPos){
					domClass.add(this.iconNode.firstChild, "mblToolBarButtonSpriteIcon");
				}
			}else{
				if(common.createDomButton(this.domNode)){
					domClass.add(this.domNode, "mblToolBarButtonDomButton");
				}else{
					domClass.add(this.domNode, "mblToolBarButtonText");
				}
			}
			this.connect(this.domNode, "onclick", "onClick");
		},
	
		select: function(){
			// summary:
			//		Makes this widget in the selected state.
			domClass.toggle(this.domNode, this._selColor, !arguments[0]);
			this.selected = !arguments[0];
		},
		
		deselect: function(){
			// summary:
			//		Makes this widget in the deselected state.
			this.select(true);
		},
	
		onClick: function(e){
			this.setTransitionPos(e);
			this.defaultClickAction();
		},
	
		_setBtnClassAttr: function(/*String*/btnClass){
			var node = this.domNode;
			if(node.className.match(/(mblDomButton\w+)/)){
				domClass.remove(node, RegExp.$1);
			}
			domClass.add(node, btnClass);
			if(common.createDomButton(this.domNode)){
				domClass.add(this.domNode, "mblToolBarButtonDomButton");
			}
		},

		_setLabelAttr: function(/*String*/text){
			this.label = text;
			this.domNode.innerHTML = this._cv ? this._cv(text) : text;
		}
	});
});

},
'versa/api/References':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 04/04/12
 * Time: 12:32 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/References", ["dojo/_base/declare",
         "versa/api/_Collection",
         "versa/api/Reference"],
    function(declare){
        var o=declare("versa.api.References", [versa.api._Collection], {
            library: null,
            zone: null,

            _isUpdateable: function(request){
                return false;
            },

            _softDelete: function(item){
                var url = dojo.replace(versa.api.References.SDEL_TRGT,  [this.zone.subdomain, this.library.getId(), item.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return result;
            },

            constructor: function(args){

                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.References.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.Reference.schema;
                this.cache = false;

                this._initialize();
                this.store.isUpdateable = dojo.hitch(this, this._isUpdateable);
            },

            destroy: function(args){
                var item = args.item;

                if((item.isInstanceOf(versa.api.Reference)) && (args.soft)){
                    item = this._softDelete(item);
                    this.store.onDelete(item);
                }
                else{
                    this.inherited('destroy', arguments);
                }

            },

            export_query: function(args){
                var queryStr = dojo.objectToQuery(args.query);

                var sortStr = dojo.replace('sort({0}{1})',
                    [   (args.sort.descending ? '-' : '+'),
                        encodeURIComponent(args.sort.attribute)]) ;

                var frmt = 'json';
                switch(args.type){
                    case versa.api.References.ExportTypes.CSV:
                        frmt = 'csv';
                        break;
                    case versa.api.References.ExportTypes.PDF:
                        frmt = 'pdf';
                        break;
                    case versa.api.References.ExportTypes.XML:
                        frmt = 'xml'
                        break;
                }

                var url = dojo.replace(versa.api.References.EXPORT_TRGT, [args.zone.subdomain, args.library.id, queryStr, sortStr, frmt]);

                if(args.type == versa.api.Documents.ExportTypes.PDF){
                   versa.api.Utilities.viewUrl({
                        windowBox: args.windowBox,
                        url: url,
                        window_name: 'versa_save'
                    });
                }
                else{
                   versa.api.Utilities.saveUrl({
                        url: url,
                        window_name: 'versa_save'
                    });
                }
            },

            print_query: function(args){

                var queryStr = dojo.objectToQuery(args.query);

                var sortStr = dojo.replace('sort({0}{1})',
                    [   (args.sort.descending ? '-' : '+'),
                        encodeURIComponent(args.sort.attribute)]) ;

                var url = dojo.replace(versa.api.References.PRINT_TRGT, [args.zone.subdomain, args.library.id, queryStr, sortStr, 'html'])

                versa.api.Utilities.viewUrl({
                    windowBox: args.windowBox,
                    url: url,
                    window_name: 'versa_printer'
                });

            }
        });

        o.ExportTypes = { 'NONE':  0x0000, 'CSV':   0x001, 'PDF':   0x0002, 'XML':   0x0003 }

        o.TRGT = '/zones/{0}/libraries/{1}/references';
        o.SDEL_TRGT  = '/zones/{0}/libraries/{1}/references/{2}/soft_delete.json';
        o.PRINT_TRGT = '/zones/{0}/libraries/{1}/references?{2}&{3}';
        o.EXPORT_TRGT = '/zones/{0}/libraries/{1}/references.{4}?{2}&{3}';

        return o;
    }
);


},
'dojox/mobile/transition':function(){
define("dojox/mobile/transition", [
	"dojo/_base/Deferred",
	"dojo/_base/config"
], function(Deferred, config){
	/* summary: this is the wrapper module which load
	 * dojox/css3/transit conditionally. If mblCSS3Transition
	 * is set to 'dojox/css3/transit', it will be loaded as
	 * the module to conduct the view transition.
	 */
	if(config['mblCSS3Transition']){
		//require dojox/css3/transit and resolve it as the result of transitDeferred.
		var transitDeferred = new Deferred();
		require([config['mblCSS3Transition']], function(transit){
			transitDeferred.resolve(transit);
		});
		return transitDeferred;
	}
	return null;
});

},
'dijit/_TemplatedMixin':function(){
define("dijit/_TemplatedMixin", [
	"dojo/_base/lang", // lang.getObject
	"dojo/touch",
	"./_WidgetBase",
	"dojo/string", // string.substitute string.trim
	"dojo/cache",	// dojo.cache
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/dom-construct", // domConstruct.destroy, domConstruct.toDom
	"dojo/_base/sniff", // has("ie")
	"dojo/_base/unload", // unload.addOnWindowUnload
	"dojo/_base/window" // win.doc
], function(lang, touch, _WidgetBase, string, cache, array, declare, domConstruct, has, unload, win) {

/*=====
	var _WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dijit/_TemplatedMixin
	// summary:
	//		Mixin for widgets that are instantiated from a template

	var _TemplatedMixin = declare("dijit._TemplatedMixin", null, {
		// summary:
		//		Mixin for widgets that are instantiated from a template

		// templateString: [protected] String
		//		A string that represents the widget template.
		//		Use in conjunction with dojo.cache() to load from a file.
		templateString: null,

		// templatePath: [protected deprecated] String
		//		Path to template (HTML file) for this widget relative to dojo.baseUrl.
		//		Deprecated: use templateString with require([... "dojo/text!..."], ...) instead
		templatePath: null,

		// skipNodeCache: [protected] Boolean
		//		If using a cached widget template nodes poses issues for a
		//		particular widget class, it can set this property to ensure
		//		that its template is always re-built from a string
		_skipNodeCache: false,

		// _earlyTemplatedStartup: Boolean
		//		A fallback to preserve the 1.0 - 1.3 behavior of children in
		//		templates having their startup called before the parent widget
		//		fires postCreate. Defaults to 'false', causing child widgets to
		//		have their .startup() called immediately before a parent widget
		//		.startup(), but always after the parent .postCreate(). Set to
		//		'true' to re-enable to previous, arguably broken, behavior.
		_earlyTemplatedStartup: false,

/*=====
		// _attachPoints: [private] String[]
		//		List of widget attribute names associated with data-dojo-attach-point=... in the
		//		template, ex: ["containerNode", "labelNode"]
 		_attachPoints: [],
 =====*/

/*=====
		// _attachEvents: [private] Handle[]
		//		List of connections associated with data-dojo-attach-event=... in the
		//		template
 		_attachEvents: [],
 =====*/

		constructor: function(){
			this._attachPoints = [];
			this._attachEvents = [];
		},

		_stringRepl: function(tmpl){
			// summary:
			//		Does substitution of ${foo} type properties in template string
			// tags:
			//		private
			var className = this.declaredClass, _this = this;
			// Cache contains a string because we need to do property replacement
			// do the property replacement
			return string.substitute(tmpl, this, function(value, key){
				if(key.charAt(0) == '!'){ value = lang.getObject(key.substr(1), false, _this); }
				if(typeof value == "undefined"){ throw new Error(className+" template:"+key); } // a debugging aide
				if(value == null){ return ""; }

				// Substitution keys beginning with ! will skip the transform step,
				// in case a user wishes to insert unescaped markup, e.g. ${!foo}
				return key.charAt(0) == "!" ? value :
					// Safer substitution, see heading "Attribute values" in
					// http://www.w3.org/TR/REC-html40/appendix/notes.html#h-B.3.2
					value.toString().replace(/"/g,"&quot;"); //TODO: add &amp? use encodeXML method?
			}, this);
		},

		buildRendering: function(){
			// summary:
			//		Construct the UI for this widget from a template, setting this.domNode.
			// tags:
			//		protected

			if(!this.templateString){
				this.templateString = cache(this.templatePath, {sanitize: true});
			}

			// Lookup cached version of template, and download to cache if it
			// isn't there already.  Returns either a DomNode or a string, depending on
			// whether or not the template contains ${foo} replacement parameters.
			var cached = _TemplatedMixin.getCachedTemplate(this.templateString, this._skipNodeCache);

			var node;
			if(lang.isString(cached)){
				node = domConstruct.toDom(this._stringRepl(cached));
				if(node.nodeType != 1){
					// Flag common problems such as templates with multiple top level nodes (nodeType == 11)
					throw new Error("Invalid template: " + cached);
				}
			}else{
				// if it's a node, all we have to do is clone it
				node = cached.cloneNode(true);
			}

			this.domNode = node;

			// Call down to _Widget.buildRendering() to get base classes assigned
			// TODO: change the baseClass assignment to _setBaseClassAttr
			this.inherited(arguments);

			// recurse through the node, looking for, and attaching to, our
			// attachment points and events, which should be defined on the template node.
			this._attachTemplateNodes(node, function(n,p){ return n.getAttribute(p); });

			this._beforeFillContent();		// hook for _WidgetsInTemplateMixin

			this._fillContent(this.srcNodeRef);
		},

		_beforeFillContent: function(){
		},

		_fillContent: function(/*DomNode*/ source){
			// summary:
			//		Relocate source contents to templated container node.
			//		this.containerNode must be able to receive children, or exceptions will be thrown.
			// tags:
			//		protected
			var dest = this.containerNode;
			if(source && dest){
				while(source.hasChildNodes()){
					dest.appendChild(source.firstChild);
				}
			}
		},

		_attachTemplateNodes: function(rootNode, getAttrFunc){
			// summary:
			//		Iterate through the template and attach functions and nodes accordingly.
			//		Alternately, if rootNode is an array of widgets, then will process data-dojo-attach-point
			//		etc. for those widgets.
			// description:
			//		Map widget properties and functions to the handlers specified in
			//		the dom node and it's descendants. This function iterates over all
			//		nodes and looks for these properties:
			//			* dojoAttachPoint/data-dojo-attach-point
			//			* dojoAttachEvent/data-dojo-attach-event
			// rootNode: DomNode|Widget[]
			//		the node to search for properties. All children will be searched.
			// getAttrFunc: Function
			//		a function which will be used to obtain property for a given
			//		DomNode/Widget
			// tags:
			//		private

			var nodes = lang.isArray(rootNode) ? rootNode : (rootNode.all || rootNode.getElementsByTagName("*"));
			var x = lang.isArray(rootNode) ? 0 : -1;
			for(; x<nodes.length; x++){
				var baseNode = (x == -1) ? rootNode : nodes[x];
				if(this.widgetsInTemplate && (getAttrFunc(baseNode, "dojoType") || getAttrFunc(baseNode, "data-dojo-type"))){
					continue;
				}
				// Process data-dojo-attach-point
				var attachPoint = getAttrFunc(baseNode, "dojoAttachPoint") || getAttrFunc(baseNode, "data-dojo-attach-point");
				if(attachPoint){
					var point, points = attachPoint.split(/\s*,\s*/);
					while((point = points.shift())){
						if(lang.isArray(this[point])){
							this[point].push(baseNode);
						}else{
							this[point]=baseNode;
						}
						this._attachPoints.push(point);
					}
				}

				// Process data-dojo-attach-event
				var attachEvent = getAttrFunc(baseNode, "dojoAttachEvent") || getAttrFunc(baseNode, "data-dojo-attach-event");
				if(attachEvent){
					// NOTE: we want to support attributes that have the form
					// "domEvent: nativeEvent; ..."
					var event, events = attachEvent.split(/\s*,\s*/);
					var trim = lang.trim;
					while((event = events.shift())){
						if(event){
							var thisFunc = null;
							if(event.indexOf(":") != -1){
								// oh, if only JS had tuple assignment
								var funcNameArr = event.split(":");
								event = trim(funcNameArr[0]);
								thisFunc = trim(funcNameArr[1]);
							}else{
								event = trim(event);
							}
							if(!thisFunc){
								thisFunc = event;
							}
							// Map "press", "move" and "release" to keys.touch, keys.move, keys.release
							this._attachEvents.push(this.connect(baseNode, touch[event] || event, thisFunc));
						}
					}
				}
			}
		},

		destroyRendering: function(){
			// Delete all attach points to prevent IE6 memory leaks.
			array.forEach(this._attachPoints, function(point){
				delete this[point];
			}, this);
			this._attachPoints = [];

			// And same for event handlers
			array.forEach(this._attachEvents, this.disconnect, this);
			this._attachEvents = [];

			this.inherited(arguments);
		}
	});

	// key is templateString; object is either string or DOM tree
	_TemplatedMixin._templateCache = {};

	_TemplatedMixin.getCachedTemplate = function(templateString, alwaysUseString){
		// summary:
		//		Static method to get a template based on the templatePath or
		//		templateString key
		// templateString: String
		//		The template
		// alwaysUseString: Boolean
		//		Don't cache the DOM tree for this template, even if it doesn't have any variables
		// returns: Mixed
		//		Either string (if there are ${} variables that need to be replaced) or just
		//		a DOM tree (if the node can be cloned directly)

		// is it already cached?
		var tmplts = _TemplatedMixin._templateCache;
		var key = templateString;
		var cached = tmplts[key];
		if(cached){
			try{
				// if the cached value is an innerHTML string (no ownerDocument) or a DOM tree created within the current document, then use the current cached value
				if(!cached.ownerDocument || cached.ownerDocument == win.doc){
					// string or node of the same document
					return cached;
				}
			}catch(e){ /* squelch */ } // IE can throw an exception if cached.ownerDocument was reloaded
			domConstruct.destroy(cached);
		}

		templateString = string.trim(templateString);

		if(alwaysUseString || templateString.match(/\$\{([^\}]+)\}/g)){
			// there are variables in the template so all we can do is cache the string
			return (tmplts[key] = templateString); //String
		}else{
			// there are no variables in the template so we can cache the DOM tree
			var node = domConstruct.toDom(templateString);
			if(node.nodeType != 1){
				throw new Error("Invalid template: " + templateString);
			}
			return (tmplts[key] = node); //Node
		}
	};

	if(has("ie")){
		unload.addOnWindowUnload(function(){
			var cache = _TemplatedMixin._templateCache;
			for(var key in cache){
				var value = cache[key];
				if(typeof value == "object"){ // value is either a string or a DOM node template
					domConstruct.destroy(value);
				}
				delete cache[key];
			}
		});
	}

	// These arguments can be specified for widgets which are used in templates.
	// Since any widget can be specified as sub widgets in template, mix it
	// into the base widget class.  (This is a hack, but it's effective.)
	lang.extend(_WidgetBase,{
		dojoAttachEvent: "",
		dojoAttachPoint: ""
	});

	return _TemplatedMixin;
});

},
'versa/api/Preferences':function(){
/**
 * @author mattk
 */
define("versa/api/Preferences", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Preference",
        "dojo/data/ItemFileReadStore"],
    function(declare){
        var o=declare("versa.api.Preferences", [versa.api._Collection], {
            constructor: function(/* Object */args){
                this.zone = args.zone;
                this.library=args.library;
                this.target = dojo.replace(versa.api.Preferences.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.Preference.schema;
                this.cache = true;

                this._dateEntryFormats = new dojo.data.ItemFileReadStore({
                    data: {
                        'identifier': 'id',
                        'label': 'name',
                        'items': [
                            {id: versa.api.Preference.dateEntryFormats._date, name: "Date only"},
                            {id: versa.api.Preference.dateEntryFormats._time, name: "Time only"},
                            {id: versa.api.Preference.dateEntryFormats._datetime, name: "Date and Time"}
                        ]
                    },
                    clearOnClose: true
                });

                this._initialize();
            },

            getDateEntryFormat: function(){
                var item = this.store.fetch({query: {name:"Date entry format"}}).results[0];
                return (item) ? parseInt(this.getValue(item, 'value')) : 1;
            }
        });

        o.TRGT='/zones{0}/libraries/${1}/preferences'

        return o;
    }
);


},
'versa/api/Libraries':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 22/09/11
 * Time: 4:49 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Libraries", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Library"],
    function(declare){
        var o=declare("versa.api.Libraries", [versa.api._Collection], {
            zone: null,

            constructor: function(args){
                this.zone = args.zone;
                this.target = dojo.replace(versa.api.Libraries.TRGT, this.zone);
                this.schema = versa.api.Library.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.TRGT = '/zones/{subdomain}/libraries';

        return o;
    }
);

},
'versa/widget/mobile/TextBox':function(){
/**
 * Created by JetBrains RubyMine.
 * User: aarons
 * To change this template use File | Settings | File Templates.
 */
define("versa/widget/mobile/TextBox", ["dojo/_base/declare",
         "dojox/mobile/TextBox"],
    function(declare){
        return declare("versa.widget.mobile.TextBox", [dojox.mobile.TextBox], {
            buildRendering: function(){
                this.inherited('buildRendering', arguments);

                if(this.type){
                    this.domNode.type=this.type;
                }
            }
        });
    }
);

},
'versa/api/Formatter':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/03/12
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Formatter", ["dojo/_base/declare"],
    function(declare){
        var o=declare("versa.api.Formatter", [], {});

        o.formatDateTime = function(value){
            var frmt_value = value;

            if(String.isEmpty(value))
                return '';

            if(typeof value == 'string')
                frmt_value = dojo.date.stamp.fromISOString(value);

            return dojo.date.locale.format(frmt_value, {selector: 'date', formatLength: 'medium'})
        };


        return o;
    }
);


},
'versa/api/Documents':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 26/09/11
 * Time: 11:24 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Documents", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Document",
        "versa/api/Utilities"],
    function(declare){
        var o=declare("versa.api.Documents", [versa.api._Collection], {
            library: null,

            _isUpdateable: function(request){
                return false;
            },

            /*
            _onDelete: function(item){
                item.state |= versa.api.Document.states.DELETED;
            },
            */

            _softDelete: function(item){
                var url = dojo.replace(versa.api.Documents.SDEL_TRGT,  [this.zone.subdomain, this.library.getId(), item.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return result;
            },

            constructor: function(args){
                console.log(versa);
                console.log(versa.api);
                console.log(versa.api.Document);
                console.log(versa.api.Document.schema);

                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.Documents.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.Document.schema;
                this.cache = false;
                this.syncMode = false;

                this._initialize();
                this.store.isUpdateable = dojo.hitch(this, this._isUpdateable);

                //dojo.connect(this.store, 'onDelete', this._onDelete);

            },

            destroy: function(args){
                var item = args.item;

                if((item.isInstanceOf(versa.api.Document)) && (args.soft)){
                    item = this._softDelete(item);
                    this.store.onDelete(item);
                }
                else{
                    this.inherited('destroy', arguments);
                }
            },

            empty_recycling: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Documents.EMPTY,  [zone.subdomain, library.id]);

                var result = versa.api.XhrHelper.doPostAction({
                    target: url,
                    postData: {}
                });

                return true;
            },

            export_query: function(args){

                var queryStr = dojo.objectToQuery(args.query);

                var sortStr = dojo.replace('sort({0}{1})',
                    [   (args.sort.descending ? '-' : '+'),
                        encodeURIComponent(args.sort.attribute)]) ;

                var frmt = 'json';
                switch(args.type){
                    case versa.api.Documents.ExportTypes.CSV:
                        frmt = 'csv';
                        break;
                    case versa.api.Documents.ExportTypes.PDF:
                        frmt = 'pdf';
                        break;
                    case versa.api.Documents.ExportTypes.XML:
                        frmt = 'xml'
                        break;
                }

                var url = dojo.replace(versa.api.Documents.EXPORT_TRGT, [args.zone.subdomain, args.library.id, queryStr, sortStr, frmt]);

                if(args.type == versa.api.Documents.ExportTypes.PDF){
                   versa.api.Utilities.viewUrl({
                        windowBox: args.windowBox,
                        url: url,
                        window_name: 'versa_save'
                    });
                }
                else{
                   versa.api.Utilities.saveUrl({
                        url: url,
                        window_name: 'versa_save'
                    });
                }
            },

            isValid: function(args){
                this.validate(args);
                return this.getState(versa.api.Document.states.INVALID);
            },

            print_query: function(args){

                var queryStr = dojo.objectToQuery(args.query);

                var sortStr = dojo.replace('sort({0}{1})',
                    [   (args.sort.descending ? '-' : '+'),
                        encodeURIComponent(args.sort.attribute)]) ;

                var url = dojo.replace(versa.api.Documents.EXPORT_TRGT, [args.zone.subdomain, args.library.id, queryStr, sortStr, 'html'])

                versa.api.Utilities.viewUrl({
                    windowBox: args.windowBox,
                    url: url,
                    window_name: 'versa_printer'
                });

            }
        });

        o.States = { pending: 0x0000, checked_in: 0x0001, checked_out: 0x0002, busy: 0x4000, deleted: 0x8000 }
        o.ExportTypes = { 'NONE':  0x0000, 'CSV':   0x001, 'PDF':   0x0002, 'XML':   0x0003 }

        o.TRGT = '/zones/{0}/libraries/{1}/documents';
        o.PRINT_TRGT = '/zones/{0}/libraries/{1}/documents?{2}&{3}';
        o.EXPORT_TRGT = '/zones/{0}/libraries/{1}/documents.{4}?{2}&{3}';
        o.EMPTY = '/zones/{0}/libraries/{1}/documents/empty';
        o.SDEL_TRGT  = '/zones/{0}/libraries/{1}/documents/{2}/soft_delete.json';

        o.isCheckedOut = function(args){
            var state
            if(args.document){
                state=args.document.state;
            }else if(args.state){
                state=args.state;
            }
            return ((state & versa.api.Documents.States.checked_out) > 0);
        };

        o.isBusy = function(args){
            return ((args.state & versa.api.Documents.States.busy) > 0);
        };

        return o;
    }
);


},
'versa/api/Share':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 15/04/12
 * Time: 9:31 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Share", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/SharedItems"],
    function(declare){
        var o=declare("versa.api.Share", [versa.api._Object], {
            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            authorize: function(zone){
                var url = dojo.replace(versa.api.Share.AUTH_URL, [zone.id, this.fingerprint]);

                var postData = {
                    password: this.password
                };

                var results = versa.api.XhrHelper.doPostAction({
                    target: url,
                    postData: postData
                });

                return true;
            },

            getSharedItems: function(args){
                return new versa.api.SharedItems({zone: args.zone, share: this});
            }
        });

        o.AUTH_URL = '/zones/{0}/shares/{1}/authorize.json';

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                }
            },
            prototype: new o()
        };

        return o;
    }
);



},
'dojox/mobile/TabBarButton':function(){
define("dojox/mobile/TabBarButton", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/registry",	// registry.byNode
	"./common",
	"./_ItemBase"
], function(declare, lang, win, domClass, domConstruct, registry, common, ItemBase){

/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/TabBarButton
	// summary:
	//		A button widget that is placed in the TabBar widget.

	return declare("dojox.mobile.TabBarButton", ItemBase,{
		// summary:
		//		A button widget that is placed in the TabBar widget.
		// description:
		//		TabBarButton is a button that is placed in the TabBar widget. It
		//		is a subclass of dojox.mobile._ItemBase just like ListItem or
		//		IconItem. So, unlike Button, it has similar capability as
		//		ListItem or IconItem, such as icon support, transition, etc.

		// icon1: String
		//		A path for the unselected (typically dark) icon. If icon is not
		//		specified, the iconBase parameter of the parent widget is used.
		icon1: "",

		// icon2: String
		//		A path for the selected (typically highlight) icon. If icon is
		//		not specified, the iconBase parameter of the parent widget or
		//		icon1 is used.
		icon2: "",

		// iconPos1: String
		//		The position of an aggregated unselected (typically dark)
		//		icon. IconPos1 is comma separated values like
		//		top,left,width,height (ex. "0,0,29,29"). If iconPos1 is not
		//		specified, the iconPos parameter of the parent widget is used.
		iconPos1: "",

		// iconPos2: String
		//		The position of an aggregated selected (typically highlight)
		//		icon. IconPos2 is comma separated values like
		//		top,left,width,height (ex. "0,0,29,29"). If iconPos2 is not
		//		specified, the iconPos parameter of the parent widget or
		//		iconPos1 is used.
		iconPos2: "",

		// selected: Boolean
		//		If true, the button is in the selected status.
		selected: false,

		// transition: String
		//		A type of animated transition effect.
		transition: "none",

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "LI",

		/* internal properties */	
		selectOne: true,

	
		inheritParams: function(){
			// summary:
			//		Overrides dojox.mobile._ItemBase.inheritParams().
			if(this.icon && !this.icon1){ this.icon1 = this.icon; }
			var parent = this.getParent();
			if(parent){
				if(!this.transition){ this.transition = parent.transition; }
				if(this.icon1 && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon1 = parent.iconBase + this.icon1;
				}
				if(!this.icon1){ this.icon1 = parent.iconBase; }
				if(!this.iconPos1){ this.iconPos1 = parent.iconPos; }
				if(this.icon2 && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon2 = parent.iconBase + this.icon2;
				}
				if(!this.icon2){ this.icon2 = parent.iconBase || this.icon1; }
				if(!this.iconPos2){ this.iconPos2 = parent.iconPos || this.iconPos1; }
			}
		},
	
		buildRendering: function(){
			var a = this.anchorNode = domConstruct.create("A", {className:"mblTabBarButtonAnchor"});
			this.connect(a, "onclick", "onClick");
	
			this.box = domConstruct.create("DIV", {className:"mblTabBarButtonTextBox"}, a);
			var box = this.box;
			var label = "";
			var r = this.srcNodeRef;
			if(r){
				for(var i = 0, len = r.childNodes.length; i < len; i++){
					var n = r.firstChild;
					if(n.nodeType === 3){
						label += lang.trim(n.nodeValue);
					}
					box.appendChild(n);
				}
			}
			if(!this.label){
				this.label = label;
			}
	
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.containerNode = this.domNode;
			this.domNode.appendChild(a);
			if(this.domNode.className.indexOf("mblDomButton") != -1){
				// deprecated. TODO: remove this code in 1.8
				var domBtn = domConstruct.create("DIV", null, a);
				common.createDomButton(this.domNode, null, domBtn);
				domClass.add(this.domNode, "mblTabButtonDomButton");
				domClass.add(domBtn, "mblTabButtonDomButtonClass");
			}
			if((this.icon1 || this.icon).indexOf("mblDomButton") != -1){
				domClass.add(this.domNode, "mblTabButtonDomButton");
			}
		},
	
		startup: function(){
			if(this._started){ return; }
			this.inheritParams();
			var parent = this.getParent();
	
			var _clsName = parent ? parent._clsName : "mblTabBarButton";
			domClass.add(this.domNode, _clsName + (this.selected ? " mblTabButtonSelected" : ""));
	
			if(parent && parent.barType == "segmentedControl"){
				// proper className may not be set when created dynamically
				domClass.remove(this.domNode, "mblTabBarButton");
				domClass.add(this.domNode, parent._clsName);
				this.box.className = "";
			}
			this.set({icon1:this.icon1, icon2:this.icon2});
			this.inherited(arguments);
		},
	
		select: function(){
			// summary:
			//		Makes this widget in the selected state.
			if(arguments[0]){ // deselect
				this.selected = false;
				domClass.remove(this.domNode, "mblTabButtonSelected");
			}else{ // select
				this.selected = true;
				domClass.add(this.domNode, "mblTabButtonSelected");
				for(var i = 0, c = this.domNode.parentNode.childNodes; i < c.length; i++){
					if(c[i].nodeType != 1){ continue; }
					var w = registry.byNode(c[i]); // sibling widget
					if(w && w != this){
						w.deselect();
					}
				}
			}
			if(this.iconNode1){
				this.iconNode1.style.visibility = this.selected ? "hidden" : "";
			}
			if(this.iconNode2){
				this.iconNode2.style.visibility = this.selected ? "" : "hidden";
			}
		},
		
		deselect: function(){
			// summary:
			//		Makes this widget in the deselected state.
			this.select(true);
		},
	
		onClick: function(e){
			this.defaultClickAction();
		},
	
		_setIcon: function(icon, pos, num, sel){
			var i = "icon" + num, n = "iconNode" + num, p = "iconPos" + num;
			if(icon){ this[i] = icon; }
			if(pos){
				if(this[p] === pos){ return; }
				this[p] = pos;
			}
			if(icon && icon !== "none"){
				if(!this.iconDivNode){
					this.iconDivNode = domConstruct.create("DIV", {className:"mblTabBarButtonDiv"}, this.anchorNode, "first");
				}
				if(!this[n]){
					this[n] = domConstruct.create("div", {className:"mblTabBarButtonIcon"}, this.iconDivNode);
				}else{
					domConstruct.empty(this[n]);
				}
				common.createIcon(icon, this[p], null, this.alt, this[n]);
				if(this[p]){
					domClass.add(this[n].firstChild, "mblTabBarButtonSpriteIcon");
				}
				domClass.remove(this.iconDivNode, "mblTabBarButtonNoIcon");
				this[n].style.visibility = sel ? "hidden" : "";
			}else if(this.iconDivNode){
				domClass.add(this.iconDivNode, "mblTabBarButtonNoIcon");
			}
		},
	
		_setIcon1Attr: function(icon){
			this._setIcon(icon, null, 1, this.selected);
		},
	
		_setIcon2Attr: function(icon){
			this._setIcon(icon, null, 2, !this.selected);
		},
	
		_setIconPos1Attr: function(pos){
			this._setIcon(null, pos, 1, this.selected);
		},
	
		_setIconPos2Attr: function(pos){
			this._setIcon(null, pos, 2, !this.selected);
		},

		_setLabelAttr: function(/*String*/text){
			this.label = text;
			this.box.innerHTML = this._cv ? this._cv(text) : text;
		}
	});
});

},
'dojox/mobile/_ScrollableMixin':function(){
define("dojox/mobile/_ScrollableMixin", [
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/dom-class",
	"dijit/registry",	// registry.byNode
	"./scrollable"
], function(dojo, declare, lang, win, dom, domClass, registry, Scrollable){
	// module:
	//		dojox/mobile/_ScrollableMixin
	// summary:
	//		Mixin for widgets to have a touch scrolling capability.

	var cls = declare("dojox.mobile._ScrollableMixin", null, {
		// summary:
		//		Mixin for widgets to have a touch scrolling capability.
		// description:
		//		Actual implementation is in scrollable.js.
		//		scrollable.js is not a dojo class, but just a collection
		//		of functions. This module makes scrollable.js a dojo class.

		// fixedHeader: String
		//		Id of the fixed header.
		fixedHeader: "",

		// fixedFooter: String
		//		Id of the fixed footer.
		fixedFooter: "",

		// scrollableParams: Object
		//		Parameters for dojox.mobile.scrollable.init().
		scrollableParams: null,

		// allowNestedScrolls: Boolean
		//		e.g. Allow ScrollableView in a SwapView.
		allowNestedScrolls: true,

		constructor: function(){
			this.scrollableParams = {};
		},

		destroy: function(){
			this.cleanup();
			this.inherited(arguments);
		},

		startup: function(){
			if(this._started){ return; }
			var node;
			var params = this.scrollableParams;
			if(this.fixedHeader){
				node = dom.byId(this.fixedHeader);
				if(node.parentNode == this.domNode){ // local footer
					this.isLocalHeader = true;
				}
				params.fixedHeaderHeight = node.offsetHeight;
			}
			if(this.fixedFooter){
				node = dom.byId(this.fixedFooter);
				if(node.parentNode == this.domNode){ // local footer
					this.isLocalFooter = true;
					node.style.bottom = "0px";
				}
				params.fixedFooterHeight = node.offsetHeight;
			}
			this.init(params);
			if(this.allowNestedScrolls){
				for(var p = this.getParent(); p; p = p.getParent()){
					if(p && p.scrollableParams){
						this.isNested = true;
						this.dirLock = true;
						p.dirLock = true;
						break;
					}
				}
			}
			this.inherited(arguments);
		},

		findAppBars: function(){
			// summary:
			//		Search for application-specific header or footer.
			var i, len, c;
			for(i = 0, len = win.body().childNodes.length; i < len; i++){
				c = win.body().childNodes[i];
				this.checkFixedBar(c, false);
			}
			if(this.domNode.parentNode){
				for(i = 0, len = this.domNode.parentNode.childNodes.length; i < len; i++){
					c = this.domNode.parentNode.childNodes[i];
					this.checkFixedBar(c, false);
				}
			}
			this.fixedFooterHeight = this.fixedFooter ? this.fixedFooter.offsetHeight : 0;
		},

		checkFixedBar: function(/*DomNode*/node, /*Boolean*/local){
			// summary:
			//		Checks if the given node is a fixed bar or not.
			if(node.nodeType === 1){
				var fixed = node.getAttribute("fixed")
					|| (registry.byNode(node) && registry.byNode(node).fixed);
				if(fixed === "top"){
					domClass.add(node, "mblFixedHeaderBar");
					if(local){
						node.style.top = "0px";
						this.fixedHeader = node;
					}
					return fixed;
				}else if(fixed === "bottom"){
					domClass.add(node, "mblFixedBottomBar");
					this.fixedFooter = node;
					return fixed;
				}
			}
			return null;
		}
	});
	lang.extend(cls, new Scrollable(dojo, dojox));
	return cls;
});

},
'dijit/focus':function(){
define("dijit/focus", [
	"dojo/aspect",
	"dojo/_base/declare", // declare
	"dojo/dom", // domAttr.get dom.isDescendant
	"dojo/dom-attr", // domAttr.get dom.isDescendant
	"dojo/dom-construct", // connect to domConstruct.empty, domConstruct.destroy
	"dojo/Evented",
	"dojo/_base/lang", // lang.hitch
	"dojo/on",
	"dojo/ready",
	"dojo/_base/sniff", // has("ie")
	"dojo/Stateful",
	"dojo/_base/unload", // unload.addOnWindowUnload
	"dojo/_base/window", // win.body
	"dojo/window", // winUtils.get
	"./a11y",	// a11y.isTabNavigable
	"./registry",	// registry.byId
	"."		// to set dijit.focus
], function(aspect, declare, dom, domAttr, domConstruct, Evented, lang, on, ready, has, Stateful, unload, win, winUtils,
			a11y, registry, dijit){

	// module:
	//		dijit/focus
	// summary:
	//		Returns a singleton that tracks the currently focused node, and which widgets are currently "active".

/*=====
	dijit.focus = {
		// summary:
		//		Tracks the currently focused node, and which widgets are currently "active".
		//		Access via require(["dijit/focus"], function(focus){ ... }).
		//
		//		A widget is considered active if it or a descendant widget has focus,
		//		or if a non-focusable node of this widget or a descendant was recently clicked.
		//
		//		Call focus.watch("curNode", callback) to track the current focused DOMNode,
		//		or focus.watch("activeStack", callback) to track the currently focused stack of widgets.
		//
		//		Call focus.on("widget-blur", func) or focus.on("widget-focus", ...) to monitor when
		//		when widgets become active/inactive
		//
		//		Finally, focus(node) will focus a node, suppressing errors if the node doesn't exist.

		// curNode: DomNode
		//		Currently focused item on screen
		curNode: null,

		// activeStack: dijit._Widget[]
		//		List of currently active widgets (focused widget and it's ancestors)
		activeStack: [],

		registerIframe: function(iframe){
			// summary:
			//		Registers listeners on the specified iframe so that any click
			//		or focus event on that iframe (or anything in it) is reported
			//		as a focus/click event on the <iframe> itself.
			// description:
			//		Currently only used by editor.
			// returns:
			//		Handle with remove() method to deregister.
		},

		registerWin: function(targetWindow, effectiveNode){
			// summary:
			//		Registers listeners on the specified window (either the main
			//		window or an iframe's window) to detect when the user has clicked somewhere
			//		or focused somewhere.
			// description:
			//		Users should call registerIframe() instead of this method.
			// targetWindow: Window?
			//		If specified this is the window associated with the iframe,
			//		i.e. iframe.contentWindow.
			// effectiveNode: DOMNode?
			//		If specified, report any focus events inside targetWindow as
			//		an event on effectiveNode, rather than on evt.target.
			// returns:
			//		Handle with remove() method to deregister.
		}
	};
=====*/

	var FocusManager = declare([Stateful, Evented], {
		// curNode: DomNode
		//		Currently focused item on screen
		curNode: null,

		// activeStack: dijit._Widget[]
		//		List of currently active widgets (focused widget and it's ancestors)
		activeStack: [],

		constructor: function(){
			// Don't leave curNode/prevNode pointing to bogus elements
			var check = lang.hitch(this, function(node){
				if(dom.isDescendant(this.curNode, node)){
					this.set("curNode", null);
				}
				if(dom.isDescendant(this.prevNode, node)){
					this.set("prevNode", null);
				}
			});
			aspect.before(domConstruct, "empty", check);
			aspect.before(domConstruct, "destroy", check);
		},

		registerIframe: function(/*DomNode*/ iframe){
			// summary:
			//		Registers listeners on the specified iframe so that any click
			//		or focus event on that iframe (or anything in it) is reported
			//		as a focus/click event on the <iframe> itself.
			// description:
			//		Currently only used by editor.
			// returns:
			//		Handle with remove() method to deregister.
			return this.registerWin(iframe.contentWindow, iframe);
		},

		registerWin: function(/*Window?*/targetWindow, /*DomNode?*/ effectiveNode){
			// summary:
			//		Registers listeners on the specified window (either the main
			//		window or an iframe's window) to detect when the user has clicked somewhere
			//		or focused somewhere.
			// description:
			//		Users should call registerIframe() instead of this method.
			// targetWindow:
			//		If specified this is the window associated with the iframe,
			//		i.e. iframe.contentWindow.
			// effectiveNode:
			//		If specified, report any focus events inside targetWindow as
			//		an event on effectiveNode, rather than on evt.target.
			// returns:
			//		Handle with remove() method to deregister.

			// TODO: make this function private in 2.0; Editor/users should call registerIframe(),

			var _this = this;
			var mousedownListener = function(evt){
				_this._justMouseDowned = true;
				setTimeout(function(){ _this._justMouseDowned = false; }, 0);

				// workaround weird IE bug where the click is on an orphaned node
				// (first time clicking a Select/DropDownButton inside a TooltipDialog)
				if(has("ie") && evt && evt.srcElement && evt.srcElement.parentNode == null){
					return;
				}

				_this._onTouchNode(effectiveNode || evt.target || evt.srcElement, "mouse");
			};

			// Listen for blur and focus events on targetWindow's document.
			// IIRC, I'm using attachEvent() rather than dojo.connect() because focus/blur events don't bubble
			// through dojo.connect(), and also maybe to catch the focus events early, before onfocus handlers
			// fire.
			// Connect to <html> (rather than document) on IE to avoid memory leaks, but document on other browsers because
			// (at least for FF) the focus event doesn't fire on <html> or <body>.
			var doc = has("ie") ? targetWindow.document.documentElement : targetWindow.document;
			if(doc){
				if(has("ie")){
					targetWindow.document.body.attachEvent('onmousedown', mousedownListener);
					var activateListener = function(evt){
						// IE reports that nodes like <body> have gotten focus, even though they have tabIndex=-1,
						// ignore those events
						var tag = evt.srcElement.tagName.toLowerCase();
						if(tag == "#document" || tag == "body"){ return; }

						// Previous code called _onTouchNode() for any activate event on a non-focusable node.   Can
						// probably just ignore such an event as it will be handled by onmousedown handler above, but
						// leaving the code for now.
						if(a11y.isTabNavigable(evt.srcElement)){
							_this._onFocusNode(effectiveNode || evt.srcElement);
						}else{
							_this._onTouchNode(effectiveNode || evt.srcElement);
						}
					};
					doc.attachEvent('onactivate', activateListener);
					var deactivateListener =  function(evt){
						_this._onBlurNode(effectiveNode || evt.srcElement);
					};
					doc.attachEvent('ondeactivate', deactivateListener);

					return {
						remove: function(){
							targetWindow.document.detachEvent('onmousedown', mousedownListener);
							doc.detachEvent('onactivate', activateListener);
							doc.detachEvent('ondeactivate', deactivateListener);
							doc = null;	// prevent memory leak (apparent circular reference via closure)
						}
					};
				}else{
					doc.body.addEventListener('mousedown', mousedownListener, true);
					doc.body.addEventListener('touchstart', mousedownListener, true);
					var focusListener = function(evt){
						_this._onFocusNode(effectiveNode || evt.target);
					};
					doc.addEventListener('focus', focusListener, true);
					var blurListener = function(evt){
						_this._onBlurNode(effectiveNode || evt.target);
					};
					doc.addEventListener('blur', blurListener, true);

					return {
						remove: function(){
							doc.body.removeEventListener('mousedown', mousedownListener, true);
							doc.body.removeEventListener('touchstart', mousedownListener, true);
							doc.removeEventListener('focus', focusListener, true);
							doc.removeEventListener('blur', blurListener, true);
							doc = null;	// prevent memory leak (apparent circular reference via closure)
						}
					};
				}
			}
		},

		_onBlurNode: function(/*DomNode*/ /*===== node =====*/){
			// summary:
			// 		Called when focus leaves a node.
			//		Usually ignored, _unless_ it *isn't* followed by touching another node,
			//		which indicates that we tabbed off the last field on the page,
			//		in which case every widget is marked inactive
			this.set("prevNode", this.curNode);
			this.set("curNode", null);

			if(this._justMouseDowned){
				// the mouse down caused a new widget to be marked as active; this blur event
				// is coming late, so ignore it.
				return;
			}

			// if the blur event isn't followed by a focus event then mark all widgets as inactive.
			if(this._clearActiveWidgetsTimer){
				clearTimeout(this._clearActiveWidgetsTimer);
			}
			this._clearActiveWidgetsTimer = setTimeout(lang.hitch(this, function(){
				delete this._clearActiveWidgetsTimer;
				this._setStack([]);
				this.prevNode = null;
			}), 100);
		},

		_onTouchNode: function(/*DomNode*/ node, /*String*/ by){
			// summary:
			//		Callback when node is focused or mouse-downed
			// node:
			//		The node that was touched.
			// by:
			//		"mouse" if the focus/touch was caused by a mouse down event

			// ignore the recent blurNode event
			if(this._clearActiveWidgetsTimer){
				clearTimeout(this._clearActiveWidgetsTimer);
				delete this._clearActiveWidgetsTimer;
			}

			// compute stack of active widgets (ex: ComboButton --> Menu --> MenuItem)
			var newStack=[];
			try{
				while(node){
					var popupParent = domAttr.get(node, "dijitPopupParent");
					if(popupParent){
						node=registry.byId(popupParent).domNode;
					}else if(node.tagName && node.tagName.toLowerCase() == "body"){
						// is this the root of the document or just the root of an iframe?
						if(node === win.body()){
							// node is the root of the main document
							break;
						}
						// otherwise, find the iframe this node refers to (can't access it via parentNode,
						// need to do this trick instead). window.frameElement is supported in IE/FF/Webkit
						node=winUtils.get(node.ownerDocument).frameElement;
					}else{
						// if this node is the root node of a widget, then add widget id to stack,
						// except ignore clicks on disabled widgets (actually focusing a disabled widget still works,
						// to support MenuItem)
						var id = node.getAttribute && node.getAttribute("widgetId"),
							widget = id && registry.byId(id);
						if(widget && !(by == "mouse" && widget.get("disabled"))){
							newStack.unshift(id);
						}
						node=node.parentNode;
					}
				}
			}catch(e){ /* squelch */ }

			this._setStack(newStack, by);
		},

		_onFocusNode: function(/*DomNode*/ node){
			// summary:
			//		Callback when node is focused

			if(!node){
				return;
			}

			if(node.nodeType == 9){
				// Ignore focus events on the document itself.  This is here so that
				// (for example) clicking the up/down arrows of a spinner
				// (which don't get focus) won't cause that widget to blur. (FF issue)
				return;
			}

			this._onTouchNode(node);

			if(node == this.curNode){ return; }
			this.set("curNode", node);
		},

		_setStack: function(/*String[]*/ newStack, /*String*/ by){
			// summary:
			//		The stack of active widgets has changed.  Send out appropriate events and records new stack.
			// newStack:
			//		array of widget id's, starting from the top (outermost) widget
			// by:
			//		"mouse" if the focus/touch was caused by a mouse down event

			var oldStack = this.activeStack;
			this.set("activeStack", newStack);

			// compare old stack to new stack to see how many elements they have in common
			for(var nCommon=0; nCommon<Math.min(oldStack.length, newStack.length); nCommon++){
				if(oldStack[nCommon] != newStack[nCommon]){
					break;
				}
			}

			var widget;
			// for all elements that have gone out of focus, set focused=false
			for(var i=oldStack.length-1; i>=nCommon; i--){
				widget = registry.byId(oldStack[i]);
				if(widget){
					widget._hasBeenBlurred = true;		// TODO: used by form widgets, should be moved there
					widget.set("focused", false);
					if(widget._focusManager == this){
						widget._onBlur(by);
					}
					this.emit("widget-blur", widget, by);
				}
			}

			// for all element that have come into focus, set focused=true
			for(i=nCommon; i<newStack.length; i++){
				widget = registry.byId(newStack[i]);
				if(widget){
					widget.set("focused", true);
					if(widget._focusManager == this){
						widget._onFocus(by);
					}
					this.emit("widget-focus", widget, by);
				}
			}
		},

		focus: function(node){
			// summary:
			//		Focus the specified node, suppressing errors if they occur
			if(node){
				try{ node.focus(); }catch(e){/*quiet*/}
			}
		}
	});

	var singleton = new FocusManager();

	// register top window and all the iframes it contains
	ready(function(){
		var handle = singleton.registerWin(win.doc.parentWindow || win.doc.defaultView);
		if(has("ie")){
			unload.addOnWindowUnload(function(){
				handle.remove();
				handle = null;
			})
		}
	});

	// Setup dijit.focus as a pointer to the singleton but also (for backwards compatibility)
	// as a function to set focus.
	dijit.focus = function(node){
		singleton.focus(node);	// indirection here allows dijit/_base/focus.js to override behavior
	};
	for(var attr in singleton){
		if(!/^_/.test(attr)){
			dijit.focus[attr] = typeof singleton[attr] == "function" ? lang.hitch(singleton, attr) : singleton[attr];
		}
	}
	singleton.watch(function(attr, oldVal, newVal){
		dijit.focus[attr] = newVal;
	});

	return singleton;
});

},
'dojo/i18n':function(){
define("dojo/i18n", ["./_base/kernel", "require", "./has", "./_base/array", "./_base/config", "./_base/lang", "./_base/xhr"],
	function(dojo, require, has, array, config, lang, xhr) {
	// module:
	//		dojo/i18n
	// summary:
	//		This module implements the !dojo/i18n plugin and the v1.6- i18n API
	// description:
	//		We choose to include our own plugin to leverage functionality already contained in dojo
	//		and thereby reduce the size of the plugin compared to various loader implementations. Also, this
	//		allows foreign AMD loaders to be used without their plugins.
	var
		thisModule= dojo.i18n=
			// the dojo.i18n module
			{},

		nlsRe=
			// regexp for reconstructing the master bundle name from parts of the regexp match
			// nlsRe.exec("foo/bar/baz/nls/en-ca/foo") gives:
			// ["foo/bar/baz/nls/en-ca/foo", "foo/bar/baz/nls/", "/", "/", "en-ca", "foo"]
			// nlsRe.exec("foo/bar/baz/nls/foo") gives:
			// ["foo/bar/baz/nls/foo", "foo/bar/baz/nls/", "/", "/", "foo", ""]
			// so, if match[5] is blank, it means this is the top bundle definition.
			// courtesy of http://requirejs.org
			/(^.*(^|\/)nls)(\/|$)([^\/]*)\/?([^\/]*)/,

		getAvailableLocales= function(
			root,
			locale,
			bundlePath,
			bundleName
		){
			// return a vector of module ids containing all available locales with respect to the target locale
			// For example, assuming:
			//	 * the root bundle indicates specific bundles for "fr" and "fr-ca",
			//	 * bundlePath is "myPackage/nls"
			//	 * bundleName is "myBundle"
			// Then a locale argument of "fr-ca" would return
			//	 ["myPackage/nls/myBundle", "myPackage/nls/fr/myBundle", "myPackage/nls/fr-ca/myBundle"]
			// Notice that bundles are returned least-specific to most-specific, starting with the root.
			//
			// If root===false indicates we're working with a pre-AMD i18n bundle that doesn't tell about the available locales;
			// therefore, assume everything is available and get 404 errors that indicate a particular localization is not available
			//

			for(var result= [bundlePath + bundleName], localeParts= locale.split("-"), current= "", i= 0; i<localeParts.length; i++){
				current+= (current ? "-" : "") + localeParts[i];
				if(!root || root[current]){
					result.push(bundlePath + current + "/" + bundleName);
				}
			}
			return result;
		},

		cache= {},

		getL10nName= dojo.getL10nName = function(moduleName, bundleName, locale){
			locale = locale ? locale.toLowerCase() : dojo.locale;
			moduleName = "dojo/i18n!" + moduleName.replace(/\./g, "/");
			bundleName = bundleName.replace(/\./g, "/");
			return (/root/i.test(locale)) ?
				(moduleName + "/nls/" + bundleName) :
				(moduleName + "/nls/" + locale + "/" + bundleName);
		},

		doLoad = function(require, bundlePathAndName, bundlePath, bundleName, locale, load){
			// get the root bundle which instructs which other bundles are required to construct the localized bundle
			require([bundlePathAndName], function(root){
				var
					current= cache[bundlePathAndName + "/"]= lang.clone(root.root),
					availableLocales= getAvailableLocales(!root._v1x && root, locale, bundlePath, bundleName);
				require(availableLocales, function(){
					for (var i= 1; i<availableLocales.length; i++){
						cache[availableLocales[i]]= current= lang.mixin(lang.clone(current), arguments[i]);
					}
					// target may not have been resolve (e.g., maybe only "fr" exists when "fr-ca" was requested)
					var target= bundlePathAndName + "/" + locale;
					cache[target]= current;
					load && load(lang.delegate(current));
				});
			});
		},

		normalize = function(id, toAbsMid){
			// note: id may be relative
			var match= nlsRe.exec(id),
				bundlePath= match[1];
			return /^\./.test(bundlePath) ? toAbsMid(bundlePath) + "/" +  id.substring(bundlePath.length) : id;
		},

		checkForLegacyModules = function(){},

		load = function(id, require, load){
			// note: id is always absolute
			var
				match= nlsRe.exec(id),
				bundlePath= match[1] + "/",
				bundleName= match[5] || match[4],
				bundlePathAndName= bundlePath + bundleName,
				localeSpecified = (match[5] && match[4]),
				targetLocale=  localeSpecified || dojo.locale,
				target= bundlePathAndName + "/" + targetLocale;

			if(localeSpecified){
				checkForLegacyModules(target);
				if(cache[target]){
					// a request for a specific local that has already been loaded; just return it
					load(cache[target]);
				}else{
					// a request for a specific local that has not been loaded; load and return just that locale
					doLoad(require, bundlePathAndName, bundlePath, bundleName, targetLocale, load);
				}
				return;
			}// else a non-locale-specific request; therefore always load dojo.locale + config.extraLocale

			// notice the subtle algorithm that loads targetLocal last, which is the only doLoad application that passes a value for the load callback
			// this makes the sync loader follow a clean code path that loads extras first and then proceeds with tracing the current deps graph
			var extra = config.extraLocale || [];
			extra = lang.isArray(extra) ? extra : [extra];
			extra.push(targetLocale);
			var remaining = extra.length,
				targetBundle;
			array.forEach(extra, function(locale){
				doLoad(require, bundlePathAndName, bundlePath, bundleName, locale, function(bundle){
					if(locale == targetLocale){
						targetBundle = bundle;
					}
					if(!--remaining){
						load(targetBundle);
					}
				});
			});
		};

	if(has("dojo-unit-tests")){
		var unitTests = thisModule.unitTests = [];
	}

	true || has.add("dojo-v1x-i18n-Api",
		// if true, define the v1.x i18n functions
		1
	);

	if(1){
		var
			__evalError = {},

			evalBundle=
				// use the function ctor to keep the minifiers away and come close to global scope
				// if bundle is an AMD bundle, then __amdResult will be defined; otherwise it's a pre-amd bundle and the bundle value is returned by eval
				new Function("bundle, __evalError",
					"var __amdResult, define = function(x){__amdResult= x;};" +
					"return [(function(){" +
								"try{eval(arguments[0]);}catch(e){}" +
								"if(__amdResult)return 0;" +
								"try{return eval('('+arguments[0]+')');}" +
								"catch(e){__evalError.e = e; return __evalError;}" +
							"})(arguments[0]) , __amdResult];"
				),

			fixup= function(url, preAmdResult, amdResult){
				// nls/<locale>/<bundle-name> indicates not the root.
				if(preAmdResult===__evalError){
					console.error("failed to evaluate i18n bundle; url=" + url, __evalError.e);
					return {};
				}
				return preAmdResult ? (/nls\/[^\/]+\/[^\/]+$/.test(url) ? preAmdResult : {root:preAmdResult, _v1x:1}) : amdResult;
			},

			syncRequire= function(deps, callback){
				var results= [];
				array.forEach(deps, function(mid){
					var url= require.toUrl(mid + ".js");
					if(cache[url]){
						results.push(cache[url]);
					}else{

						try {
							var bundle= require(mid);
							if(bundle){
								results.push(bundle);
								return;
							}
						}catch(e){}

						xhr.get({
							url:url,
							sync:true,
							load:function(text){
								var result = evalBundle(text, __evalError);
								results.push(cache[url]= fixup(url, result[0], result[1]));
							},
							error:function(){
								results.push(cache[url]= {});
							}
						});
					}
				});
				callback && callback.apply(null, results);
			},

			normalizeLocale = thisModule.normalizeLocale= function(locale){
				var result = locale ? locale.toLowerCase() : dojo.locale;
				if(result == "root"){
					result = "ROOT";
				}
				return result;
			},

			forEachLocale = function(locale, func){
				// this function is equivalent to v1.6 dojo.i18n._searchLocalePath with down===true
				var parts = locale.split("-");
				while(parts.length){
					if(func(parts.join("-"))){
						return true;
					}
					parts.pop();
				}
				return func("ROOT");
			};

		checkForLegacyModules = function(target){
			// legacy code may have already loaded [e.g] the raw bundle x/y/z at x.y.z; when true, push into the cache
			for(var names = target.split("/"), object = dojo.global[names[0]], i = 1; object && i<names.length; object = object[names[i++]]){}
			if(object){
				cache[target] = object;
			}
		};

		thisModule.getLocalization= function(moduleName, bundleName, locale){
			var result,
				l10nName= getL10nName(moduleName, bundleName, locale).substring(10);
			load(l10nName, (1 && !require.isXdUrl(require.toUrl(l10nName + ".js")) ? syncRequire : require), function(result_){ result= result_; });
			return result;
		};

		thisModule._preloadLocalizations = function(/*String*/bundlePrefix, /*Array*/localesGenerated){
			//	summary:
			//		Load built, flattened resource bundles, if available for all
			//		locales used in the page. Only called by built layer files.
			//
			//  note: this function a direct copy of v1.6 function of same name

			function preload(locale){
				locale = normalizeLocale(locale);
				forEachLocale(locale, function(loc){
					for(var i=0; i<localesGenerated.length;i++){
						if(localesGenerated[i] == loc){
							syncRequire([bundlePrefix.replace(/\./g, "/")+"_"+loc]);
							return true; // Boolean
						}
					}
					return false; // Boolean
				});
			}
			preload();
			var extra = dojo.config.extraLocale||[];
			for(var i=0; i<extra.length; i++){
				preload(extra[i]);
			}
		};

		if(has("dojo-unit-tests")){
			unitTests.push(function(doh){
				doh.register("tests.i18n.unit", function(t){
					var check;

					check = evalBundle("{prop:1}", __evalError);
					t.is({prop:1}, check[0]); t.is(undefined, check[1]);

					check = evalBundle("({prop:1})", __evalError);
					t.is({prop:1}, check[0]); t.is(undefined, check[1]);

					check = evalBundle("{'prop-x':1}", __evalError);
					t.is({'prop-x':1}, check[0]); t.is(undefined, check[1]);

					check = evalBundle("({'prop-x':1})", __evalError);
					t.is({'prop-x':1}, check[0]); t.is(undefined, check[1]);

					check = evalBundle("define({'prop-x':1})", __evalError);
					t.is(0, check[0]); t.is({'prop-x':1}, check[1]);

					check = evalBundle("define({'prop-x':1});", __evalError);
					t.is(0, check[0]); t.is({'prop-x':1}, check[1]);

					check = evalBundle("this is total nonsense and should throw an error", __evalError);
					t.is(__evalError, check[0]); t.is(undefined, check[1]);
					t.is({}, fixup("some/url", check[0], check[1]));
				});
			});
		}
	}

	return lang.mixin(thisModule, {
		dynamic:true,
		normalize:normalize,
		load:load,
		cache:function(mid, value){
			cache[mid] = value;
		}
	});
});

},
'dijit/hccss':function(){
define("dijit/hccss", [
	"require",			// require.toUrl
	"dojo/_base/config", // config.blankGif
	"dojo/dom-class", // domClass.add domConstruct.create domStyle.getComputedStyle
	"dojo/dom-construct", // domClass.add domConstruct.create domStyle.getComputedStyle
	"dojo/dom-style", // domClass.add domConstruct.create domStyle.getComputedStyle
	"dojo/ready", // ready
	"dojo/_base/sniff", // has("ie") has("mozilla")
	"dojo/_base/window" // win.body
], function(require, config, domClass, domConstruct, domStyle, ready, has, win){

	// module:
	//		dijit/hccss
	// summary:
	//		Test if computer is in high contrast mode, and sets dijit_a11y flag on <body> if it is.

	if(has("ie") || has("mozilla")){	// NOTE: checking in Safari messes things up
		// priority is 90 to run ahead of parser priority of 100
		ready(90, function(){
			// summary:
			//		Detects if we are in high-contrast mode or not

			// create div for testing if high contrast mode is on or images are turned off
			var div = domConstruct.create("div",{
				id: "a11yTestNode",
				style:{
					cssText:'border: 1px solid;'
						+ 'border-color:red green;'
						+ 'position: absolute;'
						+ 'height: 5px;'
						+ 'top: -999px;'
						+ 'background-image: url("' + (config.blankGif || require.toUrl("dojo/resources/blank.gif")) + '");'
				}
			}, win.body());

			// test it
			var cs = domStyle.getComputedStyle(div);
			if(cs){
				var bkImg = cs.backgroundImage;
				var needsA11y = (cs.borderTopColor == cs.borderRightColor) || (bkImg != null && (bkImg == "none" || bkImg == "url(invalid-url:)" ));
				if(needsA11y){
					domClass.add(win.body(), "dijit_a11y");
				}
				if(has("ie")){
					div.outerHTML = "";		// prevent mixed-content warning, see http://support.microsoft.com/kb/925014
				}else{
					win.body().removeChild(div);
				}
			}
		});
	}
});

},
'versa/widget/zone/mobile/Show':function(){
/**
 * Created by JetBrains RubyMine.
 * User: aarons
 * Date: 23/05/12
 * Time: 9:32 AM
 * To change this template use File | Settings | File Templates.
 */


define("versa/widget/zone/mobile/Show", ["dojo/_base/declare",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dojox/mobile/Heading",
         "dojox/mobile/ScrollableView",
         "dojox/mobile/EdgeToEdgeDataList",
         "dojox/mobile/TabBar",
         "dojox/mobile/TabBarButton",
         "versa/api/Folders",
         "versa/api/Documents",
         "versa/api/Zones",
         "versa/widget/folder/mobile/FolderView",
         "versa/widget/document/mobile/DocumentPropertyView",
         "versa/widget/document/mobile/DocumentContentView",
         "versa/widget/document/mobile/LargeTextView",
         "versa/widget/search/mobile/SearchView",
         "versa/widget/search/mobile/SearchResultsView",
         "versa/widget/mobile/TextBox",
         "versa/widget/mobile/Heading",
         "versa/widget/mobile/Footing",
         "dojox/mobile/Button",
         "dojo/data/ItemFileWriteStore"],
    function(declare){
        var o=declare("versa.widget.zone.mobile.Show", [dijit._WidgetBase], {
            folderViews: [],
            documentViews: [],
            documentContentViews: [],
            textViews: [],

            constructor: function(args){
                this.zone=args.zone;
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);
                this.folderStore=this.activeLibrary.getFolders().store;
                this.refStore=this.activeLibrary.getReferences().store;
                this.rootFolder=this.folderStore.fetch({query:{parent_id: null}}).results[0];
                this.loadingView=dijit.byId('loadingView');
                this.onLoad(this);
            },

            onCommand: function(cmd, args){
                switch(cmd){
                    case versa.widget.zone.mobile.Show.COMMANDS.SHOW_FOLDER:
                        this.showFolder(args.parent, args.folder);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_PROPERTIES:
                        this.showDocumentProperties(args.from, args.reference);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_CONTENT:
                        this.showDocumentContent(args.document, args.reference);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.SHOW_TEXT:
                        this.showText(args.document, args.property, args.label);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.SHOW_ROOT:
                        this.showRoot(args.from);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.SHOW_SEARCH:
                        this.showSearch(args.from);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.PERFORM_SEARCH:
                        this.performSearch(args.search);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.LOGOFF:
                        this.logoff(args.from);
                    break;
                }
            },

            logoff: function(from){
                var doConfirm = true;

                if(doConfirm){
                    var msg = 'Continue to exit VersaFile?';
                    if(!confirm(msg))
                        return;
                }

                var prog=dojox.mobile.ProgressIndicator.getInstance();
                this.loadingView.domNode.appendChild(prog.domNode);
                prog.start();
                from.performTransition(this.loadingView.id, 1, "fade");

                this.zone.logoff();
                window.location.reload(true);
            },

            showRoot: function(from){
                from.performTransition("folder-"+this.rootFolder.id, -1, "slidev");
            },

            showSearch: function(from){
                this.searchView.set("back", from.id);
                from.performTransition("searchView", 1, "slidev");
                this.searchView.findAppBars();
                this.searchView.resize();
            },

            performSearch: function(search){
                this.searchResultsView.set('search', search);
                this.searchView.performTransition("searchResultsView", 1, "slide");
                this.searchResultsView.findAppBars();
                this.searchResultsView.resize();
            },

            showFolder: function(parent, folder){
                if(!this.folderViews[folder.id]){
                    this.folderViews[folder.id]=new versa.widget.folder.mobile.FolderView({
                        id: "folder-"+folder.id,
                        back: "folder-"+parent.id,
                        library: this.activeLibrary,
                        folder: folder,
                        onCommand: dojo.hitch(this, this.onCommand),
                        selected: true
                    }, dojo.create("div", {style: {height: "100%"}}, dojo.body()));
                    this.folderViews[folder.id].startup();
                }
                this.folderViews[parent.id].performTransition("folder-"+folder.id, 1, "slide");
                this.folderViews[folder.id].findAppBars();
                this.folderViews[folder.id].resize();

            },

            showText: function(document, property, label){
                if(!this.textViews[document.id+"-"+property]){
                    this.textViews[document.id+"-"+property]=new versa.widget.document.mobile.LargeTextView({
                        id: "document-"+document.id+"-"+property,
                        back: "document-"+document.id,
                        label: label,
                        library: this.activeLibrary,
                        document: document,
                        property: property,
                        onCommand: dojo.hitch(this, this.onCommand),
                        selected: true
                    }, dojo.create("div", {style: {height: "100%"}}, dojo.body()));
                    this.textViews[document.id+"-"+property].startup();
                }
                this.documentViews[document.id].performTransition("document-"+document.id+"-"+property, 1, "slide");
                this.textViews[document.id+"-"+property].findAppBars();
                this.textViews[document.id+"-"+property].resize();
            },

            showDocumentProperties: function(from, reference){

                this.activeLibrary.getDocuments().refreshAsync({
                    scope: this,
                    identity: reference.document_id,
                    onItem: dojo.hitch(this, function(document){
                        if(!this.documentViews[document.id]){
                            this.documentViews[document.id]=new versa.widget.document.mobile.DocumentPropertyView({
                                id: "document-"+document.id,
                                library: this.activeLibrary,
                                reference: reference,
                                document: document,
                                onCommand: dojo.hitch(this, this.onCommand),
                                selected: true
                            }, dojo.create("div", {style: {height: "100%"}}, dojo.body()));
                            this.documentViews[document.id].startup();
                        }
                        this.documentViews[document.id].set('back', from.id);
                        from.performTransition("document-"+document.id, 1, "slide");
                        this.documentViews[document.id].findAppBars();
                        this.documentViews[document.id].resize();
                    }),
                    onError: this.__onDocumentLoadError
                });
            },

            showDocumentContent: function(document, reference){
                if(reference.binary_content_type.indexOf('image')>=0||reference.binary_content_type.indexOf('text')>=0){
                    if(!this.documentContentViews[reference.document_id]){
                        this.documentContentViews[reference.document_id]=new versa.widget.document.mobile.DocumentContentView({
                            id: "document-content-"+reference.document_id,
                            back: "document-"+reference.document_id,
                            zone: this.zone,
                            library: this.activeLibrary,
                            document: document,
                            reference: reference,
                            onCommand: dojo.hitch(this, this.onCommand),
                            selected: true
                        }, dojo.create("div", {style: {height: "100%"}}, dojo.body()));
                        this.documentContentViews[reference.document_id].startup();
                    }
                    this.documentViews[reference.document_id].performTransition("document-content-"+reference.document_id, 1, "slide");
                    this.documentContentViews[reference.document_id].findAppBars();
                    this.documentContentViews[reference.document_id].resize();
                }else{
                    var file=reference.getCopyUrl(this.zone, this.activeLibrary);
                    this.downloadUrl(file);
                }



            },

            downloadUrl: function(url)
            {
                window.location.href=url;
            },


            startup: function(){
                this.inherited('startup', arguments);

                this.searchView=new versa.widget.search.mobile.SearchView({
                    id: "searchView",
                    back: "folder-"+this.rootFolder.id,
                    onCommand: dojo.hitch(this, this.onCommand)
                }, dojo.create("div", {style: {height: "100%", width: "100%"}}, dojo.body()));
                this.searchView.startup();

                this.searchResultsView=new versa.widget.search.mobile.SearchResultsView({
                    id: "searchResultsView",
                    zone: this.zone,
                    library: this.activeLibrary,
                    back: "searchView",
                    view_id: this.rootFolder.view_definition_id,
                    onCommand: dojo.hitch(this, this.onCommand)
                }, dojo.create("div", {style: {height: "100%", width: "100%"}}, dojo.body()));
                this.searchResultsView.startup();

                this.folderViews[this.rootFolder.id]=new versa.widget.folder.mobile.FolderView({
                    id: "folder-"+this.rootFolder.id,
                    library: this.activeLibrary,
                    folder: this.rootFolder,
                    onCommand: dojo.hitch(this, this.onCommand),
                    selected: true
                }, dojo.create("div", {style: {height: "100%", width: "100%"}}, dojo.body()));
                this.folderViews[this.rootFolder.id].startup();

                this.loadingView.performTransition(this.folderViews[this.rootFolder.id].id, 1, "fade");
                this.folderViews[this.rootFolder.id].findAppBars();
                this.folderViews[this.rootFolder.id].resize();

            }
        });

        o.COMMANDS={
            SHOW_FOLDER:                0x0000,
            SHOW_ROOT:                  0x0001,
            SHOW_DOCUMENT_PROPERTIES:   0x0002,
            SHOW_DOCUMENT_CONTENT:      0x0003,
            SHOW_TEXT:                  0x0004,
            SHOW_SEARCH:                0x0005,
            PERFORM_SEARCH:             0x0006,
            LOGOFF:                     0x0007
        };

        return o;
    }
);


},
'dojox/mobile/EdgeToEdgeDataList':function(){
define("dojox/mobile/EdgeToEdgeDataList", [
	"dojo/_base/declare",
	"./EdgeToEdgeList",
	"./_DataListMixin"
], function(declare, EdgeToEdgeList, DataListMixin){

/*=====
	var EdgeToEdgeList = dojox.mobile.EdgeToEdgeList;
	var DataListMixin = dojox.mobile._DataListMixin;
=====*/

	// module:
	//		dojox/mobile/EdgeToEdgeDataList
	// summary:
	//		An enhanced version of EdgeToEdgeList.

	return declare("dojox.mobile.EdgeToEdgeDataList", [EdgeToEdgeList, DataListMixin],{
		// summary:
		//		An enhanced version of EdgeToEdgeList.
		// description:
		//		EdgeToEdgeDataList is an enhanced version of EdgeToEdgeList. It
		//		can generate ListItems according to the given dojo.data store.
	});
});

},
'dojox/mobile/uacss':function(){
define("dojox/mobile/uacss", [
	"dojo/_base/kernel",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojox/mobile/sniff"
], function(dojo, lang, win, has){
	win.doc.documentElement.className += lang.trim([
		has("bb") ? "dj_bb" : "",
		has("android") ? "dj_android" : "",
		has("iphone") ? "dj_iphone" : "",
		has("ipod") ? "dj_ipod" : "",
		has("ipad") ? "dj_ipad" : ""
	].join(" ").replace(/ +/g," "));
	return dojo;
});

},
'versa/api/DataType':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/11/11
 * Time: 2:46 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/DataType", ["dojo/_base/declare"],
    function(declare){
        var o=declare("versa.api.DataType", [], {
            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            defaultMaxLength: function(){
                var max_length = null;

                switch(this.prefix){
                    case 'str':
                        max_length = 255;
                        break;
                    case 'txt':
                        max_length = 4096;
                        break;
                }

                return max_length;

            },

            isBoolean: function(){
                return (this.prefix == 'bln');
            },

            isDateTime: function(){
                return (this.prefix == 'dtt');
            },

            isFloat: function(){
                return (this.prefix == 'flt');
            },

            isInteger: function(){
                return (this.prefix == 'int');
            },

            isString: function(){
                return (this.prefix == 'str');
            },

            isText: function(){
                return (this.prefix == 'txt');
            }
        });

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'prefix': {
                    type: 'string'
                }
            },
            prototype: new o()
        };

        return o;
    }
);


},
'versa/api/Zones':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/09/11
 * Time: 4:08 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Zones", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Zone"],
    function(declare){
        var o=declare("versa.api.Zones", [versa.api._Collection], {
            /**
             * Creates a new instance of versa.api.Libraries
             * @constructor
             */
            constructor: function(args){
                this.target = versa.api.Zones.TRGT;
                this.schema = versa.api.Zone.schema;
                this.cache = true;

                this._initialize();
            }

        });

        o.TRGT = '/zones';

        return o;
    }
);


},
'versa/api/Search':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 21/11/11
 * Time: 2:41 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Search", ["dojo/_base/declare",
         "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.Search", [versa.api._Object], {
            type: 0,
            queryData: null,
            view_definition_id: null,

            _getAdvancedQuery: function(){
                return {
                    type: this.type,
                    query: dojo.toJson(this.queryData),
                    view: this.view_definition_id
                }
            },

            _getFolderQuery: function(){
                return {
                    type: this.type,
                    query: this.queryData,
                    view: this.view_definition_id
                }
            },

            _getSimpleQuery: function(){
                return {
                    type: this.type,
                    query: this.queryData,
                    view: this.view_definition_id
                }
            },

            constructor: function(args){
                declare.safeMixin(this, ((!args) ? { } : args))
            },

            getQuery: function(){

                var query = { type: bfree.api.Search.types.NONE };

                switch(this.type){
                    case bfree.api.Search.types.FOLDER:
                    case bfree.api.Search.types.TRASH:
                        query = this._getFolderQuery();
                        break;
                    case bfree.api.Search.types.SIMPLE:
                        query = this._getSimpleQuery();
                        break;
                    case bfree.api.Search.types.ADVANCED:
                        query = this._getAdvancedQuery();
                        break;
                    case bfree.api.Search.types.TRASH:
                        break;
                }

                return query;
            }
        });

        o.types =  {
            'NONE':     0x00,
            'FOLDER':   0x01,
            'SIMPLE':   0x02,
            'ADVANCED': 0x03,
            'TRASH':    0x04
        };

        return o;
    }
);






},
'versa/api/_Object':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 26/09/11
 * Time: 10:47 AM
 * To change this template use File | Settings | File Templates.
 */

define("versa/api/_Object", ["dojo/_base/declare"],
    function(declare){
        return declare("versa.api._Object", [], {
            id: null,
            name: null,
            created_at: null,
            created_by: null,
            updated_at: null,
            updated_by: null,

            constructor: function(args){

                if((this.created_at != null) && (typeof this.created_at == 'string'))
                    this.created_at = dojo.date.stamp.fromISOString(this.created_at);
                if((this.updated_at != null) && (typeof this.updated_at == 'string'))
                    this.updated_at = dojo.date.stamp.fromISOString(this.created_at);

            },

            valueEquals: function(property, value){

                if(!this.hasOwnProperty(property))
                    return false;

                var myValue = this[property];
                if((myValue == null) && (value == null))
                    return true;

                //in the case of string compare empty string to null = 'true'
                if((typeof myValue == 'string') || (typeof value == 'string')){
                    myValue = (myValue == null) ? '' : myValue;
                    value = (value == null) ? '' : value;
                }

                return (myValue == value);
            },

            getId: function(){
                return (this.$ref ? this.$ref : this.id);
            },

            isNew: function(){
                return ((this.id == undefined) || (this.id == null));
            },

            isValid: function(){
                return true;
            }
        });
    }
);

},
'versa/api/CellDefinition':function(){
/**
 * @author Scott
 */
define("versa/api/CellDefinition", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/Error"],
    function(declare){
        var o=declare("versa.api.CellDefinition", [versa.api._Object], {
            constructor: function(/* Object */args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            }
        });

        o.clone = function(source){
            return new versa.api.CellDefinition({
                column_order: source.column_order,
                table_name: source.table_name,
                column_name: source.column_name,
                label: source.label,
                name: source.name,
                noresize: source.noresize,
                style: source.style,
                width: source.width,
                formatter: source.formatter,
                date_format: source.date_format
            });
        };

        o.compare = function(cellA, cellB){
            return cellA.column_order-cellB.column_order;
        }

        o.getDbName = function(cell_definition){
            return dojo.replace("{table_name}.{column_name}", cell_definition);
        }


        o.formats = {'none': 0, 'icon': 1, 'size': 2, 'status': 4, 'datetime': 8, 'date': 16, 'time': 32};
        o.formatStatus = function(data, rowIndex){
            var item = this.grid.getItem(rowIndex);

            var icon = 'none.16.png';

            try{

                if((item) && (item.getState(versa.api.Document.states.CHECKED_OUT))){
                    icon = 'cko.16.png';
                }

            }
            catch(e){
            }

            return dojo.replace('<img name="statusIcon" src="/images/icons/states/{0}" width="16" height="16" style="position:relative;top:1px;left:1px"/>', [icon]);
        }

        //versa.api.CellDefinition.formatIcon = function(data, rowIndex){
        //    var imgSrc =  versa.api.Document.getIconUrl(data, 16);
        //    return dojo.replace('<img src="{0}" width="16" height="16"/>', [imgSrc]);
        //}
        //
        //versa.api.CellDefinition.formatSize = function(data, rowIndex){
        //
        //	var sizeBytes = data;
        //
        //	return versa.api.Utilities.readablizeBytes({
        //		bytes: sizeBytes
        //	});
        //}

        o.formatIcon = function(data, rowIndex){

            if(!data)
                return '';

            var item = this.grid.getItem(rowIndex);
            var imgSrc =  versa.api.Document.getIconUrl(data, 16);

            var wrapper = dojo.create('div');
            var node = dojo.create('div', { style: {width: 16, height:16, position: 'relative' }}, wrapper);
            dojo.create('img', {src: imgSrc, width: 16, height: 16}, node);

            if(item.isShare()){
                imgSrc = '/images/icons/states/shared.16.png';
                dojo.create('img', {src: imgSrc, width: 16, height: 16, style: {position: 'absolute', top:'2px', left:'2px'}}, node);
            }

            return wrapper.innerHTML;


            /*
            if(data.reference_type == 1)
                dojo.create('img', {src: '/images/icons/states/reference.16.png', style: {position: 'absolute', top: 0, left: 0}}, node);
            */

            //var img = dojo.replace('<img src="{0}" width="16" height="16"/>', [imgSrc]);

            /*
            var gridNode = new bfree.widget.document.DraggableGridItem({
                data: wrapper.innerHTML,
                document: item,
                grid: this.grid
            });

            return gridNode;
            */
        };

        o.formatSize = function(data, rowIndex){

            var sizeBytes = data;

            var bytes = versa.api.Utilities.readablizeBytes({
                bytes: sizeBytes
            });
            return bytes;

            /*
            var item = this.grid.getItem(rowIndex);

            var gridNode=new bfree.widget.document.DraggableGridItem({
                data: bytes,
                document: item,
                grid: this.grid
            });

            return gridNode;
            */
        };

        o.formatData = function(data, rowIndex){

            return data || '';

            /*
            var item = this.grid.getItem(rowIndex);

            var gridNode=new bfree.widget.document.DraggableGridItem({
                data: data==null?'':data,
                document: item,
                grid: this.grid
            });

            return gridNode;
            */
        };

        o.formatBoolean = function(data, rowIndex){
            var wdg=new dijit.form.CheckBox({
                scrollOnFocus: false,
                disabled: true,
                checked: data
            });
            return wdg;
        },

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'view_definition_id':{
                    type: 'integer'
                },
                'table_name': {
                    type: 'string'
                },
                'column_name': {
                    type: 'string'
                },
                'name': {
                    type: 'string'
                },
                'label': {
                    type: 'string'
                },
                'formatter': {
                    type: 'integer',
                    'default': o.formats.none
                },
                'noresize': {
                    type: 'boolean',
                    'default': false
                },
                'width': {
                    type: 'string',
                    'default': '128px'
                },
                'style': {
                    type: 'string',
                    'default': ''
                },
                'column_order': {
                    type: 'integer',
                    'default': 1
                },
                'date_format': {
                    type: 'string',
                    'default': ''
                }
            },
            prototype: new o()
        };

        return o;
    }
);


},
'versa/api/PropertyMapping':function(){
/**
 * @author Scott
 */
define("versa/api/PropertyMapping", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/Error",
        "versa/api/Formatter"],
    function(declare){
        var o=declare("versa.api.PropertyMapping", [versa.api._Object], {
            constructor: function(/* Object */args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            }
        });

        o.compare = function(item1, item2){
            return item1.sort_order-item2.sort_order;
        };

        o.formatValue = function(property_definition, value){
            var frmt_value = null;

            if(property_definition.isTypeDate()){
                frmt_value = versa.api.Formatter.formatDateTime(value);
            }
            else{
                frmt_value = value;
            }

            return frmt_value;
        };

        //leavin this open for other default types
        o.types = {
            date:{
                fixed: 0,
                floating: 1
            }
        };

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'document_type_id': {
                    type: 'integer'
                },
                'property_definition_id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': 'Property'
                },
                'sort_order': {
                    type: 'integer',
                    'default': 1
                },
                'is_required': {
                    type: 'boolean',
                    'default': false
                },
                'choice_list_id': {
                    type: 'integer',
                    'default': null
                },
                'default_value': {
                    type: 'string',
                    'default': null
                },
                'default_type': {
                    type: 'integer',
                    'default': 0
                }
            }
        };

        return o;
    }
);


},
'versa/api/DocumentTypes':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 08/11/11
 * Time: 4:05 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/DocumentTypes", ["dojo/_base/declare",
        "versa/api/DocumentTypes",
        "versa/api/_Collection",
        "versa/api/DocumentType"],
    function(declare){
        var o=declare("versa.api.DocumentTypes", [versa.api._Collection], {
            library: null,

            _isUpdateable: function(request){
                return false;
            },

            //this method prevents sub-objects from being included in the query
            //and being drawn on the grid
            _matchesQuery: function(item,request){

                //query returns array of property mappings,
                //exclude them.
                if(dojo.isArray(item) || (item.hasOwnProperty('sort_order')))
                    return false;

                var query = request.query;
                var ignoreCase = request.queryOptions && request.queryOptions.ignoreCase;
                for(var i in query){
                    // if anything doesn't match, than this should be in the query
                    var match = query[i];
                    var value = this.getValue(item,i);
                    if((typeof match == 'string' && (match.match(/[\*\.]/) || ignoreCase)) ?
                        !dojo.data.util.filter.patternToRegExp(match, ignoreCase).test(value) :
                        value != match){
                        return false;
                    }
                }
                return true;
            },

            constructor: function(args){
                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.DocumentTypes.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.DocumentType.schema;
                this.cache = true;

                this._initialize();
        //        this.store.isUpdateable = dojo.hitch(this, this._isUpdateable);
                this.store.matchesQuery  = dojo.hitch(this, this._matchesQuery);
            },

            getMetrics: function(args){

                var url = dojo.replace(versa.api.DocumentTypes.MT_TRGT,  [args.zone.subdomain, args.library.id]);
                var result = versa.api.XhrHelper.doGetAction({
                    target: url
                });

                return result;
            },

            getSystem: function(){
                var system_types = [];

                this.forEach(function(item){
                    if(item.is_system)
                        system_types.push(item);
                }, this);

                if(system_types.length < 1)
                    throw new Error('No system-defined document types were found');

                return system_types;
            }
        });

        o.TRGT = '/zones/{0}/libraries/{1}/document_types';
        o.MT_TRGT = '/zones/{0}/libraries/{1}/document_types/dtmetrics.json';

        return o;
    }
);


},
'dojo/date/stamp':function(){
define("dojo/date/stamp", ["../_base/kernel", "../_base/lang", "../_base/array"], function(dojo, lang, array) {
	// module:
	//		dojo/date/stamp
	// summary:
	//		TODOC

lang.getObject("date.stamp", true, dojo);

// Methods to convert dates to or from a wire (string) format using well-known conventions

dojo.date.stamp.fromISOString = function(/*String*/formattedString, /*Number?*/defaultTime){
	//	summary:
	//		Returns a Date object given a string formatted according to a subset of the ISO-8601 standard.
	//
	//	description:
	//		Accepts a string formatted according to a profile of ISO8601 as defined by
	//		[RFC3339](http://www.ietf.org/rfc/rfc3339.txt), except that partial input is allowed.
	//		Can also process dates as specified [by the W3C](http://www.w3.org/TR/NOTE-datetime)
	//		The following combinations are valid:
	//
	//			* dates only
	//			|	* yyyy
	//			|	* yyyy-MM
	//			|	* yyyy-MM-dd
	// 			* times only, with an optional time zone appended
	//			|	* THH:mm
	//			|	* THH:mm:ss
	//			|	* THH:mm:ss.SSS
	// 			* and "datetimes" which could be any combination of the above
	//
	//		timezones may be specified as Z (for UTC) or +/- followed by a time expression HH:mm
	//		Assumes the local time zone if not specified.  Does not validate.  Improperly formatted
	//		input may return null.  Arguments which are out of bounds will be handled
	// 		by the Date constructor (e.g. January 32nd typically gets resolved to February 1st)
	//		Only years between 100 and 9999 are supported.
	//
  	//	formattedString:
	//		A string such as 2005-06-30T08:05:00-07:00 or 2005-06-30 or T08:05:00
	//
	//	defaultTime:
	//		Used for defaults for fields omitted in the formattedString.
	//		Uses 1970-01-01T00:00:00.0Z by default.

	if(!dojo.date.stamp._isoRegExp){
		dojo.date.stamp._isoRegExp =
//TODO: could be more restrictive and check for 00-59, etc.
			/^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(.\d+)?)?((?:[+-](\d{2}):(\d{2}))|Z)?)?$/;
	}

	var match = dojo.date.stamp._isoRegExp.exec(formattedString),
		result = null;

	if(match){
		match.shift();
		if(match[1]){match[1]--;} // Javascript Date months are 0-based
		if(match[6]){match[6] *= 1000;} // Javascript Date expects fractional seconds as milliseconds

		if(defaultTime){
			// mix in defaultTime.  Relatively expensive, so use || operators for the fast path of defaultTime === 0
			defaultTime = new Date(defaultTime);
			array.forEach(array.map(["FullYear", "Month", "Date", "Hours", "Minutes", "Seconds", "Milliseconds"], function(prop){
				return defaultTime["get" + prop]();
			}), function(value, index){
				match[index] = match[index] || value;
			});
		}
		result = new Date(match[0]||1970, match[1]||0, match[2]||1, match[3]||0, match[4]||0, match[5]||0, match[6]||0); //TODO: UTC defaults
		if(match[0] < 100){
			result.setFullYear(match[0] || 1970);
		}

		var offset = 0,
			zoneSign = match[7] && match[7].charAt(0);
		if(zoneSign != 'Z'){
			offset = ((match[8] || 0) * 60) + (Number(match[9]) || 0);
			if(zoneSign != '-'){ offset *= -1; }
		}
		if(zoneSign){
			offset -= result.getTimezoneOffset();
		}
		if(offset){
			result.setTime(result.getTime() + offset * 60000);
		}
	}

	return result; // Date or null
};

/*=====
	dojo.date.stamp.__Options = function(){
		//	selector: String
		//		"date" or "time" for partial formatting of the Date object.
		//		Both date and time will be formatted by default.
		//	zulu: Boolean
		//		if true, UTC/GMT is used for a timezone
		//	milliseconds: Boolean
		//		if true, output milliseconds
		this.selector = selector;
		this.zulu = zulu;
		this.milliseconds = milliseconds;
	}
=====*/

dojo.date.stamp.toISOString = function(/*Date*/dateObject, /*dojo.date.stamp.__Options?*/options){
	//	summary:
	//		Format a Date object as a string according a subset of the ISO-8601 standard
	//
	//	description:
	//		When options.selector is omitted, output follows [RFC3339](http://www.ietf.org/rfc/rfc3339.txt)
	//		The local time zone is included as an offset from GMT, except when selector=='time' (time without a date)
	//		Does not check bounds.  Only years between 100 and 9999 are supported.
	//
	//	dateObject:
	//		A Date object

	var _ = function(n){ return (n < 10) ? "0" + n : n; };
	options = options || {};
	var formattedDate = [],
		getter = options.zulu ? "getUTC" : "get",
		date = "";
	if(options.selector != "time"){
		var year = dateObject[getter+"FullYear"]();
		date = ["0000".substr((year+"").length)+year, _(dateObject[getter+"Month"]()+1), _(dateObject[getter+"Date"]())].join('-');
	}
	formattedDate.push(date);
	if(options.selector != "date"){
		var time = [_(dateObject[getter+"Hours"]()), _(dateObject[getter+"Minutes"]()), _(dateObject[getter+"Seconds"]())].join(':');
		var millis = dateObject[getter+"Milliseconds"]();
		if(options.milliseconds){
			time += "."+ (millis < 100 ? "0" : "") + _(millis);
		}
		if(options.zulu){
			time += "Z";
		}else if(options.selector != "time"){
			var timezoneOffset = dateObject.getTimezoneOffset();
			var absOffset = Math.abs(timezoneOffset);
			time += (timezoneOffset > 0 ? "-" : "+") +
				_(Math.floor(absOffset/60)) + ":" + _(absOffset%60);
		}
		formattedDate.push(time);
	}
	return formattedDate.join('T'); // String
};

return dojo.date.stamp;
});

},
'versa/api/Shares':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 24/10/11
 * Time: 9:58 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Shares", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Share"],
    function(declare){
        var o=declare("versa.api.Shares", [versa.api._Collection], {
            constructor: function(args){

                this.zone = args.zone;
                this.target = dojo.replace(versa.api.Shares.TRGT, [this.zone.subdomain]);
                this.schema = versa.api.Share.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.TRGT = '/zones/{0}/shares';

        return o;
    }
);



},
'dojo/Stateful':function(){
define("dojo/Stateful", ["./_base/kernel", "./_base/declare", "./_base/lang", "./_base/array"], function(dojo, declare, lang, array) {
	// module:
	//		dojo/Stateful
	// summary:
	//		TODOC

return dojo.declare("dojo.Stateful", null, {
	// summary:
	//		Base class for objects that provide named properties with optional getter/setter
	//		control and the ability to watch for property changes
	// example:
	//	|	var obj = new dojo.Stateful();
	//	|	obj.watch("foo", function(){
	//	|		console.log("foo changed to " + this.get("foo"));
	//	|	});
	//	|	obj.set("foo","bar");
	postscript: function(mixin){
		if(mixin){
			lang.mixin(this, mixin);
		}
	},

	get: function(/*String*/name){
		// summary:
		//		Get a property on a Stateful instance.
		//	name:
		//		The property to get.
		//	returns:
		//		The property value on this Stateful instance.
		// description:
		//		Get a named property on a Stateful object. The property may
		//		potentially be retrieved via a getter method in subclasses. In the base class
		// 		this just retrieves the object's property.
		// 		For example:
		//	|	stateful = new dojo.Stateful({foo: 3});
		//	|	stateful.get("foo") // returns 3
		//	|	stateful.foo // returns 3

		return this[name]; //Any
	},
	set: function(/*String*/name, /*Object*/value){
		// summary:
		//		Set a property on a Stateful instance
		//	name:
		//		The property to set.
		//	value:
		//		The value to set in the property.
		//	returns:
		//		The function returns this dojo.Stateful instance.
		// description:
		//		Sets named properties on a stateful object and notifies any watchers of
		// 		the property. A programmatic setter may be defined in subclasses.
		// 		For example:
		//	|	stateful = new dojo.Stateful();
		//	|	stateful.watch(function(name, oldValue, value){
		//	|		// this will be called on the set below
		//	|	}
		//	|	stateful.set(foo, 5);
		//
		//	set() may also be called with a hash of name/value pairs, ex:
		//	|	myObj.set({
		//	|		foo: "Howdy",
		//	|		bar: 3
		//	|	})
		//	This is equivalent to calling set(foo, "Howdy") and set(bar, 3)
		if(typeof name === "object"){
			for(var x in name){
				this.set(x, name[x]);
			}
			return this;
		}
		var oldValue = this[name];
		this[name] = value;
		if(this._watchCallbacks){
			this._watchCallbacks(name, oldValue, value);
		}
		return this; //dojo.Stateful
	},
	watch: function(/*String?*/name, /*Function*/callback){
		// summary:
		//		Watches a property for changes
		//	name:
		//		Indicates the property to watch. This is optional (the callback may be the
		// 		only parameter), and if omitted, all the properties will be watched
		// returns:
		//		An object handle for the watch. The unwatch method of this object
		// 		can be used to discontinue watching this property:
		//		|	var watchHandle = obj.watch("foo", callback);
		//		|	watchHandle.unwatch(); // callback won't be called now
		//	callback:
		//		The function to execute when the property changes. This will be called after
		//		the property has been changed. The callback will be called with the |this|
		//		set to the instance, the first argument as the name of the property, the
		// 		second argument as the old value and the third argument as the new value.

		var callbacks = this._watchCallbacks;
		if(!callbacks){
			var self = this;
			callbacks = this._watchCallbacks = function(name, oldValue, value, ignoreCatchall){
				var notify = function(propertyCallbacks){
					if(propertyCallbacks){
                        propertyCallbacks = propertyCallbacks.slice();
						for(var i = 0, l = propertyCallbacks.length; i < l; i++){
							try{
								propertyCallbacks[i].call(self, name, oldValue, value);
							}catch(e){
								console.error(e);
							}
						}
					}
				};
				notify(callbacks['_' + name]);
				if(!ignoreCatchall){
					notify(callbacks["*"]); // the catch-all
				}
			}; // we use a function instead of an object so it will be ignored by JSON conversion
		}
		if(!callback && typeof name === "function"){
			callback = name;
			name = "*";
		}else{
			// prepend with dash to prevent name conflicts with function (like "name" property)
			name = '_' + name;
		}
		var propertyCallbacks = callbacks[name];
		if(typeof propertyCallbacks !== "object"){
			propertyCallbacks = callbacks[name] = [];
		}
		propertyCallbacks.push(callback);
		return {
			unwatch: function(){
				propertyCallbacks.splice(array.indexOf(propertyCallbacks, callback), 1);
			}
		}; //Object
	}

});

});

},
'dojox/json/schema':function(){
define("dojox/json/schema", ["dojo/_base/kernel", "dojox", "dojo/_base/array"], function(dojo, dojox){

dojo.getObject("json.schema", true, dojox);


dojox.json.schema.validate = function(/*Any*/instance,/*Object*/schema){
	// summary:
	//  	To use the validator call this with an instance object and an optional schema object.
	// 		If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating),
	// 		that schema will be used to validate and the schema parameter is not necessary (if both exist,
	// 		both validations will occur).
	//	instance:
	//		The instance value/object to validate
	// schema:
	//		The schema to use to validate
	// description:
	// 		The validate method will return an object with two properties:
	// 			valid: A boolean indicating if the instance is valid by the schema
	// 			errors: An array of validation errors. If there are no errors, then an
	// 					empty list will be returned. A validation error will have two properties:
	// 						property: which indicates which property had the error
	// 						message: which indicates what the error was
	//
	return this._validate(instance,schema,false);
};
dojox.json.schema.checkPropertyChange = function(/*Any*/value,/*Object*/schema, /*String*/ property){
	// summary:
	// 		The checkPropertyChange method will check to see if an value can legally be in property with the given schema
	// 		This is slightly different than the validate method in that it will fail if the schema is readonly and it will
	// 		not check for self-validation, it is assumed that the passed in value is already internally valid.
	// 		The checkPropertyChange method will return the same object type as validate, see JSONSchema.validate for
	// 		information.
	//	value:
	//		The new instance value/object to check
	// schema:
	//		The schema to use to validate
	// return:
	// 		see dojox.validate.jsonSchema.validate
	//
	return this._validate(value,schema, property || "property");
};
dojox.json.schema.mustBeValid = function(result){
	//	summary:
	//		This checks to ensure that the result is valid and will throw an appropriate error message if it is not
	// result: the result returned from checkPropertyChange or validate
	if(!result.valid){
		throw new TypeError(dojo.map(result.errors,function(error){return "for property " + error.property + ': ' + error.message;}).join(", "));
	}
}
dojox.json.schema._validate = function(/*Any*/instance,/*Object*/schema,/*Boolean*/ _changing){
	
	var errors = [];
		// validate a value against a property definition
	function checkProp(value, schema, path,i){
		var l;
		path += path ? typeof i == 'number' ? '[' + i + ']' : typeof i == 'undefined' ? '' : '.' + i : i;
		function addError(message){
			errors.push({property:path,message:message});
		}
		
		if((typeof schema != 'object' || schema instanceof Array) && (path || typeof schema != 'function')){
			if(typeof schema == 'function'){
				if(!(Object(value) instanceof schema)){
					addError("is not an instance of the class/constructor " + schema.name);
				}
			}else if(schema){
				addError("Invalid schema/property definition " + schema);
			}
			return null;
		}
		if(_changing && schema.readonly){
			addError("is a readonly field, it can not be changed");
		}
		if(schema['extends']){ // if it extends another schema, it must pass that schema as well
			checkProp(value,schema['extends'],path,i);
		}
		// validate a value against a type definition
		function checkType(type,value){
			if(type){
				if(typeof type == 'string' && type != 'any' &&
						(type == 'null' ? value !== null : typeof value != type) &&
						!(value instanceof Array && type == 'array') &&
						!(type == 'integer' && value%1===0)){
					return [{property:path,message:(typeof value) + " value found, but a " + type + " is required"}];
				}
				if(type instanceof Array){
					var unionErrors=[];
					for(var j = 0; j < type.length; j++){ // a union type
						if(!(unionErrors=checkType(type[j],value)).length){
							break;
						}
					}
					if(unionErrors.length){
						return unionErrors;
					}
				}else if(typeof type == 'object'){
					var priorErrors = errors;
					errors = [];
					checkProp(value,type,path);
					var theseErrors = errors;
					errors = priorErrors;
					return theseErrors;
				}
			}
			return [];
		}
		if(value === undefined){
			if(!schema.optional){
				addError("is missing and it is not optional");
			}
		}else{
			errors = errors.concat(checkType(schema.type,value));
			if(schema.disallow && !checkType(schema.disallow,value).length){
				addError(" disallowed value was matched");
			}
			if(value !== null){
				if(value instanceof Array){
					if(schema.items){
						if(schema.items instanceof Array){
							for(i=0,l=value.length; i<l; i++){
								errors.concat(checkProp(value[i],schema.items[i],path,i));
							}
						}else{
							for(i=0,l=value.length; i<l; i++){
								errors.concat(checkProp(value[i],schema.items,path,i));
							}
						}
					}
					if(schema.minItems && value.length < schema.minItems){
						addError("There must be a minimum of " + schema.minItems + " in the array");
					}
					if(schema.maxItems && value.length > schema.maxItems){
						addError("There must be a maximum of " + schema.maxItems + " in the array");
					}
				}else if(schema.properties){
					errors.concat(checkObj(value,schema.properties,path,schema.additionalProperties));
				}
				if(schema.pattern && typeof value == 'string' && !value.match(schema.pattern)){
					addError("does not match the regex pattern " + schema.pattern);
				}
				if(schema.maxLength && typeof value == 'string' && value.length > schema.maxLength){
					addError("may only be " + schema.maxLength + " characters long");
				}
				if(schema.minLength && typeof value == 'string' && value.length < schema.minLength){
					addError("must be at least " + schema.minLength + " characters long");
				}
				if(typeof schema.minimum !== undefined && typeof value == typeof schema.minimum &&
						schema.minimum > value){
					addError("must have a minimum value of " + schema.minimum);
				}
				if(typeof schema.maximum !== undefined && typeof value == typeof schema.maximum &&
						schema.maximum < value){
					addError("must have a maximum value of " + schema.maximum);
				}
				if(schema['enum']){
					var enumer = schema['enum'];
					l = enumer.length;
					var found;
					for(var j = 0; j < l; j++){
						if(enumer[j]===value){
							found=1;
							break;
						}
					}
					if(!found){
						addError("does not have a value in the enumeration " + enumer.join(", "));
					}
				}
				if(typeof schema.maxDecimal == 'number' &&
					(value.toString().match(new RegExp("\\.[0-9]{" + (schema.maxDecimal + 1) + ",}")))){
					addError("may only have " + schema.maxDecimal + " digits of decimal places");
				}
			}
		}
		return null;
	}
	// validate an object against a schema
	function checkObj(instance,objTypeDef,path,additionalProp){
	
		if(typeof objTypeDef =='object'){
			if(typeof instance != 'object' || instance instanceof Array){
				errors.push({property:path,message:"an object is required"});
			}
			
			for(var i in objTypeDef){
				if(objTypeDef.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_')){
					var value = instance[i];
					var propDef = objTypeDef[i];
					checkProp(value,propDef,path,i);
				}
			}
		}
		for(i in instance){
			if(instance.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_') && objTypeDef && !objTypeDef[i] && additionalProp===false){
				errors.push({property:path,message:(typeof value) + "The property " + i +
						" is not defined in the schema and the schema does not allow additional properties"});
			}
			var requires = objTypeDef && objTypeDef[i] && objTypeDef[i].requires;
			if(requires && !(requires in instance)){
				errors.push({property:path,message:"the presence of the property " + i + " requires that " + requires + " also be present"});
			}
			value = instance[i];
			if(objTypeDef && typeof objTypeDef == 'object' && !(i in objTypeDef)){
				checkProp(value,additionalProp,path,i);
			}
			if(!_changing && value && value.$schema){
				errors = errors.concat(checkProp(value,value.$schema,path,i));
			}
		}
		return errors;
	}
	if(schema){
		checkProp(instance,schema,'',_changing || '');
	}
	if(!_changing && instance && instance.$schema){
		checkProp(instance,instance.$schema,'','');
	}
	return {valid:!errors.length,errors:errors};
};

return dojox.json.schema;
});

},
'versa/api/Zone':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/09/11
 * Time: 4:03 PM
 * To change this template use File | Settings | File Templates.
 */

define("versa/api/Zone", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/_Configurable",
        "versa/api/Groups",
        "versa/api/Libraries",
        "versa/api/Roles",
        "versa/api/Users",
        "versa/api/DocumentTypes",
        "versa/api/PropertyDefinitions",
        "versa/api/PropertyMappings",
        "versa/api/ChoiceLists",
        "versa/api/ViewDefinitions",
        "versa/api/CellDefinitions",
        "versa/api/XhrHelper",
        "versa/api/Folders",
        "versa/api/Shares",
        "versa/api/Preferences"],
    function(declare){
        var o=declare("versa.api.Zone", [versa.api._Object, versa.api._Configurable], {
            subdomain: null,

            _groups: null,
            _libraries: null,
            _roles: null,
            _shares: null,
            _users: null,
            _documentTypes: new Array(),
            _propertyDefinitions: new Array(),
            _propertyMappings: new Array(),
            _choiceLists: new Array(),
            _choiceValues: new Array(),
            _cellDefinitions: new Array(),
            _viewDefinitions: new Array(),

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            getGroups: function(){
                if(!this._groups){
                    this._groups = new versa.api.Groups({
                        zone: this
                    });
                }

                return this._groups;
            },

            getLibraries: function(){

                if(!this._libraries){
                    this._libraries = new versa.api.Libraries({
                        zone: this
                    });
                }

                return this._libraries;
            },

            getMetrics: function(args){

                var url = dojo.replace(versa.api.Zone.MT_TRGT,  [this.subdomain]);
                var result = versa.api.XhrHelper.doGetAction({
                    target: url
                });

                return result;
            },

            getRoles: function(){

                if(!this._roles){
                    this._roles = new versa.api.Roles({
                        zone: this
                    });
                }

                return this._roles;
            },

            getShares: function(){
                if(!this._shares){
                    this._shares = new versa.api.Shares({
                        zone: this
                    });
                }

                return this._shares;
            },

            getUsers: function(){

                if(!this._users){
                    this._users = new versa.api.Users({
                        zone: this
                    });
                }

                return this._users;
            },

            getPropertyDefinitions: function(library){
                if(!this._propertyDefinitions[library.id]){
                    this._propertyDefinitions[library.id]=new versa.api.PropertyDefinitions({
                        zone: this,
                        library: library
                    });
                }
                return this._propertyDefinitions[library.id];
            },

            getDocumentTypes: function(library){
                if(!this._documentTypes[library.id]){
                    this._documentTypes[library.id]=new versa.api.DocumentTypes({
                        zone: this,
                        library: library
                    });
                }
                return this._documentTypes[library.id];
            },

            getChoiceLists: function(library){
                if(!this._choiceLists[library.id]){
                    this._choiceLists[library.id]=new versa.api.ChoiceLists({
                        zone: this,
                        library: library
                    });
                }
                return this._choiceLists[library.id];
            },

            getChoiceValues: function(library){
                if(!this._choiceValues[library.id]){
                    this._choiceValues[library.id]=new versa.api.ChoiceValues({
                        zone: this,
                        library: library
                    });
                }
                return this._choiceValues[library.id];
            },

            getPropertyMappings: function(library){
                if(!this._propertyMappings[library.id]){
                    this._propertyMappings[library.id]=new versa.api.PropertyMappings({
                        zone: this,
                        library: library
                    })
                }
                return this._propertyMappings[library.id];
            },

            getCellDefinitions: function(library){
                if(!this._cellDefinitions[library.id]){
                    this._cellDefinitions[library.id]=new versa.api.CellDefinitions({
                        zone: this,
                        library: library
                    })
                }
                return this._cellDefinitions[library.id];
            },

            getViewDefinitions: function(library){
                if(!this._viewDefinitions[library.id]){
                    this._viewDefinitions[library.id]=new versa.api.ViewDefinitions({
                        zone: this,
                        library: library,
                        cellDefinitions: this.getCellDefinitions(library)
                    })
                }
                return this._viewDefinitions[library.id];
            },

            isAlive: function(){
                var url = dojo.replace(versa.api.Zone.ISALIVE_URL, this);

                var postData = {
                };

                var results = versa.api.XhrHelper.doPostAction({
                    target: url,
                    postData: postData
                });

                return true;
            },

            logon: function(username, password){
                var url = dojo.replace(versa.api.Zone.LOGIN_URL, this);

                var postData = {
                    username: username,
                    password: password
                };

                var results = versa.api.XhrHelper.doPostAction({
                    target: url,
                    postData: postData
                });

                return new versa.api.User(results);
            },

            logoff: function(){
                var url = dojo.replace(versa.api.Zone.LOGOUT_URL, this);

                var postData = {
                };

                var results = versa.api.XhrHelper.doPostAction({
                    target: url,
                    postData: postData
                });

                return results;
            },

            resetPassword: function(username, email){
                var url = dojo.replace(versa.api.Zone.RESET_URL, this)

                var postData = {
                    username: username,
                    email: email
                }

                var results = versa.api.XhrHelper.doPostAction({
                    target: url,
                    postData: postData
                });

                return results;
            }
        });

        o.TrialStates = {
            'EXPIRED':      0x0000,
            'NO_TRIAL':    -0x0001,
            'INFINITE':     0xFFFF
        };


        o.LOGIN_URL = '/zones/{subdomain}/logon.json';
        o.LOGOUT_URL = '/zones/{subdomain}/logoff.json';
        o.ISALIVE_URL = '/zones/{subdomain}/alive.json';
        o.MT_TRGT = '/zones/{0}/metrics.json';
        o.RESET_URL = '/zones/{subdomain}/reset.json';

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'subdomain': {
                    type: 'string'
                },
                'active_permissions': {
                    type: 'integer',
                    'default': 0
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'updated_at': {
                    type: 'date',
                    format: 'date-time'
                }
            },
            prototype: new o()
        };

        return o;
    }
);





},
'dojox/data/ServiceStore':function(){
define("dojox/data/ServiceStore", ["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array"], 
  function(declare, lang, array) {

// note that dojox.rpc.Service is not required, you can create your own services

// A ServiceStore is a readonly data store that provides a data.data interface to an RPC service.
// var myServices = new dojox.rpc.Service(dojo.moduleUrl("dojox.rpc.tests.resources", "test.smd"));
// var serviceStore = new dojox.data.ServiceStore({service:myServices.ServiceStore});
//
// The ServiceStore also supports lazy loading. References can be made to objects that have not been loaded.
//	For example if a service returned:
// {"name":"Example","lazyLoadedObject":{"$ref":"obj2"}}
//
// And this object has accessed using the dojo.data API:
// var obj = serviceStore.getValue(myObject,"lazyLoadedObject");
// The object would automatically be requested from the server (with an object id of "obj2").
//

return declare("dojox.data.ServiceStore",
	// ClientFilter is intentionally not required, ServiceStore does not need it, and is more
	// lightweight without it, but if it is provided, the ServiceStore will use it.
	lang.getObject("dojox.data.ClientFilter", 0)||null,{
		service: null,
		constructor: function(options){
			//summary:
			//		ServiceStore constructor, instantiate a new ServiceStore
			// 		A ServiceStore can be configured from a JSON Schema. Queries are just
			// 		passed through to the underlying services
			//
			// options:
			// 		Keyword arguments
			// The *schema* parameter
			//		This is a schema object for this store. This should be JSON Schema format.
			//
			// The *service* parameter
			// 		This is the service object that is used to retrieve lazy data and save results
			// 		The function should be directly callable with a single parameter of an object id to be loaded
			//
			// The *idAttribute* parameter
			//		Defaults to 'id'. The name of the attribute that holds an objects id.
			//		This can be a preexisting id provided by the server.
			//		If an ID isn't already provided when an object
			//		is fetched or added to the store, the autoIdentity system
			//		will generate an id for it and add it to the index.
			//
			// The *estimateCountFactor* parameter
			// 		This parameter is used by the ServiceStore to estimate the total count. When
			//		paging is indicated in a fetch and the response includes the full number of items
			//	 	requested by the fetch's count parameter, then the total count will be estimated
			//		to be estimateCountFactor multiplied by the provided count. If this is 1, then it is assumed that the server
			//		does not support paging, and the response is the full set of items, where the
			// 		total count is equal to the numer of items returned. If the server does support
			//		paging, an estimateCountFactor of 2 is a good value for estimating the total count
			//		It is also possible to override _processResults if the server can provide an exact
			// 		total count.
			//
			// The *syncMode* parameter
			//		Setting this to true will set the store to using synchronous calls by default.
			//		Sync calls return their data immediately from the calling function, so
			//		callbacks are unnecessary. This will only work with a synchronous capable service.
			//
			// description:
			//		ServiceStore can do client side caching and result set updating if
			// 		dojox.data.ClientFilter is loaded. Do this add:
			//	|	dojo.require("dojox.data.ClientFilter")
			//		prior to loading the ServiceStore (ClientFilter must be loaded before ServiceStore).
			//		To utilize client side filtering with a subclass, you can break queries into
			//		client side and server side components by putting client side actions in
			//		clientFilter property in fetch calls. For example you could override fetch:
			//	|	fetch: function(args){
				//	|		// do the sorting and paging on the client side
	 			//	|		args.clientFilter = {start:args.start, count: args.count, sort: args.sort};
	 			//	|		// args.query will be passed to the service object for the server side handling
	 			//	|		return this.inherited(arguments);
			//	|	}
			//		When extending this class, if you would like to create lazy objects, you can follow
			//		the example from dojox.data.tests.stores.ServiceStore:
			// |	var lazyItem = {
			// |		_loadObject: function(callback){
			// |			this.name="loaded";
			// |			delete this._loadObject;
			// |			callback(this);
			// |		}
			// |	};
			//setup a byId alias to the api call
			this.byId=this.fetchItemByIdentity;
			this._index = {};
			// if the advanced json parser is enabled, we can pass through object updates as onSet events
			if(options){
				lang.mixin(this,options);
			}
			// We supply a default idAttribute for parser driven construction, but if no id attribute
			//	is supplied, it should be null so that auto identification takes place properly
			this.idAttribute = (options && options.idAttribute) || (this.schema && this.schema._idAttr);
		},
		schema: null,
		idAttribute: "id",
		labelAttribute: "label",
		syncMode: false,
		estimateCountFactor: 1,
		getSchema: function(){
			return this.schema;
		},

		loadLazyValues:true,

		getValue: function(/*Object*/ item, /*String*/property, /*value?*/defaultValue){
			// summary:
			//	Gets the value of an item's 'property'
			//
			//	item:
			//		The item to get the value from
			//	property:
			//		property to look up value for
			//	defaultValue:
			//		the default value

			var value = item[property];
			return value || // return the plain value since it was found;
						(property in item ? // a truthy value was not found, see if we actually have it
							value : // we do, so we can return it
							item._loadObject ? // property was not found, maybe because the item is not loaded, we will try to load it synchronously so we can get the property
								(dojox.rpc._sync = true) && arguments.callee.call(this,dojox.data.ServiceStore.prototype.loadItem({item:item}) || {}, property, defaultValue) : // load the item and run getValue again
								defaultValue);// not in item -> return default value
		},
		getValues: function(item, property){
			// summary:
			//		Gets the value of an item's 'property' and returns
			//		it.	If this value is an array it is just returned,
			//		if not, the value is added to an array and that is returned.
			//
			//	item: /* object */
			//	property: /* string */
			//		property to look up value for

			var val = this.getValue(item,property);
			return val instanceof Array ? val : val === undefined ? [] : [val];
		},

		getAttributes: function(item){
			// summary:
			//	Gets the available attributes of an item's 'property' and returns
			//	it as an array.
			//
			//	item: /* object */

			var res = [];
			for(var i in item){
				if(item.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_')){
					res.push(i);
				}
			}
			return res;
		},

		hasAttribute: function(item,attribute){
			// summary:
			//		Checks to see if item has attribute
			//
			//	item: /* object */
			//	attribute: /* string */
			return attribute in item;
		},

		containsValue: function(item, attribute, value){
			// summary:
			//		Checks to see if 'item' has 'value' at 'attribute'
			//
			//	item: /* object */
			//	attribute: /* string */
			//	value: /* anything */
			return array.indexOf(this.getValues(item,attribute),value) > -1;
		},


		isItem: function(item){
			// summary:
			//		Checks to see if the argument is an item
			//
			//	item: /* object */
			//	attribute: /* string */

			// we have no way of determining if it belongs, we just have object returned from
			// 	service queries
			return (typeof item == 'object') && item && !(item instanceof Date);
		},

		isItemLoaded: function(item){
			// summary:
			//		Checks to see if the item is loaded.
			//
			//		item: /* object */

			return item && !item._loadObject;
		},

		loadItem: function(args){
			// summary:
			// 		Loads an item and calls the callback handler. Note, that this will call the callback
			// 		handler even if the item is loaded. Consequently, you can use loadItem to ensure
			// 		that an item is loaded is situations when the item may or may not be loaded yet.
			// 		If you access a value directly through property access, you can use this to load
			// 		a lazy value as well (doesn't need to be an item).
			//
			//	example:
			//		store.loadItem({
			//			item: item, // this item may or may not be loaded
			//			onItem: function(item){
			// 				// do something with the item
			//			}
			//		});

			var item;
			if(args.item._loadObject){
				args.item._loadObject(function(result){
					item = result; // in synchronous mode this can allow loadItem to return the value
					delete item._loadObject;
					var func = result instanceof Error ? args.onError : args.onItem;
					if(func){
						func.call(args.scope, result);
					}
				});
			}else if(args.onItem){
				// even if it is already loaded, we will use call the callback, this makes it easier to
				// use when it is not known if the item is loaded (you can always safely call loadItem).
				args.onItem.call(args.scope, args.item);
			}
			return item;
		},
		_currentId : 0,
		_processResults : function(results, deferred){
			// this should return an object with the items as an array and the total count of
			// items (maybe more than currently in the result set).
			// for example:
			//	| {totalCount:10, items: [{id:1},{id:2}]}

			// index the results, assigning ids as necessary

			if(results && typeof results == 'object'){
				var id = results.__id;
				if(!id){// if it hasn't been assigned yet
					if(this.idAttribute){
						// use the defined id if available
						id = results[this.idAttribute];
					}else{
						id = this._currentId++;
					}
					if(id !== undefined){
						var existingObj = this._index[id];
						if(existingObj){
							for(var j in existingObj){
								delete existingObj[j]; // clear it so we can mixin
							}
							results = lang.mixin(existingObj,results);
						}
						results.__id = id;
						this._index[id] = results;
					}
				}
				for(var i in results){
					results[i] = this._processResults(results[i], deferred).items;
				}
				var count = results.length;
			}
			return {totalCount: deferred.request.count == count ? (deferred.request.start || 0) + count * this.estimateCountFactor : count, items: results};
		},
		close: function(request){
			return request && request.abort && request.abort();
		},
		fetch: function(args){
			// summary:
			//		See dojo.data.api.Read.fetch
			//
			// The *queryOptions.cache* parameter
			//		If true, indicates that the query result should be cached for future use. This is only available
			// 		if dojox.data.ClientFilter has been loaded before the ServiceStore
			//
			//	The *syncMode* parameter
			//		Indicates that the call should be fetch synchronously if possible (this is not always possible)
			//
			// The *clientFetch* parameter
			//		This is a fetch keyword argument for explicitly doing client side filtering, querying, and paging

			args = args || {};

			if("syncMode" in args ? args.syncMode : this.syncMode){
				dojox.rpc._sync = true;
			}
			var self = this;

			var scope = args.scope || self;
			var defResult = this.cachingFetch ? this.cachingFetch(args) : this._doQuery(args);
			defResult.request = args;
			defResult.addCallback(function(results){
				if(args.clientFetch){
					results = self.clientSideFetch({query:args.clientFetch,sort:args.sort,start:args.start,count:args.count},results);
				}
				var resultSet = self._processResults(results, defResult);
				results = args.results = resultSet.items;
				if(args.onBegin){
					args.onBegin.call(scope, resultSet.totalCount, args);
				}
				if(args.onItem){
					for(var i=0; i<results.length;i++){
						args.onItem.call(scope, results[i], args);
					}
				}
				if(args.onComplete){
					args.onComplete.call(scope, args.onItem ? null : results, args);
				}
				return results;
			});
			defResult.addErrback(args.onError && function(err){
				return args.onError.call(scope, err, args);
			});
			args.abort = function(){
				// abort the request
				defResult.cancel();
			};
			args.store = this;
			return args;
		},
		_doQuery: function(args){
			var query= typeof args.queryStr == 'string' ? args.queryStr : args.query;
			return this.service(query);
		},
		getFeatures: function(){
			// summary:
			// 		return the store feature set

			return {
				"dojo.data.api.Read": true,
				"dojo.data.api.Identity": true,
				"dojo.data.api.Schema": this.schema
			};
		},

		getLabel: function(item){
			// summary
			//		returns the label for an item. Just gets the "label" attribute.
			//
			return this.getValue(item,this.labelAttribute);
		},

		getLabelAttributes: function(item){
			// summary:
			//		returns an array of attributes that are used to create the label of an item
			return [this.labelAttribute];
		},

		//Identity API Support


		getIdentity: function(item){
			return item.__id;
		},

		getIdentityAttributes: function(item){
			// summary:
			//		returns the attributes which are used to make up the
			//		identity of an item.	Basically returns this.idAttribute

			return [this.idAttribute];
		},

		fetchItemByIdentity: function(args){
			// summary:
			//		fetch an item by its identity, by looking in our index of what we have loaded
			var item = this._index[(args._prefix || '') + args.identity];
			if(item){
				// the item exists in the index
				if(item._loadObject){
					// we have a handle on the item, but it isn't loaded yet, so we need to load it
					args.item = item;
					return this.loadItem(args);
				}else if(args.onItem){
					// it's already loaded, so we can immediately callback
					args.onItem.call(args.scope, item);
				}
			}else{
				// convert the different spellings
				return this.fetch({
						query: args.identity,
						onComplete: args.onItem,
						onError: args.onError,
						scope: args.scope
					}).results;
			}
			return item;
		}

	}
);
});

},
'dijit/form/_TextBoxMixin':function(){
define("dijit/form/_TextBoxMixin", [
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.byId
	"dojo/_base/event", // event.stop
	"dojo/keys", // keys.ALT keys.CAPS_LOCK keys.CTRL keys.META keys.SHIFT
	"dojo/_base/lang", // lang.mixin
	".."	// for exporting dijit._setSelectionRange, dijit.selectInputText
], function(array, declare, dom, event, keys, lang, dijit){

// module:
//		dijit/form/_TextBoxMixin
// summary:
//		A mixin for textbox form input widgets

var _TextBoxMixin = declare("dijit.form._TextBoxMixin", null, {
	// summary:
	//		A mixin for textbox form input widgets

	// trim: Boolean
	//		Removes leading and trailing whitespace if true.  Default is false.
	trim: false,

	// uppercase: Boolean
	//		Converts all characters to uppercase if true.  Default is false.
	uppercase: false,

	// lowercase: Boolean
	//		Converts all characters to lowercase if true.  Default is false.
	lowercase: false,

	// propercase: Boolean
	//		Converts the first character of each word to uppercase if true.
	propercase: false,

	// maxLength: String
	//		HTML INPUT tag maxLength declaration.
	maxLength: "",

	// selectOnClick: [const] Boolean
	//		If true, all text will be selected when focused with mouse
	selectOnClick: false,

	// placeHolder: String
	//		Defines a hint to help users fill out the input field (as defined in HTML 5).
	//		This should only contain plain text (no html markup).
	placeHolder: "",

	_getValueAttr: function(){
		// summary:
		//		Hook so get('value') works as we like.
		// description:
		//		For `dijit.form.TextBox` this basically returns the value of the <input>.
		//
		//		For `dijit.form.MappedTextBox` subclasses, which have both
		//		a "displayed value" and a separate "submit value",
		//		This treats the "displayed value" as the master value, computing the
		//		submit value from it via this.parse().
		return this.parse(this.get('displayedValue'), this.constraints);
	},

	_setValueAttr: function(value, /*Boolean?*/ priorityChange, /*String?*/ formattedValue){
		// summary:
		//		Hook so set('value', ...) works.
		//
		// description:
		//		Sets the value of the widget to "value" which can be of
		//		any type as determined by the widget.
		//
		// value:
		//		The visual element value is also set to a corresponding,
		//		but not necessarily the same, value.
		//
		// formattedValue:
		//		If specified, used to set the visual element value,
		//		otherwise a computed visual value is used.
		//
		// priorityChange:
		//		If true, an onChange event is fired immediately instead of
		//		waiting for the next blur event.

		var filteredValue;
		if(value !== undefined){
			// TODO: this is calling filter() on both the display value and the actual value.
			// I added a comment to the filter() definition about this, but it should be changed.
			filteredValue = this.filter(value);
			if(typeof formattedValue != "string"){
				if(filteredValue !== null && ((typeof filteredValue != "number") || !isNaN(filteredValue))){
					formattedValue = this.filter(this.format(filteredValue, this.constraints));
				}else{ formattedValue = ''; }
			}
		}
		if(formattedValue != null && formattedValue != undefined && ((typeof formattedValue) != "number" || !isNaN(formattedValue)) && this.textbox.value != formattedValue){
			this.textbox.value = formattedValue;
			this._set("displayedValue", this.get("displayedValue"));
		}

		if(this.textDir == "auto"){
			this.applyTextDir(this.focusNode, formattedValue);
		}

		this.inherited(arguments, [filteredValue, priorityChange]);
	},

	// displayedValue: String
	//		For subclasses like ComboBox where the displayed value
	//		(ex: Kentucky) and the serialized value (ex: KY) are different,
	//		this represents the displayed value.
	//
	//		Setting 'displayedValue' through set('displayedValue', ...)
	//		updates 'value', and vice-versa.  Otherwise 'value' is updated
	//		from 'displayedValue' periodically, like onBlur etc.
	//
	//		TODO: move declaration to MappedTextBox?
	//		Problem is that ComboBox references displayedValue,
	//		for benefit of FilteringSelect.
	displayedValue: "",

	_getDisplayedValueAttr: function(){
		// summary:
		//		Hook so get('displayedValue') works.
		// description:
		//		Returns the displayed value (what the user sees on the screen),
		// 		after filtering (ie, trimming spaces etc.).
		//
		//		For some subclasses of TextBox (like ComboBox), the displayed value
		//		is different from the serialized value that's actually
		//		sent to the server (see dijit.form.ValidationTextBox.serialize)

		// TODO: maybe we should update this.displayedValue on every keystroke so that we don't need
		// this method
		// TODO: this isn't really the displayed value when the user is typing
		return this.filter(this.textbox.value);
	},

	_setDisplayedValueAttr: function(/*String*/ value){
		// summary:
		//		Hook so set('displayedValue', ...) works.
		// description:
		//		Sets the value of the visual element to the string "value".
		//		The widget value is also set to a corresponding,
		//		but not necessarily the same, value.

		if(value === null || value === undefined){ value = '' }
		else if(typeof value != "string"){ value = String(value) }

		this.textbox.value = value;

		// sets the serialized value to something corresponding to specified displayedValue
		// (if possible), and also updates the textbox.value, for example converting "123"
		// to "123.00"
		this._setValueAttr(this.get('value'), undefined);

		this._set("displayedValue", this.get('displayedValue'));

		// textDir support
		if(this.textDir == "auto"){
			this.applyTextDir(this.focusNode, value);
		}
	},

	format: function(value /*=====, constraints =====*/){
		// summary:
		//		Replaceable function to convert a value to a properly formatted string.
		// value: String
		// constraints: Object
		// tags:
		//		protected extension
		return ((value == null || value == undefined) ? "" : (value.toString ? value.toString() : value));
	},

	parse: function(value /*=====, constraints =====*/){
		// summary:
		//		Replaceable function to convert a formatted string to a value
		// value: String
		// constraints: Object
		// tags:
		//		protected extension

		return value;	// String
	},

	_refreshState: function(){
		// summary:
		//		After the user types some characters, etc., this method is
		//		called to check the field for validity etc.  The base method
		//		in `dijit.form.TextBox` does nothing, but subclasses override.
		// tags:
		//		protected
	},

	/*=====
	onInput: function(event){
		// summary:
		//		Connect to this function to receive notifications of various user data-input events.
		//		Return false to cancel the event and prevent it from being processed.
		// event:
		//		keydown | keypress | cut | paste | input
		// tags:
		//		callback
	},
	=====*/
	onInput: function(){},

	__skipInputEvent: false,
	_onInput: function(){
		// summary:
		//		Called AFTER the input event has happened
		// set text direction according to textDir that was defined in creation
		if(this.textDir == "auto"){
			this.applyTextDir(this.focusNode, this.focusNode.value);
		}

		this._refreshState();

		// In case someone is watch()'ing for changes to displayedValue
		this._set("displayedValue", this.get("displayedValue"));
	},

	postCreate: function(){
		// setting the value here is needed since value="" in the template causes "undefined"
		// and setting in the DOM (instead of the JS object) helps with form reset actions
		this.textbox.setAttribute("value", this.textbox.value); // DOM and JS values should be the same

		this.inherited(arguments);

		// normalize input events to reduce spurious event processing
		//	onkeydown: do not forward modifier keys
		//	           set charOrCode to numeric keycode
		//	onkeypress: do not forward numeric charOrCode keys (already sent through onkeydown)
		//	onpaste & oncut: set charOrCode to 229 (IME)
		//	oninput: if primary event not already processed, set charOrCode to 229 (IME), else do not forward
		var handleEvent = function(e){
			var charCode = e.charOrCode || e.keyCode || 229;
			if(e.type == "keydown"){
				switch(charCode){ // ignore "state" keys
					case keys.SHIFT:
					case keys.ALT:
					case keys.CTRL:
					case keys.META:
					case keys.CAPS_LOCK:
						return;
					default:
						if(charCode >= 65 && charCode <= 90){ return; } // keydown for A-Z can be processed with keypress
				}
			}
			if(e.type == "keypress" && typeof charCode != "string"){ return; }
			if(e.type == "input"){
				if(this.__skipInputEvent){ // duplicate event
					this.__skipInputEvent = false;
					return;
				}
			}else{
				this.__skipInputEvent = true;
			}
			// create fake event to set charOrCode and to know if preventDefault() was called
			var faux = lang.mixin({}, e, {
				charOrCode: charCode,
				wasConsumed: false,
				preventDefault: function(){
					faux.wasConsumed = true;
					e.preventDefault();
				},
				stopPropagation: function(){ e.stopPropagation(); }
			});
			// give web page author a chance to consume the event
			if(this.onInput(faux) === false){
				event.stop(faux); // return false means stop
			}
			if(faux.wasConsumed){ return; } // if preventDefault was called
			setTimeout(lang.hitch(this, "_onInput", faux), 0); // widget notification after key has posted
		};
		array.forEach([ "onkeydown", "onkeypress", "onpaste", "oncut", "oninput" ], function(event){
			this.connect(this.textbox, event, handleEvent);
		}, this);
	},

	_blankValue: '', // if the textbox is blank, what value should be reported
	filter: function(val){
		// summary:
		//		Auto-corrections (such as trimming) that are applied to textbox
		//		value on blur or form submit.
		// description:
		//		For MappedTextBox subclasses, this is called twice
		// 			- once with the display value
		//			- once the value as set/returned by set('value', ...)
		//		and get('value'), ex: a Number for NumberTextBox.
		//
		//		In the latter case it does corrections like converting null to NaN.  In
		//		the former case the NumberTextBox.filter() method calls this.inherited()
		//		to execute standard trimming code in TextBox.filter().
		//
		//		TODO: break this into two methods in 2.0
		//
		// tags:
		//		protected extension
		if(val === null){ return this._blankValue; }
		if(typeof val != "string"){ return val; }
		if(this.trim){
			val = lang.trim(val);
		}
		if(this.uppercase){
			val = val.toUpperCase();
		}
		if(this.lowercase){
			val = val.toLowerCase();
		}
		if(this.propercase){
			val = val.replace(/[^\s]+/g, function(word){
				return word.substring(0,1).toUpperCase() + word.substring(1);
			});
		}
		return val;
	},

	_setBlurValue: function(){
		this._setValueAttr(this.get('value'), true);
	},

	_onBlur: function(e){
		if(this.disabled){ return; }
		this._setBlurValue();
		this.inherited(arguments);

		if(this._selectOnClickHandle){
			this.disconnect(this._selectOnClickHandle);
		}
	},

	_isTextSelected: function(){
		return this.textbox.selectionStart == this.textbox.selectionEnd;
	},

	_onFocus: function(/*String*/ by){
		if(this.disabled || this.readOnly){ return; }

		// Select all text on focus via click if nothing already selected.
		// Since mouse-up will clear the selection need to defer selection until after mouse-up.
		// Don't do anything on focus by tabbing into the widget since there's no associated mouse-up event.
		if(this.selectOnClick && by == "mouse"){
			this._selectOnClickHandle = this.connect(this.domNode, "onmouseup", function(){
				// Only select all text on first click; otherwise users would have no way to clear
				// the selection.
				this.disconnect(this._selectOnClickHandle);

				// Check if the user selected some text manually (mouse-down, mouse-move, mouse-up)
				// and if not, then select all the text
				if(this._isTextSelected()){
					_TextBoxMixin.selectInputText(this.textbox);
				}
			});
		}
		// call this.inherited() before refreshState(), since this.inherited() will possibly scroll the viewport
		// (to scroll the TextBox into view), which will affect how _refreshState() positions the tooltip
		this.inherited(arguments);

		this._refreshState();
	},

	reset: function(){
		// Overrides dijit._FormWidget.reset().
		// Additionally resets the displayed textbox value to ''
		this.textbox.value = '';
		this.inherited(arguments);
	},
	_setTextDirAttr: function(/*String*/ textDir){
		// summary:
		//		Setter for textDir.
		// description:
		//		Users shouldn't call this function; they should be calling
		//		set('textDir', value)
		// tags:
		//		private

		// only if new textDir is different from the old one
		// and on widgets creation.
		if(!this._created
			|| this.textDir != textDir){
				this._set("textDir", textDir);
				// so the change of the textDir will take place immediately.
				this.applyTextDir(this.focusNode, this.focusNode.value);
		}
	}
});


_TextBoxMixin._setSelectionRange = dijit._setSelectionRange = function(/*DomNode*/ element, /*Number?*/ start, /*Number?*/ stop){
	if(element.setSelectionRange){
		element.setSelectionRange(start, stop);
	}
};

_TextBoxMixin.selectInputText = dijit.selectInputText = function(/*DomNode*/ element, /*Number?*/ start, /*Number?*/ stop){
	// summary:
	//		Select text in the input element argument, from start (default 0), to stop (default end).

	// TODO: use functions in _editor/selection.js?
	element = dom.byId(element);
	if(isNaN(start)){ start = 0; }
	if(isNaN(stop)){ stop = element.value ? element.value.length : 0; }
	try{
		element.focus();
		_TextBoxMixin._setSelectionRange(element, start, stop);
	}catch(e){ /* squelch random errors (esp. on IE) from unexpected focus changes or DOM nodes being hidden */ }
};

return _TextBoxMixin;
});

},
'versa/api/Acl':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 12/10/11
 * Time: 2:53 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Acl", ["dojo/_base/declare"],
    function(declare){
        var o=declare("versa.api.Acl", [], {
            id: null,
            inherited: false,
            acl_entries: [],

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            getAdministrator: function(){
                for(var i = 0; i < this.acl_entries.length; i++){
                    var entry = this.acl_entries[i];
                    if((entry.grantee_type.toLowerCase() == 'group') && (entry.grantee.name.toLowerCase() == 'administrators')){
                        return this.acl_entries[i];
                    }
                }
            },

            getEveryone: function(zone){
                var everyoneEntry = null;


                dojo.some(this.acl_entries, function(acl_entry, idx){
                    var grantee = (acl_entry.grantee_type.toLowerCase() == 'group') ?
                                     zone.getGroups().fetchById({id: acl_entry.grantee_id}) :
                                     zone.getUsers().fetchById({id: acl_entry.grantee_id});

                    if(grantee.isInstanceOf(versa.api.Group) && grantee.is_everyone){
                        everyoneEntry = acl_entry;
                    }

                    return (everyoneEntry != null);
                }, this);

                return everyoneEntry;
            },

            hasAccess: function(zone, activeUser, activeGroup){

                var explicitUser = Number.NaN;
                var explicitGroup = Number.NaN;
                var everyone = Number.NaN;

                dojo.forEach(this.acl_entries, function(entry, idx){
                    var role = zone.getRoles().fetchById({id: entry.role_id});

                    var grantee = (entry.grantee_type.toLowerCase() == 'group') ?
                                     zone.getGroups().fetchById({id: entry.grantee_id}) :
                                     zone.getUsers().fetchById({id: entry.grantee_id});

                    if((grantee.isInstanceOf(versa.api.User)) && (entry.grantee_id == activeUser.id)){
                        explicitUser = role.permissions;
                    }
                    else if((grantee.isInstanceOf(versa.api.Group)) && (entry.grantee_id == activeGroup.id)){
                        explicitGroup = role.permissions;
                    }
                    else if((grantee.isInstanceOf(versa.api.Group)) && (grantee.is_everyone)){
                        everyone = role.permissions;
                    }

                }, this);


                if(!isNaN(explicitUser))
                    return (explicitUser > 0);
                if(!isNaN(explicitGroup))
                    return (explicitGroup > 0);
                if(!isNaN(everyone))
                    return (everyone > 0);

                return false;
            }
        });

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'inherit_state':{
                    type: 'integer'
                },
                'inherited': {
                    type: 'boolean',
                    'default': false
                }
            },
            prototype: new o()
        };

        return o;
    }
);


},
'dojox/mobile/Heading':function(){
define("dojox/mobile/Heading", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dijit/registry",	// registry.byId
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./View"
], function(array, connect, declare, lang, win, domClass, domConstruct, domStyle, registry, Contained, Container, WidgetBase, View){

	var dm = lang.getObject("dojox.mobile", true);

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/Heading
	// summary:
	//		A widget that represents a navigation bar.

	return declare("dojox.mobile.Heading", [WidgetBase, Container, Contained],{
		// summary:
		//		A widget that represents a navigation bar.
		// description:
		//		Heading is a widget that represents a navigation bar, which
		//		usually appears at the top of an application. It usually
		//		displays the title of the current view and can contain a
		//		navigational control. If you use it with
		//		dojox.mobile.ScrollableView, it can also be used as a fixed
		//		header bar or a fixed footer bar. In such cases, specify the
		//		fixed="top" attribute to be a fixed header bar or the
		//		fixed="bottom" attribute to be a fixed footer bar. Heading can
		//		have one or more ToolBarButton widgets as its children.

		// back: String
		//		A label for the navigational control to return to the previous
		//		View.
		back: "",

		// href: String
		//		A URL to open when the navigational control is pressed.
		href: "",

		// moveTo: String
		//		The id of the transition destination view which resides in the
		//		current page.
		//
		//		If the value has a hash sign ('#') before the id (e.g. #view1)
		//		and the dojo.hash module is loaded by the user application, the
		//		view transition updates the hash in the browser URL so that the
		//		user can bookmark the destination view. In this case, the user
		//		can also use the browser's back/forward button to navigate
		//		through the views in the browser history.
		//
		//		If null, transitions to a blank view.
		//		If '#', returns immediately without transition.
		moveTo: "",

		// transition: String
		//		A type of animated transition effect. You can choose from the
		//		standard transition types, "slide", "fade", "flip", or from the
		//		extended transition types, "cover", "coverv", "dissolve",
		//		"reveal", "revealv", "scaleIn", "scaleOut", "slidev",
		//		"swirl", "zoomIn", "zoomOut". If "none" is specified, transition
		//		occurs immediately without animation.
		transition: "slide",

		// label: String
		//		A title text of the heading. If the label is not specified, the
		//		innerHTML of the node is used as a label.
		label: "",

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// backProp: Object
		//		Properties for the back button.
		backProp: {className: "mblArrowButton"},

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "H1",

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement(this.tag);
			this.domNode.className = "mblHeading";
			if(!this.label){
				array.forEach(this.domNode.childNodes, function(n){
					if(n.nodeType == 3){
						var v = lang.trim(n.nodeValue);
						if(v){
							this.label = v;
							this.labelNode = domConstruct.create("SPAN", {innerHTML:v}, n, "replace");
						}
					}
				}, this);
			}
			if(!this.labelNode){
				this.labelNode = domConstruct.create("SPAN", null, this.domNode);
			}
			this.labelNode.className = "mblHeadingSpanTitle";
			this.labelDivNode = domConstruct.create("DIV", {
				className: "mblHeadingDivTitle",
				innerHTML: this.labelNode.innerHTML
			}, this.domNode);
		},

		startup: function(){
			if(this._started){ return; }
			var parent = this.getParent && this.getParent();
			if(!parent || !parent.resize){ // top level widget
				var _this = this;
				setTimeout(function(){ // necessary to render correctly
					_this.resize();
				}, 0);
			}
			this.inherited(arguments);
		},
	
		resize: function(){
			if(this._btn){
				this._btn.style.width = this._body.offsetWidth + this._head.offsetWidth + "px";
			}
			if(this.labelNode){
				// find the rightmost left button (B), and leftmost right button (C)
				// +-----------------------------+
				// | |A| |B|             |C| |D| |
				// +-----------------------------+
				var leftBtn, rightBtn;
				var children = this.containerNode.childNodes;
				for(var i = children.length - 1; i >= 0; i--){
					var c = children[i];
					if(c.nodeType === 1){
						if(!rightBtn && domClass.contains(c, "mblToolBarButton") && domStyle.get(c, "float") === "right"){
							rightBtn = c;
						}
						if(!leftBtn && (domClass.contains(c, "mblToolBarButton") && domStyle.get(c, "float") === "left" || c === this._btn)){
							leftBtn = c;
						}
					}
				}

				if(!this.labelNodeLen && this.label){
					this.labelNode.style.display = "inline";
					this.labelNodeLen = this.labelNode.offsetWidth;
					this.labelNode.style.display = "";
				}

				var bw = this.domNode.offsetWidth; // bar width
				var rw = rightBtn ? bw - rightBtn.offsetLeft + 5 : 0; // rightBtn width
				var lw = leftBtn ? leftBtn.offsetLeft + leftBtn.offsetWidth + 5 : 0; // leftBtn width
				var tw = this.labelNodeLen || 0; // title width
				domClass[bw - Math.max(rw,lw)*2 > tw ? "add" : "remove"](this.domNode, "mblHeadingCenterTitle");
			}
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		_setBackAttr: function(/*String*/back){
			if (!back){
				domConstruct.destroy(this._btn);
				this._btn = null;
				this.back = "";
			}else{
				if(!this._btn){
					var btn = domConstruct.create("DIV", this.backProp, this.domNode, "first");
					var head = domConstruct.create("DIV", {className:"mblArrowButtonHead"}, btn);
					var body = domConstruct.create("DIV", {className:"mblArrowButtonBody mblArrowButtonText"}, btn);

					this._body = body;
					this._head = head;
					this._btn = btn;
					this.backBtnNode = btn;
					this.connect(body, "onclick", "onClick");
				}
				this.back = back;
				this._body.innerHTML = this._cv ? this._cv(this.back) : this.back;
			}
			this.resize();
		},
	
		_setLabelAttr: function(/*String*/label){
			this.label = label;
			this.labelNode.innerHTML = this.labelDivNode.innerHTML = this._cv ? this._cv(label) : label;
		},
	
		findCurrentView: function(){
			// summary:
			//		Search for the view widget that contains this widget.
			var w = this;
			while(true){
				w = w.getParent();
				if(!w){ return null; }
				if(w instanceof View){ break; }
			}
			return w;
		},

		onClick: function(e){
			var h1 = this.domNode;
			domClass.add(h1, "mblArrowButtonSelected");
			setTimeout(function(){
				domClass.remove(h1, "mblArrowButtonSelected");
			}, 1000);

			if(this.back && !this.moveTo && !this.href && history){
				history.back();	
				return;
			}	
	
			// keep the clicked position for transition animations
			var view = this.findCurrentView();
			if(view){
				view.clickedPosX = e.clientX;
				view.clickedPosY = e.clientY;
			}
			this.goTo(this.moveTo, this.href);
		},
	
		goTo: function(moveTo, href){
			// summary:
			//		Given the destination, makes a view transition.
			var view = this.findCurrentView();
			if(!view){ return; }
			if(href){
				view.performTransition(null, -1, this.transition, this, function(){location.href = href;});
			}else{
				if(dm.app && dm.app.STAGE_CONTROLLER_ACTIVE){
					// If in a full mobile app, then use its mechanisms to move back a scene
					connect.publish("/dojox/mobile/app/goback");
				}else{
					// Basically transition should be performed between two
					// siblings that share the same parent.
					// However, when views are nested and transition occurs from
					// an inner view, search for an ancestor view that is a sibling
					// of the target view, and use it as a source view.
					var node = registry.byId(view.convertToId(moveTo));
					if(node){
						var parent = node.getParent();
						while(view){
							var myParent = view.getParent();
							if(parent === myParent){
								break;
							}
							view = myParent;
						}
					}
					if(view){
						view.performTransition(moveTo, -1, this.transition);
					}
				}
			}
		}
	});
});

},
'dojox/mobile/TransitionEvent':function(){
define("dojox/mobile/TransitionEvent", [
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/lang",
	"dojo/on",
	"./transition"
], function(declare, Deferred, lang, on, transitDeferred){

	return declare("dojox.mobile.TransitionEvent", null, {
		constructor: function(target, transitionOptions, triggerEvent){
			this.transitionOptions=transitionOptions;	
			this.target = target;
			this.triggerEvent=triggerEvent||null;	
		},

		dispatch: function(){
			var opts = {bubbles:true, cancelable:true, detail: this.transitionOptions, triggerEvent: this.triggerEvent};	
			//console.log("Target: ", this.target, " opts: ", opts);

			var evt = on.emit(this.target,"startTransition", opts);
			//console.log('evt: ', evt);
			if(evt){
				Deferred.when(transitDeferred, lang.hitch(this, function(transition){
					Deferred.when(transition.call(this, evt), lang.hitch(this, function(results){
						this.endTransition(results);
					})); 
				}));
			}
		},

		endTransition: function(results){
			on.emit(this.target, "endTransition" , {detail: results.transitionOptions});
		}
	});
});

},
'dijit/main':function(){
define("dijit/main", [
	"dojo/_base/kernel"
], function(dojo){
	// module:
	//		dijit
	// summary:
	//		The dijit package main module

	return dojo.dijit;
});

},
'versa/api/DataTypes':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/11/11
 * Time: 2:46 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/DataTypes", ["dojo/_base/declare",
        "versa/api/DataType",
        "versa/api/_Collection"],
    function(declare){
        var o=declare("versa.api.DataTypes", [versa.api._Collection], {
            constructor: function(args){
                this.zone = null;
                this.target = versa.api.DataTypes.TRGT;
                this.schema = versa.api.DataType.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.types = {
            'VOID':     0,
            'BOOLEAN':  1,
            'INTEGER':  2,
            'FLOAT':    3,
            'DATETIME': 4,
            'STRING':   5,
            'TEXT':     6
        };

        o.TRGT = '/data_types';

        return o;
    }
);



},
'versa/api/DocumentType':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 08/11/11
 * Time: 4:05 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/DocumentType", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/XhrHelper",
        "versa/api/PropertyMapping"],
    function(declare){
        var o=declare("versa.api.DocumentType", [versa.api._Object], {
            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            getMetrics: function(args){

                var url = dojo.replace(versa.api.DocumentType.MT_TRGT,  [args.zone.subdomain, args.library.id, this.id]);
                var result = versa.api.XhrHelper.doGetAction({
                    target: url
                });

                return true;
            },

            hasProperty: function(id){

                var has = dojo.some(this.property_mappings, function(mapping, idx){
                    return (mapping.property_definition_id == id);
                }, this);

                return has;
            },

            isValid: function(){
                var isValid = true;

                if (String.isEmpty(this.name.trim())) {
                    isValid = false;
                }

                return isValid;
            }
        });

        o.MT_TRGT = '/zones/{0}/libraries/{1}/document_types/{2}/dtmetrics.json';

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'is_system': {
                    type: 'boolean',
                    'default': false
                },
                'property_mappings': {
                    type: 'array',
                    'default': [],
                    items: {
                        type: 'object',
                        properties: {
                            'property_definition_id': {
                                type: 'integer'
                            },
                            'choice_list_id': {
                                type: 'integer'
                            },
                            'default_value': {
                                type: 'string'
                            },
                            'is_required': {
                                type: 'boolean'
                            },
                            'sort_order': {
                                type: 'integer'
                            },
                            prototype: new versa.api.PropertyMapping()
                        }
                    }
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string'
                },
                'description': {
                    type: 'string',
                    'default': ''
                },
                'updated_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'updated_by': {
                    type: 'string'
                }
            },
            prototype: new o()
        };

        return o;
    }
);


},
'dijit/_OnDijitClickMixin':function(){
define("dijit/_OnDijitClickMixin", [
	"dojo/on",
	"dojo/_base/array", // array.forEach
	"dojo/keys", // keys.ENTER keys.SPACE
	"dojo/_base/declare", // declare
	"dojo/_base/sniff", // has("ie")
	"dojo/_base/unload", // unload.addOnWindowUnload
	"dojo/_base/window" // win.doc.addEventListener win.doc.attachEvent win.doc.detachEvent
], function(on, array, keys, declare, has, unload, win){

	// module:
	//		dijit/_OnDijitClickMixin
	// summary:
	//		Mixin so you can pass "ondijitclick" to this.connect() method,
	//		as a way to handle clicks by mouse, or by keyboard (SPACE/ENTER key)


	// Keep track of where the last keydown event was, to help avoid generating
	// spurious ondijitclick events when:
	// 1. focus is on a <button> or <a>
	// 2. user presses then releases the ENTER key
	// 3. onclick handler fires and shifts focus to another node, with an ondijitclick handler
	// 4. onkeyup event fires, causing the ondijitclick handler to fire
	var lastKeyDownNode = null;
	if(has("ie")){
		(function(){
			var keydownCallback = function(evt){
				lastKeyDownNode = evt.srcElement;
			};
			win.doc.attachEvent('onkeydown', keydownCallback);
			unload.addOnWindowUnload(function(){
				win.doc.detachEvent('onkeydown', keydownCallback);
			});
		})();
	}else{
		win.doc.addEventListener('keydown', function(evt){
			lastKeyDownNode = evt.target;
		}, true);
	}

	// Custom a11yclick (a.k.a. ondijitclick) event
	var a11yclick = function(node, listener){
		if(/input|button/i.test(node.nodeName)){
			// pass through, the browser already generates click event on SPACE/ENTER key
			return on(node, "click", listener);
		}else{
			// Don't fire the click event unless both the keydown and keyup occur on this node.
			// Avoids problems where focus shifted to this node or away from the node on keydown,
			// either causing this node to process a stray keyup event, or causing another node
			// to get a stray keyup event.

			function clickKey(/*Event*/ e){
				return (e.keyCode == keys.ENTER || e.keyCode == keys.SPACE) &&
						!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
			}
			var handles = [
				on(node, "keypress", function(e){
					//console.log(this.id + ": onkeydown, e.target = ", e.target, ", lastKeyDownNode was ", lastKeyDownNode, ", equality is ", (e.target === lastKeyDownNode));
					if(clickKey(e)){
						// needed on IE for when focus changes between keydown and keyup - otherwise dropdown menus do not work
						lastKeyDownNode = e.target;

						// Prevent viewport scrolling on space key in IE<9.
						// (Reproducible on test_Button.html on any of the first dijit.form.Button examples)
						// Do this onkeypress rather than onkeydown because onkeydown.preventDefault() will
						// suppress the onkeypress event, breaking _HasDropDown
						e.preventDefault();
					}
				}),

				on(node, "keyup", function(e){
					//console.log(this.id + ": onkeyup, e.target = ", e.target, ", lastKeyDownNode was ", lastKeyDownNode, ", equality is ", (e.target === lastKeyDownNode));
					if(clickKey(e) && e.target == lastKeyDownNode){	// === breaks greasemonkey
						//need reset here or have problems in FF when focus returns to trigger element after closing popup/alert
						lastKeyDownNode = null;
						listener.call(this, e);
					}
				}),

				on(node, "click", function(e){
					// and connect for mouse clicks too (or touch-clicks on mobile)
					listener.call(this, e);
				})
			];

			return {
				remove: function(){
					array.forEach(handles, function(h){ h.remove(); });
				}
			};
		}
	};

	return declare("dijit._OnDijitClickMixin", null, {
		connect: function(
				/*Object|null*/ obj,
				/*String|Function*/ event,
				/*String|Function*/ method){
			// summary:
			//		Connects specified obj/event to specified method of this object
			//		and registers for disconnect() on widget destroy.
			// description:
			//		Provide widget-specific analog to connect.connect, except with the
			//		implicit use of this widget as the target object.
			//		This version of connect also provides a special "ondijitclick"
			//		event which triggers on a click or space or enter keyup.
			//		Events connected with `this.connect` are disconnected upon
			//		destruction.
			// returns:
			//		A handle that can be passed to `disconnect` in order to disconnect before
			//		the widget is destroyed.
			// example:
			//	|	var btn = new dijit.form.Button();
			//	|	// when foo.bar() is called, call the listener we're going to
			//	|	// provide in the scope of btn
			//	|	btn.connect(foo, "bar", function(){
			//	|		console.debug(this.toString());
			//	|	});
			// tags:
			//		protected

			return this.inherited(arguments, [obj, event == "ondijitclick" ? a11yclick : event, method]);
		}
	});
});

},
'dojox/mobile/ScrollableView':function(){
define("dojox/mobile/ScrollableView", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/registry",	// registry.byNode
	"./View",
	"./_ScrollableMixin"
], function(array, declare, domClass, domConstruct, registry, View, ScrollableMixin){

	/*=====
		var View = dojox.mobile.View;
		var ScrollableMixin = dojox.mobile._ScrollableMixin;
	=====*/

	// module:
	//		dojox/mobile/ScrollableView
	// summary:
	//		A container that has a touch scrolling capability.

	return declare("dojox.mobile.ScrollableView", [View, ScrollableMixin], {
		// summary:
		//		A container that has a touch scrolling capability.
		// description:
		//		ScrollableView is a subclass of View (=dojox.mobile.View).
		//		Unlike the base View class, ScrollableView's domNode always stays
		//		at the top of the screen and its height is "100%" of the screen.
		//		In this fixed domNode, containerNode scrolls. Browser's default
		//		scrolling behavior is disabled, and the scrolling machinery is
		//		re-implemented with JavaScript. Thus the user does not need to use the
		//		two-finger operation to scroll an inner DIV (containerNode).
		//		The main purpose of this widget is to realize fixed-positioned header
		//		and/or footer bars.

		// scrollableParams: Object
		//		Parameters for dojox.mobile.scrollable.init().
		scrollableParams: null,

		// keepScrollPos: Boolean
		//		Overrides dojox.mobile.View.keepScrollPos.
		keepScrollPos: false,

		constructor: function(){
			this.scrollableParams = {noResize: true};
		},

		buildRendering: function(){
			this.inherited(arguments);
			domClass.add(this.domNode, "mblScrollableView");
			this.domNode.style.overflow = "hidden";
			this.domNode.style.top = "0px";
			this.containerNode = domConstruct.create("DIV",
				{className:"mblScrollableViewContainer"}, this.domNode);
			this.containerNode.style.position = "absolute";
			this.containerNode.style.top = "0px"; // view bar is relative
			if(this.scrollDir === "v"){
				this.containerNode.style.width = "100%";
			}
			this.reparent();
			this.findAppBars();
		},

		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			this.inherited(arguments); // scrollable#resize() will be called
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		isTopLevel: function(e){
			// summary:
			//		Returns true if this is a top-level widget.
			//		Overrides dojox.mobile.scrollable.
			var parent = this.getParent && this.getParent();
			return (!parent || !parent.resize); // top level widget
		},

		addChild: function(widget, /*Number?*/insertIndex){
			var c = widget.domNode;
			var fixed = this.checkFixedBar(c, true);
			if(fixed){
				// Addition of a fixed bar is an exceptional case.
				// It has to be added to domNode, not containerNode.
				// In this case, insertIndex is ignored.
				this.domNode.appendChild(c);
				if(fixed === "top"){
					this.fixedHeaderHeight = c.offsetHeight;
					this.isLocalHeader = true;
				}else if(fixed === "bottom"){
					this.fixedFooterHeight = c.offsetHeight;
					this.isLocalFooter = true;
					c.style.bottom = "0px";
				}
				this.resize();
				if(this._started && !widget._started){
					widget.startup();
				}
			}else{
				this.inherited(arguments);
			}
		},

		reparent: function(){
			// summary:
			//		Moves all the children, except header and footer, to
			//		containerNode.
			var i, idx, len, c;
			for(i = 0, idx = 0, len = this.domNode.childNodes.length; i < len; i++){
				c = this.domNode.childNodes[idx];
				// search for view-specific header or footer
				if(c === this.containerNode || this.checkFixedBar(c, true)){
					idx++;
					continue;
				}
				this.containerNode.appendChild(this.domNode.removeChild(c));
			}
		},

		onAfterTransitionIn: function(moveTo, dir, transition, context, method){
			this.flashScrollBar();
		},
	
		getChildren: function(){
			// summary:
			//		Overrides _WidgetBase#getChildren to add local fixed bars,
			//		which are not under containerNode, to the children array.
			var children = this.inherited(arguments);
			if(this.fixedHeader && this.fixedHeader.parentNode === this.domNode){
				children.push(registry.byNode(this.fixedHeader));
			}
			if(this.fixedFooter && this.fixedFooter.parentNode === this.domNode){
				children.push(registry.byNode(this.fixedFooter));
			}
			return children;
		}
	});
});

},
'dojox/rpc/JsonRest':function(){
define("dojox/rpc/JsonRest", ["dojo", "dojox", "dojox/json/ref", "dojox/rpc/Rest"], function(dojo, dojox) {
	var dirtyObjects = [];
	var Rest = dojox.rpc.Rest;
	var jr;
	function resolveJson(service, deferred, value, defaultId){
		var timeStamp = deferred.ioArgs && deferred.ioArgs.xhr && deferred.ioArgs.xhr.getResponseHeader("Last-Modified");
		if(timeStamp && Rest._timeStamps){
			Rest._timeStamps[defaultId] = timeStamp;
		}
		var hrefProperty = service._schema && service._schema.hrefProperty;
		if(hrefProperty){
			dojox.json.ref.refAttribute = hrefProperty;
		}
		value = value && dojox.json.ref.resolveJson(value, {
			defaultId: defaultId,
			index: Rest._index,
			timeStamps: timeStamp && Rest._timeStamps,
			time: timeStamp,
			idPrefix: service.servicePath.replace(/[^\/]*$/,''),
			idAttribute: jr.getIdAttribute(service),
			schemas: jr.schemas,
			loader:	jr._loader,
			idAsRef: service.idAsRef,
			assignAbsoluteIds: true
		});
		dojox.json.ref.refAttribute  = "$ref";
		return value;
	}
	jr = dojox.rpc.JsonRest={
		serviceClass: dojox.rpc.Rest,
		conflictDateHeader: "If-Unmodified-Since",
		commit: function(kwArgs){
			// summary:
			//		Saves the dirty data using REST Ajax methods

			kwArgs = kwArgs || {};
			var actions = [];
			var alreadyRecorded = {};
			var savingObjects = [];
			for(var i = 0; i < dirtyObjects.length; i++){
				var dirty = dirtyObjects[i];
				var object = dirty.object;
				var old = dirty.old;
				var append = false;
				if(!(kwArgs.service && (object || old) &&
						(object || old).__id.indexOf(kwArgs.service.servicePath)) && dirty.save){
					delete object.__isDirty;
					if(object){
						if(old){
							// changed object
							var pathParts;
							if((pathParts = object.__id.match(/(.*)#.*/))){ // it is a path reference
								// this means it is a sub object, we must go to the parent object and save it
								object = Rest._index[pathParts[1]];
							}
							if(!(object.__id in alreadyRecorded)){// if it has already been saved, we don't want to repeat it
								// record that we are saving
								alreadyRecorded[object.__id] = object;
								if(kwArgs.incrementalUpdates
									&& !pathParts){ // I haven't figured out how we would do incremental updates on sub-objects yet
									// make an incremental update using a POST
									var incremental = (typeof kwArgs.incrementalUpdates == 'function' ?
										kwArgs.incrementalUpdates : function(){
											incremental = {};
											for(var j in object){
												if(object.hasOwnProperty(j)){
													if(object[j] !== old[j]){
														incremental[j] = object[j];
													}
												}else if(old.hasOwnProperty(j)){
													// we can't use incremental updates to remove properties
													return null;
												}
											}
											return incremental;
										})(object, old);
								}
								
								if(incremental){
									actions.push({method:"post",target:object, content: incremental});
								}
								else{
									actions.push({method:"put",target:object,content:object});
								}
							}
						}else{
							// new object
							var service = jr.getServiceAndId(object.__id).service;
							var idAttribute = jr.getIdAttribute(service);
							if((idAttribute in object) && !kwArgs.alwaysPostNewItems){
								// if the id attribute is specified, then we should know the location
								actions.push({method:"put",target:object, content:object});
							}else{
								actions.push({method:"post",target:{__id:service.servicePath},
														content:object});
							}
						}
					}else if(old){
						// deleted object
						actions.push({method:"delete",target:old});
					}//else{ this would happen if an object is created and then deleted, don't do anything
					savingObjects.push(dirty);
					dirtyObjects.splice(i--,1);
				}
			}
			dojo.connect(kwArgs,"onError",function(){
				if(kwArgs.revertOnError !== false){
					var postCommitDirtyObjects = dirtyObjects;
					dirtyObjects = savingObjects;
					var numDirty = 0; // make sure this does't do anything if it is called again
					jr.revert(); // revert if there was an error
					dirtyObjects = postCommitDirtyObjects;
				}
				else{
					dirtyObjects = dirtyObject.concat(savingObjects);
				}
			});
			jr.sendToServer(actions, kwArgs);
			return actions;
		},
		sendToServer: function(actions, kwArgs){
			var xhrSendId;
			var plainXhr = dojo.xhr;
			var left = actions.length;// this is how many changes are remaining to be received from the server
			var i, contentLocation;
			var timeStamp;
			var conflictDateHeader = this.conflictDateHeader;
			// add headers for extra information
			dojo.xhr = function(method,args){
				// keep the transaction open as we send requests
				args.headers = args.headers || {};
				// the last one should commit the transaction
				args.headers['Transaction'] = actions.length - 1 == i ? "commit" : "open";
				if(conflictDateHeader && timeStamp){
					args.headers[conflictDateHeader] = timeStamp;
				}
				if(contentLocation){
					args.headers['Content-ID'] = '<' + contentLocation + '>';
				}
				return plainXhr.apply(dojo,arguments);
			};
			for(i =0; i < actions.length;i++){ // iterate through the actions to execute
				var action = actions[i];
				dojox.rpc.JsonRest._contentId = action.content && action.content.__id; // this is used by OfflineRest
				var isPost = action.method == 'post';
				timeStamp = action.method == 'put' && Rest._timeStamps[action.content.__id];
				if(timeStamp){
					// update it now
					Rest._timeStamps[action.content.__id] = (new Date()) + '';
				}
				// send the content location to the server
				contentLocation = isPost && dojox.rpc.JsonRest._contentId;
				var serviceAndId = jr.getServiceAndId(action.target.__id);
				var service = serviceAndId.service;
				var dfd = action.deferred = service[action.method](
									serviceAndId.id.replace(/#/,''), // if we are using references, we need eliminate #
									dojox.json.ref.toJson(action.content, false, service.servicePath, true)
								);
				(function(object, dfd, service){
					dfd.addCallback(function(value){
						try{
							// Implements id assignment per the HTTP specification
							var newId = dfd.ioArgs.xhr && dfd.ioArgs.xhr.getResponseHeader("Location");
							//TODO: match URLs if the servicePath is relative...
							if(newId){
								// if the path starts in the middle of an absolute URL for Location, we will use the just the path part
								var startIndex = newId.match(/(^\w+:\/\/)/) && newId.indexOf(service.servicePath);
								newId = startIndex > 0 ? newId.substring(startIndex) : (service.servicePath + newId).
										// now do simple relative URL resolution in case of a relative URL.
										replace(/^(.*\/)?(\w+:\/\/)|[^\/\.]+\/\.\.\/|^.*\/(\/)/,'$2$3');
								object.__id = newId;
								Rest._index[newId] = object;
							}
							value = resolveJson(service, dfd, value, object && object.__id);
						}catch(e){}
						if(!(--left)){
							if(kwArgs.onComplete){
								kwArgs.onComplete.call(kwArgs.scope, actions);
							}
						}
						return value;
					});
				})(action.content, dfd, service);
								
				dfd.addErrback(function(value){
					
					// on an error we want to revert, first we want to separate any changes that were made since the commit
					left = -1; // first make sure that success isn't called
					kwArgs.onError.call(kwArgs.scope, value);
				});
			}
			// revert back to the normal XHR handler
			dojo.xhr = plainXhr;
			
		},
		getDirtyObjects: function(){
			return dirtyObjects;
		},
		revert: function(service){
			// summary:
			//		Reverts all the changes made to JSON/REST data
			for(var i = dirtyObjects.length; i > 0;){
				i--;
				var dirty = dirtyObjects[i];
				var object = dirty.object;
				var old = dirty.old;
				var store = dojox.data._getStoreForItem(object || old);
				
				if(!(service && (object || old) &&
					(object || old).__id.indexOf(service.servicePath))){
					// if we are in the specified store or if this is a global revert
					if(object && old){
						// changed
						for(var j in old){
							if(old.hasOwnProperty(j) && object[j] !== old[j]){
								if(store){
									store.onSet(object, j, object[j], old[j]);
								}
								object[j] = old[j];
							}
						}
						for(j in object){
							if(!old.hasOwnProperty(j)){
								if(store){
									store.onSet(object, j, object[j]);
								}
								delete object[j];
							}
						}
					}else if(!old){
						// was an addition, remove it
						if(store){
							store.onDelete(object);
						}
					}else{
						// was a deletion, we will add it back
						if(store){
							store.onNew(old);
						}
					}
					delete (object || old).__isDirty;
					dirtyObjects.splice(i, 1);
				}
			}
		},
		changing: function(object,_deleting){
			// summary:
			//		adds an object to the list of dirty objects.  This object
			//		contains a reference to the object itself as well as a
			//		cloned and trimmed version of old object for use with
			//		revert.
			if(!object.__id){
				return;
			}
			object.__isDirty = true;
			//if an object is already in the list of dirty objects, don't add it again
			//or it will overwrite the premodification data set.
			for(var i=0; i<dirtyObjects.length; i++){
				var dirty = dirtyObjects[i];
				if(object==dirty.object){
					if(_deleting){
						// we are deleting, no object is an indicator of deletiong
						dirty.object = false;
						if(!this._saveNotNeeded){
							dirty.save = true;
						}
					}
					return;
				}
			}
			var old = object instanceof Array ? [] : {};
			for(i in object){
				if(object.hasOwnProperty(i)){
					old[i] = object[i];
				}
			}
			dirtyObjects.push({object: !_deleting && object, old: old, save: !this._saveNotNeeded});
		},
		deleteObject: function(object){
			// summary:
			//		deletes an object
			//	object:
			//  	object to delete
			this.changing(object,true);
		},
		getConstructor: function(/*Function|String*/service, schema){
			// summary:
			// 		Creates or gets a constructor for objects from this service
			if(typeof service == 'string'){
				var servicePath = service;
				service = new dojox.rpc.Rest(service,true);
				this.registerService(service, servicePath, schema);
			}
			if(service._constructor){
				return service._constructor;
			}
			service._constructor = function(data){
				// summary:
				//		creates a new object for this table
				//
				//	data:
				//		object to mixed in
				var self = this;
				var args = arguments;
				var properties;
				var initializeCalled;
				function addDefaults(schema){
					if(schema){
						addDefaults(schema['extends']);
						properties = schema.properties;
						for(var i in properties){
							var propDef = properties[i];
							if(propDef && (typeof propDef == 'object') && ("default" in propDef)){
								self[i] = propDef["default"];
							}
						}
					}
					if(schema && schema.prototype && schema.prototype.initialize){
						initializeCalled = true;
						schema.prototype.initialize.apply(self, args);
					}
				}
				addDefaults(service._schema);
				if(!initializeCalled && data && typeof data == 'object'){
					dojo.mixin(self,data);
				}
				var idAttribute = jr.getIdAttribute(service);
				Rest._index[this.__id = this.__clientId =
						service.servicePath + (this[idAttribute] ||
							Math.random().toString(16).substring(2,14) + '@' + ((dojox.rpc.Client && dojox.rpc.Client.clientId) || "client"))] = this;
				if(dojox.json.schema && properties){
					dojox.json.schema.mustBeValid(dojox.json.schema.validate(this, service._schema));
				}
				dirtyObjects.push({object:this, save: true});
			};
			return dojo.mixin(service._constructor, service._schema, {load:service});
		},
		fetch: function(absoluteId){
			// summary:
			//		Fetches a resource by an absolute path/id and returns a dojo.Deferred.
			var serviceAndId = jr.getServiceAndId(absoluteId);
			return this.byId(serviceAndId.service,serviceAndId.id);
		},
		getIdAttribute: function(service){
			// summary:
			//		Return the ids attribute used by this service (based on it's schema).
			//		Defaults to "id", if not other id is defined
			var schema = service._schema;
			var idAttr;
			if(schema){
				if(!(idAttr = schema._idAttr)){
					for(var i in schema.properties){
						if(schema.properties[i].identity || (schema.properties[i].link == "self")){
							schema._idAttr = idAttr = i;
						}
					}
				}
			}
			return idAttr || 'id';
		},
		getServiceAndId: function(/*String*/absoluteId){
			// summary:
			//		Returns the REST service and the local id for the given absolute id. The result
			// 		is returned as an object with a service property and an id property
			//	absoluteId:
			//		This is the absolute id of the object
			var serviceName = '';
			
			for(var service in jr.services){
				if((absoluteId.substring(0, service.length) == service) && (service.length >= serviceName.length)){
					serviceName = service;
				}
			}
			if (serviceName){
				return {service: jr.services[serviceName], id:absoluteId.substring(serviceName.length)};
			}
			var parts = absoluteId.match(/^(.*\/)([^\/]*)$/);
			return {service: new jr.serviceClass(parts[1], true), id:parts[2]};
		},
		services:{},
		schemas:{},
		registerService: function(/*Function*/ service, /*String*/ servicePath, /*Object?*/ schema){
			//	summary:
			//		Registers a service for as a JsonRest service, mapping it to a path and schema
			//	service:
			//		This is the service to register
			//	servicePath:
			//		This is the path that is used for all the ids for the objects returned by service
			//	schema:
			//		This is a JSON Schema object to associate with objects returned by this service
			servicePath = service.servicePath = servicePath || service.servicePath;
			service._schema = jr.schemas[servicePath] = schema || service._schema || {};
			jr.services[servicePath] = service;
		},
		byId: function(service, id){
			// if caching is allowed, we look in the cache for the result
			var deferred, result = Rest._index[(service.servicePath || '') + id];
			if(result && !result._loadObject){// cache hit
				deferred = new dojo.Deferred();
				deferred.callback(result);
				return deferred;
			}
			return this.query(service, id);
		},
		query: function(service, id, args){
			var deferred = service(id, args);
			
			deferred.addCallback(function(result){
				if(result.nodeType && result.cloneNode){
					// return immediately if it is an XML document
					return result;
				}
				return resolveJson(service, deferred, result, typeof id != 'string' || (args && (args.start || args.count)) ? undefined: id);
			});
			return deferred;
		},
		_loader: function(callback){
			// load a lazy object
			var serviceAndId = jr.getServiceAndId(this.__id);
			var self = this;
			jr.query(serviceAndId.service, serviceAndId.id).addBoth(function(result){
				// if they are the same this means an object was loaded, otherwise it
				// might be a primitive that was loaded or maybe an error
				if(result == self){
					// we can clear the flag, so it is a loaded object
					delete result.$ref;
					delete result._loadObject;
				}else{
					// it is probably a primitive value, we can't change the identity of an object to
					//	the loaded value, so we will keep it lazy, but define the lazy loader to always
					//	return the loaded value
					self._loadObject = function(callback){
						callback(result);
					};
				}
				callback(result);
			});
		},
		isDirty: function(item, store){
			// summary
			//		returns true if the item is marked as dirty or true if there are any dirty items
			if(!item){
				if(store){
					return dojo.some(dirtyObjects, function(dirty){
						return dojox.data._getStoreForItem(dirty.object || dirty.old) == store;
					});
				}
				return !!dirtyObjects.length;
			}
			return item.__isDirty;
		}
		
	};

	return dojox.rpc.JsonRest;
});


},
'dojo/data/ItemFileWriteStore':function(){
define("dojo/data/ItemFileWriteStore", ["../_base/lang", "../_base/declare", "../_base/array", "../_base/json", "../_base/window", 
	"./ItemFileReadStore", "../date/stamp"
], function(lang, declare, arrayUtil, jsonUtil, window, ItemFileReadStore, dateStamp) {
	// module:
	//		dojo/data/ItemFileWriteStore
	// summary:
	//		TODOC

/*===== var ItemFileReadStore = dojo.data.ItemFileReadStore; =====*/
return declare("dojo.data.ItemFileWriteStore", ItemFileReadStore, {
	constructor: function(/* object */ keywordParameters){
		//	keywordParameters: {typeMap: object)
		//		The structure of the typeMap object is as follows:
		//		{
		//			type0: function || object,
		//			type1: function || object,
		//			...
		//			typeN: function || object
		//		}
		//		Where if it is a function, it is assumed to be an object constructor that takes the
		//		value of _value as the initialization parameters.  It is serialized assuming object.toString()
		//		serialization.  If it is an object, then it is assumed
		//		to be an object of general form:
		//		{
		//			type: function, //constructor.
		//			deserialize:	function(value) //The function that parses the value and constructs the object defined by type appropriately.
		//			serialize:	function(object) //The function that converts the object back into the proper file format form.
		//		}

		// ItemFileWriteStore extends ItemFileReadStore to implement these additional dojo.data APIs
		this._features['dojo.data.api.Write'] = true;
		this._features['dojo.data.api.Notification'] = true;

		// For keeping track of changes so that we can implement isDirty and revert
		this._pending = {
			_newItems:{},
			_modifiedItems:{},
			_deletedItems:{}
		};

		if(!this._datatypeMap['Date'].serialize){
			this._datatypeMap['Date'].serialize = function(obj){
				return dateStamp.toISOString(obj, {zulu:true});
			};
		}
		//Disable only if explicitly set to false.
		if(keywordParameters && (keywordParameters.referenceIntegrity === false)){
			this.referenceIntegrity = false;
		}

		// this._saveInProgress is set to true, briefly, from when save() is first called to when it completes
		this._saveInProgress = false;
	},

	referenceIntegrity: true, //Flag that defaultly enabled reference integrity tracking.  This way it can also be disabled pogrammatially or declaratively.

	_assert: function(/* boolean */ condition){
		if(!condition){
			throw new Error("assertion failed in ItemFileWriteStore");
		}
	},

	_getIdentifierAttribute: function(){
		// this._assert((identifierAttribute === Number) || (dojo.isString(identifierAttribute)));
		return this.getFeatures()['dojo.data.api.Identity'];
	},


/* dojo.data.api.Write */

	newItem: function(/* Object? */ keywordArgs, /* Object? */ parentInfo){
		// summary: See dojo.data.api.Write.newItem()

		this._assert(!this._saveInProgress);

		if(!this._loadFinished){
			// We need to do this here so that we'll be able to find out what
			// identifierAttribute was specified in the data file.
			this._forceLoad();
		}

		if(typeof keywordArgs != "object" && typeof keywordArgs != "undefined"){
			throw new Error("newItem() was passed something other than an object");
		}
		var newIdentity = null;
		var identifierAttribute = this._getIdentifierAttribute();
		if(identifierAttribute === Number){
			newIdentity = this._arrayOfAllItems.length;
		}else{
			newIdentity = keywordArgs[identifierAttribute];
			if(typeof newIdentity === "undefined"){
				throw new Error("newItem() was not passed an identity for the new item");
			}
			if(lang.isArray(newIdentity)){
				throw new Error("newItem() was not passed an single-valued identity");
			}
		}

		// make sure this identity is not already in use by another item, if identifiers were
		// defined in the file.  Otherwise it would be the item count,
		// which should always be unique in this case.
		if(this._itemsByIdentity){
			this._assert(typeof this._itemsByIdentity[newIdentity] === "undefined");
		}
		this._assert(typeof this._pending._newItems[newIdentity] === "undefined");
		this._assert(typeof this._pending._deletedItems[newIdentity] === "undefined");

		var newItem = {};
		newItem[this._storeRefPropName] = this;
		newItem[this._itemNumPropName] = this._arrayOfAllItems.length;
		if(this._itemsByIdentity){
			this._itemsByIdentity[newIdentity] = newItem;
			//We have to set the identifier now, otherwise we can't look it
			//up at calls to setValueorValues in parentInfo handling.
			newItem[identifierAttribute] = [newIdentity];
		}
		this._arrayOfAllItems.push(newItem);

		//We need to construct some data for the onNew call too...
		var pInfo = null;

		// Now we need to check to see where we want to assign this thingm if any.
		if(parentInfo && parentInfo.parent && parentInfo.attribute){
			pInfo = {
				item: parentInfo.parent,
				attribute: parentInfo.attribute,
				oldValue: undefined
			};

			//See if it is multi-valued or not and handle appropriately
			//Generally, all attributes are multi-valued for this store
			//So, we only need to append if there are already values present.
			var values = this.getValues(parentInfo.parent, parentInfo.attribute);
			if(values && values.length > 0){
				var tempValues = values.slice(0, values.length);
				if(values.length === 1){
					pInfo.oldValue = values[0];
				}else{
					pInfo.oldValue = values.slice(0, values.length);
				}
				tempValues.push(newItem);
				this._setValueOrValues(parentInfo.parent, parentInfo.attribute, tempValues, false);
				pInfo.newValue = this.getValues(parentInfo.parent, parentInfo.attribute);
			}else{
				this._setValueOrValues(parentInfo.parent, parentInfo.attribute, newItem, false);
				pInfo.newValue = newItem;
			}
		}else{
			//Toplevel item, add to both top list as well as all list.
			newItem[this._rootItemPropName]=true;
			this._arrayOfTopLevelItems.push(newItem);
		}

		this._pending._newItems[newIdentity] = newItem;

		//Clone over the properties to the new item
		for(var key in keywordArgs){
			if(key === this._storeRefPropName || key === this._itemNumPropName){
				// Bummer, the user is trying to do something like
				// newItem({_S:"foo"}).  Unfortunately, our superclass,
				// ItemFileReadStore, is already using _S in each of our items
				// to hold private info.  To avoid a naming collision, we
				// need to move all our private info to some other property
				// of all the items/objects.  So, we need to iterate over all
				// the items and do something like:
				//    item.__S = item._S;
				//    item._S = undefined;
				// But first we have to make sure the new "__S" variable is
				// not in use, which means we have to iterate over all the
				// items checking for that.
				throw new Error("encountered bug in ItemFileWriteStore.newItem");
			}
			var value = keywordArgs[key];
			if(!lang.isArray(value)){
				value = [value];
			}
			newItem[key] = value;
			if(this.referenceIntegrity){
				for(var i = 0; i < value.length; i++){
					var val = value[i];
					if(this.isItem(val)){
						this._addReferenceToMap(val, newItem, key);
					}
				}
			}
		}
		this.onNew(newItem, pInfo); // dojo.data.api.Notification call
		return newItem; // item
	},

	_removeArrayElement: function(/* Array */ array, /* anything */ element){
		var index = arrayUtil.indexOf(array, element);
		if(index != -1){
			array.splice(index, 1);
			return true;
		}
		return false;
	},

	deleteItem: function(/* item */ item){
		// summary: See dojo.data.api.Write.deleteItem()
		this._assert(!this._saveInProgress);
		this._assertIsItem(item);

		// Remove this item from the _arrayOfAllItems, but leave a null value in place
		// of the item, so as not to change the length of the array, so that in newItem()
		// we can still safely do: newIdentity = this._arrayOfAllItems.length;
		var indexInArrayOfAllItems = item[this._itemNumPropName];
		var identity = this.getIdentity(item);

		//If we have reference integrity on, we need to do reference cleanup for the deleted item
		if(this.referenceIntegrity){
			//First scan all the attributes of this items for references and clean them up in the map
			//As this item is going away, no need to track its references anymore.

			//Get the attributes list before we generate the backup so it
			//doesn't pollute the attributes list.
			var attributes = this.getAttributes(item);

			//Backup the map, we'll have to restore it potentially, in a revert.
			if(item[this._reverseRefMap]){
				item["backup_" + this._reverseRefMap] = lang.clone(item[this._reverseRefMap]);
			}

			//TODO:  This causes a reversion problem.  This list won't be restored on revert since it is
			//attached to the 'value'. item, not ours.  Need to back tese up somehow too.
			//Maybe build a map of the backup of the entries and attach it to the deleted item to be restored
			//later.  Or just record them and call _addReferenceToMap on them in revert.
			arrayUtil.forEach(attributes, function(attribute){
				arrayUtil.forEach(this.getValues(item, attribute), function(value){
					if(this.isItem(value)){
						//We have to back up all the references we had to others so they can be restored on a revert.
						if(!item["backupRefs_" + this._reverseRefMap]){
							item["backupRefs_" + this._reverseRefMap] = [];
						}
						item["backupRefs_" + this._reverseRefMap].push({id: this.getIdentity(value), attr: attribute});
						this._removeReferenceFromMap(value, item, attribute);
					}
				}, this);
			}, this);

			//Next, see if we have references to this item, if we do, we have to clean them up too.
			var references = item[this._reverseRefMap];
			if(references){
				//Look through all the items noted as references to clean them up.
				for(var itemId in references){
					var containingItem = null;
					if(this._itemsByIdentity){
						containingItem = this._itemsByIdentity[itemId];
					}else{
						containingItem = this._arrayOfAllItems[itemId];
					}
					//We have a reference to a containing item, now we have to process the
					//attributes and clear all references to the item being deleted.
					if(containingItem){
						for(var attribute in references[itemId]){
							var oldValues = this.getValues(containingItem, attribute) || [];
							var newValues = arrayUtil.filter(oldValues, function(possibleItem){
								return !(this.isItem(possibleItem) && this.getIdentity(possibleItem) == identity);
							}, this);
							//Remove the note of the reference to the item and set the values on the modified attribute.
							this._removeReferenceFromMap(item, containingItem, attribute);
							if(newValues.length < oldValues.length){
								this._setValueOrValues(containingItem, attribute, newValues, true);
							}
						}
					}
				}
			}
		}

		this._arrayOfAllItems[indexInArrayOfAllItems] = null;

		item[this._storeRefPropName] = null;
		if(this._itemsByIdentity){
			delete this._itemsByIdentity[identity];
		}
		this._pending._deletedItems[identity] = item;

		//Remove from the toplevel items, if necessary...
		if(item[this._rootItemPropName]){
			this._removeArrayElement(this._arrayOfTopLevelItems, item);
		}
		this.onDelete(item); // dojo.data.api.Notification call
		return true;
	},

	setValue: function(/* item */ item, /* attribute-name-string */ attribute, /* almost anything */ value){
		// summary: See dojo.data.api.Write.set()
		return this._setValueOrValues(item, attribute, value, true); // boolean
	},

	setValues: function(/* item */ item, /* attribute-name-string */ attribute, /* array */ values){
		// summary: See dojo.data.api.Write.setValues()
		return this._setValueOrValues(item, attribute, values, true); // boolean
	},

	unsetAttribute: function(/* item */ item, /* attribute-name-string */ attribute){
		// summary: See dojo.data.api.Write.unsetAttribute()
		return this._setValueOrValues(item, attribute, [], true);
	},

	_setValueOrValues: function(/* item */ item, /* attribute-name-string */ attribute, /* anything */ newValueOrValues, /*boolean?*/ callOnSet){
		this._assert(!this._saveInProgress);

		// Check for valid arguments
		this._assertIsItem(item);
		this._assert(lang.isString(attribute));
		this._assert(typeof newValueOrValues !== "undefined");

		// Make sure the user isn't trying to change the item's identity
		var identifierAttribute = this._getIdentifierAttribute();
		if(attribute == identifierAttribute){
			throw new Error("ItemFileWriteStore does not have support for changing the value of an item's identifier.");
		}

		// To implement the Notification API, we need to make a note of what
		// the old attribute value was, so that we can pass that info when
		// we call the onSet method.
		var oldValueOrValues = this._getValueOrValues(item, attribute);

		var identity = this.getIdentity(item);
		if(!this._pending._modifiedItems[identity]){
			// Before we actually change the item, we make a copy of it to
			// record the original state, so that we'll be able to revert if
			// the revert method gets called.  If the item has already been
			// modified then there's no need to do this now, since we already
			// have a record of the original state.
			var copyOfItemState = {};
			for(var key in item){
				if((key === this._storeRefPropName) || (key === this._itemNumPropName) || (key === this._rootItemPropName)){
					copyOfItemState[key] = item[key];
				}else if(key === this._reverseRefMap){
					copyOfItemState[key] = lang.clone(item[key]);
				}else{
					copyOfItemState[key] = item[key].slice(0, item[key].length);
				}
			}
			// Now mark the item as dirty, and save the copy of the original state
			this._pending._modifiedItems[identity] = copyOfItemState;
		}

		// Okay, now we can actually change this attribute on the item
		var success = false;

		if(lang.isArray(newValueOrValues) && newValueOrValues.length === 0){

			// If we were passed an empty array as the value, that counts
			// as "unsetting" the attribute, so we need to remove this
			// attribute from the item.
			success = delete item[attribute];
			newValueOrValues = undefined; // used in the onSet Notification call below

			if(this.referenceIntegrity && oldValueOrValues){
				var oldValues = oldValueOrValues;
				if(!lang.isArray(oldValues)){
					oldValues = [oldValues];
				}
				for(var i = 0; i < oldValues.length; i++){
					var value = oldValues[i];
					if(this.isItem(value)){
						this._removeReferenceFromMap(value, item, attribute);
					}
				}
			}
		}else{
			var newValueArray;
			if(lang.isArray(newValueOrValues)){
				// Unfortunately, it's not safe to just do this:
				//    newValueArray = newValueOrValues;
				// Instead, we need to copy the array, which slice() does very nicely.
				// This is so that our internal data structure won't
				// get corrupted if the user mucks with the values array *after*
				// calling setValues().
				newValueArray = newValueOrValues.slice(0, newValueOrValues.length);
			}else{
				newValueArray = [newValueOrValues];
			}

			//We need to handle reference integrity if this is on.
			//In the case of set, we need to see if references were added or removed
			//and update the reference tracking map accordingly.
			if(this.referenceIntegrity){
				if(oldValueOrValues){
					var oldValues = oldValueOrValues;
					if(!lang.isArray(oldValues)){
						oldValues = [oldValues];
					}
					//Use an associative map to determine what was added/removed from the list.
					//Should be O(n) performant.  First look at all the old values and make a list of them
					//Then for any item not in the old list, we add it.  If it was already present, we remove it.
					//Then we pass over the map and any references left it it need to be removed (IE, no match in
					//the new values list).
					var map = {};
					arrayUtil.forEach(oldValues, function(possibleItem){
						if(this.isItem(possibleItem)){
							var id = this.getIdentity(possibleItem);
							map[id.toString()] = true;
						}
					}, this);
					arrayUtil.forEach(newValueArray, function(possibleItem){
						if(this.isItem(possibleItem)){
							var id = this.getIdentity(possibleItem);
							if(map[id.toString()]){
								delete map[id.toString()];
							}else{
								this._addReferenceToMap(possibleItem, item, attribute);
							}
						}
					}, this);
					for(var rId in map){
						var removedItem;
						if(this._itemsByIdentity){
							removedItem = this._itemsByIdentity[rId];
						}else{
							removedItem = this._arrayOfAllItems[rId];
						}
						this._removeReferenceFromMap(removedItem, item, attribute);
					}
				}else{
					//Everything is new (no old values) so we have to just
					//insert all the references, if any.
					for(var i = 0; i < newValueArray.length; i++){
						var value = newValueArray[i];
						if(this.isItem(value)){
							this._addReferenceToMap(value, item, attribute);
						}
					}
				}
			}
			item[attribute] = newValueArray;
			success = true;
		}

		// Now we make the dojo.data.api.Notification call
		if(callOnSet){
			this.onSet(item, attribute, oldValueOrValues, newValueOrValues);
		}
		return success; // boolean
	},

	_addReferenceToMap: function(/* item */ refItem, /* item */ parentItem, /* string */ attribute){
		//	summary:
		//		Method to add an reference map entry for an item and attribute.
		//	description:
		//		Method to add an reference map entry for an item and attribute. 		 //
		//	refItem:
		//		The item that is referenced.
		//	parentItem:
		//		The item that holds the new reference to refItem.
		//	attribute:
		//		The attribute on parentItem that contains the new reference.

		var parentId = this.getIdentity(parentItem);
		var references = refItem[this._reverseRefMap];

		if(!references){
			references = refItem[this._reverseRefMap] = {};
		}
		var itemRef = references[parentId];
		if(!itemRef){
			itemRef = references[parentId] = {};
		}
		itemRef[attribute] = true;
	},

	_removeReferenceFromMap: function(/* item */ refItem, /* item */ parentItem, /* string */ attribute){
		//	summary:
		//		Method to remove an reference map entry for an item and attribute.
		//	description:
		//		Method to remove an reference map entry for an item and attribute.  This will
		//		also perform cleanup on the map such that if there are no more references at all to
		//		the item, its reference object and entry are removed.
		//
		//	refItem:
		//		The item that is referenced.
		//	parentItem:
		//		The item holding a reference to refItem.
		//	attribute:
		//		The attribute on parentItem that contains the reference.
		var identity = this.getIdentity(parentItem);
		var references = refItem[this._reverseRefMap];
		var itemId;
		if(references){
			for(itemId in references){
				if(itemId == identity){
					delete references[itemId][attribute];
					if(this._isEmpty(references[itemId])){
						delete references[itemId];
					}
				}
			}
			if(this._isEmpty(references)){
				delete refItem[this._reverseRefMap];
			}
		}
	},

	_dumpReferenceMap: function(){
		//	summary:
		//		Function to dump the reverse reference map of all items in the store for debug purposes.
		//	description:
		//		Function to dump the reverse reference map of all items in the store for debug purposes.
		var i;
		for(i = 0; i < this._arrayOfAllItems.length; i++){
			var item = this._arrayOfAllItems[i];
			if(item && item[this._reverseRefMap]){
				console.log("Item: [" + this.getIdentity(item) + "] is referenced by: " + jsonUtil.toJson(item[this._reverseRefMap]));
			}
		}
	},

	_getValueOrValues: function(/* item */ item, /* attribute-name-string */ attribute){
		var valueOrValues = undefined;
		if(this.hasAttribute(item, attribute)){
			var valueArray = this.getValues(item, attribute);
			if(valueArray.length == 1){
				valueOrValues = valueArray[0];
			}else{
				valueOrValues = valueArray;
			}
		}
		return valueOrValues;
	},

	_flatten: function(/* anything */ value){
		if(this.isItem(value)){
			// Given an item, return an serializable object that provides a
			// reference to the item.
			// For example, given kermit:
			//    var kermit = store.newItem({id:2, name:"Kermit"});
			// we want to return
			//    {_reference:2}
			return {_reference: this.getIdentity(value)};
		}else{
			if(typeof value === "object"){
				for(var type in this._datatypeMap){
					var typeMap = this._datatypeMap[type];
					if(lang.isObject(typeMap) && !lang.isFunction(typeMap)){
						if(value instanceof typeMap.type){
							if(!typeMap.serialize){
								throw new Error("ItemFileWriteStore:  No serializer defined for type mapping: [" + type + "]");
							}
							return {_type: type, _value: typeMap.serialize(value)};
						}
					} else if(value instanceof typeMap){
						//SImple mapping, therefore, return as a toString serialization.
						return {_type: type, _value: value.toString()};
					}
				}
			}
			return value;
		}
	},

	_getNewFileContentString: function(){
		// summary:
		//		Generate a string that can be saved to a file.
		//		The result should look similar to:
		//		http://trac.dojotoolkit.org/browser/dojo/trunk/tests/data/countries.json
		var serializableStructure = {};

		var identifierAttribute = this._getIdentifierAttribute();
		if(identifierAttribute !== Number){
			serializableStructure.identifier = identifierAttribute;
		}
		if(this._labelAttr){
			serializableStructure.label = this._labelAttr;
		}
		serializableStructure.items = [];
		for(var i = 0; i < this._arrayOfAllItems.length; ++i){
			var item = this._arrayOfAllItems[i];
			if(item !== null){
				var serializableItem = {};
				for(var key in item){
					if(key !== this._storeRefPropName && key !== this._itemNumPropName && key !== this._reverseRefMap && key !== this._rootItemPropName){
						var valueArray = this.getValues(item, key);
						if(valueArray.length == 1){
							serializableItem[key] = this._flatten(valueArray[0]);
						}else{
							var serializableArray = [];
							for(var j = 0; j < valueArray.length; ++j){
								serializableArray.push(this._flatten(valueArray[j]));
								serializableItem[key] = serializableArray;
							}
						}
					}
				}
				serializableStructure.items.push(serializableItem);
			}
		}
		var prettyPrint = true;
		return jsonUtil.toJson(serializableStructure, prettyPrint);
	},

	_isEmpty: function(something){
		//	summary:
		//		Function to determine if an array or object has no properties or values.
		//	something:
		//		The array or object to examine.
		var empty = true;
		if(lang.isObject(something)){
			var i;
			for(i in something){
				empty = false;
				break;
			}
		}else if(lang.isArray(something)){
			if(something.length > 0){
				empty = false;
			}
		}
		return empty; //boolean
	},

	save: function(/* object */ keywordArgs){
		// summary: See dojo.data.api.Write.save()
		this._assert(!this._saveInProgress);

		// this._saveInProgress is set to true, briefly, from when save is first called to when it completes
		this._saveInProgress = true;

		var self = this;
		var saveCompleteCallback = function(){
			self._pending = {
				_newItems:{},
				_modifiedItems:{},
				_deletedItems:{}
			};

			self._saveInProgress = false; // must come after this._pending is cleared, but before any callbacks
			if(keywordArgs && keywordArgs.onComplete){
				var scope = keywordArgs.scope || window.global;
				keywordArgs.onComplete.call(scope);
			}
		};
		var saveFailedCallback = function(err){
			self._saveInProgress = false;
			if(keywordArgs && keywordArgs.onError){
				var scope = keywordArgs.scope || window.global;
				keywordArgs.onError.call(scope, err);
			}
		};

		if(this._saveEverything){
			var newFileContentString = this._getNewFileContentString();
			this._saveEverything(saveCompleteCallback, saveFailedCallback, newFileContentString);
		}
		if(this._saveCustom){
			this._saveCustom(saveCompleteCallback, saveFailedCallback);
		}
		if(!this._saveEverything && !this._saveCustom){
			// Looks like there is no user-defined save-handler function.
			// That's fine, it just means the datastore is acting as a "mock-write"
			// store -- changes get saved in memory but don't get saved to disk.
			saveCompleteCallback();
		}
	},

	revert: function(){
		// summary: See dojo.data.api.Write.revert()
		this._assert(!this._saveInProgress);

		var identity;
		for(identity in this._pending._modifiedItems){
			// find the original item and the modified item that replaced it
			var copyOfItemState = this._pending._modifiedItems[identity];
			var modifiedItem = null;
			if(this._itemsByIdentity){
				modifiedItem = this._itemsByIdentity[identity];
			}else{
				modifiedItem = this._arrayOfAllItems[identity];
			}

			// Restore the original item into a full-fledged item again, we want to try to
			// keep the same object instance as if we don't it, causes bugs like #9022.
			copyOfItemState[this._storeRefPropName] = this;
			for(var key in modifiedItem){
				delete modifiedItem[key];
			}
			lang.mixin(modifiedItem, copyOfItemState);
		}
		var deletedItem;
		for(identity in this._pending._deletedItems){
			deletedItem = this._pending._deletedItems[identity];
			deletedItem[this._storeRefPropName] = this;
			var index = deletedItem[this._itemNumPropName];

			//Restore the reverse refererence map, if any.
			if(deletedItem["backup_" + this._reverseRefMap]){
				deletedItem[this._reverseRefMap] = deletedItem["backup_" + this._reverseRefMap];
				delete deletedItem["backup_" + this._reverseRefMap];
			}
			this._arrayOfAllItems[index] = deletedItem;
			if(this._itemsByIdentity){
				this._itemsByIdentity[identity] = deletedItem;
			}
			if(deletedItem[this._rootItemPropName]){
				this._arrayOfTopLevelItems.push(deletedItem);
			}
		}
		//We have to pass through it again and restore the reference maps after all the
		//undeletes have occurred.
		for(identity in this._pending._deletedItems){
			deletedItem = this._pending._deletedItems[identity];
			if(deletedItem["backupRefs_" + this._reverseRefMap]){
				arrayUtil.forEach(deletedItem["backupRefs_" + this._reverseRefMap], function(reference){
					var refItem;
					if(this._itemsByIdentity){
						refItem = this._itemsByIdentity[reference.id];
					}else{
						refItem = this._arrayOfAllItems[reference.id];
					}
					this._addReferenceToMap(refItem, deletedItem, reference.attr);
				}, this);
				delete deletedItem["backupRefs_" + this._reverseRefMap];
			}
		}

		for(identity in this._pending._newItems){
			var newItem = this._pending._newItems[identity];
			newItem[this._storeRefPropName] = null;
			// null out the new item, but don't change the array index so
			// so we can keep using _arrayOfAllItems.length.
			this._arrayOfAllItems[newItem[this._itemNumPropName]] = null;
			if(newItem[this._rootItemPropName]){
				this._removeArrayElement(this._arrayOfTopLevelItems, newItem);
			}
			if(this._itemsByIdentity){
				delete this._itemsByIdentity[identity];
			}
		}

		this._pending = {
			_newItems:{},
			_modifiedItems:{},
			_deletedItems:{}
		};
		return true; // boolean
	},

	isDirty: function(/* item? */ item){
		// summary: See dojo.data.api.Write.isDirty()
		if(item){
			// return true if the item is dirty
			var identity = this.getIdentity(item);
			return new Boolean(this._pending._newItems[identity] ||
				this._pending._modifiedItems[identity] ||
				this._pending._deletedItems[identity]).valueOf(); // boolean
		}else{
			// return true if the store is dirty -- which means return true
			// if there are any new items, dirty items, or modified items
			return !this._isEmpty(this._pending._newItems) ||
				!this._isEmpty(this._pending._modifiedItems) ||
				!this._isEmpty(this._pending._deletedItems); // boolean
		}
	},

/* dojo.data.api.Notification */

	onSet: function(/* item */ item,
					/*attribute-name-string*/ attribute,
					/*object|array*/ oldValue,
					/*object|array*/ newValue){
		// summary: See dojo.data.api.Notification.onSet()

		// No need to do anything. This method is here just so that the
		// client code can connect observers to it.
	},

	onNew: function(/* item */ newItem, /*object?*/ parentInfo){
		// summary: See dojo.data.api.Notification.onNew()

		// No need to do anything. This method is here just so that the
		// client code can connect observers to it.
	},

	onDelete: function(/* item */ deletedItem){
		// summary: See dojo.data.api.Notification.onDelete()

		// No need to do anything. This method is here just so that the
		// client code can connect observers to it.
	},

	close: function(/* object? */ request){
		 // summary:
		 //		Over-ride of base close function of ItemFileReadStore to add in check for store state.
		 // description:
		 //		Over-ride of base close function of ItemFileReadStore to add in check for store state.
		 //		If the store is still dirty (unsaved changes), then an error will be thrown instead of
		 //		clearing the internal state for reload from the url.

		 //Clear if not dirty ... or throw an error
		 if(this.clearOnClose){
			 if(!this.isDirty()){
				 this.inherited(arguments);
			 }else{
				 //Only throw an error if the store was dirty and we were loading from a url (cannot reload from url until state is saved).
				 throw new Error("dojo.data.ItemFileWriteStore: There are unsaved changes present in the store.  Please save or revert the changes before invoking close.");
			 }
		 }
	}
});

});

},
'versa/api/Application':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 24/11/11
 * Time: 1:30 PM
 * To change this template use File | Settings | File Templates.
 */

define("versa/api/Application", ["dojo/_base/declare",
        "versa/api/DataTypes",
        "versa/api/Operators"],
    function(declare){
        var o=declare("versa.api.Application", [], {

        });

        o._data_types = null;
        o._operators = null;

        o.getDataTypes = function(){

            if(!versa.api.Application._data_types){
                versa.api.Application._data_types = new versa.api.DataTypes();
                versa.api.Application._data_types.fetch();
            }
            return versa.api.Application._data_types;
        };

        o.getOperators = function(){

            if(!versa.api.Application._operators){
                versa.api.Application._operators = new versa.api.Operators();
                versa.api.Application._operators.fetch();
            }
            return versa.api.Application._operators;
        };

        return o;
    }
);



},
'versa/api/PropertyMappings':function(){
/**
 * @author Scott
 */
define("versa/api/PropertyMappings", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Error",
        "versa/api/PropertyMapping"],
    function(declare){
        var o=declare("versa.api.PropertyMappings", [versa.api._Collection], {
            constructor: function(/* Object */args){
                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.PropertyMappings.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.PropertyMapping.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.getDefault= function(propMap, propDefs){
            var propertyDefinition=propDefs.fetchById({id: propMap.property_definition_id});
            if(propertyDefinition.isTypeDate()&&propMap.default_type==versa.api.PropertyMapping.types.date.floating){
                var date=new Date();
                date.setDate(date.getDate()+parseInt(propMap.default_value));
                return date;
            }else{
                if(propMap.default_value){
                    if(propertyDefinition.isTypeInteger()){
                        return parseInt(propMap.default_value);
                    }else if(propertyDefinition.isTypeFloat()){
                        return parseFloat(propMap.default_value);
                    }
                    return propMap.default_value;
                }
            }
            return null;
        };

        o.TRGT='/zones/{0}/libraries/{1}/property_mappings';

        return o;
    }
);


},
'dojox/mobile/ViewController':function(){
define("dojox/mobile/ViewController", [
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
//	"dojo/hash", // optionally prereq'ed
	"dojo/on",
	"dojo/ready",
	"dijit/registry",	// registry.byId
	"./ProgressIndicator",
	"./TransitionEvent"
], function(dojo, array, connect, declare, lang, win, dom, domClass, domConstruct, on, ready, registry, ProgressIndicator, TransitionEvent){

	// module:
	//		dojox/mobile/ViewController
	// summary:
	//		A singleton class that controlls view transition.

	var dm = lang.getObject("dojox.mobile", true);

	var Controller = declare("dojox.mobile.ViewController", null, {
		// summary:
		//		A singleton class that controlls view transition.
		// description:
		//		This class listens to the "startTransition" events and performs
		//		view transitions. If the transition destination is an external
		//		view specified with the url parameter, retrieves the view
		//		content and parses it to create a new target view.

		constructor: function(){
			this.viewMap={};
			this.currentView=null;
			this.defaultView=null;
			ready(lang.hitch(this, function(){
				on(win.body(), "startTransition", lang.hitch(this, "onStartTransition"));
			}));
		},

		findCurrentView: function(moveTo,src){
			// summary:
			//		Searches for the currently showing view.
			if(moveTo){
				var w = registry.byId(moveTo);
				if(w && w.getShowingView){ return w.getShowingView(); }
			}
			if(dm.currentView){
				return dm.currentView; //TODO:1.8 may not return an expected result especially when views are nested
			}
			//TODO:1.8 probably never reaches here
			w = src;
			while(true){
				w = w.getParent();
				if(!w){ return null; }
				if(domClass.contains(w.domNode, "mblView")){ break; }
			}
			return w;
		},

		onStartTransition: function(evt){
			// summary:
			//		A handler that performs view transition.

			evt.preventDefault();
			if(!evt.detail || (evt.detail && !evt.detail.moveTo && !evt.detail.href && !evt.detail.url && !evt.detail.scene)){ return; }
			var w = this.findCurrentView(evt.detail.moveTo, (evt.target && evt.target.id)?registry.byId(evt.target.id):registry.byId(evt.target)); // the current view widget
			if(!w || (evt.detail && evt.detail.moveTo && w === registry.byId(evt.detail.moveTo))){ return; }
			if(evt.detail.href){
				var t = registry.byId(evt.target.id).hrefTarget;
				if(t){
					dm.openWindow(evt.detail.href, t);
				}else{
					w.performTransition(null, evt.detail.transitionDir, evt.detail.transition, evt.target, function(){location.href = evt.detail.href;});
				}
				return;
			} else if(evt.detail.scene){
				connect.publish("/dojox/mobile/app/pushScene", [evt.detail.scene]);
				return;
			}
			var moveTo = evt.detail.moveTo;
			if(evt.detail.url){
				var id;
				if(dm._viewMap && dm._viewMap[evt.detail.url]){
					// external view has already been loaded
					id = dm._viewMap[evt.detail.url];
				}else{
					// get the specified external view and append it to the <body>
					var text = this._text;
					if(!text){
						if(registry.byId(evt.target.id).sync){
							// We do not add explicit dependency on dojo/_base/xhr to this module
							// to be able to create a build that does not contain dojo/_base/xhr.
							// User applications that do sync loading here need to explicitly
							// require dojo/_base/xhr up front.
							dojo.xhrGet({url:evt.detail.url, sync:true, load:function(result){
								text = lang.trim(result);
							}});
						}else{
							var s = "dojo/_base/xhr"; // assign to a variable so as not to be picked up by the build tool
							require([s], lang.hitch(this, function(xhr){
								var prog = ProgressIndicator.getInstance();
								win.body().appendChild(prog.domNode);
								prog.start();
								var obj = xhr.get({
									url: evt.detail.url,
									handleAs: "text"
								});
								obj.addCallback(lang.hitch(this, function(response, ioArgs){
									prog.stop();
									if(response){
										this._text = response;
										new TransitionEvent(evt.target, {
												transition: evt.detail.transition,
											 	transitionDir: evt.detail.transitionDir,
											 	moveTo: moveTo,
											 	href: evt.detail.href,
											 	url: evt.detail.url,
											 	scene: evt.detail.scene},
											 		evt.detail)
											 			.dispatch();
									}
								}));
								obj.addErrback(function(error){
									prog.stop();
									console.log("Failed to load "+evt.detail.url+"\n"+(error.description||error));
								});
							}));
							return;
						}
					}
					this._text = null;
					id = this._parse(text, registry.byId(evt.target.id).urlTarget);
					if(!dm._viewMap){
						dm._viewMap = [];
					}
					dm._viewMap[evt.detail.url] = id;
				}
				moveTo = id;
				w = this.findCurrentView(moveTo,registry.byId(evt.target.id)) || w; // the current view widget
			}
			w.performTransition(moveTo, evt.detail.transitionDir, evt.detail.transition, null, null);
		},

		_parse: function(text, id){
			// summary:
			//		Parses the given view content.
			// description:
			//		If the content is html fragment, constructs dom tree with it
			//		and runs the parser. If the content is json data, passes it
			//		to _instantiate().
			var container, view, i, j, len;
			var currentView	 = this.findCurrentView();
			var target = registry.byId(id) && registry.byId(id).containerNode
						|| dom.byId(id)
						|| currentView && currentView.domNode.parentNode
						|| win.body();
			// if a fixed bottom bar exists, a new view should be placed before it.
			var refNode = null;
			for(j = target.childNodes.length - 1; j >= 0; j--){
				var c = target.childNodes[j];
				if(c.nodeType === 1){
					if(c.getAttribute("fixed") === "bottom"){
						refNode = c;
					}
					break;
				}
			}
			if(text.charAt(0) === "<"){ // html markup
				container = domConstruct.create("DIV", {innerHTML: text});
				for(i = 0; i < container.childNodes.length; i++){
					var n = container.childNodes[i];
					if(n.nodeType === 1){
						view = n; // expecting <div dojoType="dojox.mobile.View">
						break;
					}
				}
				if(!view){
					console.log("dojox.mobile.ViewController#_parse: invalid view content");
					return;
				}
				view.style.visibility = "hidden";
				target.insertBefore(container, refNode);
				var ws = dojo.parser.parse(container);
				array.forEach(ws, function(w){
					if(w && !w._started && w.startup){
						w.startup();
					}
				});

				// allows multiple root nodes in the fragment,
				// but transition will be performed to the 1st view.
				for(i = 0, len = container.childNodes.length; i < len; i++){
					target.insertBefore(container.firstChild, refNode); // reparent
				}
				target.removeChild(container);

				registry.byNode(view)._visible = true;
			}else if(text.charAt(0) === "{"){ // json
				container = domConstruct.create("DIV");
				target.insertBefore(container, refNode);
				this._ws = [];
				view = this._instantiate(eval('('+text+')'), container);
				for(i = 0; i < this._ws.length; i++){
					var w = this._ws[i];
					w.startup && !w._started && (!w.getParent || !w.getParent()) && w.startup();
				}
				this._ws = null;
			}
			view.style.display = "none";
			view.style.visibility = "visible";
			return dojo.hash ? "#" + view.id : view.id;
		},

		_instantiate: function(/*Object*/obj, /*DomNode*/node, /*Widget*/parent){
			// summary:
			//		Given the evaluated json data, does the same thing as what
			//		the parser does.
			var widget;
			for(var key in obj){
				if(key.charAt(0) == "@"){ continue; }
				var cls = lang.getObject(key);
				if(!cls){ continue; }
				var params = {};
				var proto = cls.prototype;
				var objs = lang.isArray(obj[key]) ? obj[key] : [obj[key]];
				for(var i = 0; i < objs.length; i++){
					for(var prop in objs[i]){
						if(prop.charAt(0) == "@"){
							var val = objs[i][prop];
							prop = prop.substring(1);
							if(typeof proto[prop] == "string"){
								params[prop] = val;
							}else if(typeof proto[prop] == "number"){
								params[prop] = val - 0;
							}else if(typeof proto[prop] == "boolean"){
							params[prop] = (val != "false");
							}else if(typeof proto[prop] == "object"){
								params[prop] = eval("(" + val + ")");
							}
						}
					}
					widget = new cls(params, node);
					if(node){ // to call View's startup()
						widget._visible = true;
						this._ws.push(widget);
					}
					if(parent && parent.addChild){
						parent.addChild(widget);
					}
					this._instantiate(objs[i], null, widget);
				}
			}
			return widget && widget.domNode;
		}
	});
	new Controller(); // singleton
	return Controller;
});


},
'versa/api/CellDefinitions':function(){
/**
 * @author Scott
 */
define("versa/api/CellDefinitions", ["dojo/_base/declare",
        "versa/api/CellDefinition",
        "versa/api/_Collection",
        "versa/api/Error"],
    function(declare){
        var o=declare("versa.api.CellDefinitions", [versa.api._Collection], {
            constructor: function(/* Object */args){
                this.zone=args.zone;
                this.library=args.library;
                this.target = dojo.replace(versa.api.CellDefinitions.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.CellDefinition.schema;
                this.cache=true;

                this._initialize();
            },

            isValidItem: function(args){
                var isValid = this.inherited(arguments);
                var item = args.item;

                if(!isValid) return;

                if((!item.width) || (item.width.length < 1))
                    throw new Error('Cell Definition \'Width\' property is empty or invalid');

                return true;
            }
        });

        o.getDefaultWidth = function(data_type_id){
            var w = 128

            switch(data_type_id){
                case versa.api.DataTypes.types.VOID:
                    w = 18;
                    break;
                case versa.api.DataTypes.types.BOOLEAN:
                    w = 64;
                    break;
                case versa.api.DataTypes.types.INTEGER:
                    w = 64;
                    break;
                case versa.api.DataTypes.types.FLOAT:
                    w = 64;
                    break;
                case versa.api.DataTypes.types.DATETIME:
                    w = 128;
                    break;
                case versa.api.DataTypes.types.STRING:
                    w = 128;
                    break;
                case versa.api.DataTypes.types.TEXT:
                    w = 128;
                    break;
            }

            return w;
        };
        o.TRGT="/zones/{0}/libraries/{1}/cell_definitions"

        return o;
    }
);




},
'versa/api/Operator':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 21/11/11
 * Time: 8:46 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Operator", ["dojo/_base/declare",
        "dojox/json/ref",
        "versa/api/Error"],
    function(declare){
        var o=declare("versa.api.Operator", [], {
            id: null,
            name: null,
            value: null,

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            }
        });

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'value': {
                    type: 'string'
                },
                'no_rhs': {
                    type: 'boolean'
                }

            },
            prototype: new o()
        };

        return o;
    }
);




},
'versa/api/Users':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 19/09/11
 * Time: 1:14 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Users", ["dojo/_base/declare",
         "versa/api/_Collection",
         "versa/api/User"],
    function(declare){
        var o=declare("versa.api.Users", [versa.api._Collection], {
            zone: null,

            constructor: function(args){
                this.zone = args.zone;
                this.target = dojo.replace(versa.api.Users.TRGT, this.zone);
                this.schema = versa.api.User.schema;
                this.cache = true;

                this._initialize();
            },

            getAdmin: function(){
                var admin = null;

                this.forEach(function(item){
                    if(item.is_admin)
                        admin = item;
                }, this);

                return admin;
            },

            reset: function(fingerprint, newPassword){
                versa.api.XhrHelper.doPostAction({
                    target: dojo.replace(versa.api.Users.RESET_TRGT, this.zone),
                    postData: {
                        f:fingerprint,
                        newPassword:newPassword
                    }
                })
            }
        });

        o.generatePassword = function(args){
            var len = args.length;
            var charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
            var pword = '';

            for(var i = 0; i < len; i++){
                pword += charset.charAt(Math.floor(Math.random()*(charset.length)));
            }
            return pword;
        };

        o.TRGT = '/zones/{subdomain}/users';
        o.RESET_TRGT = '/zones/{subdomain}/users/reset';

        return o;
    }
);


},
'versa/widget/mobile/Footing':function(){
require(["dojo/_base/declare",
         "dojox/mobile/TabBar",
         "dojox/mobile/TabBarButton"],
    function(declare){
        declare("versa.widget.mobile.Footing", [dijit._WidgetBase, dojox.mobile.TabBar], {
            barType: "segmentedControl",
            center: true,
            fixed: "bottom",
            showRoot: true,
            showSearch: true,
            reference: null,

            constructor: function(args){
                this.inherited('constructor', arguments);
            },

            postCreate: function(args){
                this.inherited('postCreate', arguments);

                if(this.showRoot){
                    this.footerRootButton=new dojox.mobile.TabBarButton({
                        label: "Root",
                        from: this.from,
                        onCommand: this.onCommand,
                        onClick: function(){
                            this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_ROOT, {from: this.from});
                            this.set('selected', false);
                        }
                    }, dojo.create("div"));
                    this.addChild(this.footerRootButton);
                }
                if(this.reference){
                    this.footerViewButton=new dojox.mobile.TabBarButton({
                        label: "View",
                        onCommand: this.onCommand,
                        reference: this.reference,
                        onClick: function(){
                            this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_CONTENT, {reference: this.reference});
                            this.set('selected', false);
                        }
                    }, dojo.create("div"));
                    this.addChild(this.footerViewButton);
                }
                if(this.showSearch){
                    this.footerSearchButton=new dojox.mobile.TabBarButton({
                        label: "Search",
                        from: this.from,
                        onCommand: this.onCommand,
                        onClick: function(){
                            this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_SEARCH, {from: this.from});
                            this.set('selected', false);
                        }
                    }, dojo.create("div"));
                    this.addChild(this.footerSearchButton);
                }
            }
        })
    }
);

},
'dojo/cache':function(){
define("dojo/cache", ["./_base/kernel", "./text"], function(dojo, text){
	// module:
	//		dojo/cache
	// summary:
	//		The module defines dojo.cache by loading dojo/text.

	//dojo.cache is defined in dojo/text
	return dojo.cache;
});

},
'versa/api/PermissionSet':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 08/03/12
 * Time: 11:51 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/PermissionSet", ["dojo/_base/declare"],
    function(declare){
        var o= declare("versa.api.PermissionSet", [], {
            _values: null,

            constructor: function(args){
                var seed = (args) ? args : false;
                this._values = new Array();
                for(var p in versa.api.PermissionIndices){
                    var idx = versa.api.PermissionIndices[p];
                    this._values[idx] = seed;
                }
            },

            andSet: function(prmSet){
                var resultSet = new versa.api.PermissionSet(true);

                for(var p in versa.api.PermissionIndices){
                    var idx = versa.api.PermissionIndices[p];
                    resultSet._values[idx] = (this._values[idx] && prmSet._values[idx]);
                }

                return resultSet;
            },

            orSet: function(prmSet){
                var resultSet = new versa.api.PermissionSet();

                for(var p in versa.api.PermissionIndices){
                    var idx = versa.api.PermissionIndices[p];
                    resultSet._values[idx] = (this._values[idx] || prmSet._values[idx]);
                }

                return resultSet;
            },

            getValue: function(index){
                return this._values[index];
            },

            setValue: function(index, value){
                this._values[index] = value;
            }
        });

        versa.api.PermissionIndices = {
            'CREATE':       0x00,
            'VIEW':         0x01,
            'COPY':         0x02,
            'EDIT':         0x03,
            'MOVE':         0x04,
            'CKO':          0x05,
            'CKI':          0x06,
            'CANCEL_CKO':   0x07,
            'VERSION':      0x08,
            'DELETE':       0x09,
            'SECURE':       0x0A,
            'RESTORE':      0x0B,
            'DESTROY':      0x0C

        }

        return o;
    }
);

},
'versa/api/ChoiceList':function(){
/**
 * @author Scott
 */
define("versa/api/ChoiceList", ["dojo/_base/declare",
        "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.ChoiceList", [versa.api._Object], {
            constructor: function(/* Object */args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            isValid: function(){
                var isValid = true;

                if (String.isEmpty(this.name.trim())) {
                    isValid = false;
                }

                if((!this.data_type_id) || (this.data_type_id < 1)){
                    isValid = false;
                }

                return isValid;
            }
        });

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': 'Property'
                },
                'data_type_id': {
                    type: 'integer'
                },
                'choice_values': {
                    type: 'array',
                    'default': [],
                    items: {
                        type: 'object',
                        properties: {
                            'sort_order': {
                                type: 'integer'
                            },
                            'name': {
                                type: 'string'
                            },
                            'value': {
                                type: 'string'
                            }
                        }
                    }
                },
                'created_at': {
                    type: 'string',
                    format: 'date-time',
                    'default': dojo.date.stamp.toISOString(new Date(), {zulu: true})
                },
                'created_by': {
                    type: 'string',
                    'default': ''
                },
                'updated_at': {
                    type: 'string',
                    format: 'date-time',
                    'default': dojo.date.stamp.toISOString(new Date(), {zulu: true})
                },
                'updated_by': {
                    type: 'string',
                    'default': ''
                }
            },
            prototype: new o()
        };
        return o;
    }
);


},
'dojox/main':function(){
define("dojox/main", ["dojo/_base/kernel"], function(dojo) {
	// module:
	//		dojox/main
	// summary:
	//		The dojox package main module; dojox package is somewhat unusual in that the main module currently just provides an empty object.

	return dojo.dojox;
});
},
'dojo/text':function(){
define("dojo/text", ["./_base/kernel", "require", "./has", "./_base/xhr"], function(dojo, require, has, xhr){
	// module:
	//		dojo/text
	// summary:
	//		This module implements the !dojo/text plugin and the dojo.cache API.
	// description:
	//		We choose to include our own plugin to leverage functionality already contained in dojo
	//		and thereby reduce the size of the plugin compared to various foreign loader implementations.
	//		Also, this allows foreign AMD loaders to be used without their plugins.
	//
	//		CAUTION: this module is designed to optionally function synchronously to support the dojo v1.x synchronous
	//		loader. This feature is outside the scope of the CommonJS plugins specification.

	var getText;
	if(1){
		getText= function(url, sync, load){
			xhr("GET", {url:url, sync:!!sync, load:load});
		};
	}else{
		// TODOC: only works for dojo AMD loader
		if(require.getText){
			getText= require.getText;
		}else{
			console.error("dojo/text plugin failed to load because loader does not support getText");
		}
	}

	var
		theCache= {},

		strip= function(text){
			//Strips <?xml ...?> declarations so that external SVG and XML
			//documents can be added to a document without worry. Also, if the string
			//is an HTML document, only the part inside the body tag is returned.
			if(text){
				text= text.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, "");
				var matches= text.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
				if(matches){
					text= matches[1];
				}
			}else{
				text = "";
			}
			return text;
		},

		notFound = {},

		pending = {},

		result= {
			dynamic:
				// the dojo/text caches it's own resources because of dojo.cache
				true,

			normalize:function(id, toAbsMid){
				// id is something like (path may be relative):
				//
				//	 "path/to/text.html"
				//	 "path/to/text.html!strip"
				var parts= id.split("!"),
					url= parts[0];
				return (/^\./.test(url) ? toAbsMid(url) : url) + (parts[1] ? "!" + parts[1] : "");
			},

			load:function(id, require, load){
				// id is something like (path is always absolute):
				//
				//	 "path/to/text.html"
				//	 "path/to/text.html!strip"
				var
					parts= id.split("!"),
					stripFlag= parts.length>1,
					absMid= parts[0],
					url = require.toUrl(parts[0]),
					text = notFound,
					finish = function(text){
						load(stripFlag ? strip(text) : text);
					};
				if(absMid in theCache){
					text = theCache[absMid];
				}else if(url in require.cache){
					text = require.cache[url];
				}else if(url in theCache){
					text = theCache[url];
				}
				if(text===notFound){
					if(pending[url]){
						pending[url].push(finish);
					}else{
						var pendingList = pending[url] = [finish];
						getText(url, !require.async, function(text){
							theCache[absMid]= theCache[url]= text;
							for(var i = 0; i<pendingList.length;){
								pendingList[i++](text);
							}
							delete pending[url];
						});
					}
				}else{
					finish(text);
				}
			}
		};

	dojo.cache= function(/*String||Object*/module, /*String*/url, /*String||Object?*/value){
		//	 * (string string [value]) => (module, url, value)
		//	 * (object [value])        => (module, value), url defaults to ""
		//
		//	 * if module is an object, then it must be convertable to a string
		//	 * (module, url) module + (url ? ("/" + url) : "") must be a legal argument to require.toUrl
		//	 * value may be a string or an object; if an object then may have the properties "value" and/or "sanitize"
		var key;
		if(typeof module=="string"){
			if(/\//.test(module)){
				// module is a version 1.7+ resolved path
				key = module;
				value = url;
			}else{
				// module is a version 1.6- argument to dojo.moduleUrl
				key = require.toUrl(module.replace(/\./g, "/") + (url ? ("/" + url) : ""));
			}
		}else{
			key = module + "";
			value = url;
		}
		var
			val = (value != undefined && typeof value != "string") ? value.value : value,
			sanitize = value && value.sanitize;

		if(typeof val == "string"){
			//We have a string, set cache value
			theCache[key] = val;
			return sanitize ? strip(val) : val;
		}else if(val === null){
			//Remove cached value
			delete theCache[key];
			return null;
		}else{
			//Allow cache values to be empty strings. If key property does
			//not exist, fetch it.
			if(!(key in theCache)){
				getText(key, true, function(text){
					theCache[key]= text;
				});
			}
			return sanitize ? strip(theCache[key]) : theCache[key];
		}
	};

	return result;

/*=====
dojo.cache = function(module, url, value){
	// summary:
	//		A getter and setter for storing the string content associated with the
	//		module and url arguments.
	// description:
	//		If module is a string that contains slashes, then it is interpretted as a fully
	//		resolved path (typically a result returned by require.toUrl), and url should not be
	//		provided. This is the preferred signature. If module is a string that does not
	//		contain slashes, then url must also be provided and module and url are used to
	//		call `dojo.moduleUrl()` to generate a module URL. This signature is deprecated.
	//		If value is specified, the cache value for the moduleUrl will be set to
	//		that value. Otherwise, dojo.cache will fetch the moduleUrl and store it
	//		in its internal cache and return that cached value for the URL. To clear
	//		a cache value pass null for value. Since XMLHttpRequest (XHR) is used to fetch the
	//		the URL contents, only modules on the same domain of the page can use this capability.
	//		The build system can inline the cache values though, to allow for xdomain hosting.
	// module: String||Object
	//		If a String with slashes, a fully resolved path; if a String without slashes, the
	//		module name to use for the base part of the URL, similar to module argument
	//		to `dojo.moduleUrl`. If an Object, something that has a .toString() method that
	//		generates a valid path for the cache item. For example, a dojo._Url object.
	// url: String
	//		The rest of the path to append to the path derived from the module argument. If
	//		module is an object, then this second argument should be the "value" argument instead.
	// value: String||Object?
	//		If a String, the value to use in the cache for the module/url combination.
	//		If an Object, it can have two properties: value and sanitize. The value property
	//		should be the value to use in the cache, and sanitize can be set to true or false,
	//		to indicate if XML declarations should be removed from the value and if the HTML
	//		inside a body tag in the value should be extracted as the real value. The value argument
	//		or the value property on the value argument are usually only used by the build system
	//		as it inlines cache content.
	//	example:
	//		To ask dojo.cache to fetch content and store it in the cache (the dojo["cache"] style
	//		of call is used to avoid an issue with the build system erroneously trying to intern
	//		this example. To get the build system to intern your dojo.cache calls, use the
	//		"dojo.cache" style of call):
	//		| //If template.html contains "<h1>Hello</h1>" that will be
	//		| //the value for the text variable.
	//		| var text = dojo["cache"]("my.module", "template.html");
	//	example:
	//		To ask dojo.cache to fetch content and store it in the cache, and sanitize the input
	//		 (the dojo["cache"] style of call is used to avoid an issue with the build system
	//		erroneously trying to intern this example. To get the build system to intern your
	//		dojo.cache calls, use the "dojo.cache" style of call):
	//		| //If template.html contains "<html><body><h1>Hello</h1></body></html>", the
	//		| //text variable will contain just "<h1>Hello</h1>".
	//		| var text = dojo["cache"]("my.module", "template.html", {sanitize: true});
	//	example:
	//		Same example as previous, but demostrates how an object can be passed in as
	//		the first argument, then the value argument can then be the second argument.
	//		| //If template.html contains "<html><body><h1>Hello</h1></body></html>", the
	//		| //text variable will contain just "<h1>Hello</h1>".
	//		| var text = dojo["cache"](new dojo._Url("my/module/template.html"), {sanitize: true});
	return val; //String
};
=====*/
});


},
'versa/api/Error':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/09/11
 * Time: 5:12 PM
 * To change this template use File | Settings | File Templates.
 */

define("versa/api/Error", ["dojo/_base/declare"],
    function(declare){
        return declare("versa.api.Error", [], {
            status: 400,
            message: '',
            innerMessage: '',
            err: null,
            name: null,
            lineNumber: -1,
            fileName: null,
            stack: null,

            //err: can be an javascript error object OR
            //an error object returned from a call to the JsonRestStore
            constructor: function(message, err){

                this.message = message;
                this.err = err;

                if(this.err){
                    if(this.err.hasOwnProperty('status')){
                        this.status = this.err.status;
                    }
                    if(this.err.hasOwnProperty('responseText')){
                        this.innerMessage = this.err.responseText;
                    }
                    else if(this.err.hasOwnProperty('message')){
                        this.innerMessage = this.err.message;
                    }
                    else if(this.err.hasOwnProperty('description')){
                        this.innerMessage = this.err.description;
                    }
                }

            },

            getContent: function(showDetails){
                var msg = this.message;

                if((showDetails) && (this.innerMessage))
                    msg += ':<br>' + this.innerMessage;

                return msg;
            },

            getMessage: function(showDetails){
                var msg = this.message;

                if((showDetails) && (this.innerMessage))
                    msg += ':\n' + this.innerMessage;

                return msg;
            }
        });
    }
);

},
'versa/api/Utilities':function(){
/**
 * @author Scott
 */
define("versa/api/Utilities", ["dojo/_base/declare"],
    function(declare){
        var o=declare("versa.api.Utilities", [], {});

        o.uniqueIdBase = (new Date()).getTime();

        o.randomNumber = function(args){
            var l = args.lowerBound;
            var u = args.upperBound;

            return (Math.floor(Math.random() * (u - l)) + l);
        }

        o.readablizeBytes = function(args){
            var strBytes = ''
            var bytes = args.bytes;

            if((bytes == null) || (bytes == Number.NaN))
                return '???';

            if(bytes < 1)
                return '0 bytes';

            var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
            var e = Math.floor(Math.log(bytes)/Math.log(1024));

            if(e > 0){
                strBytes = (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + ' ' + s[e];
            }
            else{
                strBytes = (bytes / Math.pow(1024, Math.floor(e))).toFixed(0) + ' ' + s[e];
            }

            return strBytes;
        }

        o.readabilizeSeconds = function(args){
             var s = args.seconds;

             var d = Number(s);
             var h = Math.floor(d / 3600);
             var m = Math.floor(d % 3600 / 60);
             var s = Math.floor(d % 3600 % 60);

             return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
        };

        o.generateUniqueId = function(args){
            return versa.api.Utilities.uniqueIdBase++;
        };

        o.isArray = function(arr){
            return arr.constructor == Array;
        }

        o.generateUniqueName = function(args){
            var names = args.names;
            var baseName = args.base_name;
            var appendix = (args.appendix) ? args.appendix : '({index})'


            var currName = baseName;
            var i = 0;
            while(++i){

                var idx = dojo.indexOf(names, currName);
                if(idx < 0)
                    break;

                currName = dojo.replace('{baseName}' + appendix , { baseName: baseName, index: i });
            }

            return currName;
        }

        o.getFileExtension = function(args){
            var fileName = args.file_name;

            var pos = fileName.lastIndexOf('.');
            if(pos < 1)
                return '';

            return fileName.substring(pos);
        }

        o.getFileName = function(args){
            var file_name = args.file_name;
            var pos = file_name.lastIndexOf('.');
            if(pos < 1)
                return file_name;

            return file_name.substring(0, pos);
        }

        o.saveUrl = function(args){
            var url = args.url;
            var winName = args.window_name;

            var winArgs = dojo.string.substitute(
                                        'width=10,height=10,top=-20,left=-20,toolbar=0,resizable=1,location=0,directories=0,status=0,menubar=0',
                                        [])

            window.location.href = url;
        }

        o.getBox = function(args){

            var windowBox = dojo.window.getBox();

            var screenW = windowBox.w;
            var screenH = windowBox.h;

            var winW = screenW * args.scale;
            var winH = screenH * args.scale;
            var winT = (screenH / 2) - (winH / 2);
            var winL = (screenW / 2) - (winW / 2);

            return {w: winW, h: winH, t: winT, l: winL };


        };

        o.getFormatStore=function(){

            var items = [
                {
                    id: versa.api.DataTypes.types.BOOLEAN + ':' + versa.api.CellDefinition.formats.none,
                    format_id: versa.api.CellDefinition.formats.none,
                    data_type_id: versa.api.DataTypes.types.BOOLEAN,
                    name: 'None'
                },
                {
                    id: versa.api.DataTypes.types.DATETIME + ':' + versa.api.CellDefinition.formats.none,
                    format_id: versa.api.CellDefinition.formats.none,
                    data_type_id: versa.api.DataTypes.types.DATETIME,
                    name: 'None'
                },
                {
                    id: versa.api.DataTypes.types.DATETIME + ':' + versa.api.CellDefinition.formats.datetime,
                    format_id: versa.api.CellDefinition.formats.datetime,
                    data_type_id: versa.api.DataTypes.types.DATETIME,
                    name: 'Date'
                },
                {
                    id: versa.api.DataTypes.types.FLOAT + ':' + versa.api.CellDefinition.formats.none,
                    format_id: versa.api.CellDefinition.formats.none,
                    data_type_id: versa.api.DataTypes.types.FLOAT,
                    name: 'None'
                },
                {
                    id: versa.api.DataTypes.types.INTEGER + ':' + versa.api.CellDefinition.formats.none,
                    format_id: versa.api.CellDefinition.formats.none,
                    data_type_id: versa.api.DataTypes.types.INTEGER,
                    name: 'None'
                },
                {
                    id: versa.api.DataTypes.types.INTEGER + ':' + versa.api.CellDefinition.formats.size,
                    format_id: versa.api.CellDefinition.formats.size,
                    data_type_id: versa.api.DataTypes.types.INTEGER,
                    name: 'File Size'
                },
                {
                    id: versa.api.DataTypes.types.STRING + ':' + versa.api.CellDefinition.formats.none,
                    format_id: versa.api.CellDefinition.formats.none,
                    data_type_id: versa.api.DataTypes.types.STRING,
                    name: 'None'
                },
                {
                    id: versa.api.DataTypes.types.TEXT + ':' + versa.api.CellDefinition.formats.none,
                    format_id: versa.api.CellDefinition.formats.none,
                    data_type_id: versa.api.DataTypes.types.TEXT,
                    name: 'None'
                }
            ];

            return new versa.api.ItemFileWriteStore({
                data: {
                    identifier: 'id',
                    label: 'name',
                    items: items
                }
            });
        };

        o.viewUrl = function(args){
            var box = args.windowBox;
            var url = args.url;
            var winName = args.window_name;

            var winArgs = dojo.string.substitute(
                                        'width=${0},height=${1},top=${2},left=${3},toolbar=0,resizable=1,location=0,directories=0,status=0,menubar=0,scrollbars=1',
                                        [box.w, box.h, box.t, box.l])

            if(!dojo.isIE){
                //for non ie browsers
                var win = window.open(url, winName, winArgs);
                win.focus();
            }else{
                var win = window.open(url, '_blank', winArgs);
                win.focus();
            }
        };

        o.iePdfPluginInstalled=function(){
            if (window.ActiveXObject) {
                var control = null;
                try {
                    // AcroPDF.PDF is used by version 7 and later
                    control = new ActiveXObject('AcroPDF.PDF');
                } catch (e) {
                    // Do nothing
                }
                if (!control) {
                    try {
                      // PDF.PdfCtrl is used by version 6 and earlier
                      control = new ActiveXObject('PDF.PdfCtrl');
                    } catch (e) {
                        //do nothing again
                    }
                }
                if (control) {
                    return true;
                }
            }
            return false;
        }

        o.formatDate= function(date){
            //UTC month is 0 based?
            //date and year are not
            var monthS=(date.getUTCMonth()+1).toString();
            var dateS=date.getUTCDate().toString();
            var hourS=date.getUTCHours().toString();
            monthS=monthS.length==1?"0"+monthS:monthS;
            dateS=dateS.length==1?"0"+dateS:dateS;
            hourS=hourS.length==1?"0"+hourS:hourS;

            return date.getUTCFullYear()+'-'+
                   monthS+'-'+
                   dateS+'T'+
                   hourS+':00:00Z';
        };

        o.validateEmail=function(str){
            // These comments use the following terms from RFC2822:
            // local-part, domain, domain-literal and dot-atom.
            // Does the address contain a local-part followed an @ followed by a domain?
            // Note the use of lastIndexOf to find the last @ in the address
            // since a valid email address may have a quoted @ in the local-part.
            // Does the domain name have at least two parts, i.e. at least one dot,
            // after the @? If not, is it a domain-literal?
            // This will accept some invalid email addresses
            // BUT it doesn't reject valid ones.
            var atSym = str.lastIndexOf("@");
            if (atSym < 1) { return false; } // no local-part
            if (atSym == str.length - 1) { return false; } // no domain
            if (atSym > 64) { return false; } // there may only be 64 octets in the local-part
            if (str.length - atSym > 255) { return false; } // there may only be 255 octets in the domain

            // Is the domain plausible?
            var lastDot = str.lastIndexOf(".");
            // Check if it is a dot-atom such as example.com
            if (lastDot > atSym + 1 && lastDot < str.length - 1) { return true; }
            //  Check if could be a domain-literal.
            if (str.charAt(atSym + 1) == '[' &&  str.charAt(str.length - 1) == ']') { return true; }
            return false;
        };

        return o;
    }
);





},
'versa/widget/folder/mobile/FolderView':function(){
require(["dojo/_base/declare",
         "dijit/_WidgetBase",
         "dojox/mobile/Heading",
         "dojox/mobile/ScrollableView",
         "dojox/mobile/EdgeToEdgeDataList",
         "dojox/mobile/ToolBarButton",
         "versa/api/Folders",
         "versa/api/Documents",
         "versa/api/Zones",
         "dojo/data/ItemFileWriteStore"],
    function(declare){
        declare("versa.widget.folder.mobile.FolderView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
            folder: null,
            library: null,

            folders: null,
            references: null,

            folderStore: null,
            refStore: null,

            etedlMain: null,
            header: null,
            footer: null,

            constructor: function(args){
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.folders=this.library.getFolders();
                this.references=this.library.getReferences();

                this.folderStore=this.folders.store;
                this.refStore=this.references.store;

                this.folderStore.clearCache();
                var folders=this.folderStore.fetch({query:{parent_id: this.folder.id}}).results;
                var documents=this.refStore.fetch({query: {type: 1, query: this.folder.id, view: this.folder.view_definition_id}}).results;

                var entries=[];
                dojo.forEach(folders, function(folder){
                    if(!(folder.isSearch()||folder.isTrash()||folder.isShareRoot())){
                        entries.push(
                            {
                                label: folder.name,
                                item: folder,
                                parent: this.folder,
                                onCommand: this.onCommand,
                                icon: '../../images/icons/32/folder.png',
                                clickable: true,
                                onClick: function(){
                                    this.select(true);
                                    setTimeout('var caller=dijit.byId(\''+this.id+'\');' +
                                               'caller.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_FOLDER, {parent: caller.parent, folder:caller.item});', 3);
//                                    this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_FOLDER, {parent: this.parent, folder:this.item});
                                }
                            }
                        );
                    }
                }, this);

                dojo.forEach(documents, function(document){
                    entries.push(
                        {
                            label: document.name,
                            item: document,
                            from: this,
                            onCommand: this.onCommand,
                            icon: '../../images/mimetypes/32/default.png',
                            clickable: true,
                            onClick: function(){
                                this.select(true);
                                setTimeout('var caller=dijit.byId(\''+this.id+'\');' +
                                           'caller.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_PROPERTIES, {from: caller.from, reference:caller.item});', 3);
                            }
                        }
                    );
                }, this);

                var storeData = {
                    items: entries
                };

                var store = new dojo.data.ItemFileWriteStore({
                    data: storeData
                });

                this.header=new versa.widget.mobile.Heading({
                    label: this.folder.name,
                    from: this,
                    back: this.back,
                    onCommand: this.onCommand
                });

                this.footer=new versa.widget.mobile.Footing({
                    showRoot: !this.folder.isRoot(),
                    onCommand: this.onCommand,
                    from: this
                });

                this.etedlMain=new dojox.mobile.EdgeToEdgeDataList({
                    store: store,
                    iconBase: '../../images/mimetypes/48/default.png'
                });

                this.addChild(this.header);
                this.addChild(this.footer);
                this.addChild(this.etedlMain);
            },



            startup: function(){
                this.inherited('startup', arguments);
                this.etedlMain.startup();
            }
        });
    }
);


},
'dojox/mobile/ListItem':function(){
define("dojox/mobile/ListItem", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/has",
	"./common",
	"./_ItemBase",
	"./TransitionEvent"
], function(array, connect, declare, lang, domClass, domConstruct, has, common, ItemBase, TransitionEvent){

/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/ListItem
	// summary:
	//		An item of either RoundRectList or EdgeToEdgeList.

	return declare("dojox.mobile.ListItem", ItemBase, {
		// summary:
		//		An item of either RoundRectList or EdgeToEdgeList.
		// description:
		//		ListItem represents an item of either RoundRectList or
		//		EdgeToEdgeList. There are three ways to move to a different
		//		view, moveTo, href, and url. You can choose only one of them.

		// rightText: String
		//		A right-aligned text to display on the item.
		rightText: "",

		// rightIcon: String
		//		An icon to display at the right hand side of the item. The value
		//		can be either a path for an image file or a class name of a DOM
		//		button.
		rightIcon: "",

		// rightIcon2: String
		//		An icon to display at the left of the rightIcon. The value can
		//		be either a path for an image file or a class name of a DOM
		//		button.
		rightIcon2: "",


		// anchorLabel: Boolean
		//		If true, the label text becomes a clickable anchor text. When
		//		the user clicks on the text, the onAnchorLabelClicked handler is
		//		called. You can override or connect to the handler and implement
		//		any action. The handler has no default action.
		anchorLabel: false,

		// noArrow: Boolean
		//		If true, the right hand side arrow is not displayed.
		noArrow: false,

		// selected: Boolean
		//		If true, the item is highlighted to indicate it is selected.
		selected: false,

		// checked: Boolean
		//		If true, a check mark is displayed at the right of the item.
		checked: false,

		// arrowClass: String
		//		An icon to display as an arrow. The value can be either a path
		//		for an image file or a class name of a DOM button.
		arrowClass: "mblDomButtonArrow",

		// checkClass: String
		//		An icon to display as a check mark. The value can be either a
		//		path for an image file or a class name of a DOM button.
		checkClass: "mblDomButtonCheck",

		// variableHeight: Boolean
		//		If true, the height of the item varies according to its
		//		content. In dojo 1.6 or older, the "mblVariableHeight" class was
		//		used for this purpose. In dojo 1.7, adding the mblVariableHeight
		//		class still works for backward compatibility.
		variableHeight: false,


		// rightIconTitle: String
		//		An alt text for the right icon.
		rightIconTitle: "",

		// rightIcon2Title: String
		//		An alt text for the right icon2.
		rightIcon2Title: "",


		// btnClass: String
		//		Deprecated. For backward compatibility.
		btnClass: "",

		// btnClass2: String
		//		Deprecated. For backward compatibility.
		btnClass2: "",

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "li",

		postMixInProperties: function(){
			// for backward compatibility
			if(this.btnClass){
				this.rightIcon = this.btnClass;
			}
			this._setBtnClassAttr = this._setRightIconAttr;
			this._setBtnClass2Attr = this._setRightIcon2Attr;
		},

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.inherited(arguments);
			this.domNode.className = "mblListItem" + (this.selected ? " mblItemSelected" : "");

			// label
			var box = this.box = domConstruct.create("DIV");
			box.className = "mblListItemTextBox";
			if(this.anchorLabel){
				box.style.cursor = "pointer";
			}
			var r = this.srcNodeRef;
			if(r && !this.label){
				this.label = "";
				for(var i = 0, len = r.childNodes.length; i < len; i++){
					var n = r.firstChild;
					if(n.nodeType === 3 && lang.trim(n.nodeValue) !== ""){
						n.nodeValue = this._cv ? this._cv(n.nodeValue) : n.nodeValue;
						this.labelNode = domConstruct.create("SPAN", {className:"mblListItemLabel"});
						this.labelNode.appendChild(n);
						n = this.labelNode;
					}
					box.appendChild(n);
				}
			}
			if(!this.labelNode){
				this.labelNode = domConstruct.create("SPAN", {className:"mblListItemLabel"}, box);
			}
			if(this.anchorLabel){
				box.style.display = "inline"; // to narrow the text region
			}

			var a = this.anchorNode = domConstruct.create("A");
			a.className = "mblListItemAnchor";
			this.domNode.appendChild(a);
			a.appendChild(box);
		},

		startup: function(){
			if(this._started){ return; }
			this.inheritParams();
			var parent = this.getParent();
			if(this.moveTo || this.href || this.url || this.clickable || (parent && parent.select)){
				this._onClickHandle = this.connect(this.anchorNode, "onclick", "onClick");
			}
			this.setArrow();

			if(domClass.contains(this.domNode, "mblVariableHeight")){
				this.variableHeight = true;
			}
			if(this.variableHeight){
				domClass.add(this.domNode, "mblVariableHeight");
				setTimeout(lang.hitch(this, "layoutVariableHeight"));
			}

			this.set("icon", this.icon); // _setIconAttr may be called twice but this is necessary for offline instantiation
			if(!this.checked && this.checkClass.indexOf(',') !== -1){
				this.set("checked", this.checked);
			}
			this.inherited(arguments);
		},

		resize: function(){
			if(this.variableHeight){
				this.layoutVariableHeight();
			}
		},

		onClick: function(e){
			var a = e.currentTarget;
			var li = a.parentNode;
			if(domClass.contains(li, "mblItemSelected")){ return; } // already selected
			if(this.anchorLabel){
				for(var p = e.target; p.tagName !== this.tag.toUpperCase(); p = p.parentNode){
					if(p.className == "mblListItemTextBox"){
						domClass.add(p, "mblListItemTextBoxSelected");
						setTimeout(function(){
							domClass.remove(p, "mblListItemTextBoxSelected");
						}, has("android") ? 300 : 1000);
						this.onAnchorLabelClicked(e);
						return;
					}
				}
			}
			var parent = this.getParent();
			if(parent.select){
				if(parent.select === "single"){
					if(!this.checked){
						this.set("checked", true);
					}
				}else if(parent.select === "multiple"){
					this.set("checked", !this.checked);
				}
			}
			this.select();

			if (this.href && this.hrefTarget) {
				common.openWindow(this.href, this.hrefTarget);
				return;
			}
			var transOpts;
			if(this.moveTo || this.href || this.url || this.scene){
				transOpts = {moveTo: this.moveTo, href: this.href, url: this.url, scene: this.scene, transition: this.transition, transitionDir: this.transitionDir};
			}else if(this.transitionOptions){
				transOpts = this.transitionOptions;
			}	

			if(transOpts){
				this.setTransitionPos(e);
				return new TransitionEvent(this.domNode,transOpts,e).dispatch();
			}
		},
	
		select: function(){
			// summary:
			//		Makes this widget in the selected state.
			var parent = this.getParent();
			if(parent.stateful){
				parent.deselectAll();
			}else{
				var _this = this;
				setTimeout(function(){
					_this.deselect();
				}, has("android") ? 300 : 1000);
			}
			domClass.add(this.domNode, "mblItemSelected");
		},
	
		deselect: function(){
			// summary:
			//		Makes this widget in the deselected state.
			domClass.remove(this.domNode, "mblItemSelected");
		},
	
		onAnchorLabelClicked: function(e){
			// summary:
			//		Stub function to connect to from your application.
		},

		layoutVariableHeight: function(){
			var h = this.anchorNode.offsetHeight;
			if(h === this.anchorNodeHeight){ return; }
			this.anchorNodeHeight = h;
			array.forEach([
					this.rightTextNode,
					this.rightIcon2Node,
					this.rightIconNode,
					this.iconNode
				], function(n){
					if(n){
						var t = Math.round((h - n.offsetHeight) / 2);
						n.style.marginTop = t + "px";
					}
				});
		},

		setArrow: function(){
			// summary:
			//		Sets the arrow icon if necessary.
			if(this.checked){ return; }
			var c = "";
			var parent = this.getParent();
			if(this.moveTo || this.href || this.url || this.clickable){
				if(!this.noArrow && !(parent && parent.stateful)){
					c = this.arrowClass;
				}
			}
			if(c){
				this._setRightIconAttr(c);
			}
		},

		_setIconAttr: function(icon){
			if(!this.getParent()){ return; } // icon may be invalid because inheritParams is not called yet
			this.icon = icon;
			var a = this.anchorNode;
			if(!this.iconNode){
				if(icon){
					var ref = this.rightIconNode || this.rightIcon2Node || this.rightTextNode || this.box;
					this.iconNode = domConstruct.create("DIV", {className:"mblListItemIcon"}, ref, "before");
				}
			}else{
				domConstruct.empty(this.iconNode);
			}
			if(icon && icon !== "none"){
				common.createIcon(icon, this.iconPos, null, this.alt, this.iconNode);
				if(this.iconPos){
					domClass.add(this.iconNode.firstChild, "mblListItemSpriteIcon");
				}
				domClass.remove(a, "mblListItemAnchorNoIcon");
			}else{
				domClass.add(a, "mblListItemAnchorNoIcon");
			}
		},
	
		_setCheckedAttr: function(/*Boolean*/checked){
			var parent = this.getParent();
			if(parent && parent.select === "single" && checked){
				array.forEach(parent.getChildren(), function(child){
					child.set("checked", false);
				});
			}
			this._setRightIconAttr(this.checkClass);

			var icons = this.rightIconNode.childNodes;
			if(icons.length === 1){
				this.rightIconNode.style.display = checked ? "" : "none";
			}else{
				icons[0].style.display = checked ? "" : "none";
				icons[1].style.display = !checked ? "" : "none";
			}

			domClass.toggle(this.domNode, "mblListItemChecked", checked);
			if(parent && this.checked !== checked){
				parent.onCheckStateChanged(this, checked);
			}
			this.checked = checked;
		},
	
		_setRightTextAttr: function(/*String*/text){
			if(!this.rightTextNode){
				this.rightTextNode = domConstruct.create("DIV", {className:"mblListItemRightText"}, this.box, "before");
			}
			this.rightText = text;
			this.rightTextNode.innerHTML = this._cv ? this._cv(text) : text;
		},
	
		_setRightIconAttr: function(/*String*/icon){
			if(!this.rightIconNode){
				var ref = this.rightIcon2Node || this.rightTextNode || this.box;
				this.rightIconNode = domConstruct.create("DIV", {className:"mblListItemRightIcon"}, ref, "before");
			}else{
				domConstruct.empty(this.rightIconNode);
			}
			this.rightIcon = icon;
			var arr = (icon || "").split(/,/);
			if(arr.length === 1){
				common.createIcon(icon, null, null, this.rightIconTitle, this.rightIconNode);
			}else{
				common.createIcon(arr[0], null, null, this.rightIconTitle, this.rightIconNode);
				common.createIcon(arr[1], null, null, this.rightIconTitle, this.rightIconNode);
			}
		},
	
		_setRightIcon2Attr: function(/*String*/icon){
			if(!this.rightIcon2Node){
				var ref = this.rightTextNode || this.box;
				this.rightIcon2Node = domConstruct.create("DIV", {className:"mblListItemRightIcon2"}, ref, "before");
			}else{
				domConstruct.empty(this.rightIcon2Node);
			}
			this.rightIcon2 = icon;
			common.createIcon(icon, null, null, this.rightIcon2Title, this.rightIcon2Node);
		},
	
		_setLabelAttr: function(/*String*/text){
			this.label = text;
			this.labelNode.innerHTML = this._cv ? this._cv(text) : text;
		}
	});
});

},
'dojo/cldr/nls/gregorian':function(){
define("dojo/cldr/nls/gregorian", { root:

//begin v1.x content
{
	"months-format-narrow": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12"
	],
	"quarters-standAlone-narrow": [
		"1",
		"2",
		"3",
		"4"
	],
	"field-weekday": "Day of the Week",
	"dateFormatItem-yQQQ": "y QQQ",
	"dateFormatItem-yMEd": "EEE, y-M-d",
	"dateFormatItem-MMMEd": "E MMM d",
	"eraNarrow": [
		"BCE",
		"CE"
	],
	"dateTimeFormats-appendItem-Day-Of-Week": "{0} {1}",
	"dateFormat-long": "y MMMM d",
	"months-format-wide": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12"
	],
	"dateTimeFormat-medium": "{1} {0}",
	"dateFormatItem-EEEd": "d EEE",
	"dayPeriods-format-wide-pm": "PM",
	"dateFormat-full": "EEEE, y MMMM dd",
	"dateFormatItem-Md": "M-d",
	"dayPeriods-format-abbr-am": "AM",
	"dateTimeFormats-appendItem-Second": "{0} ({2}: {1})",
	"field-era": "Era",
	"dateFormatItem-yM": "y-M",
	"months-standAlone-wide": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12"
	],
	"timeFormat-short": "HH:mm",
	"quarters-format-wide": [
		"Q1",
		"Q2",
		"Q3",
		"Q4"
	],
	"timeFormat-long": "HH:mm:ss z",
	"field-year": "Year",
	"dateFormatItem-yMMM": "y MMM",
	"dateFormatItem-yQ": "y Q",
	"dateTimeFormats-appendItem-Era": "{0} {1}",
	"field-hour": "Hour",
	"months-format-abbr": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12"
	],
	"timeFormat-full": "HH:mm:ss zzzz",
	"dateTimeFormats-appendItem-Week": "{0} ({2}: {1})",
	"field-day-relative+0": "Today",
	"field-day-relative+1": "Tomorrow",
	"dateFormatItem-H": "HH",
	"months-standAlone-abbr": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12"
	],
	"quarters-format-abbr": [
		"Q1",
		"Q2",
		"Q3",
		"Q4"
	],
	"quarters-standAlone-wide": [
		"Q1",
		"Q2",
		"Q3",
		"Q4"
	],
	"dateFormatItem-M": "L",
	"days-standAlone-wide": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7"
	],
	"timeFormat-medium": "HH:mm:ss",
	"dateFormatItem-Hm": "HH:mm",
	"quarters-standAlone-abbr": [
		"Q1",
		"Q2",
		"Q3",
		"Q4"
	],
	"eraAbbr": [
		"BCE",
		"CE"
	],
	"field-minute": "Minute",
	"field-dayperiod": "Dayperiod",
	"days-standAlone-abbr": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7"
	],
	"dateFormatItem-d": "d",
	"dateFormatItem-ms": "mm:ss",
	"quarters-format-narrow": [
		"1",
		"2",
		"3",
		"4"
	],
	"field-day-relative+-1": "Yesterday",
	"dateFormatItem-h": "h a",
	"dateTimeFormat-long": "{1} {0}",
	"dayPeriods-format-narrow-am": "AM",
	"dateFormatItem-MMMd": "MMM d",
	"dateFormatItem-MEd": "E, M-d",
	"dateTimeFormat-full": "{1} {0}",
	"field-day": "Day",
	"days-format-wide": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7"
	],
	"field-zone": "Zone",
	"dateTimeFormats-appendItem-Day": "{0} ({2}: {1})",
	"dateFormatItem-y": "y",
	"months-standAlone-narrow": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12"
	],
	"dateFormatItem-hm": "h:mm a",
	"dateTimeFormats-appendItem-Year": "{0} {1}",
	"dateTimeFormats-appendItem-Hour": "{0} ({2}: {1})",
	"dayPeriods-format-abbr-pm": "PM",
	"days-format-abbr": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7"
	],
	"eraNames": [
		"BCE",
		"CE"
	],
	"days-format-narrow": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7"
	],
	"days-standAlone-narrow": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7"
	],
	"dateFormatItem-MMM": "LLL",
	"field-month": "Month",
	"dateTimeFormats-appendItem-Quarter": "{0} ({2}: {1})",
	"dayPeriods-format-wide-am": "AM",
	"dateTimeFormats-appendItem-Month": "{0} ({2}: {1})",
	"dateTimeFormats-appendItem-Minute": "{0} ({2}: {1})",
	"dateFormat-short": "yyyy-MM-dd",
	"field-second": "Second",
	"dateFormatItem-yMMMEd": "EEE, y MMM d",
	"dateTimeFormats-appendItem-Timezone": "{0} {1}",
	"field-week": "Week",
	"dateFormat-medium": "y MMM d",
	"dayPeriods-format-narrow-pm": "PM",
	"dateTimeFormat-short": "{1} {0}",
	"dateFormatItem-Hms": "HH:mm:ss",
	"dateFormatItem-hms": "h:mm:ss a"
}
//end v1.x content
,
	"ar": true,
	"ca": true,
	"cs": true,
	"da": true,
	"de": true,
	"el": true,
	"en": true,
	"en-au": true,
	"en-ca": true,
	"en-gb": true,
	"es": true,
	"fi": true,
	"fr": true,
	"fr-ch": true,
	"he": true,
	"hu": true,
	"it": true,
	"ja": true,
	"ko": true,
	"nb": true,
	"nl": true,
	"pl": true,
	"pt": true,
	"pt-pt": true,
	"ro": true,
	"ru": true,
	"sk": true,
	"sl": true,
	"sv": true,
	"th": true,
	"tr": true,
	"zh": true,
	"zh-hant": true,
	"zh-hk": true,
	"zh-tw": true
});
},
'versa/widget/zone/mobile/LogonView':function(){
/**
 * Created by JetBrains RubyMine.
 * User: aarons
 * Date: 05/17/12
 * Time: 10:15 AM
 * To change this template use File | Settings | File Templates.
 */

//dojo.provide('versa.widget.zone.Logon');
//
//dojo.require('dijit._Widget');
//dojo.require('dijit._Templated');
//dojo.require('dijit.form.Form') ;
//
//dojo.require('versa.api.User');
//
//dojo.require('versa.widget.Button');
//dojo.require('versa.widget.ValidationTextBox');
//
//dojo.require('dojo.fx');

define("versa/widget/zone/mobile/LogonView", ["dojo/_base/declare",
        "dijit/_Widget",
        "dijit/_TemplatedMixin",
        "dijit/form/Form",
        "versa/api/User",
        "dojox/mobile/Button",
        "dojox/mobile/ScrollableView",
        "dojox/mobile/ContentPane",
        "versa/widget/mobile/TextBox",
        "dojox/mobile/Heading"],
    function(declare){
        var o=declare("versa.widget.zone.mobile.LogonView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
            _btnReset: null,
            _btnSubmit: null,
            _frmLogon: null,
            _txtEmail: null,
            _txtPassword: null,
            _txtResetName: null,
            _txtUserName: null,


            user: null,
            zone: null,

            _onResetClick: function(e){

                var a1 = dojo.fadeOut({
                    node: this.logonNode,
                    duration: 500,
                    onEnd: dojo.hitch(this, function(){
                        dojo.toggleClass(this.logonNode, 'versaHide', true);
                        dojo.toggleClass(this.resetNode, 'versaHide', false);
                        var username = this._txtUsername.get('value');
                        this._txtResetName.set('value', username);
                    })
                });
                var a2 = dojo.fadeIn({
                    node: this.resetNode,
                    duration: 500,
                    onEnd: dojo.hitch(this, function(){
                        this._btnReset.set('disabled', true);
                        this._txtResetName.blur();
                        this._txtResetName.validate();
                        this._txtEmail.blur();
                        this._txtEmail.validate();
                        this._txtResetName.focus();
                        this._btnReset.set('disabled', false);
                    })
                });

                dojo.fx.chain([a1, a2]).play();

            },

            _onReturnClick: function(e){
                var a1 = dojo.fadeOut({
                    node: this.resetNode,
                    duration: 500,
                    onEnd: dojo.hitch(this, function(){
                        dojo.toggleClass(this.logonNode, 'versaHide', false);
                        dojo.toggleClass(this.resetNode, 'versaHide', true);
                    })
                });
                var a2 = dojo.fadeIn({
                    node: this.logonNode,
                    duration: 500,
                    onEnd: dojo.hitch(this, function(){
                        this._txtPassword.reset();
                        this._txtUsername.setFocus();

                    })
                });

                dojo.fx.chain([a1, a2]).play();
            },

            _onResetSubmit: function(e){

                try{

                    if(this._frmReset.validate()){

                        var username = this._txtResetName.get('value');
                        var email = this._txtEmail.get('value');

                        this.zone.resetPassword(username, email);
                        this.onReset(username);
                        this._txtUsername.set('value', username);
                    }

                }
                catch(e){
                    this.onResetError(e);
                    this._txtResetName.reset();
                    this._txtEmail.reset();
                    this._txtResetName.setFocus();
                }
                finally{
                    e.preventDefault();
                }

            },

            _onLogonSubmit: function(e){

                try{

                    if(this._frmLogon.isValid()){

                        var username = this._txtUsername.get('value');
                        var password = this._txtPassword.get('value');

                        var user = this.zone.logon(username, password);
                        this.onLogon(user);

                    }
                    else{
                        this._txtUsername.validate();
                    }

                }
                catch(e){
                    this.onError(e);
                    this._txtPassword.reset();
                    this._txtUsername.setFocus(true);
                }
                finally{
                    e.preventDefault();
                }

                //this.statusNode.innerHTML = stsMessage;
            },

            constructor: function(args){

            },

            onError: function(e){
            },

            onLogon: function(user){
            },

            onReset: function(username){
            },

            onResetError: function(e){
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.heading=new dojox.mobile.Heading({
                    fixed: "top"
                });
                this.heading.domNode.innerHTML='<img src="/images/versafile-32-tm.png"/>';
                this.addChild(this.heading);

                this.cpContent=new dojox.mobile.ContentPane({
                    content: dojo.cache("versa.widget.zone.mobile", "template/Logon.html", "<div align=\"center\">\n    <div id=\"logonFormNode\">\n\n        <div>\n            <div>Username</div>\n            <input id=\"userNameNode\"/>\n        </div>\n\n        <div>\n            <div>Password</div>\n            <input id=\"passwordNode\"/>\n        </div>\n\n        <table id=\"statusNode\">\n            <tr>\n                <td style=\"vertical-align:top;\">\n                    <img id=\"statusImgNode\" src=\"/images/icons/16/blank.png\" width=\"16\" height=\"16\" style=\"float:right;margin-right:8px\"/>\n                </td>\n                <td>\n                    <span id=\"statusMsgNode\"></span>\n                </td>\n            </tr>\n        </table>\n\n        <div>\n            <button id=\"logonButtonNode\" type=\"submit\"></button>\n        </div>\n\n    </div>\n</div>\n")
                });
                this.addChild(this.cpContent);

                this._frmLogon = new dijit.form.Form({
                    onSubmit: dojo.hitch(this, this._onLogonSubmit)
                }, 'logonFormNode');

                this._txtUsername = new versa.widget.mobile.TextBox({
                    name: 'txtUsername',
                    required: true,
                    //placeHolder: 'User name',
                    missingMessage: 'Username is required',
                    value: (this.user == null) ? null : this.user.name,
                    disabled: (this.user != null),
                    style:'width:160px'
                }, 'userNameNode');

                this._txtPassword = new versa.widget.mobile.TextBox({
                    name: 'txtPassword',
                    //placeHolder: 'Password',
                    required: false,
                    type: 'password',
                    style:'width:160px'
                }, 'passwordNode');

                this._btnSubmit = new dojox.mobile.Button({
                    iconClass: 'buttonIcon bfreeIconLock',
                    label: 'Log in',
                    type: 'submit'
                }, 'logonButtonNode');

                this._txtUsername.focus();

            },

            startup: function(){
                this.inherited('startup', arguments);

            }
        });

        o.STS_CODES = {'ERR': 0x0, 'OK': 0x1};
        o.ERR_MESSAGE = 'Error: <b>{message}</b>';
        o.OK_MESSAGE = 'Success: <b>Logged in as user \'{name}\'.</b>';

        return o;
    }
);



},
'dojo/uacss':function(){
define("dojo/uacss", ["./dom-geometry", "./_base/lang", "./ready", "./_base/sniff", "./_base/window"],
	function(geometry, lang, ready, has, baseWindow){
	// module:
	//		dojo/uacss
	// summary:
	//		Applies pre-set CSS classes to the top-level HTML node, based on:
	//			- browser (ex: dj_ie)
	//			- browser version (ex: dj_ie6)
	//			- box model (ex: dj_contentBox)
	//			- text direction (ex: dijitRtl)
	//
	//		In addition, browser, browser version, and box model are
	//		combined with an RTL flag when browser text is RTL. ex: dj_ie-rtl.

	var
		html = baseWindow.doc.documentElement,
		ie = has("ie"),
		opera = has("opera"),
		maj = Math.floor,
		ff = has("ff"),
		boxModel = geometry.boxModel.replace(/-/,''),

		classes = {
			"dj_ie": ie,
			"dj_ie6": maj(ie) == 6,
			"dj_ie7": maj(ie) == 7,
			"dj_ie8": maj(ie) == 8,
			"dj_ie9": maj(ie) == 9,
			"dj_quirks": has("quirks"),
			"dj_iequirks": ie && has("quirks"),

			// NOTE: Opera not supported by dijit
			"dj_opera": opera,

			"dj_khtml": has("khtml"),

			"dj_webkit": has("webkit"),
			"dj_safari": has("safari"),
			"dj_chrome": has("chrome"),

			"dj_gecko": has("mozilla"),
			"dj_ff3": maj(ff) == 3
		}; // no dojo unsupported browsers

	classes["dj_" + boxModel] = true;

	// apply browser, browser version, and box model class names
	var classStr = "";
	for(var clz in classes){
		if(classes[clz]){
			classStr += clz + " ";
		}
	}
	html.className = lang.trim(html.className + " " + classStr);

	// If RTL mode, then add dj_rtl flag plus repeat existing classes with -rtl extension.
	// We can't run the code below until the <body> tag has loaded (so we can check for dir=rtl).
	// priority is 90 to run ahead of parser priority of 100
	ready(90, function(){
		if(!geometry.isBodyLtr()){
			var rtlClassStr = "dj_rtl dijitRtl " + classStr.replace(/ /g, "-rtl ");
			html.className = lang.trim(html.className + " " + rtlClassStr + "dj_rtl dijitRtl " + classStr.replace(/ /g, "-rtl "));
		}
	});
	return has;
});

},
'dojox/mobile/_DataListMixin':function(){
define("dojox/mobile/_DataListMixin", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/registry",	// registry.byId
	"./ListItem"
], function(array, connect, declare, lang, registry, ListItem){

	// module:
	//		dojox/mobile/_DataListMixin
	// summary:
	//		Mixin for widgets to generate the list items corresponding to the
	//		data provider object.

	return declare("dojox.mobile._DataListMixin", null,{
		// summary:
		//		Mixin for widgets to generate the list items corresponding to
		//		the data provider object.
		// description:
		//		By mixing this class into the widgets, the list item nodes are
		//		generated as the child nodes of the widget and automatically
		//		re-generated whenever the corresponding data items are modified.

		// store: Object
		//		Reference to data provider object
		store: null,

		// query: Object
		//		A query that can be passed to 'store' to initially filter the
		//		items.
		query: null,

		// queryOptions: Object
		//		An optional parameter for the query.
		queryOptions: null,

		buildRendering: function(){
			this.inherited(arguments);
			if(!this.store){ return; }
			var store = this.store;
			this.store = null;
			this.setStore(store, this.query, this.queryOptions);
		},

		setStore: function(store, query, queryOptions){
			// summary:
			//		Sets the store to use with this widget.
			if(store === this.store){ return; }
			this.store = store;
			this.query = query;
			this.queryOptions = queryOptions;
			if(store && store.getFeatures()["dojo.data.api.Notification"]){
				array.forEach(this._conn || [], connect.disconnect);
				this._conn = [
					connect.connect(store, "onSet", this, "onSet"),
					connect.connect(store, "onNew", this, "onNew"),
					connect.connect(store, "onDelete", this, "onDelete")
				];
			}
			this.refresh();
		},

		refresh: function(){
			// summary:
			//		Fetches the data and generates the list items.
			if(!this.store){ return; }
			this.store.fetch({
				query: this.query,
				queryOptions: this.queryOptions,
				onComplete: lang.hitch(this, "onComplete"),
				onError: lang.hitch(this, "onError")
			});
		},

		createListItem: function(/*Object*/item){
			// summary:
			//		Creates a list item widget.
			var attr = {};
			var arr = this.store.getLabelAttributes(item);
			var labelAttr = arr ? arr[0] : null;
			array.forEach(this.store.getAttributes(item), function(name){
				if(name === labelAttr){
					attr["label"] = this.store.getLabel(item);
				}else{
					attr[name] = this.store.getValue(item, name);
				}
			}, this);
			var w = new ListItem(attr);
			item._widgetId = w.id;
			return w;
		},

		generateList: function(/*Array*/items, /*Object*/dataObject){
			// summary:
			//		Given the data, generates a list of items.
			array.forEach(this.getChildren(), function(child){
				child.destroyRecursive();
			});
			array.forEach(items, function(item, index){
				this.addChild(this.createListItem(item));
			}, this);
		},

		onComplete: function(/*Array*/items, /*Object*/request){
			// summary:
			//		An handler that is called after the fetch completes.
			this.generateList(items, request);
		},

		onError: function(/*Object*/errorData, /*Object*/request){
			// summary:
			//		An error handler.
		},

		onSet: function(/*Object*/item, /*String*/attribute, /*Object|Array*/oldValue, /*Object|Array*/newValue){
			//	summary:
			//		See dojo.data.api.Notification.onSet()
		},

		onNew: function(/*Object*/newItem, /*Object?*/parentInfo){
			//	summary:
			//		See dojo.data.api.Notification.onNew()
			this.addChild(this.createListItem(newItem));
		},

		onDelete: function(/*Object*/deletedItem){
			//	summary:
			//		See dojo.data.api.Notification.onDelete()
			registry.byId(deletedItem._widgetId).destroyRecursive();
		}
	});
});

},
'dojo/string':function(){
define("dojo/string", ["./_base/kernel", "./_base/lang"], function(dojo, lang) {
	// module:
	//		dojo/string
	// summary:
	//		TODOC

lang.getObject("string", true, dojo);

/*=====
dojo.string = {
	// summary: String utilities for Dojo
};
=====*/

dojo.string.rep = function(/*String*/str, /*Integer*/num){
	// summary:
	//		Efficiently replicate a string `n` times.
	// str:
	//		the string to replicate
	// num:
	//		number of times to replicate the string

	if(num <= 0 || !str){ return ""; }

	var buf = [];
	for(;;){
		if(num & 1){
			buf.push(str);
		}
		if(!(num >>= 1)){ break; }
		str += str;
	}
	return buf.join("");	// String
};

dojo.string.pad = function(/*String*/text, /*Integer*/size, /*String?*/ch, /*Boolean?*/end){
	// summary:
	//		Pad a string to guarantee that it is at least `size` length by
	//		filling with the character `ch` at either the start or end of the
	//		string. Pads at the start, by default.
	// text:
	//		the string to pad
	// size:
	//		length to provide padding
	// ch:
	//		character to pad, defaults to '0'
	// end:
	//		adds padding at the end if true, otherwise pads at start
	// example:
	//	|	// Fill the string to length 10 with "+" characters on the right.  Yields "Dojo++++++".
	//	|	dojo.string.pad("Dojo", 10, "+", true);

	if(!ch){
		ch = '0';
	}
	var out = String(text),
		pad = dojo.string.rep(ch, Math.ceil((size - out.length) / ch.length));
	return end ? out + pad : pad + out;	// String
};

dojo.string.substitute = function(	/*String*/		template,
									/*Object|Array*/map,
									/*Function?*/	transform,
									/*Object?*/		thisObject){
	// summary:
	//		Performs parameterized substitutions on a string. Throws an
	//		exception if any parameter is unmatched.
	// template:
	//		a string with expressions in the form `${key}` to be replaced or
	//		`${key:format}` which specifies a format function. keys are case-sensitive.
	// map:
	//		hash to search for substitutions
	// transform:
	//		a function to process all parameters before substitution takes
	//		place, e.g. mylib.encodeXML
	// thisObject:
	//		where to look for optional format function; default to the global
	//		namespace
	// example:
	//		Substitutes two expressions in a string from an Array or Object
	//	|	// returns "File 'foo.html' is not found in directory '/temp'."
	//	|	// by providing substitution data in an Array
	//	|	dojo.string.substitute(
	//	|		"File '${0}' is not found in directory '${1}'.",
	//	|		["foo.html","/temp"]
	//	|	);
	//	|
	//	|	// also returns "File 'foo.html' is not found in directory '/temp'."
	//	|	// but provides substitution data in an Object structure.  Dotted
	//	|	// notation may be used to traverse the structure.
	//	|	dojo.string.substitute(
	//	|		"File '${name}' is not found in directory '${info.dir}'.",
	//	|		{ name: "foo.html", info: { dir: "/temp" } }
	//	|	);
	// example:
	//		Use a transform function to modify the values:
	//	|	// returns "file 'foo.html' is not found in directory '/temp'."
	//	|	dojo.string.substitute(
	//	|		"${0} is not found in ${1}.",
	//	|		["foo.html","/temp"],
	//	|		function(str){
	//	|			// try to figure out the type
	//	|			var prefix = (str.charAt(0) == "/") ? "directory": "file";
	//	|			return prefix + " '" + str + "'";
	//	|		}
	//	|	);
	// example:
	//		Use a formatter
	//	|	// returns "thinger -- howdy"
	//	|	dojo.string.substitute(
	//	|		"${0:postfix}", ["thinger"], null, {
	//	|			postfix: function(value, key){
	//	|				return value + " -- howdy";
	//	|			}
	//	|		}
	//	|	);

	thisObject = thisObject || dojo.global;
	transform = transform ?
		lang.hitch(thisObject, transform) : function(v){ return v; };

	return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,
		function(match, key, format){
			var value = lang.getObject(key, false, map);
			if(format){
				value = lang.getObject(format, false, thisObject).call(thisObject, value, key);
			}
			return transform(value, key).toString();
		}); // String
};

/*=====
dojo.string.trim = function(str){
	// summary:
	//		Trims whitespace from both sides of the string
	// str: String
	//		String to be trimmed
	// returns: String
	//		Returns the trimmed string
	// description:
	//		This version of trim() was taken from [Steven Levithan's blog](http://blog.stevenlevithan.com/archives/faster-trim-javascript).
	//		The short yet performant version of this function is dojo.trim(),
	//		which is part of Dojo base.  Uses String.prototype.trim instead, if available.
	return "";	// String
}
=====*/

dojo.string.trim = String.prototype.trim ?
	lang.trim : // aliasing to the native function
	function(str){
		str = str.replace(/^\s+/, '');
		for(var i = str.length - 1; i >= 0; i--){
			if(/\S/.test(str.charAt(i))){
				str = str.substring(0, i + 1);
				break;
			}
		}
		return str;
	};

return dojo.string;
});

},
'dijit/form/_FormValueMixin':function(){
define("dijit/form/_FormValueMixin", [
	"dojo/_base/declare", // declare
	"dojo/dom-attr", // domAttr.set
	"dojo/keys", // keys.ESCAPE
	"dojo/_base/sniff", // has("ie"), has("quirks")
	"./_FormWidgetMixin"
], function(declare, domAttr, keys, has, _FormWidgetMixin){

/*=====
	var _FormWidgetMixin = dijit.form._FormWidgetMixin;
=====*/

	// module:
	//		dijit/form/_FormValueMixin
	// summary:
	//		Mixin for widgets corresponding to native HTML elements such as <input> or <select> that have user changeable values.

	return declare("dijit.form._FormValueMixin", _FormWidgetMixin, {
		// summary:
		//		Mixin for widgets corresponding to native HTML elements such as <input> or <select> that have user changeable values.
		// description:
		//		Each _FormValueMixin represents a single input value, and has a (possibly hidden) <input> element,
		//		to which it serializes it's input value, so that form submission (either normal submission or via FormBind?)
		//		works as expected.

		// readOnly: Boolean
		//		Should this widget respond to user input?
		//		In markup, this is specified as "readOnly".
		//		Similar to disabled except readOnly form values are submitted.
		readOnly: false,

		_setReadOnlyAttr: function(/*Boolean*/ value){
			domAttr.set(this.focusNode, 'readOnly', value);
			this.focusNode.setAttribute("aria-readonly", value);
			this._set("readOnly", value);
		},

		postCreate: function(){
			this.inherited(arguments);

			if(has("ie")){ // IE won't stop the event with keypress
				this.connect(this.focusNode || this.domNode, "onkeydown", this._onKeyDown);
			}
			// Update our reset value if it hasn't yet been set (because this.set()
			// is only called when there *is* a value)
			if(this._resetValue === undefined){
				this._lastValueReported = this._resetValue = this.value;
			}
		},

		_setValueAttr: function(/*anything*/ newValue, /*Boolean?*/ priorityChange){
			// summary:
			//		Hook so set('value', value) works.
			// description:
			//		Sets the value of the widget.
			//		If the value has changed, then fire onChange event, unless priorityChange
			//		is specified as null (or false?)
			this._handleOnChange(newValue, priorityChange);
		},

		_handleOnChange: function(/*anything*/ newValue, /*Boolean?*/ priorityChange){
			// summary:
			//		Called when the value of the widget has changed.  Saves the new value in this.value,
			//		and calls onChange() if appropriate.   See _FormWidget._handleOnChange() for details.
			this._set("value", newValue);
			this.inherited(arguments);
		},

		undo: function(){
			// summary:
			//		Restore the value to the last value passed to onChange
			this._setValueAttr(this._lastValueReported, false);
		},

		reset: function(){
			// summary:
			//		Reset the widget's value to what it was at initialization time
			this._hasBeenBlurred = false;
			this._setValueAttr(this._resetValue, true);
		},

		_onKeyDown: function(e){
			if(e.keyCode == keys.ESCAPE && !(e.ctrlKey || e.altKey || e.metaKey)){
				var te;
				if(has("ie") < 9 || (has("ie") && has("quirks"))){
					e.preventDefault(); // default behavior needs to be stopped here since keypress is too late
					te = document.createEventObject();
					te.keyCode = keys.ESCAPE;
					te.shiftKey = e.shiftKey;
					e.srcElement.fireEvent('onkeypress', te);
				}
			}
		}
	});
});

},
'dijit/form/_FormWidgetMixin':function(){
define("dijit/form/_FormWidgetMixin", [
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/dom-attr", // domAttr.set
	"dojo/dom-style", // domStyle.get
	"dojo/_base/lang", // lang.hitch lang.isArray
	"dojo/mouse", // mouse.isLeft
	"dojo/_base/sniff", // has("webkit")
	"dojo/_base/window", // win.body
	"dojo/window", // winUtils.scrollIntoView
	"../a11y"	// a11y.hasDefaultTabStop
], function(array, declare, domAttr, domStyle, lang, mouse, has, win, winUtils, a11y){

// module:
//		dijit/form/_FormWidgetMixin
// summary:
//		Mixin for widgets corresponding to native HTML elements such as <checkbox> or <button>,
//		which can be children of a <form> node or a `dijit.form.Form` widget.

return declare("dijit.form._FormWidgetMixin", null, {
	// summary:
	//		Mixin for widgets corresponding to native HTML elements such as <checkbox> or <button>,
	//		which can be children of a <form> node or a `dijit.form.Form` widget.
	//
	// description:
	//		Represents a single HTML element.
	//		All these widgets should have these attributes just like native HTML input elements.
	//		You can set them during widget construction or afterwards, via `dijit._Widget.attr`.
	//
	//		They also share some common methods.

	// name: [const] String
	//		Name used when submitting form; same as "name" attribute or plain HTML elements
	name: "",

	// alt: String
	//		Corresponds to the native HTML <input> element's attribute.
	alt: "",

	// value: String
	//		Corresponds to the native HTML <input> element's attribute.
	value: "",

	// type: [const] String
	//		Corresponds to the native HTML <input> element's attribute.
	type: "text",

	// tabIndex: Integer
	//		Order fields are traversed when user hits the tab key
	tabIndex: "0",
	_setTabIndexAttr: "focusNode",	// force copy even when tabIndex default value, needed since Button is <span>

	// disabled: Boolean
	//		Should this widget respond to user input?
	//		In markup, this is specified as "disabled='disabled'", or just "disabled".
	disabled: false,

	// intermediateChanges: Boolean
	//		Fires onChange for each value change or only on demand
	intermediateChanges: false,

	// scrollOnFocus: Boolean
	//		On focus, should this widget scroll into view?
	scrollOnFocus: true,

	// Override _WidgetBase mapping id to this.domNode, needs to be on focusNode so <label> etc.
	// works with screen reader
	_setIdAttr: "focusNode",

	postCreate: function(){
		this.inherited(arguments);
		this.connect(this.domNode, "onmousedown", "_onMouseDown");
	},

	_setDisabledAttr: function(/*Boolean*/ value){
		this._set("disabled", value);
		domAttr.set(this.focusNode, 'disabled', value);
		if(this.valueNode){
			domAttr.set(this.valueNode, 'disabled', value);
		}
		this.focusNode.setAttribute("aria-disabled", value);

		if(value){
			// reset these, because after the domNode is disabled, we can no longer receive
			// mouse related events, see #4200
			this._set("hovering", false);
			this._set("active", false);

			// clear tab stop(s) on this widget's focusable node(s)  (ComboBox has two focusable nodes)
			var attachPointNames = "tabIndex" in this.attributeMap ? this.attributeMap.tabIndex :
				("_setTabIndexAttr" in this) ? this._setTabIndexAttr : "focusNode";
			array.forEach(lang.isArray(attachPointNames) ? attachPointNames : [attachPointNames], function(attachPointName){
				var node = this[attachPointName];
				// complex code because tabIndex=-1 on a <div> doesn't work on FF
				if(has("webkit") || a11y.hasDefaultTabStop(node)){	// see #11064 about webkit bug
					node.setAttribute('tabIndex', "-1");
				}else{
					node.removeAttribute('tabIndex');
				}
			}, this);
		}else{
			if(this.tabIndex != ""){
				this.set('tabIndex', this.tabIndex);
			}
		}
	},

	_onFocus: function(e){
		if(this.scrollOnFocus){
			winUtils.scrollIntoView(this.domNode);
		}
		this.inherited(arguments);
	},

	isFocusable: function(){
		// summary:
		//		Tells if this widget is focusable or not.  Used internally by dijit.
		// tags:
		//		protected
		return !this.disabled && this.focusNode && (domStyle.get(this.domNode, "display") != "none");
	},

	focus: function(){
		// summary:
		//		Put focus on this widget
		if(!this.disabled && this.focusNode.focus){
			try{ this.focusNode.focus(); }catch(e){}/*squelch errors from hidden nodes*/
		}
	},

	compare: function(/*anything*/ val1, /*anything*/ val2){
		// summary:
		//		Compare 2 values (as returned by get('value') for this widget).
		// tags:
		//		protected
		if(typeof val1 == "number" && typeof val2 == "number"){
			return (isNaN(val1) && isNaN(val2)) ? 0 : val1 - val2;
		}else if(val1 > val2){
			return 1;
		}else if(val1 < val2){
			return -1;
		}else{
			return 0;
		}
	},

	onChange: function(/*===== newValue =====*/){
		// summary:
		//		Callback when this widget's value is changed.
		// tags:
		//		callback
	},

	// _onChangeActive: [private] Boolean
	//		Indicates that changes to the value should call onChange() callback.
	//		This is false during widget initialization, to avoid calling onChange()
	//		when the initial value is set.
	_onChangeActive: false,

	_handleOnChange: function(/*anything*/ newValue, /*Boolean?*/ priorityChange){
		// summary:
		//		Called when the value of the widget is set.  Calls onChange() if appropriate
		// newValue:
		//		the new value
		// priorityChange:
		//		For a slider, for example, dragging the slider is priorityChange==false,
		//		but on mouse up, it's priorityChange==true.  If intermediateChanges==false,
		//		onChange is only called form priorityChange=true events.
		// tags:
		//		private
		if(this._lastValueReported == undefined && (priorityChange === null || !this._onChangeActive)){
			// this block executes not for a change, but during initialization,
			// and is used to store away the original value (or for ToggleButton, the original checked state)
			this._resetValue = this._lastValueReported = newValue;
		}
		this._pendingOnChange = this._pendingOnChange
			|| (typeof newValue != typeof this._lastValueReported)
			|| (this.compare(newValue, this._lastValueReported) != 0);
		if((this.intermediateChanges || priorityChange || priorityChange === undefined) && this._pendingOnChange){
			this._lastValueReported = newValue;
			this._pendingOnChange = false;
			if(this._onChangeActive){
				if(this._onChangeHandle){
					clearTimeout(this._onChangeHandle);
				}
				// setTimeout allows hidden value processing to run and
				// also the onChange handler can safely adjust focus, etc
				this._onChangeHandle = setTimeout(lang.hitch(this,
					function(){
						this._onChangeHandle = null;
						this.onChange(newValue);
					}), 0); // try to collapse multiple onChange's fired faster than can be processed
			}
		}
	},

	create: function(){
		// Overrides _Widget.create()
		this.inherited(arguments);
		this._onChangeActive = true;
	},

	destroy: function(){
		if(this._onChangeHandle){ // destroy called before last onChange has fired
			clearTimeout(this._onChangeHandle);
			this.onChange(this._lastValueReported);
		}
		this.inherited(arguments);
	},

	_onMouseDown: function(e){
		// If user clicks on the button, even if the mouse is released outside of it,
		// this button should get focus (to mimics native browser buttons).
		// This is also needed on chrome because otherwise buttons won't get focus at all,
		// which leads to bizarre focus restore on Dialog close etc.
		// IE exhibits strange scrolling behavior when focusing a node so only do it when !focused.
		// FF needs the extra help to make sure the mousedown actually gets to the focusNode
		if((!this.focused || !has("ie")) && !e.ctrlKey && mouse.isLeft(e) && this.isFocusable()){ // !e.ctrlKey to ignore right-click on mac
			// Set a global event to handle mouseup, so it fires properly
			// even if the cursor leaves this.domNode before the mouse up event.
			var mouseUpConnector = this.connect(win.body(), "onmouseup", function(){
				if(this.isFocusable()){
					this.focus();
				}
				this.disconnect(mouseUpConnector);
			});
		}
	}
});

});

},
'dojo/date':function(){
define("dojo/date", ["./_base/kernel", "./_base/lang"], function(dojo, lang) {
	// module:
	//		dojo/date
	// summary:
	//		TODOC

lang.getObject("date", true, dojo);

/*=====
dojo.date = {
	// summary: Date manipulation utilities
}
=====*/

dojo.date.getDaysInMonth = function(/*Date*/dateObject){
	//	summary:
	//		Returns the number of days in the month used by dateObject
	var month = dateObject.getMonth();
	var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if(month == 1 && dojo.date.isLeapYear(dateObject)){ return 29; } // Number
	return days[month]; // Number
};

dojo.date.isLeapYear = function(/*Date*/dateObject){
	//	summary:
	//		Determines if the year of the dateObject is a leap year
	//	description:
	//		Leap years are years with an additional day YYYY-02-29, where the
	//		year number is a multiple of four with the following exception: If
	//		a year is a multiple of 100, then it is only a leap year if it is
	//		also a multiple of 400. For example, 1900 was not a leap year, but
	//		2000 is one.

	var year = dateObject.getFullYear();
	return !(year%400) || (!(year%4) && !!(year%100)); // Boolean
};

// FIXME: This is not localized
dojo.date.getTimezoneName = function(/*Date*/dateObject){
	//	summary:
	//		Get the user's time zone as provided by the browser
	// dateObject:
	//		Needed because the timezone may vary with time (daylight savings)
	//	description:
	//		Try to get time zone info from toString or toLocaleString method of
	//		the Date object -- UTC offset is not a time zone.  See
	//		http://www.twinsun.com/tz/tz-link.htm Note: results may be
	//		inconsistent across browsers.

	var str = dateObject.toString(); // Start looking in toString
	var tz = ''; // The result -- return empty string if nothing found
	var match;

	// First look for something in parentheses -- fast lookup, no regex
	var pos = str.indexOf('(');
	if(pos > -1){
		tz = str.substring(++pos, str.indexOf(')'));
	}else{
		// If at first you don't succeed ...
		// If IE knows about the TZ, it appears before the year
		// Capital letters or slash before a 4-digit year
		// at the end of string
		var pat = /([A-Z\/]+) \d{4}$/;
		if((match = str.match(pat))){
			tz = match[1];
		}else{
		// Some browsers (e.g. Safari) glue the TZ on the end
		// of toLocaleString instead of putting it in toString
			str = dateObject.toLocaleString();
			// Capital letters or slash -- end of string,
			// after space
			pat = / ([A-Z\/]+)$/;
			if((match = str.match(pat))){
				tz = match[1];
			}
		}
	}

	// Make sure it doesn't somehow end up return AM or PM
	return (tz == 'AM' || tz == 'PM') ? '' : tz; // String
};

// Utility methods to do arithmetic calculations with Dates

dojo.date.compare = function(/*Date*/date1, /*Date?*/date2, /*String?*/portion){
	//	summary:
	//		Compare two date objects by date, time, or both.
	//	description:
	//  	Returns 0 if equal, positive if a > b, else negative.
	//	date1:
	//		Date object
	//	date2:
	//		Date object.  If not specified, the current Date is used.
	//	portion:
	//		A string indicating the "date" or "time" portion of a Date object.
	//		Compares both "date" and "time" by default.  One of the following:
	//		"date", "time", "datetime"

	// Extra step required in copy for IE - see #3112
	date1 = new Date(+date1);
	date2 = new Date(+(date2 || new Date()));

	if(portion == "date"){
		// Ignore times and compare dates.
		date1.setHours(0, 0, 0, 0);
		date2.setHours(0, 0, 0, 0);
	}else if(portion == "time"){
		// Ignore dates and compare times.
		date1.setFullYear(0, 0, 0);
		date2.setFullYear(0, 0, 0);
	}

	if(date1 > date2){ return 1; } // int
	if(date1 < date2){ return -1; } // int
	return 0; // int
};

dojo.date.add = function(/*Date*/date, /*String*/interval, /*int*/amount){
	//	summary:
	//		Add to a Date in intervals of different size, from milliseconds to years
	//	date: Date
	//		Date object to start with
	//	interval:
	//		A string representing the interval.  One of the following:
	//			"year", "month", "day", "hour", "minute", "second",
	//			"millisecond", "quarter", "week", "weekday"
	//	amount:
	//		How much to add to the date.

	var sum = new Date(+date); // convert to Number before copying to accomodate IE (#3112)
	var fixOvershoot = false;
	var property = "Date";

	switch(interval){
		case "day":
			break;
		case "weekday":
			//i18n FIXME: assumes Saturday/Sunday weekend, but this is not always true.  see dojo.cldr.supplemental

			// Divide the increment time span into weekspans plus leftover days
			// e.g., 8 days is one 5-day weekspan / and two leftover days
			// Can't have zero leftover days, so numbers divisible by 5 get
			// a days value of 5, and the remaining days make up the number of weeks
			var days, weeks;
			var mod = amount % 5;
			if(!mod){
				days = (amount > 0) ? 5 : -5;
				weeks = (amount > 0) ? ((amount-5)/5) : ((amount+5)/5);
			}else{
				days = mod;
				weeks = parseInt(amount/5);
			}
			// Get weekday value for orig date param
			var strt = date.getDay();
			// Orig date is Sat / positive incrementer
			// Jump over Sun
			var adj = 0;
			if(strt == 6 && amount > 0){
				adj = 1;
			}else if(strt == 0 && amount < 0){
			// Orig date is Sun / negative incrementer
			// Jump back over Sat
				adj = -1;
			}
			// Get weekday val for the new date
			var trgt = strt + days;
			// New date is on Sat or Sun
			if(trgt == 0 || trgt == 6){
				adj = (amount > 0) ? 2 : -2;
			}
			// Increment by number of weeks plus leftover days plus
			// weekend adjustments
			amount = (7 * weeks) + days + adj;
			break;
		case "year":
			property = "FullYear";
			// Keep increment/decrement from 2/29 out of March
			fixOvershoot = true;
			break;
		case "week":
			amount *= 7;
			break;
		case "quarter":
			// Naive quarter is just three months
			amount *= 3;
			// fallthrough...
		case "month":
			// Reset to last day of month if you overshoot
			fixOvershoot = true;
			property = "Month";
			break;
//		case "hour":
//		case "minute":
//		case "second":
//		case "millisecond":
		default:
			property = "UTC"+interval.charAt(0).toUpperCase() + interval.substring(1) + "s";
	}

	if(property){
		sum["set"+property](sum["get"+property]()+amount);
	}

	if(fixOvershoot && (sum.getDate() < date.getDate())){
		sum.setDate(0);
	}

	return sum; // Date
};

dojo.date.difference = function(/*Date*/date1, /*Date?*/date2, /*String?*/interval){
	//	summary:
	//		Get the difference in a specific unit of time (e.g., number of
	//		months, weeks, days, etc.) between two dates, rounded to the
	//		nearest integer.
	//	date1:
	//		Date object
	//	date2:
	//		Date object.  If not specified, the current Date is used.
	//	interval:
	//		A string representing the interval.  One of the following:
	//			"year", "month", "day", "hour", "minute", "second",
	//			"millisecond", "quarter", "week", "weekday"
	//		Defaults to "day".

	date2 = date2 || new Date();
	interval = interval || "day";
	var yearDiff = date2.getFullYear() - date1.getFullYear();
	var delta = 1; // Integer return value

	switch(interval){
		case "quarter":
			var m1 = date1.getMonth();
			var m2 = date2.getMonth();
			// Figure out which quarter the months are in
			var q1 = Math.floor(m1/3) + 1;
			var q2 = Math.floor(m2/3) + 1;
			// Add quarters for any year difference between the dates
			q2 += (yearDiff * 4);
			delta = q2 - q1;
			break;
		case "weekday":
			var days = Math.round(dojo.date.difference(date1, date2, "day"));
			var weeks = parseInt(dojo.date.difference(date1, date2, "week"));
			var mod = days % 7;

			// Even number of weeks
			if(mod == 0){
				days = weeks*5;
			}else{
				// Weeks plus spare change (< 7 days)
				var adj = 0;
				var aDay = date1.getDay();
				var bDay = date2.getDay();

				weeks = parseInt(days/7);
				mod = days % 7;
				// Mark the date advanced by the number of
				// round weeks (may be zero)
				var dtMark = new Date(date1);
				dtMark.setDate(dtMark.getDate()+(weeks*7));
				var dayMark = dtMark.getDay();

				// Spare change days -- 6 or less
				if(days > 0){
					switch(true){
						// Range starts on Sat
						case aDay == 6:
							adj = -1;
							break;
						// Range starts on Sun
						case aDay == 0:
							adj = 0;
							break;
						// Range ends on Sat
						case bDay == 6:
							adj = -1;
							break;
						// Range ends on Sun
						case bDay == 0:
							adj = -2;
							break;
						// Range contains weekend
						case (dayMark + mod) > 5:
							adj = -2;
					}
				}else if(days < 0){
					switch(true){
						// Range starts on Sat
						case aDay == 6:
							adj = 0;
							break;
						// Range starts on Sun
						case aDay == 0:
							adj = 1;
							break;
						// Range ends on Sat
						case bDay == 6:
							adj = 2;
							break;
						// Range ends on Sun
						case bDay == 0:
							adj = 1;
							break;
						// Range contains weekend
						case (dayMark + mod) < 0:
							adj = 2;
					}
				}
				days += adj;
				days -= (weeks*2);
			}
			delta = days;
			break;
		case "year":
			delta = yearDiff;
			break;
		case "month":
			delta = (date2.getMonth() - date1.getMonth()) + (yearDiff * 12);
			break;
		case "week":
			// Truncate instead of rounding
			// Don't use Math.floor -- value may be negative
			delta = parseInt(dojo.date.difference(date1, date2, "day")/7);
			break;
		case "day":
			delta /= 24;
			// fallthrough
		case "hour":
			delta /= 60;
			// fallthrough
		case "minute":
			delta /= 60;
			// fallthrough
		case "second":
			delta /= 1000;
			// fallthrough
		case "millisecond":
			delta *= date2.getTime() - date1.getTime();
	}

	// Round for fractional values and DST leaps
	return Math.round(delta); // Number (integer)
};

return dojo.date;
});

},
'versa/api/Groups':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 26/09/11
 * Time: 10:55 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Groups", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Group"],
    function(declare){
        var o=declare("versa.api.Groups", [versa.api._Collection], {
            zone: null,

            _matchesQuery: function(item,request){

                //query returns array of choice list values,
                //exclude them.
                if(dojo.isArray(item) || (item.hasOwnProperty('user_id')))
                    return false;

                var query = request.query;
                var ignoreCase = request.queryOptions && request.queryOptions.ignoreCase;
                for(var i in query){
                    // if anything doesn't match, than this should be in the query
                    var match = query[i];
                    var value = this.getValue(item,i);
                    if((typeof match == 'string' && (match.match(/[\*\.]/) || ignoreCase)) ?
                        !dojo.data.util.filter.patternToRegExp(match, ignoreCase).test(value) :
                        value != match){
                        return false;
                    }
                }
                return true;
            },

            constructor: function(args){
                this.zone = args.zone;
                this.target = dojo.replace(versa.api.Groups.TRGT, this.zone);
                this.schema = versa.api.Group.schema;
                this.cache = true;

                this._initialize();
                this.store.matchesQuery  = dojo.hitch(this, this._matchesQuery);
            },

            getAdmin: function(){
                var admin = null;

                this.forEach(function(item){
                    if(item.is_admin)
                        admin = item;
                }, this);

                return admin;
            },

            getEveryone: function(){
                var everyone = null;

                this.forEach(function(item){
                    if(item.is_everyone)
                        everyone = item;
                }, this);

                return everyone;
            }

        });

        o.TRGT = '/zones/{subdomain}/groups'

        return o;
    }
);


},
'dijit/layout/_ContentPaneResizeMixin':function(){
define("dijit/layout/_ContentPaneResizeMixin", [
	"dojo/_base/array", // array.filter array.forEach
	"dojo/_base/declare", // declare
	"dojo/dom-attr",	// domAttr.has
	"dojo/dom-class",	// domClass.contains domClass.toggle
	"dojo/dom-geometry",// domGeometry.contentBox domGeometry.marginBox
	"dojo/_base/lang", // lang.mixin
	"dojo/query", // query
	"dojo/_base/sniff", // has("ie")
	"dojo/_base/window", // win.global
	"../registry",	// registry.byId
	"./utils",	// marginBox2contextBox
	"../_Contained"
], function(array, declare, domAttr, domClass, domGeometry, lang, query, has, win,
			registry, layoutUtils, _Contained){

/*=====
var _Contained = dijit._Contained;
=====*/

// module:
//		dijit/layout/_ContentPaneResizeMixin
// summary:
//		Resize() functionality of ContentPane.   If there's a single layout widget
//		child then it will call resize() with the same dimensions as the ContentPane.
//		Otherwise just calls resize on each child.


return declare("dijit.layout._ContentPaneResizeMixin", null, {
	// summary:
	//		Resize() functionality of ContentPane.   If there's a single layout widget
	//		child then it will call resize() with the same dimensions as the ContentPane.
	//		Otherwise just calls resize on each child.
	//
	//		Also implements basic startup() functionality, where starting the parent
	//		will start the children

	// doLayout: Boolean
	//		- false - don't adjust size of children
	//		- true - if there is a single visible child widget, set it's size to
	//				however big the ContentPane is
	doLayout: true,

	// isLayoutContainer: [protected] Boolean
	//		Indicates that this widget will call resize() on it's child widgets
	//		when they become visible.
	isLayoutContainer: true,

	startup: function(){
		// summary:
		//		See `dijit.layout._LayoutWidget.startup` for description.
		//		Although ContentPane doesn't extend _LayoutWidget, it does implement
		//		the same API.

		if(this._started){ return; }

		var parent = this.getParent();
		this._childOfLayoutWidget = parent && parent.isLayoutContainer;

		// I need to call resize() on my child/children (when I become visible), unless
		// I'm the child of a layout widget in which case my parent will call resize() on me and I'll do it then.
		this._needLayout = !this._childOfLayoutWidget;

		this.inherited(arguments);

		if(this._isShown()){
			this._onShow();
		}

		if(!this._childOfLayoutWidget){
			// If my parent isn't a layout container, since my style *may be* width=height=100%
			// or something similar (either set directly or via a CSS class),
			// monitor when my size changes so that I can re-layout.
			// For browsers where I can't directly monitor when my size changes,
			// monitor when the viewport changes size, which *may* indicate a size change for me.
			this.connect(has("ie") ? this.domNode : win.global, 'onresize', function(){
				// Using function(){} closure to ensure no arguments to resize.
				this._needLayout = !this._childOfLayoutWidget;
				this.resize();
			});
		}
	},

	_checkIfSingleChild: function(){
		// summary:
		//		Test if we have exactly one visible widget as a child,
		//		and if so assume that we are a container for that widget,
		//		and should propagate startup() and resize() calls to it.
		//		Skips over things like data stores since they aren't visible.

		var childNodes = query("> *", this.containerNode).filter(function(node){
				return node.tagName !== "SCRIPT"; // or a regexp for hidden elements like script|area|map|etc..
			}),
			childWidgetNodes = childNodes.filter(function(node){
				return domAttr.has(node, "data-dojo-type") || domAttr.has(node, "dojoType") || domAttr.has(node, "widgetId");
			}),
			candidateWidgets = array.filter(childWidgetNodes.map(registry.byNode), function(widget){
				return widget && widget.domNode && widget.resize;
			});

		if(
			// all child nodes are widgets
			childNodes.length == childWidgetNodes.length &&

			// all but one are invisible (like dojo.data)
			candidateWidgets.length == 1
		){
			this._singleChild = candidateWidgets[0];
		}else{
			delete this._singleChild;
		}

		// So we can set overflow: hidden to avoid a safari bug w/scrollbars showing up (#9449)
		domClass.toggle(this.containerNode, this.baseClass + "SingleChild", !!this._singleChild);
	},

	resize: function(changeSize, resultSize){
		// summary:
		//		See `dijit.layout._LayoutWidget.resize` for description.
		//		Although ContentPane doesn't extend _LayoutWidget, it does implement
		//		the same API.

		// For the TabContainer --> BorderContainer --> ContentPane case, _onShow() is
		// never called, so resize() is our trigger to do the initial href download (see [20099]).
		// However, don't load href for closed TitlePanes.
		if(!this._wasShown && this.open !== false){
			this._onShow();
		}

		this._resizeCalled = true;

		this._scheduleLayout(changeSize, resultSize);
	},

	_scheduleLayout: function(changeSize, resultSize){
		// summary:
		//		Resize myself, and call resize() on each of my child layout widgets, either now
		//		(if I'm currently visible) or when I become visible
		if(this._isShown()){
			this._layout(changeSize, resultSize);
		}else{
			this._needLayout = true;
			this._changeSize = changeSize;
			this._resultSize = resultSize;
		}
	},

	_layout: function(changeSize, resultSize){
		// summary:
		//		Resize myself according to optional changeSize/resultSize parameters, like a layout widget.
		//		Also, since I am a Container widget, each of my children expects me to
		//		call resize() or layout() on them.
		//
		//		Should be called on initialization and also whenever we get new content
		//		(from an href, or from set('content', ...))... but deferred until
		//		the ContentPane is visible

		// Set margin box size, unless it wasn't specified, in which case use current size.
		if(changeSize){
			domGeometry.setMarginBox(this.domNode, changeSize);
		}

		// Compute content box size of containerNode in case we [later] need to size our single child.
		var cn = this.containerNode;
		if(cn === this.domNode){
			// If changeSize or resultSize was passed to this method and this.containerNode ==
			// this.domNode then we can compute the content-box size without querying the node,
			// which is more reliable (similar to LayoutWidget.resize) (see for example #9449).
			var mb = resultSize || {};
			lang.mixin(mb, changeSize || {}); // changeSize overrides resultSize
			if(!("h" in mb) || !("w" in mb)){
				mb = lang.mixin(domGeometry.getMarginBox(cn), mb); // just use domGeometry.setMarginBox() to fill in missing values
			}
			this._contentBox = layoutUtils.marginBox2contentBox(cn, mb);
		}else{
			this._contentBox = domGeometry.getContentBox(cn);
		}

		this._layoutChildren();

		delete this._needLayout;
	},

	_layoutChildren: function(){
		// Call _checkIfSingleChild() again in case app has manually mucked w/the content
		// of the ContentPane (rather than changing it through the set("content", ...) API.
		if(this.doLayout){
			this._checkIfSingleChild();
		}

		if(this._singleChild && this._singleChild.resize){
			var cb = this._contentBox || domGeometry.getContentBox(this.containerNode);

			// note: if widget has padding this._contentBox will have l and t set,
			// but don't pass them to resize() or it will doubly-offset the child
			this._singleChild.resize({w: cb.w, h: cb.h});
		}else{
			// All my child widgets are independently sized (rather than matching my size),
			// but I still need to call resize() on each child to make it layout.
			array.forEach(this.getChildren(), function(widget){
				if(widget.resize){
					widget.resize();
				}
			});
		}
	},

	_isShown: function(){
		// summary:
		//		Returns true if the content is currently shown.
		// description:
		//		If I am a child of a layout widget then it actually returns true if I've ever been visible,
		//		not whether I'm currently visible, since that's much faster than tracing up the DOM/widget
		//		tree every call, and at least solves the performance problem on page load by deferring loading
		//		hidden ContentPanes until they are first shown

		if(this._childOfLayoutWidget){
			// If we are TitlePane, etc - we return that only *IF* we've been resized
			if(this._resizeCalled && "open" in this){
				return this.open;
			}
			return this._resizeCalled;
		}else if("open" in this){
			return this.open;		// for TitlePane, etc.
		}else{
			var node = this.domNode, parent = this.domNode.parentNode;
			return (node.style.display != 'none') && (node.style.visibility != 'hidden') && !domClass.contains(node, "dijitHidden") &&
					parent && parent.style && (parent.style.display != 'none');
		}
	},

	_onShow: function(){
		// summary:
		//		Called when the ContentPane is made visible
		// description:
		//		For a plain ContentPane, this is called on initialization, from startup().
		//		If the ContentPane is a hidden pane of a TabContainer etc., then it's
		//		called whenever the pane is made visible.
		//
		//		Does layout/resize of child widget(s)

		if(this._needLayout){
			// If a layout has been scheduled for when we become visible, do it now
			this._layout(this._changeSize, this._resultSize);
		}

		this.inherited(arguments);

		// Need to keep track of whether ContentPane has been shown (which is different than
		// whether or not it's currently visible).
		this._wasShown = true;
	}
});

});

},
'versa/api/ChoiceLists':function(){
/**
 * @author Scott
 */
define("versa/api/ChoiceLists", ["dojo/_base/declare",
        "versa/api/ChoiceList",
        "versa/api/_Collection",
        "versa/api/Error",
        "versa/api/DataTypes"],
    function(declare){
        var o=declare("versa.api.ChoiceLists", [versa.api._Collection], {
            _matchesQuery: function(item,request){

                //query returns array of choice list values,
                //exclude them.
                if(dojo.isArray(item) || (item.hasOwnProperty('sort_order')))
                    return false;
        
                var query = request.query;
                var ignoreCase = request.queryOptions && request.queryOptions.ignoreCase;
                for(var i in query){
                    // if anything doesn't match, than this should be in the query
                    var match = query[i];
                    var value = this.getValue(item,i);
                    if((typeof match == 'string' && (match.match(/[\*\.]/) || ignoreCase)) ?
                        !dojo.data.util.filter.patternToRegExp(match, ignoreCase).test(value) :
                        value != match){
                        return false;
                    }
                }
                return true;
            },
        
            constructor: function(/* Object */args){
                this.zone=args.zone;
                this.library=args.library;
                this.target = dojo.replace(versa.api.ChoiceLists.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.ChoiceList.schema;
                this.cache = true;
        
                this._initialize();
                this.store.matchesQuery  = dojo.hitch(this, this._matchesQuery);
        
            },
        
            isValidItem: function(args){
                var isValid = this.inherited(arguments);
                var item = args.item;
                var choiceValues = args.choice_values;
                
                if(!isValid) return;
                
                if (item.name.length < 1) {
                    throw new Error('Choice List \'Name\' is empty or invalid');
                }
                
                if((!choiceValues) || (choiceValues.length < 1)){
                    throw new Error('Choice List \'' + item.name + '\' does not contain any values');
                }
                        
                return true;
            }            
        });

        o.TRGT="/zones/{0}/libraries/{1}/choice_lists"

        return o;
    }
);


},
'versa/widget/mobile/Heading':function(){
require(["dojo/_base/declare",
         "dojox/mobile/Heading"],
    function(declare){
        declare("versa.widget.mobile.Heading", [dijit._WidgetBase, dojox.mobile.Heading], {
            fixed: "top",
            back: null,
            backTransition: null,
            backDirection: null,
            backButton: null,
            logoffButton: null,


            constructor: function(args){
                this.inherited('constructor', arguments);
            },

            postCreate: function(args){
                this.set('label', this.label.display_limit(12));
                this.inherited('postCreate', arguments);

                this.logoffButton=new dojox.mobile.ToolBarButton({
                    label: "Logoff",
                    from: this.from,
                    onClick: dojo.hitch(this, function(){
                        this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.LOGOFF, {from: this.from});
                    }),
                    style: "float: right;"
                });
                this.addChild(this.logoffButton);
            },

            _setBackAttr: function(back){
                this.back=back;
                if(!this.backButton&&this.back){
                    this.backButton=new dojox.mobile.ToolBarButton({
                        moveTo: this.back,
                        label: "Back",
                        transition: this.backTransition?this.backTransition:"slide",
                        transitionDir: this.backDirection?this.backDirection:-1
                    });
                    this.addChild(this.backButton);
                }else if(this.backButton&&this.back){
                    this.backButton.set("moveTo", this.back);
                }
            }
        })
    }
);

},
'versa/widget/document/mobile/LargeTextView':function(){
require(["dojo/_base/declare",
         "dijit/_WidgetBase",
         "dojox/mobile/Heading",
         "dojox/mobile/ScrollableView",
         "dojox/mobile/EdgeToEdgeDataList",
         "dojox/mobile/ToolBarButton",
         "dojox/mobile/ContentPane",
         "versa/api/Folders",
         "versa/api/Documents",
         "versa/api/Zones",
         "dojo/data/ItemFileWriteStore",
         "dojo/date/locale"],
    function(declare){
        declare("versa.widget.document.mobile.LargeTextView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
            document: null,
            library: null,
            property: null,

            header: null,
            footer: null,
            cpContent: null,

            constructor: function(args){
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);


                this.header=new versa.widget.mobile.Heading({
                    label: this.label,
                    from: this,
                    back: this.back,
                    onCommand: this.onCommand
                });

                this.footer=new versa.widget.mobile.Footing({
                    onCommand: this.onCommand,
                    from: this
                });

                this.cpContent=new dojox.mobile.ContentPane({
                    content: this.document[this.property]
                });

                this.addChild(this.header);
                this.addChild(this.footer);
                this.addChild(this.cpContent);
            },



            startup: function(){
                this.inherited('startup', arguments);
            }
        });
    }
);


},
'versa/api/SharedItem':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 16/04/12
 * Time: 12:06 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/SharedItem", ["dojo/_base/declare",
         "versa/api/_Object",
         "versa/api/Utilities"],
    function(declare){
        var o=declare("versa.api.SharedItem", [versa.api._Object], {
            zone: null,

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));

            },

            copyLocal: function(args){
                var zone = args.zone;
                var share = args.share;
                var form = args.form;

                var url = dojo.replace(versa.api.SharedItem.CP_TRGT, [zone.subdomain, share.fingerprint, this.getId()]);

                form.set('action', url);
                form.set('target', '_self');
                form.set('method', 'post');
                form.submit();

            },

            view: function(args){
                var zone = args.zone;
                var share = args.share;
                var form = args.form;

                var url = dojo.replace(versa.api.SharedItem.VW_TRGT, [zone.subdomain, share.fingerprint, this.getId()]);

                versa.api.Utilities.viewUrl({
                    windowBox: args.windowBox,
                    url: url,
                    window_name: 'versa_viewer'
                });

        //        form.set('action', url);
        //        form.set('target', '_blank');
        //        form.set('method', 'post');
        //        form.submit();
            }
        });

        o.VW_TRGT = '/zones/{0}/shares/{1}/download/?item_id={2}&disposition=inline';
        o.CP_TRGT = '/zones/{0}/shares/{1}/download/?item_id={2}&disposition=attachment';

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                }
            },

            prototype: new o()
        };

        return o;
    }
);


},
'dojo/cldr/supplemental':function(){
define("dojo/cldr/supplemental", ["../_base/kernel", "../_base/lang", "../i18n"], function(dojo, lang) {
	// module:
	//		dojo/cldr/supplemental
	// summary:
	//		TODOC

lang.getObject("cldr.supplemental", true, dojo);

dojo.cldr.supplemental.getFirstDayOfWeek = function(/*String?*/locale){
// summary: Returns a zero-based index for first day of the week
// description:
//		Returns a zero-based index for first day of the week, as used by the local (Gregorian) calendar.
//		e.g. Sunday (returns 0), or Monday (returns 1)

	// from http://www.unicode.org/cldr/data/common/supplemental/supplementalData.xml:supplementalData/weekData/firstDay
	var firstDay = {/*default is 1=Monday*/
		mv:5,
		ae:6,af:6,bh:6,dj:6,dz:6,eg:6,er:6,et:6,iq:6,ir:6,jo:6,ke:6,kw:6,
		ly:6,ma:6,om:6,qa:6,sa:6,sd:6,so:6,sy:6,tn:6,ye:6,
		ar:0,as:0,az:0,bw:0,ca:0,cn:0,fo:0,ge:0,gl:0,gu:0,hk:0,
		il:0,'in':0,jm:0,jp:0,kg:0,kr:0,la:0,mh:0,mn:0,mo:0,mp:0,
		mt:0,nz:0,ph:0,pk:0,sg:0,th:0,tt:0,tw:0,um:0,us:0,uz:0,
		vi:0,zw:0
// variant. do not use?		gb:0,
	};

	var country = dojo.cldr.supplemental._region(locale);
	var dow = firstDay[country];
	return (dow === undefined) ? 1 : dow; /*Number*/
};

dojo.cldr.supplemental._region = function(/*String?*/locale){
	locale = dojo.i18n.normalizeLocale(locale);
	var tags = locale.split('-');
	var region = tags[1];
	if(!region){
		// IE often gives language only (#2269)
		// Arbitrary mappings of language-only locales to a country:
		region = {de:"de", en:"us", es:"es", fi:"fi", fr:"fr", he:"il", hu:"hu", it:"it",
			ja:"jp", ko:"kr", nl:"nl", pt:"br", sv:"se", zh:"cn"}[tags[0]];
	}else if(region.length == 4){
		// The ISO 3166 country code is usually in the second position, unless a
		// 4-letter script is given. See http://www.ietf.org/rfc/rfc4646.txt
		region = tags[2];
	}
	return region;
};

dojo.cldr.supplemental.getWeekend = function(/*String?*/locale){
// summary: Returns a hash containing the start and end days of the weekend
// description:
//		Returns a hash containing the start and end days of the weekend according to local custom using locale,
//		or by default in the user's locale.
//		e.g. {start:6, end:0}

	// from http://www.unicode.org/cldr/data/common/supplemental/supplementalData.xml:supplementalData/weekData/weekend{Start,End}
	var weekendStart = {/*default is 6=Saturday*/
		'in':0,
		af:4,dz:4,ir:4,om:4,sa:4,ye:4,
		ae:5,bh:5,eg:5,il:5,iq:5,jo:5,kw:5,ly:5,ma:5,qa:5,sd:5,sy:5,tn:5
	};

	var weekendEnd = {/*default is 0=Sunday*/
		af:5,dz:5,ir:5,om:5,sa:5,ye:5,
		ae:6,bh:5,eg:6,il:6,iq:6,jo:6,kw:6,ly:6,ma:6,qa:6,sd:6,sy:6,tn:6
	};

	var country = dojo.cldr.supplemental._region(locale);
	var start = weekendStart[country];
	var end = weekendEnd[country];
	if(start === undefined){start=6;}
	if(end === undefined){end=0;}
	return {start:start, end:end}; /*Object {start,end}*/
};

return dojo.cldr.supplemental;
});

},
'versa/api/Library':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 22/09/11
 * Time: 4:49 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Library", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/_Securable",
        "versa/api/ChoiceLists",
        "versa/api/Documents",
        "versa/api/DocumentTypes",
        "versa/api/Folders",
        "versa/api/PropertyDefinitions",
        "versa/api/References",
        "versa/api/ViewMappings"],

    function(declare){
        var o=declare("versa.api.Library",
                [versa.api._Object,
                 versa.api._Securable], {
            zone: null,

            _choiceLists: null,
            _documents: null,
            _documentTypes: null,
            _folders: null,
            _propertyDefinitions: null,
            _references: null,
            _viewDefinitions: null,
            _viewMappings: null,
            _cellDefinitions: null,

            description: null,

            constructor: function(args){
                declare.safeMixin(this, ((!args) ? { } : args));
                this.securable_type = versa.api._Securable.types.Library
            },

            createShare: function(args){

                var shareRoot = args.shareRoot;
                var parentInfo = { parent: shareRoot, attribute: 'children' };

                var share = this.getFolders().store.newItem({
                    name: args.name,
                    folder_type: versa.api.Folder.FolderTypes.SHARE,
                    parent_id: shareRoot.getId(),
                    password: args.password,
                    expiry: args.expiry,
                    seed_id: (args.seed) ? args.seed.getId() : null,
                    children: []
                }, parentInfo);
                this.getFolders().store.changing(share);

               return share;
            },

            empty_trash: function(args){
                var zone = args.zone;

                var url = dojo.replace(versa.api.Library.EMPTYTRASH_TRGT,  [zone.subdomain, this.getId()]);

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: {}
                });

                return true;
            },

            getChoiceLists: function(){

                if(!this._choiceLists){
                    this._choiceLists = new versa.api.ChoiceLists({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._choiceLists;
            },

            getDocuments: function(){

                if(!this._documents){
                    this._documents = new versa.api.Documents({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._documents;
            },

            getDocumentTypes: function(){

               if(!this._documentTypes){
                    this._documentTypes = new versa.api.DocumentTypes({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._documentTypes;

            },

            getFolders: function(){

                if(!this._folders){
                    this._folders = new versa.api.Folders({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._folders;

            },

            getPropertyDefinitions: function(){

               if(!this._propertyDefinitions){
                    this._propertyDefinitions = new versa.api.PropertyDefinitions({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._propertyDefinitions;
            },

            getPropertyMappings: function(){
                if(!this._propertyMappings){
                    this._propertyMappings = new versa.api.PropertyMappings({
                        zone: this.zone,
                        library: this
                    })
                }
                return this._propertyMappings;
            },

            getReferences: function(){
                if(!this._references){
                    this._references = new versa.api.References({
                        zone: this.zone,
                        library: this
                    })
                }

                return this._references;
            },

            getViewDefinitions: function(){

                if(!this._viewDefinitions){
                    this._viewDefinitions = new versa.api.ViewDefinitions({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._viewDefinitions;

            },

            getViewMappings: function(){

                if(!this._viewMappings){
                    this._viewMappings = new versa.api.ViewMappings({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._viewMappings;

            },

            getCellDefinitions: function(){

                if(!this._cellDefinitions){
                    this._cellDefinitions = new versa.api.CellDefinitions({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._cellDefinitions;

            }
        });

        o.EMPTYTRASH_TRGT = '/zones/{0}/libraries/{1}/empty_trash.json';

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'description': {
                    type: 'string'
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string'
                },
                'updated_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'updated_by': {
                    type: 'string'
                }
            },
            prototype: new o()
         };

        return o;
    }
);


},
'versa/api/SharedItems':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 16/04/12
 * Time: 9:49 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/SharedItems", ["dojo/_base/declare",
         "versa/api/_Collection",
         "versa/api/SharedItem"],
    function(declare){
        var o=declare("versa.api.SharedItems", [versa.api._Collection], {
            zone: null,
            share: null,

            constructor: function(args){
                this.zone = args.zone;
                this.share = args.share;
                this.target = dojo.replace(versa.api.SharedItems.TRGT, [this.zone.subdomain, this.share.fingerprint]);
                this.schema = versa.api.SharedItem.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.TRGT = '/zones/{0}/shares/{1}/shared_items';

        return o;
    }
);


},
'dojox/data/JsonRestStore':function(){
define("dojox/data/JsonRestStore", ["dojo/_base/lang", "dojo/_base/declare", "dojo/_base/connect", "dojox/rpc/Rest", 
		"dojox/rpc/JsonRest", "dojox/json/schema", "dojox/data/ServiceStore"], 
  function(lang, declare, connect, rpcRest, rpcJsonRest, jsonSchema, ServiceStore) {

/*=====
var ServiceStore = dojox.data.ServiceStore;
=====*/

var JsonRestStore = declare("dojox.data.JsonRestStore", ServiceStore,
	{
		constructor: function(options){
			//summary:
			//		JsonRestStore is a Dojo Data store interface to JSON HTTP/REST web
			//		storage services that support read and write through GET, PUT, POST, and DELETE.
			// options:
			// 		Keyword arguments
			//
			// The *schema* parameter
			//		This is a schema object for this store. This should be JSON Schema format.
			//
			// The *service* parameter
			// 		This is the service object that is used to retrieve lazy data and save results
			// 		The function should be directly callable with a single parameter of an object id to be loaded
			// 		The function should also have the following methods:
			// 			put(id,value) - puts the value at the given id
			// 			post(id,value) - posts (appends) the value at the given id
			// 			delete(id) - deletes the value corresponding to the given id
			//		Note that it is critical that the service parses responses as JSON.
			//		If you are using dojox.rpc.Service, the easiest way to make sure this
			// 		happens is to make the responses have a content type of
			// 		application/json. If you are creating your own service, make sure you
			//		use handleAs: "json" with your XHR requests.
			//
			// The *target* parameter
			// 		This is the target URL for this Service store. This may be used in place
			// 		of a service parameter to connect directly to RESTful URL without
			// 		using a dojox.rpc.Service object.
			//
			// The *idAttribute* parameter
			//		Defaults to 'id'. The name of the attribute that holds an objects id.
			//		This can be a preexisting id provided by the server.
			//		If an ID isn't already provided when an object
			//		is fetched or added to the store, the autoIdentity system
			//		will generate an id for it and add it to the index.
			//
			// The *syncMode* parameter
			//		Setting this to true will set the store to using synchronous calls by default.
			//		Sync calls return their data immediately from the calling function, so
			//		callbacks are unnecessary
			//
			//	description:
			//		The JsonRestStore will cause all saved modifications to be sent to the server using Rest commands (PUT, POST, or DELETE).
			// 		When using a Rest store on a public network, it is important to implement proper security measures to
			//		control access to resources.
			//		On the server side implementing a REST interface means providing GET, PUT, POST, and DELETE handlers.
			//		GET - Retrieve an object or array/result set, this can be by id (like /table/1) or with a
			// 			query (like /table/?name=foo).
			//		PUT - This should modify a object, the URL will correspond to the id (like /table/1), and the body will
			// 			provide the modified object
			//		POST - This should create a new object. The URL will correspond to the target store (like /table/)
			// 			and the body should be the properties of the new object. The server's response should include a
			// 			Location header that indicates the id of the newly created object. This id will be used for subsequent
			// 			PUT and DELETE requests. JsonRestStore also includes a Content-Location header that indicates
			//			the temporary randomly generated id used by client, and this location is used for subsequent
			// 			PUT/DELETEs if no Location header is provided by the server or if a modification is sent prior
			// 			to receiving a response from the server.
			// 		DELETE - This should delete an object by id.
			// 		These articles include more detailed information on using the JsonRestStore:
			//		http://www.sitepen.com/blog/2008/06/13/restful-json-dojo-data/
			//		http://blog.medryx.org/2008/07/24/jsonreststore-overview/
			//
			//	example:
			// 		A JsonRestStore takes a REST service or a URL and uses it the remote communication for a
			// 		read/write dojo.data implementation. A JsonRestStore can be created with a simple URL like:
			// 	|	new JsonRestStore({target:"/MyData/"});
			//	example:
			// 		To use a JsonRestStore with a service, you should create a
			// 		service with a REST transport. This can be configured with an SMD:
			//	|	{
			//	|		services: {
			//	|			jsonRestStore: {
			//	|				transport: "REST",
			//	|				envelope: "URL",
			//	|				target: "store.php",
			//	|				contentType:"application/json",
			//	|				parameters: [
			//	|					{name: "location", type: "string", optional: true}
			//	|				]
			//	|			}
			//	|		}
			//	|	}
			// 		The SMD can then be used to create service, and the service can be passed to a JsonRestStore. For example:
			//	|	var myServices = new dojox.rpc.Service(dojo.moduleUrl("dojox.rpc.tests.resources", "test.smd"));
			//	|	var jsonStore = new dojox.data.JsonRestStore({service:myServices.jsonRestStore});
			//	example:
			//		The JsonRestStore also supports lazy loading. References can be made to objects that have not been loaded.
			//		For example if a service returned:
			//	|	{"name":"Example","lazyLoadedObject":{"$ref":"obj2"}}
			// 		And this object has accessed using the dojo.data API:
			//	|	var obj = jsonStore.getValue(myObject,"lazyLoadedObject");
			//		The object would automatically be requested from the server (with an object id of "obj2").
			//

			connect.connect(rpcRest._index,"onUpdate",this,function(obj,attrName,oldValue,newValue){
				var prefix = this.service.servicePath;
				if(!obj.__id){
					console.log("no id on updated object ", obj);
				}else if(obj.__id.substring(0,prefix.length) == prefix){
					this.onSet(obj,attrName,oldValue,newValue);
				}
			});
			this.idAttribute = this.idAttribute || 'id';// no options about it, we have to have identity

			if(typeof options.target == 'string'){
				options.target = options.target.match(/\/$/) || this.allowNoTrailingSlash ? options.target : (options.target + '/');
				if(!this.service){
					this.service = rpcJsonRest.services[options.target] ||
							rpcRest(options.target, true);
					// create a default Rest service
				}
			}

			rpcJsonRest.registerService(this.service, options.target, this.schema);
			this.schema = this.service._schema = this.schema || this.service._schema || {};
			// wrap the service with so it goes through JsonRest manager
			this.service._store = this;
			this.service.idAsRef = this.idAsRef;
			this.schema._idAttr = this.idAttribute;
			var constructor = rpcJsonRest.getConstructor(this.service);
			var self = this;
			this._constructor = function(data){
				constructor.call(this, data);
				self.onNew(this);
			}
			this._constructor.prototype = constructor.prototype;
			this._index = rpcRest._index;
		},
		
		// summary:
		//		Will load any schemas referenced content-type header or in Link headers
		loadReferencedSchema: true,
		// summary:
		//		Treat objects in queries as partially loaded objects
		idAsRef: false,
		referenceIntegrity: true,
		target:"",
		// summary:
		// 		Allow no trailing slash on target paths. This is generally discouraged since
		// 		it creates prevents simple scalar values from being used a relative URLs.
		// 		Disabled by default.
		allowNoTrailingSlash: false,
		//Write API Support
		newItem: function(data, parentInfo){
			// summary:
			//		adds a new item to the store at the specified point.
			//		Takes two parameters, data, and options.
			//
			//	data: /* object */
			//		The data to be added in as an item.
			data = new this._constructor(data);
			if(parentInfo){
				// get the previous value or any empty array
				var values = this.getValue(parentInfo.parent,parentInfo.attribute,[]);
				// set the new value
				values = values.concat([data]);
				data.__parent = values;
				this.setValue(parentInfo.parent, parentInfo.attribute, values);
			}
			return data;
		},
		deleteItem: function(item){
			// summary:
			//		deletes item and any references to that item from the store.
			//
			//	item:
			//		item to delete
			//

			//	If the desire is to delete only one reference, unsetAttribute or
			//	setValue is the way to go.
			var checked = [];
			var store = dataExtCfg._getStoreForItem(item) || this;
			if(this.referenceIntegrity){
				// cleanup all references
				rpcJsonRest._saveNotNeeded = true;
				var index = rpcRest._index;
				var fixReferences = function(parent){
					var toSplice;
					// keep track of the checked ones
					checked.push(parent);
					// mark it checked so we don't run into circular loops when encountering cycles
					parent.__checked = 1;
					for(var i in parent){
						if(i.substring(0,2) != "__"){
							var value = parent[i];
							if(value == item){
								if(parent != index){ // make sure we are just operating on real objects
									if(parent instanceof Array){
										// mark it as needing to be spliced, don't do it now or it will mess up the index into the array
										(toSplice = toSplice || []).push(i);
									}else{
										// property, just delete it.
										(dataExtCfg._getStoreForItem(parent) || store).unsetAttribute(parent, i);
									}
								}
							}else{
								if((typeof value == 'object') && value){
									if(!value.__checked){
										// recursively search
										fixReferences(value);
									}
									if(typeof value.__checked == 'object' && parent != index){
										// if it is a modified array, we will replace it
										(dataExtCfg._getStoreForItem(parent) || store).setValue(parent, i, value.__checked);
									}
								}
							}
						}
					}
					if(toSplice){
						// we need to splice the deleted item out of these arrays
						i = toSplice.length;
						parent = parent.__checked = parent.concat(); // indicates that the array is modified
						while(i--){
							parent.splice(toSplice[i], 1);
						}
						return parent;
					}
					return null;
				};
				// start with the index
				fixReferences(index);
				rpcJsonRest._saveNotNeeded = false;
				var i = 0;
				while(checked[i]){
					// remove the checked marker
					delete checked[i++].__checked;
				}
			}
			rpcJsonRest.deleteObject(item);

			store.onDelete(item);
		},
		changing: function(item,_deleting){
			// summary:
			//		adds an item to the list of dirty items.	This item
			//		contains a reference to the item itself as well as a
			//		cloned and trimmed version of old item for use with
			//		revert.
			rpcJsonRest.changing(item,_deleting);
		},
		cancelChanging : function(object){
			//	summary:
			// 		Removes an object from the list of dirty objects
			//		This will prevent that object from being saved to the server on the next save
			//	object:
			//		The item to cancel changes on
			if(!object.__id){
				return;
			}
			dirtyObjects = dirty=rpcJsonRest.getDirtyObjects();
			for(var i=0; i<dirtyObjects.length; i++){
				var dirty = dirtyObjects[i];
				if(object==dirty.object){
					dirtyObjects.splice(i, 1);
					return;
				}
			}
	
		},

		setValue: function(item, attribute, value){
			// summary:
			//		sets 'attribute' on 'item' to 'value'

			var old = item[attribute];
			var store = item.__id ? dataExtCfg._getStoreForItem(item) : this;
			if(jsonSchema && store.schema && store.schema.properties){
				// if we have a schema and schema validator available we will validate the property change
				jsonSchema.mustBeValid(jsonSchema.checkPropertyChange(value,store.schema.properties[attribute]));
			}
			if(attribute == store.idAttribute){
				throw new Error("Can not change the identity attribute for an item");
			}
			store.changing(item);
			item[attribute]=value;
			if(value && !value.__parent){
				value.__parent = item;
			}
			store.onSet(item,attribute,old,value);
		},
		setValues: function(item, attribute, values){
			// summary:
			//	sets 'attribute' on 'item' to 'value' value
			//	must be an array.


			if(!lang.isArray(values)){
				throw new Error("setValues expects to be passed an Array object as its value");
			}
			this.setValue(item,attribute,values);
		},

		unsetAttribute: function(item, attribute){
			// summary:
			//		unsets 'attribute' on 'item'

			this.changing(item);
			var old = item[attribute];
			delete item[attribute];
			this.onSet(item,attribute,old,undefined);
		},
		save: function(kwArgs){
			// summary:
			//		Saves the dirty data using REST Ajax methods. See dojo.data.api.Write for API.
			//
			//	kwArgs.global:
			//		This will cause the save to commit the dirty data for all
			// 		JsonRestStores as a single transaction.
			//
			//	kwArgs.revertOnError
			//		This will cause the changes to be reverted if there is an
			//		error on the save. By default a revert is executed unless
			//		a value of false is provide for this parameter.
			//
			//	kwArgs.incrementalUpdates
			//		For items that have been updated, if this is enabled, the server will be sent a POST request
			// 		with a JSON object containing the changed properties. By default this is
			// 		not enabled, and a PUT is used to deliver an update, and will include a full
			// 		serialization of all the properties of the item/object.
			//		If this is true, the POST request body will consist of a JSON object with
			// 		only the changed properties. The incrementalUpdates parameter may also
			//		be a function, in which case it will be called with the updated and previous objects
			//		and an object update representation can be returned.
			//
			//	kwArgs.alwaysPostNewItems
			//		If this is true, new items will always be sent with a POST request. By default
			//		this is not enabled, and the JsonRestStore will send a POST request if
			//		the item does not include its identifier (expecting server assigned location/
			//		identifier), and will send a PUT request if the item does include its identifier
			//		(the PUT will be sent to the URI corresponding to the provided identifier).

			if(!(kwArgs && kwArgs.global)){
				(kwArgs = kwArgs || {}).service = this.service;
			}
			if("syncMode" in kwArgs ? kwArgs.syncMode : this.syncMode){
				rpcConfig._sync = true;
			}

			var actions = rpcJsonRest.commit(kwArgs);
			this.serverVersion = this._updates && this._updates.length;
			return actions;
		},

		revert: function(kwArgs){
			// summary
			//		returns any modified data to its original state prior to a save();
			//
			//	kwArgs.global:
			//		This will cause the revert to undo all the changes for all
			// 		JsonRestStores in a single operation.
			rpcJsonRest.revert(kwArgs && kwArgs.global && this.service);
		},

		isDirty: function(item){
			// summary
			//		returns true if the item is marked as dirty.
			return rpcJsonRest.isDirty(item, this);
		},
		isItem: function(item, anyStore){
			//	summary:
			//		Checks to see if a passed 'item'
			//		really belongs to this JsonRestStore.
			//
			//	item: /* object */
			//		The value to test for being an item
			//	anyStore: /* boolean*/
			//		If true, this will return true if the value is an item for any JsonRestStore,
			//		not just this instance
			return item && item.__id && (anyStore || this.service == rpcJsonRest.getServiceAndId(item.__id).service);
		},
		_doQuery: function(args){
			var query= typeof args.queryStr == 'string' ? args.queryStr : args.query;
			var deferred = rpcJsonRest.query(this.service,query, args);
			var self = this;
			if(this.loadReferencedSchema){
				deferred.addCallback(function(result){
					var contentType = deferred.ioArgs && deferred.ioArgs.xhr && deferred.ioArgs.xhr.getResponseHeader("Content-Type");
					var schemaRef = contentType && contentType.match(/definedby\s*=\s*([^;]*)/);
					if(contentType && !schemaRef){
						schemaRef = deferred.ioArgs.xhr.getResponseHeader("Link");
						schemaRef = schemaRef && schemaRef.match(/<([^>]*)>;\s*rel="?definedby"?/);
					}
					schemaRef = schemaRef && schemaRef[1];
					if(schemaRef){
						var serviceAndId = rpcJsonRest.getServiceAndId((self.target + schemaRef).replace(/^(.*\/)?(\w+:\/\/)|[^\/\.]+\/\.\.\/|^.*\/(\/)/,"$2$3"));
						var schemaDeferred = rpcJsonRest.byId(serviceAndId.service, serviceAndId.id);
						schemaDeferred.addCallbacks(function(newSchema){
							lang.mixin(self.schema, newSchema);
							return result;
						}, function(error){
							console.error(error); // log it, but don't let it cause the main request to fail
							return result;
						});
						return schemaDeferred;
					}
					return undefined;//don't change anything, and deal with the stupid post-commit lint complaints
				});
			}
			return deferred;
		},
		_processResults: function(results, deferred){
			// index the results
			var count = results.length;
			// if we don't know the length, and it is partial result, we will guess that it is twice as big, that will work for most widgets
			return {totalCount:deferred.fullLength || (deferred.request.count == count ? (deferred.request.start || 0) + count * 2 : count), items: results};
		},

		getConstructor: function(){
			// summary:
			// 		Gets the constructor for objects from this store
			return this._constructor;
		},
		getIdentity: function(item){
			var id = item.__clientId || item.__id;
			if(!id){
				return id;
			}
			var prefix = this.service.servicePath.replace(/[^\/]*$/,'');
			// support for relative or absolute referencing with ids
			return id.substring(0,prefix.length) != prefix ?	id : id.substring(prefix.length); // String
		},
		fetchItemByIdentity: function(args){
			var id = args.identity;
			var store = this;
			// if it is an absolute id, we want to find the right store to query
			if(id.toString().match(/^(\w*:)?\//)){
				var serviceAndId = rpcJsonRest.getServiceAndId(id);
				store = serviceAndId.service._store;
				args.identity = serviceAndId.id;
			}
			args._prefix = store.service.servicePath.replace(/[^\/]*$/,'');
			return store.inherited(arguments);
		},
		//Notifcation Support

		onSet: function(){},
		onNew: function(){},
		onDelete: 	function(){},

		getFeatures: function(){
			// summary:
			// 		return the store feature set
			var features = this.inherited(arguments);
			features["dojo.data.api.Write"] = true;
			features["dojo.data.api.Notification"] = true;
			return features;
		},

		getParent: function(item){
			//	summary:
			//		Returns the parent item (or query) for the given item
			//	item:
			//		The item to find the parent of

			return item && item.__parent;
		}


	}
);
JsonRestStore.getStore = function(options, Class){
	//	summary:
	//		Will retrieve or create a store using the given options (the same options
	//		that are passed to JsonRestStore constructor. Returns a JsonRestStore instance
	//	options:
	//		See the JsonRestStore constructor
	//	Class:
	//		Constructor to use (for creating stores from JsonRestStore subclasses).
	// 		This is optional and defaults to JsonRestStore.
	if(typeof options.target == 'string'){
		options.target = options.target.match(/\/$/) || options.allowNoTrailingSlash ?
				options.target : (options.target + '/');
		var store = (rpcJsonRest.services[options.target] || {})._store;
		if(store){
			return store;
		}
	}
	return new (Class || JsonRestStore)(options);
};

var dataExtCfg = lang.getObject("dojox.data",true); 
dataExtCfg._getStoreForItem = function(item){
	if(item.__id){
		var serviceAndId = rpcJsonRest.getServiceAndId(item.__id);
		if(serviceAndId && serviceAndId.service._store){
			return serviceAndId.service._store;
		}else{
			var servicePath = item.__id.toString().match(/.*\//)[0];
			return new JsonRestStore({target:servicePath});
		}
	}
	return null;
};
var jsonRefConfig = lang.getObject("dojox.json.ref", true);
jsonRefConfig._useRefs = true; // Use referencing when identifiable objects are referenced

return JsonRestStore;
});

},
'versa/widget/document/mobile/DocumentContentView':function(){
require(["dojo/_base/declare",
         "dijit/_WidgetBase",
         "dojox/mobile/Heading",
         "dojox/mobile/ScrollableView",
         "dojox/mobile/EdgeToEdgeDataList",
         "dojox/mobile/ToolBarButton",
         "dojox/mobile/ContentPane",
         "versa/api/Folders",
         "versa/api/Documents",
         "versa/api/Zones",
         "dojo/data/ItemFileWriteStore",
         "dojo/date/locale"],
    function(declare){
        declare("versa.widget.document.mobile.DocumentContentView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
            reference: null,
            zone: null,
            library: null,

            header: null,
            footer: null,
            cpContent: null,

            constructor: function(args){
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.header=new versa.widget.mobile.Heading({
                    label: this.reference.name,
                    from: this,
                    back: this.back,
                    onCommand: this.onCommand
                });

                this.footer=new versa.widget.mobile.Footing({
                    onCommand: this.onCommand,
                    from: this
                });

                if(this.reference.binary_content_type.indexOf('image')>=0){
                    this.cpContent=new dojox.mobile.ContentPane({
                        content: dojo.replace('<div style="text-align: center;vertical-align: middle;width: 100%; height: 100%;"><img src="{0}"/></div>', [this.reference.getViewUrl(this.zone, this.library)])
                    });
                }else if(this.reference.binary_content_type.indexOf('text')>=0){

                    this.cpContent=new dojox.mobile.ContentPane({
                        content: ""
                    });

                    dojo.xhrGet({
                        url: this.reference.getViewUrl(this.zone, this.library),
                        handleAs: "text",
                        load: dojo.hitch(this, function(data){
                            //replace new lines and tabs
                            data = data.replace(/\n/g, "<br/>");
                            data = data.replace(/\t/g, "&nbsp;&nbsp;&nbsp;");
                            this.cpContent.domNode.innerHTML=data;
                        })
                    });
                }


                this.addChild(this.header);
                this.addChild(this.footer);
                this.addChild(this.cpContent);
            },



            startup: function(){
                this.inherited('startup', arguments);
            }
        });
    }
);


},
'dijit/_base/manager':function(){
define("dijit/_base/manager", [
	"dojo/_base/array",
	"dojo/_base/config", // defaultDuration
	"../registry",
	".."	// for setting exports to dijit namespace
], function(array, config, registry, dijit){

	// module:
	//		dijit/_base/manager
	// summary:
	//		Shim to methods on registry, plus a few other declarations.
	//		New code should access dijit/registry directly when possible.

	/*=====
	dijit.byId = function(id){
		// summary:
		//		Returns a widget by it's id, or if passed a widget, no-op (like dom.byId())
		// id: String|dijit._Widget
		return registry.byId(id); // dijit._Widget
	};

	dijit.getUniqueId = function(widgetType){
		// summary:
		//		Generates a unique id for a given widgetType
		// widgetType: String
		return registry.getUniqueId(widgetType); // String
	};

	dijit.findWidgets = function(root){
		// summary:
		//		Search subtree under root returning widgets found.
		//		Doesn't search for nested widgets (ie, widgets inside other widgets).
		// root: DOMNode
		return registry.findWidgets(root);
	};

	dijit._destroyAll = function(){
		// summary:
		//		Code to destroy all widgets and do other cleanup on page unload

		return registry._destroyAll();
	};

	dijit.byNode = function(node){
		// summary:
		//		Returns the widget corresponding to the given DOMNode
		// node: DOMNode
		return registry.byNode(node); // dijit._Widget
	};

	dijit.getEnclosingWidget = function(node){
		// summary:
		//		Returns the widget whose DOM tree contains the specified DOMNode, or null if
		//		the node is not contained within the DOM tree of any widget
		// node: DOMNode
		return registry.getEnclosingWidget(node);
	};
	=====*/
	array.forEach(["byId", "getUniqueId", "findWidgets", "_destroyAll", "byNode", "getEnclosingWidget"], function(name){
		dijit[name] = registry[name];
	});

	/*=====
	dojo.mixin(dijit, {
		// defaultDuration: Integer
		//		The default fx.animation speed (in ms) to use for all Dijit
		//		transitional fx.animations, unless otherwise specified
		//		on a per-instance basis. Defaults to 200, overrided by
		//		`djConfig.defaultDuration`
		defaultDuration: 200
	});
	=====*/
	dijit.defaultDuration = config["defaultDuration"] || 200;

	return dijit;
});

},
'versa/api/ViewMapping':function(){
/**
 * @author aarons
 */
define("versa/api/ViewMapping", ["dojo/_base/declare",
         "versa/api/_Object",
         "versa/api/Error"],
    function(declare){
        var o=declare("versa.api.ViewMapping", [versa.api._Object], {
            constructor: function(/* Object */args){
                if(args) dojo.safeMixin(this, args);
            }
        });

        o.compare = function(item1, item2){
            return item1.sort_order-item2.sort_order;
        };

        o.schema = {
            type: 'object',
            properties: {
                'library_id': {
                    type: 'integer'
                },
                'folder_id': {
                    type: 'integer'
                },
                'user_id': {
                    type: 'integer'
                },
                'view_id': {
                    type: 'integer'
                }
            }
        };

        return o;
    }
);



},
'dojox/mobile/common':function(){
define("dojox/mobile/common", [
	"dojo/_base/kernel", // to test dojo.hash
	"dojo/_base/array",
	"dojo/_base/config",
	"dojo/_base/connect",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
//	"dojo/hash", // optionally prereq'ed
	"dojo/ready",
	"dijit/registry",	// registry.toArray
	"./sniff",
	"./uacss"
], function(dojo, array, config, connect, lang, win, domClass, domConstruct, domStyle, ready, registry, has, uacss){

	var dm = lang.getObject("dojox.mobile", true);
/*=====
	var dm = dojox.mobile;
=====*/

	// module:
	//		dojox/mobile/common
	// summary:
	//		A common module for dojox.mobile.
	// description:
	//		This module includes common utility functions that are used by
	//		dojox.mobile widgets. Also, it provides functions that are commonly
	//		necessary for mobile web applications, such as the hide address bar
	//		function.

	dm.getScreenSize = function(){
		// summary:
		//		Returns the dimensions of the browser window.
		return {
			h: win.global.innerHeight || win.doc.documentElement.clientHeight,
			w: win.global.innerWidth || win.doc.documentElement.clientWidth
		};
	};

	dm.updateOrient = function(){
		// summary:
		//		Updates the orientation specific css classes, 'dj_portrait' and
		//		'dj_landscape'.
		var dim = dm.getScreenSize();
		domClass.replace(win.doc.documentElement,
				  dim.h > dim.w ? "dj_portrait" : "dj_landscape",
				  dim.h > dim.w ? "dj_landscape" : "dj_portrait");
	};
	dm.updateOrient();

	dm.tabletSize = 500;
	dm.detectScreenSize = function(/*Boolean?*/force){
		// summary:
		//		Detects the screen size and determines if the screen is like
		//		phone or like tablet. If the result is changed,
		//		it sets either of the following css class to <html>
		//			- 'dj_phone'
		//			- 'dj_tablet'
		//		and it publishes either of the following events.
		//			- '/dojox/mobile/screenSize/phone'
		//			- '/dojox/mobile/screenSize/tablet'
		var dim = dm.getScreenSize();
		var sz = Math.min(dim.w, dim.h);
		var from, to;
		if(sz >= dm.tabletSize && (force || (!this._sz || this._sz < dm.tabletSize))){
			from = "phone";
			to = "tablet";
		}else if(sz < dm.tabletSize && (force || (!this._sz || this._sz >= dm.tabletSize))){
			from = "tablet";
			to = "phone";
		}
		if(to){
			domClass.replace(win.doc.documentElement, "dj_"+to, "dj_"+from);
			connect.publish("/dojox/mobile/screenSize/"+to, [dim]);
		}
		this._sz = sz;
	};
	dm.detectScreenSize();

	dm.setupIcon = function(/*DomNode*/iconNode, /*String*/iconPos){
		// summary:
		//		Sets up CSS sprite for a foreground image.
		if(iconNode && iconPos){
			var arr = array.map(iconPos.split(/[ ,]/),function(item){return item-0});
			var t = arr[0]; // top
			var r = arr[1] + arr[2]; // right
			var b = arr[0] + arr[3]; // bottom
			var l = arr[1]; // left
			domStyle.set(iconNode, {
				clip: "rect("+t+"px "+r+"px "+b+"px "+l+"px)",
				top: (iconNode.parentNode ? domStyle.get(iconNode, "top") : 0) - t + "px",
				left: -l + "px"
			});
		}
	};

	// dojox.mobile.hideAddressBarWait: Number
	//		The time in milliseconds to wait before the fail-safe hiding address
	//		bar runs. The value must be larger than 800.
	dm.hideAddressBarWait = typeof(config["mblHideAddressBarWait"]) === "number" ?
		config["mblHideAddressBarWait"] : 1500;

	dm.hide_1 = function(force){
		// summary:
		//		Internal function to hide the address bar.
		scrollTo(0, 1);
		var h = dm.getScreenSize().h + "px";
		if(has("android")){
			if(force){
				win.body().style.minHeight = h;
			}
			dm.resizeAll();
		}else{
			if(force || dm._h === h && h !== win.body().style.minHeight){
				win.body().style.minHeight = h;
				dm.resizeAll();
			}
		}
		dm._h = h;
	};

	dm.hide_fs = function(){
		// summary:
		//		Internal function to hide the address bar for fail-safe.
		// description:
		//		Resets the height of the body, performs hiding the address
		//		bar, and calls resizeAll().
		//		This is for fail-safe, in case of failure to complete the
		//		address bar hiding in time.
		var t = win.body().style.minHeight;
		win.body().style.minHeight = (dm.getScreenSize().h * 2) + "px"; // to ensure enough height for scrollTo to work
		scrollTo(0, 1);
		setTimeout(function(){
			dm.hide_1(1);
			dm._hiding = false;
		}, 1000);
	};
	dm.hideAddressBar = function(/*Event?*/evt){
		// summary:
		//		Hides the address bar.
		// description:
		//		Tries hiding of the address bar a couple of times to do it as
		//		quick as possible while ensuring resize is done after the hiding
		//		finishes.
		if(dm.disableHideAddressBar || dm._hiding){ return; }
		dm._hiding = true;
		dm._h = 0;
		win.body().style.minHeight = (dm.getScreenSize().h * 2) + "px"; // to ensure enough height for scrollTo to work
		setTimeout(dm.hide_1, 0);
		setTimeout(dm.hide_1, 200);
		setTimeout(dm.hide_1, 800);
		setTimeout(dm.hide_fs, dm.hideAddressBarWait);
	};

	dm.resizeAll = function(/*Event?*/evt, /*Widget?*/root){
		// summary:
		//		Call the resize() method of all the top level resizable widgets.
		// description:
		//		Find all widgets that do not have a parent or the parent does not
		//		have the resize() method, and call resize() for them.
		//		If a widget has a parent that has resize(), call of the widget's
		//		resize() is its parent's responsibility.
		// evt:
		//		Native event object
		// root:
		//		If specified, search the specified widget recursively for top level
		//		resizable widgets.
		//		root.resize() is always called regardless of whether root is a
		//		top level widget or not.
		//		If omitted, search the entire page.
		if(dm.disableResizeAll){ return; }
		connect.publish("/dojox/mobile/resizeAll", [evt, root]);
		dm.updateOrient();
		dm.detectScreenSize();
		var isTopLevel = function(w){
			var parent = w.getParent && w.getParent();
			return !!((!parent || !parent.resize) && w.resize);
		};
		var resizeRecursively = function(w){
			array.forEach(w.getChildren(), function(child){
				if(isTopLevel(child)){ child.resize(); }
				resizeRecursively(child);
			});
		};
		if(root){
			if(root.resize){ root.resize(); }
			resizeRecursively(root);
		}else{
			array.forEach(array.filter(registry.toArray(), isTopLevel),
					function(w){ w.resize(); });
		}
	};

	dm.openWindow = function(url, target){
		// summary:
		//		Opens a new browser window with the given url.
		win.global.open(url, target || "_blank");
	};

	dm.createDomButton = function(/*DomNode*/refNode, /*Object?*/style, /*DomNode?*/toNode){
		// summary:
		//		Creates a DOM button.
		// description:
		//		DOM button is a simple graphical object that consists of one or
		//		more nested DIV elements with some CSS styling. It can be used
		//		in place of an icon image on ListItem, IconItem, and so on.
		//		The kind of DOM button to create is given as a class name of
		//		refNode. The number of DIVs to create is searched from the style
		//		sheets in the page. However, if the class name has a suffix that
		//		starts with an underscore, like mblDomButtonGoldStar_5, then the
		//		suffixed number is used instead. A class name for DOM button
		//		must starts with 'mblDomButton'.
		// refNode:
		//		A node that has a DOM button class name.
		// style:
		//		A hash object to set styles to the node.
		// toNode:
		//		A root node to create a DOM button. If omitted, refNode is used.

		if(!dm._domButtons){
			if(has("webkit")){
				var findDomButtons = function(sheet, dic){
					// summary:
					//		Searches the style sheets for DOM buttons.
					// description:
					//		Returns a key-value pair object whose keys are DOM
					//		button class names and values are the number of DOM
					//		elements they need.
					var i, j;
					if(!sheet){
						var dic = {};
						var ss = dojo.doc.styleSheets;
						for (i = 0; i < ss.length; i++){
							ss[i] && findDomButtons(ss[i], dic);
						}
						return dic;
					}
					var rules = sheet.cssRules || [];
					for (i = 0; i < rules.length; i++){
						var rule = rules[i];
						if(rule.href && rule.styleSheet){
							findDomButtons(rule.styleSheet, dic);
						}else if(rule.selectorText){
							var sels = rule.selectorText.split(/,/);
							for (j = 0; j < sels.length; j++){
								var sel = sels[j];
								var n = sel.split(/>/).length - 1;
								if(sel.match(/(mblDomButton\w+)/)){
									var cls = RegExp.$1;
									if(!dic[cls] || n > dic[cls]){
										dic[cls] = n;
									}
								}
							}
						}
					}
				}
				dm._domButtons = findDomButtons();
			}else{
				dm._domButtons = {};
			}
		}

		var s = refNode.className;
		var node = toNode || refNode;
		if(s.match(/(mblDomButton\w+)/) && s.indexOf("/") === -1){
			var btnClass = RegExp.$1;
			var nDiv = 4;
			if(s.match(/(mblDomButton\w+_(\d+))/)){
				nDiv = RegExp.$2 - 0;
			}else if(dm._domButtons[btnClass] !== undefined){
				nDiv = dm._domButtons[btnClass];
			}
			var props = null;
			if(has("bb") && config["mblBBBoxShadowWorkaround"] !== false){
				// Removes box-shadow because BlackBerry incorrectly renders it.
				props = {style:"-webkit-box-shadow:none"};
			}
			for(var i = 0, p = node; i < nDiv; i++){
				p = p.firstChild || domConstruct.create("DIV", props, p);
			}
			if(toNode){
				setTimeout(function(){
					domClass.remove(refNode, btnClass);
				}, 0);
				domClass.add(toNode, btnClass);
			}
		}else if(s.indexOf(".") !== -1){ // file name
			domConstruct.create("IMG", {src:s}, node);
		}else{
			return null;
		}
		domClass.add(node, "mblDomButton");
		if(config["mblAndroidWorkaround"] !== false && has("android") >= 2.2){
			// Android workaround for the issue that domButtons' -webkit-transform styles sometimes invalidated
			// by applying -webkit-transform:translated3d(x,y,z) style programmatically to non-ancestor elements,
			// which results in breaking domButtons.
			domStyle.set(node, "webkitTransform", "translate3d(0,0,0)");
		}
		!!style && domStyle.set(node, style);
		return node;
	};
	
	dm.createIcon = function(/*String*/icon, /*String*/iconPos, /*DomNode*/node, /*String?*/title, /*DomNode?*/parent){
		// summary:
		//		Creates or updates an icon node
		// description:
		//		If node exists, updates the existing node. Otherwise, creates a new one.
		// icon:
		//		Path for an image, or DOM button class name.
		if(icon && icon.indexOf("mblDomButton") === 0){
			// DOM button
			if(node && node.className.match(/(mblDomButton\w+)/)){
				domClass.remove(node, RegExp.$1);
			}else{
				node = domConstruct.create("DIV");
			}
			node.title = title;
			domClass.add(node, icon);
			dm.createDomButton(node);
		}else if(icon && icon !== "none"){
			// Image
			if(!node || node.nodeName !== "IMG"){
				node = domConstruct.create("IMG", {
					alt: title
				});
			}
			node.src = (icon || "").replace("${theme}", dm.currentTheme);
			dm.setupIcon(node, iconPos);
			if(parent && iconPos){
				var arr = iconPos.split(/[ ,]/);
				domStyle.set(parent, {
					width: arr[2] + "px",
					height: arr[3] + "px"
				});
			}
		}
		if(parent){
			parent.appendChild(node);
		}
		return node;
	};

	// flag for iphone flicker workaround
	dm._iw = config["mblIosWorkaround"] !== false && has("iphone");
	if(dm._iw){
		dm._iwBgCover = domConstruct.create("div"); // Cover to hide flicker in the background
	}
	
	if(config.parseOnLoad){
		ready(90, function(){
			// avoid use of query
			/*
			var list = query('[lazy=true] [dojoType]', null);
			list.forEach(function(node, index, nodeList){
				node.setAttribute("__dojoType", node.getAttribute("dojoType"));
				node.removeAttribute("dojoType");
			});
			*/
		
			var nodes = win.body().getElementsByTagName("*");
			var i, len, s;
			len = nodes.length;
			for(i = 0; i < len; i++){
				s = nodes[i].getAttribute("dojoType");
				if(s){
					if(nodes[i].parentNode.getAttribute("lazy") == "true"){
						nodes[i].setAttribute("__dojoType", s);
						nodes[i].removeAttribute("dojoType");
					}
				}
			}
		});
	}
	
	ready(function(){
		dm.detectScreenSize(true);
		if(config["mblApplyPageStyles"] !== false){
			domClass.add(win.doc.documentElement, "mobile");
		}
		if(has("chrome")){
			// dojox.mobile does not load uacss (only _compat does), but we need dj_chrome.
			domClass.add(win.doc.documentElement, "dj_chrome");
		}

		if(config["mblAndroidWorkaround"] !== false && has("android") >= 2.2){ // workaround for android screen flicker problem
			if(config["mblAndroidWorkaroundButtonStyle"] !== false){
				// workaround to avoid buttons disappear due to the side-effect of the webkitTransform workaroud below
				domConstruct.create("style", {innerHTML:"BUTTON,INPUT[type='button'],INPUT[type='submit'],INPUT[type='reset'],INPUT[type='file']::-webkit-file-upload-button{-webkit-appearance:none;}"}, win.doc.head, "first");
			}
			if(has("android") < 3){ // for Android 2.2.x and 2.3.x
				domStyle.set(win.doc.documentElement, "webkitTransform", "translate3d(0,0,0)");
				// workaround for auto-scroll issue when focusing input fields
				connect.connect(null, "onfocus", null, function(e){
					domStyle.set(win.doc.documentElement, "webkitTransform", "");
				});
				connect.connect(null, "onblur", null, function(e){
					domStyle.set(win.doc.documentElement, "webkitTransform", "translate3d(0,0,0)");
				});
			}else{ // for Android 3.x
				if(config["mblAndroid3Workaround"] !== false){
					domStyle.set(win.doc.documentElement, {
						webkitBackfaceVisibility: "hidden",
						webkitPerspective: 8000
					});
				}
			}
		}
	
		//	You can disable hiding the address bar with the following djConfig.
		//	var djConfig = { mblHideAddressBar: false };
		var f = dm.resizeAll;
		if(config["mblHideAddressBar"] !== false &&
			navigator.appVersion.indexOf("Mobile") != -1 ||
			config["mblForceHideAddressBar"] === true){
			dm.hideAddressBar();
			if(config["mblAlwaysHideAddressBar"] === true){
				f = dm.hideAddressBar;
			}
		}
		connect.connect(null, (win.global.onorientationchange !== undefined && !has("android"))
			? "onorientationchange" : "onresize", null, f);
	
		// avoid use of query
		/*
		var list = query('[__dojoType]', null);
		list.forEach(function(node, index, nodeList){
			node.setAttribute("dojoType", node.getAttribute("__dojoType"));
			node.removeAttribute("__dojoType");
		});
		*/
	
		var nodes = win.body().getElementsByTagName("*");
		var i, len = nodes.length, s;
		for(i = 0; i < len; i++){
			s = nodes[i].getAttribute("__dojoType");
			if(s){
				nodes[i].setAttribute("dojoType", s);
				nodes[i].removeAttribute("__dojoType");
			}
		}
	
		if(dojo.hash){
			// find widgets under root recursively
			var findWidgets = function(root){
				if(!root){ return []; }
				var arr = registry.findWidgets(root);
				var widgets = arr;
				for(var i = 0; i < widgets.length; i++){
					arr = arr.concat(findWidgets(widgets[i].containerNode));
				}
				return arr;
			};
			connect.subscribe("/dojo/hashchange", null, function(value){
				var view = dm.currentView;
				if(!view){ return; }
				var params = dm._params;
				if(!params){ // browser back/forward button was pressed
					var moveTo = value ? value : dm._defaultView.id;
					var widgets = findWidgets(view.domNode);
					var dir = 1, transition = "slide";
					for(i = 0; i < widgets.length; i++){
						var w = widgets[i];
						if("#"+moveTo == w.moveTo){
							// found a widget that has the given moveTo
							transition = w.transition;
							dir = (w instanceof dm.Heading) ? -1 : 1;
							break;
						}
					}
					params = [ moveTo, dir, transition ];
				}
				view.performTransition.apply(view, params);
				dm._params = null;
			});
		}
	
		win.body().style.visibility = "visible";
	});

	// To search _parentNode first.  TODO:1.8 reconsider this redefinition.
	registry.getEnclosingWidget = function(node){
		while(node){
			var id = node.getAttribute && node.getAttribute("widgetId");
			if(id){
				return registry.byId(id);
			}
			node = node._parentNode || node.parentNode;
		}
		return null;
	};

	return dm;
});

},
'dojox/rpc/Rest':function(){
define("dojox/rpc/Rest", ["dojo", "dojox"], function(dojo, dojox) {
// Note: This doesn't require dojox.rpc.Service, and if you want it you must require it
// yourself, and you must load it prior to dojox.rpc.Rest.

// summary:
// 		This provides a HTTP REST service with full range REST verbs include PUT,POST, and DELETE.
// description:
// 		A normal GET query is done by using the service directly:
// 		| var restService = dojox.rpc.Rest("Project");
// 		| restService("4");
//		This will do a GET for the URL "/Project/4".
//		| restService.put("4","new content");
//		This will do a PUT to the URL "/Project/4" with the content of "new content".
//		You can also use the SMD service to generate a REST service:
// 		| var services = dojox.rpc.Service({services: {myRestService: {transport: "REST",...
// 		| services.myRestService("parameters");
//
// 		The modifying methods can be called as sub-methods of the rest service method like:
//  	| services.myRestService.put("parameters","data to put in resource");
//  	| services.myRestService.post("parameters","data to post to the resource");
//  	| services.myRestService['delete']("parameters");

  dojo.getObject("rpc.Rest", true, dojox);

	if(dojox.rpc && dojox.rpc.transportRegistry){
		// register it as an RPC service if the registry is available
		dojox.rpc.transportRegistry.register(
			"REST",
			function(str){return str == "REST";},
			{
				getExecutor : function(func,method,svc){
					return new dojox.rpc.Rest(
						method.name,
						(method.contentType||svc._smd.contentType||"").match(/json|javascript/), // isJson
						null,
						function(id, args){
							var request = svc._getRequest(method,[id]);
							request.url= request.target + (request.data ? '?'+  request.data : '');
							if(args && (args.start >= 0 || args.count >= 0)){
								request.headers = request.headers || {};
								request.headers.Range = "items=" + (args.start || '0') + '-' +
									(("count" in args && args.count != Infinity) ?
										(args.count + (args.start || 0) - 1) : '');
							}
							return request;
						}
					);
				}
			}
		);
	}
	var drr;

	function index(deferred, service, range, id){
		deferred.addCallback(function(result){
			if(deferred.ioArgs.xhr && range){
					// try to record the total number of items from the range header
					range = deferred.ioArgs.xhr.getResponseHeader("Content-Range");
					deferred.fullLength = range && (range=range.match(/\/(.*)/)) && parseInt(range[1]);
			}
			return result;
		});
		return deferred;
	}
	drr = dojox.rpc.Rest = function(/*String*/path, /*Boolean?*/isJson, /*Object?*/schema, /*Function?*/getRequest){
		// summary:
		//		Creates a REST service using the provided path.
		var service;
		// it should be in the form /Table/
		service = function(id, args){
			return drr._get(service, id, args);
		};
		service.isJson = isJson;
		service._schema = schema;
		// cache:
		//		This is an object that provides indexing service
		// 		This can be overriden to take advantage of more complex referencing/indexing
		// 		schemes
		service.cache = {
			serialize: isJson ? ((dojox.json && dojox.json.ref) || dojo).toJson : function(result){
				return result;
			}
		};
		// the default XHR args creator:
		service._getRequest = getRequest || function(id, args){
			if(dojo.isObject(id)){
				id = dojo.objectToQuery(id);
				id = id ? "?" + id: "";
			}
			if(args && args.sort && !args.queryStr){
				id += (id ? "&" : "?") + "sort("
				for(var i = 0; i<args.sort.length; i++){
					var sort = args.sort[i];
					id += (i > 0 ? "," : "") + (sort.descending ? '-' : '+') + encodeURIComponent(sort.attribute);
				}
				id += ")";
			}
			var request = {
				url: path + (id == null ? "" : id),
				handleAs: isJson ? 'json' : 'text',
				contentType: isJson ? 'application/json' : 'text/plain',
				sync: dojox.rpc._sync,
				headers: {
					Accept: isJson ? 'application/json,application/javascript' : '*/*'
				}
			};
			if(args && (args.start >= 0 || args.count >= 0)){
				request.headers.Range = "items=" + (args.start || '0') + '-' +
					(("count" in args && args.count != Infinity) ?
						(args.count + (args.start || 0) - 1) : '');
			}
			dojox.rpc._sync = false;
			return request;
		};
		// each calls the event handler
		function makeRest(name){
			service[name] = function(id,content){
				return drr._change(name,service,id,content); // the last parameter is to let the OfflineRest know where to store the item
			};
		}
		makeRest('put');
		makeRest('post');
		makeRest('delete');
		// record the REST services for later lookup
		service.servicePath = path;
		return service;
	};

	drr._index={};// the map of all indexed objects that have gone through REST processing
	drr._timeStamps={};
	// these do the actual requests
	drr._change = function(method,service,id,content){
		// this is called to actually do the put, post, and delete
		var request = service._getRequest(id);
		request[method+"Data"] = content;
		return index(dojo.xhr(method.toUpperCase(),request,true),service);
	};

	drr._get= function(service,id, args){
		args = args || {};
		// this is called to actually do the get
		return index(dojo.xhrGet(service._getRequest(id, args)), service, (args.start >= 0 || args.count >= 0), id);
	};

	return dojox.rpc.Rest;
});

},
'dijit/_WidgetBase':function(){
define("dijit/_WidgetBase", [
	"require",			// require.toUrl
	"dojo/_base/array", // array.forEach array.map
	"dojo/aspect",
	"dojo/_base/config", // config.blankGif
	"dojo/_base/connect", // connect.connect
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.byId
	"dojo/dom-attr", // domAttr.set domAttr.remove
	"dojo/dom-class", // domClass.add domClass.replace
	"dojo/dom-construct", // domConstruct.create domConstruct.destroy domConstruct.place
	"dojo/dom-geometry",	// isBodyLtr
	"dojo/dom-style", // domStyle.set, domStyle.get
	"dojo/_base/kernel",
	"dojo/_base/lang", // mixin(), isArray(), etc.
	"dojo/on",
	"dojo/ready",
	"dojo/Stateful", // Stateful
	"dojo/topic",
	"dojo/_base/window", // win.doc.createTextNode
	"./registry"	// registry.getUniqueId(), registry.findWidgets()
], function(require, array, aspect, config, connect, declare,
			dom, domAttr, domClass, domConstruct, domGeometry, domStyle, kernel,
			lang, on, ready, Stateful, topic, win, registry){

/*=====
var Stateful = dojo.Stateful;
=====*/

// module:
//		dijit/_WidgetBase
// summary:
//		Future base class for all Dijit widgets.

// For back-compat, remove in 2.0.
if(!kernel.isAsync){
	ready(0, function(){
		var requires = ["dijit/_base/manager"];
		require(requires);	// use indirection so modules not rolled into a build
	});
}

// Nested hash listing attributes for each tag, all strings in lowercase.
// ex: {"div": {"style": true, "tabindex" true}, "form": { ...
var tagAttrs = {};
function getAttrs(obj){
	var ret = {};
	for(var attr in obj){
		ret[attr.toLowerCase()] = true;
	}
	return ret;
}

function nonEmptyAttrToDom(attr){
	// summary:
	//		Returns a setter function that copies the attribute to this.domNode,
	//		or removes the attribute from this.domNode, depending on whether the
	//		value is defined or not.
	return function(val){
		domAttr[val ? "set" : "remove"](this.domNode, attr, val);
		this._set(attr, val);
	};
}

return declare("dijit._WidgetBase", Stateful, {
	// summary:
	//		Future base class for all Dijit widgets.
	// description:
	//		Future base class for all Dijit widgets.
	//		_Widget extends this class adding support for various features needed by desktop.
	//
	//		Provides stubs for widget lifecycle methods for subclasses to extend, like postMixInProperties(), buildRendering(),
	//		postCreate(), startup(), and destroy(), and also public API methods like set(), get(), and watch().
	//
	//		Widgets can provide custom setters/getters for widget attributes, which are called automatically by set(name, value).
	//		For an attribute XXX, define methods _setXXXAttr() and/or _getXXXAttr().
	//
	//		_setXXXAttr can also be a string/hash/array mapping from a widget attribute XXX to the widget's DOMNodes:
	//
	//		- DOM node attribute
	// |		_setFocusAttr: {node: "focusNode", type: "attribute"}
	// |		_setFocusAttr: "focusNode"	(shorthand)
	// |		_setFocusAttr: ""		(shorthand, maps to this.domNode)
	// 		Maps this.focus to this.focusNode.focus, or (last example) this.domNode.focus
	//
	//		- DOM node innerHTML
	//	|		_setTitleAttr: { node: "titleNode", type: "innerHTML" }
	//		Maps this.title to this.titleNode.innerHTML
	//
	//		- DOM node innerText
	//	|		_setTitleAttr: { node: "titleNode", type: "innerText" }
	//		Maps this.title to this.titleNode.innerText
	//
	//		- DOM node CSS class
	// |		_setMyClassAttr: { node: "domNode", type: "class" }
	//		Maps this.myClass to this.domNode.className
	//
	//		If the value of _setXXXAttr is an array, then each element in the array matches one of the
	//		formats of the above list.
	//
	//		If the custom setter is null, no action is performed other than saving the new value
	//		in the widget (in this).
	//
	//		If no custom setter is defined for an attribute, then it will be copied
	//		to this.focusNode (if the widget defines a focusNode), or this.domNode otherwise.
	//		That's only done though for attributes that match DOMNode attributes (title,
	//		alt, aria-labelledby, etc.)

	// id: [const] String
	//		A unique, opaque ID string that can be assigned by users or by the
	//		system. If the developer passes an ID which is known not to be
	//		unique, the specified ID is ignored and the system-generated ID is
	//		used instead.
	id: "",
	_setIdAttr: "domNode",	// to copy to this.domNode even for auto-generated id's

	// lang: [const] String
	//		Rarely used.  Overrides the default Dojo locale used to render this widget,
	//		as defined by the [HTML LANG](http://www.w3.org/TR/html401/struct/dirlang.html#adef-lang) attribute.
	//		Value must be among the list of locales specified during by the Dojo bootstrap,
	//		formatted according to [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt) (like en-us).
	lang: "",
	// set on domNode even when there's a focus node.   but don't set lang="", since that's invalid.
	_setLangAttr: nonEmptyAttrToDom("lang"),

	// dir: [const] String
	//		Bi-directional support, as defined by the [HTML DIR](http://www.w3.org/TR/html401/struct/dirlang.html#adef-dir)
	//		attribute. Either left-to-right "ltr" or right-to-left "rtl".  If undefined, widgets renders in page's
	//		default direction.
	dir: "",
	// set on domNode even when there's a focus node.   but don't set dir="", since that's invalid.
	_setDirAttr: nonEmptyAttrToDom("dir"),	// to set on domNode even when there's a focus node

	// textDir: String
	//		Bi-directional support,	the main variable which is responsible for the direction of the text.
	//		The text direction can be different than the GUI direction by using this parameter in creation
	//		of a widget.
	// 		Allowed values:
	//			1. "ltr"
	//			2. "rtl"
	//			3. "auto" - contextual the direction of a text defined by first strong letter.
	//		By default is as the page direction.
	textDir: "",

	// class: String
	//		HTML class attribute
	"class": "",
	_setClassAttr: { node: "domNode", type: "class" },

	// style: String||Object
	//		HTML style attributes as cssText string or name/value hash
	style: "",

	// title: String
	//		HTML title attribute.
	//
	//		For form widgets this specifies a tooltip to display when hovering over
	//		the widget (just like the native HTML title attribute).
	//
	//		For TitlePane or for when this widget is a child of a TabContainer, AccordionContainer,
	//		etc., it's used to specify the tab label, accordion pane title, etc.
	title: "",

	// tooltip: String
	//		When this widget's title attribute is used to for a tab label, accordion pane title, etc.,
	//		this specifies the tooltip to appear when the mouse is hovered over that text.
	tooltip: "",

	// baseClass: [protected] String
	//		Root CSS class of the widget (ex: dijitTextBox), used to construct CSS classes to indicate
	//		widget state.
	baseClass: "",

	// srcNodeRef: [readonly] DomNode
	//		pointer to original DOM node
	srcNodeRef: null,

	// domNode: [readonly] DomNode
	//		This is our visible representation of the widget! Other DOM
	//		Nodes may by assigned to other properties, usually through the
	//		template system's data-dojo-attach-point syntax, but the domNode
	//		property is the canonical "top level" node in widget UI.
	domNode: null,

	// containerNode: [readonly] DomNode
	//		Designates where children of the source DOM node will be placed.
	//		"Children" in this case refers to both DOM nodes and widgets.
	//		For example, for myWidget:
	//
	//		|	<div data-dojo-type=myWidget>
	//		|		<b> here's a plain DOM node
	//		|		<span data-dojo-type=subWidget>and a widget</span>
	//		|		<i> and another plain DOM node </i>
	//		|	</div>
	//
	//		containerNode would point to:
	//
	//		|		<b> here's a plain DOM node
	//		|		<span data-dojo-type=subWidget>and a widget</span>
	//		|		<i> and another plain DOM node </i>
	//
	//		In templated widgets, "containerNode" is set via a
	//		data-dojo-attach-point assignment.
	//
	//		containerNode must be defined for any widget that accepts innerHTML
	//		(like ContentPane or BorderContainer or even Button), and conversely
	//		is null for widgets that don't, like TextBox.
	containerNode: null,

/*=====
	// _started: Boolean
	//		startup() has completed.
	_started: false,
=====*/

	// attributeMap: [protected] Object
	//		Deprecated.   Instead of attributeMap, widget should have a _setXXXAttr attribute
	//		for each XXX attribute to be mapped to the DOM.
	//
	//		attributeMap sets up a "binding" between attributes (aka properties)
	//		of the widget and the widget's DOM.
	//		Changes to widget attributes listed in attributeMap will be
	//		reflected into the DOM.
	//
	//		For example, calling set('title', 'hello')
	//		on a TitlePane will automatically cause the TitlePane's DOM to update
	//		with the new title.
	//
	//		attributeMap is a hash where the key is an attribute of the widget,
	//		and the value reflects a binding to a:
	//
	//		- DOM node attribute
	// |		focus: {node: "focusNode", type: "attribute"}
	// 		Maps this.focus to this.focusNode.focus
	//
	//		- DOM node innerHTML
	//	|		title: { node: "titleNode", type: "innerHTML" }
	//		Maps this.title to this.titleNode.innerHTML
	//
	//		- DOM node innerText
	//	|		title: { node: "titleNode", type: "innerText" }
	//		Maps this.title to this.titleNode.innerText
	//
	//		- DOM node CSS class
	// |		myClass: { node: "domNode", type: "class" }
	//		Maps this.myClass to this.domNode.className
	//
	//		If the value is an array, then each element in the array matches one of the
	//		formats of the above list.
	//
	//		There are also some shorthands for backwards compatibility:
	//		- string --> { node: string, type: "attribute" }, for example:
	//	|	"focusNode" ---> { node: "focusNode", type: "attribute" }
	//		- "" --> { node: "domNode", type: "attribute" }
	attributeMap: {},

	// _blankGif: [protected] String
	//		Path to a blank 1x1 image.
	//		Used by <img> nodes in templates that really get their image via CSS background-image.
	_blankGif: config.blankGif || require.toUrl("dojo/resources/blank.gif"),

	//////////// INITIALIZATION METHODS ///////////////////////////////////////

	postscript: function(/*Object?*/params, /*DomNode|String*/srcNodeRef){
		// summary:
		//		Kicks off widget instantiation.  See create() for details.
		// tags:
		//		private
		this.create(params, srcNodeRef);
	},

	create: function(/*Object?*/params, /*DomNode|String?*/srcNodeRef){
		// summary:
		//		Kick off the life-cycle of a widget
		// params:
		//		Hash of initialization parameters for widget, including
		//		scalar values (like title, duration etc.) and functions,
		//		typically callbacks like onClick.
		// srcNodeRef:
		//		If a srcNodeRef (DOM node) is specified:
		//			- use srcNodeRef.innerHTML as my contents
		//			- if this is a behavioral widget then apply behavior
		//			  to that srcNodeRef
		//			- otherwise, replace srcNodeRef with my generated DOM
		//			  tree
		// description:
		//		Create calls a number of widget methods (postMixInProperties, buildRendering, postCreate,
		//		etc.), some of which of you'll want to override. See http://dojotoolkit.org/reference-guide/dijit/_WidgetBase.html
		//		for a discussion of the widget creation lifecycle.
		//
		//		Of course, adventurous developers could override create entirely, but this should
		//		only be done as a last resort.
		// tags:
		//		private

		// store pointer to original DOM tree
		this.srcNodeRef = dom.byId(srcNodeRef);

		// For garbage collection.  An array of listener handles returned by this.connect() / this.subscribe()
		this._connects = [];

		// For widgets internal to this widget, invisible to calling code
		this._supportingWidgets = [];

		// this is here for back-compat, remove in 2.0 (but check NodeList-instantiate.html test)
		if(this.srcNodeRef && (typeof this.srcNodeRef.id == "string")){ this.id = this.srcNodeRef.id; }

		// mix in our passed parameters
		if(params){
			this.params = params;
			lang.mixin(this, params);
		}
		this.postMixInProperties();

		// generate an id for the widget if one wasn't specified
		// (be sure to do this before buildRendering() because that function might
		// expect the id to be there.)
		if(!this.id){
			this.id = registry.getUniqueId(this.declaredClass.replace(/\./g,"_"));
		}
		registry.add(this);

		this.buildRendering();

		if(this.domNode){
			// Copy attributes listed in attributeMap into the [newly created] DOM for the widget.
			// Also calls custom setters for all attributes with custom setters.
			this._applyAttributes();

			// If srcNodeRef was specified, then swap out original srcNode for this widget's DOM tree.
			// For 2.0, move this after postCreate().  postCreate() shouldn't depend on the
			// widget being attached to the DOM since it isn't when a widget is created programmatically like
			// new MyWidget({}).   See #11635.
			var source = this.srcNodeRef;
			if(source && source.parentNode && this.domNode !== source){
				source.parentNode.replaceChild(this.domNode, source);
			}
		}

		if(this.domNode){
			// Note: for 2.0 may want to rename widgetId to dojo._scopeName + "_widgetId",
			// assuming that dojo._scopeName even exists in 2.0
			this.domNode.setAttribute("widgetId", this.id);
		}
		this.postCreate();

		// If srcNodeRef has been processed and removed from the DOM (e.g. TemplatedWidget) then delete it to allow GC.
		if(this.srcNodeRef && !this.srcNodeRef.parentNode){
			delete this.srcNodeRef;
		}

		this._created = true;
	},

	_applyAttributes: function(){
		// summary:
		//		Step during widget creation to copy  widget attributes to the
		//		DOM according to attributeMap and _setXXXAttr objects, and also to call
		//		custom _setXXXAttr() methods.
		//
		//		Skips over blank/false attribute values, unless they were explicitly specified
		//		as parameters to the widget, since those are the default anyway,
		//		and setting tabIndex="" is different than not setting tabIndex at all.
		//
		//		For backwards-compatibility reasons attributeMap overrides _setXXXAttr when
		//		_setXXXAttr is a hash/string/array, but _setXXXAttr as a functions override attributeMap.
		// tags:
		//		private

		// Get list of attributes where this.set(name, value) will do something beyond
		// setting this[name] = value.  Specifically, attributes that have:
		//		- associated _setXXXAttr() method/hash/string/array
		//		- entries in attributeMap.
		var ctor = this.constructor,
			list = ctor._setterAttrs;
		if(!list){
			list = (ctor._setterAttrs = []);
			for(var attr in this.attributeMap){
				list.push(attr);
			}

			var proto = ctor.prototype;
			for(var fxName in proto){
				if(fxName in this.attributeMap){ continue; }
				var setterName = "_set" + fxName.replace(/^[a-z]|-[a-zA-Z]/g, function(c){ return c.charAt(c.length-1).toUpperCase(); }) + "Attr";
				if(setterName in proto){
					list.push(fxName);
				}
			}
		}

		// Call this.set() for each attribute that was either specified as parameter to constructor,
		// or was found above and has a default non-null value.   For correlated attributes like value and displayedValue, the one
		// specified as a parameter should take precedence, so apply attributes in this.params last.
		// Particularly important for new DateTextBox({displayedValue: ...}) since DateTextBox's default value is
		// NaN and thus is not ignored like a default value of "".
		array.forEach(list, function(attr){
			if(this.params && attr in this.params){
				// skip this one, do it below
			}else if(this[attr]){
				this.set(attr, this[attr]);
			}
		}, this);
		for(var param in this.params){
			this.set(param, this[param]);
		}
	},

	postMixInProperties: function(){
		// summary:
		//		Called after the parameters to the widget have been read-in,
		//		but before the widget template is instantiated. Especially
		//		useful to set properties that are referenced in the widget
		//		template.
		// tags:
		//		protected
	},

	buildRendering: function(){
		// summary:
		//		Construct the UI for this widget, setting this.domNode.
		//		Most widgets will mixin `dijit._TemplatedMixin`, which implements this method.
		// tags:
		//		protected

		if(!this.domNode){
			// Create root node if it wasn't created by _Templated
			this.domNode = this.srcNodeRef || domConstruct.create('div');
		}

		// baseClass is a single class name or occasionally a space-separated list of names.
		// Add those classes to the DOMNode.  If RTL mode then also add with Rtl suffix.
		// TODO: make baseClass custom setter
		if(this.baseClass){
			var classes = this.baseClass.split(" ");
			if(!this.isLeftToRight()){
				classes = classes.concat( array.map(classes, function(name){ return name+"Rtl"; }));
			}
			domClass.add(this.domNode, classes);
		}
	},

	postCreate: function(){
		// summary:
		//		Processing after the DOM fragment is created
		// description:
		//		Called after the DOM fragment has been created, but not necessarily
		//		added to the document.  Do not include any operations which rely on
		//		node dimensions or placement.
		// tags:
		//		protected
	},

	startup: function(){
		// summary:
		//		Processing after the DOM fragment is added to the document
		// description:
		//		Called after a widget and its children have been created and added to the page,
		//		and all related widgets have finished their create() cycle, up through postCreate().
		//		This is useful for composite widgets that need to control or layout sub-widgets.
		//		Many layout widgets can use this as a wiring phase.
		if(this._started){ return; }
		this._started = true;
		array.forEach(this.getChildren(), function(obj){
			if(!obj._started && !obj._destroyed && lang.isFunction(obj.startup)){
				obj.startup();
				obj._started = true;
			}
		});
	},

	//////////// DESTROY FUNCTIONS ////////////////////////////////

	destroyRecursive: function(/*Boolean?*/ preserveDom){
		// summary:
		// 		Destroy this widget and its descendants
		// description:
		//		This is the generic "destructor" function that all widget users
		// 		should call to cleanly discard with a widget. Once a widget is
		// 		destroyed, it is removed from the manager object.
		// preserveDom:
		//		If true, this method will leave the original DOM structure
		//		alone of descendant Widgets. Note: This will NOT work with
		//		dijit._Templated widgets.

		this._beingDestroyed = true;
		this.destroyDescendants(preserveDom);
		this.destroy(preserveDom);
	},

	destroy: function(/*Boolean*/ preserveDom){
		// summary:
		// 		Destroy this widget, but not its descendants.
		//		This method will, however, destroy internal widgets such as those used within a template.
		// preserveDom: Boolean
		//		If true, this method will leave the original DOM structure alone.
		//		Note: This will not yet work with _Templated widgets

		this._beingDestroyed = true;
		this.uninitialize();

		// remove this.connect() and this.subscribe() listeners
		var c;
		while(c = this._connects.pop()){
			c.remove();
		}

		// destroy widgets created as part of template, etc.
		var w;
		while(w = this._supportingWidgets.pop()){
			if(w.destroyRecursive){
				w.destroyRecursive();
			}else if(w.destroy){
				w.destroy();
			}
		}

		this.destroyRendering(preserveDom);
		registry.remove(this.id);
		this._destroyed = true;
	},

	destroyRendering: function(/*Boolean?*/ preserveDom){
		// summary:
		//		Destroys the DOM nodes associated with this widget
		// preserveDom:
		//		If true, this method will leave the original DOM structure alone
		//		during tear-down. Note: this will not work with _Templated
		//		widgets yet.
		// tags:
		//		protected

		if(this.bgIframe){
			this.bgIframe.destroy(preserveDom);
			delete this.bgIframe;
		}

		if(this.domNode){
			if(preserveDom){
				domAttr.remove(this.domNode, "widgetId");
			}else{
				domConstruct.destroy(this.domNode);
			}
			delete this.domNode;
		}

		if(this.srcNodeRef){
			if(!preserveDom){
				domConstruct.destroy(this.srcNodeRef);
			}
			delete this.srcNodeRef;
		}
	},

	destroyDescendants: function(/*Boolean?*/ preserveDom){
		// summary:
		//		Recursively destroy the children of this widget and their
		//		descendants.
		// preserveDom:
		//		If true, the preserveDom attribute is passed to all descendant
		//		widget's .destroy() method. Not for use with _Templated
		//		widgets.

		// get all direct descendants and destroy them recursively
		array.forEach(this.getChildren(), function(widget){
			if(widget.destroyRecursive){
				widget.destroyRecursive(preserveDom);
			}
		});
	},

	uninitialize: function(){
		// summary:
		//		Stub function. Override to implement custom widget tear-down
		//		behavior.
		// tags:
		//		protected
		return false;
	},

	////////////////// GET/SET, CUSTOM SETTERS, ETC. ///////////////////

	_setStyleAttr: function(/*String||Object*/ value){
		// summary:
		//		Sets the style attribute of the widget according to value,
		//		which is either a hash like {height: "5px", width: "3px"}
		//		or a plain string
		// description:
		//		Determines which node to set the style on based on style setting
		//		in attributeMap.
		// tags:
		//		protected

		var mapNode = this.domNode;

		// Note: technically we should revert any style setting made in a previous call
		// to his method, but that's difficult to keep track of.

		if(lang.isObject(value)){
			domStyle.set(mapNode, value);
		}else{
			if(mapNode.style.cssText){
				mapNode.style.cssText += "; " + value;
			}else{
				mapNode.style.cssText = value;
			}
		}

		this._set("style", value);
	},

	_attrToDom: function(/*String*/ attr, /*String*/ value, /*Object?*/ commands){
		// summary:
		//		Reflect a widget attribute (title, tabIndex, duration etc.) to
		//		the widget DOM, as specified by commands parameter.
		//		If commands isn't specified then it's looked up from attributeMap.
		//		Note some attributes like "type"
		//		cannot be processed this way as they are not mutable.
		//
		// tags:
		//		private

		commands = arguments.length >= 3 ? commands : this.attributeMap[attr];

		array.forEach(lang.isArray(commands) ? commands : [commands], function(command){

			// Get target node and what we are doing to that node
			var mapNode = this[command.node || command || "domNode"];	// DOM node
			var type = command.type || "attribute";	// class, innerHTML, innerText, or attribute

			switch(type){
				case "attribute":
					if(lang.isFunction(value)){ // functions execute in the context of the widget
						value = lang.hitch(this, value);
					}

					// Get the name of the DOM node attribute; usually it's the same
					// as the name of the attribute in the widget (attr), but can be overridden.
					// Also maps handler names to lowercase, like onSubmit --> onsubmit
					var attrName = command.attribute ? command.attribute :
						(/^on[A-Z][a-zA-Z]*$/.test(attr) ? attr.toLowerCase() : attr);

					domAttr.set(mapNode, attrName, value);
					break;
				case "innerText":
					mapNode.innerHTML = "";
					mapNode.appendChild(win.doc.createTextNode(value));
					break;
				case "innerHTML":
					mapNode.innerHTML = value;
					break;
				case "class":
					domClass.replace(mapNode, value, this[attr]);
					break;
			}
		}, this);
	},

	get: function(name){
		// summary:
		//		Get a property from a widget.
		//	name:
		//		The property to get.
		// description:
		//		Get a named property from a widget. The property may
		//		potentially be retrieved via a getter method. If no getter is defined, this
		// 		just retrieves the object's property.
		//
		// 		For example, if the widget has properties `foo` and `bar`
		//		and a method named `_getFooAttr()`, calling:
		//		`myWidget.get("foo")` would be equivalent to calling
		//		`widget._getFooAttr()` and `myWidget.get("bar")`
		//		would be equivalent to the expression
		//		`widget.bar2`
		var names = this._getAttrNames(name);
		return this[names.g] ? this[names.g]() : this[name];
	},

	set: function(name, value){
		// summary:
		//		Set a property on a widget
		//	name:
		//		The property to set.
		//	value:
		//		The value to set in the property.
		// description:
		//		Sets named properties on a widget which may potentially be handled by a
		// 		setter in the widget.
		//
		// 		For example, if the widget has properties `foo` and `bar`
		//		and a method named `_setFooAttr()`, calling
		//		`myWidget.set("foo", "Howdy!")` would be equivalent to calling
		//		`widget._setFooAttr("Howdy!")` and `myWidget.set("bar", 3)`
		//		would be equivalent to the statement `widget.bar = 3;`
		//
		//		set() may also be called with a hash of name/value pairs, ex:
		//
		//	|	myWidget.set({
		//	|		foo: "Howdy",
		//	|		bar: 3
		//	|	});
		//
		//	This is equivalent to calling `set(foo, "Howdy")` and `set(bar, 3)`

		if(typeof name === "object"){
			for(var x in name){
				this.set(x, name[x]);
			}
			return this;
		}
		var names = this._getAttrNames(name),
			setter = this[names.s];
		if(lang.isFunction(setter)){
			// use the explicit setter
			var result = setter.apply(this, Array.prototype.slice.call(arguments, 1));
		}else{
			// Mapping from widget attribute to DOMNode attribute/value/etc.
			// Map according to:
			//		1. attributeMap setting, if one exists (TODO: attributeMap deprecated, remove in 2.0)
			//		2. _setFooAttr: {...} type attribute in the widget (if one exists)
			//		3. apply to focusNode or domNode if standard attribute name, excluding funcs like onClick.
			// Checks if an attribute is a "standard attribute" by whether the DOMNode JS object has a similar
			// attribute name (ex: accept-charset attribute matches jsObject.acceptCharset).
			// Note also that Tree.focusNode() is a function not a DOMNode, so test for that.
			var defaultNode = this.focusNode && !lang.isFunction(this.focusNode) ? "focusNode" : "domNode",
				tag = this[defaultNode].tagName,
				attrsForTag = tagAttrs[tag] || (tagAttrs[tag] = getAttrs(this[defaultNode])),
				map =	name in this.attributeMap ? this.attributeMap[name] :
						names.s in this ? this[names.s] :
						((names.l in attrsForTag && typeof value != "function") ||
							/^aria-|^data-|^role$/.test(name)) ? defaultNode : null;
			if(map != null){
				this._attrToDom(name, value, map);
			}
			this._set(name, value);
		}
		return result || this;
	},

	_attrPairNames: {},		// shared between all widgets
	_getAttrNames: function(name){
		// summary:
		//		Helper function for get() and set().
		//		Caches attribute name values so we don't do the string ops every time.
		// tags:
		//		private

		var apn = this._attrPairNames;
		if(apn[name]){ return apn[name]; }
		var uc = name.replace(/^[a-z]|-[a-zA-Z]/g, function(c){ return c.charAt(c.length-1).toUpperCase(); });
		return (apn[name] = {
			n: name+"Node",
			s: "_set"+uc+"Attr",	// converts dashes to camel case, ex: accept-charset --> _setAcceptCharsetAttr
			g: "_get"+uc+"Attr",
			l: uc.toLowerCase()		// lowercase name w/out dashes, ex: acceptcharset
		});
	},

	_set: function(/*String*/ name, /*anything*/ value){
		// summary:
		//		Helper function to set new value for specified attribute, and call handlers
		//		registered with watch() if the value has changed.
		var oldValue = this[name];
		this[name] = value;
		if(this._watchCallbacks && this._created && value !== oldValue){
			this._watchCallbacks(name, oldValue, value);
		}
	},

	on: function(/*String*/ type, /*Function*/ func){
		// summary:
		//		Call specified function when event occurs, ex: myWidget.on("click", function(){ ... }).
		// description:
		//		Call specified function when event `type` occurs, ex: `myWidget.on("click", function(){ ... })`.
		//		Note that the function is not run in any particular scope, so if (for example) you want it to run in the
		//		widget's scope you must do `myWidget.on("click", lang.hitch(myWidget, func))`.

		return aspect.after(this, this._onMap(type), func, true);
	},

	_onMap: function(/*String*/ type){
		// summary:
		//		Maps on() type parameter (ex: "mousemove") to method name (ex: "onMouseMove")
		var ctor = this.constructor, map = ctor._onMap;
		if(!map){
			map = (ctor._onMap = {});
			for(var attr in ctor.prototype){
				if(/^on/.test(attr)){
					map[attr.replace(/^on/, "").toLowerCase()] = attr;
				}
			}
		}
		return map[type.toLowerCase()];	// String
	},

	toString: function(){
		// summary:
		//		Returns a string that represents the widget
		// description:
		//		When a widget is cast to a string, this method will be used to generate the
		//		output. Currently, it does not implement any sort of reversible
		//		serialization.
		return '[Widget ' + this.declaredClass + ', ' + (this.id || 'NO ID') + ']'; // String
	},

	getChildren: function(){
		// summary:
		//		Returns all the widgets contained by this, i.e., all widgets underneath this.containerNode.
		//		Does not return nested widgets, nor widgets that are part of this widget's template.
		return this.containerNode ? registry.findWidgets(this.containerNode) : []; // dijit._Widget[]
	},

	getParent: function(){
		// summary:
		//		Returns the parent widget of this widget
		return registry.getEnclosingWidget(this.domNode.parentNode);
	},

	connect: function(
			/*Object|null*/ obj,
			/*String|Function*/ event,
			/*String|Function*/ method){
		// summary:
		//		Connects specified obj/event to specified method of this object
		//		and registers for disconnect() on widget destroy.
		// description:
		//		Provide widget-specific analog to dojo.connect, except with the
		//		implicit use of this widget as the target object.
		//		Events connected with `this.connect` are disconnected upon
		//		destruction.
		// returns:
		//		A handle that can be passed to `disconnect` in order to disconnect before
		//		the widget is destroyed.
		// example:
		//	|	var btn = new dijit.form.Button();
		//	|	// when foo.bar() is called, call the listener we're going to
		//	|	// provide in the scope of btn
		//	|	btn.connect(foo, "bar", function(){
		//	|		console.debug(this.toString());
		//	|	});
		// tags:
		//		protected

		var handle = connect.connect(obj, event, this, method);
		this._connects.push(handle);
		return handle;		// _Widget.Handle
	},

	disconnect: function(handle){
		// summary:
		//		Disconnects handle created by `connect`.
		//		Also removes handle from this widget's list of connects.
		// tags:
		//		protected
		var i = array.indexOf(this._connects, handle);
		if(i != -1){
			handle.remove();
			this._connects.splice(i, 1);
		}
	},

	subscribe: function(t, method){
		// summary:
		//		Subscribes to the specified topic and calls the specified method
		//		of this object and registers for unsubscribe() on widget destroy.
		// description:
		//		Provide widget-specific analog to dojo.subscribe, except with the
		//		implicit use of this widget as the target object.
		// t: String
		//		The topic
		// method: Function
		//		The callback
		// example:
		//	|	var btn = new dijit.form.Button();
		//	|	// when /my/topic is published, this button changes its label to
		//	|   // be the parameter of the topic.
		//	|	btn.subscribe("/my/topic", function(v){
		//	|		this.set("label", v);
		//	|	});
		// tags:
		//		protected
		var handle = topic.subscribe(t, lang.hitch(this, method));
		this._connects.push(handle);
		return handle;		// _Widget.Handle
	},

	unsubscribe: function(/*Object*/ handle){
		// summary:
		//		Unsubscribes handle created by this.subscribe.
		//		Also removes handle from this widget's list of subscriptions
		// tags:
		//		protected
		this.disconnect(handle);
	},

	isLeftToRight: function(){
		// summary:
		//		Return this widget's explicit or implicit orientation (true for LTR, false for RTL)
		// tags:
		//		protected
		return this.dir ? (this.dir == "ltr") : domGeometry.isBodyLtr(); //Boolean
	},

	isFocusable: function(){
		// summary:
		//		Return true if this widget can currently be focused
		//		and false if not
		return this.focus && (domStyle.get(this.domNode, "display") != "none");
	},

	placeAt: function(/* String|DomNode|_Widget */reference, /* String?|Int? */position){
		// summary:
		//		Place this widget's domNode reference somewhere in the DOM based
		//		on standard domConstruct.place conventions, or passing a Widget reference that
		//		contains and addChild member.
		//
		// description:
		//		A convenience function provided in all _Widgets, providing a simple
		//		shorthand mechanism to put an existing (or newly created) Widget
		//		somewhere in the dom, and allow chaining.
		//
		// reference:
		//		The String id of a domNode, a domNode reference, or a reference to a Widget possessing
		//		an addChild method.
		//
		// position:
		//		If passed a string or domNode reference, the position argument
		//		accepts a string just as domConstruct.place does, one of: "first", "last",
		//		"before", or "after".
		//
		//		If passed a _Widget reference, and that widget reference has an ".addChild" method,
		//		it will be called passing this widget instance into that method, supplying the optional
		//		position index passed.
		//
		// returns:
		//		dijit._Widget
		//		Provides a useful return of the newly created dijit._Widget instance so you
		//		can "chain" this function by instantiating, placing, then saving the return value
		//		to a variable.
		//
		// example:
		// | 	// create a Button with no srcNodeRef, and place it in the body:
		// | 	var button = new dijit.form.Button({ label:"click" }).placeAt(win.body());
		// | 	// now, 'button' is still the widget reference to the newly created button
		// | 	button.on("click", function(e){ console.log('click'); }));
		//
		// example:
		// |	// create a button out of a node with id="src" and append it to id="wrapper":
		// | 	var button = new dijit.form.Button({},"src").placeAt("wrapper");
		//
		// example:
		// |	// place a new button as the first element of some div
		// |	var button = new dijit.form.Button({ label:"click" }).placeAt("wrapper","first");
		//
		// example:
		// |	// create a contentpane and add it to a TabContainer
		// |	var tc = dijit.byId("myTabs");
		// |	new dijit.layout.ContentPane({ href:"foo.html", title:"Wow!" }).placeAt(tc)

		if(reference.declaredClass && reference.addChild){
			reference.addChild(this, position);
		}else{
			domConstruct.place(this.domNode, reference, position);
		}
		return this;
	},

	getTextDir: function(/*String*/ text,/*String*/ originalDir){
		// summary:
		//		Return direction of the text.
		//		The function overridden in the _BidiSupport module,
		//		its main purpose is to calculate the direction of the
		//		text, if was defined by the programmer through textDir.
		//	tags:
		//		protected.
		return originalDir;
	},

	applyTextDir: function(/*===== element, text =====*/){
		// summary:
		//		The function overridden in the _BidiSupport module,
		//		originally used for setting element.dir according to this.textDir.
		//		In this case does nothing.
		// element: DOMNode
		// text: String
		// tags:
		//		protected.
	}
});

});

},
'dijit/form/Form':function(){
define("dijit/form/Form", [
	"dojo/_base/declare", // declare
	"dojo/dom-attr", // domAttr.set
	"dojo/_base/event", // event.stop
	"dojo/_base/kernel", // kernel.deprecated
	"dojo/_base/sniff", // has("ie")
	"../_Widget",
	"../_TemplatedMixin",
	"./_FormMixin",
	"../layout/_ContentPaneResizeMixin"
], function(declare, domAttr, event, kernel, has, _Widget, _TemplatedMixin, _FormMixin, _ContentPaneResizeMixin){

/*=====
	var _Widget = dijit._Widget;
	var _TemplatedMixin = dijit._TemplatedMixin;
	var _FormMixin = dijit.form._FormMixin;
	var _ContentPaneResizeMixin = dijit.layout._ContentPaneResizeMixin;
=====*/

	// module:
	//		dijit/form/Form
	// summary:
	//		Widget corresponding to HTML form tag, for validation and serialization


	return declare("dijit.form.Form", [_Widget, _TemplatedMixin, _FormMixin, _ContentPaneResizeMixin], {
		// summary:
		//		Widget corresponding to HTML form tag, for validation and serialization
		//
		// example:
		//	|	<form data-dojo-type="dijit.form.Form" id="myForm">
		//	|		Name: <input type="text" name="name" />
		//	|	</form>
		//	|	myObj = {name: "John Doe"};
		//	|	dijit.byId('myForm').set('value', myObj);
		//	|
		//	|	myObj=dijit.byId('myForm').get('value');

		// HTML <FORM> attributes

		// name: String?
		//		Name of form for scripting.
		name: "",

		// action: String?
		//		Server-side form handler.
		action: "",

		// method: String?
		//		HTTP method used to submit the form, either "GET" or "POST".
		method: "",

		// encType: String?
		//		Encoding type for the form, ex: application/x-www-form-urlencoded.
		encType: "",

		// accept-charset: String?
		//		List of supported charsets.
		"accept-charset": "",

		// accept: String?
		//		List of MIME types for file upload.
		accept: "",

		// target: String?
		//		Target frame for the document to be opened in.
		target: "",

		templateString: "<form data-dojo-attach-point='containerNode' data-dojo-attach-event='onreset:_onReset,onsubmit:_onSubmit' ${!nameAttrSetting}></form>",

		postMixInProperties: function(){
			// Setup name=foo string to be referenced from the template (but only if a name has been specified)
			// Unfortunately we can't use _setNameAttr to set the name due to IE limitations, see #8660
			this.nameAttrSetting = this.name ? ("name='" + this.name + "'") : "";
			this.inherited(arguments);
		},

		execute: function(/*Object*/ /*===== formContents =====*/){
			// summary:
			//		Deprecated: use submit()
			// tags:
			//		deprecated
		},

		onExecute: function(){
			// summary:
			//		Deprecated: use onSubmit()
			// tags:
			//		deprecated
		},

		_setEncTypeAttr: function(/*String*/ value){
			this.encType = value;
			domAttr.set(this.domNode, "encType", value);
			if(has("ie")){ this.domNode.encoding = value; }
		},

		reset: function(/*Event?*/ e){
			// summary:
			//		restores all widget values back to their init values,
			//		calls onReset() which can cancel the reset by returning false

			// create fake event so we can know if preventDefault() is called
			var faux = {
				returnValue: true, // the IE way
				preventDefault: function(){ // not IE
							this.returnValue = false;
						},
				stopPropagation: function(){},
				currentTarget: e ? e.target : this.domNode,
				target: e ? e.target : this.domNode
			};
			// if return value is not exactly false, and haven't called preventDefault(), then reset
			if(!(this.onReset(faux) === false) && faux.returnValue){
				this.inherited(arguments, []);
			}
		},

		onReset: function(/*Event?*/ /*===== e =====*/){
			// summary:
			//		Callback when user resets the form. This method is intended
			//		to be over-ridden. When the `reset` method is called
			//		programmatically, the return value from `onReset` is used
			//		to compute whether or not resetting should proceed
			// tags:
			//		callback
			return true; // Boolean
		},

		_onReset: function(e){
			this.reset(e);
			event.stop(e);
			return false;
		},

		_onSubmit: function(e){
			var fp = this.constructor.prototype;
			// TODO: remove this if statement beginning with 2.0
			if(this.execute != fp.execute || this.onExecute != fp.onExecute){
				kernel.deprecated("dijit.form.Form:execute()/onExecute() are deprecated. Use onSubmit() instead.", "", "2.0");
				this.onExecute();
				this.execute(this.getValues());
			}
			if(this.onSubmit(e) === false){ // only exactly false stops submit
				event.stop(e);
			}
		},

		onSubmit: function(/*Event?*/ /*===== e =====*/){
			// summary:
			//		Callback when user submits the form.
			// description:
			//		This method is intended to be over-ridden, but by default it checks and
			//		returns the validity of form elements. When the `submit`
			//		method is called programmatically, the return value from
			//		`onSubmit` is used to compute whether or not submission
			//		should proceed
			// tags:
			//		extension

			return this.isValid(); // Boolean
		},

		submit: function(){
			// summary:
			//		programmatically submit form if and only if the `onSubmit` returns true
			if(!(this.onSubmit() === false)){
				this.containerNode.submit();
			}
		}
	});
});

},
'versa/api/PropertyDefinitions':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 04/11/11
 * Time: 10:11 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/PropertyDefinitions", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/PropertyDefinition"],
    function(declare){
        var o=declare("versa.api.PropertyDefinitions", [versa.api._Collection], {
            library: null,

            constructor: function(args){
                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.PropertyDefinitions.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.PropertyDefinition.schema;
                this.cache = true;

                this._initialize();
            },

            fetchByDbName: function(dbName){
                var _item = null;

                function  __onComplete(items, request){
                    dojo.some(items, function(item){
                        if(item.getDbName() == dbName){
                            _item = item;
                            return false;
                        }
                    }, this);
                }

                this.store.fetch({
                    query:{},
                    queryOptions:{cache: true},
                    onComplete: __onComplete
                });

                return _item;
            },

            getNameProperty: function(){
                var name_propdef = null;

                this.forEach(function(item){
                    if(item.is_name)
                        name_propdef = item;
                }, this);

                return name_propdef;
            }
        });

        o.TRGT = '/zones/{0}/libraries/{1}/property_definitions';

        return o;
    }
);


},
'dojox/mobile/_ItemBase':function(){
define("dojox/mobile/_ItemBase", [
	"dojo/_base/kernel",
	"dojo/_base/config",
	"dojo/_base/declare",
	"dijit/registry",	// registry.getEnclosingWidget
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./TransitionEvent",
	"./View"
], function(kernel, config, declare, registry, Contained, Container, WidgetBase, TransitionEvent, View){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
	var TransitionEvent = dojox.mobile.TransitionEvent;
	var View = dojox.mobile.View;
=====*/

	// module:
	//		dojox/mobile/_ItemBase
	// summary:
	//		A base class for item classes (e.g. ListItem, IconItem, etc.)

	return declare("dojox.mobile._ItemBase", [WidgetBase, Container, Contained],{
		// summary:
		//		A base class for item classes (e.g. ListItem, IconItem, etc.)
		// description:
		//		_ItemBase is a base class for widgets that have capability to
		//		make a view transition when clicked.

		// icon: String
		//		An icon image to display. The value can be either a path for an
		//		image file or a class name of a DOM button. If icon is not
		//		specified, the iconBase parameter of the parent widget is used.
		icon: "",

		// iconPos: String
		//		The position of an aggregated icon. IconPos is comma separated
		//		values like top,left,width,height (ex. "0,0,29,29"). If iconPos
		//		is not specified, the iconPos parameter of the parent widget is
		//		used.
		iconPos: "", // top,left,width,height (ex. "0,0,29,29")

		// alt: String
		//		An alt text for the icon image.
		alt: "",

		// href: String
		//		A URL of another web page to go to.
		href: "",

		// hrefTarget: String
		//		A target that specifies where to open a page specified by
		//		href. The value will be passed to the 2nd argument of
		//		window.open().
		hrefTarget: "",

		// moveTo: String
		//		The id of the transition destination view which resides in the
		//		current page.
		//
		//		If the value has a hash sign ('#') before the id (e.g. #view1)
		//		and the dojo.hash module is loaded by the user application, the
		//		view transition updates the hash in the browser URL so that the
		//		user can bookmark the destination view. In this case, the user
		//		can also use the browser's back/forward button to navigate
		//		through the views in the browser history.
		//
		//		If null, transitions to a blank view.
		//		If '#', returns immediately without transition.
		moveTo: "",

		// scene: String
		//		The name of a scene. Used from dojox.mobile.app.
		scene: "",

		// clickable: Boolean
		//		If true, this item becomes clickable even if a transition
		//		destination (moveTo, etc.) is not specified.
		clickable: false,

		// url: String
		//		A URL of an html fragment page or JSON data that represents a
		//		new view content. The view content is loaded with XHR and
		//		inserted in the current page. Then a view transition occurs to
		//		the newly created view. The view is cached so that subsequent
		//		requests would not load the content again.
		url: "",

		// urlTarget: String
		//		Node id under which a new view will be created according to the
		//		url parameter. If not specified, The new view will be created as
		//		a sibling of the current view.
		urlTarget: "",

		// transition: String
		//		A type of animated transition effect. You can choose from the
		//		standard transition types, "slide", "fade", "flip", or from the
		//		extended transition types, "cover", "coverv", "dissolve",
		//		"reveal", "revealv", "scaleIn", "scaleOut", "slidev",
		//		"swirl", "zoomIn", "zoomOut". If "none" is specified, transition
		//		occurs immediately without animation.
		transition: "",

		// transitionDir: Number
		//		The transition direction. If 1, transition forward. If -1,
		//		transition backward. For example, the slide transition slides
		//		the view from right to left when dir == 1, and from left to
		//		right when dir == -1.
		transitionDir: 1,

		// transitionOptions: Object
		//		A hash object that holds transition options.
		transitionOptions: null,

		// callback: Function|String
		//		A callback function that is called when the transition has been
		//		finished. A function reference, or name of a function in
		//		context.
		callback: null,

		// sync: Boolean
		//		If true, XHR for the view content specified with the url
		//		parameter is performed synchronously. If false, it is done
		//		asynchronously and the progress indicator is displayed while
		//		loading the content. This parameter is effective only when the
		//		url parameter is used.
		sync: true,

		// label: String
		//		A label of the item. If the label is not specified, innerHTML is
		//		used as a label.
		label: "",

		// toggle: Boolean
		//		If true, the item acts like a toggle button.
		toggle: false,

		// _duration: Number
		//		Duration of selection, milliseconds.
		_duration: 800,

	
		inheritParams: function(){
			var parent = this.getParent();
			if(parent){
				if(!this.transition){ this.transition = parent.transition; }
				if(this.icon && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon = parent.iconBase + this.icon;
				}
				if(!this.icon){ this.icon = parent.iconBase; }
				if(!this.iconPos){ this.iconPos = parent.iconPos; }
			}
		},
	
		select: function(){
			// summary:
			//		Makes this widget in the selected state.
			// description:
			//		Subclass must implement.
		},
	
		deselect: function(){
			// summary:
			//		Makes this widget in the deselected state.
			// description:
			//		Subclass must implement.
		},
	
		defaultClickAction: function(e){
			if(this.toggle){
				if(this.selected){
					this.deselect();
				}else{
					this.select();
				}
			}else if(!this.selected){
				this.select();
				if(!this.selectOne){
					var _this = this;
					setTimeout(function(){
						_this.deselect();
					}, this._duration);
				}
				var transOpts;
				if(this.moveTo || this.href || this.url || this.scene){
					transOpts = {moveTo: this.moveTo, href: this.href, url: this.url, scene: this.scene, transition: this.transition, transitionDir: this.transitionDir};
				}else if(this.transitionOptions){
					transOpts = this.transitionOptions;
				}	
				if(transOpts){
					return new TransitionEvent(this.domNode,transOpts,e).dispatch();
				}
			}
		},
	
		getParent: function(){
			// summary:
			//		Gets the parent widget.
			// description:
			//		Almost equivalent to _Contained#getParent, but this method
			//		does not cause a script error even if this widget has no
			//		parent yet.
			var ref = this.srcNodeRef || this.domNode;
			return ref && ref.parentNode ? registry.getEnclosingWidget(ref.parentNode) : null;
		},

		setTransitionPos: function(e){
			// summary:
			//		Stores the clicked position for later use.
			// description:
			//		Some of the transition animations (e.g. ScaleIn) needs the
			//		clicked position.
			var w = this;
			while(true){
				w = w.getParent();
				if(!w || w instanceof View){ break; }
			}
			if(w){
				w.clickedPosX = e.clientX;
				w.clickedPosY = e.clientY;
			}
		},

		transitionTo: function(moveTo, href, url, scene){
			// summary:
			//		Performs a view transition.
			// description:
			//		Given a transition destination, this method performs a view
			//		transition. This method is typically called when this item
			//		is clicked.
			if(config.isDebug){
				var alreadyCalledHash = arguments.callee._ach || (arguments.callee._ach = {}),
					caller = (arguments.callee.caller || "unknown caller").toString();
				if(!alreadyCalledHash[caller]){
					kernel.deprecated(this.declaredClass + "::transitionTo() is deprecated." +
					caller, "", "2.0");
					alreadyCalledHash[caller] = true;
				}
			}
			new TransitionEvent(this.domNode, {moveTo: moveTo, href: href, url: url, scene: scene,
						transition: this.transition, transitionDir: this.transitionDir}).dispatch();
		}
	});
});

},
'versa/api/Versions':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 19/09/11
 * Time: 1:14 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Versions", ["dojo/_base/declare",
         "versa/api/_Collection",
         "versa/api/Version"],
    function(declare){
        var o=declare("versa.api.Versions", [versa.api._Collection], {
            zone: null,
            library: null,
            document: null,

            constructor: function(args){
                this.zone = args.zone;
                this.library = args.library;
                this.document = args.document;
                this.target = dojo.replace(versa.api.Versions.TRGT, [this.zone.subdomain, this.library.id, this.document.getId()]);
                this.schema = versa.api.Version.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.TRGT = '/zones/{0}/libraries/{1}/documents/{2}/versions';

        return o;
    }
);


},
'versa/api/User':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 08/09/11
 * Time: 12:00 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/User", ["dojo/_base/declare",
        "dojo/date/stamp",
        "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.User", [versa.api._Object], {
            email: null,
            first_name: null,
            last_name: null,
            group: null,
            reset_password: null,

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            getAvatarUrl: function(args){
              return dojo.replace(versa.api.User.AVT_TRGT , [args.zone.subdomain, this.id]);
            },

            getFullName: function(){

                var fullName = (this.last_name == null) ? '' : this.last_name;

                if((this.first_name != null) && (this.first_name != '')){
                    fullName += (fullName == '') ? this.first_name : ', ' + this.first_name;
                }

                return (fullName.length < 1) ? this.name : fullName;
            },

            isValid: function(){
                var isValid = true;

                if (String.isEmpty(this.name)) {
                    isValid = false;
                    //throw new Error('User\'s \'Name\' is empty or invalid');
                }

                if(this.name.length<4){
                    isValid = false;
                }

                if(this.name.indexOf(' ')>=0){
                    isValid = false;
                }

                if(!versa.api.Utilities.validateEmail(this.email)){
                    isValid=false;
                }

                if(this.password){
                    if(String.isEmpty(this.password) || (this.password.length < 8)){
                        isValid = false;
                    }
                }

                /*
                if(this.isNew()){
                    if(String.isEmpty(this.password) || (this.password.length < 8)){
                        isValid = false;
                    }
                }else{
                    if(!)
                    if(!(!password||password==null||password==""||password.length==0)){
                        if(password.length>0&&password.length<8){
                            isValid=false;
                        }
                    }
                }
                */

                if(String.isEmpty(this.email)){
                    isValid=false;
                }

                return isValid;
            }
        });

        o.AVT_TRGT = '/zones/{0}/users/{1}/avatar';

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'email': {
                    type: 'string',
                    'default': ''
                },
                'first_name': {
                    type: 'string',
                    'default': ''
                },
                'last_name': {
                    type: 'string',
                    'default': ''
                },
                'password': {
                    type: 'string',
                    'default': ''
                },
                'active_group':{
                    type: 'integer',
                    'default': 0
                },
                'created_at': {
                    type: 'string',
                    format: 'date-time',
                    'default': dojo.date.stamp.toISOString(new Date(), {zulu: true})
                },
                'created_by': {
                    type: 'string',
                    'default': ''
                },
                'updated_at': {
                    type: 'string',
                    format: 'date-time',
                    'default': dojo.date.stamp.toISOString(new Date(), {zulu: true})
                },
                'updated_by': {
                    type: 'string',
                    'default': ''
                }

            },
            prototype: new o()
        };

        return o;
    }
);


},
'versa/api/_Securable':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 19/10/11
 * Time: 9:58 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/_Securable", ["dojo/_base/declare",
        "versa/api/XhrHelper"],
    function(declare){
        var o=declare("versa.api._Securable", [], {
            securable_type: null,
            active_permissions: 0x00000000,

            constructor: function(args){

            },

            hasRights: function(permissionFlag){
                return ((this.active_permissions & permissionFlag) == permissionFlag);
            },

            hasRole: function(role){
                return this.hasRights(role.permissions);
            },

            getAcl: function(zone){
                var url = dojo.replace(versa.api._Securable.GETACL_URL, [zone.subdomain, this.id, this.securable_type] );
                var getData = null;

                var results = versa.api.XhrHelper.doGetAction({
                    target: url,
                    getData: getData
                });

                return new versa.api.Acl(results);
            },

            setAcl: function(zone, acl){
                var url = dojo.replace(versa.api._Securable.SETACL_URL, [zone.subdomain, this.id, this.securable_type]);
                var data = acl;

                return versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: data
                });


            }
        });

        o.types = {
            'Library': 'Library',
            'Folder': 'Folder',
            'Document': 'Document',
            'Reference': 'Reference'
        }

        o.permissions = {
            'NONE':             0x00000000,
            'VIEW':             0x00000001,
            'READ_METADATA':    0x00000002,
            'WRITE_METADATA':   0x00000004,
            'VERSION':          0x00000008,
            'CREATE_DOCUMENTS': 0x00000010,
            'CREATE_FOLDERS':   0x00000020,
            'CREATE_VIEWS':     0x00000040,
            'DELETE_ITEMS':     0x00000080,
            'READ_ACL':         0x00000100,
            'WRITE_ACL':        0x00000200,
            'ADMIN':            0x7FFFFFF
        }


        o.GETACL_URL = '/zones/{0}/acls/{1}.json?securable_type={2}';
        o.SETACL_URL = '/zones/{0}/acls/{1}.json?securable_type={2}';

        return o;
    }
);


},
'dojox/mobile/EdgeToEdgeList':function(){
define("dojox/mobile/EdgeToEdgeList", [
	"dojo/_base/declare",
	"./RoundRectList"
], function(declare, RoundRectList){

/*=====
	var RoundRectList = dojox.mobile.RoundRectList;
=====*/

	// module:
	//		dojox/mobile/EdgeToEdgeCategory
	// summary:
	//		An edge-to-edge layout list.

	return declare("dojox.mobile.EdgeToEdgeList", RoundRectList, {
		// summary:
		//		An edge-to-edge layout list.
		// description:
		//		EdgeToEdgeList is an edge-to-edge layout list, which displays
		//		all items in equally sized rows. Each item must be
		//		dojox.mobile.ListItem.

		buildRendering: function(){
			this.inherited(arguments);
			this.domNode.className = "mblEdgeToEdgeList";
		}
	});
});

},
'dojo/regexp':function(){
define("dojo/regexp", ["./_base/kernel", "./_base/lang"], function(dojo, lang) {
	// module:
	//		dojo/regexp
	// summary:
	//		TODOC

lang.getObject("regexp", true, dojo);

/*=====
dojo.regexp = {
	// summary: Regular expressions and Builder resources
};
=====*/

dojo.regexp.escapeString = function(/*String*/str, /*String?*/except){
	//	summary:
	//		Adds escape sequences for special characters in regular expressions
	// except:
	//		a String with special characters to be left unescaped

	return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function(ch){
		if(except && except.indexOf(ch) != -1){
			return ch;
		}
		return "\\" + ch;
	}); // String
};

dojo.regexp.buildGroupRE = function(/*Object|Array*/arr, /*Function*/re, /*Boolean?*/nonCapture){
	//	summary:
	//		Builds a regular expression that groups subexpressions
	//	description:
	//		A utility function used by some of the RE generators. The
	//		subexpressions are constructed by the function, re, in the second
	//		parameter.  re builds one subexpression for each elem in the array
	//		a, in the first parameter. Returns a string for a regular
	//		expression that groups all the subexpressions.
	// arr:
	//		A single value or an array of values.
	// re:
	//		A function. Takes one parameter and converts it to a regular
	//		expression.
	// nonCapture:
	//		If true, uses non-capturing match, otherwise matches are retained
	//		by regular expression. Defaults to false

	// case 1: a is a single value.
	if(!(arr instanceof Array)){
		return re(arr); // String
	}

	// case 2: a is an array
	var b = [];
	for(var i = 0; i < arr.length; i++){
		// convert each elem to a RE
		b.push(re(arr[i]));
	}

	 // join the REs as alternatives in a RE group.
	return dojo.regexp.group(b.join("|"), nonCapture); // String
};

dojo.regexp.group = function(/*String*/expression, /*Boolean?*/nonCapture){
	// summary:
	//		adds group match to expression
	// nonCapture:
	//		If true, uses non-capturing match, otherwise matches are retained
	//		by regular expression.
	return "(" + (nonCapture ? "?:":"") + expression + ")"; // String
};

return dojo.regexp;
});

},
'versa/widget/search/mobile/SearchView':function(){
require(["dojo/_base/declare",
         "dijit/_WidgetBase",
         "dojox/mobile/Heading",
         "dojox/mobile/ScrollableView",
         "dojox/mobile/EdgeToEdgeDataList",
         "dojox/mobile/ToolBarButton",
         "dojox/mobile/ContentPane",
         "versa/api/Folders",
         "versa/api/Documents",
         "versa/api/Zones",
         "dojo/data/ItemFileWriteStore",
         "dojo/date/locale"],
    function(declare){
        declare("versa.widget.search.mobile.SearchView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
            header: null,
            cpContent: null,

            constructor: function(args){
            },

            _setBackAttr: function(back){
                this.back=back;
                if(this.header){
                    this.header.set('back', back)
                }
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.header=new versa.widget.mobile.Heading({
                    label: "Search",
                    from: this,
                    back: this.back,
                    backTransition: "slidev",
                    onCommand: this.onCommand
                });

                this.footer=new versa.widget.mobile.Footing({
                    showSearch: false,
                    onCommand: this.onCommand,
                    from: this
                });

                this.cpContent=new dojox.mobile.ContentPane({
                    content: dojo.cache("versa.widget.search.mobile", "template/SearchView.html", "<div style=\"width: 100%; height: 100%; text-align: center;\">\n    <input id=\"searchField\"   data-dojo-type=\"versa.widget.mobile.TextBox\"/>\n    <button id=\"searchButton\" data-dojo-type=\"dojox.mobile.Button\">Search</button>\n</div>\n"),
                    parseOnLoad: true
                });

                this.searchField=dijit.byId('searchField');
                this.searchButton=dijit.byId('searchButton');
                dojo.connect(this.searchButton, 'onClick', dojo.hitch(this, function(){
                    this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.PERFORM_SEARCH, {search: this.searchField.get('value')});
                }));

                this.addChild(this.cpContent);
                this.addChild(this.footer);
                this.addChild(this.header);
            },



            startup: function(){
                this.inherited('startup', arguments);
            }
        });
    }
);


},
'versa/api/ViewDefinition':function(){
/**
 * @author Scott
 */
define("versa/api/ViewDefinition", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/Error",
        "versa/api/Formatter"],
    function(declare){
        var o=declare("versa.api.ViewDefinition", [versa.api._Object], {
            _view: null,

            constructor: function(/* Object */args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            _generate: function(library){

                var view = {
                    name: this.name,
                    id: this.getId(),
                    sort_column: 1,
                    cells: []
                };

                dojo.forEach(this.cell_definitions, function(item, idx){

                    var cell = {
                        field: dojo.replace('{table_name}.{column_name}', item),
                        name: String.isBlank(item.label) ? '&nbsp;': item.label,
                        width: item.width,
                        noresize: item.noresize,
                        style: item.style,
                        date_format: item.date_format
                    }

                    cell.get = this._generateGetFn(item, library);
                    cell.formatter = this._generateFormatterFn(item);

                    view.cells.push(cell);

                    if(cell.field == this.sort_by)
                        view.sort_column = (this.is_desc) ? ((idx + 1) * -1) : (idx + 1);

                }, this);

                return view;

            },

            _generateFormatterFn: function(cell_definition){
                var fn = versa.api.CellDefinition.formatData;
                if(cell_definition.column_name.indexOf('prp_bln')>=0){
                    fn=versa.api.CellDefinition.formatBoolean
                }
                switch(cell_definition.formatter){
                    case versa.api.CellDefinition.formats.icon:
                        fn = versa.api.CellDefinition.formatIcon;
                        break;
                    case versa.api.CellDefinition.formats.size:
                        fn = versa.api.CellDefinition.formatSize;
                        break;
                    case versa.api.CellDefinition.formats.status:
                        fn = versa.api.CellDefinition.formatStatus;
                        break;
                }

                return fn;
            },

            _generateGetFn: function(cell_definition, library){
                var fn = null

                switch(cell_definition.table_name){
                    case 'versions':
                        fn = dojo.hitch([this, cell_definition], versa.api.ViewDefinition._getVersionAttrFn);
                        break;
                    case 'documents':
                        fn = dojo.hitch([this, cell_definition], versa.api.ViewDefinition._getDocumentAttrFn);
                        break;
                    case 'document_types':
                        fn = dojo.hitch([this, cell_definition, library], versa.api.ViewDefinition._getDocumentTypeAttrFn);
                        break;
                }

                return fn;
            },

            _formatDateTime: function(cellDef, datetime){
                return versa.api.Formatter.formatDateTime(datetime);
            },

            getCellByField: function(field){
                var cell = null;

                dojo.some(this.cell_definitions, function(cell_definition, idx){
                    if(versa.api.CellDefinition.getDbName(cell_definition) == field)
                        cell = cell_definition;
                    return (cell);
                }, this);

                return cell;
            },

            getView: function(library){

                /*
                if(!this._view){
                    this._view = this._generate(library);
                }

                return this._view;
                */
                return this._generate(library);
            },

            isValid: function(){
                var isValid = true;

                if (String.isEmpty(this.name.trim())) {
                    isValid = false;
                }

                if (String.isEmpty(this.sort_by)){
                    isValid = false;
                }

                return isValid;
            },

            findColumn: function(table, column){
                for(var i=0;i<this.cell_definitions.length;i++){
                    //turn into method
                    if(this.cell_definitions[i].table_name&&
                       this.cell_definitions[i].column_name&&
                       table==this.cell_definitions[i].table_name&&
                       column==this.cell_definitions[i].column_name){
                        return this.cell_definitions[i];
                    }
                }
                return null;
            }
        });

        o.getCustomName = function(user, folder){
            return dojo.replace('{0}.{1}', [user.name, folder.name]);
        };

        o._getDocumentAttrFn =  function(rowIndex, item){
            var value = '';
            var viewDef = this[0];
            var cellDef = this[1];

            if(!item)
                return value;

            var column = cellDef.column_name

            switch(column){
                case 'created_at':
                case 'updated_at':
                    value = viewDef._formatDateTime(cellDef, item[column]);
                    break;
                default:
                    if (/prp_dtt/.test(column) && item[column]) {
                        value = viewDef._formatDateTime(cellDef, item[column]);
                    }
                    else {
                        value = item[column];
                    }
                    break;
            }

            return value;
        };

        o._getDocumentTypeAttrFn = function(rowIndex, item){
            var value = '';

            var viewDef = this[0];
            var cellDef = this[1];
            var activeLibrary = this[2];

            if((!item))
                return value;

            switch(cellDef.column_name){
                case 'name':
                    value = item.document_type_name;
                    break;
            }

            return value;
        };

        o._getVersionAttrFn = function(rowIndex, item){
            var value = null;
            var viewDef = this[0];
            var cellDef = this[1];

            if(!item)
                return value;

            try{
                switch(cellDef.column_name){
                    case 'binary_content_type':
                        value = item.binary_content_type
                        break;
                    case 'version_number':
                        value = item.major_version_number;
                        break;
                    case 'binary_file_size':
                        value = item.binary_file_size;
                        break;
                }
            }
            catch(e){
                console.log(e);
            }
            return (!value) ? '' : value;
        };


        o.compare=function(viewA, viewB){

            if((!viewA) && (viewB))
                return -1;
            if((viewA) && (!viewB))
                return 1;
            if((!viewA) && (!viewB))
                return 0;

            if((!viewA.name) && (viewB.name))
                return -1;
            if((viewA.name) && (!viewB.name))
                return 1;
            if((!viewA.name) && (!viewB.name))
                return 0;

            if(viewA.name.toLowerCase() == viewB.name.toLowerCase()){
                return 0;
            }

            return (viewA.name.toLowerCase() < viewB.name.toLowerCase()) ? -1 : 1;
        };

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string'
                },
                'description': {
                    type: 'string'
                },
                'is_desc': {
                    type: 'boolean',
                    'default': false
                },
                'is_template': {
                    type: 'boolean',
                    'default': false
                },
                'scope': {
                    type: 'string',
                    'default': '*'
                },
                'sort_by': {
                    type: 'string'
                },
                'cell_definitions': {
                    type: 'array',
                    'default': [],
                    'items': {
                        type: 'object',
                        properties: {
                            'table_name': {
                                type: 'string'
                            },
                            'column_name': {
                                type: 'string'
                            },
                            'name': {
                                type: 'string'
                            },
                            'label': {
                                type: 'string'
                            },
                            'column_order': {
                                type: 'integer'
                            },
                            'formatter': {
                                type: 'integer'
                            },
                            'date_format': {
                                type: 'string'
                            },
                            'width': {
                                type: 'string'
                            }
                        }
                    }
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string',
                    'default': ''
                },
                'updated_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'updated_by': {
                    type: 'string',
                    'default': ''
                }
            },
            prototype: o.prototype
        };

        return o;
    }
);



},
'dijit/form/_FormMixin':function(){
define("dijit/form/_FormMixin", [
	"dojo/_base/array", // array.every array.filter array.forEach array.indexOf array.map
	"dojo/_base/declare", // declare
	"dojo/_base/kernel", // kernel.deprecated
	"dojo/_base/lang", // lang.hitch lang.isArray
	"dojo/window" // winUtils.scrollIntoView
], function(array, declare, kernel, lang, winUtils){

	// module:
	//		dijit/form/_FormMixin
	// summary:
	//		Mixin for containers of form widgets (i.e. widgets that represent a single value
	//		and can be children of a <form> node or dijit.form.Form widget)

	return declare("dijit.form._FormMixin", null, {
		// summary:
		//		Mixin for containers of form widgets (i.e. widgets that represent a single value
		//		and can be children of a <form> node or dijit.form.Form widget)
		// description:
		//		Can extract all the form widgets
		//		values and combine them into a single javascript object, or alternately
		//		take such an object and set the values for all the contained
		//		form widgets

	/*=====
		// value: Object
		//		Name/value hash for each child widget with a name and value.
		//		Child widgets without names are not part of the hash.
		//
		//		If there are multiple child widgets w/the same name, value is an array,
		//		unless they are radio buttons in which case value is a scalar (since only
		//		one radio button can be checked at a time).
		//
		//		If a child widget's name is a dot separated list (like a.b.c.d), it's a nested structure.
		//
		//		Example:
		//	|	{ name: "John Smith", interests: ["sports", "movies"] }
	=====*/

		// state: [readonly] String
		//		Will be "Error" if one or more of the child widgets has an invalid value,
		//		"Incomplete" if not all of the required child widgets are filled in.  Otherwise, "",
		//		which indicates that the form is ready to be submitted.
		state: "",

		//	TODO:
		//	* Repeater
		//	* better handling for arrays.  Often form elements have names with [] like
		//	* people[3].sex (for a list of people [{name: Bill, sex: M}, ...])
		//
		//

		_getDescendantFormWidgets: function(/*dijit._WidgetBase[]?*/ children){
			// summary:
			//		Returns all form widget descendants, searching through non-form child widgets like BorderContainer
			var res = [];
			array.forEach(children || this.getChildren(), function(child){
				if("value" in child){
					res.push(child);
				}else{
					res = res.concat(this._getDescendantFormWidgets(child.getChildren()));
				}
			}, this);
			return res;
		},

		reset: function(){
			array.forEach(this._getDescendantFormWidgets(), function(widget){
				if(widget.reset){
					widget.reset();
				}
			});
		},

		validate: function(){
			// summary:
			//		returns if the form is valid - same as isValid - but
			//		provides a few additional (ui-specific) features.
			//		1 - it will highlight any sub-widgets that are not
			//			valid
			//		2 - it will call focus() on the first invalid
			//			sub-widget
			var didFocus = false;
			return array.every(array.map(this._getDescendantFormWidgets(), function(widget){
				// Need to set this so that "required" widgets get their
				// state set.
				widget._hasBeenBlurred = true;
				var valid = widget.disabled || !widget.validate || widget.validate();
				if(!valid && !didFocus){
					// Set focus of the first non-valid widget
					winUtils.scrollIntoView(widget.containerNode || widget.domNode);
					widget.focus();
					didFocus = true;
				}
	 			return valid;
	 		}), function(item){ return item; });
		},

		setValues: function(val){
			kernel.deprecated(this.declaredClass+"::setValues() is deprecated. Use set('value', val) instead.", "", "2.0");
			return this.set('value', val);
		},
		_setValueAttr: function(/*Object*/ obj){
			// summary:
			//		Fill in form values from according to an Object (in the format returned by get('value'))

			// generate map from name --> [list of widgets with that name]
			var map = { };
			array.forEach(this._getDescendantFormWidgets(), function(widget){
				if(!widget.name){ return; }
				var entry = map[widget.name] || (map[widget.name] = [] );
				entry.push(widget);
			});

			for(var name in map){
				if(!map.hasOwnProperty(name)){
					continue;
				}
				var widgets = map[name],						// array of widgets w/this name
					values = lang.getObject(name, false, obj);	// list of values for those widgets

				if(values === undefined){
					continue;
				}
				if(!lang.isArray(values)){
					values = [ values ];
				}
				if(typeof widgets[0].checked == 'boolean'){
					// for checkbox/radio, values is a list of which widgets should be checked
					array.forEach(widgets, function(w){
						w.set('value', array.indexOf(values, w.value) != -1);
					});
				}else if(widgets[0].multiple){
					// it takes an array (e.g. multi-select)
					widgets[0].set('value', values);
				}else{
					// otherwise, values is a list of values to be assigned sequentially to each widget
					array.forEach(widgets, function(w, i){
						w.set('value', values[i]);
					});
				}
			}

			/***
			 * 	TODO: code for plain input boxes (this shouldn't run for inputs that are part of widgets)

			array.forEach(this.containerNode.elements, function(element){
				if(element.name == ''){return};	// like "continue"
				var namePath = element.name.split(".");
				var myObj=obj;
				var name=namePath[namePath.length-1];
				for(var j=1,len2=namePath.length;j<len2;++j){
					var p=namePath[j - 1];
					// repeater support block
					var nameA=p.split("[");
					if(nameA.length > 1){
						if(typeof(myObj[nameA[0]]) == "undefined"){
							myObj[nameA[0]]=[ ];
						} // if

						nameIndex=parseInt(nameA[1]);
						if(typeof(myObj[nameA[0]][nameIndex]) == "undefined"){
							myObj[nameA[0]][nameIndex] = { };
						}
						myObj=myObj[nameA[0]][nameIndex];
						continue;
					} // repeater support ends

					if(typeof(myObj[p]) == "undefined"){
						myObj=undefined;
						break;
					};
					myObj=myObj[p];
				}

				if(typeof(myObj) == "undefined"){
					return;		// like "continue"
				}
				if(typeof(myObj[name]) == "undefined" && this.ignoreNullValues){
					return;		// like "continue"
				}

				// TODO: widget values (just call set('value', ...) on the widget)

				// TODO: maybe should call dojo.getNodeProp() instead
				switch(element.type){
					case "checkbox":
						element.checked = (name in myObj) &&
							array.some(myObj[name], function(val){ return val == element.value; });
						break;
					case "radio":
						element.checked = (name in myObj) && myObj[name] == element.value;
						break;
					case "select-multiple":
						element.selectedIndex=-1;
						array.forEach(element.options, function(option){
							option.selected = array.some(myObj[name], function(val){ return option.value == val; });
						});
						break;
					case "select-one":
						element.selectedIndex="0";
						array.forEach(element.options, function(option){
							option.selected = option.value == myObj[name];
						});
						break;
					case "hidden":
					case "text":
					case "textarea":
					case "password":
						element.value = myObj[name] || "";
						break;
				}
	  		});
	  		*/

			// Note: no need to call this._set("value", ...) as the child updates will trigger onChange events
			// which I am monitoring.
		},

		getValues: function(){
			kernel.deprecated(this.declaredClass+"::getValues() is deprecated. Use get('value') instead.", "", "2.0");
			return this.get('value');
		},
		_getValueAttr: function(){
			// summary:
			// 		Returns Object representing form values.   See description of `value` for details.
			// description:

			// The value is updated into this.value every time a child has an onChange event,
			// so in the common case this function could just return this.value.   However,
			// that wouldn't work when:
			//
			// 1. User presses return key to submit a form.  That doesn't fire an onchange event,
			// and even if it did it would come too late due to the setTimeout(..., 0) in _handleOnChange()
			//
			// 2. app for some reason calls this.get("value") while the user is typing into a
			// form field.   Not sure if that case needs to be supported or not.

			// get widget values
			var obj = { };
			array.forEach(this._getDescendantFormWidgets(), function(widget){
				var name = widget.name;
				if(!name || widget.disabled){ return; }

				// Single value widget (checkbox, radio, or plain <input> type widget)
				var value = widget.get('value');

				// Store widget's value(s) as a scalar, except for checkboxes which are automatically arrays
				if(typeof widget.checked == 'boolean'){
					if(/Radio/.test(widget.declaredClass)){
						// radio button
						if(value !== false){
							lang.setObject(name, value, obj);
						}else{
							// give radio widgets a default of null
							value = lang.getObject(name, false, obj);
							if(value === undefined){
								lang.setObject(name, null, obj);
							}
						}
					}else{
						// checkbox/toggle button
						var ary=lang.getObject(name, false, obj);
						if(!ary){
							ary=[];
							lang.setObject(name, ary, obj);
						}
						if(value !== false){
							ary.push(value);
						}
					}
				}else{
					var prev=lang.getObject(name, false, obj);
					if(typeof prev != "undefined"){
						if(lang.isArray(prev)){
							prev.push(value);
						}else{
							lang.setObject(name, [prev, value], obj);
						}
					}else{
						// unique name
						lang.setObject(name, value, obj);
					}
				}
			});

			/***
			 * code for plain input boxes (see also domForm.formToObject, can we use that instead of this code?
			 * but it doesn't understand [] notation, presumably)
			var obj = { };
			array.forEach(this.containerNode.elements, function(elm){
				if(!elm.name)	{
					return;		// like "continue"
				}
				var namePath = elm.name.split(".");
				var myObj=obj;
				var name=namePath[namePath.length-1];
				for(var j=1,len2=namePath.length;j<len2;++j){
					var nameIndex = null;
					var p=namePath[j - 1];
					var nameA=p.split("[");
					if(nameA.length > 1){
						if(typeof(myObj[nameA[0]]) == "undefined"){
							myObj[nameA[0]]=[ ];
						} // if
						nameIndex=parseInt(nameA[1]);
						if(typeof(myObj[nameA[0]][nameIndex]) == "undefined"){
							myObj[nameA[0]][nameIndex] = { };
						}
					}else if(typeof(myObj[nameA[0]]) == "undefined"){
						myObj[nameA[0]] = { }
					} // if

					if(nameA.length == 1){
						myObj=myObj[nameA[0]];
					}else{
						myObj=myObj[nameA[0]][nameIndex];
					} // if
				} // for

				if((elm.type != "select-multiple" && elm.type != "checkbox" && elm.type != "radio") || (elm.type == "radio" && elm.checked)){
					if(name == name.split("[")[0]){
						myObj[name]=elm.value;
					}else{
						// can not set value when there is no name
					}
				}else if(elm.type == "checkbox" && elm.checked){
					if(typeof(myObj[name]) == 'undefined'){
						myObj[name]=[ ];
					}
					myObj[name].push(elm.value);
				}else if(elm.type == "select-multiple"){
					if(typeof(myObj[name]) == 'undefined'){
						myObj[name]=[ ];
					}
					for(var jdx=0,len3=elm.options.length; jdx<len3; ++jdx){
						if(elm.options[jdx].selected){
							myObj[name].push(elm.options[jdx].value);
						}
					}
				} // if
				name=undefined;
			}); // forEach
			***/
			return obj;
		},

	 	isValid: function(){
	 		// summary:
	 		//		Returns true if all of the widgets are valid.
			//		Deprecated, will be removed in 2.0.  Use get("state") instead.

			return this.state == "";
		},

		onValidStateChange: function(/*Boolean*/ /*===== isValid =====*/){
			// summary:
			//		Stub function to connect to if you want to do something
			//		(like disable/enable a submit button) when the valid
			//		state changes on the form as a whole.
			//
			//		Deprecated.  Will be removed in 2.0.  Use watch("state", ...) instead.
		},

		_getState: function(){
			// summary:
			//		Compute what this.state should be based on state of children
			var states = array.map(this._descendants, function(w){
				return w.get("state") || "";
			});

			return array.indexOf(states, "Error") >= 0 ? "Error" :
				array.indexOf(states, "Incomplete") >= 0 ? "Incomplete" : "";
		},

		disconnectChildren: function(){
			// summary:
			//		Remove connections to monitor changes to children's value, error state, and disabled state,
			//		in order to update Form.value and Form.state.
			array.forEach(this._childConnections || [], lang.hitch(this, "disconnect"));
			array.forEach(this._childWatches || [], function(w){ w.unwatch(); });
		},

		connectChildren: function(/*Boolean*/ inStartup){
			// summary:
			//		Setup connections to monitor changes to children's value, error state, and disabled state,
			//		in order to update Form.value and Form.state.
			//
			//		You can call this function directly, ex. in the event that you
			//		programmatically add a widget to the form *after* the form has been
			//		initialized.

			var _this = this;

			// Remove old connections, if any
			this.disconnectChildren();

			this._descendants = this._getDescendantFormWidgets();

			// (Re)set this.value and this.state.   Send watch() notifications but not on startup.
			var set = inStartup ? function(name, val){ _this[name] = val; } : lang.hitch(this, "_set");
			set("value", this.get("value"));
			set("state", this._getState());

			// Monitor changes to error state and disabled state in order to update
			// Form.state
			var conns = (this._childConnections = []),
				watches = (this._childWatches = []);
			array.forEach(array.filter(this._descendants,
				function(item){ return item.validate; }
			),
			function(widget){
				// We are interested in whenever the widget changes validity state - or
				// whenever the disabled attribute on that widget is changed.
				array.forEach(["state", "disabled"], function(attr){
					watches.push(widget.watch(attr, function(){
						_this.set("state", _this._getState());
					}));
				});
			});

			// And monitor calls to child.onChange so we can update this.value
			var onChange = function(){
				// summary:
				//		Called when child's value or disabled state changes

				// Use setTimeout() to collapse value changes in multiple children into a single
				// update to my value.   Multiple updates will occur on:
				//	1. Form.set()
				//	2. Form.reset()
				//	3. user selecting a radio button (which will de-select another radio button,
				//		 causing two onChange events)
				if(_this._onChangeDelayTimer){
					clearTimeout(_this._onChangeDelayTimer);
				}
				_this._onChangeDelayTimer = setTimeout(function(){
					delete _this._onChangeDelayTimer;
					_this._set("value", _this.get("value"));
				}, 10);
			};
			array.forEach(
				array.filter(this._descendants, function(item){ return item.onChange; } ),
				function(widget){
					// When a child widget's value changes,
					// the efficient thing to do is to just update that one attribute in this.value,
					// but that gets a little complicated when a checkbox is checked/unchecked
					// since this.value["checkboxName"] contains an array of all the checkboxes w/the same name.
					// Doing simple thing for now.
					conns.push(_this.connect(widget, "onChange", onChange));

					// Disabling/enabling a child widget should remove it's value from this.value.
					// Again, this code could be more efficient, doing simple thing for now.
					watches.push(widget.watch("disabled", onChange));
				}
			);
		},

		startup: function(){
			this.inherited(arguments);

			// Initialize value and valid/invalid state tracking.  Needs to be done in startup()
			// so that children are initialized.
			this.connectChildren(true);

			// Make state change call onValidStateChange(), will be removed in 2.0
			this.watch("state", function(attr, oldVal, newVal){ this.onValidStateChange(newVal == ""); });
		},

		destroy: function(){
			this.disconnectChildren();
			this.inherited(arguments);
		}

	});
});

},
'dojo/data/util/simpleFetch':function(){
define("dojo/data/util/simpleFetch", ["dojo/_base/lang", "dojo/_base/window", "./sorter"], 
  function(lang, winUtil, sorter) {
	// module:
	//		dojo/data/util/simpleFetch
	// summary:
	//		TODOC

var simpleFetch = lang.getObject("dojo.data.util.simpleFetch", true);

simpleFetch.fetch = function(/* Object? */ request){
	//	summary:
	//		The simpleFetch mixin is designed to serve as a set of function(s) that can
	//		be mixed into other datastore implementations to accelerate their development.
	//		The simpleFetch mixin should work well for any datastore that can respond to a _fetchItems()
	//		call by returning an array of all the found items that matched the query.  The simpleFetch mixin
	//		is not designed to work for datastores that respond to a fetch() call by incrementally
	//		loading items, or sequentially loading partial batches of the result
	//		set.  For datastores that mixin simpleFetch, simpleFetch
	//		implements a fetch method that automatically handles eight of the fetch()
	//		arguments -- onBegin, onItem, onComplete, onError, start, count, sort and scope
	//		The class mixing in simpleFetch should not implement fetch(),
	//		but should instead implement a _fetchItems() method.  The _fetchItems()
	//		method takes three arguments, the keywordArgs object that was passed
	//		to fetch(), a callback function to be called when the result array is
	//		available, and an error callback to be called if something goes wrong.
	//		The _fetchItems() method should ignore any keywordArgs parameters for
	//		start, count, onBegin, onItem, onComplete, onError, sort, and scope.
	//		The _fetchItems() method needs to correctly handle any other keywordArgs
	//		parameters, including the query parameter and any optional parameters
	//		(such as includeChildren).  The _fetchItems() method should create an array of
	//		result items and pass it to the fetchHandler along with the original request object
	//		-- or, the _fetchItems() method may, if it wants to, create an new request object
	//		with other specifics about the request that are specific to the datastore and pass
	//		that as the request object to the handler.
	//
	//		For more information on this specific function, see dojo.data.api.Read.fetch()
	request = request || {};
	if(!request.store){
		request.store = this;
	}
	var self = this;

	var _errorHandler = function(errorData, requestObject){
		if(requestObject.onError){
			var scope = requestObject.scope || winUtil.global;
			requestObject.onError.call(scope, errorData, requestObject);
		}
	};

	var _fetchHandler = function(items, requestObject){
		var oldAbortFunction = requestObject.abort || null;
		var aborted = false;

		var startIndex = requestObject.start?requestObject.start:0;
		var endIndex = (requestObject.count && (requestObject.count !== Infinity))?(startIndex + requestObject.count):items.length;

		requestObject.abort = function(){
			aborted = true;
			if(oldAbortFunction){
				oldAbortFunction.call(requestObject);
			}
		};

		var scope = requestObject.scope || winUtil.global;
		if(!requestObject.store){
			requestObject.store = self;
		}
		if(requestObject.onBegin){
			requestObject.onBegin.call(scope, items.length, requestObject);
		}
		if(requestObject.sort){
			items.sort(sorter.createSortFunction(requestObject.sort, self));
		}
		if(requestObject.onItem){
			for(var i = startIndex; (i < items.length) && (i < endIndex); ++i){
				var item = items[i];
				if(!aborted){
					requestObject.onItem.call(scope, item, requestObject);
				}
			}
		}
		if(requestObject.onComplete && !aborted){
			var subset = null;
			if(!requestObject.onItem){
				subset = items.slice(startIndex, endIndex);
			}
			requestObject.onComplete.call(scope, subset, requestObject);
		}
	};
	this._fetchItems(request, _fetchHandler, _errorHandler);
	return request;	// Object
};

return simpleFetch;
});

},
'dojox/mobile/ProgressIndicator':function(){
define("dojox/mobile/ProgressIndicator", [
	"dojo/_base/config",
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/has"
], function(config, declare, domConstruct, domStyle, has){

	// module:
	//		dojox/mobile/ProgressIndicator
	// summary:
	//		A progress indication widget.

	var cls = declare("dojox.mobile.ProgressIndicator", null, {
		// summary:
		//		A progress indication widget.
		// description:
		//		ProgressIndicator is a round spinning graphical representation
		//		that indicates the current task is on-going.

		// interval: Number
		//		The time interval in milliseconds for updating the spinning
		//		indicator.
		interval: 100,

		// colors: Array
		//		An array of indicator colors.
		colors: [
			"#C0C0C0", "#C0C0C0", "#C0C0C0", "#C0C0C0",
			"#C0C0C0", "#C0C0C0", "#B8B9B8", "#AEAFAE",
			"#A4A5A4", "#9A9A9A", "#8E8E8E", "#838383"
		],

		constructor: function(){
			this._bars = [];
			this.domNode = domConstruct.create("DIV");
			this.domNode.className = "mblProgContainer";
			if(config["mblAndroidWorkaround"] !== false && has("android") >= 2.2 && has("android") < 3){
				// workaround to avoid the side effects of the fixes for android screen flicker problem
				domStyle.set(this.domNode, "webkitTransform", "translate3d(0,0,0)");
			}
			this.spinnerNode = domConstruct.create("DIV", null, this.domNode);
			for(var i = 0; i < this.colors.length; i++){
				var div = domConstruct.create("DIV", {className:"mblProg mblProg"+i}, this.spinnerNode);
				this._bars.push(div);
			}
		},
	
		start: function(){
			// summary:
			//		Starts the ProgressIndicator spinning.
			if(this.imageNode){
				var img = this.imageNode;
				var l = Math.round((this.domNode.offsetWidth - img.offsetWidth) / 2);
				var t = Math.round((this.domNode.offsetHeight - img.offsetHeight) / 2);
				img.style.margin = t+"px "+l+"px";
				return;
			}
			var cntr = 0;
			var _this = this;
			var n = this.colors.length;
			this.timer = setInterval(function(){
				cntr--;
				cntr = cntr < 0 ? n - 1 : cntr;
				var c = _this.colors;
				for(var i = 0; i < n; i++){
					var idx = (cntr + i) % n;
					_this._bars[i].style.backgroundColor = c[idx];
				}
			}, this.interval);
		},
	
		stop: function(){
			// summary:
			//		Stops the ProgressIndicator spinning.
			if(this.timer){
				clearInterval(this.timer);
			}
			this.timer = null;
			if(this.domNode.parentNode){
				this.domNode.parentNode.removeChild(this.domNode);
			}
		},

		setImage: function(/*String*/file){
			// summary:
			//		Sets an indicator icon image file (typically animated GIF).
			//		If null is specified, restores the default spinner.
			if(file){
				this.imageNode = domConstruct.create("IMG", {src:file}, this.domNode);
				this.spinnerNode.style.display = "none";
			}else{
				if(this.imageNode){
					this.domNode.removeChild(this.imageNode);
					this.imageNode = null;
				}
				this.spinnerNode.style.display = "";
			}
		}
	});

	cls._instance = null;
	cls.getInstance = function(){
		if(!cls._instance){
			cls._instance = new cls();
		}
		return cls._instance;
	};

	return cls;
});

},
'versa/api/Folders':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 24/10/11
 * Time: 9:58 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Folders", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Folder",
        "versa/api/Utilities"],
    function(declare){
         var o=declare("versa.api.Folders", [versa.api._Collection], {
            library: null,

            _getExistingNames: function(parentItem){

                var names = [];

                if((parentItem) && (parentItem.children)){
                    dojo.forEach(parentItem.children, function(folderItem){
                        names.push(folderItem.name);
                    });
                }

                return names;
            },

            /*
            _isUpdateable: function(request){
                return false;
                if(request.query.hasOwnProperty('parent_id'))
                    return true;

                return typeof request.query == "object";
            },
            */

            constructor: function(args){

                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.Folders.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.Folder.schema;
                this.cache = true;

                this._initialize();
                //this.store.isUpdateable  = dojo.hitch(this, this._isUpdateable);
            },

            generateUniqueName: function(args){
                var names = this._getExistingNames(args.parent);
                var baseName = args.base_name;

                return versa.api.Utilities.generateUniqueName({
                    names: names,
                    base_name: baseName
                });
            },

            getTextPath: function(args){
                var item=args.item;

                if(item.parent_id){
                    var parent=this.fetchById({id: item.parent_id});
                    return this.getTextPath({item: parent})+'/'+item.name;
                }else{
                    return '/'+item.name
                }
        //        return this.name;
            }
        });

        o.TRGT = '/zones/{0}/libraries/{1}/folders';

        o.generateUniqueName = function(args){
            var parentItem = args.folder;
            var names = [];

            dojo.forEach(parentItem.children, function(folderItem){
                names.push(folderItem.name);
            });

            return versa.api.Utilities.generateUniqueName({
                names: names,
                base_name: args.base_name
            });

        };

        return o;
    }
);


},
'versa/api/XhrHelper':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/09/11
 * Time: 5:06 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Class to wrap DOJO AJAX calls
 * @classDecription Class to wrap DOJO AJAX calls, specifically handling success/error conditions
 * @author ScottH
 * @version 1.1
 * @since 1.0
 */
define("versa/api/XhrHelper", ["dojo/_base/declare",
        "dojox/json/ref",
        "versa/api/Error"],
    function(declare){
        var o=declare("versa.api.XhrHelper", [], {});

        o._doXhrAction = function(xhrFn, args){
            var rsp = null;
            var err =  null;

            function _onComplete(response, ioArgs){
                rsp = response;
            }
            function _onError(response, ioArgs){
                err = new versa.api.Error(response.responseText, response);
            }

            args.contentType = 'application/json';
            args.handleAs = 'json';
            args.sync = true;
            args.load = _onComplete;
            args.error = _onError;

            xhrFn(args);

            if (err != null)
                throw err; //new Error(err.message);

            return rsp;
        };

        /**
         * Performs a XHR GET AJAX call
         * @param {Object} args Consisting of:
         *     target {String}: the URL to request data from
         *     getData {Object}:  data to be passed to server
         * @return {Object} response from server
         * @author ScottH
         * @version 1.1
         * @since 1.0
         * @memberOf versa.api.XhrHelper (Static)
         */
        o.doGetAction = function(args){

            var getDataJson = (args.getData) ? dojo.toJson(args.getData) : null;

            var xhrArgs = {
                url: args.target,
                content: getDataJson
            };

            return versa.api.XhrHelper._doXhrAction(dojo.xhrGet, xhrArgs);

        };

        o.doPostAction = function(args){

            var postData = args.postData;
            var postDataJson = dojo.toJson(postData);

            var xhrArgs = {
                url: args.target,
                postData: postDataJson
            };

            return versa.api.XhrHelper._doXhrAction(dojo.xhrPost, xhrArgs);
        };

        o.doPutAction = function(args){

            var putData = args.putData;
            var putDataJson = dojo.toJson(putData);

            var xhrArgs = {
                url: args.target,
                putData: putDataJson
            }

            return versa.api.XhrHelper._doXhrAction(dojo.xhrPut, xhrArgs);

        };

        o.authenticity_token = null;
        o.originalXhr = dojo.xhr;
        dojo.xhr = function(httpVerb, xhrArgs, hasHTTPBody){

            if(versa.api.XhrHelper.authenticity_token !=  null){
                if(httpVerb.toUpperCase() == 'POST'){
                    var postData = (xhrArgs.postData) ? dojo.fromJson(xhrArgs.postData) : {};
                    postData['authenticity_token'] = versa.api.XhrHelper.authenticity_token;
                    xhrArgs.postData = dojo.toJson(postData);
                }
                if(httpVerb.toUpperCase() == 'PUT'){
                    var putData = (xhrArgs.putData) ? dojo.fromJson(xhrArgs.putData) : {};
                    putData['authenticity_token'] = versa.api.XhrHelper.authenticity_token;
                    xhrArgs.putData = dojo.toJson(putData);
                }
                if(httpVerb.toUpperCase() == 'DELETE'){
                    xhrArgs.rawBody = dojo.toJson({ authenticity_token: versa.api.XhrHelper.authenticity_token});
                }
            }

            //fix for Opera: doesn't allow 'Range' to be set for xhr.setRequestHeader: crazy?
            if((xhrArgs.headers) && xhrArgs.headers.hasOwnProperty('Range')){
                xhrArgs.headers['dojo-Range'] = xhrArgs.headers['Range'];
            }

            return versa.api.XhrHelper.originalXhr(httpVerb, xhrArgs, hasHTTPBody);
        };

        return o;
    }
);


},
'dijit/layout/utils':function(){
define("dijit/layout/utils", [
	"dojo/_base/array", // array.filter array.forEach
	"dojo/dom-class", // domClass.add domClass.remove
	"dojo/dom-geometry", // domGeometry.marginBox
	"dojo/dom-style", // domStyle.getComputedStyle
	"dojo/_base/lang", // lang.mixin
	".."	// for exporting symbols to dijit, remove in 2.0
], function(array, domClass, domGeometry, domStyle, lang, dijit){

	// module:
	//		dijit/layout/utils
	// summary:
	//		marginBox2contentBox() and layoutChildren()

	var layout = lang.getObject("layout", true, dijit);
	/*===== layout = dijit.layout =====*/

	layout.marginBox2contentBox = function(/*DomNode*/ node, /*Object*/ mb){
		// summary:
		//		Given the margin-box size of a node, return its content box size.
		//		Functions like domGeometry.contentBox() but is more reliable since it doesn't have
		//		to wait for the browser to compute sizes.
		var cs = domStyle.getComputedStyle(node);
		var me = domGeometry.getMarginExtents(node, cs);
		var pb = domGeometry.getPadBorderExtents(node, cs);
		return {
			l: domStyle.toPixelValue(node, cs.paddingLeft),
			t: domStyle.toPixelValue(node, cs.paddingTop),
			w: mb.w - (me.w + pb.w),
			h: mb.h - (me.h + pb.h)
		};
	};

	function capitalize(word){
		return word.substring(0,1).toUpperCase() + word.substring(1);
	}

	function size(widget, dim){
		// size the child
		var newSize = widget.resize ? widget.resize(dim) : domGeometry.setMarginBox(widget.domNode, dim);

		// record child's size
		if(newSize){
			// if the child returned it's new size then use that
			lang.mixin(widget, newSize);
		}else{
			// otherwise, call getMarginBox(), but favor our own numbers when we have them.
			// the browser lies sometimes
			lang.mixin(widget, domGeometry.getMarginBox(widget.domNode));
			lang.mixin(widget, dim);
		}
	}

	layout.layoutChildren = function(/*DomNode*/ container, /*Object*/ dim, /*Widget[]*/ children,
			/*String?*/ changedRegionId, /*Number?*/ changedRegionSize){
		// summary:
		//		Layout a bunch of child dom nodes within a parent dom node
		// container:
		//		parent node
		// dim:
		//		{l, t, w, h} object specifying dimensions of container into which to place children
		// children:
		//		an array of Widgets or at least objects containing:
		//			* domNode: pointer to DOM node to position
		//			* region or layoutAlign: position to place DOM node
		//			* resize(): (optional) method to set size of node
		//			* id: (optional) Id of widgets, referenced from resize object, below.
		// changedRegionId:
		//		If specified, the slider for the region with the specified id has been dragged, and thus
		//		the region's height or width should be adjusted according to changedRegionSize
		// changedRegionSize:
		//		See changedRegionId.

		// copy dim because we are going to modify it
		dim = lang.mixin({}, dim);

		domClass.add(container, "dijitLayoutContainer");

		// Move "client" elements to the end of the array for layout.  a11y dictates that the author
		// needs to be able to put them in the document in tab-order, but this algorithm requires that
		// client be last.    TODO: move these lines to LayoutContainer?   Unneeded other places I think.
		children = array.filter(children, function(item){ return item.region != "center" && item.layoutAlign != "client"; })
			.concat(array.filter(children, function(item){ return item.region == "center" || item.layoutAlign == "client"; }));

		// set positions/sizes
		array.forEach(children, function(child){
			var elm = child.domNode,
				pos = (child.region || child.layoutAlign);
			if(!pos){
				throw new Error("No region setting for " + child.id)
			}

			// set elem to upper left corner of unused space; may move it later
			var elmStyle = elm.style;
			elmStyle.left = dim.l+"px";
			elmStyle.top = dim.t+"px";
			elmStyle.position = "absolute";

			domClass.add(elm, "dijitAlign" + capitalize(pos));

			// Size adjustments to make to this child widget
			var sizeSetting = {};

			// Check for optional size adjustment due to splitter drag (height adjustment for top/bottom align
			// panes and width adjustment for left/right align panes.
			if(changedRegionId && changedRegionId == child.id){
				sizeSetting[child.region == "top" || child.region == "bottom" ? "h" : "w"] = changedRegionSize;
			}

			// set size && adjust record of remaining space.
			// note that setting the width of a <div> may affect its height.
			if(pos == "top" || pos == "bottom"){
				sizeSetting.w = dim.w;
				size(child, sizeSetting);
				dim.h -= child.h;
				if(pos == "top"){
					dim.t += child.h;
				}else{
					elmStyle.top = dim.t + dim.h + "px";
				}
			}else if(pos == "left" || pos == "right"){
				sizeSetting.h = dim.h;
				size(child, sizeSetting);
				dim.w -= child.w;
				if(pos == "left"){
					dim.l += child.w;
				}else{
					elmStyle.left = dim.l + dim.w + "px";
				}
			}else if(pos == "client" || pos == "center"){
				size(child, dim);
			}
		});
	};


	return {
		marginBox2contentBox: layout.marginBox2contentBox,
		layoutChildren: layout.layoutChildren
	};
});

},
'dijit/_Contained':function(){
define("dijit/_Contained", [
	"dojo/_base/declare", // declare
	"./registry"	// registry.getEnclosingWidget(), registry.byNode()
], function(declare, registry){

	// module:
	//		dijit/_Contained
	// summary:
	//		Mixin for widgets that are children of a container widget

	return declare("dijit._Contained", null, {
		// summary:
		//		Mixin for widgets that are children of a container widget
		//
		// example:
		// | 	// make a basic custom widget that knows about it's parents
		// |	declare("my.customClass",[dijit._Widget,dijit._Contained],{});

		_getSibling: function(/*String*/ which){
			// summary:
			//      Returns next or previous sibling
			// which:
			//      Either "next" or "previous"
			// tags:
			//      private
			var node = this.domNode;
			do{
				node = node[which+"Sibling"];
			}while(node && node.nodeType != 1);
			return node && registry.byNode(node);	// dijit._Widget
		},

		getPreviousSibling: function(){
			// summary:
			//		Returns null if this is the first child of the parent,
			//		otherwise returns the next element sibling to the "left".

			return this._getSibling("previous"); // dijit._Widget
		},

		getNextSibling: function(){
			// summary:
			//		Returns null if this is the last child of the parent,
			//		otherwise returns the next element sibling to the "right".

			return this._getSibling("next"); // dijit._Widget
		},

		getIndexInParent: function(){
			// summary:
			//		Returns the index of this widget within its container parent.
			//		It returns -1 if the parent does not exist, or if the parent
			//		is not a dijit._Container

			var p = this.getParent();
			if(!p || !p.getIndexOfChild){
				return -1; // int
			}
			return p.getIndexOfChild(this); // int
		}
	});
});

},
'versa/api/Document':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 26/09/11
 * Time: 11:24 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Document", ["dojo/_base/declare",
        "dojox/json/ref",
        "versa/api/_Object",
        "versa/api/_Securable",
        "versa/api/Acl",
        "versa/api/Application",
        "versa/api/Utilities",
        "versa/api/Versions",
        "versa/api/PermissionSet"],
    function(declare){
        var o = declare("versa.api.Document",
                [versa.api._Object,
                 versa.api._Securable], {
            zone: null,
            library: null,

            checked_out_by: '',
            document_type_id: null,
            library: null,
            state: 0x0000,  //NONE

            clean_properties: function(args){
                var library = args.library;

                var document_type = library.getDocumentTypes().fetchById({id: this.document_type_id});

                //For each property
                for(var p in this){
                    //exclude functions
                    if(!dojo.isFunction(this[p])){
                        //retrieve the property_definition based on dbName (only lookup documents.*)
                        var dbName = dojo.replace('documents.{0}', [p]);
                        var property_definition = library.getPropertyDefinitions().fetchByDbName(dbName);

                        //Exclude if property wasn't found or is a system property
                        if((property_definition) && (!property_definition.is_system)){
                            //if current document type does not include property, delete it.
                            if(!document_type.hasProperty(property_definition.id)){
                                delete this[p];
                            }
                        }

                    }
                }

            },

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));

                this.securable_type = versa.api._Securable.types.Document;

                if((this.created_at != null) && (typeof this.created_at == 'string'))
                    this.created_at = dojo.date.stamp.fromISOString(this.created_at);
                if((this.updated_at != null) && (typeof this.updated_at == 'string'))
                    this.updated_at = dojo.date.stamp.fromISOString(this.created_at);

            },

            copyLocal: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Document.CP_TRGT, [zone.subdomain, library.id, this.getId()]);
                versa.api.Utilities.saveUrl({
                    url: url,
                    window_name: 'versa_save'
                });

            },

            file: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Document.FILE_TRGT,  [zone.subdomain, library.id, this.getId()]);
                var putData = {
                    folder_id: args.folder.id
                };

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            },

            getFullVersion: function(){
                //Changed to hide minor version support (for now)
                /*
                var version = {
                    major_version_number: (this.current_version) ? this.current_version.major_version_number: this.major_version_number,
                    minor_version_number: (this.current_version) ? this.current_version.minor_version_number: this.minor_version_number
                }
                return dojo.replace('{major_version_number}.{minor_version_number}', version);
                */
                return this.major_version_number;
            },

            getPermissionSet: function(folder, library, user){
                var prmSet = new versa.api.PermissionSet();

                prmSet.setValue(versa.api.PermissionIndices.VIEW, this.hasRights(versa.api._Securable.permissions.VIEW));
                prmSet.setValue(versa.api.PermissionIndices.COPY, this.hasRights(versa.api._Securable.permissions.VIEW));
                prmSet.setValue(versa.api.PermissionIndices.EDIT, this.hasRights(versa.api._Securable.permissions.WRITE_METADATA));
                prmSet.setValue(versa.api.PermissionIndices.MOVE, prmSet.getValue(versa.api.PermissionIndices.EDIT));
                prmSet.setValue(versa.api.PermissionIndices.CKO, (this.hasRights(versa.api._Securable.permissions.VERSION) && this.getState(versa.api.Document.states.CHECKED_IN)));
                prmSet.setValue(versa.api.PermissionIndices.CKI, (this.hasRights(versa.api._Securable.permissions.VERSION) && this.getState(versa.api.Document.states.CHECKED_OUT) && (this.checked_out_by == user.name)));
                prmSet.setValue(versa.api.PermissionIndices.CANCEL_CKO, prmSet.getValue(versa.api.PermissionIndices.CKI));
                prmSet.setValue(versa.api.PermissionIndices.DELETE, this.hasRights(versa.api._Securable.permissions.DELETE_ITEMS));
                prmSet.setValue(versa.api.PermissionIndices.SECURE, this.hasRights(versa.api._Securable.permissions.WRITE_ACL));

                prmSet.setValue(versa.api.PermissionIndices.RESTORE, this.hasRights(versa.api._Securable.permissions.DELETE_ITEMS));
                prmSet.setValue(versa.api.PermissionIndices.DESTROY, this.hasRights(versa.api._Securable.permissions.DELETE_ITEMS));

                return prmSet;
            },

            getState: function(stateFlag){
               return versa.api.Document._isState(this.state, stateFlag);
            },

            getVersions: function(args){

                if(!this._versions){
                    this._versions = new versa.api.Versions({zone: args.zone, library: args.library, document: this});
                }
                return this._versions;
            },

            isDeleted: function(){
                return this.getState(versa.api.Document.states.DELETED);
            },

            restore: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Document.RESTORE_TRGT,  [zone.subdomain, library.getId(), this.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            },

            setState: function(stateFlag, isSet){

                if(isSet){
                    this.state = this.state | stateFlag;
                }
                else{
                    this.state = this.state & ~stateFlag;
                }

                return this.state;
            },


            unfile: function(args){

                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Document.UNFILE_TRGT,  [zone.subdomain, library.id, this.id]);
                var putData = {
                };

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true
            },

            validate: function(args){

                if(!this.document_type_id){
                    this.state |= versa.api.Document.states.INVALID;
                    return false;
                }

                var documentType = args.library.getDocumentTypes().fetchById({id: this.document_type_id});
                var propertyDefinitions = args.library.getPropertyDefinitions();
                var dataTypes = versa.api.Application.getDataTypes();

                var isValid = dojo.every(documentType.property_mappings, function(item, idx){
                    var valid = true;

                    if(item.is_required){
                        var propertyDefinition = propertyDefinitions.fetchById({id: item.property_definition_id});
                        var dataType = dataTypes.fetchById({id: propertyDefinition.data_type_id});

                        if(!propertyDefinition) return false;
                        var value = this[propertyDefinition.column_name];

                        if(dataType.isString()){
                            valid = !String.isEmpty(value);
                        }

                    }

                    return valid;
                }, this);

                this.setState(versa.api.Document.states.INVALID, !isValid);

                return isValid;
            },

            getViewUrl: function(zone, library){
                return dojo.replace(versa.api.Document.VW_TRGT, [zone.subdomain, library.id, this.getId()]);
            },

            view: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = this.getViewUrl(zone, library);

                versa.api.Utilities.viewUrl({
                    windowBox: args.windowBox,
                    url: url,
                    window_name: 'versa_viewer'
                });
            }

        });

        o.getIconUrl = function(content_type, size){
            return dojo.replace('/icons/{0}?size={1}', [encodeURIComponent(content_type), size]);
        }

        o._isState = function(stateMask, stateFlag){
            return ((stateMask & stateFlag) == stateFlag);
        }

        o.getStateIcon = function(stateMask){

            var icon = 'none.16.png'

            if(versa.api.Document._isState(stateMask, versa.api.Document.states.ERROR)){
                icon = 'error.16.png'
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.INVALID)){
                icon = 'invalid.16.png';
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.CHECKED_IN)){
                icon = 'cki.16.png';
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.PENDING)){
                icon = 'pending.16.gif';
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.UPLOADED)){
                icon = 'uploaded.16.png'
            }

            return icon;
        }

        o.getStateMessage = function(stateMask){
            var msg = '';

            if(versa.api.Document._isState(stateMask, versa.api.Document.states.ERROR)){
                msg = 'An error occurred';
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.INVALID)){
                msg = 'The file contains missing or invalid property values';
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.CHECKED_IN)){
                msg = 'The file has been added to VersaFile';
            }
            else if(versa.api.Document._isState(stateMask, (versa.api.Document.states.PENDING | versa.api.Document.states.UPLOADED))){
                msg = 'The file is being added to VersaFile';
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.PENDING)){
                msg = 'Uploading...';;
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.UPLOADED)){
                msg = 'The file has been uploaded and is ready for checkin';
            }

            return msg;
        }

        o.VW_TRGT = '/zones/{0}/libraries/{1}/documents/{2}/download/?disposition=inline';
        o.CP_TRGT = '/zones/{0}/libraries/{1}/documents/{2}/download/?disposition=attachment';
        o.CKO_TRGT = '/zones/{0}/libraries/{1}/documents/{2}/checkout.json';
        o.CKI_TRGT  = '/zones/{0}/libraries/{1}/documents/{2}/checkin.json';
        o.XCKO_TRGT = '/zones/{0}/libraries/{1}/documents/{2}/cancel_checkout.json';
        o.FILE_TRGT  = '/zones/{0}/libraries/{1}/documents/{2}/file.json';
        o.UNFILE_TRGT  = '/zones/{0}/libraries/{1}/documents/{2}/unfile.json';
        o.RESTORE_TRGT  = '/zones/{0}/libraries/{1}/documents/{2}/restore.json';
        o.SDEL_TRGT  = '/zones/{0}/libraries/{1}/documents/{2}/soft_delete.json';

        o.states = {
            'NONE':         0x0000,
            'PENDING':      0x0001,
            'UPLOADED':     0x0002,
            'BUSY':         0x0004,
            'INDEXED':      0x0010,
            'CHECKED_IN':   0x0020,
            'CHECKED_OUT':  0x0040,
            'INVALID':      0x0400,
            'DELETED':      0x0800,
            'ERROR':        0x8000
        };

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'document_type_id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': '',
                     'required': true
                },
                'created_at': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'created_by': {
                    type: ['string', 'null'],
                    'default': ''
                },
                'checked_out_by': {
                    type: ['string', 'null']
                },
                'state': {
                    type: 'integer',
                    'default': o.PENDING
                },
                'updated_at': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'updated_by': {
                    type: ['string', 'null'],
                    'default': ''
                },
                'prp_dtt001': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt002': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt003': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt004': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt005': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt006': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt007': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt008': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                }

            },
            prototype: new o()
        };
        return o;
    }
);

},
'versa/api/Preference':function(){
/**
 * @author mattk
 */
define("versa/api/Preference", ["dojo/_base/declare",
        "versa/api/_Object",
        "dojo/data/ItemFileReadStore"],
    function(declare){
        var o=declare("versa.api.Preference", [versa.api._Object], {
            constructor: function(/* Object */args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            }
        });

        o.dateEntryFormats = {_date: 1, _time: 2, _datetime: 3};

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string'
                },
                'value': {
                    type: 'string'
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string',
                    'default': ''
                },
                'updated_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'updated_by': {
                    type: 'string',
                    'default': ''
                }
            }
        };

        return o;
    }
);




},
'dojox/mobile/sniff':function(){
define("dojox/mobile/sniff", [
	"dojo/_base/window",
	"dojo/_base/sniff"
], function(win, has){

	var ua = navigator.userAgent;

	// BlackBerry (OS 6 or later only)
	has.add("bb", ua.indexOf("BlackBerry") >= 0 && parseFloat(ua.split("Version/")[1]) || undefined, undefined, true);

	// Android
	has.add("android", parseFloat(ua.split("Android ")[1]) || undefined, undefined, true);

	// iPhone, iPod, or iPad
	// If iPod or iPad is detected, in addition to has("ipod") or has("ipad"),
	// has("iphone") will also have iOS version number.
	if(ua.match(/(iPhone|iPod|iPad)/)){
		var p = RegExp.$1.replace(/P/, 'p');
		var v = ua.match(/OS ([\d_]+)/) ? RegExp.$1 : "1";
		var os = parseFloat(v.replace(/_/, '.').replace(/_/g, ''));
		has.add(p, os, undefined, true);
		has.add("iphone", os, undefined, true);
	}

	if(has("webkit")){
		has.add("touch", (typeof win.doc.documentElement.ontouchstart != "undefined" &&
			navigator.appVersion.indexOf("Mobile") != -1) || !!has("android"), undefined, true);
	}

	return has;
});

},
'dijit/_Container':function(){
define("dijit/_Container", [
	"dojo/_base/array", // array.forEach array.indexOf
	"dojo/_base/declare", // declare
	"dojo/dom-construct", // domConstruct.place
	"./registry"	// registry.byNode()
], function(array, declare, domConstruct, registry){

	// module:
	//		dijit/_Container
	// summary:
	//		Mixin for widgets that contain a set of widget children.

	return declare("dijit._Container", null, {
		// summary:
		//		Mixin for widgets that contain a set of widget children.
		// description:
		//		Use this mixin for widgets that needs to know about and
		//		keep track of their widget children. Suitable for widgets like BorderContainer
		//		and TabContainer which contain (only) a set of child widgets.
		//
		//		It's not suitable for widgets like ContentPane
		//		which contains mixed HTML (plain DOM nodes in addition to widgets),
		//		and where contained widgets are not necessarily directly below
		//		this.containerNode.   In that case calls like addChild(node, position)
		//		wouldn't make sense.

		buildRendering: function(){
			this.inherited(arguments);
			if(!this.containerNode){
				// all widgets with descendants must set containerNode
	 			this.containerNode = this.domNode;
			}
		},

		addChild: function(/*dijit._Widget*/ widget, /*int?*/ insertIndex){
			// summary:
			//		Makes the given widget a child of this widget.
			// description:
			//		Inserts specified child widget's dom node as a child of this widget's
			//		container node, and possibly does other processing (such as layout).

			var refNode = this.containerNode;
			if(insertIndex && typeof insertIndex == "number"){
				var children = this.getChildren();
				if(children && children.length >= insertIndex){
					refNode = children[insertIndex-1].domNode;
					insertIndex = "after";
				}
			}
			domConstruct.place(widget.domNode, refNode, insertIndex);

			// If I've been started but the child widget hasn't been started,
			// start it now.  Make sure to do this after widget has been
			// inserted into the DOM tree, so it can see that it's being controlled by me,
			// so it doesn't try to size itself.
			if(this._started && !widget._started){
				widget.startup();
			}
		},

		removeChild: function(/*Widget|int*/ widget){
			// summary:
			//		Removes the passed widget instance from this widget but does
			//		not destroy it.  You can also pass in an integer indicating
			//		the index within the container to remove

			if(typeof widget == "number"){
				widget = this.getChildren()[widget];
			}

			if(widget){
				var node = widget.domNode;
				if(node && node.parentNode){
					node.parentNode.removeChild(node); // detach but don't destroy
				}
			}
		},

		hasChildren: function(){
			// summary:
			//		Returns true if widget has children, i.e. if this.containerNode contains something.
			return this.getChildren().length > 0;	// Boolean
		},

		_getSiblingOfChild: function(/*dijit._Widget*/ child, /*int*/ dir){
			// summary:
			//		Get the next or previous widget sibling of child
			// dir:
			//		if 1, get the next sibling
			//		if -1, get the previous sibling
			// tags:
			//      private
			var node = child.domNode,
				which = (dir>0 ? "nextSibling" : "previousSibling");
			do{
				node = node[which];
			}while(node && (node.nodeType != 1 || !registry.byNode(node)));
			return node && registry.byNode(node);	// dijit._Widget
		},

		getIndexOfChild: function(/*dijit._Widget*/ child){
			// summary:
			//		Gets the index of the child in this container or -1 if not found
			return array.indexOf(this.getChildren(), child);	// int
		}
	});
});

},
'dojo/data/ItemFileReadStore':function(){
define("dojo/data/ItemFileReadStore", ["../_base/kernel", "../_base/lang", "../_base/declare", "../_base/array", "../_base/xhr", 
	"../Evented", "../_base/window", "./util/filter", "./util/simpleFetch", "../date/stamp"
], function(kernel, lang, declare, array, xhr, Evented, window, filterUtil, simpleFetch, dateStamp) {
	// module:
	//		dojo/data/ItemFileReadStore
	// summary:
	//		TODOC


var ItemFileReadStore = declare("dojo.data.ItemFileReadStore", [Evented],{
	//	summary:
	//		The ItemFileReadStore implements the dojo.data.api.Read API and reads
	//		data from JSON files that have contents in this format --
	//		{ items: [
	//			{ name:'Kermit', color:'green', age:12, friends:['Gonzo', {_reference:{name:'Fozzie Bear'}}]},
	//			{ name:'Fozzie Bear', wears:['hat', 'tie']},
	//			{ name:'Miss Piggy', pets:'Foo-Foo'}
	//		]}
	//		Note that it can also contain an 'identifer' property that specified which attribute on the items
	//		in the array of items that acts as the unique identifier for that item.
	//
	constructor: function(/* Object */ keywordParameters){
		//	summary: constructor
		//	keywordParameters: {url: String}
		//	keywordParameters: {data: jsonObject}
		//	keywordParameters: {typeMap: object)
		//		The structure of the typeMap object is as follows:
		//		{
		//			type0: function || object,
		//			type1: function || object,
		//			...
		//			typeN: function || object
		//		}
		//		Where if it is a function, it is assumed to be an object constructor that takes the
		//		value of _value as the initialization parameters.  If it is an object, then it is assumed
		//		to be an object of general form:
		//		{
		//			type: function, //constructor.
		//			deserialize:	function(value) //The function that parses the value and constructs the object defined by type appropriately.
		//		}

		this._arrayOfAllItems = [];
		this._arrayOfTopLevelItems = [];
		this._loadFinished = false;
		this._jsonFileUrl = keywordParameters.url;
		this._ccUrl = keywordParameters.url;
		this.url = keywordParameters.url;
		this._jsonData = keywordParameters.data;
		this.data = null;
		this._datatypeMap = keywordParameters.typeMap || {};
		if(!this._datatypeMap['Date']){
			//If no default mapping for dates, then set this as default.
			//We use the dojo.date.stamp here because the ISO format is the 'dojo way'
			//of generically representing dates.
			this._datatypeMap['Date'] = {
											type: Date,
											deserialize: function(value){
												return dateStamp.fromISOString(value);
											}
										};
		}
		this._features = {'dojo.data.api.Read':true, 'dojo.data.api.Identity':true};
		this._itemsByIdentity = null;
		this._storeRefPropName = "_S"; // Default name for the store reference to attach to every item.
		this._itemNumPropName = "_0"; // Default Item Id for isItem to attach to every item.
		this._rootItemPropName = "_RI"; // Default Item Id for isItem to attach to every item.
		this._reverseRefMap = "_RRM"; // Default attribute for constructing a reverse reference map for use with reference integrity
		this._loadInProgress = false; //Got to track the initial load to prevent duelling loads of the dataset.
		this._queuedFetches = [];
		if(keywordParameters.urlPreventCache !== undefined){
			this.urlPreventCache = keywordParameters.urlPreventCache?true:false;
		}
		if(keywordParameters.hierarchical !== undefined){
			this.hierarchical = keywordParameters.hierarchical?true:false;
		}
		if(keywordParameters.clearOnClose){
			this.clearOnClose = true;
		}
		if("failOk" in keywordParameters){
			this.failOk = keywordParameters.failOk?true:false;
		}
	},

	url: "",	// use "" rather than undefined for the benefit of the parser (#3539)

	//Internal var, crossCheckUrl.  Used so that setting either url or _jsonFileUrl, can still trigger a reload
	//when clearOnClose and close is used.
	_ccUrl: "",

	data: null,	// define this so that the parser can populate it

	typeMap: null, //Define so parser can populate.

	//Parameter to allow users to specify if a close call should force a reload or not.
	//By default, it retains the old behavior of not clearing if close is called.  But
	//if set true, the store will be reset to default state.  Note that by doing this,
	//all item handles will become invalid and a new fetch must be issued.
	clearOnClose: false,

	//Parameter to allow specifying if preventCache should be passed to the xhrGet call or not when loading data from a url.
	//Note this does not mean the store calls the server on each fetch, only that the data load has preventCache set as an option.
	//Added for tracker: #6072
	urlPreventCache: false,

	//Parameter for specifying that it is OK for the xhrGet call to fail silently.
	failOk: false,

	//Parameter to indicate to process data from the url as hierarchical
	//(data items can contain other data items in js form).  Default is true
	//for backwards compatibility.  False means only root items are processed
	//as items, all child objects outside of type-mapped objects and those in
	//specific reference format, are left straight JS data objects.
	hierarchical: true,

	_assertIsItem: function(/* item */ item){
		//	summary:
		//		This function tests whether the item passed in is indeed an item in the store.
		//	item:
		//		The item to test for being contained by the store.
		if(!this.isItem(item)){
			throw new Error("dojo.data.ItemFileReadStore: Invalid item argument.");
		}
	},

	_assertIsAttribute: function(/* attribute-name-string */ attribute){
		//	summary:
		//		This function tests whether the item passed in is indeed a valid 'attribute' like type for the store.
		//	attribute:
		//		The attribute to test for being contained by the store.
		if(typeof attribute !== "string"){
			throw new Error("dojo.data.ItemFileReadStore: Invalid attribute argument.");
		}
	},

	getValue: function(	/* item */ item,
						/* attribute-name-string */ attribute,
						/* value? */ defaultValue){
		//	summary:
		//		See dojo.data.api.Read.getValue()
		var values = this.getValues(item, attribute);
		return (values.length > 0)?values[0]:defaultValue; // mixed
	},

	getValues: function(/* item */ item,
						/* attribute-name-string */ attribute){
		//	summary:
		//		See dojo.data.api.Read.getValues()

		this._assertIsItem(item);
		this._assertIsAttribute(attribute);
		// Clone it before returning.  refs: #10474
		return (item[attribute] || []).slice(0); // Array
	},

	getAttributes: function(/* item */ item){
		//	summary:
		//		See dojo.data.api.Read.getAttributes()
		this._assertIsItem(item);
		var attributes = [];
		for(var key in item){
			// Save off only the real item attributes, not the special id marks for O(1) isItem.
			if((key !== this._storeRefPropName) && (key !== this._itemNumPropName) && (key !== this._rootItemPropName) && (key !== this._reverseRefMap)){
				attributes.push(key);
			}
		}
		return attributes; // Array
	},

	hasAttribute: function(	/* item */ item,
							/* attribute-name-string */ attribute){
		//	summary:
		//		See dojo.data.api.Read.hasAttribute()
		this._assertIsItem(item);
		this._assertIsAttribute(attribute);
		return (attribute in item);
	},

	containsValue: function(/* item */ item,
							/* attribute-name-string */ attribute,
							/* anything */ value){
		//	summary:
		//		See dojo.data.api.Read.containsValue()
		var regexp = undefined;
		if(typeof value === "string"){
			regexp = filterUtil.patternToRegExp(value, false);
		}
		return this._containsValue(item, attribute, value, regexp); //boolean.
	},

	_containsValue: function(	/* item */ item,
								/* attribute-name-string */ attribute,
								/* anything */ value,
								/* RegExp?*/ regexp){
		//	summary:
		//		Internal function for looking at the values contained by the item.
		//	description:
		//		Internal function for looking at the values contained by the item.  This
		//		function allows for denoting if the comparison should be case sensitive for
		//		strings or not (for handling filtering cases where string case should not matter)
		//
		//	item:
		//		The data item to examine for attribute values.
		//	attribute:
		//		The attribute to inspect.
		//	value:
		//		The value to match.
		//	regexp:
		//		Optional regular expression generated off value if value was of string type to handle wildcarding.
		//		If present and attribute values are string, then it can be used for comparison instead of 'value'
		return array.some(this.getValues(item, attribute), function(possibleValue){
			if(possibleValue !== null && !lang.isObject(possibleValue) && regexp){
				if(possibleValue.toString().match(regexp)){
					return true; // Boolean
				}
			}else if(value === possibleValue){
				return true; // Boolean
			}
		});
	},

	isItem: function(/* anything */ something){
		//	summary:
		//		See dojo.data.api.Read.isItem()
		if(something && something[this._storeRefPropName] === this){
			if(this._arrayOfAllItems[something[this._itemNumPropName]] === something){
				return true;
			}
		}
		return false; // Boolean
	},

	isItemLoaded: function(/* anything */ something){
		//	summary:
		//		See dojo.data.api.Read.isItemLoaded()
		return this.isItem(something); //boolean
	},

	loadItem: function(/* object */ keywordArgs){
		//	summary:
		//		See dojo.data.api.Read.loadItem()
		this._assertIsItem(keywordArgs.item);
	},

	getFeatures: function(){
		//	summary:
		//		See dojo.data.api.Read.getFeatures()
		return this._features; //Object
	},

	getLabel: function(/* item */ item){
		//	summary:
		//		See dojo.data.api.Read.getLabel()
		if(this._labelAttr && this.isItem(item)){
			return this.getValue(item,this._labelAttr); //String
		}
		return undefined; //undefined
	},

	getLabelAttributes: function(/* item */ item){
		//	summary:
		//		See dojo.data.api.Read.getLabelAttributes()
		if(this._labelAttr){
			return [this._labelAttr]; //array
		}
		return null; //null
	},

	_fetchItems: function(	/* Object */ keywordArgs,
							/* Function */ findCallback,
							/* Function */ errorCallback){
		//	summary:
		//		See dojo.data.util.simpleFetch.fetch()
		var self = this,
		    filter = function(requestArgs, arrayOfItems){
			var items = [],
			    i, key;
			if(requestArgs.query){
				var value,
				    ignoreCase = requestArgs.queryOptions ? requestArgs.queryOptions.ignoreCase : false;

				//See if there are any string values that can be regexp parsed first to avoid multiple regexp gens on the
				//same value for each item examined.  Much more efficient.
				var regexpList = {};
				for(key in requestArgs.query){
					value = requestArgs.query[key];
					if(typeof value === "string"){
						regexpList[key] = filterUtil.patternToRegExp(value, ignoreCase);
					}else if(value instanceof RegExp){
						regexpList[key] = value;
					}
				}
				for(i = 0; i < arrayOfItems.length; ++i){
					var match = true;
					var candidateItem = arrayOfItems[i];
					if(candidateItem === null){
						match = false;
					}else{
						for(key in requestArgs.query){
							value = requestArgs.query[key];
							if(!self._containsValue(candidateItem, key, value, regexpList[key])){
								match = false;
							}
						}
					}
					if(match){
						items.push(candidateItem);
					}
				}
				findCallback(items, requestArgs);
			}else{
				// We want a copy to pass back in case the parent wishes to sort the array.
				// We shouldn't allow resort of the internal list, so that multiple callers
				// can get lists and sort without affecting each other.  We also need to
				// filter out any null values that have been left as a result of deleteItem()
				// calls in ItemFileWriteStore.
				for(i = 0; i < arrayOfItems.length; ++i){
					var item = arrayOfItems[i];
					if(item !== null){
						items.push(item);
					}
				}
				findCallback(items, requestArgs);
			}
		};

		if(this._loadFinished){
			filter(keywordArgs, this._getItemsArray(keywordArgs.queryOptions));
		}else{
			//Do a check on the JsonFileUrl and crosscheck it.
			//If it doesn't match the cross-check, it needs to be updated
			//This allows for either url or _jsonFileUrl to he changed to
			//reset the store load location.  Done this way for backwards
			//compatibility.  People use _jsonFileUrl (even though officially
			//private.
			if(this._jsonFileUrl !== this._ccUrl){
				kernel.deprecated("dojo.data.ItemFileReadStore: ",
					"To change the url, set the url property of the store," +
					" not _jsonFileUrl.  _jsonFileUrl support will be removed in 2.0");
				this._ccUrl = this._jsonFileUrl;
				this.url = this._jsonFileUrl;
			}else if(this.url !== this._ccUrl){
				this._jsonFileUrl = this.url;
				this._ccUrl = this.url;
			}

			//See if there was any forced reset of data.
			if(this.data != null){
				this._jsonData = this.data;
				this.data = null;
			}

			if(this._jsonFileUrl){
				//If fetches come in before the loading has finished, but while
				//a load is in progress, we have to defer the fetching to be
				//invoked in the callback.
				if(this._loadInProgress){
					this._queuedFetches.push({args: keywordArgs, filter: filter});
				}else{
					this._loadInProgress = true;
					var getArgs = {
							url: self._jsonFileUrl,
							handleAs: "json-comment-optional",
							preventCache: this.urlPreventCache,
							failOk: this.failOk
						};
					var getHandler = xhr.get(getArgs);
					getHandler.addCallback(function(data){
						try{
							self._getItemsFromLoadedData(data);
							self._loadFinished = true;
							self._loadInProgress = false;

							filter(keywordArgs, self._getItemsArray(keywordArgs.queryOptions));
							self._handleQueuedFetches();
						}catch(e){
							self._loadFinished = true;
							self._loadInProgress = false;
							errorCallback(e, keywordArgs);
						}
					});
					getHandler.addErrback(function(error){
						self._loadInProgress = false;
						errorCallback(error, keywordArgs);
					});

					//Wire up the cancel to abort of the request
					//This call cancel on the deferred if it hasn't been called
					//yet and then will chain to the simple abort of the
					//simpleFetch keywordArgs
					var oldAbort = null;
					if(keywordArgs.abort){
						oldAbort = keywordArgs.abort;
					}
					keywordArgs.abort = function(){
						var df = getHandler;
						if(df && df.fired === -1){
							df.cancel();
							df = null;
						}
						if(oldAbort){
							oldAbort.call(keywordArgs);
						}
					};
				}
			}else if(this._jsonData){
				try{
					this._loadFinished = true;
					this._getItemsFromLoadedData(this._jsonData);
					this._jsonData = null;
					filter(keywordArgs, this._getItemsArray(keywordArgs.queryOptions));
				}catch(e){
					errorCallback(e, keywordArgs);
				}
			}else{
				errorCallback(new Error("dojo.data.ItemFileReadStore: No JSON source data was provided as either URL or a nested Javascript object."), keywordArgs);
			}
		}
	},

	_handleQueuedFetches: function(){
		//	summary:
		//		Internal function to execute delayed request in the store.
		//Execute any deferred fetches now.
		if(this._queuedFetches.length > 0){
			for(var i = 0; i < this._queuedFetches.length; i++){
				var fData = this._queuedFetches[i],
				    delayedQuery = fData.args,
				    delayedFilter = fData.filter;
				if(delayedFilter){
					delayedFilter(delayedQuery, this._getItemsArray(delayedQuery.queryOptions));
				}else{
					this.fetchItemByIdentity(delayedQuery);
				}
			}
			this._queuedFetches = [];
		}
	},

	_getItemsArray: function(/*object?*/queryOptions){
		//	summary:
		//		Internal function to determine which list of items to search over.
		//	queryOptions: The query options parameter, if any.
		if(queryOptions && queryOptions.deep){
			return this._arrayOfAllItems;
		}
		return this._arrayOfTopLevelItems;
	},

	close: function(/*dojo.data.api.Request || keywordArgs || null */ request){
		 //	summary:
		 //		See dojo.data.api.Read.close()
		 if(this.clearOnClose &&
			this._loadFinished &&
			!this._loadInProgress){
			 //Reset all internalsback to default state.  This will force a reload
			 //on next fetch.  This also checks that the data or url param was set
			 //so that the store knows it can get data.  Without one of those being set,
			 //the next fetch will trigger an error.

			 if(((this._jsonFileUrl == "" || this._jsonFileUrl == null) &&
				 (this.url == "" || this.url == null)
				) && this.data == null){
				 console.debug("dojo.data.ItemFileReadStore: WARNING!  Data reload " +
					" information has not been provided." +
					"  Please set 'url' or 'data' to the appropriate value before" +
					" the next fetch");
			 }
			 this._arrayOfAllItems = [];
			 this._arrayOfTopLevelItems = [];
			 this._loadFinished = false;
			 this._itemsByIdentity = null;
			 this._loadInProgress = false;
			 this._queuedFetches = [];
		 }
	},

	_getItemsFromLoadedData: function(/* Object */ dataObject){
		//	summary:
		//		Function to parse the loaded data into item format and build the internal items array.
		//	description:
		//		Function to parse the loaded data into item format and build the internal items array.
		//
		//	dataObject:
		//		The JS data object containing the raw data to convery into item format.
		//
		// 	returns: array
		//		Array of items in store item format.

		// First, we define a couple little utility functions...
		var addingArrays = false,
		    self = this;

		function valueIsAnItem(/* anything */ aValue){
			// summary:
			//		Given any sort of value that could be in the raw json data,
			//		return true if we should interpret the value as being an
			//		item itself, rather than a literal value or a reference.
			// example:
			// 	|	false == valueIsAnItem("Kermit");
			// 	|	false == valueIsAnItem(42);
			// 	|	false == valueIsAnItem(new Date());
			// 	|	false == valueIsAnItem({_type:'Date', _value:'1802-05-14'});
			// 	|	false == valueIsAnItem({_reference:'Kermit'});
			// 	|	true == valueIsAnItem({name:'Kermit', color:'green'});
			// 	|	true == valueIsAnItem({iggy:'pop'});
			// 	|	true == valueIsAnItem({foo:42});
			return (aValue !== null) &&
				(typeof aValue === "object") &&
				(!lang.isArray(aValue) || addingArrays) &&
				(!lang.isFunction(aValue)) &&
				(aValue.constructor == Object || lang.isArray(aValue)) &&
				(typeof aValue._reference === "undefined") &&
				(typeof aValue._type === "undefined") &&
				(typeof aValue._value === "undefined") &&
				self.hierarchical;
		}

		function addItemAndSubItemsToArrayOfAllItems(/* Item */ anItem){
			self._arrayOfAllItems.push(anItem);
			for(var attribute in anItem){
				var valueForAttribute = anItem[attribute];
				if(valueForAttribute){
					if(lang.isArray(valueForAttribute)){
						var valueArray = valueForAttribute;
						for(var k = 0; k < valueArray.length; ++k){
							var singleValue = valueArray[k];
							if(valueIsAnItem(singleValue)){
								addItemAndSubItemsToArrayOfAllItems(singleValue);
							}
						}
					}else{
						if(valueIsAnItem(valueForAttribute)){
							addItemAndSubItemsToArrayOfAllItems(valueForAttribute);
						}
					}
				}
			}
		}

		this._labelAttr = dataObject.label;

		// We need to do some transformations to convert the data structure
		// that we read from the file into a format that will be convenient
		// to work with in memory.

		// Step 1: Walk through the object hierarchy and build a list of all items
		var i,
		    item;
		this._arrayOfAllItems = [];
		this._arrayOfTopLevelItems = dataObject.items;

		for(i = 0; i < this._arrayOfTopLevelItems.length; ++i){
			item = this._arrayOfTopLevelItems[i];
			if(lang.isArray(item)){
				addingArrays = true;
			}
			addItemAndSubItemsToArrayOfAllItems(item);
			item[this._rootItemPropName]=true;
		}

		// Step 2: Walk through all the attribute values of all the items,
		// and replace single values with arrays.  For example, we change this:
		//		{ name:'Miss Piggy', pets:'Foo-Foo'}
		// into this:
		//		{ name:['Miss Piggy'], pets:['Foo-Foo']}
		//
		// We also store the attribute names so we can validate our store
		// reference and item id special properties for the O(1) isItem
		var allAttributeNames = {},
		    key;

		for(i = 0; i < this._arrayOfAllItems.length; ++i){
			item = this._arrayOfAllItems[i];
			for(key in item){
				if(key !== this._rootItemPropName){
					var value = item[key];
					if(value !== null){
						if(!lang.isArray(value)){
							item[key] = [value];
						}
					}else{
						item[key] = [null];
					}
				}
				allAttributeNames[key]=key;
			}
		}

		// Step 3: Build unique property names to use for the _storeRefPropName and _itemNumPropName
		// This should go really fast, it will generally never even run the loop.
		while(allAttributeNames[this._storeRefPropName]){
			this._storeRefPropName += "_";
		}
		while(allAttributeNames[this._itemNumPropName]){
			this._itemNumPropName += "_";
		}
		while(allAttributeNames[this._reverseRefMap]){
			this._reverseRefMap += "_";
		}

		// Step 4: Some data files specify an optional 'identifier', which is
		// the name of an attribute that holds the identity of each item.
		// If this data file specified an identifier attribute, then build a
		// hash table of items keyed by the identity of the items.
		var arrayOfValues;

		var identifier = dataObject.identifier;
		if(identifier){
			this._itemsByIdentity = {};
			this._features['dojo.data.api.Identity'] = identifier;
			for(i = 0; i < this._arrayOfAllItems.length; ++i){
				item = this._arrayOfAllItems[i];
				arrayOfValues = item[identifier];
				var identity = arrayOfValues[0];
				if(!Object.hasOwnProperty.call(this._itemsByIdentity, identity)){
					this._itemsByIdentity[identity] = item;
				}else{
					if(this._jsonFileUrl){
						throw new Error("dojo.data.ItemFileReadStore:  The json data as specified by: [" + this._jsonFileUrl + "] is malformed.  Items within the list have identifier: [" + identifier + "].  Value collided: [" + identity + "]");
					}else if(this._jsonData){
						throw new Error("dojo.data.ItemFileReadStore:  The json data provided by the creation arguments is malformed.  Items within the list have identifier: [" + identifier + "].  Value collided: [" + identity + "]");
					}
				}
			}
		}else{
			this._features['dojo.data.api.Identity'] = Number;
		}

		// Step 5: Walk through all the items, and set each item's properties
		// for _storeRefPropName and _itemNumPropName, so that store.isItem() will return true.
		for(i = 0; i < this._arrayOfAllItems.length; ++i){
			item = this._arrayOfAllItems[i];
			item[this._storeRefPropName] = this;
			item[this._itemNumPropName] = i;
		}

		// Step 6: We walk through all the attribute values of all the items,
		// looking for type/value literals and item-references.
		//
		// We replace item-references with pointers to items.  For example, we change:
		//		{ name:['Kermit'], friends:[{_reference:{name:'Miss Piggy'}}] }
		// into this:
		//		{ name:['Kermit'], friends:[miss_piggy] }
		// (where miss_piggy is the object representing the 'Miss Piggy' item).
		//
		// We replace type/value pairs with typed-literals.  For example, we change:
		//		{ name:['Nelson Mandela'], born:[{_type:'Date', _value:'1918-07-18'}] }
		// into this:
		//		{ name:['Kermit'], born:(new Date(1918, 6, 18)) }
		//
		// We also generate the associate map for all items for the O(1) isItem function.
		for(i = 0; i < this._arrayOfAllItems.length; ++i){
			item = this._arrayOfAllItems[i]; // example: { name:['Kermit'], friends:[{_reference:{name:'Miss Piggy'}}] }
			for(key in item){
				arrayOfValues = item[key]; // example: [{_reference:{name:'Miss Piggy'}}]
				for(var j = 0; j < arrayOfValues.length; ++j){
					value = arrayOfValues[j]; // example: {_reference:{name:'Miss Piggy'}}
					if(value !== null && typeof value == "object"){
						if(("_type" in value) && ("_value" in value)){
							var type = value._type; // examples: 'Date', 'Color', or 'ComplexNumber'
							var mappingObj = this._datatypeMap[type]; // examples: Date, dojo.Color, foo.math.ComplexNumber, {type: dojo.Color, deserialize(value){ return new dojo.Color(value)}}
							if(!mappingObj){
								throw new Error("dojo.data.ItemFileReadStore: in the typeMap constructor arg, no object class was specified for the datatype '" + type + "'");
							}else if(lang.isFunction(mappingObj)){
								arrayOfValues[j] = new mappingObj(value._value);
							}else if(lang.isFunction(mappingObj.deserialize)){
								arrayOfValues[j] = mappingObj.deserialize(value._value);
							}else{
								throw new Error("dojo.data.ItemFileReadStore: Value provided in typeMap was neither a constructor, nor a an object with a deserialize function");
							}
						}
						if(value._reference){
							var referenceDescription = value._reference; // example: {name:'Miss Piggy'}
							if(!lang.isObject(referenceDescription)){
								// example: 'Miss Piggy'
								// from an item like: { name:['Kermit'], friends:[{_reference:'Miss Piggy'}]}
								arrayOfValues[j] = this._getItemByIdentity(referenceDescription);
							}else{
								// example: {name:'Miss Piggy'}
								// from an item like: { name:['Kermit'], friends:[{_reference:{name:'Miss Piggy'}}] }
								for(var k = 0; k < this._arrayOfAllItems.length; ++k){
									var candidateItem = this._arrayOfAllItems[k],
									    found = true;
									for(var refKey in referenceDescription){
										if(candidateItem[refKey] != referenceDescription[refKey]){
											found = false;
										}
									}
									if(found){
										arrayOfValues[j] = candidateItem;
									}
								}
							}
							if(this.referenceIntegrity){
								var refItem = arrayOfValues[j];
								if(this.isItem(refItem)){
									this._addReferenceToMap(refItem, item, key);
								}
							}
						}else if(this.isItem(value)){
							//It's a child item (not one referenced through _reference).
							//We need to treat this as a referenced item, so it can be cleaned up
							//in a write store easily.
							if(this.referenceIntegrity){
								this._addReferenceToMap(value, item, key);
							}
						}
					}
				}
			}
		}
	},

	_addReferenceToMap: function(/*item*/ refItem, /*item*/ parentItem, /*string*/ attribute){
		 //	summary:
		 //		Method to add an reference map entry for an item and attribute.
		 //	description:
		 //		Method to add an reference map entry for an item and attribute. 		 //
		 //	refItem:
		 //		The item that is referenced.
		 //	parentItem:
		 //		The item that holds the new reference to refItem.
		 //	attribute:
		 //		The attribute on parentItem that contains the new reference.

		 //Stub function, does nothing.  Real processing is in ItemFileWriteStore.
	},

	getIdentity: function(/* item */ item){
		//	summary:
		//		See dojo.data.api.Identity.getIdentity()
		var identifier = this._features['dojo.data.api.Identity'];
		if(identifier === Number){
			return item[this._itemNumPropName]; // Number
		}else{
			var arrayOfValues = item[identifier];
			if(arrayOfValues){
				return arrayOfValues[0]; // Object || String
			}
		}
		return null; // null
	},

	fetchItemByIdentity: function(/* Object */ keywordArgs){
		//	summary:
		//		See dojo.data.api.Identity.fetchItemByIdentity()

		// Hasn't loaded yet, we have to trigger the load.
		var item,
		    scope;
		if(!this._loadFinished){
			var self = this;
			//Do a check on the JsonFileUrl and crosscheck it.
			//If it doesn't match the cross-check, it needs to be updated
			//This allows for either url or _jsonFileUrl to he changed to
			//reset the store load location.  Done this way for backwards
			//compatibility.  People use _jsonFileUrl (even though officially
			//private.
			if(this._jsonFileUrl !== this._ccUrl){
				kernel.deprecated("dojo.data.ItemFileReadStore: ",
					"To change the url, set the url property of the store," +
					" not _jsonFileUrl.  _jsonFileUrl support will be removed in 2.0");
				this._ccUrl = this._jsonFileUrl;
				this.url = this._jsonFileUrl;
			}else if(this.url !== this._ccUrl){
				this._jsonFileUrl = this.url;
				this._ccUrl = this.url;
			}

			//See if there was any forced reset of data.
			if(this.data != null && this._jsonData == null){
				this._jsonData = this.data;
				this.data = null;
			}

			if(this._jsonFileUrl){

				if(this._loadInProgress){
					this._queuedFetches.push({args: keywordArgs});
				}else{
					this._loadInProgress = true;
					var getArgs = {
							url: self._jsonFileUrl,
							handleAs: "json-comment-optional",
							preventCache: this.urlPreventCache,
							failOk: this.failOk
					};
					var getHandler = xhr.get(getArgs);
					getHandler.addCallback(function(data){
						var scope = keywordArgs.scope?keywordArgs.scope:window.global;
						try{
							self._getItemsFromLoadedData(data);
							self._loadFinished = true;
							self._loadInProgress = false;
							item = self._getItemByIdentity(keywordArgs.identity);
							if(keywordArgs.onItem){
								keywordArgs.onItem.call(scope, item);
							}
							self._handleQueuedFetches();
						}catch(error){
							self._loadInProgress = false;
							if(keywordArgs.onError){
								keywordArgs.onError.call(scope, error);
							}
						}
					});
					getHandler.addErrback(function(error){
						self._loadInProgress = false;
						if(keywordArgs.onError){
							var scope = keywordArgs.scope?keywordArgs.scope:window.global;
							keywordArgs.onError.call(scope, error);
						}
					});
				}

			}else if(this._jsonData){
				// Passed in data, no need to xhr.
				self._getItemsFromLoadedData(self._jsonData);
				self._jsonData = null;
				self._loadFinished = true;
				item = self._getItemByIdentity(keywordArgs.identity);
				if(keywordArgs.onItem){
					scope = keywordArgs.scope?keywordArgs.scope:window.global;
					keywordArgs.onItem.call(scope, item);
				}
			}
		}else{
			// Already loaded.  We can just look it up and call back.
			item = this._getItemByIdentity(keywordArgs.identity);
			if(keywordArgs.onItem){
				scope = keywordArgs.scope?keywordArgs.scope:window.global;
				keywordArgs.onItem.call(scope, item);
			}
		}
	},

	_getItemByIdentity: function(/* Object */ identity){
		//	summary:
		//		Internal function to look an item up by its identity map.
		var item = null;
		if(this._itemsByIdentity){
			// If this map is defined, we need to just try to get it.  If it fails
			// the item does not exist.
			if(Object.hasOwnProperty.call(this._itemsByIdentity, identity)){
				item = this._itemsByIdentity[identity];
			}
		}else if (Object.hasOwnProperty.call(this._arrayOfAllItems, identity)){
			item = this._arrayOfAllItems[identity];
		}
		if(item === undefined){
			item = null;
		}
		return item; // Object
	},

	getIdentityAttributes: function(/* item */ item){
		//	summary:
		//		See dojo.data.api.Identity.getIdentityAttributes()

		var identifier = this._features['dojo.data.api.Identity'];
		if(identifier === Number){
			// If (identifier === Number) it means getIdentity() just returns
			// an integer item-number for each item.  The dojo.data.api.Identity
			// spec says we need to return null if the identity is not composed
			// of attributes
			return null; // null
		}else{
			return [identifier]; // Array
		}
	},

	_forceLoad: function(){
		//	summary:
		//		Internal function to force a load of the store if it hasn't occurred yet.  This is required
		//		for specific functions to work properly.
		var self = this;
		//Do a check on the JsonFileUrl and crosscheck it.
		//If it doesn't match the cross-check, it needs to be updated
		//This allows for either url or _jsonFileUrl to he changed to
		//reset the store load location.  Done this way for backwards
		//compatibility.  People use _jsonFileUrl (even though officially
		//private.
		if(this._jsonFileUrl !== this._ccUrl){
			kernel.deprecated("dojo.data.ItemFileReadStore: ",
				"To change the url, set the url property of the store," +
				" not _jsonFileUrl.  _jsonFileUrl support will be removed in 2.0");
			this._ccUrl = this._jsonFileUrl;
			this.url = this._jsonFileUrl;
		}else if(this.url !== this._ccUrl){
			this._jsonFileUrl = this.url;
			this._ccUrl = this.url;
		}

		//See if there was any forced reset of data.
		if(this.data != null){
			this._jsonData = this.data;
			this.data = null;
		}

		if(this._jsonFileUrl){
				var getArgs = {
					url: this._jsonFileUrl,
					handleAs: "json-comment-optional",
					preventCache: this.urlPreventCache,
					failOk: this.failOk,
					sync: true
				};
			var getHandler = xhr.get(getArgs);
			getHandler.addCallback(function(data){
				try{
					//Check to be sure there wasn't another load going on concurrently
					//So we don't clobber data that comes in on it.  If there is a load going on
					//then do not save this data.  It will potentially clobber current data.
					//We mainly wanted to sync/wait here.
					//TODO:  Revisit the loading scheme of this store to improve multi-initial
					//request handling.
					if(self._loadInProgress !== true && !self._loadFinished){
						self._getItemsFromLoadedData(data);
						self._loadFinished = true;
					}else if(self._loadInProgress){
						//Okay, we hit an error state we can't recover from.  A forced load occurred
						//while an async load was occurring.  Since we cannot block at this point, the best
						//that can be managed is to throw an error.
						throw new Error("dojo.data.ItemFileReadStore:  Unable to perform a synchronous load, an async load is in progress.");
					}
				}catch(e){
					console.log(e);
					throw e;
				}
			});
			getHandler.addErrback(function(error){
				throw error;
			});
		}else if(this._jsonData){
			self._getItemsFromLoadedData(self._jsonData);
			self._jsonData = null;
			self._loadFinished = true;
		}
	}
});
//Mix in the simple fetch implementation to this class.
lang.extend(ItemFileReadStore,simpleFetch);

return ItemFileReadStore;
});

},
'dojo/window':function(){
define("dojo/window", ["./_base/lang", "./_base/sniff", "./_base/window", "./dom", "./dom-geometry", "./dom-style"],
	function(lang, has, baseWindow, dom, geom, style) {

// module:
//		dojo/window
// summary:
//		TODOC

var window = lang.getObject("dojo.window", true);

/*=====
dojo.window = {
	// summary:
	//		TODO
};
window = dojo.window;
=====*/

window.getBox = function(){
	// summary:
	//		Returns the dimensions and scroll position of the viewable area of a browser window

	var
		scrollRoot = (baseWindow.doc.compatMode == 'BackCompat') ? baseWindow.body() : baseWindow.doc.documentElement,
		// get scroll position
		scroll = geom.docScroll(), // scrollRoot.scrollTop/Left should work
		w, h;

	if(has("touch")){ // if(scrollbars not supported)
		var uiWindow = baseWindow.doc.parentWindow || baseWindow.doc.defaultView;   // use UI window, not dojo.global window. baseWindow.doc.parentWindow probably not needed since it's not defined for webkit
		// on mobile, scrollRoot.clientHeight <= uiWindow.innerHeight <= scrollRoot.offsetHeight, return uiWindow.innerHeight
		w = uiWindow.innerWidth || scrollRoot.clientWidth; // || scrollRoot.clientXXX probably never evaluated
		h = uiWindow.innerHeight || scrollRoot.clientHeight;
	}else{
		// on desktops, scrollRoot.clientHeight <= scrollRoot.offsetHeight <= uiWindow.innerHeight, return scrollRoot.clientHeight
		// uiWindow.innerWidth/Height includes the scrollbar and cannot be used
		w = scrollRoot.clientWidth;
		h = scrollRoot.clientHeight;
	}
	return {
		l: scroll.x,
		t: scroll.y,
		w: w,
		h: h
	};
};

window.get = function(doc){
	// summary:
	// 		Get window object associated with document doc

	// In some IE versions (at least 6.0), document.parentWindow does not return a
	// reference to the real window object (maybe a copy), so we must fix it as well
	// We use IE specific execScript to attach the real window reference to
	// document._parentWindow for later use
	if(has("ie") && window !== document.parentWindow){
		/*
		In IE 6, only the variable "window" can be used to connect events (others
		may be only copies).
		*/
		doc.parentWindow.execScript("document._parentWindow = window;", "Javascript");
		//to prevent memory leak, unset it after use
		//another possibility is to add an onUnload handler which seems overkill to me (liucougar)
		var win = doc._parentWindow;
		doc._parentWindow = null;
		return win;	//	Window
	}

	return doc.parentWindow || doc.defaultView;	//	Window
};

window.scrollIntoView = function(/*DomNode*/ node, /*Object?*/ pos){
	// summary:
	//		Scroll the passed node into view, if it is not already.

	// don't rely on node.scrollIntoView working just because the function is there

	try{ // catch unexpected/unrecreatable errors (#7808) since we can recover using a semi-acceptable native method
		node = dom.byId(node);
		var doc = node.ownerDocument || baseWindow.doc,
			body = doc.body || baseWindow.body(),
			html = doc.documentElement || body.parentNode,
			isIE = has("ie"), isWK = has("webkit");
		// if an untested browser, then use the native method
		if((!(has("mozilla") || isIE || isWK || has("opera")) || node == body || node == html) && (typeof node.scrollIntoView != "undefined")){
			node.scrollIntoView(false); // short-circuit to native if possible
			return;
		}
		var backCompat = doc.compatMode == 'BackCompat',
			clientAreaRoot = (isIE >= 9 && node.ownerDocument.parentWindow.frameElement)
				? ((html.clientHeight > 0 && html.clientWidth > 0 && (body.clientHeight == 0 || body.clientWidth == 0 || body.clientHeight > html.clientHeight || body.clientWidth > html.clientWidth)) ? html : body)
				: (backCompat ? body : html),
			scrollRoot = isWK ? body : clientAreaRoot,
			rootWidth = clientAreaRoot.clientWidth,
			rootHeight = clientAreaRoot.clientHeight,
			rtl = !geom.isBodyLtr(),
			nodePos = pos || geom.position(node),
			el = node.parentNode,
			isFixed = function(el){
				return ((isIE <= 6 || (isIE && backCompat))? false : (style.get(el, 'position').toLowerCase() == "fixed"));
			};
		if(isFixed(node)){ return; } // nothing to do

		while(el){
			if(el == body){ el = scrollRoot; }
			var elPos = geom.position(el),
				fixedPos = isFixed(el);

			if(el == scrollRoot){
				elPos.w = rootWidth; elPos.h = rootHeight;
				if(scrollRoot == html && isIE && rtl){ elPos.x += scrollRoot.offsetWidth-elPos.w; } // IE workaround where scrollbar causes negative x
				if(elPos.x < 0 || !isIE){ elPos.x = 0; } // IE can have values > 0
				if(elPos.y < 0 || !isIE){ elPos.y = 0; }
			}else{
				var pb = geom.getPadBorderExtents(el);
				elPos.w -= pb.w; elPos.h -= pb.h; elPos.x += pb.l; elPos.y += pb.t;
				var clientSize = el.clientWidth,
					scrollBarSize = elPos.w - clientSize;
				if(clientSize > 0 && scrollBarSize > 0){
					elPos.w = clientSize;
					elPos.x += (rtl && (isIE || el.clientLeft > pb.l/*Chrome*/)) ? scrollBarSize : 0;
				}
				clientSize = el.clientHeight;
				scrollBarSize = elPos.h - clientSize;
				if(clientSize > 0 && scrollBarSize > 0){
					elPos.h = clientSize;
				}
			}
			if(fixedPos){ // bounded by viewport, not parents
				if(elPos.y < 0){
					elPos.h += elPos.y; elPos.y = 0;
				}
				if(elPos.x < 0){
					elPos.w += elPos.x; elPos.x = 0;
				}
				if(elPos.y + elPos.h > rootHeight){
					elPos.h = rootHeight - elPos.y;
				}
				if(elPos.x + elPos.w > rootWidth){
					elPos.w = rootWidth - elPos.x;
				}
			}
			// calculate overflow in all 4 directions
			var l = nodePos.x - elPos.x, // beyond left: < 0
				t = nodePos.y - Math.max(elPos.y, 0), // beyond top: < 0
				r = l + nodePos.w - elPos.w, // beyond right: > 0
				bot = t + nodePos.h - elPos.h; // beyond bottom: > 0
			if(r * l > 0){
				var s = Math[l < 0? "max" : "min"](l, r);
				if(rtl && ((isIE == 8 && !backCompat) || isIE >= 9)){ s = -s; }
				nodePos.x += el.scrollLeft;
				el.scrollLeft += s;
				nodePos.x -= el.scrollLeft;
			}
			if(bot * t > 0){
				nodePos.y += el.scrollTop;
				el.scrollTop += Math[t < 0? "max" : "min"](t, bot);
				nodePos.y -= el.scrollTop;
			}
			el = (el != scrollRoot) && !fixedPos && el.parentNode;
		}
	}catch(error){
		console.error('scrollIntoView: ' + error);
		node.scrollIntoView(false);
	}
};

return window;
});

},
'dijit/_FocusMixin':function(){
define("dijit/_FocusMixin", [
	"./focus",
	"./_WidgetBase",
	"dojo/_base/declare", // declare
	"dojo/_base/lang" // lang.extend
], function(focus, _WidgetBase, declare, lang){

/*=====
	var _WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dijit/_FocusMixin
	// summary:
	//		Mixin to widget to provide _onFocus() and _onBlur() methods that
	//		fire when a widget or it's descendants get/lose focus

	// We don't know where _FocusMixin will occur in the inheritance chain, but we need the _onFocus()/_onBlur() below
	// to be last in the inheritance chain, so mixin to _WidgetBase.
	lang.extend(_WidgetBase, {
		// focused: [readonly] Boolean
		//		This widget or a widget it contains has focus, or is "active" because
		//		it was recently clicked.
		focused: false,

		onFocus: function(){
			// summary:
			//		Called when the widget becomes "active" because
			//		it or a widget inside of it either has focus, or has recently
			//		been clicked.
			// tags:
			//		callback
		},

		onBlur: function(){
			// summary:
			//		Called when the widget stops being "active" because
			//		focus moved to something outside of it, or the user
			//		clicked somewhere outside of it, or the widget was
			//		hidden.
			// tags:
			//		callback
		},

		_onFocus: function(){
			// summary:
			//		This is where widgets do processing for when they are active,
			//		such as changing CSS classes.  See onFocus() for more details.
			// tags:
			//		protected
			this.onFocus();
		},

		_onBlur: function(){
			// summary:
			//		This is where widgets do processing for when they stop being active,
			//		such as changing CSS classes.  See onBlur() for more details.
			// tags:
			//		protected
			this.onBlur();
		}
	});

	return declare("dijit._FocusMixin", null, {
		// summary:
		//		Mixin to widget to provide _onFocus() and _onBlur() methods that
		//		fire when a widget or it's descendants get/lose focus

		// flag that I want _onFocus()/_onBlur() notifications from focus manager
		_focusManager: focus
	});

});

},
'dojo/data/util/filter':function(){
define("dojo/data/util/filter", ["dojo/_base/lang"], function(lang) {
	// module:
	//		dojo/data/util/filter
	// summary:
	//		TODOC

var filter = lang.getObject("dojo.data.util.filter", true);

filter.patternToRegExp = function(/*String*/pattern, /*boolean?*/ ignoreCase){
	//	summary:
	//		Helper function to convert a simple pattern to a regular expression for matching.
	//	description:
	//		Returns a regular expression object that conforms to the defined conversion rules.
	//		For example:
	//			ca*   -> /^ca.*$/
	//			*ca*  -> /^.*ca.*$/
	//			*c\*a*  -> /^.*c\*a.*$/
	//			*c\*a?*  -> /^.*c\*a..*$/
	//			and so on.
	//
	//	pattern: string
	//		A simple matching pattern to convert that follows basic rules:
	//			* Means match anything, so ca* means match anything starting with ca
	//			? Means match single character.  So, b?b will match to bob and bab, and so on.
	//      	\ is an escape character.  So for example, \* means do not treat * as a match, but literal character *.
	//				To use a \ as a character in the string, it must be escaped.  So in the pattern it should be
	//				represented by \\ to be treated as an ordinary \ character instead of an escape.
	//
	//	ignoreCase:
	//		An optional flag to indicate if the pattern matching should be treated as case-sensitive or not when comparing
	//		By default, it is assumed case sensitive.

	var rxp = "^";
	var c = null;
	for(var i = 0; i < pattern.length; i++){
		c = pattern.charAt(i);
		switch(c){
			case '\\':
				rxp += c;
				i++;
				rxp += pattern.charAt(i);
				break;
			case '*':
				rxp += ".*"; break;
			case '?':
				rxp += "."; break;
			case '$':
			case '^':
			case '/':
			case '+':
			case '.':
			case '|':
			case '(':
			case ')':
			case '{':
			case '}':
			case '[':
			case ']':
				rxp += "\\"; //fallthrough
			default:
				rxp += c;
		}
	}
	rxp += "$";
	if(ignoreCase){
		return new RegExp(rxp,"mi"); //RegExp
	}else{
		return new RegExp(rxp,"m"); //RegExp
	}

};

return filter;
});

},
'versa/api/Role':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 11/10/11
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Role", ["dojo/_base/declare",
        "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.Role", [versa.api._Object], {
             constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            }
        });

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'permissions': {
                    type: 'integer'
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string'
                },
                'updated_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'updated_by': {
                    type: 'string'
                }

            },
            prototype: new o()
        };
        return o;
    }
);




},
'versa/api/Operators':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 21/11/11
 * Time: 8:46 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Operators", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Operator"],
    function(declare){
        var o=declare("versa.api.Operators", [versa.api._Collection], {
            _andOp: null,

            _fetch_onComplete: function(items, request){

                this.isLoaded = true;
                if((items != null) && (items.length > 1)){
                    this.first = items[0];
                }

                dojo.forEach(items, function(item,idx){
                    if(item.name == 'and')
                        this._andOp = item;
                }, this);

            },

            constructor: function(args){
                this.target = versa.api.Operators.TRGT;
                this.schema = versa.api.Operator.schema;
                this.cache = true;

                this._initialize();
            },

            byDataType: function(id){
                var ops = []

                this.forEach(function(item){
                    if(item.data_type_id == id)
                        ops.push(item);
                }, this);

                return ops;
            },

            getAndOp: function(){
                return this._andOp;
            }
        });

        o.TRGT = '/operators';

        return o;
    }
);


},
'versa/api/Reference':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 04/04/12
 * Time: 12:36 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Reference", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/_Securable",
        "versa/api/Utilities",
        "versa/api/Document"],
    function(declare){
        var o=declare("versa.api.Reference",
                [versa.api._Object,
                 versa.api._Securable], {
            zone: null,
            library: null,

            clean_properties: function(args){
                var library = args.library;

                var document_type = library.getDocumentTypes().fetchById({id: this.document_type_id});

                //For each property
                for(var p in this){
                    //exclude functions
                    if(!dojo.isFunction(this[p])){
                        //retrieve the property_definition based on dbName (only lookup documents.*)
                        var dbName = dojo.replace('documents.{0}', [p]);
                        var property_definition = library.getPropertyDefinitions().fetchByDbName(dbName);

                        //Exclude if property wasn't found or is a system property
                        if((property_definition) && (!property_definition.is_system)){
                            //if current document type does not include property, delete it.
                            if(!document_type.hasProperty(property_definition.id)){
                                delete this[p];
                            }
                        }

                    }
                }

            },

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
                this.securable_type = versa.api._Securable.types.Reference;
            },

            cancelCheckout: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Reference.XCKO_TRGT,  [zone.subdomain, library.id, this.getId()]);

                var putData = {
                };

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            },

            checkin: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Reference.CKI_TRGT,  [zone.subdomain, library.id, this.getId()]);
                var putData = dojo.fromJson(dojox.json.ref.toJson(this, false, '', true));;

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            },

            checkout: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Reference.CKO_TRGT,  [zone.subdomain, library.id, this.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            },

            getCopyUrl: function(zone, library){
                return dojo.replace(versa.api.Reference.CP_TRGT, [zone.subdomain, library.id, this.getId()])
            },

            getCopyVersionUrl: function(zone, library, version){
                return dojo.replace(versa.api.Reference.CPV_TRGT, [zone.subdomain, library.id, this.getId(), version]);
            },

            copyLocal: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = (args.version_id) ?
                                this.getCopyVersionUrl(zone, library, args.version_id):
                                this.getCopyUrl(zone, library);

                versa.api.Utilities.saveUrl({
                    url: url,
                    window_name: 'versa_save'
                });

            },

            file: function(args){
                var zone = args.zone;
                var library = args.library;
                var folder = args.folder;

                var url = dojo.replace(versa.api.Reference.FILE_TRGT,  [zone.subdomain, library.id, this.getId(), folder.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                //simulate removal from current results.
                library.getReferences().store.onDelete(this);
                return true;
            },

            getPermissionSet: function(folder, library, user){
                var prmSet = new versa.api.PermissionSet();

                prmSet.setValue(versa.api.PermissionIndices.VIEW, this.hasRights(versa.api._Securable.permissions.VIEW));
                prmSet.setValue(versa.api.PermissionIndices.COPY, this.hasRights(versa.api._Securable.permissions.VIEW));
                prmSet.setValue(versa.api.PermissionIndices.EDIT, this.hasRights(versa.api._Securable.permissions.WRITE_METADATA));
                prmSet.setValue(versa.api.PermissionIndices.MOVE, prmSet.getValue(versa.api.PermissionIndices.EDIT));
                prmSet.setValue(versa.api.PermissionIndices.CKO, (this.hasRights(versa.api._Securable.permissions.VERSION) && this.getState(versa.api.Document.states.CHECKED_IN)));
                prmSet.setValue(versa.api.PermissionIndices.CKI, (this.hasRights(versa.api._Securable.permissions.VERSION) && this.getState(versa.api.Document.states.CHECKED_OUT) && (this.checked_out_by == user.name)));
                prmSet.setValue(versa.api.PermissionIndices.CANCEL_CKO, prmSet.getValue(versa.api.PermissionIndices.CKI));
                prmSet.setValue(versa.api.PermissionIndices.DELETE, this.hasRights(versa.api._Securable.permissions.DELETE_ITEMS));
                prmSet.setValue(versa.api.PermissionIndices.SECURE, this.hasRights(versa.api._Securable.permissions.WRITE_ACL));

                prmSet.setValue(versa.api.PermissionIndices.RESTORE, this.hasRights(versa.api._Securable.permissions.DELETE_ITEMS));
                prmSet.setValue(versa.api.PermissionIndices.DESTROY, this.hasRights(versa.api._Securable.permissions.DELETE_ITEMS));

                return prmSet;
            },

            getState: function(stateFlag){
               return ((this.state & stateFlag) == stateFlag);
            },

            isDeleted: function(){
                return this.getState(versa.api.Document.states.DELETED);
            },

            isShare: function(){
                return this.reference_type == versa.api.Reference.types.SHARE;
            },

            restore: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Reference.RESTORE_TRGT,  [zone.subdomain, library.getId(), this.getId()]);
                var putData = {
                    folder_id: (args.folder) ? args.folder.id : null
                };

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                //simulate removal from 'recycle bin'.
                library.getReferences().store.onDelete(this);
                return true;
            },

            share: function(args){
                var zone = args.zone;
                var library = args.library;
                var folder = args.folder;

                var url = dojo.replace(versa.api.Reference.SHARE_TRGT,  [zone.subdomain, library.id, this.getId(), folder.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            },

            unshare: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Reference.UNSHARE_TRGT,  [zone.subdomain, library.id, this.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                //simulate removal from current results.
                library.getReferences().store.onDelete(this);

                return true;
            },

            getViewUrl: function(zone, library){
                return dojo.replace(versa.api.Reference.VW_TRGT, [zone.subdomain, library.id, this.getId()]);
            },

            getViewVersionUrl: function(zone, library, version){
                return dojo.replace(versa.api.Reference.VWV_TRGT, [zone.subdomain, library.id, this.getId(), version])
            },

            view: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = (args.version_id) ?
                                this.getViewVersionUrl(zone, library, args.version_id) :
                                this.getViewUrl(zone, library);


                versa.api.Utilities.viewUrl({
                    windowBox: args.windowBox,
                    url: url,
                    window_name: 'versa_viewer'
                });
            }
        });

        o.VW_TRGT = '/zones/{0}/libraries/{1}/references/{2}/download/?disposition=inline'
        o.VWV_TRGT = '/zones/{0}/libraries/{1}/references/{2}/download/?disposition=inline&version_id={3}'
        o.CP_TRGT = '/zones/{0}/libraries/{1}/references/{2}/download/?disposition=attachment';
        o.CPV_TRGT = '/zones/{0}/libraries/{1}/references/{2}/download/?disposition=attachment&version_id={3}';
        o.CKO_TRGT = '/zones/{0}/libraries/{1}/references/{2}/checkout.json';
        o.CKI_TRGT  = '/zones/{0}/libraries/{1}/references/{2}/checkin.json';
        o.XCKO_TRGT = '/zones/{0}/libraries/{1}/references/{2}/cancel_checkout.json';
        o.FILE_TRGT = '/zones/{0}/libraries/{1}/references/{2}/file.json?folder_id={3}';
        o.SHARE_TRGT = '/zones/{0}/libraries/{1}/references/{2}/share.json?folder_id={3}'
        o.UNSHARE_TRGT = '/zones/{0}/libraries/{1}/references/{2}/unshare.json?'
        o.RESTORE_TRGT  = '/zones/{0}/libraries/{1}/references/{2}/restore.json';

        o.types = {
            'CONTENT':  0x0000,
            'SHARE':    0x0011,
            'TRASH':    0x0012
        }

        console.log(versa);
        console.log(versa.api);
        console.log(versa.api.Document);
        console.log(versa.api.Document.states);

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'reference_type': {
                    type: 'integer'
                },
                'state': {
                    type: 'integer',
                    'default': versa.api.Document.states.PENDING
                }
            },

            prototype: new o()
        };

        return o;
    }
);

},
'dojox/json/ref':function(){
define("dojox/json/ref", ["dojo/_base/kernel", "dojox", "dojo/date/stamp", "dojo/_base/array", "dojo/_base/json"], function(dojo, dojox){

dojo.getObject("json", true, dojox);

return dojox.json.ref = {
	// summary:
	// 		Adds advanced JSON {de}serialization capabilities to the base json library.
	// 		This enhances the capabilities of dojo.toJson and dojo.fromJson,
	// 		adding referencing support, date handling, and other extra format handling.
	// 		On parsing, references are resolved. When references are made to
	// 		ids/objects that have been loaded yet, the loader function will be set to
	// 		_loadObject to denote a lazy loading (not loaded yet) object.


	resolveJson: function(/*Object*/ root,/*Object?*/ args){
		// summary:
		// 		Indexes and resolves references in the JSON object.
		// description:
		// 		A JSON Schema object that can be used to advise the handling of the JSON (defining ids, date properties, urls, etc)
		//
		// root:
		//		The root object of the object graph to be processed
		// args:
		//		Object with additional arguments:
		//
		// The *index* parameter.
		//		This is the index object (map) to use to store an index of all the objects.
		// 		If you are using inter-message referencing, you must provide the same object for each call.
		// The *defaultId* parameter.
		//		This is the default id to use for the root object (if it doesn't define it's own id)
		//	The *idPrefix* parameter.
		//		This the prefix to use for the ids as they enter the index. This allows multiple tables
		// 		to use ids (that might otherwise collide) that enter the same global index.
		// 		idPrefix should be in the form "/Service/".  For example,
		//		if the idPrefix is "/Table/", and object is encountered {id:"4",...}, this would go in the
		//		index as "/Table/4".
		//	The *idAttribute* parameter.
		//		This indicates what property is the identity property. This defaults to "id"
		//	The *assignAbsoluteIds* parameter.
		//		This indicates that the resolveJson should assign absolute ids (__id) as the objects are being parsed.
		//
		// The *schemas* parameter
		//		This provides a map of schemas, from which prototypes can be retrieved
		// The *loader* parameter
		//		This is a function that is called added to the reference objects that can't be resolved (lazy objects)
		// return:
		//		An object, the result of the processing
		args = args || {};
		var idAttribute = args.idAttribute || 'id';
		var refAttribute = this.refAttribute;
		var idAsRef = args.idAsRef;
		var prefix = args.idPrefix || '';
		var assignAbsoluteIds = args.assignAbsoluteIds;
		var index = args.index || {}; // create an index if one doesn't exist
		var timeStamps = args.timeStamps;
		var ref,reWalk=[];
		var pathResolveRegex = /^(.*\/)?(\w+:\/\/)|[^\/\.]+\/\.\.\/|^.*\/(\/)/;
		var addProp = this._addProp;
		var F = function(){};
		function walk(it, stop, defaultId, needsPrefix, schema, defaultObject){
			// this walks the new graph, resolving references and making other changes
		 	var i, update, val, id = idAttribute in it ? it[idAttribute] : defaultId;
		 	if(idAttribute in it || ((id !== undefined) && needsPrefix)){
		 		id = (prefix + id).replace(pathResolveRegex,'$2$3');
		 	}
		 	var target = defaultObject || it;
			if(id !== undefined){ // if there is an id available...
				if(assignAbsoluteIds){
					it.__id = id;
				}
				if(args.schemas && (!(it instanceof Array)) && // won't try on arrays to do prototypes, plus it messes with queries
		 					(val = id.match(/^(.+\/)[^\.\[]*$/))){ // if it has a direct table id (no paths)
		 			schema = args.schemas[val[1]];
				}
				// if the id already exists in the system, we should use the existing object, and just
				// update it... as long as the object is compatible
				if(index[id] && ((it instanceof Array) == (index[id] instanceof Array))){
					target = index[id];
					delete target.$ref; // remove this artifact
					delete target._loadObject;
					update = true;
				}else{
				 	var proto = schema && schema.prototype; // and if has a prototype
					if(proto){
						// if the schema defines a prototype, that needs to be the prototype of the object
						F.prototype = proto;
						target = new F();
					}
				}
				index[id] = target; // add the prefix, set _id, and index it
				if(timeStamps){
					timeStamps[id] = args.time;
				}
			}
			while(schema){
				var properties = schema.properties;
				if(properties){
					for(i in it){
						var propertyDefinition = properties[i];
						if(propertyDefinition && propertyDefinition.format == 'date-time' && typeof it[i] == 'string'){
							it[i] = dojo.date.stamp.fromISOString(it[i]);
						}
					}
				}
				schema = schema["extends"];
			}
			var length = it.length;
			for(i in it){
				if(i==length){
					break;
				}
				if(it.hasOwnProperty(i)){
					val=it[i];
					if((typeof val =='object') && val && !(val instanceof Date) && i != '__parent'){
						ref=val[refAttribute] || (idAsRef && val[idAttribute]);
						if(!ref || !val.__parent){
							if(it != reWalk){
								val.__parent = target;
							}
						}
						if(ref){ // a reference was found
							// make sure it is a safe reference
							delete it[i];// remove the property so it doesn't resolve to itself in the case of id.propertyName lazy values
							var path = ref.toString().replace(/(#)([^\.\[])/,'$1.$2').match(/(^([^\[]*\/)?[^#\.\[]*)#?([\.\[].*)?/); // divide along the path
							if(index[(prefix + ref).replace(pathResolveRegex,'$2$3')]){
								ref = index[(prefix + ref).replace(pathResolveRegex,'$2$3')];
							}else if((ref = (path[1]=='$' || path[1]=='this' || path[1]=='') ? root : index[(prefix + path[1]).replace(pathResolveRegex,'$2$3')])){  // a $ indicates to start with the root, otherwise start with an id
								// if there is a path, we will iterate through the path references
								if(path[3]){
									path[3].replace(/(\[([^\]]+)\])|(\.?([^\.\[]+))/g,function(t,a,b,c,d){
										ref = ref && ref[b ? b.replace(/[\"\'\\]/,'') : d];
									});
								}
							}
							if(ref){
								val = ref;
							}else{
								// otherwise, no starting point was found (id not found), if stop is set, it does not exist, we have
								// unloaded reference, if stop is not set, it may be in a part of the graph not walked yet,
								// we will wait for the second loop
								if(!stop){
									var rewalking;
									if(!rewalking){
										reWalk.push(target); // we need to rewalk it to resolve references
									}
									rewalking = true; // we only want to add it once
									val = walk(val, false, val[refAttribute], true, propertyDefinition);
									// create a lazy loaded object
									val._loadObject = args.loader;
								}
							}
						}else{
							if(!stop){ // if we are in stop, that means we are in the second loop, and we only need to check this current one,
								// further walking may lead down circular loops
								val = walk(
									val,
									reWalk==it,
									id === undefined ? undefined : addProp(id, i), // the default id to use
									false,
									propertyDefinition,
									// if we have an existing object child, we want to
									// maintain it's identity, so we pass it as the default object
									target != it && typeof target[i] == 'object' && target[i]
								);
							}
						}
					}
					it[i] = val;
					if(target!=it && !target.__isDirty){// do updates if we are updating an existing object and it's not dirty
						var old = target[i];
						target[i] = val; // only update if it changed
						if(update && val !== old && // see if it is different
								!target._loadObject && // no updates if we are just lazy loading
								!(i.charAt(0) == '_' && i.charAt(1) == '_') && i != "$ref" &&
								!(val instanceof Date && old instanceof Date && val.getTime() == old.getTime()) && // make sure it isn't an identical date
								!(typeof val == 'function' && typeof old == 'function' && val.toString() == old.toString()) && // make sure it isn't an indentical function
								index.onUpdate){
							index.onUpdate(target,i,old,val); // call the listener for each update
						}
					}
				}
			}
	
			if(update && (idAttribute in it || target instanceof Array)){
				// this means we are updating with a full representation of the object, we need to remove deleted
				for(i in target){
					if(!target.__isDirty && target.hasOwnProperty(i) && !it.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_') && !(target instanceof Array && isNaN(i))){
						if(index.onUpdate && i != "_loadObject" && i != "_idAttr"){
							index.onUpdate(target,i,target[i],undefined); // call the listener for each update
						}
						delete target[i];
						while(target instanceof Array && target.length && target[target.length-1] === undefined){
							// shorten the target if necessary
							target.length--;
						}
					}
				}
			}else{
				if(index.onLoad){
					index.onLoad(target);
				}
			}
			return target;
		}
		if(root && typeof root == 'object'){
			root = walk(root,false,args.defaultId, true); // do the main walk through
			walk(reWalk,false); // re walk any parts that were not able to resolve references on the first round
		}
		return root;
	},


	fromJson: function(/*String*/ str,/*Object?*/ args){
	// summary:
	// 		evaluates the passed string-form of a JSON object.
	//
	// str:
	//		a string literal of a JSON item, for instance:
	//			'{ "foo": [ "bar", 1, { "baz": "thud" } ] }'
	// args: See resolveJson
	//
	// return:
	//		An object, the result of the evaluation
		function ref(target){ // support call styles references as well
			var refObject = {};
			refObject[this.refAttribute] = target;
			return refObject;
		}
		try{
			var root = eval('(' + str + ')'); // do the eval
		}catch(e){
			throw new SyntaxError("Invalid JSON string: " + e.message + " parsing: "+ str);
		}
		if(root){
			return this.resolveJson(root, args);
		}
		return root;
	},
	
	toJson: function(/*Object*/ it, /*Boolean?*/ prettyPrint, /*Object?*/ idPrefix, /*Object?*/ indexSubObjects){
		// summary:
		//		Create a JSON serialization of an object.
		//		This has support for referencing, including circular references, duplicate references, and out-of-message references
		// 		id and path-based referencing is supported as well and is based on http://www.json.com/2007/10/19/json-referencing-proposal-and-library/.
		//
		// it:
		//		an object to be serialized.
		//
		// prettyPrint:
		//		if true, we indent objects and arrays to make the output prettier.
		//		The variable dojo.toJsonIndentStr is used as the indent string
		//		-- to use something other than the default (tab),
		//		change that variable before calling dojo.toJson().
		//
		// idPrefix: The prefix that has been used for the absolute ids
		//
		// return:
		//		a String representing the serialized version of the passed object.
		var useRefs = this._useRefs;
		var addProp = this._addProp;
		var refAttribute = this.refAttribute;
		idPrefix = idPrefix || ''; // the id prefix for this context
		var paths={};
		var generated = {};
		function serialize(it,path,_indentStr){
			if(typeof it == 'object' && it){
				var value;
				if(it instanceof Date){ // properly serialize dates
					return '"' + dojo.date.stamp.toISOString(it,{zulu:true}) + '"';
				}
				var id = it.__id;
				if(id){ // we found an identifiable object, we will just serialize a reference to it... unless it is the root
					if(path != '#' && ((useRefs && !id.match(/#/)) || paths[id])){
						var ref = id;
						if(id.charAt(0)!='#'){
							if(it.__clientId == id){
								ref = "cid:" + id;
							}else if(id.substring(0, idPrefix.length) == idPrefix){ // see if the reference is in the current context
								// a reference with a prefix matching the current context, the prefix should be removed
								ref = id.substring(idPrefix.length);
							}else{
								// a reference to a different context, assume relative url based referencing
								ref = id;
							}
						}
						var refObject = {};
						refObject[refAttribute] = ref;
						return serialize(refObject,'#');
					}
					path = id;
				}else{
					it.__id = path; // we will create path ids for other objects in case they are circular
					generated[path] = it;
				}
				paths[path] = it;// save it here so they can be deleted at the end
				_indentStr = _indentStr || "";
				var nextIndent = prettyPrint ? _indentStr + dojo.toJsonIndentStr : "";
				var newLine = prettyPrint ? "\n" : "";
				var sep = prettyPrint ? " " : "";
	
				if(it instanceof Array){
					var res = dojo.map(it, function(obj,i){
						var val = serialize(obj, addProp(path, i), nextIndent);
						if(typeof val != "string"){
							val = "undefined";
						}
						return newLine + nextIndent + val;
					});
					return "[" + res.join("," + sep) + newLine + _indentStr + "]";
				}
	
				var output = [];
				for(var i in it){
					if(it.hasOwnProperty(i)){
						var keyStr;
						if(typeof i == "number"){
							keyStr = '"' + i + '"';
						}else if(typeof i == "string" && (i.charAt(0) != '_' || i.charAt(1) != '_')){
							// we don't serialize our internal properties __id and __clientId
							keyStr = dojo._escapeString(i);
						}else{
							// skip non-string or number keys
							continue;
						}
						var val = serialize(it[i],addProp(path, i),nextIndent);
						if(typeof val != "string"){
							// skip non-serializable values
							continue;
						}
						output.push(newLine + nextIndent + keyStr + ":" + sep + val);
					}
				}
				return "{" + output.join("," + sep) + newLine + _indentStr + "}";
			}else if(typeof it == "function" && dojox.json.ref.serializeFunctions){
				return it.toString();
			}
	
			return dojo.toJson(it); // use the default serializer for primitives
		}
		var json = serialize(it,'#','');
		if(!indexSubObjects){
			for(var i in generated)  {// cleanup the temporary path-generated ids
				delete generated[i].__id;
			}
		}
		return json;
	},
	_addProp: function(id, prop){
		return id + (id.match(/#/) ? id.length == 1 ? '' : '.' : '#') + prop;
	},
	//	refAttribute: String
	//		This indicates what property is the reference property. This acts like the idAttribute
	// 		except that this is used to indicate the current object is a reference or only partially
	// 		loaded. This defaults to "$ref".
	refAttribute: "$ref",
	_useRefs: false,
	serializeFunctions: false
};
});

},
'dojox/mobile/View':function(){
define("dojox/mobile/View", [
	"dojo/_base/kernel", // to test dojo.hash
	"dojo/_base/array",
	"dojo/_base/config",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/_base/Deferred",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/dom-style",
//	"dojo/hash", // optionally prereq'ed
	"dijit/registry",	// registry.byNode
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./ViewController", // to load ViewController for you (no direct references)
	"./transition"
], function(dojo, array, config, connect, declare, lang, has, win, Deferred, dom, domClass, domGeometry, domStyle, registry, Contained, Container, WidgetBase, ViewController, transitDeferred){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
	var ViewController = dojox.mobile.ViewController;
=====*/

	// module:
	//		dojox/mobile/View
	// summary:
	//		A widget that represents a view that occupies the full screen

	var dm = lang.getObject("dojox.mobile", true);

	return declare("dojox.mobile.View", [WidgetBase, Container, Contained], {
		// summary:
		//		A widget that represents a view that occupies the full screen
		// description:
		//		View acts as a container for any HTML and/or widgets. An entire
		//		HTML page can have multiple View widgets and the user can
		//		navigate through the views back and forth without page
		//		transitions.
	
		// selected: Boolean
		//		If true, the view is displayed at startup time.
		selected: false,

		// keepScrollPos: Boolean
		//		If true, the scroll position is kept between views.
		keepScrollPos: true,
	
		constructor: function(params, node){
			if(node){
				dom.byId(node).style.visibility = "hidden";
			}
			this._aw = has("android") >= 2.2 && has("android") < 3; // flag for android animation workaround
		},
	
		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement("DIV");
			this.domNode.className = "mblView";
			this.connect(this.domNode, "webkitAnimationEnd", "onAnimationEnd");
			this.connect(this.domNode, "webkitAnimationStart", "onAnimationStart");
			if(!config['mblCSS3Transition']){
			    this.connect(this.domNode, "webkitTransitionEnd", "onAnimationEnd");
			}
			var id = location.href.match(/#(\w+)([^\w=]|$)/) ? RegExp.$1 : null;
	
			this._visible = this.selected && !id || this.id == id;
	
			if(this.selected){
				dm._defaultView = this;
			}
		},

		startup: function(){
			if(this._started){ return; }
			var siblings = [];
			var children = this.domNode.parentNode.childNodes;
			var visible = false;
			// check if a visible view exists
			for(var i = 0; i < children.length; i++){
				var c = children[i];
				if(c.nodeType === 1 && domClass.contains(c, "mblView")){
					siblings.push(c);
					visible = visible || registry.byNode(c)._visible;
				}
			}
			var _visible = this._visible;
			// if no visible view exists, make the first view visible
			if(siblings.length === 1 || (!visible && siblings[0] === this.domNode)){
				_visible = true;
			}
			var _this = this;
			setTimeout(function(){ // necessary to render the view correctly
				if(!_visible){
					_this.domNode.style.display = "none";
				}else{
					dm.currentView = _this; //TODO:1.8 reconsider this. currentView may not have a currently showing view when views are nested.
					_this.onStartView();
					connect.publish("/dojox/mobile/startView", [_this]);
				}
				if(_this.domNode.style.visibility != "visible"){ // this check is to avoid screen flickers
					_this.domNode.style.visibility = "visible";
				}
				var parent = _this.getParent && _this.getParent();
				if(!parent || !parent.resize){ // top level widget
					_this.resize();
				}
			}, has("ie") ? 100 : 0); // give IE a little time to complete drawing
			this.inherited(arguments);
		},
	
		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		onStartView: function(){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called only when this view is shown at startup time.
		},
	
		onBeforeTransitionIn: function(moveTo, dir, transition, context, method){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called before the arriving transition occurs.
		},
	
		onAfterTransitionIn: function(moveTo, dir, transition, context, method){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called after the arriving transition occurs.
		},
	
		onBeforeTransitionOut: function(moveTo, dir, transition, context, method){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called before the leaving transition occurs.
		},
	
		onAfterTransitionOut: function(moveTo, dir, transition, context, method){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called after the leaving transition occurs.
		},
	
		_saveState: function(moveTo, dir, transition, context, method){
			this._context = context;
			this._method = method;
			if(transition == "none"){
				transition = null;
			}
			this._moveTo = moveTo;
			this._dir = dir;
			this._transition = transition;
			this._arguments = lang._toArray(arguments);
			this._args = [];
			if(context || method){
				for(var i = 5; i < arguments.length; i++){
					this._args.push(arguments[i]);
				}
			}
		},
		
		_fixViewState: function(/*DomNode*/toNode){
			// summary:
			//		Sanity check for view transition states.
			// description:
			//		Sometimes uninitialization of Views fails after making view transition,
			//		and that results in failure of subsequent view transitions.
			//		This function does the uninitialization for all the sibling views.
			var nodes = this.domNode.parentNode.childNodes;
			for(var i = 0; i < nodes.length; i++){
				var n = nodes[i];
				if(n.nodeType === 1 && domClass.contains(n, "mblView")){
					n.className = "mblView"; //TODO: Should remove classes one by one. This would clear user defined classes or even mblScrollableView.
				}
			}
			toNode.className = "mblView"; // just in case toNode is a sibling of an ancestor.
		},
	
		convertToId: function(moveTo){
			if(typeof(moveTo) == "string"){
				// removes a leading hash mark (#) and params if exists
				// ex. "#bar&myParam=0003" -> "bar"
				moveTo.match(/^#?([^&?]+)/);
				return RegExp.$1;
			}
			return moveTo;
		},
	
		performTransition: function(/*String*/moveTo, /*Number*/dir, /*String*/transition,
									/*Object|null*/context, /*String|Function*/method /*optional args*/){
			// summary:
			//		Function to perform the various types of view transitions, such as fade, slide, and flip.
			// moveTo: String
			//		The id of the transition destination view which resides in
			//		the current page.
			//		If the value has a hash sign ('#') before the id
			//		(e.g. #view1) and the dojo.hash module is loaded by the user
			//		application, the view transition updates the hash in the
			//		browser URL so that the user can bookmark the destination
			//		view. In this case, the user can also use the browser's
			//		back/forward button to navigate through the views in the
			//		browser history.
			//		If null, transitions to a blank view.
			//		If '#', returns immediately without transition.
			// dir: Number
			//		The transition direction. If 1, transition forward. If -1, transition backward.
			//		For example, the slide transition slides the view from right to left when dir == 1,
			//		and from left to right when dir == -1.
			// transition: String
			//		A type of animated transition effect. You can choose from
			//		the standard transition types, "slide", "fade", "flip", or
			//		from the extended transition types, "cover", "coverv",
			//		"dissolve", "reveal", "revealv", "scaleIn",
			//		"scaleOut", "slidev", "swirl", "zoomIn", "zoomOut". If
			//		"none" is specified, transition occurs immediately without
			//		animation.
			// context: Object
			//		The object that the callback function will receive as "this".
			// method: String|Function
			//		A callback function that is called when the transition has been finished.
			//		A function reference, or name of a function in context.
			// tags:
			//		public
			//
			// example:
			//		Transition backward to a view whose id is "foo" with the slide animation.
			//	|	performTransition("foo", -1, "slide");
			//
			// example:
			//		Transition forward to a blank view, and then open another page.
			//	|	performTransition(null, 1, "slide", null, function(){location.href = href;});
			if(moveTo === "#"){ return; }
			if(dojo.hash){
				if(typeof(moveTo) == "string" && moveTo.charAt(0) == '#' && !dm._params){
					dm._params = [];
					for(var i = 0; i < arguments.length; i++){
						dm._params.push(arguments[i]);
					}
					dojo.hash(moveTo);
					return;
				}
			}
			this._saveState.apply(this, arguments);
			var toNode;
			if(moveTo){
				toNode = this.convertToId(moveTo);
			}else{
				if(!this._dummyNode){
					this._dummyNode = win.doc.createElement("DIV");
					win.body().appendChild(this._dummyNode);
				}
				toNode = this._dummyNode;
			}
			var fromNode = this.domNode;
			var fromTop = fromNode.offsetTop;
			toNode = this.toNode = dom.byId(toNode);
			if(!toNode){ console.log("dojox.mobile.View#performTransition: destination view not found: "+moveTo); return; }
			toNode.style.visibility = this._aw ? "visible" : "hidden";
			toNode.style.display = "";
			this._fixViewState(toNode);
			var toWidget = registry.byNode(toNode);
			if(toWidget){
				// Now that the target view became visible, it's time to run resize()
				if(config["mblAlwaysResizeOnTransition"] || !toWidget._resized){
					dm.resizeAll(null, toWidget);
					toWidget._resized = true;
				}
	
				if(transition && transition != "none"){
					// Temporarily add padding to align with the fromNode while transition
					toWidget.containerNode.style.paddingTop = fromTop + "px";
				}

				toWidget.movedFrom = fromNode.id;
			}
	
			this.onBeforeTransitionOut.apply(this, arguments);
			connect.publish("/dojox/mobile/beforeTransitionOut", [this].concat(lang._toArray(arguments)));
			if(toWidget){
				// perform view transition keeping the scroll position
				if(this.keepScrollPos && !this.getParent()){
					var scrollTop = win.body().scrollTop || win.doc.documentElement.scrollTop || win.global.pageYOffset || 0;
					fromNode._scrollTop = scrollTop;
					var toTop = (dir == 1) ? 0 : (toNode._scrollTop || 0);
					toNode.style.top = "0px";
					if(scrollTop > 1 || toTop !== 0){
						fromNode.style.top = toTop - scrollTop + "px";
						if(config["mblHideAddressBar"] !== false){
							setTimeout(function(){ // iPhone needs setTimeout
								win.global.scrollTo(0, (toTop || 1));
							}, 0);
						}
					}
				}else{
					toNode.style.top = "0px";
				}
				toWidget.onBeforeTransitionIn.apply(toWidget, arguments);
				connect.publish("/dojox/mobile/beforeTransitionIn", [toWidget].concat(lang._toArray(arguments)));
			}
			if(!this._aw){
				toNode.style.display = "none";
				toNode.style.visibility = "visible";
			}
			
			if(dm._iw && dm.scrollable){ // Workaround for iPhone flicker issue (only when scrollable.js is loaded)
				var ss = dm.getScreenSize();
				// Show cover behind the view.
				// cover's z-index is set to -10000, lower than z-index value specified in transition css.
				win.body().appendChild(dm._iwBgCover);
				domStyle.set(dm._iwBgCover, {
					position: "absolute",
					top: "0px",
					left: "0px",
					height: (ss.h + 1) + "px", // "+1" means the height of scrollTo(0,1)
					width: ss.w + "px",
					backgroundColor: domStyle.get(win.body(), "background-color"),
					zIndex: -10000,
					display: ""
				});
				// Show toNode behind the cover.
				domStyle.set(toNode, {
					position: "absolute",
					zIndex: -10001,
					visibility: "visible",
					display: ""
				});
				// setTimeout seems to be necessary to avoid flicker.
				// Also the duration of setTimeout should be long enough to avoid flicker.
				// 0 is not effective. 50 sometimes causes flicker.
				setTimeout(lang.hitch(this, function(){
					this._doTransition(fromNode, toNode, transition, dir);
				}), 80);
			}else{
				this._doTransition(fromNode, toNode, transition, dir);
			}
		},
		_toCls: function(s){
			// convert from transition name to corresponding class name
			// ex. "slide" -> "mblSlide"
			return "mbl"+s.charAt(0).toUpperCase() + s.substring(1);
		},
	
		_doTransition: function(fromNode, toNode, transition, dir){
			var rev = (dir == -1) ? " mblReverse" : "";
			if(dm._iw && dm.scrollable){ // Workaround for iPhone flicker issue (only when scrollable.js is loaded)
				// Show toNode after flicker ends
				domStyle.set(toNode, {
					position: "",
					zIndex: ""
				});
				// Remove cover
				win.body().removeChild(dm._iwBgCover);
			}else if(!this._aw){
				toNode.style.display = "";
			}
			if(!transition || transition == "none"){
				this.domNode.style.display = "none";
				this.invokeCallback();
			}else if(config['mblCSS3Transition']){
				//get dojox/css3/transit first
				Deferred.when(transitDeferred, lang.hitch(this, function(transit){
					//follow the style of .mblView.mblIn in View.css
					//need to set the toNode to absolute position
					var toPosition = domStyle.get(toNode, "position");
					domStyle.set(toNode, "position", "absolute");
					Deferred.when(transit(fromNode, toNode, {transition: transition, reverse: (dir===-1)?true:false}),lang.hitch(this,function(){
						domStyle.set(toNode, "position", toPosition);
						this.invokeCallback();
					}));
				}));
			}else{
				var s = this._toCls(transition);
				domClass.add(fromNode, s + " mblOut" + rev);
				domClass.add(toNode, s + " mblIn" + rev);
				setTimeout(function(){
					domClass.add(fromNode, "mblTransition");
					domClass.add(toNode, "mblTransition");
				}, 100);
				// set transform origin
				var fromOrigin = "50% 50%";
				var toOrigin = "50% 50%";
				var scrollTop, posX, posY;
				if(transition.indexOf("swirl") != -1 || transition.indexOf("zoom") != -1){
					if(this.keepScrollPos && !this.getParent()){
						scrollTop = win.body().scrollTop || win.doc.documentElement.scrollTop || win.global.pageYOffset || 0;
					}else{
						scrollTop = -domGeometry.position(fromNode, true).y;
					}
					posY = win.global.innerHeight / 2 + scrollTop;
					fromOrigin = "50% " + posY + "px";
					toOrigin = "50% " + posY + "px";
				}else if(transition.indexOf("scale") != -1){
					var viewPos = domGeometry.position(fromNode, true);
					posX = ((this.clickedPosX !== undefined) ? this.clickedPosX : win.global.innerWidth / 2) - viewPos.x;
					if(this.keepScrollPos && !this.getParent()){
						scrollTop = win.body().scrollTop || win.doc.documentElement.scrollTop || win.global.pageYOffset || 0;
					}else{
						scrollTop = -viewPos.y;
					}
					posY = ((this.clickedPosY !== undefined) ? this.clickedPosY : win.global.innerHeight / 2) + scrollTop;
					fromOrigin = posX + "px " + posY + "px";
					toOrigin = posX + "px " + posY + "px";
				}
				domStyle.set(fromNode, {webkitTransformOrigin:fromOrigin});
				domStyle.set(toNode, {webkitTransformOrigin:toOrigin});
			}
			dm.currentView = registry.byNode(toNode);
		},
	
		onAnimationStart: function(e){
		},


		onAnimationEnd: function(e){
			var name = e.animationName || e.target.className;
			if(name.indexOf("Out") === -1 &&
				name.indexOf("In") === -1 &&
				name.indexOf("Shrink") === -1){ return; }
			var isOut = false;
			if(domClass.contains(this.domNode, "mblOut")){
				isOut = true;
				this.domNode.style.display = "none";
				domClass.remove(this.domNode, [this._toCls(this._transition), "mblIn", "mblOut", "mblReverse"]);
			}else{
				// Reset the temporary padding
				this.containerNode.style.paddingTop = "";
			}
			domStyle.set(this.domNode, {webkitTransformOrigin:""});
			if(name.indexOf("Shrink") !== -1){
				var li = e.target;
				li.style.display = "none";
				domClass.remove(li, "mblCloseContent");
			}
			if(isOut){
				this.invokeCallback();
			}
			// this.domNode may be destroyed as a result of invoking the callback,
			// so check for that before accessing it.
			this.domNode && (this.domNode.className = "mblView");

			// clear the clicked position
			this.clickedPosX = this.clickedPosY = undefined;
		},

		invokeCallback: function(){
			this.onAfterTransitionOut.apply(this, this._arguments);
			connect.publish("/dojox/mobile/afterTransitionOut", [this].concat(this._arguments));
			var toWidget = registry.byNode(this.toNode);
			if(toWidget){
				toWidget.onAfterTransitionIn.apply(toWidget, this._arguments);
				connect.publish("/dojox/mobile/afterTransitionIn", [toWidget].concat(this._arguments));
				toWidget.movedFrom = undefined;
			}

			var c = this._context, m = this._method;
			if(!c && !m){ return; }
			if(!m){
				m = c;
				c = null;
			}
			c = c || win.global;
			if(typeof(m) == "string"){
				c[m].apply(c, this._args);
			}else{
				m.apply(c, this._args);
			}
		},
	
		getShowingView: function(){
			// summary:
			//		Find the currently showing view from my sibling views.
			// description:
			//		Note that dojox.mobile.currentView is the last shown view.
			//		If the page consists of a splitter, there are multiple showing views.
			var nodes = this.domNode.parentNode.childNodes;
			for(var i = 0; i < nodes.length; i++){
				var n = nodes[i];
				if(n.nodeType === 1 && domClass.contains(n, "mblView") && domStyle.get(n, "display") !== "none"){
					return registry.byNode(n);
				}
			}
			return null;
		},
	
		show: function(){
			// summary:
			//		Shows this view without a transition animation.
			var view = this.getShowingView();
			if(view){
				view.domNode.style.display = "none"; // from-style
			}
			this.domNode.style.display = ""; // to-style
			dm.currentView = this;
		}
	});
});

},
'dojox/data/ClientFilter':function(){
define("dojox/data/ClientFilter", ["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/Deferred", "dojo/data/util/filter"], 
  function(declare, lang, array, Deferred, filter) {

// This is an abstract data store module for adding updateable result set functionality to an existing data store class

	var addUpdate = function(store,create,remove){
		// create a handler that adds to the list of notifications
		return function(item){
			store._updates.push({
					create:create && item,
					remove:remove && item
				});
			ClientFilter.onUpdate();
		}
	};
	var ClientFilter = declare("dojox.data.ClientFilter", null, {
			cacheByDefault: false,
			constructor: function(){
				// summary:
				//		This is an abstract class that data stores can extend to add updateable result set functionality
				//		as well as client side querying capabilities. This enables
				//		widgets to be aware of how active results change in response to the modifications/notifications.
				//
				//	description:
				//		To a update a result set after a notification (onNew, onSet, and onDelete),
				//		widgets can call the updateResultSet method. Widgets can use the updated
				//		result sets to determine how to react to notifications, and how to update their displayed results
				//		based on changes.
				//
				//		This module will use the best available information to update result sets, using query attribute
				//		objects to determine if items are in a result set, and using the sort arrays to maintain sort
				//		information. However, queries can be opaque strings, and this module can not update
				//		results by itself in this case. In this situations, data stores can provide a isUpdateable(request) function
				//		and matchesQuery(item,request) function. If a data store can handle a query, it can return true from
				//		isUpdateable and if an item matches a query, it can return true from matchesQuery. Here is
				//		definition of isUpdateable and matchesQuery
				//		isUpdateable(request)  - request is the keywords arguments as is passed to the fetch function.
				//		matchesQuery(item,request) - item is the item to test, and request is the value arguments object
				//				for the fetch function.
				//
				//		You can define a property on this object instance "cacheByDefault" to a value of true that will
				//		cause all queries to be cached by default unless the cache queryOption is explicitly set to false.
				//		This can be defined in the constructor options for ServiceStore/JsonRestStore and subtypes.
				//
				// example:
				//		to make a updated-result-set data store from an existing data store:
				//	|	dojo.declare("dojox.data.MyLiveDataStore",
				//	|		dojox.data.MyDataStore,dojox.data.ClientFilter], // subclass LiveResultSets if available
				//	|		{}
				//	|	);
				this.onSet = addUpdate(this,true,true);
				this.onNew = addUpdate(this,true,false);
				this.onDelete = addUpdate(this,false,true);
				this._updates= [];
				this._fetchCache = [];
			},
			clearCache: function(){
				//	summary:
				//		Clears the cache of client side queries
				this._fetchCache = [];
			},
			updateResultSet: function(/*Array*/ resultSet, /*Object*/ request){
				//	summary:
				//		Attempts to update the given result set based on previous notifications
				//	resultSet:
				//		The result set array that should be updated
				//	request:
				//		This object follows the same meaning as the keywordArgs passed to a dojo.data.api.Read.fetch.
				//	description:
				// 		This will attempt to update the provide result based on previous notification, adding new items
				// 		from onNew calls, removing deleted items, and updating modified items, and properly removing
				//  	and adding items as required by the query and sort parameters. This function will return:
				//		0: Indicates it could not successfully update the result set
				//		1: Indicates it could successfully handle all the notifications, but no changes were made to the result set
				//		2: Indicates it successfully handled all the notifications and result set has been updated.
				if(this.isUpdateable(request)){
					// we try to avoid rerunning notification updates more than once on the same object for performance
					for(var i = request._version || 0; i < this._updates.length;i++){
						// for each notification,we will update the result set
						var create = this._updates[i].create;
						var remove = this._updates[i].remove;
						if(remove){
							for(var j = 0; j < resultSet.length;j++){
								if(this.getIdentity(resultSet[j]) == this.getIdentity(remove)){
									resultSet.splice(j--,1);
									var updated = true;
								}
							}
						}
						if(create && this.matchesQuery(create,request) && // if there is a new/replacement item and it matches the query
								array.indexOf(resultSet,create) == -1){ // and it doesn't already exist in query
							resultSet.push(create); // should this go at the beginning by default instead?
							updated = true;
						}
					}
					if(request.sort && updated){
						// do the sort if needed
						resultSet.sort(this.makeComparator(request.sort.concat()));
					}
					resultSet._fullLength = resultSet.length;
					if(request.count && updated && request.count !== Infinity){
						// do we really need to do this?
						// make sure we still find within the defined paging set
						resultSet.splice(request.count, resultSet.length);
					}
					request._version = this._updates.length;
					return updated ? 2 : 1;
				}
				return 0;
			},
			querySuperSet: function(argsSuper, argsSub){
				//	summary:
				//		Determines whether the provided arguments are super/sub sets of each other
				// argsSuper:
				//		Dojo Data Fetch arguments
				// argsSub:
				//		Dojo Data Fetch arguments
				if(argsSuper.query == argsSub.query){
					return {};
				}
				if(!(argsSub.query instanceof Object && // sub query must be an object
						// super query must be non-existent or an object
						(!argsSuper.query || typeof argsSuper.query == 'object'))){
					return false;
				}
				var clientQuery = lang.mixin({},argsSub.query);
				for(var i in argsSuper.query){
					if(clientQuery[i] == argsSuper.query[i]){
						delete clientQuery[i];
					}else if(!(typeof argsSuper.query[i] == 'string' &&
							// if it is a pattern, we can test to see if it is a sub-pattern
							// FIXME: This is not technically correct, but it will work for the majority of cases
							filter.patternToRegExp(argsSuper.query[i]).test(clientQuery[i]))){
						return false;
					}
				}
				return clientQuery;
			},
			//	This is the point in the version notification history at which it is known that the server is in sync, this should
			//	be updated to this._updates.length on commit operations.
			serverVersion: 0,
			
			cachingFetch: function(args){
				var self = this;
				for(var i = 0; i < this._fetchCache.length;i++){
					var cachedArgs = this._fetchCache[i];
					var clientQuery = this.querySuperSet(cachedArgs,args);
					if(clientQuery !== false){
						var defResult = cachedArgs._loading;
						if(!defResult){
							defResult = new Deferred();
							defResult.callback(cachedArgs.cacheResults);
						}
						defResult.addCallback(function(results){
							results = self.clientSideFetch(lang.mixin(lang.mixin({}, args),{query:clientQuery}), results);
							defResult.fullLength = results._fullLength;
							return results;
						});
						args._version = cachedArgs._version;
						break;
					}
				}
				if(!defResult){
					var serverArgs = lang.mixin({}, args);
					var putInCache = (args.queryOptions || 0).cache;
					var fetchCache = this._fetchCache;
					if(putInCache === undefined ? this.cacheByDefault : putInCache){
						// we are caching this request, so we want to get all the data, and page on the client side
						if(args.start || args.count){
							delete serverArgs.start;
							delete serverArgs.count;
							args.clientQuery = lang.mixin(args.clientQuery || {}, {
								start: args.start,
								count: args.count
							});
						}
						args = serverArgs;
						fetchCache.push(args);
					}
					defResult= args._loading = this._doQuery(args);
					 
					defResult.addErrback(function(){
						fetchCache.splice(array.indexOf(fetchCache, args), 1);
					});
				}
				var version = this.serverVersion;
				
				defResult.addCallback(function(results){
					delete args._loading;
					// update the result set in case anything changed while we were waiting for the fetch
					if(results){
						args._version = typeof args._version == "number" ? args._version : version;
						self.updateResultSet(results,args);
						args.cacheResults = results;
						if(!args.count || results.length < args.count){
							defResult.fullLength = ((args.start)?args.start:0) + results.length;
						}
					}
					return results;
				});
				return defResult;
			},
			isUpdateable: function(/*Object*/ request){
				//	summary:
				//		Returns whether the provide fetch arguments can be used to update an existing list
				//	request:
				//		See dojo.data.api.Read.fetch request
				
				return typeof request.query == "object";
			},
			clientSideFetch: function(/*Object*/ request,/*Array*/ baseResults){
				// summary:
				//		Performs a query on the client side and returns the results as an array
				//
				//	request:
				//		See dojo.data.api.Read.fetch request
				//
				//	baseResults:
				//		This provides the result set to start with for client side querying
				if(request.queryOptions && request.queryOptions.results){
					baseResults = request.queryOptions.results;
				}
				if(request.query){
					// filter by the query
					var results = [];
					for(var i = 0; i < baseResults.length; i++){
						var value = baseResults[i];
						if(value && this.matchesQuery(value,request)){
							results.push(baseResults[i]);
						}
					}
				}else{
					results = request.sort ? baseResults.concat() : baseResults; // we don't want to mutate the baseResults if we are doing a sort
				}
				if(request.sort){
					// do the sort if needed
					results.sort(this.makeComparator(request.sort.concat()));
				}
				return this.clientSidePaging(request, results);
			},
			clientSidePaging: function(/*Object*/ request,/*Array*/ baseResults){
				var start = request.start || 0;
				var finalResults = (start || request.count) ? baseResults.slice(start,start + (request.count || baseResults.length)) : baseResults;
				finalResults._fullLength = baseResults.length;
				return finalResults;
			},
			matchesQuery: function(item,request){
				var query = request.query;
				var ignoreCase = request.queryOptions && request.queryOptions.ignoreCase;
				for(var i in query){
					// if anything doesn't match, than this should be in the query
					var match = query[i];
					var value = this.getValue(item,i);
					if((typeof match == 'string' && (match.match(/[\*\.]/) || ignoreCase)) ?
						!filter.patternToRegExp(match, ignoreCase).test(value) :
						value != match){
						return false;
					}
				}
				return true;
			},
			makeComparator: function(sort){
				//	summary:
				//		returns a comparator function for the given sort order array
				//	sort:
				//		See dojox.data.api.Read.fetch
				var current = sort.shift();
				if(!current){
					// sort order for ties and no sort orders
					return function(){
						return 0;// keep the order unchanged
					};
				}
				var attribute = current.attribute;
				var descending = !!current.descending;
				var next = this.makeComparator(sort);
				var store = this;
				return function(a,b){
					var av = store.getValue(a,attribute);
					var bv = store.getValue(b,attribute);
					if(av != bv){
						return av < bv == descending ? 1 : -1;
					}
					return next(a,b);
				};
			}
		}
	);
	ClientFilter.onUpdate = function(){};

	return ClientFilter;
});

},
'dojo/data/util/sorter':function(){
define("dojo/data/util/sorter", ["dojo/_base/lang"], function(lang) {
	// module:
	//		dojo/data/util/sorter
	// summary:
	//		TODOC

var sorter = lang.getObject("dojo.data.util.sorter", true);

sorter.basicComparator = function(	/*anything*/ a,
													/*anything*/ b){
	//	summary:
	//		Basic comparision function that compares if an item is greater or less than another item
	//	description:
	//		returns 1 if a > b, -1 if a < b, 0 if equal.
	//		'null' values (null, undefined) are treated as larger values so that they're pushed to the end of the list.
	//		And compared to each other, null is equivalent to undefined.

	//null is a problematic compare, so if null, we set to undefined.
	//Makes the check logic simple, compact, and consistent
	//And (null == undefined) === true, so the check later against null
	//works for undefined and is less bytes.
	var r = -1;
	if(a === null){
		a = undefined;
	}
	if(b === null){
		b = undefined;
	}
	if(a == b){
		r = 0;
	}else if(a > b || a == null){
		r = 1;
	}
	return r; //int {-1,0,1}
};

sorter.createSortFunction = function(	/* attributes array */sortSpec, /*dojo.data.core.Read*/ store){
	//	summary:
	//		Helper function to generate the sorting function based off the list of sort attributes.
	//	description:
	//		The sort function creation will look for a property on the store called 'comparatorMap'.  If it exists
	//		it will look in the mapping for comparisons function for the attributes.  If one is found, it will
	//		use it instead of the basic comparator, which is typically used for strings, ints, booleans, and dates.
	//		Returns the sorting function for this particular list of attributes and sorting directions.
	//
	//	sortSpec: array
	//		A JS object that array that defines out what attribute names to sort on and whether it should be descenting or asending.
	//		The objects should be formatted as follows:
	//		{
	//			attribute: "attributeName-string" || attribute,
	//			descending: true|false;   // Default is false.
	//		}
	//	store: object
	//		The datastore object to look up item values from.
	//
	var sortFunctions=[];

	function createSortFunction(attr, dir, comp, s){
		//Passing in comp and s (comparator and store), makes this
		//function much faster.
		return function(itemA, itemB){
			var a = s.getValue(itemA, attr);
			var b = s.getValue(itemB, attr);
			return dir * comp(a,b); //int
		};
	}
	var sortAttribute;
	var map = store.comparatorMap;
	var bc = sorter.basicComparator;
	for(var i = 0; i < sortSpec.length; i++){
		sortAttribute = sortSpec[i];
		var attr = sortAttribute.attribute;
		if(attr){
			var dir = (sortAttribute.descending) ? -1 : 1;
			var comp = bc;
			if(map){
				if(typeof attr !== "string" && ("toString" in attr)){
					 attr = attr.toString();
				}
				comp = map[attr] || bc;
			}
			sortFunctions.push(createSortFunction(attr,
				dir, comp, store));
		}
	}
	return function(rowA, rowB){
		var i=0;
		while(i < sortFunctions.length){
			var ret = sortFunctions[i++](rowA, rowB);
			if(ret !== 0){
				return ret;//int
			}
		}
		return 0; //int
	}; // Function
};

return sorter;
});

},
'dijit/form/_ButtonMixin':function(){
define("dijit/form/_ButtonMixin", [
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.setSelectable
	"dojo/_base/event", // event.stop
	"../registry"		// registry.byNode
], function(declare, dom, event, registry){

// module:
//		dijit/form/_ButtonMixin
// summary:
//		A mixin to add a thin standard API wrapper to a normal HTML button

return declare("dijit.form._ButtonMixin", null, {
	// summary:
	//		A mixin to add a thin standard API wrapper to a normal HTML button
	// description:
	//		A label should always be specified (through innerHTML) or the label attribute.
	//		Attach points:
	//			focusNode (required): this node receives focus
	//			valueNode (optional): this node's value gets submitted with FORM elements
	//			containerNode (optional): this node gets the innerHTML assignment for label
	// example:
	// |	<button data-dojo-type="dijit.form.Button" onClick="...">Hello world</button>
	//
	// example:
	// |	var button1 = new dijit.form.Button({label: "hello world", onClick: foo});
	// |	dojo.body().appendChild(button1.domNode);

	// label: HTML String
	//		Content to display in button.
	label: "",

	// type: [const] String
	//		Type of button (submit, reset, button, checkbox, radio)
	type: "button",

	_onClick: function(/*Event*/ e){
		// summary:
		//		Internal function to handle click actions
		if(this.disabled){
			event.stop(e);
			return false;
		}
		var preventDefault = this.onClick(e) === false; // user click actions
		if(!preventDefault && this.type == "submit" && !(this.valueNode||this.focusNode).form){ // see if a non-form widget needs to be signalled
			for(var node=this.domNode; node.parentNode; node=node.parentNode){
				var widget=registry.byNode(node);
				if(widget && typeof widget._onSubmit == "function"){
					widget._onSubmit(e);
					preventDefault = true;
					break;
				}
			}
		}
		if(preventDefault){
			e.preventDefault();
		}
		return !preventDefault;
	},

	postCreate: function(){
		this.inherited(arguments);
		dom.setSelectable(this.focusNode, false);
	},

	onClick: function(/*Event*/ /*===== e =====*/){
		// summary:
		//		Callback for when button is clicked.
		//		If type="submit", return true to perform submit, or false to cancel it.
		// type:
		//		callback
		return true;		// Boolean
	},

	_setLabelAttr: function(/*String*/ content){
		// summary:
		//		Hook for set('label', ...) to work.
		// description:
		//		Set the label (text) of the button; takes an HTML string.
		this._set("label", content);
		(this.containerNode||this.focusNode).innerHTML = content;
	}
});

});

},
'dojox/mobile/RoundRectList':function(){
define("dojox/mobile/RoundRectList", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/window",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase"
], function(array, declare, win, Contained, Container, WidgetBase){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/RoundRectList
	// summary:
	//		A rounded rectangle list.

	return declare("dojox.mobile.RoundRectList", [WidgetBase, Container, Contained], {
		// summary:
		//		A rounded rectangle list.
		// description:
		//		RoundRectList is a rounded rectangle list, which can be used to
		//		display a group of items. Each item must be
		//		dojox.mobile.ListItem.

		// transition: String
		//		The default animated transition effect for child items.
		transition: "slide",

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// iconPos: String
		//		The default icon position for child items.
		iconPos: "",

		// select: String
		//		Selection mode of the list. The check mark is shown for the
		//		selected list item(s). The value can be "single", "multiple", or
		//		"". If "single", there can be only one selected item at a time.
		//		If "multiple", there can be multiple selected items at a time.
		select: "",

		// stateful: String
		//		If true, the last selected item remains highlighted.
		stateful: false,

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement("UL");
			this.domNode.className = "mblRoundRectList";
		},
	
		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		onCheckStateChanged: function(/*Widget*/listItem, /*String*/newState){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called when the check state has been changed.
		},

		_setStatefulAttr: function(stateful){
			this.stateful = stateful;
			array.forEach(this.getChildren(), function(child){
				child.setArrow && child.setArrow();
			});
		},

		deselectItem: function(/*ListItem*/item){
			// summary:
			//		Deselects the given item.
			item.deselect();
		},

		deselectAll: function(){
			// summary:
			//		Deselects all the items.
			array.forEach(this.getChildren(), function(child){
				child.deselect && child.deselect();
			});
		},

		selectItem: function(/*ListItem*/item){
			// summary:
			//		Selects the given item.
			item.select();
		}
	});
});

},
'dijit/registry':function(){
define("dijit/registry", [
	"dojo/_base/array", // array.forEach array.map
	"dojo/_base/sniff", // has("ie")
	"dojo/_base/unload", // unload.addOnWindowUnload
	"dojo/_base/window", // win.body
	"."	// dijit._scopeName
], function(array, has, unload, win, dijit){

	// module:
	//		dijit/registry
	// summary:
	//		Registry of existing widget on page, plus some utility methods.
	//		Must be accessed through AMD api, ex:
	//		require(["dijit/registry"], function(registry){ registry.byId("foo"); })

	var _widgetTypeCtr = {}, hash = {};

	var registry =  {
		// summary:
		//		A set of widgets indexed by id

		length: 0,

		add: function(/*dijit._Widget*/ widget){
			// summary:
			//		Add a widget to the registry. If a duplicate ID is detected, a error is thrown.
			//
			// widget: dijit._Widget
			//		Any dijit._Widget subclass.
			if(hash[widget.id]){
				throw new Error("Tried to register widget with id==" + widget.id + " but that id is already registered");
			}
			hash[widget.id] = widget;
			this.length++;
		},

		remove: function(/*String*/ id){
			// summary:
			//		Remove a widget from the registry. Does not destroy the widget; simply
			//		removes the reference.
			if(hash[id]){
				delete hash[id];
				this.length--;
			}
		},

		byId: function(/*String|Widget*/ id){
			// summary:
			//		Find a widget by it's id.
			//		If passed a widget then just returns the widget.
			return typeof id == "string" ? hash[id] : id;	// dijit._Widget
		},

		byNode: function(/*DOMNode*/ node){
			// summary:
			//		Returns the widget corresponding to the given DOMNode
			return hash[node.getAttribute("widgetId")]; // dijit._Widget
		},

		toArray: function(){
			// summary:
			//		Convert registry into a true Array
			//
			// example:
			//		Work with the widget .domNodes in a real Array
			//		|	array.map(dijit.registry.toArray(), function(w){ return w.domNode; });

			var ar = [];
			for(var id in hash){
				ar.push(hash[id]);
			}
			return ar;	// dijit._Widget[]
		},

		getUniqueId: function(/*String*/widgetType){
			// summary:
			//		Generates a unique id for a given widgetType

			var id;
			do{
				id = widgetType + "_" +
					(widgetType in _widgetTypeCtr ?
						++_widgetTypeCtr[widgetType] : _widgetTypeCtr[widgetType] = 0);
			}while(hash[id]);
			return dijit._scopeName == "dijit" ? id : dijit._scopeName + "_" + id; // String
		},

		findWidgets: function(/*DomNode*/ root){
			// summary:
			//		Search subtree under root returning widgets found.
			//		Doesn't search for nested widgets (ie, widgets inside other widgets).

			var outAry = [];

			function getChildrenHelper(root){
				for(var node = root.firstChild; node; node = node.nextSibling){
					if(node.nodeType == 1){
						var widgetId = node.getAttribute("widgetId");
						if(widgetId){
							var widget = hash[widgetId];
							if(widget){	// may be null on page w/multiple dojo's loaded
								outAry.push(widget);
							}
						}else{
							getChildrenHelper(node);
						}
					}
				}
			}

			getChildrenHelper(root);
			return outAry;
		},

		_destroyAll: function(){
			// summary:
			//		Code to destroy all widgets and do other cleanup on page unload

			// Clean up focus manager lingering references to widgets and nodes
			dijit._curFocus = null;
			dijit._prevFocus = null;
			dijit._activeStack = [];

			// Destroy all the widgets, top down
			array.forEach(registry.findWidgets(win.body()), function(widget){
				// Avoid double destroy of widgets like Menu that are attached to <body>
				// even though they are logically children of other widgets.
				if(!widget._destroyed){
					if(widget.destroyRecursive){
						widget.destroyRecursive();
					}else if(widget.destroy){
						widget.destroy();
					}
				}
			});
		},

		getEnclosingWidget: function(/*DOMNode*/ node){
			// summary:
			//		Returns the widget whose DOM tree contains the specified DOMNode, or null if
			//		the node is not contained within the DOM tree of any widget
			while(node){
				var id = node.getAttribute && node.getAttribute("widgetId");
				if(id){
					return hash[id];
				}
				node = node.parentNode;
			}
			return null;
		},

		// In case someone needs to access hash.
		// Actually, this is accessed from WidgetSet back-compatibility code
		_hash: hash
	};

	if(has("ie")){
		// Only run _destroyAll() for IE because we think it's only necessary in that case,
		// and because it causes problems on FF.  See bug #3531 for details.
		unload.addOnWindowUnload(function(){
			registry._destroyAll();
		});
	}

	/*=====
	dijit.registry = {
		// summary:
		//		A list of widgets on a page.
	};
	=====*/
	dijit.registry = registry;

	return registry;
});

},
'dojo/date/locale':function(){
define("dojo/date/locale", [
	"../_base/kernel",
	"../_base/lang",
	"../_base/array",
	"../date",
	"../cldr/supplemental",
	"../regexp",
	"../string",
	"../i18n!../cldr/nls/gregorian"
], function(dojo, lang, array, date, cldr, regexp, string, gregorian) {
	// module:
	//		dojo/date/locale
	// summary:
	//		This modules defines dojo.date.locale, localization methods for Date.

lang.getObject("date.locale", true, dojo);

// Localization methods for Date.   Honor local customs using locale-dependent dojo.cldr data.

// Load the bundles containing localization information for
// names and formats

//NOTE: Everything in this module assumes Gregorian calendars.
// Other calendars will be implemented in separate modules.

	// Format a pattern without literals
	function formatPattern(dateObject, bundle, options, pattern){
		return pattern.replace(/([a-z])\1*/ig, function(match){
			var s, pad,
				c = match.charAt(0),
				l = match.length,
				widthList = ["abbr", "wide", "narrow"];
			switch(c){
				case 'G':
					s = bundle[(l < 4) ? "eraAbbr" : "eraNames"][dateObject.getFullYear() < 0 ? 0 : 1];
					break;
				case 'y':
					s = dateObject.getFullYear();
					switch(l){
						case 1:
							break;
						case 2:
							if(!options.fullYear){
								s = String(s); s = s.substr(s.length - 2);
								break;
							}
							// fallthrough
						default:
							pad = true;
					}
					break;
				case 'Q':
				case 'q':
					s = Math.ceil((dateObject.getMonth()+1)/3);
//					switch(l){
//						case 1: case 2:
							pad = true;
//							break;
//						case 3: case 4: // unimplemented
//					}
					break;
				case 'M':
					var m = dateObject.getMonth();
					if(l<3){
						s = m+1; pad = true;
					}else{
						var propM = ["months", "format", widthList[l-3]].join("-");
						s = bundle[propM][m];
					}
					break;
				case 'w':
					var firstDay = 0;
					s = dojo.date.locale._getWeekOfYear(dateObject, firstDay); pad = true;
					break;
				case 'd':
					s = dateObject.getDate(); pad = true;
					break;
				case 'D':
					s = dojo.date.locale._getDayOfYear(dateObject); pad = true;
					break;
				case 'E':
					var d = dateObject.getDay();
					if(l<3){
						s = d+1; pad = true;
					}else{
						var propD = ["days", "format", widthList[l-3]].join("-");
						s = bundle[propD][d];
					}
					break;
				case 'a':
					var timePeriod = (dateObject.getHours() < 12) ? 'am' : 'pm';
					s = options[timePeriod] || bundle['dayPeriods-format-wide-' + timePeriod];
					break;
				case 'h':
				case 'H':
				case 'K':
				case 'k':
					var h = dateObject.getHours();
					// strange choices in the date format make it impossible to write this succinctly
					switch (c){
						case 'h': // 1-12
							s = (h % 12) || 12;
							break;
						case 'H': // 0-23
							s = h;
							break;
						case 'K': // 0-11
							s = (h % 12);
							break;
						case 'k': // 1-24
							s = h || 24;
							break;
					}
					pad = true;
					break;
				case 'm':
					s = dateObject.getMinutes(); pad = true;
					break;
				case 's':
					s = dateObject.getSeconds(); pad = true;
					break;
				case 'S':
					s = Math.round(dateObject.getMilliseconds() * Math.pow(10, l-3)); pad = true;
					break;
				case 'v': // FIXME: don't know what this is. seems to be same as z?
				case 'z':
					// We only have one timezone to offer; the one from the browser
					s = dojo.date.locale._getZone(dateObject, true, options);
					if(s){break;}
					l=4;
					// fallthrough... use GMT if tz not available
				case 'Z':
					var offset = dojo.date.locale._getZone(dateObject, false, options);
					var tz = [
						(offset<=0 ? "+" : "-"),
						string.pad(Math.floor(Math.abs(offset)/60), 2),
						string.pad(Math.abs(offset)% 60, 2)
					];
					if(l==4){
						tz.splice(0, 0, "GMT");
						tz.splice(3, 0, ":");
					}
					s = tz.join("");
					break;
//				case 'Y': case 'u': case 'W': case 'F': case 'g': case 'A': case 'e':
//					console.log(match+" modifier unimplemented");
				default:
					throw new Error("dojo.date.locale.format: invalid pattern char: "+pattern);
			}
			if(pad){ s = string.pad(s, l); }
			return s;
		});
	}

/*=====
	dojo.date.locale.__FormatOptions = function(){
	//	selector: String
	//		choice of 'time','date' (default: date and time)
	//	formatLength: String
	//		choice of long, short, medium or full (plus any custom additions).  Defaults to 'short'
	//	datePattern:String
	//		override pattern with this string
	//	timePattern:String
	//		override pattern with this string
	//	am: String
	//		override strings for am in times
	//	pm: String
	//		override strings for pm in times
	//	locale: String
	//		override the locale used to determine formatting rules
	//	fullYear: Boolean
	//		(format only) use 4 digit years whenever 2 digit years are called for
	//	strict: Boolean
	//		(parse only) strict parsing, off by default
		this.selector = selector;
		this.formatLength = formatLength;
		this.datePattern = datePattern;
		this.timePattern = timePattern;
		this.am = am;
		this.pm = pm;
		this.locale = locale;
		this.fullYear = fullYear;
		this.strict = strict;
	}
=====*/

dojo.date.locale._getZone = function(/*Date*/dateObject, /*boolean*/getName, /*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Returns the zone (or offset) for the given date and options.  This
	//		is broken out into a separate function so that it can be overridden
	//		by timezone-aware code.
	//
	// dateObject:
	//		the date and/or time being formatted.
	//
	// getName:
	//		Whether to return the timezone string (if true), or the offset (if false)
	//
	// options:
	//		The options being used for formatting
	if(getName){
		return date.getTimezoneName(dateObject);
	}else{
		return dateObject.getTimezoneOffset();
	}
};


dojo.date.locale.format = function(/*Date*/dateObject, /*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Format a Date object as a String, using locale-specific settings.
	//
	// description:
	//		Create a string from a Date object using a known localized pattern.
	//		By default, this method formats both date and time from dateObject.
	//		Formatting patterns are chosen appropriate to the locale.  Different
	//		formatting lengths may be chosen, with "full" used by default.
	//		Custom patterns may be used or registered with translations using
	//		the dojo.date.locale.addCustomFormats method.
	//		Formatting patterns are implemented using [the syntax described at
	//		unicode.org](http://www.unicode.org/reports/tr35/tr35-4.html#Date_Format_Patterns)
	//
	// dateObject:
	//		the date and/or time to be formatted.  If a time only is formatted,
	//		the values in the year, month, and day fields are irrelevant.  The
	//		opposite is true when formatting only dates.

	options = options || {};

	var locale = dojo.i18n.normalizeLocale(options.locale),
		formatLength = options.formatLength || 'short',
		bundle = dojo.date.locale._getGregorianBundle(locale),
		str = [],
		sauce = lang.hitch(this, formatPattern, dateObject, bundle, options);
	if(options.selector == "year"){
		return _processPattern(bundle["dateFormatItem-yyyy"] || "yyyy", sauce);
	}
	var pattern;
	if(options.selector != "date"){
		pattern = options.timePattern || bundle["timeFormat-"+formatLength];
		if(pattern){str.push(_processPattern(pattern, sauce));}
	}
	if(options.selector != "time"){
		pattern = options.datePattern || bundle["dateFormat-"+formatLength];
		if(pattern){str.push(_processPattern(pattern, sauce));}
	}

	return str.length == 1 ? str[0] : bundle["dateTimeFormat-"+formatLength].replace(/\{(\d+)\}/g,
		function(match, key){ return str[key]; }); // String
};

dojo.date.locale.regexp = function(/*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Builds the regular needed to parse a localized date

	return dojo.date.locale._parseInfo(options).regexp; // String
};

dojo.date.locale._parseInfo = function(/*dojo.date.locale.__FormatOptions?*/options){
	options = options || {};
	var locale = dojo.i18n.normalizeLocale(options.locale),
		bundle = dojo.date.locale._getGregorianBundle(locale),
		formatLength = options.formatLength || 'short',
		datePattern = options.datePattern || bundle["dateFormat-" + formatLength],
		timePattern = options.timePattern || bundle["timeFormat-" + formatLength],
		pattern;
	if(options.selector == 'date'){
		pattern = datePattern;
	}else if(options.selector == 'time'){
		pattern = timePattern;
	}else{
		pattern = bundle["dateTimeFormat-"+formatLength].replace(/\{(\d+)\}/g,
			function(match, key){ return [timePattern, datePattern][key]; });
	}

	var tokens = [],
		re = _processPattern(pattern, lang.hitch(this, _buildDateTimeRE, tokens, bundle, options));
	return {regexp: re, tokens: tokens, bundle: bundle};
};

dojo.date.locale.parse = function(/*String*/value, /*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Convert a properly formatted string to a primitive Date object,
	//		using locale-specific settings.
	//
	// description:
	//		Create a Date object from a string using a known localized pattern.
	//		By default, this method parses looking for both date and time in the string.
	//		Formatting patterns are chosen appropriate to the locale.  Different
	//		formatting lengths may be chosen, with "full" used by default.
	//		Custom patterns may be used or registered with translations using
	//		the dojo.date.locale.addCustomFormats method.
	//
	//		Formatting patterns are implemented using [the syntax described at
	//		unicode.org](http://www.unicode.org/reports/tr35/tr35-4.html#Date_Format_Patterns)
	//		When two digit years are used, a century is chosen according to a sliding
	//		window of 80 years before and 20 years after present year, for both `yy` and `yyyy` patterns.
	//		year < 100CE requires strict mode.
	//
	// value:
	//		A string representation of a date

	// remove non-printing bidi control chars from input and pattern
	var controlChars = /[\u200E\u200F\u202A\u202E]/g,
		info = dojo.date.locale._parseInfo(options),
		tokens = info.tokens, bundle = info.bundle,
		re = new RegExp("^" + info.regexp.replace(controlChars, "") + "$",
			info.strict ? "" : "i"),
		match = re.exec(value && value.replace(controlChars, ""));

	if(!match){ return null; } // null

	var widthList = ['abbr', 'wide', 'narrow'],
		result = [1970,0,1,0,0,0,0], // will get converted to a Date at the end
		amPm = "",
		valid = dojo.every(match, function(v, i){
		if(!i){return true;}
		var token=tokens[i-1];
		var l=token.length;
		switch(token.charAt(0)){
			case 'y':
				if(l != 2 && options.strict){
					//interpret year literally, so '5' would be 5 A.D.
					result[0] = v;
				}else{
					if(v<100){
						v = Number(v);
						//choose century to apply, according to a sliding window
						//of 80 years before and 20 years after present year
						var year = '' + new Date().getFullYear(),
							century = year.substring(0, 2) * 100,
							cutoff = Math.min(Number(year.substring(2, 4)) + 20, 99);
						result[0] = (v < cutoff) ? century + v : century - 100 + v;
					}else{
						//we expected 2 digits and got more...
						if(options.strict){
							return false;
						}
						//interpret literally, so '150' would be 150 A.D.
						//also tolerate '1950', if 'yyyy' input passed to 'yy' format
						result[0] = v;
					}
				}
				break;
			case 'M':
				if(l>2){
					var months = bundle['months-format-' + widthList[l-3]].concat();
					if(!options.strict){
						//Tolerate abbreviating period in month part
						//Case-insensitive comparison
						v = v.replace(".","").toLowerCase();
						months = dojo.map(months, function(s){ return s.replace(".","").toLowerCase(); } );
					}
					v = dojo.indexOf(months, v);
					if(v == -1){
//						console.log("dojo.date.locale.parse: Could not parse month name: '" + v + "'.");
						return false;
					}
				}else{
					v--;
				}
				result[1] = v;
				break;
			case 'E':
			case 'e':
				var days = bundle['days-format-' + widthList[l-3]].concat();
				if(!options.strict){
					//Case-insensitive comparison
					v = v.toLowerCase();
					days = dojo.map(days, function(d){return d.toLowerCase();});
				}
				v = dojo.indexOf(days, v);
				if(v == -1){
//					console.log("dojo.date.locale.parse: Could not parse weekday name: '" + v + "'.");
					return false;
				}

				//TODO: not sure what to actually do with this input,
				//in terms of setting something on the Date obj...?
				//without more context, can't affect the actual date
				//TODO: just validate?
				break;
			case 'D':
				result[1] = 0;
				// fallthrough...
			case 'd':
				result[2] = v;
				break;
			case 'a': //am/pm
				var am = options.am || bundle['dayPeriods-format-wide-am'],
					pm = options.pm || bundle['dayPeriods-format-wide-pm'];
				if(!options.strict){
					var period = /\./g;
					v = v.replace(period,'').toLowerCase();
					am = am.replace(period,'').toLowerCase();
					pm = pm.replace(period,'').toLowerCase();
				}
				if(options.strict && v != am && v != pm){
//					console.log("dojo.date.locale.parse: Could not parse am/pm part.");
					return false;
				}

				// we might not have seen the hours field yet, so store the state and apply hour change later
				amPm = (v == pm) ? 'p' : (v == am) ? 'a' : '';
				break;
			case 'K': //hour (1-24)
				if(v == 24){ v = 0; }
				// fallthrough...
			case 'h': //hour (1-12)
			case 'H': //hour (0-23)
			case 'k': //hour (0-11)
				//TODO: strict bounds checking, padding
				if(v > 23){
//					console.log("dojo.date.locale.parse: Illegal hours value");
					return false;
				}

				//in the 12-hour case, adjusting for am/pm requires the 'a' part
				//which could come before or after the hour, so we will adjust later
				result[3] = v;
				break;
			case 'm': //minutes
				result[4] = v;
				break;
			case 's': //seconds
				result[5] = v;
				break;
			case 'S': //milliseconds
				result[6] = v;
//				break;
//			case 'w':
//TODO				var firstDay = 0;
//			default:
//TODO: throw?
//				console.log("dojo.date.locale.parse: unsupported pattern char=" + token.charAt(0));
		}
		return true;
	});

	var hours = +result[3];
	if(amPm === 'p' && hours < 12){
		result[3] = hours + 12; //e.g., 3pm -> 15
	}else if(amPm === 'a' && hours == 12){
		result[3] = 0; //12am -> 0
	}

	//TODO: implement a getWeekday() method in order to test
	//validity of input strings containing 'EEE' or 'EEEE'...

	var dateObject = new Date(result[0], result[1], result[2], result[3], result[4], result[5], result[6]); // Date
	if(options.strict){
		dateObject.setFullYear(result[0]);
	}

	// Check for overflow.  The Date() constructor normalizes things like April 32nd...
	//TODO: why isn't this done for times as well?
	var allTokens = tokens.join(""),
		dateToken = allTokens.indexOf('d') != -1,
		monthToken = allTokens.indexOf('M') != -1;

	if(!valid ||
		(monthToken && dateObject.getMonth() > result[1]) ||
		(dateToken && dateObject.getDate() > result[2])){
		return null;
	}

	// Check for underflow, due to DST shifts.  See #9366
	// This assumes a 1 hour dst shift correction at midnight
	// We could compare the timezone offset after the shift and add the difference instead.
	if((monthToken && dateObject.getMonth() < result[1]) ||
		(dateToken && dateObject.getDate() < result[2])){
		dateObject = date.add(dateObject, "hour", 1);
	}

	return dateObject; // Date
};

function _processPattern(pattern, applyPattern, applyLiteral, applyAll){
	//summary: Process a pattern with literals in it

	// Break up on single quotes, treat every other one as a literal, except '' which becomes '
	var identity = function(x){return x;};
	applyPattern = applyPattern || identity;
	applyLiteral = applyLiteral || identity;
	applyAll = applyAll || identity;

	//split on single quotes (which escape literals in date format strings)
	//but preserve escaped single quotes (e.g., o''clock)
	var chunks = pattern.match(/(''|[^'])+/g),
		literal = pattern.charAt(0) == "'";

	dojo.forEach(chunks, function(chunk, i){
		if(!chunk){
			chunks[i]='';
		}else{
			chunks[i]=(literal ? applyLiteral : applyPattern)(chunk.replace(/''/g, "'"));
			literal = !literal;
		}
	});
	return applyAll(chunks.join(''));
}

function _buildDateTimeRE(tokens, bundle, options, pattern){
	pattern = regexp.escapeString(pattern);
	if(!options.strict){ pattern = pattern.replace(" a", " ?a"); } // kludge to tolerate no space before am/pm
	return pattern.replace(/([a-z])\1*/ig, function(match){
		// Build a simple regexp.  Avoid captures, which would ruin the tokens list
		var s,
			c = match.charAt(0),
			l = match.length,
			p2 = '', p3 = '';
		if(options.strict){
			if(l > 1){ p2 = '0' + '{'+(l-1)+'}'; }
			if(l > 2){ p3 = '0' + '{'+(l-2)+'}'; }
		}else{
			p2 = '0?'; p3 = '0{0,2}';
		}
		switch(c){
			case 'y':
				s = '\\d{2,4}';
				break;
			case 'M':
				s = (l>2) ? '\\S+?' : '1[0-2]|'+p2+'[1-9]';
				break;
			case 'D':
				s = '[12][0-9][0-9]|3[0-5][0-9]|36[0-6]|'+p2+'[1-9][0-9]|'+p3+'[1-9]';
				break;
			case 'd':
				s = '3[01]|[12]\\d|'+p2+'[1-9]';
				break;
			case 'w':
				s = '[1-4][0-9]|5[0-3]|'+p2+'[1-9]';
				break;
			case 'E':
				s = '\\S+';
				break;
			case 'h': //hour (1-12)
				s = '1[0-2]|'+p2+'[1-9]';
				break;
			case 'k': //hour (0-11)
				s = '1[01]|'+p2+'\\d';
				break;
			case 'H': //hour (0-23)
				s = '1\\d|2[0-3]|'+p2+'\\d';
				break;
			case 'K': //hour (1-24)
				s = '1\\d|2[0-4]|'+p2+'[1-9]';
				break;
			case 'm':
			case 's':
				s = '[0-5]\\d';
				break;
			case 'S':
				s = '\\d{'+l+'}';
				break;
			case 'a':
				var am = options.am || bundle['dayPeriods-format-wide-am'],
					pm = options.pm || bundle['dayPeriods-format-wide-pm'];
					s = am + '|' + pm;
				if(!options.strict){
					if(am != am.toLowerCase()){ s += '|' + am.toLowerCase(); }
					if(pm != pm.toLowerCase()){ s += '|' + pm.toLowerCase(); }
					if(s.indexOf('.') != -1){ s += '|' + s.replace(/\./g, ""); }
				}
				s = s.replace(/\./g, "\\.");
				break;
			default:
			// case 'v':
			// case 'z':
			// case 'Z':
				s = ".*";
//				console.log("parse of date format, pattern=" + pattern);
		}

		if(tokens){ tokens.push(match); }

		return "(" + s + ")"; // add capture
	}).replace(/[\xa0 ]/g, "[\\s\\xa0]"); // normalize whitespace.  Need explicit handling of \xa0 for IE.
}

var _customFormats = [];
dojo.date.locale.addCustomFormats = function(/*String*/packageName, /*String*/bundleName){
	// summary:
	//		Add a reference to a bundle containing localized custom formats to be
	//		used by date/time formatting and parsing routines.
	//
	// description:
	//		The user may add custom localized formats where the bundle has properties following the
	//		same naming convention used by dojo.cldr: `dateFormat-xxxx` / `timeFormat-xxxx`
	//		The pattern string should match the format used by the CLDR.
	//		See dojo.date.locale.format() for details.
	//		The resources must be loaded by dojo.requireLocalization() prior to use

	_customFormats.push({pkg:packageName,name:bundleName});
};

dojo.date.locale._getGregorianBundle = function(/*String*/locale){
	var gregorian = {};
	dojo.forEach(_customFormats, function(desc){
		var bundle = dojo.i18n.getLocalization(desc.pkg, desc.name, locale);
		gregorian = lang.mixin(gregorian, bundle);
	}, this);
	return gregorian; /*Object*/
};

dojo.date.locale.addCustomFormats("dojo.cldr","gregorian");

dojo.date.locale.getNames = function(/*String*/item, /*String*/type, /*String?*/context, /*String?*/locale){
	// summary:
	//		Used to get localized strings from dojo.cldr for day or month names.
	//
	// item:
	//	'months' || 'days'
	// type:
	//	'wide' || 'abbr' || 'narrow' (e.g. "Monday", "Mon", or "M" respectively, in English)
	// context:
	//	'standAlone' || 'format' (default)
	// locale:
	//	override locale used to find the names

	var label,
		lookup = dojo.date.locale._getGregorianBundle(locale),
		props = [item, context, type];
	if(context == 'standAlone'){
		var key = props.join('-');
		label = lookup[key];
		// Fall back to 'format' flavor of name
		if(label[0] == 1){ label = undefined; } // kludge, in the absence of real aliasing support in dojo.cldr
	}
	props[1] = 'format';

	// return by copy so changes won't be made accidentally to the in-memory model
	return (label || lookup[props.join('-')]).concat(); /*Array*/
};

dojo.date.locale.isWeekend = function(/*Date?*/dateObject, /*String?*/locale){
	// summary:
	//	Determines if the date falls on a weekend, according to local custom.

	var weekend = cldr.getWeekend(locale),
		day = (dateObject || new Date()).getDay();
	if(weekend.end < weekend.start){
		weekend.end += 7;
		if(day < weekend.start){ day += 7; }
	}
	return day >= weekend.start && day <= weekend.end; // Boolean
};

// These are used only by format and strftime.  Do they need to be public?  Which module should they go in?

dojo.date.locale._getDayOfYear = function(/*Date*/dateObject){
	// summary: gets the day of the year as represented by dateObject
	return date.difference(new Date(dateObject.getFullYear(), 0, 1, dateObject.getHours()), dateObject) + 1; // Number
};

dojo.date.locale._getWeekOfYear = function(/*Date*/dateObject, /*Number*/firstDayOfWeek){
	if(arguments.length == 1){ firstDayOfWeek = 0; } // Sunday

	var firstDayOfYear = new Date(dateObject.getFullYear(), 0, 1).getDay(),
		adj = (firstDayOfYear - firstDayOfWeek + 7) % 7,
		week = Math.floor((dojo.date.locale._getDayOfYear(dateObject) + adj - 1) / 7);

	// if year starts on the specified day, start counting weeks at 1
	if(firstDayOfYear == firstDayOfWeek){ week++; }

	return week; // Number
};

return dojo.date.locale;
});

},
'dojox/mobile/TextBox':function(){
define("dojox/mobile/TextBox", [
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dijit/_WidgetBase",
	"dijit/form/_FormValueMixin",
	"dijit/form/_TextBoxMixin"
], function(declare, domConstruct, WidgetBase, FormValueMixin, TextBoxMixin){

	/*=====
		WidgetBase = dijit._WidgetBase;
		FormValueMixin = dijit.form._FormValueMixin;
		TextBoxMixin = dijit.form._TextBoxMixin;
	=====*/
	return declare("dojox.mobile.TextBox",[WidgetBase, FormValueMixin, TextBoxMixin],{
		// summary:
		//		A non-templated base class for textbox form inputs

		baseClass: "mblTextBox",

		// Override automatic assigning type --> node, it causes exception on IE8.
		// Instead, type must be specified as this.type when the node is created, as part of the original DOM
		_setTypeAttr: null,

		// Map widget attributes to DOMNode attributes.
		_setPlaceHolderAttr: "textbox",

		buildRendering: function(){
			if(!this.srcNodeRef){
				this.srcNodeRef = domConstruct.create("input", {"type":this.type});
			}
			this.inherited(arguments);
			this.textbox = this.focusNode = this.domNode;
		},

		postCreate: function(){
			this.inherited(arguments);
			this.connect(this.textbox, "onfocus", "_onFocus");
			this.connect(this.textbox, "onblur", "_onBlur");
		}
	});
});

},
'dojox/mobile/Button':function(){
define("dojox/mobile/Button", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/_WidgetBase",
	"dijit/form/_ButtonMixin",
	"dijit/form/_FormWidgetMixin"
],
	function(array, declare, domClass, domConstruct, WidgetBase, ButtonMixin, FormWidgetMixin){

	/*=====
		WidgetBase = dijit._WidgetBase;
		FormWidgetMixin = dijit.form._FormWidgetMixin;
		ButtonMixin = dijit.form._ButtonMixin;
	=====*/
	return declare("dojox.mobile.Button", [WidgetBase, FormWidgetMixin, ButtonMixin], {
		// summary:
		//	Non-templated BUTTON widget with a thin API wrapper for click events and setting the label
		//
		// description:
		//              Buttons can display a label, an icon, or both.
		//              A label should always be specified (through innerHTML) or the label
		//              attribute.  It can be hidden via showLabel=false.
		// example:
		// |    <button dojoType="dijit.form.Button" onClick="...">Hello world</button>

		baseClass: "mblButton",

		// Override automatic assigning type --> node, it causes exception on IE.
		// Instead, type must be specified as this.type when the node is created, as part of the original DOM
		_setTypeAttr: null,

		// duration: Number
		//	duration of selection, milliseconds or -1 for no post-click CSS styling
		duration: 1000,

		_onClick: function(e){
			var ret = this.inherited(arguments);
			if(ret && this.duration >= 0){ // if its not a button with a state, then emulate press styles
				var button = this.focusNode || this.domNode;
				var newStateClasses = (this.baseClass+' '+this["class"]).split(" ");
				newStateClasses = array.map(newStateClasses, function(c){ return c+"Selected"; });
				domClass.add(button, newStateClasses);
				setTimeout(function(){
					domClass.remove(button, newStateClasses);
				}, this.duration);
			}
			return ret;
		},

		isFocusable: function(){ return false; },

		buildRendering: function(){
			if(!this.srcNodeRef){
				this.srcNodeRef = domConstruct.create("button", {"type": this.type});
			}else if(this._cv){
				var n = this.srcNodeRef.firstChild;
				if(n && n.nodeType === 3){
					n.nodeValue = this._cv(n.nodeValue);
				}
			}
			this.inherited(arguments);
			this.focusNode = this.domNode;
		},

		postCreate: function(){
			this.inherited(arguments);
			this.connect(this.domNode, "onclick", "_onClick");
		},

		_setLabelAttr: function(/*String*/ content){
			this.inherited(arguments, [this._cv ? this._cv(content) : content]);
		}
	});

});

},
'versa/api/ViewMappings':function(){
/**
 * @author aarons
 */
define("versa/api/ViewMappings", ["dojo/_base/declare",
         "versa/api/_Collection",
         "versa/api/Error",
         "versa/api/ViewMapping"],
    function(declare){
        var o=declare("versa.api.ViewMappings", [versa.api._Collection], {
            constructor: function(/* Object */args){
                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.ViewMappings.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.ViewMapping.schema;
                this.cache = false;

                this._initialize();
            },

            getMapping: function(folder_id, user_id){
                return this.query({query:dojo.replace('?folder_id={0}&user_id={1}', [folder_id, user_id])})
            }
        });

        o.TRGT='/zones/{0}/libraries/{1}/view_mappings';

        return o;
    }
);



},
'versa/api/Roles':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 11/10/11
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Roles", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Role"],
    function(declare){
        var o=declare("versa.api.Roles", [versa.api._Collection], {
            zone: null,

            constructor: function(args){
                this.zone = args.zone;
                this.target = dojo.replace(versa.api.Roles.TRGT, this.zone);
                this.schema = versa.api.Role.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.TRGT = '/zones/{subdomain}/roles';

        return o;
    }
);


},
'versa/api/_Configurable':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 29/01/12
 * Time: 7:55 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/_Configurable", ["dojo/_base/declare"],
    function(declare){
        return declare("versa.api._Configurable", [], {
            configuration: {
                configuration_settings: []
            },

            constructor: function(args){

            },

            getValue: function(name){

                var value = null;

                dojo.some(this.configuration.configuration_settings, function(setting, idx){
                    if(setting.name.toLowerCase() == name.toLowerCase()){
                        value = setting.value;
                        return true;
                    }
                    return false
                }, this);

                return value;
            }
        });
    }
);

},
'dojox/mobile/TabBar':function(){
define("dojox/mobile/TabBar", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./Heading",
	"./TabBarButton"
], function(array, declare, domClass, domConstruct, domGeometry, domStyle, Contained, Container, WidgetBase, Heading, TabBarButton){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/TabBar
	// summary:
	//		A bar widget that has buttons to control visibility of views.

	return declare("dojox.mobile.TabBar", [WidgetBase, Container, Contained],{
		// summary:
		//		A bar widget that has buttons to control visibility of views.
		// description:
		//		TabBar is a container widget that has typically multiple
		//		TabBarButtons which controls visibility of views. It can be used
		//		as a tab container.

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// iconPos: String
		//		The default icon position for child items.
		iconPos: "",

		// barType: String
		//		"tabBar"(default) or "segmentedControl".
		barType: "tabBar",

		// inHeading: Boolean
		//		A flag that indicates whether this widget is in a Heading
		//		widget.
		inHeading: false,

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "UL",

		/* internal properties */	
		_fixedButtonWidth: 76,
		_fixedButtonMargin: 17,
		_largeScreenWidth: 500,

		buildRendering: function(){
			this._clsName = this.barType == "segmentedControl" ? "mblTabButton" : "mblTabBarButton";
			this.domNode = this.containerNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.domNode.className = this.barType == "segmentedControl" ? "mblTabPanelHeader" : "mblTabBar";
		},

		startup: function(){
			if(this._started){ return; }
			this.inherited(arguments);
			this.resize();
		},

		resize: function(size){
			var i,w;
			if(size && size.w){
				domGeometry.setMarginBox(this.domNode, size);
				w = size.w;
			}else{
				// Calculation of the bar width varies according to its "position" value.
				// When the widget is used as a fixed bar, its position would be "absolute".
				w = domStyle.get(this.domNode, "position") === "absolute" ?
					domGeometry.getContentBox(this.domNode).w : domGeometry.getMarginBox(this.domNode).w;
			}
			var bw = this._fixedButtonWidth;
			var bm = this._fixedButtonMargin;
	
			var children = this.containerNode.childNodes;
			var arr = [];
			for(i = 0; i < children.length; i++){
				var c = children[i];
				if(c.nodeType != 1){ continue; }
				if(domClass.contains(c, this._clsName)){
					arr.push(c);
				}
			}
	
			var margin;
			if(this.barType == "segmentedControl"){
				margin = w;
				var totalW = 0; // total width of all the buttons
				for(i = 0; i < arr.length; i++){
					margin -= domGeometry.getMarginBox(arr[i]).w;
					totalW += arr[i].offsetWidth;
				}
				margin = Math.floor(margin/2);
				var parent = this.getParent();
				var inHeading = this.inHeading || parent instanceof Heading;
				this.containerNode.style.padding = (inHeading ? 0 : 3) + "px 0px 0px " + (inHeading ? 0 : margin) + "px";
				if(inHeading){
					domStyle.set(this.domNode, {
						background: "none",
						border: "none",
						width: totalW + 2 + "px"
					});
				}
				domClass.add(this.domNode, "mblTabBar" + (inHeading ? "Head" : "Top"));
			}else{
				margin = Math.floor((w - (bw + bm * 2) * arr.length) / 2);
				if(w < this._largeScreenWidth || margin < 0){
					// If # of buttons is 4, for example, assign "25%" to each button.
					// More precisely, 1%(left margin) + 98%(bar width) + 1%(right margin)
					for(i = 0; i < arr.length; i++){
						arr[i].style.width = Math.round(98/arr.length) + "%";
						arr[i].style.margin = "0px";
					}
					this.containerNode.style.padding = "0px 0px 0px 1%";
				}else{
					// Fixed width buttons. Mainly for larger screen such as iPad.
					for(i = 0; i < arr.length; i++){
						arr[i].style.width = bw + "px";
						arr[i].style.margin = "0 " + bm + "px";
					}
					if(arr.length > 0){
						arr[0].style.marginLeft = margin + bm + "px";
					}
					this.containerNode.style.padding = "0px";
				}
			}

			if(!array.some(this.getChildren(), function(child){ return child.iconNode1; })){
				domClass.add(this.domNode, "mblTabBarNoIcons");
			}else{
				domClass.remove(this.domNode, "mblTabBarNoIcons");
			}

			if(!array.some(this.getChildren(), function(child){ return child.label; })){
				domClass.add(this.domNode, "mblTabBarNoText");
			}else{
				domClass.remove(this.domNode, "mblTabBarNoText");
			}
		}
	});

});

},
'versa/api/Version':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 08/09/11
 * Time: 12:00 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Version", ["dojo/_base/declare",
         "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.Version", [versa.api._Object], {
            zone: null,
            library: null,
            document: null,

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            copyLocal: function(args){
                var zone = args.zone;
                var library = args.library;
                var document = args.document;

                var url = dojo.replace(versa.api.Version.CP_TRGT, [zone.subdomain, library.id, document.id, this.id]);
                versa.api.Utilities.saveUrl({
                    url: url,
                    window_name: 'versa_save'
                });

            },

            view: function(args){
                var zone = args.zone;
                var library = args.library;
                var document = args.document;

                var url = dojo.replace(versa.api.Version.VW_TRGT, [zone.subdomain, library.id, document.id, this.id]);

                versa.api.Utilities.viewUrl({
                    windowBox: args.windowBox,
                    url: url,
                    window_name: 'versa_viewer'
                });
            }
        });

        o.VW_TRGT = '/zones/{0}/libraries/{1}/documents/{2}/download/?disposition=inline&version_id={3}';
        o.CP_TRGT = '/zones/{0}/libraries/{1}/documents/{2}/download/?disposition=attachment&version_id={3}';


        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'binary_file_name': {
                    type: 'string',
                    'default': ''
                },
                'binary_content_type': {
                    type: 'string',
                    'default': ''
                }
            },
            prototype: new o()
        };

        return o;
    }
);


},
'dojox/mobile/scrollable':function(){


define("dojox/mobile/scrollable", [
	"dojo/_base/kernel",
	"dojo/_base/connect",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"./sniff"
], function(dojo, connect, event, lang, win, domClass, domConstruct, domStyle, has){

	var dm = lang.getObject("dojox.mobile", true);

/*=====
// summary:
//		Utility for enabling touch scrolling capability.
// description:
//		Mobile WebKit browsers do not allow scrolling inner DIVs. (You need
//		the two-finger operation to scroll them.)
//		That means you cannot have fixed-positioned header/footer bars.
//		To solve this issue, this module disables the browsers default scrolling
//		behavior, and re-builds its own scrolling machinery by handling touch
//		events. In this module, this.domNode has height "100%" and is fixed to
//		the window, and this.containerNode scrolls. If you place a bar outside
//		of this.containerNode, then it will be fixed-positioned while
//		this.containerNode is scrollable.
//
//		This module has the following features:
//		- Scrolls inner DIVs vertically, horizontally, or both.
//		- Vertical and horizontal scroll bars.
//		- Flashes the scroll bars when a view is shown.
//		- Simulates the flick operation using animation.
//		- Respects header/footer bars if any.
//
//		dojox.mobile.scrollable is a simple function object, which holds
//		several properties and functions in it. But if you transform it to a
//		dojo class, it can be used as a mix-in class for any custom dojo
//		widgets. dojox.mobile._ScrollableMixin is such a class.
//
//		Also, it can be used even for non-dojo applications. In such cases,
//		several dojo APIs used in this module, such as dojo.connect,
//		dojo.create, etc., are re-defined so that the code works without dojo.
//		When in dojo, of course those re-defined functions are not necessary.
//		So, they are surrounded by the includeStart and includeEnd directives
//		so that they can be excluded from the build.
//
//		If you use this module for non-dojo application, you need to explicitly
//		assign your outer fixed node and inner scrollable node to this.domNode
//		and this.containerNode respectively.
//
//		Non-dojo application should capture the onorientationchange or
//		the onresize event and call resize() in the event handler.
//
// example:
//		Use this module from a non-dojo applicatoin:
//		| function onLoad(){
//		| 	var scrollable = new dojox.mobile.scrollable(dojo, dojox);
//		| 	scrollable.init({
//		| 		domNode: "outer", // id or node
//		| 		containerNode: "inner" // id or node
//		| 	});
//		| }
//		| <body onload="onLoad()">
//		| 	<h1 id="hd1" style="position:relative;width:100%;z-index:1;">
//		| 		Fixed Header
//		| 	</h1>
//		| 	<div id="outer" style="position:relative;height:100%;overflow:hidden;">
//		| 		<div id="inner" style="position:absolute;width:100%;">
//		| 			... content ...
//		| 		</div>
//		| 	</div>
//		| </body>
=====*/

var scrollable = function(/*Object?*/dojo, /*Object?*/dojox){
	this.fixedHeaderHeight = 0; // height of a fixed header
	this.fixedFooterHeight = 0; // height of a fixed footer
	this.isLocalFooter = false; // footer is view-local (as opposed to application-wide)
	this.scrollBar = true; // show scroll bar or not
	this.scrollDir = "v"; // v: vertical, h: horizontal, vh: both, f: flip
	this.weight = 0.6; // frictional drag
	this.fadeScrollBar = true;
	this.disableFlashScrollBar = false;
	this.threshold = 4; // drag threshold value in pixels
	this.constraint = true; // bounce back to the content area
	this.touchNode = null; // a node that will have touch event handlers
	this.isNested = false; // this scrollable's parent is also a scrollable
	this.dirLock = false; // disable the move handler if scroll starts in the unexpected direction
	this.height = ""; // explicitly specified height of this widget (ex. "300px")
	this.androidWorkaroud = true; // workaround input field jumping issue


	this.init = function(/*Object?*/params){
		if(params){
			for(var p in params){
				if(params.hasOwnProperty(p)){
					this[p] = ((p == "domNode" || p == "containerNode") && typeof params[p] == "string") ?
						win.doc.getElementById(params[p]) : params[p]; // mix-in params
				}
			}
		}
		this.touchNode = this.touchNode || this.containerNode;
		this._v = (this.scrollDir.indexOf("v") != -1); // vertical scrolling
		this._h = (this.scrollDir.indexOf("h") != -1); // horizontal scrolling
		this._f = (this.scrollDir == "f"); // flipping views

		this._ch = []; // connect handlers
		this._ch.push(connect.connect(this.touchNode,
			has("touch") ? "touchstart" : "onmousedown", this, "onTouchStart"));
		if(has("webkit")){
			this._ch.push(connect.connect(this.domNode, "webkitAnimationEnd", this, "onFlickAnimationEnd"));
			this._ch.push(connect.connect(this.domNode, "webkitAnimationStart", this, "onFlickAnimationStart"));

			this._aw = this.androidWorkaroud &&
				has("android") >= 2.2 && has("android") < 3;
			if(this._aw){
				this._ch.push(connect.connect(win.global, "onresize", this, "onScreenSizeChanged"));
				this._ch.push(connect.connect(win.global, "onfocus", this, function(e){
					if(this.containerNode.style.webkitTransform){
						this.stopAnimation();
						this.toTopLeft();
					}
				}));
				this._sz = this.getScreenSize();
			}

			// Creation of keyframes takes a little time. If they are created
			// in a lazy manner, a slight delay is noticeable when you start
			// scrolling for the first time. This is to create keyframes up front.
			for(var i = 0; i < 3; i++){
				this.setKeyframes(null, null, i);
			}
		}
		// Workaround for iPhone flicker issue
		if(has("iphone")){
			domStyle.set(this.containerNode, "webkitTransform", "translate3d(0,0,0)");
		}
		
		this._speed = {x:0, y:0};
		this._appFooterHeight = 0;
		if(this.isTopLevel() && !this.noResize){
			this.resize();
		}
		var _this = this;
		setTimeout(function(){
			_this.flashScrollBar();
		}, 600);
	};

	this.isTopLevel = function(){
		// subclass may want to override
		return true;
	};

	this.cleanup = function(){
		if(this._ch){
			for(var i = 0; i < this._ch.length; i++){
				connect.disconnect(this._ch[i]);
			}
			this._ch = null;
		}
	};

	this.findDisp = function(/*DomNode*/node){
		// summary:
		//		Finds the currently displayed view node from my sibling nodes.
		if(!node.parentNode){ return null; }
		var nodes = node.parentNode.childNodes;
		for(var i = 0; i < nodes.length; i++){
			var n = nodes[i];
			if(n.nodeType === 1 && domClass.contains(n, "mblView") && n.style.display !== "none"){
				return n;
			}
		}
		return node;
	};

	this.getScreenSize = function(){
		// summary:
		//		Returns the dimensions of the browser window.
		return {
			h: win.global.innerHeight||win.doc.documentElement.clientHeight||win.doc.documentElement.offsetHeight,
			w: win.global.innerWidth||win.doc.documentElement.clientWidth||win.doc.documentElement.offsetWidth
		};
	};

	this.isKeyboardShown = function(e){
		// summary:
		//		Internal function for android workaround.
		// description:
		//		Returns true if a virtual keyboard is shown.
		//		Indirectly detects whether a virtual keyboard is shown or not by
		//		examining the screen size.
		// TODO: need more reliable detection logic
		if(!this._sz){ return false; }
		var sz = this.getScreenSize();
		return (sz.w * sz.h) / (this._sz.w * this._sz.h) < 0.8;
	};

	this.disableScroll = function(/*Boolean*/v){
		// summary:
		//		Internal function for android workaround.
		// description:
		//		Disables the touch scrolling and enables the browser's default
		//		scrolling.
		if(this.disableTouchScroll === v || this.domNode.style.display === "none"){ return; }
		this.disableTouchScroll = v;
		this.scrollBar = !v;
		dm.disableHideAddressBar = dm.disableResizeAll = v;
		var of = v ? "visible" : "hidden";
		domStyle.set(this.domNode, "overflow", of);
		domStyle.set(win.doc.documentElement, "overflow", of);
		domStyle.set(win.body(), "overflow", of);
		var c = this.containerNode;
		if(v){
			if(!c.style.webkitTransform){
				// stop animation when soft keyborad is shown before animation ends.
				// TODO: there might be a better way to wait for animation ending.
				this.stopAnimation();
				this.toTopLeft();
			}
			var mt = parseInt(c.style.marginTop) || 0;
			var h = c.offsetHeight + mt + this.fixedFooterHeight - this._appFooterHeight;
			domStyle.set(this.domNode, "height", h + "px");
			
			this._cPos = { // store containerNode's position
				x: parseInt(c.style.left) || 0,
				y: parseInt(c.style.top) || 0
			};
			domStyle.set(c, {
				top: "0px",
				left: "0px"
			});
			
			var a = win.doc.activeElement; // focused input field
			if(a){ // scrolling to show focused input field
				var at = 0; // top position of focused input field
				for(var n = a; n.tagName != "BODY"; n = n.offsetParent){
					at += n.offsetTop;
				}
				var st = at + a.clientHeight + 10 - this.getScreenSize().h; // top postion of browser scroll bar
				if(st > 0){
					win.body().scrollTop = st;
				}
			}	
		}else{
			if(this._cPos){ // restore containerNode's position
				domStyle.set(c, {
					top: this._cPos.y + "px",
					left: this._cPos.x + "px"
				});
				this._cPos = null;
			}
			var tags = this.domNode.getElementsByTagName("*");
			for(var i = 0; i < tags.length; i++){
				tags[i].blur && tags[i].blur();
			}
			// Call dojox.mobile.resizeAll if exists.
			dm.resizeAll && dm.resizeAll();
		}
	};

	this.onScreenSizeChanged = function(e){
		// summary:
		//		Internal function for android workaround.
		var sz = this.getScreenSize();
		if(sz.w * sz.h > this._sz.w * this._sz.h){
			this._sz = sz; // update the screen size
		}
		this.disableScroll(this.isKeyboardShown());
	};

	this.toTransform = function(e){
		// summary:
		//		Internal function for android workaround.
		var c = this.containerNode;
		if(c.offsetTop === 0 && c.offsetLeft === 0 || !c._webkitTransform){ return; }
		domStyle.set(c, {
			webkitTransform: c._webkitTransform,
			top: "0px",
			left: "0px"
		});
		c._webkitTransform = null;
	};

	this.toTopLeft = function(){
		// summary:
		//		Internal function for android workaround.
		var c = this.containerNode;
		if(!c.style.webkitTransform){ return; } // already converted to top/left
		c._webkitTransform = c.style.webkitTransform;
		var pos = this.getPos();
		domStyle.set(c, {
			webkitTransform: "",
			top: pos.y + "px",
			left: pos.x + "px"
		});
	};
	
	this.resize = function(e){
		// summary:
		//		Adjusts the height of the widget.
		// description:
		//		If the height property is 'inherit', the height is inherited
		//		from its offset parent. If 'auto', the content height, which
		//		could be smaller than the entire screen height, is used. If an
		//		explicit height value (ex. "300px"), it is used as the new
		//		height. If nothing is specified as the height property, from the
		//		current top position of the widget to the bottom of the screen
		//		will be the new height.

		// moved from init() to support dynamically added fixed bars
		this._appFooterHeight = (this.fixedFooterHeight && !this.isLocalFooter) ?
			this.fixedFooterHeight : 0;
		if(this.isLocalHeader){
			this.containerNode.style.marginTop = this.fixedHeaderHeight + "px";
		}

		// Get the top position. Same as dojo.position(node, true).y
		var top = 0;
		for(var n = this.domNode; n && n.tagName != "BODY"; n = n.offsetParent){
			n = this.findDisp(n); // find the first displayed view node
			if(!n){ break; }
			top += n.offsetTop;
		}

		// adjust the height of this view
		var	h,
			screenHeight = this.getScreenSize().h,
			dh = screenHeight - top - this._appFooterHeight; // default height
		if(this.height === "inherit"){
			if(this.domNode.offsetParent){
				h = this.domNode.offsetParent.offsetHeight + "px";
			}
		}else if(this.height === "auto"){
			var parent = this.domNode.offsetParent;
			if(parent){
				this.domNode.style.height = "0px";
				var	parentRect = parent.getBoundingClientRect(),
					scrollableRect = this.domNode.getBoundingClientRect(),
					contentBottom = parentRect.bottom - this._appFooterHeight;
				if(scrollableRect.bottom >= contentBottom){ // use entire screen
					dh = screenHeight - (scrollableRect.top - parentRect.top) - this._appFooterHeight;
				}else{ // stretch to fill predefined area
					dh = contentBottom - scrollableRect.bottom;
				}
			}
			// content could be smaller than entire screen height
			var contentHeight = Math.max(this.domNode.scrollHeight, this.containerNode.scrollHeight);
			h = (contentHeight ? Math.min(contentHeight, dh) : dh) + "px";
		}else if(this.height){
			h = this.height;
		}
		if(!h){
			h = dh + "px";
		}
		if(h.charAt(0) !== "-" && // to ensure that h is not negative (e.g. "-10px")
			h !== "default"){
			this.domNode.style.height = h;
		}

		// to ensure that the view is within a scrolling area when resized.
		this.onTouchEnd();
	};

	this.onFlickAnimationStart = function(e){
		event.stop(e);
	};

	this.onFlickAnimationEnd = function(e){
		var an = e && e.animationName;
		if(an && an.indexOf("scrollableViewScroll2") === -1){
			if(an.indexOf("scrollableViewScroll0") !== -1){ // scrollBarV
				domClass.remove(this._scrollBarNodeV, "mblScrollableScrollTo0");
			}else if(an.indexOf("scrollableViewScroll1") !== -1){ // scrollBarH
				domClass.remove(this._scrollBarNodeH, "mblScrollableScrollTo1");
			}else{ // fade or others
				if(this._scrollBarNodeV){ this._scrollBarNodeV.className = ""; }
				if(this._scrollBarNodeH){ this._scrollBarNodeH.className = ""; }
			}
			return;
		}
		if(e && e.srcElement){
			event.stop(e);
		}
		this.stopAnimation();
		if(this._bounce){
			var _this = this;
			var bounce = _this._bounce;
			setTimeout(function(){
				_this.slideTo(bounce, 0.3, "ease-out");
			}, 0);
			_this._bounce = undefined;
		}else{
			this.hideScrollBar();
			this.removeCover();
			if(this._aw){ this.toTopLeft(); } // android workaround
		}
	};

	this.isFormElement = function(node){
		if(node && node.nodeType !== 1){ node = node.parentNode; }
		if(!node || node.nodeType !== 1){ return false; }
		var t = node.tagName;
		return (t === "SELECT" || t === "INPUT" || t === "TEXTAREA" || t === "BUTTON");
	};

	this.onTouchStart = function(e){
		if(this.disableTouchScroll){ return; }
		if(this._conn && (new Date()).getTime() - this.startTime < 500){
			return; // ignore successive onTouchStart calls
		}
		if(!this._conn){
			this._conn = [];
			this._conn.push(connect.connect(win.doc, has("touch") ? "touchmove" : "onmousemove", this, "onTouchMove"));
			this._conn.push(connect.connect(win.doc, has("touch") ? "touchend" : "onmouseup", this, "onTouchEnd"));
		}

		this._aborted = false;
		if(domClass.contains(this.containerNode, "mblScrollableScrollTo2")){
			this.abort();
		}else{ // reset scrollbar class especially for reseting fade-out animation
			if(this._scrollBarNodeV){ this._scrollBarNodeV.className = ""; }
			if(this._scrollBarNodeH){ this._scrollBarNodeH.className = ""; }
		}
		if(this._aw){ this.toTransform(e); } // android workaround
		this.touchStartX = e.touches ? e.touches[0].pageX : e.clientX;
		this.touchStartY = e.touches ? e.touches[0].pageY : e.clientY;
		this.startTime = (new Date()).getTime();
		this.startPos = this.getPos();
		this._dim = this.getDim();
		this._time = [0];
		this._posX = [this.touchStartX];
		this._posY = [this.touchStartY];
		this._locked = false;

		if(!this.isFormElement(e.target) && !this.isNested){
			event.stop(e);
		}
	};

	this.onTouchMove = function(e){
		if(this._locked){ return; }
		var x = e.touches ? e.touches[0].pageX : e.clientX;
		var y = e.touches ? e.touches[0].pageY : e.clientY;
		var dx = x - this.touchStartX;
		var dy = y - this.touchStartY;
		var to = {x:this.startPos.x + dx, y:this.startPos.y + dy};
		var dim = this._dim;

		dx = Math.abs(dx);
		dy = Math.abs(dy);
		if(this._time.length == 1){ // the first TouchMove after TouchStart
			if(this.dirLock){
				if(this._v && !this._h && dx >= this.threshold && dx >= dy ||
					(this._h || this._f) && !this._v && dy >= this.threshold && dy >= dx){
					this._locked = true;
					return;
				}
			}
			if(this._v && Math.abs(dy) < this.threshold ||
				(this._h || this._f) && Math.abs(dx) < this.threshold){
				return;
			}
			this.addCover();
			this.showScrollBar();
		}

		var weight = this.weight;
		if(this._v && this.constraint){
			if(to.y > 0){ // content is below the screen area
				to.y = Math.round(to.y * weight);
			}else if(to.y < -dim.o.h){ // content is above the screen area
				if(dim.c.h < dim.d.h){ // content is shorter than display
					to.y = Math.round(to.y * weight);
				}else{
					to.y = -dim.o.h - Math.round((-dim.o.h - to.y) * weight);
				}
			}
		}
		if((this._h || this._f) && this.constraint){
			if(to.x > 0){
				to.x = Math.round(to.x * weight);
			}else if(to.x < -dim.o.w){
				if(dim.c.w < dim.d.w){
					to.x = Math.round(to.x * weight);
				}else{
					to.x = -dim.o.w - Math.round((-dim.o.w - to.x) * weight);
				}
			}
		}
		this.scrollTo(to);

		var max = 10;
		var n = this._time.length; // # of samples
		if(n >= 2){
			// Check the direction of the finger move.
			// If the direction has been changed, discard the old data.
			var d0, d1;
			if(this._v && !this._h){
				d0 = this._posY[n - 1] - this._posY[n - 2];
				d1 = y - this._posY[n - 1];
			}else if(!this._v && this._h){
				d0 = this._posX[n - 1] - this._posX[n - 2];
				d1 = x - this._posX[n - 1];
			}
			if(d0 * d1 < 0){ // direction changed
				// leave only the latest data
				this._time = [this._time[n - 1]];
				this._posX = [this._posX[n - 1]];
				this._posY = [this._posY[n - 1]];
				n = 1;
			}
		}
		if(n == max){
			this._time.shift();
			this._posX.shift();
			this._posY.shift();
		}
		this._time.push((new Date()).getTime() - this.startTime);
		this._posX.push(x);
		this._posY.push(y);
	};

	this.onTouchEnd = function(e){
		if(this._locked){ return; }
		var speed = this._speed = {x:0, y:0};
		var dim = this._dim;
		var pos = this.getPos();
		var to = {}; // destination
		if(e){
			if(!this._conn){ return; } // if we get onTouchEnd without onTouchStart, ignore it.
			for(var i = 0; i < this._conn.length; i++){
				connect.disconnect(this._conn[i]);
			}
			this._conn = null;
	
			var n = this._time.length; // # of samples
			var clicked = false;
			if(!this._aborted){
				if(n <= 1){
					clicked = true;
				}else if(n == 2 && Math.abs(this._posY[1] - this._posY[0]) < 4
					&& has("touch")){ // for desktop browsers, posY could be the same, since we're using clientY, see onTouchMove()
					clicked = true;
				}
			}
			var isFormElem = this.isFormElement(e.target);
			if(clicked && !isFormElem){ // clicked, not dragged or flicked
				this.hideScrollBar();
				this.removeCover();
				if(has("touch")){
					var elem = e.target;
					if(elem.nodeType != 1){
						elem = elem.parentNode;
					}
					var ev = win.doc.createEvent("MouseEvents");
					ev.initMouseEvent("click", true, true, win.global, 1, e.screenX, e.screenY, e.clientX, e.clientY);
					setTimeout(function(){
						elem.dispatchEvent(ev);
					}, 0);
				}
				return;
			}else if(this._aw && clicked && isFormElem){ // clicked input fields
				this.hideScrollBar();
				this.toTopLeft();
				return;
			}
			speed = this._speed = this.getSpeed();
		}else{
			if(pos.x == 0 && pos.y == 0){ return; } // initializing
			dim = this.getDim();
		}

		if(this._v){
			to.y = pos.y + speed.y;
		}
		if(this._h || this._f){
			to.x = pos.x + speed.x;
		}

		this.adjustDestination(to, pos);

		if(this.scrollDir == "v" && dim.c.h < dim.d.h){ // content is shorter than display
			this.slideTo({y:0}, 0.3, "ease-out"); // go back to the top
			return;
		}else if(this.scrollDir == "h" && dim.c.w < dim.d.w){ // content is narrower than display
			this.slideTo({x:0}, 0.3, "ease-out"); // go back to the left
			return;
		}else if(this._v && this._h && dim.c.h < dim.d.h && dim.c.w < dim.d.w){
			this.slideTo({x:0, y:0}, 0.3, "ease-out"); // go back to the top-left
			return;
		}

		var duration, easing = "ease-out";
		var bounce = {};
		if(this._v && this.constraint){
			if(to.y > 0){ // going down. bounce back to the top.
				if(pos.y > 0){ // started from below the screen area. return quickly.
					duration = 0.3;
					to.y = 0;
				}else{
					to.y = Math.min(to.y, 20);
					easing = "linear";
					bounce.y = 0;
				}
			}else if(-speed.y > dim.o.h - (-pos.y)){ // going up. bounce back to the bottom.
				if(pos.y < -dim.o.h){ // started from above the screen top. return quickly.
					duration = 0.3;
					to.y = dim.c.h <= dim.d.h ? 0 : -dim.o.h; // if shorter, move to 0
				}else{
					to.y = Math.max(to.y, -dim.o.h - 20);
					easing = "linear";
					bounce.y = -dim.o.h;
				}
			}
		}
		if((this._h || this._f) && this.constraint){
			if(to.x > 0){ // going right. bounce back to the left.
				if(pos.x > 0){ // started from right of the screen area. return quickly.
					duration = 0.3;
					to.x = 0;
				}else{
					to.x = Math.min(to.x, 20);
					easing = "linear";
					bounce.x = 0;
				}
			}else if(-speed.x > dim.o.w - (-pos.x)){ // going left. bounce back to the right.
				if(pos.x < -dim.o.w){ // started from left of the screen top. return quickly.
					duration = 0.3;
					to.x = dim.c.w <= dim.d.w ? 0 : -dim.o.w; // if narrower, move to 0
				}else{
					to.x = Math.max(to.x, -dim.o.w - 20);
					easing = "linear";
					bounce.x = -dim.o.w;
				}
			}
		}
		this._bounce = (bounce.x !== undefined || bounce.y !== undefined) ? bounce : undefined;

		if(duration === undefined){
			var distance, velocity;
			if(this._v && this._h){
				velocity = Math.sqrt(speed.x+speed.x + speed.y*speed.y);
				distance = Math.sqrt(Math.pow(to.y - pos.y, 2) + Math.pow(to.x - pos.x, 2));
			}else if(this._v){
				velocity = speed.y;
				distance = to.y - pos.y;
			}else if(this._h){
				velocity = speed.x;
				distance = to.x - pos.x;
			}
			if(distance === 0 && !e){ return; } // #13154
			duration = velocity !== 0 ? Math.abs(distance / velocity) : 0.01; // time = distance / velocity
		}
		this.slideTo(to, duration, easing);
	};

	this.adjustDestination = function(to, pos){
		// subclass may want to implement
	};

	this.abort = function(){
		this.scrollTo(this.getPos());
		this.stopAnimation();
		this._aborted = true;
	};

	this.stopAnimation = function(){
		// stop the currently running animation
		domClass.remove(this.containerNode, "mblScrollableScrollTo2");
		if(has("android")){
			domStyle.set(this.containerNode, "webkitAnimationDuration", "0s"); // workaround for android screen flicker problem
		}
		if(this._scrollBarV){
			this._scrollBarV.className = "";
		}
		if(this._scrollBarH){
			this._scrollBarH.className = "";
		}
	};

	this.getSpeed = function(){
		var x = 0, y = 0, n = this._time.length;
		// if the user holds the mouse or finger more than 0.5 sec, do not move.
		if(n >= 2 && (new Date()).getTime() - this.startTime - this._time[n - 1] < 500){
			var dy = this._posY[n - (n > 3 ? 2 : 1)] - this._posY[(n - 6) >= 0 ? n - 6 : 0];
			var dx = this._posX[n - (n > 3 ? 2 : 1)] - this._posX[(n - 6) >= 0 ? n - 6 : 0];
			var dt = this._time[n - (n > 3 ? 2 : 1)] - this._time[(n - 6) >= 0 ? n - 6 : 0];
			y = this.calcSpeed(dy, dt);
			x = this.calcSpeed(dx, dt);
		}
		return {x:x, y:y};
	};

	this.calcSpeed = function(/*Number*/d, /*Number*/t){
		return Math.round(d / t * 100) * 4;
	};

	this.scrollTo = function(/*Object*/to, /*Boolean?*/doNotMoveScrollBar, /*DomNode?*/node){ // to: {x, y}
		// summary:
		//		Scrolls to the given position.
		var s = (node || this.containerNode).style;
		if(has("webkit")){
			s.webkitTransform = this.makeTranslateStr(to);
		}else{
			if(this._v){
				s.top = to.y + "px";
			}
			if(this._h || this._f){
				s.left = to.x + "px";
			}
		}
		if(!doNotMoveScrollBar){
			this.scrollScrollBarTo(this.calcScrollBarPos(to));
		}
	};

	this.slideTo = function(/*Object*/to, /*Number*/duration, /*String*/easing){
		// summary:
		//		Scrolls to the given position with slide animation.
		this._runSlideAnimation(this.getPos(), to, duration, easing, this.containerNode, 2);
		this.slideScrollBarTo(to, duration, easing);
	};

	this.makeTranslateStr = function(to){
		var y = this._v && typeof to.y == "number" ? to.y+"px" : "0px";
		var x = (this._h||this._f) && typeof to.x == "number" ? to.x+"px" : "0px";
		return dm.hasTranslate3d ?
				"translate3d("+x+","+y+",0px)" : "translate("+x+","+y+")";
	};

	this.getPos = function(){
		// summary:
		//		Get the top position in the midst of animation
		if(has("webkit")){
			var m = win.doc.defaultView.getComputedStyle(this.containerNode, '')["-webkit-transform"];
			if(m && m.indexOf("matrix") === 0){
				var arr = m.split(/[,\s\)]+/);
				return {y:arr[5] - 0, x:arr[4] - 0};
			}
			return {x:0, y:0};
		}else{
			// this.containerNode.offsetTop does not work here,
			// because it adds the height of the top margin.
			var y = parseInt(this.containerNode.style.top) || 0;
			return {y:y, x:this.containerNode.offsetLeft};
		}
	};

	this.getDim = function(){
		var d = {};
		// content width/height
		d.c = {h:this.containerNode.offsetHeight, w:this.containerNode.offsetWidth};

		// view width/height
		d.v = {h:this.domNode.offsetHeight + this._appFooterHeight, w:this.domNode.offsetWidth};

		// display width/height
		d.d = {h:d.v.h - this.fixedHeaderHeight - this.fixedFooterHeight, w:d.v.w};

		// overflowed width/height
		d.o = {h:d.c.h - d.v.h + this.fixedHeaderHeight + this.fixedFooterHeight, w:d.c.w - d.v.w};
		return d;
	};

	this.showScrollBar = function(){
		if(!this.scrollBar){ return; }

		var dim = this._dim;
		if(this.scrollDir == "v" && dim.c.h <= dim.d.h){ return; }
		if(this.scrollDir == "h" && dim.c.w <= dim.d.w){ return; }
		if(this._v && this._h && dim.c.h <= dim.d.h && dim.c.w <= dim.d.w){ return; }

		var createBar = function(self, dir){
			var bar = self["_scrollBarNode" + dir];
			if(!bar){
				var wrapper = domConstruct.create("div", null, self.domNode);
				var props = { position: "absolute", overflow: "hidden" };
				if(dir == "V"){
					props.right = "2px";
					props.width = "5px";
				}else{
					props.bottom = (self.isLocalFooter ? self.fixedFooterHeight : 0) + 2 + "px";
					props.height = "5px";
				}
				domStyle.set(wrapper, props);
				wrapper.className = "mblScrollBarWrapper";
				self["_scrollBarWrapper"+dir] = wrapper;

				bar = domConstruct.create("div", null, wrapper);
				domStyle.set(bar, {
					opacity: 0.6,
					position: "absolute",
					backgroundColor: "#606060",
					fontSize: "1px",
					webkitBorderRadius: "2px",
					MozBorderRadius: "2px",
					webkitTransformOrigin: "0 0",
					zIndex: 2147483647 // max of signed 32-bit integer
				});
				domStyle.set(bar, dir == "V" ? {width: "5px"} : {height: "5px"});
				self["_scrollBarNode" + dir] = bar;
			}
			return bar;
		};
		if(this._v && !this._scrollBarV){
			this._scrollBarV = createBar(this, "V");
		}
		if(this._h && !this._scrollBarH){
			this._scrollBarH = createBar(this, "H");
		}
		this.resetScrollBar();
	};

	this.hideScrollBar = function(){
		var fadeRule;
		if(this.fadeScrollBar && has("webkit")){
			if(!dm._fadeRule){
				var node = domConstruct.create("style", null, win.doc.getElementsByTagName("head")[0]);
				node.textContent =
					".mblScrollableFadeScrollBar{"+
					"  -webkit-animation-duration: 1s;"+
					"  -webkit-animation-name: scrollableViewFadeScrollBar;}"+
					"@-webkit-keyframes scrollableViewFadeScrollBar{"+
					"  from { opacity: 0.6; }"+
					"  to { opacity: 0; }}";
				dm._fadeRule = node.sheet.cssRules[1];
			}
			fadeRule = dm._fadeRule;
		}
		if(!this.scrollBar){ return; }
		var f = function(bar, self){
			domStyle.set(bar, {
				opacity: 0,
				webkitAnimationDuration: ""
			});
			if(self._aw){ // android workaround
				bar.style.webkitTransform = "";
			}else{
				bar.className = "mblScrollableFadeScrollBar";
			}
		};
		if(this._scrollBarV){
			f(this._scrollBarV, this);
			this._scrollBarV = null;
		}
		if(this._scrollBarH){
			f(this._scrollBarH, this);
			this._scrollBarH = null;
		}
	};

	this.calcScrollBarPos = function(/*Object*/to){ // to: {x, y}
		var pos = {};
		var dim = this._dim;
		var f = function(wrapperH, barH, t, d, c){
			var y = Math.round((d - barH - 8) / (d - c) * t);
			if(y < -barH + 5){
				y = -barH + 5;
			}
			if(y > wrapperH - 5){
				y = wrapperH - 5;
			}
			return y;
		};
		if(typeof to.y == "number" && this._scrollBarV){
			pos.y = f(this._scrollBarWrapperV.offsetHeight, this._scrollBarV.offsetHeight, to.y, dim.d.h, dim.c.h);
		}
		if(typeof to.x == "number" && this._scrollBarH){
			pos.x = f(this._scrollBarWrapperH.offsetWidth, this._scrollBarH.offsetWidth, to.x, dim.d.w, dim.c.w);
		}
		return pos;
	};

	this.scrollScrollBarTo = function(/*Object*/to){ // to: {x, y}
		if(!this.scrollBar){ return; }
		if(this._v && this._scrollBarV && typeof to.y == "number"){
			if(has("webkit")){
				this._scrollBarV.style.webkitTransform = this.makeTranslateStr({y:to.y});
			}else{
				this._scrollBarV.style.top = to.y + "px";
			}
		}
		if(this._h && this._scrollBarH && typeof to.x == "number"){
			if(has("webkit")){
				this._scrollBarH.style.webkitTransform = this.makeTranslateStr({x:to.x});
			}else{
				this._scrollBarH.style.left = to.x + "px";
			}
		}
	};

	this.slideScrollBarTo = function(/*Object*/to, /*Number*/duration, /*String*/easing){
		if(!this.scrollBar){ return; }
		var fromPos = this.calcScrollBarPos(this.getPos());
		var toPos = this.calcScrollBarPos(to);
		if(this._v && this._scrollBarV){
			this._runSlideAnimation({y:fromPos.y}, {y:toPos.y}, duration, easing, this._scrollBarV, 0);
		}
		if(this._h && this._scrollBarH){
			this._runSlideAnimation({x:fromPos.x}, {x:toPos.x}, duration, easing, this._scrollBarH, 1);
		}
	};

	this._runSlideAnimation = function(/*Object*/from, /*Object*/to, /*Number*/duration, /*String*/easing, node, idx){
		// idx: 0:scrollbarV, 1:scrollbarH, 2:content
		if(has("webkit")){
			this.setKeyframes(from, to, idx);
			domStyle.set(node, {
				webkitAnimationDuration: duration + "s",
				webkitAnimationTimingFunction: easing
			});
			domClass.add(node, "mblScrollableScrollTo"+idx);
			if(idx == 2){
				this.scrollTo(to, true, node);
			}else{
				this.scrollScrollBarTo(to);
			}
		}else if(dojo.fx && dojo.fx.easing && duration){
			// If you want to support non-webkit browsers,
			// your application needs to load necessary modules as follows:
			//
			// | dojo.require("dojo.fx");
			// | dojo.require("dojo.fx.easing");
			//
			// This module itself does not make dependency on them.
			var s = dojo.fx.slideTo({
				node: node,
				duration: duration*1000,
				left: to.x,
				top: to.y,
				easing: (easing == "ease-out") ? dojo.fx.easing.quadOut : dojo.fx.easing.linear
			}).play();
			if(idx == 2){
				connect.connect(s, "onEnd", this, "onFlickAnimationEnd");
			}
		}else{
			// directly jump to the destination without animation
			if(idx == 2){
				this.scrollTo(to, false, node);
				this.onFlickAnimationEnd();
			}else{
				this.scrollScrollBarTo(to);
			}
		}
	};

	this.resetScrollBar = function(){
		//	summary:
		//		Resets the scroll bar length, position, etc.
		var f = function(wrapper, bar, d, c, hd, v){
			if(!bar){ return; }
			var props = {};
			props[v ? "top" : "left"] = hd + 4 + "px"; // +4 is for top or left margin
			var t = (d - 8) <= 0 ? 1 : d - 8;
			props[v ? "height" : "width"] = t + "px";
			domStyle.set(wrapper, props);
			var l = Math.round(d * d / c); // scroll bar length
			l = Math.min(Math.max(l - 8, 5), t); // -8 is for margin for both ends
			bar.style[v ? "height" : "width"] = l + "px";
			domStyle.set(bar, {"opacity": 0.6});
		};
		var dim = this.getDim();
		f(this._scrollBarWrapperV, this._scrollBarV, dim.d.h, dim.c.h, this.fixedHeaderHeight, true);
		f(this._scrollBarWrapperH, this._scrollBarH, dim.d.w, dim.c.w, 0);
		this.createMask();
	};

	this.createMask = function(){
		//	summary:
		//		Creates a mask for a scroll bar edge.
		// description:
		//		This function creates a mask that hides corners of one scroll
		//		bar edge to make it round edge. The other side of the edge is
		//		always visible and round shaped with the border-radius style.
		if(!has("webkit")){ return; }
		var ctx;
		if(this._scrollBarWrapperV){
			var h = this._scrollBarWrapperV.offsetHeight;
			ctx = win.doc.getCSSCanvasContext("2d", "scrollBarMaskV", 5, h);
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fillRect(1, 0, 3, 2);
			ctx.fillRect(0, 1, 5, 1);
			ctx.fillRect(0, h - 2, 5, 1);
			ctx.fillRect(1, h - 1, 3, 2);
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.fillRect(0, 2, 5, h - 4);
			this._scrollBarWrapperV.style.webkitMaskImage = "-webkit-canvas(scrollBarMaskV)";
		}
		if(this._scrollBarWrapperH){
			var w = this._scrollBarWrapperH.offsetWidth;
			ctx = win.doc.getCSSCanvasContext("2d", "scrollBarMaskH", w, 5);
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fillRect(0, 1, 2, 3);
			ctx.fillRect(1, 0, 1, 5);
			ctx.fillRect(w - 2, 0, 1, 5);
			ctx.fillRect(w - 1, 1, 2, 3);
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.fillRect(2, 0, w - 4, 5);
			this._scrollBarWrapperH.style.webkitMaskImage = "-webkit-canvas(scrollBarMaskH)";
		}
	};

	this.flashScrollBar = function(){
		if(this.disableFlashScrollBar || !this.domNode){ return; }
		this._dim = this.getDim();
		if(this._dim.d.h <= 0){ return; } // dom is not ready
		this.showScrollBar();
		var _this = this;
		setTimeout(function(){
			_this.hideScrollBar();
		}, 300);
	};

	this.addCover = function(){
		if(!has("touch") && !this.noCover){
			if(!this._cover){
				this._cover = domConstruct.create("div", null, win.doc.body);
				domStyle.set(this._cover, {
					backgroundColor: "#ffff00",
					opacity: 0,
					position: "absolute",
					top: "0px",
					left: "0px",
					width: "100%",
					height: "100%",
					zIndex: 2147483647 // max of signed 32-bit integer
				});
				this._ch.push(connect.connect(this._cover,
					has("touch") ? "touchstart" : "onmousedown", this, "onTouchEnd"));
			}else{
				this._cover.style.display = "";
			}
			this.setSelectable(this._cover, false);
			this.setSelectable(this.domNode, false);
		}
	};

	this.removeCover = function(){
		if(!has("touch") && this._cover){
			this._cover.style.display = "none";
			this.setSelectable(this._cover, true);
			this.setSelectable(this.domNode, true);
		}
	};

	this.setKeyframes = function(/*Object*/from, /*Object*/to, /*Number*/idx){
		if(!dm._rule){
			dm._rule = [];
		}
		// idx: 0:scrollbarV, 1:scrollbarH, 2:content
		if(!dm._rule[idx]){
			var node = domConstruct.create("style", null, win.doc.getElementsByTagName("head")[0]);
			node.textContent =
				".mblScrollableScrollTo"+idx+"{-webkit-animation-name: scrollableViewScroll"+idx+";}"+
				"@-webkit-keyframes scrollableViewScroll"+idx+"{}";
			dm._rule[idx] = node.sheet.cssRules[1];
		}
		var rule = dm._rule[idx];
		if(rule){
			if(from){
				rule.deleteRule("from");
				rule.insertRule("from { -webkit-transform: "+this.makeTranslateStr(from)+"; }");
			}
			if(to){
				if(to.x === undefined){ to.x = from.x; }
				if(to.y === undefined){ to.y = from.y; }
				rule.deleteRule("to");
				rule.insertRule("to { -webkit-transform: "+this.makeTranslateStr(to)+"; }");
			}
		}
	};

	this.setSelectable = function(node, selectable){
		// dojo.setSelectable has dependency on dojo.query. Re-define our own.
		node.style.KhtmlUserSelect = selectable ? "auto" : "none";
		node.style.MozUserSelect = selectable ? "" : "none";
		node.onselectstart = selectable ? null : function(){return false;};
		if(has("ie")){
			node.unselectable = selectable ? "" : "on";
			var nodes = node.getElementsByTagName("*");
			for(var i = 0; i < nodes.length; i++){
				nodes[i].unselectable = selectable ? "" : "on";
			}
		}
	};

	// feature detection
	if(has("webkit")){
		var elem = win.doc.createElement("div");
		elem.style.webkitTransform = "translate3d(0px,1px,0px)";
		win.doc.documentElement.appendChild(elem);
		var v = win.doc.defaultView.getComputedStyle(elem, '')["-webkit-transform"];
		dm.hasTranslate3d = v && v.indexOf("matrix") === 0;
		win.doc.documentElement.removeChild(elem);
	}
};

dm.scrollable = scrollable; // for backward compatibility
return scrollable;
});

},
'versa/api/_Collection':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/09/11
 * Time: 4:10 PM
 * To change this template use File | Settings | File Templates.
 */

define("versa/api/_Collection", ["dojo/_base/declare",
         "dojox/data/ClientFilter",
         "dojox/data/JsonRestStore",
         "versa/api/Error",
         "versa/api/Utilities"],
    function(declare){
        return declare("versa.api._Collection", [], {
            store: null,
            target: null,
            schema: null,
            syncMode: true,
            cache: false,
            first: null,
            isLoaded: false,

            _fetch_onComplete: function(items, request){

                this.isLoaded = true;
                if((items != null) && (items.length > 1)){
                    this.first = items[0];
                }

                this.onFetchComplete(items);
            },

            _getExistingNames: function(args){
                var names = [];
                var items = this.fetch();
                var exclude = null;

                if(args)
                    exclude = args.exclude;

                dojo.forEach(items, function(item){
                    if ((item != exclude) &&  (this.store.hasAttribute(item, 'name'))) {
                        names.push(item.name);
                    }
                }, this);

                return names;
            },

            _getIdentity: function(item){

                var id = item.id;
                if(id){
                    return id;
                }

                id = item.__clientId || item.__id;

                if(!id){
                    return id;
                }

                var prefix = this.service.servicePath.replace(/[^\/]*$/,'');
                // support for relative or absolute referencing with ids
                return id.substring(0,prefix.length) != prefix ?	id : id.substring(prefix.length); // String
            },

            _initialize: function(){
                this.store = new dojox.data.JsonRestStore({
                    target: this.target,
                    idAttribute: 'id',
                    labelAttribute: 'name',
                    schema: this.schema,
                    syncMode: this.syncMode,
                    cacheByDefault: this.cache,
                    clearOnClose: true,
                    loadLazyValues: false,
                    alwaysPostNewItems: true
                });

//                this.store.getIdentity = dojo.hitch(this.store, this._getIdentity);

            },

            clearCache: function(){
                this.store.clearCache();
            },

            clone: function(args){
                this.store.changing(args.item);
            },

            /**
             * Creates a new instance of versa.api._Collection
             * @constructor
             */
            constructor: function(){
                //dojo.connect(this.store, 'onSet', this, this.onSet);
            },

            containsValue: function(item, attribute, value){
                return this.store.containsValue(item, attribute, value);
            },

            create: function(args){
                var newItem = this.store.newItem(args);
                this.store.changing(newItem);
                return newItem;
            },

            destroy: function(args){
                var no_save = (args) ? args.no_save : false;

                try{

                    this.store.deleteItem(args.item);
                    if(!no_save){
                        this.save({
                            alwaysPostNewItems: true,
                            onComplete: ((args) && (args.onComplete)) ? args.onComplete : function () { },
                            scope: ((args) && (args.scope)) ? args.scope : this
                        });
                        //this.revert();
                    }
                }
                finally{
                    //seems to have a bug where isDirty flag is not reverted when deletion error occurs
                    args.item.__isDirty = false;
                }

            },

            fetch: function(args){

                var fetchObj = this.store.fetch({
                    query:{},
                    queryOptions:{
                        cache: this.cache
                    },
                    onComplete: dojo.hitch(this, this._fetch_onComplete)
                });

                return fetchObj.results;
            },

            fetchById: function(args){
                var item = this.store.fetchItemByIdentity({
                    identity: args.id
                });
                return item;
            },

            fetchByName: function(name){
                var _item = null;

                function  __onComplete(items, request){
                    dojo.some(items, function(item){
                        if(item.name == name){
                            _item = item;
                            return false;
                        }
                    }, this);
                }

                this.store.fetch({
                    query:{},
                    queryOptions:{cache: true},
                    onComplete: __onComplete
                });

                return _item;
            },

            fetchItemsByName: function(name){
                var _items = new Array();

                function  __onComplete(items, request){
                    dojo.some(items, function(item){
                        if(item.name == name){
                            _items.push(item);
                        }
                    }, this);
                }

                this.store.fetch({
                    query:{},
                    queryOptions:{cache: true},
                    onComplete: __onComplete
                });

                return _items;
            },

            forEach: function(callback, scope){

                function  __onComplete(items, request){
                    dojo.forEach(items, callback, scope);
                }

                this.store.fetch({query:{}, onComplete: __onComplete});
            },

            isDirty: function(args){
                var item = (args) ? args.item : null;
                return this.store.isDirty(item);
            },

            isNew: function(args){
                return ((args.item.id == undefined) || (args.item.id == null));
            },

            invalidate: function(identity){
                //Remove item if exists (force refresh from server);
                var prefix = this.store.service.servicePath.replace(/[^\/]*$/,'');
                var full_id = (prefix || '') + identity;
                var item = this.store._index[full_id];
                if(item)
                    delete this.store._index[full_id];
            },

            isItemLoaded: function(args){
                return this.store.isItemLoaded(args);
            },

            loadItem: function(args){
                var err = null;
                var item = args.item;

                if(args.callback)
                    args.onItem = args.callback;

                var _scope = (args.scope) ? args.scope : this;

                this.store.loadItem({
                    item: item,
                    scope: _scope,
                    onItem: args.onItem,
                    onError: args.onError
                });

            },

            merge: function(itemDst, itemSrc){

                for(var prop in itemDst){

                    var dstVal = itemDst[prop];

                     //don't worry about object props (but dates OK)
                    if((dstVal != null) && (typeof dstVal == 'object') && (typeof dstVal.getMonth != 'function'))
                        continue;

                    if(itemSrc.hasOwnProperty(prop)){
                        var srcVal = itemSrc[prop];
                        if(srcVal != dstVal){
                            this.store.setValue(itemDst, prop, srcVal);
                        }
                    }
                }

            },

            onFetchComplete: function(items){
            },

            query: function(args){
                var items = [];

                var queryResults = this.store.fetch({
                    query: args.query,
                    queryOptions: { cache: false },
                    sort: args.sort
                });

                if((queryResults) && (queryResults.results))
                    items = queryResults.results;

                return items;
            },

            refresh: function(){
                this.store.clearCache();
                this.fetch();
            },

            refreshAsync: function(args){

                if(args.invalidate) this.invalidate(args.identity);

                this.store.fetchItemByIdentity({
                    scope: args.scope,
                    identity: args.identity,
                    onItem: args.onItem,
                    onError: args.onError
                });
            },

            refreshItem: function(item_id){

                var retval = this.store.fetch({
                    query: item_id,
                    queryOptions: { cache: false }
                });

                return retval.results;

            },

            revert: function(args){
                this.store.revert();
            },

            save: function(args){
                var err = null;

                args = (!args) ?
                    {
                        scope: this,
                        onComplete: function() { }
                    } :
                    args;


                function _onError(errData){
                    err = new versa.api.Error(errData.responseText, errData);
                }

                this.store.save({
                    alwaysPostNewItems: true,
                    revertOnError: false,
                    onError: _onError,
                    onComplete: ((args) && (args.onComplete)) ? args.onComplete : function () { },
                    scope: ((args) && (args.scope)) ? args.scope : this
                });

                if(err){
                    throw err;
                }

            },

            setDirty: function(item){
                this.store.changing(item);
            },

            setValue: function(item, attr, value){
                this.store.setValue(item, attr, value);
            },

            getValue: function(item, attr){
                return this.store.getValue(item, attr);
            },

            generateUniqueName: function(args){
                var names = this.getExistingNames();
                var baseName = args.base_name;
                var appendix = args.appendix;

                return versa.api.Utilities.generateUniqueName({
                    names: names,
                    base_name: baseName,
                    appendix: appendix
                });
            },

            getExistingNames: function(args){
                var names = [];
                var items = this.fetch();
                var exclude = null;

                if(args)
                    exclude = args.exclude;

                dojo.forEach(items, function(item){
                    if ((item != exclude) &&  (this.store.hasAttribute(item, 'name'))) {
                        names.push(item.name);
                    }
                }, this);

                return names;
            },

            fetchDirtyItems: function(args){
                var dirtyItems = [];

                var queryResults = this.store.fetch({
                    query: {__isDirty: true},
                    queryOptions: { cache: false }
                });

                if((queryResults) && (queryResults.results))
                    dirtyItems = queryResults.results;

                return dirtyItems;
            }
        });
    }
);

},
'dijit/a11y':function(){
define("dijit/a11y", [
	"dojo/_base/array", // array.forEach array.map
	"dojo/_base/config", // defaultDuration
	"dojo/_base/declare", // declare
	"dojo/dom",			// dom.byId
	"dojo/dom-attr", // domAttr.attr domAttr.has
	"dojo/dom-style", // style.style
	"dojo/_base/sniff", // has("ie")
	"./_base/manager",	// manager._isElementShown
	"."	// for exporting methods to dijit namespace
], function(array, config, declare, dom, domAttr, domStyle, has, manager, dijit){

	// module:
	//		dijit/a11y
	// summary:
	//		Accessibility utility functions (keyboard, tab stops, etc.)

	var shown = (dijit._isElementShown = function(/*Element*/ elem){
		var s = domStyle.get(elem);
		return (s.visibility != "hidden")
			&& (s.visibility != "collapsed")
			&& (s.display != "none")
			&& (domAttr.get(elem, "type") != "hidden");
	});

	dijit.hasDefaultTabStop = function(/*Element*/ elem){
		// summary:
		//		Tests if element is tab-navigable even without an explicit tabIndex setting

		// No explicit tabIndex setting, need to investigate node type
		switch(elem.nodeName.toLowerCase()){
			case "a":
				// An <a> w/out a tabindex is only navigable if it has an href
				return domAttr.has(elem, "href");
			case "area":
			case "button":
			case "input":
			case "object":
			case "select":
			case "textarea":
				// These are navigable by default
				return true;
			case "iframe":
				// If it's an editor <iframe> then it's tab navigable.
				var body;
				try{
					// non-IE
					var contentDocument = elem.contentDocument;
					if("designMode" in contentDocument && contentDocument.designMode == "on"){
						return true;
					}
					body = contentDocument.body;
				}catch(e1){
					// contentWindow.document isn't accessible within IE7/8
					// if the iframe.src points to a foreign url and this
					// page contains an element, that could get focus
					try{
						body = elem.contentWindow.document.body;
					}catch(e2){
						return false;
					}
				}
				return body && (body.contentEditable == 'true' ||
					(body.firstChild && body.firstChild.contentEditable == 'true'));
			default:
				return elem.contentEditable == 'true';
		}
	};

	var isTabNavigable = (dijit.isTabNavigable = function(/*Element*/ elem){
		// summary:
		//		Tests if an element is tab-navigable

		// TODO: convert (and rename method) to return effective tabIndex; will save time in _getTabNavigable()
		if(domAttr.get(elem, "disabled")){
			return false;
		}else if(domAttr.has(elem, "tabIndex")){
			// Explicit tab index setting
			return domAttr.get(elem, "tabIndex") >= 0; // boolean
		}else{
			// No explicit tabIndex setting, so depends on node type
			return dijit.hasDefaultTabStop(elem);
		}
	});

	dijit._getTabNavigable = function(/*DOMNode*/ root){
		// summary:
		//		Finds descendants of the specified root node.
		//
		// description:
		//		Finds the following descendants of the specified root node:
		//		* the first tab-navigable element in document order
		//		  without a tabIndex or with tabIndex="0"
		//		* the last tab-navigable element in document order
		//		  without a tabIndex or with tabIndex="0"
		//		* the first element in document order with the lowest
		//		  positive tabIndex value
		//		* the last element in document order with the highest
		//		  positive tabIndex value
		var first, last, lowest, lowestTabindex, highest, highestTabindex, radioSelected = {};

		function radioName(node){
			// If this element is part of a radio button group, return the name for that group.
			return node && node.tagName.toLowerCase() == "input" &&
				node.type && node.type.toLowerCase() == "radio" &&
				node.name && node.name.toLowerCase();
		}

		var walkTree = function(/*DOMNode*/parent){
			for(var child = parent.firstChild; child; child = child.nextSibling){
				// Skip text elements, hidden elements, and also non-HTML elements (those in custom namespaces) in IE,
				// since show() invokes getAttribute("type"), which crash on VML nodes in IE.
				if(child.nodeType != 1 || (has("ie") && child.scopeName !== "HTML") || !shown(child)){
					continue;
				}

				if(isTabNavigable(child)){
					var tabindex = domAttr.get(child, "tabIndex");
					if(!domAttr.has(child, "tabIndex") || tabindex == 0){
						if(!first){
							first = child;
						}
						last = child;
					}else if(tabindex > 0){
						if(!lowest || tabindex < lowestTabindex){
							lowestTabindex = tabindex;
							lowest = child;
						}
						if(!highest || tabindex >= highestTabindex){
							highestTabindex = tabindex;
							highest = child;
						}
					}
					var rn = radioName(child);
					if(domAttr.get(child, "checked") && rn){
						radioSelected[rn] = child;
					}
				}
				if(child.nodeName.toUpperCase() != 'SELECT'){
					walkTree(child);
				}
			}
		};
		if(shown(root)){
			walkTree(root);
		}
		function rs(node){
			// substitute checked radio button for unchecked one, if there is a checked one with the same name.
			return radioSelected[radioName(node)] || node;
		}

		return { first: rs(first), last: rs(last), lowest: rs(lowest), highest: rs(highest) };
	};
	dijit.getFirstInTabbingOrder = function(/*String|DOMNode*/ root){
		// summary:
		//		Finds the descendant of the specified root node
		//		that is first in the tabbing order
		var elems = dijit._getTabNavigable(dom.byId(root));
		return elems.lowest ? elems.lowest : elems.first; // DomNode
	};

	dijit.getLastInTabbingOrder = function(/*String|DOMNode*/ root){
		// summary:
		//		Finds the descendant of the specified root node
		//		that is last in the tabbing order
		var elems = dijit._getTabNavigable(dom.byId(root));
		return elems.last ? elems.last : elems.highest; // DomNode
	};

	return {
		hasDefaultTabStop: dijit.hasDefaultTabStop,
		isTabNavigable: dijit.isTabNavigable,
		_getTabNavigable: dijit._getTabNavigable,
		getFirstInTabbingOrder: dijit.getFirstInTabbingOrder,
		getLastInTabbingOrder: dijit.getLastInTabbingOrder
	};
});

},
'versa/api/Group':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 26/09/11
 * Time: 10:55 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Group", ["dojo/_base/declare",
        "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.Group", [versa.api._Object], {
            description: null,

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            isValid: function(){
                var isValid = true;

                if (String.isEmpty(this.name.trim())) {
                    isValid = false;
                }

                return isValid;
            }
        });

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'description': {
                    type: 'string'
                },
                'active_users': {
                    type: 'array',
                    items: {
                        type: 'integer'
                    }
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string'
                },
                'updated_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'updated_by': {
                    type: 'string'
                }
            },
            prototype: new o()
        };

        return o;
    }
);


},
'versa/widget/document/mobile/DocumentPropertyView':function(){
/**
 * Created by JetBrains RubyMine.
 * User: aaron
 * Date: 30/05/12
 * Time: 5:09 PM
 * To change this template use File | Settings | File Templates.
 */
require(["dojo/_base/declare",
         "dijit/_WidgetBase",
         "dojox/mobile/Heading",
         "dojox/mobile/ScrollableView",
         "dojox/mobile/EdgeToEdgeDataList",
         "dojox/mobile/ToolBarButton",
         "versa/api/Folders",
         "versa/api/Documents",
         "versa/api/Zones",
         "dojo/data/ItemFileWriteStore",
         "dojo/date/locale"],
    function(declare){
        declare("versa.widget.document.mobile.DocumentPropertyView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
            document: null,
            reference: null,
            library: null,

            folders: null,
            references: null,
            documents: null,
            documentTypes: null,

            folderStore: null,
            refStore: null,
            docStore: null,
            docTypeStore: null,

            etedlMain: null,
            header: null,
            footer: null,

            constructor: function(args){
            },

            _setBackAttr: function(back){
                this.back=back;
                if(this.header){
                    this.header.set("back", back)
                }
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.folders=this.library.getFolders();
                this.references=this.library.getReferences();
                this.documents=this.library.getDocuments();
                this.documentTypes=this.library.getDocumentTypes();

                this.folderStore=this.folders.store;
                this.refStore=this.references.store;
                this.docStore=this.documents.store;
                this.docTypeStore=this.documentTypes.store;

                this.header=new versa.widget.mobile.Heading({
                    label: this.document.name,
                    from: this,
                    back: this.back,
                    onCommand: this.onCommand
                });

                this.footer=new versa.widget.mobile.Footing({
                    reference: this.reference,
                    onCommand: this.onCommand,
                    from: this
                });

                var entries=[];

                entries.push(
                    {
                        label: "Type",
                        rightText: this.document.document_type_name
                    }
                );

                entries.push(
                    {
                        label: "Version",
                        rightText: this.document.getFullVersion()
                    }
                );

                entries.push(
                    {
                        label: "Checked Out By",
                        rightText: (this.document.getState(versa.api.Document.states.CHECKED_OUT) ? this.document.checked_out_by : '')
                    }
                );

                entries.push(
                    {
                        label: (this.document.isDeleted() ? 'Deletion Date' : 'Last Modified Date'),
                        rightText: versa.api.Formatter.formatDateTime(this.document.updated_at)
                    }
                );

                this.documentType = this.documentTypes.fetchById({
                    id: this.document.document_type_id
                });

                dojo.forEach(this.documentType.property_mappings, function(propMapItem){
                    var idx = 0;

                    var propDef = this.library.getPropertyDefinitions().fetchById({
                        id: propMapItem.property_definition_id
                    });

                    if(!(propDef.is_system)){
                        var value = this.document[propDef.column_name];
                        value = versa.api.PropertyMapping.formatValue(propDef, value);

                        var entry={
                            label: propDef.name,
                            rightText: value
                        };

                        if(propDef.isTypeText()){
                            entry.rightText=entry.rightText.display_limit(10);
                            entry.clickable=true;
                            entry.property=propDef.column_name;
                            entry.document=this.document;
                            entry.onCommand=this.onCommand;
                            entry.onClick=function(){
                                this.select(true);
                                setTimeout('var caller=dijit.byId(\''+this.id+'\');' +
                                           'caller.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_TEXT, {document: caller.document, property: caller.property, label: caller.label});', 3);
                            }
                        }

                        entries.push(
                            entry
                        );
                    }
                }, this);

                var storeData = {
                    items: entries
                };

                var store = new dojo.data.ItemFileWriteStore({
                    data: storeData
                });

                this.etedlMain=new dojox.mobile.EdgeToEdgeDataList({
                    store: store
                });

                this.addChild(this.header);
                this.addChild(this.footer);
                this.addChild(this.etedlMain);
            },



            startup: function(){
                this.inherited('startup', arguments);
                this.etedlMain.startup();
            }
        });
    }
);


},
'versa/widget/zone/mobile/Logon':function(){
/**
 * Created by JetBrains RubyMine.
 * User: aarons
 * Date: 05/17/12
 * Time: 10:15 AM
 * To change this template use File | Settings | File Templates.
 */

//dojo.provide('versa.widget.zone.Logon');
//
//dojo.require('dijit._Widget');
//dojo.require('dijit._Templated');
//dojo.require('dijit.form.Form') ;
//
//dojo.require('versa.api.User');
//
//dojo.require('versa.widget.Button');
//dojo.require('versa.widget.ValidationTextBox');
//
//dojo.require('dojo.fx');

define("versa/widget/zone/mobile/Logon", ["dojo/_base/declare",
        "dijit/_WidgetBase",
        "versa/widget/zone/mobile/LogonView",
        "dojox/mobile/View"],
    function(declare){
        return declare("versa.widget.zone.mobile.Logon", [dijit._WidgetBase], {
            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.loadingView=dijit.byId('loadingView');
            },

            startup: function(){
                this.inherited('startup', arguments);


                this.logonView=new versa.widget.zone.mobile.LogonView({
                    id: 'logonView',
                    zone: this.zone,
                    onError: this.onError,
                    onLogon: this.onLogon,
                    onReset: this.onReset,
                    onResetError: this.onError
                }, dojo.create("div", {style: {height: "100%", width: "100%"}}, dojo.body()));
                this.logonView.startup();

                this.loadingView=new dojox.mobile.View({
                    id: 'loadingView'
                });

//                this.loadingView.performTransition("logonView", 1, "fade");
                this.logonView.findAppBars();
                this.logonView.resize();
            }
        });
    }
);



},
'dijit/_Widget':function(){
define("dijit/_Widget", [
	"dojo/aspect",	// aspect.around
	"dojo/_base/config",	// config.isDebug
	"dojo/_base/connect",	// connect.connect
	"dojo/_base/declare", // declare
	"dojo/_base/kernel", // kernel.deprecated
	"dojo/_base/lang", // lang.hitch
	"dojo/query",
	"dojo/ready",
	"./registry",	// registry.byNode
	"./_WidgetBase",
	"./_OnDijitClickMixin",
	"./_FocusMixin",
	"dojo/uacss",		// browser sniffing (included for back-compat; subclasses may be using)
	"./hccss"		// high contrast mode sniffing (included to set CSS classes on <body>, module ret value unused)
], function(aspect, config, connect, declare, kernel, lang, query, ready,
			registry, _WidgetBase, _OnDijitClickMixin, _FocusMixin){

/*=====
	var _WidgetBase = dijit._WidgetBase;
	var _OnDijitClickMixin = dijit._OnDijitClickMixin;
	var _FocusMixin = dijit._FocusMixin;
=====*/


// module:
//		dijit/_Widget
// summary:
//		Old base for widgets.   New widgets should extend _WidgetBase instead


function connectToDomNode(){
	// summary:
	//		If user connects to a widget method === this function, then they will
	//		instead actually be connecting the equivalent event on this.domNode
}

// Trap dojo.connect() calls to connectToDomNode methods, and redirect to _Widget.on()
function aroundAdvice(originalConnect){
	return function(obj, event, scope, method){
		if(obj && typeof event == "string" && obj[event] == connectToDomNode){
			return obj.on(event.substring(2).toLowerCase(), lang.hitch(scope, method));
		}
		return originalConnect.apply(connect, arguments);
	};
}
aspect.around(connect, "connect", aroundAdvice);
if(kernel.connect){
	aspect.around(kernel, "connect", aroundAdvice);
}

var _Widget = declare("dijit._Widget", [_WidgetBase, _OnDijitClickMixin, _FocusMixin], {
	// summary:
	//		Base class for all Dijit widgets.
	//
	//		Extends _WidgetBase, adding support for:
	//			- declaratively/programatically specifying widget initialization parameters like
	//				onMouseMove="foo" that call foo when this.domNode gets a mousemove event
	//			- ondijitclick
	//				Support new data-dojo-attach-event="ondijitclick: ..." that is triggered by a mouse click or a SPACE/ENTER keypress
	//			- focus related functions
	//				In particular, the onFocus()/onBlur() callbacks.   Driven internally by
	//				dijit/_base/focus.js.
	//			- deprecated methods
	//			- onShow(), onHide(), onClose()
	//
	//		Also, by loading code in dijit/_base, turns on:
	//			- browser sniffing (putting browser id like .dj_ie on <html> node)
	//			- high contrast mode sniffing (add .dijit_a11y class to <body> if machine is in high contrast mode)


	////////////////// DEFERRED CONNECTS ///////////////////

	onClick: connectToDomNode,
	/*=====
	onClick: function(event){
		// summary:
		//		Connect to this function to receive notifications of mouse click events.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onDblClick: connectToDomNode,
	/*=====
	onDblClick: function(event){
		// summary:
		//		Connect to this function to receive notifications of mouse double click events.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onKeyDown: connectToDomNode,
	/*=====
	onKeyDown: function(event){
		// summary:
		//		Connect to this function to receive notifications of keys being pressed down.
		// event:
		//		key Event
		// tags:
		//		callback
	},
	=====*/
	onKeyPress: connectToDomNode,
	/*=====
	onKeyPress: function(event){
		// summary:
		//		Connect to this function to receive notifications of printable keys being typed.
		// event:
		//		key Event
		// tags:
		//		callback
	},
	=====*/
	onKeyUp: connectToDomNode,
	/*=====
	onKeyUp: function(event){
		// summary:
		//		Connect to this function to receive notifications of keys being released.
		// event:
		//		key Event
		// tags:
		//		callback
	},
	=====*/
	onMouseDown: connectToDomNode,
	/*=====
	onMouseDown: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse button is pressed down.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onMouseMove: connectToDomNode,
	/*=====
	onMouseMove: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse moves over nodes contained within this widget.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onMouseOut: connectToDomNode,
	/*=====
	onMouseOut: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse moves off of nodes contained within this widget.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onMouseOver: connectToDomNode,
	/*=====
	onMouseOver: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse moves onto nodes contained within this widget.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onMouseLeave: connectToDomNode,
	/*=====
	onMouseLeave: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse moves off of this widget.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onMouseEnter: connectToDomNode,
	/*=====
	onMouseEnter: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse moves onto this widget.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onMouseUp: connectToDomNode,
	/*=====
	onMouseUp: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse button is released.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/

	constructor: function(params){
		// extract parameters like onMouseMove that should connect directly to this.domNode
		this._toConnect = {};
		for(var name in params){
			if(this[name] === connectToDomNode){
				this._toConnect[name.replace(/^on/, "").toLowerCase()] = params[name];
				delete params[name];
			}
		}
	},

	postCreate: function(){
		this.inherited(arguments);

		// perform connection from this.domNode to user specified handlers (ex: onMouseMove)
		for(var name in this._toConnect){
			this.on(name, this._toConnect[name]);
		}
		delete this._toConnect;
	},

	on: function(/*String*/ type, /*Function*/ func){
		if(this[this._onMap(type)] === connectToDomNode){
			// Use connect.connect() rather than on() to get handling for "onmouseenter" on non-IE, etc.
			// Also, need to specify context as "this" rather than the default context of the DOMNode
			return connect.connect(this.domNode, type.toLowerCase(), this, func);
		}
		return this.inherited(arguments);
	},

	_setFocusedAttr: function(val){
		// Remove this method in 2.0 (or sooner), just here to set _focused == focused, for back compat
		// (but since it's a private variable we aren't required to keep supporting it).
		this._focused = val;
		this._set("focused", val);
	},

	////////////////// DEPRECATED METHODS ///////////////////

	setAttribute: function(/*String*/ attr, /*anything*/ value){
		// summary:
		//		Deprecated.  Use set() instead.
		// tags:
		//		deprecated
		kernel.deprecated(this.declaredClass+"::setAttribute(attr, value) is deprecated. Use set() instead.", "", "2.0");
		this.set(attr, value);
	},

	attr: function(/*String|Object*/name, /*Object?*/value){
		// summary:
		//		Set or get properties on a widget instance.
		//	name:
		//		The property to get or set. If an object is passed here and not
		//		a string, its keys are used as names of attributes to be set
		//		and the value of the object as values to set in the widget.
		//	value:
		//		Optional. If provided, attr() operates as a setter. If omitted,
		//		the current value of the named property is returned.
		// description:
		//		This method is deprecated, use get() or set() directly.

		// Print deprecation warning but only once per calling function
		if(config.isDebug){
			var alreadyCalledHash = arguments.callee._ach || (arguments.callee._ach = {}),
				caller = (arguments.callee.caller || "unknown caller").toString();
			if(!alreadyCalledHash[caller]){
				kernel.deprecated(this.declaredClass + "::attr() is deprecated. Use get() or set() instead, called from " +
				caller, "", "2.0");
				alreadyCalledHash[caller] = true;
			}
		}

		var args = arguments.length;
		if(args >= 2 || typeof name === "object"){ // setter
			return this.set.apply(this, arguments);
		}else{ // getter
			return this.get(name);
		}
	},

	getDescendants: function(){
		// summary:
		//		Returns all the widgets contained by this, i.e., all widgets underneath this.containerNode.
		//		This method should generally be avoided as it returns widgets declared in templates, which are
		//		supposed to be internal/hidden, but it's left here for back-compat reasons.

		kernel.deprecated(this.declaredClass+"::getDescendants() is deprecated. Use getChildren() instead.", "", "2.0");
		return this.containerNode ? query('[widgetId]', this.containerNode).map(registry.byNode) : []; // dijit._Widget[]
	},

	////////////////// MISCELLANEOUS METHODS ///////////////////

	_onShow: function(){
		// summary:
		//		Internal method called when this widget is made visible.
		//		See `onShow` for details.
		this.onShow();
	},

	onShow: function(){
		// summary:
		//		Called when this widget becomes the selected pane in a
		//		`dijit.layout.TabContainer`, `dijit.layout.StackContainer`,
		//		`dijit.layout.AccordionContainer`, etc.
		//
		//		Also called to indicate display of a `dijit.Dialog`, `dijit.TooltipDialog`, or `dijit.TitlePane`.
		// tags:
		//		callback
	},

	onHide: function(){
		// summary:
			//		Called when another widget becomes the selected pane in a
			//		`dijit.layout.TabContainer`, `dijit.layout.StackContainer`,
			//		`dijit.layout.AccordionContainer`, etc.
			//
			//		Also called to indicate hide of a `dijit.Dialog`, `dijit.TooltipDialog`, or `dijit.TitlePane`.
			// tags:
			//		callback
	},

	onClose: function(){
		// summary:
		//		Called when this widget is being displayed as a popup (ex: a Calendar popped
		//		up from a DateTextBox), and it is hidden.
		//		This is called from the dijit.popup code, and should not be called directly.
		//
		//		Also used as a parameter for children of `dijit.layout.StackContainer` or subclasses.
		//		Callback if a user tries to close the child.   Child will be closed if this function returns true.
		// tags:
		//		extension

		return true;		// Boolean
	}
});

// For back-compat, remove in 2.0.
if(!kernel.isAsync){
	ready(0, function(){
		var requires = ["dijit/_base"];
		require(requires);	// use indirection so modules not rolled into a build
	});
}
return _Widget;
});

},
'dojo/touch':function(){
define("dojo/touch", ["./_base/kernel", "./on", "./has", "./mouse"], function(dojo, on, has, mouse){
// module:
//		dojo/touch

/*=====
	dojo.touch = {
		// summary:
		//		This module provides unified touch event handlers by exporting
		//		press, move, release and cancel which can also run well on desktop.
		//		Based on http://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html
		//
		// example:
		//		1. Used with dojo.connect()
		//		|	dojo.connect(node, dojo.touch.press, function(e){});
		//		|	dojo.connect(node, dojo.touch.move, function(e){});
		//		|	dojo.connect(node, dojo.touch.release, function(e){});
		//		|	dojo.connect(node, dojo.touch.cancel, function(e){});
		//
		//		2. Used with dojo.on
		//		|	define(["dojo/on", "dojo/touch"], function(on, touch){
		//		|		on(node, touch.press, function(e){});
		//		|		on(node, touch.move, function(e){});
		//		|		on(node, touch.release, function(e){});
		//		|		on(node, touch.cancel, function(e){});
		//
		//		3. Used with dojo.touch.* directly
		//		|	dojo.touch.press(node, function(e){});
		//		|	dojo.touch.move(node, function(e){});
		//		|	dojo.touch.release(node, function(e){});
		//		|	dojo.touch.cancel(node, function(e){});
		
		press: function(node, listener){
			// summary:
			//		Register a listener to 'touchstart'|'mousedown' for the given node
			// node: Dom
			//		Target node to listen to
			// listener: Function
			//		Callback function
			// returns:
			//		A handle which will be used to remove the listener by handle.remove()
		},
		move: function(node, listener){
			// summary:
			//		Register a listener to 'touchmove'|'mousemove' for the given node
			// node: Dom
			//		Target node to listen to
			// listener: Function
			//		Callback function
			// returns:
			//		A handle which will be used to remove the listener by handle.remove()
		},
		release: function(node, listener){
			// summary:
			//		Register a listener to 'touchend'|'mouseup' for the given node
			// node: Dom
			//		Target node to listen to
			// listener: Function
			//		Callback function
			// returns:
			//		A handle which will be used to remove the listener by handle.remove()
		},
		cancel: function(node, listener){
			// summary:
			//		Register a listener to 'touchcancel'|'mouseleave' for the given node
			// node: Dom
			//		Target node to listen to
			// listener: Function
			//		Callback function
			// returns:
			//		A handle which will be used to remove the listener by handle.remove()
		}
	};
=====*/

	function _handle(/*String - press | move | release | cancel*/type){
		return function(node, listener){//called by on(), see dojo.on
			return on(node, type, listener);
		};
	}
	var touch = has("touch");
	//device neutral events - dojo.touch.press|move|release|cancel
	dojo.touch = {
		press: _handle(touch ? "touchstart": "mousedown"),
		move: _handle(touch ? "touchmove": "mousemove"),
		release: _handle(touch ? "touchend": "mouseup"),
		cancel: touch ? _handle("touchcancel") : mouse.leave
	};
	return dojo.touch;
});
},
'versa/api/ViewDefinitions':function(){
/**
 * @author Scott
 */
define("versa/api/ViewDefinitions", ["dojo/_base/declare",
        "versa/api/ViewDefinition",
        "versa/api/_Collection",
        "versa/api/CellDefinitions",
        "versa/api/Error"],
    function(declare){
        var o=declare("versa.api.ViewDefinitions", [versa.api._Collection], {
            _system: null,

            documentTypes: null,


            _matchesQuery: function(item,request){

                //query returns array of cell definitions,
                //exclude them.
                if(dojo.isArray(item) || (item.hasOwnProperty('column_order')))
                    return false;

                var query = request.query;
                var ignoreCase = request.queryOptions && request.queryOptions.ignoreCase;
                for(var i in query){
                    // if anything doesn't match, than this should be in the query
                    var match = query[i];
                    var value = this.getValue(item,i);
                    if((typeof match == 'string' && (match.match(/[\*\.]/) || ignoreCase)) ?
                        !dojo.data.util.filter.patternToRegExp(match, ignoreCase).test(value) :
                        value != match){
                        return false;
                    }
                }
                return true;
            },

            copyFromTemplate: function(viewDef, user){
                var cell_definitions=viewDef.cell_definitions;
                var toReturn=this.create({
                    cell_definitions: [],
                    created_by: user.name,
                    is_system: false,
                    is_template: false,
                    library_id: viewDef.library_id,
                    name: viewDef.name,
                    scope: viewDef.scope,
                    sort_by: viewDef.sort_by,
                    updated_by: user.name
                });

                dojo.forEach(cell_definitions, function(cell){
                    toReturn.cell_definitions.push({
                        column_name: cell.column_name,
                        column_order: cell.column_order,
                        date_format: cell.date_format,
                        formatter: cell.formatter,
                        label: cell.label,
                        name: cell.name,
                        noresize: cell.noresize,
                        style: cell.style,
                        table_name: cell.table_name,
                        width: cell.width
                    })
                }, this);

                return toReturn;
            },

            /*
            generateView: function(viewDef, cellDefinitions){
                var view = {
                    name: viewDef.name,
                    view_definition_id: viewDef.id,
                    sort_column: 1,
                    cells: []
                }

                var cellDefs = cellDefinitions.query({
                    query: { view_definition_id: viewDef.id }
                });

                cellDefs=cellDefs.sort(versa.api.CellDefinition.compare);

                var idx = 1;
                dojo.forEach(cellDefs, function(cellDef){
                    var cell = {
                        field: cellDef.table_name + '.' + cellDef.column_name,
                        name: cellDef.label,
                        width: cellDef.width,
                        noresize: cellDef.noresize,
                        style: cellDef.style,
                        date_format: cellDef.date_format
                    };

                    if((cell.name == null) || (cell.name.length < 1))
                        cell.name = ' ';

                    cell.get = viewDef._generateGetFn(cellDef, this.library);
                    cell.formatter = viewDef._generateFormatterFn(cellDef);

                    view.cells.push(cell);

                    if(cell.field == viewDef.sort_by){
                        view.sort_column = idx;
                    }

                    idx++;
                }, this);

                return view;
            },
            */

            _getDocumentAttr: function(rowIndex, item){
                var value = '';
                var viewDef = this[0];
                var cellDef = this[1];

                if(!item)
                    return value;

                var column = cellDef.column_name

                switch(column){
                    case 'created_at':
                    case 'updated_at':
                        value = viewDef._formatDateTime(cellDef, item[column]);
                        break;
                    default:
                        if (/prp_dtt/.test(column) && item[column]) {
                            value = dojo.date.stamp.fromISOString(item[column]);
                            if(value){
                                value = viewDef._formatDateTime(cellDef, value);
                            }
                        }
                        else {
                            value = item[column];
                        }
                        break;
                }

                return value;
            },

            _getDocumentTypeAttr: function(rowIndex, item){
                var value = '';
                var viewDef = this[0];
                var cellDef = this[1];

                if(!item)
                    return value;

                if(!item.document_type_id)
                    return '';

                var docType = viewDef.documentTypes.fetchById({
                    id: item.document_type_id
                });

                switch(cellDef.column_name){
                    case 'name':
                        value = docType.name;
                        break;
                }

                return value;
            },

            _getVersionAttr: function(rowIndex, item){
                var value = '';
                var viewDef = this[0];
                var cellDef = this[1];

                if(!item)
                    return value;

                switch(cellDef.column_name){
                    case 'content_type':
                        value = (item.current_version) ? item.current_version.content_type : '';
                        break;
                    case 'version_number':
                        value = (item.current_version) ? item.current_version.version_number : 0;
                        break;
                    case 'size':
                        value = (item.current_version) ? item.current_version.size : 0;
                        break;
                }

                return value;
            },

            constructor: function(/* Object */args){
                this.zone=args.zone;
                this.library=args.library;
                this.target = dojo.replace(versa.api.ViewDefinitions.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.ViewDefinition.schema;
                this.cache = true;
                this.cellDefinitions = args.cellDefinitions;

                this._initialize();
                //this.store.matchesQuery  = dojo.hitch(this, this._matchesQuery);
            },

            cloneItem: function(source){
                var clone = this.create({
                    name: source.name,
                    is_system: false,
                    description: source.description,
                    is_template: false,
                    scope: source.scope,
                    sort_by: source.sort_by
                });

                dojo.forEach(source.cell_definitions, function(cell_definition, idx){
                    clone.cell_definitions.push(versa.api.CellDefinition.clone(cell_definition));
                });

                return clone;
            },

            getSystem: function(){

                if(!this._system){
                    this._system = new Array();
                    this.forEach(function(item){
                        if(item.is_system){
                            this._system.push(item);
                        }
                    }, this);
                }

                return this._system;
            },

            isValidItem: function(args){
                var isValid = this.inherited(arguments);
                var item = args.item;

                if(!isValid) return;

                if (item.name.length < 1) {
                    throw new Error('View Definition \'Name\' is empty or invalid');
                }

                if ((!item.sort_by) || (item.sort_by.length < 1)){
                    throw new Error('View Definition must have a \'Sort By\' value');
                }

                return true;
            }
        });
        o.TRGT="/zones/{0}/libraries/{1}/view_definitions"

        return o;

    }
);


},
'versa/api/PropertyDefinition':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 04/11/11
 * Time: 10:11 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/PropertyDefinition", ["dojo/_base/declare",
        "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.PropertyDefinition", [versa.api._Object], {
            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            getDbName: function(){
                //return dojo.replace("{table_name}.{column_name}", this);
                return dojo.replace("{table_name}.{column_name}", this);
            },

            isTypeDate: function(){
                return this.data_type_id == versa.api.DataTypes.types.DATETIME;
            },

            isTypeText: function(){
               return this.data_type_id == versa.api.DataTypes.types.TEXT
            },

            isTypeInteger: function(){
                return this.data_type_id==versa.api.DataTypes.types.INTEGER;
            },

            isTypeFloat: function(){
                return this.data_type_id==versa.api.DataTypes.types.FLOAT;
            },

            isTypeAnyNumber: function(){
                return this.data_type_id==versa.api.DataTypes.types.INTEGER||
                       this.data_type_id==versa.api.DataTypes.types.FLOAT
            },

            isTypeBoolean: function(){
                return this.data_type_id==versa.api.DataTypes.types.BOOLEAN;
            },

            isValid: function(){
                var isValid = true;

                if (String.isEmpty(this.name.trim())) {
                    isValid = false;
                }

                if(!this.data_type_id){
                    isValid = false;
                }

                return isValid;
            }
        });

        versa.api.Cardinality = {
            'Single': 0x01,
            'Multiple': 0x02
        };

        o.compare = function(item1, item2){
            if(!item1.name||!item2.name){
                return 0;
            }
            return (item1.name.toLowerCase()>item2.name.toLowerCase())?1:-1;
        };

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'cardinality': {
                    type: 'integer',
                    'default': versa.api.Cardinality.Single
                 },
                'column_name': {
                    type: 'string'
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string'
                },
                'data_type_id': {
                    type: 'integer'
                },
                'description': {
                    type: 'string',
                    'default': ''
                },
                'is_readonly': {
                    type: 'boolean',
                    'default': false
                },
                'is_system': {
                    type: 'boolean',
                    'default': false
                },
                'max_length': {
                    type: 'max_length'
                },
                'table_name': {
                    type: 'string'
                },
                'updated_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'updated_by': {
                    type: 'string'
                }
            },
            prototype: new o()
        };

        return o;
    }
);


},
'dojox/mobile/ContentPane':function(){
define("dojox/mobile/ContentPane", [
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dijit/_Contained",
	"dijit/_WidgetBase",
	"dojo/_base/xhr",
	"./ProgressIndicator"
], function(dojo, array, declare, lang, win, Contained, WidgetBase, xhr, ProgressIndicator){

/*=====
	var Contained = dijit._Contained;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/ContentPane
	// summary:
	//		A very simple content pane to embed an HTML fragment.

	return declare("dojox.mobile.ContentPane", [WidgetBase, Contained],{
		// summary:
		//		A very simple content pane to embed an HTML fragment.
		// description:
		//		This widget embeds an HTML fragment and run the parser. onLoad()
		//		is called when parsing is done and the content is ready.
		//		"dojo/_base/xhr" is in the dependency list. Usually this is not
		//		necessary, but there is a case where dojox.mobile custom build
		//		does not contain xhr. Note that this widget does not inherit
		//		from dijit._Container.

		// href: String
		//		URL of the content to embed.
		href: "",

		// content: String
		//		An html fragment to embed.
		content: "",

		// parseOnLoad: Boolean
		//		If true, runs the parser when the load completes.
		parseOnLoad: true,

		// prog: Boolean
		//		If true, shows progress indicator.
		prog: true,

		buildRendering: function(){
			this.inherited(arguments);
			this.domNode.className = "mblContentPane";
			if(!this.containerNode){
				this.containerNode = this.domNode;
			}
		},

		startup: function(){
			if(this._started){ return; }
			if(this.prog){
				this._p = ProgressIndicator.getInstance();
			}
			var parent = this.getParent && this.getParent();
			if(!parent || !parent.resize){ // top level widget
				this.resize();
			}
			this.inherited(arguments);
		},
	
		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},
	
		loadHandler: function(/*String*/response){
			// summary:
			//		A handler called when load completes.
			this.set("content", response);
		},
	
		errorHandler: function(err){
			// summary:
			//		An error handler called when load fails.
			if(this._p){ this._p.stop(); }
		},
	
		onLoad: function(){
			// summary:
			//		Stub method to allow the application to connect to.
			//		Called when parsing is done and the content is ready.
		},
	
		_setHrefAttr: function(/*String*/href){
			var p = this._p;
			if(p){
				win.body().appendChild(p.domNode);
				p.start();
			}
			this.href = href;
			xhr.get({
				url: href,
				handleAs: "text",
				load: lang.hitch(this, "loadHandler"),
				error: lang.hitch(this, "errorHandler")
			});
		},

		_setContentAttr: function(/*String|DomNode*/data){
			this.destroyDescendants();
			if(typeof data === "object"){
				this.domNode.appendChild(data);
			}else{
				this.domNode.innerHTML = data;
			}
			if(this.parseOnLoad){
				dojo.parser.parse(this.domNode);
			}
			if(this._p){ this._p.stop(); }
			this.onLoad();
		}
	});
});

},
'versa/api/Folder':function(){
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 24/10/11
 * Time: 9:58 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Folder", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/_Securable",
        "versa/api/Acl",
        "versa/api/Search"],

    function(declare){
        var o=declare("versa.api.Folder",
                [versa.api._Object,
                 versa.api._Securable], {
            _activeQuery: null,
            _searchFolder: null,
            _shareRootFolder: null,
            _trashFolder: null,

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
                this.securable_type = versa.api._Securable.types.Folder;
            },

            childNameExists: function(name, ignoreId){

                return dojo.some(this.children, function(child){
                    if(child.getId() == ignoreId)
                        return false;
                    return (child.name.toLowerCase() == name.toLowerCase());
                }, this);

            },

            getActiveQuery: function(){

                if(!this._activeQuery){
                    this._activeQuery = new versa.api.Search({
                        type: (this.isTrash() ? versa.api.Search.types.TRASH : versa.api.Search.types.FOLDER),
                        queryData: this.getId(),
                        view_definition_id: this.view_definition_id
                    });
                }

                return this._activeQuery;
            },

            getPermissionSet: function(library, user){
                var prmSet = new versa.api.PermissionSet();

                prmSet.setValue(versa.api.PermissionIndices.VIEW, true);
                prmSet.setValue(versa.api.PermissionIndices.COPY, true);
                prmSet.setValue(versa.api.PermissionIndices.EDIT, this.hasRights(versa.api._Securable.permissions.WRITE_METADATA) && (!this.isSpecial() || this.isShare()) && (!this.isRoot()));
                prmSet.setValue(versa.api.PermissionIndices.CREATE, this.hasRights(versa.api._Securable.permissions.CREATE_FOLDERS) && (!(this.isTrash() || this.isSearch() || this.isShare())));
                prmSet.setValue(versa.api.PermissionIndices.FILE, this.hasRights(versa.api._Securable.permissions.CREATE_DOCUMENTS) && (!this.isSpecial()));
                prmSet.setValue(versa.api.PermissionIndices.DELETE, this.hasRights(versa.api._Securable.permissions.DELETE_ITEMS) && (!this.isRoot()));
                prmSet.setValue(versa.api.PermissionIndices.SECURE, this.hasRights(versa.api._Securable.permissions.WRITE_ACL) && (!this.isSpecial() || this.isShareRoot() || this.isShare()));

                return prmSet;
            },

            getSearchFolder: function(){

                if(!this._searchFolder){
                    dojo.every(this.children, function(item, idx){
                        if(item.isSearch())
                            this._searchFolder = item;
                        return (!this._searchFolder);
                    }, this);
                }

                return this._searchFolder;
            },

            getShareRootFolder: function(){

                if(!this._shareRootFolder){
                    dojo.every(this.children, function(item, idx){
                        if(item.isShareRoot())
                            this._shareRootFolder = item;
                        return (!this._shareRootFolder);
                    }, this);
                }

                return this._shareRootFolder;
            },

            getTrashFolder: function(){

                if(!this._trashFolder){
                    dojo.every(this.children, function(item, idx){
                        if(item.isTrash())
                            this._trashFolder = item;
                        return (!this._trashFolder);
                    }, this);
                }

                return this._trashFolder;

            },

            isContent: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.CONTENT);
            },

            isError: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.ERROR);
            },

            isRoot: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.ROOT);
            },

            isSearch: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.SEARCH);
            },

            isShare: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.SHARE);
            },

            isShareRoot: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.SHARE_ROOT);
            },

            isSpecial: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.SEARCH ||
                           this.folder_type == versa.api.Folder.FolderTypes.TRASH ||
                           this.folder_type == versa.api.Folder.FolderTypes.SHARE ||
                           this.folder_type == versa.api.Folder.FolderTypes.SHARE_ROOT);
            },

            isTrash: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.TRASH);
            },

            setActiveQuery: function(query){
                this._activeQuery = query;
                this._activeQuery.view_definition_id = this.view_definition_id;
            },

            shareItems: function(args){
                var zone = args.zone;
                var library = args.library;

                var ids = []
                dojo.forEach(args.references, function(reference){
                    ids.push(reference.getId());
                }, this);

                var url = dojo.replace(versa.api.Folder.SHAREITEMS_TRGT,  [zone.subdomain, library.id, this.getId()]);
                var putData = {
                    reference_ids: ids
                };

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            }
        });

        o.SHAREITEMS_TRGT = '/zones/{0}/libraries/{1}/folders/{2}/share_items.json';

        o.FolderTypes = {
            'ROOT':         0x0000,
            'CONTENT':      0x0001,
            'SHARE_ROOT':   0x0010,
            'SHARE':        0x0011,
            'SEARCH':       0x0020,
            'TRASH':        0x0040,
            'ERROR':        0xFFFF
        }

        o.getIconUrl = function(folder, size){
            var iconName = 'content';

            switch(folder.folder_type){
                case versa.api.Folder.FolderTypes.TRASH:
                    iconName = 'recyclebin';
                    break;
                case versa.api.Folder.FolderTypes.SEARCH:
                    iconName = 'search';
                    break;
                case versa.api.Folder.FolderTypes.SHARE_ROOT:
                    iconName = 'share_root';
                    break;

            }

            return dojo.replace('/images/mimetypes/{0}/{1}.png', [size, iconName]);
        }

        o.getTypeLabel = function(folder){
            var label = 'Content';

            switch(folder.folder_type){
                case versa.api.Folder.FolderTypes.TRASH:
                    label = 'Deleted Items';
                    break;
                case versa.api.Folder.FolderTypes.SEARCH:
                    label = 'Search Results';
                    break;
                case versa.api.Folder.FolderTypes.SHARE_ROOT:
                    label = 'Shared Folders';
                    break;
                case versa.api.Folder.FolderTypes.SHARE:
                    label = 'Shared Files';
                    break;
            }

            return label;
        }

        o.sort = function(item1, item2){

            //ORDER for non-content folder types
            if((item1.folder_type != versa.api.Folder.FolderTypes.CONTENT) ||
                (item2.folder_type != versa.api.Folder.FolderTypes.CONTENT)){

                //Order should be:
                // - Trash
                // - Search
                // - Share
                // - Content....
                if(item1.folder_type > item2.folder_type)
                    return -1;
                return 1;
            }

            //Sort by name
            if(item1.name == item2.name){
                return 0;
            }

            //Alphabetically for all else (case-insensitive)
            return (item1.name?item1.name:'').toLowerCase() < (item2.name?item2.name:'').toLowerCase() ? -1 : 1;
        };

        o.permissionIndices = {
            'CREATE':       0x00,
            'VIEW':         0x01,
            'FILE':         0x02,
            'DELETE':       0x03,
            'SECURE':       0x04

        }


        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'folder_type': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'expiry': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'created_at': {
                    type: 'string',
                    format: 'date-time',
                    'default': dojo.date.stamp.toISOString(new Date(), {zulu: true})
                },
                'created_by': {
                    type: 'string',
                    'default': ''
                },
                'updated_at': {
                    type: 'string',
                    format: 'date-time',
                    'default': dojo.date.stamp.toISOString(new Date(), {zulu: true})
                },
                'updated_by': {
                    type: 'string',
                    'default': ''
                },
                'text_path':{
                    type: 'string',
                    'default':''
                },
                'document_count':{
                    type: 'integer',
                    'default': 0
                }
            },
            prototype: new o()
        };

        return o;
    }
);


},
'versa/widget/search/mobile/SearchResultsView':function(){
require(["dojo/_base/declare",
         "dijit/_WidgetBase",
         "dojox/mobile/Heading",
         "dojox/mobile/ScrollableView",
         "dojox/mobile/EdgeToEdgeDataList",
         "dojox/mobile/ToolBarButton",
         "versa/api/Folders",
         "versa/api/Documents",
         "versa/api/Zones",
         "dojo/data/ItemFileWriteStore"],
    function(declare){
        declare("versa.widget.search.mobile.SearchResultsView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
            folder: null,
            library: null,

            folders: null,
            references: null,

            folderStore: null,
            refStore: null,

            etedlMain: null,
            header: null,
            footer: null,

            constructor: function(args){
            },

            _setSearchAttr: function(search){
                if(this.search!=search){
                    this.search=search;

                    var documents=this.refStore.fetch({query: {type: 2, query: search, view: this.view_id}}).results;

                    var entries=[];

                    dojo.forEach(documents, function(document){
                        entries.push(
                            {
                                label: document.name,
                                item: document,
                                from: this,
                                onCommand: this.onCommand,
                                icon: '../../images/mimetypes/32/default.png',
                                clickable: true,
                                onClick: function(){
                                    this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_PROPERTIES, {from: this.from, reference:this.item});
                                }
                            }
                        );
                    }, this);

                    var storeData = {
                        items: entries
                    };

                    var store = new dojo.data.ItemFileWriteStore({
                        data: storeData
                    });

                    this.etedlMain.setStore(store);
                }
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.folders=this.library.getFolders();
                this.references=this.library.getReferences();

                this.folderStore=this.folders.store;
                this.refStore=this.references.store;



                this.header=new versa.widget.mobile.Heading({
                    label: "Search",
                    from: this,
                    back: this.back,
                    onCommand: this.onCommand
                });

                this.footer=new versa.widget.mobile.Footing({
                    onCommand: this.onCommand,
                    from: this
                });

                this.etedlMain=new dojox.mobile.EdgeToEdgeDataList({
                    iconBase: '../../images/mimetypes/48/default.png'
                });

                this.addChild(this.header);
                this.addChild(this.footer);
                this.addChild(this.etedlMain);
            },



            startup: function(){
                this.inherited('startup', arguments);
                this.etedlMain.startup();
            }
        });
    }
);


}}});

require(["dojo/i18n"], function(i18n){
i18n._preloadLocalizations("dojo/nls/versa_mobile", ["en-us"]);
});
define("dojo/versa_mobile", [], 1);
