// VARIÁVEIS

let expression = ""
let resultDisplayed = false

let history = []

let exchangeRates = {}


// DISPLAY

function updateDisplay(){

    document.getElementById("currentOperation").innerHTML =
        expression || "0"

}


// NÚMEROS

function appendNumber(number){

    if(resultDisplayed){

        expression = ""
        resultDisplayed = false

        document.getElementById("previousOperation").innerHTML = ""
    }

    expression += number

    updateDisplay()

    if(
        !document
            .getElementById("currencyDisplay")
            .classList.contains("hidden")
    ){

        convertCurrency()
    }
}


// DECIMAL

function appendDecimal(){

    const parts =
        expression.split(/[\+\-\*\/]/)

    const lastPart =
        parts[parts.length - 1]

    if(lastPart.includes(".")){

        return
    }

    if(expression === ""){

        expression = "0"
    }

    expression += "."

    updateDisplay()
}


// OPERADORES

function appendOperator(selectedOperator){

    if(expression === ""){

        return
    }

    const lastChar =
        expression.trim().slice(-1)

    if(["+", "-", "*", "/"].includes(lastChar)){

        expression =
            expression.trim().slice(0, -1)
    }

    expression += ` ${selectedOperator} `

    resultDisplayed = false

    updateDisplay()
}


// RESULTADO

function calculateResult(){

    if(expression === ""){

        return
    }

    try{

        const formattedExpression =

            expression
                .replace(/×/g, "*")
                .replace(/÷/g, "/")

        const result =
            eval(formattedExpression)

        const calculation =
            `${expression} = ${result}`

        addToHistory(calculation)

        document
            .getElementById("previousOperation")
            .innerHTML =
            `${expression} =`

        expression =
            result.toString()

        resultDisplayed = true

        updateDisplay()

    }

    catch{

        expression = "Erro"

        updateDisplay()
    }
}


// LIMPAR

function clearCalculator(){

    expression = ""
    resultDisplayed = false

    document
        .getElementById("previousOperation")
        .innerHTML = ""

    updateDisplay()
    convertCurrency()
}


// APAGAR

function deleteLast(){

    expression =
        expression.slice(0, -1)

    updateDisplay()
    convertCurrency()
}


// PORCENTAGEM

function calculatePercentage(){

    try{

        expression =
            (eval(expression) / 100).toString()

        updateDisplay()
    }

    catch{

        expression = "Erro"

        updateDisplay()
    }
}


// POSITIVO / NEGATIVO

function toggleSign(){

    try{

        expression =
            (eval(expression) * -1).toString()

        updateDisplay()
    }

    catch{

        expression = "Erro"

        updateDisplay()
    }
}


// HISTÓRICO

function addToHistory(calculation){

    history.unshift(calculation)

    renderHistory()
}

function renderHistory(){

    document.getElementById("historyList").innerHTML = ""

    for(let i = 0; i < history.length; i++){

        document.getElementById("historyList").innerHTML +=

            "<div class='history-item'>" +
            history[i] +
            "</div>"
    }
}

function clearHistory(){

    history = []

    renderHistory()
}

function toggleHistory(){

    document
        .getElementById("historyPanel")
        .classList.toggle("hidden")
}


// MODOS

function toggleModes(){

    document
        .getElementById("modesMenu")
        .classList.toggle("hidden")
}

function setMode(mode){

    const currentOperation =
        document.getElementById("currentOperation")

    if(mode === "currency"){

        currentOperation.classList.add("hidden")

        document
            .getElementById("currencyDisplay")
            .classList.remove("hidden")

        convertCurrency()
    }

    else{

        currentOperation.classList.remove("hidden")

        document
            .getElementById("currencyDisplay")
            .classList.add("hidden")
    }

    document
        .getElementById("modesMenu")
        .classList.add("hidden")
}


// TEMA

function toggleTheme(){

    document.body.classList.toggle("light-mode")

    const themeIcon =
        document.querySelector("#themeToggle i")

    if(document.body.classList.contains("light-mode")){

        themeIcon.classList.remove("fa-moon")
        themeIcon.classList.add("fa-sun")
    }

    else{

        themeIcon.classList.remove("fa-sun")
        themeIcon.classList.add("fa-moon")
    }
}


// API DE MOEDAS

async function fetchExchangeRates(){

    try{

        const response = await fetch(
            "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,JPY-BRL,AUD-BRL,CAD-BRL"
        )

        const data = await response.json()

        exchangeRates = {

            BRL: 1,

            USD: Number(data.USDBRL.bid),

            EUR: Number(data.EURBRL.bid),

            GBP: Number(data.GBPBRL.bid),

            JPY: Number(data.JPYBRL.bid),

            AUD: Number(data.AUDBRL.bid),

            CAD: Number(data.CADBRL.bid)
        }

        convertCurrency()

    }

    catch(error){

        console.log("Erro ao buscar moedas:", error)
    }
}


// CONVERSÃO

function convertCurrency(){

    const amount =
        Number(eval(expression || 0)) || 0

    const from =
        document.getElementById("fromCurrency").value

    const to =
        document.getElementById("toCurrency").value

    if(!exchangeRates[from] || !exchangeRates[to]){

        return
    }

    const amountInBRL =
        amount * exchangeRates[from]

    const converted =
        amountInBRL / exchangeRates[to]

    document.getElementById("currencyFromValue").innerHTML =
        amount.toFixed(2)

    document.getElementById("currencyToValue").innerHTML =
        converted.toFixed(2)
}


// TROCAR MOEDAS

function swapCurrencies(){

    const fromSelect =
        document.getElementById("fromCurrency")

    const toSelect =
        document.getElementById("toCurrency")

    const switchIcon =
        document.querySelector(".currency-switch i")

    if(!fromSelect || !toSelect){

        return
    }

    switchIcon.style.transform =
        "rotate(180deg)"

    const currentFrom =
        fromSelect.value

    fromSelect.value =
        toSelect.value

    toSelect.value =
        currentFrom

    convertCurrency()

    setTimeout(() => {

        switchIcon.style.transform =
            "rotate(0deg)"

    }, 400)
}


// FECHAR MENU AO CLICAR FORA

document.addEventListener("click", function(event){

    const menu =
        document.getElementById("modesMenu")

    const button =
        document.getElementById("modesButton")

    const clickedInsideMenu =
        menu.contains(event.target)

    const clickedButton =
        button.contains(event.target)

    if(!clickedInsideMenu && !clickedButton){

        menu.classList.add("hidden")
    }
})


// INICIALIZAÇÃO

fetchExchangeRates()

updateDisplay()