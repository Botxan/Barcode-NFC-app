var controlTable = $('#controlTable').DataTable( { // set up the datatable
	"lengthChange": false, // disable the option to choose how many rows per page should appear
	"searching": false, // disable search bar
	"pageLength": 6, // rows per page
	"language": { // change the message of "showing entries" by the remove button
		"info": "<button id='delete' onclick='deleteRows()'><span class='deleteText'>Remove</span><span class='deleteIcon'><i class='fas fa-trash'></i></span></button>",
	},
	"columnDefs": [ // the second column of the table is the "id" of the row, and its better if the end user doesnt see this row
		{
			"targets":[1],
			"visible": false
		}
	],
	"order": [[ 1, "desc" ]] // in this way, the last product scanned will position first in the table
} );