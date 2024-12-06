import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { obtenerUsuario, actualizarUsuario } from '../services/usuarioService'; // Asegúrate de tener esta función para actualizar

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
    // Actualiza el estado local
    setUserInfo((prev) => ({
      ...prev,
      [editingField]:
        editingField === 'condicionesSalud'
          ? editingValue
          : editingValue,
    }));
    setModalVisible(false);

    // Actualiza en el backend o en AsyncStorage según corresponda
    try {
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (usuarioId && originalUserData) {
        // Prepara los datos para actualizar
        const updatedData = { ...originalUserData };

        // Actualiza los campos modificados
        switch (editingField) {
          case 'nombre':
          case 'correo':
          case 'genero':
          case 'fechaNacimiento':
            updatedData.informacion_personal = {
              ...updatedData.informacion_personal,
              nombre: userInfo.nombre,
              correo: userInfo.correo,
              genero: userInfo.genero,
              fecha_nacimiento: userInfo.fechaNacimiento.toISOString().split('T')[0],
            };
            break;
          case 'altura':
          case 'peso':
          case 'nivelActividad':
            updatedData.medidas_fisicas = {
              ...updatedData.medidas_fisicas,
              altura_cm: parseFloat(userInfo.altura),
              peso_kg: parseFloat(userInfo.peso),
              nivel_actividad: userInfo.nivelActividad,
            };
            break;
          case 'objetivo':
            updatedData.objetivo_peso = {
              ...updatedData.objetivo_peso,
              tipo_objetivo: userInfo.objetivo,
            };
            break;
          case 'tipoDieta':
            updatedData.preferencias = {
              ...updatedData.preferencias,
              tipo_dieta: userInfo.tipoDieta,
            };
            break;
          case 'condicionesSalud':
            updatedData.preferencias = {
              ...updatedData.preferencias,
              condiciones_salud: userInfo.condicionesSalud,
            };
            break;
          default:
            break;
        }

        await actualizarUsuario(usuarioId, updatedData);
        console.log('Usuario actualizado exitosamente.');

        // Opcional: Actualiza originalUserData con los nuevos datos
        setOriginalUserData(updatedData);
      }
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

      {/* Información Personal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        {['nombre', 'correo', 'fechaNacimiento', 'genero', 'altura', 'peso'].map(
          (field) => (
            <TouchableOpacity
              key={field}
              style={styles.option}
              onPress={() => handleEdit(field)}
            >
              <View style={styles.optionContent}>
                <Ionicons
                  name={
                    field === 'fechaNacimiento'
                      ? 'calendar-outline'
                      : 'person-outline'
                  }
                  size={24}
                  color="#000"
                />
                <Text style={styles.optionText}>
                  {field === 'fechaNacimiento'
                    ? 'Fecha de Nacimiento'
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </Text>
              </View>
              <Text style={styles.optionValue}>
                {field === 'fechaNacimiento'
                  ? userInfo.fechaNacimiento.toLocaleDateString()
                  : field === 'altura'
                  ? `${userInfo.altura} cm`
                  : field === 'peso'
                  ? `${userInfo.peso} kg`
                  : ['genero'].includes(field)
                  ? getLabelForValue(field, userInfo[field])
                  : userInfo[field]}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Nivel de Actividad */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nivel de Actividad</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleEdit('nivelActividad')}
        >
          <View style={styles.optionContent}>
            <Ionicons name="walk-outline" size={24} color="#000" />
            <Text style={styles.optionText}>Nivel de Actividad</Text>
          </View>
          <Text style={styles.optionValue}>
            {getLabelForValue('nivelActividad', userInfo.nivelActividad)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tipo de Objetivo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Objetivo</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleEdit('objetivo')}
        >
          <View style={styles.optionContent}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#000" />
            <Text style={styles.optionText}>Objetivo</Text>
          </View>
          <Text style={styles.optionValue}>
            {getLabelForValue('objetivo', userInfo.objetivo)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tipo de Dieta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Dieta</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleEdit('tipoDieta')}
        >
          <View style={styles.optionContent}>
            <Ionicons name="nutrition-outline" size={24} color="#000" />
            <Text style={styles.optionText}>Tipo de Dieta</Text>
          </View>
          <Text style={styles.optionValue}>
            {getLabelForValue('tipoDieta', userInfo.tipoDieta)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Condiciones de Salud */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Condiciones de Salud</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleEdit('condicionesSalud')}
        >
          <View style={styles.optionContent}>
            <Ionicons name="medkit-outline" size={24} color="#000" />
            <Text style={styles.optionText}>Condiciones</Text>
          </View>
          <Text style={styles.optionValue}>
            {getLabelForValue('condicionesSalud', userInfo.condicionesSalud)}
          </Text>
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
  // Contenedor general
  container: {
    backgroundColor: '#F5F5F5',
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C7C6C6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  userEmail: {
    fontSize: 14,
    color: '#929292',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  optionValue: {
    fontSize: 16,
    color: '#929292',
    maxWidth: '50%',
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Reduced opacity
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    elevation: 5,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    maxHeight: 300,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  optionButtonText: {
    fontSize: 16,
    color: '#000',
  },
  selectedOption: {
    backgroundColor: '#EDEDED',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#C7C6C6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#929292',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
