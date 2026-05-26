// VARIÁVEIS
let currentInput = ""
let previousInput = ""
let operator = ""

let history = []

let shouldResetScreen = false

// DISPLAY
function updateDisplay(){

    document.getElementById("currentOperation").innerHTML =
        currentInput || "0"

    document.getElementById("previousOperation").innerHTML =
        previousInput

    if(
        !document
            .getElementById("currencyDisplay")
            .classList.contains("hidden")
    ){

        convertCurrency()
    }
}

// NÚMEROS
function appendNumber(number){

    //se acabou de calcular,
    //inicia uma nova conta automaticamente
    if(shouldResetScreen){

        currentInput = ""
        shouldResetScreen = false
    }
    
    currentInput += number

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

    if(shouldResetScreen){

        currentInput = "0"
        shouldResetScreen = false
    }
    
    if(currentInput.includes(".")){

        return
    }

    if(currentInput === ""){

        currentInput = "0"
    }

    currentInput += "."

    updateDisplay()
}

// OPERADOR
function appendOperator(selectedOperator){

    if(currentInput === ""){

        return
    }

    if(previousInput !== ""){

        calculateResult()
    }

    operator = selectedOperator

    previousInput =
        currentInput + " " + operator

    currentInput = ""

    updateDisplay()
}

// RESULTADO
function calculateResult(){

    if(previousInput === "" || currentInput === ""){

        return
    }
    
    const previous =
        Number(previousInput.replace(operator, ""))

    const current =
        Number(currentInput)

    let result = 0

    if(operator === "+"){

        result = previous + current
    }

    if(operator === "-"){

        result = previous - current
    }

    if(operator === "*"){

        result = previous * current
    }

    if(operator === "/"){

        result = previous / current
    }

    const calculation =

        previous +
        " " +
        operator +
        " " +
        current +
        " = " +
        result

    addToHistory(calculation)

    previousInput =
        previous +
        " " +
        operator +
        " " +
        current +
        " ="

    currentInput =
        result.toString()

        shouldResetScreen = true

    previousInput = ""
    operator = ""

    updateDisplay()

    if(
        !document
            .getElementById("currencyDisplay")
            .classList.contains("hidden")
    ){
        convertCurrency()
    }
}

// LIMPAR
function clearCalculator(){

    currentInput = ""
    previousInput = ""
    operator = ""

    updateDisplay()
}

// APAGAR
function deleteLast(){

    currentInput =
        currentInput.slice(0, -1)

    updateDisplay()
}

// PORCENTAGEM
function calculatePercentage(){

    currentInput =
        (Number(currentInput) / 100).toString()

    updateDisplay()
}

// POSITIVO/NEGATIVO
function toggleSign(){

    currentInput =
        (Number(currentInput) * -1).toString()

    updateDisplay()
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

    const currentOperation = document.getElementById("currentOperation")
    
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

// CONVERSÃO
function convertCurrency(){

    const amount =
        Number(currentInput) || 0

    const from =
        document.getElementById("fromCurrency").value

    const to =
        document.getElementById("toCurrency").value

    const rates = {

        BRL: 1,
        USD: 5.42,
        EUR: 6.10,
        GBP: 7.20,
        JPY: 0.038,
        AUD: 3.55,
        CAD: 3.95
    }

    const amountInBRL =
        amount * rates[from]

    const converted =
        amountInBRL / rates[to]

    document.getElementById("currencyFromValue").innerHTML =
        amount.toFixed(2)

    document.getElementById("currencyToValue").innerHTML =
        converted.toFixed(2)
}

document.addEventListener("click", function(event){
    const menu = document.getElementById("modesMenu")

    const button = document.getElementById("modesButton")

    const clickedInsideMenu = menu.contains(event.target)

    const clickedButton = button.contains(event.target)

    if(!clickedInsideMenu && !clickedButton){

        menu.classList.add("hidden")
    }
})
