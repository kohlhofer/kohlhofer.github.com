// Data for countries and cities
const livedCountries = ['USA', 'GBR', 'AUT', 'DEU']; // Country codes
const visitedCountries = ['FRA', 'ITA', 'ESP', 'NLD', 'CHE', 'CZE', 'HUN', 'HRV', 'SVN', 'SVK']; // Add more as needed

const visitedCities = [
  { name: 'San Francisco', coordinates: [-122.4194, 37.7749] },
  { name: 'London', coordinates: [-0.1276, 51.5074] },
  { name: 'Vienna', coordinates: [16.3738, 48.2082] },
  { name: 'Berlin', coordinates: [13.4050, 52.5200] },
  { name: 'Paris', coordinates: [2.3522, 48.8566] },
  { name: 'Rome', coordinates: [12.4964, 41.9028] },
  { name: 'Barcelona', coordinates: [2.1734, 41.3851] },
  { name: 'Amsterdam', coordinates: [4.9041, 52.3676] },
  { name: 'Prague', coordinates: [14.4378, 50.0755] },
  { name: 'Budapest', coordinates: [19.0402, 47.4979] }
  // Add more cities as needed
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
        if (livedCountries.includes(d.id)) return 'country lived';
        if (visitedCountries.includes(d.id)) return 'country visited';
        return 'country';
      });
      
    // Add city points
    g.selectAll('circle')
      .data(visitedCities)
      .enter()
      .append('circle')
      .attr('class', 'city-point')
      .attr('cx', d => projection(d.coordinates)[0])
      .attr('cy', d => projection(d.coordinates)[1])
      .attr('r', 2);
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