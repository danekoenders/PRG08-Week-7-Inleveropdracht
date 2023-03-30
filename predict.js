
const predictBtn = document.getElementById('predictBtn').addEventListener("click", function() {makePrediction()});
const inputGardensize = document.getElementById('gardensize');
const inputLotLen = document.getElementById('LotLen');
const inputLotWidth = document.getElementById('LotWidth');
const resultField =document.getElementById('result');

const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
nn.load('./model/model.json', modelLoaded)

function modelLoaded() {
    console.log("Model loaded!")
}

async function makePrediction() {
    const predictionValues = {
        gardensize: parseInt(inputGardensize.value, 10),
        LotLen: parseInt(inputLotLen.value, 10),
        LotWidth: parseInt(inputLotWidth.value, 10)
    }
    const results = await nn.predict(predictionValues);
    console.log(`Geschatte Verkoop Prijs: ${results[0].retailvalue}`)

    currencyTransformer(results[0].retailvalue);
}

function currencyTransformer(result) {
    const fmt = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
    resultField.innerHTML = "Geschatte Verkoop Prijs: " + fmt.format(result);
}