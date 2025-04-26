import pandas as pd

dataset_encoding = {
    'TBD': 'TB',
    'SFG': 'SF',
    'KCR': 'KC',
    'ANA': 'LAA',
    'OAK': 'ATH',
    'FLA': 'MIA',
    'SDP': 'SD'
}

def fix_formatting():
    df = pd.read_csv('./data/MLB_History.csv')

    for old,new in dataset_encoding.items():
        df['franchID'] = df['franchID'].replace(old,new)

    df.to_csv('./data/MLB_History.csv',index=False)

def parse_team_history(teamID):
    df = pd.read_csv('./data/MLB_History.csv')

    team_rows = df.loc[df['franchID'] == teamID]

    team_history = {}
    team_history['postseason'] = {'ws_wins': [],'cf_wins': [],'div_wins': [],'wc_wins': []}
    team_history['results'] = []
    for _, row in team_rows.iterrows():
        season_obj = {}
        year = row['yearID']

        #Set the year for the season object
        season_obj['year'] = year

        #Get standing stats such as W-L record
        #and division standings (1st,2nd,etc.)
        season_obj['wins'] = row['W']
        season_obj['losses'] = row['L']
        season_obj['rank'] = row['Rank']
        season_obj['finish'] = '---'

        #Get postseason results such as # of WS wins
        if row['DivWin'] == 'Y':
            team_history['postseason']['div_wins'].append(year)
        
        if row['WCWin'] == 'Y':
            team_history['postseason']['wc_wins'].append(year)
            season_obj['finish'] = 'Won WC'

        if row['LgWin'] == 'Y':
            team_history['postseason']['cf_wins'].append(year)
            season_obj['finish'] = 'Won Conference'

        if(row['WSWin'] == 'Y'):
            team_history['postseason']['ws_wins'].append(year)
            season_obj['finish'] = 'Won WS'
        
        team_history['results'].append(season_obj)

    return team_history


