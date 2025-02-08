import sqlite3

# make (or access) a database 
conn = sqlite3.connect('user_data.db')
cursor = conn.cursor()

cursor.execute('''DROP TABLE IF EXISTS financial_data''')

# make table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS financial_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        income REAL,
        total_expenditures REAL,
        rent REAL,
        groceries REAL,
        entertainment REAL,
        savings REAL,
        checking_balance REAL,
        savings_balance REAL,
        cd_balance REAL
    )
''')

# sample data
sample_users = [
    {'income': 3500, 'total_expenditures': 2200, 'rent': 1200, 'groceries': 400, 'entertainment': 100, 'savings': 200, 'checking_balance': 1500, 'savings_balance': 1000, 'cd_balance': 500},
    {'income': 4000, 'total_expenditures': 2400, 'rent': 1300, 'groceries': 500, 'entertainment': 200, 'savings': 400, 'checking_balance': 2000, 'savings_balance': 1200, 'cd_balance': 700},
    {'income': 5000, 'total_expenditures': 3000, 'rent': 1500, 'groceries': 600, 'entertainment': 400, 'savings': 500, 'checking_balance': 3000, 'savings_balance': 1500, 'cd_balance': 1000},
    {'income': 4500, 'total_expenditures': 2700, 'rent': 1300, 'groceries': 500, 'entertainment': 200, 'savings': 700, 'checking_balance': 2500, 'savings_balance': 800, 'cd_balance': 900},
    {'income': 6000, 'total_expenditures': 3500, 'rent': 1600, 'groceries': 700, 'entertainment': 500, 'savings': 700, 'checking_balance': 3500, 'savings_balance': 2000, 'cd_balance': 1500},
    {'income': 5500, 'total_expenditures': 3200, 'rent': 1500, 'groceries': 600, 'entertainment': 400, 'savings': 700, 'checking_balance': 2800, 'savings_balance': 1800, 'cd_balance': 1200},
    {'income': 7000, 'total_expenditures': 4000, 'rent': 1800, 'groceries': 800, 'entertainment': 500, 'savings': 900, 'checking_balance': 4000, 'savings_balance': 2500, 'cd_balance': 2000},
    {'income': 8000, 'total_expenditures': 4500, 'rent': 2000, 'groceries': 1000, 'entertainment': 700, 'savings': 800, 'checking_balance': 5000, 'savings_balance': 3000, 'cd_balance': 2500},
    {'income': 4500, 'total_expenditures': 2800, 'rent': 1200, 'groceries': 500, 'entertainment': 300, 'savings': 500, 'checking_balance': 2200, 'savings_balance': 1000, 'cd_balance': 700},
    {'income': 5500, 'total_expenditures': 3300, 'rent': 1300, 'groceries': 600, 'entertainment': 400, 'savings': 1000, 'checking_balance': 2700, 'savings_balance': 1600, 'cd_balance': 1100},
    {'income': 6500, 'total_expenditures': 3600, 'rent': 1500, 'groceries': 700, 'entertainment': 500, 'savings': 900, 'checking_balance': 3200, 'savings_balance': 1800, 'cd_balance': 1400},
    {'income': 7200, 'total_expenditures': 4000, 'rent': 1800, 'groceries': 800, 'entertainment': 600, 'savings': 800, 'checking_balance': 4000, 'savings_balance': 2200, 'cd_balance': 1800},
    {'income': 7800, 'total_expenditures': 4500, 'rent': 2000, 'groceries': 900, 'entertainment': 700, 'savings': 900, 'checking_balance': 4500, 'savings_balance': 2500, 'cd_balance': 2000},
    {'income': 4900, 'total_expenditures': 2900, 'rent': 1300, 'groceries': 600, 'entertainment': 400, 'savings': 600, 'checking_balance': 2300, 'savings_balance': 1400, 'cd_balance': 800},
    {'income': 5300, 'total_expenditures': 3100, 'rent': 1400, 'groceries': 700, 'entertainment': 500, 'savings': 600, 'checking_balance': 2400, 'savings_balance': 1500, 'cd_balance': 1000}
]

# insert that user data into the database
for user in sample_users:
    cursor.execute('''
        INSERT INTO financial_data (income, total_expenditures, rent, groceries, entertainment, savings, checking_balance, savings_balance, cd_balance)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (user['income'], user['total_expenditures'], user['rent'], user['groceries'], user['entertainment'], user['savings'], user['checking_balance'], user['savings_balance'], user['cd_balance']))

conn.commit()

# print output to console
cursor.execute('SELECT * FROM financial_data')
rows = cursor.fetchall()
for row in rows:
    print(row)

conn.close()
