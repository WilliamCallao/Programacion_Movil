import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [optionsForField, setOptionsForField] = useState([]);

  const [userInfo, setUserInfo] = useState({
    nombre: 'Juan Pérez',
    correo: 'juan.perez@ejemplo.com',
    fechaNacimiento: new Date('1990-01-01'),
    genero: 'masculino',
    altura: '170',
    peso: '70',
    nivelActividad: 'moderadamente_activo',
    objetivo: 'perder_peso',
    tipoDieta: '',
    condicionesSalud: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleEdit = (field) => {
    if (field === 'fechaNacimiento') {
      setShowDatePicker(true);
    } else if (
      ['genero', 'nivelActividad', 'objetivo', 'condicionesSalud', 'tipoDieta'].includes(
        field
      )
    ) {
      setEditingField(field);
      setEditingValue(userInfo[field]);
      setOptionsForField(getOptionsForField(field));
      setModalVisible(true);
    } else {
      setEditingField(field);
      setEditingValue(userInfo[field]);
      setModalVisible(true);
    }
  };

  const saveChanges = () => {
    setUserInfo((prev) => ({ ...prev, [editingField]: editingValue }));
    setModalVisible(false);
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
        { label: 'Selecciona tu nivel de actividad', value: '' },
        { label: 'Sedentario', value: 'sedentario' },
        { label: 'Ligeramente Activo', value: 'ligeramente_activo' },
        { label: 'Moderadamente Activo', value: 'moderadamente_activo' },
        { label: 'Activo', value: 'activo' },
        { label: 'Muy Activo', value: 'muy_activo' },
      ],
      objetivo: [
        { label: 'Selecciona tu objetivo', value: '' },
        { label: 'Perder Peso', value: 'perder_peso' },
        { label: 'Mantener Peso', value: 'mantener_peso' },
        { label: 'Ganar Peso', value: 'ganar_peso' },
      ],
      condicionesSalud: [
        { label: 'Selecciona tu condición de salud', value: '' },
        { label: 'Diabetes tipo 1', value: 'lower carb' },
        { label: 'Diabetes tipo 2', value: 'lower carb' },
        { label: 'Resistencia a la insulina', value: 'lower carb' },
        { label: 'Celiaco', value: 'gluten-free' },
        { label: 'Sobrepeso', value: 'high in fiber' },
        { label: 'Presión alta', value: 'low sodium' },
        { label: 'Insuficiencia cardiaca', value: 'low sodium' },
        { label: 'Problemas renales', value: 'low sodium' },
      ],
      tipoDieta: [
        { label: 'Selecciona tu tipo de dieta', value: '' },
        { label: 'No restrictiva', value: '' },
        { label: 'Vegana', value: 'vegana' },
        { label: 'Vegetariana', value: 'vegetariana' },
      ],
    };
    return options[field] || [];
  };

  const getLabelForValue = (field, value) => {
    const options = getOptionsForField(field);
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

      {/* Modal for Editable Fields */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Editar {getFieldDisplayName(editingField)}
            </Text>
            {optionsForField.length > 0 ? (
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
