import React, {useCallback} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import I18n from "i18n-js";
import {Svgs} from "../../assets/vectors";
import {TimeIcon} from "../../assets/Icons";
import {colors} from "../../utils/Colors";
import useSelectedEventStore from "../../store/ZuStand/SelectedEvent";
import useLongPressStore from "../../store/ZuStand/LongPressStore";
import {HideTabBarOnSelection} from "../../store/Actions/CalendarAction";

const BlockEvent=({
                      styles,
                      event,
                      onPressEvent,
                      timeDuration,
                      formatTime,
                      dispatch,
                      hasOverlap, // New prop for overlap detection
                      theme,
                      index,
                  })=>{

    const {selectedEvent,setSelectedEvent} = useSelectedEventStore();
    const {isLongPress,setIsLongPress} = useLongPressStore();

    const isItemSelected = useCallback(
        event => {
            return selectedEvent.some(
                item => item?.userEvent?.id === event?.userEvent?.id,
            );
        },
        [selectedEvent],
    );

    const handleLongPress = useCallback(
        event => {
            if (!isLongPress) {
                dispatch(HideTabBarOnSelection(true));
                setIsLongPress(true);
                setSelectedEvent([event]);
            }
        },
        [],
    );

    const toggleSelection = useCallback(
        event => {
            if (isLongPress) {
                useSelectedEventStore.getState().setSelectedEvent((prevSelected) => {
                    const isAlreadySelected = prevSelected?.some(
                        (item) => item?.userEvent?.id === event?.userEvent?.id
                    );
                    if (isAlreadySelected) {
                        return prevSelected.filter(
                            (item) => item?.userEvent?.id !== event?.userEvent?.id
                        );
                    } else {
                        return [...prevSelected, event];
                    }
                });
            }
        },
        [isLongPress],
    );

    return(
        <TouchableOpacity
            key={index}
            style={[
                styles.blockerContainer,
                styles?.eventOverlap, // Apply overlap positioning styles
                {
                    // Add border for overlapping events
                    borderWidth: hasOverlap ? 1 : 0,
                    borderColor: hasOverlap ? 'rgba(0,0,0,0.15)' : 'transparent',
                    // Adjust margins for overlapping events
                    marginBottom: hasOverlap ? 0 : 2,
                    marginRight: hasOverlap ? 2 : 0,
                    position: 'absolute',
                    margin: hasOverlap ? 'auto' : 5,
                    // Ensure proper width handling
                    // width: hasOverlap ? undefined : '100%',
                    // Reduce height for overlapping events
                    // height: hasOverlap ? '90%' : '100%',
                }
            ]}
            activeOpacity={0.8}
            onLongPress={() => handleLongPress(event)}
            onPress={() => {
                if (isLongPress) {
                    toggleSelection(event);
                } else {
                    onPressEvent(event);
                }
            }}>
            <View
                style={[
                    blockerStyles.container,
                    {
                        top: timeDuration < 20 ? 0 : timeDuration > 15 && timeDuration < 30 ? 4 : 10,
                        // Reduce padding for overlapping events
                        paddingHorizontal: hasOverlap ? 6 : 4,
                    }
                ]}>
                <Text
                    numberOfLines={hasOverlap ? 1 : 2} // Limit lines for overlap
                    style={[
                        styles.blockerDescription,
                        blockerStyles.blockerDescription,
                        {
                            fontSize: hasOverlap ?
                                (timeDuration < 30 ? 10 : 12) : // Smaller font for overlap
                                (timeDuration < 30 ? 12 : 16),
                            width: hasOverlap ? '80%' : '70%', // Adjust width for overlap
                        },
                    ]}
                    ellipsizeMode="tail">
                    {event?.description
                    ? event?.description
                    : I18n.t('calendar.newBlocker')}
                </Text>

                {isLongPress && (
                    <View
                        style={[
                            blockerStyles.longPressView,
                            {
                                top: timeDuration < 30 ? 0 : 0,
                                marginRight: hasOverlap ? 2 : 4, // Reduce margin for overlap
                            }
                        ]}>
                        {isItemSelected(event) ? (
                            <Svgs.CheckMarkYes />
                        ) : (
                            <Svgs.CheckMarkNoSelect />
                        )}
                    </View>
                )}
            </View>

            {/* Only show time if duration is long enough or not overlapping */}
            {(timeDuration > 30 && !hasOverlap) || (timeDuration > 45 && hasOverlap) ? (
                <View style={styles.timeIconContainer}>
                    <View style={blockerStyles.timeDurationContainer}>
                        <View style={[styles.timeIconView]}>
                            <TimeIcon
                                height={hasOverlap ? 20 : 28} // Smaller icon for overlap
                                width={hasOverlap ? 20 : 28}
                                color={colors.calendarTextColor}
                            />
                        </View>
                        <Text
                            style={[
                                blockerStyles.event,
                                {
                                    fontSize: hasOverlap ? 10 : 14, // Smaller text for overlap
                                }
                            ]}
                            numberOfLines={1}>
                            {`${formatTime(event?.start)} - ${formatTime(event?.end)}`}
                        </Text>
                    </View>
                </View>
            ) : hasOverlap && (
                // Show minimal time info for overlapping short events
                <View style={[blockerStyles.minimalTimeContainer]}>
                    <Text
                        style={blockerStyles.minimalTimeText}
                        numberOfLines={1}>
                        {`${formatTime(event?.start)}`}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    )
}

const blockerStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    blockerDescription:{
        fontWeight: '500',
        color: '#333',
        left: 10,
    },
    longPressView:{
        height: 20,
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4,
    },
    timeDurationContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        top: 10,
        left: 10,
    },
    event:{
        color: colors.calendarTextColor,
        width: '70%',
    },
    // New styles for overlapping events
    minimalTimeContainer: {
        position: 'absolute',
        bottom: 4,
        right: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    minimalTimeText: {
        fontSize: 9,
        color: colors.calendarTextColor,
        fontWeight: '500',
    },
})

export default BlockEvent;
