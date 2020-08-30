const w = 840;
        const h = 500;
        

        const req = new XMLHttpRequest();
        req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
        req.send();
        req.onload = function () {
        const json = JSON.parse(req.responseText);

        const div = d3.select("#graph")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", 0);
        const svg = d3.select("#graph")
                .append("svg")
                .attr("width", 920 )
                .attr("height", 700)
                .append("g")
  .attr("transform", "translate("+60+","+100+")");
        
        json.forEach(function(d) {
                var parsedTime = d.Time.split(':');
                d.Time = new Date(0, 0, 0, 0, parsedTime[0], parsedTime[1]);
        });

        var year = json.map(i => i.Year); 
        var time = json.map(i => i.Time);

        const yearScale = d3.scaleLinear()
                .domain([d3.min(json, i => i.Year-1),d3.max(json, i => i.Year+1)])
                .range([0, w]);

        var timeScale = d3.scaleTime()
                .domain(d3.extent(time,d=>d))
                .range([0, h]);

var timeFormat = d3.timeFormat("%M:%S");

var yearAxis = d3.axisBottom(yearScale).tickFormat(d3.format("d"));
var timeAxis = d3.axisLeft(timeScale).tickFormat(timeFormat);


var color = d3.scaleOrdinal(d3.schemeCategory10);
svg.append("g")
    .attr("class", "x axis")
    .attr("id","x-axis")
    .attr("transform", "translate(0," + h + ")")
    .call(yearAxis)
    ;

  svg.append("g")
    .attr("class", "y axis")
    .attr("id","y-axis")
    .call(timeAxis);

    svg.selectAll("circle")
       .data(json)
       .enter()
       .append("circle")
       .attr("class","dot")
       .attr("cx", (d) => yearScale(d.Year))
       .attr("cy",(d) => timeScale(d.Time))
       .attr("r", (d) => 4)
       .attr("data-xvalue",d=>d.Year)
       .attr("data-yvalue",d=>d.Time)
       .style("fill",(d) => color(d.Doping != "" ))
       .on("mouseover", function(d) {
      div.style("opacity", .9);
      div.attr("data-year", d.Year)
      div.html('Name:'+d.Name+ '<br>'+ 
                                 'Nationality:'+d.Nationality+ '<br>'+
                                 'Year:'+d.Year+' '+'Time:'+timeFormat(d.Time)
                                 +'<br>'+'<br>'+
                                 d.Doping)
                        
                        .style("left", (d3.event.pageX) +4+ "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      div.style("opacity", 0);
    });

     var legendContainer = svg.append("g")
        .attr("id", "legend");
  
  var legend = legendContainer.selectAll("#legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend-label")
    .attr("transform", function(d, i) {
      return "translate(0," + (h/2 - i * 20) + ")";
    });

  legend.append("rect")
    .attr("x", w - 10)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", color);

  legend.append("text")
    .attr("x", w - 24)
    .attr("y", 9)
    .style("text-anchor", "end")
    .text(function(d) {
      if (d) return "Riders with doping allegations";
      else {
        return "No doping allegations";
      };
    });
                
    
};