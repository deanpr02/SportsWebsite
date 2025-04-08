from flask import Flask,jsonify,request
from flask_cors import CORS
import spider as scraper

app = Flask(__name__)
CORS(app)
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


if __name__ == '__main__':
    app.run(debug=True,port=5000)

