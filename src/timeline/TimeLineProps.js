import React, {useCallback} from 'react'
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors} from "../../utils/Colors";
import FastImage from "react-native-fast-image";
import {Avatar} from "react-native-paper";
import {PersonIcon, RecordIcon, TimeIcon} from "../../assets/Icons";
import I18n from "i18n-js";
import {Svgs} from "../../assets/vectors";
import BaseText from "./CalendarBaseText";
import RecurenceIcon from "../../assets/vectors/workout/RecurenceIcon";
import useSelectedEventStore from "../../store/ZuStand/SelectedEvent";
import useLongPressStore from "../../store/ZuStand/LongPressStore";
import {HideTabBarOnSelection} from "../../store/Actions/CalendarAction";
import Fonts from "../../utils/Fonts";

const TimeLineProps=({
                         event,
                         onPressEvent,
                         timeDuration,
                         hasOverlap,
                         theme,
                         formatTime,
                         index,
                         dispatch,
                         overlapStyles,
                     })=>{

    const {selectedEvent,setSelectedEvent} = useSelectedEventStore();
    const {isLongPress,setIsLongPress} = useLongPressStore();

    const isItemSelected = useCallback(
        event => {
            return selectedEvent?.some(
                item => item?.userEvent?.id === event?.userEvent?.id,
            );
        },
        [selectedEvent],
    );

    const handleLongPress = useCallback(
        event => {
            if (!isLongPress) {
                dispatch?.(HideTabBarOnSelection(true));
                setIsLongPress?.(true);
                setSelectedEvent?.([event]);
            }
        },
        [dispatch, isLongPress, setIsLongPress, setSelectedEvent],
    );

    const toggleSelection = useCallback(
        event => {
            if (isLongPress) {
                useSelectedEventStore.getState().setSelectedEvent((prevSelected) => {
                    const isAlreadySelected = prevSelected?.some(
                        (item) => item?.userEvent?.id === event?.userEvent?.id
                    );
                    if (isAlreadySelected) {
                        return prevSelected?.filter(
                            (item) => item?.userEvent?.id !== event?.userEvent?.id
                        );
                    } else {
                        return [...(prevSelected || []), event];
                    }
                });
            }
        },
        [isLongPress],
    );

    const initials = (event?.title || '')
        .toString()
        .split(' ')
        .map(word => word?.charAt(0)?.toUpperCase())
        .join('')
        .slice(0, 2);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            key={index}
            style={[
                styles.container,
                overlapStyles?.eventOverlap,
                {
                    overflow: 'hidden',
                    ...( !hasOverlap && { width: '100%' } ),
                    // width: hasOverlap ? '60%' : '100%',
                    backgroundColor:
                        event?.status === 'Done'
                            ? '#F1FFF5'
                            : event?.status === 'No-show'
                                ? '#fff5f5'
                                : '#FFFFFF',
                    borderLeftColor:
                        event?.status === 'Done'
                            ? '#4CAF50'
                            : event?.status === 'No-show'
                                ? '#FF4D4F'
                                : colors.calendarTextColor,
                    borderLeftWidth: 4,
                    borderRadius: 12,
                    marginBottom: hasOverlap ? 0 : 2,
                    marginRight: hasOverlap ? 2 : 0,
                    margin: hasOverlap ? 'auto' : 5,
                    position: 'absolute',
                    // height: hasOverlap ? '90%' : '100%',
                },
            ]}
            onLongPress={() => handleLongPress(event)}
            onPress={() => {
                if (isLongPress) {
                    toggleSelection(event);
                } else {
                    onPressEvent?.(event);
                }
            }}
        >
            <View
                style={[
                    styles.subContainer,
                    {
                        paddingTop: timeDuration > 29 ? 8 : 0,
                        paddingHorizontal: hasOverlap ? 6 : 10,
                    },
                ]}>
                <View style={[styles.nameContainer]}>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: event?.status === 'Scheduled' ? '60%' : '80%',
                        }}>
                        {!hasOverlap && timeDuration > 29 && (
                            <View style={{alignItems: 'flex-start'}}>
                                {event?.image ? (
                                    <FastImage
                                        source={{uri: event?.image}}
                                        style={styles.image}
                                    />
                                ) : (
                                    <Avatar.Text
                                        size={40}
                                        label={initials}
                                        color={colors.primaryColor}
                                        style={{
                                            backgroundColor: '#f0f1f3',
                                        }}
                                    />
                                )}
                            </View>
                        )}
                        <View
                            style={{
                                paddingLeft: hasOverlap || timeDuration < 30 ? 0 : '5%',
                                flex: 1,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                }}>
                                <Text
                                    style={[
                                        styles.title,
                                        {
                                            fontSize: hasOverlap || timeDuration < 20 ? 12 : 18,
                                            width: '90%',
                                        },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {event?.title}
                                </Text>
                            </View>

                            {(!hasOverlap || timeDuration > 45) && (
                                <View style={styles.descriptionContainer}>
                                    {!hasOverlap &&
                                        (event?.session_type === 'Virtual' ? (
                                            <RecordIcon
                                                width={15}
                                                height={15}
                                                color={colors.calendarTextColor}
                                            />
                                        ) : (
                                            <PersonIcon
                                                width={15}
                                                height={15}
                                                color={colors.calendarTextColor}
                                            />
                                        ))}
                                    {!hasOverlap && <Text>{'  '}</Text>}
                                    <Text
                                        style={[
                                            styles.description,
                                            {
                                                fontSize: hasOverlap ? 10 : 14,
                                                width: '80%',
                                            },
                                        ]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail">
                                        {event?.description
                                            ? event?.description
                                            : I18n.t('calendar.newSession')}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.timeIconContainer}>
                                {!hasOverlap && (
                                    <View style={styles.timeIconView}>
                                        <TimeIcon
                                            height={hasOverlap ? 20 : 28}
                                            width={hasOverlap ? 20 : 28}
                                            color={colors.calendarTextColor}
                                        />
                                    </View>
                                )}
                                <Text
                                    style={[
                                        styles.time,
                                        {fontSize: hasOverlap ? 10 : 14}
                                    ]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail">
                                    {`${formatTime?.(event?.start)} - ${formatTime?.(
                                        event?.end,
                                    )}`}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {isLongPress ? (
                        <View
                            style={{
                                height: 20,
                                width: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                                top: timeDuration < 20 ? -8 : 0,
                                paddingRight: hasOverlap ? 5 : 10,
                            }}>
                            {isItemSelected(event) ? (
                                <Svgs.CheckMarkYes />
                            ) : (
                                <Svgs.CheckMarkNoSelect />
                            )}
                        </View>
                    ) : (
                        event?.status &&
                        !hasOverlap &&
                        timeDuration > 29 && (
                            <View
                                style={[
                                    {
                                        right:10,
                                        borderRadius: 15,
                                        paddingHorizontal: 10,
                                        height: 30,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor:
                                            event?.status === 'Done'
                                                ? '#4CAF50'
                                                : event?.status === 'No-show'
                                                    ? '#FF4D4F'
                                                    : null,
                                    },
                                ]}>
                                <BaseText
                                    style={styles.statusText}
                                    translate={event?.status === 'Scheduled' ? false : true}
                                    title={
                                        event?.status === 'Done'
                                            ? 'button.done'
                                            : event?.status === 'No-show'
                                                ? 'status.noShow'
                                                : event?.status === 'Scheduled'
                                                    ? null
                                                    : null
                                    }
                                />
                            </View>
                        )
                    )}
                </View>
            </View>

            {event?.userEvent?.recurrence_rule && !hasOverlap ? (
                <View
                    style={{
                        alignSelf: 'flex-end',
                        padding: 12,
                    }}>
                    <RecurenceIcon />
                </View>
            ) : null}
        </TouchableOpacity>
    );
}

export default TimeLineProps

const styles = StyleSheet.create({
    container: {
        borderLeftWidth: 4,
        borderRadius: 12,
        justifyContent: 'center',
        flex: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        // Remove these conflicting styles:
        // height:'100%',
        // zIndex: 999,
        // position: 'absolute',
        // left: 0,
        // right: 0,
        // top: 0,
        // bottom: 0,
    },
    subContainer: {
        flex: 1,
        paddingHorizontal: 10,
        width: '100%',
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    title: {
        fontWeight: '500',
        color: '#333',
        fontFamily: Fonts.regular,
    },
    statusText: {
        color: colors.white,
        fontFamily: Fonts.regular,
        fontSize: 12,
        fontWeight: '500',
    },
    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    description: {
        color: colors.calendarTextColor,
    },
    time: {
        color: colors.calendarTextColor,
    },
    timeIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeIconView: {
        alignItems: 'center',
        flexDirection: 'row',
        right: 5,
        height: 30,
        width: 23,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        paddingHorizontal: '6%',
        alignSelf: 'center',
    },
    dateText: {
        color: colors.black,
        fontWeight: '500',
        fontSize: 22,
        fontFamily: Fonts.regular,
    },
    dayName: {
        fontFamily: Fonts.regular,
        width: 32,
        textAlign: 'center',
        color: colors.black,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    longModal:{
        height: 64,
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
        paddingHorizontal: 16,
        position: 'bottom',
        zIndex: 10,
        backgroundColor: colors.white,
        borderBottomWidth: 0.5,
        flexDirection:'row',
    },
    session:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
    },
    setStatus:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        justifyContent: 'flex-end',
    },
    selectedItemContainer: {
        height: 64,
        justifyContent: 'center',
        width: '100%',
        marginTop: '10%',
        paddingHorizontal: 16,
        position: 'absolute',
        zIndex: 10,
        backgroundColor: colors.white,
        borderBottomWidth: 0.5,
    },
    selectedItemView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectedItems:{
        flexDirection: 'row', alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
});
