import sqlite3
from openai import OpenAI

#from dotenv import load_dotenv
import os
import re
import json

class Model():
    def __init__(self):
        #load_dotenv()
        openAi_api_key = os.getenv("OPEN_AI_API_KEY")

        self.client = OpenAI(api_key = openAi_api_key)

        # connect to database
        conn = sqlite3.connect('user_data.db')
        cursor = conn.cursor()

        cursor.execute("SELECT income, total_expenditures, rent, groceries, entertainment, savings, checking_balance, savings_balance, cd_balance FROM financial_data WHERE id = 1")
        user_data_row = cursor.fetchone() # fetches first (0th) row

        # get the user data from the database
        if user_data_row:
            self.user_data = {
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

        Total Assets: ${self.user_data['checking_balance'] + self.user_data['savings_balance'] + self.user_data['cd_balance']}
        Checking Account: ${self.user_data['checking_balance']}
        Savings Account: ${self.user_data['savings_balance']}
        Certificate of Deposits: ${self.user_data['cd_balance']}
        Income Last Month: ${self.user_data['income']}
        Expenditures Last Month: ${self.user_data['total_expenditures']}

        Last Month's Expenditures:
        - Rent: ${self.user_data['spending']['rent']}
        - Groceries: ${self.user_data['spending']['groceries']}
        - Entertainment: ${self.user_data['spending']['entertainment']}
        - Savings: ${self.user_data['spending']['savings']}

        You are to use a series of identifiers enclosed within \BEGINIDENTIFIERS the line before the first identifier and \ENDIDENTIFIERS the line after the last identifier. These identifiers will be used to generate multimodal elements directly after each text message in order, so ensure chronology of the message. Put this at the top of the message.

        When the user first say's "Hello" provide an introduction and a summary of their current financial data. Add the CURRENTACCT identifier to the message header to generate visualizations for current account balances.

        When the user asks for future plan, generate tips to optimize their spending. Add one or more of the following identifiers for more resources: GROCERIES for an article on grocery saving tips, CERTIFICATES for a video on how to grow assets with CDs, RENT for an article on how to reduce rent costs, JOBS for a video on finding jobs.

        When the user asks to transfer funds between accounts, if either account is a CD, direct them to make an appointment with their branch with the NEARBYBRANCHES identifier. If not, ascertain the amount the user would like to transfer, then put the identifier TRANSFER_acct1_acct2_funds in the header where acct1 and acct2 is replaced by the either SAVINGS or CHECKING. acct1 is transfering funds to acct2. funds is replaced by the amount transferred. After this, the user will either send SUCCESS or FAIL with a failure message. Do not prompt the user for this information or indicate that you expect this message as this is a system message. If the message is SUCCESS assure the user that the transfer was successful. Otherwise, inform the reason why the transfer failed. If the failure was not specified, respond with a generic response but do not prompt for the failure reason.

        When the user asks to transfer funds to another user through Zelle, ask for the Zelle information of the other user and how much wants to be transferred. Then put the ZELLE_zelleacct_funds identifier in the header where zellacct replaced by either a phone number or email to transfer funds to and funds is replaced the amount transferred. Wait for a SUCCESS or FAIL message like the transfer between accounts instructions.

        When you haven't identified another response from above, direct the user to call their nearest bank and add the NEARBYBRANCHES identifier for a google maps api call for nearby Truist branches.

        End your messages with three new short chat suggestions enclosed within \BEGINSUGGESTIONS and \ENDSUGGESTIONS. Within these two signals, put one chat suggestion for the user on each line."""


        self.conversation_summary = f"""
        User's Financial Summary:
        - Income: ${self.user_data['income']}
        - Total Expenditures: ${self.user_data['total_expenditures']}
        - Checking: ${self.user_data['checking_balance']}
        - Savings: ${self.user_data['savings_balance']}
        - CDs: ${self.user_data['cd_balance']}

        Last AI Suggestion: (No suggestions yet)
        """

        self.zelle_transfer_done = False
        self.zelle_account = ""
        self.zelle_amount = 0.0
    
    def extract_identifiers_and_suggestions(self, response):
        # Extract identifiers
        identifiers = re.findall(r'\\BEGINIDENTIFIERS(.*?)\\ENDIDENTIFIERS', response, re.DOTALL)
        # Extract suggestions
        suggestions = re.findall(r'\\BEGINSUGGESTIONS(.*?)\\ENDSUGGESTIONS', response, re.DOTALL)

        for i in range(len(identifiers)):
            identifiers[i] = identifiers[i].strip()

        for i in range(len(suggestions)):
            suggestions[i] = suggestions[i].strip()
        
        
        return identifiers, suggestions


    def clean_response(self, response):
            # Remove identifiers and suggestions sections from the message to user
            clean_response = re.sub(r'\\BEGINIDENTIFIERS.*?\\ENDIDENTIFIERS', '', response, flags=re.DOTALL)
            clean_response = re.sub(r'\\BEGINSUGGESTIONS.*?\\ENDSUGGESTIONS', '', clean_response, flags=re.DOTALL)
            return clean_response.strip()


    def process_zelle_transfer(self, identifiers):
        for identifier in identifiers:
            if identifier.startswith("ZELLE"):
                split = identifier.split("_")
                if split:
                    zelle_account = split[1]
                    transfer_amount = float(split[2])
                    pseudoQuestion = ""
                    
                    # Check if it's the first time Zelle information is being entered
                    if not self.zelle_transfer_done:
                       self.zelle_account = zelle_account
                       self.zelle_amount = transfer_amount
                       self.zelle_transfer_done = True
                       pseudoQuestion = f"SUCCESS Zelle transfer request received. Please confirm the transfer of ${self.zelle_amount} to {self.zelle_account}."

                    # Process transfer after the first input
                    # Subtract transfer amount from current balance (Checking or Savings)
                    if self.user_data['checking_balance'] >= transfer_amount:
                        self.user_data['checking_balance'] -= transfer_amount
                        balance_type = "Checking"
                        pseudoQuestion = f"The transfer of ${transfer_amount} to {zelle_account} was successful. Your new {balance_type} balance is ${self.user_data[balance_type.lower() + '_balance']}."
                    elif self.user_data['savings_balance'] >= transfer_amount:
                        self.user_data['savings_balance'] -= transfer_amount
                        balance_type = "Savings"
                        pseudoQuestion = f"The transfer of ${transfer_amount} to {zelle_account} was successful. Your new {balance_type} balance is ${self.user_data[balance_type.lower() + '_balance']}."
                    else:
                        balance_type = "None"
                        pseudoQuestion = f"FAIL Insufficient funds for Zelle transfer."

                    completion = self.client.chat.completions.create(
                        model="gpt-4o",
                        messages=[
                            {"role": "system", "content": self.prompt_engineering},
                            {
                                "role": "user",
                                "content": f"{self.conversation_summary}\nUser's question: {pseudoQuestion}",
                            },
                        ]
                    )

                    response = completion.choices[0].message.content
                    print("\n" + response)

                    # update conversation summary
                    self.conversation_summary = f"""
                    {self.conversation_summary}
        
                    User: {pseudoQuestion}
                    AI: {response}
                    """
                    return response
        return None


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

        identifiers, suggestions = self.extract_identifiers_and_suggestions(response)

        # update conversation summary
        self.conversation_summary = f"""
        {self.conversation_summary}
        
        User: {user_question}
        AI: {response}
        """

        zelle_message = self.process_zelle_transfer(identifiers)
        if zelle_message:
            response = zelle_message
        
        clean_message = self.clean_response(response)

        data = {
            "message": clean_message,
            "identifiers": identifiers[0].splitlines() if identifiers else [],
            "suggestions": suggestions[0].splitlines() if suggestions else []
        }

        # write the data to a JSON file
        filename = f"response_{len(os.listdir()) + 1}.json"
        with open(filename, "w") as json_file:
            json.dump(data, json_file, indent=4)
        
        print("\n" + clean_message)


    def main(self):
        while True:
            user_question = input("\nAsk a question about your finances (or type 'exit' to quit): ")

            # exit condition
            if user_question.lower() == "exit":
                print("Goodbye!")
                break

            self.newInput(user_question)

if __name__ == "__main__":
    model = Model()
    model.main()






        