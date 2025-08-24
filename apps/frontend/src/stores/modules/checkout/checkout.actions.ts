import { ICheckout } from '.';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Country, State, City } from 'country-state-city';
import { CheckoutApis } from '../../apis/checkout.api';

export async function initializeStripe(): Promise<Stripe> {
  try {
    const stripePromise = loadStripe(
      import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY
    );
    const stripeInstance = await stripePromise;

    if (!stripeInstance) {
      throw new Error('Stripe failed to load');
    }

    return stripeInstance;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to initialize Stripe';
    throw new Error(errorMessage);
  }
}

export function initializeCountryData(): any[] {
  try {
    return Country.getAllCountries();
  } catch (err) {
    // Failed to load countries
    return [];
  }
}

export function loadStates(countryCode: string): any[] {
  try {
    return State.getStatesOfCountry(countryCode);
  } catch (err) {
    // Failed to load states
    return [];
  }
}

export function loadCities(countryCode: string, stateCode: string): any[] {
  try {
    return City.getCitiesOfState(countryCode, stateCode);
  } catch (err) {
    // Failed to load cities
    return [];
  }
}

export async function createPaymentIntent(
  orderData: ICheckout.CreateOrderRequest
): Promise<ICheckout.PaymentIntentResponse> {
  try {
    return await CheckoutApis.createPaymentIntent(orderData);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'An error occurred';
    throw new Error(errorMessage);
  }
}

export async function confirmOrderAfterPayment(
  confirmData: ICheckout.ConfirmOrderRequest
): Promise<any> {
  try {
    return await CheckoutApis.confirmOrderAfterPayment(confirmData);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'An error occurred';
    throw new Error(errorMessage);
  }
}

export async function getOrderById(orderId: string): Promise<any> {
  try {
    return await CheckoutApis.getOrderById(orderId);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'An error occurred';
    throw new Error(errorMessage);
  }
}

export async function getUserOrders(): Promise<any[]> {
  try {
    return await CheckoutApis.getUserOrders();
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'An error occurred';
    throw new Error(errorMessage);
  }
}
