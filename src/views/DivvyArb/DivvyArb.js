import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Spinner } from 'reactstrap';
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
    name: "Valid",
    selector: (row) => row.valid
  },
  {
    id: 2,
    name: "Ticker",
    selector: (row) => row.ticker
  },
  {
    id: 3,
    name: "Last Seen",
    selector: (row) => row.timestamp,
    grow: 3
  },
  {
    id: 4,
    name: "BPPW",
    selector: (row) => row.bppw
  },
  {
    id: 5,
    name: "Div Amount",
    selector: (row) => row.div_amount
  },
  {
    id: 6,
    name: "Ex-Div Date",
    selector: (row) => row.ex_date
  },
  {
    id: 7,
    name: "Expiration",
    selector: (row) => row.expiration,
    grow: 2
  },
  {
    id: 8,
    name: "Underlying Quote",
    selector: (row) => row.underlying
  },
  {
    id: 9,
    name: "Strike",
    selector: (row) => row.strike
  },
  {
    id: 10,
    name: "Div Yield",
    selector: (row) => row.div_yield
  },
  {
    id: 11,
    name: "Profit",
    selector: (row) => row.profit_on_longconv
  },
  {
    id: 12,
    name: "Put Volume",
    selector: (row) => row.put_volume
  },
  {
    id: 13,
    name: "Details",
    selector: (row) => row.details,
    button: true
  }
];


// In development. Right now does nothing.
class ViewNotesButton extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  }

  render() {
    return (
      <span>
        <Button className="mr-1" color="secondary" id="sadf" onClick={this.toggle}>
          View
        </Button>
      </span>
    );
  }
}


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
    // Get jwt or redirect to login if missing.
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
    
    fetch('https://www.natetrade.com/fetch/divvyarbtickers', {
      method: 'GET',
      ContentType: 'application/json',
      headers: {
        'Authorization': this.state.jwttoken
      }
    }).then((response) => response.json()).then(responseJSON => {
      let data = []
      let prevsight = {}
      let notes = {}
      
      // Zero length list means no arbs.
      if (responseJSON.length > 0) {
        responseJSON.forEach(function (arrayItem, index) {
          const tickerSymbol = arrayItem["ticker"]
          let isValidTracking = []
          
          // ID needed to be included to make data table work.
          arrayItem["id"] = index
          // Details button renders information about ticker in card.
          arrayItem["details"] = <ViewNotesButton />
          
          // Data tables can't handle this data by itself. Move to its own object.
          if (arrayItem["previous_sightings"].length > 0) {
            prevsight[tickerSymbol] = arrayItem["previous_sightings"]
          }
          
          // Move notes to its own object.
          if (arrayItem["notes"].length > 0) {
            notes[tickerSymbol] = arrayItem["notes"]
            
            for (const noteitem of arrayItem["notes"]) {
              if ("isvalid" in noteitem) {
                isValidTracking.push(noteitem.isvalid);
              }
            }
          } else {
            arrayItem["valid"] = ""
          }
          
          // Two people can disagree if an arb is valid. Determine if it is valid,
          // invalid, or unknown and display correct icon.
          let uniqueValid = [...new Set(isValidTracking)]
          if (uniqueValid.length > 1) {
            arrayItem["valid"] = <i className="fa fa-question"></i>
          } else if (uniqueValid.length === 1) {
            if (uniqueValid[0] === true) {
              arrayItem["valid"] = <i className="fa fa-thumbs-o-up"></i>
            } else if (uniqueValid[0] === false) {
              arrayItem["valid"] = <i className="fa fa-thumbs-o-down"></i>
            }
          }
          
          // Display a fresh badge if the arb is from today.
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
      console.log("Notes: ", notes);
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
