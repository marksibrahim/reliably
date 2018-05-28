// Ajax to update Chart.js data

// Flow Doughnut Chart
var ctx2 = document.getElementById("flow-chart");
var doughnut = new Chart(ctx2, {
  type: 'doughnut',
  data: {
    labels: ["Vibration", "Pressure"],
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
      text: 'Flow Monitoring'
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
      var labels = ["Vibration", "Pressure"];
      // update doughnut chart
      doughnut.data.datasets[0].data = values;
      doughnut.data.datasets[0].labels = labels;
      doughnut.update();
      // update excpected value
      var expectedFlow = data["expect_flow"].toFixed(2);
      $('#expected-flow').html("Expected Flow (l) " + expectedFlow);
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
      data: [
{x: new Date("2018-05-28 21:37:30.789132"), y: 38.283820},
{x: new Date("2018-05-28 21:38:20.278645"), y: 38.283820},
{x: new Date("2018-05-28 21:39:22.420759"), y: 38.283820},
{x: new Date("2018-05-28 21:40:36.538167"), y: 38.283820},
{x: new Date("2018-05-28 21:41:44.340870"), y: 38.283820},
{x: new Date("2018-05-28 21:43:35.465419"), y: 38.283820},
{x: new Date("2018-05-28 21:47:19.118978"), y: 38.283820},
{x: new Date("2018-05-28 21:48:31.943663"), y: 38.283820},
{x: new Date("2018-05-28 21:49:27.901153"), y: 38.283820},
{x: new Date("2018-05-28 21:50:37.455125"), y: 38.283820},
{x: new Date("2018-05-28 21:51:56.895285"), y: 38.283820},
{x: new Date("2018-05-28 21:53:38.605759"), y: 38.283820},
{x: new Date("2018-05-28 21:57:28.203300"), y: 38.283820},
{x: new Date("2018-05-28 21:58:31.093361"), y: 38.283820},
{x: new Date("2018-05-28 21:59:27.856089"), y: 38.283820},
{x: new Date("2018-05-28 22:02:35.939002"), y: 38.283820},
{x: new Date("2018-05-28 22:03:38.495455"), y: 38.283820},
{x: new Date("2018-05-28 22:04:22.636956"), y: 38.283820},
{x: new Date("2018-05-28 22:07:41.658488"), y: 38.283820},
{x: new Date("2018-05-28 22:08:32.764427"), y: 38.283820},
{x: new Date("2018-05-28 22:09:19.767648"), y: 38.283820},
{x: new Date("2018-05-28 22:11:53.072420"), y: 38.283820},
{x: new Date("2018-05-28 22:11:58.841065"), y: 38.283820},
{x: new Date("2018-05-28 22:13:31.401345"), y: 38.283820},
{x: new Date("2018-05-28 22:17:20.496659"), y: 38.283820},
{x: new Date("2018-05-28 22:18:18.277761"), y: 38.283820},
{x: new Date("2018-05-28 22:19:21.612603"), y: 38.283820},
{x: new Date("2018-05-28 22:20:50.220123"), y: 38.283820},
{x: new Date("2018-05-28 22:21:43.087872"), y: 38.283820},
{x: new Date("2018-05-28 22:23:31.967625"), y: 38.283820}
    ],
      lineTension: 0,
      backgroundColor: 'transparent',
      borderColor: '#007bff',
      borderWidth: 0.2,
      pointRadius: 4,
      pointBackgroundColor: '#26A65B'
    }]
  },
  options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: false
              }
          }],
          xAxes: [{
              type: 'time',
              time: {
                  unit: 'minute',
                  unitStepSize: 5,
                  displayFormats: {
                      'minute': 'mm:ss'
                  }
              },
              scaleLabel: {
                  labelString: 'minutes',
                  display: true
              }
          }],
    legend: {
      display: true,
        }
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
      console.log("Power Chart ");
      console.log(data);
      // transform data into arrays for chart
      var values = [];
      var colors = [];

      // get sorted keys and associated values
      Object.keys(data).sort().forEach(function(key) {
          var xDate = new Date(key);
          var value = {x: xDate, y: data[key]["power_consumption"]};
          values.push(value);

          if (data[key]["status"] == "green") {
            colors.push("#26A65B");
          } else {
            colors.push("#F03434");
          }
      });

      // update power chart
      powerChart.data.datasets[0].data = values;
      powerChart.data.datasets[0].pointBackgroundColor = colors;
      powerChart.update();

      // update anomaly status
      var lastDate = Object.keys(data).sort().slice(-1);
      if (data[lastDate]["status"] == "green") {
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
            text: 'Reliability Modeling'
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
            $('#lambda').html('<b>&lambda;</b> = ' + lambdaVal);
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
 updateFlowChart();
 updatePowerChart();
 updateTTFChart();
}, 2000);
