from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
import time, random, os
import spider as scraper
import mlbstatsapi
import time
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
            players_ref = db.collection('mlb').document('data').collection('players')
            query = players_ref.where(filter=FieldFilter('team', '==', team_abbr))
            docs = query.get()

            total_stats = {}
            num_batters = 0
            num_pitchers = 0

            for doc in docs:
                data = doc.to_dict()
                position = data.get('position', '')
                stats = data.get('stats', {}).get('2025', data.get('stats', {}))

                # Determine player type
                if position.endswith('P'):
                    num_pitchers += 1
                else:
                    num_batters += 1

                # Aggregate stats
                for stat, value in stats.items():
                    if stat in total_stats:
                        total_stats[stat] += float(value)
                    else:
                        total_stats[stat] = float(value)

            # Calculate averages
            avg_stats = {}
            for stat, total in total_stats.items():
                if stat.startswith('b'):  # Assume batter stats start with 'b'
                    divisor = num_batters if num_batters > 0 else 1
                else:
                    divisor = num_pitchers if num_pitchers > 0 else 1
                
                avg_stats[stat] = round(total/divisor,2) if stats_to_average.get(stat) else total

            # Update team document
            team_ref = db.collection('mlb').document('data').collection('teams').document(team_abbr)
            team_ref.set({
                'averageStats': avg_stats,
                'lastUpdated': firestore.SERVER_TIMESTAMP
            }, merge=True)
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
                            player_stats[k] = v
            else:
                stats_obj = mlb.get_player_stats(player.id,stats=STATS,groups=['hitting'],params=PARAMS).get('hitting')

                if stats_obj is not None:
                    stats_basic = stats_obj['season']
                    for split in stats_basic.splits:
                        for k, v in split.stat.__dict__.items():
                            player_stats[k] = v

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
    mongo.db.mlb.update_one(
        {'players.id': player_id},  # Matches the document containing the player
        {
            '$set': {
                'players.$[elem].stats': player_info['stats'],
                'players.$[elem].about': player_info['about'],
                'players.$[elem].awards': player_info['awards']
            }
        },
        array_filters=[{'elem.id': player_id}]  # Targets the specific array element
        )
    

def get_player(player_id):
    player = mongo.db.mlb.find_one(
        {'players.id': player_id},
        {'players.$': 1}
        )
    
    return player


def get_db_names():
    return mongo.cx.list_database_names()


def get_player_names():
    names = mongo.db.mlb.aggregate([
        { '$unwind': "$players" },
        { '$project': { '_id': 0, 'name': "$players.name", 'id': "$players.id" } }
    ])

    return names

def preload_database():
    """
    Load the database with player stats fetched from the MLB Stats API and player images fetched from 
    MLB.com
    """
    mlb_images = load_images()
    mlb_players = fetch_player_objects(mlb_images)

    mongo.db.mlb.insert_one({'players': mlb_players})
