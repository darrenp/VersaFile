//>>built
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

