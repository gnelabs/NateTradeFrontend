import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

// Chart options.
const options = {
  scales: {
    yAxes: [
      {
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1'
      }
    ],
  },
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
    let chartDataYAxisDtp = []
    
    for (let item of this.props.prevsighting.reverse()) {
      chartLabelsXAxisTimestamp.push(item['timestamp']);
      chartDataYAxisDtp.push(item['days_to_profit']);
    }
    
    this.chartData = {
      labels: chartLabelsXAxisTimestamp,
      datasets: [
        {
          label: 'Days To Profit',
          data: chartDataYAxisDtp,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.2)',
          yAxisID: 'y-axis-1',
        }
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