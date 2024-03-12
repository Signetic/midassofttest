function getClockAngle(hh_mm: string): number {
    const splitResult: string[] = hh_mm.split(":");
    let hh: number = Number(splitResult[0]);
    let mm: number = Number(splitResult[1]);
    hh = hh % 12
    const hourAngle = (360 / 12) * hh + (360 / 12 / 60) * mm;
    const minuteAngle = (360 / 60) * mm;
    const diff = Math.abs(hourAngle - minuteAngle);
    const angle = Math.min(diff, 360 - diff);
    return angle;
}
function getQuestionPart(phrases: string[]): string[] {
    let startWord = ""
    let flagStart = true
    let endWord = ""
    let flagEnd = true
    let RAT = ""
    for (let i = 2; i < phrases[0].length; i++) {
        startWord = phrases[0].substring(0, i);
        let checkStart = true
        phrases.forEach(element => {
            if (element.indexOf(startWord) == -1) {
                checkStart = false
            }
        });
        if (i == 2 && checkStart !== true) {
            flagStart = false
            break
        } else if (i > 2 && checkStart !== true) {
            flagStart = true
            RAT = phrases[0].substring(0, i - 1);
            break
        }

    }
    if (flagStart) {
        return phrases.map(str => str.replace(RAT, "").trim());
    }
    for (let i = phrases[0].length - 1; i > 0; i--) {
        endWord = phrases[0].substring(i, phrases[0].length);
        let checkEnd = true
        phrases.forEach(element => {
            if (element.indexOf(endWord) == -1) {
                checkEnd = false
            }
        });
        if (i == phrases[0].length - 1 && checkEnd !== true) {
            flagEnd = false
            break
        } else if (i < phrases[0].length - 1 && checkEnd !== true) {
            flagEnd = true
            RAT = phrases[0].substring(i + 1, phrases[0].length);
            break
        }

    }
    if (flagStart || flagEnd) {
        return phrases.map(str => str.replace(RAT, "").trim());
    }
    return []
}
interface qentry {
    square: number,
    moves: number,
    dice: number[]
};
function quickestPath(board: { ladders: [number, number][]; snakes: [number, number][]; }): number[] {
    const start = 1
    const end = 100
    const visited: Set<number> = new Set();
    const q: qentry[] = [];
    visited.add(start);
    q.push({ square: start, moves: 0, dice: [] });
    while (q.length != 0) {
        const { square, moves, dice } = q.shift()!;
        if (square === end)
            return dice;
        for (let roll = 1; roll <= 6; roll++) {
            const nextSquare = square + roll;
            if (nextSquare > end) {
                continue;
            }
            const checkLadder = board.ladders.find((item) => item[0] == nextSquare)
            const checkSnake = board.snakes.find((item) => item[0] == nextSquare)
            let destination: number = nextSquare;
            if (checkLadder) {
                destination = checkLadder[1];

            } else if (checkSnake) {
                destination = checkSnake[1];
            } else {
                destination = nextSquare
            }
            if (!visited.has(destination)) {
                q.push({ square: destination, moves: moves + 1, dice: [...dice, roll] });
                visited.add(destination);
            }
        }
    }
    return [];
}

function minEnergy(
    start: number,
    shops: number[],
    stations: number[],
    target: number,
): number {
    let minimumEnergy = Infinity;
    const numShops = shops.length;
    for (let subsetMask = 0; subsetMask < (1 << numShops); subsetMask++) {
        let energy = 0;
        let currentPosition = start;
        let countShop = 0;
        for (let shopIndex = 0; shopIndex < numShops; shopIndex++) {

            if ((subsetMask & (1 << shopIndex)) !== 0) {
                const shopPosition = shops[shopIndex];
                energy += findMinDistance(currentPosition, shopPosition, stations);
                currentPosition = shopPosition;
                countShop++;
            }
        }
        if (countShop == numShops) {
            energy += findMinDistance(currentPosition, target, stations);
            minimumEnergy = Math.min(minimumEnergy, energy);
        }
    }
    return minimumEnergy;
}

function findMinDistance(start: number, end: number, stations: number[]): number {
    let minDistance = Math.abs(end - start);
    for (const station of stations) {
        const distanceToStation = Math.abs(start - station);
        const ss = stations.filter((s) => s != station)
        for (const ss_end of ss) {
            const distanceFromStation = Math.abs(end - ss_end);
            minDistance = Math.min(minDistance, distanceToStation + distanceFromStation);
        }
    }
    return minDistance;
}
// const test11 = getClockAngle(`09:00`);
// const test12 = getClockAngle(`17:30`);
// const test21 = getQuestionPart([`BATHROOM`, `BATH SALTS`, `BLOODBATH`])
// const test22 = getQuestionPart([`BEFRIEND`, `GIRLFRIEND`, `FRIENDSHIP`])
// const test3 = quickestPath({
//     ladders: [[3, 39], [14, 35], [31, 70], [44, 65], [47, 86], [63, 83], [71, 93]],
//     snakes: [[21, 4], [30, 8], [55, 38], [79, 42], [87, 54], [91, 48], [96, 66]]
// })
// const test4 = minEnergy(0, [4, 9], [3, 6, 8], 11)
// const test4 = minEnergy(0, [7,8,16], [3, 9, 15], 17)