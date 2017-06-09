var q = queue()
    .defer(d3.json, "http://128.119.243.147:19000/encoded");    
    
    var var0="age";
    var var1="workclass";
    var var2="fnlwgt";
    var var3="educational-num";
    var var4="marital-status";
    var var5="occupation";
    var var6="relationship";
    var var7="race";
    var var8="sex";
    var var9="capital-gain";
    var var10="capital-loss";
    var var11="hours-per-week";
    var var12="origin";
    
    // Define the charts globally so that they don't get redefined across multiple calls to draw_graphs() 
    var scatterplot = dc.seriesChart("#pca");
        //rowChart    = dc.rowChart("#row");  

    // A helper function to get the list of attributes that should be included in the PCA
    function getPCACheckboxValues(){         
      var pcaDimensionCheckboxes=document.getElementsByClassName("pcaDimensions"),
          pcaDimensions=[];
      for(var i=0; i<pcaDimensionCheckboxes.length; i++){
        if(pcaDimensionCheckboxes[i].checked){
          pcaDimensions.push(pcaDimensionCheckboxes[i].value);
        }
      }
      return pcaDimensions;
    }

    // Functions to access the quantities needed to update the PCA scatterplot
    function pcaAccessor(d){return [d.pcaCoords.c1, d.pcaCoords.c2, d.recId,d.income];};
    function pcaAccessorC1(d){return d.pcaCoords.c1;};
    function pcaAccessorC2(d){return d.pcaCoords.c2;};


    // Function that acts as a callback for checkboxes and is used to initialize the page
    function draw_graphs(redrawAll){
      /* Load the data. */
      q.await(function (error, json_projects) {
      dataset = json_projects
      
        dataset.forEach(function(d,i) {
          d[var0]=+d[var0];
          d[var1]=+d[var1];
          d[var2]=+d[var2];
          d[var3]=+d[var3];
          d[var4]=+d[var4];
          d[var5]=+d[var5];
          d[var6]=+d[var6];
          d[var7]=+d[var7];
          d[var8]=+d[var8];
          d[var9]=+d[var9];
          d[var10]=+d[var10];
          d[var11]=+d[var11];
          d[var12]=+d[var12];
          /* Here we're creating a placeholder for the PCA coordinate values. We also need to create a record 
             ID so that when we have the filtered data, we can know which records to update in the full dataset. 
             Later, we'll have a callback that will change the values of c1 and c2, replacing them with the 
             actual PCA components. */
          d.pcaCoords={c1:0,c2:0};
          d.recId=i;
          d.income = +d['income']
        });
    
        // Create a crossfilter index
        var ndx = crossfilter(dataset);

        console.log("pcaaaaaaa")
        /* Create a dimension that groups by (c1,c2,recID), which ensures that every record has a unique group.
           Then, we create the scatterplot, which we'll modify in the callback functions. */
        var pcaDim=ndx.dimension(pcaAccessor),
            pcaGroup=pcaDim.group();
            
         var subChart = function(c) {
    return dc.scatterPlot(c)
       //.symbol(symbolAccessor)
        .symbolSize(5)
        .highlightedSize(10)
  		};
  		   
        scatterplot
          .dimension(pcaDim)
          .margins({left: 70, top: 20, right: 20, bottom: 80})
          .group(pcaGroup)
          .chart(subChart)
          .x(d3.scale.linear().domain([1.1*d3.min(dataset,pcaAccessorC1), 1.1*d3.max(dataset,pcaAccessorC1)]))
          .y(d3.scale.linear().domain([1.1*d3.min(dataset,pcaAccessorC2), 1.1*d3.max(dataset,pcaAccessorC2)]))
          .xAxisLabel("First Principal Component")
          .yAxisLabel("Second Principal Component")
          .width(600).height(400)
          .seriesAccessor(function(d) {return d.key[3];})
          .keyAccessor(function(d) {return +d.key[0];})
          .valueAccessor(function(d) {return +d.key[1];})
          .clipPadding(10)
          //.excludedOpacity(0.5)
          .legend(dc.legend().x(580).y(20).itemHeight(13).gap(4).itemWidth(50));

        /* This is the callback to recompute the PCA in response to changes in the filter/checkboxes. Every chart 
           that can update the crossfilter must either A) specify this function as the callback for the "filtered"
           event, or B) use a callback function that subsequently calls this function. Otherwise, the PCA will not 
           be recomputed on the newly filtered data. */
        function update_pca_coords() {
          /* Retrieve the list of attributes that should be included in the PCA. */
          var pcaDimensions = getPCACheckboxValues();
          /* Get the data that satisfies the current filters. Then, create a PCA object and use it to transform the
             data by representing it on the principal components (this is done using pcaObject.predict()).  */
          var filteredData = pcaDim.top(Infinity),
              pcaData      = filteredData.map(function(d){return pcaDimensions.map(function(e){ return d[e];});}),
              pcaRecIDs    = filteredData.map(function(d){return d.recId;}),
              pcaObject    = new ML.Stat.PCA(pcaData, {}),
              pcaProjData  = pcaObject.predict(pcaData);
          /* For each record in the filtered set, update its PCA coordinates in the dataset. */
          for(var i=0; i<pcaProjData.length; i++){
            var id = pcaRecIDs[i];
            dataset[id].pcaCoords.c1 = pcaProjData[i][0];
            dataset[id].pcaCoords.c2 = pcaProjData[i][1];
          }
          /* Redefine the pca dimension and group to incorporate the newly computed values. */
          pcaDim=ndx.dimension(pcaAccessor);
          pcaGroup=pcaDim.group();
          /* Finally, replace the scatterplot's dimension and group with the new ones. */
          scatterplot
            .dimension(pcaDim).group(pcaGroup)
            .margins({left: 70, top: 20, right: 30, bottom: 80})
            .chart(subChart)
            .x(d3.scale.linear().domain([1.1*d3.min(dataset, pcaAccessorC1), 1.1*d3.max(dataset, pcaAccessorC1)]))
            .y(d3.scale.linear().domain([1.1*d3.min(dataset, pcaAccessorC2), 1.1*d3.max(dataset, pcaAccessorC2)]))
            .seriesAccessor(function(d) {return d.key[3];})
            .keyAccessor(function(d) {return +d.key[0];})
            .valueAccessor(function(d) {return +d.key[1];})
            .legend(dc.legend().x(580).y(20).itemHeight(13).gap(4).itemWidth(50))
            .data(dataset.map(function(d){return {key:pcaAccessor(d), value:1};}));
        };
        
        // Call the update function to get the correct PCA coordinates
        update_pca_coords();
		
		if(redrawAll){
          dc.renderAll();  
        }
        scatterplot.redrawGroup();
      }); 
   }; 
    draw_graphs(true);  