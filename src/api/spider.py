"""
This file will be in control of webscraping various websites for sports information 
such as postseason history and etc.
"""
import requests
import mlbstatsapi

from bs4 import BeautifulSoup, Comment

#mlb_teams = {
#    'NYY': "New York Yankees"
#}

def get_mlb_postseason_results():
    """
    Function to scrape MLB postseason results from 1969 - 2024
    """
    try:
        r = requests.get('https://www.baseball-reference.com/postseason/',timeout=10)
        soup = BeautifulSoup(r.content,'html.parser')
        
    except requests.exceptions.Timeout:
        print("The request timed out")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
    
    tables = soup.find_all('table',class_='stats_table')
    postseason_results = {}
    for table in tables:
        games = table.find_all('a')
        series_standings = list(map(lambda x: x.text,table.find_all('td',class_='')))
        series_standings = list(filter(lambda x: len(x) > 0 and x[0].isdigit(),series_standings))
        standings_i = 0
        for i in range(0,len(games),3):
            series,winner,loser = list(map(lambda x: x.text,games[i:i+3]))
            year = series[0:4]
            series = "".join([char for char in series[5:] if not char.isdigit()])
            standing = series_standings[standings_i]
            standings_i += 1
            if year == '1968':
                break
            winner_split = winner.split('(')
            winner_name = winner_split[0][:-1].replace('*','')
            winner_record = winner_split[1][:-5]

            loser_split = loser.split('(')
            loser_name = loser_split[0][:-1].replace('*','')
            loser_record = loser_split[1][:-5]

            winner = {'name':winner_name,'record':winner_record,'games_won':standing[0]}
            loser = {'name':loser_name,'record':loser_record,'games_won':standing[-1]}

            if postseason_results.get(year) is None:
                #postseason_results[year] = {}
                postseason_results[year] = {"AL":{},"NL":{}}

            #Format our data for easy display on website
            if series == 'World Series':
                winner_conference = winner_split[1][-3:-1]
                if winner_conference == 'AL':
                    postseason_results[year]["AL"]["conference_winner"] = winner
                    postseason_results[year]["NL"]["conference_winner"] = loser
                else:
                    postseason_results[year]["AL"]["conference_winner"] = loser
                    postseason_results[year]["NL"]["conference_winner"] = winner
                continue

            if series[0] == 'A':
                if postseason_results[year]["AL"].get(series) is None:
                    postseason_results[year]["AL"][series] = []
                postseason_results[year]["AL"][series].append({'winner':winner,'loser':loser})
            else:
                if postseason_results[year]["NL"].get(series) is None:
                    postseason_results[year]["NL"][series] = []
                postseason_results[year]["NL"][series].append({'winner':winner,'loser':loser})
    return postseason_results


def get_mlb_team_championships(team_abbr):
    try:
        r = requests.get(f'https://www.baseball-reference.com/teams/{team_abbr}/',timeout=10)
        soup = BeautifulSoup(r.content,'html.parser')
        print(soup)
    except requests.exceptions.Timeout:
        print("The request timed out")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
    table = soup.find('table',id='franchise_years')
    playoff_results = table.find_all('td',attrs={'data-stat':'playoffs'})
    championships = []
    for result in playoff_results:
        if len(result.text) > 0 and result.text[0] == 'W':
            year = result.find('a').get('href')
            year = "".join(filter(lambda x: x.isdigit(),year))
            championships.append(year)
    return championships
    

#add error handling in case of failure to fetch some informationp00
def get_mlb_team_about(team_abbr):
    #about info
    team_information = {}
    championships = get_mlb_team_championships(team_abbr)
    team_information["championships"] = championships

    return team_information

def extract_player_images(player_row):
    player_images = {}

    pic = player_row.find('td',class_='player-thumb').find('img').get('src')

    info = player_row.find('td',class_='info')

    name = info.find('a').text
    player_images[name] = pic

    return(player_images)


#i changed the object to be stats
def extract_player_info(player_table,team_name):
    player_info = {}

    player_rows = player_table.find('tbody').find_all('tr')
    for row in player_rows:
        if not row.has_attr('class'):
            games = row.find('td',attrs={'data-stat':['b_games','p_g']})
            #if int(games.text) <= 5:
            #    continue
            player_ref = row.find('a').get('href')
            cols = row.find_all('td')
            player_name = None
            for col in cols[:len(cols)-2]:
                column_type = col.get('data-stat')
                column_val = col.text
                if column_type == 'name_display':
                    column_val = column_val.replace('*','').replace('#','')
                    player_info[column_val] = {}
                    player_info[column_val]['stats'] = {}
                    player_info[column_val]['ref'] = player_ref
                    player_name = column_val
                    continue
                if column_type == 'team_position':
                    if len(column_val) == 0:
                        column_val = 'RP'
                    player_info[player_name]['position'] = column_val
                    continue
                
                #player_info[player_name]['stats'][column_type] = column_val
                try:
                    converted_val = float(column_val)
                    player_info[player_name]['stats'][column_type] = converted_val
                except ValueError:
                    player_info[player_name]['stats'][column_type] = 0.0

                #input the team
                player_info[player_name]['team'] =  team_name

    return player_info

    

def get_mlb_player_images(team_name):
    player_images = {}
    try:
        r = requests.get(f'https://www.mlb.com/{team_name}/roster',timeout=10)
        soup = BeautifulSoup(r.content,'html.parser')
    except requests.exceptions.Timeout:
        print("The request timed out")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
    #player batting table
    roster_tables = soup.find_all('table',class_='roster__table')
    for table in roster_tables:
        player_rows = table.find('tbody').find_all('tr')
        for row in player_rows:
            player_images.update(extract_player_images(row))
    return player_images


def get_mlb_players(team_name):
    def extract_table(comment, table_id):
        comment_soup = BeautifulSoup(comment, 'html.parser')
        table = comment_soup.find('table', id=table_id)
        return table

    players = {}
    try:
        r = requests.get(f'https://www.baseball-reference.com/teams/{team_name}/2025.shtml#players_standard_pitching')
        soup = BeautifulSoup(r.content,'html.parser')
        
    except requests.exceptions.Timeout:
        print("The request timed out")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

# Function to extract table from comment
    #print(soup.find_all('table',attrs={'id':'players_standard_pitching'}))
    batting_tables = soup.find_all('table',attrs={'id':'players_standard_batting'})
    for table in batting_tables:
        batting_players = extract_player_info(table,team_name)
        players.update(batting_players)

    pitching_tables = soup.find_all('table',attrs={'id':'players_standard_pitching'})
    for table in pitching_tables:
        pitching_players = extract_player_info(table,team_name)
        players.update(pitching_players)


    # Extract pitching table
    #comments = soup.find_all(string=lambda text: isinstance(text, Comment))
    #pitching_table = None
    #for comment in comments:
    #    if 'players_standard_pitching' in comment:
    #        pitching_table = extract_table(comment, 'players_standard_pitching')
    #        pitching_players = extract_player_info(pitching_table)
    #        players.update({k: v for k, v in pitching_players.items() if k not in players})
    #        break
    return players

def get_mlb_individual_player(ref):
    player_info = {}
    try:
        r = requests.get(f'https://www.baseball-reference.com{ref}',timeout=10)
        soup = BeautifulSoup(r.content,'html.parser')
    except requests.exceptions.Timeout:
        print("The request timed out")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
    #about info for player
    about = extract_player_about(soup)
    player_info["about"] = about

    #awards for player
    awards = extract_player_awards(soup)
    player_info['awards'] = awards

    #stats for player
    table = soup.find('table',attrs={'id':'players_standard_batting'})
    year_rows = table.find('tbody').find_all('tr')
    player_info['stats'] = {}
    for row in year_rows:
        year_stat = extract_year_stats(row)
        player_info['stats'].update(year_stat)
    
    return player_info
        

def extract_year_stats(year_row):
    year_stat = {}
    year = year_row.find('a').text
    year_stat[year] = {}

    attributes = year_row.find_all('td')
    for attribute in attributes[3:-2]:
        column_type = attribute.get('data-stat')
        column_value = attribute.text
        try:
            year_stat[year][column_type] = float(column_value)
        except ValueError:
            year_stat[year][column_type] = 0.0
        #year_stat[year][column_type] = column_value
    return year_stat

def extract_player_about(soup):
    def cleanse_string(s):
        chars = '\xa0\n\t '
        for char in chars:
            s = s.replace(char,'')
        return s

    about_obj = {}

    about_div = soup.find('div',attrs={'id':'info'})
    about_birthday = soup.find('span',attrs={'id':'necro-birth'})
    about_number = soup.find('div',class_='uni_holder br').find_all('svg')
    about_info = about_div.find_all('p')
    about_handedness = about_info[1].text.split('•')
    about_size = about_info[2].text.replace('\xa0',' ')
    for info in about_handedness:
        handedness_type,handedness_value = cleanse_string(info).split(':')
        about_obj[handedness_type] = handedness_value[0]

    birthday = ""
    for part in about_birthday:
        birthday += part.text.replace('\n','')
    about_obj['birthday'] = birthday
    about_obj['size'] = about_size
    about_obj['number'] = about_number[-1].find('text').text

    return about_obj


def extract_player_awards(soup):
    def extract_table(comment, table_id):
        comment_soup = BeautifulSoup(comment, 'html.parser')
        table = comment_soup.find('div', id=table_id)
        return table

    comments = soup.find_all(string=lambda text: isinstance(text, Comment))
    award_table = None
    awards = []
    for comment in comments:
        if 'leaderboard_awards' in comment:
            award_table = extract_table(comment, 'leaderboard_awards')
            award_rows = award_table.find_all('tr')
            for row in award_rows:
                awards.append(row.text.replace('\n',''))
            return awards
        
    return awards


def fetch_player_info(player_id):
    mlb = mlbstatsapi.Mlb()
    player_info = {}
    player_info['about'] = {}

    player = mlb.get_person(player_id)

    player_info['about']['height'] = player.height
    player_info['about']['weight'] = player.weight
    player_info['about']['batside'] = player.batside.code
    player_info['about']['pitchhand'] = player.pitchhand.code
    player_info['about']['birthdate'] = player.birthdate
    player_info['about']['birthplace'] = player.birthcity + ', ' + (player.birthstateprovince if player.birthstateprovince else player.birthcountry)

    response = requests.get(f'https://statsapi.mlb.com/api/v1/people/{player_id}/stats?stats=yearByYear&group=hitting&hydrate=awards')
    stats = response.json()

    player_info['stats'] = {}
    for split in stats['stats'][0]['splits']:
        season = split['season']
        player_info['stats'][season] = {}

        stat = split['stat']  # This is a dict of all stat categories for the season
        for k, v in stat.items():
            player_info['stats'][season][k] = v
    
    response = requests.get(f'https://statsapi.mlb.com/api/v1/people/{player_id}?hydrate=awards')

    award_data = response.json()
    people = award_data.get("people", [])
    if people:
        player = people[0]
        awards_obj = player.get("awards", [])
        player_info['awards'] = []
        for award in awards_obj:
            player_info['awards'].append({'name':award['name'],'year':award['season']})
    else:
        player_info['awards'] = []

    return player_info
    



def main():
    link = '/players/j/judgeaa01.shtml'
    soto = '/players/s/sotoju01.shtml'
    #test = get_mlb_individual_player(soto)
    bruh = get_mlb_players('NYY')
    print(bruh)
    

if __name__ == '__main__':
    main()