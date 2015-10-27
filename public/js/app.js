$(document).ready(function(){

	//Create New Bank
	$('#new-bank-form').on('submit', function(e){
		e.preventDefault();
		var date = new Date().toDateString();
		//Serialize form data
		var formData = $(this).serialize() + "&date=" + date;
  		// url, data, callback
        $.post('/api/banks', formData, function(data) {
          //New Bank Div
	      var bank = "<li id = " + data._id + ">" +
	                    "<div class ='well bank-list-wrapper'>" +
	                        "<h4>" + data.itemName + "</h4>" + "<span class='glyphicon glyphicon-pencil'></span>" +
	                        "<p class='pull-right'>" + "Date Created: " + date + "</p>" +
	                        "<div class = 'bank details'>" +
	                            "<a href='#' class='btn primary' data-toggle='modal' data-target='.bs-example-modal-sm'>" +
	                            "<img src = '/img/capPoint.png'/>" +
	                            "</a>" +
	                            "<h5>Add Cash!</h5>" +
	                            "<div class='progress'>" +
	                                "<div id = 'bar_id" + data._id + "'" + "class='progress-bar' style='width:" + data.progress + "%'  aria-valuenow='0'  aria-valuemin='0' aria-valuemax='100'>" + 
	                                "$" + "<span class = 'cash_added'>" + data.cash_added + '</span>/' + "<span class='item_price'>" + data.price + "</span></div>" +
	                            "</div>" +
	                            "<a href='#' class='btn delete' data-id =" + data._id + ">Delete bank...</a>" +
	                        "</div>" +
	                    "</div>" +
	                "</li>";

	      //Append new bank to page
          $('.bank-list').append(bank);
          $('#new-bank-form')[0].reset();

          });

	    });

	//Add Money to Bank
	$('.bank-list').on('click', '.btn', function(e){
		e.preventDefault();
		var bankId = $(this).closest('li').attr('id');
		console.log(bankId);
		$('.bankId').val(bankId);
	});
	
	//Add Money Modal Submit
	$('.form-group').on('click', '.cash-submit', function(e) {
		var cash_added = $('#cashValue').val();
		var item_cost = $('.item_price').html();
		console.log(item_cost);
		var bankId = $('.bankId').val();
		if (cash_added > item_cost){
			return alert('Dont you know how progress bars work? That too much progress.');
		}

	//Server Request
		$.ajax({
		    url: '/api/banks/' + bankId, 
		    type: 'PUT',
		    data: {cash_added: cash_added}, 		
		    dataType: 'json'
			}).done(function(bank) {
				$('#addCash-form')[0].reset();
			 	console.log(bank);
			  	progressUpdate(bank.cash_added, bank.price, bank._id);
			})
			  	.fail(function() {
			  	alert( "error" );
			});
		});

	//Update Progress bar function	
	var progressUpdate = function(cash_added, item_cost, bank_id){
		var this_bank = $('#bar_id' + bank_id);
		//Remove current progress value from progress bar
		this_bank.closest(".progress-bar").removeAttr( "style");
		//set the new value to the cash added divided by the item cost
		var percentValue = (cash_added/item_cost) * 100;
		//create the string for the new style value
		var newProgressValue = 'width:' + percentValue + '%';
		//Set the progress bar style to the new value
		this_bank.closest(".progress-bar").attr("style", newProgressValue);
		this_bank.closest( ".progress-bar" ).find( ".cash_added" ).html(cash_added);
	};

	//On page load update progress bar value
	var updateBar = function(){
		var cash_added_array = $('.cash_added').map(function(){
			return $(this).text();
		});
		var item_cost_array = $('.item_price').map(function(){
			return $(this).text();
		});	
		$('.progress-bar').map(function(i){
			var percentValue = (cash_added_array[i]/item_cost_array[i])*100;
			var newProgressValue = 'width:' + percentValue + '%';
			$(this).attr("style", newProgressValue);
			});
		};

	updateBar();

	//Delete Bank Function
	$('.bank-list').on('click', '.delete', function(e){
		e.preventDefault();
		var bankId = $(this).closest('li').attr('id');
		var bank = $(this).closest('li');

	//Server delete request
		$.ajax({
	        type: "delete",
	        url: '/api/banks/' + bankId
	      	})
	      	.done(function(data) {
	        	$(bank).remove();
	      	})
	      	.fail(function(data) {
	        	console.log("Failed to terminate bank.");
    	});

	});

	//Edit Item Name 
	$('.bank-list').on('click', 'h4', function() {
		var bank_form = $(this).siblings('.item-update-form');
		bank_form.toggle();
		// $('.item-update-form').toggle();
		var bankId = $(this).closest('li').attr('id');
		$('.bankId').val(bankId);
     });

	//Submit New Item Name to DOM
	$('.form-group').on('click', '.itemUpdateSubmit', function(e){
		var bank = $(this).closest('li');
		var itemName = $('#itemUpdate').val();
		var bankId = $('.bankId').val();
		// $('.item-update-form')[0].reset();
		$.ajax({
	        type: "PUT",
	        url: '/api/banks/' + bankId,
	        data: {itemName: itemName},
	        dataType: 'json'
	      	})
	      	.done(function(data) {
	      		console.log(data);
	        	//updateNameFunction
	      	})
	      	.fail(function(data) {
	        	console.log("Failed to update bank.");
    		});
	});
    
    //Update item name in DOM
    var updateName = function(new_name){

    };

	//User Sign-Up


	//User Login


	//User Logout


}); 