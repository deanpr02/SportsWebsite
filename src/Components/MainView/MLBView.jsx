import { useState,useContext } from 'react'
import { useNavigate,Routes,Route } from 'react-router-dom'

import { UserContext } from './Home'

import Bracket from './Bracket'
import Navbar from './Navbar'
import Scores from '../ScoreView/Scores'
import Standings from '../StandingsView/Standings'
import Statistics from './Statistics'
import TeamPage from '../TeamView/TeamPage'
import TeamLibrary from '../TeamView/TeamLibrary'
import Clubhouse from './Clubhouse'

import MLBLogo from '../../assets/menu-resources/mlb-logo.png'

export default function MLBView(){
    const mlbTeams = [
        "New York Yankees","Boston Red Sox","Baltimore Orioles","Toronto Blue Jays","Tampa Bay Rays",
        "Cleveland Guardians","Minnesota Twins","Detroit Tigers","Chicago White Sox","Kansas City Royals",
        "Houston Astros","Oakland Athletics","Seattle Mariners","Texas Rangers","Los Angeles Angels of Anaheim",
        "Philadelphia Phillies","Atlanta Braves","Washington Nationals","Miami Marlins","New York Mets",
        "St. Louis Cardinals","Chicago Cubs","Cincinnati Reds","Pittsburgh Pirates","Milwaukee Brewers",
        "Los Angeles Dodgers","Arizona Diamondbacks","San Francisco Giants","San Diego Padres","Colorado Rockies"
    ]

    const [team,setTeam] = useState({})
    const {userID} = useContext(UserContext);
    const homePath = '/home/mlb';
    return(
        <>
        <Navbar leagueLogo={MLBLogo} homePath={homePath}/>
        <Routes>
            <Route path={"/*"} element={<Scores/>}/>
            <Route path={"/standings"} element={<Standings/>}/>
            <Route path={"/stats"} element={<Statistics/>}/>
            <Route path={"/bracket"} element={<Bracket/>}/>
            <Route path={"/teams"} element={<TeamLibrary teams={mlbTeams} setTeam={setTeam}/>}/>
            <Route path={"teams/team/*"} element={<TeamPage teamObject={team}/>}/>
            <Route path={"/clubhouse"} element={<Clubhouse/>}/>
        </Routes>
        </>
    )
}