import XDate from 'xdate';
import React, {useCallback, useMemo} from 'react';
import {View, Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';

export interface Event {
  id?: string;
  start: string;
  end: string;
  title: string;
  summary?: string;
  color?: string;
}

export interface PackedEvent extends Event {
  index: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface EventBlockProps {
  index: number;
  event: PackedEvent;
  onPress: (eventIndex: number) => void;
  renderEvent?: (event: PackedEvent) => JSX.Element;
  format24h?: boolean;
  styles: {[key: string]: ViewStyle | TextStyle};
  testID?: string;
}

const TEXT_LINE_HEIGHT = 17;
const EVENT_DEFAULT_COLOR = '#add8e6';

const EventBlock = (props: EventBlockProps) => {
  const {index, event, renderEvent, onPress, format24h, styles} = props;

  const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
  const formatTime = format24h ? 'HH:mm' : 'hh:mm A';
  const eventStyle = useMemo(() => {
    return {
      left: event.left,
      height: event.height,
      width: event.width,
      top: event.top,
      backgroundColor: event.color ? event.color : EVENT_DEFAULT_COLOR
    };
  }, [event]);

  const _onPress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);

  console.log('eventevent',event?.event_type)


  return (
    <TouchableOpacity testID={props.testID} activeOpacity={0.9} onPress={_onPress} style={[styles.event, eventStyle,{backgroundColor:'#fff'}]}>
        <View>
          <Text numberOfLines={1} style={styles.eventTitle}>
            {event.title || 'Event'}
          </Text>
          {numberOfLines > 1 ? (
            <Text numberOfLines={numberOfLines - 1} style={[styles.eventSummary]}>
              {event.summary || ' '}
            </Text>
          ) : null}
          {numberOfLines > 2 ? (
            <Text style={styles.eventTimes} numberOfLines={1}>
              {new XDate(event.start).toString(formatTime)} - {new XDate(event.end).toString(formatTime)}
            </Text>
          ) : null}
        </View>
    </TouchableOpacity>
  );
};

export default EventBlock;
