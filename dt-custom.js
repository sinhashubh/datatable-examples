var mdataArray = [];
var EditRowData = [];
var ColumnData;
var table;
var isEditAllState = false;
var defaultcol = "";

var apiUrl = 'https://dtexample.000webhostapp.com/api/';//Url for Server API
var GetTableMetaApiEndpoint = 'gettablemeta.php';//Endpoint returning Table Metadata
var GetTableDataApiEndpoint = 'gettabledata.php';//Endpoint processing and return Table Data
var UpdateRowDataApiEndpoint = 'update.php';//Endpoint processing update request
var InsertRowDataApiEndpoint = 'create.php';//Endpoint processing insert request
var DeleteRowDataApiEndpoint = 'delete.php';//Endpoint processing delete request
//get Table and Columns properties
function getTableMeta() {
    $.ajax({
        type: 'POST',
        url: apiUrl + GetTableMetaApiEndpoint,
        dataType: 'json',
        success: function (data) {
            console.log(data);
            ColumnData = data.Column;
            //Below for Expand Row
            if (data.hasOwnProperty('Expandable') && data.Expandable == true) {
                $('#dtexample thead tr:first-child').append($('<th>', {
                    text: 'Expand'
                }));
                $('#dtexample thead tr:nth-child(2)').append($('<th>', {
                    text: ''
                }));
                mdataArray.push({ defaultContent: '<img src="./icons/delete.png" style="width:28px" />', class: 'details-control' });
                InitializeFormatter();
            }
            //End for Expand Row
            $.each(data.Column, function (index, element) {
                $('#dtexample thead tr:first-child').append($('<th>', {
                    text: element.Name
                }));
                //insert
                if (data.Insertable == true) {
                    if (element.Editable == true) {
                        $('#dtexample tfoot tr:first-child').append($('<td><input class="' + element.Name + 'Add" style="width: 99% " type="text" /></td>'
                        ));
                    } else {
                        $('#dtexample tfoot tr:first-child').append($('<td></td>'
                        ));
                    }
                }
                //search
                if (element.Searchable == true)
                    $('#dtexample thead tr:nth-child(2)').append($('<th>', {
                        text: element.Name
                    }));
                else $('#dtexample thead tr:nth-child(2)').append($('<th>', {
                    text: ''
                }));
                mdataArray.push({ mData: element.Name, class: element.Name });
            });
            if (data.Deletable == true) {
                $('#dtexample thead tr:first-child').append($('<th>', {
                    text: 'Delete'
                }));
                $('#dtexample thead tr:nth-child(2)').append($('<th>', {
                    text: ''
                }));
                mdataArray.push({ defaultContent: '<span class="deleteBtn"><img src="./icons/delete.png" style="width:28px" /></span>', class: 'DeleteRow' });

            }
            if (data.Insertable == true) {
                $('#dtexample tfoot tr:first-child').append($('<td><span class="insertBtn"><img src="./icons/add.png" style="width:28px" /></span></td>'
                ));
            }
            defaultcol = data.Column[0].Name;
            //once table headers and table data property set, initialize DT
            initializeDataTable();

        }
    });
}
$(document).ready(function () {
    getTableMeta();

});
$(document).keyup(function (e) {
    if (e.keyCode == 27)
        if (isEditAllState) {
            CancelEditAll();
            isEditAllState = false;
        } else
            cancelBtn();
});
function initializeDataTable() {
    //put Input textbox for filtering
    $('#dtexample thead tr:nth-child(2) th').each(function () {
        var title = $(this).text();
        if (title != '')
            $(this).html('<input type="text" class="sorthandle" style="width:100%;" />');
    });
    //don't sort when user clicks on input textbox to type for filter
    $('#dtexample').find('thead th').click(function (event) {
        if ($(event.target).hasClass('sorthandle')) {
            event.stopImmediatePropagation()
        }
    });
    table = $('#dtexample').DataTable({
        "ajax": {
            "url": apiUrl + GetTableDataApiEndpoint,
            "type": "POST",
            data: function (data) {
                editIndexTable = -1;
                var colname;
                var sort = data.order[0].column;
                if (!data['columns'][sort]['data'] == '')
                    colname = data['columns'][sort]['data'] + ' ' + data.order[0].dir;
                //in case no sorted col is there, sort by first col
                else colname = defaultcol + " asc";
                var colarr = [];
                //  colname = 'ID asc';
                var colfilter, col;
                var arr = {
                    'draw': data.draw, 'length': data.length,
                    'sort': colname, 'start': data.start, 'search': data.search.value
                };
                //add each column as formdata key/value for filtering
                data['columns'].forEach(function (items, index) {
                    col = data['columns'][index]['data'];
                    colfilter = data['columns'][index]['search']['value'];
                    arr[col] = colfilter;
                });
                return arr;
            }
        },
        "lengthMenu": [10, 50, 100], "searching": true,
        //rowId required when doing update, can put any unique value for each row instead of ID
        rowId: 'ID',
        dom: '<"toolbar">frtip',
        initComplete: function () {
            $("div.toolbar").html('<a href="#" style="margin: 5px" class="btn  btn-info btn-secondary" id="editallbtn" onclick="EditAll()">Edit All</a>' +
                '<a href="#" style="margin: 5px" class="btn  btn-info btn-secondary" id="deleteallbtn" onclick="deleteAllRows()">Delete All</a>' +
                '<a href="#" class="btn  btn-info btn-secondary" style="display: none;margin: 5px" id="saveallbtn" onclick="SaveAll()">Save</a>'
                + '<a href="#" class="btn  btn-info btn-secondary" style="display: none;margin: 5px" id="canceleditallbtn" onclick="CancelEditAll()">Cancel</a>');

        },
        serverSide: true, "processing": true,
        aoColumns: mdataArray
    });

    //call search api when user types in filter input
    table.columns().every(function () {
        var that = this;
        $('input', this.header()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that.search(this.value).draw();
            }
        });
    });
    var onEditClickcls = '';
    $.each(ColumnData, function (index, element) {
        if (element.Editable == true) {
            onEditClickcls += 'tr td.' + element.Name + ',';
        }
    });
    onEditClickcls = onEditClickcls.substring(0, onEditClickcls.length - 1);
    console.log(onEditClickcls);
    $("#dtexample tbody").on('click', onEditClickcls, function (e) {
        if ($(e.target).is('input') || $(e.target).is('img') || $(e.target).is('span.copyAll') || isEditAllState) {
            e.preventDefault();
            return;
        }
        RoweditMode($(this).parent());
    });

    //for delete button
    $("#dtexample tbody").on('click', 'tr td span.deleteBtn', function (e) {
        //  RoweditMode($(this).parent().parent());
        deleteRow(this.parentNode.parentNode);
    });

    //for insert button
    $("#dtexample tfoot").on('click', 'tr td span.insertBtn', function (e) {
        //  RoweditMode($(this).parent().parent());
        insertRowData(this.parentNode.parentNode);
    });


    $("#dtexample tbody").on('keyup', 'input.userinput', function (e) {

        if (e.keyCode == 13) {
            //Check if edit all state
            if (isEditAllState) {
                SaveAll();
            } else {
                updateRowData(this.parentNode.parentNode);
            }
        }
    });
}
var editIndexTable = -1;
function RoweditMode(rowid) {
    var prevRow;
    var rowIndexVlaue = parseInt(rowid.attr("indexv"));
    if (editIndexTable == -1) {
        saveRowIntoArray(rowid);
        rowid.attr("editState", "editState");
        editIndexTable = rowid.rowIndex;
        setEditStateValue(rowid, rowIndexVlaue + 2);
    }
    else {
        prevRow = $("[editState=editState]");
        prevRow.attr("editState", "");
        rowid.attr("editState", "editState");
        editIndexTable = rowIndexVlaue;
        saveArrayIntoRow(prevRow);
        saveRowIntoArray(rowid);
        setEditStateValue(rowid, rowIndexVlaue + 2);
    }
}
function setEditStateValue(td1, indexRow) {
    for (var k in EditRowData) {
        $($(td1).children('.' + k)[0]).html('<input value="' + EditRowData[k] + '" class="userinput"  style="width: 99% " />');
    }
}
function cancelBtn() {
    var prevRow = $("[editState=editState]");
    prevRow.attr("editState", "");
    if (prevRow.length > 0) { saveArrayIntoRow($(prevRow)); }
    editIndexTable = -1;
}
function saveRowIntoArray(cureentCells) {
    $.each(ColumnData, function (index, element) {
        if (element.Editable == true) {
            var htmlVal = $($(cureentCells).children('.' + element.Name)[0]).html();
            EditRowData[element.Name] = htmlVal;
        }
    });
}
function saveArrayIntoRow(cureentCells) {
    for (var k in EditRowData) {
        $($(cureentCells).children('.' + k)[0]).html(EditRowData[k]);
    }
}
function updateRowData(currentCells) {
    var table = $("#dtexample").DataTable();
    var row = table.row(currentCells);
    rowid = currentCells.getAttribute('id');
    var UpdateRowData = [];

    $.each(ColumnData, function (index, element) {
        if (element.Editable == true) {
            UpdateRowData.push({
                'pname': element.Name, 'pvalue': $($($(currentCells).children('.' + element.Name)).children('input')[0]).val()
            });
        }
    });
    console.log(UpdateRowData);
    UpdateRowData.push({ 'pname': 'rowid', 'pvalue': rowid });
    var parameter = "";
    for (i = 0; i < UpdateRowData.length; i++) {
        if (i == UpdateRowData.length - 1)
            parameter = parameter + UpdateRowData[i].pname + "=" + UpdateRowData[i].pvalue;
        else
            parameter = parameter + UpdateRowData[i].pname + "=" + UpdateRowData[i].pvalue + "&";
    }
    $.ajax({
        type: 'POST',
        url: apiUrl + UpdateRowDataApiEndpoint,
        data: parameter,
        success: function (data) {
            var table = $('#dtexample').DataTable();
            table.draw('page');
        }
    });
}

//Edit All
var EditAllData = [];
function EditAll() {
    cancelBtn();
    $('#dtexample tbody tr').each(function () {
        varrowid = this.getAttribute('id');
        var that = this;
        var EditDT = [];
        $.each(ColumnData, function (index, element) {
            if (element.Editable == true) {
                var htmlVal = $($(that).children('.' + element.Name)[0]).html();
                EditDT[element.Name] = htmlVal;
                $($(that).children('.' + element.Name)[0]).html('<input value="' + htmlVal + '"  class="userinput"  style="width: 99% " />');
            }
        });
        EditDT['rowid'] = varrowid;
        EditAllData.push(EditDT);
    });
    $('#editallbtn').css('display', 'none');
    $('#canceleditallbtn').css('display', 'inline-block');
    $('#saveallbtn').css('display', 'inline-block');
    isEditAllState = true;
}
function CancelEditAll() {
    $('#dtexample tbody tr').each(function () {
        varrowid = this.getAttribute('id');
        var filterednames = EditAllData.filter(function (obj) {
            return (obj['rowid'] == varrowid);
        });
        var that = this;
        for (var k in filterednames[0]) {
            $($(that).children('.' + k)[0]).html(filterednames[0][k]);
        }
    });
    isEditAllState = false;
    $('#editallbtn').css('display', 'inline-block');
    $('#canceleditallbtn').css('display', 'none');
    $('#saveallbtn').css('display', 'none');
}
function SaveAll() {
    $('#dtexample tbody tr').each(function () {
        updateRowData(this);
    });
    isEditAllState = false;
    $('#editallbtn').css('display', 'inline-block');
    $('#canceleditallbtn').css('display', 'none');
    $('#saveallbtn').css('display', 'none');
}

//Delete
function deleteRow(currentCells) {
    var table = $("#dtexample").DataTable();
    var row = table.row(currentCells);
    rowid = currentCells.getAttribute('id');
    $.ajax({
        type: 'POST',
        url: apiUrl + DeleteRowDataApiEndpoint,
        data: 'rowid=' + rowid,
        success: function (data) {
            var table = $('#dtexample').DataTable();
            table.draw('page');
        }
    });

}
//delete all
function deleteAllRows() {
    if (confirm("Are you sure you want to delete filtered rows?"))
        $('#dtexample tbody tr').each(function () {
            varrowid = this.getAttribute('id');
            var that = this;
            deleteRow(that);

        });

}

//insert row
function insertRowData(currentCells) {
    var table = $("#dtexample").DataTable();
    var row = table.row(currentCells);
    var InsertRowData = [];
    console.log(currentCells);
    $.each(ColumnData, function (index, element) {
        InsertRowData.push({
            'pname': element.Name, 'pvalue': $($($(currentCells).children('.' + element.Name)).children('input.' + element.Name + 'Add')[0]).val()
        });

    });


    var parameter = "";
    for (i = 0; i < InsertRowData.length; i++) {
        if (i == InsertRowData.length - 1)
            parameter = parameter + InsertRowData[i].pname + "=" + InsertRowData[i].pvalue;
        else
            parameter = parameter + InsertRowData[i].pname + "=" + InsertRowData[i].pvalue + "&";
    }
    $.ajax({
        type: 'POST',
        url: apiUrl + InsertRowDataApiEndpoint,
        data: parameter,
        success: function (data) {
            var table = $('#dtexample').DataTable();
            table.draw('page');
        }
    });
}
function InitializeFormatter() {
    $('#dtexample tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        if (row.child.isShown()) {
            tr.removeClass();
            // This row is already open - close it
            row.child.hide();
            tr.find('td:nth-child(1) img').attr("src", "/images/add.png");
        }
        else {
            // Open this row
            tr.addClass("thisRowShown");
            var histrows = format(row.data());
            row.child($(histrows)).show();
        }
    });
}
function format(d) {
    // `d` is the original data object for the row
    var b = '<tr class="gridlistCss">' +
        '<td></td>' +
        '<td class="dt-center">' + d.ID + '</td>' +
        '<td class="dt-center">' + d.ORD_NUM + '</td>' +
        '<td class="dt-center">' + d.ORD_AMOUNT + '</td>' +
        '<td class="dt-center">' + d.ADVANCE_AMOUNT + '</td>' +
        '<td class="dt-center">' + d.ORD_DATE + '</td>' +
        '<td class="dt-center">' + d.AGENT_CODE + '</td>' +
        '<td class="dt-center">' + d.CUST_CODE + '</td>' +
        '<td class="dt-center">' + d.ORD_DESCRIPTION + '</td>' +
        '<td class="dt-center"></td>' +
        '</tr>';

    var final = b;//comment this to expand with div
    //final="<div><span>One span in DIV"+d.ORD_NUM+"</span></div>";//comment this to show data in Table format
    return final;
}