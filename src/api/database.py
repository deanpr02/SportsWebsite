import firebase_admin
from firebase_admin import credentials, firestore
import time, random, os
import spider as scraper

mlb_teams = ['yankees','redsox','orioles','bluejays','rays',
            'astros','rangers','athletics','angels','mariners',
            'twins','guardians','whitesox','tigers','royals',
            'dodgers','dbacks','giants','padres','rockies',
            'braves','phillies','mets','marlins','nationals',
            'reds','cardinals','cubs','brewers','pirates'
            ]


def load_images():
    player_images = {}
    for team in mlb_teams:
        team_images = scraper.get_mlb_player_images(team)
        player_images.update(team_images)
        time.sleep(random.uniform(2, 10))
    #save to the database
    return player_images


def preload_database():
    mlb_images = load_images()

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

    batch.commit()
    


preload_database()