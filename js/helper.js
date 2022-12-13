function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();
  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for(var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }
  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes
  return str;
}

// https://github.com/Turfjs/turf/issues/1743#issuecomment-736805738
// Returns distance in meters (negative values for points inside) from a point to the edges of a polygon
function distanceToPolygon( { point, polygon } ) {
if (polygon.type === "Feature") { polygon = polygon.geometry }
let distance;
if (polygon.type === "MultiPolygon") {
  //console.log(polygon)
  try {
    distance = polygon.coordinates
      .map(coords => distanceToPolygon({ point, polygon: turf.polygon(coords).geometry }))
      .reduce((smallest, current) => (current < smallest ? current : smallest));
  }
  catch(err) {
    distance = 0
    //console.log(err.message)
  }

} else {
  if (polygon.coordinates.length > 1) {
    // Has holes
    const [exteriorDistance, ...interiorDistances] = polygon.coordinates.map(coords =>
      distanceToPolygon({ point, polygon: turf.polygon([coords]).geometry })
    );
    if (exteriorDistance < 0) {
      // point is inside the exterior polygon shape
      const smallestInteriorDistance = interiorDistances.reduce(
        (smallest, current) => (current < smallest ? current : smallest)
      );
      if (smallestInteriorDistance < 0) {
        // point is inside one of the holes (therefore not actually inside this shape)
        distance = smallestInteriorDistance * -1;
      } else {
        // find which is closer, the distance to the hole or the distance to the edge of the exterior, and set that as the inner distance.
        distance = smallestInteriorDistance < exteriorDistance * -1
          ? smallestInteriorDistance * -1
          : exteriorDistance;
      }
    } else {
      distance = exteriorDistance;
    }
  } else {
    // The actual distance operation - on a normal, hole-less polygon (converted to meters)
    distance = turf.pointToLineDistance(point, turf.polygonToLineString(polygon)) * 1000;
    if (turf.booleanPointInPolygon(point, polygon)) {
      distance = distance * -1;
    }
  }
}
return distance
}

// https://stackoverflow.com/a/12181825
function printElement(elem, append, delimiter) {
    var domClone = elem.cloneNode(true);

    var $printSection = document.getElementById("printSection");

    if (!$printSection) {
        $printSection = document.createElement("div");
        $printSection.id = "printSection";
        document.body.appendChild($printSection);
    }

    if (append !== true) {
        $printSection.innerHTML = "";
    }

    else if (append === true) {
        if (typeof (delimiter) === "string") {
            $printSection.innerHTML += delimiter;
        }
        else if (typeof (delimiter) === "object") {
            $printSection.appendChild(delimiter);
        }
    }

    $printSection.appendChild(domClone);
}


function getLineStyle(feature) {
  colorRedGreen = ['#cc3300', '#ff781f', '#ffcc00', '#99cc33', '#339900']
	colorsSafe = ['#d7191c', '#fdae61', 'yellow', '#abd9e9', '#2c7bb6']
	// set the color profile
	colors = colorsSafe

  
  // set default color
  var colorHex = colors[0];
  var lineWeight = 5;
  var opacity = 1;
  // get speed limit, set default very high only for calculations
  var maxspeed = 100;
  var dashArrayStr = '1'
  // set default lane count
  if(Object.keys(feature.properties.tags).includes('oneway')) {
    if(feature.properties.tags['oneway'] == 'yes') {
      var numLanes = 1;
    }
  } else {
    var numLanes = 2;
  }

  if (Object.keys(feature.properties.tags).includes('maxspeed') == true) {
    if (feature.properties.tags['maxspeed'].includes('mph')) {
      maxspeed = Number(feature.properties.tags['maxspeed'].split(" ")[0])
    } else {
      maxspeed = feature.properties.tags['maxspeed'] / 0.621371
    }
  }

  if((Object.keys(feature.properties.tags).includes('cycleway') == false && Object.keys(feature.properties.tags).includes('cycleway:right') == false && Object.keys(feature.properties.tags).includes('cycleway:left') == false && Object.keys(feature.properties.tags).includes('cycleway:both') == false) || (Object.keys(feature.properties.tags).includes('cycleway') == true && feature.properties.tags['cycleway'] == 'no')) {
    colorHex = colors[0]; // red
  }

    if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "primary_link" || feature.properties.tags['highway'] == "trunk") {
      lineWeight = 5;
    } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
      lineWeight = 4;
    } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "cycleway" || feature.properties.tags['highway'] == "tertiary_link" || (feature.properties.tags['highway'] == 'footway' && feature.properties.tags['bicycle'] == 'yes') || (feature.properties.tags['highway']=='path' && (feature.properties.tags['bicycle']=='designated' || feature.properties.tags['bicycle']=='yes'))) {
      lineWeight = 3;
    } else {
      lineWeight = 2;
      colorHex = colors[3]; // green
      colorHex = "#444444";
      opacity = 0.01
      dashArrayStr = '10,10'
    }


  if((feature.properties.tags['cycleway'] == "shared_lane" || feature.properties.tags['cycleway'] == "shared_bus") && maxspeed > 25) {
    colorHex = colors[1];
  } else if((feature.properties.tags['cycleway:right'] == "shared_lane" || feature.properties.tags['cycleway:right'] == "shared_bus") && maxspeed > 25) {
    colorHex = colors[1];
  } else if((feature.properties.tags['cycleway:left'] == "shared_lane" || feature.properties.tags['cycleway:left'] == "shared_bus") && maxspeed > 25) {
    colorHex = colors[1];
  } else if((feature.properties.tags['cycleway:both'] == "shared_lane" || feature.properties.tags['cycleway:both'] == "shared_bus") && maxspeed > 25) {
    colorHex = colors[1];
  } else if((feature.properties.tags['cycleway'] == "shared_lane" || feature.properties.tags['cycleway'] == "shared_bus") && maxspeed == 25) {
    colorHex = colors[2];
  } else if((feature.properties.tags['cycleway:right'] == "shared_lane" || feature.properties.tags['cycleway:right'] == "shared_bus") && maxspeed == 25) {
    colorHex = colors[2];
  } else if((feature.properties.tags['cycleway:left'] == "shared_lane" || feature.properties.tags['cycleway:left'] == "shared_bus") && maxspeed == 25) {
    colorHex = colors[2];
  } else if((feature.properties.tags['cycleway:both'] == "shared_lane" || feature.properties.tags['cycleway:both'] == "shared_bus") && maxspeed == 25) {
    colorHex = colors[2];
  } else if((feature.properties.tags['cycleway'] == "shared_lane" || feature.properties.tags['cycleway'] == "shared_bus") && maxspeed < 25) {
    colorHex = colors[3];
  } else if((feature.properties.tags['cycleway:right'] == "shared_lane" || feature.properties.tags['cycleway:right'] == "shared_bus") && maxspeed < 25) {
    colorHex = colors[3];
  } else if((feature.properties.tags['cycleway:left'] == "shared_lane" || feature.properties.tags['cycleway:left'] == "shared_bus") && maxspeed < 25) {
    colorHex = colors[3];
  } else if((feature.properties.tags['cycleway:both'] == "shared_lane" || feature.properties.tags['cycleway:both'] == "shared_bus") && maxspeed < 25) {
    colorHex = colors[3];
  } else if(feature.properties.tags['cycleway'] == "lane" || feature.properties.tags['cycleway'] == "track") { // add a (bicycle=yes && motor_vehicle=no) condition
    colorHex = colors[3];
    opacity = 1
    dashArrayStr='1'
  } else if(feature.properties.tags['cycleway:left'] == "lane" || feature.properties.tags['cycleway:left'] == "track") {
    colorHex = colors[3];
    opacity = 1
    dashArrayStr='1'
  } else if(feature.properties.tags['cycleway:right'] == "lane" || feature.properties.tags['cycleway:right'] == "track") {
    colorHex = colors[3];
    opacity = 1
    dashArrayStr='1'
  } else if(feature.properties.tags['cycleway:both'] == "lane" || feature.properties.tags['cycleway:both'] == "track") {
    colorHex = colors[3];
    opacity = 1
    dashArrayStr='1'
  } else if(feature.properties.tags['highway'] == "cycleway" || feature.properties.tags['cycleway'] == "separate" || feature.properties.tags['cycleway:right'] == "separate" || feature.properties.tags['cycleway:left'] == "separate" || feature.properties.tags['cycleway:both'] == "separate" || feature.properties.tags['bicycle'] == 'use_sidepath' || (feature.properties.tags['highway'] == 'footway' && feature.properties.tags['bicycle'] == 'yes') || (feature.properties.tags['highway']=='path' && (feature.properties.tags['bicycle']=='designated' || feature.properties.tags['bicycle']=='yes'))) {
    colorHex = colors[4];
  } else {
    //colorHex = colors[0];
  }

  if(Object.keys(feature.properties.tags).includes('bicycle') == true && Object.keys(feature.properties.tags).includes('motor_vehicle') == true) {
    if(feature.properties.tags['bicycle'] == 'yes' && feature.properties.tags['motor_vehicle'] == 'no') {
      colorHex = colors[4]; // if cars banned and bicycles allowed
    }
  }



  return {
    color: colorHex,
    weight: lineWeight,
    opacity: opacity,
    dashArray: dashArrayStr

  };
}
