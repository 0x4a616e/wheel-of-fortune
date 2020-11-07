var d3 = require("d3");

var green = "#009a3b";

window.onload = function () {
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

  //http://bl.ocks.org/jrue/raw/a2aaf36b3c096925ccbf/
  //http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results

  var data = [
    { label: "Delmes, Marco", value: 1, question: "Delmes, Marco" },
    { label: "Bohle, Celia", value: 1, question: "Bohle, Celia" },
    { label: "Schneider, Dennis", value: 1, question: "Schneider, Dennis" },
    { label: "Kiliclar, Bora", value: 1, question: "Kiliclar, Bora" },
    { label: "Hötte, Thomas", value: 1, question: "Hötte, Thomas" },
    { label: "Bell, Marcus", value: 1, question: "Bell, Marcus" },
    { label: "Zohren, Stefan", value: 1, question: "Zohren, Stefan" },
    { label: "Gerlach, Sven", value: 1, question: "Gerlach, Sven" },
    { label: "Ochmann, David", value: 1, question: "Ochmann, David" },
    { label: "Thomas, Michael", value: 1, question: "Thomas, Michael" },
    { label: "Gassen, Jan", value: 1, question: "Gassen, Jan" },
    { label: "Riemer, Tim", value: 1, question: "Riemer, Tim" },
    { label: "Kucay, Markus", value: 1, question: "Kucay, Markus" },
    {
      label: "Schulz, Dennis (VCO)",
      value: 1,
      question: "Schulz, Dennis (VCO)",
    },
    { label: "Cruz, Pedro", value: 1, question: "Cruz, Pedro" },
    { label: "Arends, Michael", value: 1, question: "Arends, Michael" },
    { label: "Shah, Milan", value: 1, question: "Shah, Milan" },
    {
      label: "Freyer-Hirtz, Ulrich",
      value: 1,
      question: "Freyer-Hirtz, Ulrich",
    },
    { label: "Dyck, Sebastian", value: 1, question: "Dyck, Sebastian" },
    { label: "Soyke, Holger", value: 1, question: "Soyke, Holger" },
    { label: "Hu, Xiaopei (VCO)", value: 1, question: "Hu, Xiaopei (VCO)" },
    { label: "Knaub, Anna", value: 1, question: "Knaub, Anna" },
    { label: "Akin, Engin", value: 1, question: "Akin, Engin" },
    { label: "Röhren, Sebastian", value: 1, question: "Röhren, Sebastian" },
    { label: "Dujardin, Marcel", value: 1, question: "Dujardin, Marcel" },
    { label: "Abdulla, Faris", value: 1, question: "Abdulla, Faris" },
    { label: "Maier, Vitali", value: 1, question: "Maier, Vitali" },
    { label: "Soudani, Aziz", value: 1, question: "Soudani, Aziz" },
    { label: "Cimen, Mert", value: 1, question: "Cimen, Mert" },
    { label: "Popov, Dmitry", value: 1, question: "Popov, Dmitry" },
    { label: "Nieuwpoort, Richel", value: 1, question: "Nieuwpoort, Richel" },
    { label: "Schaus, Daniel", value: 1, question: "Schaus, Daniel" },
    { label: "Nia, Arman", value: 1, question: "Nia, Arman" },
  ];

  var pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      return 1;
    });

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
    .text(function (d, i) {
      return data[i].label;
    });

  container.on("click", spin);

  //make arrow
  svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (w +  padding.left +  padding.right) +
        "," +
        (h / 2 + padding.top) +
        ")"
    )
    .append("path")
    .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
    .style("fill", green);

  //draw spin circle
  container
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style("fill", green)
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
    .style("text-color", green);

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
        //mark question as seen
        //d3.select(".slice:nth-child(" + (picked + 1) + ") path").style("fill", "#FFF");

        //populate question
        d3.select("#question h1").text(data[picked].question);

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
};
