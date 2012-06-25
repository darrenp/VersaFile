//>>built
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




