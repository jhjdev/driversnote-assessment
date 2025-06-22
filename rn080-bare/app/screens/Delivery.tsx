import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import * as yup from 'yup';
import { Formik } from 'formik';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, DeliveryAddress } from '../types/types';
import { useGetUserByIdQuery } from '../services/api/apiSlice';

interface DeliveryScreenProps {
  route: RouteProp<RootStackParamList, 'Delivery'>;
}

const Delivery: React.FC<DeliveryScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { userId, order } = route.params;
  
  // Use RTK Query hook to fetch user data
  const { 
    data: user, 
    isLoading, 
    error 
  } = useGetUserByIdQuery(Number(userId));
  
  const [postalCode, setPostalCode] = useState<string>(
    user?.postal_code?.toString() || ''
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading user details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error instanceof Error ? error.message : 'An error occurred while fetching user data'}
        </Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          containerStyle={{ marginTop: 20 }}
        />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          containerStyle={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Delivery Address</Text>
      <Formik
        initialValues={{
          name: user.full_name || '',
          address: user.address1 || '',
          address2: user.address2 || '',
          postalCode: user.postal_code?.toString() || '',
          city: user.city || '',
          country: user.country_name || '',
        }}
        onSubmit={values => {
          const deliveryAddress: DeliveryAddress = {
            ...values,
            address2: values.address2 || undefined, // Ensure address2 is string | undefined
          };
          
          // Navigate to OrderOverview with updated order information
          navigation.navigate('OrderOverview', {
            order: {
              ...order,
              deliveryAddress
            },
            userId
          });
        }}
        validationSchema={yup.object().shape({
          name: yup.string().required('Name is required'),
          address: yup.string().required('Address is required'),
          postalCode: yup.string().required('Postal code is required'),
          city: yup.string().required('City is required'),
          country: yup.string().required('Country is required'),
        })}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          isValid,
          handleSubmit,
        }) => (
          <View style={styles.formContainer}>
            <TextInput
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={() => setFieldTouched('name')}
              placeholder="Name"
              style={styles.formField}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
            
            <TextInput
              value={values.address}
              onChangeText={handleChange('address')}
              onBlur={() => setFieldTouched('address')}
              placeholder="Address"
              style={styles.formField}
            />
            {touched.address && errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
            
            <TextInput
              value={values.address2}
              onChangeText={handleChange('address2')}
              onBlur={() => setFieldTouched('address2')}
              placeholder="Address 2 (optional)"
              style={styles.formField}
            />
            
            <TextInput
              value={values.postalCode}
              onChangeText={handleChange('postalCode')}
              onBlur={() => setFieldTouched('postalCode')}
              placeholder="Postal Code"
              style={styles.formField}
              keyboardType="numeric"
            />
            {touched.postalCode && errors.postalCode && (
              <Text style={styles.errorText}>{errors.postalCode}</Text>
            )}
            
            <TextInput
              value={values.city}
              onChangeText={handleChange('city')}
              onBlur={() => setFieldTouched('city')}
              placeholder="City"
              style={styles.formField}
            />
            {touched.city && errors.city && (
              <Text style={styles.errorText}>{errors.city}</Text>
            )}
            
            <TextInput
              value={values.country}
              onChangeText={handleChange('country')}
              onBlur={() => setFieldTouched('country')}
              placeholder="Country"
              style={styles.formField}
            />
            {touched.country && errors.country && (
              <Text style={styles.errorText}>{errors.country}</Text>
            )}
            
            <Button
              title="Continue to Order Overview"
              disabled={!isValid}
              onPress={handleSubmit}
              containerStyle={styles.buttonContainer}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  formField: {
    height: 50,
    width: '100%',
    marginVertical: 8,
    paddingHorizontal: 12,
    borderColor: '#2196F3',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});

export default Delivery;