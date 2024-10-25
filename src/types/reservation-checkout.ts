import { CustomerReservationSchemaType } from "@/schemas/reservation";

export type ReservationCheckoutContextValue = CustomerReservationSchemaType & {
  canReset: boolean;
  onReset: () => void;
  onUpdate: (updateValue: Partial<CustomerReservationSchemaType>) => void;
  onUpdateField: (
    name: keyof CustomerReservationSchemaType,
    updateValue: CustomerReservationSchemaType[keyof CustomerReservationSchemaType]
  ) => void;
  //
  completed: boolean;
  //
  onDeleteCart: (itemId: string) => void;
  //
  onIncreaseQuantity: (itemId: string) => void;
  onDecreaseQuantity: (itemId: string) => void;
  //
  activeStep: number;
  initialStep: () => void;
  onBackStep: () => void;
  onNextStep: () => void;
  onGotoStep: (step: number) => void;
  //
  onApplyDiscount: (discount: number) => void;
  onApplyShipping: (discount: number) => void;
};
