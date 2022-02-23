# datatable-customized
Using DataTables plug-in for jQuery https://datatables.net

<a href="https://sinhashubh.github.io/datatable-examples/DataTable.htm" target="_blank">Demo</a>

This is Server-side processing(<a href="https://www.datatables.net/examples/data_sources/server_side.html" target="_blank">description</a>) example for jQuery datatables with the difference that even the headers are returned from API
Having functionalities such as : 
1. Search ✅
2. Sort ✅
3. Expand Row ✅
4. Edit Row (Inline) ✅
5. Edit Multiple Rows (Inline) ✅
6. Fix Column/s (in progress)
7. Custom Coloring (in progress)
8. Column Visibility (in progress)
9. Multiple Header Rows (With/Without Colspan) (in progress)

All you have to do is put the Datatable.htm and dt-custom.js in your website, change the API and endpoint URL's and handle required requests in API.


## Example of Table Meta format that should be returned by GetTableMeta request
This request is setup functionalities needed. For eg. Is this simple data display with sort and filter? Or data can be inserted,updated or deleted?
```javascript
{"Column":[
{"Name":"ORD_NUM","Editable":true,"Searchable":true,"Class":"ORD_NUM"},{"Name":"ORD_AMOUNT","Editable":true,"Searchable":true,"Class":"ORD_AMOUNT"},{"Name":"ADVANCE_AMOUNT","Editable":true,"Searchable":true,"Class":"ADVANCE_AMOUNT"},{"Name":"ORD_DATE","Editable":true,"Searchable":true,"Class":"ORD_DATE"},{"Name":"CUST_CODE","Editable":true,"Searchable":true,"Class":"CUST_CODE"},{"Name":"AGENT_CODE","Editable":true,"Searchable":true,"Class":"AGENT_CODE"},{"Name":"ORD_DESCRIPTION","Editable":true,"Searchable":true,"Class":"ORD_DESCRIPTION"},{"Name":"ID","Editable":false,"Searchable":false,"Class":"ID"}
],
"Name":"TableNameHere","Insertable":true,"Deletable":true}
```
## Example of Table Data format that should be returned by GetTableData request
This request is main request which will return data from API and handle global search, column search and pagination.
```javascript
{"draw":1,"recordsTotal":34,"recordsFiltered":34,"data":[{"ID":1,"ORD_NUM":"200100","ORD_AMOUNT":"1000","ADVANCE_AMOUNT":"600","ORD_DATE":"8/1/2008 12:00:00 AM","CUST_CODE":"C00013","AGENT_CODE":"A003  ","ORD_DESCRIPTION":"TYU"},{"ID":2,"ORD_NUM":"200101","ORD_AMOUNT":"3212","ADVANCE_AMOUNT":"1000","ORD_DATE":"7/15/2008 12:00:00 AM","CUST_CODE":"C00001","AGENT_CODE":"A008  ","ORD_DESCRIPTION":"TYU"}]}
```
## Example of UpdateRowData request that should be handled appropriately on Server's side 
Applicable if 'Editable' properties of column/s is set to true. In that case, on click on the column data in rows, the column/s will change to textbox and user can edit and save(by pressing enter). All columns are sent to API in POST request (JSON Array of Object) and API can run update as needed.
```javascript
Form Data : [{"ORD_NUM":"200103","ORD_AMOUNT":"15001","ADVANCE_AMOUNT":"700","ORD_DATE":"5/15/2008 12:00:00 AM","CUST_CODE":"C00021","AGENT_CODE":"A005","ORD_DESCRIPTION":"SODA","rowid":"4"}]
```
## Example of InsertRowData request that should be handled appropriately on Server's side 
Applicable if 'Insertable' property of table is set to true. In that case, footer will have textboxes for all columns and user can insert and save(by clicking add). All columns are sent to API in POST request and API can insert the data.
```javascript
Form Data : ORD_NUM=200103&ORD_AMOUNT=15001&ADVANCE_AMOUNT=700&ORD_DATE=5/15/2008 12:00:00 AM&CUST_CODE=C00021&AGENT_CODE=A005&ORD_DESCRIPTION=SOD4
```
## Example of DeleteRowData request that should be handled appropriately on Server's side 
Applicable if 'Deletable' property of table is set to true. In that case, a new delete column will be added to table and user can click for any row they want to delete. rowid is sent to API in POST request(JSON Array of Object) and API can delete the row/s.
```javascript
Form Data : [{"rowid":"35"}]
```
## For Expand Row, make changes in "format" function as needed.

>Other than these, user will have the option to update all or delete all. For example, user searches the table for certain rows and want to edit them all at once, in that case, user will click the 'Edit All' button and all filtered rows will be changed to textboxes. Once user enters details as needed, they can click the save button right next to 'Edit All' and multiple UpdateRowData requests are called and handled by the API.
In case, user wants to delete certain rows, they can click 'Delete All' button and multiple DeleteRowData requests will be created and handled by the API.

## You can check server side API implementations below :
<a href="https://github.com/sinhashubh/datatables-php-api" target="_blank">PHP API Example</a>
<a href="https://github.com/sinhashubh/datatables-netcore-api" target="_blank">Dot Net Core API Example</a>



## Support

Reach out to me at one of the following places!

- LinkedIn at <a href="https://www.linkedin.com/in/shubham-sinha7" target="_blank">`here`</a>
