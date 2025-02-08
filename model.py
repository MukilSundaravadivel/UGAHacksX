import sqlite3
from openai import OpenAI

client = OpenAI()

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
# gpt-4o dynamic completion
completion = client.chat.completions.create(
    model="gpt-4o", 
    messages=[
        {"role": "system", "content": "You are a financial advisor assisting users with budgeting, saving, and financial planning."},
        {
            "role": "user",
            "content": f"User spent ${user_data['spending']['rent']} on rent, ${user_data['spending']['groceries']} on groceries, ${user_data['spending']['entertainment']} on entertainment, and saved ${user_data['spending']['savings']} last month. They earned ${user_data['income']}. Their total expenditures were ${user_data['total_expenditures']}. Their checking balance is ${user_data['checking_balance']}, savings balance is ${user_data['savings_balance']}, and CD balance is ${user_data['cd_balance']}. What personalized recommendations do you have for the next three months?"
        },
    ]
)

response = completion.choices[0].message.content

# format the response
formatted_response = f"""
### Current Financial Breakdown:
- **Income**: ${user_data['income']} per month
- **Total Expenditures**: ${user_data['total_expenditures']}
- **Expenses**:
  - Rent: ${user_data['spending']['rent']}
  - Groceries: ${user_data['spending']['groceries']}
  - Entertainment: ${user_data['spending']['entertainment']}
  - Savings: ${user_data['spending']['savings']}
- **Balances**:
  - Checking Balance: ${user_data['checking_balance']}
  - Savings Balance: ${user_data['savings_balance']}
  - CD Balance: ${user_data['cd_balance']}

### Financial Recommendations:
{response}
"""

print(formatted_response)
