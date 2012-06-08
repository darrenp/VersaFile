//>>built
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

