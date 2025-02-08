from openai import OpenAI
client = OpenAI()


# dummy user data
user_data = {
    'spending': {
        'rent': 1200,
        'groceries': 400,
        'entertainment': 100,
        'savings': 200
    },
    'income': 3500,
    'goal': 'saving for a home'
}


# gpt 4o dynamic completion
completion = client.chat.completions.create(
    model="gpt-4o", 
    messages=[
        {"role": "system", "content": "You are a financial advisor assisting users with budgeting, saving, and financial planning."},
        {
            "role": "user",
            "content": f"User spent ${user_data['spending']['rent']} on rent, ${user_data['spending']['groceries']} on groceries, ${user_data['spending']['entertainment']} on entertainment, and saved ${user_data['spending']['savings']} last month. They earned ${user_data['income']}. Their goal is {user_data['goal']}. What personalized recommendations do you have for the next three months?"
        },
    ]
)

response = completion.choices[0].message.content

# format response
formatted_response = f"""
### Current Financial Breakdown:
- **Income**: ${user_data['income']} per month
- **Expenses**:
  - Rent: ${user_data['spending']['rent']}
  - Groceries: ${user_data['spending']['groceries']}
  - Entertainment: ${user_data['spending']['entertainment']}
  - Savings: ${user_data['spending']['savings']}
- **Goal**: {user_data['goal']}

### Financial Recommendations:
{response}
"""

print(formatted_response)
