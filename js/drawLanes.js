var markersById = {};

function drawLanes(feature) {

			var laneInfo = generateCrossSectionTable(feature)
			var offsetArray = laneInfo['offsetArray']
			var laneNames = laneInfo['laneNames']

			if (typeof feature !== 'undefined' && feature.geometry.type == 'LineString') {
			for (i = 0; i < offsetArray.length; i++) {

				// ADD LANE LINES
				L.geoJson(getLineOffset(feature, (((offsetArray.at(-1)/2)-offsetArray[i])*12), {units: 'inches'}), {
					style: function(feature){
						if (i==0 ) {
							return {color:'red', interactive: false}
						} else if (i == offsetArray.length-1) {
							return {color:'blue', interactive: false}
						} else {
							return {color:'#DDD', interactive: false}
						}
					},


			}).addTo(lanesLayer)


		}

		var centerline = L.geoJson(feature, {
			style: function(feature){
				return {color:'black', opacity: 0, 'lineCap': 'butt', weight: 20, interactive: true, "dashArray": ''}
			},
			onEachFeature: onEachFeature

	}).addTo(lanesLayer)

		map.fitBounds(lanesLayer.getBounds());
	}


}

function zoomToTableRow(feature) {
	var element_to_scroll_to = document.getElementById('tr'+feature.properties.id).scrollIntoView();
	console.log('scroll to '+'#tr'+feature.properties.id)
	// document.getElementById('tr'+feature.properties.id).classList.add('flashMe');
	$('#tr'+feature.properties.id+'>td').animate({backgroundColor: 'yellow'}, 1000).animate({backgroundColor: 'white'}, 2000);
}

function onEachFeature(feature, layer) {
		layer.on({
        click: function (){
					var element_to_scroll_to = document.getElementById('tr'+feature.properties.id).scrollIntoView();
					// console.log('scroll to '+'#tr'+feature.properties.id)
					// document.getElementById('tr'+feature.properties.id).classList.add('flashMe');
					$('#tr'+feature.properties.id+'>td').animate({backgroundColor: 'yellow'}, 1000).animate({backgroundColor: 'white'}, 2000);
				},
				mouseover: function (){
					var element_to_scroll_to = document.getElementById('tr'+feature.properties.id).scrollIntoView();
					// console.log('scroll to '+'#tr'+feature.properties.id)
					// document.getElementById('tr'+feature.properties.id).classList.add('flashMe');
					$('#tr'+feature.properties.id+'>td').animate({backgroundColor: 'yellow'}, 1000).animate({backgroundColor: 'white'}, 2000);
				}
    });

		$( '#zoomTo'+feature.properties.id ).on( "click", function() {
			// console.log(feature, layer)
		  map.fitBounds(layer.getBounds());
			// feature.animate({ opacity: 0 }, 500, function() {
       // Animation complete.
  // });
		} );

		calcStreetStats(feature)
}
