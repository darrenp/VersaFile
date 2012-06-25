//>>built
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

