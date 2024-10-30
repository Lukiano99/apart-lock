"use client";
import { RESERVATION_CHECKOUT_STEPS } from "@/_mock/_reservation";
import { CustomerReservationSchemaType } from "@/schemas/reservation";
import React, { useCallback, useMemo, useState, createContext } from "react";
import { useLocalStorage } from "src/hooks/use-local-storage"; // Ovo je hook za lokalno čuvanje stanja

import { z } from "zod";

// Tip konteksta za rezervacije
type ReservationContextType = {
  activeStep: number;
  totalNights: number;
  totalPrice: number;

  reservation: CustomerReservationSchemaType;

  onResetReservation: () => void;
  initialStep: () => void;
  onNextStep: () => void;
  onBackStep: () => void;

  setRoomPrice: (price: number) => void;

  setCheckIn: (date: Date) => void;
  setCheckOut: (date: Date) => void;

  onAddReservation: (newReservation: CustomerReservationSchemaType) => void;
};

// Kreiranje konteksta za rezervacije
export const ReservationContext = createContext<
  ReservationContextType | undefined
>(undefined);

// Ključ za lokalno čuvanje rezervacija
const STORAGE_KEY = "app-reservation";

const initialState: CustomerReservationSchemaType = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  roomId: "",
  paymentMethod: undefined,
  check_in: new Date(),
  check_out: new Date(),
  guests: { adults: 1, children: 0 },
};

// Provider komponenta za kontekst
export function ReservationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, setState, setField, resetState } =
    useLocalStorage<CustomerReservationSchemaType>(STORAGE_KEY, initialState);

  const [activeStep, setActiveStep] = useState(0);
  const [roomPrice, setRoomPrice] = useState(0);

  const completed = activeStep === RESERVATION_CHECKOUT_STEPS.length;

  // Funkcija za inicijalni korak
  const initialStep = useCallback(() => {
    setActiveStep(0);
  }, []);

  // Funkcija za sledeći korak
  const onNextStep = useCallback(() => {
    setActiveStep((prev) =>
      Math.min(prev + 1, RESERVATION_CHECKOUT_STEPS.length - 1)
    );
  }, []);

  // Funkcija za prethodni korak
  const onBackStep = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // Pomoćna funkcija za izračunavanje broja noćenja
  const calculateNights = useCallback(() => {
    const { check_in, check_out } = state;
    const nights = Math.ceil((+check_out - +check_in) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  }, [state.check_in, state.check_out]);

  // Ukupan broj noćenja
  const totalNights = calculateNights();

  // Ukupna cena na osnovu broja noćenja i cene sobe
  const totalPrice = useMemo(() => {
    const roomPrice = 50; // Pretpostavljena cena po noći; možeš je prilagoditi po potrebi
    return totalNights * roomPrice;
  }, [totalNights]);

  // Metoda za postavljanje check_in datuma
  const setCheckIn = useCallback(
    (date: Date) => {
      setField("check_in", date);
    },
    [setField]
  );

  // Metoda za postavljanje check_out datuma
  const setCheckOut = useCallback(
    (date: Date) => {
      setField("check_out", date);
    },
    [setField]
  );

  const setRoomId = useCallback(
    (id: string) => {
      setField("roomId", id);
    },
    [setField]
  );

  const setGuests = useCallback(
    (adults: number, children: number) => {
      setField("guests", { adults, children });
    },
    [setField]
  );

  // Dodavanje nove rezervacije
  const onAddReservation = useCallback(
    (newReservation: CustomerReservationSchemaType) => {
      setState(newReservation);
    },
    [setState]
  );

  // Resetovanje rezervacije
  const onResetReservation = useCallback(() => {
    resetState();
  }, [resetState]);

  // Memorisan objekat konteksta
  const memoizedValue = useMemo(
    () => ({
      reservation: state,
      setCheckIn,
      setCheckOut,
      setRoomPrice,
      totalNights,
      totalPrice,
      onAddReservation,
      onResetReservation,
      activeStep,
      initialStep,
      onNextStep,
      onBackStep,
      completed,
    }),
    [
      state,
      setCheckIn,
      setCheckOut,
      setRoomPrice,
      totalNights,
      totalPrice,
      onAddReservation,
      onResetReservation,
      activeStep,
      initialStep,
      onNextStep,
      onBackStep,
      completed,
    ]
  );

  return (
    <ReservationContext.Provider value={memoizedValue}>
      {children}
    </ReservationContext.Provider>
  );
}
