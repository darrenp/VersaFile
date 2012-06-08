//>>built
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
