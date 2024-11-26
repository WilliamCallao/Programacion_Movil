import React, {useState} from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View, Alert, Modal } from 'react-native';
import PesoInput from './PesoInput';


const ButtonWeight = () => {

    const [modalVisible, setModalVisible] = useState(false);

    const handlePesoSubmit = (peso) => {
        console.log(`Peso registrado: ${peso} kg`);
    };

    return (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
            <Image
              source={require('./registraPesoIcon.png')}
              style={styles.image}
            />
            <Text style={styles.buttonText}>Nuevo registro de peso</Text>
          </TouchableOpacity>
    
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <PesoInput
                onSubmit={handlePesoSubmit}
                onClose={() => setModalVisible(false)} // Pasar función de cierre
              />
            </View>
          </Modal>
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItem: 'center',
        backgorundColor: '#f5f5f5',
    },
    button: {
        flexDirection: 'row',
        alignItem: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#ddd',
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    buttonText:{
        fontSize: 16,
        color: '#333',
    }
});
export default ButtonWeight;