import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

// Chart options.
const options = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',

      // grid line settings
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
    },
  }
};


class Chart extends Component {
  constructor(props) {
    super(props);
    
    // Can't be in state, else it complains when componentDidUpdate().
    chartData: {};
  }
  
  // Configures the chart to be rendered. Data gets put into the state.
  setupChartData() {
    let chartLabelsXAxisTimestamp = []
    let chartDataYAxisBppw = []
    let chartDataYAxisUnderlying = []
    
    for (let item of this.props.prevsighting.reverse()) {
      chartLabelsXAxisTimestamp.push(item['timestamp']);
      chartDataYAxisBppw.push(item['bppw']);
      chartDataYAxisUnderlying.push(item['underlying'].replace(/\$/g,''));
    }
    
    this.chartData = {
      labels: chartLabelsXAxisTimestamp,
      datasets: [
        {
          label: 'BPPW',
          data: chartDataYAxisBppw,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.2)',
          yAxisID: 'y',
        },
        {
          label: 'Underlying Price',
          data: chartDataYAxisUnderlying,
          fill: false,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgba(54, 162, 235, 0.2)',
          yAxisID: 'y1',
        },
      ],
    }
  }
  
  // Runs before (initial creation) to populate the chart.
  componentWillMount() {
    this.setupChartData()
  }
  
  // Fresh data from passed down into props will re-populate data.
  componentDidUpdate() {
    this.setupChartData()
  }
  
  render() {
    return (
      <div className="animated fadeIn">
        <Line data={this.chartData} options={options} />
      </div>
    );
  }
}

export default Chart;