// screens/ProfileScreen.js

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { obtenerUsuario, actualizarUsuario } from '../../services/usuarioService'; 

import PersonalInfoSection from '../../components/profileScreen/PersonalInfoSection';
import ActivityLevelSection from '../../components/profileScreen/ActivityLevelSection';
import ObjectiveSection from '../../components/profileScreen/ObjectiveSection';
import DietTypeSection from '../../components/profileScreen/DietTypeSection';
import HealthConditionsSection from '../../components/profileScreen/HealthConditionsSection';
import ThreeBodyLoader from '../../components/common/ThreeBodyLoader';

import { AuthContext } from '../../context/AuthContext';
import { styles } from '../../styles/ProfileStyles';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

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
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [optionsForField, setOptionsForField] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usuarioId = await AsyncStorage.getItem('usuarioId');
        if (usuarioId) {
          const usuarioData = await obtenerUsuario(usuarioId);
          if (usuarioData) {
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
              tipoDieta: preferencias.tipo_dieta || '',
              condicionesSalud: preferencias.condiciones_salud || [],
            });

            setOriginalUserData(usuarioData);
          }
        } else {
          console.error('No se encontró un usuarioId en AsyncStorage.');
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const onEdit = (field) => {
    // Reiniciar estado del modal
    setEditingField(null);
    setEditingValue('');
    setOptionsForField([]);

    if (field === 'fechaNacimiento') {
      setEditingField('fechaNacimiento');
      setShowDatePicker(true);
    } else if (
      ['genero', 'nivelActividad', 'objetivo', 'condicionesSalud', 'tipoDieta'].includes(field)
    ) {
      setEditingField(field);
      setEditingValue(userInfo[field]);
      setOptionsForField(getOptionsForField(field));
      setModalVisible(true);
    } else {
      // Campos de texto (nombre, correo, altura, peso)
      setEditingField(field);
      setEditingValue(userInfo[field]);
      setModalVisible(true);
    }
  };

  const saveChanges = async () => {
    try {
      setSavingChanges(true);
      const updatedInfo = {
        ...userInfo,
        [editingField]:
          editingField === 'condicionesSalud' ? editingValue : editingValue,
      };

      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (usuarioId && originalUserData) {
        const updatedData = { ...originalUserData };

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
              fecha_nacimiento: updatedInfo.fechaNacimiento
                .toISOString()
                .split('T')[0],
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

        updatedData.actualizar_plan = true;
        await actualizarUsuario(usuarioId, updatedData);
        console.log('Usuario actualizado exitosamente.');

        setUserInfo(updatedInfo);
        setOriginalUserData(updatedData);
      }

      setSavingChanges(false);
      setModalVisible(false);
      setEditingField(null);
      setEditingValue('');
      setOptionsForField([]);
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
      setSavingChanges(false);
    }
  };

  const cancelChanges = () => {
    setModalVisible(false);
    setEditingField(null);
    setEditingValue('');
    setOptionsForField([]);
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ThreeBodyLoader />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.profilePicture}>
          <Ionicons name="person" size={50} color="#FFFFFF" />
        </View>
        <Text style={styles.userName}>{userInfo.nombre}</Text>
        <Text style={styles.userEmail}>{userInfo.correo}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <PersonalInfoSection
        userInfo={userInfo}
        onEdit={onEdit}
        getLabelForValue={getLabelForValue}
        getOptionsForField={getOptionsForField}
      />
      <ActivityLevelSection
        userInfo={userInfo}
        onEdit={onEdit}
        getLabelForValue={getLabelForValue}
      />
      <ObjectiveSection
        userInfo={userInfo}
        onEdit={onEdit}
        getLabelForValue={getLabelForValue}
      />
      <DietTypeSection
        userInfo={userInfo}
        onEdit={onEdit}
        getLabelForValue={getLabelForValue}
      />
      <HealthConditionsSection
        userInfo={userInfo}
        onEdit={onEdit}
        getLabelForValue={getLabelForValue}
      />

      {showDatePicker && (
        <DateTimePicker
          value={userInfo.fechaNacimiento}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (event.type === 'set' && date) {
              // Usuario seleccionó una fecha
              setShowDatePicker(false);
              setEditingValue(date);
              // Ahora mostrar modal de confirmación con esa fecha
              setModalVisible(true);
            } else {
              // Usuario canceló
              setShowDatePicker(false);
              setEditingField(null);
              setEditingValue('');
              setOptionsForField([]);
            }
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
                          setEditingValue(editingValue.filter((val) => val !== option.value));
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
            ) : editingField === 'fechaNacimiento' ? (
              // Mostrar la fecha seleccionada
              <View style={styles.optionsContainer}>
                <Text style={styles.selectedDate}>
                  {editingValue instanceof Date
                    ? editingValue.toLocaleDateString()
                    : ''}
                </Text>
              </View>
            ) : (
              <TextInput
                style={styles.input}
                value={editingValue}
                onChangeText={setEditingValue}
                keyboardType={['altura', 'peso'].includes(editingField) ? 'numeric' : 'default'}
              />
            )}
            <View style={styles.modalButtons}>
              {savingChanges ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                <>
                  <TouchableOpacity style={styles.cancelButton} onPress={cancelChanges}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
