import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define User type to match the structure in the JSON file

export interface Experiment {
  experiment: string;
  variant: string;
}

export interface ExperimentData {
  experiments: Experiment[];
  user_id: string;
}

export interface BeaconPrice {
  country_id: string;
  price_control: number;
  price_variant1: number;
  price_variant2: number;
  currency: string;
  id: string;
}

export interface User {
  id: number;
  full_name: string | null;
  address1: string | null;
  address2: string | null;
  postal_code: number | string | null;
  city: string | null;
  country_name: string;
  country_id: string;
  organisation_id: number | null;
}

export interface DeliveryAddress {
  name: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
}
// Define Order type
export interface Order {
  beacons: number;
  discount: number;
  price: number;
  deliveryAddress: DeliveryAddress;
}

// Define navigation types
export type RootStackParamList = {
  Users: undefined;
  Beacons: {
    userId: string;
    getUser: () => User;
    setDeliveryAddress: (address: DeliveryAddress) => void;
  };
  Delivery: {
    order: Order;
    getUser: () => User;
    setDeliveryAddress: (address: DeliveryAddress) => void;
    getOrder?: () => Order;
    getDeliveryAddress?: () => DeliveryAddress;
  };
  OrderOverview: {
    order: Order;
    getOrder: () => Order;
    getDeliveryAddress: () => DeliveryAddress;
  };
};

export interface NavigationProps<T extends keyof RootStackParamList> {
  navigation: StackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
}

export type UsersScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Users'
>;
export type BeaconsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Beacons'
>;
export type DeliveryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Delivery'
>;
export type OrderOverviewScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OrderOverview'
>;

export type BeaconsScreenRouteProp = RouteProp<RootStackParamList, 'Beacons'>;
export type DeliveryScreenRouteProp = RouteProp<RootStackParamList, 'Delivery'>;
export type OrderOverviewScreenRouteProp = RouteProp<
  RootStackParamList,
  'OrderOverview'
>;
