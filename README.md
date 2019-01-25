# datatable-examples
Using DataTables plug-in for jQuery https://datatables.net

Join the disucssion chatroom for this project on [Webchat Channel](https://webchat.freenode.net/) : askDT

Having functionalities such as : 
1. Search
2. Sort
3. Expand Row
4. Edit Row (Inline)
5. Edit Multiple Rows (Inline)
6. Fix Column/s
7. Custom Coloring
8. Column Visibility
9. Multiple Header Rows (With/Without Colspan)

<a href="http://eunoia.gq/datatable.htm" target="_blank">Demo Here</a>

# Example of Table Meta format that should be returned by GetTableMeta request

{"Column":[
{"Name":"ORD_NUM","Editable":true,"Searchable":true,"Class":"ORD_NUM"},{"Name":"ORD_AMOUNT","Editable":true,"Searchable":true,"Class":"ORD_AMOUNT"},{"Name":"ADVANCE_AMOUNT","Editable":true,"Searchable":true,"Class":"ADVANCE_AMOUNT"},{"Name":"ORD_DATE","Editable":true,"Searchable":true,"Class":"ORD_DATE"},{"Name":"CUST_CODE","Editable":true,"Searchable":true,"Class":"CUST_CODE"},{"Name":"AGENT_CODE","Editable":true,"Searchable":true,"Class":"AGENT_CODE"},{"Name":"ORD_DESCRIPTION","Editable":true,"Searchable":true,"Class":"ORD_DESCRIPTION"},{"Name":"ID","Editable":false,"Searchable":false,"Class":"ID"}
],
"Name":"TableNameHere"}

# Example of Table Data format that should be returned by GetTableData request

{"draw":1,"recordsTotal":34,"recordsFiltered":34,"data":[{"ID":1,"ORD_NUM":"200100","ORD_AMOUNT":"1000","ADVANCE_AMOUNT":"600","ORD_DATE":"8/1/2008 12:00:00 AM","CUST_CODE":"C00013","AGENT_CODE":"A003  ","ORD_DESCRIPTION":"TYU"},{"ID":2,"ORD_NUM":"200101","ORD_AMOUNT":"3212","ADVANCE_AMOUNT":"1000","ORD_DATE":"7/15/2008 12:00:00 AM","CUST_CODE":"C00001","AGENT_CODE":"A008  ","ORD_DESCRIPTION":"TYU"}]}

# Example of UpdateTableData request that should be handled appropriately on Server's side

Form Data : ORD_NUM=200103&ORD_AMOUNT=15001&ADVANCE_AMOUNT=700&ORD_DATE=5/15/2008 12:00:00 AM&CUST_CODE=C00021&AGENT_CODE=A005  &ORD_DESCRIPTION=SODe&rowid=4

