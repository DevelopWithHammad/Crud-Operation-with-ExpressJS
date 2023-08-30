import express from "express";
import fs from 'fs';
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware

app.use(express.json());


// reading toursData file

const toursData = fs.readFileSync('./toursData.json', 'utf-8')
const parsedToursData = JSON.parse(toursData)
console.log(parsedToursData);


// get method

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: "Success",
        data: parsedToursData
    })
})



app.get('/api/v1/tours/:tourId', (req, res) => {
    console.log("tourId===>>>>>", req.params.tourId);
    console.log("typeof===>>>>>", typeof req.params.tourId);
    console.log("===>>>>>length", parsedToursData?.data.length);


    if ((req.params.tourId * 1) > parsedToursData?.data.length) {
        return res.status(404).send("Data not available")
    }



    const singleTour = parsedToursData?.data?.find(tour => tour.id == req.params.tourId)

    console.log("===>>>Single tour", singleTour);

    res.status(200).json({
        status: "Success",
        data: singleTour
    })
})



app.post("/api/v1/tours", (req, res) => {
    console.log("====>>> Available tours", parsedToursData?.data.length);

    // ||
    if (!req.body.destinationName || !req.body.country || !req.body.tourCapacity || !req.body.departure || !req.body.arrival || !req.body.price || !req.body.transport) {
        res.status(400).json({
            status: "Rejected",
            data: "Missing Fields"
        })
    }

    const dataToWriteInDB = {
        id: parsedToursData.data.length + 1,
        ...req.body
    }
    console.log(dataToWriteInDB);

    parsedToursData.data.push(dataToWriteInDB)



    fs.writeFile("./toursData.json", JSON.stringify(parsedToursData), () => {
        res.status(200).json({
            status: "Success",
            data: "Data added succcessfully!"
        })
    })
})


app.delete("/api/v1/tours/:tourId", (req, res) => {
    console.log(req.params.tourId);
    const filteredData = parsedToursData.data.filter(tour => tour.id != (req.params.tourId * 1))

    parsedToursData.data = filteredData

    fs.writeFile("./toursData.json", JSON.stringify(parsedToursData), () => {
        res.status(200).json({
            status: "Success",
            data: "succcessfully deleted!"
        })
    })
})



app.put("/api/v1/tours/:tourId", (req, res) => {

    console.log(req.params.tourId);

    let indexNumber;

    parsedToursData.data.forEach((tour, idx) => {
        if (tour.id === (req.params.tourId * 1)) {
            indexNumber = idx;
        }
    });


    parsedToursData.data.splice(indexNumber, 1, req.body)

    fs.writeFile("./toursData.json", JSON.stringify(parsedToursData), () => {
        res.status(200).json({
            status: "Success",
            data: "succcessfully updated!"
        })
    })


})







app.listen(PORT, () => {
    console.log(`I am listening to the server at port number ${PORT}`);
})