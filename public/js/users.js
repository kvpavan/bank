
var user_id = null,
add_user = 0;
var table = null;



var handleUserFormSubmit = function() {
$("#user-form-submit").click(function( event ) {
  saveUser();
});
};

var validator = null;

$(function() {

User.init();
});

var handleUserAddButton = function() {
$("#add-user-button").click(function( event ) {
  //event.preventDefault();
  add_user = 1;
  $('#name').val('');
  $('#user_id').val('');
  $('#email').val('');
  $("#user-form-delete").hide();

  // validator.resetForm();//remove error class on name elements and clear history
   //validator.reset();
   $('#user-name').next("span").hide();
   $("#user-modal").modal('show');
});
};

var handleUserFormDelete = function() {
$("#user-form-delete").click(function( event ) {


  swal({
    title: "Are you sure?",
    text: "You want to delete this user!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
    deleteUser();
    } else {
    swal("Cancelled", "User is not deleted :)", "error");
    }
  });

});
};

function confirm_delete(id){

swal({
    title: "Are you sure?",
    text: "You want to delete this user!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      //event.preventDefault();
      $.post('/api/users/delete',{
          user_id: id
        },
        function(json) {
          //console.log(data);
          //json = JSON.parse(data);
          swal('info', 'user deleted', "info");
          if(json){
            table.ajax.reload();
          }
        }
      );

    } else {
      swal("Cancelled", "User is not deleted :)", "error");
    }
  });

};


function saveUser() {

  if($('#user_id').val().length < 3){
    swal('error', 'Employee id should be atleast 4 charecters!!!');
    return false;
  }
  if($('#name').val().length < 3){
    swal('error', 'Name should be atleast 4 charecters!!!');
    return false;
  }
  if (add_user == 1) {
    $.ajax({
      type: 'POST',
      url: '/api/users/create',
      data:{
          name: $('#name').val(),
          user_id: $('#user_id').val()
        },
      beforeSend: function() {
        $(".loading").show();
        $('#user-form-submit').attr('disabled',true);
      },
      success: function(json) {
        $('#user-form-submit').removeAttr('disabled');
        //json = JSON.parse(data);
        $(".loading").hide();
        swal('info', 'User saved', "info");

        if(json.name){
          table.ajax.reload();
          $("#user-modal").modal('toggle');
        }
      },
      error: function(xhr) { // if error occured
        $(".loading").hide();
        swal("failed", "Failed!!! Please try again", "error");
        $('#user-form-submit').removeAttr('disabled');
      }
    });
  } else {
    $.ajax({
      type: 'POST',
      url: '/api/users/update',
      data:{
          id: user_id,
          name: $('#name').val()
        },
      beforeSend: function() {
        $(".loading").show();
        $('#user-form-submit').attr('disabled',true);
      },
      success: function(json) {
        $('#user-form-submit').removeAttr('disabled');
        //json = JSON.parse(data);
        $(".loading").hide();
        swal('info', 'User updated', "info");
        $('#user-form-submit').removeAttr('disabled');

        if(json){
          table.ajax.reload();
          $("#user-modal").modal('toggle');
          add_setup = 0;
        }
      },
      error: function(xhr) { // if error occured
        $(".loading").hide();
        swal("failed", "Failed!!! Please try again", "error");
        $('#user-form-submit').removeAttr('disabled');
      }
    });
  }
}

function deleteUser() {
$.post('/api/users/delete',{
    user_id: user_id
  },
  function(json) {
    //console.log(data);
    //json = JSON.parse(data);

    swal('info', 'user deleted', "info");
    if(json){
      table.ajax.reload();
    }


    $("#user-modal").modal('toggle');
  }
);

}

function viewUser(json) {
  $("#user-form-delete").show();
  //if(json.priority == 1){
    //$('#user-priority').prop('checked', true);
  //}
  $('#name').val(json.name);
  $('#user_id').val(json.user_id);


  add_user = null;
  user_id = json.id;

  $("#user-modal").modal('show');
}
function addAccount(json) {
  $('#account_user_id').val(json.user_id);
  $('#account_number').val('');
  $('#account_balance').val('');
  datatableUserAccount();
  $("#user-account-modal").modal('show');
}
function sendMoney(json) {
  $('#sender_user_id').val(json.user_id);
  $('#amount').val('');
  accountSelector(json.user_id);
  $("#user-ledger-modal").modal('show');
}

function accountSelector(user_id){
  $.get("/api/users/list_accounts", {},
    function(json){
      $(".user-accounts").empty();
      $("#receiver_account").empty();
      $.each(json['data'], (key, value)=>{
        if(value.user_id == user_id){
          $(".user-accounts").append($('<option>', {
              value: value.account_number,
              text: value.account_type + '-' + value.account_number
          }));
          if(key == 0){            
            $(".user-account").val(value.account_numeber);
          }
        }
        else{
          $("#receiver_account").append($('<option>', {
              value: value.account_number,
              text: value.account_type + '-' + value.account_number
          }));
        }
      })
      
      datatableLedger();
    }
  )
}

$("#filter_user_account").change(function(){
  datatableLedger();
})

$("#user-send-submit").click(function(){
  if($("#sender_account").val() == null || $("#sender_account").val() == ''){
    swal('error', 'Please, select sender account number');
    return false;
  }
  if($("#receiver_account").val() == null || $("#receiver_account").val() == ''){
    swal('error', 'Please, select receiver account number');
    return false;
  }
  if($("#amount").val() == '' || $('#amount').val <= 0){
    swal('error', 'Please, enter amount');
    return false;
  }
  $.post('/api/users/send',{
    "fromAccountId":$("#sender_account").val(),
    "toAccountId": $("#receiver_account").val(),
    "amount": $("#amount").val()
  },
  function(json) {
    if(typeof json.errorCode != 'undefined'){
      swal('error', json.errorCode+' : '+json.errorMessage, "error");
      return false;
    }
    datatableLedger();
    $("#amount").val('')
    swal("success", "newSrcBalance:"+json.newSrcBalance+", totalDestBalance:"+json.totalDestBalance+", transferedAt:"+json.transferedAt);
    //ticketJSON = JSON.parse(data);
  }
);
});

function getUser() {

  $.post('/api/users/user.list',{
    },
    function(data) {
      ticketJSON = JSON.parse(data);
    }
  );
}

function datatableUser() {

table = $('#datatable-user').DataTable( {
  "ordering": true,
  "order": [[ 1, "desc" ]],
  "ajax": {
      "url": "/api/users/list",
      "type": "get", 
      "data":  {
        
      }
    },
    "dataSrc": (data)=>{
      return data['data'];
    },
    "order": [[ 2, "desc" ]],
    "destroy":true,
  "columns": [
    { "title": "Name", "data": "name", "className":"link text-left text-nowrap" },
    { "title": "User ID", "data": "user_id", "className":"link text-left text-nowrap" },
    { "title": "created_at", "name":"createdAt", "data": "createdAt", "className":"link text-left text-nowrap", "searchable": false},
    { "title": "Action", "data": "name", "className":"link text-left text-nowrap" }
  ],
  "columnDefs":[
    {
      'targets': 3,
        'searchable': false,
        'orderable': false,
        'render': function (data, type, row) {
           return '<div class="btn-group btn-group-xs">' +
              '	<button type="button" data-toggle="modal" class="btn btn-default btn-sm btn-primary btn-edit" data-toggle="tooltip" data-placement="top" data-html="true" title="Edit" >' +
              '		<i class="fa fa-edit" style="font-size:14px"></i>' +
              ' Edit	</button>&nbsp&nbsp&nbsp' +
              '	<button type="button" class="btn btn-default btn-sm btn-danger btn-sm btn-send" data-toggle="tooltip" data-placement="top" data-html="true" title="Delete">' +
              '		<i class="fa fa-rocket"></i>' +
              ' Send Money	</button>&nbsp&nbsp&nbsp' +
              '	<button type="button" class="btn btn-default btn-sm btn-danger btn-sm btn-account"  data-toggle="tooltip" data-placement="top" data-html="true" title="Delete">' +
              '		<i class="fa fa-sticky-note-o "></i>' +
              ' View Account	</button>&nbsp&nbsp&nbsp' +
              '	<button type="button" class="btn btn-default btn-sm btn-danger btn-sm" onclick="confirm_delete('+row.user_id+');" href="#pop_delete" data-toggle="tooltip" data-placement="top" data-html="true" title="Delete">' +
              '		<i class="fa fa-times"></i>' +
              ' Delete	</button>'+
              '</div>';
        }
      }
  ],
  /*dom: 'Bfrtip',
  buttons: [
    'copyHtml5',
    'excelHtml5',
    'csvHtml5',
    'pdfHtml5'
  ]*/
} );


$('.dataTables_filter input').attr("placeholder", "Search");


$('#datatable-user tbody').on('click', 'tr .btn-send', function () {
  var data = JSON.parse(JSON.stringify(table.row( $(this).parents('tr') ).data()));
  sendMoney(data);
});

$('#datatable-user tbody').on('click', 'tr .btn-account', function () {
  var data = JSON.parse(JSON.stringify(table.row( $(this).parents('tr') ).data()));
  addAccount(data);
});

$('#datatable-user tbody').on('click', 'tr .btn-edit', function () {
  var data = JSON.parse(JSON.stringify(table.row( $(this).parents('tr') ).data()));
  viewUser(data);
});

}

function datatableUserAccount() {

  tableAccount = $('#datatable-user-account').DataTable( {
    "ordering": true,
    "order": [[ 1, "desc" ]],
    "ajax": {
        "url": "/api/users/list_accounts",
        "type": "get", 
        "data":  {
          "user_id": $("#account_user_id").val()
        }
      },
      "destroy":true,
      "dataSrc": (data)=>{
        return data['data'];
      },
    "scrollX":true,
    "order": [[4, "desc"]],
    "columns": [
      { "title": "User ID", "data": "user_id", "className":"link text-left text-nowrap" },
      { "title": "Account Type", "data": "account_type", "className":"link text-left text-nowrap" },
      { "title": "Account Number", "data": "account_number", "className":"link text-left text-nowrap" },
      { "title": "Balance", "data": "account_balance", "className":"link text-left text-nowrap", "searchable": false},
      { "title": "Created At", "data": "createdAt", "className":"link text-left text-nowrap", "searchable": false},
      { "title": "Updated At", "data": "updatedAt", "className":"link text-left text-nowrap", "searchable": false}
    ]
  } );
  
  
  $('.dataTables_filter input').attr("placeholder", "Search");
  
};


function datatableLedger() {

  tableLedger = $('#datatable-ledger').DataTable( {
    "ordering": true,
    "order": [[ 4, "desc" ]],
    "ajax": {
        "url": "/api/users/list_ledger",
        "type": "get", 
        "data":  {
          "user_id": $("#sender_user_id").val(), "account_number": $("#filter_user_account").val()
        }
      },
      "destroy":true,
      "dataSrc": (data)=>{
        return data['data'];
      },
    "scrollX":true,
    "order":[[4,"Desc"]],
    "columns": [
      { "title": "From/To", "data": "remitter_number", "className":"link text-left text-nowrap", "searchable": false},
      { "title": "Credit", "data": "credit", "className":"link text-left text-nowrap", "searchable": false},
      { "title": "Debit", "data": "debit", "className":"link text-left text-nowrap", "searchable": false},
      { "title": "Balance", "data": "balance", "className":"link text-left text-nowrap", "searchable": false},
      { "title": "Created At", "data": "createdAt", "className":"link text-left text-nowrap", "searchable": false}
    ]
  } );
  
}
  $("#user-account-submit").click(function(){
    if($("#account_balance").val() == '' || $("#account_balance").val() <= 0){
      swal('error', 'Please enter intial amount' );
      return false;
    }
    if($("#account_number").val() == '' || $("#account_number").val() < 1000){
      swal('error', 'Account number should have min 4 digits')
      return false;
    }
    $.post('/api/users/create_account',{
      "account_type":$("#account_type").val(),
      "account_number": $("#account_number").val(),
      "account_balance": $("#account_balance").val(),
      "user_id":$("#account_user_id").val()
    },
    function(json) {
      if(typeof json.message != 'undefined'){
        swal('error', json.message, "error");
        return false;
      }
      $("#account_number").val('')
      $("#account_balance").val('')
      datatableUserAccount();
      swal("success", "Account added successfully");
      //ticketJSON = JSON.parse(data);
    }
  );
  });
  

var User = function () {
"use strict";
return {
  //main function
  init: function () {
    //getSection();

    datatableUser();

    handleUserFormSubmit();
    handleUserAddButton();
    handleUserFormDelete();
  }
};
}();