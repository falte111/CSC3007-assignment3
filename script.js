let width = 1000, height = 600;

let svg = d3.select("svg")
    .attr("viewBox", "0 0 " + width + " " + height);
// .attr("width", width)
// .attr("height", height);

let singapore = [103.851959, 1.290270] // longitude = x, latitude = y

// List of cities
var cities = [
    { name: "Singapore", longitude: 103.851959, latitude: 1.290270 },
    { name: "London", longitude: -0.118092, latitude: 51.509865 },
    { name: "Tokyo", longitude: 139.839478, latitude: 35.652832 }
]
// Map and projection
// let projection = d3.geoEquirectangular().center(singapore).scale(500); // defines how the geojson map is projected out
let projection = d3.geoEquirectangular();
let geopath = d3.geoPath().projection(projection); // Convert projection to have x and y position
let graticule = d3.geoGraticule()
    .step([10, 10]);
// Load GeoJSON data
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
    console.log(data)



    svg.append("path")
        .datum({ type: "Sphere" })
        .attr("id", "ocean")
        .attr("d", geopath)
        .attr("fill", "lightBlue");
    // Draw the map
    svg.append("g")
        .attr("id", "countries")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", d => geopath(d))
        .attr("class", "countries")
        .on("mouseover", (event, d) => {
            d3.select(".tooltip")
                .text(d.properties.name)
                .style("position", "absolute")
                .style("background", "#fff")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY) + "px");

            let path = d3.select(event.currentTarget);

            path.style("stroke", "red")
                .style("stroke-width", 2)
        })
        .on("mouseout", (event, d) => {
            d3.select(".tooltip")
                .text("");

            let path = d3.select(event.currentTarget);

            path.style("stroke", "none")
        })

    svg.append("g")
        .attr("id", "graticules")
        .selectAll("path")
        .data([graticule()])
        .enter()
        .append("path")
        .attr("d", d => geopath(d))
        .attr("fill", "none")
        .attr("stroke", "#aaa")
        .attr("stroke-width", 0.2);

    // Manual way
    // svg.append("circle")
    // .attr("cx", projection(singapore)[0])
    // .attr("cy", projection(singapore)[1])
    // .attr("r", 5)
    // .attr("fill", "yellow");

    // Data Binding way
    svg.append("g")
        .attr("id", "cities")
        .selectAll("circle")
        .data(cities)
        .enter()
        .append("circle")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", 5)
        .attr("fill", "yellow")

    // Animation    
    let time = Date.now();

    d3.timer(function () {
        let angle = (Date.now() - time) * 0.02;
        projection.rotate([angle, 0, 0]);
        svg.select("g#countries").selectAll("path")
            .attr("d", geopath.projection(projection));
        svg.select("g#graticules").selectAll("path")
            .attr("d", geopath.projection(projection));
        svg.select("g#cities").selectAll("circle")
            .attr("cx", d => projection([d.longitude, d.latitude])[0])
            .attr("cy", d => projection([d.longitude, d.latitude])[1]);
    });

    // svg.select("g#cities").selectAll("circle")
    //     .attr("cx", d => projection([d.longitude, d.latitude])[0])
    //     .attr("cy", d => projection([d.longitude, d.latitude])[1])
    //     .attr("visibility", d => {
    //         var point = {type: 'Point', coordinates: [d.longitude, d.latitude]};
    //         if (geopath(point) == null) {
    //             return "hidden";
    //         } else { 
    //             return "visible";
    //         }
    //     });




})