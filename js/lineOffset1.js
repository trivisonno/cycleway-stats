
const getLineOffset = (line, distance, { units = 'kilometers' } = {}) => {
    const lineCoords = line.geometry.coordinates;
    const transformAngle = distance < 0 ? -90 : 90;
    if (distance < 0) distance = -distance;

    const offsetLines = [];
    for (let i = 0; i < lineCoords.length - 1; i++) { // Translating each segment of the line to correct position
        const angle = turf.bearing(lineCoords[i], lineCoords[i + 1]) + transformAngle;
        const firstPoint = turf.transformTranslate(turf.point(lineCoords[i]), distance, angle, { units })?.geometry.coordinates;
        const secondPoint = turf.transformTranslate(turf.point(lineCoords[i + 1]), distance, angle, { units })?.geometry.coordinates;
        offsetLines.push([firstPoint, secondPoint]);
    }
    
    const offsetCoords = [offsetLines[0][0]]; // First point inserted
    for (let i = 0; i < offsetLines.length; i++) { // For each translated segment of the initial line
        if (offsetLines[i + 1]) { // If there's another segment after this one
            const firstLine = turf.transformScale(turf.lineString(offsetLines[i]), 2); // transformScale is useful in case the two segment don't have an intersection point
            const secondLine = turf.transformScale(turf.lineString(offsetLines[i + 1]), 2); // Which happen when the resulting offset line is bigger than the initial one
            // We're calculating the intersection point between the two translated & scaled segments
            if (turf.lineIntersect(firstLine, secondLine).features[0]) {
              offsetCoords.push(turf.lineIntersect(firstLine, secondLine).features[0].geometry.coordinates);
            }
        } else offsetCoords.push(offsetLines[i][1]); // If there's no other segment after this one, we simply push the last point of the line
    }

    return turf.lineString(offsetCoords);
};
