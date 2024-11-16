import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarProgress = () => {
    const [markedDates, setMarkedDates] = useState({});
    const marcarDia = () => {
        const today = new Date().toISOString().split('T')[0];
        setMarkedDates((prev) => ({
            ...prev,
            [today]: { marked: true, dotColor: 'green', selected: true, selestedColor: '#00adf5'},

        }));
    };
    return (
        <View style= {style.container}>
            <Calendar 
                markedDates= {markedDates}
                theme={{
                    selectedDayBackgroundColor: '#00adf5',
                    todayTextColor: '#00adf5',
                    arrowColor: '#00adf5',
                }}>
            </Calendar>
            <Button title="Marcar con realizado" onPress={marcarDia}></Button>    
        </View>
    )
};

const style = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f2f2f2',
    },
});

export default CalendarProgress;



