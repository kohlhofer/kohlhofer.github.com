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
        console.log('Country ID:', d.id); // Debug log
        const countryClass = livedCountries.includes(d.id) ? 'country lived' :
                           visitedCountries.includes(d.id) ? 'country visited' :
                           'country';
        console.log('Assigned class:', countryClass); // Debug log
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
      
    // Add city points
    g.selectAll('circle')
      .data(visitedCities)
      .enter()
      .append('circle')
      .attr('class', 'city-point')
      .attr('cx', d => projection(d.coordinates)[0])
      .attr('cy', d => projection(d.coordinates)[1])
      .attr('r', 2)
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
    
    svg.attr('viewBox', `0 0 ${width} ${height}`);
      
    projection
      .scale((width + height) / 7)
      .translate([width / 2, height / 2])
      .center([10, 51]); // Maintain center on Germany during resize
      
    g.selectAll('path')
      .attr('d', path);
      
    g.selectAll('circle')
      .attr('cx', d => projection(d.coordinates)[0])
      .attr('cy', d => projection(d.coordinates)[1]);
      
    // Reset transform after resize
    svg.call(zoom.transform, d3.zoomIdentity);
  };

  // Debounce resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeMap, 100);
  });
}); 