const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "🍒" : 2,
    "🍊" : 4,
    "🍋" : 6,
    "🍇" : 8
}

const SYMBOLS_VALUES = {
    "🍒" : 5,
    "🍊" : 4,
    "🍋" : 3,
    "🍇" : 2
}

const spin = () => {
    const sembols = [];
    for(let [sembol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0; i < count; i++){
            sembols.push(sembol);
        }
    }

    const reels = [];
    for(let i = 0; i < COLS; i++){
        reels.push([]);
        const reelSembols = [...sembols];
        for(let j = 0; j < ROWS; j++){
            let randomIndex = Math.floor(Math.random() * (reelSembols.length - 1));
            const selectedSembols = reelSembols[randomIndex];
            reels[i].push(selectedSembols);
            reelSembols.splice(randomIndex, 1);
        }
    }
    return reels;
}

const transpose = (reels) => {
    const rows = [];
    for(let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

const printRows = (rows) => {
    for(const row of rows){
        let rowString = "";
        for(const [i, sembol] of row.entries()){
            rowString += sembol;
            if(i !== row.length - 1){
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

const getWinnigs = (rows, bet, numberOfLines) => {
    let winnings = 0;

    for(let row = 0; row < numberOfLines; row++){
        const symbols = rows[row];
        let allSame = true;

        for(let symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }

    return winnings;
}

const prompt = require("prompt-sync")();

const deposit = () => {
    while(true){
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log(`Invalid input! Please enter a positive number.`);
        }
        else{
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while(true){
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3 ){
            console.log(`Invalid number of lines, try again!`);
        }
        else{
            return numberOfLines;
        }
    }
}

const getBet = (balance, number) => {
    while(true){
        const bet = prompt("Enter the bet per: ");
        const numberBet = parseFloat(bet);

        if(isNaN(numberBet) || numberBet <= 0 || numberBet > balance/number ){
            console.log(`Invalid bet, try again!`);
        }
        else{
            return numberBet;
        }
    }
}

const game = () => {
    let balance = deposit();

    while(true){
        console.log(`Your totaly balance $${balance}`);

        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance,numberOfLines);
        balance -= bet*numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnigs(rows, bet, numberOfLines);
        balance += winnings;
        console.log(`You won, $${winnings}`);

        if(balance <= 0){
            console.log("You ran out of money!")
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)? ");
        if(playAgain == "n"){
            break;
        }
    }
}

game();