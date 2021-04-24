import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import API_KEY from './keys' 

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Box,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardActions,
  CardContent,
}from '@material-ui/core'

//animated tab menu code source: https://material-ui.com/components/tabs/
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  paper:{
    width:"80vh",
    height:"70vh",
    margin:"auto",
    marginTop:25
  },
  title:{
    marginTop:25,
    fontSize:50,
    fontWeight:"bold",
  },
  weatherButton:{
    margin:"auto",
    height:"100%",
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  cardTitle: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  weatherCard:{
    margin:"auto",
  },
  paperLabel:{
    margin:20,
    padding: 10,
    // backgroundColor:"linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)"
  }
}));

const currentExclude = ["minutely","hourly","daily","alerts"]
const dailyExclude = ["current","minutely","hourly","alerts"]

function WeatherCard({imgURL, weather}){
  const classes = useStyles()
  return(
    <div>
      <Card>
        <CardContent>
          <img id="wicon" src={imgURL} alt="Weather icon"></img>
          <Typography variant="h5" component="h2">
            {weather.weather[0].description.toUpperCase()}
          </Typography>
          <Box display="flex" justifyContent="center" m={1} p={1}>
            <Paper className={classes.paperLabel}>
              <Typography variant="h6" component="h2">
                High: {weather.main.temp_max}°F
              </Typography>
            </Paper>
            <Paper className={classes.paperLabel}>
              <Typography variant="h6" component="h2">
                Current: {weather.main.temp}°F
              </Typography>
            </Paper>
            <Paper className={classes.paperLabel}>
              <Typography variant="h6" component="h2">
                Low: {weather.main.temp_min}°F
              </Typography>
            </Paper>
          </Box>
          <Box display="flex" justifyContent="center" m={1} p={1}>
            <Paper className={classes.paperLabel}>
              <Typography variant="h6" component="h2">
                Humidity: {weather.main.humidity}%
              </Typography>
            </Paper>
            <Paper className={classes.paperLabel}>
              <Typography variant="h6" component="h2">
                Wind Speed: {weather.wind.speed} MPH
              </Typography>
            </Paper>
          </Box>
        </CardContent>
        {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
      </Card>
    </div>
  )
}

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const [weather, setWeather] = useState(null);
  const [currentZip, setZip] = useState(22093)
  const [excluded, setExcluded] = useState()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const fetchWeather = () =>{
    const url = new URL("https://api.openweathermap.org/data/2.5/weather");
    url.searchParams.append("appid", API_KEY);
    url.searchParams.append("zip", currentZip);
    url.searchParams.append("units", "imperial");
    url.searchParams.append("exclude", currentExclude.toString())
    fetch(url)
      .then((resp) => {
        return resp.json();
      })
      .then((obj) => {
        // also important to check html error codes
        // 200 means no errors
        if (obj.cod === 200) {
          setWeather(obj);
          console.log(obj)
          console.log(url)
        } else {
          setWeather(false);
        }
      });
  }

  useEffect(() => {
    fetchWeather()
  }, []);

  const handleZipCodeSubmit = () =>{
    console.log(currentZip)
  }
  const handleZipChange = (e) =>{
    setZip(e.target.value)
  }
  //layout: Tabs for each view: Today's hour, Next two days, and Week-long forecat
  return (
    <div style={{ textAlign: "center" }}>
      <Typography className={classes.title}>
        Weatherlify
      </Typography>
      <form>
        <TextField 
          id="standard-search" 
          label="Zip Code" 
          value={currentZip}
          onChange={handleZipChange}
        />
        <Button onClick={handleZipCodeSubmit} className={classes.weatherButton} variant="contained" color="primary">
          Apply Zip
        </Button>
      </form>
      <Paper className={classes.paper}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Current Weather" {...a11yProps(0)} />
            <Tab label="Next Two Days" {...a11yProps(1)} />
            <Tab label="Week-long Forecast" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
              <WeatherCard className={classes.weatherCard} weather={weather} imgURL={"http://openweathermap.org/img/wn/"+String(weather.weather[0].icon)+"@2x.png"}/>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>

          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            Item Three
          </TabPanel>
        </SwipeableViews>
      </Paper>
      <pre>{JSON.stringify(weather, undefined, 4)}</pre>
    </div>
  );
}
export default App;