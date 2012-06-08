//>>built
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

