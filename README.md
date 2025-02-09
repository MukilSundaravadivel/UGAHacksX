# UGAHacksX
### Project by:

- Kevin Xiang
- Vaishali Prahalad
- Mukil Sundaravadivel
- Rohit Rao


## Purpose
One of the most essential things in a user’s mobile banking application is their financial data. Of course, humans are visual beings — an influx of verbose textual data makes it difficult to analyze and interpret that data. With this in mind, we created our project, Truist Coach. Truist Coach enhances two aspects of mobile banking. One, it visualizes users’ financial data and financial history, allowing them to interact with the different proportions of their recent expenditures and the allocation of their money in various accounts and investment portfolios. Two, it uses a large-language model (LLM) to create hyper-personalized recommendations for how the user should approach the next month (in terms of budgeting, spending, saving, etc.) in order to increase their financial responsibility. 
## Tools utilized
For our front-end, we used React.JS to build a responsive web interface. This was connected to our backend using Flask.
We used Python for the backend scripts - including training the model, generating and organizing data and connecting with OpenAI GPT-4 API for our LLM. We also used SQL to interact with a database.

## Problems we ran into & how we overcame them
- Learning new frameworks–we spent a lot of time learning how to _start_ a React project, following which we had to enhance our frontend interface. We also had to learn prompt engineering and fine-tuning to successfully run an LLM on the backend that met the requirements of the project.
- Another problem we encountered was creating links between the frontend and the backend. Although we were able to create an independent frontend and backend, we found it somewhat challenging to link them together. To overcome this problem, we spent quality time ensuring there was a strong link between the frontend and backend (i.e., users on the frontend can press buttons that call the model in the backend, returning a response that is then displayed on the frontend for the user to see).

## Credit any public frameworks (APIs, etc.)
- Used OpenAI GPT-4o API
