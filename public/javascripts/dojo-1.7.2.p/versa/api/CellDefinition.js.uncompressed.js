//>>built
/**
 * @author Scott
 */
define("versa/api/CellDefinition", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/Error"],
    function(declare){
        var o=declare("versa.api.CellDefinition", [versa.api._Object], {
            constructor: function(/* Object */args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            }
        });

        o.clone = function(source){
            return new versa.api.CellDefinition({
                column_order: source.column_order,
                table_name: source.table_name,
                column_name: source.column_name,
                label: source.label,
                name: source.name,
                noresize: source.noresize,
                style: source.style,
                width: source.width,
                formatter: source.formatter,
                date_format: source.date_format
            });
        };

        o.compare = function(cellA, cellB){
            return cellA.column_order-cellB.column_order;
        }

        o.getDbName = function(cell_definition){
            return dojo.replace("{table_name}.{column_name}", cell_definition);
        }


        o.formats = {'none': 0, 'icon': 1, 'size': 2, 'status': 4, 'datetime': 8, 'date': 16, 'time': 32};
        o.formatStatus = function(data, rowIndex){
            var item = this.grid.getItem(rowIndex);

            var icon = 'none.16.png';

            try{

                if((item) && (item.getState(versa.api.Document.states.CHECKED_OUT))){
                    icon = 'cko.16.png';
                }

            }
            catch(e){
            }

            return dojo.replace('<img name="statusIcon" src="/images/icons/states/{0}" width="16" height="16" style="position:relative;top:1px;left:1px"/>', [icon]);
        }

        //versa.api.CellDefinition.formatIcon = function(data, rowIndex){
        //    var imgSrc =  versa.api.Document.getIconUrl(data, 16);
        //    return dojo.replace('<img src="{0}" width="16" height="16"/>', [imgSrc]);
        //}
        //
        //versa.api.CellDefinition.formatSize = function(data, rowIndex){
        //
        //	var sizeBytes = data;
        //
        //	return versa.api.Utilities.readablizeBytes({
        //		bytes: sizeBytes
        //	});
        //}

        o.formatIcon = function(data, rowIndex){

            if(!data)
                return '';

            var item = this.grid.getItem(rowIndex);
            var imgSrc =  versa.api.Document.getIconUrl(data, 16);

            var wrapper = dojo.create('div');
            var node = dojo.create('div', { style: {width: 16, height:16, position: 'relative' }}, wrapper);
            dojo.create('img', {src: imgSrc, width: 16, height: 16}, node);

            if(item.isShare()){
                imgSrc = '/images/icons/states/shared.16.png';
                dojo.create('img', {src: imgSrc, width: 16, height: 16, style: {position: 'absolute', top:'2px', left:'2px'}}, node);
            }

            return wrapper.innerHTML;


            /*
            if(data.reference_type == 1)
                dojo.create('img', {src: '/images/icons/states/reference.16.png', style: {position: 'absolute', top: 0, left: 0}}, node);
            */

            //var img = dojo.replace('<img src="{0}" width="16" height="16"/>', [imgSrc]);

            /*
            var gridNode = new bfree.widget.document.DraggableGridItem({
                data: wrapper.innerHTML,
                document: item,
                grid: this.grid
            });

            return gridNode;
            */
        };

        o.formatSize = function(data, rowIndex){

            var sizeBytes = data;

            var bytes = versa.api.Utilities.readablizeBytes({
                bytes: sizeBytes
            });
            return bytes;

            /*
            var item = this.grid.getItem(rowIndex);

            var gridNode=new bfree.widget.document.DraggableGridItem({
                data: bytes,
                document: item,
                grid: this.grid
            });

            return gridNode;
            */
        };

        o.formatData = function(data, rowIndex){

            return data || '';

            /*
            var item = this.grid.getItem(rowIndex);

            var gridNode=new bfree.widget.document.DraggableGridItem({
                data: data==null?'':data,
                document: item,
                grid: this.grid
            });

            return gridNode;
            */
        };

        o.formatBoolean = function(data, rowIndex){
            var wdg=new dijit.form.CheckBox({
                scrollOnFocus: false,
                disabled: true,
                checked: data
            });
            return wdg;
        },

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'view_definition_id':{
                    type: 'integer'
                },
                'table_name': {
                    type: 'string'
                },
                'column_name': {
                    type: 'string'
                },
                'name': {
                    type: 'string'
                },
                'label': {
                    type: 'string'
                },
                'formatter': {
                    type: 'integer',
                    'default': o.formats.none
                },
                'noresize': {
                    type: 'boolean',
                    'default': false
                },
                'width': {
                    type: 'string',
                    'default': '128px'
                },
                'style': {
                    type: 'string',
                    'default': ''
                },
                'column_order': {
                    type: 'integer',
                    'default': 1
                },
                'date_format': {
                    type: 'string',
                    'default': ''
                }
            },
            prototype: new o()
        };

        return o;
    }
);

