// initialising the WOW animations
var wow = new WOW(
    {
      boxClass:     'wow',      // animated element css class (default is wow)
      animateClass: 'animated', // animation css class (default is animated)
      offset:       0,          // distance to the element when triggering the animation (default is 0)
      mobile:       true,       // trigger animations on mobile devices (default is true)
      live:         true,       // act on asynchronously loaded content (default is true)
    //   callback:     function(box) {
    //     // the callback is fired every time an animation is started
    //     // the argument that is passed in is the DOM node being animated
    //   },
      scrollContainer: null // optional scroll container selector, otherwise use window
    }
  );
wow.init();

var wd = window,
d = document,
e = d.documentElement,
g = d.getElementsByTagName('body')[0],
w = wd.innerWidth || e.clientWidth || g.clientWidth,
h = wd.innerHeight|| e.clientHeight|| g.clientHeight;

/* Heatmap viz */
var nas_data, corr_headers, corr_rows=[];
var min,max;
var groups;
// d3.csv('datasets/nas/CombinedCorrelation.csv', function(error, data) {
d3.csv('datasets/nas/OverviewCorrelationFinal.csv', function(error, data) {
    if (error) {
        alert("File Not Found: datasets/nas/OverviewCorrelationFinal.csv");
    }
    // Storing the data in a global variable
   
    // Converting data to labels and numbers from CSV strings
    nas_data = data.map(function (d){
        // console.log(d[corr_headers[1]]); Accessing the data dynamically
        
        return {
            Subjects: d.Subjects,
            Gender: +d.Gender,
            Age: +d.Age,
            Siblings: +d.Siblings,
            Handicap: +d.Handicap,
            Category: +d.Category,
            FathersEducation: +d.FathersEducation,
            MothersEducation: +d.MothersEducation,
            FathersOccupation: +d.FathersOccupation,
            MothersOccupation: +d.MothersOccupation,
            BelowPoverty: +d.BelowPoverty,
            HelpInStudy: +d.HelpInStudy,
            PrivateTuition: +d.PrivateTuition,
            UseCalculator: +d.UseCalculator,
            UseInternet: +d.UseInternet,
            UseDictionary: +d.UseDictionary,
            ReadOtherBooks: +d.ReadOtherBooks,
            Books: +d.Books,
            ComputerUse: +d.ComputerUse,
            LibraryUse: +d.LibraryUse,
            SameLanguage: +d.SameLanguage,
            Distance: +d.Distance,
            LikeSchool: +d.LikeSchool,
            GiveHomework: +d.GiveHomework,
            CorrectHomework: +d.CorrectHomework,
            WatchTV: +d.WatchTV,
            ReadMagazine: +d.ReadMagazine,
            ReadaBook: +d.ReadaBook,
            PlayGames: +d.PlayGames,
            HelpInHousehold: +d.HelpInHousehold
        }
    });
    //Grouping the factors in broad impact areas
    groups = {
        gId: ["gDemog", "gBehaviour", "gPasstime", "gParents", "gSchool"],
        gSchool: ["ComputerUse","LibraryUse","SameLanguage","Distance","LikeSchool","GiveHomework","CorrectHomework"],
        gPasstime: ["WatchTV","ReadMagazine","ReadaBook","PlayGames","HelpInHousehold"],
        gBehaviour: ["UseCalculator","UseInternet","UseDictionary","ReadOtherBooks","Books"],
        gParents: ["FathersEducation","MothersEducation","FathersOccupation","MothersOccupation","BelowPoverty","HelpInStudy","PrivateTuition"],
        gDemog: ["Gender","Age","Siblings","Handicap","Category"]
    }
    // Text colors for 5 groups
    groupsColour = ["g1","g2","g3","g4","g5"];
    // Getting CSV headers
    corr_headers = d3.keys(data[0]); 
    for (i=0; i<nas_data.length; i++) {
        corr_rows.push(nas_data[i].Subjects);
    }
    console.log(nas_data);
    // Waypoints controllers
    var stickyHeat = new Waypoint.Sticky({
        element: $('#heatFilters'),
        offset: '0%'
      })
       
    studPlot(nas_data);   
    studSubPlot(nas_data);
    heatmapSub(nas_data);
    drawHeatmap(0);
});
// Calculating absolute min max
var minmax = function (data) {
    min = max = d3.min(data, function (d) {return(Math.abs(d[corr_headers[1]]))});
   for (i=1; i<corr_headers.length; i++)
   {
       temp = d3.min(data, function (d) {return(Math.abs(d[corr_headers[i]]))});
       if(temp<min) min = temp;

       temp = d3.max(data, function (d) {return(Math.abs(d[corr_headers[i]]))});
       if(temp>max) max = temp;
   }
}
// Plotting the correlation heatmap
function heatmapSub (data) {
    let wd = document.getElementById("heatmap").clientWidth;
    let marginX = (w-wd)/2;
    let marginY = 10;
    // let ht = h*2;
    let cellw = wd/(corr_rows.length+1);
    let svgContainer = d3.select("#subjects").append("svg").attr("width", wd).attr("height",20);
    $('#subjects').waypoint({
        handler: function(direction) {
            console.log(this.element.id + ' hit');
    let colLabels = svgContainer.append('g').selectAll(".colLabelg").data(corr_rows)
                                .enter()
                                .append("text")
                                .text(function (d) { return d; })
                                .attr("x", function (d, i) { return marginX/2+cellw*(i+1); })
                                .attr("y", marginY)
                                .style("text-anchor", "middle")
                                .style("opacity",0.8)
                                .attr("class",  function (d,i) { return "colLabel heatLabel small c"+i;});
        $("#heatBtn").removeClass("d-none");
        this.destroy();
        },
        offset: '96%'
    })
}
function heatmap (data,id) { 
    minmax(data);
    console.log("Min="+min+" Max="+max);
    let wd = document.getElementById("heatmap").clientWidth;
    let marginX = (w-wd)/2;
    let marginY = 10;
    let cellw = wd/(corr_rows.length+1);
    let cellh = 36;
    let ht = cellh*(groups[groups.gId[id-1]].length+1);
    let svgContainer = d3.select("#"+String(groups.gId[id-1])).append("svg").attr("width", wd).attr("height", ht);
    // let xScale = d3.scaleLinear().domain([0,data.length]).range([0,180]);

    console.log("cellh="+cellh+" cellw="+cellw);
    let colorHeat = d3.scaleLinear().domain([-max,0,max]).range(["#FC466B","white","#3F5EFB"]);
    // adding bg-fill to row categories
    // let rowBg = svgContainer.append('g').selectAll("rowBg").data(corr_headers)
    //                         .enter()
    //                         .append("rect")
    //                         .attr("x", 0)
    //                         .attr("y", function (d, i) { return marginY+cellh*(i)*1; })
    //                         .attrs({width: cellw*1.2, height: cellh})
    //                         .attr("fill", "aliceblue");
    $("#"+String(groups.gId[id-1])).waypoint({
        handler: function(direction) {
            console.log(this.element.id + ' hit');
            let rowLabels = svgContainer.append('g').selectAll(".rowLabelg").data(corr_headers)
                                .enter()                         
                                .filter( function (d, i) {
                                    for (j=0; j<(groups[groups.gId[id-1]].length); j++) {
                                        if (corr_headers[i] === groups[groups.gId[id-1]][j]) {
                                            console.log(d);
                                            return d;
                                        }
                                    }
                                })
                                .append("text")
                                .text(function (d) {if (d!="Subjects") return d;})
                                .attr("x", marginX)
                                .attr("y", function (d, i) { return marginY+cellh*(i)*1; })
                                .style("text-anchor", "end")
                                .style("opacity",0.8)
                                .attr("class", function (d,i) { return "rowLabel heatLabel small textg"+id+" r"+i});
            
            rowLabels.on("mouseover", rowMouseOver).on("mouseout", rowMouseOut);                    
            
            let heatMap = svgContainer.append("g").attr("class","heatg");
     
            // build the heatmap
            for (i=0; i<data.length; i++)
            {
                for (j=1; j<corr_headers.length; j++)
                {   
                    for (k=0; k<(groups[groups.gId[id-1]].length); k++) 
                    {
                        if (corr_headers[j] === groups[groups.gId[id-1]][k]) {
                            heatMap.append("circle")
                                // .style("fill", function(d) {return colorHeat(data[i][corr_headers[j]])})
                                .style("fill", function(d) {
                                    if (data[i][corr_headers[j]] < 0) return "#FC466B"
                                    else return "#3F5EFB"
                                })
                                .attr("cx", marginX/2+(cellw)*(i+1))
                                .attr("cy", marginY+cellh*(k)*1)
                                .attr("r", 0*Math.abs(data[i][corr_headers[j]]))
                                .transition().delay(1000).duration(1500).ease(d3.easeCubic)
                                .attr("r", 150*Math.abs(data[i][corr_headers[j]])) // 50 is the multiplier to scale the data
                                .attr("class", function(d){return "cell "+groups.gId[id-1]+" r"+k+" c"+i});
                        }
                    }
                }
            }
            heatMap.selectAll("circle").on("mouseover", cellMouseOver).on("mouseout", cellMouseOut);
            this.destroy(); // restrict drawing the svg to only once waypoint
        },
        offset: '100%'
    })    
 }
 function rowMouseOver(d,i) {
    if ($(this).hasClass("textg1")) {
        d3.select(this).classed("opaque",true);
        d3.selectAll(".cell.gDemog.r"+i).classed("opaque",true);
        // console.log(this+ " "+i)
    }
    if ($(this).hasClass("textg2")) {
        d3.select(this).classed("opaque",true);
        d3.selectAll(".cell.gBehaviour.r"+i).classed("opaque",true);
    }
    if ($(this).hasClass("textg3")) {
        d3.select(this).classed("opaque",true);
        d3.selectAll(".cell.gPasstime.r"+i).classed("opaque",true);
    }
    if ($(this).hasClass("textg4")) {
        d3.select(this).classed("opaque",true);
        d3.selectAll(".cell.gParents.r"+i).classed("opaque",true);
    }
    if ($(this).hasClass("textg5")) {
        d3.select(this).classed("opaque",true);
        d3.selectAll(".cell.gSchool.r"+i).classed("opaque",true);
    }
 }
function rowMouseOut(d,i) {
    if ($(this).hasClass("textg1")) {
        d3.select(this).classed("opaque",false);
        d3.selectAll(".cell.gDemog.r"+i).classed("opaque",false);
        // console.log(this)
    }
    if ($(this).hasClass("textg2")) {
        d3.select(this).classed("opaque",false);
        d3.selectAll(".cell.gBehaviour.r"+i).classed("opaque",false);
    }
    if ($(this).hasClass("textg3")) {
        d3.select(this).classed("opaque",false);
        d3.selectAll(".cell.gPasstime.r"+i).classed("opaque",false);
    }
    if ($(this).hasClass("textg4")) {
        d3.select(this).classed("opaque",false);
        d3.selectAll(".cell.gParents.r"+i).classed("opaque",false);
    }
    if ($(this).hasClass("textg5")) {
        d3.select(this).classed("opaque",false);
        d3.selectAll(".cell.gSchool.r"+i).classed("opaque",false);
    }
 }
function cellMouseOver(d,i) {
    for (j=0; j<corr_rows.length; j++) {
        if ($(this).hasClass("c"+j))
        d3.select(".colLabel.c"+j).classed("opaque",true);
    } // for highlighting the selected column
    // to get the coloumn no between 0-length of group, use i%len
    function len(n) { return groups[groups.gId[n-1]].length; }
    if ($(this).hasClass("gDemog")) {
        d3.select(this).classed("opaque",true);
        console.log(this+" "+i%len(1))        
        d3.select(".rowLabel.textg1.r"+(i%len(1))).classed("opaque",true);
    }
    if ($(this).hasClass("gBehaviour")) {
        d3.select(this).classed("opaque",true);
        console.log(this+" "+i%len(2))        
        d3.select(".rowLabel.textg2.r"+(i%len(2))).classed("opaque",true);
    }
    if ($(this).hasClass("gPasstime")) {
        d3.select(this).classed("opaque",true);
        console.log(this+" "+i%len(3))        
        d3.select(".rowLabel.textg3.r"+(i%len(3))).classed("opaque",true);
    }
    if ($(this).hasClass("gParents")) {
        d3.select(this).classed("opaque",true);
        console.log(this+" "+i%len(4))        
        d3.select(".rowLabel.textg4.r"+(i%len(4))).classed("opaque",true);
    }
    if ($(this).hasClass("gSchool")) {
        d3.select(this).classed("opaque",true);
        console.log(this+" "+i%len(5))        
        d3.select(".rowLabel.textg5.r"+(i%len(5))).classed("opaque",true);
    }
}
function cellMouseOut(d,i) {
    for (j=0; j<corr_rows.length; j++) {
        if ($(this).hasClass("c"+j))
        d3.select(".colLabel.c"+j).classed("opaque",false);
    }
        d3.select(this).classed("opaque",false);
        // removing highlight from any row label
        $(".rowLabel").removeClass("opaque");

}
// To remove an draw heatmap groupwise on btn click
function removeHeatmap() {
    $("#gDemog svg").remove();
    $("#gBehaviour svg").remove();
    $("#gPasstime svg").remove();
    $("#gParents svg").remove();
    $("#gSchool svg").remove();
}
function drawHeatmap (id) {
    removeHeatmap(); // delete the svg if already drawn on screen
    switch(id) {
        case 1:
            heatmap(nas_data,1);
            break;
        case 2:
            heatmap(nas_data,2);
            break;
        case 3:
            heatmap(nas_data,3);
            break;
        case 4:
            heatmap(nas_data,4);
            break;
        case 5:
            heatmap(nas_data,5);
            break;
        default:
            heatmap(nas_data,1);
            heatmap(nas_data,2);
            heatmap(nas_data,3);
            heatmap(nas_data,4);
            heatmap(nas_data,5);
            break;
    }
}
// Intro student chart
function studPlot(data) {
    let wd = document.getElementById("studplot").clientWidth;
    // let wd = 0.5*w;
    console.log("wd="+wd);
    let marginX = 10;
    let marginY = 10;
    let cellsize = (wd-40)/100;
    let t = 50*100;
    let svgContainer = d3.select("#studplot").append("svg").attr("width", wd).attr("height",20);
    $('#studplot').waypoint({
        handler: function(direction) {
          console.log(this.element.id + ' hit')
    for (i=0; i<100; i++) {
        svgContainer.append("circle").attr("cx", cellsize*(i+1/2)).attr("cy",0).attr("r", 3).style("fill","#B0BEC5").style("opacity",0)
        .transition().delay(i*50).duration(100).ease(d3.easeCubic)
        .attr("cy",marginY).style("opacity",1);
    }
    for (i=0; i<100; i++) {
        if (i<=64) {
            svgContainer.append("circle").attr("cx", cellsize*(i+1/2)).attr("cy",marginY).attr("r", 3).style("fill","#FC466B").style("opacity", 0)
            .transition().delay(t+100).ease(d3.easeCubic)
            .style("opacity", 1);
        }
        if (i>=97) {
            svgContainer.append("circle").attr("cx", cellsize*(i+1/2)).attr("cy",marginY).attr("r", 3).style("fill","#3F5EFB").style("opacity", 0)
            .transition().delay(t+100).ease(d3.easeCubic)
            .style("opacity", 1);
        }
    }
   $("#intro-row .alert").removeClass("d-none");
    this.destroy();
    },
    offset: '100%'
    })
}

function studSubPlot(data) {
    let wd = document.getElementById("studplot").clientWidth;
    // let wd = 0.5*w;
    let marginX = 10;
    let marginY = 20;
    let cellsize = (wd-marginX*2)/4;
    // let t = 50*100;
    let sub = ["Maths","Reading","Science","Social Science"];
    let studTop = [1300,4144,695,631];
    let studFail = [60192,28873,41287,36708];
    let studCount = [92255,93079,90918,89485];
    let svgContainer = d3.select("#studsubplot").append("svg").attr("width", wd).attr("height",100);
    // Adding the subject labels on div hit
    $('#studsubplot').waypoint({
        handler: function(direction) {
          console.log(this.element.id + ' hit')
    svgContainer.selectAll("text").data(sub).enter()
    .append("text")
    .text(function (d) { return d; })
    .attr("x", function (d, i) { return cellsize*(i+1/2); })
    .attr("y", marginY)
    .style("text-anchor", "middle");

    // Adding the student dots
    let dotCellSize = cellsize/21;
    for (i=0; i<sub.length; i++) {
        topstud = Math.round(studTop[i]*100/studCount[i]);
        failstud = Math.round(studFail[i]*100/studCount[i]);
        m = 0;
        console.log("top="+topstud+" fail="+failstud);
        for (j=0; j<5; j++) {
            for (k=0; k<20; k++) {
                m++;
                if (m<=topstud) {
                    svgContainer.append("circle").attr("cx",(i*cellsize)+dotCellSize*(k+1/2)).attr("cy",2*marginY+(j+1/2)*10).attr("r", 0).style("fill","#3F5EFB")
                    .transition().delay(1000).duration(1000).ease(d3.easeCubic)
                    .attr("r",3);
                }
                else if (m>100-failstud) {
                    svgContainer.append("circle").attr("cx",(i*cellsize)+dotCellSize*(k+1/2)).attr("cy",2*marginY+(j+1/2)*10).attr("r", 0).style("fill","#FC466B")
                    .transition().delay(1000).duration(1000).ease(d3.easeCubic)
                    .attr("r",3);
                }
                else {
                    svgContainer.append("circle").attr("cx",(i*cellsize)+dotCellSize*(k+1/2)).attr("cy",2*marginY+(j+1/2)*10).attr("r", 3).style("fill","#B0BEC5")
                    .transition().delay(1000).duration(1000).ease(d3.easeCubic)
                    .attr("r",3);
                }
            }
        }
    }
    this.destroy();
    },
    offset: '100%'
    })
}
/* Heatmap viz ENDS */


/* Bar chart viz */
var dig_data, dig_headers;
d3.csv('datasets/nas/DivergingGraphDataset.csv', function(error, data) {
    if (error) {
        alert("File Not Found: datasets/nas/DivergingGraphDataset.csv");
    }
    // Storing the data in a global variable   
    // Converting data to labels and numbers from CSV strings
    dig_data = data.map(function (d){
        // console.log(d[corr_headers[1]]); Accessing the data dynamically
        
        return {
            Factor: d.Factor,
            Subject: d.Subject,
            Options: d.Options,
            AvgMarksFail: +d.AvgMarksFail,
            StudentPercentFail: +d.StudentPercentFail,
            AvgMarksTop: +d.AvgMarksTop,
            StudentPercentTop: +d.StudentPercentTop
        }
    });
})

// Dot-bar graph
function digBar(data,subject,id) {
    let wd = document.getElementById("digbar").clientWidth;
    let marginX = (w-wd)/2;
    let marginY = 10;
    let cellw = wd/(corr_rows.length+2);
    let cellh = 36;
    let ht = cellh*(groups[groups.gId[id-1]].length+1);
    let svgContainer = d3.select("#"+String(groups.gId[id-1])).append("svg").attr("width", wd).attr("height", ht);
}


/* NON-VIZ code */
// Activate-Deactivate button click
 $("button").on("click", function () {
    $(this).siblings().removeClass("active");
    $(this).addClass("active"); 
 });
