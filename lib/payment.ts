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
  appointmentId?: string; // New flow: use existing appointment
  slotId?: string; // Old flow: create new appointment
  patientId?: string;
  planSlug?: string;
  appointmentMode?: string;
}): Promise<CreateOrderResponse> {
  try {
    console.log("[API] Creating payment order:", {
      appointmentId: data.appointmentId || "none",
      slotId: data.slotId || "none",
    });
    const res = await api.post<CreateOrderResponse>("payment/order", data);
    console.log("[API] Order created:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("[API] Order creation error:", error);
    return {
      success: false,
      error:
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create order",
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
      error:
        error?.response?.data?.error ||
        error?.message ||
        "Payment verification failed",
    };
  }
}
