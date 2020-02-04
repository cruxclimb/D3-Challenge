// define SVG area dimensions
// define the chart's margins as an object
var svgWidth = 900;
var svgHeight = 600;
var margin = { 
    top: 100, 
    right: 50, 
    bottom: 100, 
    left: 50 
};

// define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


// append a group to the SVG area and shift ('translate') it to the right and down to adhere to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// initial parameters
var dataXaxis = "poverty";
var dataYaxis = "healthcare";

// data from CSV
var file = "assets/data/data.csv"
console.log(d3.csv(file))

d3.csv("assets/data/data.csv").then(function(data) {
    // this visualize function would contain all of the code that renders the plot
    successHandle(data);
})


function successHandle(data) {
    // parse Data
    data.forEach(function(data) {
        data.state = data.state;
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // scale functions
    var xLinearScale = xScale(data, dataXaxis);
    // console.log(xLinearScale)
    var yLinearScale = yScale(data, dataYaxis);

    // initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var xLabel = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "healthcare")
        .attr("class", "axis-text")
        .classed("active", true)
        .classed("inactive", false)
        .style("font-size", "14px")
        .text("Lacks Healthcare (%)");

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    var yLabel = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - height / 2)
        .attr("value", "poverty")
        .attr("class", "axis-text")
        .classed("active", true)
        .classed("inactive", false)
        .style("font-size", "14px")
        .text("In Poverty(%)")

    var circleRadius = 15;

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[dataXaxis]))
        .attr("cy", d => yLinearScale(d[dataYaxis]))
        .attr("r", circleRadius)
        .attr("fill", "purple")
        .style("stroke", "yellow")
        .attr("opacity", ".6")
        .text(function(d) {
            return d.abbr;
        })

    // append state abbreviations to circles
    var stateAbbreviate = chartGroup.selectAll("texts")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[dataXaxis]))
        .attr("y", d => yLinearScale(d[dataYaxis]))
        .attr("class", "stateText")
        .style("font-size", "10px")
        // .attr("text-anchor", "middle")
        .text(function(d) {
            return d.abbr;
        })

    // axis labels
    var xLabel = "Lacks Healthcare(%)"
    var yLabel = "In Poverty (%)"

    // create tooltips, assign it a class
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`<b>${d["state"]}</b><br>${xLabel} <b>${d[dataXaxis]}</b><br>${yLabel} <b>${d[dataYaxis]}</b>`)
        });

    stateAbbreviate.call(toolTip);
    stateAbbreviate.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    return stateAbbreviate;

    // function for x-scale 
    function xScale(data, dataXaxis) {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[dataXaxis]) * .75,
                d3.max(data, d => d[dataXaxis])
            ])
            .range([0, width]);
        return xLinearScale;
    }

    // function for y-scale 
    function yScale(data, dataYaxis) {
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[dataYaxis]) * .75,
                d3.max(data, d => d[dataYaxis])
            ])
            .range([height, 0]);
        return yLinearScale;
    }
}