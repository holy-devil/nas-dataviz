var marks_data, marks_headers, dataM, dataS, dataO, dataR,h;
      	let wart = document.getElementById("cover").clientWidth;
      	h=300;
      	let svgContainer1 = d3.select("#cover").append("svg").attr("width", wart).attr("height",h);
		d3.csv('datasets/nas/StudentDistributionByMarks.csv', function(error, data) {
			 console.log("1. in csv"+marks_data);
	    if (error) {
	        alert("File Not Found: datasets/nas/StudentDistributionByMarks.csv");
	    }
	    // Converting data to labels and numbers from CSV strings
	    marks_data = data.map(function (d){
        // console.log(d[corr_headers[1]]); Accessing the data dynamically

        return {

            Marks: +d.Marks,
            MathsStudent : +d.MathsStudent,
            ScienceStudent : +d.ScienceStudent,
            SocialStudent : +d.SocialStudent,
            ReadingStudent : +d.ReadingStudent
        	};
    	});

    	 // Getting CSV headers
	    marks_headers = d3.keys(data[0]); 
	    console.log("2. exiting csv"+marks_data);
	    drawwaves();
	});

	function drawwaves(){
  		dataM = [];
            dataS = [];
            dataO = [];
            dataR = [];
            console.log("3. initialize for k pehele bitch :  "+dataM);

              for (k in marks_data){
                //console.log("here"+marks_data[k].MathsStudent);
                dataM.push(marks_data[k].MathsStudent);
                dataS.push(marks_data[k].ScienceStudent);
                dataO.push(marks_data[k].SocialStudent);
                dataR.push(marks_data[k].ReadingStudent);
              }
  		var start = Date.now();

		var lines = [ ];

		var n = 4;
		var m = 100;

		for (i in d3.range(n))
		{
		    var speed = .001 * i * 4;
		    if(i==0)
                height = dataM;
              else if (i==1)
                height = dataS;
              else if (i==2)
                height = dataO;
              else
                height = dataR;
		    var data = d3.range(m) 
		    lines.push({ 
		        //radius: 65*i, 
		        width: 6, 
		        height: height,
		        speed: speed,
		        //speed: speed_scale(i),
		        index: i,
		        data: data
		    })

		}

		var xscale = d3.scaleLinear()
		    .domain([0,m])
		    .range([0, wart]);

		var yscale = d3.scaleLinear()
		    .domain([0,6000])
		    .range([0, h]);

		var omega = -.22
		function line_maker( data, speed )
		{
		    var freq = Math.PI*.4 + 3 * omega * data.index // * 3000
		    var svgline = d3.line()
		    .x(function(d,i)
		    { 
		        return xscale(d);
		    })
		    .y(function(d,i)
		    {
		        var theta = freq * d/m * Math.PI * 4 
		        //console.log("sin", Math.sin(theta), d)
		        var y = data.height[d] * 0.3 * (Math.sin(theta +  .05 * speed * .18 )); //(n-data.index) *
		        //console.log ("y", y)
		        return yscale(y);
		    })
		    .curve(d3.curveBasis)
		    return svgline(data.data);
		}

		var spacing = 25;
		var defs = svgContainer1.append("defs");

		var gradient = defs.append("linearGradient")
		   .attr("id", "svgGradient0")
		   .attr("x1", "0%")
		   .attr("x2", "100%")
		   .attr("y1", "0%")
		   .attr("y2", "100%");

		gradient.append("stop")
		   .attr('class', 'start')
		   .attr("offset", "0%")
		   .attr("stop-color", "#DA4453")
		   .attr("stop-opacity", 1);

		gradient.append("stop")
		   .attr('class', 'end')
		   .attr("offset", "100%")
		   .attr("stop-color", "#89216B")
		   .attr("stop-opacity", 1);

		var gradient1 = defs.append("linearGradient")
		   .attr("id", "svgGradient1")
		   .attr("x1", "0%")
		   .attr("x2", "100%")
		   .attr("y1", "0%")
		   .attr("y2", "100%");

		gradient1.append("stop")
		   .attr('class', 'start')
		   .attr("offset", "0%")
		   .attr("stop-color", "#007991")
		   .attr("stop-opacity", 1);

		gradient1.append("stop")
		   .attr('class', 'end')
		   .attr("offset", "100%")
		   .attr("stop-color", "#78ffd6")
		   .attr("stop-opacity", 1);

		 var gradient2 = defs.append("linearGradient")
		   .attr("id", "svgGradient2")
		   .attr("x1", "0%")
		   .attr("x2", "100%")
		   .attr("y1", "0%")
		   .attr("y2", "100%");

		gradient2.append("stop")
		   .attr('class', 'start')
		   .attr("offset", "0%")
		   .attr("stop-color", "#4568DC")
		   .attr("stop-opacity", 1);

		gradient2.append("stop")
		   .attr('class', 'end')
		   .attr("offset", "100%")
		   .attr("stop-color", "#B06AB3")
		   .attr("stop-opacity", 1);

		var gradient3 = defs.append("linearGradient")
		   .attr("id", "svgGradient3")
		   .attr("x1", "0%")
		   .attr("x2", "100%")
		   .attr("y1", "0%")
		   .attr("y2", "100%");

		gradient3.append("stop")
		   .attr('class', 'start')
		   .attr("offset", "0%")
		   .attr("stop-color", "#ee0979")
		   .attr("stop-opacity", 1);

		gradient3.append("stop")
		   .attr('class', 'end')
		   .attr("offset", "100%")
		   .attr("stop-color", "#ff6a00")
		   .attr("stop-opacity", 1);
			


		function lineEnter(d, i) {

		    //console.log("line enter", d)
		  d3.select(this).selectAll("path.path")
		      .data([d])
		      .enter()
		    .append("svg:path")
		      .attr("class", "path")
		      //.attr("transform", function(_, i) { return "translate(" + [0, h - spacing * d.index] + ")"; })
		    .attr("d", function(d,i) {
		              return line_maker( d, 0 ) 
		            }
		        )
		      .attr("stroke-width", function(e,i) { return e.width;})
		      .attr("stroke","none")
		      .attr("fill", "url(#svgGradient"+i+")" )
		      .attr("opacity",0.8)

		    update_spacing()
		}

		var line = svgContainer1.selectAll("g.line")
		    .data(lines)
		  .enter().append("svg:g")
		    .attr("class", "line")
		    .each(lineEnter);

		var sm = .39 
		function update_spacing()
		{
		    var th = spacing * n;
		    var hscale = d3.scaleLinear()
		        .domain([0, n])
		        .range([0, h])

		    //console.log("th", th, hscale(99))
		    console.log("spacing", spacing)
		    d3.selectAll("g.line path")
		        .attr("transform", function(d, i) { 
		            //console.log("h",h, spacing, d.index);
		            //return "translate(" + [0, th - spacing * d.index] + ")"; 
		            return "translate(" + [0, h/2 - spacing * d.index] + ")"; 
		        })
		}

		var color = d3.scaleLinear()
		    .domain([-1, 1])
		    .interpolate(d3.interpolateRgb)
		    .range(['#fff', '#000'])

		var opacity = d3.scaleLinear()
		    .domain([0, n])
		    .range([1, .4])


		b = 1;
		d3.timer(function() {
		  //if(pause) return false;
		  var elapsed = Date.now() - start
		  var damp = .3

		  rotate = function(d,i) { 
		  var speed = sm * d.speed * elapsed * .1
		    return "rotate(" + speed + ")"; 
		  };

		  line = d3.selectAll("g.line path")
		      .attr("d", function(d,i) {
		             //var speed = a * d.speed * elapsed + .01 * d.index
		             var speed = sm * .08 * elapsed + d.index * 4 
		             return line_maker( d, speed ) 
		        })
		      .attr("stroke-opacity", function(d,i) { return opacity(d.index);})
	
		});	

  	}