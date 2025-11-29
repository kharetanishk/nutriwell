import api from "./api";

export interface CreateOrderResponse {
  success: boolean;
  order?: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  };
  appointmentId?: string;
  error?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  alreadyConfirmed?: boolean;
  error?: string;
}

export async function createOrder(data: {
  slotId: string;
  patientId: string;
  planSlug: string;
  appointmentMode: string;
}): Promise<CreateOrderResponse> {
  try {
    const res = await api.post<CreateOrderResponse>("payment/order", data);
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.error || error?.message || "Failed to create order",
    };
  }
}

export async function verifyPayment(data: {
  orderId: string;
  paymentId: string;
  signature: string;
}): Promise<VerifyPaymentResponse> {
  try {
    const res = await api.post<VerifyPaymentResponse>("payment/verify", data);
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.error || error?.message || "Payment verification failed",
    };
  }
}

