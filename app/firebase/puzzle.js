import { db } from "./firebaseConfig";
import { doc, getDoc, collection, getDocs, getFirestore } from "firebase/firestore";

// Function to fetch all puzzles
export const fetchPuzzles = async () => {
    try {
        const puzzlesCollection = collection(db, "puzzles");
        const puzzleDocs = await getDocs(puzzlesCollection);
        let puzzles = [];

        // Loop through each puzzle document
        for (const docSnapshot of puzzleDocs.docs) {
            let puzzle = { id: docSnapshot.id, ...docSnapshot.data() };

            // Fetch stages for each puzzle
            const stagesCollection = collection(docSnapshot.ref, "stages");
            const stagesDocs = await getDocs(stagesCollection);
            let stages = {};

            // Loop through stages and fetch data for each stage
            for (const stageDoc of stagesDocs.docs) {
                stages[stageDoc.id] = { ...stageDoc.data() };

                // Fetch hints for each stage (if any)
                const hintsCollection = collection(stageDoc.ref, "hints");
                const hintsDocs = await getDocs(hintsCollection);
                let hints = {};

                hintsDocs.forEach(hintDoc => {
                    hints[hintDoc.id] = hintDoc.data();
                });

                // Add hints to the stage
                stages[stageDoc.id].hints = hints;
            }

            // Add stages data to the puzzle
            puzzle.stages = stages;

            // Add the puzzle to the list of puzzles
            puzzles.push(puzzle);
        }

        console.log(puzzles);  // For debugging
        return puzzles;
    } catch (error) {
        console.error("Error fetching puzzles:", error);
    }
};
// Function to fetch a single puzzle by ID
export const fetchPuzzleById = async (puzzleId) => {
    try {
        const puzzleRef = doc(db, "puzzles", puzzleId);
        const puzzleDoc = await getDoc(puzzleRef);

        if (puzzleDoc.exists()) {
            let puzzle = puzzleDoc.data();

            // Fetch stages for the specific puzzle
            const stagesCollection = collection(puzzleRef, "stages");
            const stagesDocs = await getDocs(stagesCollection);
            let stages = {};

            // Loop through stages and fetch data for each stage
            for (const stageDoc of stagesDocs.docs) {
                stages[stageDoc.id] = { ...stageDoc.data() };

                // Fetch hints for each stage (if any)
                const hintsCollection = collection(stageDoc.ref, "hints");
                const hintsDocs = await getDocs(hintsCollection);
                let hints = {};

                hintsDocs.forEach(hintDoc => {
                    hints[hintDoc.id] = hintDoc.data();
                });

                // Add hints to the stage
                stages[stageDoc.id].hints = hints;
            }

            // Add stages data to the puzzle
            puzzle.stages = stages;

            console.log(puzzle); // For debugging
            return puzzle;
        } else {
            console.log("No such puzzle found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching puzzle:", error);
    }
};