queue()
    .defer(d3.json, "http://128.119.243.147:19000/acc")
    .await(makeGraphs);

axcolumn = 'Classifier'
aycolumn = 'Accuracy'

bc = dc.barChart("#accarea");
		
    
function makeGraphs(error, json_projects) {
        var data = json_projects;
   				 data.forEach(function(d) {
        		 	d[aycolumn] = +d[aycolumn];
   					 });


        //Create a Crossfilter instance
        var ndx = crossfilter(data);
  
        bcDimension        = ndx.dimension(function(d){return d[axcolumn];}),
        bcGroup 		 = bcDimension.group().reduceSum(function(d) { return +d[aycolumn]; });
        
        console.log("accuracy");
        
           bc
            .width(500)
            .height(400)
            .margins({left: 50, top: 10, right: 20, bottom: 120})
            .dimension(bcDimension)
            .group(bcGroup)
            .transitionDuration(500)
            .centerBar(false)
            .brushOn(true)
            .gap(5)
            .title(function(d) {
        	return axcolumn +  ": "  + d.key + "\n" +
               aycolumn  + ":" + +d.value ;})
            .x(d3.scale.ordinal())
            .xAxisLabel(axcolumn)
            .yAxisLabel(aycolumn)
           .xUnits(dc.units.ordinal)
            .elasticY(true)
            .xAxis().tickFormat();
            
            bc.ordering(function(d) { return d[axcolumn]; });
    		bc.yAxis().tickFormat(d3.format('.2s'));        		

        bc.render();
    
    
  function chart_redraw(axcolumn , aycolumn)
    {
    	var ndx = crossfilter(data); 
    	bcDimension        = ndx.dimension(function(d){return d[axcolumn];}),
        bcGroup 		 = bcDimension.group().reduceSum(function(d) { return +d[aycolumn]; });
        
        
           bc
            .width(500)
            .height(400)
            .margins({left: 50, top: 10, right: 20, bottom: 120})
            .dimension(bcDimension)
            .group(bcGroup)
            .transitionDuration(500)
            .centerBar(false)
            .brushOn(true)
            .gap(5)
            .title(function(d) {
        	return axcolumn +  ": "  + d.key + "\n" +
               aycolumn  + ":" + +d.value ;})
            .x(d3.scale.ordinal())
            .xAxisLabel(axcolumn)
            .yAxisLabel(aycolumn)
           .xUnits(dc.units.ordinal)
            .elasticY(true)
            .xAxis().tickFormat();
            
            bc.ordering(function(d) { return d[axcolumn]; });
    		bc.yAxis().tickFormat(d3.format('.2s'));        		
    	
    	
   } 
   	  
  select = d3.selectAll('#select-operation').on('click',function() {
  
    console.log("inside radio")
    aycolumn = d3.select('input[name="operation"]:checked').node().value
    console.log(aycolumn)
    chart_redraw(axcolumn,aycolumn);
    bc.redraw();  
   });    
        
};