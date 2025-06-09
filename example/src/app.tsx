import './wdyr'; // <--- must be first import
import React from 'react';
import {AppRegistry} from 'react-native';
//@ts-expect-error
import {name as appName} from '../app.json';
import TimelineCalendarScreen from "./screens/timelineCalendarScreen.tsx";


export default function App() {
  return <TimelineCalendarScreen />;
}
AppRegistry.registerComponent(appName, () => App);
