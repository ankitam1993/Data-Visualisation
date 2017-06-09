

series = [["KHM",26],["CAN",163],["CHN",113],["CUB",133],["DOM",97],["ECU",43],["SLV",147],["FRA",36],["DEU",193],["GTM",86],["HTI",69],["HND",1],
["HUN",18],["IND",147],["IRL",36],["ITA",100],["JAM",103],["JPN",89],["LAO",21],["MEX",903],["NIC",48],["PER",45],["PHL",283],["POL",81],["PRT",62],["PRI",175],["KOR",101],["TWN",55],["THA",29],["TTO",26],["USA",41292],["VNM",83]];     

    //[Columbia 82],[holand-netherland,19][Greece,49],,[Outlying-US(Guam-USVI-etc)      22],[England    119],[Hong      28],[Iran,56],[Scotland 20],[Yugoslavia 23]  
    // Datamaps expect data in format:
    // { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
    //   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }
    var dataset = {};

    // We need to colorize every country based on "numberOfWhatever"
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max series-value)
   //console.log(series[1][1]);
    //var onlyValues = [26,163,113,133,97,43,147,36,193,86,69,1,18,147,36,100,103,89,21,903,48,45,283,81,62,175,101,55,29,26,41292,83]; //series.map(function(obj,ind){ return obj[ind]; });
   //console.log(onlyValues);
   var onlyValues = series.map(function(value,index){
        return value[1];
                }) ; 
          
    var minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);
         
    // create color palette function
    // color can be whatever you wish
    var paletteScale = d3.scale.linear()
            .domain([minValue,maxValue])
            .range(["#ff99cc","#02386F","#cc66ff","#996633"]);  

    // fill dataset in appropriate format
    series.forEach(function(item){ //
        // item example value ["USA", 70]
        var iso = item[0],
                value = item[1];
        dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
    });

      // render map
   map = new Datamap({
        element: document.getElementById('world'),
        scope: 'world',
        projection:'orthographic', //mercator', // big world map
        // countries don't listed in dataset will be painted with this color
        projectionConfig: {
                  rotation: [90,-30]
                },
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
        geographyConfig: {
            borderColor: '#DEDEDE',
            highlightBorderWidth: 1,
            // don't change color on mouse hover
            highlightFillColor: function(geo) {
                return geo['fillColor'] || '#F5F5F5';
            },
            // only change border
            highlightBorderColor: '#B7B7B7',
            // show desired information in tooltip
            popupTemplate: function(geo, data) {
                // don't show tooltip if country don't present in dataset
                if (!data) { return ; }
                // tooltip content
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Count: <strong>', data.numberOfThings, '</strong>',
                    '</div>'].join('');
            }
        }
    });
  //draw a legend for this map
            map.legend();
            
            map.graticule();
