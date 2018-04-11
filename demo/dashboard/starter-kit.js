var chart = new Keen.Dataviz()
  .el('#chart-01')
  .height(280)
  .title('Signups this week')
  .type('metric')
  .prepare();

chart
  .data({ result: 621 })
  .render();


