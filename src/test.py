import mlbstatsapi
import time
import requests

from bs4 import BeautifulSoup


MLB_TEAMS = {
    'New York Yankees': 'NYY',
    'Boston Red Sox': 'BOS',
    'Baltimore Orioles': 'BAL',
    'Toronto Blue Jays': 'TOR',
    'Tampa Bay Rays': 'TB',
    'Houston Astros': 'HOU',
    'Athletics': 'ATH',
    'Seattle Mariners': 'SEA',
    'Los Angeles Angels': 'LAA',
    'Texas Rangers': "TEX",
    'Cleveland Guardians': 'CLE',
    'Kansas City Royals': 'KC',
    'Detroit Tigers': 'DET',
    'Chicago White Sox': 'CHW',
    'Minnesota Twins': 'MIN',
    'Los Angeles Dodgers': 'LAD',
    'Arizona Diamondbacks': 'ARI',
    'San Diego Padres': 'SD',
    'Colorado Rockies': 'COL',
    'San Francisco Giants': 'SF',
    'New York Mets': 'NYM',
    'Philadelphia Phillies': 'PHI',
    'Atlanta Braves': 'ATL',
    'Miami Marlins': 'MIA',
    'Washington Nationals': 'WSN',
    'Chicago Cubs': 'CHC',
    'Pittsburgh Pirates': 'PIT',
    'St. Louis Cardinals': 'STL',
    'Milwaukee Brewers': 'MIL',
    'Cincinnati Reds': 'CIN'


}
STATS = ['season','seasonAdvanced']
PARAMS = {'season':2025}

def fetch_player_objects():
    mlb = mlbstatsapi.Mlb()

    test = mlb.get_team_id('Athletics')[0]
    print(test)

    player_list = []
    for team_name,team_abbr in MLB_TEAMS.items():
        team_id = mlb.get_team_id(team_name)[0]
        roster = mlb.get_team_roster(team_id)

        for player in roster:
            print(player)
            obj = {}
            obj['id'] = player.id
            obj['team'] = team_abbr
            obj['position'] = player.primaryposition.abbreviation
            obj['number'] = player.jerseynumber
            obj['name'] = player.fullname

            player_stats = {}
            if player.primaryposition.abbreviation == 'P':
                stats_obj = mlb.get_player_stats(player.id,stats=STATS,groups=['pitching'],params=PARAMS).get('pitching')

                if stats_obj is not None:
                    stats_basic = stats_obj['season']
                    #stats_advanced = stats_obj['seasonadvanced']
                    for split in stats_basic.splits:
                        for k, v in split.stat.__dict__.items():
                            player_stats[k] = v
            else:
                stats_obj = mlb.get_player_stats(player.id,stats=STATS,groups=['hitting'],params=PARAMS).get('hitting')

                if stats_obj is not None:
                    stats_basic = stats_obj['season']
                    for split in stats_basic.splits:
                        for k, v in split.stat.__dict__.items():
                            player_stats[k] = v

            obj['stats'] = {'2025':player_stats}
            player_list.append(obj)

            time.sleep(0.2)
        print(f'{team_abbr} players added!')
        time.sleep(1)
    
    return player_list


def fetch_individual_player():
    mlb = mlbstatsapi.Mlb()
    player_info = {}

    player = mlb.get_person(592450)

    player_info['height'] = player.height
    player_info['weight'] = player.weight
    player_info['batside'] = player.batside.code
    player_info['pitchhand'] = player.pitchhand.code
    player_info['birthdate'] = player.birthdate
    player_info['birthplace'] = player.birthcity + ', ' + player.birthstateprovince

    response = requests.get('https://statsapi.mlb.com/api/v1/people/592450/stats?stats=yearByYear&group=hitting')
    stats = response.json()

    player_info['stats'] = {}
    for split in stats['stats'][0]['splits']:
        season = split['season']
        player_info['stats'][season] = {}

        stat = split['stat']  # This is a dict of all stat categories for the season
        for k, v in stat.items():
            player_info['stats'][season][k] = v

    return player_info
    
    


if __name__ == '__main__':
    player_name = 'Shohei Ohtani'
    
    mlb = mlbstatsapi.Mlb()
    player_id = mlb.get_people_id(player_name)[0]
    player = mlb.get_person(player_id)
    print(player)
    
#url = "https://statsapi.mlb.com/api/v1/standings?leagueId=103"  # AL Standings
#response = requests.get(url)
#data = response.json()

#
#for record in data['records']:
#    for team in record['teamRecords']:
#        print(f"{team['team']['name']}: {team['wins']}W - {team['losses']}L")





