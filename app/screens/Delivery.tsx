import React, { useEffect, useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import * as yup from 'yup';
import { Formik } from 'formik';
import { NavigationProps, User, DeliveryAddress } from '../types/types';
import { useUserContext } from '../contexts/UserContext';

const Delivery = (props: NavigationProps<'Delivery'>) => {
  const { getUser, setDeliveryAddress } = useUserContext();
  const user = getUser(props.route.params.userId);
  const [postalCode, setPostalCode] = useState<string | number>(
    user?.postal_code || '',
  );

  useEffect(() => {
    // Effect initialization
  }, [props]);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <View
        style={{
          height: '50%',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Text
          style={{
            paddingVertical: 10,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#27AAE1',
          }}>
          Delivery Address
        </Text>
        <Formik
          initialValues={{
            name: user.full_name || '',
            address: user.address1 || '',
            address2: user.address2 || '',
            postalCode: postalCode.toString(),
            city: user.city || '',
            country: user.country_name || '',
          }}
          onSubmit={values => {
            const deliveryAddress: DeliveryAddress = {
              ...values,
              address2: values.address2 || undefined, // Ensure address2 is string | undefined
            };
            setDeliveryAddress(deliveryAddress);
            props.navigation.navigate('OrderOverview', {
              order: props.route.params.order,
              deliveryAddress
            });
          }}
          validationSchema={yup.object().shape({
            name: yup.string().required(),
            address: yup.string().required(),
            postalCode: yup.string().required(), // Ensure postalCode is of type string
            city: yup.string().required(),
            country: yup.string().required(),
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
            <View style={{ width: '80%' }}>
              <TextInput
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={() => setFieldTouched('name')}
                placeholder="Name"
                style={styles.formField}
              />
              {touched.name && errors.name && (
                <Text style={styles.textBase}>{errors.name}</Text>
              )}
              <TextInput
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={() => setFieldTouched('address')}
                placeholder="Address"
                style={styles.formField}
              />
              {touched.address && errors.address && (
                <Text style={styles.textBase}>{errors.address}</Text>
              )}
              <TextInput
                value={values.address2 || ''}
                onChangeText={handleChange('address2')}
                onBlur={() => setFieldTouched('address2')}
                placeholder="Address 2"
                style={styles.formField}
              />
              <TextInput
                value={values.postalCode}
                onChangeText={handleChange('postalCode')}
                onBlur={() => setFieldTouched('postalCode')}
                placeholder="Postal Code"
                style={styles.formField}
              />
              {touched.postalCode && errors.postalCode && (
                <Text style={styles.textBase}>{errors.postalCode}</Text>
              )}
              <TextInput
                value={values.city || ''}
                onChangeText={handleChange('city')}
                onBlur={() => setFieldTouched('city')}
                placeholder="City"
                style={styles.formField}
              />
              {touched.city && errors.city && (
                <Text style={styles.textBase}>{errors.city}</Text>
              )}
              <TextInput
                value={values.country || ''}
                onChangeText={handleChange('country')}
                onBlur={() => setFieldTouched('country')}
                placeholder="Country"
                style={styles.formField}
              />
              {touched.country && errors.country && (
                <Text style={styles.textBase}>{errors.country}</Text>
              )}
              <Button
                title="Buy"
                disabled={!isValid}
                onPress={handleSubmit as (e: any) => void}
              />
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formField: {
    height: 40,
    width: '80%',
    padding: 5,
    borderColor: '#27AAE1',
    borderWidth: 1,
  },
  textBase: {
    fontSize: 10,
    color: 'red',
  },
});

export default Delivery;
