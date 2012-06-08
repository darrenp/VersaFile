//>>built
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
