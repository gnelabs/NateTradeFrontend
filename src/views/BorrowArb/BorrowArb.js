import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Col, Collapse, Row, Spinner } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { Auth } from 'aws-amplify';
import Chart from './DetailsChart';
import Notes from './DetailsNotes';

// Table column names, predefined here for cleanliness.
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
    name: "DTP",
    selector: (row) => row.days_to_profit
  },
  {
    id: 5,
    name: "Rebate Rate",
    selector: (row) => row.rebate
  },
  {
    id: 6,
    name: "Breakeven Rate",
    selector: (row) => row.breakeven_borrow_rate
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
    id: 11,
    name: "Profit",
    selector: (row) => row.overall_profit
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


class BorrowArb extends Component {
  constructor(props) {
    super(props);
    
    this.arbDetailsRef = React.createRef();
    this.helpRef = React.createRef();
    
    this.state = {
      jwttoken: "",
      userAlias: "",
      userTimeZone: "",
      borrowArbData: [],
      loadingSpinner: true,
      notesData: {},
      prevSightingsData: {},
      tickerSymbolToDisplay: "Click View for details.",
      detailDataToDisplay: "",
      collapse: false
    };
    this.handleReference = this.handleReference.bind(this);
    this.handleHelp = this.handleHelp.bind(this);
    this.collapseLegend = this.collapseLegend.bind(this);
  }
  
  getJwtOrRedirect() {
    // Get jwt or redirect to login if missing.
    Auth.currentAuthenticatedUser()
      .then(result => {
        this.setState({
          jwttoken: (result.signInUserSession.accessToken.jwtToken),
          userAlias: result.attributes['custom:alias']
        },
        this.fetchBorrowArbTickers
        );
      })
      .catch(err => { 
        this.props.history.push({
          pathname: '/login'
        });
      });
  }
  
  handleReference(tickerSymbol) {
    this.setState({
      tickerSymbolToDisplay: tickerSymbol,
      detailDataToDisplay: this.state.prevSightingsData[tickerSymbol]
    }, this.arbDetailsRef.current.scrollIntoView());
  }
  
  handleHelp(e) {
    e.preventDefault();
    this.setState({
      collapse: true
    }, this.helpRef.current.scrollIntoView());
  }
  
  collapseLegend() {
    this.setState({
      collapse: !this.state.collapse
    });
  }
  
  fetchBorrowArbTickers() {
    fetch(process.env.REACT_APP_FETCH_ENDPOINT.concat("/fetch/borrowarbtickers"), {
      method: "GET",
      ContentType: "application/json",
      headers: {
        "Authorization": this.state.jwttoken
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
          arrayItem["details"] = <span><Button className="mr-1" color="secondary" id={tickerSymbol} onClick={() => this.handleReference(tickerSymbol)}>View</Button></span>
          
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
          
          // Convert the UTC 8601 timestamp to a local time using the users browser locale setting.
          const utcTimestamp = new Date(arrayItem["timestamp"])
          arrayItem["timestamp"] = utcTimestamp.toLocaleString()
          
          data.push(arrayItem);
        }, this); // Passing this as the second argument to forEach so it has access to scope.
      }
      
      this.setState({
        borrowArbData: data,
        notesData: notes,
        prevSightingsData: prevsight,
        loadingSpinner: false
      });
    }).catch(err => {
      console.log(err);
      alert("Something went wrong contacting the server.");
    });
  }
  
  componentDidMount() {
    document.title = process.env.REACT_APP_PAGE_TITLE.concat(' - Borrow Arbs');
    this.getJwtOrRedirect();
  }
  
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-sort-amount-desc"></i> Current Borrow Arbitrage Opportunities - Symmetric
                <div className="card-header-actions">
                  <a href="#" onClick={this.handleHelp}><small>Help</small></a>
                </div>
              </CardHeader>
              <CardBody>
              { this.state.loadingSpinner ?
                <Spinner animation="border" role="status" variant="secondary" />
              :
                <DataTable
                  columns={tableColumns}
                  data={this.state.borrowArbData}
                  pagination
                  highlightOnHover={true}
                  striped={true}
                />
              }
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div ref={this.arbDetailsRef}>
          <Row>
          { this.state.detailDataToDisplay ?
            <React.Fragment>
              <Col>
                <Card>
                  <div>
                    <CardHeader>
                      <i className="fa fa-object-group"></i> Notes | <strong>{this.state.tickerSymbolToDisplay}</strong>
                    </CardHeader>
                    <CardBody>
                      <div>
                        <Notes
                          notedata={this.state.notesData[this.state.tickerSymbolToDisplay]}
                          ticker={this.state.tickerSymbolToDisplay}
                          jwt={this.state.jwttoken}
                          alias={this.state.userAlias}
                        />
                      </div>
                    </CardBody>
                  </div>
                </Card>
              </Col>
              <Col>
                <Card>
                  <div>
                    <CardHeader>
                      <i className="fa fa-object-group"></i> History | <strong>{this.state.tickerSymbolToDisplay}</strong>
                    </CardHeader>
                    <CardBody>
                      <div>
                        <Chart prevsighting={this.state.detailDataToDisplay} />
                      </div>
                    </CardBody>
                  </div>
                </Card>
              </Col>
            </React.Fragment>
          :
            <React.Fragment>
              <Col>
                <Card>
                  <div>
                    <CardHeader>
                      <i className="fa fa-object-group"></i> Notes | <strong>{this.state.tickerSymbolToDisplay}</strong>
                    </CardHeader>
                    <CardBody>
                      <div>
                        <Notes
                          notedata={this.state.notesData[this.state.tickerSymbolToDisplay]}
                          ticker={this.state.tickerSymbolToDisplay}
                          jwt={this.state.jwttoken}
                          alias={this.state.userAlias}
                        />
                      </div>
                    </CardBody>
                  </div>
                </Card>
              </Col>
              <Col>
                <Card>
                  <div>
                    <CardHeader>
                      <i className="fa fa-object-group"></i> History | <strong>{this.state.tickerSymbolToDisplay}</strong>
                    </CardHeader>
                    <CardBody>
                      <div>
                        <small className="text-muted">There is no history to display for this ticker.</small>
                      </div>
                    </CardBody>
                  </div>
                </Card>
              </Col>
            </React.Fragment>
          }
          </Row>
        </div>
        <div ref={this.helpRef}>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <i className="fa fa-info-circle"></i> Help - Terminology & Legend
                  <div className="card-header-actions">
                  { this.state.collapse ?
                    <Button color="secondary" onClick={this.collapseLegend} id="toggleCollapse1">Collapse</Button>
                  :
                    <Button color="secondary" onClick={this.collapseLegend} id="toggleCollapse1">Expand</Button>
                  }
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} >
                  <CardBody>
                    <Row>
                      <Col>
                        <p>
                        Insert explaination here.
                        </p>
                        <p><hr /></p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Row>
                          <p><strong>Fresh</strong> -&nbsp;</p>
                          <p>
                          If an arb is marked fresh, it is from today.
                          </p>
                        </Row>
                        <Row>
                          <p><strong>Valid</strong> -&nbsp;</p>
                          <p>
                          An indicator based on feedback from NateTrade users on whether or not the arb is valid.
                          </p>
                        </Row>
                        <Row>
                          <p><strong>Ticker</strong> -&nbsp;</p>
                          <p>
                          The symbol for the U.S. exchange traded stock.
                          </p>
                        </Row>
                        <Row>
                          <p><strong>Last Seen</strong> -&nbsp;</p>
                          <p>
                          The timestamp the arb was last seen. Currently displayed in your local timezone. The scanner runs 
                          in 30-minute intervals through standard market hours.
                          </p>
                        </Row>
                        <Row>
                          <p><strong>DTP</strong> -&nbsp;</p>
                          <p>
                          Insert explaination here.
                          </p>
                        </Row>
                        <Row>
                          <p><strong>Rebate Rate</strong> -&nbsp;</p>
                          <p>
                          Insert explaination here.
                          </p>
                        </Row>
                        <Row>
                          <p><strong>Breakeven rate</strong> -&nbsp;</p>
                          <p>
                          Insert explaination here.
                          </p>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <p><strong>Expiration</strong> -&nbsp;</p>
                          <p>
                          The options expiration date to put on the conversion trade in order to be hedged the minimal amount 
                          of time to collect the maximum amount of profit for the arbitrage.
                          </p>
                        </Row>
                        <Row>
                          <p><strong>Underlying</strong> -&nbsp;</p>
                          <p>
                          The underlying stock price at the time the arb was discovered.
                          </p>
                        </Row>
                        <Row>
                          <p><strong>Strike</strong> -&nbsp;</p>
                          <p>
                          The out-of-the-money options call strike the arb was calculated at.
                          </p>
                        </Row>
                        <Row>
                          <p><strong>Profit</strong> -&nbsp;</p>
                          <p>
                          Insert explaination here.
                          </p>
                        </Row>
                        <Row>
                          <p><strong>Put Volume</strong> -&nbsp;</p>
                          <p>
                          The daily options put volume for the aforementioned strike thus far on the day at the time the arb 
                          was discovered. Knowing how liquid the strike is by looking at previous volume will give you a 
                          hint as to whether or not it is probable your trade will get filled. Strikes with active volume 
                          means you can look at previous time and sales to get an idea for how agressively midpoint orders 
                          are being filled.
                          </p>
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </Collapse>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withRouter(BorrowArb);
