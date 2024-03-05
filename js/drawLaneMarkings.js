
// var sharrowHeight = 25;




function drawLaneMarkingsFromFeature(feature, extraShift = 0) {
  // console.log(extraShift)
  var zoomlevel = map.getZoom();
  var sharrowHeight = 0
	if (zoomlevel >= 19) {
		// var sharrowHeight = 25;
		if (zoomlevel == 20) {
			sharrowHeight = 15;
		} else if (zoomlevel == 21) {
			sharrowHeight = 25
		} else if (zoomlevel == 19) {
			sharrowHeight = 9
		} else if (zoomlevel == 22) {
			sharrowHeight = 35
		}
	}
  // console.log(zoomlevel, sharrowHeight)

  var iconBikeLane = new L.Icon({
  	iconUrl: 'img/bikelane-green.png',
  	iconSize: [sharrowHeight, sharrowHeight * 2],
  	iconAnchor: [sharrowHeight / 2, sharrowHeight]
  });

  var sharrow = new L.Icon({
  	iconUrl: 'img/sharrow-green.png',
  	iconSize: [sharrowHeight, sharrowHeight * 2],
  	iconAnchor: [sharrowHeight / 2, sharrowHeight]
  });

  var twlt = new L.Icon({
  	iconUrl: 'img/twlt.png',
  	iconSize: [sharrowHeight, sharrowHeight * 3],
  	iconAnchor: [sharrowHeight / 2, sharrowHeight]
  });

  var parking = new L.Icon({
    iconUrl: 'img/parking.png',
    iconSize: [sharrowHeight, sharrowHeight * 2],
    iconAnchor: [sharrowHeight / 2, sharrowHeight]
  });

  var onlybus = new L.Icon({
    iconUrl: 'img/onlybus-red.png',
    iconSize: [sharrowHeight * 1.5, sharrowHeight * 2 * 1.5],
    iconAnchor: [sharrowHeight / 2 * 1.5, sharrowHeight * 1.5]
  });

  var onlybusbike = new L.Icon({
    iconUrl: 'img/onlybusbike-red.png',
    iconSize: [sharrowHeight * 1.5, sharrowHeight * 4.5 * 1.5],
    iconAnchor: [sharrowHeight / 2 * 1.5, sharrowHeight * 1.5]
  });

  var cycletrack = new L.Icon({
    iconUrl: 'img/cycletrack-green.png',
    iconSize: [sharrowHeight * 1.5, sharrowHeight * 2 * 1.5],
    iconAnchor: [sharrowHeight / 2 * 1.5, sharrowHeight * 1.5]
  });


  var laneInfo = generateCrossSectionTable(feature)
  var offsetArray = laneInfo['offsetArray']
  var laneNames = laneInfo['laneNames']
  // ADD LANE LABELS
  if (typeof feature !== 'undefined' && feature.geometry.type == 'LineString') {
    for (i = 0; i < offsetArray.length-1; i++) {
      // 1. generate a marking line
      // for now let's just use the normal lane line
      markingLine = getLineOffset(feature, (((offsetArray.at(-1)/2)-offsetArray[i]-((offsetArray[i+1]-offsetArray[i])/2)+extraShift)*12), {units: 'inches'})
      // 2. select the proper roadway marking
      // for now let's just make everything a sharrow lane
      // console.log(laneNames[i])
      img = null
      if (laneNames[i][0] == 'Mixed lane') {
        img = sharrow
      } else if (laneNames[i][0] == 'Parking lane' || laneNames[i][0] == 'Travel lane w/parking') {
        img = parking
      } else if (laneNames[i][0] == 'Bike lane') {
        img = iconBikeLane
      } else if (laneNames[i][0] == 'Bus lane') {
        img = onlybus
      } else if (laneNames[i][0] == 'Mixed bus lane') {
        img = onlybusbike
      } else if (laneNames[i][0] == 'Turn lane') {
        img = twlt
      } else if (laneNames[i][0] == 'Cycle track') {
        img = cycletrack
      }

      // 3. determine rotation, if any
      if (laneNames[i][1] == -1 && img != parking) {
        modRotation = 180
      } else {
        modRotation = 0
      }

      // 4. call addLaneMarkings() func
      // console.log(img)
      if (img != null)
      {addLaneMarkings(markingLine, img, modRotation, '')}
      // console.log(laneNames)
    }
  }
}




function addLaneMarkings(markingLine, img, modRotation = 0, pane) {
  // console.log('adding')
  var alongDist = 0.005;
  //markingLine = cleanLineArray(markingLine)
  length = turf.length(markingLine, {
    units: 'miles'
  })
  //if (length > 0.1) {
  if (alongDist > length - 0.007) {
    var along1 = turf.along(markingLine, length/2, {
      units: 'miles'
    });
    var bearingSt = turf.along(markingLine, 0, {
      units: 'miles'
    });
    var bearingEnd = turf.along(markingLine, alongDist, {
      units: 'miles'
    });
    var bearing = turf.bearing(bearingSt, bearingEnd)

    // if (typeof lane.reverse !== 'undefined') {
    //   if (lane.reverse === true) {
    //     if (bearing < 180) {
    //       bearing += 180
    //     }
    //   }
    // }
    bearing += modRotation

    laneMarkings.addLayer(L.marker([along1.geometry.coordinates[1], along1.geometry.coordinates[0]], {
      icon: img,
      rotationAngle: bearing,
      // pane: pane
    }))
  }
  while (alongDist < length - 0.007) {
    var along1 = turf.along(markingLine, alongDist, {
      units: 'miles'
    });
    var bearingSt = turf.along(markingLine, alongDist - 0.005, {
      units: 'miles'
    });
    var bearingEnd = turf.along(markingLine, alongDist, {
      units: 'miles'
    });
    var bearing = turf.bearing(bearingSt, bearingEnd)

    // if (typeof lane.reverse !== 'undefined') {
    //   if (lane.reverse === true) {
    //     if (bearing < 180) {
    //       bearing += 180
    //     }
    //   }
    // }
    bearing += modRotation

    laneMarkings.addLayer(L.marker([along1.geometry.coordinates[1], along1.geometry.coordinates[0]], {
      icon: img,
      rotationAngle: bearing,
      // pane: pane
    }))
    alongDist += 0.03;
  }
  //}
}


// var iconBikeLane = new L.Icon({
//   iconUrl: 'img/bikelane.png',
//   iconSize: [sharrowHeight, sharrowHeight * 2],
//   iconAnchor: [sharrowHeight / 2, sharrowHeight]
// });
//
// var sharrow = new L.Icon({
//   iconUrl: 'img/sharrow-green.png',
//   iconSize: [sharrowHeight, sharrowHeight * 2],
//   iconAnchor: [sharrowHeight / 2, sharrowHeight]
// });
//
// var twlt = new L.Icon({
//   iconUrl: 'img/twlt.png',
//   iconSize: [sharrowHeight, sharrowHeight * 3],
//   iconAnchor: [sharrowHeight / 2, sharrowHeight]
// });
//
// var parking = new L.Icon({
//   iconUrl: 'img/parking.png',
//   iconSize: [sharrowHeight, sharrowHeight * 2],
//   iconAnchor: [sharrowHeight / 2, sharrowHeight]
// });
//
// var onlybus = new L.Icon({
//   iconUrl: 'img/onlybus.png',
//   iconSize: [sharrowHeight * 1.5, sharrowHeight * 2 * 1.5],
//   iconAnchor: [sharrowHeight / 2 * 1.5, sharrowHeight * 1.5]
// });
