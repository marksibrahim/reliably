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
  {x: new Date("2018-05-16 01:31:48.399868"), y: 78.7321852207695},
  {x: new Date("2018-05-16 01:32:28.006451"), y: 84.7739220937394},
  {x: new Date("2018-05-16 01:33:31.755557"), y: 93.4148855468122},
  {x: new Date("2018-05-16 01:37:35.890943"), y: 92.7501112246886},
  {x: new Date("2018-05-16 01:38:41.931935"), y: 87.3187145835267},
  {x: new Date("2018-05-16 01:39:18.524688"), y: 83.9459839762939},
  {x: new Date("2018-05-16 01:42:07.413043"), y: 93.6270926721817},
  {x: new Date("2018-05-16 01:42:41.117115"), y: 36.1005912542549},
  {x: new Date("2018-05-16 01:43:39.506343"), y: 64.0338830177253},
  {x: new Date("2018-05-16 01:48:47.288461"), y: 86.4204656888561},
  {x: new Date("2018-05-16 01:49:32.826952"), y: 72.5242210841565},
  {x: new Date("2018-05-16 01:50:57.875398"), y: 97.4326178614683},
  {x: new Date("2018-05-16 01:51:56.820319"), y: 65.6340815606297},
  {x: new Date("2018-05-16 01:53:26.382860"), y: 50.0916742133805},
  {x: new Date("2018-05-16 01:57:40.736210"), y: 0.0},
  {x: new Date("2018-05-16 01:58:13.508760"), y: 0.0},
  {x: new Date("2018-05-16 01:59:18.121183"), y: 0.0},
  {x: new Date("2018-05-16 02:02:54.163742"), y: 85.6979317724557},
  {x: new Date("2018-05-16 02:03:54.334841"), y: 81.4701735332754},
  {x: new Date("2018-05-16 02:05:07.661138"), y: 76.5991387672235},
  {x: new Date("2018-05-16 02:07:35.692066"), y: 74.5198938842168},
  {x: new Date("2018-05-16 02:08:25.864718"), y: 77.1668506752846},
  {x: new Date("2018-05-16 02:09:25.220395"), y: 80.2071187356936},
  {x: new Date("2018-05-16 02:11:55.978488"), y: 72.434085303072},
  {x: new Date("2018-05-16 02:12:08.540060"), y: 109.13305125659},
  {x: new Date("2018-05-16 02:13:35.792352"), y: 82.1202723017595},
  {x: new Date("2018-05-16 02:17:22.761083"), y: 85.2678106085873},
  {x: new Date("2018-05-16 02:18:20.158399"), y: 76.7215110056842},
  {x: new Date("2018-05-16 02:19:47.822894"), y: 92.7275141752827},
  {x: new Date("2018-05-16 02:20:58.417561"), y: 83.0713993609175}
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
      console.log(data);
      // transform data into arrays for chart
      var values = [];

      // get sorted keys and associated values
      Object.keys(data).sort().forEach(function(key) {
          if (key != "anomalous") {
              var xDate = new Date(key);
              var value = {x: xDate, y: data[key]};
              values.push(value);
          }
      });

      // update power chart
      powerChart.data.datasets[0].data = values;
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