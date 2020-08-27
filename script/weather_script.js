function weather_by_search(){
// 
	var query = get_input();
	if (!query) { return; };
	get_weather(query, "weather");
	get_weather(query, "forecast");
}


function weather_by_location(){
	navigator.geolocation.getCurrentPosition( success, failure );
	
	function success(loc){
		var query = "lat=" + loc.coords.latitude + "&lon=" + loc.coords.longitude;
		get_weather(query, "weather");
		get_weather(query, "forecast");
	};
	
	function failure(error){
		alert("Error getting location with the following code:\n" + error.code);
	};
}


function get_input(){
// gets the content of the input box from the page, then compares it against regex strings to determine if it is a city/state combonation or a zip code.
// accepts no arguemtns.
// returns query: string containing the query section of the openweather URL.

	var input = $('#location').val();
	if ( input.match(/^\d{5}$/) != null | input.match(/^\D*\d{5}$/) != null ) {
		input = input.substr(-5);
		return "zip=" + input;
	} else if (input.match(/^\D+$/) != null) {
		input = input.replace(/\W/g,"");
		return "q=" + input;
	} else {
		alert("Please enter City, State or Zip Code");
		return false;
	}
}


async function get_weather(query, query_type) {
// fetches weather information from openweathermap.org then calls functions to display the data returned. Data requested is in metric measurements.
// accepts 2 arguments: query - string containing the query part of the URL to fetch from.
//	query_type - string determining if the data requested is current weather or forecast data.
// returns nothing.

	var API_key = 'ca30f7ec0b34dfbe1a8860370d2cc25e';
	var weather_url = 'https://api.openweathermap.org/data/2.5/';

	var url = weather_url + query_type + "?" + query + '&units=metric&APPID=' + API_key;

	fetch(url)
		.then((reply) => {
			return reply.json();
		}).then((data) => {
			if ( query_type == 'weather' ) {
				fill_data(data);
			} else if ( query_type == 'forecast' ) {
				draw_forecast(data.list);
			};
//			return data;
		});
}


function fill_data(data){
// fills information into the current_weather element on the page, then shows its parent element.
// accepts 1 argument: data - json object containing current weather data.
// returns nothing.
	$('#city_name').text(data.name);

	var icon_url = get_icon_url(data.weather[0].icon);
	var description = to_title_case(data.weather[0].description);
	var fahr = temp_to_freedom(data.main.temp);
	var celc = data.main.temp.toFixed(1);
	
	var mph = speed_to_freedom(data.wind.speed);
	var mps = data.wind.speed.toFixed(1);
	var heading = get_heading(data.wind.deg);
	
	$('#current_weather').css('backgroundImage', 'url("' + icon_url + '")');
	$('#weather_now_description').text(description);

	$('#weather_now_metric_temp').html(celc + "&#8451;");
	$('#weather_now_freedom_temp').html(fahr + "&#8457;");
	
	$('#wind_heading').text(heading);
	$('#wind_speed_metric').text(mps + " m/s");
	$('#wind_speed_freedom').text(mph + " m/h");

	do_wind_arrow(data.wind.deg, data.wind.speed);
	$('#weather_container').show();
}


function do_wind_arrow(deg, spd) {
// applies scaling and rotation to the wind arrow and it's container respectivly.
// accepts 2 arguments: deg - int containing the number of degrees to rotate the arrow_container element.
//	spd - int used to calculate the scaling for the wind_arrow element.
// returns nothing.

	var length = spd * .1 + 1
	$('#wind_arrow').css('transform', 'scaleY(' + length +')');
	$('#arrow_container').css('transform', 'rotate(' + deg + 'deg)');
}


function temp_to_freedom(temp) {
// converts temperature from Celsius to freedom units.
// accepts 1 argument: temp - int containing the temperature in degrees Celsius.
// returns temp - temp converted to Fahrenheit .

	temp = temp * 1.8 + 32;
	temp = Number(temp.toFixed(1));
	return temp;
}


function speed_to_freedom(spd) {
// converts wind speed from meters/second to miles/hour.
// accepts 1 argument: spd - int wind speed in meters/second.
// returns spd - speed converted to miles/hour.

	spd = spd * 2.237;
	spd = spd.toFixed(1);
	return spd;
}


function get_icon_url(code){
// formats a url given the openweather condition icon code.
// accepts 1 argument: code - string to use to create url.
// returns: url - string containign the complete url.

    var url = 'http://openweathermap.org/img/wn/'+ code + '@2x.png';
    return url;
}


function to_title_case(string) {
// formats a string to title case, capitalizing the first leter of each word.
// accepts 1 argument: string - the string to be formatted.
// returns: string - the string after replacement.

	var string = string.replace(/\b\w/gi,function(a){
		return a.toUpperCase();
	});
	return string;
}


function get_heading(deg) {
// gets the wind heading on a 16-point compas given the degrees.
// accepts 1 argument: deg - int representing the orientation of the wind.
// returns: H - string representing the wind heading.

	var H = ''
	switch (true) {
		case (deg < 11.25):
			H = 'N';
			break;
		case (deg < 33.75):
			H = 'N-NE';
			break;
		case (deg < 56.25):
			H = 'NE';
			break;
		case (deg < 78.75):
			H = 'E-NE';
			break;
		case (deg < 101.25):
			H = 'E';
			break;
		case (deg < 123.75):
			H = 'E-SE';
			break;
		case (deg < 146.25):
			H = 'SE';
			break;
		case (deg < 168.75):
			H = 'S-SE';
			break;
		case (deg < 191.25):
			H = 'S';
			break;
		case (deg < 213.75):
			H = 'S-SW';
			break;
		case (deg < 236.25):
			H = 'SW';
			break;
		case (deg < 258.75):
			H = 'W-SW';
			break;
		case (deg < 281.25):
			H = 'W';
			break;
		case (deg < 303.75):
			H = 'W-NW';
			break;
		case (deg < 326.25):
			H = 'NW';
			break;
		case (deg < 348.75):
			H = 'N-NW';
			break;
		default:
			H = 'N';
	};
	return H;
}


function animate_buttons(){
// animates unit buttons to slide away from eachother, change which is on top, then slide back.
// accepts no arguemtns.
// returns nothing.

	$('#I_button').animate({left: "+=7px"}, "fast",function(){
		$(this).toggleClass('in_front');
		$(this).animate({left: "-=7px"}, "fast");
	});
	
	$('#M_button').animate({left: "-=7px"}, "fast",function(){
		$(this).toggleClass('in_front');
		$('#M_button').animate({left: "+=7px"}, "fast");
	});
}


function change_unit() {
// calls animate_buttons function and toggles visibility of .measurement class elements.
// accepts no arguments.
// returns nothing.

	animate_buttons();
	$('.measurement').toggle();
}


function draw_forecast(data){
	var icon_code = ''
	var working_date = new Date();
	var canvas_objects = $('.canvas');
	var canvas_height = canvas_objects.innerHeight();
	var canvas_width = canvas_objects.innerWidth();
	
	var axis_buffer = 24;	// grants 20px of space for labeling the axis
	var axis_padding = 3;	// pixels between the axis labels and the first line
	var freeze_point = 105;	// how many pixels down on the Y axis is freezing
	var y_multiplyer = 4;	// distance between degrees on the Y axis
	var deg_per_line = 5;	// five degrees per grid line
	var deg_incrament = 10	// how much the temperature on the axis is incremented
	
	var line_spacing = y_multiplyer * deg_per_line;	// how far grid lines should be spaced
	var digit_spacing = y_multiplyer * deg_incrament;	// axis is labeled ever 10 degrees
	var num_data_points = data.length;
	var space_inc = Math.floor((canvas_width - axis_buffer) / (num_data_points - 1));	// distance between data points on the X axis

	var x_point = axis_buffer - space_inc;
	var y_point = 0

	draw_canvas($(canvas_objects)[0]);
	draw_canvas($(canvas_objects)[1]);

	function draw_canvas(obj){
		
		var canvas = obj.getContext('2d');
		var is_imperial = false;
		is_imperial = $(obj).hasClass('imperial');
		
		draw_grid(canvas, is_imperial);
		draw_metric_axis(canvas, is_imperial);
		canvas.beginPath();
		
		for (var i = 0; i < num_data_points; i++) {
			
			point = data[i];
			x_point += space_inc;
			
			y_point = get_y_point(point.main.temp);
			canvas.lineTo(x_point, y_point);

			var point_date = new Date(point.dt_txt);
			var hour = point_date.getHours();
			
			if (hour == 0) {
				draw_date_line();			
				draw_date(point_date);
			} else if (hour == 12) {
				draw_noon_line();
			};
			
			working_date = point_date;
			new_icon_code = point.weather[0].icon;

			
			if (new_icon_code !=  icon_code) {
				draw_icon(x_point, y_point, new_icon_code);
				icon_code = new_icon_code;
			};
		canvas.stroke();
		};
	
	
		function get_y_point(temp){
		// returns the y coordinate to draw to given the temperature and the number of pixels separating each degree on the canvas.
		
			if (is_imperial) { temp = temp_to_freedom(temp); };
			var point = temp.toFixed(0);
			point = freeze_point - point * y_multiplyer;
			return point;
		}

		function draw_date(date) {
		// draws the date as Mmm-dd on the canvas when the time of the data point being evaluated by the main function is 00:00
		
			var date_string = format_date(date);
			var x_offset = x_point + 5;
			var y_offset = 15;
			
			canvas.save();
			get_canvas_style("black-line", "large-left-font");
			canvas.fillText(date_string, x_offset, y_offset);
			canvas.restore();
		}

		function draw_date_line(){
		// draws a solid line at the point given when the time stamp of the point being evaluated by the main function is 00:00
		
			canvas.save();
			get_canvas_style("small-line", "medium-grey-line");
			canvas.fillRect(x_point, 0, 1, canvas_height);
			canvas.restore();
		}

		function draw_noon_line(){
		// draws a dotted line at the point given when the time stamp of the point being evaluated by the main function is 12:00

			canvas.save();
			get_canvas_style("small-line", "medium-grey-line", "dotted-line");
			canvas.strokeRect(x_point, 0, 1, canvas_height);
			canvas.restore();
		}
		
		function draw_icon(){
		// Called when the code for the weather icon differs from the previous data point. Gets the url for the icon and draws on the canvas upon load.

			var img = new Image;
			var y_offset = get_img_y_offset(y_point);
			var x_offset = get_img_x_offset(x_point);
			var icon_url = get_icon_url(icon_code);

			img.src = icon_url;
			img.onload = function() {
				canvas.drawImage(img, x_offset, y_offset, 30, 30);
			};
		}

		function get_img_y_offset(){
		// sets how far above or below the data point to draw the weather icon.

			if ( y_point < 70 ) {
				offset = y_point + 10;
			} else {
				offset = y_point - 40;
			}
			return offset;
		}
		
		function get_img_x_offset(){
		// sets the location to draw the image on the x axis given the x value of the data point minus half the image width.
		
			var offset = x_point - 15;
			return offset;
		}

		function get_num_lines(){
		// determines the number of lines on a canvas given the canvas' internalHeight property and spacing between grid lines.
		// returns an array containing [0] the number of lines below the freezing point and [1] the number of lines above freezing.

			var negative_lines = Math.floor((canvas_height - freeze_point) / line_spacing);
			var positive_lines = Math.floor(freeze_point / line_spacing);
			return [negative_lines, positive_lines];
		}
		
		function get_canvas_style(){
		// sets canvas style by matching each argument received to a list of style names.
		// accepts a variable number of arguments.
		
			for (var i = 0; i < arguments.length; i++) {
				switch (arguments[i]) {
					case "small-right-font":
						canvas.textAlign = 'end';
						canvas.textBaseline = 'middle';
						canvas.font = "8pt Arial";
						break;
					case "light-grey-line":
						canvas.fillStyle = 'rgba(155, 170, 195, .8)';
						canvas.strokeStyle = 'rgba(155, 170, 195, .8)';
						break;
					case "large-left-font":
						canvas.textAlign = 'start';
						canvas.textBaseline = 'alphabetic';
						canvas.font = 'small-caps 10pt Georgia';
						break;
					case "medium-grey-line":
						canvas.fillStyle = 'rgba(135, 150, 170, .8)'
						canvas.strokeStyle = 'rgba(135, 150, 170, .8)'
						break;
					case "dark-grey-line":
						canvas.fillStyle = 'rgba(90, 90, 110, 1)'
						canvas.strokeStyle = 'rgba(90, 90, 110, 1)'
						break;
					case "black-line":
						canvas.fillStyle = 'rgb(0, 0, 0)';
						canvas.strokeStyle = 'rgb(0, 0, 0)';
						break;
					case "dotted-line":
						canvas.setLineDash([2,5]);
						break;
					case "small-line":
						canvas.lineWidth = 1;
						break;
				};
			};
		}
		
		function draw_metric_axis(){
		// draws measurements on the X axis of the grid given the number of lines and how far apart they are set to be.
			var lines = get_num_lines(digit_spacing);
			var total_lines = lines[0] + lines[1];
			var point =  freeze_point + ( lines[0] * digit_spacing );
			var temp = 0 - (lines[0] * deg_incrament);
			
			if (is_imperial) {
				var deg = 'f';
			} else {
				var deg = 'c';
			};
					
			canvas.save();
			get_canvas_style("black-line", "small-right-font");
			
			for ( var i = 0; i < total_lines; i++ ) {
				var x_val = axis_buffer - axis_padding
				canvas.fillText(temp + deg, x_val, point);
				temp += deg_incrament ;
				point -= digit_spacing;
			};
			
			canvas.restore();
		}

		function draw_grid() {
		// gets the number of lines to draw on the gird, then draws them.
		
			var lines = get_num_lines(line_spacing);
			var total_lines = lines[0] + lines[1];
			var line_point = freeze_point + ( lines[0] * line_spacing );

			canvas.save();
			get_canvas_style("small-line", "light-grey-line");

			for ( var i = 0; i <= total_lines; i++ ) {
				canvas.moveTo(axis_buffer, line_point);
				canvas.lineTo(canvas_width, line_point);
				line_point -= line_spacing;
			};
			
			canvas.stroke();
			canvas.restore();
		}
		
		function round_to_tens(number) {
			number *= .1;
			number = Math.round(number);
			number *= 10;
			return number;
		}
		
		function format_date(date) {
		// returns the three-character month code given the month number.
		
			var D = date.getDate()
			var month = date.getMonth()
			var M = ''
			
			switch (month){
				case 0:
					M = 'Jan';
					break;
				case 1:
					M = 'Feb';
					break;
				case 2:
					M = 'Mar';
					break;
				case 3:
					M = 'Apr';
					break;
				case 4:
					M = 'May';
					break;
				case 5:
					M = 'Jun';
					break;
				case 6:
					M = 'Jul';
					break;
				case 7:
					M = 'Aug';
					break;
				case 8:
					M = 'Sep';
					break;
				case 9:
					M = 'Oct';
					break;
				case 10:
					M = 'Nov';
					break;
				case 11:
					M = 'Dec';
					break;
				default:
					M = 'Febtober';
			}

			var date_string = M + "-" + D;
			return date_string;
		}
}
}
