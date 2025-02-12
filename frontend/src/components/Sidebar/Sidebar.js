import React, { useEffect, useState, useRef } from 'react';
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
  const [chat, setQuestions] = useState([]); // Store questions array
  const containerRef = useRef(null);
  const [suggestions, setSuggestions] = useState(["What is Truist?", "How can I open an account?", "Tell me about loan options"]);

  const handleSuggestionClick = (suggestion) => {
    // Add the question to the list (prepend so that newer questions are earlier)
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions, suggestion];  // Add question to the list
      // Now handle the fetch request after updating the question state
      let fetchRes = fetch("/chat/" + encodeURIComponent(suggestion));
      fetchRes.then(res => res.json())
        .then(d => {
          setQuestions(prevQuestions => [...prevQuestions, d.message]);  // Add the answer to the list
          setSuggestions(d.suggestions); // Update suggestions

        });
      return newQuestions; // Return the updated state for questions with the new question
    });
  };

  const formatMessage = (message) => {
    let formatted = message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(/`(.*?)`/g, "<code>$1</code>") // Inline Code
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>') // Links
      .replace(/\n/g, "<br>");  // Convert new lines to <br> tags
    
    return formatted;
  };
  

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

  const handleInputSubmit = (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      // Add the question to the list (prepend so that newer questions are earlier)
      setQuestions(prevQuestions => {
        const newQuestions = [...prevQuestions, inputValue];  // Add question to the list
        // Now handle the fetch request after updating the question state
        let fetchRes = fetch("/chat/" + encodeURIComponent(inputValue));
        fetchRes.then(res => res.json())
          .then(d => {
            setQuestions(prevQuestions => [...prevQuestions, d.message]);  // Add the answer to the list
            setSuggestions(d.suggestions); // Update suggestions

          });
        return newQuestions; // Return the updated state for questions with the new question
      });
  
      setInputValue('');  // Clear the input field
    }
      
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <nav className={cn(s.root, {[s.sidebarOpen]: burgerSidebarOpen})} >
      <header className={s.logo}>
      <img src={TruistLogo} alt="Truist Logo" className={s.logoImage} />
        <span className={s.title}>Truist Chat</span>
      </header>
     
      <ul className={s.nav}>
        <li className={s.navItem}>
          <div className={s.questionsContainer} ref = {containerRef} > {/*THIS IS WHERE THE CHAT ACTUALLY IS*/}
            {chat.map((chat, index) => (
              <div key={index} className={index % 2 === 0 ? s.questionItem : s.answerItem}>
                <p dangerouslySetInnerHTML={{ __html: formatMessage(chat) }}/>
              </div>
            ))}
          </div>
        </li>
        <li className={s.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <li key={index}>
              <button type="button" className={s.suggestionButton} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </button>
            </li>
          ))}
        </li>
        <li className={s.navItem}> {/*Text-box item*/}
          <form onSubmit = {handleInputSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}  // Update state when text changes
              placeholder="Enter a question"
              className={s.textbox}
            />
            <button
              type="submit"
              className={s.submitButton} // Apply styles to the submit button
            >
              Send
            </button>
          </form>
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