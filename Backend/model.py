import sqlite3
from openai import OpenAI

from dotenv import load_dotenv
import os

class Model():
    def __init__(self):
        # Load environment variables from .env file
        load_dotenv()
        openAi_api_key = os.getenv("OPEN_AI_API_KEY")

        self.client = OpenAI(api_key = openAi_api_key)

        # connect to database
        conn = sqlite3.connect('user_data.db')
        cursor = conn.cursor()

        cursor.execute("SELECT income, total_expenditures, rent, groceries, entertainment, savings, checking_balance, savings_balance, cd_balance FROM financial_data WHERE id = 1")
        user_data_row = cursor.fetchone() # fetches first (0th) row

        # get the user data from the database
        if user_data_row:
            user_data = {
                'income': user_data_row[0],
                'total_expenditures': user_data_row[1],
                'spending': {
                    'rent': user_data_row[2],
                    'groceries': user_data_row[3],
                    'entertainment': user_data_row[4],
                    'savings': user_data_row[5]
                },
                'checking_balance': user_data_row[6],
                'savings_balance': user_data_row[7],
                'cd_balance': user_data_row[8],
            }
        else:
            print("No user data found")
            conn.close()
            exit()

        conn.close()

        self.prompt_engineering = f"""You are a chatbot that helps Truist customers with their financial data. The customer has the following data:

        Total Assets: ${user_data['checking_balance'] + user_data['savings_balance'] + user_data['cd_balance']}
        Checking Account: ${user_data['checking_balance']}
        Savings Account: ${user_data['savings_balance']}
        Certificate of Deposits: ${user_data['cd_balance']}
        Income Last Month: ${user_data['income']}
        Expenditures Last Month: ${user_data['total_expenditures']}

        Last Month's Expenditures:
        - Rent: ${user_data['spending']['rent']}
        - Groceries: ${user_data['spending']['groceries']}
        - Entertainment: ${user_data['spending']['entertainment']}
        - Savings: ${user_data['spending']['savings']}

        You are to use a series of identifiers enclosed within \BEGINIDENTIFIERS the line before the first identifier and \ENDIDENTIFIERS the line after the last identifier. These identifiers will be used to generate multimodal elements directly after each text message in order, so ensure chronology of the message. Put this at the top of the message.

        When the user first say's "Hello" provide an introduction and a summary of their current financial data. Add the CURRENTACCT identifier to the message header to generate visualizations for current account balances.

        When the user asks for future plan, generate tips to optimize their spending. Add one or more of the following identifiers for more resources: GROCERIES for an article on grocery saving tips, CERTIFICATES for a video on how to grow assets with CDs, RENT for an article on how to reduce rent costs, JOBS for a video on finding jobs.

        When the user asks to transfer funds between accounts, if either account is a CD, direct them to make an appointment with their branch with the NEARBYBRANCHES identifier. If not, ascertain the amount the user would like to transfer, then put the identifier TRANSFER_acct1_acct2_funds in the header where acct1 and acct2 is replaced by the either SAVINGS or CHECKING. acct1 is transfering funds to acct2. funds is replaced by the amount transferred. After this, the user will either send SUCCESS or FAIL with a failure message. Do not prompt the user for this information or indicate that you expect this message as this is a system message. If the message is SUCCESS assure the user that the transfer was successful. Otherwise, inform the reason why the transfer failed. If the failure was not specified, respond with a generic response but do not prompt for the failure reason.

        When the user asks to transfer funds to another user through Zelle, ask for the Zelle information of the other user and how much wants to be transferred. Then put the ZELLE_zelleacct_funds identifier in the header where zellacct replaced by either a phone number or email to transfer funds to and funds is replaced the amount transferred. Wait for a SUCCESS or FAIL message like the transfer between accounts instructions.

        When you haven't identified another response from above, direct the user to call their nearest bank and add the NEARBYBRANCHES identifier for a google maps api call for nearby Truist branches.

        End your messages with three new short chat suggestions enclosed within \BEGINSUGGESTIONS and \ENDSUGGESTIONS. Within these two signals, put one chat suggestion for the user on each line."""


        self.conversation_summary = f"""
        User's Financial Summary:
        - Income: ${user_data['income']}
        - Total Expenditures: ${user_data['total_expenditures']}
        - Checking: ${user_data['checking_balance']}
        - Savings: ${user_data['savings_balance']}
        - CDs: ${user_data['cd_balance']}

        Last AI Suggestion: (No suggestions yet)
        """
    

    def newInput(self, user_question):
        # gpt-4o dynamic completion
        completion = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": self.prompt_engineering},
                {
                    "role": "user",
                    "content": f"{self.conversation_summary}\nUser's question: {user_question}",
                },
            ]
        )

        response = completion.choices[0].message.content

        # update conversation summary
        self.conversation_summary = f"""
        {self.conversation_summary}
        
        User: {user_question}
        AI: {response}
        """

        print("\n### AI Response:\n", response)

        return response;



        
