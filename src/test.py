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
    
def fetch_league_seeds(league_id,season):
    mlb = mlbstatsapi.Mlb()

    seeds = {}

    standings = mlb.get_standings(league_id,season)

    division_leaders = []
    for division in standings:
        teams = division.teamrecords
        for team_obj in teams:
            if team_obj.divisionchamp:
                division_leaders.append({'name':team_obj.team.name,'rank':team_obj.leaguerank})
                
            wc_rank = team_obj.wildcardrank
            if wc_rank and int(wc_rank) <= 3:
                #seeds.append({'name':team_obj.team.name,'seed':int(wc_rank)+3})
                #seeds[int(wc_rank) + 3] = team_obj.team.name
                seeds[team_obj.team.name] = int(wc_rank) + 3
    
    sorted_division_leaders = sorted(division_leaders, key=lambda x : x['rank'])
    for i,team in enumerate(sorted_division_leaders):
        #seeds[i+1] = team['name']
        #seeds.append({'name':team['name'],'seed':i+1})
        seeds[team['name']] = i + 1

    return seeds

def fetch_playoff_bracket(seeds):
    def initialize_bracket(bracket,current_teams,next_teams):
        #AL side of bracket
        AL_seeds = seeds['AL']
        for i,team in enumerate(AL_seeds):
            if team['seed'] == 1 or team['seed'] == 2:
                next_teams.append(team)
            else:
                current_teams.append(team)
        print(next_teams)


        match_up = {'home':{'name':'Yanks','wins':0,'seed':1},'away':{'name':'Sox','wins':0,'seed':2}}


    r = requests.get('https://statsapi.mlb.com/api/v1/schedule/postseason?season=2024')

    NUM_PLAYOFF_TEAMS = 6
    bracket = {}
    current_teams = []
    next_teams = []

    initialize_bracket(bracket,current_teams,next_teams)



    #postseason_dates = r.json()['dates']
    #for date in postseason_dates:
    #    games = date['games']
    #    for game in games:
    #        if game['seriesDescription'] == 'Wild Card':
    #            print(game)


def temp():
    mlb_seeds = {}

    mlb_seeds['AL'] = fetch_league_seeds(103,2024)
    mlb_seeds['NL'] = fetch_league_seeds(104,2024)

    print(mlb_seeds)
    #fetch_playoff_bracket(mlb_seeds)
    


if __name__ == '__main__':
    #r = requests.get('https://statsapi.mlb.com/api/v1/schedule/postseason?sportId=1&season=2023')
    #playoffs = r.json()['dates']
#
    #for date in playoffs:
    #    games_on_date = date['games']
    #    for game in games_on_date:
    #        print(game['teams'],end='')
    #    print()
    temp()

    
    
#url = "https://statsapi.mlb.com/api/v1/standings?leagueId=103"  # AL Standings
#response = requests.get(url)
#data = response.json()

#
#for record in data['records']:
#    for team in record['teamRecords']:
#        print(f"{team['team']['name']}: {team['wins']}W - {team['losses']}L")





