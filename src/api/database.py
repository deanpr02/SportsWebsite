import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
import time, random, os
import spider as scraper

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


def load_images():
    player_images = {}
    for team in mlb_teams:
        team_images = scraper.get_mlb_player_images(team)
        player_images.update(team_images)
        time.sleep(random.uniform(2, 10))
    #save to the database
    return player_images

def load_players():
    player_stats = {}
    for team in mlb_abbrs:
        players = scraper.get_mlb_players(team)
        player_stats.update(players)
        time.sleep(random.uniform(2,10))
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

def preload_database():
    mlb_images = load_images()
    mlb_stats = load_players()

    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(current_dir, "firebase-admin-key.json")

    cred = credentials.Certificate(json_path)
    firebase_admin.initialize_app(cred)

    db = firestore.client()

    batch = db.batch()
    player_ref = db.collection('mlb').document('data').collection('players')
    for player_name, image_link in mlb_images.items():
        player_doc = player_ref.document(player_name)
        batch.set(player_doc,{'image-link': image_link})

    for player_name,stats in mlb_stats.items():
        player_doc = player_ref.document(player_name)
        batch.set(player_doc,stats,merge=True)

    batch.commit()

    calculate_team_averages(db)
    

#current_dir = os.path.dirname(os.path.abspath(__file__))
#json_path = os.path.join(current_dir, "firebase-admin-key.json")
#cred = credentials.Certificate(json_path)
#firebase_admin.initialize_app(cred)
#db = firestore.client()
#calculate_team_averages(db)
preload_database()