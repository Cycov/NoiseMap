function getMethods(obj)
{
    var res = [];
    for(var m in obj) {
        if(typeof obj[m] == "function") {
            res.push(m)
        }
    }
    return res;
}

let loadChart = (data) => {
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
	var data = new google.visualization.DataTable();
	// TODO: ADD DATA HERE!!!!!!!!!!!!
	data.addColumn('string', 'Hour');
	data.addColumn('number', 'Sound Level');

	let sensor_data = {
		sensor1: {
			guid: 'b03a7679-49cc-4339-b157-a026ab1e3f4e',
			values: [30,30,25,35,25,35,40,45,50,45,40,60,45,40,35,55,65,50,35,35,25,30,35,30]
		},
		sensor2: {
			guid:  '881fddd7-0fe7-4fc8-9d2d-d2cbbef08fec',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor3: {
			guid:  '5f5e460a-3f0d-495f-9069-643f6ed35570',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor4: {
			guid: 'e47a0cd5-f2fb-4ce2-8c0d-3723e80afbe2',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor5: {
			guid: '7fa8440c-3621-4ffb-9e50-d41c9396afb8',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor6: {
			guid: '5fac838e-51c5-4d13-b016-668f85a4f6a7',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor7: {
			guid: '090a8838-d573-43c3-8432-7c01834c7425',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor8: {
			guid: '152a953b-4afc-4cf0-957c-7433459cd543',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor9: {
			guid: '4d58a3a8-dbf3-46d5-8c37-f38fc8deaa89',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor10: {
			guid:  '6a581e8c-acf5-4a56-9804-9ed414616e3d',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		senso11: {
			guid: 'a56bcbad-4831-40f2-8e32-4d513a3379e3',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor12: {
			guid: '5ab8b5b0-1cfa-414c-aa30-59fdc14b5e49',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor13: {
			guid: '0c389d43-b99e-49ae-8484-dca04cca4d83',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor14: {
			guid: '64e709fc-bb21-4770-9684-43ff754bec4b',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor15: {
			guid: 'b1f97466-a09c-4ad1-908a-55b8788448e8',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor16: {
			guid: 'e99cb13a-40f6-4404-833e-1388102a5b67',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor17: {
			guid:  '3425bc97-08d6-449c-b702-6af42cb04102',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor18: {
			guid: '2dea74f7-3067-4a6e-b2fd-96e2cbf3271b',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor19: {
			guid: '71e319a8-4d70-41a9-81a7-461d5008a734',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		},
		sensor20: {
			guid: 'cb45b50a-f50f-4327-be21-19a74bcb4b64',
			values: [25,25,30,25,30,30,35,50,45,35,45,55,50,45,35,50,55,55,30,35,30,25,25,25]
		}
	};
	let this_sensor = {};
	console.log(data.guid);
	data.addRows([
	  ['00', sensor_data.sensor1.values[0]],
	  ['01', sensor_data.sensor1.values[1]],
	  ['02', sensor_data.sensor1.values[2]],
	  ['03', sensor_data.sensor1.values[3]],
	  ['04', sensor_data.sensor1.values[4]],
	  ['05', sensor_data.sensor1.values[5]],
	  ['06', sensor_data.sensor1.values[6]],
	  ['07', sensor_data.sensor1.values[7]],
	  ['08', sensor_data.sensor1.values[8]],
	  ['09', sensor_data.sensor1.values[9]],
	  ['10', sensor_data.sensor1.values[10]],
	  ['11', sensor_data.sensor1.values[11]],
	  ['12', sensor_data.sensor1.values[12]],
	  ['13', sensor_data.sensor1.values[13]],
	  ['14', sensor_data.sensor1.values[14]],
	  ['15', sensor_data.sensor1.values[15]],
	  ['16', sensor_data.sensor1.values[16]],
	  ['17', sensor_data.sensor1.values[17]],
	  ['18', sensor_data.sensor1.values[18]],
	  ['19', sensor_data.sensor1.values[19]],
	  ['20', sensor_data.sensor1.values[20]],
	  ['21', sensor_data.sensor1.values[21]],
	  ['22', sensor_data.sensor1.values[22]],
	  ['23',sensor_data.sensor1.values[23]]
	]);
	var options = {
		title: 'Sounds levels for node ' + sensor_data.sensor1.guid,
	    'width':500,
	    'height':200,
	    chartArea:{
		    left:5,
		    top: 20,
		    width: '100%',
		    height: 150,
		}
	};
	var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
	chart.draw(data, options);
	}
};

$(() => {
    var map = L.map('map').setView([45.787444, 24.143985], 13);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	var DefaultMarker = L.Icon.extend({
		options: {
			//shadowUrl: 'logo.png',
			iconSize:     [64, 64],
			shadowSize:   [50, 64],
			iconAnchor:   [28.5, 51.5],
			shadowAnchor: [4, 62],
			popupAnchor:  [0, -45]
		}
	});

    var markers = {};

	var redMarker = new DefaultMarker({iconUrl: 'images/marker-red-shadow.png'});
	var yellowMarker = new DefaultMarker({iconUrl: 'images/marker-yellow-shadow.png'});
	var greenMarker = new DefaultMarker({iconUrl: 'images/marker-green-shadow.png'});
	var disabledMarker = new DefaultMarker({iconUrl: 'images/marker-disabled.png'});

    window.setInterval(function(){
        $.ajax({
            method: "POST",
            url: "/",
            data: {type: "getValues"}
        }).done(function(result)
        {
            //{
            //  hour: 4,
            //  sensors: [{
            //      guid: "",
            //      coord: [45.787444, 24.143985],
            //      value: 62
            //  }]
            //}
            $('#time').html(result.hour);
            result.sensors.forEach(data => {                    
                if (markers[data.guid] == undefined) {
                    markers[data.guid] = {
                        coord: data.corod,
                        value: data.value,
                        dom: L.marker(data.coord, {icon: disabledMarker})
                    }
                    markers[data.guid].dom.addTo(map);
                    markers[data.guid].dom.bindPopup(`<div id="chart_div" guid="${data.guid}"></div>`);
                    markers[data.guid].dom.on('click',(pew)=>{
                        console.log(pew);
                        loadChart(data);
                    });
                } else {
                    if (data.value < 0) {
                        markers[data.guid].dom.setIcon(disabledMarker);
                        console.log("pew");
                    } else {
                        markers[data.guid].value = data.value;
                        if (data.value < 40) {
                            markers[data.guid].dom.setIcon(greenMarker);
                            
                        } else if (data.value < 66) {
                            markers[data.guid].dom.setIcon(yellowMarker);
                        } else {
                            markers[data.guid].dom.setIcon(redMarker);
                        }
                        //markers[data.guid].dom._popup.setContent(data.value.toString());
                    }
                }
            });
        });
    }, 1000);
   
    /*var testMarker = L.marker([45.787444, 24.143985], {icon: redMarker});
    testMarker.addTo(map);
    testMarker.bindPopup("pew", {
    	maxWidth: 500,
    	minWidth: 499
    });
    testMarker.on('click',(pew)=>{
        console.log(pew.originalEvent.explicitOriginalTarget.getAttribute('guid'));
        $('.ui.modal').modal('show');
        loadChart();
        console.log('Rendered, show');
    });

    $('#test').on('click',()=>{
        console.log(getMethods(testMarker.getElement()));
        testMarker.getElement().setAttribute("guid","hhhhhh-hhhhhhh-fffff-ffdddd");
        testMarker.setIcon(greenMarker);
        // testMarker._popup.setContent('something else');

        testMarker._popup.setContent('<div id="chart_div"></div>');

    }); */
});