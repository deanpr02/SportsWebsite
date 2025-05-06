import mlbstatsapi
import requests

game_pk = requests.get("https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=2025-05-03").json()
game_pk = game_pk['dates'][0]['games'][0]['gamePk']

mlb = mlbstatsapi.Mlb()
lineups = {}
lineups['home'] = {'batting':[],'pitching':[]}
lineups['away'] = {'batting':[],'pitching':[]}

boxscore = mlb.get_game(game_pk).livedata.boxscore

home = boxscore.teams.home
away = boxscore.teams.away


home_players = home.players
home_batting_order = home.battingorder

away_players = away.players
away_batting_order = away.battingorder

players = {}
for player in home_players.values():
    player_obj = {}
    status = player.gamestatus
    if not status.isonbench:
        player_obj['name'] = player.person.fullname
        player_obj['position'] = player.position.abbreviation
        player_obj['number'] = player.jerseynumber

        if player.position.abbreviation == 'P':
            continue
        else:
            player_obj['ab'] = 0
            player_obj['h'] = 0
            player_obj['rbi'] = 0
            player_obj['1b'] = 0
            player_obj['2b'] = 0
            player_obj['3b'] = 0
            player_obj['hr'] = 0
            player_obj['so'] = 0
            player_obj['bb'] = 0

        players[player.person.id] = player_obj

    
for player in away_players.values():
    player_obj = {}
    status = player.gamestatus
    if not status.isonbench:
        player_obj['name'] = player.person.fullname
        player_obj['position'] = player.position.abbreviation
        player_obj['number'] = player.jerseynumber

        if player.position.abbreviation == 'P':
            continue
        else:
            player_obj['ab'] = 0
            player_obj['h'] = 0
            player_obj['rbi'] = 0
            player_obj['1b'] = 0
            player_obj['2b'] = 0
            player_obj['3b'] = 0
            player_obj['hr'] = 0
            player_obj['so'] = 0
            player_obj['bb'] = 0
        
        players[player.person.id] = player_obj


for i in range(9):
    lineups['home']['batting'].append(players[home_batting_order[i]])
    lineups['away']['batting'].append(players[away_batting_order[i]])

for pitcher in home.pitchers:
    lineups['home']['pitching'].append(players[pitcher])

for pitcher in away.pitchers:
    lineups['away']['pitching'].append(players[pitcher])




