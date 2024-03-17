"use strict";
function getClockAngle(hh_mm) {
    const splitResult = hh_mm.split(":");
    let hh = Number(splitResult[0]);
    let mm = Number(splitResult[1]);
    hh = hh % 12;
    const hourAngle = (360 / 12) * hh + (360 / 12 / 60) * mm;
    const minuteAngle = (360 / 60) * mm;
    const diff = Math.abs(hourAngle - minuteAngle);
    const angle = Math.min(diff, 360 - diff);
    return angle;
}
function getQuestionPart(phrases) {
    let startWord = "";
    let flagStart = true;
    let endWord = "";
    let flagEnd = true;
    let RAT = "";
    for (let i = 2; i < phrases[0].length; i++) {
        startWord = phrases[0].substring(0, i);
        let checkStart = true;
        phrases.forEach(element => {
            if (element.indexOf(startWord) == -1) {
                checkStart = false;
            }
        });
        if (i == 2 && checkStart !== true) {
            flagStart = false;
            break;
        }
        else if (i > 2 && checkStart !== true) {
            flagStart = true;
            RAT = phrases[0].substring(0, i - 1);
            break;
        }
    }
    if (flagStart) {
        return phrases.map(str => str.replace(RAT, "").trim());
    }
    for (let i = phrases[0].length - 1; i > 0; i--) {
        endWord = phrases[0].substring(i, phrases[0].length);
        let checkEnd = true;
        phrases.forEach(element => {
            if (element.indexOf(endWord) == -1) {
                checkEnd = false;
            }
        });
        if (i == phrases[0].length - 1 && checkEnd !== true) {
            flagEnd = false;
            break;
        }
        else if (i < phrases[0].length - 1 && checkEnd !== true) {
            flagEnd = true;
            RAT = phrases[0].substring(i + 1, phrases[0].length);
            break;
        }
    }
    if (flagStart || flagEnd) {
        return phrases.map(str => str.replace(RAT, "").trim());
    }
    return [];
}
;
function quickestPath(board) {
    const start = 1;
    const end = 100;
    const visited = new Set();
    const q = [];
    visited.add(start);
    q.push({ square: start, moves: 0, dice: [] });
    while (q.length != 0) {
        const { square, moves, dice } = q.shift();
        if (square === end)
            return dice;
        for (let roll = 1; roll <= 6; roll++) {
            const nextSquare = square + roll;
            if (nextSquare > end) {
                continue;
            }
            const checkLadder = board.ladders.find((item) => item[0] == nextSquare);
            const checkSnake = board.snakes.find((item) => item[0] == nextSquare);
            let destination = nextSquare;
            if (checkLadder) {
                destination = checkLadder[1];
            }
            else if (checkSnake) {
                destination = checkSnake[1];
            }
            else {
                destination = nextSquare;
            }
            if (!visited.has(destination)) {
                q.push({ square: destination, moves: moves + 1, dice: [...dice, roll] });
                visited.add(destination);
            }
        }
    }
    return [];
}
function minEnergy(start, shops, stations, target) {
    let travelLog = [];
    let minimumEnergy = Infinity;
    const numShops = shops.length;
    let pShops = generateAllPermutations(shops);
    for (let subsetMask = 0; subsetMask < pShops.length; subsetMask++) {
        travelLog = [];
        let energy = 0;
        let currentPosition = start;
        const pShopNow = pShops[subsetMask];
        travelLog.push({
            type: "start",
            position: start
        });
        for (let shopIndex = 0; shopIndex < numShops; shopIndex++) {
            const shopPosition = pShopNow[shopIndex];
            const { minDistance, route } = findMinDistance(currentPosition, shopPosition, stations);
            energy += minDistance;
            currentPosition = shopPosition;
            travelLog.push({
                type: "shop",
                position: currentPosition,
                shopIndex: shopIndex,
                route: route,
                energyUse: minDistance,
                energySum: energy
            });
        }
        const { minDistance, route } = findMinDistance(currentPosition, target, stations);
        energy += minDistance;
        minimumEnergy = Math.min(minimumEnergy, energy);
        travelLog.push({
            type: "target",
            position: target,
            energyUse: minDistance,
            route: route,
            min: minimumEnergy,
        });
    }
    return minimumEnergy;
}
function generateAllPermutations(shops) {
    const results = [];
    function permute(currentArray, remainingShops) {
        if (remainingShops.length === 0) {
            results.push(currentArray);
            return;
        }
        for (let i = 0; i < remainingShops.length; i++) {
            const newShop = remainingShops[i];
            const newRemainingShops = remainingShops.slice(0, i).concat(remainingShops.slice(i + 1));
            const newCurrentArray = currentArray.concat([newShop]);
            permute(newCurrentArray, newRemainingShops);
        }
    }
    permute([], shops);
    return results;
}
function findMinDistance(start, end, stations) {
    let minDistance = Math.abs(end - start);
    let route = [];
    let minStart = minDistance;
    let minEnd = minDistance;
    for (const station of stations) {
        const distanceToStation = Math.abs(start - station);
        if (minStart > distanceToStation) {
            minStart = Math.min(minStart, distanceToStation);
            route.push({
                start: `${start} => ${station}`
            });
        }
    }
    for (const station of stations) {
        const distanceFromStation = Math.abs(end - station);
        if (minEnd > distanceFromStation) {
            minEnd = Math.min(minEnd, distanceFromStation);
            route.push({
                end: `${station} => ${end}`
            });
        }
    }
    if (minDistance <= minStart + minEnd) {
        route = [];
    }
    else {
        minDistance = Math.min(minDistance, minStart + minEnd);
    }
    return { minDistance, route };
}
//# sourceMappingURL=index.js.map