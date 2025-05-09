"""
This file controls database operations such as retrieving and saving information to the MongoDB/
"""

import time
import random
import spider as scraper
import mlbstatsapi
from util import mongo

mlb_teams = ['yankees','redsox','orioles','bluejays','rays',
            'astros','rangers','athletics','angels','mariners',
            'twins','guardians','whitesox','tigers','royals',
            'dodgers','dbacks','giants','padres','rockies',
            'braves','phillies','mets','marlins','nationals',
            'reds','cardinals','cubs','brewers','pirates'
            ]

mlb_abbrs = ['NYY','BOS','BAL','TOR','TB',
            'HOU','TEX','ATH','LAA','SEA',
            'MIN','CLE','CHW','DET','KC',
            'LAD','ARI','SF','SD','COL',
            'ATL','PHI','NYM','MIA','WSN',
            'CIN','STL','CHC','MIL','PIT']

stats_to_average = {
    'b_ba':True,
    'b_obp':True,
    'b_slugging_perc':True,
    'b_onbase_plus_slugging':True,
    'b_onbase_plus_slugging_plus':True,
    'b_rbat_plus':True,
    'p_earned_run_avg':True,
    'p_earned_run_avg_plus':True,
    'p_fip':True,
    'p_whip':True,
    'p_hr_per_nine':True,
    'p_bb_per_nine':True,
    'p_so_per_nine':True,
    'p_hits_per_nine':True,
    'p_win_loss_perc':True

}

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


def load_images():
    player_images = {}
    for team in mlb_teams:
        team_images = scraper.get_mlb_player_images(team)
        player_images.update(team_images)
        time.sleep(random.uniform(2, 10))
    #save to the database

    print('Fetched images!')
    return player_images

def load_players():
    player_stats = {}
    for team in mlb_abbrs:
        players = scraper.get_mlb_players(team)
        player_stats.update(players)
        time.sleep(random.uniform(2,10))
    
    print('Fetched stats!')
    return player_stats

def calculate_team_averages(db):
    print("\nCalculating team averages...")
    for team_abbr in mlb_abbrs:
        try:

            total_stats = {}
            num_batters = 0
            num_pitchers = 0


            # Calculate averages
            avg_stats = {}
            for stat, total in total_stats.items():
                if stat.startswith('b'):  # Assume batter stats start with 'b'
                    divisor = num_batters if num_batters > 0 else 1
                else:
                    divisor = num_pitchers if num_pitchers > 0 else 1
                
                avg_stats[stat] = round(total/divisor,2) if stats_to_average.get(stat) else total

            #update database here
            
            print(f"Updated averages for {team_abbr}")

        except Exception as e:
            print(f"Error processing {team_abbr}: {str(e)}")

def get_players(player_images,player_stats):
    players = []
    for key,obj in player_stats.items():
        player_image = player_images.get(key)
        
        player_obj = {'name': key, 'image=link':player_image, 'stats':obj['stats'], 'position':obj['position'], 'team':obj['team']}
        players.append(player_obj)
    
    return players

def fetch_player_objects(images):
    mlb = mlbstatsapi.Mlb()

    player_list = []
    for team_name,team_abbr in MLB_TEAMS.items():
        team_id = mlb.get_team_id(team_name)[0]
        roster = mlb.get_team_roster(team_id)

        for player in roster:
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
                            stat_name = k.lower()
                            player_stats[stat_name] = v
            else:
                stats_obj = mlb.get_player_stats(player.id,stats=STATS,groups=['hitting'],params=PARAMS).get('hitting')

                if stats_obj is not None:
                    stats_basic = stats_obj['season']
                    for split in stats_basic.splits:
                        for k, v in split.stat.__dict__.items():
                            stat_name = k.lower()
                            player_stats[stat_name] = v

            obj['stats'] = {'2025':player_stats}

            #image
            if images.get(player.fullname) is not None:
                obj['image-link'] = images.get(player.fullname)
            
            player_list.append(obj)

            time.sleep(0.2)
        print(f'{team_abbr} players added!')
        time.sleep(1)
    
    return player_list


def get_depth_chart(team_name):
    players = list(mongo.db.mlb.aggregate([
                    { '$unwind': "$players" },
                    { '$match': { "players.team": team_name } },
                    { '$replaceRoot': { 'newRoot': "$players" } }
        ]))
    
    return players

def get_team_ranks(team_name):
    team_ranks = mongo.db.mlb.aggregate([
        {'$unwind': '$players'},
        {
            '$group': {
                '_id': '$players.team',
                'homeruns': {'$sum': {
                    '$cond': [
                        {'$ne': ['$players.position', 'P']},
                        '$players.stats.2025.homeruns',
                        0
                    ]
                }},
                'runs': {'$sum': {
                    '$cond': [
                        {'$ne': ['$players.position', 'P']},
                        '$players.stats.2025.runs',
                        0
                    ]
                }},
                'era': {'$sum': {
                    '$cond': [
                        {'$eq': ['$players.position', 'P']},
                        '$players.stats.2025.earnedruns',
                        0
                    ]
                }}
            }
        },
        {
            '$setWindowFields': {
                'sortBy': {'homeruns':-1},
                'output': {
                    'hr_rank': {'$rank': {}}
                }
            }
        },
        {
            '$setWindowFields': {
                'sortBy': {'runs':-1},
                'output': {
                    'runs_rank': {'$rank': {}}
                }
            }
        },
        {
            '$setWindowFields': {
                'sortBy': {'era':1},
                'output': {
                    'era_rank': {'$rank': {}}
                }
            }
        },
        {'$match':{'_id':team_name}}
    ])
    return team_ranks


def is_player_in_database(player_id):
    is_exists = mongo.db.mlb.count_documents({
        'players': {
            '$elemMatch': {
                'id': player_id,
                'about': {'$exists':True}
            }
        }
    }) > 0

    return is_exists


def update_player(player_id,player_info):
    """
    After fetching the player's information from the API this function updates the player in the database.
    When we preload the database only some information from each player is added. Once that player's page is
    accessed then we gather the additional information to save time during preloading
    """
    
    mongo.db.mlb.update_one(
        {'players.id': player_id},
        {
            '$set': {
                'players.$[elem].stats': player_info['stats'],
                'players.$[elem].about': player_info['about'],
                'players.$[elem].awards': player_info['awards']
            }
        },
        array_filters=[{'elem.id': player_id}]
        )
    

def get_player(player_id):
    """
    Gets a single players information such as about info, awards info, and stats info
    """

    player = mongo.db.mlb.find_one(
        {'players.id': player_id},
        {'players.$': 1}
        )
    
    return player


def get_db_names():
    """
    Gets what databases already exist, this is to see if our 'sports_website' database exists, if not we needed to run
    the preload database function
    """

    return mongo.cx.list_database_names()


def get_player_names(amnt):
    """
    Fetches all the players names in our database along with their ID for allowed
    capability of full player fetching in components
    """
    names = []
    if amnt == 'all':
        names = mongo.db.mlb.aggregate([
            { '$unwind': "$players" },
            { '$project': { '_id': 0, 'name': "$players.name", 'id': "$players.id" } }
        ])
        return names

    if amnt == 'P':
        names = mongo.db.mlb.aggregate([
            {
                "$addFields": {
                    "players": {
                        "$filter": {
                        "input": "$players",
                        "as": "player",
                        "cond": { "$eq": ["$$player.position", "P"] }
                        }
                    }
                }
            },
            { "$unwind": "$players" },
            { "$project": { "_id": 0, "name": "$players.name", "id": "$players.id" } }
            ])
    else:
        names = mongo.db.mlb.aggregate([
            {
                "$addFields": {
                    "players": {
                        "$filter": {
                        "input": "$players",
                        "as": "player",
                        "cond": { "$ne": ["$$player.position", "P"] }
                    }
                }
            }
        },
        { "$unwind": "$players" },
        { "$project": { "_id": 0, "name": "$players.name", "id": "$players.id" } }
])

    return names


def get_player_images(player_list):
    """
    Fetches the player images given a list of player names. 
    """
    player_images = mongo.db.mlb.aggregate([
        {'$project': {
            'players': {
                '$filter': {
                    'input': '$players',
                    'as': 'player',
                    'cond': {
                        '$in': ['$$player.name',player_list]
                    }
                }
            }
        }},
        {'$unwind': '$players'},
        {
            '$project': {
            '_id': 0,
            'name': '$players.name',
            'image': '$players.image-link'
            }
        }
    ])

    return player_images

def update_db_status(current_date):
    status = mongo.db.mlb.find_one({'update': {'$exists': True}}, {'_id': 0, 'update': 1})
    updated_games = None

    if status is None:
        mongo.db.mlb.insert_one({'update': {'lastUpdated':current_date,'updatedTeams':[]}})
        updated_games = []
    else:
        last_updated = status['update']['lastUpdated']
        if last_updated == current_date:
            updated_games = status['update'].get('updatedTeams', [])
        else:
            mongo.db.mlb.update_one(
                {'update': {'$exists': True}},
                {'$set': {'update.lastUpdated': current_date, 'update.updatedTeams': []}}
            )
            updated_games = []
    
    games_to_update = scraper.get_todays_games(updated_games)
    updated_games = games_to_update + updated_games
    mongo.db.mlb.update_one(
                {'update': {'$exists': True}},
                {'$set': {'update.updatedTeams': updated_games}}
    )

    return games_to_update
    

def update_season_stats(player_stats):
    for player_id, update_fields in player_stats.items():
        result = mongo.db.mlb.update_one(
        {'players.id': player_id},
        {
            '$set': {
                'players.$[elem].stats.2025': update_fields,
            }
        },
        array_filters=[{'elem.id': player_id}]
        )




def preload_database():
    """
    Load the database with player stats fetched from the MLB Stats API and player images fetched from 
    MLB.com
    """
    mlb_images = load_images()
    mlb_players = fetch_player_objects(mlb_images)

    mongo.db.mlb.insert_one({'players': mlb_players})
