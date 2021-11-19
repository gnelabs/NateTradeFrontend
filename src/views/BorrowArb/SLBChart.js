import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Spinner } from 'reactstrap';

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
      display: true,
      position: 'right',
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'left',
      ticks: {
        callback: function(value) {
          return value + "%"
        }
      },
      // grid line settings
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
    },
  }
};


class SLBChart extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loadingSpinnerSLB: true,
      chartData: {}
    };
  }
  
  fetchSLBData() {
    fetch(process.env.REACT_APP_FETCH_ENDPOINT.concat("/fetch/rebatehistory?symbol=").concat(this.props.ticker), {
      method: "GET",
      ContentType: "application/json",
      headers: {
        "Authorization": this.props.jwttoken
      }
    }).then((response) => response.json()).then(responseJSON => {
      let data = []
      
      // Zero length list means no historical data.
      if (responseJSON.length > 0) {
        let chartLabelsXAxisTimestamp = []
        let chartDataYAxisRebate = []
        let chartDataBarsShortAvailable = []
        
        for (let item of responseJSON.reverse()) {
          // Format the date so it looks nice.
          var timestampOfCollection = new Date(item['timestampepoch'] * 1000)
          var month = timestampOfCollection.getUTCMonth() + 1;
          var day = timestampOfCollection.getUTCDate();
          var year = timestampOfCollection.getUTCFullYear();
          var newdate = year + "/" + month + "/" + day;
          
          chartLabelsXAxisTimestamp.push(newdate);
          
          // Stored as a negative number since it's a credit. Convert to positive for display.
          var rebateRate = Math.round(Math.abs(item['rebate']))
          chartDataYAxisRebate.push(rebateRate);
          
          chartDataBarsShortAvailable.push(item['shortavailable']);
        }
        
        this.setState({
          loadingSpinnerSLB: false,
          chartData: {
            labels: chartLabelsXAxisTimestamp,
            datasets: [
              {
                type: 'line',
                label: 'Rebate Rate, Annualized %',
                data: chartDataYAxisRebate,
                fill: false,
                backgroundColor: 'rgb(82, 28, 0)',
                borderColor: 'rgba(85, 85, 85, 0.2)',
                yAxisID: 'y1',
              },
              {
                type: 'bar',
                label: 'Short Shares Available',
                data: chartDataBarsShortAvailable,
                backgroundColor: 'rgb(113, 148, 158)',
                borderColor: 'rgba(28, 55, 149, 0.2)',
                yAxisID: 'y',
              }
            ],
          }
        });
      }
    }).catch(err => {
      console.log(err);
      alert("Something went wrong contacting the server.");
    });
  }
  
  // Runs before (initial creation) to populate the chart.
  componentWillMount() {
    this.fetchSLBData()
  }
  
  // Fresh data from passed down into props will re-populate data.
  componentDidUpdate(previousProps, previousState) {
    if (previousProps.ticker !== this.props.ticker) {
      this.setState({
        chartData: {},
        loadingSpinnerSLB: true
      }, this.fetchSLBData);
    }
  }
  
  render() {
    return (
      <div className="animated fadeIn">
        { this.state.loadingSpinnerSLB ?
        <Spinner animation="border" role="status" variant="secondary" />
        :
        <Bar data={this.state.chartData} options={options} />
        }
      </div>
    );
  }
}

export default SLBChart;