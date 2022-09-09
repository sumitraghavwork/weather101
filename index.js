// let apiKey = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6ebe3640c900b2fa97f591a6b5ec160a`
// let gmapSrc = `https://maps.google.com/maps?q=gurgaon&t=&z=13&ie=UTF8&iwloc=&output=embed`
// let url = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=6ebe3640c900b2fa97f591a6b5ec160a`
let cloudsObj = {
  30: "./src",
  50: 'https://cdn-icons.flaticon.com/png/512/1888/premium/1888282.png?token=exp=1656657704~hmac=5ec7c840e703c1aacbcca4bd4ad87b7f',
  70: 'https://cdn-icons.flaticon.com/png/512/2242/premium/2242879.png?token=exp=1656657855~hmac=2a42a1ef3968731d142dcf73c2ec2360',
  90: 'https://cdn-icons.flaticon.com/png/512/2469/premium/2469994.png?token=exp=1656657886~hmac=b6c3e71b01fc6628799e496b853cfea7',
  100: 'https://cdn-icons-png.flaticon.com/512/1146/1146858.png',
}

const weekday = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const d = new Date()
let today = d.toDateString()
console.log(today)
let num = d.getDay()

function getLocation() {
  navigator.geolocation.getCurrentPosition(success)
  function success(pos) {
    // console.log(pos)
    const crd = pos.coords
    weatherOnLocation(crd.latitude,crd.longitude)
    dailyForcast(crd.latitude,crd.longitude)
  }
}
async function weatherOnLocation(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=6ebe3640c900b2fa97f591a6b5ec160a`
  try {
    let res = await fetch(url)
    let data = await res.json()
    // console.log(data)
    document.getElementById(
      'gmap_canvas',
    ).src = `https://maps.google.com/maps?q=${data.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    appendWeather(data)
  } catch {
    console.log('Error on Location')
  }
}

async function weather() {
  let city = document.getElementById('city').value
  try {
    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=6ebe3640c900b2fa97f591a6b5ec160a`,
    )
    let data = await res.json()
    // console.log(data)
    appendWeather(data)
    document.getElementById(
      'gmap_canvas',
    ).src = `https://maps.google.com/maps?q=${city}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    dailyForcast(data.coord.lat, data.coord.lon)
  } catch {
    console.log('Error City Weather')
  }
}

async function dailyForcast(lat, lon) {
  let url1 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=ff55bac0937c4342104f9e1772bd4bfc`
  try {
    let res = await fetch(url1)
    let data = await res.json()
    // console.log(data.daily)
    num = d.getDay()
    appendForecast(data.daily)
  } catch {
    console.log('Error Daily Forcast')
  }
}
function appendWeather(obj) {
  document.getElementById('container').innerHTML = ''
  const city = document.createElement('div')
  const day = document.createElement('h3')
  day.innerText = `${today}`
  const cloudSpan = document.createElement('div');
  cloudSpan.setAttribute('class','cloudSpan')
  const cloud = document.createElement('img')
  var cld =+ obj.clouds.all
  if (cld > 90) {
    cloud.setAttribute('src','src/100.png') 
  } else if (cld > 70 && cld <= 90) {
    cloud.setAttribute('src','src/90.png')
  } else if (cld > 50 && cld <= 70) {
    cloud.setAttribute('src','src/70.png')
  } else if (cld > 30 && cld <= 50) {
    cloud.setAttribute('src','src/50.png')
  } else {
    cloud.setAttribute('src','src/30.png')
  }
   
  const name = document.createElement('h3')
  name.innerText = `${obj.name}, ${obj.sys.country}`

  const temp = document.createElement('h2')
  temp.innerText = `Temp: ${obj.main.temp} C` 

  const temp1 = document.createElement('span')
  const min_temp = document.createElement('p')
  min_temp.innerText = `Min: ${obj.main.temp_min} C`
  const max_temp = document.createElement('p')
  max_temp.innerText = `Max: ${obj.main.temp_max} C`
  temp1.append(min_temp, max_temp)

  const cloudType = document.createElement('h4')
  cloudType.innerText = `Feels Like ${obj.main.feels_like} C, ${obj.weather[0].description}`
  const des = document.createElement('div')
  const pressure = document.createElement('span')
  pressure.innerText = `Pressure: ${obj.main.pressure}Pa`
  const humid = document.createElement('span')
  humid.innerText = `Humidity: ${obj.main.humidity}%`
  const winds = document.createElement('p')
  winds.innerText = `Winds: Deg - ${obj.wind.deg}SW, Speed - ${obj.wind.speed}m/s`
  const sunrise = document.createElement('span')
  sunrise.innerText = `Sunrise: ${obj.sys.sunrise}`
  const sunset = document.createElement('span')
  sunset.innerText = `Sunset: ${obj.sys.sunset}`
  cloudSpan.append(cloud,temp,temp1)
  des.append(pressure, humid, winds, sunrise, sunset)
  city.append(day, name,cloudSpan, cloudType, des)
  document.getElementById('container').append(city)
}
function appendForecast(arr) {
  document.getElementById('forecast').innerHTML = null
  arr.forEach(function (ele,i) {
    if(i==7){
        return
    }
    const card = document.createElement('div')
    const day = document.createElement('h3')
    day.innerText = weekday[num++]
    if (num == 7) {
      num = 0
    }
    const cloud = document.createElement('img')
    var cld = +ele.clouds
    if (cld > 90) {
      cloud.setAttribute('src','src/100.png') 
    } else if (cld > 70 && cld <= 90) {
      cloud.setAttribute('src','src/90.png')
    } else if (cld > 50 && cld <= 70) {
      cloud.setAttribute('src','src/70.png')
    } else if (cld > 30 && cld <= 50) {
      cloud.setAttribute('src','src/50.png')
    } else {
      cloud.setAttribute('src','src/30.png')
    }
    const min = document.createElement('h3')
    min.innerText = `Min: ${ele.temp.min} C`
    const max = document.createElement('h3')
    max.innerText = `Max: ${ele.temp.max} C`
    card.append(day, cloud, min, max)
    document.getElementById('forecast').append(card)
  })
}
