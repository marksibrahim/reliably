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
    labels: ["1", "2", "3", "4","5", "6", "7", "8", "9","10", "11", "12", "13", "14", "15",
            "16", "17", "18", "19", "20","21", "22", "23", "24", "25","26", "27", "28", "29", "30"],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0],
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
      }]
    },
    legend: {
      display: false,
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
      Object.keys(data).sort().forEach(function(key) {
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


// Survivability Chart
var ctx3 = document.getElementById("ttf-chart");
var ttfChart = new Chart(ctx3, {
  type: 'line',
  data: {
      datasets: [{
          label: 'Survivability',
          data: [7.8900001, 6.24, 4.92, 3.896, 3.07, 2.42, 1.915, 1.513, 1.198, 1.82],
          borderColor: '#007bff',
        },
      {
          label: 'Failure',
          borderColor: '#ff0000',
          data: [8.554, 2.8, 12.39, 7.1334, 5.3029, 2.85, 2.624, 2.3224, 8.5823, 6.39],
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
            var survivabilityValues = [];
            var failureValues = [];

            // get sorted keys and associated values
            Object.keys(data["survivability"]).sort().forEach(function(key) {
                labels.push(key);
                failureValues.push(data["failure"][key]);
                survivabilityValues.push(data["survivability"][key]);
            });

            // update chart values
            ttfChart.data.datasets[0].data = survivabilityValues;
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

// update every 2 seconds
setInterval(function(){
 updateFlowChart();
 updatePowerChart();
 updateTTFChart();
}, 2000);
