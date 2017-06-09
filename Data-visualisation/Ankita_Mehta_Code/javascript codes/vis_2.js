var bchart = dc.barChart("#barchart");        
var pchart = dc.pieChart("#pie");
var schart = dc.seriesChart('#scat');

var q = queue()
    .defer(d3.json, "http://128.119.243.147:19000/not_encoded");

q.await(function (error, json_projects) {

xcolumn = "occupation"
ycolumn = "capital-gain"
    
        
var data = json_projects;
    
	data.forEach(function(d) {
    	d[ycolumn] = +d[ycolumn];
         
   });
        

	//Create a Crossfilter instance-?
	var ndx = crossfilter(data);
  
        var sexDim = ndx.dimension(function(d) { return d[xcolumn];});
        var bcGroup = sexDim.group().reduce(function(p, v) {
                  p[v.income] = (p[v.income] || 0) +  1
                  return p;
              }, function(p, v) {
                  p[v.income] = (p[v.income] || 0) - 1;
                  return p;
              }, function() {
                  return {};
              });
          
        
        console.log("here1");
        
       function sel_stack(i) 
           {
              return function(d) {
                  return d.value[i];
              };
           }
		
        bchart
            .width(550)
            .height(400)
            .margins({left: 50, top: 100, right: 20, bottom: 80})
            .dimension(sexDim)
            .group(bcGroup,"<=50K",sel_stack('<=50K'))
            .centerBar(false)
            .brushOn(true)
            .title(function(d) {
        	return xcolumn +  ": "  + d.key + "\n" +
               "Income <=50K: " +  +(d.value['<=50K']) + "\n" + 
               "Income >50k: " +  +(d.value['>50K']) ;})
            .groupBars(true)
            .groupGap(10)
            .x(d3.scale.ordinal())
            .xAxisLabel(xcolumn)
            .yAxisLabel("Total ")
            .xUnits(dc.units.ordinal)
            .elasticY(false)
            .renderLabel(false)
            .xAxis().tickFormat();
            
          bchart.yAxis().tickFormat(d3.format(".2s"));
        
          bchart.legend(dc.legend().x(350).y(20).itemHeight(10).gap(5).horizontal(1).legendWidth(140).itemWidth(70));
          //dc.override(bchart, 'legendables', function() 
          //{
           //   var items = bchart._legendables();
            //  return items.reverse();
          //});

           bchart.stack(bcGroup, ">50K", sel_stack('>50K'));


		var pDimension =  ndx.dimension(function(d){return d[xcolumn];})
        var pGroup = pDimension.group().reduceCount(); 
       
       pchart
             .width(550)
          .height(400)
          .radius(125)
          .slicesCap(20)
          //.externalLabels(50)
          //.externalRadiusPadding(50)
          //.drawPaths(true)
          .cy([210])
          .dimension(pDimension)
          .group(pGroup)
          .renderTitle(true)
          .colors(d3.scale.category10())
          .minAngleForLabel(0)
          .externalLabels(25)
           .legend(dc.legend().x(430).y(20).itemHeight(10).gap(6).horizontal(0).legendWidth(130));//.itemWidth(80)); 
          
          pchart.on('pretransition', function(pchart) {
          pchart.selectAll('text.pie-slice')
             //.text('')
            //.append('tspan')
              .text(function(d) { return d.name; })
              .append('tspan')
             // .attr('text-anchor', 'end')
              .text( function(d){ return Math.round((d.endAngle - d.startAngle) / Math.PI * 50) + '%';} )}); 
              
              
     
		var scDimension   = ndx.dimension(function(d) {return [d.income, d[xcolumn],+d[ycolumn]];})
        var scGroup 		 = scDimension.group();//.reduceCount(function(d) { return +d[ycolumn]; });
                
        var dom = data.map(function (d) {return +d[ycolumn]; });	
		
		minimum = d3.min(dom);
		maximum = scGroup.top(Infinity)[0].value;
		
		console.log(minimum,maximum);
		        
		var symbolScale = d3.scale.ordinal().range(d3.svg.symbolTypes);
  		var symbolAccessor = function(d) { return symbolScale(d.key[0]); };
  
      var subChart = function(c) {
    return dc.scatterPlot(c)
       .symbol(symbolAccessor)
        .symbolSize(8)
        .highlightedSize(10)
  		};
  		      
  schart
    .width(600)
    .height(400)
    .chart(subChart)
    .margins({left: 50, top: 100, right: 20, bottom: 80})
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .brushOn(false)
    .yAxisLabel(ycolumn)
    .xAxisLabel(xcolumn)
    .clipPadding(10)
    .elasticY(true)
    .dimension(scDimension)
    .group(scGroup)
    .mouseZoomable(false)
   .title(function(d) {
        	return xcolumn +  ": "  + d.key[1] + "\n" + ycolumn + ": " + d.key[2] + "\n" +  "income : " + d.key[0];})
    .shareTitle(true) // allow default scatter title to work
    .seriesAccessor(function(d) {return d.key[0];})
    .keyAccessor(function(d) {return d.key[1];})
    .valueAccessor(function(d) {return +d.key[2];})
    .legend(dc.legend().x(350).y(20).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70));
    schart.yAxis().tickFormat(d3.format(".2s"));   
        
    dc.renderAll();     
     
      
function chart_redraw(xcolumn , ycolumn)
    {
    	var ndx = crossfilter(data);
  
        var sexDim = ndx.dimension(function(d) { return d[xcolumn];});
        var bcGroup = sexDim.group().reduce(function(p, v) {
                  p[v.income] = (p[v.income] || 0) +  1
                  return p;
              }, function(p, v) {
                  p[v.income] = (p[v.income] || 0) - 1;
                  return p;
              }, function() {
                  return {};
              });
          
        
        console.log("here1");
        
       function sel_stack(i) 
           {
              return function(d) {
                  return d.value[i];
              };
           }
		
        bchart
            .width(550)
            .height(400)
            .margins({left: 50, top: 100, right: 20, bottom: 100})
            .dimension(sexDim)
            .group(bcGroup,"<=50K",sel_stack('<=50K'))
            .centerBar(false)
            .brushOn(true)
            .title(function(d) {
        	return xcolumn +  ": "  + d.key + "\n" +
               "Income <=50K: " +  +(d.value['<=50K']) + "\n" + 
               "Income >50k: " +  +(d.value['>50K']) ;})
            .groupBars(true)
            .groupGap(10)
            .x(d3.scale.ordinal())
            .xAxisLabel(xcolumn)
            .yAxisLabel("Total ")
            .xUnits(dc.units.ordinal)
            .elasticY(false)
            .renderLabel(false)
            .xAxis().tickFormat();
            
          bchart.yAxis().tickFormat(d3.format(".2s"));
        
          bchart.legend(dc.legend().x(350).y(20).itemHeight(10).gap(5).horizontal(1).legendWidth(140).itemWidth(70));
          //dc.override(bchart, 'legendables', function() 
          //{
           //   var items = bchart._legendables();
            //  return items.reverse();
          //});

           bchart.stack(bcGroup, ">50K", sel_stack('>50K'));


		var pDimension =  ndx.dimension(function(d){return d[xcolumn];})
        var pGroup = pDimension.group().reduceCount(); 
       
       pchart
             .width(550)
          .height(400)
          .radius(125)
          .innerRadius(40)
          //.externalLabels(50)
          //.externalRadiusPadding(50)
          //.drawPaths(true)
          .cy(210)
          .dimension(pDimension)
          .group(pGroup)
          .renderTitle(true)
          .colors(d3.scale.category10())
          .minAngleForLabel(0)
          .externalLabels(25)
            .legend(dc.legend().x(430).y(20).itemHeight(10).gap(6).horizontal(0).legendWidth(130));//.itemWidth(80)); 
          
          pchart.on('pretransition', function(pchart) {
          pchart.selectAll('text.pie-slice')
             //.text('')
            //.append('tspan')
              .text(function(d) { return d.name; })
              .append('tspan')
             // .attr('text-anchor', 'end')
              .text( function(d){ return Math.round((d.endAngle - d.startAngle) / Math.PI * 50) + '%';} )}); 
              
              
     
		var scDimension   = ndx.dimension(function(d) {return [d.income, d[xcolumn],d[ycolumn]];})
        var scGroup 		 = scDimension.group();//.reduceCount(function(d) { return +d[ycolumn]; });
                
        var dom = data.map(function (d) {return +d[ycolumn]; });	
		
		minimum = d3.min(dom);
		maximum = scGroup.top(Infinity)[0].value;
		
		console.log(minimum,maximum);
		        
		var symbolScale = d3.scale.ordinal().range(d3.svg.symbolTypes);
  		var symbolAccessor = function(d) { return symbolScale(d.key[0]); };
  
      var subChart = function(c) {
    return dc.scatterPlot(c)
       .symbol(symbolAccessor)
        .symbolSize(8)
        .highlightedSize(10)
  		};
  		      
  schart
    .width(600)
    .height(400)
    .chart(subChart)
    .margins({left: 50, top: 100, right: 20, bottom: 100})
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .brushOn(false)
    .yAxisLabel(ycolumn)
    .xAxisLabel(xcolumn)
    .clipPadding(10)
    .elasticY(true)
    .dimension(scDimension)
    .group(scGroup)
    .mouseZoomable(false)
   .title(function(d) {
        	return xcolumn +  ": "  + d.key[1] + "\n" + ycolumn + ": " + d.key[2] + "\n" + "income : " + d.key[0];})
    .shareTitle(true) // allow default scatter title to work
    .seriesAccessor(function(d) {return d.key[0];})
    .keyAccessor(function(d) {return d.key[1];})
    .valueAccessor(function(d) {return +d.key[2];})
    .legend(dc.legend().x(350).y(20).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70));
    schart.yAxis().tickFormat(d3.format(".2s")); 
    
}
    

    
  select = d3.select('#select-operation_x').on('change',function() 
   {
    		xcolumn = d3.select(this).property('value');
    		chart_redraw(xcolumn,ycolumn);
    		dc.redrawAll();
    });   
 
   select = d3.select('#select-operation_y').on('change',function() 
   {
    		ycolumn = d3.select(this).property('value');
    		chart_redraw(xcolumn,ycolumn);
    		dc.redrawAll();
    }); 
    
  d3.select('#reset').on('click',function() {
  
  //xcolumn = "age"
  //ycolumn = "occupation"
  chart_redraw(xcolumn,ycolumn);
    dc.redrawAll();  
   }); 
});