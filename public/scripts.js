let coinName = document.querySelector("#coinName")
let timeSelect = document.querySelector('#timeSelect')
let bullorbearr = document.querySelector('#bullorbear')
let fibGuesss = document.querySelector('#fibGuess')
let signal = document.querySelector('.signal')
let pivot = document.querySelector('.pivot')
let pivotShow = document.querySelector('.pivotShow')
let cuName = document.querySelector('#cuName')


function validateForm() {

    if (coinName.value.length > 5) {
        alert('Coin Not Found')
    }


    if (!coinName.value) {
        alert('Please Enter Coin name')
        window.location.reload()
    }
}




if (bullorbearr.innerText == "Price is below 200 EMA") {
    bullorbearr.style.color = "red"
} else {
    bullorbearr.style.color = "green"
}



if (fibGuesss.innerText == "Price is above 0.618") {
    fibGuesss.style.color = "green"
} else {
    fibGuesss.style.color = "red"
}



if (signal.innerText == "long") {
    signal.style.backgroundColor = "green"
} else {
    signal.style.backgroundColor = "red"
}

pivot.addEventListener('click', function () {

    var ourRequest = new XMLHttpRequest();
    ourRequest.open("GET", `/api/pivots/${cuName.innerText}`);
    ourRequest.onload = function () {
        let ourData = JSON.parse(ourRequest.responseText);
        renderHTML(ourData)
    };
    ourRequest.send();
})



function renderHTML(data) {

    pivotShow.insertAdjacentHTML('beforeend', `
    <li>Resistance 4 :<span style = "margin-left:10px"> ${data.resistance4.toFixed(3)}</span></li>
    <li>Resistance 3 :<span style = "margin-left:10px"> ${data.resistance3.toFixed(3)}</span></li>
    <li>Resistance 2 :<span style = "margin-left:10px"> ${data.resistance2.toFixed(3)}</span></li>
    <li>Resistance 1 :<span style = "margin-left:10px"> ${data.resistnce1.toFixed(3)}</span></li>
    <li><b>Pivot Point :<span style = "margin-left:10px"> ${data.pivot.toFixed(3)}</b></span></li>
    <li>Support 1 :<span style = "margin-left:10px"> ${data.support1.toFixed(3)}</span></li>
    <li>Support 2 :<span style = "margin-left:10px"> ${data.support2.toFixed(3)}</span></li>
    <li>Support 3 :<span style = "margin-left:10px"> ${data.support3.toFixed(3)}</spa></li>
    <li>Support 4 :<span style = "margin-left:10px"> ${data.support4.toFixed(3)}</span></li>
    `)

    pivotShow.insertAdjacentHTML('afterend', `
    <p><b>${data.bowblow}</b></p>
    `)

}