$(document).ready(function(){

	//Create New Bank
	$('#new-bank-form').on('submit', function(e){
		e.preventDefault();
		var date = new Date().toDateString();
		var deadline = ($('#deadline').val());
		var daysRemaining = getTimeRemaining(deadline).days;
		console.log(daysRemaining);
		//Serialize form data
		var formData = $(this).serialize() + "&date=" + date;
		console.log(formData);
  		// url, data, callback
    $.post('/api/banks', formData, function(data) {
    	location.reload();
          //New Bank Div
	  // var bank = "<li id = '" + data._id + "' class='bank-li'>" +
    //                    "<div class ='well bank-list-wrapper'>" +  
    //                    "<h4>" + data.itemName + "</h4>" +
		// 		"<div class='item-update-form form-group' style='display:none;'>" + 
		// 			"<input type='text' class='form-control item-update-field'>" +
		// 			"<button type='button' class='btn btn-default itemUpdateSubmit'>" + "Update!" + 
		// 			"</button></div>" + "<span class='pull-right'>Days Remaining:" + daysRemaining + "</span>" +
    //                        		"<div class = 'bank-details'>" + 
    //                            		"<h5 class='bar-title'>" + "Progress" + 
    //                                	"<a href='#' class='btn primary' data-toggle='modal' data-target='#basicModal'>" +
    //                                	"<i class='ion ion-plus-circled'></i>" + "</a>" + "</h5>" +
    //                            	"<div class='progress'>" + 
    //                            		"<div id='bar_id" + data._id + "' class='progress-bar' style='width:" + data.progress_added + "'aria-valuenow='70' aria-valuemin='0' aria-valuemax='100'>" +
    //                            		"<span class='progress_added'>" + data.progress_added + "</span>" + "/" +
    //                            		"<span class='item_price'>" + data.price + "</span></div></div>" + 
    //                            		"<a href='#' data-id = '" + data._id + "' class='btn delete'><i class='ion ion-ios-trash'></i></a>" +
    //                        		"</div>" +    
    //                    "</div>" +
    //               	"</li>";
	 	//   //Append new bank to page
    //      $('.bank-list').append(bank);
    //      $('#new-bank-form')[0].reset();

     });

	});

	//Add Progress to Bar
	$('.bank-list').on('click', '.btn', function(e){
		e.preventDefault();
		var bankId = $(this).closest('li').attr('id');
		$('.bankId').val(bankId);
	});
	
	//Add Progress Modal Submit
	$('.form-group').on('click', '.progress-submit', function(e) {
		e.preventDefault();
		var progress_added = $('#cashValue').val();
		var comment = $('.comment-form').val();
		var bankId = $('.bankId').val();
	
	//Server Request to add Comment 
		$.ajax({
		    url: '/api/banks/' + bankId + '/comments', 
		    type: 'Post',
		    data: {text: comment}, 		
		    dataType: 'json'
			}).done(function(newComment) {
				$('#addProgress-form')[0].reset();
				$('.comments-bank').append('<p>'+ comment + '</p>');
			})
			  	.fail(function() {
			  	alert( "Error" );
		});

	//Server Request to add Progress
	$.ajax({
	    url: '/api/banks/' + bankId, 
	    type: 'Put',
	    data: {progress_added: progress_added}, 		
	    dataType: 'json'
		}).done(function(bank) {
			// console.log(bank);
		  	progressUpdate(bank.progress_added, bank.price, bank._id);
		  	$('#addProgress-form')[0].reset();
		})
		  	.fail(function() {
		  	alert( "error" );
		});
	});

	//Update Progress bar function	
	var progressUpdate = function(progress_added, item_cost, bank_id){
		var this_bank = $('#bar_id' + bank_id);
		//Remove current progress value from progress bar
		this_bank.closest(".progress-bar").removeAttr( "style");
		//set the new value to the cash added divided by the item cost
		var percentValue = (progress_added/item_cost) * 100;
		//create the string for the new style value
		var newProgressValue = 'width:' + percentValue + '%';
		//Set the progress bar style to the new value
		this_bank.closest(".progress-bar").attr("style", newProgressValue);
		this_bank.closest( ".progress-bar" ).find( ".progress_added" ).html(progress_added);
	};

	//On page load update progress bar value
	var updateBar = function(){
		var progress_added_array = $('.progress_added').map(function(){
			return $(this).text();
		});
		var item_cost_array = $('.item_price').map(function(){
			return $(this).text();
		});	
		$('.progress-bar').map(function(i){
			var percentValue = (progress_added_array[i]/item_cost_array[i])*100;
			var newProgressValue = 'width:' + percentValue + '%';
			$(this).attr("style", newProgressValue);
			});
		};

	updateBar();

//Delete Bank Function
$('.bank-list').on('click', '.delete', function(e){
	e.preventDefault();
	console.log('I was clicked');
	var bankId = $(this).closest('li').attr('id');
	var bank = $(this).closest('li');
	console.log("this is bank ID: " , bankId);
	console.log("this is bank: ", bank);


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
	console.log('I was clicked');
		var bank_form = $(this).siblings('.item-update-form');
		bank_form.toggle();
		// $('.item-update-form').toggle();
		var bankId = $(this).closest('li').attr('id');
		$('.bankId').val(bankId);
 });

//Submit New Item Name to DOM
	$('.form-group').on('click', '.itemUpdateSubmit', function(e){
		var previousName = $(this).closest('li').find('h4').text();
		var newItemName = $('.item-update-field').val();
		var bankId = $('.bankId').val();
		var input = $(this);

		if (newItemName === '' || null){
	 	alert('Name input is empty');
		} else {
		$.ajax({
	        type: "PUT",
	        url: '/api/banks/' + bankId,
	        data: {itemName: newItemName},
	        dataType: 'json'
	      	})
	      	.done(function(data) {
	      		console.log(data);
	      		input.siblings().val("");
	      		input.closest('li').find('h4').text(newItemName);
      	})
      	.fail(function(data) {
        	console.log("Failed to update bank.");
			});
		} 		
	});

//Display Comments 
$('.show-comments').on('click', function(){
	var id = $(this).data('bank-id');
	$('#comment-bank-' + id).toggle();
});


//Display Deadline Days Remaining
function getTimeRemaining(endtime){
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor( (t/1000) % 60 );
	var minutes = Math.floor( (t/1000/60) % 60 );
	var hours = Math.floor( (t/(1000*60*60)) % 24 );
	var days = Math.floor( t/(1000*60*60*24) );
		return {
	    'total': t,
	    'days': days,
	    'hours': hours,
	    'minutes': minutes,
	    'seconds': seconds
	};
}

	//User Sign-Up


	//User Login


	//User Logout


}); 
