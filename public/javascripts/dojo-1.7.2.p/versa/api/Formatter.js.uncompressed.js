//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/03/12
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Formatter", ["dojo/_base/declare",
        "dojo/date/locale"],
    function(declare){
        var o=declare("versa.api.Formatter", [], {});

        o.formatDateTime = function(value){
            var frmt_value = value;

            if(String.isEmpty(value))
                return '';

            if(typeof value == 'string')
                frmt_value = dojo.date.stamp.fromISOString(value);

            return dojo.date.locale.format(frmt_value, {selector: 'date', formatLength: 'short'})
        };


        return o;
    }
);

