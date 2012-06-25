//>>built
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

