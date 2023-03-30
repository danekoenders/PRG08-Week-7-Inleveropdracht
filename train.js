import { createChart, updateChart } from "./scatterplot.js"

//
// demo data
//
// const data = [
//         { horsepower: 130, mpg: 18 },
//         { horsepower: 165, mpg: 15 },
//         { horsepower: 225, mpg: 14 },
//         { horsepower: 97, mpg: 18 },
//         { horsepower: 88, mpg: 27 },
//         { horsepower: 193, mpg: 9 },
//         { horsepower: 80, mpg: 25 },
// ]

//
// csv data
//
function loadData(){
    Papa.parse("./data/utrecht-houseprices.csv", {
        download:true,
        header:true, 
        dynamicTyping:true,
        complete: results => checkData(results.data)
    })
}

function checkData(data) {
    // shuffle
    data.sort(() => (Math.random() - 0.5))

    const chartdata = data.map(house => ({
        x: house.gardensize,
        y: house.retailvalue,
    }))

    // kijk hoe de data eruit ziet
    console.log(chartdata)

    // chartjs aanmaken
    createChart(chartdata, "gardensize", "retailvalue")

    neuralNetwork(data);
}

function neuralNetwork(data) {
    //
    // Neural Network
    //
    const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
    
    // een voor een de data toevoegen aan het neural network
    for (let house of data) {
        nn.addData({ gardensize: house.gardensize }, { retailvalue: house.retailvalue })
    }

    // normalize
    nn.normalizeData()
    
    nn.train({ epochs: 10 }, () => finishedTraining(nn)) 
}

async function finishedTraining(nn){
    console.log("Finished training!")

    makePrediction(nn);
}

async function makePrediction(nn) {
    const results = await nn.predict({ gardensize: 600 })
    console.log(`Geschatte Verkoop Prijs: ${results[0].retailvalue}`)

    let predictions = []
    for (let gardensize = 0; gardensize <= 1200; gardensize += 10) {
        const pred = await nn.predict({gardensize: gardensize})
        predictions.push({x: gardensize, y: pred[0].retailvalue})
    }
    updateChart("Predictions", predictions)
}

// load data
loadData();