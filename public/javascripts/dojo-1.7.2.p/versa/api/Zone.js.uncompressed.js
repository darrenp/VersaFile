//>>built
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




