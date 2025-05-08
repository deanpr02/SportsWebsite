import YankeesDepth from '../assets/mlb-resources/stadiums/testdepth.png'
import Yankees from '../assets/mlb-resources/stadiums/test.png'
import RedSoxDepth from '../assets/mlb-resources/stadiums/fenwaydepth.png'
import RedSox from '../assets/mlb-resources/stadiums/fenway.jpg'
import OriolesDepth from '../assets/mlb-resources/stadiums/camden_yards_depth.png' //may want to crop sky a bit
import Orioles from '../assets/mlb-resources/stadiums/camden_yards.jpg'
import BlueJaysDepth from '../assets/mlb-resources/stadiums/rogers_center_depth.png'
import BlueJays from '../assets/mlb-resources/stadiums/rogers_center.jpeg'
import RaysDepth from '../assets/mlb-resources/stadiums/tropicana_field_depth.png'
import Rays from '../assets/mlb-resources/stadiums/tropicana_field.jpg'
import DodgersDepth from '../assets/mlb-resources/stadiums/dodgerdepth.png'
import Dodgers from '../assets/mlb-resources/stadiums/dodger_stadium.jpg'
import PadresDepth from '../assets/mlb-resources/stadiums/petcodepth.png'
import Padres from '../assets/mlb-resources/stadiums/petco_park.jpg'
import GiantsDepth from '../assets/mlb-resources/stadiums/oracle_park_depth.png'
import Giants from '../assets/mlb-resources/stadiums/oracle_park.jpg'
import DbacksDepth from '../assets/mlb-resources/stadiums/chase_field_depth.png' //may change
import Dbacks from '../assets/mlb-resources/stadiums/chase_field.jpeg'
import RockiesDepth from '../assets/mlb-resources/stadiums/coors_field_depth2.png'
import Rockies from '../assets/mlb-resources/stadiums/coors_field2.jpg'
import AstrosDepth from '../assets/mlb-resources/stadiums/minute_maid_depth.png'
import Astros from '../assets/mlb-resources/stadiums/minute_maid.jpg' //looks good but try with other model
import MarinersDepth from '../assets/mlb-resources/stadiums/tmobile_park_depth.png' //may use 2 if other model is used
import Mariners from '../assets/mlb-resources/stadiums/tmobile_park.jpg'
import RangersDepth from '../assets/mlb-resources/stadiums/globe_life_depth.png'
import Rangers from '../assets/mlb-resources/stadiums/globe_life.jpg'
import AngelsDepth from '../assets/mlb-resources/stadiums/angel_stadium_depth.png'
import Angels from '../assets/mlb-resources/stadiums/angel_stadium.jpg'
import AthleticsDepth from '../assets/mlb-resources/stadiums/oakland_coliseum_depth.png'
import Athletics from '../assets/mlb-resources/stadiums/oakland-coliseum.jpg'
import GuardiansDepth from '../assets/mlb-resources/stadiums/progressive_field_depth.png'
import Guardians from '../assets/mlb-resources/stadiums/progressive_field.jpg'
import TwinsDepth from '../assets/mlb-resources/stadiums/target_field_depth.png'
import Twins from '../assets/mlb-resources/stadiums/target_field.jpg'
import TigersDepth from '../assets/mlb-resources/stadiums/comerica_park_depth.png'
import Tigers from '../assets/mlb-resources/stadiums/comerica_park.jpg' //fix this one
import RoyalsDepth from '../assets/mlb-resources/stadiums/kauffman_stadium_depth.png'
import Royals from '../assets/mlb-resources/stadiums/kauffman_stadium.jpg'
import WhiteSoxDepth from '../assets/mlb-resources/stadiums/rate_field_depth.png'
import WhiteSox from '../assets/mlb-resources/stadiums/rate_field.jpg'
import MetsDepth from '../assets/mlb-resources/stadiums/citi_field_depth.png'
import Mets from '../assets/mlb-resources/stadiums/citi_field.jpg'
import PhilliesDepth from '../assets/mlb-resources/stadiums/citizens_bank_depth.png'
import Phillies from '../assets/mlb-resources/stadiums/citizens_bank.jpg'
import BravesDepth from '../assets/mlb-resources/stadiums/truist_park_depth.png'
import Braves from '../assets/mlb-resources/stadiums/truist_park.jpg' //fix this one
import MarlinsDepth from '../assets/mlb-resources/stadiums/loan_depot_depth.png'
import Marlins from '../assets/mlb-resources/stadiums/loan_depot.jpg'
import NationalsDepth from '../assets/mlb-resources/stadiums/nationals_park_depth.png'
import Nationals from '../assets/mlb-resources/stadiums/nationals_park.jpeg' //fix also
import PiratesDepth from '../assets/mlb-resources/stadiums/pnc_park_depth.png'
import Pirates from '../assets/mlb-resources/stadiums/pnc_park.jpg'
import CubsDepth from '../assets/mlb-resources/stadiums/wrigley_field_depth.png'
import Cubs from '../assets/mlb-resources/stadiums/wrigley_field.jpg'
import CardinalsDepth from '../assets/mlb-resources/stadiums/busch_stadium_depth.png'
import Cardinals from '../assets/mlb-resources/stadiums/busch_stadium.jpg'
import BrewersDepth from '../assets/mlb-resources/stadiums/miller_park_depth.png'
import Brewers from '../assets/mlb-resources/stadiums/miller_park.jpeg'
import RedsDepth from '../assets/mlb-resources/stadiums/great_american_depth.png'
import Reds from '../assets/mlb-resources/stadiums/great_american.jpg'

export function useRetrieveStadium(teamName){
    const stadiumImages = {
        'NYY': {src: Yankees, depth: YankeesDepth},
        'BOS': {src: RedSox, depth: RedSoxDepth},
        'BAL': {src: Orioles, depth: OriolesDepth},
        'TOR': {src: BlueJays, depth: BlueJaysDepth},
        'TB': {src: Rays, depth: RaysDepth},
        'HOU': {src: Astros, depth: AstrosDepth},
        'SEA': {src: Mariners, depth: MarinersDepth},
        'OAK': {src: Athletics, depth: AthleticsDepth},
        'TEX': {src: Rangers, depth: RangersDepth},
        'LAA': {src: Angels, depth: AngelsDepth},
        'CLE': {src: Guardians, depth: GuardiansDepth},
        'MIN': {src: Twins, depth: TwinsDepth},
        'KC': {src: Royals, depth: RoyalsDepth},
        'CHW': {src: WhiteSox, depth: WhiteSoxDepth},
        'DET': {src: Tigers, depth: TigersDepth},
        'LAD': {src: Dodgers, depth: DodgersDepth},
        'ARI': {src: Dbacks, depth: DbacksDepth},
        'SF': {src: Giants, depth: GiantsDepth},
        'SD': {src: Padres, depth: PadresDepth},
        'COL': {src: Rockies, depth: RockiesDepth},
        'ATL': {src: Braves, depth: BravesDepth},
        'PHI': {src: Phillies, depth: PhilliesDepth},
        'NYM': {src: Mets, depth: MetsDepth},
        'MIA': {src: Marlins, depth: MarlinsDepth},
        'WSN': {src: Nationals, depth: NationalsDepth},
        'CHC': {src: Cubs, depth: CubsDepth},
        'MIL': {src: Brewers, depth: BrewersDepth},
        'STL': {src: Cardinals, depth: CardinalsDepth},
        'CIN': {src: Reds, depth: RedsDepth},
        'PIT': {src: Pirates, depth: PiratesDepth}
    }

    const selectedStadium = stadiumImages[teamName];
    return selectedStadium
}