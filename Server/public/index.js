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
			iconAnchor:   [32, 64],
			shadowAnchor: [4, 62],
			popupAnchor:  [-3, -76]
		}
	});

    var markers = {};

	var redMarker = new DefaultMarker({iconUrl: 'images/marker-red-shadow.png'});
	var yellowMarker = new DefaultMarker({iconUrl: 'images/marker-yellow-shadow.png'});
	var greenMarker = new DefaultMarker({iconUrl: 'images/marker-green-shadow.png'});
	var disabledMarker = new DefaultMarker({iconUrl: 'images/marker-disabled.png'});

    window.setInterval(function(){
        jQuery.post('/',"getValues",(data)=>{
            //{
            //  guid: "",
            //  coord: [45.787444, 24.143985],
            //  value: 62
            //}
            if (markers[data.guid] == undefined)
            {
                markers[data.guid] = {
                    coord: data.corod,
                    value: data.value,
                    dom: L.marker([45.787444, 24.143985], {icon: redMarker})
                }
                markers[data.guid].dom.addTo(map);
                markers[data.guid].dom.bindPopup(data.value);
            }
            else
            {
                if (data.value < 0)
                    markers[data.guid].dom.setIcon(disabledMarker);
                    
                markers[data.guid].value = data.value;
                if (data.value < 33)
                {
                    markers[data.guid].dom.setIcon(greenMarker);
                }
                else if (data.value < 66)
                {
                    markers[data.guid].dom.setIcon(yellowMarker);
                }
                else
                {
                    markers[data.guid].dom.setIcon(redMarker);
                }
            }
        },"json");
    }, 1000);
   
    var testMarker = L.marker([45.787444, 24.143985], {icon: redMarker});
    testMarker.addTo(map);
    testMarker.bindPopup("pew");

    $('#test').on('click',()=>{
        console.log(getMethods(markers[0]));
        markers[0].setIcon(greenMarker);
    });
});