import {TouchableOpacity} from 'react-native';
// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { obtenerUsuario, actualizarUsuario } from '../services/usuarioService'; // Asegúrate de tener esta función para actualizar

// Importar Componentes Separados
import PersonalInfoSection from '../components/PersonalInfoSection';
import ActivityLevelSection from '../components/ActivityLevelSection';
import ObjectiveSection from '../components/ObjectiveSection';
import DietTypeSection from '../components/DietTypeSection';
import HealthConditionsSection from '../components/HealthConditionsSection';

// Importar Estilos Compartidos
import { styles } from '../styles/ProfileStyles';

export default function ProfileScreen() {
  const [userInfo, setUserInfo] = useState({
    nombre: '',
    correo: '',
    fechaNacimiento: new Date(),
    genero: '',
    altura: '',
    peso: '',
    nivelActividad: '',
    objetivo: '',
    tipoDieta: '',
    condicionesSalud: [],
  });

  const [originalUserData, setOriginalUserData] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [optionsForField, setOptionsForField] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usuarioId = await AsyncStorage.getItem('usuarioId');
        if (usuarioId) {
          const usuarioData = await obtenerUsuario(usuarioId);
          if (usuarioData) {
            console.log('Datos del usuario:', JSON.stringify(usuarioData, null, 2));

            // Mapea los datos anidados a userInfo
            const informacionPersonal = usuarioData.informacion_personal || {};
            const medidasFisicas = usuarioData.medidas_fisicas || {};
            const objetivoPeso = usuarioData.objetivo_peso || {};
            const preferencias = usuarioData.preferencias || {};

            setUserInfo({
              nombre: informacionPersonal.nombre || '',
              correo: informacionPersonal.correo || '',
              fechaNacimiento: informacionPersonal.fecha_nacimiento
                ? new Date(informacionPersonal.fecha_nacimiento)
                : new Date(),
              genero: informacionPersonal.genero || '',
              altura: medidasFisicas.altura_cm
                ? medidasFisicas.altura_cm.toString()
                : '',
              peso: medidasFisicas.peso_kg
                ? medidasFisicas.peso_kg.toString()
                : '',
              nivelActividad: medidasFisicas.nivel_actividad || '',
              objetivo: objetivoPeso.tipo_objetivo || '',
              tipoDieta: preferencias.tipo_dieta || '', // Ajusta según tu estructura de datos
              condicionesSalud: preferencias.condiciones_salud || [],
            });

            setOriginalUserData(usuarioData);
          }
        } else {
          console.error('No se encontró un usuarioId en AsyncStorage.');
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = (field) => {
    if (field === 'fechaNacimiento') {
      setShowDatePicker(true);
    } else if (
      ['genero', 'nivelActividad', 'objetivo', 'condicionesSalud', 'tipoDieta'].includes(
        field
      )
    ) {
      setEditingField(field);
      if (field === 'condicionesSalud') {
        // Para condicionesSalud, maneja múltiples selecciones
        setEditingValue(userInfo[field] || []);
      } else {
        setEditingValue(userInfo[field]);
      }
      setOptionsForField(getOptionsForField(field));
      setModalVisible(true);
    } else {
      setEditingField(field);
      setEditingValue(userInfo[field]);
      setModalVisible(true);
    }
  };

  const saveChanges = async () => {
    try {
      // Actualiza el estado local inmediatamente
      const updatedInfo = {
        ...userInfo,
        [editingField]:
          editingField === 'condicionesSalud' ? editingValue : editingValue,
      };
      setUserInfo(updatedInfo); // Esto asegura que el estado local también esté actualizado
  
      // Actualiza en el backend
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (usuarioId && originalUserData) {
        const updatedData = { ...originalUserData };
  
        // Actualiza los campos específicos según el `editingField`
        switch (editingField) {
          case 'nombre':
          case 'correo':
          case 'genero':
          case 'fechaNacimiento':
            updatedData.informacion_personal = {
              ...updatedData.informacion_personal,
              nombre: updatedInfo.nombre,
              correo: updatedInfo.correo,
              genero: updatedInfo.genero,
              fecha_nacimiento: updatedInfo.fechaNacimiento.toISOString().split('T')[0],
            };
            break;
          case 'altura':
          case 'peso':
          case 'nivelActividad':
            updatedData.medidas_fisicas = {
              ...updatedData.medidas_fisicas,
              altura_cm: parseFloat(updatedInfo.altura),
              peso_kg: parseFloat(updatedInfo.peso),
              nivel_actividad: updatedInfo.nivelActividad,
            };
            break;
          case 'objetivo':
            updatedData.objetivo_peso = {
              ...updatedData.objetivo_peso,
              tipo_objetivo: updatedInfo.objetivo,
            };
            break;
          case 'tipoDieta':
            updatedData.preferencias = {
              ...updatedData.preferencias,
              tipo_dieta: updatedInfo.tipoDieta,
            };
            break;
          case 'condicionesSalud':
            updatedData.preferencias = {
              ...updatedData.preferencias,
              condiciones_salud: updatedInfo.condicionesSalud,
            };
            break;
          default:
            break;
        }
  
        await actualizarUsuario(usuarioId, updatedData);
        console.log('Usuario actualizado exitosamente.');
  
        // Actualiza los datos originales para reflejar los cambios
        setOriginalUserData(updatedData);
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
    }
  };
  

  const cancelChanges = () => {
    setEditingField(null);
    setEditingValue('');
    setModalVisible(false);
  };

  const getOptionsForField = (field) => {
    const options = {
      genero: [
        { label: 'Masculino', value: 'masculino' },
        { label: 'Femenino', value: 'femenino' },
        { label: 'Otro', value: 'otro' },
      ],
      nivelActividad: [
        { label: 'Sedentario', value: 'sedentario' },
        { label: 'Ligeramente Activo', value: 'ligeramente_activo' },
        { label: 'Moderadamente Activo', value: 'moderadamente_activo' },
        { label: 'Activo', value: 'activo' },
        { label: 'Muy Activo', value: 'muy_activo' },
      ],
      objetivo: [
        { label: 'Perder Peso', value: 'perder_peso' },
        { label: 'Mantener Peso', value: 'mantener_peso' },
        { label: 'Ganar Peso', value: 'ganar_peso' },
      ],
      condicionesSalud: [
        { label: 'Diabetes tipo 1', value: 'diabetes_tipo_1' },
        { label: 'Diabetes tipo 2', value: 'diabetes_tipo_2' },
        { label: 'Resistencia a la insulina', value: 'resistencia_insulina' },
        { label: 'Celiaco', value: 'celiaco' },
        { label: 'Sobrepeso', value: 'sobrepeso' },
        { label: 'Presión alta', value: 'presion_alta' },
        { label: 'Insuficiencia cardiaca', value: 'insuficiencia_cardiaca' },
        { label: 'Problemas renales', value: 'problemas_renales' },
      ],
      tipoDieta: [
        { label: 'No restrictiva', value: 'no_restrictiva' },
        { label: 'Vegana', value: 'vegana' },
        { label: 'Vegetariana', value: 'vegetariana' },
      ],
    };
    return options[field] || [];
  };

  const getLabelForValue = (field, value) => {
    const options = getOptionsForField(field);
    if (field === 'condicionesSalud') {
      if (!value || value.length === 0) return 'Ninguna';
      return value
        .map((val) => {
          const option = options.find((option) => option.value === val);
          return option ? option.label : val;
        })
        .join(', ');
    }
    const option = options.find((option) => option.value === value);
    return option ? option.label : value;
  };

  // Helper function to get display name
  const getFieldDisplayName = (field) => {
    const fieldNames = {
      nombre: 'Nombre',
      correo: 'Correo',
      fechaNacimiento: 'Fecha de Nacimiento',
      genero: 'Género',
      altura: 'Altura',
      peso: 'Peso',
      nivelActividad: 'Nivel de Actividad',
      objetivo: 'Objetivo',
      tipoDieta: 'Tipo de Dieta',
      condicionesSalud: 'Condiciones de Salud',
    };
    return fieldNames[field] || '';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Foto de Perfil y Encabezado */}
      <View style={styles.header}>
        <View style={styles.profilePicture}>
          <Ionicons name="person" size={50} color="#FFFFFF" />
        </View>
        <Text style={styles.userName}>{userInfo.nombre}</Text>
        <Text style={styles.userEmail}>{userInfo.correo}</Text>
      </View>

      {/* Secciones Separadas */}
      <PersonalInfoSection
        userInfo={userInfo}
        onEdit={handleEdit}
        getLabelForValue={getLabelForValue}
        getOptionsForField={getOptionsForField}
      />
      <ActivityLevelSection
        userInfo={userInfo}
        onEdit={handleEdit}
        getLabelForValue={getLabelForValue}
      />
      <ObjectiveSection
        userInfo={userInfo}
        onEdit={handleEdit}
        getLabelForValue={getLabelForValue}
      />
      <DietTypeSection
        userInfo={userInfo}
        onEdit={handleEdit}
        getLabelForValue={getLabelForValue}
      />
      <HealthConditionsSection
        userInfo={userInfo}
        onEdit={handleEdit}
        getLabelForValue={getLabelForValue}
      />

      {/* DateTimePicker for Fecha de Nacimiento */}
      {showDatePicker && (
        <DateTimePicker
          value={userInfo.fechaNacimiento}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (date) {
              setUserInfo((prev) => ({ ...prev, fechaNacimiento: date }));
            }
            setShowDatePicker(false);
          }}
        />
      )}

      {/* Modal para Campos Editables */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Editar {getFieldDisplayName(editingField)}
            </Text>
            {optionsForField.length > 0 ? (
              editingField === 'condicionesSalud' ? (
                <View style={styles.optionsContainer}>
                  {optionsForField.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        editingValue.includes(option.value) && styles.selectedOption,
                      ]}
                      onPress={() => {
                        if (editingValue.includes(option.value)) {
                          setEditingValue(editingValue.filter(val => val !== option.value));
                        } else {
                          setEditingValue([...editingValue, option.value]);
                        }
                      }}
                    >
                      <Text style={styles.optionButtonText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.optionsContainer}>
                  {optionsForField.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        editingValue === option.value && styles.selectedOption,
                      ]}
                      onPress={() => setEditingValue(option.value)}
                    >
                      <Text style={styles.optionButtonText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )
            ) : (
              <TextInput
                style={styles.input}
                value={editingValue}
                onChangeText={setEditingValue}
                keyboardType={['altura', 'peso'].includes(editingField) ? 'numeric' : 'default'}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelChanges}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
