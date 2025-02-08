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
  UncontrolledDropdown
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import SpendingGoalsChart from "./components/SpendingGoalsChart.js";
import gymIcon from "../../assets/dashboard/gymIcon.svg";
import therapyIcon from "../../assets/dashboard/therapyIcon.svg";
import user from "../../assets/user.svg";
import statsPie from "../../assets/dashboard/statsPie.svg";
import SpendingPieChart from "./components/SpendingPieChart.js";

import s from "./Dashboard.module.scss";

const Dashboard = () => {

  
  const [checkboxes, setCheckboxes] = useState([true, false])

  const toggleCheckbox = (id) => {
    setCheckboxes(checkboxes => checkboxes
      .map((checkbox, index) => index === id ? !checkbox : checkbox ))
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const visStates = {
    DEFAULT: "default",
    GOALS: "goals",
    BREAKDOWN: "breakdown",
  }

  const [currentVis, setVis] = useState(visStates.DEFAULT);

  const [spendingData, setSpendingData]  = useState({
    income: 8087,
    totalExpenditures: {
      rent: 4000,
      groceries: 300,
      entertainment: 300,
      savings: 2000
    },
    disposableIncome: {
      checking: 1000,
      savings: 30000,
      checkingDeposits: 4000
    }
  });

  const [rentSeries, setRentSeries] = useState([{
      name: 'Your Activity',
      type: 'column',
      data: [75, 15, 40, 50, 50, 60, 60]
    }, {
      name: 'Your Goal',
      type: 'line',
      data: [50, 50, 50, 50, 50, 50, 50]
    }]);
  const [groceriesSeries, setSpendingSeries] = useState([{
      name: 'Your Activity',
      type: 'column',
      data: [75, 15, 40, 50, 50, 60, 60]
    }, {
      name: 'Your Goal',
      type: 'line',
      data: [50, 50, 50, 50, 50, 50, 50]
    }]);

  const [entertainmentSeries, setEntertainmentSeries] = useState([{
      name: 'Your Activity',
      type: 'column',
      data: [75, 15, 40, 50, 50, 60, 60]
    }, {
      name: 'Your Goal',
      type: 'line',
      data: [50, 50, 50, 50, 50, 50, 50]
    }]);
  
    const [savingsSeries, setSavingsSeries] = useState([{
      name: 'Your Activity',
      type: 'column',
      data: [75, 15, 40, 50, 50, 60, 60]
    }, {
      name: 'Your Goal',
      type: 'line',
      data: [50, 50, 50, 50, 50, 50, 50]
    }]);

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

  if (currentVis == visStates.DEFAULT) {
    return (
      <div>
        {dropdown}
        <Row>
          <Col className="pr-grid-col" xs={12} lg={8}>
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
                  <SpendingGoalsChart series={groceriesSeries} className="pb-4" />
                </Widget>
              </Col>
              <Col className="mb-4 mb-md-0" xs={12} md={6}>
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
        <Col className="pr-grid-col" xs={12} lg={8}>
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
  }
  return (
    <div>
      {dropdown}
      <Row>
        <Col className="pr-grid-col" xs={12} lg={8}>
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
                <SpendingGoalsChart series={groceriesSeries} className="pb-4" />
              </Widget>
            </Col>
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
          </Row>
        </Col>
        <Col className="mt-4 mt-lg-0 pl-grid-col" xs={12} lg={4}>
          <Widget className="widget-p-lg">
            <div className="d-flex">
              <img className={s.image} src={user} alt="..." />
              <div className={s.userInfo}>
                <p className="headline-3">Christina Karey</p>
                <p className="body-3 muted">Brasil</p>
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
                <p className="headline-3">Your Goals</p>
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
                  <p className="body-2">Sleep</p>
                  <p className="body-2">92<span className="body-3 muted"> / 160</span></p>
                </div>
                <Progress color="secondary-red" className="progress-xs" value={60} />
              </div>
              <div className="d-flex flex-column mt-3">
                <div className={s.activity}>
                  <p className="body-2">Sport</p>
                  <p className="body-2">40<span className="body-3 muted"> / 50</span></p>
                </div>
                <Progress color="secondary-yellow" className="progress-xs" value={80} />
              </div>
              <div className="d-flex flex-column mt-3">
                <div className={s.activity}>
                  <p className="body-2">Water</p>
                  <p className="body-2">25<span className="body-3 muted"> / 40</span></p>
                </div>
                <Progress color="secondary-cyan" className="progress-xs" value={40} />
              </div>
            </div>
            <p className="headline-3">Appointments</p>
            <div className={`mt-3 ${s.widgetBlock}`}>
              <div className={s.widgetBody}>
                <div className="d-flex">
                  <img className="img-fluid mr-2" src={gymIcon} alt="..." />
                  <div className="d-flex flex-column">
                    <p className="body-2">02.11 , 12:00 - 13:00</p>
                    <p className="body-3 muted">Yoga, Airplace Gym</p>
                  </div>
                </div>
                <div className="checkbox checkbox-primary">
                  <input
                    id="checkbox0"
                    type="checkbox"
                    className="styled"
                    checked={checkboxes[0]}
                    onChange={() => toggleCheckbox(0)}
                  />
                  <label htmlFor="checkbox0" />
                </div>
              </div>
            </div>
            <div className={`mt-3 ${s.widgetBlock}`}>
              <div className={s.widgetBody}>
                <div className="d-flex">
                  <img className="img-fluid mr-2" src={therapyIcon} alt="..." />
                  <div className="d-flex flex-column">
                    <p className="body-2">03.11 , 16:00 - 17:30</p>
                    <p className="body-3 muted">Therapy</p>
                  </div>
                </div>
                <div className="checkbox checkbox-primary">
                  <input
                    id="checkbox1"
                    type="checkbox"
                    className="styled"
                    checked={checkboxes[1]}
                    onChange={() => toggleCheckbox(1)}
                  />
                  <label htmlFor="checkbox1" />
                </div>
              </div>
            </div>
            <a className={`btn-secondary-red ${s.statsBtn}`} href="#top" role="button">
              <img className={s.pieImg}  src={statsPie} alt="..." />
              <div>
                <p className="headline-2">STATISTIC</p>
                <p className="body-3">Download your activity</p>
              </div>
            </a>
          </Widget>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard;
