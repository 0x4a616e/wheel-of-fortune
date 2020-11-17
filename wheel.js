/*    
MIT License

Copyright (c) 2017 Jeremy Rue

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var d3 = require("d3");

var primarycolor = "#009a3b";

function createWheel(data) {
  var chart = document.getElementById("chart");
  var size = Math.min(chart.offsetHeight, chart.offsetWidth);

  var padding = { top: 40, right: 40, bottom: 80, left: 40 },
    w = size - padding.left - padding.right,
    h = size - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scaleOrdinal(d3.schemeCategory10);

  var pie = d3
    .pie()
    .sort(null)
    .value(d => 1);

  var arc = d3.arc().innerRadius(0).outerRadius(r);

  var svg = d3
    .select("#chart")
    .append("svg")
    .data([data])
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);

  var container = svg
    .append("g")
    .attr("class", "chartholder")
    .attr(
      "transform",
      "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
    );

  var vis = container.append("g");

  // select paths, use arc generator to draw
  var arcs = vis
    .selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

  arcs
    .append("path")
    .attr("fill", (d, i) => color(i))
    .attr("d", (d) => arc(d));

  // add the text
  arcs
    .append("text")
    .attr("transform", function (d) {
      d.innerRadius = 0;
      d.outerRadius = r;
      d.angle = (d.startAngle + d.endAngle) / 2;
      return (
        "rotate(" +
        ((d.angle * 180) / Math.PI - 90) +
        ")translate(" +
        (d.outerRadius - 10) +
        ")"
      );
    })
    .attr("text-anchor", "end")
    .style("font-size", "14px")
    .style("fill", "#FFFFFF")
    .text(function (d, i) {
      return data[i];
    });

  container.on("click", spin);

  //make arrow
  svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (w + padding.left + padding.right) +
        "," +
        (h / 2 + padding.top) +
        ")"
    )
    .append("path")
    .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
    .style("fill", primarycolor);

  //draw spin circle
  container
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style("fill", primarycolor)
    .style("cursor", "pointer");

  //spin text
  container
    .append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style("font-weight", "bold")
    .style("font-size", "30px")
    .style("fill", "#000000");

  function spin(d) {
    container.on("click", null);

    //all slices have been seen, all done
    if (oldpick.length == data.length) {
      container.on("click", null);
      return;
    }

    var ps = 360 / data.length,
      rng = Math.floor(Math.random() * 1440 + 360);

    rotation = Math.round(rng / ps) * ps;

    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? picked % data.length : picked;

    if (oldpick.indexOf(picked) !== -1) {
      d3.select(this).call(spin);
      return;
    } else {
      oldpick.push(picked);
    }

    rotation += 90 - Math.round(ps / 2);

    vis
      .transition()
      .duration(3000)
      .attrTween("transform", rotTween)
      .on("end", function () {
        d3.select("#question h1").text(data[picked]);
        oldrotation = rotation;
        container.on("click", spin);
      });
  }

  function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
      return "rotate(" + i(t) + ")";
    };
  }
}
