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

$(document).ready(()=>{
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
                if (markers[data.guid] == undefined)
                {
                    markers[data.guid] = {
                        coord: data.corod,
                        value: data.value,
                        dom: L.marker(data.coord, {icon: redMarker})
                    }
                    markers[data.guid].dom.addTo(map);
                    markers[data.guid].dom.bindPopup(data.value.toString());
                    markers[data.guid].dom.on('click',(pew)=>{
                        console.log(pew);
                    });
                }
                else
                {
                    if (data.value < 0)
                    {
                        markers[data.guid].dom.setIcon(disabledMarker);
                        console.log("pew");
                    }
                    else
                    {
                        markers[data.guid].value = data.value;
                        if (data.value < 33)
                        {
                            markers[data.guid].dom.setIcon(greenMarker);
                            markers[data.guid].dom._popup.setContent(data.value.toString());
                        }
                        else if (data.value < 66)
                        {
                            markers[data.guid].dom.setIcon(yellowMarker);
                            markers[data.guid].dom._popup.setContent(data.value.toString());
                        }
                        else
                        {
                            markers[data.guid].dom.setIcon(redMarker);
                            markers[data.guid].dom._popup.setContent(data.value.toString());
                        }
                    }
                }
            });
        });
    }, 1000);
   
    var testMarker = L.marker([45.787444, 24.143985], {icon: redMarker});
    testMarker.addTo(map);
    testMarker.bindPopup("pew");
    testMarker.on('click',(pew)=>{
        console.log(pew);
    });

    $('#test').on('click',()=>{
        console.log(getMethods(testMarker));
        testMarker.setIcon(greenMarker);
        testMarker._popup.setContent('something else');
    });
});