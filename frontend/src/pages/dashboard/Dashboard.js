import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Col,
  Row,
  Progress,
  Button,
  DropdownToggle,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  ButtonDropdown
} from "reactstrap";

import Widget from "../../components/Widget/Widget.js";
import SpendingGoalsChart from "./components/SpendingGoalsChart.js";
import SpendingPieChart from "./components/SpendingPieChart.js";
import user from "../../assets/user.svg";
import basketIcon from "../../assets/tables/basketIcon.svg";
import folderIcon from "../../assets/tables/folderIcon.svg";
import bagIcon from "../../assets/tables/bagIcon.svg";
import joystickIcon from "../../assets/tables/joystickIcon.svg";


import s from "./Dashboard.module.scss";

const Dashboard = () => {

  const [data, setData] = useState();
  useEffect(() => {
    let fetchRes = fetch("/get-user-data/");
        // FetchRes is the promise to resolve
        // it by using.then() method
        fetchRes.then(res =>
            res.json()).then(d => {
              setData(JSON.parse(d));
              console.log(JSON.parse(d));
            })
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const visStates = {
    DEFAULT: "default",
    GOALS: "goals",
    BREAKDOWN: "breakdown",
  }

  const [currentVis, setVis] = useState(visStates.DEFAULT);
  const [spendingData, setSpendingData]  = useState({
    income: 3500,
    totalExpenditures: {
      rent: 1200,
      groceries: 400,
      entertainment: 100,
      savings: 200
    },
    disposableIncome: {
      checking: 1500,
      savings: 1000,
      checkingDeposits: 500
    }
  });

  const [rentSeries, setRentSeries] = useState([{
      name: 'Your Activity',
      type: 'column',
      data: [1300, 0, 0, 0, 1300, 0, 0]
    }, {
      name: 'Your Goal',
      type: 'line',
      data: [1300, 0, 0, 0, 1300, 0, 0]
    }]);
  const [groceriesSeries, setSpendingSeries] = useState([{
      name: 'Your Activity',
      type: 'column',
      data: [109, 110, 70, 80, 87, 99, 70]
    }, {
      name: 'Your Goal',
      type: 'line',
      data: [85, 85, 85, 85, 85, 85, 85]
    }]);

  const [entertainmentSeries, setEntertainmentSeries] = useState([{
      name: 'Your Activity',
      type: 'column',
      data: [30, 70, 29, 150, 60, 31, 50]
    }, {
      name: 'Your Goal',
      type: 'line',
      data: [30, 30, 30, 30, 30, 30, 30]
    }]);
  
    const [savingsSeries, setSavingsSeries] = useState([{
      name: 'Your Activity',
      type: 'column',
      data: [100, 125, 100, 100, 75, 300, 100]
    }, {
      name: 'Your Goal',
      type: 'line',
      data: [100, 100, 100, 100, 100, 100, 100]
    }]);

    const transactions = [
      {
        id: 1,
        icon: basketIcon,
        category: "Shopping",
        date: "05 Jun 2020 10:00",
        price: "$300",
        description: "Some text",
        dropdownOpen: false,
      },
      {
        id: 2,
        icon: joystickIcon,
        category: "Shopping",
        date: "05 Jun 2020 10:00",
        price: "$300",
        description: "Some text",
        dropdownOpen: false,
      },
      {
        id: 3,
        icon: folderIcon,
        category: "Shopping",
        date: "05 Jun 2020 10:00",
        price: "$300",
        description: "Some text",
        dropdownOpen: false,
      },
      {
        id: 4,
        icon: bagIcon,
        category: "Shopping",
        date: "05 Jun 2020 10:00",
        price: "$300",
        description: "Some text",
        dropdownOpen: false,
      }
    ]

  const [pieData, setPieData] = useState({
      donut: {
        data: [
          { name: 'Rent', value: 1, color: '#FFC405' },
          { name: 'Groceries', value: 1, color: '#FF5668' },
          { name: 'Entertainment', value: 1, color: '#4D53E0' },
          { name: 'Savings', value: 1, color: '#4E99E0' },
        ],
      }
    });

  useEffect(() => {
    setPieData({
      donut: {
        data: [
          { name: 'Rent', value: spendingData.totalExpenditures.rent, color: '#FFC405' },
          { name: 'Groceries', value: spendingData.totalExpenditures.groceries, color: '#FF5668' },
          { name: 'Entertainment', value: spendingData.totalExpenditures.entertainment, color: '#4D53E0' },
          { name: 'Savings', value: spendingData.totalExpenditures.savings, color: '#4E99E0' },
        ],
      }
    })
  }, [spendingData]);

  const dropdown = 
  (<Row>
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>Choose a View:</DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => setVis(visStates.DEFAULT)}>Dashboard</DropdownItem>
        <DropdownItem divider></DropdownItem>
        <DropdownItem onClick={() => setVis(visStates.GOALS)}>Spending Goals</DropdownItem>
        <DropdownItem divider></DropdownItem>
        <DropdownItem onClick={() => setVis(visStates.BREAKDOWN)}>Spending Breakdown</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Row>);

  if (currentVis == visStates.BREAKDOWN) {
    return (
      <div>
        {dropdown}
        <Row>
          <Col className="" xs={12} lg={16}>
            <Row className="gutter mb-4">
            <Col xs={12} md={6}>
              <Widget className="widget-p-md">
                <div className="d-flex justify-content-between">
                  <div className="headline-3 d-flex align-items-center">Spending Breakdown</div>
                  <UncontrolledDropdown>
                    <DropdownToggle caret>
                      &nbsp; Monthly &nbsp;
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Daily</DropdownItem>
                      <DropdownItem>Weekly</DropdownItem>
                      <DropdownItem>Monthly</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <div>
                  <SpendingPieChart spendingData={pieData}/>
                </div>
              </Widget>
            </Col>
              <Col className="mb-4 mb-md-0" xs={12} md={6}>
                {/* put something here */}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  } else if (currentVis == visStates.GOALS){
    return (
      <div>
      {dropdown}
      <Row>
        <Col className="xs={12} lg={9}">
          <Row className="gutter mb-4">
            <Col className="mb-4 mb-md-0" xs={12} md={6}>
              <Widget className="">
                <div className="d-flex justify-content-between widget-p-md">
                  <div className="headline-3 d-flex align-items-center">Spending Goals</div>
                  <UncontrolledDropdown>
                    <DropdownToggle caret>
                      &nbsp; Monthly &nbsp;
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Daily</DropdownItem>
                      <DropdownItem>Weekly</DropdownItem>
                      <DropdownItem>Monthly</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <SpendingGoalsChart series={rentSeries} className="pb-4" />
              </Widget>
            </Col>
            <Col className="mb-4 mb-md-0" xs={12} md={6}>
              <Widget className="">
                <div className="d-flex justify-content-between widget-p-md">
                  <div className="headline-3 d-flex align-items-center">Grocery/Food Goals</div>
                  <UncontrolledDropdown>
                    <DropdownToggle caret>
                      &nbsp; Monthly &nbsp;
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Daily</DropdownItem>
                      <DropdownItem>Weekly</DropdownItem>
                      <DropdownItem>Monthly</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <SpendingGoalsChart series={groceriesSeries} className="pb-4" />
              </Widget>
            </Col>
          </Row>
          <Row>
            <Col>
              <Widget className="">
                <div className="d-flex justify-content-between widget-p-md">
                  <div className="headline-3 d-flex align-items-center">Entertainment Goals</div>
                  <UncontrolledDropdown>
                    <DropdownToggle caret>
                      &nbsp; Monthly &nbsp;
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Daily</DropdownItem>
                      <DropdownItem>Weekly</DropdownItem>
                      <DropdownItem>Monthly</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <SpendingGoalsChart series={entertainmentSeries} className="pb-4" />
              </Widget>
            </Col>
            <Col>
              <Widget className="">
                <div className="d-flex justify-content-between widget-p-md">
                  <div className="headline-3 d-flex align-items-center">Savings Goals</div>
                  <UncontrolledDropdown>
                    <DropdownToggle caret>
                      &nbsp; Monthly &nbsp;
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Daily</DropdownItem>
                      <DropdownItem>Weekly</DropdownItem>
                      <DropdownItem>Monthly</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <SpendingGoalsChart series={savingsSeries} className="pb-4" />
              </Widget>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
    );
  } else if (currentVis == visStates.DEFAULT) {
    return (
      <div>
        {dropdown}
        <Row className="gutter mb-4">
          <Col className="mt-4 mt-lg-0 pl-grid-col" xs={12} lg={6}>
            <Widget className="widget-p-lg">
              <div className="d-flex">
                <img className={s.image} src={user} alt="..." />
                <div className={s.userInfo}>
                  <p className="headline-3">User Profile</p>
                  <p className="body-3 muted">Atlanta, GA</p>
                </div>
              </div>
              <div className={s.userParams}>
                <div className="d-flex flex-column">
                  <p className="headline-3">63 kg</p>
                  <p className="body-3 muted">Weight</p>
                </div>
                <div className="d-flex flex-column">
                  <p className="headline-3">175 sm</p>
                  <p className="body-3 muted">Height</p>
                </div>
                <div className="d-flex flex-column">
                  <p className="headline-3">28 y.</p>
                  <p className="body-3 muted">Age</p>
                </div>
              </div>
              <div className={s.goals}>
                <div className={s.goalsTitle}>
                  <p className="headline-3">Your Accounts</p>
                  <UncontrolledDropdown>
                    <DropdownToggle caret>
                      &nbsp; Weekly &nbsp;
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Daily</DropdownItem>
                      <DropdownItem>Weekly</DropdownItem>
                      <DropdownItem>Monthly</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <div className="d-flex flex-column mt-3">
                  <div className={s.activity}>
                    <p className="body-2">Checking Accounts</p>
                    <p className="body-2">92<span className="body-3 muted"> / 160</span></p>
                  </div>
                  <Progress color="secondary-red" className="progress-xs" value={60} />
                </div>
                <div className="d-flex flex-column mt-3">
                  <div className={s.activity}>
                    <p className="body-2">Savings Accounts</p>
                    <p className="body-2">40<span className="body-3 muted"> / 50</span></p>
                  </div>
                  <Progress color="secondary-yellow" className="progress-xs" value={80} />
                </div>
                <div className="d-flex flex-column mt-3">
                  <div className={s.activity}>
                    <p className="body-2">Checking Deposits</p>
                    <p className="body-2">25<span className="body-3 muted"> / 40</span></p>
                  </div>
                  <Progress color="secondary-cyan" className="progress-xs" value={40} />
                </div>
              </div>  
            </Widget>
          </Col>
            <Col xs={10} xl={6} className="pr-grid-col whitespace-nowrap text-center">
              <Widget>
                <div className={s.tableTitle}>
                  <br></br>
                  <div className="headline-2">Recent transactions</div>
                    <ButtonDropdown
                      
                    >
                      <DropdownToggle caret>
                        &nbsp; Weekly &nbsp;
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Daily</DropdownItem>
                        <DropdownItem>Weekly</DropdownItem>
                        <DropdownItem>Monthly</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                    {/*<img src="" alt="Filter option"/>*/}
                  </div>
                <br></br>
                <div className={s.widgetContentBlock + ""}>
                  {transactions.map((item, i) => (
                    <div key={uuidv4()} className={s.content}>
                      <div>
                        <img src={transactions[i].icon} alt="Item" /><span className="body-2 ml-3">{item.category}</span>
                      </div>
                      <div className="body-3 muted d-none d-md-block">{transactions[i].date}  |
                      <span className="body-2 font-bold"> {item.price} </span>
                      <br></br>
                      {transactions[i].description}</div>
                      <br/>
                    </div>
                  ))}
                </div>
              </Widget>
            </Col>
        </Row>
      </div>
    )
  }
}

export default Dashboard;