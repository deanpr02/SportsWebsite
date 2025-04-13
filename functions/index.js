import { onDocumentWritten } from "firebase-functions/v2/firestore";
import admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const updateTeamStats = onDocumentWritten(
    {
        document: "mlb/data/players/{playerId}", // Correct key
    },
    async (event) => {
        const afterData = event.data?.after || null; // Data after the change

        if (!afterData) {
            console.log(`Player ${event.params.playerId} was deleted.`);
            return null;
        }

        const team = afterData.team;

        try {
            // Get all players for the modified team
            const playersSnap = await db.collection("mlb/data/players")
                .where("team", "==", team)
                .get();

            const averageStats = {};
            let numBatters = 0, numPitchers = 0;

            // Aggregate stats
            playersSnap.forEach((doc) => {
                const playerData = doc.data();
                const playerPos = playerData.position || "";

                // Count batters and pitchers
                if (playerPos[playerPos.length - 1] === "P") {
                    numPitchers++;
                } else {
                    numBatters++;
                }

                // Get stats for 2025 or fallback to other stats
                const stats = playerData.stats?.["2025"] || playerData.stats || {};

                // Sum up stats
                Object.entries(stats).forEach(([statName, statNum]) => {
                    averageStats[statName] = (averageStats[statName] || 0) + statNum;
                });
            });

            // Define which stats to average (example)
            const statsToAverage = { ERA: true, BA: true }; // Add other stats as needed

            // Calculate averages
            Object.keys(averageStats).forEach((statName) => {
                if (statsToAverage[statName]) {
                    if (statName[0] === "b") { // Example: Stats starting with 'b' are for batters
                        averageStats[statName] /= numBatters || 1; // Avoid division by zero
                    } else { // Other stats are for pitchers
                        averageStats[statName] /= numPitchers || 1; // Avoid division by zero
                    }
                    averageStats[statName] = parseFloat(averageStats[statName].toFixed(2)); // Round to 2 decimals
                }
            });

            // Update team stats in Firestore
            const teamRef = db.collection("mlb/data/teams").doc(team);
            await teamRef.set(
                {
                    averageStats,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
            );

            console.log(`Updated team stats for ${team}:`, averageStats);
        } catch (error) {
            console.error(`Error updating team stats for ${team}:`, error);
        }
    }
);
