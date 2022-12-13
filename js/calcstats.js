

var streetStats = {
  'total_shared_lane': 0,
  'total_bike_lane': 0,
  'total_separated_cycleway': 0,
  'total_cycleway_highway': 0,
  'total_residential_etc': 0,
  'shared_25': 0,
  'shared_35': 0,
  'primary': 0,
  'secondary': 0,
  'tertiary': 0,
  'primary_no_bikeinfra': 0,
  'secondary_no_bikeinfra': 0,
  'tertiary_no_bikeinfra': 0,
  'primary_cyclelane': 0,
  'secondary_cyclelane': 0,
  'tertiary_cyclelane': 0,
  'residential_cyclelane': 0,
  'primary_sharedlane': 0,
  'secondary_sharedlane': 0,
  'tertiary_sharedlane': 0,
  'residential_sharedlane': 0
}
var streetsWithoutBikeInfra = {
  'primary': { '(no name)': 0 },
  'secondary': { '(no name)': 0 },
  'tertiary': { '(no name)': 0 }
}

streetsWithoutBikeInfraSorted = {
  'primary': Object.fromEntries(Object.entries(streetsWithoutBikeInfra.primary).sort(([, a], [, b]) => a - b).reverse()),
  'secondary': Object.fromEntries(Object.entries(streetsWithoutBikeInfra.secondary).sort(([, a], [, b]) => a - b).reverse()),
  'tertiary': Object.fromEntries(Object.entries(streetsWithoutBikeInfra.tertiary).sort(([, a], [, b]) => a - b).reverse())
}


function calcStreetStats(feature) {
  // layer.on({
  //   mouseover: highlightFeature,
  //   mouseout: resetHighlight
  // });
  //
  var maxspeed = 100;
  var carsBanned = false;
  // popupContent = popupContent + "<b>osm_id</b>: <a target='_blank' href='https://www.openstreetmap.org/" + feature.properties.type + "/" + feature.properties.id + "'>" + feature.properties.type + "/" + feature.properties.id + "</a><br>";
  // var keys = Object.keys(feature.properties.tags);
  // keys.forEach(function(key) {
  //   if(key.includes('tiger') == false && key.includes('hgv') == false && key.includes('source') == false && key.includes('old_ref') == false) {
  //     popupContent = popupContent + "<b>" + key + "</b>: " + feature.properties.tags[key] + "<br>";
  //   }
  // });
  //
  // tableHtml = "<center>"+generateCrossSectionTable(feature)['html']+"</center>";
  // popupContent = tableHtml+popupContent
  //
  // layer.bindPopup(popupContent);
  // if ((feature.geometry) && (feature.geometry.type !== undefined) && (feature.geometry.type === "LineString")) {
  //   //console.log(getStreetLineStringWithinBoundary(feature));
  //   feature.geometry.coordinates = getStreetLineStringWithinBoundary(feature).geometry.coordinates;
  // }
  if(Object.keys(feature.properties.tags).includes('maxspeed')) {
    maxspeed = Number(feature.properties.tags['maxspeed'].split(" ")[0]);
  }
  var length = turf.length(feature, {
    units: 'miles'
  })
  // console.log('length: ', length)

  if(Object.keys(feature.properties.tags).includes('bicycle') == true && Object.keys(feature.properties.tags).includes('motor_vehicle') == true) {
    if(feature.properties.tags['bicycle'] == 'yes' && feature.properties.tags['motor_vehicle'] == 'no' && (feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "primary_link" || feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link" || feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link")) {
      carsBanned = true;
    }
  }

  if((feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") && carsBanned==false) {
    if (feature.properties.tags['oneway']=='yes') {
      streetStats.primary += length
    } else {
      streetStats.primary += length * 2
    }

  } else if((feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") && carsBanned==false) {
    if (feature.properties.tags['oneway']=='yes') {
      streetStats.secondary += length
    } else {
      streetStats.secondary += length * 2
    }
  } else if((feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") && carsBanned==false) {
    if (feature.properties.tags['oneway']=='yes') {
      streetStats.tertiary += length
    } else {
      streetStats.tertiary += length * 2
    }
  }
  if(((feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') && Object.keys(feature.properties.tags).includes('cycleway') == false) && carsBanned==false) {

    if (feature.properties.tags['oneway']=='yes') {
      streetStats.total_residential_etc += length
    } else {
      streetStats.total_residential_etc += length * 2
    }
  }

  if(Object.keys(feature.properties.tags).includes('cycleway') == true || Object.keys(feature.properties.tags).includes('cycleway:right') == true || Object.keys(feature.properties.tags).includes('cycleway:left') == true || Object.keys(feature.properties.tags).includes('cycleway:both') == true || (Object.keys(feature.properties.tags).includes('highway') == true && feature.properties.tags['highway'] == 'cycleway') || carsBanned == true || feature.properties.tags['bicycle'] == 'use_sidepath' || (feature.properties.tags['highway']=='path' && (feature.properties.tags['bicycle']=='designated' || feature.properties.tags['bicycle']=='yes'))) {
    if((feature.properties.tags['cycleway'] == "shared_lane" || feature.properties.tags['cycleway'] == "shared_bus") && maxspeed > 25) {
      streetStats.total_shared_lane += length * 2
      streetStats.shared_35 += length * 2
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_sharedlane += length * 2
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_sharedlane += length * 2
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_sharedlane += length * 2
      } else if(feature.properties.tags['highway'] == "residential") {
        streetStats.residential_sharedlane += length * 2
      }
    }

    if((feature.properties.tags['cycleway:right'] == "shared_lane" || feature.properties.tags['cycleway:right'] == "share_busway") && maxspeed > 25) {
      streetStats.total_shared_lane += (length)
      streetStats.shared_35 += (length)
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_sharedlane += (length)
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_sharedlane += (length)
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_sharedlane += (length)
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_sharedlane += (length)
      }
    }

    if((feature.properties.tags['cycleway:left'] == "shared_lane" || feature.properties.tags['cycleway:left'] == "share_busway") && maxspeed > 25) {
      streetStats.total_shared_lane += (length)
      streetStats.shared_35 += (length)
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_sharedlane += (length)
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_sharedlane += (length)
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_sharedlane += (length)
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_sharedlane += (length)
      }
    }

    if((feature.properties.tags['cycleway:both'] == "shared_lane" || feature.properties.tags['cycleway:both'] == "share_busway") && maxspeed > 25) {
      streetStats.total_shared_lane += length * 2
      streetStats.shared_35 += length * 2
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_sharedlane += length * 2
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_sharedlane += length * 2
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_sharedlane += length * 2
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_sharedlane += length * 2
      }
    }

    if((feature.properties.tags['cycleway'] == "shared_lane" || feature.properties.tags['cycleway'] == "share_busway") && maxspeed <= 25) {
      streetStats.total_shared_lane += length * 2
      streetStats.shared_25 += length * 2
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_sharedlane += length * 2
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_sharedlane += length * 2
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_sharedlane += length * 2
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_sharedlane += length * 2
      }
    }

    if((feature.properties.tags['cycleway:right'] == "shared_lane" || feature.properties.tags['cycleway:right'] == "share_busway") && maxspeed <= 25) {
      streetStats.total_shared_lane += (length)
      streetStats.shared_25 += (length)
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_sharedlane += (length)
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_sharedlane += (length)
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_sharedlane += (length)
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_sharedlane += (length)
      }
    }

    if((feature.properties.tags['cycleway:left'] == "shared_lane" || feature.properties.tags['cycleway:left'] == "share_busway") && maxspeed <= 25) {
      streetStats.total_shared_lane += (length)
      streetStats.shared_25 += (length)
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_sharedlane += (length)
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_sharedlane += (length)
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_sharedlane += (length)
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_sharedlane += (length)
      }
    }

    if((feature.properties.tags['cycleway:both'] == "shared_lane" || feature.properties.tags['cycleway:both'] == "share_busway") && maxspeed <= 25) {
      streetStats.total_shared_lane += length * 2
      streetStats.shared_25 += length * 2
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_sharedlane += length * 2
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_sharedlane += length * 2
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_sharedlane += length * 2
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_sharedlane += length * 2
      }
    }

    if(feature.properties.tags['cycleway'] == "lane" || feature.properties.tags['cycleway'] == "track" || carsBanned == true || feature.properties.tags['cycleway'] == 'separate' || feature.properties.tags['cycleway:right'] == "separate" || feature.properties.tags['cycleway:left'] == "separate" || feature.properties.tags['cycleway:both'] == "separate" || feature.properties.tags['bicycle'] == 'use_sidepath' || (feature.properties.tags['highway'] == 'footway' && feature.properties.tags['bicycle'] == 'yes') || (feature.properties.tags['highway']=='path' && (feature.properties.tags['bicycle']=='designated' || feature.properties.tags['bicycle']=='yes'))) {
      if(feature.properties.tags['cycleway'] == 'separate' || feature.properties.tags['cycleway:right'] == "separate" || feature.properties.tags['cycleway:left'] == "separate" || feature.properties.tags['cycleway:both'] == "separate" || feature.properties.tags['bicycle'] == 'use_sidepath' || (feature.properties.tags['highway']=='path' && (feature.properties.tags['bicycle']=='designated' || feature.properties.tags['bicycle']=='yes'))) {
        streetStats.total_separated_cycleway += length * 2
      } else {
        streetStats.total_bike_lane += length * 2 // only on-road lanes are counted in total_bike_lane
      }

      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_cyclelane += length * 2
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_cyclelane += length * 2
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_cyclelane += length * 2
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_cyclelane += length * 2
      }
    }

    if(feature.properties.tags['cycleway:left'] == "lane") {
      streetStats.total_bike_lane += (length)
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_cyclelane += (length)
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_cyclelane += (length)
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_cyclelane += (length)
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_cyclelane += (length)
      }
    }

    if(feature.properties.tags['cycleway:left'] == "track" || carsBanned == true) {
      streetStats.total_bike_lane += length
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_cyclelane += length * 2
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_cyclelane += length * 2
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_cyclelane += length * 2
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_cyclelane += length * 2
      }
    }

    if(feature.properties.tags['cycleway:right'] == "lane") {
      streetStats.total_bike_lane += (length)
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_cyclelane += (length)
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_cyclelane += (length)
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_cyclelane += (length)
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_cyclelane += (length)
      }
    }

    if(feature.properties.tags['cycleway:right'] == "track" || carsBanned == true) { // if lane or track

      streetStats.total_bike_lane += length * 2
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_cyclelane += length * 2
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_cyclelane += length * 2
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_cyclelane += length * 2
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_cyclelane += length * 2
      }
    }

    if(feature.properties.tags['cycleway:both'] == "lane" || feature.properties.tags['cycleway:both'] == "track" || carsBanned == true) { // if lane or track
      streetStats.total_bike_lane += length * 2
      if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
        streetStats.primary_cyclelane += length * 2
      } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
        streetStats.secondary_cyclelane += length * 2
      } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
        streetStats.tertiary_cyclelane += length * 2
      } else if(feature.properties.tags['highway'] == 'residential' || feature.properties.tags['highway'] == 'unclassified' || feature.properties.tags['highway'] == 'service') {
        streetStats.residential_cyclelane += length * 2
      }
    }

    if(feature.properties.tags['highway'] == "cycleway") {
      streetStats.total_cycleway_highway += length * 2
    }
  } else { // no cycle infra
    if(feature.properties.tags['highway'] == "primary" || feature.properties.tags['highway'] == "trunk" || feature.properties.tags['highway'] == "trunk_link" || feature.properties.tags['highway'] == "primary_link") {
      length = turf.length(feature, {
        units: 'miles'
      })

      if (feature.properties.tags['oneway']=='yes') {
        streetStats.primary_no_bikeinfra += length
      } else {
        streetStats.primary_no_bikeinfra += length * 2
      }

      if(Object.keys(feature.properties.tags).includes('name') == true) {
        if(Object.keys(streetsWithoutBikeInfra.primary).includes(feature.properties.tags['name']) == false) {

          if (feature.properties.tags['oneway']=='yes') {
            streetsWithoutBikeInfra.primary[feature.properties.tags['name']] = length
          } else {
            streetsWithoutBikeInfra.primary[feature.properties.tags['name']] = length * 2
          }
        } else {

          if (feature.properties.tags['oneway']=='yes') {
            streetsWithoutBikeInfra.primary[feature.properties.tags['name']] += length;
          } else {
            streetsWithoutBikeInfra.primary[feature.properties.tags['name']] += length*2
          }
        }
      } else {
        if(Object.keys(feature.properties.tags).includes('ref') == true) {
          if(Object.keys(streetsWithoutBikeInfra.primary).includes(feature.properties.tags['ref']) == false) {

              if (feature.properties.tags['oneway']=='yes') {
                streetsWithoutBikeInfra.primary[feature.properties.tags['ref']] = length;
              } else {
                streetsWithoutBikeInfra.primary[feature.properties.tags['ref']] = length * 2
              }
            } else {

              if (feature.properties.tags['oneway']=='yes') {
                streetsWithoutBikeInfra.primary[feature.properties.tags['ref']] += length
              } else {
                streetsWithoutBikeInfra.primary[feature.properties.tags['ref']] += length * 2
              }
            }

        } else {

          if (feature.properties.tags['oneway']=='yes') {
            streetsWithoutBikeInfra.primary['(no name)'] += length;
          } else {
            streetsWithoutBikeInfra.primary['(no name)'] += length * 2
          }
        }
      }
    } else if(feature.properties.tags['highway'] == "secondary" || feature.properties.tags['highway'] == "secondary_link") {
      length = turf.length(feature, {
        units: 'miles'
      })

      if (feature.properties.tags['oneway']=='yes') {
        streetStats.secondary_no_bikeinfra += length
      } else {
        streetStats.secondary_no_bikeinfra += length * 2
      }
      if(Object.keys(feature.properties.tags).includes('name') == true) {
        if(Object.keys(streetsWithoutBikeInfra.secondary).includes(feature.properties.tags['name']) == false) {

          if (feature.properties.tags['oneway']=='yes') {
            streetsWithoutBikeInfra.secondary[feature.properties.tags['name']] = length;
          } else {
            streetsWithoutBikeInfra.secondary[feature.properties.tags['name']] = length * 2
          }
        } else {

          if (feature.properties.tags['oneway']=='yes') {
            streetsWithoutBikeInfra.secondary[feature.properties.tags['name']] += length;
          } else {
            streetsWithoutBikeInfra.secondary[feature.properties.tags['name']] += length * 2
          }
        }
      } else {
        if(Object.keys(feature.properties.tags).includes('ref') == true) {
          if(Object.keys(streetsWithoutBikeInfra.secondary).includes(feature.properties.tags['ref']) == false) {

              if (feature.properties.tags['oneway']=='yes') {
                streetsWithoutBikeInfra.secondary[feature.properties.tags['ref']] = length;
              } else {
                streetsWithoutBikeInfra.secondary[feature.properties.tags['ref']] = length * 2
              }
            } else {

              if (feature.properties.tags['oneway']=='yes') {
                streetsWithoutBikeInfra.secondary[feature.properties.tags['ref']] += length;
              } else {
                streetsWithoutBikeInfra.secondary[feature.properties.tags['ref']] += length * 2
              }
            }

        } else {

          if (feature.properties.tags['oneway']=='yes') {
            streetsWithoutBikeInfra.secondary['(no name)'] += length;
          } else {
            streetsWithoutBikeInfra.secondary['(no name)'] += length * 2
          }
        }
      }
    } else if(feature.properties.tags['highway'] == "tertiary" || feature.properties.tags['highway'] == "tertiary_link") {
      length = turf.length(feature, {
        units: 'miles'
      })

      if (feature.properties.tags['oneway']=='yes') {
        streetStats.tertiary_no_bikeinfra += length
      } else {
        streetStats.tertiary_no_bikeinfra += length * 2
      }
      if(Object.keys(feature.properties.tags).includes('name') == true) {
        if(Object.keys(streetsWithoutBikeInfra.tertiary).includes(feature.properties.tags['name']) == false) {

          if (feature.properties.tags['oneway']=='yes') {
            streetsWithoutBikeInfra.tertiary[feature.properties.tags['name']] = length;
          } else {
            streetsWithoutBikeInfra.tertiary[feature.properties.tags['name']] = length * 2
          }
        } else {

          if (feature.properties.tags['oneway']=='yes') {
            streetsWithoutBikeInfra.tertiary[feature.properties.tags['name']] += length;
          } else {
            streetsWithoutBikeInfra.tertiary[feature.properties.tags['name']] += length * 2
          }
        }
      } else {
        if(Object.keys(feature.properties.tags).includes('ref') == true) {
          if(Object.keys(streetsWithoutBikeInfra.tertiary).includes(feature.properties.tags['ref']) == false) {

              if (feature.properties.tags['oneway']=='yes') {
                streetsWithoutBikeInfra.tertiary[feature.properties.tags['ref']] = length;
              } else {
                streetsWithoutBikeInfra.tertiary[feature.properties.tags['ref']] = length * 2
              }
            } else {

              if (feature.properties.tags['oneway']=='yes') {
                streetsWithoutBikeInfra.tertiary[feature.properties.tags['ref']] += length;
              } else {
                streetsWithoutBikeInfra.tertiary[feature.properties.tags['ref']] += length * 2
              }
            }

        } else {

          if (feature.properties.tags['oneway']=='yes') {
            streetsWithoutBikeInfra.tertiary['(no name)'] += length;
          } else {
            streetsWithoutBikeInfra.tertiary['(no name)'] += length * 2
          }
        }
      }
    }
  }
}



function calcStreetLTS(feature) {

}
