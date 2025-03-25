// Data for countries and cities
const livedCountries = ['840', '826', '040', '276']; // Numeric codes for USA, GBR, AUT, DEU
const visitedCountries = [
  '124', // Canada
  '076', // Brazil
  '850', // US Virgin Islands
  '840', // Hawaii (part of USA)
  '372', // Ireland
  '826', // Northern Ireland (part of UK)
  '826', // Scotland (part of UK)
  '724', // Spain
  '250', // France
  '528', // Netherlands
  '756', // Switzerland
  '380', // Italy
  '470', // Malta
  '196', // Cyprus
  '300', // Greece
  '348', // Hungary
  '792', // Turkey
  '246', // Finland
  '804', // Ukraine
  '760', // Syria
  '586', // Pakistan
  '360', // Indonesia (Bali)
  '203', // Czech Republic
  '352'  // Iceland
];

// Define the travel path
const travelPath = [
  { from: 'Munich', to: 'Chicago' },
  { from: 'Chicago', to: 'London' },
  { from: 'London', to: 'Salzburg' },
  { from: 'Salzburg', to: 'San Francisco' },
  { from: 'San Francisco', to: 'Cary' }
];

const visitedCities = [
  // North America
  { name: 'Vancouver', coordinates: [-123.1207, 49.2827] },
  { name: 'St. Louis', coordinates: [-90.1994, 38.6270] },
  { name: 'Sacramento', coordinates: [-121.4944, 38.5816] },
  { name: 'New York', coordinates: [-74.0060, 40.7128] },
  { name: 'Kitty Hawk', coordinates: [-75.7057, 36.0646] },
  { name: 'Chicago', coordinates: [-87.6298, 41.8781] },
  { name: 'New Bern', coordinates: [-77.0440, 35.1085] },
  { name: 'Morehead City', coordinates: [-76.7260, 34.7229] },
  { name: 'Atlantic Beach', coordinates: [-76.7404, 34.6990] },
  { name: 'Charlotte', coordinates: [-80.8431, 35.2271] },
  { name: 'Milwaukee', coordinates: [-87.9065, 43.0389] },
  { name: 'Seattle', coordinates: [-122.3321, 47.6062] },
  { name: 'Atlanta', coordinates: [-84.3880, 33.7490] },
  { name: 'Miami', coordinates: [-80.1918, 25.7617] },
  { name: 'Orlando', coordinates: [-81.3789, 28.5383] },
  { name: 'Raleigh', coordinates: [-78.6382, 35.7796] },
  { name: 'Asheville', coordinates: [-82.5515, 35.5951] },
  { name: 'Kansas City', coordinates: [-94.5786, 39.0997] },
  { name: 'Los Angeles', coordinates: [-118.2437, 34.0522] },
  { name: 'Salt Lake City', coordinates: [-111.8910, 40.7608] },
  { name: 'Gary', coordinates: [-87.3464, 41.5934] },
  { name: 'San Francisco', coordinates: [-122.4194, 37.7749] },
  { name: 'Washington DC', coordinates: [-77.0369, 38.9072] },
  { name: 'Cary', coordinates: [-78.7812, 35.7915] },
  
  // Brazil
  { name: 'Rio de Janeiro', coordinates: [-43.1729, -22.9068] },
  { name: 'São Paulo', coordinates: [-46.6333, -23.5505] },
  { name: 'Salvador', coordinates: [-38.5108, -12.9714] },
  { name: 'Belo Horizonte', coordinates: [-43.9542, -19.9167] },
  
  // Hawaii
  { name: 'Honolulu', coordinates: [-157.8583, 21.3069] },
  { name: 'Kahului', coordinates: [-156.4667, 20.8947] },
  
  // UK & Ireland
  { name: 'Dublin', coordinates: [-6.2603, 53.3498] },
  { name: 'Belfast', coordinates: [-5.9301, 54.5973] },
  { name: 'Derry', coordinates: [-7.3093, 54.9966] },
  { name: 'Edinburgh', coordinates: [-3.1883, 55.9533] },
  { name: 'Glasgow', coordinates: [-4.2518, 55.8642] },
  { name: 'London', coordinates: [-0.1276, 51.5074] },
  { name: 'Birmingham', coordinates: [-1.8904, 52.4862] },
  { name: 'Bristol', coordinates: [-2.5879, 51.4545] },
  { name: 'Brighton', coordinates: [-0.1372, 50.8225] },
  
  // Caribbean
  { name: 'St. Thomas', coordinates: [-64.9270, 18.3434] },
  
  // Spain
  { name: 'Madrid', coordinates: [-3.7038, 40.4168] },
  { name: 'Málaga', coordinates: [-4.4213, 36.7213] },
  
  // France
  { name: 'Paris', coordinates: [2.3522, 48.8566] },
  { name: 'Marseille', coordinates: [5.3698, 43.2965] },
  { name: 'Nice', coordinates: [7.2619, 43.7102] },
  { name: 'Rennes', coordinates: [-1.6778, 48.1173] },
  { name: 'Mont Saint-Michel', coordinates: [-1.5115, 48.6361] },
  
  // Netherlands
  { name: 'Amsterdam', coordinates: [4.9041, 52.3676] },
  
  // Switzerland
  { name: 'Zurich', coordinates: [8.5417, 47.3769] },
  { name: 'Geneva', coordinates: [6.1432, 46.2044] },
  { name: 'Bern', coordinates: [7.4474, 46.9480] },
  
  // Italy
  { name: 'Rome', coordinates: [12.4964, 41.9028] },
  { name: 'Milan', coordinates: [9.1859, 45.4642] },
  { name: 'Florence', coordinates: [11.2558, 43.7696] },
  { name: 'Venice', coordinates: [12.3155, 45.4408] },
  { name: 'Naples', coordinates: [14.2471, 40.8518] },
  
  // Malta
  { name: 'Valletta', coordinates: [14.5146, 35.8989] },
  
  // Greece
  { name: 'Athens', coordinates: [23.7275, 37.9838] },
  { name: 'Thessaloniki', coordinates: [22.9408, 40.6403] },
  { name: 'Corfu Town', coordinates: [19.9219, 39.6243] },
  { name: 'Gaios', coordinates: [20.1883, 39.1972] }, // Main town on Paxos
  { name: 'Lakka', coordinates: [20.1333, 39.2167] }, // Paxos
  { name: 'Longos', coordinates: [20.1667, 39.2000] }, // Paxos
  
  // Hungary
  { name: 'Budapest', coordinates: [19.0402, 47.4979] },
  
  // Turkey
  { name: 'Istanbul', coordinates: [28.9784, 41.0082] },
  
  // Finland
  { name: 'Helsinki', coordinates: [24.9384, 60.1699] },
  
  // Ukraine
  { name: 'Odessa', coordinates: [30.7233, 46.4825] },
  
  // Syria
  { name: 'Damascus', coordinates: [36.2765, 33.5138] },
  
  // Pakistan
  { name: 'Karachi', coordinates: [67.0099, 24.8608] },
  { name: 'Islamabad', coordinates: [73.0479, 33.6844] },
  
  // Indonesia (Bali)
  { name: 'Denpasar', coordinates: [115.2126, -8.6500] },
  
  // Czech Republic
  { name: 'Prague', coordinates: [14.4378, 50.0755] },
  
  // Iceland
  { name: 'Reykjavik', coordinates: [-21.8174, 64.1265] },
  
  // Germany
  { name: 'Munich', coordinates: [11.5820, 48.1351] },
  { name: 'Berlin', coordinates: [13.4050, 52.5200] },
  { name: 'Cologne', coordinates: [6.9603, 50.9375] },
  { name: 'Frankfurt', coordinates: [8.6821, 50.1109] },
  { name: 'Hamburg', coordinates: [9.9937, 53.5511] },
  
  // Austria
  { name: 'Vienna', coordinates: [16.3738, 48.2082] },
  { name: 'Salzburg', coordinates: [13.0550, 47.8095] }
];

// Set up the map
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('map-container');
  let width = container.clientWidth;
  let height = container.clientHeight;
  
  // Create SVG
  const svg = d3.select('#map-container')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`);
    
  // Create a group for all map elements that will be transformed together
  const g = svg.append('g');
    
  // Create a projection
  const projection = d3.geoMercator()
    .scale((width + height) / 7)
    .translate([width / 2, height / 2])
    .center([10, 51]); // Center on Germany
    
  // Create a path generator
  const path = d3.geoPath()
    .projection(projection);

  // Function to calculate map bounds
  const calculateMapBounds = () => {
    // Define geographic bounds
    const geoBounds = {
      west: -150,  // Alaska's left edge
      east: 170,   // Right edge of Russia
      north: 75,   // Top of Greenland
      south: -90   // Further south to show all of South America
    };
    
    // Get the pixel bounds of the entire map
    const bounds = [
      projection([geoBounds.west, geoBounds.south]),
      projection([geoBounds.east, geoBounds.north])
    ];
    
    // Calculate the map dimensions
    const mapWidth = Math.abs(bounds[1][0] - bounds[0][0]);
    const mapHeight = Math.abs(bounds[1][1] - bounds[0][1]);
    
    // Calculate the maximum allowed translation to keep the map in view
    const maxTranslateX = Math.max(mapWidth - width, 0);
    const maxTranslateY = Math.max(mapHeight - height, 0);
    
    return {
      x: [-maxTranslateX, maxTranslateX],
      y: [-maxTranslateY, maxTranslateY]
    };
  };

  // Create zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([1, 1]) // Disable zooming
    .translateExtent([[-Infinity, -Infinity], [Infinity, Infinity]]) // Allow unrestricted panning initially
    .on('zoom', (event) => {
      const bounds = calculateMapBounds();
      
      // Constrain the translation
      event.transform.x = Math.min(Math.max(event.transform.x, bounds.x[0]), bounds.x[1]);
      event.transform.y = Math.min(Math.max(event.transform.y, bounds.y[0]), bounds.y[1]);
      
      g.attr('transform', event.transform);
    });
    
  // Apply zoom behavior to SVG
  svg.call(zoom)
    .call(zoom.transform, d3.zoomIdentity); // Start with identity transform
    
  // Load world map data
  Promise.all([
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  ]).then(([world]) => {
    // Convert TopoJSON to GeoJSON
    const countries = topojson.feature(world, world.objects.countries);
    
    // Draw countries
    g.selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', d => {
        const countryClass = livedCountries.includes(d.id) ? 'country lived' :
                           visitedCountries.includes(d.id) ? 'country visited' :
                           'country';
        return countryClass;
      })
      .on('mouseover', (event, d) => {
        const tooltip = d3.select('#tooltip');
        let statusHtml = '';
        if (livedCountries.includes(d.id)) {
          statusHtml = '<div class="tooltip-status lived">Lived here</div>';
        } else if (visitedCountries.includes(d.id)) {
          statusHtml = '<div class="tooltip-status visited">Visited</div>';
        }
        tooltip.style('display', 'block')
          .html(`${d.properties.name}${statusHtml}`);
      })
      .on('mouseout', () => {
        d3.select('#tooltip').style('display', 'none');
      });
      
    // Add travel arcs
    const travelArcs = g.append('g')
      .attr('class', 'travel-arcs');

    // Create a single continuous path through all cities
    const travelPathSVG = d3.path();
    let firstPoint = true;

    // Create a group for city labels
    const cityLabels = g.append('g')
      .attr('class', 'city-labels');

    // Add labels for cities on the path
    const pathCities = travelPath.reduce((cities, segment) => {
      if (!cities.includes(segment.from)) cities.push(segment.from);
      if (!cities.includes(segment.to)) cities.push(segment.to);
      return cities;
    }, []);

    travelPath.forEach((segment, index) => {
      const fromCity = visitedCities.find(city => city.name === segment.from);
      const toCity = visitedCities.find(city => city.name === segment.to);

      if (fromCity && toCity) {
        const from = projection(fromCity.coordinates);
        const to = projection(toCity.coordinates);

        // Create a curved line using SVG path
        const midPoint = [
          (from[0] + to[0]) / 2,
          (from[1] + to[1]) / 2
        ];

        // Calculate control points for the curve
        const dx = to[0] - from[0];
        const dy = to[1] - from[1];
        const dr = Math.sqrt(dx * dx + dy * dy);

        // Increase the curve height for more dramatic arches
        const curveHeight = dr * 0.4;

        if (firstPoint) {
          travelPathSVG.moveTo(from[0], from[1]);
          firstPoint = false;
        }

        travelPathSVG.quadraticCurveTo(
          midPoint[0],
          midPoint[1] - curveHeight,
          to[0],
          to[1]
        );
      }
    });

    // Add the continuous path with animation
    const pathElement = travelArcs.append('path')
      .attr('d', travelPathSVG.toString())
      .attr('class', 'travel-arc')
      .attr('stroke-dasharray', function() {
        return this.getTotalLength();
      })
      .attr('stroke-dashoffset', function() {
        return this.getTotalLength();
      });

    // Animate the path once on load
    pathElement
      .transition()
      .duration(4000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Create labels with background boxes
    pathCities.forEach((cityName, index) => {
      const city = visitedCities.find(c => c.name === cityName);
      if (!city) return;

      const coords = projection(city.coordinates);
      const labelPadding = { x: 8, y: 4 };
      const lineLength = 30;
      const verticalSpacing = 25;
      
      // Create a group for this city's label
      const labelGroup = cityLabels.append('g')
        .attr('class', 'city-label-group');

      // Create temporary text element to measure size
      const tempLabel = labelGroup.append('text')
        .attr('class', 'city-label')
        .text(city.name);

      // Get text dimensions
      const bbox = tempLabel.node().getBBox();

      // Calculate position offsets
      let xOffset, yOffset;
      
      switch(cityName) {
        case 'Munich':
          xOffset = lineLength + 120; // Move far to the right (over Russia)
          yOffset = -40;
          break;
        case 'London':
          xOffset = -lineLength - 40; // Position off the coast of France
          yOffset = 40; // Move down to France's coast level
          break;
        case 'Salzburg':
          xOffset = lineLength + 160; // Move even further right (over Russia)
          yOffset = 20;
          break;
        case 'Chicago':
          xOffset = -lineLength - 10;
          yOffset = -30;
          break;
        case 'San Francisco':
          xOffset = -lineLength - 10;
          yOffset = -20;
          break;
        case 'Cary':
          xOffset = lineLength + 10;
          yOffset = -10;
          break;
        default:
          xOffset = coords[0] < width / 2 ? lineLength : -lineLength;
          yOffset = -10 + (index * verticalSpacing);
      }

      // Remove temporary text element
      tempLabel.remove();

      // Add connecting line first (bottom layer)
      labelGroup.append('line')
        .attr('class', 'city-label-line')
        .attr('x1', coords[0])
        .attr('y1', coords[1])
        .attr('x2', coords[0] + xOffset)
        .attr('y2', coords[1] + yOffset);

      // Add background rectangle second (middle layer)
      labelGroup.append('rect')
        .attr('class', 'city-label-bg')
        .attr('x', coords[0] + xOffset - (xOffset > 0 ? 0 : bbox.width) - labelPadding.x)
        .attr('y', coords[1] + yOffset - (bbox.height / 2) - labelPadding.y)
        .attr('width', bbox.width + (labelPadding.x * 2))
        .attr('height', bbox.height + (labelPadding.y * 2));

      // Create the final text element last (top layer)
      labelGroup.append('text')
        .attr('class', 'city-label')
        .text(city.name)
        .attr('x', coords[0] + xOffset - (xOffset > 0 ? 0 : bbox.width))
        .attr('y', coords[1] + yOffset);
    });

    // Draw cities
    const cities = g.selectAll('circle')
      .data(visitedCities)
      .enter()
      .append('circle')
      .attr('class', d => {
        const isOnPath = travelPath.some(path => 
          path.from === d.name || path.to === d.name
        );
        return `city-point${isOnPath ? ' path-city' : ''}`;
      })
      .attr('cx', d => projection(d.coordinates)[0])
      .attr('cy', d => projection(d.coordinates)[1])
      .attr('r', d => {
        const isOnPath = travelPath.some(path => 
          path.from === d.name || path.to === d.name
        );
        return isOnPath ? 5 : 2.5;
      })
      .on('mouseover', (event, d) => {
        const tooltip = d3.select('#tooltip');
        tooltip.style('display', 'block')
          .html(`${d.name}<div class="tooltip-status visited">Visited</div>`);
      })
      .on('mouseout', () => {
        d3.select('#tooltip').style('display', 'none');
      });
  });
  
  // Handle window resize
  const resizeMap = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    
    // Update SVG viewBox and projection
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    projection
      .scale((width + height) / 7)
      .translate([width / 2, height / 2]);
      
    // Update all paths with new projection
    g.selectAll('path').attr('d', path);
    
    // Update city points
    g.selectAll('circle')
      .attr('cx', d => projection(d.coordinates)[0])
      .attr('cy', d => projection(d.coordinates)[1]);

    // Update travel arcs
    const travelPathSVG = d3.path();
    let firstPoint = true;

    travelPath.forEach((segment) => {
      const fromCity = visitedCities.find(city => city.name === segment.from);
      const toCity = visitedCities.find(city => city.name === segment.to);

      if (fromCity && toCity) {
        const from = projection(fromCity.coordinates);
        const to = projection(toCity.coordinates);
        const midPoint = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
        const dx = to[0] - from[0];
        const dy = to[1] - from[1];
        const dr = Math.sqrt(dx * dx + dy * dy);
        const curveHeight = dr * 0.4;

        if (firstPoint) {
          travelPathSVG.moveTo(from[0], from[1]);
          firstPoint = false;
        }

        travelPathSVG.quadraticCurveTo(
          midPoint[0],
          midPoint[1] - curveHeight,
          to[0],
          to[1]
        );
      }
    });

    g.select('.travel-arcs path').attr('d', travelPathSVG.toString());

    // Update city labels
    const pathCities = travelPath.reduce((cities, segment) => {
      if (!cities.includes(segment.from)) cities.push(segment.from);
      if (!cities.includes(segment.to)) cities.push(segment.to);
      return cities;
    }, []);

    pathCities.forEach((cityName, index) => {
      const city = visitedCities.find(c => c.name === cityName);
      if (!city) return;

      const coords = projection(city.coordinates);
      const labelGroup = g.select(`.city-label-group:nth-child(${index + 1})`);
      const labelPadding = { x: 8, y: 4 };
      const lineLength = 30;
      const verticalSpacing = 25;

      // Calculate position offsets
      let xOffset, yOffset;
      switch(cityName) {
        case 'Munich':
          xOffset = lineLength + 120;
          yOffset = -40;
          break;
        case 'London':
          xOffset = -lineLength - 40;
          yOffset = 40;
          break;
        case 'Salzburg':
          xOffset = lineLength + 160;
          yOffset = 20;
          break;
        case 'Chicago':
          xOffset = -lineLength - 10;
          yOffset = -30;
          break;
        case 'San Francisco':
          xOffset = -lineLength - 10;
          yOffset = -20;
          break;
        case 'Cary':
          xOffset = lineLength + 10;
          yOffset = -10;
          break;
        default:
          xOffset = coords[0] < width / 2 ? lineLength : -lineLength;
          yOffset = -10 + (index * verticalSpacing);
      }

      // Get text dimensions
      const textElement = labelGroup.select('text');
      const bbox = textElement.node().getBBox();

      // Update connecting line
      labelGroup.select('line')
        .attr('x1', coords[0])
        .attr('y1', coords[1])
        .attr('x2', coords[0] + xOffset)
        .attr('y2', coords[1] + yOffset);

      // Update background rectangle
      labelGroup.select('rect')
        .attr('x', coords[0] + xOffset - (xOffset > 0 ? 0 : bbox.width) - labelPadding.x)
        .attr('y', coords[1] + yOffset - (bbox.height / 2) - labelPadding.y)
        .attr('width', bbox.width + (labelPadding.x * 2))
        .attr('height', bbox.height + (labelPadding.y * 2));

      // Update text position
      textElement
        .attr('x', coords[0] + xOffset - (xOffset > 0 ? 0 : bbox.width))
        .attr('y', coords[1] + yOffset);
    });
      
    // Reset transform after resize
    svg.call(zoom.transform, d3.zoomIdentity);
  };

  // Handle resize events immediately without debouncing
  window.addEventListener('resize', resizeMap);
}); 