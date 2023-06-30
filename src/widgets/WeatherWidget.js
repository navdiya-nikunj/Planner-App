import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot,faTemperatureThreeQuarters,faSun,faWind } from '@fortawesome/free-solid-svg-icons'
// import dotenv from 'dotenv';


export default function WeatherWidget(){
    const [city , setCity] = useState("");
    const [temp,setTemp] = useState("");
    const [sunrise,setSunrise] = useState("");
    const [sunset, setSunset] = useState("");
    const [wind,setWind] = useState("");
    const [latitude,setLatitude] = useState(null);
    const [longitude,setLongitude] = useState(null);
    const [icon, setIcon] = useState("-");
    const [weather,setWeather] = useState("-");

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        }, () => {
            alert('Unable to retrieve your location');
        })
        console.log(latitude);
        console.log(longitude);
        // dotenv.config();
        const apiKey = process.env.REACT_APP_API_KEY;  
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then((response)=>{
    let sunr = new Date(response.data.sys.sunrise * 1000);
    let suns = new Date(response.data.sys.sunset * 1000);
      setSunrise(sunr.toLocaleTimeString());
      setSunset(suns.toLocaleTimeString());
      setCity(response.data.name);
      setWind(response.data.wind.speed);
      setTemp(response.data.main.temp);
      setIcon(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
      setWeather(response.data.weather[0].description[0].toUpperCase()+response.data.weather[0].description.substring(1));
    }).catch((response)=>{
        if(response.response.code === 404 )
            alert("Allow location");
    })

    })

    return(
        <div style={{minWidth:"400px"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
                <div>
                <img src={icon} />
                </div>
                <div style={{textAlign:"right",justifyContent:"center"}}>
                <p style={{fontSize:"larger",fontWeight:"bolder",padding:"5px"}}><FontAwesomeIcon icon={faTemperatureThreeQuarters} style={{color: "#FFF"}} /> {temp} °C</p>
                <p style={{fontSize:"large",fontWeight:"bolder",padding:"5px"}}><FontAwesomeIcon icon={faLocationDot} flip /> {city}</p>
                <p style={{fontSize:"larger",fontWeight:"bolder",padding:"5px"}}>{weather}</p>
                </div>
            </div>
            <hr/>
            <div style={{display:"flex", justifyContent:"space-between",marginTop:"10px"}}>
            <div><div style={{fontSize:'x-large',marginBottom:"5px"}}><FontAwesomeIcon icon={faSun} beatFade /></div> <span style={{fontWeight:"bold"}}>  Sunrise </span><p>{sunrise}</p></div>
            <div><div style={{fontSize:'x-large',marginBottom:"5px"}}><FontAwesomeIcon icon={faSun} fade />  </div><span  style={{fontWeight:"bold"}}>  Sunset </span><p>{sunset}</p></div>
            <div><div style={{fontSize:'x-large',marginBottom:"5px"}}><FontAwesomeIcon icon={faWind}  /> </div>  <span  style={{fontWeight:"bold"}}> Windspeed</span><p> {wind} meter/sec</p></div>
            </div>
        </div>
    )
}