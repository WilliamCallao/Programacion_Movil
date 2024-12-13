import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarProgress = () => {
    const [markedDates, setMarkedDates] = useState({});
    
    const marcarDia = () => {
        const today = new Date().toISOString().split('T')[0];
        setMarkedDates((prev) => ({
            ...prev,
            [today]: { marked: true, dotColor: 'green', selected: true, selectedColor: '#00adf5' },
        }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Calendario de días saludables</Text>
            <View style={styles.calendarWrapper}>
                <Calendar
                    markedDates={markedDates}
                    theme={{
                        selectedDayBackgroundColor: '#00adf5',
                        todayTextColor: '#00adf5',
                        arrowColor: '#00adf5',
                    }}
                />
            </View>
            <Button title="Marcar como realizado" onPress={marcarDia} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    calendarWrapper: {
        width: '90%', // Ajusta el ancho al 90% del contenedor
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3, // Sombra para que coincida con otras tarjetas
        overflow: 'hidden',
        marginBottom: 20,
    },
});

export default CalendarProgress;
