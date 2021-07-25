process.setMaxListeners(0);
const Hotel = require("../models/hotels");
const puppeteer = require('puppeteer');
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'locationiq',
  // Optional depending on the providers
  apiKey: 'pk.253f93411cc41cf3950098985b76df50', // for Mapquest, OpenCage, Google Premier
};
const geocoder = NodeGeocoder(options);

// const ids = ["0","1","2","3","4","5","9","13","14","15","16","17","18"]
const ids = [{id: "0", city: "גליל והגולן"},{id: "9", city: "תל אביב"}]
function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}
run = (id) => {
  return new Promise(async (resolve, reject) => {
    try {

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      console.log(`going to: https://www.hotels.co.il/hotels/index.cfm?locationid=${id.id}`)
      await page.goto(`https://www.hotels.co.il/hotels/index.cfm?locationid=${id.id}`);
      let results = [];
      let urls = await page.evaluate(() => {

        let resultsa = [];
        const rows = document.querySelectorAll('div.by_all_hotels_in_area > table > tbody tr');
        Array.from(rows, row => {
          let test = row.querySelector('a');
          // results.push(test?.innerText);
          resultsa.push(test?.href);
        });
        return resultsa;
      })
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        if(url != null){
          console.log("navigate to:"+url);

          await page.goto(`${url}`);
          // await page.waitForNavigation({ waitUntil: 'networkidle2' });
          let res = await page.evaluate(() => {
            let img = document.querySelector('div.gallery img')?.src
            if(img == null){
              img = document.querySelector('div.demo-gallery img')?.src
            }
            let address = document.querySelector('div.address')?.innerText.replace('כתובת: ','')
            if(address != null && (address.match(/, תל אביב/g) || []).length === 1){
              address = address.replace(', תל אביב', '')
            }
            return {
              description: document.querySelector('div.more_description p')?.innerText,
              name: document.querySelector('h1.summary')?.innerText,
              address: address,
              img: img,
            }
          })
          await geocoder.geocode(res.address).then((loc)=>{
            res.latitude = loc[0]?.latitude;
            res.longitude = loc[0]?.longitude
          })
          res.city = id.city;
          await sleep(700)

          results.push(res);
        }
      }
      browser.close();
      return resolve(results);
    } catch (e) {
      return reject(e);
    }
  })
}
var hotels_arr_promises = () => { ids.map(async (id) => {
  console.log("id is: "+id.id)
  await run(id).then((hotels_arr) => {
    hotels_arr.forEach((hotel) => {
      hotel_model = new Hotel({
        name: hotel.name,
        description: hotel.description,
        address: hotel.address,
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        img : hotel.img,
        city : hotel.city
      })
      hotel_model.save().then(result => {})
        .catch(err => {console.log(err)});
    })

  }).catch(console.error);
})};
exports.hotels_arr_promises = hotels_arr_promises;
