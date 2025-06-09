import groupBy from 'lodash/groupBy';


import React, {useState} from 'react';

import {timelineEvents, getDate} from '../mocks/timelineEvents';
import TimelineList from "../../../src/timeline-list";
import {TimelineEventProps, TimelineProps} from "../../../src";
import {getCalendarDateString} from "../../../src/services";
import {UpdateSources} from "../../../src/expandableCalendar/commons";

const INITIAL_TIME = {hour: 9, minutes: 0};
const EVENTS: TimelineEventProps[] = timelineEvents;

const TimelineCalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState(getDate());
  const [eventsByDate, setEventsByDate] = useState(
    groupBy(EVENTS, e => getCalendarDateString(e.start)) as {
      [key: string]: TimelineEventProps[];
    }
  );

  const onDateChanged = (date: string, source: string) => {
    console.log('TimelineCalendarScreen onDateChanged: ', date, source);
    setCurrentDate(date);
  };

  const createNewEvent: TimelineProps['onBackgroundLongPress'] = (timeString, timeObject) => {

  };

  const approveNewEvent: TimelineProps['onBackgroundLongPressOut'] = (_timeString, timeObject) => {
    const date = timeObject.date;
    if (!date) return;

  };

  const timelineProps: Partial<TimelineProps> = {
    format24h: true,
    onBackgroundLongPress: createNewEvent,
    onBackgroundLongPressOut: approveNewEvent,
    unavailableHours: [{start: 0, end: 6}, {start: 22, end: 24}],
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24
  };

  return (
      <TimelineList
        events={eventsByDate}
        timelineProps={timelineProps}
        showNowIndicator
        scrollToFirst
        initialTime={INITIAL_TIME}
        numberOfDays={1}
        timelineLeftInset={72}
        date={currentDate}
        updateSource={UpdateSources.CALENDAR_INIT}
        setDate={onDateChanged}
      />
  );
};

export default TimelineCalendarScreen;
