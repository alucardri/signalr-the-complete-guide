var dataTable;
var connectionOrder = new signalR.HubConnectionBuilder().withUrl("/hubs/order").build();

$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {

    dataTable = $('#tblData').DataTable({
        "ajax": {
            "url": "/Order/GetAllOrder"
        },
        "columns": [
            { "data": "id", "width": "5%" },
            { "data": "name", "width": "15%" },
            { "data": "itemName", "width": "15%" },
            { "data": "count", "width": "15%" },
            {
                "data": "id",
                "render": function (data) {
                    return `
                        <div class="w-75 btn-group" role="group">
                        <a href=""
                        class="btn btn-primary mx-2"> <i class="bi bi-pencil-square"></i> </a>
                      
					</div>
                        `
                },
                "width": "5%"
            }
        ]
    });
}

connectionOrder.on("newOrder", () => {
    dataTable.ajax.reload();
    toastr.success("New order received");
});

function fulfilled() {
    //do something on start
    console.log("Connection to User Hub Successful");
}

function rejected() {
    //rejected logs
    console.log("Connection to User got Rejected");
}

connectionOrder.start().then(fulfilled, rejected);