// Define url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// Retrieve data from the url
d3.json(url).then(function(data) {
    console.log(data);
  });

// Initiate the function for dropdown selection
function init() {
    // Select the dropdown menu
    let dropdown = d3.select("#selDataset");

    // Fetch data from the URL
    d3.json(url).then((data) => {
        console.log("Data:", data);

        // Extract names from the retrieved data
        let names = data.names;
        console.log("Names:", names);

        // Populate the dropdown with the names
        names.forEach((name) => {
          dropdown.append("option").text(name).property("value", name);
        });

        // Set first name to conduct the dropdown selection on
        let name = names[0];
        console.log("Default Name:", name);

        // Display visualization information
        demographics(name);
        barchart(name);
        bubblegraph(name);
    });
}

// Create the bar chart
function barchart(defaultSample) {
    // Retrieve the data
    d3.json(url).then((data) => {
        console.log("Bar Chart data:", data);

        // Define samples values
        let samples = data.samples;
        console.log("Samples:", samples);

        // Filter sample data
        let filteredData = samples.find(x=>x.id === defaultSample);
        console.log("Filtered Data for Bar Chart:", filteredData);

        // Populate the bar chart\

        //defind the x and y values

        let xaxis = filteredData.sample_values.slice(0, 10).reverse();
        console.log("x-axis: ", xaxis);
        let yaxis = filteredData.otu_ids.slice(0, 10).map((otu_id) => `OTU ${otu_id}`).reverse();
        console.log("y-axis: ", yaxis);
        let text = filteredData.otu_labels.slice(0, 10).reverse();
        console.log("text: ", text);

        // Define values in the right variables
        let trace = [{
            x: xaxis,
            y: yaxis,
            text: text,
            type: "bar",
            orientation: "h"
        }];

        //Write the title of the chart
        let layout = {
          title: "Bar Chart of top ten OTUs"
        }

        // Create and display the bar chart
        Plotly.newPlot("bar", trace, layout);
    });
}

// Create the bubble chart
function bubblegraph(defaultSample) {
    // Fetch data 
    d3.json(url).then((data) => {
        console.log("Data:", data);

        // Identifty the sample values
        let samples = data.samples;
        console.log("Samples:", samples);

        // Filter sample 
        let filteredData = samples.find(x=>x.id === defaultSample);
        console.log("Data for Bubble Graph:", filteredData);

        // Identify the x and y axis
        let xaxis = filteredData.otu_ids;
        let yaxis = filteredData.sample_values;
        let lables = filteredData.otu_labels;
        

        // Define values in the right variables
        let trace = [{
            x: xaxis,
            y: yaxis,
            text: lables,
            mode: "markers",
            marker: {
                size: filteredData.sample_values,
                color: filteredData.otu_ids,
                colorscale: "Forest"
            }
        }];

        //Write the title of the chart
        let layout = {
            title: "Bubble Chart of top ten OTUs present in participants" 
        };

        // Create and display the bubble chart
        Plotly.newPlot("bubble", trace, layout);
    });
}


// Create the demographics panel
function demographics(defaultSample) {
  // Fetch data again
  d3.json(url).then((data) => {
      console.log("Data for demographics:", data);

      // Identify metadata values
      let metadata = data.metadata;
      console.log("Metadata:", metadata);

      // Filter metadata 
      let filteredData = metadata.find(x=>x.id == defaultSample);
      console.log("Filtered Data for demographics panel:", filteredData);

      // Select the sample metadata element
      let sampledata = d3.select("#sample-metadata").html("");

      // Extract key-value pairs from the filtered data and display in the sample metadata
      let entries = Object.entries(filteredData);
      console.log("Entries for Demo:", entries);

      entries.forEach(([key, value]) => {
        sampledata.append("h5").text(`${key}: ${value}`);
      });
  });
}
// Apply option changed function
function optionChanged(defaultSample) {

    console.log(defaultSample); 

    // Allow graphs to change based on the value chosen
    demographics(defaultSample);
    barchart(defaultSample);
    bubblegraph(defaultSample);
}

// Initialize the process
init();