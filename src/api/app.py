from flask import Flask,jsonify,request
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_jwt_extended import JWTManager,create_access_token,jwt_required,get_jwt_identity,set_access_cookies
from werkzeug.security import generate_password_hash,check_password_hash
import os
import spider as scraper
from util import mongo
from dataset import parse_team_history
import database as db

app = Flask(__name__)
CORS(app)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/sports_website'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config["JWT_SESSION_COOKIE"]= False

socketio = SocketIO(app,cors_allowed_origins='*')
jwt = JWTManager(app)

mongo.init_app(app)

cache = {}


@app.route('/api/webscrape/postseason',methods=['GET'])
def webscrape_postseason_results():
    """
    GET request to get webscraped postseason information for MLB
    """
    if cache.get("MLB") is None:
        results = scraper.get_mlb_postseason_results()
        cache["MLB"] = results
        return jsonify(results)
    results = cache["MLB"]
    return jsonify(results)

@app.route('/api/webscrape/team',methods=['GET'])
def webscrape_team_information():
    """
    GET request to webscrape information about a certain team
    """
    name = request.args.get('name')
    if name is None:
        return jsonify([])
    if cache.get(name) is None:
        about_info = scraper.get_mlb_team_about(name)
        cache[name] = about_info
        return jsonify(about_info)
    about_info = cache[name]
    return jsonify(about_info)

@app.route('/api/webscrape/players',methods=['GET'])
def webscrape_player_information():
    """
    GET request to webscrape the players on a specific team
    """
    name = request.args.get('name')
    name = name.lower().replace(' ','')
    print(name)
    if name is None:
        return jsonify([])
    if cache.get(f'{name}-players') is None:
        players_info = scraper.get_mlb_players(name)
        cache[f'{name}-players'] = players_info
        return jsonify(players_info)
    players_info = cache[f'{name}-players']
    return jsonify(players_info)

@app.route('/api/webscrape/images',methods=['GET'])
def webscrape_player_images():
    """
    GET request to webscrape the players on a specific team
    """
    name = request.args.get('name')
    name = name.lower().replace(' ','')
    if name is None:
        return jsonify([])
    if cache.get(f'{name}-images') is None:
        players_images = scraper.get_mlb_player_images(name)
        cache[f'{name}-images'] = players_images
        return jsonify(players_images)
    players_images = cache[f'{name}-images']
    return jsonify(players_images)

@app.route('/api/webscrape/individual_player',methods=['GET'])
def webscrape_individual_player():
    """
    GET request to webscrape the players on a specific team
    """
    ref = request.args.get('ref')
    if ref is None:
        return jsonify([])
    
    players_stats = scraper.get_mlb_individual_player(ref)
    return jsonify(players_stats)

#new functions \/
@app.route('/api/depth_chart',methods=['GET'])
def fetch_team_depth_chart():
    team_name = request.args.get('name')
    if not team_name: return

    if cache.get(f'depth-chart-{team_name}') is None:
        players = db.get_depth_chart(team_name)
        cache[f'depth-chart-{team_name}'] = players
        return jsonify(players)

    return cache[f'depth-chart-{team_name}']

@app.route('/api/player_info',methods=['GET'])
def fetch_individual_player():
    """
    Fetch a individual players information including: stats, about, and awards
    If information is not in database, fetch from the MLB Stats API, else fetch from database using player's ID
    """
    player_id = request.args.get('id')
    player_id = int(player_id)

    doc_exists = db.is_player_in_database(player_id)
    
    if not doc_exists:
        player_info = scraper.fetch_player_info(player_id)

        #update the data base
        db.update_player(player_id,player_info)

    #Pull from database
    doc = db.get_player(player_id)
    if doc and 'players' in doc:
        player_obj = doc['players'][0]
    else:
        player_obj = None

    return jsonify(player_obj)


@app.route('/api/player_names',methods=['GET'])
def fetch_all_player_names():
    pos = request.args.get('pos')

    names = db.get_player_names(pos)

    names_obj = {player['name']: player['id'] for player in names}

    return jsonify(names_obj)


@app.route('/api/team_history',methods=['GET'])
def fetch_team_history():
    team_name = request.args.get('name')

    history = parse_team_history(team_name)

    return jsonify(history)

@app.route('/api/bracket',methods=['GET'])
def fetch_bracket():
    """
    Returns a postseason bracket object with the WC, DS, CS, and WS games
    for each conference
    """
    year = request.args.get('year')

    bracket = scraper.get_postseason_bracket(year)

    return jsonify(bracket)

"""
User Authentication routes
"""

@app.route('/api/register',methods=['POST'])
def register():
    data = request.get_json()
    hashed_pw = generate_password_hash(data['password'])
    mongo.db.users.insert_one({'username':data['username'],'password':hashed_pw})

    access_token = create_access_token(identity=data['username'])
    response = jsonify({'msg': 'User registered'})
    set_access_cookies(response, access_token)
    return response, 201

@app.route('/api/login',methods=['POST'])
def login():
    data = request.get_json()
    user = mongo.db.users.find_one({'username':data['username']})
    if user and check_password_hash(user['password'],data['password']):
        response = jsonify({'msg':'Login successful'})
        access_token = create_access_token(identity=user['username'])
        set_access_cookies(response,access_token)
        return response

    return jsonify({'msg': 'Bad credentials'}),401

@app.route('/api/validate',methods=['GET'])
@jwt_required()
def validate():
    user_id = get_jwt_identity()
    return jsonify({'user_id':user_id}),200


"""
SocketIO operations for real-time communication
"""

@socketio.on('join_room')
def handle_join_room(data):
    room = data['room']
    join_room(room)

    past_messages = mongo.db.messages.find({ 'room_id': room }, {'_id': 0}).sort({ 'timestamp': -1 }).limit(50)

    emit('load_messages', list(past_messages), room=request.sid)

@socketio.on('leave_room')
def handle_leave_room(data):
    room = data['room']
    leave_room(room)

@socketio.on('send_message')
def handle_send_message(data):
    room = data['room']
    message = {'user': data['user'], 'text': data['text'], 'timestamp': data['timestamp']}

    #save the message to the database
    mongo.db.messages.insert_one({'room_id':room,'user':data['user'],'text':data['text'],'timestamp':data['timestamp']})

    emit('message',message,room=room)




if __name__ == '__main__':
    if not app.config.get('SECRET_KEY'):
        app.config['SECRET_KEY'] = os.urandom(32)

    if not app.config.get('JWT_SECRET_KEY'):
        app.config['JWT_SECRET_KEY'] = app.config['SECRET_KEY']

    db_names = db.get_db_names()

    if 'sports_website' not in db_names:
        db.preload_database()

    socketio.run(app,debug=True)
    app.run(debug=True,port=5000)

