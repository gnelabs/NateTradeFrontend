import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Col, Collapse, Row, Spinner } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { Auth } from 'aws-amplify';

// Table column names, predefined here for cleanliness.
const volBackwardationTableColumns = [
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
    name: "Underlying Price",
    selector: (row) => row.underlying
  },
  {
    id: 4,
    name: "Backwardation",
    selector: (row) => row.backwardation
  }
];

const straddleSwapTableColumns = [
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
    name: "Earnings Date",
    selector: (row) => row.earnings_date,
  },
  {
    id: 4,
    name: "Backwardation",
    selector: (row) => row.backwardation
  }
];


class VolBack extends Component {
  constructor(props) {
    super(props);
    
    this.helpRef = React.createRef();
    
    this.state = {
      jwttoken: "",
      userAlias: "",
      volBackData: [],
      straddleSwapData: [],
      loadingSpinner: true,
      notesData: {},
      prevSightingsData: {},
      tickerSymbolToDisplay: "Click View for details.",
      collapse: false
    };
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
        this.fetchVolBackwardationTickers
        );
      })
      .catch(err => { 
        this.props.history.push({
          pathname: '/login'
        });
      });
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
  
  fetchVolBackwardationTickers() {
    fetch(process.env.REACT_APP_FETCH_ENDPOINT.concat("/fetch/volback"), {
      method: "GET",
      ContentType: "application/json",
      headers: {
        "Authorization": this.state.jwttoken
      }
    }).then((response) => response.json()).then(responseJSON => {
      let volBackData = []
      let straddleData = []
      
      // Zero length list means no tickers for volatility backwardation.
      if (responseJSON.vol_backwardation.length > 0) {
        responseJSON.vol_backwardation.forEach(function (arrayItem, index) {
          // ID needed to be included to make data table work.
          arrayItem["id"] = index
          
          // Display a fresh badge if the opportunity is from today.
          if (arrayItem["fresh"] === true) {
            arrayItem["fresh"] = <Badge color="success">Fresh</Badge>
          } else if (arrayItem["fresh"] === false) {
            arrayItem["fresh"] = ""
          }
          
          // Convert the UTC 8601 timestamp to a local time using the users browser locale setting.
          const utcTimestamp = new Date(arrayItem["timestamp"])
          arrayItem["timestamp"] = utcTimestamp.toLocaleString()
          
          volBackData.push(arrayItem);
        }, this); // Passing this as the second argument to forEach so it has access to scope.
      }
      
      // Zero length list means no tickers for earnings straddle swaps.
      if (responseJSON.earnings_straddle_swap.length > 0) {
        responseJSON.earnings_straddle_swap.forEach(function (arrayItem, index) {
          // ID needed to be included to make data table work.
          arrayItem["id"] = index
          
          // Display a fresh badge if the opportunity is from today.
          if (arrayItem["fresh"] === true) {
            arrayItem["fresh"] = <Badge color="success">Fresh</Badge>
          } else if (arrayItem["fresh"] === false) {
            arrayItem["fresh"] = ""
          }
          
          // Convert the UTC 8601 timestamp to a local time using the users browser locale setting.
          const utcTimestamp = new Date(arrayItem["timestamp"])
          arrayItem["timestamp"] = utcTimestamp.toLocaleString()
          
          straddleData.push(arrayItem);
        }, this); // Passing this as the second argument to forEach so it has access to scope.
      }
      
      this.setState({
        volBackData: volBackData,
        straddleSwapData: straddleData,
        loadingSpinner: false
      });
    }).catch(err => {
      console.log(err);
      alert("Something went wrong contacting the server.");
    });
  }
  
  componentDidMount() {
    document.title = process.env.REACT_APP_PAGE_TITLE.concat(' - Volatility Backwardation');
    this.getJwtOrRedirect();
  }
  
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-sort-amount-desc"></i> Current Options Volatility Backwardation Opportunities - <strong>Generic Ranked</strong>
                <div className="card-header-actions">
                  <a href="#" onClick={this.handleHelp}><small>Help</small></a>
                </div>
              </CardHeader>
              <CardBody>
              { this.state.loadingSpinner ?
                <Spinner animation="border" role="status" variant="secondary" />
              :
                <DataTable
                  columns={volBackwardationTableColumns}
                  data={this.state.volBackData}
                  pagination
                  highlightOnHover={true}
                  striped={true}
                />
              }
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-calendar"></i> Current Options Volatility Backwardation Opportunities - <strong>Earnings Related</strong>
                <div className="card-header-actions">
                  <a href="#" onClick={this.handleHelp}><small>Help</small></a>
                </div>
              </CardHeader>
              <CardBody>
              { this.state.loadingSpinner ?
                <Spinner animation="border" role="status" variant="secondary" />
              :
                <DataTable
                  columns={straddleSwapTableColumns}
                  data={this.state.straddleSwapData}
                  pagination
                  highlightOnHover={true}
                  striped={true}
                />
              }
              </CardBody>
            </Card>
          </Col>
        </Row>
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
                        Volatility backwardation is when the front-week average options volatility is higher 
                        then back-week options volatility. This typically signifies an upcoming calendar event 
                        such as an earnings release, or high amounts of realized volatility reflected in the 
                        term structure. Under these conditions, it is advantageous to sell the front-month 
                        options, and buy back-month options. The goal is to capture high amounts of theta in 
                        your short options, whilst not losing in vega exposure and/or intrinsic movement. This 
                        is a short-vol strategy, best played with direction-agnostic options strategies such as 
                        a straddle-swap, or double diagonal. 
                        </p>
                        <p><hr /></p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Row>
                          <p><strong>Fresh</strong> -&nbsp;</p>
                          <p>
                          If an opportunity is marked fresh, it is from today.
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
                          The timestamp the opportunity was last seen. Currently displayed 
                          in your local timezone. The scanner runs in thirty minute intervals 
                          through standard market hours.
                          </p>
                        </Row>
                        <Row>
                          <p><strong>Earnings Date</strong> -&nbsp;</p>
                          <p>
                          The date the stock is expected to have an earnings release, 
                          potentially driving the backwardation impact of the volatility 
                          term structure.
                          </p>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <p><strong>Backwardation</strong> -&nbsp;</p>
                          <p>
                          Backwardation is a term from futures trading, used to indicate the pricing of 
                          front-month contracts is higher then the pricing of back-month contracts. This 
                          means that contracts that expire first are more expensive then contracts that 
                          expire later. This same methodoloy can be applied to U.S. equity options market 
                          in terms of volatility.
                          </p>
                          <p>
                          In this case, backwardation is a measurement of how high the volatility of the 
                          front-week is minus the back-week. The higher the number, the more backwardated 
                          the volatility term structure is. The scanner daily averages of all strikes 
                          traded. Implied Volatility is taken at the time of a trade occurring, rather 
                          than based on quoted spread pricing. A minimum amount of traded contracts 
                          volume is required in order to meet minimum sample size threshold.
                          </p>
                          <p>
                          Backwardation typically prices in a time-risk event, either due to liquidity 
                          concerns or a calendar event. Market-makers warehouse risk, and price this risk 
                          out using Implied Volatility. This strategy attempts to capture risk premia by 
                          assumming some of this inventory market-makers hold, by selling short options 
                          against the higher volatility expirations, and buying long options against the 
                          lower volatility expirations. Due to the high volatility environments listed, 
                          this strategy is best implimented using direction-agnost strategies that are 
                          risk-defined.
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

export default withRouter(VolBack);
