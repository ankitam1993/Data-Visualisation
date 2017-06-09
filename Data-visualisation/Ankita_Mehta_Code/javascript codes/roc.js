queue()
    .defer(d3.json, "http://128.119.243.147:19000/roc")
    .await(makeGraphs);

ccolumn1 = 'Classifier'
xcolumn1 = 'Fpr'
ycolumn1 = 'Tpr'

lchart = dc.seriesChart("#roc");
		
		    
function makeGraphs(error, json_projects) {
        var data = json_projects;
        data.forEach(function(d) {
                d[xcolumn1] = +d[xcolumn1];
                d[ycolumn1] = +d[ycolumn1];});


        console.log("roc");
        
        var ndx = crossfilter(data);

        var domain = data.map(function (d) {return +d[xcolumn1]; });	
        var domy = data.map(function (d) {return +d[ycolumn1]; });	
		
		minimum = d3.min(domain);
		maximum = d3.max(domain); 
		
		miny = d3.min(domy);
		maxy = d3.max(domy); 
		
		lcDimension        = ndx.dimension(function(d){return [d[ccolumn1], +d[xcolumn1],+d[ycolumn1]];}),
        lcGroup 		 = lcDimension.group();
           
		
        
      lchart
    .width(600)
    .height(400)
    .margins({left: 50, top: 20, right: 20, bottom: 40})
    .chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
    .x(d3.scale.linear().domain([minimum,maximum]))
    .y(d3.scale.linear().domain([miny,maxy]))
    .brushOn(false)
    .yAxisLabel('True Positive Rate')
    .xAxisLabel('False Positive Rate')
    .clipPadding(10)
    //.elasticY(true)
    .dimension(lcDimension)
    .group(lcGroup)
    .title(function(d) {
        	return xcolumn1 +  ": "  + d.key[1] + "\n" +
               ycolumn1 + ": " + d.key[2] ;})
    .mouseZoomable(false)
    .seriesAccessor(function(d) {return d.key[0];})
    .keyAccessor(function(d) {return +d.key[1];})
    .valueAccessor(function(d) {return +d.key[2];})
    .legend(dc.legend().x(350).y(120).itemHeight(13).gap(5).horizontal(0).legendWidth(140).itemWidth(70));
  lchart.yAxis().tickFormat(d3.format(".2s"));

        lchart.render();

};