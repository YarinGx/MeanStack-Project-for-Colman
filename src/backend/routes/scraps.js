const express = require("express");
const Scrap = require("../models/hotels");
const {emit} = require("cluster");

getAllScraps = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const scrapQuery = Scrap.find();
  let fetchedScraps;
  if (pageSize && currentPage) {
    scrapQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  scrapQuery
    .then(documents => {
      fetchedScraps = documents;
      return Scrap.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Scraps fetched successfully!",
        scraps: fetchedScraps,
        maxScraps: count
      });
    }).catch(error => {
    res.status(500).json({
      message: "Fetching scraps failed!"
    });
  });
};

getScrapById = (req, res, next) => {
  Scrap.findById(req.params.id).then(scrap => {
    if (scrap) {
      res.status(200).json(scrap);
    } else {
      res.status(404).json({
        message: "Scrap not found!"
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching scrap failed!"
    });
  });
};


const router = express.Router();


router.get("/groupby", (req, res, next) => {
  console.log("works?");
  Scrap.aggregate([{
    "$group": {
      _id:{city: "$city"},
      // _id: "$hotelId",
      count: {
        $sum: 1
      }
    }
  }]).then(result => {
    console.log(result);
    res.status(200).json({
      message: "group successful!",
      result: result
    });
  })
})
router.get("", getAllScraps);
router.get("/:id", getScrapById);


module.exports = router;
