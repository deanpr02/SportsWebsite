import mlbstatsapi
import requests
from datetime import date,timedelta

mlb = mlbstatsapi.Mlb()
team_id = mlb.get_team_id('New York Yankees')[0]
roster = mlb.get_team_roster(team_id)

for player in roster:
    if player.fullname == 'Aaron Judge':
        print(player.id)

player_id  = mlb.get_people_id('Aaron Judge')[0]
print(player_id)

