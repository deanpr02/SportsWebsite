import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Standalone function to get team rank
async function getTeamRank(teamAbbr, stat) {
    try {
        const teamsRef = collection(db, 'mlb', 'data', 'teams');
        const q = query(teamsRef, orderBy(`averageStats.${stat}`,'desc'));
        const snapshot = await getDocs(q);

        const rankings = snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data()?.averageStats?.[stat] || null, // Get stat value
        }));

        const teamData = rankings.find((team) => team.id === teamAbbr);
        if (!teamData) {
            throw new Error(`Team ${teamAbbr} not found in rankings.`);
        }

        return {
            rank: rankings.indexOf(teamData) + 1, // Rank is 1-based
            value: teamData.value, // Stat value
        };
    } catch (error) {
        console.error('Error getting rankings:', error);
        throw error;
    }
}


export function useStatLeaders(teamName, stats) {
    const [rankings, setRankings] = useState(undefined);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const results = {};
                for (const stat of stats) {
                    const { rank, value } = await getTeamRank(teamName, stat);
                    results[stat] = { rank, value }; // Store both rank and value
                }
                setRankings(results);
            } catch (error) {
                console.error('Error fetching team stats:', error);
            }
        };

        fetchRankings();
    }, [teamName,JSON.stringify(stats)]);

    return { rankings };
}

