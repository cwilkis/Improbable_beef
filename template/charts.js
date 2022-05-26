function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var results = resultArray[0];
    console.log(results)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = results.otu_ids;
    //  console.log(otu_ids)
    var otu_labels = results.otu_labels;
     //  console.log(otu_labels)
    var sample_values = results.sample_values;
     // console.log(sample_values)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // var sortedIds = otu_ids.sort((a,b)=>a-b).reverse()
    // var yticks = sortedIds.slice(0,10)
    var yticks = otu_ids.map(id => `OTU ${id}`).slice(0,10);
    console.log(yticks)
    // 8. Create the trace for the bar chart. 
    
    var barData = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks.slice(0,10).reverse(),
      text: otu_labels.reverse(),
      type: "bar",
      orientation: "h"
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    
    };
    // 10. Use Plotly to plot the data with the layout. 
    // Plotly.newPlot("bar", [barData], [barLayout]);


// Bar and Bubble charts
// Create the buildCharts function.
// function buildCharts(sample) {
//   // Use d3.json to load and retrieve the samples.json file 
//   d3.json("samples.json").then((data) => {
    

    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    // Plotly.newPlot("bar", [barData], [barLayout]); 

    // 1. Create the trace for the bubble chart.
    var trace = {
      x: otu_ids,
      y: sample_values, 
      mode: 'markers',
      text: otu_labels,
      marker: {
        color: otu_ids,
        size: sample_values,
      }
    };
    
    var bubbleData = trace
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
    };

    // 3. Use Plotly to plot the data with the layout.
    // Plotly.newPlot("bubble", [bubbleData], [bubbleLayout]); 
//   });
// }

// Create the buildChart function.
// function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  // d3.json("samples.json").then((data) => {
  // console.log(data);

    // Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    // console.log(resultArray)

    // Create a variable that holds the first sample in the array.
    var results = resultArray[0];
    // 2. Create a variable that holds the first sample in the metadata array.
    metadataArray = results.metadata
    // console.log(metadataArray)
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = results.otu_ids;
    //  console.log(otu_ids)
    var otu_labels = results.otu_labels;
     //  console.log(otu_labels)
    var sample_values = results.sample_values;
     // console.log(sample_values)

    // 3. Create a variable that holds the washing frequency.
    var metadataInfo = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var personMetadata = metadataInfo[0];
    var personwfreq = personMetadata.wfreq;
    console.log(personwfreq)

    // Use Plotly to plot the bar data and layout.
    Plotly.newPlot("bar", [barData], barLayout);
    
    // Use Plotly to plot the bubble data and layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: personwfreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: { color: "Blue" },
          bgcolor: "black",
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "purple" },
            { range: [8, 10], color: "green" },
          ],
          threshold: {
            line: { color: "black", width: 4 },
            thickness: 0.75,
            value: personwfreq
          }
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);









});
}