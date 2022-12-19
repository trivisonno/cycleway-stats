function getRandom(array) {
  return (array[Math.floor(Math.random()*array.length)])
}

multiplier = 1
pixelsPerInch = 6 * multiplier

function generateCrossSectionTable(feature) {
	// feature = {'properties': {'tags': {'lanes': 2, 'oneway': 'no', 'cycleway:both': 'lane', 'parking:lane:right': 'parallel'}}}


    pixelsPerInch = 6 * multiplier //


  	width = 11 * pixelsPerInch // 11 feet
  	widthBike = 6 * pixelsPerInch // 6 feet
  	widthParking = 9 * pixelsPerInch // // 9 feet
    widthSeparationBuffer = 2 * pixelsPerInch // 2 feet, if multiplier=1

  	totalStreetWidth = 0



    var html =''
  	var tags = feature.properties.tags
  	var lanes


        // width override based on OSM json tags
        if (Object.keys(tags).includes('lanes:width') == true) {
          if (tags['lanes:width'].toString().includes("'")) { // if imperial/feet measure
            width = Number(tags['lanes:width'].replace("'",'')) * pixelsPerInch
          } else { // if metric/meters measure
            width = tags['lanes:width'] / 0.3048 * pixelsPerInch
          }
        }

        // width override based on OSM json tags
        if (Object.keys(tags).includes('cycleway:lane:width') == true) {
          if (tags['cycleway:lane:width'].toString().includes("'")) { // if imperial/feet measure
            widthBike = Number(tags['cycleway:lane:width'].replace("'",'')) * pixelsPerInch
          } else { // if metric/meters measure
            widthBike = tags['cycleway:lane:width'] / 0.3048 * pixelsPerInch
          }
        }

        // width override based on OSM json tags
        if (Object.keys(tags).includes('parking:lane:both:width') == true) {
          if (tags['parking:lane:both:width'].toString().includes("'")) { // if imperial/feet measure
            widthParking = Number(tags['parking:lane:both:width'].replace("'",'')) * pixelsPerInch
          } else { // if metric/meters measure
            widthParking = tags['parking:lane:both:width'] / 0.3048 * pixelsPerInch
          }
        }

        // width override based on OSM json tags
        if (Object.keys(tags).includes('cycleway:right:separation:left:width') == true) {
          if (tags['cycleway:right:separation:left:width'].toString().includes("'")) { // if imperial/feet measure
            cycleway_right_separation_left_width = Number(tags['cycleway:right:separation:left:width'].replace("'",'')) * pixelsPerInch
          } else { // if metric/meters measure
            cycleway_right_separation_left_width = tags['cycleway:right:separation:left:width'] / 0.3048 * pixelsPerInch
          }

        } else {
          cycleway_right_separation_left_width = widthSeparationBuffer
        }





    // need to convert "cycleway:separation"="parking_lane" to "cycleway:right:traffic_mode:<side>"="parking"
      if (tags['cycleway:separation']=="parking_lane") {
        if (tags['oneway'] == 'yes') {
          tags['cycleway:right:traffic_mode:left'] = "parking"
        } else {
          tags['cycleway:right:traffic_mode:left'] = "parking"
          tags['cycleway:left:traffic_mode:left'] = "parking"
        }

        delete tags['cycleway:separation']
        console.log(tags)
      }

      if (tags['cycleway:left:separation:left']=="parking_lane") {
        tags['cycleway:left:traffic_mode:left'] = "parking"
        delete tags['cycleway:left:separation:left']
        console.log(tags)
      }

      if (tags['cycleway:right:separation:left']=="parking_lane") {
        tags['cycleway:left:traffic_mode:left'] = "parking"
        delete tags['cycleway:left:separation:left']
        console.log(tags)
      }


    // console.log(widthBike)

    vehicleRowHeight = 0.7 * pixelsPerInch * 10
  	markingRowHeight = 0.33 * pixelsPerInch * 10

    // vehicleRowHeight = 60
  	// markingRowHeight = 30


	var tdNum = 0
	var tdArray = [ [], [] ]
	// var lanesForward = []
	// var lanesBackward = []
	var middleLane = false
	var bikeForward = 0
	var bikeBackward = 0
	var forwardCarImg = 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/vehicles/car-outbound.svg'
	var forwardSharrowImg = 'https://github.com/streetmix/illustrations/blob/main/images/markings/sharrow-outbound.svg'
	var backwardCarImg = 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/vehicles/car-inbound.svg'
	var backwardSharrowImg = 'https://github.com/streetmix/illustrations/blob/main/images/markings/sharrow-inbound.svg'
  var inboundBusImg = 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/transit/bus-inbound.svg'
  var outboundBusImg = 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/transit/bus-outbound.svg'
  var ParkingSignImg = 'img/parking-sign.png'

  var bikeLanePeopleInbound = ['https://raw.githubusercontent.com/streetmix/illustrations/main/images/bikes/biker-01-inbound.svg', 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/bikes/biker-02-inbound.svg','https://raw.githubusercontent.com/streetmix/illustrations/main/images/scooters/scooter-inbound.svg']

  var bikeLanePeopleOutbound = ['https://raw.githubusercontent.com/streetmix/illustrations/main/images/bikes/biker-01-outbound.svg', 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/bikes/biker-02-outbound.svg','https://raw.githubusercontent.com/streetmix/illustrations/main/images/scooters/scooter-outbound.svg']

  itemNames = {
    'flex_post' :
      {'desc': 'Flex post', 'url': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/dividers/bike-lane-divider.svg', 'markingUrl': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/stripes-diagonal.svg'},
    'barred_area' :
      {'desc': 'Buffer', 'url': '', 'markingUrl': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/stripes-diagonal.svg'},
    'jersey_barrier' :
      {'desc': 'Barrier', 'url': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/construction/jersey-barrier-concrete.svg', 'markingUrl': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/stripes-diagonal.svg'},
    'bollard' :
      {'desc': 'Bollard', 'url': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/dividers/bollard.svg', 'markingUrl': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/stripes-diagonal.svg'},
    'bump' :
      {'desc': 'Dome', 'url': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/dividers/dome.svg', 'markingUrl': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/stripes-diagonal.svg'},
    'planter' :
      {'desc': 'Planter', 'url': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/dividers/planter-box.svg', 'markingUrl': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/stripes-diagonal.svg'},
    'kerb' :
       {'desc': 'Kerb', 'url': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/utilities/drainage-channel-piece-center.svg', 'markingUrl': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/stripes-diagonal.svg'},
    'cone' :
       {'desc': 'Cones', 'url': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/construction/cone.svg', 'markingUrl': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/stripes-diagonal.svg'}
     }

  turnMarkings = {
    'inbound' : {
      'through': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-inbound.svg',
      'left;through': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/right-straight-inbound.svg',
      'through;left': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/right-straight-inbound.svg',
      'through;right': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/left-straight-inbound.svg',
      'right;through': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/left-straight-inbound.svg',
      'right': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/left-inbound.svg',
      'left': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/right-inbound.svg',
    },
    'outbound' : {
      'through': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-outbound.svg',
      'left;through': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/left-straight-outbound.svg',
      'through;left': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/left-straight-outbound.svg',
      'through;right': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/right-straight-outbound.svg',
      'right;through': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/right-straight-outbound.svg',
      'right': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/right-outbound.svg',
      'left': 'https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/left-outbound.svg',
    }


  }

  if (Object.keys(tags).includes('motor_vehicle') && tags['motor_vehicle'] == 'no') {
    forwardCarImg = ''
    backwardCarImg = ''
  }

  if (Object.keys(tags).includes('oneway') && tags['oneway'] == 'yes') {
    lanes = 1
  } else {
    lanes = 2
  }

  if (Object.keys(tags).includes('lanes')) {
		lanes = tags['lanes']
	}

	tdNum += lanes





	if (lanes % 2 == 1) {
		// odd number of lanes
		if (Object.keys(tags).includes('lanes:forward') && Object.keys(tags).includes('lanes:backward')==false) {
			if (Object.keys(tags).includes('oneway') && tags['oneway'] == 'yes') {
				lanesForward = tags['lanes:forward']
			} else {
				lanesForward = tags['lanes:forward']
        lanesBackward = lanes - lanesForward
			}
		} else if (Object.keys(tags).includes('lanes:backward') && Object.keys(tags).includes('lanes:forward')==false) {
			if (Object.keys(tags).includes('oneway') && tags['oneway'] == 'yes') {
				lanesForward = lanes
			} else {
				lanesBackward = tags['lanes:backward']
  				lanesForward = lanes - lanesBackward
			}
		} else if (Object.keys(tags).includes('lanes:backward') && Object.keys(tags).includes('lanes:forward')) {
      lanesForward = tags['lanes:forward']
      lanesBackward = tags['lanes:backward']
      if (lanes - lanesBackward - lanesForward == 1) {
        middleLane = true
      }
    } else {


			if (Object.keys(tags).includes('oneway') && tags['oneway'] == 'yes') { // IF ONE-WAY
				lanesForward = lanes
				lanesBackward = 0
			} else { // IF TWO-WAY
				lanesForward = (lanes-1) / 2
				lanesBackward = (lanes-1) / 2
				if (lanes > 2) {
					middleLane = true
				}
				if (lanes == 1) {
					lanesForward = 1
				}
			}
		}

		if (Object.keys(tags).includes('lanes:both_ways')) {
			middleLane = true
		}


	} else {
		// even number of lanes
    if (Object.keys(tags).includes('lanes:forward') && Object.keys(tags).includes('lanes:backward')==false) {
			if (Object.keys(tags).includes('oneway') && tags['oneway'] == 'yes') {
				lanesForward = tags['lanes:forward']
			} else {
				lanesForward = tags['lanes:forward']
        lanesBackward = lanes - lanesForward
			}
		} else if (Object.keys(tags).includes('lanes:backward') && Object.keys(tags).includes('lanes:forward')==false) {
			if (Object.keys(tags).includes('oneway') && tags['oneway'] == 'yes') {
				lanesForward = lanes
			} else {
				lanesBackward = tags['lanes:backward']
  				lanesForward = lanes - lanesBackward
			}
		} else if (Object.keys(tags).includes('lanes:backward') && Object.keys(tags).includes('lanes:forward')) {
      lanesForward = tags['lanes:forward']
      lanesBackward = tags['lanes:backward']
      if (lanes - lanesBackward - lanesForward == 1) {
        middleLane = true
      }
    } else {
			if (Object.keys(tags).includes('oneway') && tags['oneway'] == 'yes') {
				lanesForward = lanes
				lanesBackward = 0
			} else {
				lanesForward = (lanes) / 2
				lanesBackward = (lanes) / 2
			}
		}
	}

  turnLanesForward = []
  if (Object.keys(tags).includes('turn:lanes:forward') == true) {
    turnLanesForward = tags['turn:lanes:forward'].split("|").reverse()
    for (i=0; i<turnLanesForward.length; i++) {
      if (turnLanesForward[i] == '') {
        turnLanesForward[i] = 'through'
      }
      // turnLanesForward[i] = 'through'
    }
  } else {
    for (i=0; i<lanesForward; i++) {
      turnLanesForward[i] = 'through'
    }

  }


  turnLanesBackward = []
  if (Object.keys(tags).includes('turn:lanes:backward') == true) {
    turnLanesBackward = tags['turn:lanes:backward'].split("|")
    for (i=0; i<turnLanesBackward.length; i++) {
      if (turnLanesBackward[i] == '') {
        turnLanesBackward[i] = 'through'
      }
      // turnLanesForward[i] = 'through'
    }
  } else {
    for (i=0; i<lanesBackward; i++) {
      turnLanesBackward[i] = 'through'
    }

  }




	// console.log(tags, lanesForward, lanesBackward)

	if (Object.keys(tags).includes('cycleway') || Object.keys(tags).includes('cycleway:both') || Object.keys(tags).includes('cycleway:left') || Object.keys(tags).includes('cycleway:right')) {
		if ( tags['cycleway'] == 'lane') {
			tdNum += 2
		}


	}

	// for (i=0; i<tdNum; i++) {
	// 	html += "<td class='picto'>lane</td>"
	// }
	//
	// html += "</tr><tr>"
	//
	// for (i=0; i<tdNum; i++) {
	// 	html += "<td>10'</td>"
	// }
	//
	// html += "</tr></table>"
	//html += 'total: '+lanes+', '+lanesForward + ', ' + lanesBackward + "<br>"


  if (Object.keys(tags).includes('cycleway:right:traffic_mode:left') == false && tags['cycleway:right:traffic_mode:left'] !== 'parking') {
	if (tags['parking:lane:both']=='parallel' || tags['parking:lane:right']=='parallel') {
    if (Object.keys(tags).includes('parking:lane:right:parallel') == true && tags['parking:lane:right:parallel'] == 'street_side') {
      html += "<td style='width: "+widthParking+"px; height: "+vehicleRowHeight+"px; background-size: auto 100% !important;background:url("+ParkingSignImg+") no-repeat bottom left, url("+backwardCarImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
    }

	}
}

  if (Object.keys(tags).includes('cycleway:separation') == true || Object.keys(tags).includes('cycleway:right:separation:right') == true) {
    console.log(tags['cycleway:left:separation:left'], feature)
    html += "<td style='width: "+widthSeparationBuffer+"px; height: "+vehicleRowHeight+"px; background: url("+itemNames[tags['cycleway:right:separation:right']]['url']+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
  }

  if (Object.keys(tags).includes('cycleway:lanes:forward') == false || tags['cycleway:lanes:forward'].split("|").reverse()[0] != 'no') {
  	if ((tags['cycleway']=='lane' || tags['cycleway:both']=='lane' || tags['cycleway:right']=='lane' || (tags['oneway']=='yes' && tags['cycleway:right']=='lane'))) {
  		html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background: url("+bikeLanePeopleInbound[(Math.floor(Math.random() * 3))]+") no-repeat top center;background-color:#a9ccdb;'></td>"
  	}
  }

  if ((tags['cycleway']=='track' || tags['cycleway:right']=='track') && (tags['oneway:bicycle']=='no' || tags['cycleway:right:oneway']=='no')) {
		html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background: url("+bikeLanePeopleInbound[(Math.floor(Math.random() * 3))]+") no-repeat top center;background-color:#a9ccdb;'></td><td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background: url("+bikeLanePeopleOutbound[(Math.floor(Math.random() * 3))]+") no-repeat top center;background-color:#a9ccdb;'></td>"
	} else if ((tags['cycleway']=='track' || tags['cycleway:right']=='track')) {
    html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background: url("+bikeLanePeopleInbound[(Math.floor(Math.random() * 3))]+") no-repeat top center;background-color:#a9ccdb;'></td>"
  }

  if (Object.keys(tags).includes('cycleway:separation') == true || Object.keys(tags).includes('cycleway:right:separation:left') == true) {
    html += "<td style='width: "+cycleway_right_separation_left_width+"px; height: "+vehicleRowHeight+"px; background: url("+itemNames[tags['cycleway:right:separation:left']]['url']+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
  }

  if (Object.keys(tags).includes('cycleway:right:traffic_mode:left') == true && tags['cycleway:right:traffic_mode:left'] == 'parking') {
	if (tags['parking:lane:both']=='parallel' || tags['parking:lane:right']=='parallel') {
		html += "<td style='width: "+widthParking+"px; height: "+vehicleRowHeight+"px; background-size: auto 100% !important;background: url("+ParkingSignImg+") no-repeat bottom left,url("+backwardCarImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
	}
}
// console.log(tags['cycleway:lanes:forward'])

// numMovingLanes = tags['cycleway:lanes:forward'].split("|").length
// console.log(numMovingLanes)

	for (i=0; i < lanesForward; i++) {
    if (Object.keys(tags).includes('cycleway:lanes:forward') == true &&  tags['cycleway:lanes:forward'].split("|").reverse()[i] == 'lane') { // figure out if the bike lane is somewhere other than right-most
      html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background: url("+bikeLanePeopleInbound[(Math.floor(Math.random() * 3))]+") no-repeat top center;background-color:#a9ccdb;'></td>"
    }
		if ((tags['cycleway']=='shared_lane' || tags['cycleway:right']=='shared_lane' || tags['cycleway:both']=='shared_lane') && i==0) {
			html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto, auto 100% !important;background: url("+getRandom(bikeLanePeopleInbound)+") no-repeat top center, url("+backwardCarImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
		} else if ((tags['cycleway']=='share_busway' || tags['cycleway:right']=='share_busway' || tags['cycleway:both']=='share_busway') && i==0) {
			html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto, auto !important;background: url("+getRandom(bikeLanePeopleInbound)+") no-repeat top center, url("+inboundBusImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
		} else if ((tags['bus:lanes:forward']=='designated' || tags['bus:lanes:forward']=='yes|designated' || tags['bus:lanes:forward']=='yes|yes|designated') && i==0) {
			html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto !important;background: url("+inboundBusImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
		} else if (tags['highway']=='cycleway'){
      if (Object.keys(tags).includes('cycleway:lane:width') && Number(tags['cycleway:lane:width'].replace("'",""))>7) {
        html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background-size: auto, auto !important;background: url("+getRandom(bikeLanePeopleInbound)+") no-repeat top left 10%, url("+getRandom(bikeLanePeopleInbound)+") no-repeat top right 10%;background-color:#a9ccdb;'></td>"
      } else {
        html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background-size: auto !important;background: url("+getRandom(bikeLanePeopleInbound)+") no-repeat top center;background-color:#a9ccdb;'></td>"
      }

    } else if (tags['highway']=='footway' || tags['highway']=='path'){
      html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background-size: auto !important;background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/people/people-"+(Math.floor(Math.random() * 30)+1).toString().padStart(2, '0')+".svg) no-repeat top center;background-color:#a9ccdb;'></td>"
    } else {
      if ((Object.keys(tags).includes('parking:lane:right') == true || Object.keys(tags).includes('parking:lane:both') && (tags['parking:lane:right'] == 'parallel' || tags['parking:lane:both']== 'parallel') && (Object.keys(tags).includes('parking:lane:right:parallel') == true)) && (tags['parking:lane:right:parallel'] == 'on_street' || tags['parking:lane:both:parallel'] == 'on_street') && (i == 0)) {
        html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto 100% !important;background: url("+ParkingSignImg+") no-repeat bottom left,url("+backwardCarImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
      } else if ((Object.keys(tags).includes('parking:lane:left') == true || Object.keys(tags).includes('parking:lane:both') && (tags['parking:lane:left'] == 'parallel' || tags['parking:lane:both']== 'parallel') && (Object.keys(tags).includes('parking:lane:left:parallel') == true)) && (tags['parking:lane:right:parallel'] == 'on_street' || tags['parking:lane:both:parallel'] == 'on_street') && (i == lanesForward-1) && tags['oneway']=='yes') {
        html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto 100% !important;background: url("+ParkingSignImg+") no-repeat bottom right,url("+backwardCarImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
      } else {
		    html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto 100% !important;background: url("+backwardCarImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
      }

		}
	}

  if (Object.keys(tags).includes('busway:left') == true && tags['busway:left'] == 'lane') {
    html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto !important;background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/transit/bus-inbound.svg) no-repeat bottom center;background-color:#a9ccdb;'></td>"

  }

	if (middleLane) {
		html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background: url() no-repeat top center;background-color:#a9ccdb;'></td>"
	}

	for (i=0; i < lanesBackward; i++) {
    if (Object.keys(tags).includes('cycleway:lanes:backward') == true &&  tags['cycleway:lanes:backward'].split("|")[i] == 'lane') { // figure out if the bike lane is somewhere other than right-most
      html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background: url("+bikeLanePeopleOutbound[(Math.floor(Math.random() * 3))]+") no-repeat top center;background-color:#a9ccdb;'></td>"
    }

		if ((tags['cycleway']=='shared_lane' || tags['cycleway:left']=='shared_lane' || tags['cycleway:both']=='shared_lane') && i==lanesBackward-1) {
			html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto, auto 100% !important;background: url("+getRandom(bikeLanePeopleOutbound)+") no-repeat bottom center, url("+forwardCarImg+") no-repeat top center;background-color:#a9ccdb;'></td>"
		} else if ((tags['cycleway']=='share_busway' || tags['cycleway:left']=='share_busway' || tags['cycleway:both']=='share_busway') && i==lanesBackward-1) {
			html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto, auto !important;background: url("+getRandom(bikeLanePeopleOutbound)+") no-repeat top center, url("+outboundBusImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
		} else if ((tags['bus:lanes:backward']=='designated' || tags['bus:lanes:backward']=='yes|designated' || tags['bus:lanes:backward']=='yes|yes|designated') && i==lanesBackward-1) {
			html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto !important;background: url("+outboundBusImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
		} else if ((tags['bus:lanes:backward']=='designated' || tags['bus:lanes:backward']=='yes|designated' || tags['bus:lanes:backward']=='yes|yes|designated') && i==lanesBackward-1) {
			html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto !important;background: url("+outboundBusImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
		} else if (tags['highway']=='cycleway'){
      if (Object.keys(tags).includes('cycleway:lane:width') && Number(tags['cycleway:lane:width'].replace("'",""))>7) {
        html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background-size: auto, auto !important;background: url("+getRandom(bikeLanePeopleOutbound)+") no-repeat top left 10%, url("+getRandom(bikeLanePeopleOutbound)+") no-repeat top right 10%;background-color:#a9ccdb;'></td>"
      } else {
        html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background-size: auto !important;background: url("+getRandom(bikeLanePeopleOutbound)+") no-repeat top center;background-color:#a9ccdb;'></td>"
      }
    } else if (tags['highway']=='footway' || tags['highway']=='path'){
      html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background-size: auto !important;background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/people/people-"+(Math.floor(Math.random() * 30)+1).toString().padStart(2, '0')+".svg) no-repeat top center;background-color:#a9ccdb;'></td>"
    } else  {


    if ((Object.keys(tags).includes('parking:lane:left') == true || Object.keys(tags).includes('parking:lane:both') && (tags['parking:lane:left'] == 'parallel' || tags['parking:lane:both']== 'parallel') && (Object.keys(tags).includes('parking:lane:left:parallel') == true)) && (tags['parking:lane:left:parallel'] == 'on_street' || tags['parking:lane:both:parallel'] == 'on_street') && (i == (lanesBackward-1))) {
      html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto 100% !important;background: url("+ParkingSignImg+") no-repeat bottom right,url("+forwardCarImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
    } else {
      html += "<td style='width: "+width+"px; height: "+vehicleRowHeight+"px; background-size: auto 100% !important;background: url("+forwardCarImg+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
    }
		}
	}

  if (Object.keys(tags).includes('cycleway:left:traffic_mode:left') == true && tags['cycleway:left:traffic_mode:left'] == 'parking') {
  if (tags['parking:lane:both']=='parallel' || tags['parking:lane:left']=='parallel') {
    html += "<td style='width: "+widthParking+"px; height: "+vehicleRowHeight+"px; background-size: cover !important;background-size: auto 100%, cover !important;background: url("+ParkingSignImg+") no-repeat bottom right,url("+forwardCarImg+") no-repeat top center;background-color:#a9ccdb;'></td>"
  }
  }

  if (Object.keys(tags).includes('cycleway:separation') == true || Object.keys(tags).includes('cycleway:left:separation:left') == true) {

    html += "<td style='width: "+widthSeparationBuffer+"px; height: "+vehicleRowHeight+"px; background: url("+itemNames[tags['cycleway:left:separation:left']]['url']+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
  }

  if (((tags['cycleway']=='lane' && tags['oneway']!=="yes") || tags['cycleway:both']=='lane' || tags['cycleway:left']=='lane' || (tags['oneway']=='yes' && tags['cycleway:left']=='lane')) && (Object.keys(tags).includes('cycleway:lanes:backward') == false || tags['cycleway:lanes:backward'].split("|")[0] != 'no')) {
		html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background: url("+bikeLanePeopleOutbound[(Math.floor(Math.random() * 3))]+") no-repeat top center;background-color:#a9ccdb;'></td>"
	}

  if ((tags['cycleway:left']=='track' || tags['cycleway']=='track') && (tags['oneway:bicycle']=='no' || tags['cycleway:right:oneway']=='no')) {
		html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background: url("+bikeLanePeopleInbound[(Math.floor(Math.random() * 3))]+") no-repeat top center;background-color:#a9ccdb;'></td><td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background: url("+bikeLanePeopleOutbound[(Math.floor(Math.random() * 3))]+") no-repeat top center;background-color:#a9ccdb;'></td>"
	} else if ((tags['cycleway:left']=='track' || tags['cycleway']=='track')) {
    html += "<td style='width: "+widthBike+"px; height: "+vehicleRowHeight+"px; background: url("+bikeLanePeopleOutbound[(Math.floor(Math.random() * 3))]+") no-repeat top center;background-color:#a9ccdb;'></td>"
  }

  if (Object.keys(tags).includes('cycleway:separation') == true || Object.keys(tags).includes('cycleway:left:separation:right') == true) {
    html += "<td style='width: "+widthSeparationBuffer+"px; height: "+vehicleRowHeight+"px; background: url("+itemNames[tags['cycleway:left:separation:right']]['url']+") no-repeat bottom center;background-color:#a9ccdb;'></td>"
  }

  if (Object.keys(tags).includes('cycleway:left:traffic_mode:left') == false && tags['cycleway:left:traffic_mode:left'] !== 'parking') {
  if (tags['parking:lane:both']=='parallel' || tags['parking:lane:left']=='parallel') {
    if (Object.keys(tags).includes('parking:lane:left:parallel') == true && tags['parking:lane:left:parallel'] == 'street_side') {
		if(tags['oneway']=='yes') {
			html += "<td style='width: "+widthParking+"px; height: "+vehicleRowHeight+"px; background-size: auto 100%, cover  !important;background:url("+ParkingSignImg+") no-repeat bottom right, url("+backwardCarImg+") no-repeat top center;background-color:#a9ccdb;'></td>"
		} else {
		html += "<td style='width: "+widthParking+"px; height: "+vehicleRowHeight+"px; background-size: auto 100%, cover !important;background:url("+ParkingSignImg+") no-repeat bottom right, url("+forwardCarImg+") no-repeat top center;background-color:#a9ccdb;'></td>"
		}
	}
}
}


	html += "</tr><tr>" // ADD LANE MARKINGS

  if (Object.keys(tags).includes('cycleway:right:traffic_mode:left') == false && tags['cycleway:right:traffic_mode:left'] !== 'parking') {
    if (Object.keys(tags).includes('parking:lane:right:parallel') == true && tags['parking:lane:right:parallel'] == 'street_side') {
	if (tags['parking:lane:both']=='parallel' || tags['parking:lane:right']=='parallel') {
		html += "<td style='width: "+widthParking+"px; height: "+markingRowHeight+"px; background: black url() no-repeat top right;'><span style='display:block;width:100%;border-bottom:4px solid white'></span></td>"
	}
}
}

  if (Object.keys(tags).includes('cycleway:separation') == true || Object.keys(tags).includes('cycleway:right:separation:right') == true) {
    html += "<td style='width: "+widthSeparationBuffer+"px; height: "+markingRowHeight+"px; background-size: auto 100% !important;background: url("+itemNames[tags['cycleway:right:separation:right']]['markingUrl']+");background-color:black;border-left:4px solid white;'></td>"
  }

  if (Object.keys(tags).includes('cycleway:lanes:forward') == false || tags['cycleway:lanes:forward'].split("|").reverse()[0] != 'no') {
  	if ((tags['cycleway']=='lane' || tags['cycleway:both']=='lane' || tags['cycleway:right']=='lane' || (tags['oneway']=='yes' && tags['cycleway:right']=='lane'))) {
  		html += "<td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-inbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-left.svg) no-repeat top left;border-right:4px solid white; background-color: green'></td>"
  	}
  }

  if ((tags['cycleway']=='track' || tags['cycleway:right']=='track') && (tags['oneway:bicycle']=='no' || tags['cycleway:right:oneway']=='no')) {
		html += "<td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-inbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-right.svg) no-repeat top right;background-color: green'></td><td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-outbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-right.svg) no-repeat top right;background-color: green'></td>"
	} else if ((tags['cycleway']=='track' || tags['cycleway:right']=='track')) {
    html += "<td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-inbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-left.svg) no-repeat top left;border-right:4px solid white; background-color: green'></td>"
  }

  if (Object.keys(tags).includes('cycleway:separation') == true || Object.keys(tags).includes('cycleway:right:separation:left') == true) {
    html += "<td style='width: "+cycleway_right_separation_left_width+"px; height: "+markingRowHeight+"px; background-size: auto 100%!important;background: url("+itemNames[tags['cycleway:right:separation:left']]['markingUrl']+");background-color:black;border-left:4px solid white;'></td>"
  }

  if (Object.keys(tags).includes('cycleway:right:traffic_mode:left') == true && tags['cycleway:right:traffic_mode:left'] == 'parking') {
	if (tags['parking:lane:both']=='parallel' || tags['parking:lane:right']=='parallel') {
		html += "<td style='width: "+widthParking+"px; height: "+markingRowHeight+"px; background: black url() no-repeat top right;'><span style='display:block;width:100%;border-bottom:4px solid white'></span></td>"
	}
}

	for (i=0; i < lanesForward; i++) {
    if (Object.keys(tags).includes('cycleway:lanes:forward') == true &&  tags['cycleway:lanes:forward'].split("|").reverse()[i] == 'lane') { // figure out if the bike lane is somewhere other than right-most
      html += "<td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-inbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-left.svg) no-repeat top left;border-right:4px solid white; background-color: green'></td>"
    }

		if (!middleLane && i == lanesForward - 1){
			centerline = "border-right: 4px yellow dashed;"
		} else {
			centerline = ''
		}
		if ((tags['cycleway']=='shared_lane' || tags['cycleway:right']=='shared_lane' || tags['cycleway:both']=='shared_lane') && i==0) {
			html += "<td style='width: "+width+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/sharrow-inbound.svg) no-repeat top center; border-left:4px dashed white; background-color:black;"+centerline+"'></td>"
		} else if ((tags['cycleway']=='share_busway' || tags['cycleway:right']=='share_busway' || tags['cycleway:both']=='share_busway') && i==0) {
			html += "<td style='width: "+width+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/sharrow-inbound.svg) no-repeat top center; border-left:4px dashed white; background-color:#b80b0b;"+centerline+"'></td>"
		} else if ((tags['bus:lanes:forward']=='designated' || tags['bus:lanes:forward']=='yes|designated' || tags['bus:lanes:forward']=='yes|yes|designated') && i==0) {
			html += "<td style='width: "+width+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-inbound.svg) no-repeat top center; border-left:4px dashed white; background-color:#b80b0b;"+centerline+"'></td>"
		} else if (tags['highway']=='cycleway' || tags['highway']=='footway' || tags['highway']=='path'){
      html += "<td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-inbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-left.svg) no-repeat top left;background-color:black;border-right: 2px yellow dashed;'></td>"
    }  else {
		html += "<td style='width: "+width+"px; height: "+markingRowHeight+"px; background: url("+turnMarkings['inbound'][turnLanesForward[i]]+") no-repeat top center;border-left:4px dashed white; background-color:black;"+centerline+"'></td>"
		}
	}


    if (Object.keys(tags).includes('busway:left') == true && tags['busway:left'] == 'lane') {
    		html += "<td style='width: "+width+"px; height: "+markingRowHeight+"px; background: #992025 url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-inbound.svg) no-repeat top center;'></td>"
    }

	if (middleLane) {
		html += "<td style='width: "+width+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/shared-outbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/center-lane-right.svg) no-repeat top right, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/center-lane-left.svg) no-repeat top left;background-color:black'></td>"
	}

	for (i=0; i < lanesBackward; i++) {
		if (!middleLane && i == 0){
			centerline = "border-left:4px dashed yellow;"
		} else {
			centerline = ''
		}
    if (Object.keys(tags).includes('cycleway:lanes:backward') == true &&  tags['cycleway:lanes:backward'].split("|")[i] == 'lane') { // figure out if the bike lane is somewhere other than right-most
      html += "<td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-outbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-right.svg) no-repeat top right;border-left:4px solid white; background-color: green'></td>"
    }
		if ((tags['cycleway']=='shared_lane' || tags['cycleway:left']=='shared_lane' || tags['cycleway:both']=='shared_lane') && i==lanesBackward-1) {
			html += "<td style='width: "+width+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/sharrow-outbound.svg) no-repeat top center;border-right:4px dashed white; background-color:black;"+centerline+"'></td>"
		} else if ((tags['cycleway']=='share_busway' || tags['cycleway:left']=='share_busway' || tags['cycleway:left']=='share_busway') && i==lanesBackward-1) {
			html += "<td style='width: "+width+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/sharrow-outbound.svg) no-repeat top center; border-right:4px dashed white; background-color:#b80b0b;"+centerline+"'></td>"
		} else if ((tags['bus:lanes:backward']=='designated' || tags['bus:lanes:backward']=='yes|designated' || tags['bus:lanes:backward']=='yes|yes|designated') && i==lanesBackward-1) {
			html += "<td style='width: "+width+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-outbound.svg) no-repeat top center; border-right:4px dashed white; background-color:#b80b0b;"+centerline+"'></td>"
		} else if (tags['highway']=='cycleway' || tags['highway']=='footway' || tags['highway']=='path'){
      html += "<td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-outbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-right.svg) no-repeat top right;background-color:black; border-right:2px solid white;'></td>"
    } else {
				html += "<td style='width: "+width+"px; height: "+markingRowHeight+"px; background: url("+turnMarkings['outbound'][turnLanesBackward[i]]+") no-repeat top center; border-right:4px dashed white;background-color:black;'></td>"
		}
	}

  if (Object.keys(tags).includes('cycleway:left:traffic_mode:left') == true && tags['cycleway:left:traffic_mode:left'] == 'parking') {
	if (tags['parking:lane:both']=='parallel' || tags['parking:lane:left']=='parallel') {
		html += "<td style='width: "+widthParking+"px; height: "+markingRowHeight+"px; background: black url() no-repeat top right;'><span style='display:block;width:100%;border-bottom:4px solid white'></span></td>"
	}
}

  if (Object.keys(tags).includes('cycleway:separation') == true || Object.keys(tags).includes('cycleway:left:separation:left') == true) {
    html += "<td style='width: "+widthSeparationBuffer+"px; height: "+markingRowHeight+"px; background-size: auto 100%!important;background: url("+itemNames[tags['cycleway:left:separation:left']]['markingUrl']+");background-color:black;border-left:4px solid white;'></td>"
  }

  if (Object.keys(tags).includes('cycleway:lanes:backward') == false || tags['cycleway:lanes:backward'].split("|")[0] != 'no') {
    if ((tags['cycleway']=='lane' && tags['oneway']!=="yes") || tags['cycleway:both']=='lane' || tags['cycleway:left']=='lane') {
  		html += "<td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-outbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-right.svg) no-repeat top right;border-left:4px solid white; background-color: green';'></td>"
  	} else if (tags['oneway']=='yes' && tags['cycleway:left']=='lane') {
  		html += "<td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-outbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-right.svg) no-repeat top right;border-left:4px solid white; background-color: green';'></td>"
  	}
  }

  if ((tags['cycleway:left']=='track' || tags['cycleway']=='track') && (tags['oneway:bicycle']=='no' || tags['cycleway:right:oneway']=='no')) {
		html += "<td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-inbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-right.svg) no-repeat top right;background-color: green'></td><td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-outbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-right.svg) no-repeat top right;background-color: green'></td>"
	} else if ((tags['cycleway:left']=='track' || tags['cycleway']=='track')) {
    html += "<td style='width: "+widthBike+"px; height: "+markingRowHeight+"px; background: url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/straight-outbound.svg) no-repeat top center, url(https://raw.githubusercontent.com/streetmix/illustrations/main/images/markings/lane-right.svg) no-repeat top right;border-left:4px solid white; background-color: green';'></td>"
  }

  if (Object.keys(tags).includes('cycleway:separation') == true || Object.keys(tags).includes('cycleway:left:separation:right') == true) {
    html += "<td style='width: "+widthSeparationBuffer+"px; height: "+markingRowHeight+"px; background-size: auto 100%!important;background: url("+itemNames[tags['cycleway:left:separation:right']]['markingUrl']+");background-color:black;border-left:4px solid white;'></td>"
  }

  if (Object.keys(tags).includes('cycleway:left:traffic_mode:left') == false && tags['cycleway:left:traffic_mode:left'] !== 'parking') {
  if (tags['parking:lane:both']=='parallel' || tags['parking:lane:left']=='parallel') {
    if (Object.keys(tags).includes('parking:lane:left:parallel') == true && tags['parking:lane:left:parallel'] == 'street_side') {
    html += "<td style='width: "+widthParking+"px; height: "+markingRowHeight+"px; background: black url() no-repeat top right;'><span style='display:block;width:100%;border-bottom:4px solid white'></span></td>"
  }
}
  }


	html += '</tr><tr style="vertical-align:top; font-size:12px;font-family: sans-serif">' // ADD LANE LABELS

  offsetArray = [0]

  if (Object.keys(tags).includes('cycleway:right:traffic_mode:left') == false && tags['cycleway:right:traffic_mode:left'] !== 'parking') {
    if (tags['parking:lane:both']=='parallel' || tags['parking:lane:right']=='parallel') {
      if (Object.keys(tags).includes('parking:lane:right:parallel') == true && tags['parking:lane:right:parallel'] == 'street_side') {
  		html += "<td style='text-align: center;width: "+widthParking+"px;'>Parking lane</td>"
  		totalStreetWidth += widthParking/pixelsPerInch
      offsetArray.push(totalStreetWidth)
    }
  	}
  }

  if (Object.keys(tags).includes('cycleway:separation') == true || Object.keys(tags).includes('cycleway:right:separation:right') == true) {
    bufferType = tags['cycleway:right:separation:right']
    html += "<td style='text-align: center;width: "+widthSeparationBuffer+"px;'>"+itemNames[bufferType]['desc']+"</td>"
		totalStreetWidth += widthSeparationBuffer/pixelsPerInch
    offsetArray.push(totalStreetWidth)
  }

  if (Object.keys(tags).includes('cycleway:lanes:forward') == false || tags['cycleway:lanes:forward'].split("|").reverse()[0] != 'no') {
  	if ((tags['cycleway']=='lane' || tags['cycleway:both']=='lane' || tags['cycleway:right']=='lane' || (tags['oneway']=='yes' && tags['cycleway:right']=='lane'))) {
  		html += "<td style='text-align: center;width: "+widthBike+"px;'>Bike lane</td>"
  		totalStreetWidth += widthBike/pixelsPerInch
      offsetArray.push(totalStreetWidth)
  	}
  }

  if ((tags['cycleway']=='track' || tags['cycleway:right']=='track') && (tags['oneway:bicycle']=='no' || tags['cycleway:right:oneway']=='no')) {
		html += "<td colspan=2 style='text-align: center;width: "+widthBike*2+"px;'>Cycle track</td>"
		totalStreetWidth += widthBike*2/pixelsPerInch
    offsetArray.push(totalStreetWidth)
	} else if ((tags['cycleway']=='track' || tags['cycleway:right']=='track')) {
    html += "<td style='text-align: center;width: "+widthBike+"px;'>Cycle track</td>"
    totalStreetWidth += widthBike/pixelsPerInch
    offsetArray.push(totalStreetWidth)
  }

  if (Object.keys(tags).includes('cycleway:separation') == true || Object.keys(tags).includes('cycleway:right:separation:left') == true) {
    bufferType = tags['cycleway:right:separation:left']
    html += "<td style='text-align: center;width: "+cycleway_right_separation_left_width+"px;'>"+itemNames[bufferType]['desc']+"</td>"
		totalStreetWidth += cycleway_right_separation_left_width/pixelsPerInch
    offsetArray.push(totalStreetWidth)
  }

  if (Object.keys(tags).includes('cycleway:right:traffic_mode:left') == true && tags['cycleway:right:traffic_mode:left'] == 'parking') {
    if (tags['parking:lane:both']=='parallel' || tags['parking:lane:right']=='parallel') {
      html += "<td style='text-align: center;width: "+widthParking+"px;'>Parking lane</td>"
      totalStreetWidth += widthParking/pixelsPerInch
      offsetArray.push(totalStreetWidth)
    }
  }



	for (i=0; i < lanesForward; i++) {
    if (Object.keys(tags).includes('cycleway:lanes:forward') == true &&  tags['cycleway:lanes:forward'].split("|").reverse()[i] == 'lane') { // figure out if the bike lane is somewhere other than right-most
      html += "<td style='text-align: center;width: "+widthBike+"px;'>Bike lane</td>"
  		totalStreetWidth += widthBike/pixelsPerInch
      offsetArray.push(totalStreetWidth)
    }
		if ((tags['cycleway']=='shared_lane' || tags['cycleway:right']=='shared_lane' || tags['cycleway:both']=='shared_lane') && i==0) {
			html += "<td class='carBackward' style='text-align: center;width: "+width+"px;'>Mixed lane</td>"
      totalStreetWidth += width/pixelsPerInch
      offsetArray.push(totalStreetWidth)
    } else if ((tags['cycleway']=='share_busway' || tags['cycleway:right']=='share_busway' || tags['cycleway:both']=='share_busway') && i==0) {
      html += "<td class='carBackward' style='text-align: center;width: "+width+"px;'>Mixed bus lane</td>"
      totalStreetWidth += width/pixelsPerInch
      offsetArray.push(totalStreetWidth)
		} else if ((tags['bus:lanes:forward']=='designated' || tags['bus:lanes:forward']=='yes|designated' || tags['bus:lanes:forward']=='yes|yes|designated') && i==0) {
      html += "<td class='carBackward' style='text-align: center;width: "+width+"px;'>Bus lane</td>"
      totalStreetWidth += width/pixelsPerInch
      offsetArray.push(totalStreetWidth)
		}  else if (tags['highway']=='cycleway') {
      html += "<td style='text-align: center;width: "+widthBike+"px;'>Bike lane</td>"
      totalStreetWidth += widthBike/pixelsPerInch
      offsetArray.push(totalStreetWidth)
    }   else if (tags['highway']=='footway' || tags['highway']=='path') {
      html += "<td style='text-align: center;width: "+widthBike+"px;'>Path</td>"
      totalStreetWidth += widthBike/pixelsPerInch
      offsetArray.push(totalStreetWidth)
    } else {
      if ((Object.keys(tags).includes('parking:lane:right') == true || Object.keys(tags).includes('parking:lane:both') && (tags['parking:lane:right'] == 'parallel' || tags['parking:lane:both']== 'parallel') && (Object.keys(tags).includes('parking:lane:right:parallel') == true)) && (tags['parking:lane:right:parallel'] == 'on_street' || tags['parking:lane:both:parallel'] == 'on_street') && (i == 0)) {
        html += "<td class='carBackward' style='text-align: center;width: "+width+"px;'>Travel lane w/parking</td>"
      }  else if ((Object.keys(tags).includes('parking:lane:left') == true || Object.keys(tags).includes('parking:lane:both') && (tags['parking:lane:left'] == 'parallel' || tags['parking:lane:both']== 'parallel') && (Object.keys(tags).includes('parking:lane:left:parallel') == true)) && (tags['parking:lane:right:parallel'] == 'on_street' || tags['parking:lane:both:parallel'] == 'on_street') && (i == lanesForward-1) && tags['oneway']=='yes') {
        html += "<td class='carBackward' style='text-align: center;width: "+width+"px;'>Travel lane w/parking</td>"
      } else {
        html += "<td class='carBackward' style='text-align: center;width: "+width+"px;'>Travel lane</td>"
      }
      totalStreetWidth += width/pixelsPerInch
      offsetArray.push(totalStreetWidth)
		}

	}


  if (Object.keys(tags).includes('busway:left') == true && tags['busway:left'] == 'lane') {
    html += "<td style='text-align: center;width: "+width+"px;'>Bus lane</td>"
    totalStreetWidth += width/pixelsPerInch
    offsetArray.push(totalStreetWidth)
  }

	if (middleLane) {
		html += "<td style='text-align: center;width: "+width+"px;'>Turn lane</td>"
		totalStreetWidth += width/pixelsPerInch
    offsetArray.push(totalStreetWidth)
	}

	for (i=0; i < lanesBackward; i++) {
    if (Object.keys(tags).includes('cycleway:lanes:backward') == true &&  tags['cycleway:lanes:backward'].split("|")[i] == 'lane') { // figure out if the bike lane is somewhere other than right-most
      html += "<td style='text-align: center;width: "+widthBike+"px;'>Bike lane</td>"
  		totalStreetWidth += widthBike/pixelsPerInch
      offsetArray.push(totalStreetWidth)
    }
		if ((tags['cycleway']=='shared_lane' || tags['cycleway:left']=='shared_lane' || tags['cycleway:both']=='shared_lane') && i==lanesBackward-1) {
			html += "<td class='carBackward' style='text-align: center;width: "+width+"px;'>Mixed lane</td>"
      totalStreetWidth += width/pixelsPerInch
      offsetArray.push(totalStreetWidth)
    } else if ((tags['cycleway']=='share_busway' || tags['cycleway:left']=='share_busway' || tags['cycleway:both']=='share_busway') && i==lanesBackward-1) {
        html += "<td class='carBackward' style='text-align: center;width: "+width+"px;'>Mixed bus lane</td>"
        totalStreetWidth += width/pixelsPerInch
        offsetArray.push(totalStreetWidth)
  		} else if ((tags['bus:lanes:backward']=='designated' || tags['bus:lanes:backward']=='yes|designated' || tags['bus:lanes:backward']=='yes|yes|designated') && i==lanesBackward-1) {
        html += "<td class='carBackward' style='text-align: center;width: "+width+"px;'>Bus lane</td>"
        totalStreetWidth += width/pixelsPerInch
        offsetArray.push(totalStreetWidth)
  		}   else if (tags['highway']=='cycleway') {
        html += "<td style='text-align: center;width: "+widthBike+"px;'>Bike lane</td>"
        totalStreetWidth += widthBike/pixelsPerInch
        offsetArray.push(totalStreetWidth)
      }   else if (tags['highway']=='footway' || tags['highway']=='path') {
        html += "<td style='text-align: center;width: "+widthBike+"px;'>Path</td>"
        totalStreetWidth += widthBike/pixelsPerInch
        offsetArray.push(totalStreetWidth)
      } else  {
        if ((Object.keys(tags).includes('parking:lane:left') == true || Object.keys(tags).includes('parking:lane:both') && (tags['parking:lane:left'] == 'parallel' || tags['parking:lane:both']== 'parallel') && (Object.keys(tags).includes('parking:lane:left:parallel') == true)) && (tags['parking:lane:left:parallel'] == 'on_street' || tags['parking:lane:both:parallel'] == 'on_street') && (i == (lanesBackward-1))) {
    			html += "<td class='carBackward' style='text-align: center;width: "+width+"px;'>Travel lane w/parking</td>"
        } else {
          html += "<td class='carBackward' style='text-align: center;width: "+width+"px;'>Travel lane</td>"
        }
        totalStreetWidth += width/pixelsPerInch
        offsetArray.push(totalStreetWidth)
  		}

	}

  if (Object.keys(tags).includes('cycleway:left:traffic_mode:left') == true && tags['cycleway:left:traffic_mode:left'] == 'parking') {
    if (tags['parking:lane:both']=='parallel' || tags['parking:lane:left']=='parallel') {
      html += "<td style='text-align: center;width: "+widthParking+"px;'>Parking lane</td>"
      totalStreetWidth += widthParking/pixelsPerInch
      offsetArray.push(totalStreetWidth)
    }
  }

  if (Object.keys(tags).includes('cycleway:separation') == true || Object.keys(tags).includes('cycleway:left:separation:left') == true) {
    bufferType = tags['cycleway:left:separation:left']
    html += "<td style='text-align: center;width: "+widthSeparationBuffer+"px;'>"+itemNames[bufferType]['desc']+"</td>"
		totalStreetWidth += widthSeparationBuffer/pixelsPerInch
    offsetArray.push(totalStreetWidth)
  }

  if (Object.keys(tags).includes('cycleway:lanes:backward') == false || tags['cycleway:lanes:backward'].split("|")[0] != 'no') {
      if ((tags['cycleway']=='lane' && tags['oneway']!=="yes") || tags['cycleway:both']=='lane' || tags['cycleway:left']=='lane' || (tags['oneway']=='yes' && tags['cycleway:left']=='lane')) {
  		html += "<td style='text-align: center;width: "+widthBike+"px;'>Bike lane</td>"
  		totalStreetWidth += widthBike/pixelsPerInch
      offsetArray.push(totalStreetWidth)
  	}
  }

  if ((tags['cycleway:left']=='track' || tags['cycleway']=='track') && (tags['oneway:bicycle']=='no' || tags['cycleway:right:oneway']=='no')) {
		html += "<td colspan=2 style='text-align: center;width: "+widthBike*2+"px;'>Cycle track</td>"
		totalStreetWidth += widthBike*2/pixelsPerInch
    offsetArray.push(totalStreetWidth)
	} else if ((tags['cycleway:left']=='track' || tags['cycleway']=='track')) {
    html += "<td style='text-align: center;width: "+widthBike+"px;'>Bike lane</td>"
    totalStreetWidth += widthBike/pixelsPerInch
    offsetArray.push(totalStreetWidth)
  }

  if (Object.keys(tags).includes('cycleway:separation') == true || Object.keys(tags).includes('cycleway:left:separation:right') == true) {
    bufferType = tags['cycleway:left:separation:right']
    html += "<td style='text-align: center;width: "+widthSeparationBuffer+"px;'>"+itemNames[bufferType]['desc']+"</td>"
		totalStreetWidth += widthSeparationBuffer/pixelsPerInch
    offsetArray.push(totalStreetWidth)
  }

  if (Object.keys(tags).includes('cycleway:left:traffic_mode:left') == false && tags['cycleway:left:traffic_mode:left'] !== 'parking') {
    if (tags['parking:lane:both']=='parallel' || tags['parking:lane:left']=='parallel') {
      if (Object.keys(tags).includes('parking:lane:left:parallel') == true && tags['parking:lane:left:parallel'] == 'street_side') {
  		html += "<td style='text-align: center;width: "+widthParking+"px;'>Parking lane</td>"
  		totalStreetWidth += widthParking/pixelsPerInch
      offsetArray.push(totalStreetWidth)
  	}
  }
  }

  //console.log('totalStreetWidth: ',totalStreetWidth)

	html += "</tr></table>"

	html = '<table class="streetmix" cellspacing="0" style="background:white;min-width:'+(totalStreetWidth*pixelsPerInch)+'px;"><tr>' + html

  // console.log(offsetArray)
	return {'html': html, 'offsetArray': offsetArray }
}
