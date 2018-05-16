// Ajax to update Chart.js data

// Flow Doughnut Chart
var ctx2 = document.getElementById("flow-chart");
var doughnut = new Chart(ctx2, {
  type: 'doughnut',
  data: {
    labels: ["vibration", "pressure"],
    datasets: [
      {
        label: "monitored variables",
        backgroundColor: ["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"],
        data: [.20,.70]
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'Monitoring'
    }
  }
});

// Asynchronous Update 
function updateFlowChart() {
  $.ajax({
    url: "/data/flow",
    data: {},
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      // transform data into arrays for chart
      var values = [data["coeff1"], data["coeff2"]];
      var labels = ["vibration", "pressure"];
      // update doughnut chart
      doughnut.data.datasets[0].data = values;
      doughnut.data.datasets[0].labels = labels;
      doughnut.update();
      // update excpected value
      var expectedFlow = data["expect_flow"].toFixed(2);
      $('#expected-flow').html("Expected Flow " + expectedFlow);
    },
    error: function (xhr, status) {
      alert("Sorry, there was a problem!");
    },
    complete: function (xhr, status) {
      //$('#showresults').slideDown('slow')
    }
  });
}


// Power Line Chart
var ctx = document.getElementById("power-chart");
var powerChart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [{
      label: "Power Consumption (hz)",
      data: [{x: new Date("2018-05-15 22:02:28.291601"),
              y: 10},
            {x: new Date("2018-06-15 22:02:28.291601"),
                  y: 20}
      ],
      lineTension: 0,
      backgroundColor: 'transparent',
      borderColor: '#007bff',
      borderWidth: 2,
      pointBackgroundColor: '#007bff'
    }]
  },
  options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: false
              }
          }],
      },
    legend: {
      display: true,
    }
  }
});


// Asynchronous Update
function updatePowerChart() {
  $.ajax({
    url: "/data/power",
    data: {},
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      // transform data into arrays for chart
      var labels = [];
      var values = [];

      // get sorted keys and associated values
      Object.keys(data).sort(compareStrInt).forEach(function(key) {
        if (key != "anomalous") {
          labels.push(key);
          values.push(data[key]);
        }
      });

      // update power chart
      powerChart.data.datasets[0].data = values;
      powerChart.data.datasets[0].labels = labels;
      powerChart.update();

      // update anomaly stats
      if (data["anomalous"] == "green") {
        $('#anomaly-status').html('Status Ok');
        $('#anomaly-status').css({'color': '#009900'});
      }
      else {
        $('#anomaly-status').html('Anomaly Alert');
        $('#anomaly-status').css({'color': '#cc3700'});
      }


    },
    error: function (xhr, status) {
      alert("Sorry, there was a problem updating power chart!");
    },
    complete: function (xhr, status) {
      //$('#showresults').slideDown('slow')
    }
  });
}


// Reliability Chart
var ctx3 = document.getElementById("ttf-chart");
var ttfChart = new Chart(ctx3, {
  type: 'line',
  data: {
      datasets: [{
          label: 'Reliability (%)',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: '#007bff',
        },
      {
          label: 'Failure Time (Years)',
          borderColor: '#ff0000',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          // Changes to scatter plot
          showLine: false,
          pointStyle: 'cross',

        }
      ],
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  },
    options: {
        title: {
            display: true,
            text: 'TTF'
        }
    }
});


// Asynchronous Update
function updateTTFChart() {
    $.ajax({
        url: "/data/ttf",
        data: {},
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
            // transform data into arrays for chart
            var labels = [];
            var reliabilityValues = [];
            var failureValues = [];

            // get sorted keys and associated values
            Object.keys(data["reliability"]).sort(compareStrInt).forEach(function(key) {
                labels.push(key);
                failureValues.push(data["failure"][key]);
                reliabilityValues.push(data["reliability"][key]);
            });

            // update chart values
            ttfChart.data.datasets[0].data = reliabilityValues;
            ttfChart.data.datasets[1].data = failureValues;
            ttfChart.data.labels = labels;
            ttfChart.update();

            // update lambda value
            var lambdaVal = data["lambda"].toFixed(3);
            $('#lambda').html('<b>&lambda;</b> =' + lambdaVal);
        },
        error: function (xhr, status) {
            alert("Sorry, there was a problem updating power chart!");
        },
        complete: function (xhr, status) {
            //$('#showresults').slideDown('slow')
        }
    });
}

function compareStrInt(a, b){
    return a - b
}

// update every 2 seconds
setInterval(function(){
 //updateFlowChart();
 //updatePowerChart();
 //updateTTFChart();
}, 10000);