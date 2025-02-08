import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Button} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import s from "./Sidebar.module.scss";
// import LinksGroup from "./LinksGroup/LinksGroup.js";
// import { changeActiveSidebarItem } from "../../actions/navigation.js";
//import SofiaLogo from "../Icons/SofiaLogo.js";
import TruistLogo from "../Icons/Truist-Emblem.png";
import cn from "classnames";

const Sidebar = (props) => {

  const {
    activeItem = '',
    ...restProps
  } = props;

  const [burgerSidebarOpen, setBurgerSidebarOpen] = useState(false)
  const [inputValue, setInputValue] = useState('');  // State for textbox

  useEffect(() => {
    if (props.sidebarOpened) {
      setBurgerSidebarOpen(true)
    } else {
      setTimeout(() => {
        setBurgerSidebarOpen(false)
      }, 0);
    }
  }, [props.sidebarOpened])
  
  const handleInputChange = (event) => {
    setInputValue(event.target.value);  // Update state with input value
  };

  return (
    <nav className={cn(s.root, {[s.sidebarOpen]: burgerSidebarOpen})} >
      <header className={s.logo}>
      <img src={TruistLogo} alt="Truist Logo" className={s.logoImage} />
        <span className={s.title}>Truist Chat</span>
      </header>
      <ul className={s.nav}>
        {/*Add textbox here*/}
        <li className={s.navItem}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}  // Update state when text changes
          placeholder="Enter a question"
          className={s.textbox}
        />
        </li>
      </ul>
    </nav>
  );
}

Sidebar.propTypes = {
  sidebarOpened: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  activeItem: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    activeItem: store.navigation.activeItem,
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
