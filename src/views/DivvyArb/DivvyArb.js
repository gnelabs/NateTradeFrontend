import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Badge, Card, CardBody, CardHeader, Col, Row, Spinner } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { Auth } from 'aws-amplify';

const tableColumns = [
  {
    id: 0,
    name: "Fresh",
    selector: (row) => row.fresh
  },
  {
    id: 1,
    name: "Ticker",
    selector: (row) => row.ticker
  },
  {
    id: 2,
    name: "Last Seen",
    selector: (row) => row.timestamp,
    grow: 3
  },
  {
    id: 3,
    name: "BPPW",
    selector: (row) => row.bppw
  },
  {
    id: 4,
    name: "Div Amount",
    selector: (row) => row.div_amount
  },
  {
    id: 5,
    name: "Ex-Div Date",
    selector: (row) => row.ex_date
  },
  {
    id: 6,
    name: "Expiration",
    selector: (row) => row.expiration,
    grow: 2
  },
  {
    id: 7,
    name: "Underlying Quote",
    selector: (row) => row.underlying
  },
  {
    id: 8,
    name: "Strike",
    selector: (row) => row.strike
  },
  {
    id: 9,
    name: "Div Yield",
    selector: (row) => row.div_yield
  },
  {
    id: 10,
    name: "Profit",
    selector: (row) => row.profit_on_longconv
  },
  {
    id: 11,
    name: "Put Volume",
    selector: (row) => row.put_volume
  },
  {
    id: 12,
    name: "Previous Sightings",
    selector: (row) => row.previous_sightings,
    grow: 2
  },
  {
    id: 13,
    name: "Notes",
    selector: (row) => row.notes
  }
];


class DivvyArb extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      jwttoken: "",
      divvyArbData: [],
      loadingSpinner: true,
      notesData: {},
      prevSightingsData: {}
    };
  }
  
  async componentWillMount() {
    await Auth.currentAuthenticatedUser()
      .then(result => {
        this.setState({
          jwttoken: (result.signInUserSession.accessToken.jwtToken),
        });
      })
      .catch(err => { 
        this.props.history.push({
          pathname: '/login'
        });
    
      });
    
    fetch('/fetch/divvyarbtickers', {
      method: 'GET',
      ContentType: 'application/json',
      headers: {
        'Authorization': this.state.jwttoken
      }
    }).then((response) => response.json()).then(responseJSON => {
      let data = []
      let prevsight = {}
      let notes = {}
      
      if (responseJSON.length > 0) {
        responseJSON.forEach(function (arrayItem, index) {
          const tickerSymbol = arrayItem["ticker"]
          
          arrayItem["id"] = index
          
          if (arrayItem["previous_sightings"].length > 0) {
            prevsight[tickerSymbol] = arrayItem["previous_sightings"]
            arrayItem["previous_sightings"] = "true"
          } else {
            arrayItem["previous_sightings"] = ""
          }
          
          if (arrayItem["notes"].length > 0) {
            notes[tickerSymbol] = arrayItem["notes"]
            arrayItem["notes"] = "true"
          } else {
            arrayItem["notes"] = ""
          }
          
          if (arrayItem["fresh"] === true) {
            arrayItem["fresh"] = <Badge color="success">Fresh</Badge>
          } else if (arrayItem["fresh"] === false) {
            arrayItem["fresh"] = ""
          }
          
          arrayItem["div_yield"] = arrayItem["div_yield"].concat("%")
          
          data.push(arrayItem);
        });
      }
      
      this.setState({
        divvyArbData: data,
        loadingSpinner: false,
        notesData: notes,
        prevSightingsData: prevsight
      });
    }).catch(err => alert("Something went wrong contacting the server."));
  }
  
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody>
                This page is still in development.
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-sort-amount-desc"></i> Current Arbs
              </CardHeader>
              <CardBody>
              { this.state.loadingSpinner ?
                <Spinner animation="border" role="status" variant="secondary" />
              :
                <DataTable
                  columns={tableColumns}
                  data={this.state.divvyArbData}
                  pagination
                  highlightOnHover={true}
                  striped={true}
                />
              }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(DivvyArb);
